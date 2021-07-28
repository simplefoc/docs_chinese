---
layout: default
title: Home
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) project documentation."
permalink: /
---
# Arduino Simple Field Oriented Control (FOC) project - Chinese 😃🇨🇳

Arduino 磁场定向控制 (FOC) 的简易项目 - 中文 😃

![Library Compile](https://github.com/simplefoc/Arduino-FOC/workflows/Library%20Compile/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://www.ardu-badge.com/badge/Simple%20FOC.svg?)

我们生活在一个非常激动人心的时代！无刷直流电机（BLDC motors）逐步进入业余社区，许多伟大的项目已经出现，利用其优越的动力学和电力能力。与常规直流电机相比，无刷直流电动机有许多优点，但它们有一个很大的缺点，即控制的复杂性。即使它的设计已经变得相对容易的，可以制造pcb，可以创建我们自己的硬件解决方案，但是合适的驱动无刷直流电机的低成本解决方案尚未到来。其中一个原因是编写无刷直流电机驱动算法的复杂性，磁场定向控制 （FOC）成为最有效的算法之一。可以在线找到的解决方案几乎都是针对特定的硬件配置和所使用的微控制器体系结构的。此外，目前的大部分工作仍集中在无刷直流电机的高功率应用上，而合适的低成本和低功率FOC支持板在今天很难找到，甚至可能不存在。<br>

因此，这是一种尝试：

- 🎯 解密FOC算法，制作一个强健但简单的Arduino库： [Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> ](#arduino-simplefoclibrary-v160)
  - <i>尽可能多地支持：**电机+传感器+电流检测+驱动器+单片机 **的组合</i>
- 🎯 开发一个支持无刷直流驱动板的模块化 FOC：
   - *小功率* 云台设备（<5Amps）：   [Arduino <span class="simple">Simple<b>FOC</b>Shield</span> ](arduino_simplefoc_shield_showcase).
   - ***新*** 📢: *中功率* 无刷直流电驱动器（<30Amps）： [Arduino <span class="simple">Simple<b>FOC</b>PowerShield</span> ](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield).
   - 参见 [@byDagor](https://github.com/byDagor) *完全集成的* 基于ESP32 的板： [Dagor Brushless Controller](https://github.com/byDagor/Dagor-Brushless-Controller)

<blockquote class="info">
   <p class="heading">新版本 📢: <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.1.1 - <a href="https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.1.1">请参阅版本</a></p>
   <ul>
      <li>Raspberry pi Pico 的初始支持  - <a href="rpi_mcu">请参阅文档</a></li>
      <li>支持 SAMD51  - <a href="samd_mcu">请参阅文档</a></li>
      <li>对 <a href="studio">Simple<b>FOC</b>Studio</a> 的完全支持 - <a href="studio">请参阅文档</a></li>
      <li>增加了对  <code class="highlighter-rouge">MagneticSensorPWM</code> 的初始支持 <a href="magnetic_sensor_pwm">请参阅文档</a></li>
      <li>改进了 esp32 的实现，以避免 @tschundler 对 <code class="highlighter-rouge">mcpwm.h</code> 的更改</li>
      <li>增加了 PowerShield 的实例 </li>
      <li>增加的 PowerShield 实例，能找出模拟信号和 PWM 信号传感器的最大值和最小值</li>
      <li>在库里增加了 commander 方法+附加的命令  - <a href="commander_interface">请参阅文档</a></li>
   </ul>
</blockquote>


## Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> <i><small>v2.1.1</small></i>
<iframe class="youtube"  src="https://www.youtube.com/embed/Y5kLeqTc6Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
这个视频演示了 Simple FOC 库的基本用法、电子连接并展示了它的性能。

### 特性
- **兼容 Arduino**：
   - Arduino 库代码
  - Arduino 库管理器集成
- **开源**：在github上可以获得完整的代码和文档
- **易于设置和配置**：
  - 简单的硬件配置
  - 易于 [调整控制回路](motion_control)
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
- **即插即用**：结合 Arduino *Simple**FOC**library* - [github](https://github.com/simplefoc/Arduino-FOC)
- **低成本**: 15 欧元的价格 - [查看价格](https://www.simplefoc.com/shop) 
- **在线电流传感**: 双向可达 3Amps/5Amps
   - 可配置：3.3Amps - 3.3V adc, 5Amps - 5V adc
- **集成 8V 调节器**: 
   - 通过焊盘启用/禁用
- **最大功率 120W** - 最大电流 5A, 电源 12-24V
   - 适用于 >10Ωs 的云台电机. 
- **可堆叠**：同时运行2个电机
- **编码器/霍尔传感器接口**：集成的3.3kΩ上拉（可配置）
- **I2C 接口**：集成的4.7kΩ上拉（可配置）
- **可配置的引出线**：硬件配置 - 焊接连接
- **Arduino headers**: Arduino UNO, Arduino MEGA, STM32 Nucleo boards...
- **开源**：完全可用的制造文件 - [如何自己制作它](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)

##### 如果你对这个产品感兴趣，可以在这个链接上找到更多信息： [Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](https://simplefoc.com/simplefoc_shield_product)


<p><img src="extras/Images/simple_foc_shield_v13_small.gif" class="img200" ><img src="https://simplefoc.com/assets/img/v1.jpg" class="img200 img_half" ><img src="https://simplefoc.com/assets/img/v2.jpg" class="img200 img_half" ></p>
## Alternative FOC supporting projects

可选的FOC支持的项目

这些只是可选FOC支持项目中的提供硬件和软件的少数几个解决方案。

<a href="https://odriverobotics.com/" >Odrive</a> | <a href="https://www.youtube.com/watch?v=g2BHEdvW9bU">Trinamic</a> | <a href="https://www.infineon.com/cms/en/product/evaluation-boards/bldc_shield_tle9879/" >Infineon</a> | <a href="https://github.com/gouldpa/FOC-Arduino-Brushless">FOC-Arduino-Brushless</a>
------------ | ------------- | ------------ | -------------
<img src="https://static1.squarespace.com/static/58aff26de4fcb53b5efd2f02/t/5c2c766921c67c143049cbd3/1546417803031/?format=1200w" style="width:100%;max-width:250px"  > | <img src="https://i3.ytimg.com/vi/g2BHEdvW9bU/maxresdefault.jpg" style="width:100%;max-width:250px"  > | <img src="https://www.infineon.com/export/sites/default/_images/product/evaluation-boards/BLDC_Motor_Shild_with_TLE9879QXA40.jpg_1711722916.jpg" style="width:100%;max-width:250px"  >| <img src="https://hackster.imgix.net/uploads/attachments/998086/dev_kit_89eygMekks.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max" style="width:100%;max-width:250px"  >
✔️ Open Source | ❌ Open Source | ✔️ Open Source(recently) | ✔️ Open Source
✔️Simple to use | ✔️ Simple to use | ✔️Simple to use | ❌ Simple to use
❌ Low cost ($100) | ❌ Low cost ($100) | ✔️Low cost ($40) | ✔️ Low cost
❌ Low power (>50A) | ✔️ Low power  | ✔️  Low power | ✔️ Low power
❌ Stepper support | ❌ Stepper support | ❌ Stepper support | ❌ Stepper support