---
layout: default
title: 闭环控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /closed_loop_motion_control
nav_order: 2
has_children: True
has_toc: False
parent: 运动控制
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# 运动控制


选择电机类型：

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

选择电压控制类型：

<a href ="javascript:show(0,'loop');" id="btn-0" class="btn btn-loop btn-primary">位置控制</a>
<a href ="javascript:show(1,'loop');" id="btn-1" class="btn btn-loop">速度控制</a>
<a href ="javascript:show(2,'loop');" id="btn-2" class="btn btn-loop">扭矩控制</a>

<div class="type type-b">
<img class="loop loop-0 width80" src="extras/Images/closedloop_0000_Layer 3.jpg"/>
<img class="loop loop-1 width80 hide" src="extras/Images/closedloop_0001_Layer 2.jpg"/>
<img  class="loop loop-2 width80 hide" src="extras/Images/closedloop_0002_Layer 1.jpg"/>

</div>
<div class="type type-s hide">

<img id="4" class="loop width80 loop-0" src="extras/Images/closed_loop_stepper3.jpg"/>
<img id="5" class="loop width80 loop-1 hide" src="extras/Images/closed_loop_stepper2.jpg"/>
<img id="6" class="loop width80 loop-2 hide" src="extras/Images/closed_loop_stepper1.jpg"/>

</div>


<span class="simple">简易<span class="foc">FOC</span>库</span> 为您提供了 3 种不同的闭环控制策略选择：
- [扭矩控制环](torque_control)
- [速度运动控制](velocity_loop)
- [位置/角度运动控制](angle_loop)

您可以通过更改 `motor.controller` 变量来进行设置。如果您想控制电机角度，可将 `controller` 设置为 `MotionControlType::angle`；

如果您想通过电压或电流控制无刷直流电机或步进电机的扭矩，可使用 `MotionControlType::torque`；

如果您希望控制电机角速度，可使用 `MotionControlType::velocity`。

```cpp
// set FOC loop to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```

有关运动控制策略的源代码实现的更多信息，请查看 [库源代码文档](motion_control_implementation)