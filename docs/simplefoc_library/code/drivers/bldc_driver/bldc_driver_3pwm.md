---
layout: default
title: 3路PWM无刷直流电机
nav_order: 1
permalink: /bldcdriver3pwm
parent: 无刷直流驱动器配置
grand_parent: 驱动器
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>


---

#   3路PWM无刷直流电机- `BLDCDriver3PWM`

该类提供了一个大多数常见的 3路PWM 无刷直流驱动器的抽象层。基本上所有用 3路PWM 信号运行的无刷直流驱动器都可以用这个类。
比如：

- Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
- Arduino <span class="simple">Simple<span class="foc">FOC</span> <span class="power">Power</span>Shield</span>
- L6234 转接板
- HMBGC v2.2
- DRV830x ( 可以在 3pwm 或者 6pwm 模式下运行 )
- X-NUCLEO-IHM07M1
- 等等

<img src="extras/Images/3pwm_driver.png" class="width40">

## 步骤1. 硬件设置
创建BLDC驱动器的接口，需要为电机的每个相分别指定一个PWM引脚，同时指定使能引脚（可选）

```cpp
//  BLDCDriver3PWM( int phA, int phB, int phC, int en)
//  - phA, phB, phC - A相、B相、C相PWM引脚
//  - enable pin    - （可选输入）
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

此外，这个无刷电机的` Driver` 类给每个相提供使能信号（有需要的话）。然后 <span class="simple">Simple<span class="foc">FOC</span>library</span> 可以控制每个使能引脚的启用/禁用状态。如果用的是 `Trapezoidal_120` 或 `Trapezoidal_150` 调制方式，<span class="simple">Simple<span class="foc">FOC</span>library</span> 能够将相位设置为适用于反电动势控制的高阻态。加上使能引脚的设置如下：
```cpp
//  BLDCDriver3PWM( int phA, int phB, int phC, int enA, int enB, int enC )
//  - phA, phB, phC - A相、B相、C相PWM引脚
//  - enA, enB, enC - 每个相的使能引脚（可选的）
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8, 7, 6);
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


下面是  Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中使用的不同单片机及其PWM频率和分辨率表。

MCU | default frequency（默认频率） | MAX frequency（最大频率） | PWM resolution（分辨率） | Center-aligned（中心对齐） | Configurable freq（可配置的频率） 
--- | --- | --- | --- | --- | --- 
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | no
STM32 | 50kHz | 100kHz | 14bit | yes | yes
ESP32 | 40kHz | 100kHz | 10bit | yes | yes
Teensy | 50kHz | 100kHz | 8bit | yes | yes

这些设置都在 library 库的源文件的 `drivers/hardware_specific/x_mcu.cpp/h` 中定义。


## 步骤2.2 电压
` Driver` 类可以设置输出引脚的 pwm 占空比，而这需要知道输入的电源电压值。此外，通过` Driver` 类可以设置驱动器输出引脚的限压 。

```cpp
// 电源电压 [V]
driver.voltage_power_supply = 12;
// 允许最大直流电压 - 默认为电源电压
driver.voltage_limit = 12;
```

<img src="extras/Images/limits.png" class="width60">

 `BLDCMotor` 类也会使用限压参数。 如上图所示当设置了限压 `driver.voltage_limit` 时，它会送入`BLDCMotor` 类的FOC算法中，输出的相位电压大约是  `driver.voltage_limit/2`。

因此，这个参数对防止电机的电流过来说非常重要。在这种情况下，该参数可以视作一种安全特性。

## 步骤 2.3 初始化
当必要的配置参数都设置好了，则调用驱动器函数 `init()` 。该函数根据所设置的参数配置驱动器代码初始化所需的所有硬件和软件。
```cpp
// 初始化驱动器
driver.init();
```

## 步骤 3. 实时使用 `BLDCDriver3PWM`

无刷电机的` Driver` 类是和 <span class="simple">Simple<span class="foc">FOC</span>library</span> 一起开发的，也为 FOC 算法中实现的  `BLDCMotor`  类提供抽象层。当然 `BLDCDriver3PWM` 类可以作为一个独立的类使用，并且可以选择作为一个BLDC驱动器实现任何其他类型的控制算法。

## FOC 算法支持
在 FOC 控制下，驱动器的使用是由运动控制算法内部完成的，只需将驱动器连接到  `BLDCMotor` 类。
```cpp
// 连接驱动器和电机
motor.linkDriver(&driver)
```

## 独立驱动器
想让BLDC驱动器作为独立部分并应用于你自己的驱动算法也很容易。下面是一个非常简单的实例代码。

```cpp
// 无刷直流电机驱动器独立实例
#include <SimpleFOC.h>

// 无刷直流电机驱动器实例
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

void setup() {
  
  // PWM 频率 [Hz]
  driver.pwm_frequency = 50000;
 // 电源电压 [V]
  driver.voltage_power_supply = 12;
 // 最大允许直流电压 - 默认为电源电压
  driver.voltage_limit = 12;

  // 初始化驱动器
  driver.init();

  // 启用驱动器
  driver.enable();

  _delay(1000);
}

void loop() {
    // 设置 PWM
    // A相：3V，B相：6V，C相：5V
    driver.setPwm(3,6,5);
}
```

下面是带三个使能引脚（每相一个）的无刷直流驱动器的实例。该代码在同一时刻会将一个相设置为高阻抗模式，并将其余的两相设定在3V和6V。
```cpp
// 无刷直流电机驱动器独立实例
#include <SimpleFOC.h>

// 无刷直流电机驱动器实例
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8, 7, 6);

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
    // 相位（A：3V，B：6V，C：高阻抗模式）
    // 设置C相为高阻抗模式 - 禁用/启用
    driver.setPhaseState(_ACTIVE , _ACTIVE , _HIGH_Z); // _HIGH_Z or _HIGH_IMPEDANCE
    driver.setPwm(3, 6, 0); 
    _delay(1000);

    // 相位（A：3V，B：高阻抗模式，C：6V）
    // 设置B相为高阻抗模式 - 禁用/启用
    driver.setPhaseState(_ACTIVE , _HIGH_IMPEDANCE, _ACTIVE);
    driver.setPwm(3, 0, 6);
    _delay(1000);

    // 相位（A：高阻抗模式，B：3V，C：6V） 
    // 设置A相为高阻抗模式 - 禁用/启用
    driver.setPhaseState(_HIGH_IMPEDANCE, _ACTIVE, _ACTIVE);
    driver.setPwm(0, 3, 6);
    _delay(1000);
}
```