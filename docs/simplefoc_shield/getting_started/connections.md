---
layout: default
title: 连接硬件
parent: 开始上手
description: "Connecting SimpleFOCShield with your hardware."
nav_order: 2
permalink: /foc_shield_connect_hardware
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
---

# 连接硬件

<p>
<img src="extras/Images/connection.gif" class="width50">
</p>

将<span class="simple">Simple<span class="foc">FOC</span>Shield</span> 与单片机、无刷直流电机、电源和传感器连接起来。

## 单片机
- Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 可堆叠在所有有 Arduino 标准接口的设备上，如： [Arudino UNO](arduino_simplefoc_shield), Arudino MEGA, [Stm32 Nucleo](nucleo_connection) 等。

- Bit 它也可以作为一个独立的无刷直流电机驱动程序，如 [Stm32 Bluepill](bluepill_connection) 所示。 

  > wait to translate

## 无刷直流电机
- 电机的 `a` 相， `b` 相和 `c`  相直接连接到驱动板的电机输出端子 `TB_M1` 

<blockquote class="warning"><p class="heading">注意：功率的限制</p>
Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 适用于内阻大于10Ω的云台电机。此单驱动器的最大电流为5A。请确保你使用此驱动器时的无刷直流电机符合上述对电机的要求。  <br>
如果你仍然想在这块驱动板上用内阻小于10Ω的电机，请留意设置驱动板的电压限制。 <br>
有关电机选择的更多信息，请访问 <a href="bldc_motors"> 无刷直流电机文档</a>
</blockquote>


## 电源
- 电源线连接到输入端 `TB_PWR` 
- 电源电压建议在12-24V。这块驱动器上没有测试过更高的电压输入，但在30V以下应该不会有太多问题。



## 编码器
- 通道 `A` and `B` 连接到驱动板的编码器端子 `P_ENC`的 `A` 和 `B`上。 
- 如果你的编码器上有 `index` ，你也可以将它连接到编码器端子的 `I`上。

<img src="extras/Images/foc_shield_v13_enc.png" class="">

图片名词：Power supply （电源），Encoder（编码器）， BLDC motor（无刷直流电机），optional（可选择的）

## 磁传感器-SPI通信
- 磁传感器的 SPI 接口 `SCK`, `MISO` 和 `MOSI` 连接到 Arduino 的 `SPI` 引脚 (Arduino UNO `13`,`12` and `11`)。
  - 如果需要多个传感器，可以将所有传感器都连接到 Arduino 的相同引脚上。
-  `chip select` 引脚连接到所需的引脚上，每个连接到同一个 Arduino 的传感器必须有唯一的 chip 选择引脚。

<img src="extras/Images/foc_shield_v13_magSPI.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）

## 磁传感器-I2C通信
- 磁传感器的 I2C 的接口 `SCL` 和 `SDA` 连接到 Arduino 的 `I2C` 引脚 (Arduino UNO `A4` 和 `A5`). 
  - 如果需要多个传感器，可以将所有传感器都连接到 Arduino 的相同引脚上。
- 你可能需要给 `SDA` 和 `SCL` 接上拉电阻。

<img src="extras/Images/foc_shield_v13_magI2C.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）


## 磁传感器-模拟输出
- 磁传感器的模拟输出直接连接到Arduino 的任何模拟输入引脚，在下图中我们使用 `A0`
  - 如果需要多个传感器，则每个传感器需要连接到唯一的模拟输入引脚

<img src="extras/Images/foc_shield_v13_analog.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）


## 霍尔传感器
- 通道 `A`, `B` 和 `C` ( `U`, `V` 和 `W` ) 连接到驱动器的编码器端子 `P_ENC`. 

<img src="extras/Images/foc_shield_v13_hall.png" class="">

图片名词：Power supply （电源）， BLDC motor（无刷直流电机）

