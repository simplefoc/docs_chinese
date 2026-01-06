---
layout: default
title: 驱动程序
nav_order: 3
parent: 编写代码
permalink: /drivers_config
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 驱动配置

<div class="width60">
<img src="extras/Images/drv8302.png" style="width:25%;display:inline"><img src="extras/Images/bgc_30.jpg" style="width:25%;display:inline"><img src="extras/Images/l6234.jpg" style="width:25%;display:inline"><img src="extras/Images/l298n.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>支持无刷直流电机（BLDC）和步进电机驱动器：

- [无刷直流电机驱动器 <i class="fa fa-external-link"></i>](bldcdriver)（无刷直流电机或混合式步进电机）
    - **3路PWM信号**（3相）- `BLDCDriver3PWM`
    - **6路PWM信号**（3相）- `BLDCDriver6PWM`
- [步进电机驱动器 <i class="fa fa-external-link"></i>](stepperdriver)（步进电机）
    - **4路PWM信号**（2相）- `StepperDriver4PWM`
    - **2路PWM信号**（2相）- `StepperDriver2PWM`


驱动代码的编写方式旨在支持尽可能多的不同驱动器，并且具有完全的互换性。
这些类可以作为独立类使用，也可以用于为驱动器输出设置特定的PWM值，参见`utils > driver_standalone_test`中的示例代码。


## 各MCU架构支持的驱动模式

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | PWM频率配置
--- | --- |--- |--- |--- |---
Arduino AVR（8位） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️（4kHz或32kHz）
Arduino DUE  | ✔️ | ✔️ | ✔️ | ❌ | ✔️
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
esp32 `MCPWM` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
esp32 `LEDC`| ✔️ | ✔️ | ✔️ |  ✔️ | ✔️
esp8266 | ✔️ | ✔️ | ✔️ | ❌ | ✔️
samd21/51 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
teensy3 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
teensy4 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
Raspberry Pi Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
Portenta H7 | ✔️ | ✔️ | ✔️ | ❌ | ✔️
Renesas（UNO R4 Minima） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
nRF52 |✔️ | ✔️ | ✔️ | ✔️ | ✔️

<blockquote class="info"> 📢 这里有一份关于不同MCU架构选择合适PWM引脚的快速指南 <a href="choosing_pwm_pins">参见文档</a>。</blockquote>