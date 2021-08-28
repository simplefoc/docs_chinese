---
layout: default
title: 闭环运动控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /closed_loop_motion_control
nav_order: 2
has_children: True
has_toc: False
parent: 运动控制
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# 闭环运动控制

控制<img src="extras/Images/closed_loop.gif">

<span class="simple">Simple<span class="foc">FOC</span>library</span> 给你使用3种不同的闭环运动控制策略的选择：

- [Torque control loop](voltage_loop)
- [Velocity motion control](velocity_loop)
- [Position/angle motion control](angle_loop)

你可以通过改变 `motor.controller` 变量。如果你想控制电机的角度，你可以设置 `controller` 到 `MotionControlType::angle`, 

如果你想通过电压或电流来寻求无刷直流电机的扭矩，请使用 `MotionControlType::torque`如果你想控制电机的角速度 `MotionControlType::velocity`。 

```cpp
// 设置FOC运动控制环
// MotionControlType::torque（力矩控制）
// MotionControlType::velocity（速度控制）
// MotionControlType::angle（角度控制）
motor.controller = MotionControlType::angle;
```

这有关运动控制策略的源代码实现的更多信息，请查看 [library source code documentation](motion_control_implementation)