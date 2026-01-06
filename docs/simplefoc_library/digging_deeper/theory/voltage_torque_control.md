---
layout: default
title: 力矩控制
parent: 理论
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /voltage_torque_control
toc: true
---


# 使用电压进行扭矩控制 [v2.0.2](https://github.com/simplefoc/Arduino-FOC/releases)
在这个库中，我们使用电压来替代扭矩控制，这是为什么呢？它到底是如何工作的呢？

## 具体工作原理

<a name="foc_image"></a><img src="extras/Images/voltage_loop.png">

电压控制算法从位置传感器读取角度a，从用户那里获取目标Uq电压值，并使用FOC算法为电机设置适当的ua、ub和uc电压。FOC算法确保这些电压在电机转子中产生的磁力与转子的永久磁场正好形成90度偏移，这保证了最大扭矩，这一过程称为换相。

这是实现直流电机原理的一种复杂方式。因为对于直流电机来说，转子中产生的磁场与定子永久磁场之间的90度角是由硬件实现的，这对终端用户来说很简单。
当通过软件（FOC算法）确保了90度的约束后，你就可以像使用任何其他电压控制的直流电机一样使用这种电机。

因此，对于直流电机，我们知道电机扭矩T与电流I成正比：
```cpp
T = I*K 
```
其中K是由电机硬件决定的电机常数。
我们还知道电流与设定电压U成正比：

```cpp
I  = (U - EMF)/R
```

其中R是电机电阻，EMF是产生的反电动势。这个方程没有考虑任何动态因素，但一般来说已经足够好用了。

所以我们可以得出结论（如果忽略反电动势）：
```cpp
T ~ I ~ U
```
这意味着扭矩与电流成正比，而由于电流与电压成正比，那么扭矩也与电压成正比。

<blockquote class="danger"><p class="heading">这种方法的限制：请注意！</p> 这种比例关系的假设只在静态情况下成立，在动态情况下并不成立，这意味着由于不同的动态效应，我们会遇到一些电流峰值。但如果电流不是太大，这些效应可以忽略不计。电流<5A<br>
对于真正的扭矩控制回路，我们需要测量电流，但在低功率应用中，电流测量硬件并不常见，这使得这种扭矩控制实现成为唯一的解决方法。</blockquote>

