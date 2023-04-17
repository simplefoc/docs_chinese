---
layout: default
title: 驱动器
nav_order: 3
parent: 代码
permalink: /drivers_config
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 驱动器配置

<div class="width60">
<img src="extras/Images/drv8302.png" style="width:25%;display:inline"><img src="extras/Images/bgc_30.jpg" style="width:25%;display:inline"><img src="extras/Images/l6234.jpg" style="width:25%;display:inline"><img src="extras/Images/l298n.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 支持无刷直流电机和步进电机：

- 无刷直流电机 <i class="fa fa-external-link"></i>
  
    - **3 路PWM 信号** ( 3 相 ) - `BLDCDriver3PWM`
    - **6 路PWM 信号** ( 3 相 ) - `BLDCDriver6PWM`
- 步进电机 <i class="fa fa-external-link"></i>
  
    - **4路PWM信号** ( 2 相 )  - `StepperDriver4PWM`
    - **2路PWM信号** ( 2 相 )  - `StepperDriver2PWM`

该代码可以适应不同的驱动器，通用性高。
这些类可以作为独立的类使用，可以用来设置某些PWM值作为驱动器输出，参见 `utils > driver_standalone_test` 中的实例代码。



## 各MCU架构的支持模式

| MCU               | 2路 PWM 模式 | 4路PWM 模式 | 3 路PWM 模式 | 6路 PWM 模式 | pwm频率配置              |
| ----------------- | ------------ | ----------- | ------------ | ------------ | ------------------------ |
| Arduino (8-bit)   | ✔️            | ✔️           | ✔️            | ✔️            | ✔️ (either 4kHz or 32kHz) |
| Arduino DUE       | ✔️            | ✔️           | ✔️            | ❌            | ✔️                        |
| stm32             | ✔️            | ✔️           | ✔️            | ✔️            | ✔️                        |
| esp32             | ✔️            | ✔️           | ✔️            | ✔️            | ✔️                        |
| esp8266           | ✔️            | ✔️           | ✔️            | ❌            | ✔️                        |
| samd21/51         | ✔️            | ✔️           | ✔️            | ✔️            | ✔️                        |
| teensy            | ✔️            | ✔️           | ✔️            | ✔️            | ✔️                        |
| Raspberry Pi Pico | ✔️            | ✔️           | ✔️            | ✔️            | ✔️                        |
| Portenta H7       | ✔️            | ✔️           | ✔️            | ❌            | ✔️                        |