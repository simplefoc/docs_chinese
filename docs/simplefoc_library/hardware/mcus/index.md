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
---



# 支持的单片机

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>支持：

- [Arduino UNO/MEGA, Arduino DUE](arduino_mcu) 
- [STM32](stm32_mcu)
- [ESP32](esp32_mcu)
- [Teensy](teensy_mcu)
- [SAMD21/SAMD51](samd_mcu)
- [Raspberry Pi Pico](rpi_mcu) ——*初始支持*

通常现成且能用Arduino IDE的设备，少许小修改就能够完成库的移植…😃





# 选择单片机

尽管 <span>Simple<span>FOC</span></span>库 支持许多单片机，并且所有这些都将与大多数无刷直流电机+无刷直流驱动器+传感器组合工作，但它们的性能不一样。我们在这里列出了比较表，助你快速选型你需要的单片机。

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


尽管库支持上表中的所有MCU(甚至更多)，并且所有这些mcu都将与大多数无刷直流电机+无刷直流驱动器+传感器组合一起工作，但它们的性能其实不尽相同。因此，这里是一个快速指南，告诉你如何快速选择使用哪个MCU。

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

在上表中，你可以比较不同MCU的FOC循环的执行时间。当你决定使用哪个MCU与你的项目，请确保你的循环执行时间 `loopFOC() + move()`，在最坏的情况下，不能大于3-4ms。为了获得最佳性能，循环时间应该小于2ms。如果你需要通过一个控制板控制多个电机，还需要考虑多个电机的情况。

# 现成的云台控制器

如果你没有高的动力要求，现成的云台控制器是运行FOC算法与你的云台电机最简单便宜的方案。它们能完美支持位置/速度控制。但是也有缺点，主要就是它们使用了所有外部中断引脚以生成PWM信号，因此导致引脚不足，你通常没有多余的引脚做外部控制。这意味着，即使你只需要一个电机(3路PWMs)，你仍然不能使用ABI编码器。如果你想要将编码器使用在这些板，你只能用到软件中断。软件中断虽然也能让这些编码器跑起来，但是会降低其响应能力。所以，IIC和SPI编码器相对于ABI编码器有时更适合用在这些电机上面。

<blockquote class="warning">所以，买之前最好确保你的云台控制器有你需要的通信接口引脚。</blockquote>
## Arduino MCUs

Arduino设备，如UNO,MEGA,NANO，可能是最常见的单片机。因此用这些单片机去跑SFOC库估计比其他单片机的步骤要少很多，也简洁很多。但是有一点需要注意，如果你想使用Arduino设备运行这个库，我肯定会建议你考虑使用磁传感器而不是编码器。编码器是非常低效的传感器(至少在Arduino UNO和MEGA里面是这样)，由于需要不断计算编码器的中断信号，这必然会导致影响FOC算法的运行效率。

<blockquote class="warning">
<p class="heading">Arduino UNO/MEGA在编码器CPR上的经验法则</p>
对于Arduino UNO，最大脉冲数每秒不超过20,000。在这个值之后，它开始有执行问题。
请在选择编码器时考虑到这一点，特别是如果一个主控带多个电机时。<br>
<p class="heading">例如</p>
如果你的CPR值是10000，因为着测得准的最大转速为120转 - 即2转/秒
</blockquote>


此外，Arduino UNO只有两个编码器中断引脚，如果你在Arduino UNO上运行两个带有编码器的电机，你将必须使用软件中断回调，这将增加额外的执行时间。Arduino MEGA有6个中断，你应该不会有这个问题。

这个库将使你使用Arduino UNO/MEGA作为你的FOC大脑，你仍然可以用甚至带有两个电机的它做很多很酷的东西。如果你在使用编码器，请注意经验法则。

## STM32 设备
Stm32设备可能是实现FOC的单片机里的最佳选择。它们非常强大，有许多外部中断引脚。它们不会因为计数而失去太多的性能，而且循环时间间隔短，这使得FOC算法可以跑得很流畅。Stm32 Bluepill可以运行4个无刷直流电机而Nucleo-64甚至可以运行6+个。

开源社区里用STM32问题是32的编程比较复杂。但由于现在32也是可以用Arduino的，所以这应该也不算是一个问题了。Arduino <span>Simple<span>FOC</span>library</span>的代码和STM32的代码实际上是完全一致的，只是有些接口不一样，因此，如果你想用32实现SFOC不失也为一个上乘主义。😃

<blockquote class="info"> Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>从1.3.1版本的开源板起，板子硬件上完全兼容STM32 Nucleo-64设备，你甚至能堆叠2个电机开源板在Nucleo板上。</blockquote>
## ESP32 设备

对于运行这个库，ESP32设备是非常有趣的选择。它们有极好的通信接口，并且能提升用户和电机的交互。理论上讲，ESP32设备能够同时运行4个无刷直流电机。而且它们的性能会比传统Arduino设备好得多。特别是它们没有外部中断限制的问题。

在使用ESP32板进行实时电机控制时，存在两个主要问题。

- ESP32板最初不是为精确的实时控制任务而设计的，它们有特殊的通信能力，因此有时你会因为这个事实而遇到一些奇怪的问题。但在99%的情况下，这个板子会表现得非常好，只有当你想将其发挥到极限时，奇怪的事情才可能发生。
- 这个板的另一个问题是引脚限制。如果你是ESP32的新手，请务必观看这个[YouTube视频](https://www.youtube.com/watch?v=c0tMGlJVmkw)。在启动时，为了使ESP32正常启动，一些GPIOs必须处于特定的上拉/0位状态。但一旦你习惯了，这并不是一个大问题！

这个板有很多优势，相信未来我们会看到更多它在实时电机控制领域的应用。



<h2><i class="fa fa-lg"><svg id="fab-discourse" style="width:20px;fill:#44a8fa" viewBox="0 0 448 512"><path d="M225.9 32C103.3 32 0 130.5 0 252.1 0 256 .1 480 .1 480l225.8-.2c122.7 0 222.1-102.3 222.1-223.9C448 134.3 348.6 32 225.9 32zM224 384c-19.4 0-37.9-4.3-54.4-12.1L88.5 392l22.9-75c-9.8-18.1-15.4-38.9-15.4-61 0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128z"></path> </svg></i> <span class="simple">Simple<span class="foc">FOC</span>社区</span></h2>
<div class="image_icon width80" >
    <a href="https://community.simplefoc.com" target="_blank">
        <img src="extras/Images/community.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
如果你已经将库移植到另一个设备上，或者你正在寻找移植到某些特定的设备上的帮助，不要犹豫，在[社区论坛](https://community.simplefoc.com)发布消息。

参与讨论对于开发是很有帮助的，你可能会发现很多问题已有答案！
