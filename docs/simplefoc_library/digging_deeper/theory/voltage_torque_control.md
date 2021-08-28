---
layout: default
title: 转矩控制
parent: 理论
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /voltage_torque_control
---

# 基于电压的扭矩控制[v2.0.2](https://github.com/simplefoc/Arduino-FOC/releases)

在这个库中，我们使用电压作为扭矩控制参数的替代品，这是为什么，它是如何运行的?

## 这到底是如何运行的？

<a name="foc_image"></a><img src="extras/Images/voltage_loop.png">

电压控制算法从位置传感器读取角度<i>a</i>，从用户获取目标<i>U<sub>q</sub></i>电压值，通过FOC算法设置电机合适的<i>U<sub> a</sub></i>， <i>U<sub> b</sub></i> 和 <i>U<sub> c</sub></i>。FOC算法确保这些电压在电机转子中产生的磁力与其永磁体的<i>90度</i>偏移，这保证了最大扭矩，这称为换相。

对于精确实现直流电机原理来说这是一种困难的方法。因为对于直流电动机来说，转子所产生的磁场与定子所产生的永磁场之间的90度角是基于硬件实现的。现在，当你有FOC算法保证的90度约束，你可以使用这个电压控制方法去控制任何其他直流电机。

因此，对于直流电动机，我们知道电机扭矩 `T`与电流`I`成正比：

```cpp
T = I*K 
```
其中 `K` 是由其硬件定义的电机常数。
我们还知道，电流与设定的电压`U`成正比:

```cpp
I  = (U - EMF)/R
```

其中 `R`是电机内阻，`EMF`是产生的反EMF电压。这个方程没有考虑任何动力学因素，但总的来说还是很有效的。

所以我们可以从所有这些中得出的结论是（如果我们忽略EMF）：

```cpp
T ~ I ~ U
```
这意味着扭矩与电流成比例。而由于电流与电压成比例，那么扭矩也与电压成比例。

<blockquote class="danger"><p class="heading">注意：上述方法的约束！</p>这个成比例的假设只适用于静力学而不适用于动力学，这意味着由于不同的动力学效应将会有一些电流峰值。但如果电流不是很大，这些影响可以忽略。电流<5A。 <br>
对于真正的力矩控制环，我们需要测量电流，但用于电流测量的硬件在低功耗应用中并不常见，因此这种力矩控制实现是唯一绕过它的方法。</blockquote>






