---
layout: default
title: 运动控制
parent: 编写代码
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /motion_control
nav_order: 6
has_children: True
has_toc: False
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---

## 运动控制
<span class="simple">简易<span class="foc">FOC</span>库</span>有两个主要参数定义了要使用的运动控制架构（并且每个参数都可以实时修改）：
- 运动控制模式 - `motor.controller`
  - [闭环控制](closed_loop_motion_control) - 带位置传感器
  - [开环控制](open_loop_motion_control) - 无位置传感器
- [扭矩控制模式](torque_control) - `motor.torque_controller`
  - 仅在闭环控制模式下使用

## 库中的单位

所有电机/驱动器/传感器参数和控制变量的定义单位如下：

物理量 | 单位 | 描述 | 与其他单位的转换
--- | --- | --- | ---
位置/角度 | `弧度（Radians）` | 电机和传感器的位置（以弧度为单位） | 2π（6.14）弧度 = 360 度 = 1 圈电机旋转
速度 | `弧度/秒（Rad/s）` | 电机和传感器的速度（以弧度每秒为单位） | 2π（6.14）弧度/秒 = 1 圈电机旋转/秒 = 60 转/分（RPM）
扭矩/电流 | `安培（Amps）` | 电机扭矩或电流（以安培为单位） | 1 牛·米 = Kt 安培（Kt 是电机扭矩常数）


## 扭矩控制模式
<span class="simple">简易<span class="foc">FOC</span>库</span>中实现了三种扭矩控制类型：
- 电压 - `TorqueControlType::voltage`
- 直流电流 - `TorqueControlType::dc_current`
- FOC 电流 - `TorqueControlType::foc_current`
<blockquote class="warning"> ⚠️ 如果选择开环控制，则不使用此参数。</blockquote>

它们可以通过更改电机属性 `torque_controller` 来设置。
```cpp
// set torque mode to be used
// TorqueControlType::voltage    ( default )
// TorqueControlType::dc_current
// TorqueControlType::foc_current
motor.torque_controller = TorqueControlType::foc_current;
```

有关不同扭矩模式的更深入解释，请访问[扭矩模式文档](torque_control)

## 运动控制模式
<span class="simple">Simple<span class="foc">FOC</span>library</span> 实现了两种情况下的运动控制：

- [闭环控制](closed_loop_motion_control) - 带位置传感器
- [开环控制](open_loop_motion_control) - 无位置传感器

### 闭环控制
<span class="simple">Simple<span class="foc">FOC</span>库</span>中实现了三种闭环控制类型：

- 扭矩 - `MotionControlType::torque`
- 速度 - `MotionControlType::velocity`
- 角度 - `MotionControlType::angle`

可以通过更改电机的 `controller` 参数来设置它们。
```cpp
// set motion control loop to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```
有关不同闭环控制环路的更深入解释，请访问[闭环控制文档](https://www.google.com/search?q=closed_loop_motion_control)。

### 开环控制
此外，您也可以在开环模式下运行电机，即无需位置传感器反馈：
- 速度开环控制 - `MotionControlType::velocity_openloop`
- 位置开环控制 - `MotionControlType::angle_openloop`


				HTML

<blockquote class="info"> 索引搜索也使用开环位置控制，但有一些额外的参数，参见 <a href="index_search_loop">索引搜索</a></blockquote>

它们也可以通过设置电机的 `controller` 参数来启用。
```cpp
// MotionControlType::velocity_openloop    - velocity 开环控制
// MotionControlType::angle_openloop       - position 开环控制
motor.controller = MotionControlType::angle_openloop;
```
有关不同开环控制环路的更深入解释，请访问[开环控制文档](https://www.google.com/search?q=open_loop_motion_control)。

有关运动控制策略源代码实现的更多信息，请查看[库源代码文档](https://www.google.com/search?q=motion_control_implementation)。