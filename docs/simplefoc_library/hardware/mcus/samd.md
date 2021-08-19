---
layout: default
title: SAMD21/51 boards
nav_order: 6
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /samd_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# SAMD21 boards support

MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
SAMD21 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
SAMD51 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> recently started supporting the SAMD21/SAMD51 devices due to a lot of effort put in by [@runger1101001](https://github.com/runger1101001). These are the boards that have been tested so far:

 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/mkr1000.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr1000-wifi) | Arduino MKR1000 WIFI | SAMD21 Cortex®-M0+  <br>- 3.3V logic<br> - 12 PWMs<br> - 10 interrupts <br>- 7 adc pins<br>- 48Mhz|[Arduino Store](https://store.arduino.cc/arduino-mkr1000-wifi) | 30€ 
[<img src="extras/Images/mkr1010.jpg" class="imgtable150">](https://store.arduino.cc/arduino-mkr-wifi-1010) | Arduino MKR1010 WIFI | SAMD21 Cortex®-M0+ <br>- 3.3V logic<br> - 13 PWMs<br> - 10 interrupts <br>- 7 adc pins<br>- 48Mhz|[Arduino Store](https://store.arduino.cc/arduino-mkr-wifi-1010) | 30€ 
[<img src="extras/Images/nano33.png" class="imgtable150">](https://store.arduino.cc/arduino-nano-33-iot) | Arduino NANO 33 IOT | SAMD21 Cortex®-M0+ <br>- 3.3V logic<br> - 11 PWMs<br> - interrupts all pins <br>- 8 adc pins<br>- 48Mhz|[Arduino Store](https://store.arduino.cc/arduino-nano-33-iot) | 16€ 
[<img src="extras/Images/feather_basic.jpg" class="imgtable150">](https://www.adafruit.com/product/2772) | Adafruit Feather M0 Basic | SAMD21 Cortex®-M0 <br>- 3.3V logic<br> - all pins PWMs<br> - interrupts all pins <br>- 12 adc pins<br>- 48Mhz|[Adafruit Store](https://www.adafruit.com/product/2772) | 20€ 
[<img src="extras/Images/feather_express.jpg" class="imgtable150">](https://www.adafruit.com/product/2772) | Adafruit Feather M4 Express | SAMD51 Cortex®-M4 <br>- 3.3V logic<br> - all pins PWMs<br> - interrupts all pins <br>- 16 adc pins<br>- 120Mhz|[Adafruit Store](https://www.adafruit.com/product/3857) | 20€ 


## Arduino IDE support package
In order to use the SAMD21 / SAMD51 boards in the Arduino IDE please instal the SAMD21/ SAMD51 support package using Arduino IDE board manager.

For some boards you might need to install the Adafruit SAMD package in addition to the Arduino SAMD package in your Board manager. Here is [a quick guide](https://learn.adafruit.com/adafruit-metro-m4-express-featuring-atsamd51/setup) how to enable Adafruit packages in the Arduino IDE.