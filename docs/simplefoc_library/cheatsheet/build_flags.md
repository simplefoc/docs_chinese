---
layout: default
title: Build Flags
nav_order: 2
permalink: /cheetsheet/build_flags
parent: 选项查阅
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: False
has_toc: False
---


# Build flags

<span class="simple">Simple<span class="foc">FOC</span>library</span> 支持一些高级用户可能会感兴趣的编译器选项。 它们如下所述。

## 可用的构建标志

通过构建标志来控制编译器生成 <span class="simple">Simple<span class="foc">FOC</span>library</span> 代码的方式。有些在所有架构上都受支持，而有些则依赖于 MCU 架构。

标志 | 架构 | 说明 
--- | --- | ---
`SIMPLEFOC_DISABLE_DEBUG` | 所有 | 设置为禁用整个调试代码 
`SIMPLEFOC_STM32_DEBUG` | STM32 | 设置为 STM32 MCU 启用额外的调试输出。 
`SIMPLEFOC_STM32_MAX_PINTIMERSUSED` | STM32 | 可配置的最大 PWM 引脚数，默认为 12（最多 2x 6PWM，一般是够用的） 
`SIMPLEFOC_SAMD_DEBUG` | SAMD21 / SAMD51 | 设置为 SAMD MCU 启用额外的调试输出。 
`SIMPLEFOC_SAMD_MAX_TCC_PINCONFIGURATIONS` | SAMD21 / SAMD51 | 可配置的最大 PWM 引脚数，默认为 24（最多 4x6PWM，一般是够用的 ;-) ) 
`SIMPLEFOC_SAMD51_DPLL_FREQ` | SAMD21 / SAMD51 | DPLL 上的预期频率，一般不自己配置。 通常这是 CPU 频率。 对于自定义板或超频器，您可以使用此定义覆盖它。 默认为 120000000 
`SIMPLEFOC_DEBUG_RP2040` | RP2040 | 设置为在 Raspberry Pico 上启用额外的调试输出。 
`SIMPLEFOC_ESP32_USELEDC` | ESP32 | 即使在支持 MCPWM 的 ESP32 上也强制使用 LEDC PWM 驱动器。 主要用于测试目的，通常您会更喜欢 MCPWM（如果可用）。 
