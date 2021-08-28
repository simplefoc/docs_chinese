---
layout: default
title: 无刷直流驱动器配置
nav_order: 1
permalink: /bldcdriver
parent: 驱动器
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 无刷直流驱动器配置

<div class="width60">
<img src="extras/Images/drv8302.png" style="width:25%;display:inline"><img src="extras/Images/bgc_30.jpg" style="width:25%;display:inline"><img src="extras/Images/l6234.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 支持2种无刷直流驱动器控制接口：<br>
- [3PWM <i class="fa fa-external-link"></i>](bldcdriver3pwm) - 类 `BLDCDriver3PWM`
- [6PWM <i class="fa fa-external-link"></i>](bldcdriver6pwm) - 类 `BLDCDriver6PWM`

 `BLDCDriver3PWM` 类和  `BLDCDriver6PWM` 类为支持的平台提供所有硬件/平台特定代码的抽象层： atmega328, esp32, stm32 and teensy 。
他们可以实现：

- PWM 配置
    - PWM 频率
    - PWM 中心-对齐
    - 互补通道  (6PWM)
    - 死区时间  (6PWM)
- PWM 占空比设置 
- 电压限制

这些类可以作为独立类使用，可以用于为无刷电机驱动器输出特定的PWM，参见 `utils > driver_standalone_test` 实例。

为了运行FOC算法， `BLDCDriverxPWM` 类连接到 `BLDCMotor` 类，该类使用驱动器来设置适当的相位电压。

该代码可以适应不同的驱动器，并且通用性高。

## Digging deeper（深入挖掘）
更多实现的 FOC 算法的理论解释、源代码和运动控制方法，请参阅 [深入挖掘的部分](digging_deeper) 。
