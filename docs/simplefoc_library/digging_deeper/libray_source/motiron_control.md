---
layout: default
title: Motion Control
parent: Library Source
nav_order: 2
permalink: /motion_control_implementation
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 运动控制实现 [v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

<span class="simple">Simple<span class="foc">FOC</span>library</span>实现3个运动控制循环：

- 利用电压的转矩控制
- 速度运动控制
- 位置/角度控制

运动控制算法是通过设置带有 `ControlType` 结构之一的`motor.controller`变量来选择的：

```cpp
// Motion control type
enum ControlType{
  voltage,// Torque control using voltage
  velocity,// Velocity motion control
  angle// Position/angle motion control
};
```
如下:
```cpp
motor.controller = ControlType::voltage;
// or
motor.controller = ControlType::velocity;
// or
motor.controller = ControlType::angle;
```
这个变量也可以实时更改！


## 实时执行 `move()` 

The real-time motion control is executed inside `move()` function. Move function receives executes one of the control loops based on the `controller` variable. The parameter `new_target` of the `move()` function is the target value so be set to the control loop. the `new_target` value is optional and doesn't need ot be set. If it is not se the motion control will use `motor.target` variable.  

实时运动控制在 `move()`函数中执行。Move函数根据 `controller` 变量接收并执行其中一个控制循环。`move（）`函数的参数`new_target`是目标值，因此必须设置为控制循环。`new_target`值是可选的，不需要设置。如果不是设置，运动控制将使用 `motor.target` 变量。

如下:
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
## Shaft velocity filtering `shaftVelocity`

速度运动控制的第一步是从传感器获取速度值。因为有些传感器噪音很大，尤其是在大多数情况下，速度值是通过推导位置值得出，我们实现了一个低通滤波器速度滤波器来平滑测量。
速度计算函数为`shaftVelocity()`，具体实现如下：

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
低通滤波器为标准一阶低通滤波器，具有一个时间常数`Tf` ，配置有 `motor.LPF_velocity`结构：

```cpp
// Low pass filter structure
struct LPF_s{
  float Tf; // Low pass filter time constant
  long timestamp; // Last execution timestamp
  float prev; // filtered value in previous execution step 
};
```
### 低通速度滤波理论
有关低通滤波器理论的更多信息，请访问 [ theory lovers corner ](low_pass_filter)

## 利用电压的转矩控制

由于大多数低成本万向节电机和驱动器的电流测量通常不可用，因此必须直接使用电压进行扭矩控制。

<a name="foc_image"></a><img src="extras/Images/voltage_loop.png">

该控制回路假设电压与电流成比例，电流与扭矩成比例。这通常是正确的，但并不总是正确的。但从广义上讲，它在小电流应用（万向节电机）中运行良好。
这与我们通常对直流电机所做的假设相同。

控制回路的实现非常简单，基本上将目标电压设置为'voltage_q'变量，以便使用FOC算法`loopFOC()`将其设置为电机。

<blockquote class="warning"><p class="heading">API usage</p> For more info about how to use this loop look into: <a href="voltage_loop"> voltage loop api docs</a></blockquote>

### 基于电压理论的转矩控制
有关这类控制理论的更多信息，请访问 [ theory lovers corner ](voltage_torque_control)

## 速度运动控制

一旦我们有了电流速度值和我们想要达到的目标值，我们需要计算适当的电压值来设置电机，以便遵循目标值。

<img src="extras/Images/velocity_loop.png" >

这是通过在 `velocityPI()` 函数中使用PI控制器来实现的。

```cpp
// velocity control loop PI controller
float BLDCMotor::velocityPI(float tracking_error) {
  return controllerPI(tracking_error, PID_velocity);
}
```
`BLDMotor` 实现了名为`controllerPI()`的通用PI控制器函数。

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
PI控制器配置`motor.PID_velocity`结构：

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

<blockquote class="warning"><p class="heading">API usage</p> For more info about how to use this loop look into: <a href="velocity_loop"> velocity loop api docs</a></blockquote>
### PI控制器理论

有关在该库中实现的hte PI控制器理论的更多信息，请访问[theory lovers corner](pi_controller)

## 位置运动控制

现在，当我们解释了速度控制回路后，我们可以按照图中所示的顺序构建位置控制回路。
<img src="extras/Images/angle_loop.png">

当有想要达到的目标角度时，我们将使用P控制器来计算我们需要的必要速度，然后速度回路将计算必要的电压`votage_q` ，以达到我们需要的速度和角度。

位置P控制器在 `positionP()` 函数中实现：

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
并配置`motor.P_angle`结构：

```cpp
// P controller configuration structure
struct P_s{
  float P; // Proportional gain 
  long timestamp; // Last execution timestamp
  float velocity_limit; // Velocity limit of the controller output
};
```

<blockquote class="warning"><p class="heading">API usage</p> For more info about how to use this loop look into: <a href="angle_loop"> angle loop api docs</a></blockquote>
