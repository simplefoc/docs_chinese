---
layout: default
title: 电机配置代码
nav_order: 2
parent: 代码
permalink: /motors_config
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 电机配置代码

<div class="width60">
<img src="extras/Images/mot2.jpg" style="width:20%;display:inline"><img src="extras/Images/bigger.jpg" style="width:20%;display:inline"><img src="extras/Images/mot.jpg" style="width:20%;display:inline"><img src="extras/Images/nema17_2.jpg" style="width:20%;display:inline"><img src="extras/Images/nema17_1.jpg" style="width:20%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 支持两种类型的无刷直流电机：

- [BLDC motors（无刷直流电机） <i class="fa fa-external-link"></i>](bldcmotor) 
  - 3 相 （3 线）
  - 云台高性能无刷直流电机
- [Stepper motors（步进电机） <i class="fa fa-external-link"></i>](steppermotor) 
  - 2 相 （4 线）

电机代码的编写可以支持多种不同的电机，并且可以实现可以实现替换。

## 深入挖掘
更多 FOC 算法和运动控制方法的理论解释和源代码实现，请查看 [深入挖掘的部分](digging_deeper) 。