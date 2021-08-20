---
layout: default
title: L6234 转接板
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /arduino_l6234
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Arduino UNO + L6234 芯片
[Drotek 的 L6234 评估板](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)是一款简易的三相无刷直流电机驱动器，非常适合作为入门开启你的FOC之旅。以下连接展示了两个关于这款驱动板和 Arduino UNO 的接线示例：

- [Arduino UNO + Drotek L6134 + 编码器](#encoder-example)
- [Arduino UNO + Drotek L6234 + 磁传感器 AS5048A](#magnetic-sensor-as5048-example)



# 编码器示例

<p> <img src="extras/Images/arduino_connection.png" class="width60"></p>  
### 编码器
- 编码器`A`和`B` 连接到Arduino的外部中断引脚 `2` 和 `3`。

- 如果你的编码器有`index` （基准）信号，可以将它连接到任何可用的引脚，上图连接的是引脚 `4`。

  - 对于 Arduino UNO 这种没有3个硬件中断的板子，最好将I信号接在A0-A5口，这会使得性能更强。
  - 反之，如若你使用其他有3个硬件中断引脚或以上的开发板，将I引脚连接到至其中一个中断引脚即可。



### L6234 评估板
- 连接到arduino引脚`9`、`10`和 `11`（你也可以使用  `5` 和 `6`）。
- 此外，你可以连接`enable` 引脚到arduino的任何支持数字量的引脚，图片上采用的是引脚`8`。当然，你也可以将驱动器使能端直接连接到5v。
- 电源记住要共地

### 电机
- 电机 `a`相、 `b`相 和`c`相直接连接到6234的输出口。

### 连接示例
<p><img src="extras/Images/uno_l6234.jpg" class="width60"></p>
## 以磁传感器AS5048为例

<p>
 <img src="extras/Images/arduino_connection_magnetic.png" class="width50">
</p>  

### 磁传感器
- 磁传感器（AS5048） SPI接口信号`SCK`，`MISO`和 `MOSI`连接到Arduino的 `SPI`引脚（Arduino UNO`13`,`12`和`11`）。
  - 如果程序需要用到多个传感器，所有传感器之间可并联。
- 在使用多个传感器时，每个传感器都要将其片选引脚单独于Arduino板子上的IO口连接。

### L6234 评估板
- 连接到arduino引脚 `3`、`5` 和 `6` (你也可以使用`9` 和 `10`，但`11` 是由SPI接口采取)。
- 此外，你可以连接`enable` 引脚到arduino的任何支持数字量的引脚，图片上采用的是引脚2。当然，你也可以将驱动器使能端直接连接到5v。
- 电源记住要共地

### 电机
- 电机 `a`相、 `b`相 和`c`相直接连接到6234的输出口。

<blockquote class="info"> <p class="heading">校准</p>
电机<code class="highlighter-rouge">a</code>相、<code class="highlighter-rouge">b</code>相、<code class="highlighter-rouge">c</code>相和编码器通道<code class="highlighter-rouge">A</code>、<code class="highlighter-rouge">B</code> 以及磁传感器计数方向必须正确，算法才能正常工作。但别太担心。最开始按照你的想法连接即可，如果电机运行不正常<code class="highlighter-rouge"></code>调转<code class="highlighter-rouge"></code>电机的两根相线就可以解决问题
</blockquote>



