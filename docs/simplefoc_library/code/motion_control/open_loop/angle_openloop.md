---
layout: default
title: 开环位置控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /angle_openloop
nav_order: 2
parent: 开环运动控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 开环位置控制
该模式无需设置任何位置传感器，而控制无刷直流电机达到所期望的角度。该模式设置如下：

```cpp
// 设置开环位置控制
motor.controller = MotionControlType::angle_openloop;
```
<img src="extras/Images/open_loop_angle.png">

你可以通过运行 `motion_control/open_loop_motor_control/` 文件夹中的示例来测试这个算法。

这种控制算法非常简单。用户设定目标角度 <i>a<sub>d</sub></i>。算法只需要将当前角度 <i>a<sub>c</sub></i> 和期望角度 <i>a<sub>d</sub></i>相减来确定所需转动的方向，然后以可能的最高速度`motor.velocity_limit`（实际最大的速度）朝该方向转动。而为了设置这个转速，它使用了 [速度开环控制](velocity_openloop)相同的算法，即对目标速度进行积分，计算出所需设置到电机a<sub>c</sub>的值。然后，通过 `SinePWM` 或者 `SpaceVectorPWM` 调制，在a<sub>c</sub>的方向上施加电机的最大允许电压 `motor.voltage_limit` 。

## 配置
``` cpp
// 选择FOC调制类型（可选的）
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

// 位置控制最大速度
// 默认为20
motor.velocity_limit = 20;

// 限制电压
motor.voltage_limit = 3;   // Volts
// 限制电流 - 如果相电阻给定
motor.current_limit = 0.5 // Amps
```

这种运动控制类型是很低效的，因此 `motor.voltage_limit`尽量不要设太高。我们建议你设置相电阻 `phase_resistance` 然后设置电机的电流限制 `motor.current_limit` 来代替电压限制。这个所设定的电流可能会超，但至少你清楚电机运行时的电流近似值。你可以通过电机相电阻`phase_resistance` 来估算出大致的电流:

```cpp
voltage_limit = current_limit * phase_resistance; // Amps
```

你的电机从一个位置到另一个位置的速度取决于设置的最大转速 `motor.velocity_limit` 。该值越高，位置切换就越快。但由于当前模式为开环开环控制，无法获知电机是否能按照这个转速运行，因此要确保 `velocity_limit`这个值是电机所能达到的值。当然也要注意要实现更高的转速和力矩，就要提高`motor.voltage_limit` 变量或电动机 `motor.current_limit` 的值。

此外，有需要的话，你可以实时改变电压限制 `motor.voltage_limit` (`motor.current_limit`) 和转速限制 `motor.velocity_limit` 



## 开环位置控制实例
这里是一个基本的开环位置控制以及完整的配置的例程。该例程将目标位置设定并保持在 ` 0RAD` ，用户可以通过串口终端改变目标位置。

```cpp
// 开环电机控制实例
#include <SimpleFOC.h>

// 无刷直流电机及驱动器实例
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 目标变量
float target_position = 0;

// commander实例化
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.variable(&target_position, cmd); }

void setup() {

  // 配置驱动器
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接电机和驱动器
  motor.linkDriver(&driver);

  // 限制电机运动
  motor.voltage_limit = 3;   // [V]
  motor.velocity_limit = 5; // [rad/s] cca 50rpm
  // 配置开环控制
  motor.controller = MotionControlType::angle_openloop;

  // 初始化电机
  motor.init();

  // 添加目标命令T
  command.add('T', doTarget, "target angle");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target position [rad]");
  _delay(1000);
}

void loop() {
  // 开环角度运动
  // 使用电机电压限制和电机速度限制
  motor.move(target_position);
  
  // 用户通信
  command.run();
}
```