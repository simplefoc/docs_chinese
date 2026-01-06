---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Mini</span>
parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
description: "Arduino SimpleFOCShield board showcase."
nav_order: 2
permalink: /simplefocmini
has_children: true
has_toc: false
toc: true
---


# <span class="simple">Simple<span class="foc">FOC</span>Mini</span>  <small><i>v1.1</i></small>


![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/simplefocmini)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/simplefocmini?color=blue)

<img src="https://raw.githubusercontent.com/simplefoc/SimpleFOCMini/main/images/side.png" class="width20"/><img src="https://raw.githubusercontent.com/simplefoc/SimpleFOCMini/main/images/top.png" class="width20"/><img src="https://raw.githubusercontent.com/simplefoc/SimpleFOCMini/main/images/bottom.png" class="width20"/>

<span class="simple">Simple<span class="foc">FOC</span>Mini</span> 是一款小封装、低成本、模块化且用户友好的驱动器，用于通过 FOC 算法运行云台无刷电机。与 <span class="simple">Simple<span class="foc">FOC</span>Shields</span> 一样，这款板子的主要目的是让在业余爱好应用中使用低功率无刷电机变得更加容易。
这款板子的主要目标是：

- 制作一款小封装的无刷电机驱动器，同时仍具备 <span class="simple">Simple<span class="foc">FOC</span>Shield </span>v1 的所有功能
- 使其成为对基于 DRV8313 芯片构建自己板子感兴趣的用户的最小工作示例。
- 尽可能降低成本。
- 仅使用（截至 2022 年年中）长期可用的组件。
- 最后，这款板子的目标是提供一个模块化且简单的设置，用于通过 FOC 控制来控制云台电机（最大 3 A），并支持快速原型制作和充分发挥其性能。

这款板子与 <span class="simple">Simple<span class="foc">FOC</span>library</span> 结合使用，将为您提供一种简单直观的方式来控制无刷电机的电流、扭矩、速度和位置。并且这款板子可以作为 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v1 的直接替代品使用。



<img  src="https://simplefoc.com/assets/img/miniv11_exploded.jpg"  class="width20"/><img  src="https://simplefoc.com/assets/img/miniv11_front.jpg"  class="width20"/><img  src="https://simplefoc.com/assets/img/miniv11_back.jpg"  class="width20"/>


## 特性
- **即插即用**：与 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 配合使用
- **基于 DRV8313** - [数据手册](https://www.ti.com/lit/ds/symlink/drv8313.pdf?ts=1650461862269&ref_url=https%253A%252F%252Fwww.google.com%252F)
  - 电源供应：8-35V
  - 最大电流：每相 2.5A
  - 板载 3.3V LDO
- **小尺寸**：26x21 毫米
- **完全开源**：
  - [EasyEDA](https://easyeda.com/the.skuric/simplefocmini)
  - [GitHub](https://github.com/simplefoc/SimpleFOCMini) 
- **低成本**：
   - JLCPCB 制造成本约 3-5 欧元
   - 即将在 [商店](https://www.simplefoc.com/shop) 上架：7-10 欧元



<blockquote class="warning"> 
<p class="heading">注意</p>
这款无刷电机驱动板主要设计用于内阻 R >10 Ω 的云台电机。在决定使用 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 之前，请确保您的电机符合这一类别。
</blockquote>

<img src="https://simplefoc.com/assets/img/shield_vs_mini.jpg" class="img300"><img src="https://user-images.githubusercontent.com/36178713/164240473-5abd7453-9d38-4f25-9195-378c39180054.jpg" class="img300">

### 发布日志

版本 | 日期 | 描述
--- | --- | ---
v1.1 | 2024-04 | 快速迭代，有几处改动：<br>1. 对齐电机输出接头与输入接头，以便可以堆叠在原型板上<br>2. 更新输入接头，使其更易于与 Arduino UNO、nucleos 以及 qtpy 等配合使用...<br> - 更改了 IN1、IN2、IN3 和 EN 的顺序：<br> - 增加了一个额外的 GND 引脚
v1.0 | 2022-04 | 初始版本

### 连接示意图
带编码器作为位置传感器的无刷电机的电气连接示例。
<p><img src="extras/Images/connection_mini.jpg" class="width60"></p>
有关如何将硬件连接到板子的更多信息，请查看完整的 [连接示例](mini_example)。

## 项目示例：反作用轮倒立摆
<iframe class="youtube"  src="https://www.youtube.com/embed/Ih-izQyXJCI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
这是一个完全基于 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 和 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 设计和控制反作用轮倒立摆的项目。

这个项目在很多方面都很有趣，它适合：
- 寻找良好测试平台来验证其高级算法的学生
- 所有有一点空闲时间并且有动力去创造一些很酷的东西的人 

有关必要组件、设计选择和代码的完整文档，请访问 [项目文档](simplefoc_pendulum)。

<blockquote class="info"> <p class="heading">📢 
这个项目完全可以使用 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 板子来完成。</p>
</blockquote>

## 项目示例：线控转向 —— 双向触觉控制示例
<iframe class="youtube" src="https://www.youtube.com/embed/xTlv1rPEqv4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

这段视频展示了 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 支持与 Arduino UNO 和 STM32 Nucleo-64 板子堆叠使用。以及支持不同的传感器，包括磁性传感器和具有相对较大精度范围的编码器。

本项目中实现的控制算法有：
- **线控转向**（力反馈）：两个电机具有虚拟耦合位置
- **交互式仪表**（触觉速度控制）：两个电机具有虚拟耦合位置和速度


有关项目设置和代码的完整文档，请访问 [项目文档](haptics_examples)。

<blockquote class="info"> <p class="heading">📢 
这个项目完全可以使用 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 板子来完成。</p>
</blockquote>

## 入门指南

您已经拥有自己的 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 了吗？<br>
[这里有一个简单的指南，介绍如何开始准备您的设置](mini_getting_started)



## 如何获得 <span class="simple">Simple<span class="foc">FOC</span>Mini</span>
- **自己制作板子**：请访问 [板子制作](mini_fabrication) 了解如何自己制造板子！<br>
- **订购成品和测试过的板子**：查看我们的 [商店](https://simplefoc.com/shop)。
