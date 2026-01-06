---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /arduino_simplefoc_shield
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---



# Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 示例
<span class="simple">Simple<span class="foc">FOC</span>Shield</span> 作为 Arduino UNO 扩展板，与任何具有相同接口的电路板兼容。从本质上讲，它是一款 L6234 芯片 breakout 板，采用 Arduino 扩展板的形式制作而成。

<p><img src="extras/Images/foc_shield_v13.png" class="img400"></p>

## 连接器类型
- 端子连接器
  - 电机相线 `a`、`b` 和 `c`
  - 电源电缆（12V 至 24V）
- 编码器连接器
  - 集成可配置上拉电阻

更多信息请访问此链接：[Arduino Simple FOC Shield](arduino_simplefoc_shield_showcase)。

## 编码器
- 通道 `A` 和 `B` 连接到编码器连接器 `P_ENC` 的 `A` 和 `B` 端子。
- 如果你的编码器有 `index` 信号，也可以将其连接到编码器连接器的 `I` 端子。

## 电机
- 电机相 `a`、`b` 和 `c` 直接连接到电机端子连接器 `TB_M1`


## 示例连接
<p><img src="extras/Images/foc_shield_v13.jpg" class="width60"></p>
