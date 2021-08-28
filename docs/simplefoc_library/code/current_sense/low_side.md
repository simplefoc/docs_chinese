---
layout: default
title: 低侧电流检测
nav_order: 2
permalink: /low_side_current_sense
parent: 电流检测
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 低侧电流检测
低侧电流检测可能是最常见的电流检测技术。主要原因是它既不需要高性能PWM抑制电流检测放大器（如在线检测放大器），也不需要支持高压的放大器（如高侧放大器）。采样电阻始终置于低侧MOSFET和地之间，确保放大器的端子上始终具有非常低的电压。这种方法的主要缺点是，由于只有相应的低侧mosfet开启时，通过采样电阻的电流才是相电流，而我们只能在这些时刻测量到相电流。PWM频率通常为20至50 kHz，这意味着低侧MOSFET每秒开关20000至50000次，因此PWM设置和ADC采集之间的同步非常重要。

低侧电流电测将很快完成。目前的主要问题是PWM生成和ADC触发需要特定的硬件的同步程序。因此，低侧电流检测可能会先在其中一种MCU结构中先完成。

<img src="extras/Images/low-side.png" class="width50">
<img src="extras/Images/low_side_sync.png" class="width40">