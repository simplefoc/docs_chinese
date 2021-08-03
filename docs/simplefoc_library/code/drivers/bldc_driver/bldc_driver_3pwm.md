---
layout: default
title: BLDCDriver 3PWM
nav_order: 1
permalink: /bldcdriver3pwm
parent: BLDCDriver
grand_parent: Driver code
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# BLDC driver 3PWM - `BLDCDriver3PWM`（无刷直流电机 3PWM）

这个类提供了一个大多数常见的 3PWM 无刷直流驱动器的抽象层。基本上，任何可以使用 3PWM 信号运行的无刷直流驱动器都可以用这个类来表示。
实例：

- Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
- Arduino <span class="simple">Simple<span class="foc">FOC</span> <span class="power">Power</span>Shield</span>
- L6234 转接板
- HMBGC v2.2
- DRV830x ( 可以在 3pwm 或者 6pwm 模式下运行 )
- X-NUCLEO-IHM07M1
- 等等

<img src="extras/Images/3pwm_driver.png" class="width40">

## Step 1. Hardware setup（步骤1. 硬件设置）
要创建接口到无刷直流驱动器，需要为电机的每个阶段和可选的 `enable` 引脚指定 3 `pwm`  引脚编号。

```cpp
//  BLDCDriver3PWM( int phA, int phB, int phC, int en)
//  - phA, phB, phC - A,B,C phase pwm pins
//  - enable pin    - (optional input)
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

此外，这个无刷电机驱动类（bldc driver class）允许用户为每个阶段提供使能信号（如果可行的话）。然后 <span class="simple">Simple<span class="foc">FOC</span>library</span> 为每个使能引脚处理启用/禁用调用。如果使用调制方式 `Trapezoidal_120` 或 `Trapezoidal_150` 使用这些引脚，library 库可以设置高阻抗电机相位，这非常适用于反电动势（Back-EMF control）控制，例如：
```cpp
//  BLDCDriver3PWM( int phA, int phB, int phC, int enA, int enB, int enC )
//  - phA, phB, phC - A,B,C phase pwm pins
//  - enA, enB, enC - enable pin for each phase (optional)
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8, 7, 6);
```

## Step 2.1 PWM Configuration（步骤2.1 PWM 配置）
```cpp
// pwm frequency to be used [Hz]
// for atmega328 fixed to 32kHz
// esp32/stm32/teensy configurable
driver.pwm_frequency = 50000;
```
<blockquote class="warning">
⚠️ 基于 ATMega328 芯片的 Arduino  设备固定的 pwm 频率为 32kHz。
</blockquote>

下面是  Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中使用的不同微控制器及其PWM频率和分辨率的列表。

MCU | default frequency（默认频率） | MAX frequency（最大频率） | PWM resolution（分辨率） | Center-aligned（中心对齐） | Configurable freq（可配置的频率） 
--- | --- | --- | --- | --- | --- 
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | no
STM32 | 50kHz | 100kHz | 14bit | yes | yes
ESP32 | 40kHz | 100kHz | 10bit | yes | yes
Teensy | 50kHz | 100kHz | 8bit | yes | yes

这些设置都在 library 库的源文件的 `drivers/hardware_specific/x_mcu.cpp/h` 中定义。


## Step 2.2 Voltages（步骤2.2 电压）
驱动器类（Driver class）可以为驱动器输出引脚设置 pwm 占空比，需要知道它插接的直流电源电压。此外，用户能通过驱动器类（Driver class）设置驱动器输出引脚的绝对直流限压 。
```cpp
// power supply voltage [V]
driver.voltage_power_supply = 12;
// Max DC voltage allowed - default voltage_power_supply
driver.voltage_limit = 12;
```

<img src="extras/Images/limits.png" class="width60">

 `BLDCMotor` 类也使用这个参数。 如图所示当限压 `driver.voltage_limit` 设置了，它会和 FOC 算法中的 `BLDCMotor` 类通信，相位电压大约是  `driver.voltage_limit/2`。

因此，如果担心电机产生的电流过大，这个参数是非常重要的。在这种情况下，该参数可以当作安全特性来使用。

## Step 2.3 Initialisation（初始化）
当必要的配置参数都设置好了，就会调用驱动器函数 `init()` 。该函数使用配置参数，并配置驱动器代码执行所需的所有硬件和软件。
```cpp
// driver init
driver.init();
```

## Step 3. Using `BLDCDriver3PWM` in real-time（实时使用 `BLDCDriver3PWM`）

BLDC 驱动器类（BLDC driver class）是与 <span class="simple">Simple<span class="foc">FOC</span>library</span> 一起开发的，为 FOC 算法中实现的  `BLDCMotor`  类提供抽象层。但是 `BLDCDriver3PWM` 类可以作为一个独立的类使用，以及使用无刷直流驱动器可以实现任何其他类型的控制算法。

## FOC algorithm support（FOC 算法支持）
在 FOC 控制下，驱动器的使用是由运动控制算法内部完成的，只需将驱动器连接到  `BLDCMotor` 类。
```cpp
// linking the driver to the motor
motor.linkDriver(&driver)
```

## Standalone driver （独立的驱动器）
如果使用 bldc 驱动器作为一个独立的设备，实现操作是很容易的。下面是一个非常简单的应用程序的实例代码。
```cpp
// BLDC driver standalone example
#include <SimpleFOC.h>

// BLDC driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

void setup() {
  
  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 50000;
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
    // phase A: 3V, phase B: 6V, phase C: 5V
    driver.setPwm(3,6,5);
}
```

带有三个使能引脚（每个相一个）的无刷直流驱动器的实例代码。该代码会在同一时刻将一个相位设置为高阻抗模式，双关3和6伏的其余两个。在剩下的两个相位上双关3和6伏。
```cpp
// BLDC driver standalone example
#include <SimpleFOC.h>

// BLDC driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8, 7, 6);

void setup() {
  
  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 50000;
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
    // phase (A: 3V, B: 6V, C: high impedance )  
    // set the phase C in high impedance mode - disabled or open
    driver.setPhaseState(_ACTIVE , _ACTIVE , _HIGH_Z); // _HIGH_Z or _HIGH_IMPEDANCE
    driver.setPwm(3, 6, 0); 
    _delay(1000);

    // phase (A: 3V, B: high impedance, C: 6V )  
    // set the phase B in high impedance mode - disabled or open
    driver.setPhaseState(_ACTIVE , _HIGH_IMPEDANCE, _ACTIVE);
    driver.setPwm(3, 0, 6);
    _delay(1000);

    // phase (A: high impedance, B: 3V, C: 6V )  
    // set the phase A in high impedance mode - disabled or open
    driver.setPhaseState(_HIGH_IMPEDANCE, _ACTIVE, _ACTIVE);
    driver.setPwm(0, 3, 6);
    _delay(1000);
}
```