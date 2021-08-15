---
layout: default
title: Stepper Driver 2PWM
nav_order: 2
permalink: /stepper_driver_2pwm
parent: StepperDriver
grand_parent: Driver code
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 2路PWM步进驱动器`StepperDriver2PWM`

这个类提供了一个常见的 2PWM 步进驱动器的抽象层。基本上，任何可以使用 2路PWM 信号运行的步进驱动器都可以用这个来表示。
实例：

- [L289P-based shield](https://github.com/Luen/Arduino-Motor-Shield-29250)
- [MD1.3 stepper driver](https://wiki.dfrobot.com/MD1.3_2A_Dual_Motor_Controller_SKU_DRI0002)
- [VNH2SP30 based boards](https://www.ebay.com/itm/Dual-VNH2SP30-Stepper-Motor-Driver-Module-30A-Monster-Moto-Shield-Replace-L298N/401089386943?hash=item5d62ca59bf:g:NA8AAOSw44BYEvxS)
- 等等

 `2PWM` 步进驱动有两种常见的结构
- 每个相位有一个方向引脚 (`dirx`)
- 每个相位有两个方向引脚 (`phxa` & `phxb`)

每个相位只有一个方向引脚的步进驱动器，它本身集成了逆变硬件，可以对 PWM 信号和方向引脚进行逆变。这类驱动器非常普遍，用一个简单的 pwm 方向接口运行直流电机即可。

基本上，运行一个步进电机，需要结合两个驱动器。
<img src="extras/Images/stepper_2pwm_one_dir.png" class="width100">

每个相位有两个方向引脚的步进驱动器，内部的逆变硬件只用于PWM输入，而不用于方向输入。因此逆序在外部软件中完成。可以想象， `StepperDriver2PWM` 类在上图驱动器的一个方向引脚模拟硬件电路。  
<img src="extras/Images/stepper_2pwm_two_dir.png" class="width100">

## 步骤1. 硬件设置）
要创建接口到步进驱动器，需要为电机的每个阶段指定 2个 `pwm`  引脚编号。除此之外，可以选择每个相或者一个相来指定两个方向引脚。最后，可以为每个相 `en1` 和 `en2` 添加可选的 `enable` 引脚。


每个相有两个方向引脚，使用构造函数：
```cpp
//  StepperDriver4PWM( int pwm1, int ph1A,int ph1B,int pwm2, int ph2A,int ph2B, int en1 (optional), int en2 (optional))
//  - pwm1       - phase 1 pwm pin
//  - ph1A, ph1B - phase 1 direction pins
//  - pwm2       - phase 2 pwm pin
//  - ph2A, ph2B - phase 2 direction pins
//  - en1, en2  - enable pins (optional input)
StepperDriver2PWM driver = StepperDriver2PWM(3, 4, 5, 10 , 9 , 8 , 11, 12);
```
每个相有一个方向引脚，使用构造函数：
```cpp
//  StepperDriver2PWM( int pwm1,int dir1,int pwm2,int dir2, int en1 (optional), int en2 (optional))
//  - pwm1      - phase 1 pwm pin
//  - dir1      - phase 1 direction pin
//  - pwm2      - phase 2 pwm pin
//  - dir2      - phase 2 direction pin
//  - en1, en2  - enable pins (optional input)
StepperDriver2PWM driver = StepperDriver2PWM(3, 4, 5, 6, 11, 12);
```

## 步骤2.1 PWM 配置
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


## 步骤2.2 电压
驱动器类（Driver class）可以为驱动器输出引脚设置 pwm 占空比，需要知道它插接的直流电源电压。此外，用户能通过驱动器类（Driver class）设置驱动器输出引脚的绝对直流限压 。
```cpp
// power supply voltage [V]
driver.voltage_power_supply = 12;
// Max DC voltage allowed - default voltage_power_supply
driver.voltage_limit = 12;
```

<img src="extras/Images/stepper_limits.png" class="width60">

 `StepperMotor` 类也使用这个参数。 如图所示当限压 `driver.voltage_limit` 设置了，它会和 FOC 算法中的 `StepperMotor` 类通信，相位电压大约是  `driver.voltage_limit/2`。

因此，如果担心电机产生的电流过大，这个参数是非常重要的。在这种情况下，该参数可以当作安全特性来使用。

## 步骤2.3 初始化
当必要的配置参数都设置好了，就会调用驱动器函数 `init()` 。该函数使用配置参数，并配置驱动器代码执行所需的所有硬件和软件。
```cpp
// driver init
driver.init();
```

## 步骤3. 实时使用编码器

BLDC 驱动器类（BLDC driver class）是与 <span class="simple">Simple<span class="foc">FOC</span>library</span> 一起开发的，为 FOC 算法中实现的  `StepperMotor` 类提供抽象层。但是 `StepperDriver4PWM`类可以作为一个独立的类使用，以及使用无刷直流驱动器可以实现任何其他类型的控制算法。

## 支持FOC 算法
在 FOC 控制下，驱动器的使用是由运动控制算法内部完成的，只需将驱动器连接到  `StepperMotor` 类。

```cpp
// linking the driver to the motor
motor.linkDriver(&driver)
```

## 独立的驱动器
如果使用 bldc 驱动器作为一个独立的设备，实现操作是很容易的。下面是一个非常简单的应用程序的实例代码。
```cpp
// Stepper driver standalone example
#include <SimpleFOC.h>


// Stepper driver instance
// StepperDriver2PWM(pwm1, in1a, in1b, pwm2, in2a, in2b, (en1, en2 optional))
StepperDriver2PWM driver = StepperDriver2PWM(3, 4, 5, 10 , 9 , 8 , 11, 12);

// StepperDriver2PWM(pwm1, dir1, pwm2, dir2,(en1, en2 optional))
// StepperDriver2PWM driver = StepperDriver2PWM(3, 4, 5, 6, 11, 12);

void setup() {
  
  // pwm frequency to be used [Hz]
  // for atmega328 fixed to 32kHz
  // esp32/stm32/teensy configurable
  driver.pwm_frequency = 30000;
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
    // phase A: 3V
    // phase B: 6V
    driver.setPwm(3,6);
}
```