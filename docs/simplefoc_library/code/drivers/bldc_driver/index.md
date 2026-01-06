---
layout: default
title: 无刷直流驱动器配置
nav_order: 1
permalink: /bldcdriver
parent: 驱动程序
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

#  BLDC 驱动器配置

<div class="width60">
<img src="extras/Images/drv8302.png" style="width:25%;display:inline"><img src="extras/Images/bgc_30.jpg" style="width:25%;display:inline"><img src="extras/Images/l6234.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 实现了对两种 BLDC 驱动器控制接口的支持：<br>
- [3PWM <i class="fa fa-external-link"></i>](bldcdriver3pwm) - 类 `BLDCDriver3PWM`
- [6PWM <i class="fa fa-external-link"></i>](bldcdriver6pwm) - 类 `BLDCDriver6PWM`

`BLDCDriver3PWM` 和 `BLDCDriver6PWM` 类为所有支持的平台（atmega328、esp32、stm32 和 teensy）提供了所有硬件/平台特定代码的抽象层。
它们实现了：
- PWM 配置
    - PWM 频率
    - PWM 中心对齐
    - 互补通道（6PWM）
    - 死区/死时间（6PWM）
- PWM 占空比设置
- 电压限制

这些类可以作为独立类使用，可用于为 BLDC 驱动器输出设置特定的 PWM 值，参见 `utils > driver_standalone_test` 中的示例代码。
为了使 FOC 算法工作，`BLDCDriverxPWM` 类链接到 `BLDCMotor` 类，该类使用驱动器设置适当的相电压。

驱动代码的编写方式旨在支持尽可能多的不同驱动器，并且可以完全互换。

## 深入探究
有关 FOC 算法和运动控制方法的更多理论解释和源代码实现，请查看 [深入探究部分](digging_deeper)。