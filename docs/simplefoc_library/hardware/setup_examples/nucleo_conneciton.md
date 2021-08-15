---
layout: default
title: STM32 Nucelo-64
parent: Setup examples
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 4
permalink: /nucleo_connection
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# Stm32 Nucleo-64 —— 使用 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
<span>Simple<span>FOC</span>Shield</span>为Arduino UNO Shield，可兼容任何类型的板，其中一个是STM32 Nucleo-64板。

这里是Arduino <span>Simple<span>FOC</span>Shield</span>连接方案：

<p><img src="extras/Images/foc_shield_v13_nucleo.png" class="img400"></p>

## 连接器类型
 - 终端连接器
    - 电机相位为`a`、`b` 和 `c`
    - 电源线（12V ~ 24V）
 - 编码器连接器
    - 集成可配置的 pull-ups

更多信息在此链接：[Arduino Simple FOC Shield](arduino_simplefoc_shield_showcase)。

## 编码器
- 通道`A` 和`B`'连接到编码器连接器`P_ENC`，终端`A` 和 `B` 。
- 如果你的编码器有`index`信号，你也可以将它连接到编码器连接器，终端`I`。

<blockquote class="info"><p class="heading">注意</p>任何数字引脚都可以是STM32板上的外部中断引脚。</blockquote>


## 电机

- 电机`a`相 、`b`相和 `c`相直接连接电机端子连接器`TB_M1`


## 连接示例
<p><img src="extras/Images/nucleo_foc_shield_connection.jpg" class="width60"></p>
