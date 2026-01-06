---
layout: default
title: Raspberry Pi Pico
nav_order: 7
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /rpi_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Raspberry Pi Pico（rp2040）开发板支持

| 微控制器 | 2 PWM 模式 | 4 PWM 模式 | 3 PWM 模式 | 6 PWM 模式 | PWM 频率配置 |
| --- | --- | --- | --- | --- | --- |
| （RP2040）RPI Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

由于 [@runger1101001](https://github.com/runger1101001) 的大量努力，Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>最近开始支持 Raspberry Pi Pico 开发板。目前支持仍处于初期阶段，但大多数与 PWM 相关的功能已经实现。

| 开发板 | 名称 | 规格 | 链接 | 价格 |
| ---- | --- | --- | --- | --- |
| [<img src="extras/Images/pico.jpg" class="imgtable150">](https://www.adafruit.com/product/4883) | Raspberry Pi Pico RP2040 | 双核 ARM Cortex-M0+<br>- 3.3V 逻辑电平<br>- 16 路 PWM<br>- DMA 控制器<br>- 4 个 ADC 引脚<br>- 133MHz | [Adafruit 商店](https://www.adafruit.com/product/4883) | 5€ |

<blockquote class="warning"> <p class="heading">注意：当前实现的局限性 ⚠️</p>
Raspberry Pi Pico 的 ADC 功能不足以支持低侧电流检测，但支持串联电流检测。电流检测功能是最近开发的，尚未经过充分测试。
</blockquote>

## Arduino IDE 支持包
为了在 Arduino IDE 中使用 Pico 开发板，请通过 Arduino IDE 开发板管理器安装 Arduino MBED OS RP2040 开发板支持包。

如果使用 Windows 系统，您可能需要对 USB 驱动程序进行一些操作，但解决方法相当快速和直接。这里是[相关链接](https://arduino-pico.readthedocs.io/en/latest/install.html#uploading-sketches)，里面有一些操作说明。

以下是一个快速演示视频：
<iframe class="youtube" src="https://www.youtube.com/embed/5YOEauk9bLo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>