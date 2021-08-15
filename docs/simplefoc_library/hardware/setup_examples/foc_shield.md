---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 
parent: Setup examples
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /arduino_simplefoc_shield
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Arduino<span class="simple">Simple<span class="foc">FOC</span>Shield </span>示例

<span>Simple<span>FOC</span>Shield</span>为Arduino UNO Shield，兼容任何类型的板，具有相同的板头。
本质上，它是一个Arduino Shield形式的L6234芯片转接板。

<p><img src="extras/Images/foc_shield_v13.png" class="img400"></p>

## 连接器类型
 - 终端连接器
    - 电机相位为`a`、`b` 和 `c`
    - 电源线（12V ~ 24V）
 - 编码器连接器
    - 集成可配置的 pull-ups

更多信息在此链接：[Arduino Simple FOC Shield](arduino_simplefoc_shield_showcase)。

## 编码器
- 通道 `A` 和 `B`连接到编码器连接器 `P_ENC`，终端`A` 和 `B` 。
- 如果你的编码器有`index` 信号，你也可以将它连接到编码器连接器，终端 `I`。

## 电机
- 电机`a`相, `b`相和 `c`相直接连接电机端子连接器 `TB_M1`


## 连接示例
<p><img src="extras/Images/foc_shield_v13.jpg" class="width60"></p>
