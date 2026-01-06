---
layout: default
title: 硬件连接
parent: 开始上手
description: "Connecting SimpleFOCShield with your hardware."
nav_order: 2
permalink: /foc_shield_connect_hardware
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
toc: true
---

# 硬件连接

<p>
<img src="extras/Images/connection.gif" class="width50">
</p>

将 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 与微控制器、BLDC 电机、电源和传感器连接非常简单直观。

## 微控制器
- Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 设计为可轻松堆叠在所有带 Arduino 接口的设备上，例如：[Arduino UNO](arduino_simplefoc_shield)、Arduino MEGA、[Stm32 Nucleo](nucleo_connection) 等类似设备。
- 它也可以作为独立的 BLDC 驱动器使用，例如与 [Stm32 Bluepill](bluepill_connection) 配合使用。

## BLDC 电机
- 电机相 `a`、`b` 和 `c` 直接连接到电机端子连接器 `TB_M1`

<blockquote class="warning"><p class="heading">注意：功率限制</p>
Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 专为内部电阻高于 10Ω 的云台电机设计。该板的绝对最大电流为 5A。使用此板时，请确保所用的 BLDC 电机符合这些限制。<br>
如果仍想将此驱动器与电阻极低（R < 1Ω）的 BLDC 电机一起使用，请确保限制施加到板上的电压。<br>
有关电机选择的更多信息，请访问 <a href="bldc_motors">BLDC 电机文档</a>
</blockquote>

## 电源
- 电源电缆直接连接到端子 `TB_PWR`
- 推荐电源电压为 12V 至 24V，一般来说，该板尚未在更高电压下测试，但在高达 30V 的电压下应该不会有太多问题。


## 编码器
- 通道 `A` 和 `B` 连接到编码器连接器 `P_ENC` 的 `A` 和 `B` 端子。
- 如果编码器有 `index` 信号，也可以将其连接到编码器连接器的 `I` 端子。

<img src="extras/Images/foc_shield_v13_enc.png" class="">

## 磁性传感器 SPI
- 磁性传感器的 SPI 接口信号 `SCK`、`MISO` 和 `MOSI` 连接到 Arduino 的 SPI 引脚（Arduino UNO 为 `13`、`12` 和 `11`）。
  - 如果应用需要多个传感器，所有传感器都连接到 Arduino 的相同引脚。
- `片选` 引脚连接到所需引脚。连接到同一 Arduino 的每个传感器必须具有唯一的片选引脚。

<img src="extras/Images/foc_shield_v13_magSPI.png" class="">

## 磁性传感器 I2C
- 磁性传感器的 I2C 接口信号 `SCL` 和 `SDA` 连接到 Arduino 的 I2C 引脚（Arduino UNO 为 `A4` 和 `A5`）。
  - 如果应用需要多个传感器，所有传感器都连接到 Arduino 的相同引脚。
- 可能需要为 `SDA` 和 `SCL` 线使用额外的上拉电阻。

<img src="extras/Images/foc_shield_v13_magI2C.png" class="">


## 磁性传感器模拟输出
- 磁性传感器的模拟输出直接连接到任何模拟输入引脚，下图中我们使用 `A0`。
  - 如果应用需要多个传感器，每个传感器都连接到一个模拟输入引脚。

<img src="extras/Images/foc_shield_v13_analog.png" class="">


## 霍尔传感器
- 通道 `A`、`B` 和 `C`（`U`、`V` 和 `W`）连接到编码器连接器 `P_ENC`。

<img src="extras/Images/foc_shield_v13_hall.png" class="">
