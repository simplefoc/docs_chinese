---
layout: default
title:  v2.x 
parent: 焊盘部分
grand_parent: 开始上手
description: "Configuring your SimpleFOCShield by soldering the pads."
nav_order: 2
permalink: /pads_soldering_v2
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
toc: true
---

# 使用焊接焊盘进行硬件配置 <br> <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small>v2</small>
Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的一个非常重要的特性是硬件配置功能。

<img src="extras/Images/shield_bot_v201_pinout.gif" class="width40">

每个板的底部都有一组用于配置的焊接焊盘。这些焊接焊盘使板能够：

- 配置 BLDC 驱动器引脚（PWM 引脚 A、B、C 和使能引脚）- [了解更多..](#自定义引脚分配)
- 启用/禁用编码器 A、B 和索引通道的上拉电阻 - [了解更多..](#启用编码器/霍尔传感器上拉电阻)
- 配置编码器/霍尔传感器连接 - [了解更多..](##自定义引脚分配)
- 启用/禁用线性稳压器 - [了解更多..](#启用I2C上拉电阻)
- 配置 ADC 的范围 - [了解更多..](#配置电流检测ADC范围)
- 配置电流检测的引脚分配 - [了解更多..](#配置电流检测引脚分配)

<blockquote class="info"> <p class="heading">注意 📢：导电墨水</p>
许多 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 板在出厂前会进行初步测试，并以初始配置发货。测试配置是使用导电墨水而非焊接连接完成的。因此，当您收到板后，如果希望更改配置，只需用湿纸巾擦掉墨水即可。
</blockquote>

## 启用编码器/霍尔传感器上拉电阻

<img src="extras/Images/v2_hall.jpg" class="width30">

每个板都集成了三组 3.3KOhm 上拉电阻，用于编码器通道 A、B 和索引（或霍尔传感器 U、V、W）。上图展示了如何焊接焊盘以启用上拉电阻。
并非所有编码器都需要上拉电阻，更准确地说，一般情况下，大多数编码器不需要。但对于那些追求价格优化的人来说 😊，很多便宜的 Ebay/Aliexpress 编码器会需要它们，例如 [600P ebay 编码器 <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/360-600P-R-Photoelectric-Incremental-Rotary-Encoder-5V-24V-AB-Two-Phases-Shaft/254214673272?hash=item3b30601378:g:AZsAAOSwu~lcxosc) 及类似产品。

## 启用I2C上拉电阻

<img src="extras/Images/v2_i2c.jpg" class="width30">

从 [<i class="fa fa-tag"></i>1.3.2 版本](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 开始，该板配备了 4.7KOhm 上拉电阻，用于 I2C 通信引脚。上图展示了如何焊接焊盘以启用上拉电阻。
并非所有 I2C 设备（特别是磁性传感器）都需要上拉电阻，更准确地说，一般情况下，大多数不需要，尤其是在 Arduino UNO 上。但在与 STM32 板（如 Nucleo-64）连接这些传感器时，经常会出现问题。这时，您需要启用上拉电阻或自行外接。
<blockquote class="warning"><p class="heading">注意：堆叠使用</p>
如果您要堆叠多个板且希望使用 I2C 上拉电阻，请确保一次只在一个板上焊接这些焊盘！
</blockquote>

## 启用板载稳压器为微控制器供电

<img src="extras/Images/v2_ldo.jpg" class="width30">

从 [<i class="fa fa-tag"></i>2.0 版本](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 开始，这些板集成了线性稳压器，以便通过板端子的电源为堆叠在其上的微控制器供电。v2.0.1 版本的板集成了 5V 稳压器，直接连接到板的 5V 引脚，可与所有 Arduino 板正常工作。但 stm32 Nucleo 不支持这种供电方式，因此仅通过焊接上图中的焊盘，v2.0.1 版本无法为 Nucleo-64 板供电。<span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的 v2.0.2 版本具有 8V 稳压器，连接到板的 VIN 引脚，能够为 Nucleo-64 板供电。

<blockquote class="warning"><p class="heading">注意：堆叠使用</p>
如果您要堆叠多个板且希望使用线性稳压器，请确保只在一个板上启用它！
</blockquote>

## 配置电流检测ADC范围

<img src="extras/Images/v2_adc.gif" class="width30">

如果您的微控制器采用 5V 逻辑，其 ADC 很可能工作在 5V 范围；如果您的微控制器工作在 3.3V，则其 ADC 很可能为 3.3V 范围。焊接此焊盘前请查阅数据手册。如果 ADC 范围选择为 3.3V，可测量的最大电流为双向 3.3A；如果范围为 5V，最大电流为双向 5V。

<blockquote class="info"><p class="heading">经验法则：3.3V 或 5V</p>
Arduino UNO - 5V 范围<br>
stm32（nucleo、bluepill）和 esp32 芯片 - 3.3V 范围
</blockquote>

## 配置电流检测引脚分配
电流检测的引脚分配非常简单，真正重要的是不要将相同的引脚用于其他用途。因此，如果堆叠多个板，请确保每个板使用的引脚对不与其他板冲突。

| 信号 | 可能的引脚 |
| --- | --- |
| 电流相 A | A0、A1 |
| 电流相 B | A2、A3 |

<blockquote class="info" markdown="1">
📢 若不确定使用哪些引脚，请查看我们的 [ADC 引脚选择指南](choosing_adc_pins)！
</blockquote>

## 自定义引脚分配

<span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的引脚分配自定义功能使该板在使用不同传感器和额外的 Arduino 模块时具有很高的灵活性。但更重要的是，它使该板能够堆叠使用。

以下是可配置信号及其可能的引脚分配表：

| 信号 | 可能的引脚 |
| --- | --- |
| Pwm A | 9、10 |
| Pwm B | 3、5 |
| Pwm C | 6、11、13 |
| 使能 | 7、8 |
| 编码器 A | 3、12、A5 |
| 编码器 B | 2、A4 |
| 编码器 I | 4、11、13 |

存在多种可能的引脚配置，但并非所有配置都适用于您所使用的微控制器和传感器。
例如，Arduino UNO 只有 2 个外部中断引脚，即引脚 `2` 和 `3`。因此，当将该板与 Arduino UNO 和编码器一起使用时，我们会尝试将引脚 `3` 用于编码器通道 A，而不是驱动器的 pwm A 引脚。

另一个例子是将两个板与 STM32 Nucleo 堆叠使用时。Nucleo 板不能在引脚 `11` 和 `6` 上生成 PWM，因此不能同时组合使用这些引脚。因此，使用 Nucleo 板时，经验法则是避免使用引脚 `11`，而使用引脚 `13` 代替。

<blockquote class="info" markdown="1">
📢 若不确定使用哪些引脚，请查看我们的 [PWM 引脚选择指南](choosing_pwm_pins)！
</blockquote>

因此，在以下内容中，您可以找到基于堆叠需求和所使用的微控制器的建议引脚分配配置。

### 建议的引脚分配：单块板
当仅使用一块板和一个电机时，选择引脚分配要容易得多。基本上，您只需要注意，如果使用编码器，要将引脚 `3` 用于编码器通道 A，而不是驱动器的 pwm A 引脚。此外，如果使用 SPI 磁性传感器，应避免使用引脚 `10` 和 `11`，因为它们用于 SPI 通信。

<img src="extras/Images/v2_single.jpg" class="width30">

考虑到所有这些因素，使用一块板时，最佳的引脚分配可能如下：

| 信号 | Pwm A | Pwm B | Pwm C | 使能 | 编码器 A | 编码器 B | 编码器 I |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 引脚号 | 9 | 5 | 6 | 8 | 3 | 2 | 4 |

在上图中，您可以看到为了获得此配置需要焊接哪些焊盘。
```cpp
// 基于上述引脚分配的驱动器实例配置
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
```

### 建议的引脚分配：与 Arduino UNO 堆叠使用

Arduino UNO 只有 6 个 PWM 引脚，这意味着当我们堆叠两块板时，可供选择的引脚不多，我们需要使用所有这些引脚。只要我们将引脚 `3` 用于 pwm A，并且不将引脚 `13` 用于 pwm C，那么如何安排 pwm A、B、C、使能和编码器 A、B、I 信号并不重要。
<img src="extras/Images/v2_ard1.jpg" class="width30">
<img src="extras/Images/v2_ard2.jpg" class="width30">

以下是一个与 Arduino UNO 兼容的引脚分配示例:
 
信号 | Pwm A | Pwm B | Pwm C | 使能 | 编码器 A | 编码器 B | 编码器 I | 
--- | --- | ---- | --- | --- | --- | --- | ---
板 #1 | 10 | 5 | 6 | 8 | 12 | 2 | 4 
板 #2 | 9 | 3 | 11 | 7 | A5 | A4 | 13 

上图展示了如何在两块板上焊接焊盘以获得所需的引脚分配。
```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(10, 5, 6, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(9, 3, 11, 7);
```

### 建议的引脚分配：与 Stm32 Nucleo 堆叠使用

当将堆叠的 SimpleFOCShield 与 stm32 Nucleo 板一起使用时，我们只需确保不将引脚 `11` 用于 pwm C，而是使用引脚 `13` 代替。对于 Arduino UNO，我们不应将引脚 `3` 用于编码器 A，而应用于 pwm A。但如果我们遵守这些限制，就可以随意选择其他引脚。

<img src="extras/Images/v2_nuc1.jpg" class="width30">
<img src="extras/Images/v2_nuc2.jpg" class="width30">

以下是一个适用于与 Nucleo 板堆叠使用的引脚分配配置示例。

信号 | Pwm A | Pwm B | Pwm C | 使能 | 编码器 A | 编码器 B | 编码器 I
--- | --- | ---- | --- | --- | --- | --- | ---
板 #1 | 10 | 5 | 6 | 8 | 12 | 2 | 4 
板 #2 | 9 | 3 | 13 | 7 | A5 | A4 | 11 

查看上图，了解如何焊接焊盘以获得此配置。

```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(10, 5, 6, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(9, 3, 13, 7);
```
