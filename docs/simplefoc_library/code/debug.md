---
layout: default
title: Debugging
nav_order: 9
permalink: /debugging
parent: Writing the Code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>  
---

#  <span class="simple">Simple<span class="foc">FOC</span>library</span>  Sketch 调试

当你把一切都接好，下载好sketch，连上电源，然后…...发现电机纹丝不动。或者出现另一种常见的情况：电机突然转动，发出可怕的声音。

别担心！相信我们，我们经历过。*每个人*都有这样的经历，*没有人*可以第一次尝试时就有一个可行的设置。控制BLDC无刷电机并不总是一帆风顺的，犯错是不可避免的。

有许多不同技巧可以帮助你发现软件问题，其中一个非常有用的方法是进行一些调试输出。寻找问题时，在`串行`终端查看调试输出是非常有意义的。

## 功能调试

<span class="simple">Simple<span class="foc">FOC</span>library</span>库使用串口提供调试输出，该串口是通过添加以下行到`setup`函数来启用的。

在`setup` 函数前面部分调用这一函数，可以查看电机初始化的调试输出，对帮你发现设置中的问题至关重要。


```cpp
SimpleFOCDebug::enable();
```

或者指定要使用的串口实例：
```cpp
SimpleFOCDebug::enable(&Serial);
```

<blockquote class="info">
注意：你也可以使用MCU支持的其他串口，例如：串口1，串口2。
</blockquote>


### 电机初始化调试

在初始化`motor.init()` 以及校准`motor.initFOC()`期间， `motor` 会进行状态调试输出。由于函数`motor.loopFOC()`和 `motor.move()`在实时回路中没有调试输出，因此启用此功能并不会直接影响实时性能。

以下为可行的电机初始化监控输出例程：
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: sensor direction==CW
MOT: PP check: OK!
MOT: Zero elec. angle: 4.28
MOT: Align current sense.
MOT: Success: 2
MOT: Ready.
```

由于位置传感器，电机初始化失败：
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: Failed to notice movement
MOT: Init FOC failed.
```

由于电流检测问题，电机初始化失败：
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: sensor direction==CW
MOT: PP check: OK!
MOT: Zero elec. angle: 4.28
MOT: Align current sense.
MOT: Fail!
MOT: Init FOC failed.
```

### 写调试说明

你可以用 <span class="simple">Simple<span class="foc">FOC</span>library</span>  库简单的达到目的：

```cpp
SIMPLEFOC_DEBUG("Hello world!");
SIMPLEFOC_DEBUG("Float value: ", fval);
SIMPLEFOC_DEBUG("Int value: ", ival);
```

使用宏有许多好处， 请查阅以下 FlashStringHelper, 全局禁用和理论意义

所有可行方法，请查阅 [SimpleFOCDebug class header](https://github.com/simplefoc/Arduino-FOC/blob/master/src/communication/SimpleFOCDebug.h) 。

### FlashStringHelper

SimpleFOCDebug 宏自带 FlashStringHelper 。你不需要在提供给`SIMPLEFOC_DEBUG`宏的字符串上使用F()宏。

### 调试 - 全局禁用

通过使用构建标志`SIMPLEFOC_DISABLE_DEBUG` ，你可以全局禁用所有调试输出结果。如果内存不足，这也许能省下些程序空间。

### 理论意义

为什么要用`SimpleFOCDebug`? 而不直接用`Serial.println`呢？

<span class="simple">Simple<span class="foc">FOC</span>library</span>现已支持许多硬件平台，我们不能提前假定`串行`对象可用。即使它是Arduino框架相当标准的功能，但某个板还是可能不支持它，又或者出于某些原因给它取了不同的名称。我们也不能想当然的假定你想要使用的是哪个`串行` 对象。某些MCU支持6个甚至6个以上串口。

同时，我们也喜欢它提供的抽象概念，使我们更容易将<span class="simple">Simple<span class="foc">FOC</span>library</span>移植到其他平台或框架上。在不久的将来，我们可能会将调试输出功能进一步抽象一个级别，允许通过SPI、MQTT或其他协议进行调试输出。出于这个原因，分离调试和`串行`也是很好的选择。

## 其他调试方法

### 古早的普通方法 Serial.println

我可不可以像之前一样在<span class="simple">Simple<span class="foc">FOC</span>library</span> sketch使用`串行`输出？

是的，可以，这完全没有问题……在sketch调用Serial.println()是完全没有问题的，你可以不必像上述那样被迫使用我们的调试工具。

*但是* 你必须注意不要在`串行`输出耗费太多时间。函数`move`和`loopFOC`需要经常在你的主循环中调用，你不能一直输出到`串行`端口。你必须以某种方式编写代码以便最小化输出字节，并且要包含一些计时代码以确保函数每秒只输出一次或两次。

### 空余引脚

调试简单代码的好办法是使用 `digitalWrite` 和一个未被使用过的引脚：
```cpp
digitalWrite(5, HIGH); // 引脚5是仍未被使用过的引脚

// ...

digitalWrite(5, LOW);
```

使用上述办法不会影响到程序执行时间。通过使用示波器或逻辑分析仪，你可以检查输出引脚，查看调用执行了多长时间，代码是否占用了某些分支等等。

### IDE 调试

在<span class="simple">Simple<span class="foc">FOC</span>library</span> 做真正的调试会是一个挑战。代码是实时，不易暂停或运行缓慢的。根据本人的经验，使用调试器会减慢执行速度，以至于无法进行BLDC无刷电机控制。

但这也取决于你想要发现的问题、所用的MCU、调试硬件以及其他各种因素。所以要记住根据实际情况考虑，在你选择的调试器中尝试一下，看下它会如何运行。

### 求助他人！

如果你发现问题，我们无法言说<span class="simple">Simple<span class="foc">FOC</span>library</span>社区能给予你多大帮助！

此外，我们还有[话题论坛](https://community.simplefoc.com/)以及[Discord服务器](https://discord.com/invite/JbH772tfnB)，你随时都可以加入提问。我们的会员都是知识渊博、乐于助人的，所以与其自己埋头苦干，不如找一些同好交流意见。

### 报告问题！

如果你定位到问题，并发现是我们库的问题，请不要犹豫，立即 [提交bug报告到GitHub](https://github.com/simplefoc/Arduino-FOC/issues/new)!
