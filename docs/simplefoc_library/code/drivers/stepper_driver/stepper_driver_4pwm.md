---
layout: default
title: 4路PWM步进驱动器
nav_order: 1
permalink: /stepper_driver_4pwm
parent: 步进驱动程序配置
grand_parent: 驱动程序
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 步进电机驱动器 - `StepperDriver4PWM`

这个类为大多数常见的4路PWM步进电机驱动器提供了一个抽象层。基本上，任何可以使用4路PWM信号运行的步进电机驱动板都可以用这个类来表示。
例如：
- L298N
- MX1508
-  Shield R3直流电机驱动模块
- 等等


<img src="extras/Images/stepper4pwm.png" class="width60">

## 步骤1. 硬件设置
要创建与步进电机驱动器的接口，你需要指定每个电机相的4个`pwm`引脚编号，以及可选的每个相的使能引脚`en1`和`en2`。
```cpp
//  StepperDriver4PWM( int ph1A,int ph1B,int ph2A,int ph2B, int en1 (optional), int en2 (optional))
//  - ph1A, ph1B - phase 1 pwm pins
//  - ph2A, ph2B - phase 2 pwm pins
//  - en1, en2  - enable pins (optional input)
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9, 10, 7,  8);
```

<blockquote class="info"> 📢 这里有一个关于为不同MCU架构选择合适PWM引脚的快速指南 <a href="choosing_pwm_pins">参见文档</a>。</blockquote>

## 步骤 2.1 PWM 配置
```cpp
// pwm frequency to be used [Hz]
// for atmega328 either 4k or 32kHz
// esp32/stm32/teensy configurable
driver.pwm_frequency = 20000;
```

以下是不同微控制器在 Arduino SimpleFOC库中使用的 PWM 频率和分辨率列表。

微控制器 | 默认频率 | 最大频率 | PWM 分辨率 | 中心对齐 | 可配置频率
--- | --- | --- | --- | ---
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | yes (either 4kHz or 32kHz)
STM32 | 50kHz | 100kHz | 14bit | yes | yes
ESP32 | 40kHz | 100kHz | 10bit | yes | yes
Teensy | 50kHz | 100kHz | 8bit | yes | yes

所有这些设置都在库源代码的drivers/hardware_specific/x_mcu.cpp/h中定义。


## 步骤 2.2 电压
驱动类负责设置驱动输出引脚的 pwm 占空比，它需要知道所接入的直流电源电压。
此外，驱动类允许用户设置驱动将输出到引脚的绝对直流电压限制。
```cpp
// power supply voltage [V]
driver.voltage_power_supply = 12;
// Max DC voltage allowed - default voltage_power_supply
driver.voltage_limit = 12;
```

<img src="extras/Images/stepper_limits.png" class="width60">

这个参数也会被StepperMotor类使用。如上图所示，一旦设置了电压限制driver.voltage_limit，它将被传送到StepperMotor类中的 FOC 算法，相电压将以driver.voltage_limit/2为中心。

因此，如果担心电机产生过高电流，这个参数非常重要。在这种情况下，该参数可以用作安全特性。

## 步骤 2.3 初始化
设置好所有必要的配置参数后，调用驱动函数init()。该函数使用配置参数，为驱动代码执行配置所有必要的硬件和软件。
```cpp
// driver init
driver.init();
```

该函数负责：
- 确定并配置用于 PWM 生成的硬件定时器
- 验证所有提供的引脚是否可用于生成 PWM
- 配置 PWM 通道

如果由于某种原因驱动配置失败，该函数将返回0；如果一切顺利，将返回1。因此，我们建议在继续之前检查初始化函数是否执行成功
```cpp
Serial.print("Driver init ");
// init driver
if (driver.init())  Serial.println("success!");
else{
  Serial.println("failed!");
  return;
}
```

### 启用调试输出
如果希望在driver.init()期间看到更详细的驱动配置调试输出，并了解更多关于驱动配置和可能的错误的细节，可以使用SimpleFOCDebug类。
为了启用详细调试模式，确保在driver.init()调用之前启用调试，最好在setup()函数的顶部。
```cpp
Serial.begin(115200); // to output the debug information to the serial
SimpleFOCDebug::enable(&Serial);
```
更多信息参见[SimpleFOCDebug 文档](debugging).


## 步骤 3. 实时使用编码器

步进电机驱动类是为了与SimpleFOC库一起使用而开发的，旨在为StepperMotor类中实现的 FOC 算法提供抽象层。但StepperDriver4PWM类也可以作为独立类使用，并且可以选择使用 步进电机驱动实现任何其他类型的控制算法。

## FOC 算法支持
在 FOC 控制的背景下，所有驱动的使用都由运动控制算法在内部完成，只需将驱动链接到StepperMotor类即可启用。
```cpp
// linking the driver to the motor
motor.linkDriver(&driver)
```

## 独立驱动
如果你希望将 步进电机驱动用作独立设备并围绕它实现自己的逻辑，这很容易做到。以下是一个非常简单的独立应用示例代码。
```cpp
// Stepper driver standalone example
#include <SimpleFOC.h>

// Stepper driver instance
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9,10, 7, 8);

void setup() {
  
  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 20000;
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  
  // driver init
  driver.init();

  // enable driver
  driver.enable();

  _delay(1000);
}

void loop() {
    // setting pwm
    // phase 1: 3V, phase 2: 6V
    driver.setPwm(3,6);
}
```