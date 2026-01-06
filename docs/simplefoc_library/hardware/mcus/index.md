---
layout: default
title: 单片机
nav_order: 4
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /microcontrollers
parent: 支持的硬件
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: true
has_toc: false
toc: true
---


# 支持的微控制器

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>允许您从20多种微控制器架构中进行选择，用于您的项目。<br>
*现成*支持的主要系列有：
- [Arduino AVR/DUE](arduino_mcu) 
- [STM32](stm32_mcu)
- [ESP32 和 ESP8266](esp_mcu)
- [Teensy](teensy_mcu)
- [SAMD21/SAMD51](samd_mcu)
- [树莓派 Pico](rpi_mcu)
- [Portenta H7](portenta_mcu) - *初步支持*
- [nRF52](nrf52_mcu) - *初步支持*

我们将继续扩展对尽可能多架构的支持。😃



# 选择微控制器

以下是不同微控制器系列已实现的PWM功能对比：

MCU | 2 PWM模式 | 4 PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置 
--- | --- |--- |--- |--- |--- 
Arduino（8位） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️（4kHz 或 32kHz）
Arduino DUE  | ✔️ | ✔️ | ✔️ | ❌ | ✔️
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
esp32 MCPWM | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
esp32 LEDC | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
esp8266 | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 
samd21/51 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
teensy | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
树莓派 Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
Portenta H7 | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 
nRF52 |✔️ | ✔️ | ✔️ | ✔️ | ✔️
瑞萨（UNO R4 Minima） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️

从该表格可以看出，如果您的应用需要6 PWM模式，应避免使用带有❌标记的系列。

此外，对于ESP32开发板，情况较为复杂，因为只有那些内置MCPWM外设的ESP32芯片才能支持6 PWM模式。虽然大多数ESP32芯片支持该模式，但有少数（如C3）不具备MCPWM支持。这些芯片仍可通过其LEDC外设获得支持，但无法实现6 PWM模式。

尽管表格上方列出的所有MCU（以及更多）都受该库支持，并且都能与大多数BLDC电机+BLDC驱动器+传感器组合配合使用，但它们的性能并不相同。因此，以下是关于如何选择MCU的快速指南。

开发板 | 系列 | `loopFOC() + move()` - 编码器 | `loopFOC() + move()` - 磁传感器SPI | `loopFOC() + move()` - 磁传感器I2C
--- | --- | --- | --- | --- |
HMBGC V2.2 | Arduino 8位 | 800微秒（ipr = 0），约10毫秒（ipr > 10000） | （不支持SPI） | 1100微秒
Arduino UNO | Arduino 8位 | 800微秒（ipr = 0），约10毫秒（ipr > 20000） | 1200微秒 | 约1000微秒
Bluepill | STM32 | 200微秒（ipr = 0），约1毫秒（ipr > 50000） | 300微秒 | 约1000微秒
Nucleo-64 | STM32 | 100微秒（ipr = 0），约500微秒（ipr > 50000） | 200微秒 | 约1000微秒
Arduino DUE | Arduino SAM | 200微秒（ipr = 0），约800微秒（ipr > 50000） | 300微秒 | 约1000微秒
ESP32 D1 R32 | ESP32 | 100微秒（ipr = 0），约500微秒（ipr > 50000） | 200微秒 | 约1000微秒
Teensy3.1 | Teensy | 200微秒（ipr = 0），约800微秒（ipr > 50000） | 300微秒 | 约1000微秒
Nano 33 | SAMD21  | 200微秒（ipr = 0），约800微秒（ipr > 50000） | 300微秒 | 约1000微秒

*ipr = 每秒中断回调次数。


在上方表格中，您可以看到不同MCU的FOC循环执行时间对比。当您决定在项目中使用哪种MCU时，请确保最坏情况下的循环执行时间`loopFOC() + move()`不超过3-4毫秒。为获得最佳性能，循环时间应控制在2毫秒以内。请务必考虑多电机的情况。


所有架构的电流检测支持如下表所示：
    
MCU | 串联式 | 低侧 | 高侧
--- | --- |--- |--- 
Arduino AVR（8位） | ✔️ | ❌ |  ❌
Arduino DUE  | ✔️ | ❌ |  ❌
stm32（一般情况） | ✔️ | ❌ |  ❌
stm32f1系列 | ✔️ | ✔️（一个电机） |  ❌
stm32f4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32g4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32l4系列 | ✔️ | ✔️（一个电机） |  ❌
stm32f7系列 | ✔️ | ✔️（一个电机） |  ❌
stm32h7系列 | ✔️ | ✔️（一个电机） |  ❌
stm32 B_G431B_ESC1 | ❌ | ✔️（一个电机） |  ❌
esp32/esp32s3 | ✔️ | ✔️ |  ❌
esp32s2/esp32c3 |  ✔️ | ❌ |  ❌ 
esp8266 | ❌ | ❌ |  ❌ 
samd21 | ✔️ | ✔️（一个电机） |  ❌ 
samd51 | ✔️ | ❌ |  ❌ 
teensy3 | ✔️ | ❌ |  ❌
teensy4 | ✔️ | ✔️（一个电机） |  ❌
树莓派 Pico | ✔️ | ❌ |  ❌
Portenta H7 | ✔️ | ❌ |  ❌
nRF52 | ✔️ | ❌ |  ❌
瑞萨（UNO R4 Minima） | ❌ | ❌ |  ❌

大多数开发板都支持串联电流检测，esp32、stm32、teensy4和samd21支持低侧电流检测，不过这方面的测试较少。

## 云台控制器
云台控制器是运行FOC算法控制云台电机最简单且成本最低的解决方案。如果您对动态性能要求不高，它们非常适合平滑地控制两个带传感器的BLDC电机。其主要缺点是，所有外部中断引脚都用于PWM信号，因此您无法从外部访问这些引脚。这意味着，即使您只需要一个电机（3个PWM），也仍然无法将引脚`2`和`3`用于编码器`A`和`B`信号。这意味着，如果您计划在这些开发板上使用编码器，则需要使用软件中断。好消息是这是可行的，坏消息是编码器信号的计数性能会受到影响。因此，如果可能，我建议您在这些开发板上使用带有通信接口（SPI、I2C等）的磁传感器。

不要因此而放弃在FOC中使用云台控制器，只需在决定使用哪种电机和传感器时注意可能的副作用即可。

<blockquote class="warning"> 购买前请确保您的云台控制器有您需要的通信接口引脚。</blockquote>

## Arduino微控制器
Arduino设备，如UNO、MEGA、NANO等，可能是最常用的微控制器，因此也可能是该库最常用的微控制器。使用这些开发板的简便性无可比拟。如果您计划在Arduino设备上运行该库，我当然建议您考虑使用磁传感器而非编码器。编码器（至少在Arduino UNO和MEGA上的实现）是效率极低的传感器，由于需要不断计数编码器产生的中断信号，因此会导致执行时间因电机驱动速度的不同而产生很大差异。

<blockquote class="warning">
<p class="heading">编码器CPR：Arduino UNO/MEGA的经验法则</p>
对于Arduino UNO，每秒的最大脉冲数不应超过20,000。超过此值后，会开始出现执行问题。
选择编码器时请考虑这一点，尤其是在使用多个电机的情况下。<br>
<p class="heading">示例</p>
如果您的CPR值为10000，您将能够以最大速度120rpm（2转/秒）驱动电机
</blockquote>

此外，Arduino UNO只有两个编码器中断引脚，如果您在Arduino UNO上运行两个带编码器的电机，将被迫使用软件中断回调，这会额外增加执行时间。Arduino MEGA有6个中断，因此您不应遇到此问题。

该库将使您能够使用Arduino UNO/MEGA作为FOC的核心，即使是两个电机，您仍然可以用它做很多很酷的事情。如果您使用编码器，只需注意上述经验法则即可。

## STM32设备
Stm32设备可能是FOC实现的最佳MCU选择。它们功能强大，有许多外部中断引脚。它们在计数方面不会损失太多性能，并且循环时间更短，使FOC算法更加平滑。Stm32 Bluepill可以毫无问题地运行多达4个BLDC电机，Nucleo-64可以运行6个以上。

在社区中使用STM32开发板的最大问题是这些设备的编程复杂性。但由于它们已集成到Arduino IDE中，因此这也不再是问题。用于stm32设备的Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>代码与用于Arduino UNO的代码完全相同，只是引脚编号不同。因此，我强烈建议您考虑在项目中使用这些设备，效果非常好。😃

<blockquote class="info"> Arduino <span class="simple">简易<span class="foc">FOC</span> 扩展板</span>与Nucleo-64设备完全兼容。从1.3.1版本的扩展板开始，您也可以将两个扩展板与Nucleo开发板堆叠使用。</blockquote>

## ESP32设备
ESP32设备是运行该库的一个非常有趣的选择。它们具有出色的通信接口，将用户与电机的交互提升到了一个新的水平。理论上，ESP32设备能够使用该库同时运行4个BLDC电机。而且它们的性能将比Arduino设备好得多。特别是因为它们不存在外部中断限制的问题。

使用ESP32开发板进行实时电机控制时主要有两个问题。

- ESP32开发板最初并非为精确的实时控制任务而设计，它们具有出色的通信能力，因此有时可能会因此出现一些奇怪的问题。但在99%的情况下，该开发板的性能都非常出色，只是如果您计划将其发挥到极限，可能会出现一些异常情况。
- 该开发板的另一个问题是引脚限制。如果您是ESP32新手，请务必观看这个[YouTube视频](https://www.youtube.com/watch?v=c0tMGlJVmkw)。启动时，某些GPIO必须处于特定状态，ESP32才能正常启动。但一旦您习惯了，这就不是什么大问题了！

这款开发板有很多优点，在未来的实时电机控制领域，我们似乎将会看到更多基于它的应用。



<h2><i class="fa fa-lg"><svg id="fab-discourse" style="width:20px;fill:#44a8fa" viewBox="0 0 448 512"><path d="M225.9 32C103.3 32 0 130.5 0 252.1 0 256 .1 480 .1 480l225.8-.2c122.7 0 222.1-102.3 222.1-223.9C448 134.3 348.6 32 225.9 32zM224 384c-19.4 0-37.9-4.3-54.4-12.1L88.5 392l22.9-75c-9.8-18.1-15.4-38.9-15.4-61 0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128z"></path> </svg></i> <span class="simple">简易<span class="foc">FOC</span>社区</span></h2>

如果您已将该库移植到其他设备，或者正在寻求帮助以将其移植到特定设备，请随时在[社区论坛](https://community.simplefoc.com)上发帖。

听取人们在实现代码过程中的故事/问题/建议总是很有帮助的，您可能会在那里找到很多已解答的问题！

<div class="image_icon width80" >
    <a href="https://community.simplefoc.com" target="_blank">
        <img src="extras/Images/community.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
