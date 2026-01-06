---
layout: default
title: 2路PWM步进驱动器
nav_order: 2
permalink: /stepper_driver_2pwm
parent: 步进驱动程序配置
grand_parent: 驱动程序
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 步进电机驱动器 - `StepperDriver2PWM`

这个类为大多数常见的2PWM步进电机驱动器提供了一个抽象层。基本上，任何可以使用2PWM信号运行的步进电机驱动板都可以用这个类来表示。
示例：
- [基于L289P的 shield](https://github.com/Luen/Arduino-Motor-Shield-29250)
- [MD1.3步进电机驱动器](https://wiki.dfrobot.com/MD1.3_2A_Dual_Motor_Controller_SKU_DRI0002)
- [基于VNH2SP30的板卡](https://www.ebay.com/itm/Dual-VNH2SP30-Stepper-Motor-Driver-Module-30A-Monster-Moto-Shield-Replace-L298N/401089386943?hash=item5d62ca59bf:g:NA8AAOSw44BYEvxS)
- 等等

有两种常见的`2 PWM`步进电机驱动器架构
- 每相一个方向引脚（`dirx`）
- 每相两个方向引脚（`phxa`和`phxb`）

每相只有一个方向引脚的步进电机驱动器在驱动器内部集成了反转硬件，可同时反转PWM信号和方向引脚。这类驱动器非常常见，因为它们旨在通过简单的PWM/方向接口运行直流电机。基本上，要运行步进电机，你需要组合两个这样的驱动器。
<img src="extras/Images/stepper_2pwm_one_dir.png" class="width100">

每相有两个方向引脚的步进电机驱动器的内部反转硬件仅针对PWM输入，而不针对方向输入。因此，需要在外部通过软件完成这些反转。你可以想象，`StepperDriver2PWM`类模拟了上面所示的单方向引脚驱动器中可用的硬件电路。
<img src="extras/Images/stepper_2pwm_two_dir.png" class="width100">

## 步骤1. 硬件设置
要创建与步进电机驱动器的接口，你需要指定2个`PWM`引脚号，每个对应电机的一相。此外，你可以选择为每相指定两个方向引脚或仅一个。最后，你可以为每相添加一个可选的`使能`引脚`en1`和`en2`。


对于每相两个方向引脚，使用以下构造函数：
```cpp
// pwm1  PWM1 phase pwm pin
// in1   IN1A phase dir pins
// pwm2  PWM2 phase pwm pin
// in2   IN2A phase dir pins
// en1 enable pin phase 1 (optional input)
// en2 enable pin phase 2 (optional input)
// StepperDriver2PWM(int pwm1, int* in1, int pwm2, int* in2, int en1 = NOT_SET, int en2 = NOT_SET);
StepperDriver2PWM driver = StepperDriver2PWM(3, {4,5}, 10, {9,8}, 11, 12);
```

对于每相仅一个方向引脚，使用以下构造函数：
```cpp
//  StepperDriver2PWM( int pwm1,int dir1,int pwm2,int dir2, int en1 (optional), int en2 (optional))
//  - pwm1      - phase 1 pwm pin
//  - dir1      - phase 1 direction pin
//  - pwm2      - phase 2 pwm pin
//  - dir2      - phase 2 direction pin
//  - en1, en2  - enable pins (optional input)
StepperDriver2PWM driver = StepperDriver2PWM(3, 4, 5, 6, 11, 12);
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

MCU | 默认频率 | 最大频率 | PWM 分辨率 | 中心对齐 | 可配置频率
--- | --- | --- | --- | ---
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | yes (either 4kHz or 32kHz)
STM32 | 50kHz | 100kHz | 14bit | yes | yes
ESP32 | 40kHz | 100kHz | 10bit | yes | yes
Teensy | 50kHz | 100kHz | 8bit | yes | yes

所有这些设置都定义在库源文件的drivers/hardware_specific/x/x_mcu.cpp/h中。


## 步骤 2.2 电压
驱动类负责将 PWM 占空比设置到驱动器输出引脚，它需要知道所接入的直流电源电压。
此外，驱动类允许用户设置驱动器将输出到引脚的绝对直流电压限制。
```cpp
// power supply voltage [V]
driver.voltage_power_supply = 12;
// Max DC voltage allowed - default voltage_power_supply
driver.voltage_limit = 12;
```

<img src="extras/Images/stepper_limits.png" class="width60">

这个参数也会被StepperMotor类使用。如上图所示，一旦设置了电压限制driver.voltage_limit，它将被传达给StepperMotor类中的 FOC 算法，相电压将以driver.voltage_limit/2为中心。

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

如果由于某种原因驱动配置失败，该函数将返回0；如果一切顺利，将返回1。因此，我们建议你在继续之前检查初始化函数是否成功执行
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
如果你希望在driver.init()期间看到更详细的驱动配置调试输出，并了解更多关于驱动配置和可能的错误的细节，可以使用SimpleFOCDebug类。
为了启用详细调试模式，请确保在driver.init()调用之前启用调试，最好在setup()函数的顶部。
```cpp
Serial.begin(115200); // to output the debug information to the serial
SimpleFOCDebug::enable(&Serial);
```
更多内容参见[SimpleFOCDebug 文档](debugging).


## 步骤 3. 实时使用编码器

步进电机 驱动类是为了与SimpleFOC库一起使用而开发的，旨在为StepperMotor类中实现的 FOC 算法提供抽象层。但是StepperDriver2PWM类也可以作为独立类使用，并且可以选择使用 步进电机 驱动实现任何其他类型的控制算法。

## FOC 算法支持
在 FOC 控制的背景下，所有驱动的使用都由运动控制算法在内部完成，只需将驱动链接到StepperMotor类即可启用。

```cpp
// linking the driver to the motor
motor.linkDriver(&driver)
```

## 独立驱动
如果你希望将 步进电机 驱动用作独立设备并围绕它实现自己的逻辑，这很容易做到。以下是一个非常简单的独立应用示例代码。
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