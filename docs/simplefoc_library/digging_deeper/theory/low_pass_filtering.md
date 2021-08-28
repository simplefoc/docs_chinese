---
layout: default
title: 低通滤波器
parent: 理论
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 4
permalink: /low_pass_filter
---

# 低通速度滤波器v2.0.2](https://github.com/simplefoc/Arduino-FOC/releases)

控制器的低通滤波器传递函数为:

$$
G_f = \frac{1}{1+sT_f}
$$

离散化为:

$$
v_f(k)=\frac{T_f}{T_f+T_s}v_f(k-1)+\frac{T_S}{T_f+T_s}v(k)
$$


其中<i>v<sub>f</sub>(k)</i>为k时刻的滤波值， <i>v(k)</i>为<i>k</i>时刻的速度测量值， <i>T<sub>f</sub></i>是滤波时间常数，<i>T<sub>s</sub></i>是采样时间（或上述式子的时间间隔）。
这个低通滤波器也可以写成这样的形式:
$$
v_f(k)=\alpha v_f(k-1)+(1-\alpha)v(k)
$$
其中：

$$
\alpha=\frac{T_f}{T_f+T_s}
$$




上面的式子更直观地表示了在低通滤波器中常量T<sub>f</sub>的意义。如果你的采样时间大约是1毫秒(对于arduino UNO，这可以作为平均值)，那么设置 `T_f = 0.01` 将得到:

```cpp
alpha = 0.01/(0.01 + 0.001) = 0.91
```

上式表示实际的速度测量值v会通过系数1-alpha = 0.09影响到滤波后的值v<sub>f</sub>，从而令速度的变化更加平滑（平滑程序取决于实际应用）。

# 实现细节

要在<span>Simple<span>FOC </span></span>library中是名为`LowPassFilter`的类来实现低通滤波的。
这个类在构造函数中接收时间常量:

```cpp
LowPassFilter filter = LowPassFilter(0.001); // Tf = 1ms
```


滤波的实现如下:

```cpp
// 低通滤波函数
float LowPassFilter::operator(float input){
  unsigned long timestamp = _micros();
  float dt = (timestamp - timestamp_prev)*1e-6f;
  // 快速修复错误的情况 (micros overflow)
  if (dt < 0.0f || dt > 0.5f) dt = 1e-3f;

  // 计算过滤
  float alpha = Tf/(Tf + dt);
  float y = alpha*y_prev + (1.0f - alpha)*x;

  // 保存的变量
  y_prev = y;
  timestamp_prev = timestamp;
  return y;
}
```
你可以在代码中调用它:
```cpp
float signal_filtered = filter(signal);
```
也可以随时改变滤波的时间常数:
```cpp
filter.Tf = 0.01; // 改变为10ms
```
这个低通滤波器是在motor中实现的，它的时间常数可以通过调用改变:

```cpp
motor.LPF_velocity.Tf = 0.01;// 设置为10ms
```

