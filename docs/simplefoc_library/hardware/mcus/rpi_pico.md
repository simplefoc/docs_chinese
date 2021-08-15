---
layout: default
title: Raspberry Pi Pico boards
nav_order: 7
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /rpi_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Rapspberry Pi Pico  (rp2040) boards support

MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
(RP2040) RPI Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> recently started supporting the Raspberry pi Pico board due to a lot of effort put in by [@runger1101001](https://github.com/runger1101001). The support is stil in its intial stage but most of the PWM related features are already implemented. 

 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/pico.jpg" class="imgtable150">](https://www.adafruit.com/product/4883) | Raspberry Pi Pico RP2040 | Dual ARM Cortex-M0+  <br>- 3.3V logic<br> - 16 PWMs<br> - DMA controller <br>- 4 adc pins<br>- 133MHz |[Adafruit Store](https://www.adafruit.com/product/4883) | 5€ 


<blockquote class="warning"> <p class="heading">BEWARE: limitations of the current implementation ⚠️</p>
Raspberry Pi Pico has only the early stage of support. The PWM features work well and have been tested and most of the sensors will work well, but SPI magnetic sensors are for now not supported! 
</blockquote>

## Arduino IDE support package
In order to use the Pico boards in the Arduino IDE please install the Arduino MBED OS RP2040 boards support package using Arduino IDE board manager.

If using windows you might have to do a bit of acrobatics with the USB driver, but the soluion is reasonably fast and straingth forward. Here is [the link](https://arduino-pico.readthedocs.io/en/latest/install.html#uploading-sketches) with a bit of info how to do it.

Here is quick video showing how to do it:
<iframe class="youtube" src="https://www.youtube.com/embed/5YOEauk9bLo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>