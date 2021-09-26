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

# 支持SAMD21 驱动板

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
SAMD21 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
SAMD51 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

由于[@runger1101001](https://github.com/runger1101001)的大量投入，Arduino <span>Simple<span>FOC</span></span>library现已开始支持SAMD21/SAMD51设备。以下是到目前为止已经测试过的驱动板：

 板子示意图 | 名称 | 规格 | 链接 | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/mkr1000.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr1000-wifi) | Arduino MKR1000 WIFI | SAMD21 Cortex®-M0+  <br>- 3.3V logic<br> - 12 PWMs<br> - 10 interrupts <br>- 7 adc pins<br>- 48Mhz|[Arduino Store](https://store.arduino.cc/arduino-mkr1000-wifi) | 30€ 
[<img src="extras/Images/mkr1010.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr-wifi-1010) | Arduino MKR1010 WIFI | SAMD21 Cortex®-M0+ <br>- 3.3V logic<br> - 13 PWMs<br> - 10 interrupts <br>- 7 adc pins<br>- 48Mhz|[Arduino Store](https://store.arduino.cc/arduino-mkr-wifi-1010) | 30€ 
[<img src="extras/Images/nano33.png" class="imgtable150">](https://store.arduino.cc/arduino-nano-33-iot) | Arduino NANO 33 IOT | SAMD21 Cortex®-M0+ <br>- 3.3V logic<br> - 11 PWMs<br> - interrupts all pins <br>- 8 adc pins<br>- 48Mhz|[Arduino Store](https://store.arduino.cc/arduino-nano-33-iot) | 16€ 
[<img src="extras/Images/feather_basic.jpg" class="imgtable150">](https://www.adafruit.com/product/2772) | Adafruit Feather M0 Basic | SAMD21 Cortex®-M0 <br>- 3.3V logic<br> - all pins PWMs<br> - interrupts all pins <br>- 12 adc pins<br>- 48Mhz|[Adafruit Store](https://www.adafruit.com/product/2772) | 20€ 
[<img src="extras/Images/feather_express.jpg" class="imgtable150">](https://www.adafruit.com/product/2772) | Adafruit Feather M4 Express | SAMD51 Cortex®-M4 <br>- 3.3V logic<br> - all pins PWMs<br> - interrupts all pins <br>- 16 adc pins<br>- 120Mhz|[Adafruit Store](https://www.adafruit.com/product/3857) | 20€ 


## Arduino IDE 支持包
为了使用 Arduino IDE 中的 SAMD21/ SAMD51板，请使用 Arduino IDE 板子管理器安装 SAMD21/ SAMD51支持包。

对于某些板，除了在板子管理器中安装 Arduino SAMD 包外，你可能还需要安装 Adafruit SAMD包。这里是如何在 Arduino IDE 中启用 Adafruit 包的[一个快速指南](https://learn.adafruit.com/adafruit-metro-m4-express-featuring-atsamd51/setup)。