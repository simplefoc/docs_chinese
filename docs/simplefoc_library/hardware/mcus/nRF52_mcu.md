---
layout: default
title: nRF52 boards
nav_order: 9
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /nrf52_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>nRF52 boards support
---

# 支持 nRF52 板

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置
--- | --- |--- |--- |--- |--- 
nRF52 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

由于[@Polyphe](https://github.com/Polyphe)投入了大量的努力，Arduino <span>Simple<span>FOC</span></span>library现已开始支持nRF52板。以下这些板子目前已通过测试：

 板子示意图 | 名字 | 规格                                                         | 链接                                                         | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/nano33_ble.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr1000-wifi) | Arduino Nano 33 BLE |  ARM Cortex M4F <br>- 3.3V logic<br> - 12 PWMs<br> - all pins interrupts <br>- 8 adc pins<br>- 64Mhz| [Arduino Store](https://store.arduino.cc/arduino-mkr1000-wifi) | 18€ 
[<img src="extras/Images/bluefruit_le.jpg" class="imgtable150">](https://www.adafruit.com/product/3406) | Adafruit Feather nRF52 Bluefruit | ARM Cortex M4F <br>- 3.3V logic<br> - 12 PWMs<br> - all pins interrupts <br>- 8 adc pins<br>- 64Mhz|[Adafruit Store](https://www.adafruit.com/product/3406) | 22€ 


## Arduino IDE支持包
为了在 Arduino IDE 中使用 nRF52 板，请使用 Arduino IDE 板子管理器安装 nRF52 板支持包。

对于某些板子，你可能需要在你的板管理器额外安装 Adafruit nRF52 支持包到 Arduino nRF52 支持包里。 以下是一个教你如何在 Arduino IDE中使用 Adafruit 支持包的 [快速教程](https://learn.adafruit.com/bluefruit-nrf52-feather-learning-guide/arduino-bsp-setup) 





