---
layout: default
title: 电流检测对齐
parent: 理论
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 5
permalink: /current_sense_align
toc: true
---

# 电流检测自动对齐程序

电流检测与电机相的对齐是电机控制中至关重要的一部分。为了使FOC算法正常工作，我们需要确保电流检测所测量的电流与实际电机电流相对应。这是电机控制中的第一步，非常关键，只有正确完成这一步，无刷直流电机（BLDC）或步进电机才能正常运转。😃

本页面将详细介绍电流检测对齐的原理以及自动对齐程序的工作方式。

## 对齐意味着什么？

定义电流检测和电机相对齐的主要因素有两个：
1. 电流检测ADC通道`A`测量电机/驱动器相`A`的电流，通道`B`测量电机/驱动器相`B`的电流，以此类推。
2. 电流检测ADC通道测量相电流的极性与电机驱动器的极性相同。

由于这是电机控制的关键部分，<span class="simple">Simple<span class="foc">FOC</span>库</span>提供了自动电流检测对齐程序，帮助您将电流检测与电机相对齐。
当然，如果您确定驱动器PWM引脚、电流检测ADC引脚和增益值设置正确，则可以跳过此步骤，并将`current_sense.skip_align`变量设置为`true`（更多信息请参见[电流检测](/current_sense)文档）。


## 工作原理

该程序基于将电机视为以电机相为电阻的电路这一观点，原理简单。

<img src="extras/Images/bldc.png" class="width40">
<img src="extras/Images/stepper_align.png" class="width40">

对齐程序还假设电机的相电阻是相等的。这是无刷直流电机和步进电机的常见假设，也是电流检测对齐的良好起点。

然后，对齐程序在一个相上施加相电压，并将其他相接地。通过已知施加的相电压，并将电机抽象为一个简单的三电阻电路，我们可以计算出应该流过电机相的电流，并将其与电流检测所测量的电流进行比较。如果电流不相同，则说明电流检测未对齐，程序将尝试进行对齐。


由于步进电机和无刷直流电机的结构不同，其对齐程序也有所不同。
- 无刷直流电机对齐程序在此处描述：[无刷直流电机对齐程序](#无刷直流电机对齐程序)
- 步进电机对齐程序在此处描述：[步进电机对齐程序](#步进电机对齐程序)

## 无刷直流电机对齐程序

<img src="extras/Images/bldc.png" class="width40">

在以下部分中，我将尝试更详细地解释该程序。如果解释有些混乱，敬请谅解，我会在将来努力使其更清晰。😃

### 文字描述的程序步骤


#### 将A相设置为高电平并测量电流

<img src="extras/Images/bldc_align_a.png" align="right" class="width20">
- 我们向A相施加一定的相电压$$U_a$$，并将B相和C相接地（右侧图像）。
- 然后测量A相、B相和C相的电流（取决于它们是否可用）。
- 我们期望看到的是，A相上的电流$$I_a$$最大（是其他相电流的两倍）且为正。B相和C相上的电流$$I_b$$和$$I_c$$应为负，其大小约为A相电流$$I_a$$的一半。

$$I_a = \frac{U_a}{R_a}, \quad  I_b = I_c = -0.5 I_a$$


#### 初始电流检查
- 首先，我们检查测量到的电流大小是否高于100mA。
- 如果不高于100mA，我们将停止程序，因为电流太低，无法准确测量。

#### 找到电流$$I_a$$
- 在$$I_a$$、$$I_b$$和$$I_c$$中找到最大电流值。
- 验证其大小大约是其他两个电流的两倍：
    - 如果找到，将其ADC通道分配给A相，并验证其极性为正（必要时调整增益反转）。
    - 如果没有电流是其他两个电流的两倍，则说明A相未被测量。<br>
      验证是否有一个电机相不应该被测量（没有分配ADC引脚/通道 - 例如，为`_NC`）
        - 如果有一个相不应该被测量（电流检测有2个ADC引脚被指定，共3个），则将电机的A相指定为未测量（ADC引脚为`_NC`）。
        - 如果所有电流都应该被测量（电流检测中所有3个ADC引脚都被指定），则出现错误，程序停止。
    - 如果我们顺利到达此步骤，说明A相与电流检测的ADC通道A对齐，我们可以继续进行B相和C相的对齐。


#### 将B相设置为高电平并测量电流
- 我们向B相施加一定的相电压$$U_b$$，并将A相和C相接地（右侧图像）。
- 然后测量A相、B相和C相的电流（取决于它们是否可用）。
- 我们期望看到的是，B相上的电流$$I_b$$最大（是其他相电流的两倍）且为正。A相和C相上的电流$$I_a$$和$$I_c$$应为负，其大小约为B相电流$$I_b$$的一半。

$$I_b = \frac{U_b}{R_b}, \quad  I_a = I_c = -0.5 I_b$$

<img src="extras/Images/bldc_align_b.png"  align="right" class="width30">

#### 找到电流$$I_b$$
- 在$$I_b$$和$$I_c$$中找到最大电流值，并验证其大小大约是其他两个电流的两倍。
    - 如果找到，将其ADC通道分配给A相，并验证其极性为正（必要时调整增益反转）。
    - 如果没有电流是其他两个电流的两倍，则说明B相未被测量。<br>
      然后我们验证是否有ADC通道B或C不应该被测量
        - 如果有一个相不应该被测量（其中一个为`_NC`），我们将电机的B相指定为未测量。
        - 如果两个电流都应该被测量（电流检测中所有3个ADC引脚都被指定），则出现错误，程序停止。
    - 如果我们顺利到达此步骤，说明A相和B相分别与电流检测的ADC通道A和B对齐。

#### 找到电流$$I_c$$
- 剩下的第三个（也是唯一一个）ADC通道可以分配给C相，并验证其极性为负（必要时调整增益反转）。

### 程序步骤流程图
<img src="extras/Images/current_sense_align.png">


## 步进电机对齐程序

<img src="extras/Images/stepper_align.png" class="width40">

在以下部分中，我将尝试更详细地解释该程序。如果解释有些混乱，敬请谅解，我会在将来努力使其更清晰。😃

### 文字描述的程序步骤

#### 将A相设置为高电平并测量电流

<img src="extras/Images/stepper_align_a.png" align="right" class="width20">
- 我们向A相施加一定的相电压$$U_a$$，并将B相接地（右侧图像）。
- 然后测量A相和B相的电流。
- 我们期望看到的是，A相上的电流$$I_a$$最大且为正，而B相上的电流$$I_b$$应为负且接近零。

$$I_a = \frac{U_a}{R_a}, \quad  I_b = 0$$


#### 初始电流检查
- 首先，我们检查测量到的电流大小是否高于100mA。
- 如果不高于100mA，我们将停止程序，因为电流太低，无法准确测量。


#### 找到电流$$I_a$$
- 在$$I_a$$和$$I_b$$中找到最大电流值。
- 将其ADC通道分配给A相，并验证其极性为正（必要时调整增益反转）。


#### 将B相设置为高电平并测量电流

<img src="extras/Images/stepper_align_b.png" align="right" class="width20">
- 我们向B相施加一定的相电压$$U_b$$，并将A相接地（右侧图像）。
- 然后测量A相和B相的电流。
- 我们期望看到的是，B相上的电流$$I_b$$最大且为正，而A相上的电流$$I_a$$应为负且接近零。

$$I_b = \frac{U_b}{R_b}, \quad  I_a = 0$$

#### 找到电流$$I_b$$
- 验证电流$$I_b$$是否最大，并将其ADC通道分配给B相，同时验证其极性为正（必要时调整增益反转）。

### 程序步骤流程图
<img src="extras/Images/current_sense_align_stepper.png">

### 代码中的实现流程
电流检测对齐流程在 current_sense.alignStepperDriver() 函数中实现，该函数会在 motor.initFOC() 内部被调用。
当电机初始化且 current_sense.skip_align 未设置为 true 时，该函数会自动执行。函数代码可通过此[链接](https://github.com/simplefoc/Arduino-FOC/blob/996f312841812f1bf5d2f724a7d3e37edd6d9343/src/common/base_classes/CurrentSense.cpp#L386-L473)查看。



