---
layout: default
title: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /arduino_simplefoc_library_showcase
has_children: True
has_toc: False
---


# Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>

![Library Compile](https://github.com/simplefoc/Arduino-FOC/workflows/Library%20Compile/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://www.ardu-badge.com/badge/Simple%20FOC.svg?)

该Arduino库为无刷直流电机和步进电机实现磁场定向控制（FOC）算法。FOC算法产生平滑的操作和高度的扭矩、速度和位置控制。
该库的用途包括：

- 让初学者用简单的方法学习如何控制无刷直流电机和步进电机
- 方便高级用户深入研究FOC算法和为其特定应用程序/硬件优化代码

## 特征
- **Arduino 兼容性**：
   - Arduino库代码
  - Arduino库集成管理器
- **开源**: github上提供了完整的代码和文档
- **容易安装和配置**：
  - 简易硬件配置
  - 简单的 [调整控制回路](motion_control)
- **模块化**：
  - 支持多个电机：
     - 无刷直流电机
     - 步进电机
  - 支持多个 [传感器和驱动板](supported_hardware)
  - 支持多个 [微型控制器体系](microcontrollers):
     - Arduino: UNO, MEGA, any board with ATMega328 chips
     - STM32 boards: [Nucleo](https://www.st.com/en/evaluation-tools/stm32-nucleo-boards.html), [Bluepill](https://stm32-base.org/boards/STM32F103C8T6-Blue-Pill.html) ...
     - ESP32
     - Teensy boards
- **一插即用**: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 

## YouTube演示视频
<iframe class="youtube" src="https://www.youtube.com/embed/Y5kLeqTc6Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
本视频演示了 <span class="simple">Simple<span class="foc">FOC</span>library </span>的基本用法、接线和基本功能。

**视频硬件安装包括：**

<ul class="width60">
<li> 
<b>HMBGC V2.2 board </b> <a class="pull-right" href="https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ">Ebay link <span class="fa fa-link"></span></a>
</li>
<li>
AMT 103 CUI Encoder 2048ppr <a class="pull-right" href="https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduivK%252B0pk7%2Fn5JVYn0KI22hXp9BVM%2FOAA64YDfmI%2FUQlRWDW0CMgz3WfQ6GDou4mx58%3D">Mouser link <span class="fa fa-link"></span></a>
</li>
<li>
BLDC Gimbal Motor  <a class="pull-right" href="https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_">Aliexpress link <span class="fa fa-link"></span></a>
</li>
</ul> 

<iframe class="youtube" src="https://www.youtube.com/embed/RI4nNMF608I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
本视频演示了 <span class="simple">Simple<span class="foc">FOC</span>library </span>对DRV8302、Arudino和STM32 MCU等高性能BLDC驱动程序的支持。

**视频硬件安装包括：**

<ul class="width60">
<li>
<b>DRV8302 driver board</b> <a class="pull-right" href="https://bit.ly/2BZZ5fG">Aliexpress link <span class="fa fa-link"></span></a>
</li>
<li> 
Arduino UNO <a class="pull-right" href="https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ">Ebay link <span class="fa fa-link"></span></a>
</li>
<li> 
Nucleo-64 F401RE<a class="pull-right" href="https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F401RE?qs=fK8dlpkaUMvGeToFJ6rzdA%3D%3D">Mouser link <span class="fa fa-link"></span></a>
</li>
<li>
USA-DIGITAL E3-8192 Encoder 8192ppr  <a class="pull-right" href="https://www.usdigital.com/products/encoders/incremental/kit/E3">USA Digital link <span class="fa fa-link"></span></a>
</li>
<li>
BLDC Gimbal Motor GBM5108-120T <a class="pull-right" href="https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html">iPower store <span class="fa fa-link"></span></a>
</li>
</ul> 

<iframe class="youtube" src="https://www.youtube.com/embed/xTlv1rPEqv4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
本视频演示了SimpleFOClibrary对Arduino SimpleFOCShield的支持、以及对Arduino UNO使用多个电机的支持。项目示例基于双向触觉控制。

**视频硬件安装包括：**

<ul class="width60">
<li>
<b>Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span></b> <a class="pull-right" href="arduino_simplefoc_shield_showcase">More info <span class="fa fa-link"></span></a>
</li>
<li> 
Arduino UNO <a class="pull-right" href="https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ">Ebay link <span class="fa fa-link"></span></a>
</li>
<li> 
Nucleo-64 F401RE<a class="pull-right" href="https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F401RE?qs=fK8dlpkaUMvGeToFJ6rzdA%3D%3D">Mouser link <span class="fa fa-link"></span></a>
</li>
<li> 
AS5600  <a class="pull-right" href="https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK">Ebay link <span class="fa fa-link"></span></a>
</li>
<li>
AMT 103 CUI <a class="pull-right" href="https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduivK%252B0pk7%2Fn5JVYn0KI22hXp9BVM%2FOAA64YDfmI%2FUQlRWDW0CMgz3WfQ6GDou4mx58%3D">Mouser link <span class="fa fa-link"></span></a>
</li>
<li>
USA-DIGITAL E3-8192  <a class="pull-right" href="https://www.usdigital.com/products/encoders/incremental/kit/E3">USA Digital link <span class="fa fa-link"></span></a>
</li>
<li>
GBM5108-120T <a class="pull-right" href="https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html">iPower store <span class="fa fa-link"></span></a>
</li>
<li>
GBM4108-120T <a class="pull-right" href="https://www.robotshop.com/en/ipower-gbm4108h-120t-gimbal-motor.html">Robotshop <span class="fa fa-link"></span></a>
</li>
</ul> 


## 安装
安装Arduino库有两种方法，具体取决于你的需求。

- [Full library installation](library_download) - 带有实例，方便的一插即用方式
- [Minimal project builder](minimal_download) - 带有完整的集成库的Arduino项目
    - 更容易通过库代码交互试验

<img src="extras/Images/alm.gif" class="width50">

[Find out more <i class="fa  fa-external-link"></i>](installation)


## 支持的硬件
Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 是模块化的，将支持大多数电机+传感器组合和低成本的无刷直流驱动器板。

<p><img src="extras/Images/connection.gif" class="width50"></p>
[查看更多 <i class="fa  fa-external-link"></i>](supported_hardware)

## 编写代码
此库的代码编写方式尽可能简单易用，并为特定应用程序的配置和微调留出大量空间。

[Find out more <i class="fa  fa-external-link"></i>](code)


## 项目实例
我们很高兴为你提供多个项目、多个硬件配置以及完整的文档和代码解释！
让我们一起看看[实例](examples)吧！

<p style="width:100%">
<a href="position_control_example"><img src="extras/Images/position_control_example.jpg" class="img200 img_half"></a><a href="velocity_control_example"><img src="extras/Images/hmbgc_v22_velocity_control.jpg" class="img200 img_half"></a><a href="simplefoc_pendulum"><img src="extras/Images/foc_pendulum.jpg" class="img200 img_half"></a>
</p>