---
layout: default
title: 选择模拟引脚
nav_order: 4
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /choosing_adc_pins
parent: 实用指南
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 为应用选择模拟引脚的简短指南

在为应用选择引脚时，有几个方面需要考虑。最重要的是要确保所选引脚与正在使用的硬件兼容。
务必检查你的微控制器系列和SimpleFOC是否支持必要的PWM生成、位置传感器和电流检测技术。你可以在我们的文档[这里](microcontrollers)找到相关信息。

一旦确定你的微控制器适合该应用，就该考虑使用哪些引脚了。主要有三个问题：
1. 哪些引脚用于PWM生成？
2. 哪些引脚用于位置传感器？
3. 哪些引脚用于电流检测？

在本指南中，我们将重点关注第一个问题：**哪些模拟引脚用于电流检测？**

这些问题的答案取决于你使用的微控制器和拥有的硬件。以下是SimpleFOC支持的微控制器系列列表以及每个系列支持的PWM生成模式：

微控制器 | 串联式 | 低侧 | 高侧
--- | --- |--- |--- 
Arduino AVR（8位） | ✔️ | ❌ |  ❌
Arduino DUE  | ✔️ | ❌ |  ❌
stm32（一般而言） | ✔️ | ❌ |  ❌
stm32f1系列 | ✔️ | ✔️（一个电机） |  ❌
stm32f4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32g4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32l4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32f7系列 | ✔️ | ✔️（一个电机） |  ❌
stm32h7系列 | ✔️ | ✔️（一个电机） |  ❌
stm32 B_G431B_ESC1 | ❌ | ✔️（一个电机） |  ❌
esp32/esp32s3 | ✔️ | ✔️ |  ❌
esp32s2/esp32c3 |  ✔️ | ❌ |  ❌ 
esp8266 | ❌ | ❌ |  ❌ 
samd21 | ✔️ | ✔️（一个电机） |  ❌ 
samd51 | ✔️ | ❌ |  ❌ 
teensy3 | ✔️ | ❌ |  ❌
teensy4 | ✔️ | ✔️（一个电机） |  ❌
Raspberry Pi Pico | ✔️ | ❌ |  ❌
Portenta H7 | ✔️ | ❌ |  ❌
nRF52 | ✔️ | ❌ |  ❌
Renesas（UNO R4 Minima） | ❌ | ❌ |  ❌

### 串联式电流检测
值得注意的是，除了esp8266和Arduino UNO R4之外，大多数微控制器系列都可以用于串联式电流检测。对于这种电流检测技术，你可以使用任何模拟引脚，因为PWM信号和电流检测之间不需要同步。

### 低侧电流检测
当使用低侧电流检测时，PWM信号和电流检测之间需要精确同步（[更多内容见此处](low_side_current_sense)）。
SimpleFOC旨在为所有能够将ADC转换与PWM信号同步的微控制器系列支持低侧电流检测。
目前，低侧电流检测支持以下微控制器系列：stm32、esp32、teensy4和samd21。


<blockquote class="info" markdown="1"><p class="heading">高侧电流检测呢？</p>
SimpleFOC目前不支持高侧电流检测。这主要是因为高侧检测在实际中非常少见。大多数能够支持低侧检测的微控制器系列也能够支持高侧检测，但到目前为止，库中还没有对其的支持。如果你对这个功能感兴趣，请在我们的社区论坛上告诉我们。
</blockquote>

当为低侧电流检测选择模拟引脚时，由于需要PWM信号（属于一个或多个定时器）和ADC转换之间的同步，引脚的选择更为有限。**根据经验，建议使用属于同一个ADC的引脚。** 这是因为在PWM同步过程中，定时器通常一次只能触发一个ADC。

关于与引脚相关的ADC信息有时很难获取，特别是对于经验较少的用户。因此，在接下来的几个部分中，我们将提供一些关于如何为一些最流行的支持低侧电流检测的微控制器系列找到ADC引脚的信息。

- [ESP32开发板](#esp32开发板)
- [STM32开发板](#stm32开发板)
- [Teensy4开发板](#teensy4开发板)

## ESP32开发板

Esp32开发板有两个ADC可用于低侧电流检测。ADC与引脚的关联方式如下（信息来自[乐鑫文档](https://docs.espressif.com/projects/esp-idf/en/v4.4/esp32/api-reference/peripherals/adc.html)）：


ESP32芯片 |`ADC1`引脚 | `ADC2`引脚
--- |  --- |---
ESP32 |  GPIO32 - GPIO39 | GPIO0、GPIO2、GPIO4、GPIO12 - GPIO15、GOIO25 - GPIO27
ESP32-S2| GPIO1 - GPIO10 | GPIO11 - GPIO20
ESP32-S3| GPIO1 - GPIO10 | GPIO11 - GPIO20
ESP32-C2 | GPIO0 - GPIO4 | - 
ESP32-C3 | GPIO0 - GPIO4 | GPIO5
ESP32-C6 | GPIO0 - GPIO6 | -

<blockquote class="info" markdown="1"><p class="heading">重要提示</p>
Esp32具有非常灵活的ADC配置，因此你可以使用上面列出的任何引脚进行低侧电流检测。但是，建议使用属于同一个`ADC`的引脚。
</blockquote>


## STM32开发板

Stm32是SimpleFOC支持的功能最强大的微控制器系列之一，至少在电机控制能力方面是如此。SimpleFOC支持许多STM32系列，如stm32f1、stm32f4、stm32g4、stm32l4、stm32f7、stm32h7，并且所有这些系列都可以在低侧电流检测模式下使用。

<blockquote class="info" markdown="1"><p class="heading">重要提示</p>
对于串联式电流检测，要求相对宽松，但对于stm32开发板的低侧电流检测，必须使用属于同一个`ADC`的模拟引脚。
</blockquote>

一旦你向SimpleFOC电流检测对象提供一组引脚，库将自动将这些引脚与相应的ADC和通道相关联，并负责PWM信号和ADC转换之间的同步。库代码将自动检查引脚属于哪些ADC，并为这些引脚找到共同的ADC。如果这些引脚不属于同一个ADC，库将抛出错误。

找到属于同一个ADC的引脚并非易事，特别是对于经验较少的用户。因此，我们创建了一个网站，可以相对容易地查看最流行的stm32开发板的引脚和定时器。

<a href ="https://docs.simplefoc.com/stm32pinouts/" class="btn btn-primary"><i class="fa fa-github"></i> 打开stm32引脚分布助手</a>

## Teensy4开发板

Teensy4开发板功能非常强大，有很多模拟引脚可以用于其两个ADC。属于ADC的引脚如下表所示。更多信息请参见很棒的github仓库[TeensyDocuments](https://github.com/KurtE/TeensyDocuments/blob/master/Teensy4%20Pins.pdf)

开发板 |	仅`ADC1`引脚 | 仅`ADC2`引脚 | 两个ADC都可用
---| ---- | ---- | ----
Teensy 4 |	24、25 | 26、27 | 14、15、……、22、23、40、41
Teensy 4.1 |	24、25 | 26、27、38、39 | 14、15、……、22、23


<blockquote class="info" markdown="1"><p class="heading">重要提示</p>
对于Teensy4开发板的低侧电流检测，必须使用属于`ADC1`的模拟引脚。因此，你可以使用任何模拟引脚，除了那些仅属于`ADC2`的引脚。
</blockquote>