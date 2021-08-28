---
layout: default
title: 开环速度控制
parent: Motion Control
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /velocity_openloop
nav_order: 1
parent: 开环运动控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# 开环速度控制
该模式无需设置任何位置传感器，而控制无刷直流电机达到所期望的速度。开环速度控制模式设置如下：

```cpp
// 设置开环速度控制模式
motor.controller = MotionControlType::velocity_openloop;
```

<img src="extras/Images/open_loop_velocity.png" >

你可以通过运行`motion_control/openloop_motor_control/` 文件夹中的例程来测试这个算法。

这种控制算法非常简单。 用户可以设定期望的目标速度 <i>v<sub>d</sub></i>，算法会对目标速度进行积分，计算出所需设置到电机a<sub>c</sub>的值， 然后，通过 `SinePWM` 或者 `SpaceVectorPWM` 调制，在a<sub>c</sub>的方向上施加电机的最大允许电压 `motor.voltage_limit` 。

这是计算下一时刻设置到电机的角度的简化版:

```cpp
next_angle = past_angle + target_velocity*d_time;
```
你需要知道  `target_velocity`，采样时间 `d_time` 和你设置的电机角度 `past_angle` 的上一时刻的值。

## 配置
```cpp
// 选择FOC调制类型（可选的） - 默认为SinePWM
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

// 限制电压
motor.voltage_limit = 3;   // Volts
// 限制电流 - 如果相电阻给定
motor.current_limit = 0.5 // Amps
```

这种运动控制类型是很低效的，因此 `motor.voltage_limit`尽量不要设太高。我们建议你设置相电阻 `phase_resistance` 然后设置电机的电流限制 `motor.current_limit` 来代替电压限制。这个所设定的电流可能会超，但至少你清楚电机运行时的电流近似值。你可以通过电机相电阻`phase_resistance` 来估算出大致的电流:

```cpp
voltage_limit = current_limit * phase_resistance; // Amps
```

此外，有需要的话，你可以实时更改电压/电流限制。

## 开环速度控制实例

这里是一个基本的开环速度控制以及完整的配置的例程。该例程将目标速度设定并保持在 `2 RAD/s` ，用户可以通过串口终端改变目标速度。

```cpp
// 开环电机控制实例
#include <SimpleFOC.h>

// 无刷直流电机及驱动器实例
// BLDCMotor( pp number极对数 , phase resistance相电阻)
BLDCMotor motor = BLDCMotor(11 , 12.5); 
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 目标变量
float target_velocity = 2; // rad/s

// commander实例化
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.variable(&target_velocity, cmd); }

void setup() {

  // 配置驱动器
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接电机和驱动器
  motor.linkDriver(&driver);

  // 限制电机电流 （电阻给定的话）
  motor.current_limit = 0.5;   // [Amps]
 
  // 配置开环控制
  motor.controller = MotionControlType::velocity_openloop;

  // 初始化电机
  motor.init();

  // 添加目标命令T
  command.add('T', doTarget, "target velocity");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {

  // 开环速度运动
  // 使用电机电压限制和电机速度限制
  motor.move(target_velocity);

  // 用户通信
  command.run();
}

```
