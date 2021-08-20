---
layout: default
title: 树莓派 Pico 板
nav_order: 7
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /rpi_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---



# 支持 Rapspberry Pi Pico (rp2040) 板

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
(RP2040) RPI Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

由于[@runger1101001](https://github.com/runger1101001)投入了大量的努力，Arduino <span>Simple<span>FOC</span></span>library现已开始支持Raspberry pi Pico板。虽然这种支持仍处于初始阶段，但大多数PWM相关功能已经实现。

 板子示意图 | 名称 | 规格 | 链接 | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/pico.jpg" class="imgtable150">](https://www.adafruit.com/product/4883) | Raspberry Pi Pico RP2040 | Dual ARM Cortex-M0+  <br>- 3.3V logic<br> - 16 PWMs<br> - DMA controller <br>- 4 adc pins<br>- 133MHz |[Adafruit Store](https://www.adafruit.com/product/4883) | 5€ 

<blockquote class="warning"> <p class="heading">注意：当前实现的局限性⚠️</p>
Raspberry Pi Pico只得到了早期阶段的支持。PWM功能工作得很好，并已经过测试，大多数传感器将工作得很好，但SPI磁传感器目前不支持!
</blockquote>

# Arduino IDE支持包

为了在 Arduino IDE 中使用 Pico 板，请使用 Arduino IDE 板子管理器安装 Arduino MBED OS RP2040 板支持包。

如果使用 windows，你可能必须设置下USB驱动程序，但过程是相当快速和简单的。更多如何做到这一点的信息在此[链接](https://arduino-pico.readthedocs.io/en/latest/install.html#uploading-sketches)。

下面是一个简短的视频，告诉你该怎么做：

<iframe class="youtube" src="https://www.youtube.com/embed/5YOEauk9bLo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
