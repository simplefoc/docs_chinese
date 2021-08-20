---
layout: default
title: HMBGC V2.2
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /hmbgc
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# HMBGC V2.2 
使用HMBGC控制器进行FOC控制，需要将电机连接到其中一个电机接线柱，并将编码器连接到开发板的模拟信号引脚。下图为其接线实例：

<p>	<img src="extras/Images/hmbgc_connection.png" class="width50"> </p>
## 编码器
<blockquote class="warning"> <p class="heading">引脚限制</p>
HMBGC不能访问Arduino的外部中断引脚<code class="highlighter-rouge">2</code>和 <code class="highlighter-rouge">3</code>，我们唯一可以访问的引脚是模拟引脚<code class="highlighter-rouge">A0-A7</code>. 
因此我们需要使用软件中断库来读取编码器，请查看编码器<a href="encoder">代码实现</a> 获得更多信息。</blockquote>


请参考HMBGC代码例程(`HMBGC_example.ino`')来测试所有功能。

- 编码器A` 和 `B`连接到引脚`A0` 和 `A1`。  
- 如果你的编码器有`index`（索引）信号，可以将它连接到任何可用的引脚，上图连接的是引脚 `A2`。

## 电机
- 电机`a`相,`b` 相和`c`相直接连接到驱动器输出

- 电机接线`M1`使用Arduino引脚`9`、`10`、`11` ，接线 `M2`使用 `3`、`5`、`6`

  

<blockquote class="danger"> HMBGC板不支持磁传感器，因为它没有必需的SPI基础设施</blockquote>
## 连接实例

<p><img src="extras/Images/hmbgc_v22.jpg" class="width60">
</p>