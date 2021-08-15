---
layout: default
title: PID controller theory
parent: Theory corner
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /pi_controller
---


# PID控制器的理论 [v2.1](https://github.com/simplefoc/Arduino-FOC/releases)
该库实现的PID控制器传递函数为：

$$
G_PID=\frac{v(s)}{e(S)}=P+\frac{I}{s}+D_s
$$


连续PID离散化，可以描述为三个分量的和：

$$
u(k)=u_P(k)+u_I(k)+u_D(k)
$$


比例环：
$$
u_P(k)=P_e(k)
$$


积分环：
$$
u_I(k)=u_I(k-1)+I\frac{e(k)+e(k-1)}{2}T_s
$$


微分环： 
$$
u_D(k)=D\frac{e(k)-e(k-1)}{T_s}
$$


其中 <i>u(k)</i> 为k时刻的控制信号(本例中为电压<i>U<sub>q</sub></i>) ，e(k),e(k-1)为当前时刻k和前一时刻k-1的跟踪误差，跟踪误差是指目标速度值 <i>v<sub>d</sub></i>与实测速度 <i>v</i>之间的差异。
$$
e(k)=v_d(k)-v_f(k)
$$



## 实现细节
PID算法在 `PIDController` 中的<span>Simple<span>FOC</span></span>library中实现。通过指定参数实例化类：

```cpp
PIDController(float P, float I, float D, float ramp, float limit);
```
该类只有一个函数：
```cpp
// PID controller function
float PIDController::operator() (float error){
    // calculate the time from the last call
    unsigned long timestamp_now = _micros();
    float Ts = (timestamp_now - timestamp_prev) * 1e-6;
    // quick fix for strange cases (micros overflow)
    if(Ts <= 0 || Ts > 0.5) Ts = 1e-3; 

    // u(s) = (P + I/s + Ds)e(s)
    // Discrete implementations
    // proportional part 
    // u_p  = P *e(k)
    float proportional = P * error;
    // Tustin transform of the integral part
    // u_ik = u_ik_1  + I*Ts/2*(ek + ek_1)
    float integral = integral_prev + I*Ts*0.5*(error + error_prev);
    // antiwindup - limit the output voltage_q
    integral = _constrain(integral, -limit, limit);
    // Discrete derivation
    // u_dk = D(ek - ek_1)/Ts
    float derivative = D*(error - error_prev)/Ts;

    // sum all the components
    float output = proportional + integral + derivative;
    // antiwindup - limit the output variable
    output = _constrain(output, -limit, limit);

    // limit the acceleration by ramping the output
    float output_rate = (output - output_prev)/Ts;
    if (output_rate > output_ramp)
        output = output_prev + output_ramp*Ts;
    else if (output_rate < -output_ramp)
        output = output_prev - output_ramp*Ts;

    // saving for the next pass
    integral_prev = integral;
    output_prev = output;
    error_prev = error;
    timestamp_prev = timestamp_now;
    return output;
}
```
因此，你可以很容易地将PID集成到你的代码中，只需调用：

```cpp
void setup(){
  ...
  PIDController some_pid = PIDController{.....};
  ...
}
void loop(){
  float control = some_pid(target-measurement);
} 
```

这个PID是在`BLDCMotor`和 `StepperMotor`中实现的，用于处理运动控制速度(`motor.PID_velocity`)和位置 (`motor.P_angle`)。你可以通过更改这些PID控制器的公共变量来更改它们的参数

```cpp
// PID controller configuration structure
class PIDController
{
  .....
  float P; //!< Proportional gain 
  float I; //!< Integral gain 
  float D; //!< Derivative gain 
  ....
};
```
例如：
```cpp
motor.PID_velocity.P = 1;
motor.P_angle.P = 10;
```