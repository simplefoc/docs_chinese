---
layout: default
title: 运动控制
parent: 库源
nav_order: 2
permalink: /motion_control_implementation
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 运动控制实现 [v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

<span class="simple">Simple<span class="foc">FOC</span>库</span> 实现了 3 种运动控制环路：

- 使用电压的扭矩控制
- 速度运动控制
- 位置/角度控制

通过将 `motor.controller` 变量设置为 `ControlType` 结构中的一种来选择运动控制算法：

```cpp
// Motion control type
enum ControlType{
  voltage,// Torque control using voltage
  velocity,// Velocity motion control
  angle// Position/angle motion control
};
```
设置方式如下：
```cpp
motor.controller = ControlType::voltage;
// or
motor.controller = ControlType::velocity;
// or
motor.controller = ControlType::angle;
```
该变量也可以实时更改！


## 实时执行 `move()`

实时运动控制在 `move()` 函数内部执行。移动函数根据 `controller` 变量执行其中一个控制环路。`move()` 函数的参数 `new_target` 是要设置到控制环路的目标值。`new_target` 值是可选的，不需要设置。如果未设置，运动控制将使用 `motor.target` 变量。

以下是实现代码：
```cpp
// Iterative function running outer loop of the FOC algorithm
// Behavior of this function is determined by the motor.controller variable
// It runs either angle, velocity or voltage loop
// - needs to be called iteratively it is asynchronous function
// - if target is not set it uses motor.target value
void BLDCMotor::move(float new_target = NOT_SET) {
  // check if target received through the parameter new_target
  // if not use the internal target variable (motor.target) 
  if( new_target != NOT_SET ) target = new_target;
  // get angular velocity
  shaft_velocity = shaftVelocity();
  // choose control loop
  switch (controller) {
    case ControlType::voltage:
      // set the target voltage for FCO loop
      voltage_q =  target;
      break;
    case ControlType::angle:
      // angle set point
      shaft_angle_sp = target;
      // calculate the necessary velocity to achieve target position
      shaft_velocity_sp = positionP( shaft_angle_sp - shaft_angle );
      // calculate necessary voltage to be set by FOC loop
      voltage_q = velocityPI(shaft_velocity_sp - shaft_velocity);
      break;
    case ControlType::velocity:
      // velocity set point
      shaft_velocity_sp = target;
      // calculate necessary voltage to be set by FOC loop
      voltage_q = velocityPI(shaft_velocity_sp - shaft_velocity);
      break;
  }
}
```
## 轴速度滤波 `shaftVelocity`

速度运动控制的第一步是从传感器获取速度值。由于某些传感器噪声很大，特别是在大多数情况下速度值是通过对位置值求导来计算的，因此我们实现了一个低通滤波器来平滑测量值。
速度计算函数是 `shaftVelocity()`。
```cpp
// shaft velocity calculation
float BLDCMotor::shaftVelocity() {
  float Ts = (_micros() - LPF_velocity.timestamp) * 1e-6;
  // quick fix for strange cases (micros overflow)
  if(Ts <= 0 || Ts > 0.5) Ts = 1e-3; 
  // calculate the filtering 
  float alpha = LPF_velocity.Tf/(LPF_velocity.Tf + Ts);
  float vel = alpha*LPF_velocity.prev + (1-alpha)*sensor->getVelocity();
  // save the variables
  LPF_velocity.prev = vel;
  LPF_velocity.timestamp = _micros();
  return vel;
}
```
低通滤波器是标准的一阶低通滤波器，具有一个时间常数 `Tf`，可通过 `motor.LPF_velocity` 结构进行配置：
```cpp
// Low pass filter structure
struct LPF_s{
  float Tf; // Low pass filter time constant
  long timestamp; // Last execution timestamp
  float prev; // filtered value in previous execution step 
};
```
### 低通速度滤波器原理
有关低通滤波器的更多理论信息，请访问 [理论爱好者角落](low_pass_filter)

## 使用电压的扭矩控制

由于对于大多数低成本云台电机和驱动器，通常无法进行电流测量，因此必须直接使用电压进行扭矩控制。

<a name="foc_image"></a><img src="extras/Images/voltage_loop.png">

该控制环路假设电压与电流成正比，而电流又与扭矩成正比。一般来说这是正确的，但并非总是如此。但在广义上，它在低电流应用（云台电机）中工作得很好。

这与我们通常对直流电机所做的假设相同。

控制环路的实现很简单，基本上是将目标电压设置到 `voltage_q` 变量，以便使用 FOC 算法 `loopFOC()` 设置到电机。

<blockquote class="warning"><p class="heading">API 用法</p> 有关如何使用此环路的更多信息，请参阅：<a href="voltage_loop">电压环 API 文档</a></blockquote>


### 使用电压的扭矩控制理论
有关这种控制类型的更多理论信息，请访问 [理论爱好者角落](voltage_torque_control)

## 速度运动控制

一旦我们获得了当前速度值和我们想要达到的目标值，我们需要计算要设置到电机的适当电压值，以跟随目标值。

<img src="extras/Images/velocity_loop.png" >


这是通过在 `velocityPI()` 函数中使用 PI 控制器来完成的。

```cpp
// velocity control loop PI controller
float BLDCMotor::velocityPI(float tracking_error) {
  return controllerPI(tracking_error, PID_velocity);
}
```
`BLDCMotor` 类实现了名为 `controllerPI()` 的通用 PI 控制器函数。
```cpp
// PI controller function
float BLDCMotor::controllerPI(float tracking_error, PI_s& cont){
  float Ts = (_micros() - cont.timestamp) * 1e-6;

  // quick fix for strange cases (micros overflow)
  if(Ts <= 0 || Ts > 0.5) Ts = 1e-3; 

  // u(s) = (P + I/s)e(s)
  // Tustin transform of the PI controller ( a bit optimized )
  // uk = uk_1  + (I*Ts/2 + P)*ek + (I*Ts/2 - P)*ek_1
  float tmp = cont.I*Ts*0.5;
  float voltage = cont.voltage_prev + (tmp + cont.P) * tracking_error + (tmp - cont.P) * cont.tracking_error_prev;

  // antiwindup - limit the output voltage_q
  if (abs(voltage) > cont.voltage_limit) voltage = voltage > 0 ? cont.voltage_limit : -cont.voltage_limit;
  // limit the acceleration by ramping the the voltage
  float d_voltage = voltage - cont.voltage_prev;
  if (abs(d_voltage)/Ts > cont.voltage_ramp) voltage = d_voltage > 0 ? cont.voltage_prev + cont.voltage_ramp*Ts : cont.voltage_prev - cont.voltage_ramp*Ts;


  cont.voltage_prev = voltage;
  cont.tracking_error_prev = tracking_error;
  cont.timestamp = _micros();
  return voltage;
}
```
PI 控制器通过 `motor.PID_velocity` 结构进行配置：
```cpp
// PI controller configuration structure
struct PI_s{
  float P; // Proportional gain 
  float I; // Integral gain 
  float voltage_limit; // Voltage limit of the controller output
  float voltage_ramp;  // Maximum speed of change of the output value 
  long timestamp;  // Last execution timestamp
  float voltage_prev;  // last controller output value 
  float tracking_error_prev;  // last tracking error value
};
```

<blockquote class="warning"><p class="heading">API 用法</p> 有关如何使用此环路的更多信息，请参阅：<a href="velocity_loop">速度环 API 文档</a></blockquote>

### PI 控制器理论

有关此库中实现的 PI 控制器的更多理论信息，请访问 [理论爱好者角落](pi_controller)

## 位置运动控制

现在，当我们解释了速度控制环路后，我们可以如图片所示级联构建我们的位置控制环路。

<img src="extras/Images/angle_loop.png">

当我们有想要达到的目标角度时，我们将使用 P 控制器来计算我们需要的必要速度，然后速度环路将计算必要的电压 `voltage_q` 以达到我们想要的速度和角度。

位置 P 控制器在 `positionP()` 函数中实现：

```cpp
// P controller for position control loop
float BLDCMotor::positionP(float ek) {
  // calculate the target velocity from the position error
  float velocity_target = P_angle.P * ek;
  // constrain velocity target value
  if (abs(velocity_target) > velocity_limit) velocity_target = velocity_target > 0 ? velocity_limit : -velocity_limit;
  return velocity_target;
}
```
它通过 `motor.P_angle` 结构进行配置：
```cpp
// P controller configuration structure
struct P_s{
  float P; // Proportional gain 
  long timestamp; // Last execution timestamp
  float velocity_limit; // Velocity limit of the controller output
};
```

<blockquote class="warning"><p class="heading">API 用法</p> 有关如何使用此环路的更多信息，请参阅：<a href="angle_loop">角度环 API 文档</a></blockquote>
