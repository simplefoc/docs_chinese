---
layout: default
title: Connecting the hardware
parent: Getting Started
description: "Connecting SimpleFOCShield with your hardware."
nav_order: 2
permalink: /foc_shield_connect_hardware
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
---

# Connecting the hardware（连接硬件）

<p>
<img src="extras/Images/connection.gif" class="width50">
</p>

将 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 与单片机、无刷直流电机、电源和传感器连接起来非常简单。

## 单片机
- Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 可轻松堆叠在所有具有 Arduino 接口的设备上，如： [Arudino UNO](arduino_simplefoc_shield), Arudino MEGA, [Stm32 Nucleo](nucleo_connection) 等。
- Bit 它也可以作为一个独立的无刷直流电机驱动程序，如 [Stm32 Bluepill](bluepill_connection) 所示。

## 无刷直流电机
- 电机的 `a` 相， `b` 相和 `c`  相直接与电机终端连接器 `TB_M1` 连接

<blockquote class="warning"><p class="heading">注意：功率的限制</p>
Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 适用于内阻高于 R>10Ohm 的云台电机。此单板的绝对最大电流为5A。请确保你使用此板时的无刷直流电机符合这些限制。  <br>
如果你仍然想把低电阻 R < 1Ohm 的无刷直流电机用在这个板子上，请确保限制板子的电压。 <br>
有关电机选择的更多信息，请访问 <a href="bldc_motors"> 无刷直流电机文档</a>
</blockquote>

## 电源
- 电源线直接连接到终端 `TB_PWR` 
- 建议电源电压在12V到24V之间，但一般情况下，在这个电路板上没有测试过更高的电压，但在30V以下应该不会有太多问题。



## 编码器
- 通道 `A` and `B` 连接到编码器的 `P_ENC`, 端子 `A` 和 `B`. 
- 如果你的编码器上有 `index` 标记，你也可以将它连接到编码器的端子 `I`.

<img src="extras/Images/foc_shield_v13_enc.png" class="">

图片名词：Power supply （电源），Encoder（编码器）， BLDC motor（无刷直流电机），optional（可选择的）

## 磁传感器 SPI
- 磁传感器的 SPI 接口标记 `SCK`, `MISO` 和 `MOSI` 连接到 Arduino 的 `SPI` 引脚 (Arduino UNO `13`,`12` and `11`)。
  - 如果应用程序需要多个传感器，所有传感器都连接到 Arduino 的相同引脚。
-  `chip select` 引脚连接到所需的引脚中，每个连接到同一个 Arduino 的传感器必须有唯一的 chip 选择引脚。

<img src="extras/Images/foc_shield_v13_magSPI.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）

## 磁传感器 I2C
- 磁传感器的 I2C 的接口标记 `SCL` 和 `SDA` 连接到 Arduino 的 `I2C` 引脚 (Arduino UNO `A4` 和 `A5`). 
  - 如果应用程序需要多个传感器，所有传感器都连接到 Arduino 的相同引脚。
- 您可能需要为 `SDA` 和 `SCL` 使用额外的上拉电阻。

<img src="extras/Images/foc_shield_v13_magI2C.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）


## 磁传感器的模拟输出
- 磁传感器的模拟输出直接连接到任何模拟输入引脚，在下图中我们使用 `A0`
  - 如果应用程序需要多个传感器，则每个传感器连接到其中一个模拟输入引脚

<img src="extras/Images/foc_shield_v13_analog.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）


## 霍尔传感器
- 通道 `A`, `B` 和 `C` ( `U`, `V` 和 `W` ) 连接到编码器的 `P_ENC`. 

<img src="extras/Images/foc_shield_v13_hall.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）

