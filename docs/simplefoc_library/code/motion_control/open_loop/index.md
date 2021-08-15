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
# Motion control 

<img src="extras/Images/open_loop.gif">

<span class="simple">Simple<span class="foc">FOC</span>library</span> gives you the choice of using 2 different open-loop control strategies:
- [Velocity open-loop control](velocity_openloop)
- [Position open-loop control](angle_openloop)

<blockquote class="info"> Index search uses also uses open-loop position control, but has some additional parameters, see <a href="index_search_loop">index search</a></blockquote>

```cpp
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle_openloop;
```

For more information about the source code implementation of the motion control strategies check the [library source code documentation](motion_control_implementation)