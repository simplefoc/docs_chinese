---
layout: default
title: 力矩控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /torque_control
nav_order: 1
parent: Closed-Loop control
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 力矩控制环


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
<a href ="javascript:show(0);" id="btn-0" class="btn">FOC 电流模式</a>
<a href ="javascript:show(1);" id="btn-1" class="btn">DC 电流模式</a>
<a href ="javascript:show(2);" id="btn-2" class="btn">电压模式 - 假定电流</a>
<a href ="javascript:show(3);" id="btn-3" class="btn btn-primary">电压模式</a>

<img style="display:none" id="0" class="gallery_img" src="extras/Images/torque_modes_0000.jpg"/>
<img style="display:none" id="1" class="gallery_img" src="extras/Images/torque_modes_0001.jpg"/>
<img style="display:none" id="2" class="gallery_img" src="extras/Images/torque_modes_0002.jpg"/>
<img style="display:block" id="3"  class="gallery_img" src="extras/Images/torque_modes_0003.jpg"/>

<span class="simple">Simple<span class="foc">FOC</span>library</span>提供3种不同的力矩控制策略:

- [电压模式](voltage_torque_mode) - `voltage`
- [DC 电流模式](dc_current_torque_mode) - `dc_current`
- [FOC 电流模式](foc_current_torque_mode) - `foc_current`

总而言之，**电压控制模式**是最简单的电机力矩控制近似模拟，它十分基础，可以在任何电机+驱动器+mcu组合上运行。**直流电流模式**是更进一步的电机力矩近似模拟，它比电压模式更精确，但需要电流检测和性能更强的单片机。**FOC电流模式**是真正的电机力矩控制，不是一个近似模拟。它需要的电流检测要比直流电流模式有更强大的处理能力。更深入的解释说明，请查阅[力矩模式文档](torque_control)。

这个运动控制模式需要设定 `controller` 参数，如下：
```cpp
// 力矩控制环
motor.controller = MotionControlType::torque;
```

如果采用电压控制模式，当用户不向电机提供相阻值时，则力矩控制环的输入为目标电压<i>U<sub>q</sub></i>:

<a name="foc_image"></a><img src="extras/Images/torque_loop_v.png">

如果采用基于电流的力矩控制模式之一(直流电流或FOC电流)，则控制环的输入为目标电流<i>i<sub>q</sub></i>。当用户向电机提供相阻值时，在电压模式中也是如此。

<a name="foc_image"></a><img src="extras/Images/torque_loop_i.png">

力矩控制环是所有其他运动控制环的基础。有关蓝框中的相关内容，请查阅 [力矩模式文档](torque_control).

## 配置参数
基于力矩控制模式，你会使用到以下这些你需要考虑的参数：
- [电压模式](voltage_mode)  - 最简单 - 只需考虑一个参数： `motor.phase_resistance`
- [DC 电流模式](dc_current_torque_mode) - 1xPID controller + 1xLPF
- [FOC 电流模式](foc_current_torque_mode) - 2xPID controller + 2xLPF filters 

更多关于运动控制策略的源代码实现，请查阅 [library 源代码文件](motion_control_implementation)

### 比较

| 力矩控制类型 | 优点                                                         | 缺点                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 电压         | ✔️简单和快速 <br>✔️ 任何 MCU上都有良好的性能 <br>✔️ 低速行驶时非常平稳<br>✔️ 无需电流检测 | ❌ 在高速下不是最佳的 <br>❌ 不能控制真正的电流 <br>❌ 力矩为近似估值(低速时误差小) |
| 直流电流     | ✔️ 能控制真正电流 <br>✔️ 适用于低性能 MCU<br>✔️可实现电流限制   | ❌ 执行更复杂(更慢)<br>❌可以实现比电压模式更低的速度 <br>❌ 力矩为近似估值(低速时误差小) <br>❌需要电流检测 |
| FOC电流      | ✔️真正的力矩控制(任意速度) <br>✔️ 能控制真正电流 <br>✔️在更高的速度下更高效<br>✔️可实现电流限制 | ❌ 执行最复杂(最慢) <br>❌ 不适合低性能的MCU(可能变得不稳定)。 <br>❌需要电流检测 |



### 电压模式 - `voltage`

基于电压的力矩控制是最基本的力矩控制模式，它为你提供了一个抽象的无刷直流电机，以便你可以控制它作为直流电机。

它基于简单的欧姆定律(忽略了电流动态特性)，因此不需要任何电流检测相关的硬件。假若想了解有关此方法的更多信息，请访问我们的[digging deeper section](voltage_torque_control). **这种力矩控制方法无论其是否具有电流感应，都能够在任何无刷直流电机驱动板上工作。**

### 直流电流模式 - `dc_current`
基于直流电流的力矩控制能够像控制直流电机那样控制无刷电机。电流检测用于获取通过电机的电流大小及方向，我们假设力矩和总电流是成正比的。这种模式好处在于可以非常精确地控制无刷电机的实际电流，一些性能较低的处理器（如ATMega328系列）也能有较快较稳定的效果。

### FOC电流模式- `foc_current`
基于直流电流的力矩控制是唯一真正的力矩控制方法。它控制电流 `q和 ` `d`的两个分量。我们假设力矩与 `q` 电流分量成比例，并控制电流的 `d` 分量保持等于0。

## 项目例程
这是一个非常酷的项目示例，它使用扭矩控制并完整描述了所需硬件和软件设置。

<div class="image_icon width30">
    <a href="simplefoc_pendulum">
        <img src="extras/Images/foc_pendulum.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

更多项目，请查阅 [例程项目](example_projects) 部分。


