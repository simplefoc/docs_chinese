---
layout: default
title: Velocity Control
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /velocity_loop
nav_order: 2
parent: Closed-Loop Motion control
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 速度控制回路
这个控制回路允许你以所需的速度旋转电机。启用该模式的有:
```cpp
// set velocity motion control loop
motor.controller = MotionControlType::velocity;
```
 `motion_control/velocity_motion_control/` 文件夹中的示例可以测试此算法


## 它是如何工作的
速度控制围绕扭矩控制关闭控制回路，无论它是哪一个。如果是不设置相阻的电压模式，速度运动控制将使用电压 <i>U<sub>q</sub></i>:设置转矩命令：

<img src="extras/Images/velocity_loop_v.png" >

如果它是任何电流转矩控制模式(FOC或DC电流)或电压模式提供的相阻，速度运动控制将设置目标电流 <i>i<sub>q</sub></i>：

<img src="extras/Images/velocity_loop_i.png" >

通过在 [torque control loop](voltage_loop)中加入PID速度控制器来实现速度控制。PID控制器读取电机速度<i>v</i>，将其过滤到 <i>v<sub>f</sub></i> ，并将转矩目标(<i>u<sub>q</sub></i> voltage 或者 <i>i<sub>q</sub></i> current)设置到转矩控制回路，使其达到并保持用户设定的目标速度 <i>v<sub>d</sub></i>。

## 控制器参数
为了调整这个控制回路，你可以设置角度PID控制器和速度测量低通滤波器的参数。
``` cpp
// controller configuration based on the control type 
// velocity PID controller parameters
// default P=0.5 I = 10 D = 0
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
 PID控制器的参数为比例增益 `P`、积分增益 `I`、微分增益 `D` 和 `output_ramp`。

- 通常，通过提高比例增益 `P` ，你的电机控制器将产生更多无功，但太多将使它不稳定，设置为 `0`将禁用控制器的比例部分。
- 同样地，积分增益 `I` 越高，电机对干扰的反应就越快，但过大的值会使它不稳定。设置为 `0` 将禁用控制器的组成部分。
- 控制器`D`的导数部分通常是最难设置的，因此建议将其设置为 `0` ，并首先调整 `P` 和 `I` 。一旦它们被调好，如果你有一个超调你添加一点 `D` 分量来抵消它。
- `output_ramp` 它旨在减少发送给电机的电压值的最大变化。值越高，Pl控制器更改Ua值的速度就越快。值越低，可能的变化就越小，控制器的响应就越慢。这个参数的值设置为 `Volts per second[V/s` 或者换句话说控制器在一个时间单位可以提高多少伏特的电压。如果你设置你的 `voltage_ramp` 值为10 V/s，平均你的控制循环将运行每 `1ms`。你的控制器将能够改变 <i>U<sub>q</sub></i> 的值每次`10[V/s]*0.001[s] = 0.01V` ，这不是很多。

此外，为了平滑速度测量，Simple FOC library 实现了速度低通滤波器的作用。[Low pass filters](https://en.wikipedia.org/wiki/Low-pass_filter) 是信号平滑的标准形式，它只有一个参数-滤波时间常数 `Tf`。
- 当值越低，过滤器的影响越小。如果你把 `Tf` 换成 `0` 你基本上完全去掉了过滤器。具体实现的确切`Tf`值很难预先猜测，但Tf值的范围一般在 `0` 到 `0.5` 秒之间。

如果出于某种原因，你希望限制可以发送到你的电机的电压，则需要使用 `voltage_limit` 。

为了获得最佳性能，我们将对参数进行一些调整。 😁

有关此方法的更多理论和源代码文档，请查看 [digging deeper section](digging_deeper).

## 速度运动控制实例

这里是一个基本的例子，速度运动控制与电压模式转矩控制与完整的配置。该计划将设定目标速度为`2 RAD/s` 并保持它(抵抗干扰)。

```cpp
#include <SimpleFOC.h>

// motor instance
BLDCMotor motor = BLDCMotor( pole_pairs , phase_resistance );
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(pwmA, pwmB, pwmC, enable);

// Magnetic sensor instance
MagneticSensorSPI AS5x4x = MagneticSensorSPI(chip_select, 14, 0x3FFF);

void setup() {
 
  // initialize magnetic sensor hardware
  AS5x4x.init();
  // link the motor to the sensor
  motor.linkSensor(&AS5x4x);

  // driver config
  driver.init();
  motor.linkDriver(&driver);

  // set motion control loop to be used
  motor.controller = MotionControlType::velocity;

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

  // since the phase resistance is provided we set the current limit not voltage
  // default 0.2
  motor.current_limit = 1; // Amps

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  Serial.println("Motor ready.");
  _delay(1000);
}

// velocity set point variable
float target_velocity = 2; // 2Rad/s ~ 20rpm

void loop() {
  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(target_velocity);
}
```

## 工程实例
这里是一个项目的例子，它使用位置控制，并描述了full hardware + software setup设置


<div class="image_icon width30">
    <a href="velocity_control_example">
        <img src="extras/Images/uno_l6234_velocity.jpg"  >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
<div class="image_icon width30">
    <a href="gimbal_velocity_example">
        <img src="extras/Images/hmbgc_v22_velocity_control.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

在[example projects](example_projects) 部分中可以找到更多项目。