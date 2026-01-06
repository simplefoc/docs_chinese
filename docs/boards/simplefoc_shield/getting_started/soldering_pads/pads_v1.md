---
layout: default
title:  v1.x 
parent: 焊盘部分
grand_parent: 开始上手
description: "Configuring your SimpleFOCShield by soldering the pads."
nav_order: 1
permalink: /pads_soldering_v1
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
toc: true
---

# 使用焊接焊盘进行硬件配置 <br> <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small>v1</small>
Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的一个非常重要的特性是硬件配置功能。

<img src="extras/Images/shield_bot_v131_pinout.gif" class="width40">

每个板上在底面都有一组焊接焊盘，用于进行配置。这些焊接焊盘使板能够：

- 启用/禁用编码器 A、B 和索引通道的上拉电阻
- 配置 BLDC 驱动器引脚分配（PWM 引脚 A、B、C 和使能引脚）

<blockquote class="info"> <p class="heading">注意 📢：导电墨水</p>
许多 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 板在出厂前会进行初步测试，并且会以初始配置发货。测试配置是使用导电墨水而非焊接连接完成的。因此，当您拿到板子后，如果想要更改配置，只需用湿纸巾擦掉墨水即可。
</blockquote>

## 启用编码器/霍尔传感器上拉电阻

<img src="extras/Images/shield_bot_v131_pullup_enable.png" class="width30">

每个板都集成了三组 3.3KΩ 的上拉电阻，用于编码器通道 A、B 和索引（或霍尔传感器 U、V、W）。上图展示了如何焊接焊盘以启用上拉电阻。
并非所有编码器都需要上拉电阻，或者更确切地说，一般情况下，大多数编码器不需要。对于那些追求成本优化的人 :slight_smile:，很多便宜的 Ebay/Aliexpress 编码器会需要它们，例如 [600P ebay 编码器 <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/360-600P-R-Photoelectric-Incremental-Rotary-Encoder-5V-24V-AB-Two-Phases-Shaft/254214673272?hash=item3b30601378:g:AZsAAOSwu~lcxosc) 及类似产品。

## 启用 I2C 上拉电阻

<img src="extras/Images/shield_bot_v132_i2c_pullup_enable.png" class="width30">

从 [<i class="fa fa-tag"></i>1.3.2 版本](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 的 shield 开始，板子配备了 4.7KΩ 的上拉电阻用于 I2C 通信引脚。上图展示了如何焊接焊盘以启用上拉电阻。
并非所有 I2C 设备（特别是磁性传感器）都需要上拉电阻，或者更确切地说，一般情况下，大多数不需要，尤其是在与 Arduino UNO 一起使用时。但在与 STM32 板（如 Nucleo-64）连接这些传感器时，经常会出现问题。这时您需要启用上拉电阻，或者自己外接上拉电阻。
<blockquote class="warning"><p class="heading">注意：堆叠使用</p>
如果您要堆叠多个 shield 并且希望使用 I2C 上拉电阻，请确保一次只在一个板上焊接这些焊盘！
</blockquote>

## 自定义引脚分配

<span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的引脚分配自定义功能使板子在使用不同传感器和额外的 Arduino 模块时具有很高的灵活性。但更重要的是，它使板子能够堆叠使用。

以下是可配置信号及其可能的引脚分配表：

| 信号       | 可能的引脚          |
|------------|---------------------|
| Pwm A      | 3、9                |
| Pwm B      | 6、11、**13***      |
| Pwm C      | 5、10               |
| 使能       | 7、8                |
| 编码器 A   | 3、A2、A3           |
| 编码器 B   | 2、A1               |
| 编码器 I   | 4、A0               |

<small>*从 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <a href="https://github.com/simplefoc/Arduino-SimpleFOCShield/releases">版本 <i>v1.3.1</i></a> 开始</small>

现在，有很多可能的引脚配置，但根据所使用的微控制器和传感器，并非所有配置都是可行的。
例如，Arduino UNO 只有 2 个外部中断引脚，即引脚 `2` 和 `3`。因此，当将板子与 Arduino UNO 和编码器一起使用时，我们会尝试将引脚 `3` 用于编码器通道 A，而不是驱动器的 pwm A 引脚。

另一个例子是当与 STM32 Nucleo 堆叠两个板时。Nucleo 板不能在引脚 `11` 和 `6` 上生成 pwm，因此您不能同时组合使用这些引脚。因此，使用 Nucleo 板时，经验法则是避免使用引脚 `11`，而是使用引脚 `13` 代替。

因此，在以下内容中，您可以找到基于堆叠需求和所使用的微控制器的建议引脚分配配置。

### 建议的引脚分配：单块板
当仅使用一块板和一个电机时，选择引脚分配会简单得多。基本上，只要您使用编码器，就需要注意将引脚 `3` 用于编码器通道 A，而不是驱动器的 pwm A 引脚。此外，如果您使用 SPI 磁性传感器，应避免使用引脚 `10` 和 `11`，因为它们用于 SPI 通信。

<img src="extras/Images/shield_bot_v131_config_single.png" class="width30">

考虑到所有这些，使用一块板时，可能最好的引脚分配如下：

| 信号       | Pwm A | Pwm B | Pwm C | 使能 | 编码器 A | 编码器 B | 编码器 I |
|------------|-------|-------|-------|------|----------|----------|----------|
| 引脚号     | 9     | 5     | 6     | 8    | 3        | 2        | A0       |

在上图中，您可以看到为了获得此配置需要焊接哪些焊盘。
```cpp
// 基于上述引脚分配的驱动器实例配置
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
```

### 建议的引脚分配：与 Arduino UNO 堆叠

Arduino UNO 只有 6 个 pwm 引脚，这意味着当我们堆叠两块板时，可选择的引脚不多，我们需要使用所有这些引脚。只要我们将引脚 `3` 用于 pwm A，并且不将引脚 `13` 用于 pwm C，那么如何组织 pwm A、B、C、使能和编码器 A、B、I 信号并不重要。

<img src="extras/Images/shield_bot_v131_config_double.png" class="width30">
<img src="extras/Images/shield_bot_v131_config_double_ard.png" class="width30">

以下是一个与 Arduino UNO 兼容的引脚分配示例：
 
信号 | Pwm A | Pwm B | Pwm C | 使能	 | 编码器  A | 编码器  B | 编码器  I
--- | --- | ---- | --- | --- | --- | --- | ---
板 #1 | 9 | 10 | 11 | 8 | A2 | A1 | A0 
板 #2 | 3 | 5 | 6 | 7 | A3 | 2 | 4 

上图展示了如何在两块板上焊接焊盘以获得所需的引脚分配。
```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(9, 10, 11, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(3, 5, 6, 7);
```

### 建议的引脚分配：与 Stm32 Nucleo 堆叠

当将堆叠的 SimpleFOCShield 与 stm32 Nucleo 板一起使用时，我们只需确保不将引脚 `11` 用于 pwm C，而是使用引脚 `13` 代替。对于 Arduino UNO，我们不应将引脚 `3` 用于编码器 A，而应用于 pwm A。但如果我们遵守这些限制，就可以随意选择其他引脚。

<img src="extras/Images/shield_bot_v131_config_double.png" class="width30">
<img src="extras/Images/shield_bot_v131_config_double_nucleo.png" class="width30">

以下是一个适用于与 Nucleo 板堆叠的引脚分配配置示例。

信号 | Pwm A | Pwm B | Pwm C | 使能 | 编码器 A | 编码器 B | 编码器 I
--- | --- | ---- | --- | --- | --- | --- | ---
板 #1 | 9 | 10 | 6 | 8 | A2 | A1 | A0 
板 #2 | 3 | 5 | 13 | 7 | A3 | 2 | 4 

查看上图，了解如何焊接焊盘以获得此配置。

```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(9, 10, 6, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(3, 5, 13, 7);
```

<blockquote class="info"><p class="heading">引脚 13 还是引脚 11</p> 我们建议您先尝试配置引脚 13，如果不行再尝试引脚 11。经过测试的板子有：Nucleo-F401RE - 引脚 13 可用 / 引脚 11 不可用；Nucleo-F466RE - 引脚 11 可用 / 引脚 13 不可用。</blockquote>