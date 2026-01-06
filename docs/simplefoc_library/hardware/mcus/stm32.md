---
layout: default
title: STM32
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stm32_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# STM32开发板支持


驱动支持

MCU | 2 PWM模式 | 4PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置
--- | --- |--- |--- |--- |--- 
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️

电流检测支持

MCU | 串联式 | 低侧 | 高侧
--- | --- |--- |--- 
stm32（一般情况） | ✔️ | ❌ |  ❌
stm32f1系列 | ✔️ | ✔️（一个电机） |  ❌
stm32f4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32g4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32l4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32f7系列 | ✔️ | ✔️（一个电机） |  ❌
stm32h7系列 | ✔️ | ✔️（一个电机） |  ❌
stm32 B_G431B_ESC1 | ❌ | ✔️（一个电机） |  ❌

Stm32设备与<span class="simple">简易<span class="foc">FOC</span>库</span>完全兼容，可适用于所有驱动类型。

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>将支持大多数现有的stm32开发板。Stm32开发板功能强大，是实现运动控制应用的最常见选择。以下是该库最常用的两类开发板。

开发板 | 名称 | 规格 | 链接 | 价格
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/nucleo.jpg" class="imgtable150">](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | Nucleo-64开发板 | （例如Nucleo F446RE）<br>- 3.3V逻辑电平<br> - 20个PWM<br>- 所有引脚可中断<br>- 180Mhz | [Mouser](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | 15欧元
[<img src="extras/Images/bluepill.jpg" class="imgtable150">](https://www.ebay.com/itm/STM32F103C8T6-ARM-STM32-Dev-Development-Board-Module-Blue-Pill-BluePill/292145343898?hash=item4405382d9a:g:nZoAAOSwH-dZ6oaf) | 蓝板 | （例如STM32F103C8）<br>- 3.3V逻辑电平<br> - 15个PWM<br>- 所有引脚可中断<br>- 72Mhz | [Ebay](https://www.ebay.com/itm/STM32F103C8T6-ARM-STM32-Dev-Development-Board-Module-Blue-Pill-BluePill/292145343898?hash=item4405382d9a:g:nZoAAOSwH-dZ6oaf) | 5欧元


市面上有很多基于stm32的完全集成的无刷直流电机运动控制开发板，<span class="simple">简易<span class="foc">FOC</span>库</span>在大多数情况下都能够支持它们。

开发板 | 名称 | 规格 | 链接 | 价格
---- | --- | --- | --- | --- | ---
[<img src="extras/Images/B-G431B-ESC1_SPL.jpg" style="height:100px">](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html)| B-G431B-ESC1 | - STM32G431CB芯片 <br> - 板载ST-LINK/V2-1 <br> - 1个电机 <br>- 30V/40A <br> - 电流检测  <br> - 故障保护     | [STM官网](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html) <br> [Mouser](https://eu.mouser.com/ProductDetail/STMicroelectronics/B-G431B-ESC1/?qs=%2Fha2pyFaduj9HtQf9%2FgsBmvGqEl7EbEPOyTxg06xIidkuUIykXhpkA%3D%3D) | 16欧元
[<img src="extras/Images/strom.jpg" style="height:100px">](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | Storm32 BGC | - DRV8313 <br> - 3个电机  <br> - 50x50mm <br> - Stm32f103 | [Ebay](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | 25欧元

## Arduino IDE支持包

STM32开发板通过[STM32Duino包](https://github.com/stm32duino)提供支持，它是完全开源的，可以直接通过`Arduino板管理器`安装。
请查看[STM32Duino维基](https://github.com/stm32duino/wiki/wiki/Getting-Started)，了解安装该包及其所有功能的详细指南。

## VESC开发板支持
以下是由[@owennewo](https://github.com/owennewo)制作的关于VESC4.1初步支持<span class="simple">简易<span class="foc">FOC</span>库</span>的精彩视频：
<iframe class="youtube" src="https://www.youtube.com/embed/B5qq-aBI2XA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>