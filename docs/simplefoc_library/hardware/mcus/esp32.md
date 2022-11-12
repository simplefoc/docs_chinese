---
layout: default
title: ESP boards
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /esp_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 支持 ESP32 控制板

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
esp32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
esp32-s2 | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 
esp32-s3 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
esp32-c3 | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 

ESP32设备完全适用于使用<span>Simple<span>FOC</span>library</span>，可与所有不同类型的驱动器一起工作。

<blockquote class='info'>
<p class="heading">请注意 </p>
从 <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.2.1 版开始, 库需要 <a href='https://github.com/espressif/arduino-esp32/releases'>esp32 arduino 支持包 <b>v2.0.1+</b></a> 以上版本
</blockquote>


以下是一些基于 esp32 开发板的示例:

 板子示意图 | 名称 | 规格 | 链接 | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/esp32.jpg" class="imgtable150">](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30%3Cimg%20class=) | ESP32 | (ex. NodeMCU)<br>- 3,3V / 5V logic<br> - 16 PWMs <br>- all pins interrupts <br>- 240MHz <br> - Wifi + 蓝牙 | [Ebay](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30%3Cimg%20class=) | 10€
[<img src="extras/Images/d1_r32.jpg" class="imgtable150">](https://www.ebay.com/itm/USB-B-ESP32-WiFi-Bluetooth-UNO-WeMos-D1-R32-4MB-Flash-CH340-Board-for-Arduino/264084379226?hash=item3d7ca7d65a%3Cimg%20class=) | ESP32 R32 D1 board | - 3,3V / 5V logic<br> - 16 PWMs <br>- all pins interrupts <br>- 240MHz <br> - Wifi + 蓝牙<br> - Arduino headers | [Amazon](https://www.ebay.com/itm/USB-B-ESP32-WiFi-Bluetooth-UNO-WeMos-D1-R32-4MB-Flash-CH340-Board-for-Arduino/264084379226?hash=item3d7ca7d65a%3Cimg%20class=)  <br> [Ebay](https://www.ebay.com/itm/USB-B-ESP32-WiFi-Bluetooth-UNO-WeMos-D1-R32-4MB-Flash-CH340-Board-for-Arduino/264084379226?hash=item3d7ca7d65a%3Cimg%20class=) | 10€
[<img src="extras/Images/feathers2.jpg" class="imgtable150">](https://www.adafruit.com/product/4769) | FeatherS2 ESP32-S2 | - 3,3V / 5V logic<br/> - 8 PWMs <br/> - 13 analog channels <br/> - all pins interrupts <br/>- 240MHz <br/> - Wifi | [Adafruit shop](https://www.adafruit.com/product/4769) | 20€ 
[<img src="extras/Images/metros2.jpg" class="imgtable150">](https://learn.adafruit.com/adafruit-metro-esp32-s2) | Metro ESP32-S2 | - 3,3V / 5V logic<br/> - 8 PWMs <br/> - 1813 analog channels <br/> - all pins interrupts <br/>- 240MHz <br/> - Wifi | [Adafruit shop](https://www.adafruit.com/product/4775) | 15€ 



# Arduino IDE支持包

ESP32支持使用[arduino-esp32](https://github.com/espressif/arduino-esp32)软件包，它是由espressif公司提供的开源软件。你可以通过"Arduino 开发板管理器" 搜索 `esp32` 下载支持包，或按照其网页[支持包安装](https://github.com/espressif/arduino-esp32#installation-instructions)的说明，下载支持包。



# 支持ESP8266开发板

| MCU     | 2路 PWM 模式 | 4路PWM 模式 | 3路 PWM 模式 | 6路 PWM 模式 | pwm 频率配置 |
| ------- | ------------ | ----------- | ------------ | ------------ | ------------ |
| esp8266 | ✔️            | ✔️           | ✔️            | ❌            | ✔️            |

ESP8266开发板目前尚处于Simple<span class="foc">FOC</span>库的初步支持阶段，并且只测试了个别驱动。由于该开发板只有4个PWM引脚所以无法支持6路PWM模式，同时也只有1个模型信号输入引脚，故FOC电流控制是无法实现的。

| 开发板                                                       | 名称               | 规格                                                         | 链接                                                         | 售价  |
| ------------------------------------------------------------ | ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ----- |
| [<img src="extras/Images/ESP8266-NodeMCU.jpg" class="imgtable150">](https://www.make-it.ca/nodemcu-arduino/nodemcu-details-specifications/) | NodeMCU ESP8266    | - 3,3V 逻辑电平<br> - 4路PWM <br>- 全引脚中断支持 <br>- 80-160MHz <br> - Wifi | [Aliexpress](https://fr.aliexpress.com/item/4000160133215.html?spm=a2g0o.productlist.0.0.14227d91b2rMrV&algo_pvid=3643ec64-8668-484e-9d0e-b38be7b8c375&algo_exp_id=3643ec64-8668-484e-9d0e-b38be7b8c375-1&pdp_ext_f=%7B%22sku_id%22%3A%2210000000516093098%22%7D) | 2-10€ |
| [<img src="extras/Images/esp8266_uno.png" class="imgtable150">](https://www.amazon.com/WOWOONE-Arduino-ESP8266-Development-Compatible/dp/B0899N647N?th=1) | ESP8266 ESP-12E D1 | - 3,3V 逻辑电平<br/> - 4路PWM <br/>- 全引脚中断支持 <br/>- 80-160MHz <br/> - Wifi - Arduino UNO 接口 | [Amazon](https://www.amazon.com/WOWOONE-Arduino-ESP8266-Development-Compatible/dp/B0899N647N?th=1)  <br> [Aliexpress](https://fr.aliexpress.com/item/32822012864.html?spm=a2g0o.productlist.0.0.21175f67HylnCb&algo_pvid=5b656b45-d8e5-416d-b5bb-25587a13ac55&algo_exp_id=5b656b45-d8e5-416d-b5bb-25587a13ac55-3&pdp_ext_f) | 3-10€ |


## Arduino IDE 支持包

ESP8266开发板使用了 [arduino-esp8266](https://github.com/esp8266/Arduino)支持包，该支持包由esprissif提供开源代码。可在`"Arduino 开发板管理器` 中搜索esp8266,然后按照网页 [package installation](https://arduino-esp8266.readthedocs.io/en/latest/installing.html)上的安装说明进行安装。

