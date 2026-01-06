---
layout: default
title: 调试
nav_order: 9
permalink: /debugging
parent: 编写代码
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---


# 调试 <span class="simple">Simple<span class="foc">FOC</span>库</span> 程序

你连接好所有线路，下载了程序，接通电源，然后……什么都没发生。或者另一种常见情况：电机抽搐并发出刺耳的声音。

别担心！相信我们，我们也经历过这种情况。*每个人*都会有这样的经历，*没有人*能一次就成功设置好。无刷直流电机控制并不总是那么容易，过程中可能会犯很多错误。

有多种技术可以帮助你排查软件方面的问题，但其中一个非常有用的方法是生成一些调试输出，而通过“串口终端”查看调试输出在排查问题时会非常有价值。

## 调试功能

<span class="simple">Simple<span class="foc">FOC</span>库</span>通过“串口（Serial）”提供调试输出，只需在`setup`函数中添加以下代码行即可启用。

将这个函数调用放在`setup`函数的早期，以便查看电机初始化的调试输出，这对于帮助你发现设置中的问题很重要。



```cpp
SimpleFOCDebug::enable();
```

或者指定要使用的串口实例：
```cpp
SimpleFOCDebug::enable(&Serial);
```

<blockquote class="info">
注意：你也可以使用其他串口，例如Serial1、Serial2，具体取决于你的微控制器支持情况。
</blockquote>

### 调试电机初始化

电机在初始化`motor.init()`和校准过程`motor.initFOC()`中会生成关于其状态的调试输出。启用此功能不会直接影响实时性能，因为在`motor.loopFOC()`和`motor.move()`函数的实时循环中没有调试输出。

以下是电机初始化监控输出正常的示例：
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

由于位置传感器导致电机初始化失败的情况：
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: Failed to notice movement
MOT: Init FOC failed.
```

由于电流检测导致电机初始化失败的情况：
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

### 编写自定义调试语句

你可以轻松地将<span class="simple">Simple<span class="foc">FOC</span>库</span>用于自己的调试需求：

```cpp
SIMPLEFOC_DEBUG("Hello world!");
SIMPLEFOC_DEBUG("Float value: ", fval);
SIMPLEFOC_DEBUG("Int value: ", ival);
```

使用这个宏有几个优点，详见下面的 “FlashStringHelper”、“全局禁用” 和 “原理” 部分。

查看[SimpleFOCDebug class header](https://github.com/simplefoc/Arduino-FOC/blob/master/src/communication/SimpleFOCDebug.h) 了解所有可用方法。

### FlashStringHelper

`SimpleFOCDebug `宏会自动使用 FlashStringHelper，因此你不应该对提供给SIMPLEFOC_DEBUG宏的字符串使用 F () 宏。

### 调试 - 全局禁用

通过编译标志`SIMPLEFOC_DISABLE_DEBUG`可以全局禁用所有调试输出，如果内存不足，这可能还能节省几个字节的程序空间。

### 原理
为什么要有自己的`SimpleFOCDebug`？为什么不直接使用`Serial.println`？

由于SimpleFOC库支持多种硬件平台，我们不能假设`Serial`对象一定可用。虽然它是 `Arduino` 框架的一个相当标准的功能，但特定的开发板可能不支持它，或者出于某种原因可能有不同的名称。我们也不能假设你想要使用哪个`Serial`对象。有些微控制器支持 6 个或更多的串口。

我们也喜欢它提供的抽象层，这使得将SimpleFOC库移植到其他平台 / 框架更加容易。未来我们可能会进一步抽象调试输出功能，允许通过 SPI、MQTT 或其他协议进行调试输出。因此，将调试与`Serial`分开也是很好的做法。

## 其他调试方法

### 常规的Serial.println

我可以在SimpleFOC库程序中像平常一样使用`Serial`输出吗？

可以，但也有注意事项…… 在程序中调用 Serial.println () 没有问题，你不必强制使用上面描述的调试工具。

但是你必须注意不要在串口输出上花费太多时间。`move`和`loopFOC`函数需要在主`loop`中非常频繁地调用，你不能一直向串口输出。你必须编写代码以尽量减少输出的字节数，并包含一些计时代码以确保每秒只输出一两次。

### 备用引脚

调试简单问题的一个好方法是使用`digitalWrite`和一个未使用的引脚：
```cpp
digitalWrite(5, HIGH); // 5 is an unused pin

// ...

digitalWrite(5, LOW);
```

使用这种技术不会影响执行时间，使用示波器或逻辑分析仪可以检查输出引脚，查看诸如调用执行时间、代码是否执行特定分支等情况。

### IDE 调试器

在SimpleFOC库中使用真正的调试器可能是一个挑战。代码对实时性要求很高，不能轻易暂停或减慢运行速度。根据作者的经验，使用调试器会减慢执行速度，以至于无刷直流电机控制几乎无法实现。

但这取决于你要解决的问题、所使用的微控制器和调试硬件以及其他因素，因此请记住实时性考虑，在你选择的调试工具中尝试一下，看看效果如何。

### 社区求助！

我们再怎么强调SimpleFOC库社区的帮助都不为过，如果你遇到问题的话！

我们有一个[Discourse 论坛](https://community.simplefoc.com/) 和一个 [Discord 服务器](https://discord.com/invite/JbH772tfnB)，你可以随时加入并提问。我们的成员既知识渊博又乐于助人，所以与其自己苦苦琢磨，不如过来向一些志同道合的人寻求建议。

### 报告问题!

如果你隔离了问题，并发现这是我们的问题，请毫不犹豫地在 GitHub 上[提交错误报告！
](https://github.com/simplefoc/Arduino-FOC/issues/new)!
