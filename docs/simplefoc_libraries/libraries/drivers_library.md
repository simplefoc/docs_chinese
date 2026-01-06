---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Drivers</span>
nav_order: 1
permalink: /drivers_library
parent: 库
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>工具集</span>
has_children: False
has_toc: False
toc: true
---


# <span class="simple">Simple<span class="foc">FOC</span>Drivers</span> 库

![库编译状态](https://github.com/simplefoc/Arduino-FOC-Drivers/workflows/Library%20Compile/badge.svg)
![许可证：MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://ardubadge.simplefoc.com?lib=SimpleFOCDrivers)


<span class="simple">Simple<span class="foc">FOC</span>库</span>的主要目标是为无刷直流电机（BLDC）和步进电机提供高效的底层运动控制。

在实现FOC控制的电机系统时，你可能会选择大量的硬件和软件选项——比如完整的驱动板、不同的传感器、集成驱动芯片、不同的通信协议等等。

核心库不可能涵盖所有这些内容，否则会变得“过于臃肿”，难以理解、维护和使用。因此，我们的方法是保持核心库尽可能精简和简单——只包含电机驱动算法、不同微控制器（MCU）的PWM支持，以及一些通用的传感器和通信组件。

我们的理念是，这些内容足以帮助你实现电机控制目标，而系统所需的其他代码可以从其他来源获取。

这些来源之一就是<span class="simple">Simple<span class="foc">FOC</span>驱动库</span>。

## 什么是SimpleFOCDrivers库？

它是一系列可与<span class="simple">Simple<span class="foc">FOC</span>库</span>配合使用的驱动程序和支持代码的集合。

## 库中包含什么？

该库正在不断扩展，目前包含：

- 德州仪器（TI）的DRV8316集成三相驱动器的驱动程序
- 适用于不同磁传感器芯片的各种传感器驱动程序
- I2C通信驱动程序

## 使用该库有什么优势？

- 驱动库中的驱动程序支持那些标准核心库不支持的组件功能。例如，TLE5012B传感器不被通用的MagneticSensorSPI类支持，但驱动库中有专门针对它的驱动程序。

- 驱动库中的驱动程序可能具有扩展功能。例如，虽然AS5048A传感器被通用的MagneticSensorSPI类支持，但专门针对它的驱动程序允许查询其其他寄存器、检测传感器错误，并且使用更简单，因为它内置了正确的设置。

- 使用提供的通信驱动程序作为起点，不仅能让你快速上手，还更有可能使你的解决方案与他人的解决方案具有互操作性（或者至少易于适配）。

## 如何使用该库？

```cpp
#include "SimpleFOCDrivers.h"
```

它在 Arduino 库管理器中，名为 “Simple FOC Drivers”。可以像安装普通 Arduino 库一样，在 Arduino IDE 或 PlatformIO 中进行安装。

要使用库中的某些代码，需包含你想要的特定驱动模块。例如：

```cpp
#include "encoders/as5048a/MagneticSensorAS5048A.h"
```

然后查看特定驱动程序的 README 文件以获取进一步说明，如果你遇到问题，可以在论坛或 Discord 上发帖咨询！

### GitHub

你可以在以下地址找到该库的源代码： [https://github.com/simplefoc/Arduino-FOC-drivers](https://github.com/simplefoc/Arduino-FOC-drivers).


## 文档说明

每个模块 / 驱动程序的文档都在其各自子目录中的 README 文件中。

主仓库的[README](https://github.com/simplefoc/Arduino-FOC-drivers)包含一个索引，可帮助你查找所需内容。


## 我们如何决定哪些内容放入该库？

在开发SimpleFOC库的过程中，我们有时会开发一些支持项目但与核心库不直接相关的代码，或者收到一些不太适合放入核心库的贡献代码。我们会将这些代码放在驱动库中。

因此，驱动库中的代码属于以下类别之一：

- 硬件特定的代码，比如针对特定传感器或驱动芯片的代码
- 解决与电机控制相关但并非所有库用户都需要的问题的代码
- 实现特定通信协议的代码

驱动库中的代码：

- 使用者较少，因此测试不够充分
- 文档不如核心库完整
- 可能更适合有经验的用户使用

