---
layout: default
title: 首页
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) project documentation."
permalink: /
---
# Arduino Simple Field Oriented Control (FOC) project - Chinese 😃🇨🇳

![Library Compile](https://github.com/simplefoc/Arduino-FOC/workflows/Library%20Compile/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://www.ardu-badge.com/badge/Simple%20FOC.svg?)

时代的进步通常令人激动。现今，无刷电机已经进入各种爱好者DIY社区，并且出现了很多高质量且拥有优异性能的无刷电机驱动方案。

相比于直流电机，无刷电机的有点可谓数不胜数，但同时它也拥有巨大的不足，那就是控制过于复杂。尽管身处工具链和PCB制造设计技术发达，设计自己的PCB变得很容易的年代，但一个低成本的无刷电机驱动方案却尚未出现。其中一个原因就是自行编写无刷电机的驱动方案太过复杂，尽管我们可以在网上找到很多成熟的FOC代码方案，但他们大部分都针对特定的硬件配置、特定的单片机；同时，现在很多的FOC算法和硬件开发尝试都是围绕着高功率无刷电机应用，低成本低功率的FOC硬件十分难找，甚至根本就找不到。

<br>

基于以上痛点，本项目尝试：

- 🎯 揭开 FOC 算法的神秘面纱，制作一个强大而简单的 Arduino 库： [Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> ](#arduino-simplefoclibrary-v160)
  - <i>此库要支持尽可能多的**电机+传感器+电流检测+驱动器+单片机 **，做到通用性</i>
- 🎯 建立几套适应不同应用情况的低成本FOC驱动板：
   - 支持*小功率* 云台设备的板子（<5A）：   [Arduino <span class="simple">Simple<b>FOC</b>Shield</span> ](arduino_simplefoc_shield_showcase).
   - ***新*** 📢: 支持*中功率* 无刷直流电驱动器的板子（<30A）： [Arduino <span class="simple">Simple<b>FOC</b>PowerShield</span> ](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield).
   - 另外 [@byDagor](https://github.com/byDagor) *也做了完全集成的* 基于ESP32 的板子，大家可以一看： [Dagor Brushless Controller](https://github.com/byDagor/Dagor-Brushless-Controller)

<blockquote class="info">
   <p class="heading">新版本 📢: <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.1.1 - <a href="https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.1.1">请参阅版本</a></p>
   <ul>
      <li>初步支持 Raspberry pi Pico  - <a href="rpi_mcu">请参阅文档</a></li>
      <li>支持 SAMD51  - <a href="samd_mcu">请参阅文档</a></li>
      <li>完全支持 <a href="studio">Simple<b>FOC</b>Studio</a>  - <a href="studio">具体请参阅文档</a></li>
      <li>增加了对  <code class="highlighter-rouge">PWM制式磁编码器</code> 的初始支持 <a href="magnetic_sensor_pwm">请参阅文档</a></li>
      <li>改进了 esp32 的实现，新版本不用修改 @tschundler 对 <code class="highlighter-rouge">mcpwm.h</code> </li>
      <li>增加了 PowerShield 的实例 </li>
      <li>增加的 PowerShield 实例，能找出模拟信号和 PWM 制式传感器的最大值和最小值</li>
      <li>在库里增加了 commander 方法+附加的命令  - <a href="commander_interface">请参阅文档</a></li>
   </ul>
</blockquote>



## Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> <i><small>v2.1.1</small></i>
<iframe class="youtube"  src="https://www.youtube.com/embed/Y5kLeqTc6Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
这个视频演示了 Simple FOC 库的基本用法、电器连接并展示了它的性能。

### 特性
- **兼容 Arduino**：
   - Arduino 库代码
  - Arduino 库管理器集成
- **开源**：在github上可以获得完整的代码和文档
- **易于设置和配置**：
  - 硬件连接安装简单
  - 易于 [调整控制模式，如 开环/闭环等](motion_control)
- **模块化**：
  - 支持尽可能多的  [传感器，无刷直流电机和驱动器板](supported_hardware) 组合
  - 支持多种 [MCU架构](microcontrollers)：
     - Arduino: UNO, MEGA, 任何带有 ATMega328 芯片的电路板
     - STM32 板子： [Nucleo](https://www.st.com/en/evaluation-tools/stm32-nucleo-boards.html), [Bluepill](https://stm32-base.org/boards/STM32F103C8T6-Blue-Pill.html) ...
     - ESP32
     - Teensy 板子
- **即插即用**：Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 


## Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <i><small>v2.0.3</small></i>
<iframe class="youtube"  src="https://www.youtube.com/embed/G5pbo0C6ujE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
### 特性
- **即插即用**：通过库 Arduino *Simple**FOC**library* 实现- [github](https://github.com/simplefoc/Arduino-FOC)
- **低成本**: 15 欧元的价格 - [查看价格](https://www.simplefoc.com/shop) 
- **在线电流传感**: 双向可达 3A/5A
   - 可配置：3.3A - 3.3V adc, 5A - 5V adc
- **集成 8种 调节器**: 
   - 通过焊盘启用/禁用
- **最大功率 120W** - 最大电流 5A, 电源 12-24V
   - 适用于 >10Ωs 的云台电机. 
- **可堆叠接插**：同时运行2个电机
- **编码器/霍尔传感器接口**：集成的3.3kΩ上拉（可配置）
- **I2C 接口**：集成的4.7kΩ上拉（可配置）
- **引脚配置**：见 硬件配置 - 焊接连接 章节
- **支持的Arduino 型号**: Arduino UNO, Arduino MEGA, STM32 Nucleo boards...
- **开源**：开源全部DIY文件 - [如何自己制作它](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)

##### 如果你对这个产品感兴趣，可以在这个链接上找到更多信息： [Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](https://simplefoc.com/simplefoc_shield_product)


<p><img src="extras/Images/simple_foc_shield_v13_small.gif" class="img200" ><img src="https://simplefoc.com/assets/img/v1.jpg" class="img200 img_half" ><img src="https://simplefoc.com/assets/img/v2.jpg" class="img200 img_half" ></p>
## 其他的可代用FOC方案

列出几个可代用的FOC方案以供参考

 <a href="https://odriverobotics.com/" >Odrive</a>            | <a href="https://www.youtube.com/watch?v=g2BHEdvW9bU">Trinamic</a> | <a href="https://www.infineon.com/cms/en/product/evaluation-boards/bldc_shield_tle9879/" >Infineon</a> | <a href="https://github.com/gouldpa/FOC-Arduino-Brushless">FOC-Arduino-Brushless</a> 
 ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ 
 <img src="https://static1.squarespace.com/static/58aff26de4fcb53b5efd2f02/t/5c2c766921c67c143049cbd3/1546417803031/?format=1200w" style="width:100%;max-width:250px"  > | <img src="https://i3.ytimg.com/vi/g2BHEdvW9bU/maxresdefault.jpg" style="width:100%;max-width:250px"  > | <img src="https://www.infineon.com/export/sites/default/_images/product/evaluation-boards/BLDC_Motor_Shild_with_TLE9879QXA40.jpg_1711722916.jpg" style="width:100%;max-width:250px"  > | <img src="https://hackster.imgix.net/uploads/attachments/998086/dev_kit_89eygMekks.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max" style="width:100%;max-width:250px"  > 
 ✔️开源                                                        | ❌ 开源                                                       | ✔️ 开源                                                       | ✔️ 开源                                                       
 ✔️易用                                                        | ✔️ 易用                                                       | ✔️易用                                                        | ❌ 易用                                                       
 ❌ 低成本 ($100)                                              | ❌ 低成本 ($100)                                              | ✔️低成本 ($40)                                                | ✔️ 低成本                                                     
 ❌ 低功率 (>50A)                                              | ✔️ 低功率                                                     | ✔️  低功率                                                    | ✔️ 低功率                                                     
 ❌ 支持步进电机                                               | ❌ 支持步进电机                                               | ❌ 支持步进电机                                               | ❌ 支持步进电机                                               