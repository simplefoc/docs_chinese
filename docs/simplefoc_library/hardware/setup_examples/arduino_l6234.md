---
layout: default
title: L6234 转接板
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /arduino_l6234
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# Arduino UNO + L6234 驱动器
[Drotek 的 L6234  breakout 板](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html) 是一款非常简约的三相无刷直流电机驱动器，非常适合快速开启你的 FOC 体验。这里我们展示使用该板与 Arduino UNO 的两个示例连接：

- [Arduino UNO + Drotek L6234 + 编码器](#编码器示例)
- [Arduino UNO + Drotek L6234 + 磁传感器 AS5048A](#磁传感器-as5048-示例)

## 编码器示例
<p> <img src="extras/Images/arduino_connection.png" class="width60"></p>  

### 编码器
- 编码器通道 `A` 和 `B` 连接到 Arduino 的外部中断引脚 `2` 和 `3`。
- （可选）如果你的编码器有 `index` 信号，你可以将其连接到任何可用引脚，图中显示为引脚 `4`。
  - 对于 Arduino UNO 和类似的开发板，它们没有 3 个硬件中断，如果可以选择，最好将索引引脚连接到 `A0-A5` 引脚，由于中断程序的原因，这样会有更好的性能（但其他任何引脚也可以工作）。
  - 否则，如果你使用不同的开发板并且有 3 个硬件中断引脚，将索引引脚连接到其中一个即可。

### L6234 breakout 板
- 连接到 Arduino 引脚 `9`、`10` 和 `11`（你也可以使用引脚 `5` 和 `6`）。
- 此外，你可以将 `使能` 引脚连接到 Arduino 的任何数字引脚，图中显示为引脚 `8`，但这是可选的。你可以将驱动器使能直接连接到 5V。
- 确保连接电源和 Arduino 的公共接地。

### 电机
- 电机相 `a`、`b` 和 `c` 直接连接到驱动器输出端。

### 示例连接
<p><img src="extras/Images/uno_l6234.jpg" class="width60"></p>

## 磁传感器 AS5048 示例

<p>
 <img src="extras/Images/arduino_connection_magnetic.png" class="width50">
</p>  

### 磁传感器
- 磁传感器（AS5048）的 SPI 接口信号 `SCK`、`MISO` 和 `MOSI` 连接到 Arduino 的 `SPI` 引脚（Arduino UNO 的 `13`、`12` 和 `11`）。
  - 如果应用需要多个传感器，所有传感器都连接到 Arduino 的相同引脚。
- `片选` 引脚连接到所需引脚。连接到同一 Arduino 的每个传感器必须有唯一的片选引脚。

### L6234 breakout 板
- 连接到 Arduino 引脚 `3`、`5` 和 `6`（你也可以使用引脚 `9` 和 `10`，但引脚 `11` 被 SPI 接口占用）。
- 此外，你可以将 `使能` 引脚连接到 Arduino 的任何数字引脚，图中显示为引脚 `2`，但这是可选的。你可以将驱动器使能直接连接到 5V。
- 确保连接电源和 Arduino 的公共接地。

### 电机
- 电机相 `a`、`b` 和 `c` 直接连接到驱动器输出端。

<blockquote class="info"> <p class="heading">对齐</p>
电机相 <code class="highlighter-rouge">a</code>、<code class="highlighter-rouge">b</code>、<code class="highlighter-rouge">c</code> 以及编码器通道 <code class="highlighter-rouge">A</code> 和 <code class="highlighter-rouge">B</code> 与磁传感器计数方向必须正确定向，算法才能工作。但不必过于担心这一点。最初按你的意愿连接，如果电机锁定不动，调换电机的 <code class="highlighter-rouge">a</code> 相和 <code class="highlighter-rouge">b</code> 相，通常就足够了。
</blockquote>
