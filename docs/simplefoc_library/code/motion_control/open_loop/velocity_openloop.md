---
layout: default
title: Velocity Open-Loop
parent: Motion Control
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /velocity_openloop
nav_order: 1
parent: Open-Loop Motion control
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# 速度开环控制
控制这个控制回路允许你旋转你的无刷直流电机所需的速度，而不使用位置传感器。启用该模式的有:
```cpp
// set velocity control open-loop mode
motor.controller = MotionControlType::velocity_openloop;
```

<img src="extras/Images/open_loop_velocity.png" >

你可以通过运行`motion_control/openloop_motor_control/` 文件夹中的示例来测试这个算法。

这种控制算法非常简单。 用户可以设定想要达到 <i>v<sub>d</sub></i>的目标速度，算法会及时对其进行整合，找出需要将什么角度设置到电机 <i>a<sub>c</sub></i> 上才能实现这一目标。然后是电机的最大允许电压 `motor.voltage_limit` 将被应用到 <i>a<sub>c</sub></i> 的方向，使用 `SinePWM` 或者 `SpaceVectorPWM` 调制。

这是计算下一个设定到电机的角度的简化版:

```cpp
next_angle = past_angle + target_velocity*d_time;
```
你需要知道  `target_velocity`，采样时间 `d_time` 和你设置的电机角度 `past_angle` 的过去值。

## Configuration
```cpp
// choose FOC modulation (optional) - default SinePWM
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

// limiting voltage 
motor.voltage_limit = 3;   // Volts
// or current  - if phase resistance provided
motor.current_limit = 0.5 // Amps
```

这种类型的运动控制是非常低效的，因此尽量不要对 `motor.voltage_limit`使用高值。我们建议你为电机类 `phase_resistance` 值并设置电机 `motor.current_limit` 代替电压限制。这个电流可能被超越，但当电机运行时，至少你会知道一个近似的电流。你可以计算电机将产生的电流通过检查电机电阻 `phase_resistance` 和评估:

```cpp
voltage_limit = current_limit * phase_resistance; // Amps
```

此外，如果你的应用程序需要这种行为，你可以实时更改电压/电流限制。

## 速度开环控制实例

这里是一个基本的例子的速度开环控制与完整的配置。该程序将目标速度设定为 `2 RAD/s` 并保持它，用户可以通过串口终端改变目标速度。

```cpp
// Open loop motor control example
#include <SimpleFOC.h>

// BLDC motor & driver instance
// BLDCMotor( pp number , phase resistance)
BLDCMotor motor = BLDCMotor(11 , 12.5); 
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

//target variable
float target_velocity = 2; // rad/s

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.variable(&target_velocity, cmd); }

void setup() {

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor current (provided resistance)
  motor.current_limit = 0.5;   // [Amps]
 
  // open loop control config
  motor.controller = MotionControlType::velocity_openloop;

  // init motor hardware
  motor.init();

  // add target command T
  command.add('T', doTarget, "target velocity");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {

  // open loop velocity movement
  // using motor.current_limit and motor.velocity_limit
  motor.move(target_velocity);

  // user communication
  command.run();
}

```
