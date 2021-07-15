---
layout: default
title: Teensy boards
nav_order: 5
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /teensy_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Teensy support

MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
teensy | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> has recently started to support Teensy boards as well. The most commonly tested boards are Teensy 4.1 and Teensy 3.2, but most of the boards in 4.x and 3.x series should work out of the box with the library. 

 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/teensy41_4.jpg" class="imgtable150">](https://www.pjrc.com/store/teensy41.html) | Teensy 4.1 | ARM Cortex-M7 <br>- 3.3V logic<br> - 35 PWMs<br>- 18 analog input <br>- 600 MHz| [pjrc.com](https://www.pjrc.com/store/teensy41.html)| 25€ 
[<img src="extras/Images/teensy32.jpg" class="imgtable150">](https://www.pjrc.com/store/teensy32.html) | Teensy 3.2 | ARM Cortex-M4 <br>- 3.3V logic<br> - 12 PWMs<br>- 21 analog input <br>- 72 MHz| [pjrc.com](https://www.pjrc.com/store/teensy32.html)| 20€ 

If you are having issues with your teensy board or if you are interested in extending the  support please do not hesitate to post on out [community forum](https://community.simplefoc.com)!

## Arduino IDE support package
In order to use the Teensy boards in the Arduino IDE please instal the Teensy support package by following the steps of installing [Teensyduino addon](https://www.pjrc.com/teensy/td_download.html).