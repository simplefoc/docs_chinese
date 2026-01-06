---
layout: default
title:  v3.x 
parent: 焊盘部分
grand_parent: 开始上手
description: "Configuring your SimpleFOCShield by soldering the pads."
nav_order: 3
permalink: /pads_soldering_v3
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
toc: true
---

<style>
.inline_table {
  margin: 1em;
  display:inline-block;
}
.tight_table th,td {
  min-width: 100px !important;  
}
</style>

# 使用焊盘进行硬件配置 <br> <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small>v3</small>
Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>的一个非常重要的特性是硬件可配置性。

<img src="extras/Images/v3_pads.gif" class="width40">

每个电路板的底部都有一组焊盘，用于配置设备。这些焊盘可实现以下功能：

- 配置BLDC驱动器引脚（PWM引脚A、B、C和使能引脚）- [查看更多](#自定义引脚分配)
- 启用/禁用编码器A、B和索引通道的上拉电阻 - [查看更多](#启用编码器霍尔传感器上拉电阻)
- 配置编码器/霍尔传感器连接 - [查看更多](#自定义引脚分配)
- 启用/禁用线性稳压器为MCU供电 - [查看更多](#启用板载稳压器为MCU供电)
- 配置数字电压电平VDD - [查看更多](#配置逻辑电压电平vdd)
- 配置电流检测的引脚分配 - [查看更多](#配置电流检测引脚分配)
- 配置故障和复位引脚 - [查看更多](#配置故障和复位引脚)

## 启用编码器/霍尔传感器上拉电阻

<img src="extras/Images/v3_pads_encoder_pul.jpg" class="width30">

每个电路板都集成了三个3.3KΩ的上拉电阻，分别用于编码器的A、B通道和索引通道（或霍尔传感器的U、V、W通道）。上图展示了如何焊接焊盘以启用这些上拉电阻。

并非所有编码器都需要上拉电阻，实际上，大多数编码器不需要。但对于追求成本优化的用户来说，很多廉价的Ebay/Aliexpress编码器（如[600P ebay编码器 <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/360-600P-R-Photoelectric-Incremental-Rotary-Encoder-5V-24V-AB-Two-Phases-Shaft/254214673272?hash=item3b30601378:g:AZsAAOSwu~lcxosc)及类似型号）会需要这些上拉电阻。

<blockquote class="info" markdown="1">
<span class="simple">Simple<span class="foc">FOC</span>Shield</span> v3.1版本只有一个焊盘，用于同时启用三个通道的上拉电阻。而v3.2版本则有三个独立的焊盘。无论哪种版本，若要使用上拉电阻，需将所有相关焊盘焊接在一起。
</blockquote>

## 启用I2C上拉电阻

<img src="extras/Images/v3_pads_i2c_pul.jpg" class="width30">

从盾牌[<i class="fa fa-tag"></i>1.3.2版本](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)开始，电路板集成了4.7KΩ的上拉电阻，用于I2C通信引脚。上图展示了如何焊接焊盘以启用这些上拉电阻。

并非所有I2C设备（尤其是磁性传感器）都需要上拉电阻，实际上，大多数设备不需要，特别是与Arduino UNO配合使用时。但在与STM32开发板（如Nucleo-64）连接这些传感器时，经常会出现问题，此时需要启用板载上拉电阻或自行外接上拉电阻。

<blockquote class="warning"><p class="heading">注意：堆叠使用</p>
如果堆叠多个盾牌且希望使用I2C上拉电阻，请确保每次只在一个板上焊接这些焊盘！
</blockquote>

<blockquote class="info" markdown="1">
<span class="simple">Simple<span class="foc">FOC</span>Shield</span> v3.1版本只有一个焊盘，用于同时启用SDA和SCL的上拉电阻。v3.2版本则有两个独立的焊盘。
</blockquote>

## 启用板载稳压器为MCU供电

<img src="extras/Images/v3_pads_ldo.jpg" class="width30">

从[<i class="fa fa-tag"></i>2.0版本](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)开始，电路板集成了线性稳压器，可通过板载端子的电源为堆叠其上的MCU供电。v3.x版本的电路板有一个8V稳压器，连接到盾牌的VIN引脚，可为主流带Arduino UNO R3接口的开发板供电。大多数厂商的开发板在VIN引脚处都有一个稳压器，可接受高达12V的电压（因此8V完全在其承受范围内）。上图展示了如何焊接焊盘以启用线性稳压器。

<blockquote class="warning"><p class="heading">注意：堆叠使用</p>
如果堆叠多个盾牌且希望使用线性稳压器，请确保只在一个板上启用它！
</blockquote>

## 配置逻辑电压电平（VDD）

<img src="extras/Images/v3_pads_vdd.gif" class="width30">

如果你的微控制器采用5V逻辑，其ADC通常工作在5V范围；如果MCU工作在3.3V，则其ADC很可能工作在3.3V范围。焊接此焊盘前请查阅数据手册。

<blockquote class="info"><p class="heading">经验法则：3.3V还是5V</p>
Arduino UNO - 5V范围<br>
stm32（nucleo、bluepill）和esp32芯片 - 3.3V范围
</blockquote>

## 配置故障和复位引脚

<img src="extras/Images/v3_pads_fault_reset.jpg" class="width30">

故障引脚和复位引脚用于监控驱动器状态和复位驱动器。两个引脚均为反相逻辑，并与外部上拉电阻配合使用。
- 故障引脚被上拉至3.3V，发生故障时会被拉至0V。
<blockquote class="info"> 板上有一个LED用于指示故障状态。</blockquote>
- 复位引脚被上拉至3.3V，需被拉至0V以触发复位。
<blockquote class="info"> 复位是除断电重启外，使驱动器从故障状态恢复的唯一方法。</blockquote>

上图展示了如何焊接焊盘以启用故障和复位引脚，焊接后可将这些引脚连接到微控制器的`A1`和`A3`引脚。

<blockquote class="warning" markdown="1">
  由于复位和故障引脚（焊接后）会占用微控制器的`A1`和`A3`引脚，请确保不要将这些引脚用于其他用途（例如电流检测）。
</blockquote>


## 配置电流检测引脚分配

<img src="extras/Images/v3_pads_cs.gif" class="width30">

电流检测的引脚分配非常简单，真正重要的是不要将相同的引脚用于其他功能。因此，堆叠多个板时，需确保每个板使用的引脚对不与其他板冲突。

信号 | 可选引脚
--- | ---
A相电流 | `A0`、`A1`
B相电流 | `A2`、`A3`

<blockquote class="info" markdown="1">
📢 若不确定使用哪些引脚，请查看我们的[ADC引脚选择指南](choosing_adc_pins)！
</blockquote>

## 自定义引脚分配

<span class="simple">Simple<span class="foc">FOC</span>Shield</span>的引脚分配自定义功能使电路板能灵活适配不同的传感器和额外的Arduino模块。更重要的是，它使电路板可堆叠使用。

以下是可配置信号及其可能的引脚分配表：

信号 | 可选引脚
--- | ---
Pwm A | `6`、`11`、`13`
Pwm B | `9`、`10`
Pwm C | `3`、`5`
使能 | `7`、`8`
编码器A | `3`、`12`、`A5`
编码器B | `2`、`A4`
编码器I | `4`、`11`、`13`

实际上，可能的引脚配置有很多，但并非所有配置都适用于所用的微控制器和传感器。
例如，Arduino UNO只有2个外部中断引脚，即引脚`2`和`3`。因此，当Arduino UNO与编码器配合使用时，应尽量将引脚`3`用于编码器A通道，而非驱动器的Pwm A引脚。

另一个例子是当堆叠两个板与STM32 Nucleo（`Stm32F4x`系列）配合使用时。Nucleo（`Stm32F4x`）开发板不能同时在引脚`11`和`9`上生成PWM，因此不能组合使用这些引脚。因此，使用Nucleo（`Stm32F4x`）开发板时，经验法则是避免使用引脚`11`，而改用引脚`13`。

<blockquote class="info" markdown="1">
📢 若不确定使用哪些引脚，请查看我们的[PWM引脚选择指南](choosing_pwm_pins)！
</blockquote>

以下内容根据堆叠需求和所用微控制器，推荐一些引脚分配配置。

### 推荐引脚分配：单板使用
仅使用一个板控制一个电机时，选择引脚分配会简单得多。基本上，只需注意：若使用编码器，应将引脚`3`用于编码器A通道，而非驱动器的Pwm A引脚；若使用SPI磁性传感器，应避免使用引脚`10`和`11`，因为它们用于SPI通信。

<img src="extras/Images/v3_pads_default_single.jpg" class="width30">

综合考虑，使用一个板时，最佳的引脚分配可能如下：

<div class="tight_table" markdown="1">

信号 | Pwm A | Pwm B | Pwm C | 使能 | 编码器A | 编码器B | 编码器I | A相电流 | B相电流
--- | - | - | - | - | - | - | - | - | -
引脚 | `6` | `10` | `5` | `8` | `3` | `2`| `4`|`A0` | `A2`

</div>

上图展示了为获得此配置需要焊接哪些焊盘。
```cpp
// 基于上述引脚分配的驱动器实例配置
BLDCDriver3PWM driver = BLDCDriver3PWM(6, 10, 5, 8);
...
// 编码器传感器
Encoder sensor = Encoder(2, 3, ... );
...
// 电流检测
InlineCurrentSense current_sense = InlineCurrentSense(0.185f, A0, A2, ...);
```

### 推荐引脚分配：与 Arduino UNO 堆叠使用

Arduino UNO 只有 6 个 PWM 引脚，这意味着堆叠两个板时，可选择的引脚有限，需要充分利用所有引脚。只要将引脚`3`用于 Pwm A，且不将引脚`13`用于 Pwm C，Pwm A、B、C、使能和编码器 A、B、I 信号的排列方式并不重要。

<img src="extras/Images/v3_pads_double_uno1.jpg" class="width30">
<img src="extras/Images/v3_pads_double_uno2.jpg" class="width30">

以下是一个与 Arduino UNO 兼容的引脚分配示例：

<div class="tight_table" markdown="1">

信号 | Pwm A | Pwm B | Pwm C | 使能 | 编码器 A | 编码器 B | 编码器 I | 相电流 A | 相电流 B
--- | - | - | - | - | - | - | - | - | - 
板 #1 | `6` | `10` | `5` | `8` | `12` | `2`| `4` |`A0` | `A2` 
板 #2 | `11` | `9` | `3` | `7` | `A5` | `A4` | `13` |`A1` | `A3` 

</div>

上图展示了如何焊接两个板上的焊盘以获得所需的引脚分配。 
```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(6, 10, 5, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(11, 9, 3, 7);
...
// encoder
Encoder sensor1 = Encoder(2, 12, ... );
Encoder sensor2 = Encoder(A4, A5, ... );
...
// current sensing
InlineCurrentSense current_sense1 = InlineCurrentSense(0.185f, A0, A2, ...);
InlineCurrentSense current_sense2 = InlineCurrentSense(0.185f, A1, A3, ...);
```

### 推荐引脚分配：与 Stm32 Nucleo 堆叠使用

当堆叠的SimpleFOCShield与 stm32 Nucleo 开发板配合使用时，只需确保不将引脚`11`用于 Pwm C，而改用引脚`13`。与 Arduino UNO 一样，不应将引脚`3`用于编码器 A，而应用于 Pwm A。只要遵循这些约束，其他引脚可随意选择。

<img src="extras/Images/v3_pads_double_nucleo1.jpg" class="width30">
<img src="extras/Images/v3_pads_double_nucleo2.jpg" class="width30">

以下是一个适用于与 Nucleo 开发板堆叠使用的引脚分配示例。

<div class="tight_table" markdown="1">

信号 | Pwm A | Pwm B | Pwm C | 使能 | 编码器 A | 编码器 B | 编码器 I | 相电流 A | 相电流 B
--- | - | - | - | - | - | - | - | - | - 
板 #1 | `6` | `10` | `5` | `8` | `12` | `2`| `4` |`A0` | `A2` 
板 #2 | `13` | `9` | `3` | `7` | `A5` | `A4` | `11` |`A1` | `A3` 

</div>

查看上图了解如何焊接焊盘以获得此配置。

```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(6, 10, 5, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(13, 9, 3, 7);
...
// encoder
Encoder sensor1 = Encoder(2, 12, ... );
Encoder sensor2 = Encoder(A4, A5, ... );
...
// current sensing
InlineCurrentSense current_sense1 = InlineCurrentSense(0.185f, A0, A2, ...);
InlineCurrentSense current_sense2 = InlineCurrentSense(0.185f, A1, A3, ...);
```
