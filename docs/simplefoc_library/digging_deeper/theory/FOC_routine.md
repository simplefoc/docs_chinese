---
layout: default
title: FOC介绍
parent: 理论
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /foc_theory
---

# 

# **FOC算法的简要介绍 [v2.0.2](https://github.com/simplefoc/Arduino-FOC/releases)**



Field oriented control (FOC) 算法的主要任务是基于用户定义的电压 <i>u<sub>q</sub></i>，通过连续读取电机转子位置 <i>a</i>，计算出适当的相电压<i>u<sub>a</sub></i>,<i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i>。

<img src="../extras/Images/voltage_loop.png">



FOC算法在电机转子中产生磁场的相位电压，该磁场正好在转子的永磁体的磁场后面90度，创造了一个推动效应。这是一个很好的动画表示，当运行简化版的FOC即六步调制时，电机内部发生了什么。

<iframe src='https://gfycat.com/ifr/MealyDeafeningHarpyeagle' frameborder='0' scrolling='no' allowfullscreen width='640' height='404'></iframe><p> <a href="https://gfycat.com/mealydeafeningharpyeagle">via Gfycat</a></p>
另一种理解为什么我们需要在转子和定子磁场之间形成90度角的方法是记住导线穿过磁场时产生的电场的方程：

```cpp
F = B*I*L*sin(alpha)
```

其中`B` 是磁场的强度， `L`是导电流的大小， `alpha`是磁场`B`和电流, `I`之间的角度。从这个方程中我们可以看到，为了获得最大的力 `F = B*I*L` ，我们需要保持`alpha`角等于90度或 `PI/2`弧度。



# 如何计算<i>u<sub>a</sub></i>，<i>u<sub>b</sub></i> 和<i>u<sub>c</sub></i> 的恰当电压值

由于Simple FOC library 的目的是关于FOC算法的知识以及支持各种应用，两个最标准的FOC调制版本在这个库中实现。

- 正弦PWM: `SinePWM`
- 空间矢量PWM: `SpaceVectorPWM`

可以通过设置 `motor.foc_modulation` 的变量值进行配置：

```cpp
motor.foc_modulation = FOCModulationType::SinePWM; // default
// or
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```



# 正弦调制`SinePWM`

正弦调制法是基于两个变换方程。

<img src="../extras/Images/foc_modulation.png" >

逆派克变换法：<br>

<img src="../extras/Images/inverse_park.png" style="margin-left:50px;margin-top:10px;margin-bottom:10px;width:150px"><br>

逆克拉克变换法：<br>

<img src="../extras/Images/inverse_clarke.png" style="margin-left:50px;margin-top:10px;margin-bottom:10px;width:180px">

以下是在中实现正弦PWM的代码:

```cpp
// 使用FOC将Uq设置到电机的最佳角度
void BLDCMotor::setPhaseVoltage(float Uq, float angle_el) {
    // 正弦PWM调制 
    // 逆派克+克拉克变换

    // 角度在0和360°之间的归一化
    // 仅当使用_sin和_cos近似函数时才需要
    angle_el = normalizeAngle(angle_el + zero_electric_angle);
    // 逆派克变换
    Ualpha =  -_sin(angle_el) * Uq;  // -sin(angle) * Uq;
    Ubeta =  _cos(angle_el) * Uq;    //  cos(angle) * Uq;

    // 你克拉克变换
    Ua = Ualpha + voltage_power_supply/2;
    Ub = -0.5 * Ualpha  + _SQRT3_2 * Ubeta + voltage_power_supply/2;
    Uc = -0.5 * Ualpha - _SQRT3_2 * Ubeta + voltage_power_supply/2;

    // 给硬件设定电压
    setPwm(Ua, Ub, Uc);
}
```



# 空间矢量调制 `SpaceVectorPWM`

空间矢量调制基于两个步骤的计算:

<img src="../extras/Images/foc_modulation_svm.png" >

在第一步，我们发现扇区<i>s</i>转子目前在。360度的角被分成6等份的60度。这个计算很简单。然后我们计算时间<i>T<sub>0</sub></i>, <i>T<sub>1</sub></i> 和 <i>T<sub>2</sub></i>。<i>T<sub>1</sub></i> 和 <i>T<sub>2</sub></i>告诉我们第一阶段和第二阶段应该开多久，<i>T<sub>0</sub></i>告诉我们电机上0电压应该开多久。

<img src="../extras/Images/svm_1.png" style="margin-left:50px;margin-top:10px;margin-bottom:10px;width:250px"><br>

第二步是将<i>T<sub>0,1,2</sub></i>值投影到适当的占空比<i>T<sub>a,b,c</sub></i>，这些占空比直接取决于电机当前所在的扇区。

Sector | <i>T<sub>a</sub></i> | <i>T<sub>b</sub></i> | <i>T<sub>c</sub></i>
--- | --- | --- | ---
1| <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2 | <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2 | <i>T<sub>0</sub></i>/2
2| <i>T<sub>1</sub></i> +  <i>T<sub>0</sub></i>/2|<i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2 | <i>T<sub>0</sub></i>/2
3| <i>T<sub>0</sub></i>/2|  <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2| <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2
4| <i>T<sub>0</sub></i>/2|  <i>T<sub>1</sub></i>+ <i>T<sub>0</sub></i>/2| <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2
5| <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2|<i>T<sub>0</sub></i>/2 | <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2
6| <i>T<sub>1</sub></i> + <i>T<sub>2</sub></i> + <i>T<sub>0</sub></i>/2| <i>T<sub>0</sub></i>/2| <i>T<sub>1</sub></i> + <i>T<sub>0</sub></i>/2

下面是一个例子使用SVM表生成pwm信号的参数: <i>s = 2</i>, <i><i>T<sub>1</sub></i> = 1/8 = 0.125</i>, <i><i>T<sub>2</sub></i> = 1/8 = 0.125</i> and <i><i>T<sub>0</sub></i> = 1/2 = 0.5</i>

<img src="../extras/Images/svm_dc.png" >

这里是空间矢量PWM实现的代码在 Simple<span class="foc">FOC</span>library :

```cpp
// 使用FOC将Uq设置到电机的最佳角度
void BLDCMotor::setPhaseVoltage(float Uq, float angle_el) {
    // 解释SpaceVectorModulation (SVPWM)算法的视频如下
    // https://www.youtube.com/watch?v=QMSWUMEAejg

    // 如果负电压的变化与相相反
    // 角度 +180°
    if(Uq < 0) angle_el += _PI;
    Uq = abs(Uq);

    // 角度归一化，在0和360°之间
    // 仅当使用_sin和_cos近似函数时才需要
    angle_el = normalizeAngle(angle_el + zero_electric_angle + _PI_2);

    // 找到我们目前所在的象限
    int sector = floor(angle_el / _PI_3) + 1;
    // 计算占空比
    float T1 = _SQRT3*_sin(sector*_PI_3 - angle_el) * Uq/voltage_power_supply;
    float T2 = _SQRT3*_sin(angle_el - (sector-1.0)*_PI_3) * Uq/voltage_power_supply;
    // 两个版本 
    // 以电压电源为中心/2
      float T0 = 1 - T1 - T2;
    // 低电源电压，拉到0
    //float T0 = 0;

    // 计算占空比（时间）
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
         // 可能的错误状态
          Ta = 0;
          Tb = 0;
          Tc = 0;
      }

      // 计算相电压和中心
      Ua = Ta*voltage_power_supply;
      Ub = Tb*voltage_power_supply;
      Uc = Tc*voltage_power_supply;
      break;
  }
  
  // 设置硬件中的电压
  setPwm(Ua, Ub, Uc);
}
```



# 我们应如何选择?

这是由 <i>U<sub>q</sub> = 0.5V</i>的正弦和空间矢量调制产生的波形图像：

Sinusoidal | Space Vector
--- | ---
<img src="../extras/Images/0.5.jpg" class="img400"> | <img src="../extras/Images/svm0.5.jpg"  class="img400">

这两种算法之间有几个关键的区别。但就<span><span class="simple">Simple<span class="foc">FOC</span>library</span></span>而言，你需要知道的就是空间矢量算法更好地使用了电源的最大电压范围。在上面的表格中，你可以看到，对于<i>U<sub>q</sub> = 0.5V</i>，正弦调制产生的正弦波的幅度正好等于1，空间矢量调制还不是平静的。由空间矢量产生的“双正弦波”的幅值为 `2/sqrt(3) = 1.15` ，这意味着在使用相同的电源时，它可以向电机多输出15%的功率。

这意味着,当使用`SinePWM`时，你的供电电压 <i>V<sub>power_supply</sub></i>可以设置最大为 <i>U<sub>q</sub> = 0.5 V<sub>power_supply</sub> </i>。如果使用 `SpaceVectorPWM`，你将能够设置<i>U<sub>q</sub> = 0.58 V<sub>power_supply</sub> </i> 

你应该通过改变电机参数`motor.voltage_power_supply`的值来指定电源电压<i>V<sub>power_supply</sub></i>。默认值为 `12V`。如果你需要设置你的<i>V<sub>power_supply</sub></i>为其他值，在这里更改它，FOC算法将据此调整适当的<i>U<sub>q</sub></i> (`motor.voltage_q`)值。

```cpp
// 电源电压
motor.voltage_power_supply = 12;
```
<blockquote class="warning"> <p class="heading">如果我不指定这个参数呢?</p>
如果你没有指定<code class="highlighter-rouge">motor.voltage_power_supply</code>算法仍然有效，但你<code class="highlighter-rouge">motor.voltage_q</code>的值将不再等于实际输出电压。
</blockquote>

<img src="../extras/Images/sine_foc.png" >



# 当我超过最大值<i>U<sub>q</sub></i>时会发生什么?

如果你试着把电压 <i>U<sub>q</sub></i>高于<i>U<sub>q</sub> = 0.5 V<sub>power_supply</sub> </i> 给 `SinePWM`或 <i>U<sub>q</sub> = 0.58 V<sub>power_supply</sub></i>给`SpaceVectorPWM`,它仍然会工作,但 <i>U<sub>a,b,c</sub></i>信号会饱和。

这里有一些 `SinePWM`的不同<i>U<sub>q</sub></i>值的图像。

<i>U<sub>q</sub> = 0.5 V<sub>power_supply</sub> </i> | <i>U<sub>q</sub> = 0.6 V<sub>power_supply</sub> </i> | <i>U<sub>q</sub> = V<sub>power_supply</sub> </i>
--- | --- | ---
<img src="../extras/Images/0.5.jpg" class="img200"> | <img src="../extras/Images/0.6.jpg"  class="img200"> | <img src="../extras/Images/1.jpg"  class="img200">

基本上你可以在图像上看到的是<i>U<sub>a,b,c</sub></i>是饱和的，在你超过最大值后，你实际上不再设置正弦波到你的电机。
电机的功率仍在增加，但不再是直线或平滑的。

<blockquote class="warning"> <p class="heading">经验法则</p>
在现实中，电机可以看到的差异一直到<i>U<sub>q</sub> ~ 0.7 V<sub>power_supply</sub> </i>。在此值之后，<i>U<sub>a,b,c</sub></i>过于饱和，<i>U<sub>q</sub></i>的进一步增加不会导致电机功率的增加。


但是每一个电机都有点不同，你可以很容易地根据经验检查这些值。将电机置于电压控制中，查看电压*<i>U<sub>q</sub></i>*后，电机功率将不再有改善(它将停止加速)。

</blockquote>

# 进一步阅读

有关初始化过程、实时执行和实现细节的更多信息，请访问[FOC implementation docs](foc_implementation).

