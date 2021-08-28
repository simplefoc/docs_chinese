---
layout: default
title: 力矩控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /torque_mode
nav_order: 1
has_children: True
has_toc: False
parent: 运动控制
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 力矩控制模式

<img src="extras/Images/torque_modes.gif">

<span class="simple">Simple<span class="foc">FOC</span>library</span>提供3种不同的力矩控制策略:

- [Voltage mode](voltage_torque_mode) - `voltage`
- [DC current mode](dc_current_torque_mode) - `dc_current`
- [FOC current mode](foc_current_torque_mode) - `foc_current`

### 电压模式 - `voltage`
基于电压的力矩控制是最基本的力矩控制模式，它为你提供了一个抽象的无刷直流电机，以便你可以控制它作为直流电机。

> wait to translate

它基于简单的欧姆定律(忽略了电流动态特性)，因此不需要任何电流检测相关的硬件。假若想了解有关此方法的更多信息，请访问我们的[digging deeper section](voltage_torque_control). **这种力矩控制方法无论其是否具有电流感应，都能够在任何无刷直流电机驱动板上工作。**

### 直流电流模式 - `dc_current`
基于直流电流的力矩控制能够像控制直流电机那样控制无刷电机。电流检测用于获取通过电机的电流大小及方向，我们假设力矩和总电流是成正比的。这种模式好处在于可以非常精确地控制无刷电机的实际电流，一些性能较低的处理器（如ATMega328系列）也能有较快较稳定的效果。

### FOC电流模式- `foc_current`
基于直流电流的力矩控制是唯一真正的力矩控制方法。它控制电流 `q和 ` `d`的两个分量。我们假设力矩与 `q` 电流分量成比例，并控制电流的 `d` 分量保持等于0。

### 比较

力矩控制类型 | 优点 | 缺点 
----- | ----- | ------
电压  | ✔️简单和快速 <br>✔️ 任何 MCU上都有良好的性能 <br>✔️ 低速行驶时非常平稳<br>✔️ 无需电流检测 | ❌ 在高速下不是最佳的 <br>❌ 不能控制真正的电流 <br>❌ 力矩为近似估值(低速时误差小) 
直流电流  | ✔️ 能控制真正电流 <br>✔️ 适用于低性能 MCU<br>✔️可实现电流限制 | ❌ 执行更复杂(更慢)<br>❌可以实现比电压模式更低的速度 <br>❌ 力矩为近似估值(低速时误差小)” <br>❌需要电流检测 
FOC电流  | ✔️真正的力矩控制(任意速度) <br>✔️ 能控制真正电流 <br>✔️在更高的速度下更高效<br>✔️可实现电流限制 | ❌ 执行最复杂(最慢) <br>❌ 不适合低性能的MCU(可能变得不稳定)。 <br>❌需要电流检测 

如果想了解有关运动控制策略的源代码实现的更多信息，请查看 [library source code documentation](motion_control_implementation)