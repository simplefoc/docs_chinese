---
layout: default
title: 驱动板
parent: 支持的硬件
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /drivers
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: true
has_toc: false
---

# 支持的驱动板

<div class="width60">
<img src="extras/Images/drv8302.png" style="width:25%;display:inline"><img src="extras/Images/bgc_30.jpg" style="width:25%;display:inline"><img src="extras/Images/l6234.jpg" style="width:25%;display:inline"><img src="extras/Images/l298n.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>的目标是支持尽可能多的无刷直流电机和步进电机驱动板。到目前为止，该库支持两种类型的电机驱动板：

- [无刷直流电机驱动板 <i class="fa fa-external-link"></i>](bldc_drivers)
    - **3 路 PWM 信号**（3 相）
    - **6 路 PWM 信号**（3 相）
    - 云台电机驱动板或高性能驱动板
- [步进电机驱动板 <i class="fa fa-external-link"></i>](stepper_drivers)
    - **4 路 PWM 信号**（2 相）
    - **2 路 PWM 信号 + 2 路方向信号**（2 相）
    - 步进电机驱动板或双直流电机驱动板

## 📢 在选择驱动板之前请务必阅读以下内容！
在使用 <span class="simple">简易<span class="foc">FOC</span>库</span>运行任何无刷直流电机之前，请确保您的硬件能够承受电机所需的电流。

最简单的方法是检查电机相电阻 `R`。您可以查看电机的数据手册查找电阻值，也可以使用万用表自行测量。然后检查电源电压 `V_dc` 的值，得到这些值后，您可以通过计算得出最大电流 `I_max` 的值：...您可以通过计算得出最大电流 `I_max` 的值：

I_max = V_dc/R

最后，将计算出的最大电流 `I_max` 与驱动板的数据手册进行核对。如果 `I_max` 过高，您可以降低电源电压 `V_dc` 以防止电流峰值过高。如果无法改变电源电压，您可以通过软件限制施加到电机的电压。
<blockquote class="warning">
    <p class="heading">注意</p>
    上面的公式计算的是最坏情况下的最大电流 <code class="highlighter-rouge">I_max</code>，在大多数情况下，计算出的 <code class="highlighter-rouge">I_max</code> 高于实际值。最大电流取决于电机硬件（如绕组配置）和控制算法。
</blockquote>