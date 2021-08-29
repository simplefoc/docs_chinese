---
layout: default
title: 4路PWM步进驱动器
nav_order: 1
permalink: /stepper_driver_4pwm
parent: 步进驱动程序配置
grand_parent: 驱动器
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>

---

# 4路PWM步进驱动器 - `StepperDriver4PWM`

这个类提供了一个常见的 4路PWM 步进驱动器的抽象层。基本上，任何可以使用 4路PWM 信号运行的步进驱动器都可以用这个类来表示。
例如：

- L298n
- MX1508
- Arduino Uno R3的直流电机驱动模块
- 等等


<img src="extras/Images/stepper4pwm.png" class="width60">

## 步骤1. 硬件设置
创建步进电机驱动器的接口，需要为电机的每个相分别指定2个PWM引脚，同时指定使能引脚`en1` 和 `en2` （可选）

```cpp
//  StepperDriver4PWM( int ph1A,int ph1B,int ph2A,int ph2B, int en1 (optional), int en2 (optional))
//  - ph1A, ph1B - 相1 pwm引脚
//  - ph2A, ph2B - 相2 pwm引脚
//  - en1, en2  - 使能引脚（可选输出）
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9, 10, 7,  8);
```

## 步骤2.1 PWM 配置
```cpp
// PWM 频率 [Hz]
// atmega328 的频率固定为 32kHz
// esp32/stm32/teensy 配置
driver.pwm_frequency = 50000;
```
<blockquote class="warning">
⚠️ 基于 ATMega328 芯片的 Arduino  设备的 pwm 频率固定为 32kHz。
</blockquote>


下面是  Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中使用的不同MCU及其PWM频率和分辨率的列表。

MCU | default frequency（默认频率） | MAX frequency（最大频率） | PWM resolution（分辨率） | Center-aligned（中心对齐） | Configurable freq（可配置的频率） 
--- | --- | --- | --- | --- | --- 
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | no
STM32 | 50kHz | 100kHz | 14bit | yes | yes
ESP32 | 40kHz | 100kHz | 10bit | yes | yes
Teensy | 50kHz | 100kHz | 8bit | yes | yes

这些设置都在 library 库的源文件的 `drivers/hardware_specific/x_mcu.cpp/h` 中定义。


## 步骤2.2 电压
` Driver` 类可以设置输出引脚的PWM占空比，而这需要知道输入的电源电压值。此外，通过` Driver` 类可以设置驱动器输出引脚的限压 。

```cpp
// 电源电压 [V]
driver.voltage_power_supply = 12;
// 允许最大直流电压 - 默认为电源电压
driver.voltage_limit = 12;
```

<img src="extras/Images/stepper_limits.png" class="width60">

 `StrpperMotor` 类也会使用限压参数。 如上图所示当设置了限压 `driver.voltage_limit` 时，它会送入`BLDCMotor` 类的FOC算法中，输出的相位电压大约是  `driver.voltage_limit/2`。

因此，这个参数对防止电机的电流过来说非常重要。在这种情况下，该参数可以视作一种安全特性。

## 步骤2.3 初始化
当必要的配置参数都设置好了，则调用驱动器函数 `init()` 。该函数根据所设置的参数配置驱动器代码初始化所需的所有硬件和软件。
```cpp
// 驱动器初始化
driver.init();
```

## 步骤3. 实时使用`StepperDriver4PWM`

步进电机驱动器是和 SimpleFOClibrary 一起开发的，也为 FOC 算法中实现的  `StepperMotor`  类提供抽象层。当然 `StepperDriver4PWM` 类可以作为一个独立的类使用，并且可以选择作为一个步进电机驱动器实现任何其他类型的控制算法。

>  wait to translate 对原文存疑

## FOC算法支持
在 FOC 控制下，驱动器的使用是由运动控制算法内部完成的，只需将驱动器连接到  `StepperMotor` 类。
```cpp
// 连接电机和驱动器
motor.linkDriver(&driver)
```

## 独立驱动器
想让步进电机驱动器作为独立部分并应用于你自己的驱动算法也很容易。下面是一个非常简单的实例代码。
```cpp
// 步进电机驱动器独立实例
#include <SimpleFOC.h>

// 步进电机驱动器实例
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9,10, 7, 8);

void setup() {
  
  // PWM 频率 [Hz]
  driver.pwm_frequency = 50000;
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  // 允许最大直流电压 - 默认为电源电压
  driver.voltage_limit = 12;
  
  // 初始化驱动器
  driver.init();

  // 启用驱动器
  driver.enable();

  _delay(1000);
}

void loop() {
    // 设置 PWM
    // 相1：3V，相2：6V
    driver.setPwm(3,6);
}
```