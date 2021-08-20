---
layout: default
title: 支持的驱动板
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
Arduino <span>Simple<span>FOC</span>library</span>的目标是支持尽可能多的无刷直流电机和步进电机驱动器。到目前为止，这个库支持两种驱动器类型:

- [无刷直流电机驱动器 <i class="fa fa-external-link"></i>](bldc_drivers)
    - **3路PWM信号**（3相）
    - **6路PWM信号**（3相）
    - 云台电机驱动器或高性能驱动器
- [步进电机驱动器 <i class="fa fa-external-link"></i>](stepper_drivers)
    - **4路PWM信号**（2相）
    - 步进驱动器或双直流电机驱动器

# 📢在确定使用何种类型驱动之前一定要读一下这篇文章!

在用SFOC运行任何无刷电机前请首先确保你的运行硬件能够通过足够大的电机所需的电流。

最简单的方法是通过检查电机的相电阻`R`。检查你的电机的数据表，查找电阻值，或者用万用表自己测量。然后检查你的电源电压 `V_dc` 的值，测量出来的数值能帮助你推算出最大电流 `I_max` 值。

```cpp
I_max = V_dc/R
```
最后，根据驱动板数据表检查最大电流 `I_max` 值。如果 `I_max` 过高，可以降低电源电压`V_dc` ，以防止电流峰值过高。如果你不能改变你的供电电压，可以在软件中限制电机的电压设置。

<blockquote class="warning">
    <p class="heading">注意</p>
   由上式可以计算出最坏情况下的最大电流<code class="highlighter-rouge">I_max</code>，而大多数情况下计算出的<code class="highlighter-rouge">I_max</code>会大于实际值。实际最大电流取决于电机硬件，如绕组配置和控制算法。
</blockquote>
