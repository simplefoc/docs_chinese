---
layout: default
title: Motion Control
parent: Writing the Code
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /motion_control
nav_order: 6
has_children: True
has_toc: False
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# Motion control 
<span class="simple">Simple<span class="foc">FOC</span>library</span> has two main parameters that define the motion control architecture to be used (and each of them can be modified in real-time):
- [Torque control mode](torque_mode) - `motor.torque_controller`
- Motion control mode - `motor.controller`
    - [Closed-loop motion control](closed_loop_motion_control) - with position sensor
    - [Open-loop motion control](open_loop_motion_control) - no position sensor

## Torque control modes
There are three torque control types implemented in the <span class="simple">Simple<span class="foc">FOC</span>library</span>:
- Voltage - `TorqueControlType::voltage`
- DC current - `TorqueControlType::dc_current`
- FOC current - `TorqueControlType::foc_current`
<blockquote class="warning"> ⚠️ This parameter is not used if the open-loop motion control is chosen.</blockquote>

And they can be set by changing the motor attribute `torque_controller`.
```cpp
// set torque mode to be used
// TorqueControlType::voltage    ( default )
// TorqueControlType::dc_current
// TorqueControlType::foc_current
motor.torque_controller = TorqueControlType::foc_current;
```

For more in depth explanations about different torque modes visit the [torque mode docs](torque_mode)

## Motion control modes
<span class="simple">Simple<span class="foc">FOC</span>library</span> implements motion control for both cases:
- [Closed-loop motion control](closed_loop_motion_control) - with position sensor
- [Open-loop motion control](open_loop_motion_control) - no position sensor

### Closed-loop motion control
There are three closed-loop motion control types implemented in the <span class="simple">Simple<span class="foc">FOC</span>library</span>:
- Torque - `MotionControlType::torque`
- Velocity - `MotionControlType::velocity`
- Angle - `MotionControlType::angle`

And they can be set by changing motor's `controller` parameter.  
```cpp
// set motion control loop to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```
For more in depth explanations about different closed-loop motion control loops visit the [closed-loop control docs](closed_loop_motion_control)

### Open-loop motion control
Additionally you can run the motor in the open-loop, without position sensor feedback, as well:
- velocity open-loop control - `MotionControlType::velocity_openloop`
- position open-loop control - `MotionControlType::angle_openloop`

<blockquote class="info"> Index search uses also uses open-loop position control, but has some additional parameters, see <a href="index_search_loop">index search</a></blockquote>

And they too can be enabled by setting motor's `controller` parameter.  
```cpp
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle_openloop;
```
For more in depth explanations about different closed-loop motion control loops visit the [open-loop control docs](open_loop_motion_control)

For more information about the source code implementation of the motion control strategies check the [library source code documentation](motion_control_implementation)