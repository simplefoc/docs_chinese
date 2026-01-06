---
layout: default
title: 电流检测
nav_order: 5
parent: 编写代码
permalink: /current_sense
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 电流检测 

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 的目标是支持至少三种最标准的电流检测方式来实现 FOC：

- [串联电流检测](inline_current_sense)
- [低侧电流检测](low_side_current_sense)
- [高侧电流检测](high_side_current_sense) - *暂不支持*


<img src="extras/Images/comparison_cs.png" class="width40">

截至目前（[查看版本 <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases)），Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 几乎在所有平台上都支持串联电流检测，在 ESP32 开发板、stm32（f1、f4 和 g4 系列 - 单电机）、SAMD21（单电机）以及基于 STM32 的 B-G431B-ESC1 开发板（单电机）上支持低侧电流检测。

每个电流检测类都将实现 FOC 算法简单且稳健实现所需的所有必要功能：
- 硬件配置
  - ADC 分辨率和频率
  - 自动零偏移检测
- 驱动器同步
  - ADC 采集事件触发
  - 与驱动器相位的自适应对齐
- 读取相电流
  - 电流矢量幅度计算
  - FOC 的 D 和 Q 电流计算

每个已实现的类都可以作为独立类使用，并且可以用于在 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 范围之外读取 BLDC 驱动器输出的电流值，参见 `utils > current_sense_test` 中的示例代码。
为了使 FOC 算法工作，电流检测类会链接到 `BLDCMotor` 类，该类使用驱动器读取 FOC 电流。

## 🎯 我们的实现目标
电流检测代码的编写方式将尽可能支持市面上的各种不同驱动器，并且完全可互换。由于不同 MCU 架构的 ADC 采集在硬件实现上存在很大差异，以及不同电流检测方法对驱动器/ADC 同步的要求也大不相同，因此这项任务可能是 <span class="simple">Simple<span class="foc">FOC</span>library</span> 迄今为止最复杂的挑战之一。因此，这项工作将分阶段进行，每个版本都会提供更好的支持。请务必关注我们的 github 并[查看版本 <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases)。

另外，也请关注我们的[社区论坛](https://community.simplefoc.com)，那里有很多关于电流检测及其应用的讨论！

## 各 MCU 架构的电流检测支持情况
   
MCU | 串联式 | 低侧 | 高侧
--- | --- |--- |--- 
Arduino（8 位） | ✔️ | ❌ |  ❌
Arduino DUE  | ✔️ | ❌ |  ❌
stm32（一般而言） | ✔️ | ❌ |  ❌
stm32f1 系列 | ✔️ | ✔️（单电机） |  ❌
stm32f4 系列 | ✔️ | ✔️（单电机） |  ❌
stm32g4 系列 | ✔️ | ✔️（单电机） |  ❌
stm32l4 系列 | ✔️ | ✔️（单电机） |  ❌
stm32f7 系列 | ✔️ | ✔️（单电机） |  ❌
stm32h7 系列 | ✔️ | ✔️（单电机） |  ❌
stm32 B_G431B_ESC1 | ❌ | ✔️（单电机） |  ❌
esp32/esp32s3 | ✔️ | ✔️ |  ❌
esp32s2/esp32c3 |  ✔️ | ❌ |  ❌ 
esp8266 | ❌ | ❌ |  ❌ 
samd21 | ✔️ | ✔️（单电机） |  ❌ 
samd51 | ✔️ | ❌ |  ❌ 
teensy3 | ✔️ | ❌ |  ❌
teensy4 | ✔️ | ✔️(单电机) |  ❌
Raspberry Pi Pico | ✔️ | ❌ |  ❌
Portenta H7 | ✔️ | ❌ |  ❌
nRF52 | ✔️ | ❌ |  ❌
Renesas（UNO R4）  | ❌ | ❌ |  ❌ 

注：未来版本将添加对 Renesas MCU 的电流检测支持。

## 深入了解

有关电流检测及其与 FOC 和运动集成的更多理论解释和源代码实现，请查看[深入了解部分](digging_deeper)。