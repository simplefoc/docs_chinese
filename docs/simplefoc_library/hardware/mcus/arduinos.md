---
layout: default
title: Arduino boards
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /arduino_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---
# Arduino 8-bit support


MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
Arduino (8-bit) | ✔️ | ✔️ | ✔️ | ✔️ | ❌

This table shows the 8-bit Arduino supported features. Basically everything except the frequency setting, the PWM frequency is fixed to 32kHz.


 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/arduino_uno.jpg" class="imgtable150">](https://store.arduino.cc/arduino-uno-rev3-smd) | Arduino UNO | ATMega328 <br>- 5V logic<br> - 6 PWMs<br>- 2 interrupts<br>- 16Mhz| [Ebay](https://www.ebay.com/itm/NEW-Arduino-UNO-R3-ATMEGA328P-CH340G-Microcontroller-Board-Bootloader-USB/323962801627?hash=item4b6db00ddb:g:ihUAAOSwLc1dNWCd)<br> [Arudino Store](https://store.arduino.cc/arduino-uno-rev3-smd) | 5€<br>25€ 
[<img src="extras/Images/mega.png" class="imgtable150">](https://store.arduino.cc/arduino-mega-2560-rev3) | Arduino Mega |  ATMega2560 <br>- 5V logic<br> - 15 PWMs<br>- 6 interrupts<br>- 16Mhz | [Ebay](https://www.ebay.com/itm/MEGA-2560-R3-Development-Board-CH340G-ATMEGA-2560-Kit-USB-Cable-For-Arduino-New/253764643649?epid=25019988960&_trkparms=ispr%3D1&hash=item3b158d2b41:g:C44AAOSwomJapjfF&enc=AQAEAAACYIQvEcHUrT7nmUC3yY5qbPyaBN1nJEDYW8MyypsJPgXK3AqiNsU0sSphPu4g6Qid31UfuUmxbibd03S6nwGFOtPRQtA6b7fwyQa%2BlHjHz58lNHKPszpYYTTo0kkJEDqmhf4Wiz0dmrGPE5aFjKQswyzpK0%2FagGHK8e518kkvgI15vEk3BEXEnW%2BgpNypJKacwMKe1INf06jl%2BrC%2FW50ef2gL1FPUQyUq9fK4Rm4tPSr28E52usHYczBDbdMdghFUExt3Ge%2B0iSj4t%2BcsyM2NGC%2BjCDDA8FBe3W5K8wg80e2DQwtM1R8Bpxrt6qJdyWZWigo8m4dpWLS%2Brmys9YJWASnU6mnFZoy4SLPUBLFK560rONYnB7aPohtZNJ%2BjCJPDLOQISm6tmGZVF5fMNu6iLYwYG8WG7J3c7rGVeUiDnJdf%2Fz68BNLAvth%2FnSoI9w7Jau%2Fd19gx3WYQbxgipDAmxgrVhGYlPrEvTSqCLIno1u3W%2FTI7FhSpNW%2Bgzw94kG%2FFgR9ieLRyv9p0w%2BYY3rrJepqCtlCJNkKflPpj4WAcXxBHHaQLJOr2mr7E2wRdwTBstIdCtoMmIp%2BjTRJFApIoT7fnEEIcMZyfLvbQZtemIQKHxpuibWKjQZU99awWsbMBlE0SRWaxRhML5YGORIjmgbIUyFdy9fiWHDcRpoKQJPsV6N3HUkRg9yU9cZ0m5w4ywXpiv7vHA8JFZg7hy5INiPGWwcxTRabpanq%2FWCB%2Bb4AN6%2BFP4%2Bqes86XVNe0YemDM1cBQWiHHjGxAHbw8gWuCZvXoc7XsJE5lrmQTsB1%2F%2FG6&checksum=253764643649687cd36869924033b58b75e082ef568d)<br>[Arduino Store](https://store.arduino.cc/arduino-mega-2560-rev3) | 10€<br>35€ 
[<img src="extras/Images/nano.png" class="imgtable150">](https://www.ebay.com/itm/Nano-V3-0-USB-ATmega328P-AU-16MHz-5V-CH340G-Micro-Controller-Board-For-Arduino/223471184608?hash=item3407ebaae0:g:-gMAAOSwdzBcpfIA) | Arduino NANO |  ATMega328<br> -5V logic<br> - 6 PWMs <br>- 2 interrupts<br> - 16Mhz  | [Ebay](https://www.ebay.com/itm/Nano-V3-0-USB-ATmega328P-AU-16MHz-5V-CH340G-Micro-Controller-Board-For-Arduino/223471184608?hash=item3407ebaae0:g:-gMAAOSwdzBcpfIA) | 3€

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> has stared as an Arduino UNO library and it has been optimized to be used with these types of devices. But it is not restricted to the Arduino UNOs, you will be able to run it on Arduino MEGA and basically any board with ATMega328 chip or ATMega2560. Such as Arduino Nano, Arduino pro-mini and similar.

Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/pinout.jpg" class="imgtable150">](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | HMBGC V2.2 |  ATMega328<br> - 5V logic<br> - 6 PWMs <br>- 0 interrupts<br> - No SPI<br>- 16Mhz <br> - 2x BLDC driver | [Ebay](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | 20€
[<img src="extras/Images/bgc_30.jpg" class="imgtable150">](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | BGC 3.0 |  ATMega328<br>- 5V logic<br> - 6 PWMs <br>- 0 interrupts<br> - 16Mhz <br> - 2x BLDC driver | [Aliexpress](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 10€

One of the interesting example boards for beginners are the gimbal controller boards based on the ATMega328 chips that usually have integrated BLDC driver hardware for running two motors. Their performance is limited but they are great initial setup.

# Arduino DUE support

MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
Arduino DUE  | ✔️ | ✔️ | ✔️ | ❌ | ✔️

At this moment Arduino DUE does not support 6pwm mode. If you are interested in this support please do no hesitate to post on our [community forum](https://community.simplefoc.com).

 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/due.jpg" class="imgtable150">](https://store.arduino.cc/arduino-due) | Arduino DUE | ARM Cortex-M3 <br>- 3.3V logic<br> - 12 PWMs<br>- nterrupts on all pins <br> - 12 analog inputs <br>- 84Mhz| [Ebay](https://www.ebay.com/itm/ARM-Cortex-M3-Control-Board-Module-DUE-R3-SAM3X8E-32-bit-Arduino-Without-Cable/113795035918?hash=item1a7eb6730e:g:7usAAOSws3ldD45r)<br> [Arudino Store](https://store.arduino.cc/arduino-due) | 15€<br>35€ 

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> will support ARM based Arduino DUE board as well!


## Arduino IDE support package
In order to use the Arduino DUE in the Arduino IDE please instal the Arduino DUE boards support package using Arduino IDE board manager.