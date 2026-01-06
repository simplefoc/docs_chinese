---
layout: default
title: 首页
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) project documentation."
permalink: /
---
# Arduino Simple Field Oriented Control (FOC) project

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://www.ardu-badge.com/badge/Simple%20FOC.svg)
![PlatformIO Registry](https://badges.registry.platformio.org/packages/askuric/library/Simple%20FOC.svg)
[![status](https://joss.theoj.org/papers/4382445f249e064e9f0a7f6c1bb06b1d/status.svg)](https://joss.theoj.org/papers/4382445f249e064e9f0a7f6c1bb06b1d)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/arduino-foc)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/arduino-foc?color=blue)
![GitHub commits since tagged version](https://img.shields.io/github/commits-since/simplefoc/arduino-foc/latest/dev)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/simplefoc/arduino-foc/dev)

时代的进步通常令人激动。现今，无刷电机已经进入各种爱好者DIY社区，并且出现了很多高质量且拥有优异性能的无刷电机驱动方案。

相比于直流电机，无刷电机的优点可谓数不胜数，但同时它也拥有巨大的不足，那就是控制过于复杂。尽管身处工具链和PCB制造设计技术发达，设计自己的PCB变得很容易的年代，但一个低成本的无刷电机驱动方案却尚未出现。其中一个原因就是自行编写无刷电机的驱动方案太过复杂，尽管我们可以在网上找到很多成熟的FOC代码方案，但他们大部分都针对特定的硬件配置、特定的单片机；同时，现在很多的FOC算法和硬件开发尝试都是围绕着高功率无刷电机应用，低成本低功率的FOC硬件十分难找，甚至根本就找不到。

灯哥开源 是SimpleFOC官方中文资料的维护者。作为中文官方，我不仅及时更新SimpleFOC的中文翻译和技术资料，还基于SimpleFOC库开发了全开源的基于ESP32的双路无刷电机控制器硬件DengFOC。作为SimpleFOC技术的提倡者,欢迎大家使用SimpleFOC开源技术，若对中文资料有翻译问题或者疑惑，也欢迎大家联系我（待定）。

如果在国内的朋友访问速度慢，可以访问中国国内中文文档镜像站： http://simplefoc.cn/ <br>
基于以上痛点，本项目尝试：
- 🎯 揭开 FOC 算法的神秘面纱，制作一个强大而简单的 Arduino 库： [Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>](https://docs.simplefoc.com/arduino_simplefoc_library_showcase)（连接需要更换我们的）
  - <i>支持尽可能多的电机 + 传感器 + 驱动器 + MCU 组合</i>
- 🎯 开发模块化和易于使用的FOC，支持BLDC的驱动板
   - 官方驱动板，看[<span class="simple">Simple<span class="foc">FOC</span>Boards</span>](https://docs.simplefoc.com/boards)
   - 社区成员开发了越来越多的板子,看 [<span class="simple">Simple<span class="foc">FOC</span> Community</span>](https://community.simplefoc.com/)

<blockquote class="info" markdown="1">
   <p class="heading">新发布 📢: <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.3.5 <a href="https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.3.5">查看发布</a></p>

 - ESP32 错误修复
   - 在Arduino-ESP32内核的底层API更改后 [PR447](https://github.com/simplefoc/Arduino-FOC/pull/447)
   - 引脚没有配置 [PR458](https://github.com/simplefoc/Arduino-FOC/pull/458)
   - 修正了C6 MCPWM的错误 [PR440](https://github.com/simplefoc/Arduino-FOC/pull/440)
 - 新功能
   - 混合式步进电机相关已经添加到库里 [PR457](https://github.com/simplefoc/Arduino-FOC/pull/457) - [查阅文档](steppermotor)
   - 电机特征 (相位电阻和电感) [PR436](https://github.com/simplefoc/Arduino-FOC/pull/436) - [查阅文档](bldcmotor#how-can-i-measure-the-phase-resistance-and-inductance)
 - SAMD21 支持低侧电流检测 [PR479](https://github.com/simplefoc/Arduino-FOC/pull/479)
 - RP2350 支持 [PR435](https://github.com/simplefoc/Arduino-FOC/pull/435) [PR468](https://github.com/simplefoc/Arduino-FOC/pull/468)
 - STM32
   - 新驱动程序代码 [PR442](https://github.com/simplefoc/Arduino-FOC/pull/442)
   - 支持H7系列的低侧电流检测 [PR460](https://github.com/simplefoc/Arduino-FOC/pull/460)
 - 文档
   - 混合步进电机的例子 - [查看文档](stepper_control_shield)
   - 无传感器FOC例子 - [查看文档](sensorless_foc_nucleo_example)
   - 同步循环的简短指南 - [查看文档](real_time_loop)
 - 请参阅v2.3.5的错误修复和新特性的完整列表 [修复与新特性](https://github.com/simplefoc/Arduino-FOC/milestone/12) 
</blockquote>

# Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> <small>- [了解更多 ...](arduino_simplefoc_library_showcase)（链接需要修改）</small>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/arduino-foc)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/arduino-foc?color=blue)

<iframe class="youtube" src="https://www.youtube.com/embed/Y5kLeqTc6Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 这个视频演示了 Simple FOC 库的基本用法、电器连接并展示了它的性能。

### 特性
- **简易安装**: 
   - Arduino IDE: Arduino 库管理器集成
   - PlatformIO
- **开源**: 在github上可以获得完整的代码和文档
- **目标**: 
   - 支持尽可能多的 [传感器](position_sensors) + [电机](motors) + [驱动器](drivers) + [电流检测](current_sense)   组合
   - 提供包含 API 引用和示例的最新且深入的文档
- **易于设置和配置**: 
   - 简单的硬件配置
   - 每个硬件组件都是一个 C++ 对象（易于理解）
   - 轻松 [调整控制回路](motion_control)
   - [*Simple**FOC**Studio*](studio) 配置 GUI 工具
   - 内置通信和监控
- **跨平台**:
   - 从一个微控制器系列到另一个系列的无缝代码传输
   - 支持多种[MCU 架构](microcontrollers):
      - Arduino: UNO, MEGA, DUE, Leonardo, Nano, UNO R4, MKR ....
      - STM32
      - ESP32
      - Teensy
      - many more ...


# <span class="simple">Simple<span class="foc">FOC</span>Boards</span>  <small>- [了解更多 ...](boards)</small>

SimpleFOC 项目的目标之一是开发低成本、易于使用、与 SimpleFOC 库兼容且完全开源的 BLDC 驱动板！因此，SimpleFOC 团队成员开发了一套专为易于使用而设计的板，以帮助您启动 FOC 之旅。除了易于使用之外，这些板的目标是作为社区构建的参考设计。最后，尽管其中一些板可以在我们的[商店](https://www.simplefoc.com/shop)中找到，但我们的文档提供了大量有关如何自己制造板的文档和分步指南。

除了官方板之外，还有许多其他与 SimpleFOC 库兼容的板可供您探索，请参阅[文档](supported_hardware) 。此外，社区还提出了一些其他很酷的硬件设计。查看我们的[社区论坛](https://community.simplefoc.com/)了解更多信息。

以下是 SimpleFOC 团队开发的一些官方板：

<div class="width40 inline_block_top" markdown="1">

## <span class="simple">Simple<span class="foc">FOC</span>Shield</span>

<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/master/images/top.png"  class="img200"/>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/arduino-simplefocshield)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/arduino-simplefocshield?color=blue)

### 特征
- **基于 DRV8313** - [数据手册](https://www.ti.com/lit/ds/symlink/drv8313.pdf)
  - 电源: 8-35V
  - 最大电流: 2A 每相  (3Amp 峰值)
- **绝对最大额定值** - 专为内阻为 >10 Ωs 的云台电机而设计 
   - 最大电流: 3A, 
   - 最大输入电压: 35V
- **在线电流检测**: 高达双向5A
   - ACS712 霍尔电流传感器
- **集成8V稳压器**: 
   - 通过焊接确定是否使能
- **可堆叠**: 可以同时运行两台电机
- **编码器/霍尔传感器接口**: 集成 3.3kΩ 上拉（可配置）
- **I2C 接口**: 集成 4.7kΩ上拉（可配置）
- **可配置引脚排列**: 硬件配置 - 焊接连接
- **Arduino 接头**: Arduino UNO, Arduino MEGA, STM32 Nucleo 板...
- **开源**: 
   - 在 EasyEDA 中完全设计: [EasyEDA 项目](https://oshwlab.com/the.skuric/simplefocshield_copy_copy)
   - 完全可用的制造文件 - [如何自己制造](arduino_simplefoc_shield_fabrication)
- **低成本**: 
   - JLCPCB 生产成本 ~10-15€
   - [商店](https://www.simplefoc.com/shop)有售: 15-30€ 

</div><div class="width40 inline_block_top" style  markdown="1">

## <span class="simple">Simple<span class="foc">FOC</span>Mini</span>

<img src="https://raw.githubusercontent.com/simplefoc/SimpleFOCMini/main/images/top.png" class="img200"/>

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?color=blue)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/simplefoc/simplefocmini)
![GitHub Release Date](https://img.shields.io/github/release-date/simplefoc/simplefocmini?color=blue)

### 特征
- **基于 DRV8313** - [数据手册](https://www.ti.com/lit/ds/symlink/drv8313.pdf)
  - 电源: 8-35V
  - 最大电流: 2A 每相  (3Amp 峰值)
- **绝对最大额定值** - 专为内阻为 >10 Ωs 的云台电机而设计 
   - 最大电流: 3A, 
   - 最大输入电压: 35V
- **小尺寸**: 26x21 mm
- **开源**: 
   - 在 EasyEDA 中完全设计: [EasyEDA 项目](https://easyeda.com/the.skuric/simplefocmini)
   - 完全可用的制造文件 - [如何自己制造](mini_fabrication)
- **低成本**: 
   - JLCPCB 生产成本  ~3-5€
   - [商店](https://www.simplefoc.com/shop)有售: 7-15€ 

</div>

SimpleFOCShield的一个简短演示视频（有点过时，但仍然相关）

<iframe class="youtube"  src="https://www.youtube.com/embed/G5pbo0C6ujE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>（视频链接需要修改）

想了解更多关于电路板的信息以及自制方法，请查看 “ [电路板专区](boards) ”

## 其他的可代用FOC方案

SimpleFOC 的重点是使 FOC 变得简单 （:D），并支持尽可能多的电机 + 传感器 + 驱动器 + MCU 组合。如果您不太关心固件的简单性 ，并且不介意为了性能而权衡跨平台灵活性，那么还有其他几个项目也使用 FOC，并且可以为您的应用程序提供更紧凑、更强大或更强大的解决方案。其中许多项目都是开源的，从一开始就是我们的灵感来源，尤其是 VESC 和 Odrive。如果您正在开始您的 FOC 之旅，请务必查看它们！

P.S. 这些项目都没有使用 SimpleFOC 库 ，但 SimpleFOC 库可以用作这些项目中开发的多个驱动板的软件

项目 | 开源硬件 |  开源固件 | 简易使用 | 低成本 | 额定功率 | 支持步进 | SimpleFOC 支持
--- | --- | --- | --- | ---  | ---  | --- | --- 
<img src="https://images.squarespace-cdn.com/content/v1/58aff26de4fcb53b5efd2f02/1523147803002-0OYG383CVIPARMB6Y9IT/ODrive_v34%400%2C5x.jpg?format=500w" style="width:100%;max-width:100px"  > <br><a href="https://odriverobotics.com/" >Odrive</a> | ✔️/(❌ 来自最近) |  ✔️/(❌ 来自最近) |  ✔️ |  ❌ (>200$) | 高 （>50A） | ❌ |  ✔️
<img src="extras/Images/vesc.jpg" style="width:100%;max-width:100px"  > <br><a href="https://github.com/vedderb/bldc">Vesc </a> | ✔️ |  ✔️ |  ✔️ |  ❌ (>100$) | 非常高 （>100A） | ❌ |  ✔️
<img src="https://i3.ytimg.com/vi/g2BHEdvW9bU/maxresdefault.jpg" style="width:100%;max-width:100px"  ><br><a href="https://www.youtube.com/watch?v=g2BHEdvW9bU">Trinamic</a> | ❌ | ❌ | ✔️ |  ❌ (>200$) | 低 （~10A） | ✔️ | ❌
<img src="https://www.infineon.com/export/sites/default/_images/product/evaluation-boards/BLDC_Motor_Shild_with_TLE9879QXA40.jpg_1711722916.jpg" style="width:100%;max-width:100px"  ><br><a href="https://www.infineon.com/cms/en/product/evaluation-boards/bldc_shield_tle9879/" >Infineon</a> |  ✔️ | ❌ | ✔️ | ✔️ (50$) | 低 （~10A） | ❌ | ❌
<img src="https://hackster.imgix.net/uploads/attachments/998086/dev_kit_89eygMekks.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max" style="width:100%;max-width:100px"  ><br><a href="https://github.com/gouldpa/FOC-Arduino-Brushless">FOC-Arduino-Brushless</a>  | ✔️ | ✔️ | ❌ |✔️ (价格未知) | 低 （~10A） |  ❌ | ? (未测试)
<img src="https://tinymovr.com/cdn/shop/files/DSC_0940.jpg?v=1696112543&width=713" style="width:100%;max-width:100px"  ><br><a href="https://tinymovr.com/">Tinymovr R5.2</a> | ❌ | ✔️|✔️ | ❌ (~90$)  | 高 (~30A) |  ❌ | ? (未测试)
<img src="https://tinymovr.com/cdn/shop/products/DSC_0886.jpg?v=1678819186&width=713" style="width:100%;max-width:100px"  ><br><a href="https://tinymovr.com/">Tinymovr M5.2</a> | ❌ | ✔️ |✔️ | ❌ (~90$) | 低 (~6Amps) |  ❌ | ? (未测试)
<img src="https://mjbots.com/cdn/shop/files/20240410-moteus_c1_r12-front.jpg?v=1712841091&width=750" style="width:100%;max-width:100px"> <br><a href="https://mjbots.com/">Mjbots moteus</a> | ✔️ | ✔️ |✔️| ❌ (70-160$) | 中等 (20Amps)<br> 到<br> 高 (100Amps) | ❌ | ? (未测试)
<img src="https://raw.githubusercontent.com/open-dynamic-robot-initiative/open_robot_actuator_hardware/master/electronics/micro_driver_electronics/images/micro_driver_v2_1.jpg" style="width:100%;max-width:100px"> <br><br><a href="https://github.com/open-dynamic-robot-initiative/open-motor-driver-initiative">Open robotics initiative <br> MicroDriver</a> | ✔️ | ✔️ |❌ | ✔️(~50$)  | 中等 (~20Amps) |  ❌ | ? 未测试)
<img src="https://www.solomotorcontrollers.com/wp-content/uploads/2023/08/SOLO-MINI.png" style="width:100%;max-width:100px"> <br><br><a href="https://www.solomotorcontrollers.com/shop/">SOLO</a> | ❌ | ❌ |✔️ | ❌(70$-600$)  | 中等 (~16Amps) <br>到 <br> 非常高 (~120Amps) |  ❌ |  ❌ 


<blockquote class="warning">
⚠️ 这个列表当然不是详尽无遗的，请随时为扩展/完成/更正它做出贡献！
</blockquote>



