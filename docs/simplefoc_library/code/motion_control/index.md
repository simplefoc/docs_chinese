---
layout: default
title: 运动控制
parent: 代码
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /motion_control
nav_order: 6
has_children: True
has_toc: False
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# 运动控制
<span class="simple">Simple<span class="foc">FOC</span>library</span> 有两个主要参数来定义要使用的运动控制架构(每个参数都可以实时修改):

- [Torque control mode](torque_mode) - `motor.torque_controller`
- 运动控制模式 - `motor.controller`
    - [Closed-loop motion control](closed_loop_motion_control) - -带有位置传感器
    - [Open-loop motion control](open_loop_motion_control) - 无位置传感器

## 力矩控制模式
在<span class="simple">Simple<span class="foc">FOC</span>library</span>中有三种扭矩控制类型: 
- 电压 - `TorqueControlType::voltage`
- 直流电流 - `TorqueControlType::dc_current`
- 当前的FOC - `TorqueControlType::foc_current`
<blockquote class="warning"> ⚠️ This parameter is not used if the open-loop motion control is chosen.</blockquote>
它们可以通过改变运动属性来设置 `torque_controller`.
```cpp
// 设置力矩模式
// TorqueControlType::voltage    （默认）
// TorqueControlType::dc_current
// TorqueControlType::foc_current
motor.torque_controller = TorqueControlType::foc_current;
```

有关不同扭矩模式的更深入的解释，请访问 [torque mode docs](torque_mode)

## 运动控制模式
<span class="simple">Simple<span class="foc">FOC</span>library</span> 有两种运动控制模式:

- [Closed-loop motion control](closed_loop_motion_control) - 带位置传感器
- [Open-loop motion control](open_loop_motion_control) - 无位置传感器

###  闭环运动控制
在<span class="simple">Simple<span class="foc">FOC</span>library</span>的闭环有三种控制类型: 
- 力矩- `MotionControlType::torque`
- 速度 - `MotionControlType::velocity`
- 角 - `MotionControlType::angle`

通过改变电机的`controller`控制器参数来设定。

```cpp
// 设置运动控制环
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```
如果了解更多关于不同闭环运动控制回路的深入解释，请访问: [closed-loop control docs](closed_loop_motion_control)

###  开环运动控制
此外，你可以运行电机在开环，没有位置传感器反馈，以及:
- 速度开环控制- `MotionControlType::velocity_openloop`
- 位置开环控制 - `MotionControlType::angle_openloop`

<blockquote class="info"> 索引搜索使用也使用开环位置控制，但有一些额外的参数，见 <a href="index_search_loop">index search</a></blockquote>
你也可以通过设置电机的`controller`参数来实现。

```cpp
// MotionControlType::velocity_openloop    - 开环速度控制
// MotionControlType::angle_openloop       - 开环位置控制
motor.controller = MotionControlType::angle_openloop;
```
关于不同的闭环运动控制回路的更深入的解释，请访问[open-loop control docs](open_loop_motion_control)

有关运动控制策略的源代码实现的更多信息，请查看 [library source code documentation](motion_control_implementation)