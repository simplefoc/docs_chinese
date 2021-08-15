---
layout: default
title: Microcontrollers
nav_order: 4
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /microcontrollers
parent: Supported Hardware
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: true
has_toc: false
---



# 支持的单片机

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>支持：

- [Arduino UNO/MEGA, Arduino DUE](arduino_mcu) 
- [STM32](stm32_mcu)
- [ESP32](esp32_mcu)
- [Teensy](teensy_mcu)
- [SAMD21/SAMD51](samd_mcu)
- [Raspberry Pi Pico](rpi_mcu) ——*初始支持*

现成设备，使用Arduino IDE，允许进行小修改…😃





# 选择单片机

尽管<span>Simple<span>FOC</span></span>library支持许多单片机，并且所有这些都将与大多数无刷直流电机+无刷直流驱动器+传感器组合工作，但它们的性能将不一样。有关如何选择你的mcu以及从哪里入手，这里有一些我们的想法和比较。

这是不同种类单片机PWM特性实现的比较：

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
Arduino (8-bit) | ✔️ | ✔️ | ✔️ | ✔️ | ❌ (32kHz)
Arduino DUE  | ✔️ | ✔️ | ✔️ | ❌ | ✔️
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
esp32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
samd21/51 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
teensy | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 
Raspberry Pi Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

从这个表格中你可以看到，如果你的应用程序需要6路PWM模式，你应该避免使用Teensy和Arduino DUE板。


尽管库中支持上表中的所有MCU(以及更多)，并且所有这些mcu都将与大多数无刷直流电机+无刷直流驱动器+传感器组合一起工作，但它们的性能将不尽相同。因此，这里是一个快速指南，如何选择使用哪个MCU。

板子 | 系列 | `loopFOC() + move()` - 编码器 | `loopFOC() + move()` - 磁传感器 SPI | `loopFOC() + move()` - 磁传感器I2C 
--- | --- | --- | --- | --- 
HMBGC V2.2 | Arduino 8-bit | 800us (ipr = 0),  ~10ms (ipr > 10000) | (doesn't support SPI) | 1100us
Arduino UNO | Arduino 8-bit | 800us (ipr = 0),  ~10ms (ipr > 20000) | 1200us | ~1000us
Bluepill | STM32 | 200us (ipr = 0), ~1ms (ipr > 50000) | 300us | ~1000us
Nucleo-64 | STM32 | 100us (ipr = 0), ~500us (ipr > 50000) | 200us | ~1000us
Arduino DUE | Arduino SAM | 200us (ipr = 0), ~800us (ipr > 50000) | 300us | ~1000us
ESP32 D1 R32 | ESP32 | 100us (ipr = 0), ~500us (ipr > 50000) | 200us | ~1000us
Teensy3.1 | Teensy | 200us (ipr = 0), ~800us (ipr > 50000) | 300us | ~1000us
Nano 33 | SAMD21  | 200us (ipr = 0), ~800us (ipr > 50000) | 300us | ~1000us

*Ipr =每秒中断回调

在上表中，你可以比较不同MCU的FOC循环的执行时间。当你决定使用哪个MCU与你的项目，请确保你的循环执行时间 `loopFOC() + move()`，在最坏的情况下，将不大于3-4ms。为了获得最佳性能，循环时间应该小于2ms。一定记得要考虑到多个电机。



# 云台控制器

云台控制器是最简单的，当然也是最便宜的解决方案去运行FOC算法与你的云台电机。如果你没有高的动力约束，他们能完美支持位置/速度控制两个带传感器的无刷直流电机。它们的主要缺点是，它们使用了所有外部中断引脚支持PWM信号，因此你不能从外部访问它们。这意味着，即使你只需要一个电机(3路PWMs)，你仍然不能使用引脚 `2`和 `3`，编码器 `A` 和 `B` 信号。也就是说，如果你想要将编码器使用在这些板，你会需要用到软件中断。好消息是它还能进行工作，坏消息是计数编码器信号的性能将受到损害。因此，如果可能的话，我建议你将带有通信接口(SPI, I2C…)的磁传感器用于这些板子。

不要让这阻止你使用带有FOC的云台控制器，只要在决定使用哪个电机和传感器时注意可能的副作用。

<blockquote class="warning">确保你的云台控制器有你需要的通信接口引脚，再购买它。</blockquote>

## Arduino MCUs

Arduino设备，如UNO,MEGA,NANO和其他类似的，可能是最常用的单片机。这些板使用该库的简单性是无可比拟的。如果你想使用Arduino设备运行这个库，我肯定会建议你考虑使用磁性传感器而不是编码器。编码器是非常低效的传感器(至少在Arduino UNO和MEGA的实现中)，由于不断计算编码器的中断信号，根据你驱动电机的速度，会产生很大的执行时间差异。

<blockquote class="warning">
<p class="heading">编码器CPR: Arduino UNO/MEGA的经验法则</p>
对于Arduino UNO，最大脉冲数每秒不超过20,000。在这个值之后，它开始有执行问题。
请在选择编码器时考虑到这一点，特别是如果使用多个电机。<br>
<p class="heading">例如</p>
如果你的CPR值是10000，你将能够旋转你的电机最大速度120rpm - 2 rotations/second 
</blockquote>

此外，Arduino UNO只有两个编码器中断引脚，如果你在Arduino UNO上运行两个带有编码器的电机，你将必须使用软件中断回调，这将增加额外的执行时间。Arduino MEGA有6个中断，你应该不会有这个问题。

这个库将使你使用Arduino UNO/MEGA作为你的FOC大脑，你仍然可以用甚至带有两个电机的它做很多很酷的东西。如果你在使用编码器，请注意经验法则。

## STM32 设备
Stm32设备可能是实现FOC的单片机里的最佳选择。它们非常强大，有许多外部中断引脚。它们不会因为计数而失去太多的性能，而且循环时间更低，使得FOC算法更流畅。Stm32 Bluepill可以运行4个无刷直流电机而Nucleo-64可以运行6+。

在社区中使用STM32板的最大问题是对这些设备编程的复杂性。但由于它们已经集成到Arduino IDE中，这应该也不再是一个问题。Arduino <span>Simple<span>FOC</span>library</span>代码用于stm32设备与Arduino UNO完全相同，只是引脚编号不同。因此，我强烈建议你考虑在你的项目中使用这些设备，因为结果是极好的。😃

<blockquote class="info"> Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>完全兼容Nucleo-64设备。从1.3.1版本的shield，你将能够堆叠2个shield在Nucleo板上。</blockquote>

## ESP32 设备

对于运行这个库，ESP32设备是非常有趣的选择。它们有极好的通信接口，并将用户与电机的交互提升到下一个层次。从理论上讲，ESP32设备能够同时运行4个无刷直流电机。而且它们的性能会比Arduino中的一个设备好得多。特别是它们没有外部中断限制的问题。

在使用ESP32板进行实时电机控制时，存在两个主要问题。

- ESP32板最初不是为精确的实时控制任务而设计的，它们有特殊的通信能力，因此有时你会因为这个事实而遇到一些奇怪的问题。但在99%的情况下，这个板子会表现得非常好，只有当你想将其发挥到极限时，奇怪的事情才可能发生。
- 这个板的另一个问题是引脚限制。如果你是ESP32的新手，请务必观看这个[YouTube视频](https://www.youtube.com/watch?v=c0tMGlJVmkw)。在启动时，为了使ESP32正常启动，一些GPIOs必须处于特定的状态。但一旦你习惯了，这并不是一个大问题！

这个板有很多优势，未来我们会看到更多它在实时电机控制领域。



<h2><i class="fa fa-lg"><svg id="fab-discourse" style="width:20px;fill:#44a8fa" viewBox="0 0 448 512"><path d="M225.9 32C103.3 32 0 130.5 0 252.1 0 256 .1 480 .1 480l225.8-.2c122.7 0 222.1-102.3 222.1-223.9C448 134.3 348.6 32 225.9 32zM224 384c-19.4 0-37.9-4.3-54.4-12.1L88.5 392l22.9-75c-9.8-18.1-15.4-38.9-15.4-61 0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128z"></path> </svg></i> <span class="simple">Simple<span class="foc">FOC</span>社区</span></h2>

<div class="image_icon width80" >
    <a href="https://community.simplefoc.com" target="_blank">
        <img src="extras/Images/community.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
如果你已经将库移植到另一个设备上，或者你正在寻找帮助来移植到某些特定的设备上，不要犹豫，在[社区论坛](https://community.simplefoc.com)发布消息。

听大家实现代码的故事/问题/建议总是很有帮助的，你可能会发现很多已经有答案的问题！
