---
layout: default
title: SAMD21/51 
nav_order: 6
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /samd_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# SAMD21 开发板支持

| MCU    | 2 PWM 模式 | 4PWM 模式 | 3 PWM 模式 | 6 PWM 模式 | PWM 频率配置 |
| ------ | ---------- | --------- | ---------- | ---------- | ------------ |
| SAMD21 | ✔️         | ✔️        | ✔️         | ✔️         | ✔️           |
| SAMD51 | ✔️         | ✔️        | ✔️         | ✔️         | ✔️           |

由于 [@runger1101001](https://github.com/runger1101001) 的大量努力，Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>最近开始支持 SAMD21/SAMD51 设备。以下是迄今为止已测试过的开发板：

| 开发板图片                                                                 | 名称                  | 规格                                                                 | 链接                                          | 价格  |
| -------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------- | --------------------------------------------- | ----- |
| [<img src="extras/Images/mkr1000.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr1000-wifi) | Arduino MKR1000 WIFI  | SAMD21 Cortex®-M0+<br>- 3.3V 逻辑电平<br>- 12 路 PWM<br>- 10 路中断<br>- 7 个 ADC 引脚<br>- 48MHz | [Arduino 商店](https://store.arduino.cc/arduino-mkr1000-wifi) | 30€   |
| [<img src="extras/Images/mkr1010.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr-wifi-1010) | Arduino MKR1010 WIFI  | SAMD21 Cortex®-M0+<br>- 3.3V 逻辑电平<br>- 13 路 PWM<br>- 10 路中断<br>- 7 个 ADC 引脚<br>- 48MHz | [Arduino 商店](https://store.arduino.cc/arduino-mkr-wifi-1010) | 30€   |
| [<img src="extras/Images/nano33.png" class="imgtable150">](https://store.arduino.cc/arduino-nano-33-iot) | Arduino Nano 33 IoT   | SAMD21 Cortex®-M0+<br>- 3.3V 逻辑电平<br>- 12 路 PWM<br>- 10 路中断<br>- 7 个 ADC 引脚<br>- 48MHz | [Arduino 商店](https://store.arduino.cc/arduino-nano-33-iot) | 16€   |
| [<img src="extras/Images/sparkfun_samd21.jpg" class="imgtable150">](https://www.sparkfun.com/products/13672) | SparkFun SAMD21 开发板 | SAMD21 Cortex®-M0+<br>- 3.3V 逻辑电平<br>- 10 路 PWM<br>- 所有引脚可中断<br>- 14 个 ADC 引脚<br>- 48MHz | [SparkFun 商店](https://www.sparkfun.com/products/13672) | 25€   |
| [<img src="extras/Images/feather_basic.jpg" class="imgtable150">](https://www.adafruit.com/product/2772) | Adafruit Feather M0 Basic | SAMD21 Cortex®-M0<br>- 3.3V 逻辑电平<br>- 所有引脚支持 PWM<br>- 所有引脚可中断<br>- 12 个 ADC 引脚<br>- 48MHz | [Adafruit 商店](https://www.adafruit.com/product/2772) | 20€   |
| [<img src="extras/Images/feather_express.jpg" class="imgtable150">](https://www.adafruit.com/product/3857) | Adafruit Feather M4 Express | SAMD51 Cortex®-M4<br>- 3.3V 逻辑电平<br>- 所有引脚支持 PWM<br>- 所有引脚可中断<br>- 16 个 ADC 引脚<br>- 120MHz | [Adafruit 商店](https://www.adafruit.com/product/3857) | 20€   |
| [<img src="extras/Images/metro-m4.jpg" class="imgtable150">](https://www.adafruit.com/product/3382) | Adafruit Metro M4 Express | SAMD51 Cortex®-M4<br>- 3.3V 逻辑电平<br>- 22 个引脚支持 PWM<br>- 所有引脚可中断<br>- 8 个 ADC 引脚<br>- 120MHz | [Adafruit 商店](https://www.adafruit.com/product/3382) | 25€   |


## Arduino IDE 支持包
为了在 Arduino IDE 中使用 SAMD21 / SAMD51 开发板，请使用 Arduino IDE 开发板管理器安装 SAMD21/ SAMD51 支持包。

对于某些开发板，除了 Arduino SAMD 包之外，您可能还需要在开发板管理器中安装 Adafruit SAMD 包。这里有一个[快速指南](https://learn.adafruit.com/adafruit-metro-m4-express-featuring-atsamd51/setup)，介绍如何在 Arduino IDE 中启用 Adafruit 包。