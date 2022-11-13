---
layout: default
title: 闭环控制
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

+<script type="text/javascript">
    function show(id){
        Array.from(document.getElementsByClassName('gallery_img')).forEach(
        function(e){e.style.display = "none";});
        document.getElementById(id).style.display = "block";
        Array.from(document.getElementsByClassName("btn-primary")).forEach(
        function(e){e.classList.remove("btn-primary");});
        document.getElementById("btn-"+id).classList.add("btn-primary");
    }
</script>

<a href ="javascript:show(0);" id="btn-0" class="btn">位置控制</a>
<a href ="javascript:show(1);" id="btn-1" class="btn">速度控制</a>
<a href ="javascript:show(2);" id="btn-2" class="btn  btn-primary">力矩控制</a>

<img style="display:none" id="0" class="gallery_img" src="extras/Images/closedloop_0000_Layer 3.jpg"/>
<img style="display:none" id="1" class="gallery_img" src="extras/Images/closedloop_0001_Layer 2.jpg"/>
<img style="display:block" id="2"  class="gallery_img" src="extras/Images/closedloop_0002_Layer 1.jpg"/>

<span class="simple">Simple<span class="foc">FOC</span>library</span> 提供给你三种不同的闭环控制方法：

- [力矩控制环](torque_control)

- [力矩控制环](voltage_loop)
- [速度运动控制](velocity_loop)
- [位置/角度运动控制](angle_loop)

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