---
layout: default
title: STM32 Bluepill
parent: Setup examples
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 5
permalink: /bluepill_connection
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>使用Stm32 Bluepill using the Arduino
---


# Stm32 Bluepill —— 使用 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield </span>
<span>Simple<span>FOC</span>Shield </span>是一个BLDC驱动，不仅可以与带有 Arduino UNO 头的驱动板一起使用，还可以作为一个独立的驱动板。

这里有一个如何使Stm32 Bluepill 和 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>连接的示例：

<p><img src="extras/Images/bluepill_foc_shield_v13.png" class="width60"></p>
更多信息，请查看 [Arduino Simple FOC Shield](arduino_simplefoc_shield_showcase).


<p><img src="extras/Images/bluepill_pinout.jpg" class="img400"></p>

<blockquote class="info"><p class="heading">Bluepill 引脚</p>确保在分配BLDC驱动器引脚之前查询引脚。它们必须支持PWM。</blockquote>

## 编码器

- 通道`A`和 `B` 连接到 `PB9`和 `PB8`。
- 如果你的编码器有`index` 信号，你也可以将它连接到电路板上，例如在`PB7`上。
<blockquote class="info"><p class="heading">注意</p>任何数字引脚都可以是STM32板上的外部中断引脚。</blockquote>

## 连接 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 

- 将`PWMa`，`PWMb`和 `PWMc`信号连接到Bluepill的 `PA10`, `PA9` 和 `PA8`。
- 连接 `enable`引脚到任何数字引脚，如 `PA11`。
- 连接公共端 `GND`。
- 连接电源线。

## 电机
- 电机`a`相、`b` 相和 `c`相 直接连接电机端子连接器 `TB_M1`。


## 连接示例
<p><img src="extras/Images/bluepill_foc_shield.jpg" class="width60"></p>
