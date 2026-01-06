---
layout: default
title: 选择PWM引脚
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /choosing_pwm_pins
parent: 实用指南
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 选择应用的PWM引脚简短指南

在为应用选择引脚时，有几个方面需要考虑。最重要的是要确保所选引脚与正在使用的硬件兼容。
请务必检查你的微控制器系列和SimpleFOC是否支持必要的PWM生成、位置传感器和电流传感技术。你可以在我们的文档[这里](microcontrollers)找到相关信息。

一旦确定你的微控制器适合该应用，就该考虑使用哪些引脚了。主要有三个问题：
1. 哪些引脚用于PWM生成？
2. 哪些引脚用于位置传感器？
3. 哪些引脚用于电流传感？

在本指南中，我们将重点关注第一个问题：**哪些引脚用于PWM生成？**

这些问题的答案取决于你使用的微控制器和拥有的硬件。以下是SimpleFOC支持的微控制器系列以及每个系列支持的PWM生成模式列表：

MCU | 2 PWM模式 | 4 PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置 | PWM中心对齐 | 定时器-ADC同步
--- | --- |--- |--- |--- |---  |----|----
Arduino AVR（8位） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️（4kHz或32kHz） | ✔️ | ❌ 
Arduino DUE  | ✔️ | ✔️ | ✔️ | ❌ | ✔️ | ❌ | ❌
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
esp32 MCPWM | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
esp32 LEDC | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌
esp8266 | ✔️ | ✔️ | ✔️ | ❌ | ✔️ | ❌ | ❌
samd21/51 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️  | ❌（2/3/4PWM） <br> ✔️（6PWM） | ✔️（仅samd21 - 与第一个定时器同步） <br> ❌（samd51）
teensy3 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌（2/3/4PWM） <br> ✔️（6PWM） | ❌
teensy4 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌（2/3/4PWM）<br>✔️（6PWM）<br> ✔️（3PWM强制）  | ❌（2/3/4PWM）<br>✔️（6PWM）<br> ✔️（3PWM对齐） 
Raspberry Pi Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌（2/3/4PWM） <br> ✔️（6PWM） | ❌
Portenta H7 | ✔️ | ✔️ | ✔️ | ❌ | ✔️ | ❌ | ❌
nRF52 |✔️ | ✔️ | ✔️ | ✔️ | ✔️| ❌（2/3/4PWM） <br> ✔️（6PWM） |❌  
Renesas（UNO R4 Minima） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ❌（2/3/4PWM） <br> ✔️（6PWM） | ❌

需要注意的是，所有受支持的系列都可以在2/3/4PWM模式下使用。但是，并非所有架构都支持6PWM模式。此外，所有受支持的架构都可以配置PWM频率，但对于Arduino AVR板，频率可以设置为4kHz或32kHz。

选择PWM引脚时的另一个重要因素是尝试使用属于同一定时器的PWM引脚。这很重要，因为属于同一定时器的引脚生成的PWM信号将具有相同的频率和相位。这对于FOC算法的正常工作很重要。
经验法则：
- 对于2PWM模式，尝试只使用一个定时器。
- 对于3PWM模式，尝试只使用一个定时器。
- 对于4PWM模式，尽可能尝试只使用一个定时器，如果不行，则每相使用一个定时器（即两个定时器）。
- 对于6PWM模式，尽可能尝试只使用一个定时器，如果不行，则每相使用一个定时器（即三个定时器）。

<blockquote class="info" markdown="1"><p class="heading">注意：PWM中心对齐</p>
SimpleFOC在某些情况下会同步（中心对齐）不同定时器生成的PWM信号（如上表所示），但最好还是使用属于同一定时器的引脚。
</blockquote>

<blockquote class="info" markdown="1"> <p class="heading">注意：定时器-ADC同步 - 低侧电流传感</p>
低侧电流传感所需的定时器和ADC同步仅适用于某些系列的微控制器：stm32、esp32（基于`MCPWM`）和Teesny 4。
</blockquote>

获取与引脚相关的定时器信息有时很困难，特别是对于经验不足的用户。因此，在接下来的几个部分中，我们将提供一些关于如何为一些最受欢迎的微控制器系列找到PWM引脚的信息。

- [Arduino AVR板](#arduino-avr板)
- [ESP32板](#esp32板)
- [STM32板](#stm32板)
- [Teensy板](#teensy板)

## Arduino AVR板
对于Arduino AVR板（UNO、MEGA、Nano、Leonardo等），PWM引脚通常标有`~`符号。这些引脚是可以生成PWM信号的引脚。如果你正在编写2PWM、3PWM或4PWM模式的应用程序，可以使用任何PWM引脚。PWM定时器是相互同步的，因此你不必担心此信息。

但是，如果你使用6PWM模式，则必须使用属于同一定时器的引脚。属于同一定时器的引脚如下：


<div class="width30 inline_table" markdown="1"><b>Arduino UNO/Nano/Pro mini</b> <code class="highlighter-rouge">Atmega328P</code>

定时器 | 引脚
--- | ---
`TIM0` | `5`、`6`
`TIM1` | `9`、`10`
`TIM2` | `3`、`11`

</div>
<div class="width30 inline_table" markdown="1"><b>Arduino Leonardo</b> <code class="highlighter-rouge">Atmega32u4</code>

定时器 | 引脚
--- | ---
`TIM0`| `3`、`11`
`TIM1`| `9`、`10`
`TIM3`| `5`
`TIM4`| `6`、`13`

</div>


<div class="width30 inline_table" markdown="1"><b>Arduino MEGA</b> <code class="highlighter-rouge">Atmega2560</code>

定时器 | 引脚
--- | ---
`TIM0`| `13`、`4`
`TIM1`| `12`、`11`
`TIM2`| `10`、`9`
`TIM3`| `5`、`3`、`2`
`TIM4`| `8`、`7`、`6`
`TIM5`| `44`、`45`、`46`

</div>


因此，如果使用这些板中的一个在6PWM模式下，确保使用属于同一定时器的高/低引脚对。在这种情况下，`atmega328P`和`atmega32u4`必须使用它们所有的PWM引脚来生成6PWM信号（`atmega32u4`不能使用引脚`5`，因为它在定时器`TIM3`上是单独的）。此外，`atmega2560`有足够的引脚仅使用一个定时器运行两个6PWM驱动器。

## ESP32板

Esp32板有两个PWM生成模块：`LEDC`和`MCPWM`。`LEDC`模块用于为LED生成PWM信号，但它也可以用于电机控制。`MCPWM`模块是专门为电机控制设计的。
尽管`LEDC`的灵活性远不如`MCPWM`，但它仍然能够运行<span class="simple">Simple<span class="foc">FOC</span>库</span>支持的所有驱动器。但是，使用`LEDC`时，你将无法使用低侧电流传感，因为定时器无法与ADC同步。

### MCPWM模块
因此，当使用具有`MCPWM`模块的esp32板（例如`esp32`和`esp32s3`）时，你可以使用任何引脚进行任何形式的PWM生成。该模块使esp32非常灵活，并允许任何引脚在PWM模式下使用，以及与任何定时器相关联。通常，esp32板有2个`MCPWM`独立模块，允许实例化：
- 4个2PWM模式驱动器实例
- 4个3PWM模式驱动器实例
- 2个4PWM模式驱动器实例
- 2个6PWM模式驱动器实例

SimpleFOC将自动为你的应用程序完成适当的定时器和通道的关联。


ESP32 SoC | 具有`MCPWM` 
--- |  --- 
ESP32 |  ✔️
ESP32-S2| ❌
ESP32-C2 | ❌
ESP32-S3| ✔️
ESP32-C3 | ❌
ESP32-C6 | ✔️

所有具有`MCPWM`的esp32架构默认将使用`MCPWM`进行电机控制。

### LEDC模块
但是，如果使用仅支持`LEDC`模块的板（例如`esp32s2`和`esp32c3`），你将无法将其用于大多数电机控制模式。`LEDC`模块不如`MCPWM`模块灵活，不推荐用于电机控制应用。你仍然可以使用2PWM、3PWM、4PWM和6PWM模式。`LEDC`定时器通常有8个通道，不同的板有不同数量的可用通道和定时器。所有引脚都可用于PWM生成，但前8个引脚与第一个定时器相关联，接下来的8个引脚与第二个定时器相关联，依此类推。

以下是不同esp32芯片可用的通道数量列表，取自[esp32技术参考手册](https://espressif-docs.readthedocs-hosted.com/projects/arduino-esp32/en/latest/api/ledc.html)：

ESP32 SoC | LEDC通道数量 
--- | --- 
ESP32 | 16 
ESP32-S2|8 
ESP32-S3|8 
ESP32-C2|6 
ESP32-C3|6 
ESP32-C6|6 

如果用户希望为支持`MCPRM`的板强制使用`LEDC`驱动器，他必须设置`SIMPLEFOC_ESP32_USELEDC`。

## STM32板

Stm32是SimpleFOC支持的最强大的微控制器系列，至少在电机控制能力方面是这样。SimpleFOC支持大多数STM32板，所有这些板都可以在6PWM模式下使用。此外，从版本[v2.3.3](https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.3.3)开始，SimpleFOC库默认同步不同定时器生成的PWM信号。因此，对于除6PWM生成之外的所有用例，用户不必担心与引脚相关联的定时器，但是仍然建议使用属于相同定时器的引脚。

<blockquote class="warning" markdown="1">
⚠️ **注意：** SimpleFOC不支持stm32板的反相通道，因此用户必须使用非反相的引脚。它们仅支持6PWM模式。
</blockquote>

对于6PWM模式，用户有两个选择：
1. 使用属于同一定时器的引脚。
这是推荐的，因为所有stm32板都有通常为`TIM1`和`TIM8`的定时器，这些定时器是为此类应用设计的，并提供最佳性能。
2. 每相使用一个定时器。
这也是一个很好的解决方案，特别是如果使用高级定时器所需的引脚不可用时。但是，在这种情况下，应用程序使用2或3个定时器而不是1个，这可能会降低微控制器并行执行其他任务的能力。

一旦你向SimpleFOC驱动程序对象提供一组引脚，库将自动将引脚与适当的定时器和通道相关联，并找到电机控制的最佳组合。如果引脚与你尝试使用的电机控制模式不兼容，库将抛出错误。

找到属于同一定时器的引脚并非易事，特别是对于经验不足的用户。因此，我们创建了一个网站，可以相对容易地浏览最受欢迎的stm32板的引脚和定时器。

<a href ="https://docs.simplefoc.com/stm32pinouts/" class="btn btn-primary"><i class="fa fa-github"></i> 打开stm32引脚分配助手</a>

根据经验，大多数stm32板具有属于高级定时器`TIM1`的以下引脚：
- `PA8` - 通道`1`
- `PA9` - 通道`2`
- `PA10` - 通道`3`
- `PB13` - 反相通道`1N`
- `PB14` - 反相通道`2N`
- `PB15` - 反相通道`3N`

因此，这是6PWM模式首选的引脚组合。

## Teensy板

Teensy板非常强大，有很多可用于PWM生成的定时器。SimpleFOC库支持所有Teensy3和Teensy4板，所有这些板都可以在6PWM模式下使用。

以下表格取自[teensy文档](https://www.pjrc.com/teensy/td_pulse.html)，列出了不同teensy系列的PWM引脚：

板 | 具有PWM功能的引脚
---| ----
Teensy 4.1 | 0、1、2、3、4、5、6、7、8、9、10、11、12、13、14、15、18、19、22、23、24、25、28、29、33、36、37、42、43、44、45、46、47、51、54
Teensy 4.0 | 0、1、2、3、4、5、6、7、8、9、10、11、12、13、14、15、18、19、22、23、24、25、28、29、33、34、35、36、37、38、39
Teensy 3.6 | 2、3、4、5、6、7、8、9、10、14、16、17、20、21、22、23、29、30、35、36、37、38
Teensy 3.5 | 2、3、4、5、6、7、8、9、10、14、20、21、22、23、29、30、35、36、37、38
Teensy 3.2 和 3.1| 3、4、5、6、9、10、20、21、22、23、25、32
Teensy LC | 3、4、6、9、10、16、17、20、22、23
Teensy 3.0 | 3、4、5、6、9、10、20、21、22、23

SimpleFOC不会同步Teensy板的不同定时器生成的PWM信号，因此建议使用属于同一定时器的引脚。

### Teensy3

因此，使用Teensy3板时，建议（不是严格约束）使用属于同一定时器的引脚。属于同一定时器的引脚如下表所示。

<style>
.inline_table {
  margin: 1em;
  display:inline-block;
}
.tight_table th,td {
  min-width: 0px !important;  
}
</style>
<div class="width30 inline_table" markdown="1"><b>Teensy 3.6</b>

定时器 | 引脚
--- | ---
`FTM0`| 5、6、9、10、20、21、22、23
`FTM1`| 3、4
`FTM2`| 29、30
`FTM3`| 2、7、8、14、35、36、37、38
`TPM1`| 16、17

</div><div class="width30 inline_table" markdown="1"><b>Teensy 3.5</b>

定时器 | 引脚
--- | ---
`FTM0`| 5、6、9、10、20、21、22、23
`FTM1`| 3、4
`FTM2`| 29、30
`FTM3`| 2、7、8、14、35、36、37、38

</div><div class="width30 inline_table" markdown="1"><b>Teensy 3.2 和 3.1</b>

定时器 | 引脚
--- | ---	
`FTM0`| 5、6、9、10、20、21、22、23
`FTM1`| 3、4
`FTM2`| 25、32

</div><div class="width30 inline_table" markdown="1"><b>Teensy LC</b>

定时器 | 引脚
--- | ---
`FTM0`| 6、9、10、20、22、23
`FTM1`| 16、17
`FTM2`| 3、4

</div><div class="width30 inline_table" markdown="1"><b>Teensy 3.0</b>

定时器 | 引脚
--- | ---
`FTM0`| 5、6、9、10、20、21、22、23
`FTM1`| 3、4

</div>

所有Teensy3板都可以在定时器`FTM0`上以6PWM模式使用，并且那些具有`FTM3`的板也可以在`FTM3`上使用6PWM模式。至少在版本[v2.3.3](https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.3.3)之前，SimpleFOC不允许其他定时器组合用于6PWM模式。

### Teensy4

使用Teensy4板时，建议（不是严格约束）使用属于同一定时器的引脚。属于同一定时器的引脚如下表所示。

<div class="inline_table " markdown="1"><b>Teensy 4.1</b>	

定时器 | 子模块 | 引脚
--- | --- | --- 
`FlexPWM1`|0|1、44、45
`FlexPWM1`|1|0、42、43
`FlexPWM1`|2|24、46、47
`FlexPWM1`|3|7、8、25
`FlexPWM2`|0|4、33
`FlexPWM2`|1|5
`FlexPWM2`|2|6、9
`FlexPWM2`|3|36、37
`FlexPWM3`|0|54
`FlexPWM3`|1|28、29
`FlexPWM3`|3|51
`FlexPWM4`|0|22
`FlexPWM4`|1|23
`FlexPWM4`|2|2、3
`QuadTimer1`|0|10
`QuadTimer1`|1|12
`QuadTimer1`|2|11
`QuadTimer2`|0|13
`QuadTimer3`|0|19
`QuadTimer3`|1|18
`QuadTimer3`|2|14
`QuadTimer3`|3|15

</div><div class="inline_table" markdown="1"><b>Teensy 4.0</b>

定时器 | 子模块 | 引脚
--- | --- | --- 
`FlexPWM1`|0|1、36、37
`FlexPWM1`|1|0、34、35
`FlexPWM1`|2|24、38、39
`FlexPWM1`|3|7、8、25
`FlexPWM2`|0|4、33
`FlexPWM2`|1|5
`FlexPWM2`|2|6、9
`FlexPWM3`|1|28、29
`FlexPWM4`|0|22
`FlexPWM4`|1|23
`FlexPWM4`|2|2、3
`QuadTimer1`|0|10
`QuadTimer1`|1|12
`QuadTimer1`|2|11
`QuadTimer2`|0|13
`QuadTimer3`|0|19
`QuadTimer3`|1|18
`QuadTimer3`|2|14
`QuadTimer3`|3|15

</div>

Teensy4有两种定时器类型的组合：`FlexPWM`和`QuadTimer`。对于2PWM、3PWM和4PWM模式，你可以使用上面列出的任何引脚，即使它们属于`QuadTimer`和`FlexTimer`通道的组合。但是，为了获得最佳效果，建议使用属于同一定时器的引脚，或者至少每相使用一个定时器。特别是因为SimpleFOC库在版本[v2.3.3](https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.3.3)中，默认情况下不会同步2PWM、3PWM和4PWM模式下不同定时器生成的PWM信号。此外，生成的PWM信号也不是中心对齐的。

SimpleFOC默认仅对6PWM驱动器进行中心对齐和定时器同步。如果你想在Teensy4上强制中心对齐的3PWM模式，可以设置`SIMPLEFOC_TEENSY4_FORCE_CENTER_ALIGNED_3PWM`标志。这将强制中心对齐的3PWM模式，并在使用多个定时器时同步定时器。但是，这两种模式都需要使用`FlexPWM`定时器，不能与`QuadTimer`定时器一起使用。

**6PWM**

从版本[v2.3.3](https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.3.3)开始，SimpleFOC仅允许在`FlexPWM`定时器上使用6PWM模式。属于`QuadTimer`定时器的引脚不支持6PWM。此外，SimpleFOC要求为6PWM模式的每个相使用一个子模块，如果不是这种情况，SimpleFOC将显示错误。
为了使用6PWM，对于每个相，从相同的时间和子模块中选择引脚`A`和`B`。引脚`X`在6PWM模式下不使用。

**中心对齐3PWM**

如果你想在Teensy4上强制中心对齐的3PWM模式，可以设置`SIMPLEFOC_TEENSY4_FORCE_CENTER_ALIGNED_3PWM`标志。对于此模式，你可以使用属于任何`FlexPWM`定时器的任何引脚`A`、`B`或`X`。如果使用多个定时器，SimpleFOC将自动同步它们。如果应用程序允许，建议使用定时器的通道`A`和`B`，并避免`X`。此外，如果设置了该标志并且你尝试使用`QuadTimer`定时器，SimpleFOC将显示错误。

以下表格显示了每个定时器和子模块的引脚`A`、`B`和`X`。

<div class="inline_table tight_table" markdown="1"><b>Teensy 4.1</b>

FlexTimer | 子模块 | A | B | X
--- | --- | --- | - | - | -
`FlexPWM1`|0| 45 | 44 | 1
`FlexPWM1`|1| 43 | 42 | 0
`FlexPWM1`|2| 47 |46|24
`FlexPWM1`|3| 8 | 7 | 25
`FlexPWM2`|0| 4 | 33 | -
`FlexPWM2`|1| 5 | - | -
`FlexPWM2`|2|6 | 9 | -
`FlexPWM2`|3| 36 | 37 | -
`FlexPWM3`|0| 54 | - | -
`FlexPWM3`|1| 29 | 28 | -
`FlexPWM3`|3| - | 51 | -
`FlexPWM4`|0| 22 | - | -
`FlexPWM4`|1| 23 | - | -
`FlexPWM4`|2| 2 | 3 | -

</div>
<div class="inline_table tight_table" markdown="1"><b>Teensy 4.0</b>


FlexTimer | 子模块 | A | B | X 
--- | --- | --- | --- | --- | ---
`FlexPWM1`|0|37 | 36 | 1
`FlexPWM1`|1| 35 | 34 | 0
`FlexPWM1`|2| 39| 38|24
`FlexPWM1`|3| 8 | 7 | 25
`FlexPWM2`|0| 4 | 33 | -
`FlexPWM2`|1| 5 | - | -
`FlexPWM2`|2|6 | 9 | -
`FlexPWM3`|1| 29 | 28 | -
`FlexPWM4`|0| 22 | - | -
`FlexPWM4`|1| 23 | - | -
`FlexPWM4`|2| 2 | 3 | -

</div>

