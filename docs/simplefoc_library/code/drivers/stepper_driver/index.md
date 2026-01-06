---
layout: default
title: 步进驱动程序配置
nav_order: 2
permalink: /stepperdriver
parent: 驱动程序
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 步进电机驱动器配置

<div class="width60">
<img src="extras/Images/l298n.jpg" style="width:25%;display:inline"><img src="extras/Images/sd_m13.jpg" style="width:25%;display:inline"><img src="extras/Images/shield_monster.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>实现了对两种步进电机驱动器控制接口的支持：<br>
- [4PWM <i class="fa fa-external-link"></i>](stepper_driver_4pwm) - 类 `StepperDriver4PWM`
- [2PWM <i class="fa fa-external-link"></i>](stepper_driver_2pwm) - 类 `StepperDriver2PWM`

`StepperDriver2PWM` 和 `StepperDriver4PWM` 类为所有支持的平台（ATMega328、ESP32、STM32、SAM、SAMD 和 Teensy）提供了所有硬件/平台特定代码的抽象层。
它们实现了：
- PWM 配置
    - PWM 频率
    - PWM 中心对齐
    - 方向通道处理（2 PWM）
    - 互补方向通道（2 PWM）
- PWM 占空比设置
- 电压限制

这些类可以作为独立类使用，可用于为步进电机驱动器输出设置特定的 PWM 值，参见 `utils > driver_standalone_test` 中的示例代码。
为了使 FOC 算法工作，`StepperDriverxPWM` 类链接到 `StepperMotor` 类，该类使用驱动器设置适当的相电压。

驱动代码的编写方式旨在支持尽可能多的不同驱动器，并实现完全可互换。

## 深入探究
有关 FOC 算法和运动控制方法的更多理论解释和源代码实现，请查看[深入探究部分](digging_deeper)。
