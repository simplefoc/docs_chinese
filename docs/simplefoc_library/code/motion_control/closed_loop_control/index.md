---
layout: default
title: Closed-Loop Motion control
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /closed_loop_motion_control
nav_order: 2
has_children: True
has_toc: False
parent: Motion Control
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# Motion control 

<img src="extras/Images/closed_loop.gif">

<span class="simple">Simple<span class="foc">FOC</span>library</span> gives you the choice of using 3 different closed-loop motion control strategies: 
- [Torque control loop](voltage_loop)
- [Velocity motion control](velocity_loop)
- [Position/angle motion control](angle_loop)

You set it by changing the `motor.controller` variable. If you want to control the motor angle you will set the `controller` to `MotionControlType::angle`, if you seek the torque of the BLDC motor either through voltage or the current use `MotionControlType::torque`, if you wish to control motor angular velocity `MotionControlType::velocity`. 

```cpp
// set FOC loop to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```

For more information about the source code implementation of the motion control strategies check the [library source code documentation](motion_control_implementation)