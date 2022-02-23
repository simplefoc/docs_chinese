---
layout: default
title: SimpleFOC Drivers Library
nav_order: 9
permalink: /drivers_library
parent: Writing the Code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: False
has_toc: False
---


# SimpleFOC drivers library

![Library Compile](https://github.com/simplefoc/Arduino-FOC-Drivers/workflows/Library%20Compile/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://www.ardu-badge.com/badge/Simple%20FOC%20Drivers.svg?)

<span class="simple">Simple<span class="foc">FOC</span>library</span> 的主要目标是为无刷直流电机和步进电机提供有效的低电平运动电机控制。

在实现FOC控制的电机系统时，你可能会有大量的硬件和软件选择——比如整个驱动板、不同的传感器、集成驱动ic、不同的通信协议等等。

主库不可能涵盖所有这些选择而不“超载”，让主库变得难以理解、维护和使用。因此，我们的方法是尽可能地保持核心库的精简和简单——只有电机驱动的算法，不同MCU的PWM支持，以及一些通用的传感器和通信组件。

主库包含的核心内容足以解决主要的运动控制，此外其他库还有可用于系统其他功能的源代码。

 <span class="simple">Simple<span class="foc">FOC</span></span> drivers library就是其中一个库。

## 这是什么？

 <span class="simple">Simple<span class="foc">FOC</span>library</span> 是驱动程序和源代码的集合.



## 库里面有什么？

目前库里有（以后会继续增加内容）：

- DRV8316的驱动器集成了TI公司的三相驱动器
- 用于不同磁传感器IC的各种传感器驱动
- 用于I2C的通信驱动程序

## 它的优点？

- 驱动库中的驱动程序让那些不能与标准核心库运行的组件能够启用。例如，通用的MagneticSensorSPI类不支持TLE5012B传感器，但是在驱动库中有一个特定的驱动程序可以启用它。
- 驱动库中的驱动程序可能有扩展的功能。例如AS5048A传感器是由通用的MagneticSensorSPI类支持的，它的特定驱动程序允许查询它的其他寄存器，允许检测传感器错误，而且更容易使用，因为它有正确的设置“嵌入”。
- 使用提供的通信驱动程序作为起点，不仅可以让您快速入门，而且还可以使您的解决方案更有可能与其他解决方案互操作(或容易适应其他方案)。

## 怎么使用它？

```c++
#include "SimpleFOCDrivers.h"
```

它在arduino库管理器中，称为“简单FOC驱动程序”。在arduino IDE或PlatformIO中正常安装arduino库。

要使用库中的某些代码，要包含特定驱动模块。例如：

```c++
#include "encoders/as5048a/MagneticSensorAS5048A.h"
```

然后检查README的具体驱动程序的进一步说明，如果你有疑惑，可以在论坛中提问！

### GitHub

你可以在这里找到源代码：

[https://github.com/simplefoc/Arduino-FOC-drivers](https://github.com/simplefoc/Arduino-FOC-drivers).


## 文档

每个模块/驱动程序都记录在其README文件中，该文件可以在其各自的子目录中找到。

主库的[README](https://github.com/simplefoc/Arduino-FOC-drivers)中有一个索引，可以帮助您查找内容。


## 我们是如何决定这个库放什么的?

在开发SimpleFOC库时，我们有时会开发一些代码来支持与核心库没有直接关系的项目，或者接收一些不太匹配的代码。在驱动库中可以找到这些代码。

因此，驱动库中的代码类别是：

- 适用于特定硬件的代码，比如特定的传感器或驱动芯片
- 解决了与电机控制相关的某些问题
- 实现特定的通信协议

驱动库中的代码：

- 不适用于大部分用户，所以没有测试得特别好
- 不像核心库那样有完整的文档
- 可能更适合有经验的用户

