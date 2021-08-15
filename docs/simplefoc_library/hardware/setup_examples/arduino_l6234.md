---
layout: default
title: L6234 Breakout Board
parent: Setup examples
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /arduino_l6234
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Arduino UNO + L6234 驱动器
[Drotek 的 L6234 转接板](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)是一款非常简单的三相无刷直流电机驱动器，非常适合由此开启你的FOC之旅。这里我们展示了两个关于这款驱动板和 Arduino UNO 的接线示例：

- [Arduino UNO + Drotek L6134 + 编码器](#encoder-example)
- [Arduino UNO + Drotek L6234 + 磁传感器 AS5048A](#magnetic-sensor-as5048-example)



# 编码器示例

<p> <img src="extras/Images/arduino_connection.png" class="width60"></p>  

### 编码器
- 编码器通道`A`和`B` 连接到Arduino的外部中断引脚 `2` 和 `3`。

- 如果你的编码器有`index` 信号，可以将它连接到任何可用的引脚，上图连接的是引脚 `4`。

  - 对于 Arduino UNO 和类似的没有3个硬件中断的板子，由于中断实例的要求，可以选择的话最好将I引脚连接到引脚 `A0-A5`，这样它将有更好的性能（但任何其他引脚也可以工）。
  - 反之，如若你使用其他板子并且有3个硬件中断引脚，连接I引脚至其中一个即可。



### L6234 转接板 
- 连接到arduino引脚`9`、`10`和 `11`（你也可以使用  `5` 和 `6`）。
- 此外，你可以连接`enable` 引脚到arduino的任何数字引脚，图片显示的是引脚`8`，但这是可选的。你也可以将驱动器使能端直接连接到5v。
- 请确保将电源和Arduino的公共端连接好。

### 电机
- 电机 `a`相、 `b`相 和`c`相直接连接到驱动器输出。

### 连接示例
<p><img src="extras/Images/uno_l6234.jpg" class="width60"></p>

## 以磁传感器AS5048为例

<p>
 <img src="extras/Images/arduino_connection_magnetic.png" class="width50">
</p>  

### 磁传感器
- 磁传感器（AS5048） SPI接口信号`SCK`，`MISO`和 `MOSI`连接到Arduino的 `SPI`引脚（Arduino UNO`13`,`12`和`11`）。
  - 如果应用程序需要多个传感器，所有传感器都连接到Arduino的相同引脚。
- `chip select`引脚连接到所需的引脚。每个连接到同一个Arduino的传感器必须有唯一的芯片选择引脚。

### L6234 转接板
- 连接到arduino引脚 `3`、`5` 和 `6` (你也可以使用`9` 和 `10`，但`11` 是由SPI接口采取)。
- 此外，你可以连接`enable`引脚到arduino的任何数字引脚，图片显示的是引脚 `2`，但这是可选的。你也可以直接将驱动器使能端连接到5v。
- 请确保将电源和Arduino的公共端连接好。

### 电机
- 电机`a`相、 `b`相 和 `c`相直接连接到驱动器输出

<blockquote class="info"> <p class="heading">校准</p>
电机<code class="highlighter-rouge">a</code>相、<code class="highlighter-rouge">b</code>相、<code class="highlighter-rouge">c</code>相和编码器通道<code class="highlighter-rouge">A</code>、<code class="highlighter-rouge">B</code> 以及磁传感器计数方向必须正确，算法才能正常工作。但别太担心。连接它最初如你所愿，然后如果电机锁在地方逆<code class="highlighter-rouge">a</code>和<code class="highlighter-rouge">b</code>的电机，那应该是足够的。
</blockquote>



