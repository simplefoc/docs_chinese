---
layout: default
title: ESP32
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /esp32_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---



# 支持 ESP32 控制板

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
esp32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

ESP32设备完全适用于使用<span>Simple<span>FOC</span>library</span>，可与所有不同类型的驱动器一起工作。

 板子示意图 | 名称 | 规格 | 链接 | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/esp32.jpg" class="imgtable150">](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30:g:5-8AAOSwAThb3MaZ) | ESP32 | (ex. NodeMCU)<br>- 3,3V / 5V logic<br> - 16 PWMs <br>- all pins interrupts <br>- 240MHz <br> - Wifi + 蓝牙 | [Ebay](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30:g:5-8AAOSwAThb3MaZ) | 10€
[<img src="extras/Images/d1_r32.jpg" class="imgtable150">](https://www.amazon.com/Arduino-Wireless-Bluetooth-Development-Memory/dp/B07W1K56LN/ref=sr_1_2?dchild=1&keywords=d1+r32&qid=1614849959&sr=8-2) | ESP32 R32 D1 board | - 3,3V / 5V logic<br> - 16 PWMs <br>- all pins interrupts <br>- 240MHz <br> - Wifi + 蓝牙<br> - Arduino headers | [Amazon](https://www.amazon.com/Arduino-Wireless-Bluetooth-Development-Memory/dp/B07W1K56LN/ref=sr_1_2?dchild=1&keywords=d1+r32&qid=1614849959&sr=8-2)  <br> [Ebay](https://www.ebay.com/itm/USB-B-ESP32-WiFi-Bluetooth-UNO-WeMos-D1-R32-4MB-Flash-CH340-Board-for-Arduino/264084379226?hash=item3d7ca7d65a:g:f0wAAOSwIs1cEF8l) | 10€



# Arduino IDE支持包

ESP32支持使用[arduino-esp32](https://github.com/espressif/arduino-esp32)软件包，它是由espressif公司提供的开源软件。你可以通过"Arduino 开发板管理器" 搜索 `esp32` 下载支持包，或按照其网页[支持包安装](https://github.com/espressif/arduino-esp32#installation-instructions)的说明，下载支持包。

