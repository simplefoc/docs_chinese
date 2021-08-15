---
layout: default
title: Position Control 
description: "Arduino Simple Field Oriented Control (FOC) library 。"
nav_order: 3
permalink: /angle_loop
parent: Closed-Loop Motion control
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 位置控制回路
这个控制回路可以让你实时调整电机到所需的角度。启用该模式的有:
```cpp
// set angle/position motion control loop
motor.controller = MotionControlType::angle;
```
你可以通过运行 `motion_control/position_motion_control/`文件夹中的示例来测试这个算法。

## 它是如何工作的?

角度/位置控制回路，通过调节速度关闭控制回路。而速度控制回路又通过调节转矩关闭控制回路，不管它是哪个。如果是不设置相阻的电压模式，速度运动控制将使用电压<i>U<sub>q</sub></i>设置转矩命令：

<img src="extras/Images/angle_loop_v.png">

如果它是任何电流转矩控制模式(FOC或直流电流)或电压模式提供的相位电阻，角度运动控制将设置目标电流 <i>i<sub>q</sub></i>到转矩控制器:

<img src="extras/Images/angle_loop_i.png">

因此，角度控制回路是通过在 [velocity control loop](velocity_loop) 上添加一个级联控制回路来创建的，如上图所示。通过使用附加的PID控制器和可选的低通滤波器，闭环。控制器从电机读取角度<i>a</i>(过滤器是可选的)，并决定电机应该移动哪个速度<i>v<sub>d</sub></i>以达到用户设定的所需角度<i>a<sub>d</sub></i> 。然后速度控制器从电机<i>v<sub>f</sub></i> 中读取过滤后的当前速度，并将转矩目标(<i>u<sub>q</sub></i> voltage 或者 <i>i<sub>q</sub></i> current) 设置到转矩控制回路中，以达到角度回路设定的速度 <i>v<sub>d</sub></i>。

## 控制器参数
为了调整这个控制回路，你可以设置参数的第一速度PID控制器，低通滤波器和限制，
``` cpp
// velocity PID controller parameters
// default P=0.5 I = 10 D =0
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;
// jerk control using voltage voltage ramp
// default value is 300 volts per sec  ~ 0.3V per millisecond
motor.PID_velocity.output_ramp = 1000;

// velocity low pass filtering
// default 5ms - try different values to see what is the best. 
// the lower the less filtered
motor.LPF_velocity.Tf = 0.01;

// setting the limits
// either voltage
motor.voltage_limit = 10; // Volts - default driver.voltage_limit
// of current 
motor.current_limit = 2; // Amps - default 0.2Amps
```
然后对角度PID 控制器、低通滤波器和极限:

```cpp
// angle PID controller 
// default P=20
motor.P_angle.P = 20; 
motor.P_angle.I = 0;  // usually only P controller is enough 
motor.P_angle.D = 0;  // usually only P controller is enough 
// acceleration control using output ramp
// this variable is in rad/s^2 and sets the limit of acceleration
motor.P_angle.output_ramp = 10000; // default 1e6 rad/s^2

// angle low pass filtering
// default 0 - disabled  
// use only for very noisy position sensors - try to avoid and keep the values very small
motor.LPF_angle.Tf = 0; // default 0

// setting the limits
//  maximal velocity of the position control
motor.velocity_limit = 4; // rad/s - default 20
```
为了使速度PS
对速度PID控制器进行了参数化 `motor.PID_velocity`结构，例如 [速度控制回路](velocity_loop)。 

- 粗略的规则应该是降低比例增益 `P` ，以获得更少的振动。
- 你可能不需要接触 `I` 或 `D` 值。
  

 角度PID控制器可通过更换电机进行更新 `motor.P_angle`结构。
- (`I=D=0`)在大多数应用中，只需一个简单的 `P` 控制器就足够了(`I=D=0`)
- 比例增益 `P` 将使其响应更灵敏，但过高会使其不稳定并引起振动。
- `output_ramp` 值等于加速度极限-默认值接近无穷大，如果需要降低它。

对于角度控制，你也可以看到速度LPE滤波器的影响。
- 从速度控制到角度控制 `LPF_velocity.Tf` 值变化不大。所以一旦你把它调整到速度环上你就可以让它保持原样了。
- `LPF_angle.Tf` 在大多数情况下仍然等于0，这使它被禁用。

此外，你可以配置控制器的 `velocity_limit` 限制值。此值防止控制器将电机的速度 <i>v<sub>d</sub></i> 设置得过高。

- 如果你让你的 `velocity_limit` 非常低，你的马达就会以这个速度在期望的位置之间移动。
- 如果你保持高值，你甚至不会注意到这个变量的存在。 😃 

最后，每个应用程序都有一点不同，你可能需要对控制器值进行一些调优，以达到所需的行为。

有关此方法的更多理论和源代码文档，请查看 [digging deeper section](digging_deeper)。

## 位置控制示例代码

这是一个非常基础的位置运动控制程序的例子，基于电压转矩控制的完整配置。当运行此代码时，电机将在角度`-1 RAD`和`1 RAD`之间每 `1 sec`移动。

```cpp
#include <SimpleFOC.h>

// motor instance
BLDCMotor motor = BLDCMotor(11);
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

void setup() {
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  driver.init();
  motor.linkDriver(&driver);

  // set motion control loop to be used
  motor.controller = MotionControlType::angle;

  // controller configuration 
  // default parameters in defaults.h

  // controller configuration based on the control type 
  // velocity PID controller parameters
  // default P=0.5 I = 10 D =0
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  motor.PID_velocity.D = 0.001;
  // jerk control using voltage voltage ramp
  // default value is 300 volts per sec  ~ 0.3V per millisecond
  motor.PID_velocity.output_ramp = 1000;

  // velocity low pass filtering
  // default 5ms - try different values to see what is the best. 
  // the lower the less filtered
  motor.LPF_velocity.Tf = 0.01;

  // angle P controller -  default P=20
  motor.P_angle.P = 20;

  //  maximal velocity of the position control
  // default 20
  motor.velocity_limit = 4;
  // default voltage_power_supply
  motor.voltage_limit = 10;

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  
  // initialize motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();


  Serial.println("Motor ready.");
  _delay(1000);
}

// angle set point variable
float target_angle = 1;
// timestamp for changing direction
long timestamp_us = _micros();

void loop() {

  // each one second
  if(_micros() - timestamp_us > 1e6) {
      timestamp_us = _micros();
      // inverse angle
      target_angle = -target_angle;   
  }

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(target_angle);
}
```


## 工程实例
这里是一个项目的例子，它使用位置控制，并描述了full hardware + software setup设置

<div class="image_icon width30">
    <a href="position_control_example">
        <img src="extras/Images/position_control_example.jpg">
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
在[example projects](example_projects) 部分中可以找到更多项目。