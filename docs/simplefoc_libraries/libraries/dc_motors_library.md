---
layout: default
title: <span class="simple">Simple<span class="foc">DC</span>Motor</span>
nav_order: 1
permalink: /dc_motors_library
parent: 库
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>工具集</span>
has_children: False
has_toc: False
toc: true
---



# <span class="simple">Simple<span class="foc">DC</span> Motor</span> 库

![库编译状态](https://github.com/simplefoc/Arduino-FOC-dcmotor/workflows/Library%20Compile/badge.svg)
![许可证：MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino库标识](https://ardubadge.simplefoc.com?lib=SimpleDCMotor)


<span class="simple">Simple<span class="foc">DC</span>Motor 库</span>扩展了<span class="simple">Simple<span class="foc">FOC</span>库</span>，用于通过其常用的驱动器类型来控制直流电机。

## 什么是该库？

这是一组基于<span class="simple">Simple<span class="foc">FOC</span>库</span>构建的`DCDriver`类和`DCMotor`类。

## 该库包含什么？

- `DCMotor`类
- 适用于不同直流电机驱动器类型的`DCDriver`类
- 一些使用示例

## 该库的优势是什么？

- 核心库不支持直流电机，这不是它的设计目的。此库增加了直流电机控制功能。

- 这使你在处理直流电机时，也能使用SimpleFOC中可用的众多传感器驱动器，以及像Commander这样的实用类。

- 并且它允许你使用SimpleFOC的控制架构来实现闭环控制，因此结合传感器，你甚至可以将廉价的直流电机变成精确的数字伺服电机。

## 如何使用该库？

```cpp
#include "SimpleDCMotor.h"
```

它在 Arduino 库管理器中，名为 “SimpleDCMotor”。可以像在 Arduino IDE 或 PlatformIO 中安装普通 Arduino 库一样进行安装。

有关使用方法，请参阅 GitHub 上的 readme 文件和库示例。

### GitHub

你可以在以下地址找到该库的源代码： [https://github.com/simplefoc/Arduino-FOC-dcmotor](https://github.com/simplefoc/Arduino-FOC-dcmotor).


## 文档

请参阅 GitHub 上的文档。注意，`drivers`子目录中还有描述各个直流电机驱动器的额外文档。
