---
layout: default
title: 开环控制
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

<script type="text/javascript">
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
<a href ="javascript:show(1);" id="btn-1" class="btn  btn-primary">速度控制</a>

<img style="display:none" id="0" class="gallery_img width80" src="extras/Images/opneloop_0001_Layer 0.jpg"/>
<img style="display:block" id="1" class="gallery_img  width80" src="extras/Images/opneloop_0000_Layer 2.jpg"/>

<span class="simple">Simple<span class="foc">FOC</span>library</span> 为你提供两种不同的开环控制方法，控制方法无需位置传感器

- [开环速度控制](velocity_openloop)
- [开环位置控制](angle_openloop)

<blockquote class="info"> 索引搜索也使用开环位置控制，但有一些额外的参数，见 <a href="index_search_loop">index search</a></blockquote>
```cpp
// MotionControlType::velocity_openloop    - 开环速度控制
// MotionControlType::angle_openloop       - 开环位置控制
motor.controller = MotionControlType::angle_openloop;
```

有关运动控制策略的源代码实现的更多信息，请查看 [library source code documentation](motion_control_implementation)

