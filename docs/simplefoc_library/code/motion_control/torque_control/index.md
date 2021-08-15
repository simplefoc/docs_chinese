---
layout: default
title: Torque Mode
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /torque_mode
nav_order: 1
has_children: True
has_toc: False
parent: Motion Control
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 转矩控制模式

<img src="extras/Images/torque_modes.gif">

<span class="simple">Simple<span class="foc">FOC</span>library</span>让你选择使用3种不同的转矩控制策略:

- [Voltage mode](voltage_torque_mode) - `voltage`
- [DC current mode](dc_current_torque_mode) - `dc_current`
- [FOC current mode](foc_current_torque_mode) - `foc_current`

### 电压模式 - `voltage`
通过电压的转矩控制是最基本的转矩控制类型，它为你提供了一个抽象的无刷直流电机，以便你可以控制它作为直流电机。它基于电流与电压成正比的原理(它忽略了电流动态)，因此不需要任何电流传感硬件。假若想了解有关此方法的更多信息，请访问我们的[digging deeper section](voltage_torque_control). **这种转矩控制方法将能够在任何无刷直流电机驱动板上工作，无论其是否具有电流感应。**

### 直流电流模式 - `dc_current`
直流电流控制模式使你能够控制直流电机的电流，就像它是直流电机一样。电流传感用来获得电机所牵引的电流的总体大小及其方向，假设转矩与总体电流成比例。这种方法的好处是，可以非常精确地控制设置到无刷直流电机的真正电流，对于性能较差的微控制器(如Atmega328系列)，它的执行速度更快，更稳定。

### FOC电流模式- `foc_current`
FOC电流控制是唯一真正的转矩控制方法。它控制电流矢量 `q和 ` `d`的两个分量。假设转矩与 `q` 电流分量成比例，并控制电流的 `d` 分量保持等于0。

### 比较

转矩控制类型 | 优点 | 缺点 
----- | ----- | ------
电压  | ✔️非常简单和快速 <br>✔️ 良好的性能与任何 MCU <br>✔️ 低速行驶时非常平稳<br>✔️ 不需要当前意义 | ❌ 在高速下不是最佳的 <br>❌ 不能控制真正的电流 <br>❌ 转矩近似(低速时误差小) 
直流电流  | ✔️ 能控制真电流吗 <br>✔️ 适用于低性能 MCUs <br>✔️限流 | ❌ 执行更复杂(更慢)<br>❌可以实现比电压模式更低的速度 <br>❌ 转矩近似(低速时的低误差)” <br>❌需要电流传感 
FOC电流  | ✔️真转矩控制(任意速度) <br>✔️ 能控制真电流吗 <br>✔️在更高的速度下非常有效<br>✔️ 限流 | ❌ 执行最复杂(最慢) <br>❌ 不适合低性能的MCUS(可能变得不稳定)。 <br>❌需要电流传感 

如果想了解有关运动控制策略的源代码实现的更多信息，请查看 [library source code documentation](motion_control_implementation)