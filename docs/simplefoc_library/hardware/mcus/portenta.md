---
layout: default
title: Portenta H7 开发板
nav_order: 8
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /portenta_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Arduino PRO Portenta H7 开发板

MCU | 2 路PWM 模式 | 4路PWM 模式 | 3路 PWM 模式 | 6路 PWM 模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
Portenta H7 | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 

Arduino Simple<span class="foc">FOC</span>库目前已经通过在<a href="https://www.arduino.cc/">Arduino</a>的合作下支持Portenta H7 开发板了。虽然尚处于初步阶段，但是大部分PWM相关的特性已经可以使用了。



| 开发板                                                       | 名称        | 规格                                                         | 链接          | 售价 |
| ------------------------------------------------------------ | ----------- | ------------------------------------------------------------ | ------------- | ---- |
| [<img src="extras/Images/portenta.png" class="imgtable150">](https://store.arduino.cc/products/portenta-h7) | Portenta H7 | ST STM32H747XI 双核处理器 <br/> - 2 M Flash <br/>- WiFi/BT 模块<br/> - 22个定时器<br/> - 4路DMA控制器 <br/>- 32路adc通道<br/>- 480 MHz主频 <br/> | Arduino Store | 90€  |



<blockquote class="warning"> <p class="heading">提醒: 电流限制 ⚠️</p>
Portenta H7 尚处于初步支持阶段. PWM模式中的大部分已通过大量传感器的测试，但是6路PWM模式尚不可用。目前只有底板的引脚可以使用，但不适用扩展板.
</blockquote>


## Arduino IDE 支持包
在 Arduino IDE 管理器中安装 Arduino MBED OS Poertenta H7 boards支持包后即可在Arduino IDE中使用Portenta H7开发板了。如果你不清楚如何具体操作，请点击这里的[快速入门](https://docs.arduino.cc/tutorials/portenta-h7/por-ard-gs)查看：

点击下方视频观看具体操作：
<iframe class="youtube" src="https://www.youtube.com/embed/epAn3ynDjhY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>



