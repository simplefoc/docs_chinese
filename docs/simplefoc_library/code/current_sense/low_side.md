---
layout: default
title: Low-Side Current Sense
nav_order: 2
permalink: /low_side_current_sense
parent: Current Sensing
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 低侧电流检测
低侧电流检测可能是最常见的电流检测技术。主要原因是它既不需要高性能PWM抑制电流检测放大器（如内联放大器），也不需要高压支持放大器（如高压侧放大器）。采样电阻器始终置于低侧MOSFET和地之间，确保放大器的端子上始终具有非常低的电压。这种方法的主要缺点是，由于通过采样电阻器的电流是相电流，因此只有当相应的低侧mosfet开启时，我们才能在这些时刻测量它。PWM频率通常为20至50 kHz，这意味着低侧MOSFET每秒打开和关闭20000至50000次，因此PWM设置和ADC采集之间的同步非常重要。

低侧电流传感将很快完成。目前的主要问题是PWM生成和ADC触发需要特定的硬件的同步程序。因此，有可能在一个MCU体系结构中同时完成该植入。

<img src="extras/Images/low-side.png" class="width50">
<img src="extras/Images/low_side_sync.png" class="width40">