---
layout: default
title: 低通滤波器
parent: 理论
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 4
permalink: /low_pass_filter
toc: true
---


# 低通速度滤波器理论[v2.0.2](https://github.com/simplefoc/Arduino-FOC/releases)
低通滤波器的传递函数为：

<p><img src="./extras/Images/cont_LPF.png" /></p>
其离散形式为：

<p><img src="./extras/Images/dis_LPF.png" /></p>

其中，<i>v<sub>f</sub>(k)</i> 是时刻 <i>k</i> 的滤波后速度值，<i>v(k)</i> 是时刻 <i>k</i> 的测量速度，<i>T<sub>f</sub></i> 是滤波器时间常数，<i>T<sub>s</sub></i> 是采样时间（或方程两次执行之间的时间）。
这个低通滤波器也可以写成以下形式：

<p><img src="./extras/Images/LPF_alpha.png" /></p>

其中：

<p><img src="./extras/Images/alpha.png" /></p>

这更清楚地说明了低通滤波器的时间常数 `Tf` 代表什么。如果你的采样时间约为 1 毫秒（对于 Arduino UNO，这可以作为平均值），那么将 `Tf` 值设置为 `Tf = 0.01` 将导致：


```cpp
alpha = 0.01/(0.01 + 0.001) = 0.91
```

这意味着实际速度测量值 <i>v</i> 将以系数 `1-alpha = 0.09` 影响滤波后的值 <i>v<sub>f</sub></i>，这将显著平滑速度值（可能甚至过度平滑，具体取决于应用）。


## 实现细节

低通滤波函数在 <span class="simple">Simple<span class="foc">FOC</span>库</span> 中实现为一个名为 `LowPassFilter` 的类。
该类在构造函数中接收时间常数。
```cpp
LowPassFilter filter = LowPassFilter(0.001); // Tf = 1ms
```
滤波函数的实现逻辑如下：
```cpp
// low pass filtering function
float LowPassFilter::operator(float input){
  unsigned long timestamp = _micros();
  float dt = (timestamp - timestamp_prev)*1e-6f;
  // quick fix for strange cases (micros overflow)
  if (dt < 0.0f || dt > 0.5f) dt = 1e-3f;

  // calculate the filtering 
  float alpha = Tf/(Tf + dt);
  float y = alpha*y_prev + (1.0f - alpha)*x;

  // save the variables
  y_prev = y;
  timestamp_prev = timestamp;
  return y;
}
```
在代码中只需通过调用即可使用：
```cpp
float signal_filtered = filter(signal);
```
并且你可以随时通过以下代码行更改滤波常数：
```cpp
filter.Tf = 0.01; // changed to 10ms
```
该低通滤波器在电机类中实现，其时间常数可通过调用以下方法进行更改：
```cpp
motor.LPF_velocity.Tf = 0.01;// to set it to 10ms
```

