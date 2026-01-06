---
layout: default
title: 开始上手
description: "Getting started with Arduino SimpleFOCShield"
parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
nav_order: 1
permalink: /arduino_simplefoc_shield_installation
has_children: true
has_toc: false
---
# Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 入门指南  

<img src="extras/Images/simple_foc_shield_v13_small.gif" class="width50">

## 步骤 1: [硬件配置](pads_soldering) 
Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 一个非常重要的特性就是硬件配置功能。

<img src="extras/Images/shield_bot_v131_pinout.gif" class="width40">

每个开发板的底部都有一组焊盘，用于进行配置。这些焊盘可以实现以下功能：
- 启用/禁用编码器 A、B 和 Index 通道的上拉电阻
- 配置 BLDC 驱动器引脚分布（PWM 引脚 A、B、C 和使能引脚）

[了解更多](pads_soldering)



## 步骤 2: [硬件连接](foc_shield_connect_hardware)

<img src="extras/Images/connection.gif" class="width50">

将 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 连接到微控制器、BLDC 电机、电源和传感器非常简单。

[了解更多](foc_shield_connect_hardware_cn)

## 步骤 3: [编写代码](foc_shield_code_cn)

当你确定了开发板合适的[硬件配置](pads_soldering_cn)，并且所有硬件都[连接就绪](foc_shield_connect_hardware_cn)后，就可以开始最令人兴奋的部分——编码了！

[了解更多](foc_shield_code_cn)
