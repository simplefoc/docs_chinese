---
layout: default
title: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /arduino_simplefoc_library_showcase
has_children: True
has_toc: False
toc: true
---
# Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>

![许可证：MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://www.ardu-badge.com/badge/Simple%20FOC.svg)
![PlatformIO 注册表](https://badges.registry.platformio.org/packages/askuric/library/Simple%20FOC.svg)
[![状态](https://joss.theoj.org/papers/4382445f249e064e9f0a7f6c1bb06b1d/status.svg)](https://joss.theoj.org/papers/4382445f249e064e9f0a7f6c1bb06b1d)

[![AVR 构建](https://github.com/simplefoc/Arduino-FOC/actions/workflows/arduino.yml/badge.svg)](https://github.com/simplefoc/Arduino-FOC/actions/workflows/arduino.yml)
[![STM32 构建](https://github.com/simplefoc/Arduino-FOC/actions/workflows/stm32.yml/badge.svg)](https://github.com/simplefoc/Arduino-FOC/actions/workflows/stm32.yml)
[![ESP32 构建](https://github.com/simplefoc/Arduino-FOC/actions/workflows/esp32.yml/badge.svg)](https://github.com/simplefoc/Arduino-FOC/actions/workflows/esp32.yml)
[![RP2040 构建](https://github.com/simplefoc/Arduino-FOC/actions/workflows/rpi.yml/badge.svg)](https://github.com/simplefoc/Arduino-FOC/actions/workflows/rpi.yml)
[![SAMD 构建](https://github.com/simplefoc/Arduino-FOC/actions/workflows/samd.yml/badge.svg)](https://github.com/simplefoc/Arduino-FOC/actions/workflows/samd.yml)
[![Teensy 构建](https://github.com/simplefoc/Arduino-FOC/actions/workflows/teensy.yml/badge.svg)](https://github.com/simplefoc/Arduino-FOC/actions/workflows/teensy.yml)

![GitHub 最新发布版本](https://img.shields.io/github/v/release/simplefoc/arduino-foc)
![GitHub 发布日期](https://img.shields.io/github/release-date/simplefoc/arduino-foc?color=blue)
![GitHub 最新版本后提交数](https://img.shields.io/github/commits-since/simplefoc/arduino-foc/latest/dev)
![GitHub 提交活跃度](https://img.shields.io/github/commit-activity/m/simplefoc/arduino-foc/dev)

这个 Arduino 库为无刷直流电机（BLDC）和步进电机实现了磁场定向控制（FOC）算法。FOC 算法能实现极为平稳的运行，并提供高精度的扭矩、速度和位置控制。

该库适用于两类用户：
- 初学者：希望通过简单易用的方式学习如何控制无刷直流电机和步进电机
- 高级用户：准备深入研究 FOC 算法，并为特定应用/硬件优化代码

### 特性
- **易于安装**：
  - Arduino IDE：支持 Arduino 库管理器集成
  - 支持 PlatformIO
- **开源**：完整代码和文档可在 GitHub 上获取
- **目标**：
  - 支持尽可能多的[传感器](position_sensors) + [电机](motors) + [驱动器](drivers) + [电流检测](current_sense)组合
  - 提供最新、深入的文档，包括 API 参考和示例
- **易于设置和配置**：
  - 简单的硬件配置
  - 每个硬件组件均为 C++ 对象（易于理解）
  - 易于[调整控制环路](motion_control)
  - 支持[*Simple**FOC**Studio*](studio)配置图形界面工具
  - 内置通信和监控功能
- **跨平台**：
  - 代码可无缝从一个微控制器系列移植到另一个
  - 支持多种[MCU 架构](microcontrollers)：
    - Arduino：UNO、MEGA、DUE、Leonardo 等
    - STM32
    - ESP32
    - Teensy
    - 更多...

## YouTube 演示视频
<iframe class="youtube" src="https://www.youtube.com/embed/Y5kLeqTc6Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

该视频展示了 <span class="simple">Simple<span class="foc">FOC</span>库</span>的基本用法、电路连接及其核心功能。

**视频中的硬件设置包括：**
<ul class="width60">
<li>
<b>HMBGC V2.2 板</b> <a class="pull-right" href="https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ">Ebay 链接 <span class="fa fa-link"></span></a>
</li>
<li>
AMT 103 CUI 编码器 2048ppr <a class="pull-right" href="https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduivK%252B0pk7%2Fn5JVYn0KI22hXp9BVM%2FOAA64YDfmI%2FUQlRWDW0CMgz3WfQ6GDou4mx58%3D">Mouser 链接 <span class="fa fa-link"></span></a>
</li>
<li>
无刷直流云台电机 <a class="pull-right" href="https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_">速卖通链接 <span class="fa fa-link"></span></a>
</li>
</ul>

<iframe class="youtube" src="https://www.youtube.com/embed/RI4nNMF608I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

该视频展示了 <span class="simple">Simple<span class="foc">FOC</span>库</span>对 DRV8302 等高性能无刷直流驱动器的支持，以及对 Arduino 和 STM32 MCU 架构的兼容。

**视频中的硬件设置包括：**
<ul class="width60">
<li>
<b>DRV8302 驱动板</b> <a class="pull-right" href="https://bit.ly/2BZZ5fG">速卖通链接 <span class="fa fa-link"></span></a>
</li>
<li>
Arduino UNO <a class="pull-right" href="https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ">Ebay 链接 <span class="fa fa-link"></span></a>
</li>
<li>
Nucleo-64 F401RE<a class="pull-right" href="https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F401RE?qs=fK8dlpkaUMvGeToFJ6rzdA%3D%3D">Mouser 链接 <span class="fa fa-link"></span></a>
</li>
<li>
USA-DIGITAL E3-8192 编码器 8192ppr <a class="pull-right" href="https://www.usdigital.com/products/encoders/incremental/kit/E3">USA Digital 链接 <span class="fa fa-link"></span></a>
</li>
<li>
无刷直流云台电机 GBM5108-120T <a class="pull-right" href="https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html">iPower 商店 <span class="fa fa-link"></span></a>
</li>
</ul>

<iframe class="youtube" src="https://www.youtube.com/embed/xTlv1rPEqv4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

该视频展示了 <span class="simple">Simple<span class="foc">FOC</span>库</span>对 Arduino <span class="simple">Simple<span class="foc">FOC</span>扩展板</span>的支持，以及在 Arduino UNO 上使用多电机的场景。项目示例基于双向触觉控制。

**视频中的硬件设置包括：**
<ul class="width60">
<li>
<b>Arduino <span class="simple">Simple<span class="foc">FOC</span>扩展板</span></b> <a class="pull-right" href="arduino_simplefoc_shield_showcase">更多信息 <span class="fa fa-link"></span></a>
</li>
<li>
Arduino UNO <a class="pull-right" href="https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ">Ebay 链接 <span class="fa fa-link"></span></a>
</li>
<li>
Nucleo-64 F401RE<a class="pull-right" href="https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F401RE?qs=fK8dlpkaUMvGeToFJ6rzdA%3D%3D">Mouser 链接 <span class="fa fa-link"></span></a>
</li>
<li>
AS5600 <a class="pull-right" href="https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK">Ebay 链接 <span class="fa fa-link"></span></a>
</li>
<li>
AMT 103 CUI <a class="pull-right" href="https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduivK%252B0pk7%2Fn5JVYn0KI22hXp9BVM%2FOAA64YDfmI%2FUQlRWDW0CMgz3WfQ6GDou4mx58%3D">Mouser 链接 <span class="fa fa-link"></span></a>
</li>
<li>
USA-DIGITAL E3-8192 <a class="pull-right" href="https://www.usdigital.com/products/encoders/incremental/kit/E3">USA Digital 链接 <span class="fa fa-link"></span></a>
</li>
<li>
GBM5108-120T <a class="pull-right" href="https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html">iPower 商店 <span class="fa fa-link"></span></a>
</li>
<li>
GBM4108-120T <a class="pull-right" href="https://www.robotshop.com/en/ipower-gbm4108h-120t-gimbal-motor.html">Robotshop 链接 <span class="fa fa-link"></span></a>
</li>
</ul>

## 安装
根据你对代码的使用计划和具体应用场景，有多种安装该 Arduino 库的方式。
查看我们的[安装指南](installation)了解更多信息。

<img src="extras/Images/alm.gif" class="width50">

[了解更多 <i class="fa fa-external-link"></i>](installation)

## 支持的硬件
Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>采用模块化设计，支持市面上大多数电机+传感器组合，以及多款低成本无刷直流电机驱动板。
<p><img src="extras/Images/connection.gif" class="width50"></p>

[了解更多 <i class="fa fa-external-link"></i>](supported_hardware)

## 编写代码
该库的代码设计力求简单易用，同时为特定应用的配置和微调留有充足空间。

[了解更多 <i class="fa fa-external-link"></i>](code)

## 项目示例
我们很高兴为你提供多个项目示例，涵盖多种硬件配置和带有完整文档说明的代码！
查看[示例](examples)了解详情！
<p style="width:100%">
<a href="position_control_example"><img src="extras/Images/position_control_example.jpg" class="img200 img_half"></a><a href="velocity_control_example"><img src="extras/Images/hmbgc_v22_velocity_control.jpg" class="img200 img_half"></a><a href="simplefoc_pendulum"><img src="extras/Images/foc_pendulum.jpg" class="img200 img_half"></a>
</p>
