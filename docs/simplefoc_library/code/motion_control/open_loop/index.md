---
layout: default
title: 开环运动控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /open_loop_motion_control
nav_order: 3
has_children: True
has_toc: False
parent: 运动控制
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# 开环运动控制

<img src="extras/Images/open_loop.gif">

<span class="simple">Simple<span class="foc">FOC</span>library </span>提供2种不同的开环控制策略：

- [开环速度控制](velocity_openloop)
- [开环位置控制](angle_openloop)

<blockquote class="info"> 索引搜索也使用开环位置控制，但有一些额外的参数，见 <a href="index_search_loop">index search</a></blockquote>
```cpp
// MotionControlType::velocity_openloop    - 开环速度控制
// MotionControlType::angle_openloop       - 开环位置控制
motor.controller = MotionControlType::angle_openloop;
```

有关运动控制策略的源代码实现的更多信息，请查看 [library source code documentation](motion_control_implementation)

