---
layout: default
title: 开环控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /open_loop_motion_control
nav_order: 3
has_children: True
has_toc: False
parent: 运动控制
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# 开环运动控制
选择电机类型：

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

选择电压控制类型：

<a href ="javascript:show(0,'loop');" id="btn-0" class="btn btn-loop btn-primary">位置控制</a>
<a href ="javascript:show(1,'loop');" id="btn-1" class="btn btn-loop">速度控制</a>

<div class="type type-b">
<img class="loop loop-0 width80" src="extras/Images/opneloop_0001_Layer 0.jpg"/>
<img class="loop loop-1 width80 hide" src="extras/Images/opneloop_0000_Layer 2.jpg"/>

</div>
<div class="type type-s hide">

<img  class="loop width80 loop-0" src="extras/Images/open_loop_stepper_angle.jpg"/>
<img class="loop width80 loop-1 hide" src="extras/Images/open_loop_stepper_vel.jpg"/>

</div>

<span class="simple">简易<span class="foc">FOC</span>库</span> 为您提供了两种不同的开环控制策略选择，这些控制策略不需要位置传感器：

- [速度开环控制](velocity_openloop)
- [位置开环控制](angle_openloop)


<blockquote class="info"> 索引搜索也使用开环速度控制，但有一些额外参数，参见 <a href="index_search_loop">索引搜索</a></blockquote><br>



您可以通过更改 `motor.controller` 变量来设置开环模式。如果您想控制电机角度，可将 `controller` 设置为 `MotionControlType::angle_openloop`；如果您想控制电机角速度，可设置为 `MotionControlType::velocity_openloop`。
 
```cpp
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle_openloop;
```

有关运动控制策略的源代码实现的更多信息，请查看 [库源代码文档](motion_control_implementation)