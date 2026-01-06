---
layout: default
title: 高侧电流检测
nav_order: 3
permalink: /high_side_current_sense
parent: 电流检测
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 高侧电流检测
高侧电流检测可能是本库中讨论的三种电流检测技术中最不常用的一种。主要原因是它需要支持高压的放大器。分流电阻被放置在高侧 MOSFET 与直流电源电压之间，这使得放大器的端子上始终存在高压。这种方案的另一个缺点是，只有当对应的高侧 MOSFET 导通时，流过分流电阻的电流才是相电流，因此我们只能在这些时刻对其进行测量。PWM 频率通常为 20 至 50kHz，这意味着高侧 MOSFET 每秒会导通和关断 20,000 至 50,000 次，因此 PWM 设置与 ADC 采集之间的同步至关重要。

高侧电流检测将在串联式和低侧电流检测得到支持后再进行实现。目前的主要问题是 PWM 生成与 ADC 触发的同步过程具有极强的硬件特异性。因此，这种实现可能会针对每种微控制器架构逐一完成。


<img src="extras/Images/high-side.png" class="width50">
<img src="extras/Images/high_side_sync.png" class="width40">