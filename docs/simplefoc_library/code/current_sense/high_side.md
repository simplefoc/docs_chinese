---
layout: default
title: High-Side Current Sense
nav_order: 3
permalink: /high_side_current_sense
parent: Current Sensing
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 高侧电流检测
高侧电流检测可能是本库中讨论的三种电流检测中最不常见的一种。主要原因是因为它需要高压辅助放大器。采样电阻器位于高侧MOSFET和直流电源电压之间，使放大器的端子上始终有高压。这种方法的另一个缺点是，由于通过采样电阻的电流是相电流，因此只有当相应的高端mosfet开启时，我们才能在这些时刻测量它。PWM频率通常为20至50 kHz，这意味着高侧MOSFET每秒打开和关闭20000至50000次，因此PWM设置和ADC采集之间的同步非常重要。

当本项目支持内联和低侧检测后，高侧电流检测会相继开发。目前的主要问题是PWM生成和ADC触发需要特定的硬件的同步程序。因此，有可能在一个MCU体系结构中同时完成该植入。
<img src="extras/Images/high-side.png" class="width50">
<img src="extras/Images/high_side_sync.png" class="width40">