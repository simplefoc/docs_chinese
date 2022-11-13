---
layout: default
title: v1.3.3
parent: 焊盘部分
grand_parent: 开始上手
description: "Configuring your SimpleFOCShield by soldering the pads."
nav_order: 1
permalink: /pads_soldering_v1
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
---
# 使用焊盘进行硬件配置 <br><span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small>v1.3.3</small>
 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的一个非常重要的特性是硬件配置。

<img src="extras/Images/shield_bot_v131_pinout.gif" class="width40">

每个板的底部有一组用于配置的焊盘。这些焊盘功能包括：

- 启用/禁用编码器A、B和I的上拉电阻
- 配置无刷直流的驱动引脚（A/B/C PWM引脚和使能引脚）

<blockquote class="info"> <p class="heading">注意 📢： 导电墨水 </p>
 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 板子只进行初步的测试，发货的时候是初始配置（空板子）。我们测试配置的时候使用导电墨水而不是焊接连接。因此，当你拿到板子的时候，如果你想改变配置，你可以用一些湿纸巾擦去墨水然后根据自己的需求焊接焊盘完成硬件配置。
</blockquote>

## Enabling encoder/hall sensor pull-up resistors （启用编码器/霍尔传感器上拉电阻）

<img src="extras/Images/shield_bot_v131_pullup_enable.png" class="width30">

每块板集成了3个3.3kΩ 的上拉电阻，用于编码器通道A，B和I（或霍尔传感器U，V，W）。上面的图片展示了如何焊接背面焊盘而使编码器接上上拉电阻。不是所有的编码器都需要上拉电阻。一般来说，大多数编码器不需要上拉电阻。而对于寻求性价比的人来说，在 Ebay/Aliexpress 上销售的很多便宜的编码器都需要上拉电阻，比如 [600P ebay encoder <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/360-600P-R-Photoelectric-Incremental-Rotary-Encoder-5V-24V-AB-Two-Phases-Shaft/254214673272?hash=item3b30601378:g:AZsAAOSwu~lcxosc) 编码器和一些类似的编码器。

## Enabling I2C pull-up resistors （使能I2C上拉电阻）

<img src="extras/Images/shield_bot_v132_i2c_pullup_enable.png" class="width30">

shield [<i class="fa fa-tag"></i>version 1.3.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 板上带有 4.7kΩ 上拉电阻的 I2C 通信引脚。上面的图片展示了如何焊接背面焊盘而使I2C引脚接上上拉电阻。并不是所有的 I2C 设备（尤其是磁性传感器）都需要上拉电阻，更确切地说，大多数 I2C 设备不需要上拉电阻，特别是当处理器是Arduino UNO时。但是，这些I2C传感器连接 STM32 板（如 Nucleo-64）时出现问题很常见，这时候就需要启用这些上拉电阻，或者自行外接。 

<blockquote class="warning"><p class="heading">注意：叠板</p>
如果您想同时用两块或以上的SFOC板 ，并且希望使用I2C的上拉时，请确保只在其中一块板上焊接这些焊盘！
</blockquote>



## Customizing pinout （定制引脚）

定制引脚的 SimpleFOCShield 使板子非常灵活地使用不同的传感器和额外的 arduino 模块。但更重要的是，它使得板子可以堆叠。

下面是可配置信号及其可能的引脚分配表：

Signal（信号） | Possible pins（可用的引脚） 
--- | ---
Pwm A | 3, 9 
Pwm B | 6, 11, **13***
Pwm C | 5, 10
Enable | 7, 8
Encoder A | 3, A2, A3
Encoder B | 2, A1 
Encoder I | 4, A0

<small>*From <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <a href="https://github.com/simplefoc/Arduino-SimpleFOCShield/releases">version <i>v1.3.1</i></a></small>

尽管有很多可能的引脚配置，但基于您使用的微控制器和传感器，并非所有引脚配置都可行 。例如，Arduino UNO 只有 2个外部中断引脚，分别是引脚 `2` 和`3` 。因此，在用 Arduino UNO和编码器时，我们会将UNO的引脚`3`用于编码器通道 A，而不是用于 pwm A。

另一个例子是用 STM32 Nucleo 叠两块板。Nucleo 板的引脚`11`和 `6`上不能输出 pwm，因此，您不能同时使用这些引脚。当使用 Nucleo 板时，我们的经验是避免使用引脚`11`，而使用引脚`13`。

因此在下文中，您可以根据堆叠的必要性和所使用的微控制器找到推荐的引脚配置。

### Suggested pinout: Single board （建议的引脚：单板）
当只用一块板，只有一个电机时，选择引脚要容易得多。基本上你只需要注意不要将Pin`3`同时用于编码器的通道A和输入信号的PWM A。另外如果你使用的是 SPI 磁传感器，你应该避免使用引脚`10`和`11`，因为它们是用于 SPI 通信的。

<img src="extras/Images/shield_bot_v131_config_single.png" class="width30">

考虑上述因素，在使用一个板的时候推荐的引脚配置是：

Signal（信号） | Pwm A | Pwm B | Pwm C | Enable | Encoder A | Encoder B | Encoder I
--- | --- | ---- | --- | --- | --- | --- | ---
Pin number （引脚号码） | 9 | 5 | 6 | 8 | 3 | 2 | A0 

在上面的图片中，你可以看到你需要焊接哪些焊盘来得到这个配置。
```cpp
// 基于以上引脚的驱动器实例配置
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
```

### Suggested pinout: Stacking with Arduino UNO （建议的引脚 ：基于 Arduino UNO 叠板）

Arduino UNO 只有6个 pwm 引脚，这意味着当我们堆叠两块板时，我们就需要所有的引脚。重要的是我们如何组织 pwm A，B，C，使能和编码器的ABI信号， pwm A 使用引脚`3`，pwm C 不使用引脚 `13` 。 

<img src="extras/Images/shield_bot_v131_config_double.png" class="width30">
<img src="extras/Images/shield_bot_v131_config_double_ard.png" class="width30">

下面是兼容 Arduino UNO 的一个引脚分配示例：

Signal （信号） | Pwm A | Pwm B | Pwm C | Enable | Encoder A | Encoder B | Encoder I
--- | --- | ---- | --- | --- | --- | --- | ---
Board #1（板子1） | 9 | 10 | 6 | 8 | A2 | A1 | A0 
Board #2（板子2） | 3 | 5 | 11 | 7 | A3 | 2 | 4 

上图显示了如何焊接两个板上的焊盘，以获得所需的引脚。 
```cpp
// 基于以上引脚的电机实例配置
BLDCDriver3PWM driver1 = BLDCDriver3PWM(9, 10, 11, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(3, 5, 6, 7);
```

### Suggested pinout: Stacking with Stm32 Nucleo（建议的引脚：基于 Stm32 Nucleo 叠板）

堆叠 SimpleFOCShield 与 stm32 Nucleo 板时，pwm C 不使用引脚`11`，而是使用引脚13代替。对于 Arduino UNO，我们不应该在编码器A上使用引脚 `3`，而应该在 pwm A 上使用。基于这些约束条件，我们可以选择我们希望的其他引脚。

<img src="extras/Images/shield_bot_v131_config_double.png" class="width30">
<img src="extras/Images/shield_bot_v131_config_double_nucleo.png" class="width30">

基于Nucleo叠板的推荐引脚：

Signal（信号） | Pwm A | Pwm B | Pwm C | Enable | Encoder A | Encoder B | Encoder I
--- | --- | ---- | --- | --- | --- | --- | ---
Board #1（板子1） | 9 | 10 | 6 | 8 | A2 | A1 | A0 
Board #2（板子2） | 3 | 5 | 13 | 7 | A3 | 2 | 4 

参见上图，了解如何焊接焊盘以获得这种配置。

```cpp
// 基于以上引脚的电机实例配置
BLDCDriver3PWM driver1 = BLDCDriver3PWM(9, 10, 6, 8);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(3, 5, 13, 7);
```

<blockquote class="info"><p class="heading">引脚 13 或者 引脚 11</p> 我们建议您先尝试与引脚13配置，如果引脚13不行的话再与引脚11配置。我们测试的时候是 Nucleo-F401RE - 引脚13有效/引脚11无效，Nucleo-F466RE 引脚11有效/引脚13无效。</blockquote>