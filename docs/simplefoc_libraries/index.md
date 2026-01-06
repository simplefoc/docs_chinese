---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>工具集</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 5
permalink: /arduino_simplefoc_utils
has_children: True
has_toc: False
navbar:
  items:
    - title: External Link
      url: https://example.com
      external: true
---


# <span class="simple">Simple<span class="foc">FOC</span>工具集</span>
在<span class="simple">Simple<span class="foc">FOC</span>项目</span>的背景下，已经开发了许多不同的开源社区项目。

## 辅助工具

- ### Stm32 引脚文档
   
   这个仓库旨在提供大多数stm32微控制器系列的可用PWM和ADC引脚文档。这类信息通常很难查找，因此我们决定将其集中到一个地方。该网站是通过解析[stm32duino核心](https://github.com/stm32duino/Arduino_Core_STM32)的最新版本自动生成的。

   <a href ="https://github.com/simplefoc/stm32pinouts" class="btn"><i class="fa fa-github"></i> Github仓库</a>    <a href ="https://docs.simplefoc.com/stm32pinouts/" class="btn btn-primary"><i class="fa fa-github"></i> 打开stm32引脚助手</a>   

   <blockquote class="info"> 📢 这里有一个关于为不同MCU架构选择合适PWM引脚的快速指南 <a href="choosing_pwm_pins">查看文档</a>。</blockquote>

## Arduino库

- ### <span class="simple">Simple<span class="foc">FOC</span>驱动库</span> 

   该库包含一系列用于<span class="simple">Simple<span class="foc">FOC</span>库</span>的驱动程序和支持代码。


   其目的是保持<span class="simple">Simple<span class="foc">FOC</span>库</span>的核心简洁，从而易于维护、理解和移植到不同平台。除此之外，围绕<span class="simple">Simple<span class="foc">FOC</span>库</span>已经开发了各种驱动程序和支持代码，我们希望将这些提供给社区使用。[了解更多...](drivers_library)

   <a href ="https://github.com/simplefoc/Arduino-FOC-drivers" class="btn"><i class="fa fa-github"></i> Github仓库</a>   

- ### <span class="simple">Simple<span class="foc">DC</span>电机库</span>

   <span class="simple">Simple<span class="foc">FOC</span>库</span>实际上是为永磁同步电机/无刷直流电机的磁场定向控制而设计的，这从名称中就可以看出 ;-)。但由于各种原因，有时直流电机是更优选择，虽然我们不专注于这种使用场景，但我们确实有相当多的代码可以用于帮助直流电机控制应用。


   因此，这是一项支持程度较低的工作，旨在为直流电机提供一些有用的构建模块。[了解更多...](dc_motors_library)

   <a href ="https://github.com/simplefoc/Arduino-FOC-dcmotor" class="btn"><i class="fa fa-github"></i> Github仓库</a>   


## 用户界面应用

- ### <span class="simple">Simple<span class="foc">FOC</span>工作室</span> 作者：[@jorgemaker](https://github.com/JorgeMaker)

   基于python3和PyQt5的<span class="simple">Simple<span class="foc">FOC</span>库</span>图形用户界面。该应用程序允许通过串行端口通信和[命令器](commander_interface)接口来调优和配置任何由<span class="simple">Simple<span class="foc">FOC</span>库</span>控制的无刷直流电机/步进电机设备。[了解更多...](studio)

   <a href ="https://github.com/simplefoc/Arduino-FOC-dcmotor" class="btn"><i class="fa fa-github"></i> Github仓库</a>   

- ###  <span class="simple">Simple<span class="foc">FOC</span>网页控制器</span> 作者：[@geekuillaume](https://github.com/geekuillaume)

   这是<span class="simple">Simple<span class="foc">FOC</span>库</span>的控制器界面。它使用WebSerial通过串行端口通信和[命令器](commander_interface)接口与合适的微控制器进行通信。[了解更多...](webcontroller)

   <a href ="https://github.com/geekuillaume/simplefoc-webcontroller" class="btn btn"><i class="fa fa-github"></i> Github仓库</a> <a href ="https://webcontroller.simplefoc.com/" class="btn btn-primary"><i class="fa fa-github"></i> 打开<span class="simple">Simple<span class="foc">FOC</span>网页控制器</span></a>   
- ###  <span class="simple">Simple<span class="foc">FOC</span>生成器</span> 作者：[@stijnsprojects](https://github.com/stijnsprojects)

   一个网页应用程序，可帮助您根据所使用的硬件生成<span class="simple">Simple<span class="foc">FOC</span>库</span>的arduino程序。

   <a href ="https://github.com/stijnsprojects/simplefocgenerator" class="btn btn"><i class="fa fa-github"></i> Github仓库</a> <a href ="https://stijnsprojects.github.io/simplefocgenerator/" class="btn btn-primary"><i class="fa fa-github"></i> 打开<span class="simple">Simple<span class="foc">FOC</span>生成器</span></a>   
