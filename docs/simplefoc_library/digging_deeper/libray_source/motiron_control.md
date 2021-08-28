---
layout: default
title: 运动控制
parent: Library Source
nav_order: 2
permalink: /motion_control_implementation
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 运动控制实现 [v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

<span class="simple">Simple<span class="foc">FOC</span>library</span>实现3个运动控制环：

- 基于电压的力矩控制
- 速度运动控制
- 位置/角度控制

运动控制算法是通过设置带有 `ControlType` 结构之一的`motor.controller`变量来选择的：

```cpp
// 运动控制类型
enum ControlType{
  voltage,// 电压转矩控制
  velocity,// 速度运动控制
  angle// 位置/角度运动控制
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

实时运动控制在 `move()`函数中执行。Move函数根据 `controller` 变量接收并执行其中一个控制环。`move()`函数的参数`new_target`是目标值，因此必须设置为控制环。`new_target`值是可选的，不是必须要设置。如果不设置的话，运动控制将默认使用 `motor.target` 变量。

如下:
```cpp
// 迭代函数运行外循环的FOC算法
// 这个功能是由motor.controller的变量决定的
// 它运行的角度，速度或电压回路
// - 需要迭代调用，它是异步函数
// - 如果没有设置目标，则使用 motor.target 的值
void BLDCMotor::move(float new_target = NOT_SET) {
  // 检查目标是否通过参数new_target接收
  // 如果没有，则使用内部目标变量 (motor.target) 
  if( new_target != NOT_SET ) target = new_target;
  // 获得角速度
  shaft_velocity = shaftVelocity();
  // 选择控制回路
  switch (controller) {
    case ControlType::voltage:
      // 设置FCO回路的电压
      voltage_q =  target;
      break;
    case ControlType::angle:
      // 角设定值
      shaft_angle_sp = target;
      // 计算达到目标位置所需的速度
      shaft_velocity_sp = positionP( shaft_angle_sp - shaft_angle );
      // 计算需要由FOC回路设定的电压
      voltage_q = velocityPI(shaft_velocity_sp - shaft_velocity);
      break;
    case ControlType::velocity:
      // 速度设定值
      shaft_velocity_sp = target;
      // 计算需要由FOC回路设定的电压
      voltage_q = velocityPI(shaft_velocity_sp - shaft_velocity);
      break;
  }
}
```
## Shaft velocity filtering `shaftVelocity`

速度运动控制的第一步是从传感器获取速度值。因为有些传感器噪音很大，尤其是在大多数情况下，速度值是通过推导位置值得出，我们实现了一个低通滤波器速度滤波器来平滑测量。
速度计算函数为`shaftVelocity()`，具体实现如下：

```cpp
// 轴速度计算
float BLDCMotor::shaftVelocity() {
  float Ts = (_micros() - LPF_velocity.timestamp) * 1e-6;
  // 快速修复错误的情况 (micros overflow)
  if(Ts <= 0 || Ts > 0.5) Ts = 1e-3; 
  // 计算过滤
  float alpha = LPF_velocity.Tf/(LPF_velocity.Tf + Ts);
  float vel = alpha*LPF_velocity.prev + (1-alpha)*sensor->getVelocity();
  // 保存的变量
  LPF_velocity.prev = vel;
  LPF_velocity.timestamp = _micros();
  return vel;
}
```
低通滤波器为标准一阶低通滤波器，具有一个时间常数`Tf` ，配置有 `motor.LPF_velocity`结构：

```cpp
// 低通滤波器结构
struct LPF_s{
  float Tf; // 低通滤波器时间常数
  long timestamp; // 最新执行时间戳
  float prev; // 在上一个执行步骤中过滤的值
};
```
### 低通速度滤波理论
有关低通滤波器理论的更多信息，请访问 [ theory lovers corner ](low_pass_filter)

## 基于电压的力矩控制

由于大多数低成本云台电机和驱动器的电流测量通常不可用，因此必须直接使用电压进行扭矩控制。

<a name="foc_image"></a><img src="extras/Images/voltage_loop.png">

该控制回路假设电压与电流成比例，电流与扭矩成比例。这通常是正确的，但并不总是正确的。但从广义上讲，它在小电流应用（云台电机）中运行良好。
这与我们通常对直流电机所做的假设相同。

控制回路的实现非常简单，基本上将目标电压设置为`voltage_q`变量，以便使用FOC算法`loopFOC()`将其设置为电机。

<blockquote class="warning"><p class="heading">API使用</p>有关如何使用该控制环的更多信息，请查看<a href="voltage_loop"> voltage loop api docs</a></blockquote>

### 基于电压理论的力矩控制
有关这类控制理论的更多信息，请访问 [ theory lovers corner ](voltage_torque_control)

## 速度运动控制

一旦我们有了电流速度值和我们想要达到的目标值，我们需要计算适当的电压值来设置电机，以便遵循目标值。

<img src="extras/Images/velocity_loop.png" >

这是通过在 `velocityPI()` 函数中使用PI控制器来实现的。

```cpp
// 速度控制回路PI控制器
float BLDCMotor::velocityPI(float tracking_error) {
  return controllerPI(tracking_error, PID_velocity);
}
```
`BLDMotor` 实现了名为`controllerPI()`的通用PI控制器函数。

```cpp
// 比例积分控制器功能
float BLDCMotor::controllerPI(float tracking_error, PI_s& cont){
  float Ts = (_micros() - cont.timestamp) * 1e-6;

  // 快速修复错误的情况 (micros overflow)
  if(Ts <= 0 || Ts > 0.5) Ts = 1e-3; 

  // u(s) = (P + I/s)e(s)
  // PI控制器的Tustin变换 ( a bit optimized )
  // uk = uk_1  + (I*Ts/2 + P)*ek + (I*Ts/2 - P)*ek_1
  float tmp = cont.I*Ts*0.5;
  float voltage = cont.voltage_prev + (tmp + cont.P) * tracking_error + (tmp - cont.P) * cont.tracking_error_prev;

  // 限制输出电压q
  if (abs(voltage) > cont.voltage_limit) voltage = voltage > 0 ? cont.voltage_limit : -cont.voltage_limit;
  // 通过增加电压来限制加速度
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
// PI控制器配置结构
struct PI_s{
  float P; // 成比例增加
  float I; // 积分增益
  float voltage_limit; // 控制器输出的电压限制
  float voltage_ramp;  // 输出值变化的最大速度
  long timestamp;  // 最新执行时间戳
  float voltage_prev;  // 最后控制器输出值
  float tracking_error_prev;  // 跟踪误差值
};
```

<blockquote class="warning"><p class="heading">API usage</p>有关如何使用该控制环的信息，请查看<a href="velocity_loop"> velocity loop api docs</a></blockquote>

### PI控制器理论

有关在该库中实现的hte PI控制器理论的更多信息，请访问[theory lovers corner](pi_controller)

## 位置运动控制

现在，当我们解释了速度控制回路后，我们可以按照图中所示的顺序构建位置控制回路。
<img src="extras/Images/angle_loop.png">

当有想要达到的目标角度时，我们将使用P控制器来计算我们需要的必要速度，然后速度回路将计算必要的电压`votage_q` ，以达到我们需要的速度和角度。

位置P控制器在 `positionP()` 函数中实现：

```cpp
// P控制器用于位置控制回路
float BLDCMotor::positionP(float ek) {
  // 根据位置误差计算目标速度
  float velocity_target = P_angle.P * ek;
  // 约束速度目标值
  if (abs(velocity_target) > velocity_limit) velocity_target = velocity_target > 0 ? velocity_limit : -velocity_limit;
  return velocity_target;
}
```
配置`motor.P_angle`结构：

```cpp
// P控制器配置结构
struct P_s{
  float P; // 成比例增加
  long timestamp; // 最新执行时间戳
  float velocity_limit; // 控制器输出的速度限制
};
```

<blockquote class="warning"><p class="heading">API使用</p>有关如何使用该控制环的更多信息，请查看<a href="angle_loop"> angle loop api docs</a></blockquote>