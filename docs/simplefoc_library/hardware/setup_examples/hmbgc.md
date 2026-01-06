---
layout: default
title: HMBGC V2.2
parent: 设置实例
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /hmbgc
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---



# HMBGC V2.2 示例
要使用 HMBGC 控制器进行矢量控制（FOC），你需要将电机连接到其中一个电机端子，并将编码器连接到模拟引脚。以下图片展示了 HMBGC 板的必要连接示意图以及一个实际的连接示例。

<p>	<img src="extras/Images/hmbgc_connection.png" class="width50"> </p>


## 编码器
<blockquote class="warning"> <p class="heading">引脚限制</p>
HMBGC 无法访问 Arduino 的外部中断引脚 <code class="highlighter-rouge">2</code> 和 <code class="highlighter-rouge">3</code>，而且我们唯一可以访问的引脚是模拟引脚 <code class="highlighter-rouge">A0-A7</code>。
因此，我们需要使用软件中断库来读取编码器通道，更多信息请查看编码器 <a href="encoder">代码实现</a>。</blockquote>

请查看 HMBGC 代码示例（`HMBGC_example.ino`）以测试所有功能。

- 编码器通道 `A` 和 `B` 连接到引脚 `A0` 和 `A1`。
- （可选）如果你的编码器有 `index` 信号，你可以将其连接到任何可用引脚，图中显示的是引脚 `A2`。

## 电机
- 电机相 `a`、`b` 和 `c` 直接连接到驱动器输出端
- 电机端子 `M1` 使用 Arduino 引脚 `9`、`10`、`11`，`M2` 使用 `3`、`5`、`6`




				HTML


​					
​				
​				
​						
​				

			 HMBGC 板不支持磁传感器，因为它没有必要的 SPI 接口。

## 示例连接
<p><img src="extras/Images/hmbgc_v22.jpg" class="width60">
</p>