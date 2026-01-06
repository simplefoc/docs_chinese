---
layout: default
title: 开环速度控制
parent: Motion Control
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /velocity_openloop
nav_order: 1
parent: 开环控制
grand_parent: 运动控制
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 速度开环控制
此控制环允许您在不使用位置传感器的情况下以期望的速度旋转 BLDC 电机。通过以下方式启用此模式：
```cpp
// set velocity control open-loop mode
motor.controller = MotionControlType::velocity_openloop;
```

选择电机类型：

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

选择电压控制类型： 

<a href ="javascript:show(0,'loop');" id="btn-0" class="btn btn-loop btn-primary">电压限制</a>
<a href ="javascript:show(1,'loop');" id="btn-1" class="btn btn-loop">电流限制</a>
<a href ="javascript:show(2,'loop');" id="btn-2" class="btn btn-loop">带反电动势补偿的电流限制</a>

<div class="type type-b">
<img class="loop loop-0 width60" src="extras/Images/open_loop_velocity (3).png"/>
<img class="loop loop-1 width60 hide" src="extras/Images/open_loop_velocity (2).png"/>
<img class="loop loop-2 width60 hide" src="extras/Images/open_loop_velocity (1).png"/>

</div>
<div class="type type-s hide">

<img  class="loop width60 loop-0" src="extras/Images/open_loop_vel_steppe3.jpg"/>
<img class="loop width60 loop-1 hide" src="extras/Images/open_loop_vel_steppe2.jpg"/>
<img class="loop width60 loop-2 hide" src="extras/Images/open_loop_vel_steppe1.jpg"/>

</div>

您可以通过运行 `motion_control/openloop_motor_control/` 文件夹中的示例来测试此算法。

该控制算法非常简单。用户可以设置想要达到的目标速度$$v_d$$，算法将在时间上对其进行积分，以找出需要设置给电机的角度$$a_c$$以实现该速度。然后，最大允许电压 `motor.voltage_limit` 将使用 `SinePWM` 或 `SpaceVectorPWM` 调制沿$$a_c$$方向施加。

以下是计算要设置给电机的下一个角度的简化版本：

$$
a_c = a_c + v_d\Delta t;
$$

您需要知道目标速度$$v_d$$、采样时间$$\Delta t$$以及您设置给电机的角度$$a$$的过去值。

## 配置
速度开环控制只有三个主要参数
```cpp
// choose FOC modulation (optional) - SinePWM or SpaceVectorPWM
motor.foc_modulation = FOCModulationType::SinePWM;

// limiting voltage 
motor.voltage_limit = 3;   // Volts
// or current  - if phase resistance provided
motor.current_limit = 0.5 // Amps
```

速度开环控制（如果未提供相电阻）将向电机施加等于 `motor.voltage_limit`（$$U_{limit}$$）的电压

$$
U_{limit}  \quad [Volts]
$$

这是非常低效的，因为对于具有不同相电阻的不同电机，相同的电压值会产生截然不同的电流。
对于云台电机，您可以在 5-10 伏特的电压限制下开环运行，由于其相电阻为 5-15 欧姆，它将达到 0.5-2 安培的电流。对于无人机电机，电压限制应保持在很低的水平，低于 1 伏特。因为它们的相电阻为 0.05 至 0.2 欧姆。

### 电流限制方法

我们建议您向电机类提供 `phase_resistance`（$$R$$）值，并设置 `motor.current_limit`（$$I_{limit}$$）而不是电压限制。此电流可能会被超过，但至少您会知道电机消耗的大致电流。您可以通过检查电机电阻 `phase_resistance` 并评估来计算电机将要产生的电流：

$$
U_{limit} = I_{limit}\cdot R  \quad  [Volts ]
$$

使用此控制策略的最佳方式是同时提供相电阻值和电机的 KV 额定值。这样，库将能够计算反电动势电压，并更精确地估计消耗的电流。借助电流和反电动势电流，库可以为电机设置更合适的电压。

$$
U_{limit} = I_{limit}\cdot R + \frac{v_d}{KV}  \quad  [ Volts ]
$$

### 实时更改限制

此外，如果您的应用程序需要这种行为，您可以实时更改电压/电流限制。

## 速度开环控制示例

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

以下是一个完整配置的速度开环控制的基本示例。该程序将设置 `2 RAD/s` 的目标速度并保持该速度，用户可以使用串行终端更改目标速度。


<div class="type type-b" markdown="1">

```cpp
// Open loop motor control example
#include <SimpleFOC.h>

// BLDC motor & driver instance
// BLDCMotor( pp number , phase resistance, KV rating)
BLDCMotor motor = BLDCMotor(11 , 12.5, 100); 
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimitCurrent(char* cmd) { command.scalar(&motor.current_limit, cmd); }

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
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target velocity");
  command.add('C', doLimitCurrent, "current limit");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {
  motor.loopFOC();
  // open loop velocity movement
  // using motor.current_limit and motor.velocity_limit
  motor.move();

  // user communication
  command.run();
}

```

</div>

<div class="type type-s hide" markdown="1">

```cpp
// Open loop motor control example
#include <SimpleFOC.h>

// Stepper motor & driver instance
// StepperMotor( pp number , phase resistance)
StepperMotor motor = StepperMotor(50 , 1.5); 
StepperDriver2PWM driver = StepperDriver2PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimitCurrent(char* cmd) { command.scalar(&motor.current_limit, cmd); }

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
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target velocity");
  command.add('C', doLimitCurrent, "current limit");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {
  motor.loopFOC();
  // open loop velocity movement
  // using motor.current_limit and motor.velocity_limit
  motor.move();

  // user communication
  command.run();
}

```

</div>