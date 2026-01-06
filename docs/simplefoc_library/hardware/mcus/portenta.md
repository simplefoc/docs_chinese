---
layout: default
title: Portenta H7
nav_order: 8
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /portenta_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Arduino PRO Portenta H7 开发板

MCU | 2 PWM 模式 | 4 PWM 模式 | 3 PWM 模式 | 6 PWM 模式 | PWM 频率配置
--- | --- | --- | --- | --- | ---
Portenta H7 | ✔️ | ✔️ | ✔️ | ❌ | ✔️

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>最近开始支持 Portenta H7 开发板，这是与 <img src="extras/Images/arduino.png" style="height:15px"><a href="https://www.arduino.cc/">Arduino</a> 公司合作的成果。目前支持仍处于初始阶段，但大多数与 PWM 相关的功能已经实现。

开发板 | 名称 | 规格 | 链接 | 价格
---- | --- | --- | --- | ---
[<img src="extras/Images/portenta.png" class="imgtable150">](https://store.arduino.cc/products/portenta-h7) | Portenta H7 | 双核 ST STM32H747XI 处理器<br>- 2MB 闪存<br>- WiFi/蓝牙模块<br>- 22 个定时器<br>- 4 个 DMA 控制器<br>- 多达 32 个 ADC 通道<br>- 480 MHz<br><i>以及更多功能...</i> | [Arduino 商店](https://store.arduino.cc/products/portenta-h7) | 90€


<blockquote class="warning"> <p class="heading">注意：当前实现的局限性 ⚠️</p>
Portenta H7 目前仅处于早期支持阶段。PWM 功能运行良好且已通过测试，大多数传感器也能正常工作，但 6PWM 支持尚未实现。目前仅使用了原始开发板上的引脚，未使用扩展板。
</blockquote>

## Arduino IDE 支持包
为了在 Arduino IDE 中使用 Portenta H7 开发板，请通过 Arduino IDE 开发板管理器安装 Arduino MBED OS Portenta H7 开发板支持包。如果不确定具体操作方法，Arduino 提供了一个[快速教程](https://docs.arduino.cc/tutorials/portenta-h7/por-ard-gs)。

以下是操作视频演示：
<iframe class="youtube" src="https://www.youtube.com/embed/epAn3ynDjhY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>