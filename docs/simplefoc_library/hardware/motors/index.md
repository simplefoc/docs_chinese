---
layout: default
title: 电机
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /motors
parent: 支持的硬件
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: true
has_toc: false
---

# 支持的电机

<div class="width60">
<img src="extras/Images/mot2.jpg" style="width:20%;display:inline"><img src="extras/Images/bigger.jpg" style="width:20%;display:inline"><img src="extras/Images/mot.jpg" style="width:20%;display:inline"><img src="extras/Images/nema17_2.jpg" style="width:20%;display:inline"><img src="extras/Images/nema17_1.jpg" style="width:20%;display:inline">
</div>

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>支持两种类型的无刷直流电机：

- [无刷直流电机 <i class="fa fa-external-link"></i>](bldc_motors)
  - 三相（3线）：
  - 云台和高性能无刷直流电机
- [步进电机 <i class="fa fa-external-link"></i>](stepper_motors)
  - 两相（4线）

## 📢 运行任何电机之前请务必阅读以下内容！

在使用 <span class="simple">简易<span class="foc">FOC</span>库</span>运行任何无刷直流电机之前，请确保您的硬件能够承受电机所需的电流。

最简单的方法是检查电机相电阻 `R`。您可以查看电机的数据手册查找电阻值，或者[使用万用表自行测量](phase_resistance)。

然后检查您的电源电压 `V_dc` 的值，获得这些值后，您可以通过计算得出最大电流 `I_max` 值：

```cpp
I_max = V_dc/R
```

最后，将最大电流 `I_max` 的值与驱动板的数据手册进行核对。如果 `I_max` 过高，您可以降低电源电压 `V_dc` 以防止电流峰值过高。如果您无法更改电源电压，可以通过软件限制施加到电机的电压。
<blockquote class="warning">
    <p class="heading">注意</p>
    上面的公式计算的是最坏情况下的最大电流 <code class="highlighter-rouge">I_max</code>，在大多数情况下，计算出的 <code class="highlighter-rouge">I_max</code> 高于实际值。最大电流取决于电机硬件（如绕组配置）和控制算法。
</blockquote>

