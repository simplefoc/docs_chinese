---
layout: default
title: 实时循环
nav_order: 6
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /real_time_loop
parent: 实用指南
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---

# 使用定时器的硬实时FOC循环

在本指南中，我们将重点介绍SimpleFOC库中的实时循环实现。由于该库被设计为完全跨平台，我们选择了FOC循环的通用异步实现，其中`motor.loopFOC()`（磁场定向控制运行时）和`motor.move()`（运动控制）函数在应用程序的主循环中尽可能快地被调用。

通常，用户程序会是这样的：

```cpp
...
void setup() {
    ...
}

void loop() {
    // run the FOC algorithm
    motor.loopFOC();
    
    // run the motion control algorithm
    motor.move();

    // motor monitoring
    motor.monitor();
    // user communication
    command.run();
}
```

然而，根据应用场景的不同，可能需要在硬实时环境中运行FOC循环，而不是在主循环中，因为主循环中的其他代码可能会延迟其执行时间。实现这一点的一个非常简单的方法是使用微控制器的硬件定时器，以固定频率调用`motor.loopFOC()`和`motor.move()`函数。但是，这需要对微控制器及其硬件定时器有更深入的了解，并且通常特定于您使用的微控制器系列。

在本指南中，我们将重点介绍STM32和ESP32系列，因为它们是SimpleFOC社区中最常用的微控制器。

## STM32

对于STM32，您可以使用`HardwareTimer`类创建一个定时器，该定时器将以固定频率调用`motor.loopFOC()`和`motor.move()`函数。以下是实现示例：

```cpp
#include <SimpleFOC.h>

...
// instatiate the motor, dirver, sensor and other components
... 

void setup() {
  
  // iniitalise all the components


  // create a hardware timer
  // For example, we will create a timer that runs at 10kHz on the TIM5
  HardwareTimer* timer = new HardwareTimer(TIM5);
  // Set timer frequency to 10kHz
  timer->setOverflow(10000, HERTZ_FORMAT); 
  // add the loopFOC and move to the timer
  timer->attachInterrupt([](){
    // call the loopFOC and move functions
    motor.loopFOC();
    motor.move();
  });
  // start the timer
  timer->resume();

  _delay(1000);
}

// the loop will now do only the monitoring and user communication
void loop() {
  // motor monitoring
  motor.monitor();
  // user communication
  command.run();
}

```

<blockquote class="info">
  <p class="heading">ℹ️ 该使用哪个定时器？</p>

  您可以使用微控制器上可用的任何定时器，但请确保不要使用电机驱动器或位置传感器所使用的定时器。对于STM32系列，与PWM一起使用的定时器将在您运行`motor.init()`函数时显示在串行监视器中。您也可以在文档中查看引脚所使用的定时器（找到您的微控制器系列和引脚）[参见此处](https://docs.simplefoc.com/stm32pinouts/)

</blockquote>


## ESP32 

Esp32微控制器与STM32系列有类似的方法，但实现略有不同。您可以使用`hw_timer`库创建一个定时器，该定时器将以固定频率调用`motor.loopFOC()`和`motor.move()`函数。以下是实现示例：

```cpp
#include <SimpleFOC.h>

...
// instatiate the motor, dirver, sensor and other components
...

hw_timer_t *timer = NULL;

void IRAM_ATTR foc_loop() {
  // call the loopFOC and move functions
  motor.loopFOC();
  motor.move();
}

void setup() {

  // iniitalise all the components

  // create a hardware timer
  // 1mhz timer
  timer = timerBegin(1000000);
  // attach the interrupt
  timerAttachInterrupt(timer, &foc_loop);
  // Set alarm to call foc_loop every 100us (10kHz)
  timerAlarm(timer, 100, true, 0);


  _delay(1000);
}

// the loop will now do only the monitoring and user communication
void loop() {
  // motor monitoring
  motor.monitor();
  // user communication
  command.run();
}
```

<blockquote class="info">
  查看更多信息，请参见<a href="https://espressif-docs.readthedocs-hosted.com/projects/arduino-esp32/en/latest/api/timer.html#example-applications">ESP32 Espressif API文档</a>。
</blockquote>

<blockquote class="warning" markdown="1">
  <p class="heading">⚠️ 警告:</p>
  确保不要将定时器频率设置得太高。如果`motor.loopFOC()`和`motor.move()`函数的执行时间比定时器间隔长，定时器可能会错过调用或使微控制器过载。这可能导致电机故障甚至使微控制器崩溃。

</blockquote>

## 其他微控制器

大多数其他微控制器与STM32和ESP32系列有类似的方法，但实现可能不同。您可以查看所使用的特定微控制器的文档，了解如何创建一个定时器，以固定频率调用`motor.loopFOC()`和`motor.move()`函数。

示例：

- Teensy: - [IntervalTimer](https://www.pjrc.com/teensy/td_timing_IntervalTimer.html)
- Raspberry Pi pico - [RPI_PICO_TimerInterrupt](https://github.com/khoih-prog/RPI_PICO_TimerInterrupt?tab=readme-ov-file#13-set-hardware-timer-frequency-and-attach-timer-interrupt-handler-function)


## 故障排除



### 监控和用户通信不再工作（或任何其他功能）
如果您发现电机监控和用户通信不再正常工作，很可能是定时器频率太高，`motor.loopFOC()`和`motor.move()`函数的执行时间太长。在这种情况下，您可以尝试降低定时器频率或通过在定时器中断中添加延迟来增加`motor.loopFOC()`和`motor.move()`函数的执行时间。