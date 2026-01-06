---
layout: default
title: STM32 Nucelo-64
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 4
permalink: /nucleo_connection
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---



# 使用 Arduino <span class="simple">简易<span class="foc">FOC</span>扩展板</span>的 Stm32 Nucleo-64
<span class="simple">简易<span class="foc">FOC</span>扩展板</span>作为 Arduino UNO 扩展板，与任何具有相同插针的板卡兼容，其中就包括 STM32 Nucleo-64 板卡。

以下是 Arduino <span class="simple">简易<span class="foc">FOC</span>扩展板</span>的连接方案：

<p><img src="extras/Images/foc_shield_v13_nucleo.png" class="img400"></p>

## 连接器类型
- 端子连接器
  - 电机相线 `a`、`b` 和 `c`
  - 电源电缆（12V 至 24V）
- 编码器连接器
  - 集成可配置上拉电阻

更多信息请访问此链接：[Arduino 简易 FOC 扩展板](arduino_simplefoc_shield_showcase)。

## 编码器
- 通道 `A` 和 `B` 连接到编码器连接器 `P_ENC` 的 `A` 和 `B` 端子。
- 如果你的编码器有 `index` 信号，也可以将其连接到编码器连接器的 `I` 端子。

<blockquote class="info"><p class="heading">注意</p> 在 STM32 板卡上，任何数字引脚都可以作为外部中断引脚。</blockquote>

## 电机
- 电机相线 `a`、`b` 和 `c` 直接连接到电机端子连接器 `TB_M1`。

## 示例连接
<p><img src="extras/Images/nucleo_foc_shield_connection.jpg" class="width60"></p>
