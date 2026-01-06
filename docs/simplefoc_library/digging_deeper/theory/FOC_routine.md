---
layout: default
title: 磁场定向控制
parent: 理论
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /foc_theory
toc: true
---


# 磁场定向控制算法简介  [v2.0.2](https://github.com/simplefoc/Arduino-FOC/releases)

磁场定向控制算法的主要任务是接收用户定义的电压 <i>u<sub>q</sub></i>，并通过持续读取电机转子位置 <i>a</i>，计算出合适的相电压 <i>u<sub>a</sub></i>、<i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i>。

<img src="../extras/Images/voltage_loop.png">

FOC 算法计算出的相电压会在电机定子中产生磁场，该磁场与转子永磁体的磁场恰好成 90 度“滞后”，从而产生推动效果。这里有一个非常棒的动画，展示了在运行名为六步调制的简化版 FOC 时，电机内部的情况。

<iframe src='https://gfycat.com/ifr/MealyDeafeningHarpyeagle' frameborder='0' scrolling='no' allowfullscreen width='640' height='404'></iframe><p> <a href="https://gfycat.com/mealydeafeningharpyeagle">via Gfycat</a></p>

另一种理解为什么转子和定子磁场之间需要 90 度角的方式是，回忆一下通过磁场的导线所产生的电场力方程：

```cpp
F = B*I*L*sin(alpha)
```

其中，`B` 是磁场强度，`L` 是导线长度，`I` 是电流大小，`alpha` 是磁场 `B` 和电流 `I` 之间的夹角。从这个方程可以看出，为了获得最大力 `F = B*I*L`，我们需要保持 `alpha` 角等于 90 度或 `PI/2` 弧度。


## 如何计算合适的电压 <i>u<sub>a</sub></i>、<i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i>

由于 <span class="simple">Simple<span class="foc">FOC</span>library</span> 旨在用于 FOC 算法的教学以及支持各种应用，该库中实现了两种最标准的 FOC 调制版本。

- 正弦脉冲宽度调制：`SinePWM`
- 空间矢量脉冲宽度调制：`SpaceVectorPWM`

你可以通过设置 `motor.foc_modulation` 变量来配置它们：
```cpp
motor.foc_modulation = FOCModulationType::SinePWM; // default
// or
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```


### 正弦调制 `SinePWM`

正弦调制基于两个变换方程。

<img src="../extras/Images/foc_modulation.png" >

逆帕克变换：<br>

$$U_{\alpha} = U_q sin(\theta)$$

$$U_{\beta} = U_q cos(\theta)$$

逆克拉克变换<br>

$$u_a = U_{\alpha}$$

$$u_b = \frac{-U_{\alpha} + \sqrt{3}U_{\beta}}{2}$$

$$u_c = \frac{-U_{\alpha} - \sqrt{3}U_{\beta}}{2}$$

以下是SimpleFOC库中正弦脉冲宽度调制（Sinusoidal PWM）的实现代码：
```cpp
// Method using FOC to set Uq to the motor at the optimal angle
void BLDCMotor::setPhaseVoltage(float Uq, float angle_el) {
    // Sinusoidal PWM modulation 
    // Inverse Park + Clarke transformation

    // angle normalization in between 0 and 2pi
    // only necessary if using _sin and _cos - approximation functions
    angle_el = normalizeAngle(angle_el + zero_electric_angle);
    // Inverse park transform
    Ualpha =  -_sin(angle_el) * Uq;  // -sin(angle) * Uq;
    Ubeta =  _cos(angle_el) * Uq;    //  cos(angle) * Uq;

    // Inverse Clarke transform
    Ua = Ualpha + voltage_power_supply/2;
    Ub = -0.5 * Ualpha  + _SQRT3_2 * Ubeta + voltage_power_supply/2;
    Uc = -0.5 * Ualpha - _SQRT3_2 * Ubeta + voltage_power_supply/2;

    // set the voltages in hardware
    setPwm(Ua, Ub, Uc);
}
```

### 空间矢量调制 `SpaceVectorPWM`

空间矢量调制基于两个计算步骤：

<img src="../extras/Images/foc_modulation_svm.png" >

第一步，我们确定转子当前所在的扇区 <i>s</i>。360 度的角度被等分为 6 个 60 度的部分。所以这个计算非常直接。然后我们计算时间 <i>T<sub>0</sub></i>、<i>T<sub>1</sub></i> 和 <i>T<sub>2</sub></i>。<i>T<sub>1</sub></i> 和 <i>T<sub>2</sub></i> 告诉我们相 1 和相 2 应该导通多长时间，<i>T<sub>0</sub></i> 告诉我们电机应该有多长时间处于 0 电压状态。

<img src="../extras/Images/svm_1.png" style="margin-left:50px;margin-top:10px;margin-bottom:10px;width:250px"><br>


第二步是将 <i>T<sub>0,1,2</sub></i> 值投影到适当的占空比 <i>T<sub>a,b,c</sub></i>，这直接取决于电机当前所在的扇区。

扇区 | <i>T<sub>a</sub></i> | <i>T<sub>b</sub></i> | <i>T<sub>c</sub></i>
--- | --- | --- | ---
1| <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2 | <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2 | <i>T<sub>0</sub></i>/2
2| <i>T<sub>1</sub></i> +  <i>T<sub>0</sub></i>/2|<i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2 | <i>T<sub>0</sub></i>/2
3| <i>T<sub>0</sub></i>/2|  <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2| <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2
4| <i>T<sub>0</sub></i>/2|  <i>T<sub>1</sub></i>+ <i>T<sub>0</sub></i>/2| <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2
5| <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2|<i>T<sub>0</sub></i>/2 | <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2
6| <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2| <i>T<sub>0</sub></i>/2| <i>T<sub>1</sub></i> + <i>T<sub>0</sub></i>/2

以下是使用 SVM 表为参数生成的 pwm 信号示例：<i>s = 2</i>，<i><i>T<sub>1</sub></i> = 1/8 = 0.125</i>，<i><i>T<sub>2</sub></i> = 1/8 = 0.125</i> 和 <i><i>T<sub>0</sub></i> = 1/2 = 0.5</i>


<img src="../extras/Images/svm_dc.png" >


以下是SimpleFOC库中空间矢量脉冲宽度调制（Space Vector PWM）的实现代码：
```cpp
// Method using FOC to set Uq to the motor at the optimal angle
void BLDCMotor::setPhaseVoltage(float Uq, float angle_el) {
    // Nice video explaining the SpaceVectorModulation (SVPWM) algorithm 
    // https://www.youtube.com/watch?v=QMSWUMEAejg

    // if negative voltages change inverse the phase 
    // angle + 180degrees
    if(Uq < 0) angle_el += _PI;
    Uq = abs(Uq);

    // angle normalisation in between 0 and 2pi
    // only necessary if using _sin and _cos - approximation functions
    angle_el = normalizeAngle(angle_el + zero_electric_angle + _PI_2);

    // find the sector we are in currently
    int sector = floor(angle_el / _PI_3) + 1;
    // calculate the duty cycles
    float T1 = _SQRT3*_sin(sector*_PI_3 - angle_el) * Uq/voltage_power_supply;
    float T2 = _SQRT3*_sin(angle_el - (sector-1.0)*_PI_3) * Uq/voltage_power_supply;
    // two versions possible 
    // centered around voltage_power_supply/2
    float T0 = 1 - T1 - T2;
    // pulled to 0 - better for low power supply voltage
    //float T0 = 0;

    // calculate the duty cycles(times)
    float Ta,Tb,Tc; 
    switch(sector){
    case 1:
        Ta = T1 + T2 + T0/2;
        Tb = T2 + T0/2;
        Tc = T0/2;
        break;
    case 2:
        Ta = T1 +  T0/2;
        Tb = T1 + T2 + T0/2;
        Tc = T0/2;
        break;
    case 3:
        Ta = T0/2;
        Tb = T1 + T2 + T0/2;
        Tc = T2 + T0/2;
        break;
    case 4:
        Ta = T0/2;
        Tb = T1+ T0/2;
        Tc = T1 + T2 + T0/2;
        break;
    case 5:
        Ta = T2 + T0/2;
        Tb = T0/2;
        Tc = T1 + T2 + T0/2;
        break;
    case 6:
        Ta = T1 + T2 + T0/2;
        Tb = T0/2;
        Tc = T1 + T0/2;
        break;
    default:
        // possible error state
        Ta = 0;
        Tb = 0;
        Tc = 0;
    }

    // calculate the phase voltages
    Ua = Ta*voltage_power_supply;
    Ub = Tb*voltage_power_supply;
    Uc = Tc*voltage_power_supply;

    // set the voltages in hardware
    setPwm(Ua, Ub, Uc);
}
```


## 我应该使用哪一个？

以下是正弦调制和空间矢量调制在 <i>U<sub>q</sub> = 0.5V</i> 时生成的波形图像。

正弦 | 空间矢量
--- | ---
<img src="../extras/Images/0.5.jpg" class="img400"> | <img src="../extras/Images/svm0.5.jpg"  class="img400">

这两种算法之间有几个关键区别。但就 <span class="simple">Simple<span class="foc">FOC</span>library</span> 而言，你只需要知道空间矢量算法能更好地利用电源的最大电压范围。在上面的表格中，你可以看到对于 <i>U<sub>q</sub> = 0.5V</i>，正弦调制生成的正弦波幅度恰好等于 1，而空间矢量调制还没有达到这个程度。空间矢量产生的“双正弦”波的幅度降低了 `2/sqrt(3) = 1.15` 倍，这意味着使用相同的电源，它可以向电机输送 15% 更多的功率。

这意味着，对于你的电源电压 <i>V<sub>power_supply</sub></i>，当使用 `SinePWM` 时，你能够设置的最大 <i>U<sub>q</sub> = 0.5 V<sub>power_supply</sub> </i>，而如果使用 `SpaceVectorPWM`，你能够设置的最大 <i>U<sub>q</sub> = 0.58 V<sub>power_supply</sub> </i>
 
电源电压 <i>V<sub>power_supply</sub></i> 你应该通过更改参数 `motor.voltage_power_supply` 的值来指定。默认值设置为 `12V`。如果你将 <i>V<sub>power_supply</sub></i> 设置为其他值，请在此处更改，以便 FOC 算法适应适当的 <i>U<sub>q</sub></i>（`motor.voltage_q`）值。

```cpp
// power supply voltage
motor.voltage_power_supply = 12;
```
<blockquote class="warning"> <p class="heading">如果我不指定这个参数会怎样？</p>
如果你不设置 <code class="highlighter-rouge">motor.voltage_power_supply</code>，算法仍然会工作，但你的 <code class="highlighter-rouge">motor.voltage_q</code> 值将不再等于实际输出电压。
</blockquote>
<img src="../extras/Images/sine_foc.png" >


### 当我超过最大 <i>U<sub>q</sub></i> 时会发生什么？

如果你尝试将电压 <i>U<sub>q</sub></i> 设置为高于 `SinePWM` 的 <i>U<sub>q</sub> = 0.5 V<sub>power_supply</sub> </i> 或 `SpaceVectorPWM` 的 <i>U<sub>q</sub> = 0.58 V<sub>power_supply</sub> </i>，它仍然会工作，但 <i>U<sub>a,b,c</sub></i> 信号将会饱和。

以下是不同 <i>U<sub>q</sub></i> 值下 `SinePWM` 的几张图像。

<i>U<sub>q</sub> = 0.5 V<sub>power_supply</sub> </i> | <i>U<sub>q</sub> = 0.6 V<sub>power_supply</sub> </i> | <i>U<sub>q</sub> = V<sub>power_supply</sub> </i>
--- | --- | ---
<img src="../extras/Images/0.5.jpg" class="img200"> | <img src="../extras/Images/0.6.jpg"  class="img200"> | <img src="../extras/Images/1.jpg"  class="img200">

基本上，你在图像上可以看到，<i>U<sub>a,b,c</sub></i> 已经饱和，并且在超过最大值后，你实际上不再向电机设置正弦波了。
电机仍然会获得一些功率增加，但不再是线性或平滑的。

<blockquote class="warning"> <p class="heading">经验法则</p>
实际上，电机在 <i>U<sub>q</sub> ~ 0.7 V<sub>power_supply</sub> </i> 之前都能察觉到差异。超过这个值后，<i>U<sub>a,b,c</sub></i> 过于饱和，进一步增加 <i>U<sub>q</sub></i> 不会导致电机功率增加。

但是每个电机都略有不同，你可以轻松地凭经验检查这些值。只需将电机置于电压控制下，观察在电压 <i>U<sub>q</sub></i> 的哪个值之后，你再也看不到电机功率的提升（它会停止加速）。
</blockquote>

## 进一步阅读

有关初始化过程、实时执行和实现细节的更多信息，请访问 [FOC 实现文档](foc_implementation)。