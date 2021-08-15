---
layout: default
title: Open-Loop Motion control
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /open_loop_motion_control
nav_order: 3
has_children: True
has_toc: False
parent: Motion Control
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# 运动控制

<img src="extras/Images/open_loop.gif">

<span class="simple">Simple<span class="foc">FOC</span>library </span>给你使用2种不同的开环控制策略的选择

- [Velocity open-loop control](velocity_openloop)
- [Position open-loop control](angle_openloop)

<blockquote class="info"> 索引搜索也使用开环位置控制，但有一些额外的参数，见 <a href="index_search_loop">index search</a></blockquote>

```cpp
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle_openloop;
```

有关运动控制策略的源代码实现的更多信息，请查看 [library source code documentation](motion_control_implementation)

