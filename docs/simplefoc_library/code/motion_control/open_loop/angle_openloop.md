---
layout: default
title: 开环位置控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /angle_openloop
nav_order: 2
parent: 开环控制
grand_parent: 运动控制
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 位置开环控制
此控制环允许您在不使用位置传感器的情况下实时将电机移动到期望角度。启用此模式的方式如下：

```cpp
// set position motion control open-loop
motor.controller = MotionControlType::angle_openloop;
```


选择电机类型：

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

选择电压控制类型：

<a href ="javascript:show(0,'loop');" id="btn-0" class="btn btn-loop btn-primary">电压限制</a>
<a href ="javascript:show(1,'loop');" id="btn-1" class="btn btn-loop">电流限制</a>
<a href ="javascript:show(2,'loop');" id="btn-2" class="btn btn-loop">带反电动势补偿的电流限制</a>

<div class="type type-b">
<img class="loop loop-0 width60" src="extras/Images/open_loop_angle (3).png"/>
<img class="loop loop-1 width60 hide" src="extras/Images/open_loop_angle (1).png"/>
<img class="loop loop-2 width60 hide" src="extras/Images/open_loop_angle (2).png"/>

</div>
<div class="type type-s hide">

<img  class="loop width60 loop-0" src="extras/Images/open_loop_control.jpg"/>
<img class="loop width60 loop-1 hide" src="extras/Images/open_loop_control (1).jpg"/>
<img class="loop width60 loop-2 hide" src="extras/Images/open_loop_control (2).jpg"/>

</div>

您可以通过运行 `motion_control/open_loop_motor_control/` 文件夹中的示例来测试此算法。

此控制算法非常简单。用户设置想要达到的目标角度$$a_d$$。该算法只需用当前角度$$a_c$$减去期望角度$$a_d$$，以确定需要移动的方向，并以尽可能高的速度 `motor.velocity_limit`（最大速度$$v_{max}$$）朝该方向移动。为了设置此速度，它使用与[速度开环控制](velocity_openloop)相同的算法。它对时间积分速度，以确定为了实现该速度需要为电机设置的角度$$a_c$$。然后，使用 `SinePWM` 或 `SpaceVector` 调制，在$$a_c$$的方向上施加最大允许电压 `motor.voltage_limit`（$$U_{limit}$$）。

在控制环的每个步骤中，算法计算目标角度$$a_d$$与当前角度$$a_c$$之间的距离。然后使用以下公式计算下一个角度$$a_{c}$$：

$$
a_c = a_c + \begin{cases}
     v_{nax}\Delta t, & \text{if } a_d - a_c > v_{max}\Delta t \\
     -v_{max}\Delta t,  & \text{if } a_d - a_c < -v_{max}\Delta t \\
      a_d - a_c,       & \text{otherwise}
\end{cases}
$$

更简洁的写法是：

$$
a_c = a_c + \max(-v_{max}\Delta t,~ \min(v_{max}\Delta t,~ a_d - a))
$$

代码形式如下：
```cpp
// calculate the distance from the target
d_angle = target_angle - past_angle;
// constrain the distance with maximal allowable displacement
d_angle = constrain(d_angle, -velocity_limit*d_time, velocity_limit*d_time)
// calculate the next angle
next_angle = past_angle + d_angle;
```

## 配置
``` cpp
// choose FOC modulation (optional)
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

//  maximal velocity of the position control
// default 20
motor.velocity_limit = 20;

// limiting voltage 
motor.voltage_limit = 3;   // Volts
// or current  - if phase resistance provided
motor.current_limit = 0.5 // Amps

```

如果未提供相电阻，角度开环控制将为电机设置等于 `motor.voltage_limit`（$$U_{limit}$$）的电压

$$
U_{limit}  \quad [伏特]
$$

这是非常低效的，因为对于具有不同相电阻的不同电机，相同的电压值会产生截然不同的电流。
对于云台电机，您可以在 5-10 伏特的电压限制下开环运行，由于其相电阻为 5-15 欧姆，它将达到 0.5-2 安培的电流。对于无人机电机，电压限制应保持在很低的水平，低于 1 伏特，因为它们的相电阻为 0.05 至 0.2 欧姆。

### 电流限制方法

我们建议您向电机类提供 `phase_resistance`（$$R$$）值，并设置 `motor.current_limit`（$$I_{limit}$$）而不是电压限制。此电流可能会被超过，但至少您会知道电机消耗的大致电流。您可以通过查看电机电阻 `phase_resistance` 并计算来确定电机将要产生的电流：

$$
U_{limit} = I_{limit}\cdot R  \quad  [安培]
$$

使用此控制策略的最佳方式是同时提供电机的相电阻值和 KV 额定值。这样，库将能够计算反电动势电压，并更精确地估计消耗的电流。结合电流和反电动势电压，库可以为电机设置更合适的电压：

$$
U_{limit} = I_{limit}\cdot R + \frac{v_{max}}{KV}  \quad  [安培]
$$

### 速度限制

最大速度 `motor.velocity_limit`（$$v_{max}$$）值将决定电机在位置之间移动的速度。该值越高，过渡速度越快。但由于我们是以开环方式驱动电机，无法知道电机是否能跟上该速度。因此，请确保设置的 `velocity_limit` 值是您的电机可以达到的。另外请注意，对于更高的速度和更大的保持扭矩，您也需要增加 `motor.voltage_limit`（$$v_{max}$$）或 `motor.current_limit`（$$I_{limit}$$）变量。

### 实时更改限制

此外，如果您的应用程序需要这种行为，您可以实时更改电压限制 `motor.voltage_limit`（或 `motor.current_limit`）和过渡速度 `motor.velocity_limit`。

## 位置开环控制示例


<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

以下是一个带有完整配置的速度开环控制基本示例。该程序将设置目标位置为 `0 弧度` 并保持该位置，用户可以使用串行终端更改目标位置。


<div class="type type-b" markdown="1">

```cpp
// Open loop motor control example
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimitVolt(char* cmd) { command.scalar(&motor.voltage_limit, cmd); }
void doLimitVelocity(char* cmd) { command.scalar(&motor.velocity_limit, cmd); }

void setup() {

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  motor.voltage_limit = 3;   // [V]
  motor.velocity_limit = 5; // [rad/s] cca 50rpm
  // open loop control config
  motor.controller = MotionControlType::angle_openloop;

  // init motor hardware
  motor.init();
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target angle");
  command.add('L', doLimitVolt, "voltage limit");
  command.add('V', doLimitVelocity, "velocity limit");


  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target position [rad]");
  _delay(1000);
}

void loop() {
  motor.loopFOC(); 
  // open  loop angle movements
  // using motor.voltage_limit and motor.velocity_limit
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
StepperMotor motor = StepperMotor(50);
StepperDriver2PWM driver = StepperDriver2PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimitVolt(char* cmd) { command.scalar(&motor.voltage_limit, cmd); }
void doLimitVelocity(char* cmd) { command.scalar(&motor.velocity_limit, cmd); }

void setup() {

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  motor.voltage_limit = 3;   // [V]
  motor.velocity_limit = 5; // [rad/s] cca 50rpm
  // open loop control config
  motor.controller = MotionControlType::angle_openloop;

  // init motor hardware
  motor.init();
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target angle");
  command.add('L', doLimitVolt, "voltage limit");
  command.add('V', doLimitVelocity, "velocity limit");


  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target position [rad]");
  _delay(1000);
}

void loop() {
  motor.loopFOC(); 
  // open  loop angle movements
  // using motor.voltage_limit and motor.velocity_limit
  motor.move();
  
  // user communication
  command.run();
}
```
</div>