---
layout: default
title: 力矩控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /torque_control
nav_order: 1
parent: 闭环控制
grand_parent: 运动控制
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
toc: true
---

# 转矩控制环

选择电机类型：

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

选择电压控制类型：

<a href ="javascript:show(0,'loop');" id="btn-0" class="btn btn-loop">FOC 电流模式</a>
<a href ="javascript:show(1,'loop');" id="btn-1" class="btn btn-loop">直流电流模式</a>
<a href ="javascript:show(2,'loop');" id="btn-2" class="btn btn-loop">电压模式 - 估算电流</a>
<a href ="javascript:show(3,'loop');" id="btn-3" class="btn btn-loop btn-primary">电压模式</a>

<div class="type type-b">
<img class="loop loop-0 hide width80" src="extras/Images/torque_modes_0000.jpg"/>
<img class="loop loop-1 hide width80" src="extras/Images/torque_modes_0001.jpg"/>
<img class="loop loop-2 hide width80" src="extras/Images/torque_modes_0002.jpg"/>
<img class="loop loop-3 width80" src="extras/Images/torque_modes_0003.jpg"/>
</div>
<div class="type type-s hide">

<img class="loop width80 loop-0 hide" src="extras/Images/torque_stepper1.jpg"/>
<img class="loop width80 loop-1 hide" src="extras/Images/torque_stepper2.jpg"/>
<img class="loop width80 loop-2 hide" src="extras/Images/torque_stepper3.jpg"/>
<img class="loop width80 loop-3" src="extras/Images/torque_stepper4.jpg"/>


</div>


<span class="simple">简易<span class="foc">FOC</span>库</span> 为您提供了 3 种不同的转矩控制策略供选择：

- [电压模式](voltage_torque_mode) - `voltage`
- [直流电流模式](dc_current_torque_mode) - `dc_current`
- [FOC 电流模式](foc_current_torque_mode) - `foc_current`

简而言之，**电压控制模式**是电机转矩控制的最简单近似，它非常基础，可在任何电机 + 驱动器 + 微控制器组合上运行。**直流电流模式**是电机转矩近似的下一步，比电压模式精确得多，但需要电流检测和更强的微控制器。**FOC 电流模式**控制电机的真实转矩，它不是近似值，也需要电流传感器，并且比直流电流模式需要更多的处理能力。详见 [转矩模式文档](torque_control) 中的深入解释。

通过将 `controller` 参数设置为以下值来启用此运动控制模式：

```cpp
// torque control loop
motor.controller = MotionControlType::torque;
```


如果使用电压控制模式，并且用户未向电机提供相电阻参数，则转矩控制环的输入将是目标电压 <i>U<sub>q</sub></i>：

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

<div class="type type-b">
<a name="foc_image"></a><img src="extras/Images/torque_loop_v.png">
</div>
<div class="type type-s hide">
<img src="extras/Images/torque_volt_stepper.png">
</div>
如果使用基于电流的转矩控制模式（直流电流或 FOC 电流）之一，则控制环中的输入将是目标电流 <i>i<sub>q</sub></i>。如果用户向电机类提供相电阻值，在电压模式下也是如此。
<div class="type type-b">
<a name="foc_image"></a><img src="extras/Images/torque_loop_i.png">
</div>
<div class="type type-s hide">
<img src="extras/Images/torque_curr_stepper.png">
</div>


转矩控制环用作所有其他运动控制环的基础。有关蓝色框内容的更多信息，请查看 [转矩模式文档](torque_control)。

## 配置参数
根据您希望使用的转矩控制类型，有不同的参数需要考虑。
- [电压模式](voltage_torque_mode) - 最简单的一种
  - 无强制参数
  - （可选参数包括电机相电阻、电感和 KV 额定值）
- [直流电流模式](dc_current_torque_mode) - 1 个 PID 控制器 + 1 个低通滤波器（LPF）
- [FOC 电流模式](foc_current_torque_mode) - 2 个 PID 控制器 + 2 个低通滤波器（LPF）

有关运动控制策略的源代码实现的更多信息，请查看 [库源代码文档](motion_control_implementation)


## 比较

转矩控制类型 | 优点 | 缺点
----- | ----- | ------
电压模式  | ✔️ 非常简单快速<br>✔️ 在任何 MCU 上性能都很好<br>✔️ 低速时非常平稳<br>✔️ 不需要电流检测  | ❌ 高速时不是最优的<br>❌ 无法控制真实电流消耗<br>❌ 转矩是近似值（低速时误差小）
直流电流模式  | ✔️ 可以控制真实电流消耗<br>✔️ 适用于低性能 MCU<br>✔️ 电流限制  | ❌ 执行更复杂（速度较慢）<br>❌ 能达到的速度低于电压模式<br>❌ 转矩是近似值（低速时误差小）<br>❌ 需要电流检测
FOC 电流模式  | ✔️ 真正的转矩控制（任何速度）<br>✔️ 可以控制真实电流消耗<br>✔️ 在较高速度下效率很高<br>✔️ 电流限制 | ❌ 执行最复杂（速度最慢）<br>❌ 不适用于低性能 MCU（可能变得不稳定）<br>❌ 需要电流检测

### 电压模式 - `voltage`
通过电压进行转矩控制是最基本的转矩控制类型，它为您提供了无刷直流电机/步进电机的抽象，以便您可以像控制直流电机一样控制它。它基于电流与电压成正比的原理（忽略电流动态），因此不需要任何电流检测硬件。有关此方法的更多信息，请访问我们的 [深入探讨部分](voltage_torque_control)。**这种转矩控制方法可以在任何无刷直流电机/步进电机驱动板上工作，无论它是否有电流检测功能。**

### 直流电流模式 - `dc_current`
直流电流控制模式使您能够像控制直流电机一样控制无刷直流电机/步进电机的电流。电流检测用于获取电机消耗的电流的整体大小及其方向，并且假设转矩与总电流成正比。这种方法的好处是，可以非常精确地控制设置给无刷直流电机/步进电机的真实电流，对于性能较差的微控制器（如 Atmega328 系列），执行起来更快、更稳定。

### FOC 电流模式 - `foc_current`
FOC 电流控制是唯一真正的转矩控制方法。它控制电流矢量 `q` 和 `d` 的两个分量。假设转矩与 `q` 电流分量成正比，并且电流的 `d` 分量被控制为保持等于 0。

## 项目示例
这是一个非常酷的项目示例，它使用了转矩控制，并描述了所需的完整硬件 + 软件设置。


<div class="image_icon width30">
    <a href="simplefoc_pendulum">
        <img src="extras/Images/foc_pendulum.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

在 [示例项目](examples) 部分中找到更多项目。