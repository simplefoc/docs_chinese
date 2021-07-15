---
layout: default
title: ESP32 boards
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /esp32_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# ESP32 boards support

MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
esp32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

Stm32 devices have full coagulability using the <span class="simple">Simple<span class="foc">FOC</span>library</span> and will work with all driver types.

 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/esp32.jpg" class="imgtable150">](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30:g:5-8AAOSwAThb3MaZ) | ESP32 | (ex. NodeMCU)<br>- 3,3V / 5V logic<br> - 16 PWMs <br>- all pins interrupts <br>- 240MHz <br> - Wifi + Bluetooth | [Ebay](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30:g:5-8AAOSwAThb3MaZ) | 10€
[<img src="extras/Images/d1_r32.jpg" class="imgtable150">](https://www.amazon.com/Arduino-Wireless-Bluetooth-Development-Memory/dp/B07W1K56LN/ref=sr_1_2?dchild=1&keywords=d1+r32&qid=1614849959&sr=8-2) | ESP32 R32 D1 board | - 3,3V / 5V logic<br> - 16 PWMs <br>- all pins interrupts <br>- 240MHz <br> - Wifi + Bluetooth <br> - Arduino headers | [Amazon](https://www.amazon.com/Arduino-Wireless-Bluetooth-Development-Memory/dp/B07W1K56LN/ref=sr_1_2?dchild=1&keywords=d1+r32&qid=1614849959&sr=8-2)  <br> [Ebay](https://www.ebay.com/itm/USB-B-ESP32-WiFi-Bluetooth-UNO-WeMos-D1-R32-4MB-Flash-CH340-Board-for-Arduino/264084379226?hash=item3d7ca7d65a:g:f0wAAOSwIs1cEF8l) | 10€

## Arduino IDE support package

ESP32 boards are supported using [arduino-esp32](https://github.com/espressif/arduino-esp32) package, it is open source software provided by the espressif. You can download the support package through the `Arduino Board Manager` by searching for `esp32` or follow the instruction of their webpage [package installation](https://github.com/espressif/arduino-esp32#installation-instructions).
