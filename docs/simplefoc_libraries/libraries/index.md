---
layout: default
title: 库
parent: <span class="simple">Simple<span class="foc">FOC</span>工具集</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /additional_libraries
has_children: True
has_toc: False
---


# <span class="simple">Simple<span class="foc">FOC</span>工具</span>
在SimpleFOC项目的背景下，已经开发了许多不同的开源社区项目。


## Arduino 库

- ### <span class="simple">Simple<span class="foc">FOC</span>驱动</span> 

  该库包含一系列用于<span class="simple">Simple<span class="foc">FOC</span>库</span>的驱动程序和支持代码。


  其目的是保持<span class="simple">Simple<span class="foc">FOC</span>库</span>的核心简洁，从而易于维护、理解并移植到不同平台。除此之外，围绕<span class="simple">Simple<span class="foc">FOC</span>库</span>还发展出了各种驱动程序和支持代码，我们希望能将这些提供给社区使用。[了解更多...](drivers_library)

  <a href ="https://github.com/simplefoc/Arduino-FOC-drivers" class="btn"><i class="fa fa-github"></i> Github 仓库</a>   

- ### <span class="simple">Simple<span class="foc">DC</span>电机</span> 

  <span class="simple">Simple<span class="foc">FOC</span>库</span>实际上是为永磁同步电机/无刷直流电机（PMSM/BLDC motors）的磁场定向控制而设计的，这从名字中就可以看出来 ;-)。但由于各种原因，有时直流电机（DC motors）会更受青睐，虽然我们并不专注于这种使用场景，但我们确实有相当多的代码可以用于辅助直流电机控制应用。


  因此，这是一项支持度较低的工作，旨在为直流电机提供一些有用的构建模块。[了解更多...](dc_motors_library)

  <a href ="https://github.com/simplefoc/Arduino-FOC-dcmotor" class="btn"><i class="fa fa-github"></i> Github 仓库</a>   