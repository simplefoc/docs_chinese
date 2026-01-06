---
layout: default
title: 电机配置代码
nav_order: 2
parent: 编写代码
permalink: /motors_config
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 电机配置代码

<div class="width60">
<img src="extras/Images/mot2.jpg" style="width:20%;display:inline"><img src="extras/Images/bigger.jpg" style="width:20%;display:inline"><img src="extras/Images/mot.jpg" style="width:20%;display:inline"><img src="extras/Images/nema17_2.jpg" style="width:20%;display:inline"><img src="extras/Images/nema17_1.jpg" style="width:20%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>支持两种类型的无刷直流电机：

- [无刷直流电机 <i class="fa fa-external-link"></i>](bldcmotor)
  - 三相（3线）：
  - 云台和高性能无刷直流电机
- [步进电机 <i class="fa fa-external-link"></i>](steppermotor)
  - 步进电机：两相（4线）
  - 📢 新增：混合步进电机：两相（3线）

电机代码的编写方式旨在支持尽可能多的不同电机，并且具有完全的互换性。

## 深入了解
有关FOC算法和运动控制方法的更多理论解释和源代码实现，请查看[深入了解部分](digging_deeper)。