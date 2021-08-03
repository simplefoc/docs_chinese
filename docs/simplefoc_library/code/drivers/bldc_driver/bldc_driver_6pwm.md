---
layout: default
title: BLDCDriver 6PWM
nav_order: 2
permalink: /bldcdriver6pwm
parent: BLDCDriver
grand_parent: Driver code
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# BLDC driver 6PWM - `BLDCDriver6PWM` （无刷直流电机 6PWM）

这个类提供了一个大多数常见的 6PWM 无刷直流驱动器的抽象层。基本上，任何可以使用 6PWM 信号运行的无刷直流驱动器都可以用这个类来表示。
实例：

- DRV830x  ( 可以在 3pwm 或者 6pwm 模式下运行 )
- ST B-G431B
- X-NUCLEO-IHM08M1
- 等等


<img src="extras/Images/6pwm_driver.png" class="width40">

6 PWM 控制模式为无刷直流电机控制提供了比 3PWM 控制更多的自由，因为每个6半桥式晶体管可以单独控制。

## Step 1. Hardware setup（步骤1. 硬件设置）
要创建接口到无刷直流驱动器，需要为电机的每个阶段和可选的 `enable` 引脚指定 6 `pwm`  引脚编号。

```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
//  - phA_h, phA_l - A phase pwm pin high/low pair 
//  - phB_h, phB_l - B phase pwm pin high/low pair
//  - phB_h, phC_l - C phase pwm pin high/low pair
//  - enable pin    - (optional input)
BLDCDriver6PWM motor = BLDCDriver6PWM(5,6, 9,10, 3,11, 8);
```
<blockquote class="warning">
⚠️ 需要根据硬件进行 PWM 配置，为了使其正常运行，请务必遵守某些准则！
</blockquote>

### Arduino UNO 支持
Arduino UNO 和所有基于 atmega328 的电路板只有6个 pwm 引脚，为了使用 `BLDCDrievr6PWM` ，需要用上所有 pwm 引脚。它们是 `3`,`5`,`6`,`9`,`10` and `11`  
。此外，为了使算法运行正常，需要用到每个相位的每一个高/低侧对，属于同一定时器的 pwm 引脚。 属于计时器的 Atmega328 引脚是：

`TIM0` |`TIM1` |`TIM2` 
--- | --- | ---
`5`,`6` | `9`,`10` |`3`,`11`

重要的是 `phA_h` 和 `phA_l` 属于同一个计时器， `phB_h` 和 `phB_l` 属于第二个计时器， `phC_h` 和 `phC_l` 属于最后一个计时器。如果选择相 `A` 属于计时器 `TIM0` ，可以把 `phA_h` 设置为引脚 `5` 或者引脚 `6` 。

### stm32 支持

Stm32 板子有2种 6pwm 模式：
- 硬件 6pwm 模式
- 软件 6pwm 模式

####  硬件 6pwm 模式
在硬件 6pwm 模式下，用户只使用一个定时器，通常 Timer 1 用于所有的6pwm通道。Stm32 板至少有一个定时器，该定时器具有自动互补通道，避免了复杂的通道反相配置的需要。如果你提供支持该接口的引脚到 `BLDCDriver6PWM` 类的构造器， <span class="simple">Simple<span class="foc">FOC</span>library</span> 会自动启用该控制模式。 例如， stm32 Bluepill 和 stm32 Nucleo 板子都有引脚支持的接口：

 `T1C1` | `T1C2` | `T1C3` | `T1C1N` | `T1C2N` | `T1C3N` 
 --- | --- | ---| ---| ---| ---
 `PA8` | `PA9` | `PA10` | `PB13` | `PB14` | `PB15`  

 `T1Cx` 是 Timer 1 通道， `T1CxN` 是它们的互补通道（反向通道）。每对 `T1Cx` 和 `T1CxN` 用于一对高/低 pwm 引脚。 library 库将配置必要的计时器和寄存器，如果你将这些引脚提供给 `BLDCDriver6PWM` 类的压缩器。例如：
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
BLDCDriver6PWM motor = BLDCDriver6PWM(PA8, PB13, PA9, PB14, PA10, PB15);
```

####  软件 6pwm 模式
如果板子不能使用硬件 6pwm 模式，SimpleFOClibrary 可以使用任何两个通道的任何定时器作为高/低侧 pwm 对。基本上，library 库会在提供的低侧引脚上的互补通道中自动配置。这段代码正常工作的唯一要求与Arudino UNO完全相同，每个相位高/低PWM 对需要属于同一个定时器。例如，以 stm32 Nucleo F401RE 板为例，可以：
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
BLDCDriver6PWM motor = BLDCDriver6PWM(7, 2, 6, 3, 5, 4);
```
其中

 `T1C1` | `T1C3` | `T2C3` | `T2C2` | `T3C1` | `T3C2` 
 --- | --- | ---| ---| ---| ---
 `7` | `2` | `6` | `3` | `5` | `4`  

在 Bluepill 上我们可以：
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
BLDCDriver6PWM motor = BLDCDriver6PWM(PA8, PA9, PB6, PB7, PB8, PB9);
```
其中

 `T1C1` | `T1C2` | `T4C1` | `T4C2` | `T4C3` | `T4C4` 
 --- | --- | ---| ---| ---| ---
 `PA8` | `PA9` | `PB6` | `PB7` | `PB8` | `PB9`  

### esp32 支持
Esp32 板卡支持用于此类应用 `MCPWM` 接口。每个 ep32 板有两个 `MCPWM` 通道能支持两个 6PWM 驱动器。esp32 对引脚没有特殊要求，每个引脚可用于 PWM 模式。但是请确保不要在开机时使用预定义状态的引脚，因为这可能导致故障。你可以很容易地在网上找到这些信息，更多的细节在这个 [YouTube 视频](https://www.youtube.com/watch?v=c0tMGlJVmkw) 里。

## Step 2.1 PWM Configuration
```cpp
// pwm frequency to be used [Hz]
// for atmega328 fixed to 32kHz
// esp32/stm32/teensy configurable
driver.pwm_frequency = 50000;
```
<blockquote class="warning">
⚠️ 基于 ATMega328 芯片的 Arduino 设备的固定 pwm 频率为 32kHz。
</blockquote>

下面是  Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中使用不同微控制器及其PWM频率和分辨率的列表。

MCU | default frequency（默认频率） | MAX frequency（最大频率） | PWM resolution（分辨率） | Center-aligned（中心对齐） | Configurable freq（可配置的频率） 
--- | --- | --- | --- | --- | --- 
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | no
STM32 | 50kHz | 100kHz | 14bit | yes | yes
ESP32 | 40kHz | 100kHz | 10bit | yes | yes
Teensy | 50kHz | 100kHz | 8bit | yes | yes

这些设置都在 library 库的源文件的 `drivers/hardware_specific/x_mcu.cpp/h` 中定义。 


## Step 2.2 Dead zone (dead time) （步骤2.2 死区（死区时间））


<img src="extras/Images/dead_zone.png" class="width30">

```cpp
// dead_zone [0,1] - default 0.02 - 2%
driver.dead_zone = 0.05;
```
死区参数定义为在改变有源场效应晶体管之间保留的占空比。每一次高/低侧都失活，低/高侧被激活，一半 `dead_zone` 被注入。此参数相当于死区时间，死区时间可计算为：
```cpp
dead_time = 1/pwm_frequency*dead_zone
```

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

## Step 3. Using  `BLDCDriver6PWM` in real-time

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
BLDCDriver6PWM driver = BLDCDriver6PWM(5, 6, 9,10, 3, 11, 8);

void setup() {
  
  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 50000;
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  // daad_zone [0,1] - default 0.02 - 2%
  driver.dead_zone = 0.05;

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