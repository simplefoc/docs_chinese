---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
description: "SimpleFOC boards"
nav_order: 2
permalink: /boards
has_children: true
has_toc: false
toc: true
---

# <span class="simple">Simple<span class="foc">FOC</span> Boards</span>

SimpleFOC项目的目标之一是开发低成本、易于使用的无刷直流电机驱动板，这些驱动板与SimpleFOC库兼容，并且完全开源！因此，SimpleFOC团队成员开发了一系列专门为易用性设计的开发板，帮助你开启 FOC 之旅。除了易用性之外，这些开发板的目标是作为社区可以借鉴的参考设计。最后，尽管我们的商店中有一些开发板可供购买，但我们的文档提供了大量关于如何自行制作这些开发板的文档和分步指南。


SimpleFOC团队开发的官方驱动板主要有两种格式：

- <span class="simple">Shield</span> 特征: 这些开发板设计为与 Arduino 生态系统兼容，旨在与SimpleFOC库和 Arduino IDE 一起使用。它们设计易于使用，适用于中低功率应用。
   - <span class="simple">Simple<span class="foc">FOC</span>Shield</span> - <small>[了解更多](arduino_simplefoc_shield_showcase)</small> 
   - <span class="simple">Simple<span class="foc">FOC</span> <b>Power</b>Shield</span> - <small>⚠️<i>( 开发已中止 )</i></small> - <small>[了解更多](#simplefoc-powershield-v02-️-development-abandoned-)</small>
   - 📢**新**: <span class="simple">Simple<span class="foc">FOC</span><b>Drive</b></span>  - <small>[](boards#simplefoc-drive-v10---find-out-more)</small>

- <span class="simple">Mini</span> 特征:这些开发板设计得小巧、低成本且易于使用。它们适用于低功率应用，并设计为与SimpleFOC库兼容。
   - <span class="simple">Simple<span class="foc">FOC</span>Mini</span> - <small>[了解更多](simplefocmini)</small> 
   - <span class="simple">Simple<span class="foc">FOC</span> <b>Step</b>Mini</span>  - <small> [了解更多](#simplefoc-stepmini-v10---see-on-github)


除了官方开发板外，还有许多其他与SimpleFOC库兼容的开发板可供你探索，请参阅文档。此外，社区还提出了一些其他很棒的硬件设计。查看我们的[社区](https://community.simplefoc.com/)论坛了解更多信息。 


## Shield 外形的开发板

这些开发板设计为与 Arduino UNO R3 引脚兼容，使你能够轻松开始使用SimpleFOC库和 Arduino IDE。这些开发板可与任何具有标准 Arduino 引脚的开发板一起使用，例如 Arduino MEGA、STM32 Nucleo 开发板、Adafruit Metro、ESP32 D1 R3、Arduino UNO R4 等。这种格式使用户能够轻松更换微控制器，找到最适合其应用的解决方案。这些开发板是完全开源的，制造文件可在相应的存储库中找到，还有关于如何自行制造开发板的详细指南。这些开发板还在[商店](https://www.simplefoc.com/shop)有售，供那些喜欢购买的人使用，也可在 Aliexpress 和 Ebay 等其他主流平台上购买（与SimpleFOC项目无关）。


### <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small>v3.2</small> - <small>[了解更多](arduino_simplefoc_shield_showcase)</small>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/arduino-simplefocshield)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/arduino-simplefocshield?color=blue)

这是一款开源低成本无刷直流（BLDC）电机驱动板，主要用于高达 5 A的低功率 FOC 应用。该板与 Arduino UNO 和所有具有标准 Arduino 引脚的开发板完全兼容。
SimpleFOCShield与SimpleFOC库相结合，提供了一种用户友好的方式来控制无刷直流电机，无论是在硬件还是软件方面。

<div class="width40">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/master/images/top.png"/>
</div>


### 特点
{: .no_toc }
- **即插即用**: 与 Arduino SimpleFOC库结合使用 - [github](https://github.com/simplefoc/Arduino-FOC)
- **低成本**: 价格为15-30€ - [查看价格](https://www.simplefoc.com/shop) 
- **在线电流检测**: 高达5A双向
   - ACS712 霍尔滴娜拉传感器
- **集成 8V 稳压器**: 
   - 通过焊接焊盘启用 / 禁用
- **绝对最大额定值** - 专为内阻为 >10 Ωs 的云台电机而设计 
   - 最大电流: 3A, 
   - 最大输入电压: 35V
- **可堆叠**: 同时运行 2 个电机
- **编码器 / 霍尔传感器接口**: 集成 3.3kΩ 上拉电阻（可配置）
- **I2C 接口**: 集成 4.7kΩ 上拉电阻（可配置）
- **可配置引脚**: 硬件配置 - 焊接连接
- **Arduino 引脚**: Arduino UNO, Arduino MEGA, STM32 Nucleo 板...
- **开源**: 
   - 在 EasyEDA 中完全设计- [EasyEDA 项目](https://oshwlab.com/the.skuric/simplefocshield_copy_copy)
   - 完全可用的制造文件 - [如何自己制造](arduino_simplefoc_shield_fabrication)

<blockquote class="info">
📢<b>新</b>: <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v3.2现已推出！
</blockquote>



### <span class="simple">Simple<span class="foc">FOC</span> <b>Power</b>Shield</span> <small>v0.2</small> <small>⚠️<i>( 开发已中止 )</i></small>

一款强大的 Arduino 扩展板，用于使用 FOC 算法运行无刷直流电机。该板基于[BTN8982](https://www.infineon.com/dgdl/Infineon-BTN8982TA-DS-v01_00-EN.pdf?fileId=db3a30433fa9412f013fbe32289b7c17)半桥，可支持高达 30 安培的连续电流和 50 安培的峰值电流。使其成为可以运行几乎任何无刷直流电机的开发板。


<div class="width40">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOC-PowerShield/main/images/top.png"/>
</div>

<blockquote class="warning" markdown="1">
<p class="heading"> ⚠️ 注意：BTN8982/IFX007T性能问题</p>
BTN8982和IFX007T驱动器是为直流电机设计的，基于旧的H桥技术。它们的MOSFET上升时间很长（几微秒），在许多情况下占PWM占空比的相当大一部分。运行无刷直流电机时，精确的PWM占空比设置对于平稳高效的运行至关重要。因此，这些驱动器将无法在高频PWM（高于15kHz）下提供非常平稳的运行。在社区线程中了解更多信息 <a href="https://community.simplefoc.com/t/simplefoc-powershield/582" target="_blank">链接</a><br>

这种性能限制是<span class="simple">Simple<span class="foc">FOC</span> <b>Power</b>Shield</span> 项目目前被搁置的主要原因，尽管这些开发板可通过Aliexpress和其他一些平台购买，但不会通过simplefoc.com出售。
<br><br>

但这并不意味着开发板本身无法正常工作或不能在你的项目中使用。对于中高功率无刷直流控制，它仍然是最便宜（最简单）的解决方案之一，通过适当调整控制回路，你仍然可以用它获得一些不错的结果。
</blockquote>

### 特点
- **即插即用**: 与 Arduino SimpleFOC库结合使用
- **低成本**: 制造成本低于 25 欧元 / 个 -  **⚠️ simplefoc.com不会出售**
- **高端电流检测**: -  *Simple**FOC**库*尚不支持
- **串联电流检测**: - *Simple**FOC**库*支持
- **最大功率 < 500W**: 最大电流 30A，电源 24V
- **Arduino 引脚**: Arduino UNO, Arduino MEGA, STM32 Nucleo 板, Aruidno DUE...
- **小尺寸**: 53mm x 60mm
- **编码器 / 霍尔传感器接口**: 集成 3.3kΩ 上拉电阻（可配置）
- **开源**: 
   - 完整的制造文件
        - 如果从未做过，可参考*Simple**FOC**Shueld*的类似指南:  [如何自己制作](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)
   - Altium 项目
   - 3d 模型
   - 原理图

了解有关此开发板的更多信息 [链接](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield)

### <span class="simple">Simple<span class="foc">FOC</span> <b>Drive</b></span> <small>v1.0</small> - <small>[了解更多](https://github.com/simplefoc/SimpleFOC-DriveShield)</small>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/SimpleFOC-DriveShield)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/SimpleFOC-DriveShield?color=blue)

<div class="width40">
<img src="https://raw.githubusercontent.com/simplefoc/SimpleFOC-DriveShield/refs/heads/main/images/top.jpg" />
</div>

这是一款开源低成本的无刷直流电机驱动板，采用 Arduino 扩展板的形式。它是 SimpleFOC 项目的一部分。该板是 SimpleFOCShield 的升级版，设计用于驱动具有更高电流需求的电机，高达 30 A。该板的设计理念与 SimpleFOCShield 相同 —— 易于使用、低成本、开源，并且与 SimpleFOC 库完全兼容。

此外，该板的目的是作为社区构建自己的电机驱动器的模板项目。

- 该板相对简单，可以轻松修改以满足不同的要求。
- 该板在 EasyEDA 中设计，所有制造文件均可下载。

### 特点

- **开发板绝对最大额定值**
  - 最大电流：20A 连续（峰值 30A - 已测量）
  - 最大输入电压：30V
- **可堆叠**: 同时运行 2 个电机
- **编码器 / 霍尔传感器接口**: 集成 3.3kΩ 上拉电阻（可配置）
- **I2C 接口**: 集成 4.7kΩ 上拉电阻（可配置）
- **可配置引脚**: 硬件配置 - 焊接连接
- **Arduino 引脚**: Arduino UNO, Arduino MEGA, STM32 Nucleo 板...
- **开源**:
  - 完全在 EasyEDA 中设计: [EasyEDA 项目](https://oshwlab.com/the.skuric/SimpleFOC-Drive)
  - 在 github 上完全可用: [GitHub 项目](https://github.com/simplefoc/SimpleFOC-DriveShield)
- **低成本**: 估计价格为 25-40 欧元 - 将在 SimpleFOC 商店有售


## Boards in the <span class="simple">Mini</span> form factor

这是一组微型开发板，设计得小巧、低成本且易于使用。它们适用于低功率应用，并设计为与SimpleFOC库兼容。这些开发板是作为最小工作示例创建的，旨在作为社区可以借鉴的参考设计。这些开发板是完全开源的，制造文件可在相应的存储库中找到，还有关于如何自行制造开发板的详细指南。这些开发板还在[商店](https://www.simplefoc.com/shop)有售，供那些喜欢购买的人使用，也可在 Aliexpress 和 Ebay 等其他主流平台上购买（与SimpleFOC项目无关）。


<div class="width40 inline_block_top" markdown="1">

### <span class="simple">Simple<span class="foc">FOC</span> <b>Drive</b></span> <small>v1.1</small> - <small>[了解更多](simplefocmini)</small>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/simplefocmini)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/simplefocmini?color=blue)

小封装、低成本的无刷直流电机驱动板，与SimpleFOC库完全兼容


<img src="https://raw.githubusercontent.com/simplefoc/SimpleFOCMini/main/images/top.png" class="img200"/>




### 特点
- **即插即用**: 与 Arduino SimpleFOC库结合使用
- **基于DRV8313** - [数据手册](https://www.ti.com/lit/ds/symlink/drv8313.pdf?ts=1650461862269&ref_url=https%253A%252F%252Fwww.google.com%252F)
  - 电源: 8-35V
  - 最大电流: 2.5A 每相
  - 板载 3.3V LDO
      - 高达 10mA 
      - 可为 AS5600 或 CUI AMT102 等传感器供电
- **小尺寸**: 26x21 mm
- **完全开源**:
  - [EasyEDA](https://easyeda.com/the.skuric/simplefocmini)
  - [GitHub](https://github.com/simplefoc/SimpleFOCMini) 
- **低成本**: 
   - JLCPCB 生产成本约 ~3-5€
   - 在[商店](https://www.simplefoc.com/shop)有售: 7-15€ 

了解有关此开发板的更多信息 [链接](https://github.com/simplefoc/SimpleFOCMini)


</div><div class="width40 inline_block_top" style  markdown="1">

### <span class="simple">Simple<span class="foc">FOC</span> <b>Step</b>Mini</span> <small>v1.0</small> - <small>[查看Github](https://github.com/simplefoc/SimpleFOC-StepMini)</small>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/simplefoc-stepmini)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/simplefoc-stepmini?color=blue)

小封装、低成本的步进电机驱动板，与SimpleFOC库完全兼容

<img src="https://raw.githubusercontent.com/simplefoc/SimpleFOC-StepMini/main/docs/top.png" class="img200"/>


### 特点

- **即插即用**: 与 Arduino SimpleFOC库结合使用
- **基于DRV8844** - [数据手册](https://www.ti.com/lit/ds/symlink/drv8844.pdf)
  - 电源: 8-35V
  - 最大电流: 2.5A 每相
  - 板载 3.3V LDO
      - 高达 10mA 
      - 可为 AS5600 或 CUI AMT102 等传感器供电
- **小尺寸:** 26x21 mm
- **完全开源:** 
   - [EasyEDA link](https://easyeda.com/the.skuric/simplefocmini_copy)
   - 项目和制造文件：[Github](https://github.com/simplefoc/SimpleFOC-StepMini)
- **低成本:** 
   - JLCPCB 生产成本约  ~3-5€
   - 在[商店](https://www.simplefoc.com/shop)有售： 10-15€
</div>