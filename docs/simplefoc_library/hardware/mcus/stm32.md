---
layout: default
title: STM32 板
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stm32_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 支持STM32 驱动板


MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️

Stm32设备完全适用于使用<span>Simple<span>FOC</span>library</span>。

Arduino <span>Simple<span>FOC</span>library</span>支持大多数stm32驱动板。Stm32驱动板非常强大，它们是实现运动控制应用程序的最常见选择，也是这个库中最常用的两类驱动板之一。

 板子示意图 | 名称 | 规格 | 链接                                                         | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/nucleo.jpg" class="imgtable150">](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | Nucleo-64 boards | (ex. Nucleo F446RE)<br>- 3.3V logic<br> - 20 PWMs <br>- all pins interrupts<br>- 180Mhz | [Mouser](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | 15€
[<img src="extras/Images/bluepill.jpg" class="imgtable150">](https://www.ebay.com/itm/STM32F103C8T6-ARM-STM32-Dev-Development-Board-Module-Blue-Pill-BluePill/292145343898?hash=item4405382d9a:g:nZoAAOSwH-dZ6oaf) | Bluepill | (ex. STM32F103C8)<br>- 3.3V logic<br> - 15 PWMs <br>- all pins interrupts<br>- 72Mhz | [Ebay](https://www.ebay.com/itm/STM32F103C8T6-ARM-STM32-Dev-Development-Board-Module-Blue-Pill-BluePill/292145343898?hash=item4405382d9a:g:nZoAAOSwH-dZ6oaf) | 5€

目前有很多基于stm32的集成板被用于无刷直流电机运动控制，大多数情况下<span>Simple<span>FOC</span>library</span>都能够支持它们。

 板子示意图                                                   | 名称         | 规格                                                         | 链接                                                         | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/B-G431B-ESC1_SPL.jpg" style="height:100px">](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html)| B-G431B-ESC1 | - STM32G431CB chip <br> - On-board ST-LINK/V2-1 <br> - 1 motor <br>- 30V/40A <br> - current sensing  <br> - fault protection     | [STM webiste](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html) <br> [Mouser](https://eu.mouser.com/ProductDetail/STMicroelectronics/B-G431B-ESC1/?qs=%2Fha2pyFaduj9HtQf9%2FgsBmvGqEl7EbEPOyTxg06xIidkuUIykXhpkA%3D%3D) | 16€
[<img src="extras/Images/strom.jpg" style="height:100px">](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | Storm32 BGC | - DRV8313 <br> - 3 motors  <br> - 50x50mm <br> - Stm32f103 | [Ebay](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | 25€

## Arduino IDE 支持包

STM32板支持使用[STM32Duino包](https://github.com/stm32duino)，它是完全开源的，可以直接通过`Arduino Board Manager`安装。
如何安装支持包及其所有功能的详细指南，请查看[STM32Duino wiki](https://github.com/stm32duino/wiki/wiki/Getting-Started)。

## 支持 VESC 驱动板
这里有一个由[@owennewo](https://github.com/owennewo)制作的非常酷的视频，介绍了使用<span>Simple<span>FOC</span>library</span>对VESC4.1的初始支持：

<iframe class="youtube" src="https://www.youtube.com/embed/B5qq-aBI2XA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>