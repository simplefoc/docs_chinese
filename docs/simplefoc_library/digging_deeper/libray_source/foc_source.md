---
layout: default
title: FOC 算法
parent: Library Source
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
nav_order: 1
permalink: /foc_implementation
---


# FOC算法的实现  [v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

由于<span class="simple">Simple<span class="foc">FOC</span>library</span>旨在教育FOC算法以及启用各种应用程序，因此该库中实现了两个（半）版本的FOC调制。在这里，我将向你解释关于这个库中FOC实现的大部分实现细节，以便你能够更好地了解引擎盖下的内容以及如何更改它并适应你的应用程序。

FOC算法有三个主要部分:
- 相电压计算算法（调制）:  `setPhaseVoltage()`
- 电机和传感器校准: `initFOC()`
- 实时执行: `loopFOC()`

现在，让我们讨论所有三个组件的实现细节！


## ❤️ FOC心脏功能：设置相电压 `setPhaseVoltage()`

<span class="simple">Simple<span class="foc">FOC</span>library</span> 实现两种类型的FOC PWM调制。
实现的调制算法如下：

 - 正弦脉宽调制: `SinePWM`
 - 电压空间矢量: `SpaceVectorPWM`

你可以通过设置 `motor.foc_modulation`变量的值来配置它们:
```cpp
motor.foc_modulation = FOCModulationType::SinePWM; // 默认
// or
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```

<blockquote class="info"> <p class="heading">注意：</p>更多FOC算法的理论知识，请访问<a href="foc_theory"> foc theory corner</a>. </blockquote>

两种调制类型和相电压计算在`setPhaseVoltage()` 函数中完全实现。下面是例子。

```cpp
void BLDCMotor::setPhaseVoltage(float Uq, float angle_el) {
  switch (foc_modulation)
  {
    case FOCModulationType::SinePWM :
      // 正弦PWM调制
      // 逆派克+克拉克变换

      // 在0到360°之间的角度归一化
      // 只有在使用 _sin和 _cos 近似函数时才需要
      angle_el = normalizeAngle(angle_el + zero_electric_angle);
      // 逆派克变换
      Ualpha =  -_sin(angle_el) * Uq;  // -sin(angle) * Uq;
      Ubeta =  _cos(angle_el) * Uq;    //  cos(angle) * Uq;

      // 克拉克变换
      Ua = Ualpha + voltage_power_supply/2;
      Ub = -0.5 * Ualpha  + _SQRT3_2 * Ubeta + voltage_power_supply/2;
      Uc = -0.5 * Ualpha - _SQRT3_2 * Ubeta + voltage_power_supply/2;
      break;

    case FOCModulationType::SpaceVectorPWM :
      // 解释空间矢量调制(SVPWM)算法视频
      // https://www.youtube.com/watch?v=QMSWUMEAejg

      // 如果负电压的变化与相位相反
      // 角度+180度
      if(Uq < 0) angle_el += _PI;
      Uq = abs(Uq);

      // 在0到360°之间的角度归一化
      // 只有在使用 _sin和 _cos 近似函数时才需要
      angle_el = normalizeAngle(angle_el + zero_electric_angle + _PI_2);

      // 找到我们目前所处的象限
      int sector = floor(angle_el / _PI_3) + 1;
      // 计算占空比
      float T1 = _SQRT3*_sin(sector*_PI_3 - angle_el) * Uq/voltage_power_supply;
      float T2 = _SQRT3*_sin(angle_el - (sector-1.0)*_PI_3) * Uq/voltage_power_supply;
      // 两个版本
      // 以电压电源为中心/2
      float T0 = 1 - T1 - T2;
      // 低电源电压，拉到0
      //float T0 = 0;

      // 计算占空比（时间）
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
         // 可能的错误状态
          Ta = 0;
          Tb = 0;
          Tc = 0;
      }

      // 计算相电压和中心
      Ua = Ta*voltage_power_supply;
      Ub = Tb*voltage_power_supply;
      Uc = Tc*voltage_power_supply;
      break;
  }
  
  // 设置硬件中的电压
  setPwm(Ua, Ub, Uc);
}
```



## 电机和传感器校准 `initFOC()`

为了能够在定子和转子之间产生准确的 `90 degree` 磁场，我们不仅需要知道传感器的准确绝对位置，还需要知道（传感器）位置对电机电气角度的意义。因此，在使用FOC算法设置相电压之前，我们需要将电机电气角度0与传感器角度0对齐。

下图说明了该过程.

<img src="extras/Images/align_diagram.png" class="width40">

当我们调用`initFOC（）`函数时，程序运行如下：

```cpp
// 函数初始化FOC算法
// 并对准传感器和电机的零位置
// - 如果设置了zero_electric_offset参数，则会跳过校准过程
//
// - 传感器绝对位置的电偏移值相对于电机的初始0位置的电偏移值为零。
// - 传感器方向-传感器自然方向-默认为CW
//  
int  BLDCMotor::initFOC( float zero_electric_offset = NOT_SET , Direction sensor_direction = Direction::CW) {
  int exit_flag = 1;
  // 如果需要，轻型发动机
  // 编码器的分配要求！
  if(zero_electric_offset != NOT_SET){
    // 提供绝对零度偏移量，不需要校准
    zero_electric_angle = zero_electric_offset;
    // 设置传感器的方向-默认值为CW
    sensor->natural_direction = sensor_direction;
  }else{
    // 传感器和电机校准
    _delay(500);
    exit_flag = alignSensor();
    _delay(500);
    }
  if(monitor_port) monitor_port->println("MOT: Motor ready.");

  return exit_flag;
}
```

电机和传感器的初始角度校准在`alignSensor()` 函数中实现：

```cpp
// 编码器校准电气0角度
int BLDCMotor::alignSensor() {
  if(monitor_port) monitor_port->println("MOT: Align sensor.");
  
  // 校准电机和传感器的电气相位
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

  // 设定角度-90度
  // 让电机稳定2秒
  _delay(2000);
  // 将传感器设置为零
  sensor->initRelativeZero();
  _delay(500);
  setPhaseVoltage(0,0);
  _delay(200);

  // 检索引脚是否可用
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

而绝对角度对齐是在函数`absoluteZeroAlign()`中实现的。

```cpp
// 编码器校准绝对零度角
// -到引脚
int BLDCMotor::absoluteZeroAlign() {
  
  if(monitor_port) monitor_port->println("MOT: Absolute zero align.");
    // 如果没有绝对零度返回
  if(!sensor->hasAbsoluteZero()) return 0;
  

  if(monitor_port && sensor->needsAbsoluteZeroSearch()) monitor_port->println("MOT: Searching...");
  // 以较慢的速度搜索绝对零值
  while(sensor->needsAbsoluteZeroSearch() && shaft_angle < _2PI){
    loopFOC();   
    voltage_q = velocityPID(velocity_index_search - shaftVelocity());
  }
  voltage_q = 0;
  // 禁用电机
  setPhaseVoltage(0,0);

  // 如果已找到绝对零度，则校准
  if(!sensor->needsAbsoluteZeroSearch()){
    // 校准：传感器、绝对零度
    float zero_offset = sensor->initAbsoluteZero();
    // 记录零电角
    zero_electric_angle = normalizeAngle(electricAngle(zero_offset));
  }
  // 如果找到零，则返回bool
  return !sensor->needsAbsoluteZeroSearch() ? 1 : -1;
}
```


## 实时执行 `loopFOC()`
最后，唯一要做的就是运行实时FOC例程。代码需要获取电机位置（形式传感器），从中计算电气角度（`electricAngle()`），并使用`setPhaseVoltage()`函数设置电机相位的所需电压（`motor.voltage_q`）。


 <a name="foc_image"></a><img src="extras/Images/voltage_loop.png">


下面就是它在代码中形式。

```cpp
// 函数实时运行FOC算法
// 它计算得到的电机的角度，并设置适当的电压
// 到相位pwm信号
// - 运行的越快越好 Arduino UNO ~1ms, Bluepill ~ 100us
void BLDCMotor::loopFOC() {
  // 轴角 
  shaft_angle = shaftAngle();
  // 设置相位电压-FOC心脏功能 :) 
  setPhaseVoltage(voltage_q, electricAngle(shaft_angle));
}
```
