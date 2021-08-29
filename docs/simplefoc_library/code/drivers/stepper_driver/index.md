---
layout: default
title: 步进驱动程序配置
nav_order: 2
permalink: /stepperdriver
parent: 驱动器
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False

---

# 步进驱动程序配置

<div class="width60">
<img src="extras/Images/l298n.jpg" style="width:25%;display:inline"><img src="extras/Images/sd_m13.jpg" style="width:25%;display:inline"><img src="extras/Images/shield_monster.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 实现了对两种类型的步进驱动程序控制接口的支持：<br>

- [4PWM <i class="fa fa-external-link"></i>](stepper_driver_4pwm) - class `StepperDriver4PWM`
- [2PWM <i class="fa fa-external-link"></i>](stepper_driver_2pwm) - class `StepperDriver2PWM`

`StepperDriver2PWM`和`StepperDriver4PWM`为所有受支持的平台提供了所有硬件/平台特定代码的抽象层：atmega328、esp32、stm32、sam、samd和teensy。
它们执行：

- PWM配置
    - 脉宽调制频率
    - PWM中心对准
    - 方向通道处理（2PWM）
    - 互补方向通道（4PWM）
- PWM占空比设置
- 限压

这些类可作为独立类使用，并可用于设置步进驱动器输出的特定PWM值，请参见`utils > driver_standalone_test`.

为了使FOC算法工作，`StepperDriverxPWM`链接到`StepperMotor`，该类使用驱动器设置适当的相电压。

驱动程序代码的编写方式可以支持尽可能多的不同驱动程序，并且可以完全互换。

## 深入挖掘
有关FOC算法和运动控制方法的更多理论解释和源代码实现，请查看 [digging deeper section](digging_deeper)。

