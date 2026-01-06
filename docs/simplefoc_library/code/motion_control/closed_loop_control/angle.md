---
layout: default
title: 位置控制环
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /angle_loop
parent: 闭环控制
grand_parent: 运动控制
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 位置控制环
此控制环允许您实时将电机移动到所需角度。通过以下方式启用此模式：
```cpp
// set angle/position motion control loop
motor.controller = MotionControlType::angle;
```
您可以通过运行 motion_control/position_motion_control/ 文件夹中的示例来测试此算法。

## 工作原理

<a href ="javascript:show('b','type');" class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

角度 / 位置控制环围绕速度控制环形成闭环控制。而无论采用哪种扭矩控制方式，速度控制环都围绕扭矩控制形成闭环。如果是未设置相电阻的电压模式，速度运动控制将使用电压 <i>U<sub>q</sub></i> 来设置扭矩指令：

<div class="type type-b">
 <img class="width60" src="extras/Images/angle_loop_v.png">
</div>
<div class="type type-s hide">
<img class="width60" src="extras/Images/angle_loop_stepper_volt.png">
</div>


如果是任何一种电流扭矩控制模式（FOC 或直流电流）或提供了相电阻的电压模式，角度运动控制将为扭矩控制器设置目标电流 <i>i<sub>q</sub></i>：
<div class="type type-b">
<img class="width60" src="extras/Images/angle_loop_i.png">
</div>
<div class="type type-s hide">
<img class="width60" src="extras/Images/angle_loop_stepper_curr.png">
</div>

因此，角度控制环是通过在 [速度控制环](velocity_loop) 上额外添加一个级联的控制环而形成的，如上图所示。该环通过使用额外的 PID 控制器和一个可选的低通滤波器来实现闭环。控制器从电机读取角度 <i>a</i>（可选进行滤波），并确定电机为达到用户设置的期望角度 <i>a<sub>d</sub></i> 应达到的速度 <i>v<sub>d</sub></i>。然后，速度控制器读取电机的当前滤波速度 <i>v<sub>f</sub></i>，并为扭矩控制环设置达到由角度环设定的速度 <i>v<sub>d</sub></i> 所需的扭矩目标（<i>u<sub>q</sub></i> 电压或 <i>i<sub>q</sub></i> 电流）。

## 控制器参数
要调整此控制环，您可以先设置速度 PID 控制器、低通滤波器和限制参数，
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
然后设置角度 PID 控制器、低通滤波器和限制参数：
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
为获得最佳性能，同时参数化速度 PID 和角度 PID 控制器非常重要。
可以通过更新 motor.PID_velocity 结构来参数化速度 PID 控制器，如 [速度控制环](velocity_loop) 中所述。

- 大致规则是降低比例增益 P 以减少振动。
- 您可能无需调整 I 或 D 值。
  
可以通过更改 motor.P_angle 结构来更新角度 PID 控制器。
- 在大多数应用中，简单的 P 控制器就足够了（I=D=0）
- 比例增益 P 会使其响应更迅速，但值过高会导致不稳定和振动。
- output_ramp 值相当于加速度限制 - 默认值接近无穷大，必要时降低它。
  
对于角度控制，您也能看到速度 LPF 滤波器的影响。 
- 从速度控制到角度控制，LPF_velocity.Tf 值不应有太大变化。因此，一旦为速度环调整好，就可以保持不变。
- 在大多数情况下，LPF_angle.Tf 将保持为 0，即禁用状态。

此外，您可以配置控制器的 velocity_limit 值。此值可防止控制器为电机设置过高的速度 <i>v<sub>d</sub></i>。
- 如果将 velocity_limit 设置得很低，您的电机将以恰好此速度在期望位置之间移动。如果设置得较高，您甚至不会注意到这个变量的存在。😃

最后，每个应用都略有不同，您很可能需要稍微调整控制器值以达到期望的行为。

有关此方法的更多理论和源代码文档，请查看 [深入探究部分。](digging_deeper)

## 位置控制示例代码


<a href ="javascript:show('b','type');" class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

这是一个非常基本的位置运动控制程序示例，基于电压扭矩控制，并包含完整配置。运行此代码时，电机将每 1 秒 在 -1 弧度 和 1 弧度 之间移动。

<div class="type type-b" markdown="1">

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

</div>

<div class="type type-s hide" markdown="1">

```cpp
#include <SimpleFOC.h>

// motor instance
StepperMotor motor = StepperMotor(50);
// driver instance
StepperDriver2PWM driver = StepperDriver2PWM(9, 10, 11, 8);

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
</div>


## 项目示例
这里有一个使用位置控制的项目示例，描述了所需的完整硬件 + 软件设置。

<div class="image_icon width30">
    <a href="position_control_example">
        <img src="extras/Images/position_control_example.jpg">
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

在 [示例项目](examples) 部分中找到更多项目。
