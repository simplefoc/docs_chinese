---
layout: default
title: v2.0.2
parent: Soldering pads
grand_parent: Getting Started
description: "Configuring your SimpleFOCShield by soldering the pads."
nav_order: 2
permalink: /pads_soldering_v2
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
---
# Hardware configuration using soldering pads （使用焊盘配置硬件）<br> <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small>v2</small>
 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的一个重要的特性是硬件配置

<img src="extras/Images/shield_bot_v201_pinout.gif" class="width40">

每个板的底部有一组用于配置的锡盘。这些焊盘使电路板能够：

- 配置无刷直流驱动引脚（PWM引脚A，B，C和使能引脚）
- 启用/禁用编码器A，B和索引通道的上拉电阻
- 配置编码器/霍尔传感器连接
- 启用/禁用线性调节器
- 配置 ADC 的范围
- 配置电流检测的引脚

<blockquote class="info"> <p class="heading">注意 📢: 导电墨水 </p>
 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 板子只进行初步的测试，发货的时候是初始配置（空板子）。我们测试配置的时候使用导电墨水而不是焊接连接。因此，当你拿到板子的时候，如果你想改变配置，你可以用一些湿纸巾擦去墨水然后根据自己的需求焊接焊盘完成硬件配置。
</blockquote>

## Enabling encoder/hall sensor pull-up resistors（启用编码器/霍尔传感器上拉电阻）

<img src="extras/Images/v2_hall.jpg" class="width30">

每块板集成了 3个 3.3KOhm 的上拉电阻，用于编码器通道A，B和 Index（或霍尔传感器U，V，W）。上面的图片显示了如何焊接焊盘达到上拉电阻。不是所有的编码器都需要上拉电阻，其实一般来说，大多数编码器不需要上拉电阻。对于我们这些寻求性价比的人来说，在 Ebay/Aliexpress 上销售的很多便宜的编码器都需要上拉电阻，比如 [600P ebay encoder <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/360-600P-R-Photoelectric-Incremental-Rotary-Encoder-5V-24V-AB-Two-Phases-Shaft/254214673272?hash=item3b30601378:g:AZsAAOSwu~lcxosc) 编码器和一些类似的编码器。

## Enabling I2C pull-up resistors（使能I2C上拉电阻）

<img src="extras/Images/v2_i2c.jpg" class="width30">

 shield [<i class="fa fa-tag"></i>version 1.3.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 板上带有 4.7KOhm 上拉电阻的 I2C 通信引脚。上面的图片显示了如何焊接焊盘达到上拉电阻。并不是所有的 I2C 设备（尤其是磁性传感器）都需要上拉电阻，或者更确切地说，大多数 I2C 设备不需要上拉电阻，特别是 Arduino UNO。但是，这些传感器连接 STM32 板（如 Nucleo-64）时出现问题是很常见的。您需要启用这些pullups，或者自己从外部提供它们。
<blockquote class="warning"><p class="heading">注意：堆叠</p>
如果您正在堆叠 shields ，并且希望使用 I2C 上拉，请确保每次只在板上焊接这些焊盘！
</blockquote>

## Enabling on-board voltage regulator to power the MCU（使板载电压调节器为MCU供电）

<img src="extras/Images/v2_ldo.jpg" class="width30">

  [<i class="fa fa-tag"></i>version 2.0 （2.0 版本）](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)  的电路板集成了线性调节器为MCU供电，在该电路板上还有电源的端子。 v2.0.1 版本集成了 5V 的稳压器，直接连接到板的 5V 引脚上，所有 Arduino 板都可以正常工作。但是 stm32 Nucleo 不支持这种类型的电源传输，因此 v2.0.1 版本将不能只通过焊接上图的焊盘来为 Nucleo-64 板通电。SimpleFOCShield 的 v2.0.2 版本有8V的调节器，连接到 shield 的 VIN 引脚，可以为 Nucleo-64 板供电。

<blockquote class="warning"><p class="heading">注意：堆叠</p>
如果你正在堆叠 shields，你选择使用线性调节器的话，请确保它只在一个板上！
</blockquote>

## Configuring the current sensing ADC range（配置 ADC 的电流检测范围）

<img src="extras/Images/v2_adc.gif" class="width30">

如果你的微控制器电路有 5V，那么它的 ADC 工作在 5V 范围内。如果你的微控制器工作在 3.3V，那么它最有可能有3.3V 的 ADC 范围。焊接此焊盘前请检查数据表。如果 ADC 范围选择为 3.3V，则可测量的最大电流为 3.3A 双向，如果电压为5V，则最大电流为 5V 双向。

<blockquote class="info"><p class="heading">经验法则： 3.3V 或者 5V</p>
Arduino UNO - 5V 范围<br>
stm32 (nucleo, bluepill) 和 esp32 chips - 3.3V 范围
</blockquote>

## Configuring the current sensing pinout（配置电流检测引脚）
电流检测的引脚是非常简单的，重要的是其他地方不使用相同的引脚。因此，如果堆叠多个板，确

保使用一对引脚以一种方式配置一个板，另一个则不同。 

Signal（信号） | Possible pins（可用的引脚） 
--- | ---
Current phase A（A相电流） | A0, A1
Current phase B（B相电流） | A2, A3


## Customizing pinout（定制引脚）

定制引脚的 SimpleFOCShield 使板子非常灵活地使用不同的传感器和额外的 arduino 模块。但更重要的是，它使得板子可以堆叠。

下面是可配置信号及其可能的引脚分配表：

Signal（信号） | Possible pins（可用的引脚） 
--- | ---
Pwm A | 9, 10
Pwm B | 3, 5
Pwm C | 6, 11, 13
Enable | 7, 8
Encoder A | 3, 12, A5
Encoder B | 2, A4 
Encoder I | 4, 11, 13

现在，有很多引脚配置的可能性，并不是所有配置都可行，这取决于你正在使用的微控制器和传感器。例如，Arduino UNO 只有 2个 外部中断引脚，分别是引脚 `2` 和`3` 。因此，在使用 Arduino UNO 和 Encoder 的电路板时，我们会尝试将引脚`3`用于编码器通道 A，而不是用于 pwm A。

另一个例子是用 STM32 Nucleo 堆叠两块板。Nucleo 板不能在引脚`11`和 `6`上产生 pwm，因此，您不能同时组合这些引脚。当使用 Nucleo 板时，我们的经验是避免使用引脚`11`，而使用引脚`13`。

<blockquote class="info"><p class="heading">引脚 13 or 引脚 11</p> 我们建议您先尝试与引脚13配置，如果引脚13不行的话再与引脚11配置。我们测试的时候是 Nucleo-F401RE - 引脚13有效/引脚11无效，Nucleo-F466RE 引脚11有效/引脚13无效。</blockquote>

因此在下文中，您可以根据堆叠的必要性和所使用的微控制器找到建议的引出线配置。

### Suggested pinout: Single board（建议的引脚：单板）
当只用一块板，只有一个电机时，选择引脚要容易得多。基本上，如果你使用编码器来接引脚3与编码器通道A，而不是与驱动器的引脚 pwm A，你小心点就行了。而且，如果你使用 SPI 磁传感器，你应该避免使用引脚`10`和`11`，因为它们是用于 SPI 通信的。

<img src="extras/Images/v2_single.jpg" class="width30">

考虑到这一切，你使用一个板的时候最好的引出线将是：

Signal（信号） | Pwm A | Pwm B | Pwm C | Enable | Encoder A | Encoder B | Encoder I
--- | --- | ---- | --- | --- | --- | --- | ---
Pin number （引脚号码） | 9 | 5 | 6 | 8 | 3 | 2 | 4 

在上面的图片中，你可以看到你需要焊接哪些焊盘来得到这个配置。
```cpp
// driver instance configuration based on pinout above
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
```

### Suggested pinout: Stacking with Arduino UNO（建议的引脚 ：与 Arduino UNO 堆叠）

Arduino UNO 只有6个 pwm 引脚，这意味着当我们堆叠两个板时，我们不是选择使用哪一个引脚，我们需要所有的引脚。重要的是我们如何组织 pwm A，B，C，enable and encoder A，B，I 信号， pwm A 使用引脚`3`，pwm C 不使用引脚 `13` 。 

<img src="extras/Images/v2_ard1.jpg" class="width30">
<img src="extras/Images/v2_ard2.jpg" class="width30">

Here is one example of a pin assignment compatible with Arduino UNO:

Signal（信号） | Pwm A | Pwm B | Pwm C | Enable | Encoder A | Encoder B | Encoder I | 
--- | --- | ---- | --- | --- | --- | --- | --- | --- 
Board #1（板子1） | 10 | 5 | 6 | 8 | 12 | 2 | 4 |
Board #2（板子2） | 9 | 3 | 11 | 7 | A5 | A4 | 13 |

上图显示了如何焊接两个板上的焊盘，以获得所需的引脚。 
```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(10, 5, 6, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(9, 3, 11, 7);
```

### Suggested pinout: Stacking with Stm32 Nucleo（建议的引脚：与 Stm32 Nucleo 堆叠）

堆叠 SimpleFOCShield 与 stm32 Nucleo 板时，pwm C 不使用引脚`11`，而是使用引脚13代替。对于 Arduino UNO，我们不应该在编码器A上使用引脚 `3`，而应该在 pwm A 上使用。但是如果我们尊重这些约束条件，我们可以选择我们希望的其他引脚。

<img src="extras/Images/v2_nuc1.jpg" class="width30">
<img src="extras/Images/v2_nuc2.jpg" class="width30">

Here is an example of chosen pinout configuration valid for stacking with Nucleo board.

Signal（信号） | Pwm A | Pwm B | Pwm C | Enable | Encoder A | Encoder B | Encoder I
--- | --- | ---- | --- | --- | --- | --- | ---
Board #1（板子1） | 10 | 5 | 6 | 8 | 12 | 2 | 4 
Board #2（板子2） | 9 | 3 | 13 | 7 | A5 | A4 | 11 

参见上图，了解如何焊接焊盘以获得这种配置。

```cpp
// motor instances configuration based on pinout above
BLDCDriver3PWM driver1 = BLDCDriver3PWM(10, 5, 6, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(9, 3, 13, 7);
```
