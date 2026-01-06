---
layout: default
title: 支持的硬件
nav_order: 2
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /supported_hardware
has_children: True
has_toc: false
---

#  <span class="simple">Simple<span class="foc">FOC</span>library</span> 支持的硬件

<p>
<img src="extras/Images/connection.gif" class="width60">
</p>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 的目标是让业余爱好者硬件也能使用磁场定向控制算法。基于这个目标，该库一直在不断开发，以支持更多的电机 + 传感器 + 驱动器 + 微控制器组合。

目前支持的硬件包括：
- **[电机 <i class="fa fa-external-link"></i>](motors)**
    - 无刷直流电机（BLDC）
    - 步进电机
- **[驱动器 <i class="fa fa-external-link"></i>](drivers)**
    - 无刷直流电机驱动器
    - 云台驱动器
    - 步进电机驱动器
- **[位置传感器 <i class="fa fa-external-link"></i>](position_sensors)**
    - 编码器
    - 磁性传感器
    - 霍尔传感器
    - 开环控制
- **[微控制器 <i class="fa fa-external-link"></i>](microcontrollers)** 
    - Arduino
    - STM32
    - ESP32
    - Teensy

## 设置示例
有关如何连接无刷直流电机、驱动器、微控制器和传感器的更多信息，请查看 [设置示例](setup_examples) 页面。

<a href="arduino_simplefoc_shield"><img src="extras/Images/foc_shield_v13.jpg" class="img200 img_third"> </a>
<a href="arduino_l6234"> <img src="extras/Images/uno_l6234.jpg" class="img200 img_third"> </a>
<a href="hmbgc"><img src="extras/Images/hmbgc_v22.jpg" class="img200 img_third"> </a>
