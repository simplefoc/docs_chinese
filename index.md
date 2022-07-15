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

[![status](https://joss.theoj.org/papers/4382445f249e064e9f0a7f6c1bb06b1d/status.svg)](https://joss.theoj.org/papers/4382445f249e064e9f0a7f6c1bb06b1d)

时代的进步通常令人激动。现今，无刷电机已经进入各种爱好者DIY社区，并且出现了很多高质量且拥有优异性能的无刷电机驱动方案。

相比于直流电机，无刷电机的优点可谓数不胜数，但同时它也拥有巨大的不足，那就是控制过于复杂。尽管身处工具链和PCB制造设计技术发达，设计自己的PCB变得很容易的年代，但一个低成本的无刷电机驱动方案却尚未出现。其中一个原因就是自行编写无刷电机的驱动方案太过复杂，尽管我们可以在网上找到很多成熟的FOC代码方案，但他们大部分都针对特定的硬件配置、特定的单片机；同时，现在很多的FOC算法和硬件开发尝试都是围绕着高功率无刷电机应用，低成本低功率的FOC硬件十分难找，甚至根本就找不到。

**灯哥开源** 是SimpleFOC官方中文资料的维护者。作为中文官方，我不仅及时更新SimpleFOC的中文翻译和技术资料，还基于SimpleFOC库开发了全开源的基于ESP32的双路无刷电机控制器硬件[DengFOC](https://github.com/ToanTech/Deng-s-foc-controller)。作为SimpleFOC技术的提倡者,欢迎大家使用SimpleFOC开源技术，若对中文资料有翻译问题或者疑惑，也欢迎大家联系我 (QQ：915767895)。

**如果在国内的朋友访问速度慢，可以访问中国国内中文文档镜像站**： [http://simplefoc.cn/](http://simplefoc.cn/#/)

<br>

基于以上痛点，本项目尝试：

- 🎯 揭开 FOC 算法的神秘面纱，制作一个强大而简单的 Arduino 库： [Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> ](#arduino-simplefoclibrary-v160)
  - <i>此库要支持尽可能多的**电机+传感器+电流检测+驱动器+单片机 **，做到通用性</i>
- 🎯 建立几套适应不同应用情况的低成本FOC驱动板：
   - ***新*** 📢: *简化版* 无刷直流驱动器 (<3Amps) :   [<span class="simple">Simple<b>FOC</b>Mini</span> ](https://github.com/simplefoc/SimpleFOCMini).
   - 支持*小功率* 云台设备的板子（<5A）：   [Arduino <span class="simple">Simple<b>FOC</b>Shield</span> ](arduino_simplefoc_shield_showcase).
   - 支持*中等功率* 无刷直流电驱动器的板子（<30A）： [Arduino <span class="simple">Simple<b>FOC</b>PowerShield</span> ](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield).
   - 另外 [@byDagor](https://github.com/byDagor) *也做了完全集成的* 基于ESP32 的板子，大家可以一看： [Dagor Brushless Controller](https://github.com/byDagor/Dagor-Brushless-Controller)

<blockquote class="success">
<p class="heading">新消息 📢: <span class="simple">Simple<span class="foc">FOC</span>library</span> 已经发表在开源软件杂志上 <a href="citing">阅读更多</a></p>

SimpleFOC: A Field Oriented Control (FOC) Library for Controlling Brushless Direct Current (BLDC) and Stepper Motors.<br>
A. Skuric, HS. Bank, R. Unger, O. Williams, D. González-Reyes<br>
Journal of Open Source Software, 7(74), 4232<br>
</blockquote>

<blockquote class="info">
   <p class="heading">新发布 📢: <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.2.2 <a href="https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.2.2">see release</a></p>
   <ul>
      <li>GenericCurrentSense 的错误修复和测试</li>
      <li>修复错误 leonardo #170</li>
      <li>错误修复 - 指定自然方向后没有索引搜索</li>
      <li>Low level API 重构
         <ul dir="auto">
            <li>
                驱动程序 API</li>
            <li>电流检测 API</li>
         </ul>
      </li>
      <li>新的调试界面 - <a href="debugging">查看文档</a>
         <ul dir="auto">
            <li>静态类 SimpleFOCDebug</li>
         </ul>
      </li>
      <li>CurrentSense API 的变化 - 增加方法 <code class="highlighter-rouge">linkDriver()</code> - <a href="current_sense">查看文档</a></li>
      <li>低端电流检测 - <a href="low_side_current_sense">查看文档</a>
         <ul dir="auto">
            <li>ESP32 对多电机的通用支持</li>
            <li>为 stm32 添加了低侧电流检测支持 - 仅一个电机
            <ul dir="auto">
               <li>f1 family</li>
               <li>f4 family</li>
               <li>g4 family</li>
            </ul>
            </li>
         </ul>
      </li>
      <li>New appraoch for current estimation for torque control using voltage使用电压控制扭来预测电流的新方法 - <a href="voltage_torque_mode">查看文档</a>
         <ul dir="auto">
            <li>支持电机 KV 额定值 - 反电动势估计</li>
            <li>使用电机相电阻</li>
         </ul>
      </li>
      <li>KV 额定值和相电阻也用于开环电流限制 - <a href="open_loop_motion_control">查看文档 </a> </li>
   </ul>
</blockquote>




## Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> <i><small>v2.2.2</small></i>
<iframe class="youtube"  src="https://www.youtube.com/embed/Y5kLeqTc6Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
这个视频演示了 Simple FOC 库的基本用法、电器连接并展示了它的性能。

### 特性

- **简易安装**: 
  - Arduino IDE: Arduino 库管理器集成
  - PlatformIO

- **开源**：在github上可以获得完整的代码和文档
- **目标**: 
   - 支持尽可能多的 [传感器](position_sensors) + [电机](motors) + [驱动器](drivers) + [电流检测](current_sense)   组合
   - 提供包含 API 引用和示例的最新且深入的文档
- **易于设置和配置**: 
  - 简单的硬件配置
  - 每个硬件组件都是一个 C++ 对象（易于理解）
  - 轻松 [调整控制回路](motion_control)
  - [*Simple**FOC**Studio*](studio) 配置 GUI 工具
  - 内置通信和监控
- **跨平台**：
  - 支持尽可能多的  [传感器，无刷直流电机和驱动器板](supported_hardware) 组合
  - 从一个微控制器系列到另一个系列的无缝代码传输
  - 支持多种 [MCU架构](microcontrollers)：
     - Arduino: UNO, MEGA, DUE, Leonardo ...
     - STM32 
     - ESP32
     - Teensy 
     - 其他


## Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <i><small>v2.0.4</small></i>
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
 <img src="https://images.squarespace-cdn.com/content/v1/58aff26de4fcb53b5efd2f02/1523147803002-0OYG383CVIPARMB6Y9IT/ODrive_v34%400%2C5x.jpg?format=500w" style="width:100%;max-width:250px"  > | <img src="https://i3.ytimg.com/vi/g2BHEdvW9bU/maxresdefault.jpg" style="width:100%;max-width:250px"  > | <img src="https://www.infineon.com/export/sites/default/_images/product/evaluation-boards/BLDC_Motor_Shild_with_TLE9879QXA40.jpg_1711722916.jpg" style="width:100%;max-width:250px"  > | <img src="https://hackster.imgix.net/uploads/attachments/998086/dev_kit_89eygMekks.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max" style="width:100%;max-width:250px"  > 
 ✔️开源                                                        | ❌ 开源                                                       | ✔️ 开源                                                       | ✔️ 开源                                                       
 ✔️易用                                                        | ✔️ 易用                                                       | ✔️易用                                                        | ❌ 易用                                                       
 ❌ 低成本 ($100)                                              | ❌ 低成本 ($100)                                              | ✔️低成本 ($40)                                                | ✔️ 低成本                                                     
 ❌ 低功率 (>50A)                                              | ✔️ 低功率                                                     | ✔️  低功率                                                    | ✔️ 低功率                                                     
 ❌ 支持步进电机                                               | ❌ 支持步进电机                                               | ❌ 支持步进电机                                               | ❌ 支持步进电机                                               