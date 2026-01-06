---
layout: default
title: STM32 Bluepill
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 5
permalink: /bluepill_connection
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---



# 使用 Arduino <span class="simple">简易<span class="foc">FOC</span>屏蔽板</span>的 Stm32 Bluepill
<span class="simple">简易<span class="foc">FOC</span>屏蔽板</span>作为一款 BLDC 驱动器，不仅可以与带有 Arduino UNO 接口的开发板配合使用，还可以作为独立的驱动板。

以下是如何将 Stm32 Bluepill 与 Arduino <span class="simple">简易<span class="foc">FOC</span>屏蔽板</span>连接的示例：

<p><img src="extras/Images/bluepill_foc_shield_v13.png" class="width60"></p>
有关 [Arduino 简易 FOC 屏蔽板](arduino_simplefoc_shield_showcase) 的更多信息。

<p><img src="extras/Images/bluepill_pinout.jpg" class="img400"></p>

<blockquote class="info"><p class="heading">Bluepill 引脚图</p> 分配 BLDC 驱动器引脚前，请务必参考引脚图。这些引脚必须具备 PWM 功能。</blockquote>

## 编码器
- 通道 `A` 和 `B` 连接到 `PB9` 和 `PB8`。
- 如果编码器有 `index` 信号，也可以将其连接到开发板，例如连接到 `PB7`。
<blockquote class="info"><p class="heading">注意</p> 在 STM32 开发板上，任何数字引脚都可以作为外部中断引脚。</blockquote>

## <span class="simple">简易<span class="foc">FOC</span>扩展板</span>连接
- 将 `PWMa`、`PWMb` 和 `PWMc` 信号连接到 Bluepill 的 `PA10`、`PA9` 和 `PA8`。
- 将 `使能` 引脚连接到任何数字引脚，例如 `PA11`。
- 连接公共接地 `GND`。
- 连接电源电缆。

## 电机
- 电机相 `a`、`b` 和 `c` 直接连接到电机端子连接器 `TB_M1`。

## 示例连接
<p><img src="extras/Images/bluepill_foc_shield.jpg" class="width60"></p>