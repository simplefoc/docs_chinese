---
layout: default
title: 编译标志
nav_order: 2
permalink: /cheetsheet/build_flags
parent: 选项速查表
grand_parent: 实用指南
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: False
has_toc: False
---


# 编译标志

<span class="simple">Simple<span class="foc">FOC</span>库</span>支持一些编译器选项，这些选项可能对高级用户来说很有用。下面对它们进行说明。

## 可用的编译标志

编译标志控制编译器为<span class="simple">Simple<span class="foc">FOC</span>库</span>生成代码的方式。有些在所有架构上都受支持，而有些则取决于MCU架构。

| 标志 | 架构 | 描述 |
| --- | --- | --- |
| `SIMPLEFOC_DISABLE_DEBUG` | 所有 | 设置此标志可禁用整个调试代码 |
| `SIMPLEFOC_PWM_ACTIVE_HIGH` | STM32、RP2040、ESP32 | 设置相位PWM输出的PWM极性——默认是高电平有效（true），但可设置为低电平有效（false）。在6-PWM模式下会影响高侧和低侧（STM32、RP2040） |
| `SIMPLEFOC_PWM_LOWSIDE_ACTIVE_HIGH` | STM32、RP2040、ESP32 | 设置低侧相位PWM输出的PWM极性——默认是高电平有效（true），但可设置为低电平有效（false）。仅在6-PWM模式下影响低侧场效应管。在其他模式下无效果。 |
| `SIMPLEFOC_PWM_HIGHSIDE_ACTIVE_HIGH` | STM32、RP2040、ESP32 | 设置高侧相位PWM输出的PWM极性——默认是高电平有效（true），但可设置为低电平有效（false）。仅在6-PWM模式下影响高侧场效应管。在其他模式下无效果。 |
| `SIMPLEFOC_STM32_DEBUG` | STM32 | 设置此标志可启用STM32微控制器的额外调试输出。 |
| `SIMPLEFOC_STM32_MAX_PINTIMERSUSED` | STM32 | 可配置的PWM引脚最大数量，默认是12（最多2个6-PWM，通常这已经足够了） |
| `SIMPLEFOC_SAMD_DEBUG` | SAMD21 / SAMD51 | 设置此标志可启用SAMD微控制器的额外调试输出。 |
| `SIMPLEFOC_SAMD_MAX_TCC_PINCONFIGURATIONS` | SAMD21 / SAMD51 | 可配置的PWM引脚最大数量，默认是24（最多4个6-PWM，这应该足够了；-）） |
| `SIMPLEFOC_SAMD51_DPLL_FREQ` | SAMD21 / SAMD51 | DPLL上的预期频率，因为我们不会自己配置它。通常这是CPU频率。对于定制板或超频用户，可以使用此定义来覆盖它。默认是120000000 |
| `SIMPLEFOC_DEBUG_RP2040` | RP2040 | 设置此标志可在Raspberry Pico上启用额外的调试输出。 |
| `SIMPLEFOC_ESP32_USELEDC` | ESP32 | 即使在支持MCPWM的ESP32上，也强制使用LEDC PWM驱动程序。主要用于测试目的，通常如果MCPWM可用，你会更倾向于使用它。 |
| `SIMPLEFOC_ESP32_HW_DEADTIME` | ESP32 | 在MCPWM硬件死区和允许相位状态配置的软件实现之间进行选择。默认是硬件死区，因为它经过了更多测试。 |
| `SIMPLEFOC_TEENSY_DEBUG` | Teensy 3.x / 4.x | 设置此标志可启用Teensy 3.x / 4.x微控制器的额外调试输出。 |
| `SIMPLEFOC_TEENSY4_ADC_INTERRUPT_DEBUG` | Teensy 4 | 启用低侧电流检测中断的简单调试，每次ADC1触发中断时，将引脚30设置为高电平。 |
| `SIMPLEFOC_TEENSY4_FORCE_CENTER_ALIGNED_3PWM` | Teensy 4 | 在Teensy 4上强制中心对齐的3PWM模式。通常3PWM模式不是中心对齐的，且定时器不同步。 |