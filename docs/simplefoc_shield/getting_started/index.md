---
layout: default
title: 开始上手
description: "Getting started with Arduino SimpleFOCShield"
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
nav_order: 1
permalink: /arduino_simplefoc_shield_installation
has_children: true
has_toc: false
---
# 开始上手 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>  

<img src="extras/Images/simple_foc_shield_v13_small.gif" class="width50">

## 第一步: [硬件配置](pads_soldering) 
 使用Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 首先要进行引脚的配置。

<img src="extras/Images/shield_bot_v131_pinout.gif" class="width40">

每个驱动器的底部有一组用于配置的锡盘。这些焊盘功能包括：
- 启用/禁用编码器A、B和索引通道的负载电阻
- 配置无刷直流的驱动引脚（PWM引脚A、B、C和使能引脚）

[查看更多](pads_soldering)



## 第二步：[连接硬件](foc_shield_connect_hardware)

<img src="extras/Images/connection.gif" class="width50">

如图，将<span class="simple">Simple<span class="foc">FOC</span>Shield</span> 与单片机、无刷直流电机、电源和传感器连接起来。

[查看更多](foc_shield_connect_hardware)

## 第三步：[编写代码](foc_shield_code)

在配置好合适的 [硬件配置](pads_soldering) 和硬件 [连接](foc_shield_connect_hardware) 之后，我们就可以开始最激动人心的部分，写代码！

[查看更多](foc_shield_code)