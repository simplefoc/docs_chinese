---
layout: default
title: 高侧电流检测
nav_order: 3
permalink: /high_side_current_sense
parent: 电流检测
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 高侧电流检测
高侧电流检测可能是本库所讨论的三种电流检测中最不常见的一种。主要原因是因为它需要有支持高压的放大器。采样电阻位于高侧MOSFET和电源之间，会令放大器始终会有高压差。这种方法的另一个缺点是，由于只有相应的高侧mosfet开启时，通过采样电阻的电流才是相电流，而我们只能在这些时刻测量到相电流。PWM频率通常为20至50 kHz，这意味着低侧MOSFET每秒开关20000至50000次，因此PWM设置和ADC采集之间的同步非常重要。。

当本项目支持在线检测和低侧检测后，高侧电流检测会相继开发。目前的主要问题是PWM生成和ADC触发需要特定的硬件的同步程序。因此，低侧电流检测可能会先在其中一种MCU结构中先完成。
<img src="extras/Images/high-side.png" class="width50">
<img src="extras/Images/high_side_sync.png" class="width40">