---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
description: "Arduino SimpleFOCShield board showcase."
nav_order: 1
permalink: /arduino_simplefoc_shield_showcase
has_children: true
has_toc: false
toc: true
---



# Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>  <small><i>v3.2</i></small> 


![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/arduino-simplefocshield)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/arduino-simplefocshield?color=blue)

这是一款开源低成本的无刷直流（BLDC）电机驱动板，主要适用于高达5安培的低功率FOC应用。该板与Arduino UNO以及所有带有标准Arduino接头的开发板完全兼容。
<span class="simple">Simple<span class="foc">FOC</span>Shield</span>与<span class="simple">Simple<span class="foc">FOC</span>library</span>相结合，提供了一种*用户友好*的方式来从硬件和软件两方面控制BLDC电机。    

<img src="extras/Images/top_botv3.jpg" class="img300 img_half">

## YouTube演示视频
<iframe class="youtube" src="https://www.youtube.com/embed/G5pbo0C6ujE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 特点
- **即插即用**：与Arduino *Simple**FOC**library*结合使用 - [github](https://github.com/simplefoc/Arduino-FOC)
- **低成本**：价格为15-30欧元 - [查看价格](https://www.simplefoc.com/shop) 
- **串联电流检测**：高达5A双向
  - ACS712霍尔电流传感器
- **集成8V稳压器**：
  - 通过焊接焊盘启用/禁用
- **绝对最大额定值** - 为内阻>10Ω的云台电机设计。
  - 最大电流：3A，
  - 最大输入电压：35V
- **可堆叠**：同时运行2个电机
- **编码器/霍尔传感器接口**：集成3.3kΩ上拉电阻（可配置）
- **I2C接口**：集成4.7kΩ上拉电阻（可配置）
- **可配置引脚分配**：硬件配置 - 焊接连接
- **Arduino接头**：Arduino UNO、Arduino MEGA、STM32 Nucleo开发板等
- **开源**：
  - 完全在**EasyEDA**中设计：[EasyEDA项目](https://oshwlab.com/the.skuric/simplefocshield_copy_copy) 🎉
  - 完整的制造文件 - [如何自己制作](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)

### v3.x版本的新特性
- 从意法半导体的L6234芯片过渡到[DRV8313](https://www.ti.com/lit/ds/symlink/drv8313.pdf?ts=1719079575798)，后者更容易获取
- 从德州仪器的INA240电流放大器过渡到Allegro的[ACS712](https://www.sparkfun.com/datasheets/BreakoutBoards/0712.pdf)霍尔传感器
- 更小的尺寸：56mm x 53mm
- 故障和复位引脚外露（可选）
- 故障LED指示
- 完全在EasyEDA中设计，这是一款免费的在线PCB设计工具 - **[官方Easy EDA项目](https://oshwlab.com/the.skuric/simplefocshield_copy_copy)**


<blockquote class="warning"> 
<p class="heading">注意</p>
这款BLDC驱动板主要为内阻R>10Ω的云台电机设计。在决定使用<span class="simple">Simple<span class="foc">FOC</span>Shield</span>之前，请确保您的电机属于这一类别。
</blockquote>

## 板子版本对比

特性 | <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v1.x | <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v2.x | <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v3.x |
|-|-|-|-|
|<img src="https://simplefoc.com/assets/img/v1.jpg" class="img300 img_half">|<img src="https://simplefoc.com/assets/img/v2.jpg" class="img300  img_half">|<img src="https://simplefoc.com/assets/img/v3.jpg" class="img300  img_half">
**PWM驱动器** | [L6234](https://www.st.com/resource/en/datasheet/l6234.pdf) | [L6234](https://www.st.com/resource/en/datasheet/l6234.pdf) | [DRV8313](https://www.ti.com/lit/ds/symlink/drv8313.pdf?ts=1719165774986&ref_url=https%253A%252F%252Fwww.google.com%252F)
**电流检测** | ❌ | [INA240](https://www.ti.com/lit/ds/symlink/ina240.pdf?ts=1719180172738) | [ACS712](https://www.allegromicro.com/en/products/sense/current-sensor-ics/zero-to-fifty-amp-integrated-conductor-sensor-ics/acs712)
**电流测量范围** | ❌ | （可配置）±3.3/5安培 | ±5安培
**板载LDO** | ❌ | LM7808 | LM7808
**最大电流** | 2安培（峰值5安培） | 2安培（峰值5安培） | 2安培（峰值3安培）
**最大电压** | 24V | 35V | 35V
**保护功能** | 过温保护 | 过温保护 | 过温保护、过流保护
**可堆叠** | ✔️ | ✔️ | ✔️
**I2C上拉电阻** | ✔️ | ✔️ | ✔️
**编码器上拉电阻** | ✔️ | ✔️ | ✔️
**尺寸** | 68mm x 53 mm | 68mm x 53 mm | 56mm x 53mm
**设计工具** | Altium Designer 2019 | Altium Designer 2019 | EasyEDA 


### 连接示意图
带编码器作为位置传感器的BLDC电机的电气连接示例。
<p><img src="extras/Images/foc_shield_v13.jpg" class="width60"></p>

有关如何将硬件连接到屏蔽板的更多信息，请查看完整的[连接示例](arduino_simplefoc_shield)。

## 项目示例：反作用轮倒立摆
<iframe class="youtube"  src="https://www.youtube.com/embed/Ih-izQyXJCI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
这是一个完全基于Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>和<span class="simple">Simple<span class="foc">FOC</span>Shield</span>设计和控制反作用轮倒立摆的项目。

这个项目在很多方面都非常有趣，它适合：
- 寻找良好测试平台来运行高级算法的学生
- 有一点空闲时间并且有动力创造酷东西的所有人 :D

有关必要组件、设计选择和代码的完整文档，请访问[项目文档](simplefoc_pendulum)。


## 项目示例：线控转向 - 双向触觉控制示例
<iframe class="youtube" src="https://www.youtube.com/embed/xTlv1rPEqv4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

该视频展示了<span class="simple">Simple<span class="foc">FOC</span>Shield</span>支持与Arduino UNO和STM32 Nucleo-64开发板堆叠。以及对不同传感器（磁性传感器和编码器）的支持，这些传感器具有相对较大的精度范围。

本项目中实现的控制算法有：
- **线控转向**（力反馈）：两个电机具有虚拟耦合位置
- **交互式仪表**（触觉速度控制）：两个电机具有虚拟耦合位置和速度


有关项目设置和代码的完整文档，请访问[项目文档](haptics_examples)。


## 入门指南

您已经拥有自己的<span class="simple">Simple<span class="foc">FOC</span>Shield</span>了吗？<br>
[这里有一个简单的指南，介绍如何开始准备您的设置](arduino_simplefoc_shield_installation)



## 如何获得<span class="simple">Simple<span class="foc">FOC</span>Shield</span>
- **自己制作电路板**：请访问[电路板制造](arduino_simplefoc_shield_fabrication)了解如何自己制造电路板！<br>
- **订购成品和经过测试的电路板**：查看我们的[商店](https://simplefoc.com/simplefoc_shield_product)。
