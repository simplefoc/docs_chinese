---
layout: default
title: nRF52
nav_order: 9
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /nrf52_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# nRF52 开发板支持

| MCU    | 2 PWM 模式 | 4 PWM 模式 | 3 PWM 模式 | 6 PWM 模式 | PWM 频率配置 |
| ------ | ---------- | ---------- | ---------- | ---------- | ------------ |
| nRF52  | ✔️         | ✔️         | ✔️         | ✔️         | ✔️           |

由于 [@Polyphe](https://github.com/Polyphe) 的大量努力，Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>最近开始支持 nRF52 设备。以下是目前已测试过的开发板：

| 开发板                                                         | 名称                        | 规格                                                                 | 链接                                      | 价格  |
| -------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------- | ----------------------------------------- | ----- |
| [<img src="extras/Images/nano33_ble.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr1000-wifi) | Arduino Nano 33 BLE         | ARM Cortex M4F<br>- 3.3V 逻辑电平<br>- 12 路 PWM<br>- 所有引脚可中断<br>- 8 个 ADC 引脚<br>- 64MHz | [Arduino 商店](https://store.arduino.cc/arduino-mkr1000-wifi) | 18€   |
| [<img src="extras/Images/bluefruit_le.jpg" class="imgtable150">](https://www.adafruit.com/product/3406) | Adafruit Feather nRF52 Bluefruit | ARM Cortex M4F<br>- 3.3V 逻辑电平<br>- 12 路 PWM<br>- 所有引脚可中断<br>- 8 个 ADC 引脚<br>- 64MHz | [Adafruit 商店](https://www.adafruit.com/product/3406) | 22€   |


## Arduino IDE 支持包
为了在 Arduino IDE 中使用 nRF52 开发板，请通过 Arduino IDE 的开发板管理器安装 nRF52 支持包。

对于某些开发板，除了 Arduino nRF52 包之外，你可能还需要在开发板管理器中安装 Adafruit nRF52 包。这里有一个[快速指南](https://learn.adafruit.com/bluefruit-nrf52-feather-learning-guide/arduino-bsp-setup)，介绍如何在 Arduino IDE 中启用 Adafruit 包。