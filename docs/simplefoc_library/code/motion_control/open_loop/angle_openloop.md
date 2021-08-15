---
layout: default
title: Position Open-Loop
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /angle_openloop
nav_order: 2
parent: Open-Loop Motion control
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 位置开环控制
这个控制回路能让你在不使用位置传感器的情况下，实时调整你的电机到所需角度。启用该模式的有：
```cpp
// set position motion control open-loop
motor.controller = MotionControlType::angle_openloop;
```
<img src="extras/Images/open_loop_angle.png">

你可以通过运行 `motion_control/open_loop_motor_control/` 文件夹中的示例来测试这个算法。这种控制算法非常简单。用户设定它想要达到 <i>a<sub>d</sub></i>的目标角度。算法只需要减去当前的角 <i>a<sub>c</sub></i> 和期望的角 <i>a<sub>d</sub></i>来找到它需要移动的方向，并以电机可能的最高速度`motor.velocity_limit`(最大速度)在那个方向上运行。同时为了设置这个速度，它使用了与速度相同的算法 [速度开环控制](velocity_openloop)。它在时间上对速度进行积分，以找出它需要设置什么角度到电机 <i>a<sub>c</sub></i> ，以实现它。然后是电机的最大允许电压 `motor.voltage_limit` 将使用 `SinePWM` 或 `SpaceVector` 调制应用于 <i>a<sub>c</sub></i> 的方向。

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

这种类型的运动控制是非常低效的，因此尽量不要对`motor.voltage_limit`使用高值。我们建议为电机类提供 `phase_resistance` 值并设置电机`motor.current_limit` 代替电压限制。这个电流可能被超越，但在电机运行时，至少你会知道一个近似的电流。你可以计算电机将产生的电流通过检查电机电阻 `phase_resistance` 和评估：

```cpp
voltage_limit = current_limit * phase_resistance; // Amps
```

最大速度马达 `motor.velocity_limit` 值将决定你的电机在两个位置之间运行的速度。当值越高，转换越快。但由于我们是在开环中转动电机，我们将无法知道电机是否能跟随速度。因此，确保速度为 `velocity_limit` 的值，是可以实现的电机。同时你还要注意，为更高的速度和更多的保持扭矩，你将需要增加 `motor.voltage_limit` 变量或电动机 `motor.current_limit` 变量。> wait to translate

此外，如果你的应用程序中需要这种行为，你可以改变在实时的电压限制 `motor.voltage_limit` (`motor.current_limit`) 和转换速度 `motor.velocity_limit` 



## 位置开环控制实例
这里是一个基本的例子的速度开环控制与完整的配置。该程序将对 `0 RAD` 的目标位置进行设置和维护，用户可以使用串行终端改变目标位置。

```cpp
// Open loop motor control example
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

//target variable
float target_position = 0;

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.variable(&target_position, cmd); }

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

  // add target command T
  command.add('T', doTarget, "target angle");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target position [rad]");
  _delay(1000);
}

void loop() {
  // open  loop angle movements
  // using motor.voltage_limit and motor.velocity_limit
  motor.move(target_position);
  
  // user communication
  command.run();
}
```