---
layout: default
title: 6路PWM无刷直流电机
nav_order: 2
permalink: /bldcdriver6pwm
parent: 无刷直流驱动器配置
grand_parent: 驱动器
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>

---

#  6路PWM无刷直流电机 - `BLDCDriver6PWM` 

该类提供了一个大多数常见的6路PWM 无刷直流驱动器的抽象层。基本上所有用6路PWM 信号运行的无刷直流驱动器都可以用这个类。
比如：

- DRV830x  ( 可以在 3pwm 或者 6pwm 模式下运行 )
- ST B-G431B
- X-NUCLEO-IHM08M1
- 等等


<img src="extras/Images/6pwm_driver.png" class="width40">

在BLDC电机控制上，6路PWM 控制模式比3路PWM更自由，因为6个半桥式晶体管的每一个都可以单独控制。

## 步骤1. 硬件设置
要创建接口到无刷直流驱动器，需要为电机的每个相分别指定两个PWM引脚

```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
//  - phA_h, phA_l - A相pwm引脚 高/低副 
//  - phB_h, phB_l - B相pwm引脚 高/低副 
//  - phB_h, phC_l - C相pwm引脚 高/低副
//  - enable pin    - （可选输入）
BLDCDriver6PWM motor = BLDCDriver6PWM(5,6, 9,10, 3,11, 8);
```
<blockquote class="warning">
⚠️ 需要根据硬件进行 PWM 配置，为了使其正常运行，请务必遵守某些准则！
</blockquote>

### Arduino UNO 支持
Arduino UNO 和所有基于 atmega328 的电路板只有6个PWM引脚。所以为了使用 `BLDCDrievr6PWM` ，就要用上所有PWM引脚，分别是 `3`,`5`,`6`,`9`,`10` and `11`  。此外，为了算法运行正常，要求每个相的高/低侧一对PWM引脚用同一个定时器，因此，Atmega328中每对PWM引脚的定时器分配如下：

`TIM0` |`TIM1` |`TIM2` 
--- | --- | ---
`5`,`6` | `9`,`10` |`3`,`11`

即 `phA_h` 和 `phA_l` 用的是同一个计时器， `phB_h` 和 `phB_l` 用的是第二个计时器， `phC_h` 和 `phC_l` 用的是最后一个计时器。如果选择相 `A` 用计时器 `TIM0` ，可以把 `phA_h` 设置为引脚 `5` 或者引脚 `6` 。

### stm32 支持

Stm32 板子有2种 6pwm 模式：
- 硬件 6pwm 模式
- 软件 6pwm 模式

####  硬件 6pwm 模式
在硬件 6pwm 模式下，只需一个定时器，通常是Timer 1 用于所有的6pwm通道。Stm32 板至少有一个定时器，该定时器具有自动互补通道，避免了复杂的通道反相配置的需要。如果你在 `BLDCDriver6PWM` 类的构造器中配置的是支持硬件PWM的引脚， <span class="simple">Simple<span class="foc">FOC</span>library</span> 会自动启用该控制模式。 例如， stm32 Bluepill 和 stm32 Nucleo 板子都有引脚支持的接口：

 `T1C1` | `T1C2` | `T1C3` | `T1C1N` | `T1C2N` | `T1C3N` 
 --- | --- | ---| ---| ---| ---
 `PA8` | `PA9` | `PA10` | `PB13` | `PB14` | `PB15`  

 `T1Cx` 是 Timer 1 通道， `T1CxN` 是它们的互补通道（反向通道）。每对 `T1Cx` 和 `T1CxN` 用于一对高/低侧PWM引脚。 如果你在 `BLDCDriver6PWM` 类的转换器中配置上面的引脚，<span class="simple">Simple<span class="foc">FOC</span>library</span> 会自动配置必要的计时器和寄存器。例如：
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
BLDCDriver6PWM motor = BLDCDriver6PWM(PA8, PB13, PA9, PB14, PA10, PB15);
```

####  软件 6pwm 模式
如果板子不能使用硬件 6pwm 模式，SimpleFOClibrary 可以使用任何两个通道的任何定时器作为高/低侧PWM对。基本上，SimpleFOClibrary 会在提供的低侧引脚上的互补通道中自动配置。这段代码正常工作的唯一要求与Arudino UNO完全相同，每个相位高/低PWM 对需要属于同一个定时器。例如，以 stm32 Nucleo F401RE 板为例，可以：
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
Esp32 的`MCPWM` 支持用于此类应用。每个 ep32 板有两个 `MCPWM` 通道能支持两个 6PWM 驱动器。esp32 对引脚没有特殊要求，每个引脚可用于 PWM 模式。但是请确保不要在开机会用的预定义状态引脚，因为这可能导致故障。你可以很容易地在网上找到这些信息，更多的细节在这个 [YouTube 视频](https://www.youtube.com/watch?v=c0tMGlJVmkw) 里。

## 步骤 2.1 PWM 配置
```cpp
// PWM 频率 [Hz]
// atmega328 的频率固定为 32kHz
// esp32/stm32/teensy 配置
driver.pwm_frequency = 50000;
```
<blockquote class="warning">
⚠️ 基于 ATMega328 芯片的 Arduino 设备的 pwm 频率固定为 32kHz。
</blockquote>


下面是  Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中使用不同微控制器及其PWM频率和分辨率的列表。

MCU | default frequency（默认频率） | MAX frequency（最大频率） | PWM resolution（分辨率） | Center-aligned（中心对齐） | Configurable freq（可配置的频率） 
--- | --- | --- | --- | --- | --- 
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | no
STM32 | 50kHz | 100kHz | 14bit | yes | yes
ESP32 | 40kHz | 100kHz | 10bit | yes | yes
Teensy | 50kHz | 100kHz | 8bit | yes | yes

这些设置都在 library 库的源文件的 `drivers/hardware_specific/x_mcu.cpp/h` 中定义。 


## 步骤2.2 死区（死区时间）


<img src="extras/Images/dead_zone.png" class="width30">

```cpp
// daad_zone [0,1] - 默认为0.02，即2%
driver.dead_zone = 0.05;
```
死区参数定义为在改变有源场效应晶体管之间保留的占空比。即在每次高/低侧PWM关断后，低/高侧PWM打开前，将插入 `dead_zone` 的1/2。此参数相当于死区时间，死区时间可计算为：
```cpp
dead_time = 1/pwm_frequency*dead_zone
```

## 步骤2.2 电压
` Driver` 类可以设置输出引脚的PWM占空比，而这需要知道输入的电源电压值。此外，通过` Driver` 类可以设置驱动器输出引脚的限压 。

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
// 驱动器初始化
driver.init();
```

## 步骤3. 实时使用`BLDCDriver6PWM`

无刷电机的` Driver` 类是和 <span class="simple">Simple<span class="foc">FOC</span>library</span> 一起开发的，也为 FOC 算法中实现的  `BLDCMotor`  类提供抽象层。当然 `BLDCDriver6PWM` 类可以作为一个独立的类使用，并且可以选择作为一个BLDC驱动器实现任何其他类型的控制算法。

## FOC 算法支持
在 FOC 控制下，驱动器的使用是由运动控制算法内部完成的，只需将驱动器连接到  `BLDCMotor` 类。
```cpp
// 连接驱动器和电机
motor.linkDriver(&driver)
```

## 独立的驱动器
如果使用 bldc 驱动器作为一个独立的设备，实现操作是很容易的。下面是一个非常简单的应用程序的实例代码。
```cpp
// 无刷直流电机驱动器独立实例
#include <SimpleFOC.h>

// 无刷直流电机驱动器实例
BLDCDriver6PWM driver = BLDCDriver6PWM(5, 6, 9,10, 3, 11, 8);

void setup() {
  
  // PWM 频率 [Hz]
  driver.pwm_frequency = 50000;
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  // 允许最大直流电压 - 默认为电源电压
  driver.voltage_limit = 12;
  // daad_zone [0,1] - 默认为0.02，即2%
  driver.dead_zone = 0.05;

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