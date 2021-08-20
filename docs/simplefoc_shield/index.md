---
layout: default
title: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
description: "Arduino SimpleFOCShield board showcase."
nav_order: 2
permalink: /arduino_simplefoc_shield_showcase
has_children: true
has_toc: false
---


# Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>  <small><i>v2.0.3</i></small>

这是一个开源的低成本无刷直流(BLDC)电机驱动器项目，主要用于最大5A电流的低功率的FOC应用。该驱动器完全兼容Arduino UNO和所有标准Arduino接口的主控板。SimpleFOCShield结合SimpleFOClibrary提供了友好的方式来控制无刷直流电机的硬件和软件。



## YouTube演示视频

<iframe class="youtube" src="https://www.youtube.com/embed/G5pbo0C6ujE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
### 特性
- **即插即用**：结合 Arduino *Simple**FOC**library* - [github](https://github.com/simplefoc/Arduino-FOC)
- **低成本**: 15 欧元的价格 - [查看价格](https://www.simplefoc.com/shop) 
- **在线电流传感**: 双向电流可达 3A/5Amps
   - 可选配置：3.3A - 3.3V adc, 5A - 5V adc
- **集成 8V 调节器**: 
   - 通过焊盘启用/禁用
- **最大功率 120W** - 最大电流 5A, 输入电源 12-24V
   - 适用于内阻 >10Ω 的云台电机. 
- **可叠板**：同时叠加两块SimpleFOCShield，运行2个电机
- **编码器/霍尔传感器接口**：集成的3.3kΩ上拉电阻（可选）
- **I2C 接口**：集成的4.7kΩ上拉电阻（可选）
- **可配置的引脚**：硬件配置 - 通过焊接连接
- **Arduino headers**：Arduino UNO, Arduino MEGA, STM32 Nucleo boards...
- **开源**：完全可用的制造文件 - [如何自制](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)

<blockquote class="warning"> 
<p class="heading">注意</p>
该无刷直流驱动器主要用于内阻为 >10 Ω的云台电机。使用 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 之前，请确保您的电机符合这个参数。
</blockquote>

<img src="https://simplefoc.com/assets/img/v1.jpg" class="img300 img_half"><img src="https://simplefoc.com/assets/img/v2.jpg" class="img300  img_half">

### 连接示意图
以编码器作为位置传感器的无刷直流电动机的电路连接示例。
<p><img src="extras/Images/foc_shield_v13.jpg" class="width60"></p>
有关如何将硬件连接到 shield 的更多信息，请查看完整的 [连接实例](arduino_simplefoc_shield)。

## 项目实例：倒立摆
<iframe class="youtube"  src="https://www.youtube.com/embed/Ih-izQyXJCI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
这是一个完全基于Arduino [SimpleFOC library 和 SimpleFOC shield](https://github.com/simplefoc/Arduino-FOC)设计和控制的，基于无刷电机的倒立摆

从许多方面来说，这是一个非常有趣的项目，它主要针对：

- 需要一个好的平台测试他们先进算法的学生。
- 有些许空闲时间和动力创造炫酷东西 ：D 的任何人。

有关必要的组件、设计选择和代码的完整文档，请访问 [项目文档](simplefoc_pendulum)。


## 项目实例：基于SimpleFOCShield和Arduino UNO的线控转向
<iframe class="youtube" src="https://www.youtube.com/embed/xTlv1rPEqv4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
这个视频演示了 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 支持与 Arudino UNO 和 STM32 Nucleo-64 板堆叠。以及支持不同的具有较大精度跨度的磁编码器。

本项目所实现的控制算法为：
- **线控**转向 （力反馈） ：两个电机的位置几乎耦合
- **交互测试 Interactive gauge** （触碰速度控制 haptic velocity control）：两个电机的位置和速度几乎耦合


有关项目设置和代码的完整文档，请访问 [项目文档](haptics_examples)。


## 入门指南

你拥有自己的 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 了吗？ <br>
[这里是一个简单的指南，如何开始您的设置](arduino_simplefoc_shield_installation)



## 如何获得 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 
- **自己制作板子**：请访问 [板的制造](arduino_simplefoc_shield_fabrication) 了解如何制造自己的板子！<br>
- **订购已完成的测试板**：看看我们的 [商店](https://simplefoc.com/simplefoc_shield_product).

