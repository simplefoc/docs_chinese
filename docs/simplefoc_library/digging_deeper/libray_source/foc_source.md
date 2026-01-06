---
layout: default
title: FOC 算法
parent: 库源
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
nav_order: 1
permalink: /foc_implementation
toc: true
---



#  FOC算法实现 [v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

由于<span class="simple">Simple<span class="foc">FOC</span>library</span>旨在用于FOC算法的教学以及支持各种应用，因此该库中实现了两种（实际上是两种半）FOC调制版本。在这里，我想向您解释该库中FOC实现的大部分细节，以便您更好地了解其内部工作原理，以及如何对其进行修改和调整以适应您的应用。

FOC算法有三个主要组成部分：
- 相电压计算算法（调制）：`setPhaseVoltage()`
- 电机和传感器校准：`initFOC()`
- 实时执行：`loopFOC()`

现在让我们讨论所有这三个组件的实现细节！


## ❤️ FOC核心函数：设置相电压 `setPhaseVoltage()`

<span class="simple">Simple<span class="foc">FOC</span>library</span>实现了两种类型的FOC PWM调制。
所实现的调制算法有：
 - 正弦PWM：`SinePWM`
 - 空间矢量PWM：`SpaceVectorPWM`

您可以通过设置`motor.foc_modulation`变量的值来配置它们：

```cpp
motor.foc_modulation = FOCModulationType::SinePWM; // default
// or
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```

<blockquote class="info"> <p class="heading">注意：</p>有关FOC算法理论的更多信息，请访问<a href="foc_theory">FOC理论角</a>。</blockquote>

这两种调制类型和相电压计算在`setPhaseVoltage()`函数中完全实现。
```cpp
void BLDCMotor::setPhaseVoltage(float Uq, float angle_el) {
  switch (foc_modulation)
  {
    case FOCModulationType::SinePWM :
      // Sinusoidal PWM modulation 
      // Inverse Park + Clarke transformation

      // angle normalization in between 0 and 2pi
      // only necessary if using _sin and _cos - approximation functions
      angle_el = normalizeAngle(angle_el + zero_electric_angle);
      // Inverse park transform
      Ualpha =  -_sin(angle_el) * Uq;  // -sin(angle) * Uq;
      Ubeta =  _cos(angle_el) * Uq;    //  cos(angle) * Uq;

      // Clarke transform
      Ua = Ualpha + voltage_power_supply/2;
      Ub = -0.5 * Ualpha  + _SQRT3_2 * Ubeta + voltage_power_supply/2;
      Uc = -0.5 * Ualpha - _SQRT3_2 * Ubeta + voltage_power_supply/2;
      break;

    case FOCModulationType::SpaceVectorPWM :
      // Nice video explaining the SpaceVectorModulation (SVPWM) algorithm 
      // https://www.youtube.com/watch?v=QMSWUMEAejg

      // if negative voltages change inverse the phase 
      // angle + 180degrees
      if(Uq < 0) angle_el += _PI;
      Uq = abs(Uq);

      // angle normalisation in between 0 and 2pi
      // only necessary if using _sin and _cos - approximation functions
      angle_el = normalizeAngle(angle_el + zero_electric_angle + _PI_2);

      // find the sector we are in currently
      int sector = floor(angle_el / _PI_3) + 1;
      // calculate the duty cycles
      float T1 = _SQRT3*_sin(sector*_PI_3 - angle_el) * Uq/voltage_power_supply;
      float T2 = _SQRT3*_sin(angle_el - (sector-1.0)*_PI_3) * Uq/voltage_power_supply;
      // two versions possible 
      // centered around voltage_power_supply/2
      float T0 = 1 - T1 - T2;
      // pulled to 0 - better for low power supply voltage
      //float T0 = 0;

      // calculate the duty cycles(times)
      float Ta,Tb,Tc; 
      switch(sector){
        case 1:
          Ta = T1 + T2 + T0/2;
          Tb = T2 + T0/2;
          Tc = T0/2;
          break;
        case 2:
          Ta = T1 +  T0/2;
          Tb = T1 + T2 + T0/2;
          Tc = T0/2;
          break;
        case 3:
          Ta = T0/2;
          Tb = T1 + T2 + T0/2;
          Tc = T2 + T0/2;
          break;
        case 4:
          Ta = T0/2;
          Tb = T1+ T0/2;
          Tc = T1 + T2 + T0/2;
          break;
        case 5:
          Ta = T2 + T0/2;
          Tb = T0/2;
          Tc = T1 + T2 + T0/2;
          break;
        case 6:
          Ta = T1 + T2 + T0/2;
          Tb = T0/2;
          Tc = T1 + T0/2;
          break;
        default:
         // possible error state
          Ta = 0;
          Tb = 0;
          Tc = 0;
      }

      // calculate the phase voltages and center
      Ua = Ta*voltage_power_supply;
      Ub = Tb*voltage_power_supply;
      Uc = Tc*voltage_power_supply;
      break;
  }
  
  // set the voltages in hardware
  setPwm(Ua, Ub, Uc);
}
```


## 电机和传感器校准 `initFOC()`

为了能够在定子和转子之间产生精确的`90度`磁场，我们不仅需要知道传感器的确切绝对位置，还需要知道该（传感器）位置对电机电角度的意义。因此，在使用FOC算法设置相电压之前，我们需要将电机电角度0与传感器角度0对齐。

该过程在下图中进行了解释。

<img src="extras/Images/align_diagram.png" class="width40">

所有这些都在我们调用`initFOC()`函数时发生。
```cpp
// Function initializing FOC algorithm
// and aligning sensor's and motors' zero position 
// - If zero_electric_offset parameter is set the alignment procedure is skipped
//
// - zero_electric_offset  - value of the sensors absolute position electrical offset in respect to motor's electrical 0 position.
// - sensor_direction      - sensor natural direction - default is CW
//  
int  BLDCMotor::initFOC( float zero_electric_offset = NOT_SET , Direction sensor_direction = Direction::CW) {
  int exit_flag = 1;
  // align motor if necessary
  // alignment necessary for encoders!
  if(zero_electric_offset != NOT_SET){
    // absolute zero offset provided - no need to align
    zero_electric_angle = zero_electric_offset;
    // set the sensor direction - default CW
    sensor->natural_direction = sensor_direction;
  }else{
    // sensor and motor alignment
    _delay(500);
    exit_flag = alignSensor();
    _delay(500);
    }
  if(monitor_port) monitor_port->println("MOT: Motor ready.");

  return exit_flag;
}
```

电机和传感器角度的初始校准在`alignSensor()`函数中实现：
```cpp
// Encoder alignment to electrical 0 angle
int BLDCMotor::alignSensor() {
  if(monitor_port) monitor_port->println("MOT: Align sensor.");
  
  // align the electrical phases of the motor and sensor
  float start_angle = shaftAngle();
  for (int i = 0; i <=5; i++ ) {
    float angle = _3PI_2 + _2PI * i / 6.0;
    setPhaseVoltage(voltage_sensor_align,  angle);
    _delay(200);
  }
  float mid_angle = shaftAngle();
  for (int i = 5; i >=0; i-- ) {
    float angle = _3PI_2 + _2PI * i / 6.0;
    setPhaseVoltage(voltage_sensor_align,  angle);
    _delay(200);
  }
  if (mid_angle < start_angle) {
    if(monitor_port) monitor_port->println("MOT: natural_direction==CCW");
    sensor->natural_direction = Direction::CCW;
  } else if (mid_angle == start_angle) {
    if(monitor_port) monitor_port->println("MOT: Sensor failed to notice movement");
  }

  // set angle -90 degrees 
  // let the motor stabilize for 2 sec
  _delay(2000);
  // set sensor to zero
  sensor->initRelativeZero();
  _delay(500);
  setPhaseVoltage(0,0);
  _delay(200);

  // find the index if available
  int exit_flag = absoluteZeroAlign();
  _delay(500);
  if(monitor_port){
    if(exit_flag< 0 ) monitor_port->println("MOT: Error: Not found!");
    if(exit_flag> 0 ) monitor_port->println("MOT: Success!");
    else  monitor_port->println("MOT: Not available!");
  }
  return exit_flag;
}
```

而绝对角度校准在`absoluteZeroAlign()`函数中实现。
```cpp
// Encoder alignment the absolute zero angle 
// - to the index
int BLDCMotor::absoluteZeroAlign() {
  
  if(monitor_port) monitor_port->println("MOT: Absolute zero align.");
    // if no absolute zero return
  if(!sensor->hasAbsoluteZero()) return 0;
  

  if(monitor_port && sensor->needsAbsoluteZeroSearch()) monitor_port->println("MOT: Searching...");
  // search the absolute zero with small velocity
  while(sensor->needsAbsoluteZeroSearch() && shaft_angle < _2PI){
    loopFOC();   
    voltage_q = velocityPID(velocity_index_search - shaftVelocity());
  }
  voltage_q = 0;
  // disable motor
  setPhaseVoltage(0,0);

  // align absolute zero if it has been found
  if(!sensor->needsAbsoluteZeroSearch()){
    // align the sensor with the absolute zero
    float zero_offset = sensor->initAbsoluteZero();
    // remember zero electric angle
    zero_electric_angle = normalizeAngle(electricAngle(zero_offset));
  }
  // return bool if zero found
  return !sensor->needsAbsoluteZeroSearch() ? 1 : -1;
}
```


## 实时执行 `loopFOC()`

最后，剩下要做的就是运行实时FOC程序。代码需要获取电机位置（来自传感器），从中计算电角度（`electricAngle()`），并通过使用`setPhaseVoltage()`函数将所需电压（`motor.voltage_q`）设置到电机相上。


<a name="foc_image"></a><img src="extras/Images/voltage_loop.png">


这就是代码中的实现方式！

```cpp
// Function running FOC algorithm in real-time
// it calculates the gets motor angle and sets the appropriate voltages 
// to the phase pwm signals
// - the faster you can run it the better Arduino UNO ~1ms, Bluepill ~ 100us
void BLDCMotor::loopFOC() {
  // shaft angle 
  shaft_angle = shaftAngle();
  // set the phase voltage - FOC heart function :) 
  setPhaseVoltage(voltage_q, electricAngle(shaft_angle));
}
```
