---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /arduino_simplefoc_shield
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Arduino<span class="simple">Simple<span class="foc">FOC</span>Shield </span>

SimpleFOC Shield是一个基于Arduino UNO开发的板子，兼容与Arduino UNO引脚排列一致的开发板直接插入使用。

<p><img src="extras/Images/foc_shield_v13.png" class="img400"></p>
## 接线柱描述
 - 电机和编码器接线柱
    - 电机相位为`a`、`b` 和 `c`
    - 电源线（12V ~ 24V）
 - 编码器接线柱
    - 集成上拉电阻

更多信息请点击此链接：[Arduino Simple FOC Shield](arduino_simplefoc_shield_showcase)。

## 编码器
-  `A` 和 `B`连接到编码器接线柱`P_ENC`，`A` 和 `B`位置 。
- 如果你的编码器有`index`（基准） 信号，你也可以将它连接到编码器接线柱 `I`位置。

## 电机
- 电机`a`相, `b`相和 `c`相直接连接电机接线柱 `TB_M1`


## 连接示例
<p><img src="extras/Images/foc_shield_v13.jpg" class="width60"></p>
