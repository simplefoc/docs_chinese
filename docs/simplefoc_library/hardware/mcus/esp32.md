---
layout: default
title: ESP
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /esp_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# ESP32开发板支持

| MCU       | 2 PWM模式 | 4 PWM模式 | 3 PWM模式 | 6 PWM模式           | PWM频率配置 | MCPWM | LEDC |
|-----------|-----------|-----------|-----------|---------------------|-------------|-------|------|
| esp32     | ✔️        | ✔️        | ✔️        | ✔️                  | ✔️          | ✔️    | ✔️   |
| esp32-s2  | ✔️        | ✔️        | ✔️        | ✔️（仅LEDC）        | ✔️          | ❌    | ✔️   |
| esp32-s3  | ✔️        | ✔️        | ✔️        | ✔️                  | ✔️          | ✔️    | ✔️   |
| esp32-c3  | ✔️        | ✔️        | ✔️        | ✔️（仅LEDC）        | ✔️          | ❌    | ✔️   |


Esp32设备可使用<span class="simple">Simple<span class="foc">FOC</span>library</span>进行完全配置，并且适用于所有驱动器类型。

### PWM驱动器

Esp32微控制器有两种不同的PWM生成底层驱动器：`MCPWM`和`LEDC`。`MCPWM`驱动器（**M**otor **C**ontrol **PWM**，电机控制PWM）是一种更高级的驱动器，允许对PWM信号进行更多控制，在<span class="simple">Simple<span class="foc">FOC</span>library</span>中默认使用。`LEDC`驱动器是一种较简单的驱动器，默认用于LED控制，但也可用于电机控制。`LEDC`驱动器的灵活性远低于`MCPWM`驱动器，但<span class="simple">Simple<span class="foc">FOC</span>library</span>也支持它。默认情况下，如果其他esp32设备支持`MCPWM`驱动器，则会使用该驱动器；如果不支持（例如esp32-s2和esp32-c3设备），则会使用`LEDC`驱动器。
如果使用的esp32设备支持`MCPWM`驱动器，但你想使用`LEDC`驱动器，可以通过定义`SIMPLEFOC_ESP32_USELEDC`构建标志来强制使用`LEDC`驱动器。

<blockquote class='info' markdown="1"><p class="heading" markdown="1">经验法则：`MCPWM`与`LEDC`</p>
如果使用的esp32设备支持`MCPWM`驱动器，建议使用它。`MCPWM`驱动器更灵活，允许对PWM信号进行更多控制。如果使用的esp32设备不支持`MCPWM`驱动器，也可以使用`LEDC`驱动器。
</blockquote>


<blockquote class='warning'>
<p class="heading">注意</p>
从<span class="simple">Simple<span class="foc">FOC</span>library</span>版本<a href="https://github.com/simplefoc/Arduino-FOC/releases">v2.3.4</a>开始，该库需要<a href='https://github.com/espressif/arduino-esp32/releases'>esp32 arduino包版本<b>v3.x</b></a>
</blockquote>

一些基于esp32的开发板示例：

| 开发板 | 名称 | 规格 | 链接 | 价格 |
|--------|------|------|------|------|
| [<img src="extras/Images/esp32.jpg" class="imgtable150">](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30:g:5-8AAOSwAThb3MaZ) | ESP32 | （例如NodeMCU）<br>- 3.3V / 5V逻辑电平<br>- 16个PWM<br>- 所有引脚可中断<br>- 240MHz<br>-  Wifi + 蓝牙 | [Ebay](https://www.ebay.com/itm/Espressif-ESP32-WLAN-Dev-Kit-Board-Development-Bluetooth-Wifi-v1-WROOM32-NodeMCU/253059783728?hash=item3aeb89dc30:g:5-8AAOSwAThb3MaZ) | 10欧元 |
| [<img src="extras/Images/d1_r32.jpg" class="imgtable150">](https://www.amazon.com/Arduino-Wireless-Bluetooth-Development-Memory/dp/B07W1K56LN/ref=sr_1_2?dchild=1&keywords=d1+r32&qid=1614849959&sr=8-2) | ESP32 R32 D1开发板 | - 3.3V / 5V逻辑电平<br>- 16个PWM<br>- 所有引脚可中断<br>- 240MHz<br>-  Wifi + 蓝牙<br>- Arduino接口 | [Amazon](https://www.amazon.com/Arduino-Wireless-Bluetooth-Development-Memory/dp/B07W1K56LN/ref=sr_1_2?dchild=1&keywords=d1+r32&qid=1614849959&sr=8-2) <br> [Ebay](https://www.ebay.com/itm/USB-B-ESP32-WiFi-Bluetooth-UNO-WeMos-D1-R32-4MB-Flash-CH340-Board-for-Arduino/264084379226?hash=item3d7ca7d65a:g:f0wAAOSwIs1cEF8l) | 10欧元 |
| [<img src="extras/Images/feathers2.jpg" class="imgtable150">](https://www.adafruit.com/product/4769) | FeatherS2 ESP32-S2 | - 3.3V / 5V逻辑电平<br>- 8个PWM<br>- 13个模拟通道<br>- 所有引脚可中断<br>- 240MHz<br>-  Wifi | [Adafruit商店](https://www.adafruit.com/product/4769) | 20欧元 |
| [<img src="extras/Images/metros2.jpg" class="imgtable150">](https://learn.adafruit.com/adafruit-metro-esp32-s2) | Metro ESP32-S2 | - 3.3V / 5V逻辑电平<br>- 8个PWM<br>- 18个模拟通道<br>- 所有引脚可中断<br>- 240MHz<br>-  Wifi | [Adafruit商店](https://www.adafruit.com/product/4775) | 15欧元 |

## Arduino IDE支持包

ESP32开发板通过[arduino-esp32](https://github.com/espressif/arduino-esp32)包获得支持，这是espressif提供的开源软件。你可以通过`Arduino Board Manager`搜索`esp32`下载支持包，或者按照其网页上的[包安装](https://github.com/espressif/arduino-esp32#installation-instructions)说明进行操作。

# ESP8266开发板支持

| MCU       | 2 PWM模式 | 4 PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置 |
|-----------|-----------|-----------|-----------|-----------|-------------|
| esp8266   | ✔️        | ✔️        | ✔️        | ❌        | ✔️          |

Esp8266设备在<span class="simple">Simple<span class="foc">FOC</span>library</span>中仍处于初始支持阶段，并已通过一系列不同的驱动器进行了测试。这些开发板只有4个PWM引脚，因此无法实现6PWM电机控制，而且只有一个模拟输入，无法进行FOC电流控制。

| 开发板 | 名称 | 规格 | 链接 | 价格 |
|--------|------|------|------|------|
| [<img src="extras/Images/ESP8266-NodeMCU.jpg" class="imgtable150">](https://www.make-it.ca/nodemcu-arduino/nodemcu-details-specifications/) | NodeMCU ESP8266 | - 3.3V逻辑电平<br>- 4个PWM<br>- 所有引脚可中断<br>- 80-160MHz<br>-  Wifi | [Aliexpress](https://fr.aliexpress.com/item/4000160133215.html?spm=a2g0o.productlist.0.0.14227d91b2rMrV&algo_pvid=3643ec64-8668-484e-9d0e-b38be7b8c375&algo_exp_id=3643ec64-8668-484e-9d0e-b38be7b8c375-1&pdp_ext_f=%7B%22sku_id%22%3A%2210000000516093098%22%7D) | 2-10欧元 |
| [<img src="extras/Images/esp8266_uno.png" class="imgtable150">](https://www.amazon.com/WOWOONE-Arduino-ESP8266-Development-Compatible/dp/B0899N647N?th=1) | ESP8266 ESP-12E D1开发板 | - 3.3V逻辑电平<br>- 4个PWM<br>- 所有引脚可中断<br>- 80-160MHz<br>-  Wifi<br>- Arduino UNO R3接口 | [Amazon](https://www.amazon.com/WOWOONE-Arduino-ESP8266-Development-Compatible/dp/B0899N647N?th=1) <br> [Aliexpress](https://fr.aliexpress.com/item/32822012864.html?spm=a2g0o.productlist.0.0.21175f67HylnCb&algo_pvid=5b656b45-d8e5-416d-b5bb-25587a13ac55&algo_exp_id=5b656b45-d8e5-416d-b5bb-25587a13ac55-3&pdp_ext_f) | 3-10欧元 |


## Arduino IDE支持包

ESP8266开发板通过[arduino-esp8266](https://github.com/esp8266/Arduino)包获得支持，这是espressif提供的开源软件。你可以通过`Arduino Board Manager`搜索`esp8266`下载支持包，或者按照其网页上的[包安装](https://arduino-esp8266.readthedocs.io/en/latest/installing.html)说明进行操作。