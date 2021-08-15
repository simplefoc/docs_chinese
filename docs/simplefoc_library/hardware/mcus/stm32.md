---
layout: default
title: STM32 boards
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stm32_mcu
parent: Microcontrollers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# STM32 boards support


MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️

Stm32 devices have full coagulability using the <span class="simple">Simple<span class="foc">FOC</span>library</span> and will work with all driver types.

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> will support most of the stm32 boards out there. Stm32 boards are very powerful and they are the most common choice for implementing motion control applications. Here are two most commonly used families of boards with this library. 

 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/nucleo.jpg" class="imgtable150">](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | Nucleo-64 boards | (ex. Nucleo F446RE)<br>- 3.3V logic<br> - 20 PWMs <br>- all pins interrupts<br>- 180Mhz | [Mouser](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | 15€
[<img src="extras/Images/bluepill.jpg" class="imgtable150">](https://www.ebay.com/itm/STM32F103C8T6-ARM-STM32-Dev-Development-Board-Module-Blue-Pill-BluePill/292145343898?hash=item4405382d9a:g:nZoAAOSwH-dZ6oaf) | Bluepill | (ex. STM32F103C8)<br>- 3.3V logic<br> - 15 PWMs <br>- all pins interrupts<br>- 72Mhz | [Ebay](https://www.ebay.com/itm/STM32F103C8T6-ARM-STM32-Dev-Development-Board-Module-Blue-Pill-BluePill/292145343898?hash=item4405382d9a:g:nZoAAOSwH-dZ6oaf) | 5€


There is a lot of stm32 based fully integrated boards for bldc motion control out there and <span class="simple">Simple<span class="foc">FOC</span>library</span> will in most cases be able to support them. 

 Board | Name | Specifications | Link | Price
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/B-G431B-ESC1_SPL.jpg" style="height:100px">](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html)| B-G431B-ESC1 | - STM32G431CB chip <br> - On-board ST-LINK/V2-1 <br> - 1 motor <br>- 30V/40A <br> - current sensing  <br> - fault protection     | [STM webiste](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html) <br> [Mouser](https://eu.mouser.com/ProductDetail/STMicroelectronics/B-G431B-ESC1/?qs=%2Fha2pyFaduj9HtQf9%2FgsBmvGqEl7EbEPOyTxg06xIidkuUIykXhpkA%3D%3D) | 16€
[<img src="extras/Images/strom.jpg" style="height:100px">](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | Storm32 BGC | - DRV8313 <br> - 3 motors  <br> - 50x50mm <br> - Stm32f103 | [Ebay](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | 25€

## Arduino IDE support package

The STM32 boards are supported using the [STM32Duino package](https://github.com/stm32duino), it is completely open-source and can be installed directly through the `Arduino Board Manager`.
Please check the [STM32Duino wiki](https://github.com/stm32duino/wiki/wiki/Getting-Started) to see a detailed guide how to install the package and all its functionalities.

## VESC boards support
Here is a very cool video about the initial support for the VESC4.1 using the <span class="simple">Simple<span class="foc">FOC</span>library</span> made by [@owennewo](https://github.com/owennewo):
<iframe class="youtube" src="https://www.youtube.com/embed/B5qq-aBI2XA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>