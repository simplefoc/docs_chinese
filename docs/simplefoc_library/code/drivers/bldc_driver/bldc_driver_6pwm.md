---
layout: default
title: 6路PWM无刷直流电机
nav_order: 2
permalink: /bldcdriver6pwm
parent: 无刷直流驱动器配置
grand_parent: 驱动程序
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


#  BLDC 驱动器 6PWM - `BLDCDriver6PWM`

这个类为大多数常见的 6 PWM BLDC 驱动器提供了一个抽象层。基本上，任何可以使用 6 个 PWM 信号运行的 BLDC 驱动板都可以用这个类来表示。
例如：
- DRV830x（可以在 3 PWM 或 6 PWM 模式下运行）
- ST B-G431B
- X-NUCLEO-IHM08M1
- ODrive 3.6
- 等等

<a href="javascript:show('bldc','motor');" class="btn btn-bldc btn-motor btn-primary">BLDCMotor</a> 
<a href="javascript:show('stepper','motor');" class="btn btn-stepper btn-motor">HybridStepperMotor</a> 

<div class="motor motor-bldc"  markdown="1">
<img src="extras/Images/6pwm_driver.png" class="width40">
</div>

<div class="motor motor-stepper hide"  markdown="1">
<img src="extras/Images/hybrid_6pwm.jpg" class="width40">


<blockquote class="warning" markdown="1">
⚠️ **注意：** 当将 3PWM BLDC 驱动器与步进电机一起使用时，确保公共相 `Uo` 连接到驱动器的 C 相引脚。
</blockquote>

</div>

6 PWM 控制模式比 3PWM 控制模式为 BLDC 电机控制提供了更多的自由度，因为 6 个半桥 MOSFET 中的每一个都可以单独控制。

## 步骤 1. 硬件设置
要创建与 BLDC 驱动器的接口，你需要指定每个电机相的 6 个 `PWM` 引脚编号，以及可选的 `使能` 引脚。
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
//  - phA_h, phA_l - A phase pwm pin high/low pair 
//  - phB_h, phB_l - B phase pwm pin high/low pair
//  - phB_h, phC_l - C phase pwm pin high/low pair
//  - enable pin    - (optional input)
BLDCDriver6PWM driver = BLDCDriver6PWM(5,6, 9,10, 3,11, 8);
```
<blockquote class="warning">
⚠️ 6 PWM 配置非常依赖硬件，请确保遵守某些准则以使其正常工作！
</blockquote>

<blockquote class="info"> 📢 这里有一个为不同 MCU 架构选择合适 PWM 引脚的快速指南 <a href="choosing_pwm_pins">参见文档</a>。</blockquote>


<blockquote class="warning" markdown="1">
<p class="heading">⚠️ <b>注意：</b> 当将 6PWM BLDC 驱动器与步进电机一起使用时，确保公共相 `Uo` 连接到驱动器的 C 相引脚。</p>

即使公共相 Uo 物理上连接到其他驱动器输出（A 或 B），也请在驱动器构造函数中将其作为 C 相引脚提供。这对于步进电机的正确运行很重要。

考虑驱动器连接到 MCU 引脚的示例如下：

```cpp
#define PIN_A_H 9
#define PIN_A_L 10
#define PIN_B_H 11
#define PIN_B_L 12
#define PIN_C_H 13
#define PIN_C_L 14
#define ENABLE 8
```

如果公共相 Uo 连接到驱动器引脚 A，你仍然应该在驱动器构造函数中将其作为 C 相引脚提供：
```cpp
// common phase `Uo` connected to driver pin `A` so it is provided as the `C` phase pin
BLDCDriver6PWM driver = BLDCDriver6PWM(PIN_C_H, PIN_C_L, PIN_B_H, PIN_B_L, PIN_A_H, PIN_A_L, ENABLE);
```

如果公共相 Uo 连接到驱动器引脚 B，你应该在驱动器构造函数中将其作为 C 相引脚提供：
```cpp
// common phase `Uo` connected to driver pin `B` so it is provided as the `C` phase pin
BLDCDriver6PWM driver = BLDCDriver6PWM(PIN_A_H, PIN_A_L, PIN_C_H, PIN_C_L, PIN_B_H, PIN_B_L, ENABLE);
```

或者如果公共相 Uo 连接到驱动器引脚 C，你应该在驱动器构造函数中将其作为 C 相引脚提供：
```cpp
// common phase `Uo` connected to driver pin `C` so it is provided as the `C` phase pin
BLDCDriver6PWM driver = BLDCDriver6PWM(PIN_A_H, PIN_A_L, PIN_B_H, PIN_B_L, PIN_C_H, PIN_C_L, ENABLE);
```
</blockquote>

### Arduino UNO 支持
Arduino UNO 和所有基于 atmega328 的开发板只有 6 个 PWM 引脚，为了使用 BLDCDriver6PWM，我们需要使用所有这些引脚。它们是 3、5、6、9、10 和 11。
此外，为了使算法正常工作，我们需要为每个相的高 / 低侧对使用属于同一个定时器的 PWM 引脚。
Atmega328 属于各个定时器的引脚如下：

`TIM0` |`TIM1` |`TIM2` 
--- | --- | ---
`5`,`6` | `9`,`10` |`3`,`11`

因此，重要的是 phA_h 和 phA_l 属于一个定时器，phB_h 和 phB_l 属于第二个定时器，phC_h 和 phC_l 属于最后一个定时器。如果我们确定 A 相属于定时器 TIM0，我们可以将 phA_h 设置为引脚 5 或引脚 6。

### STM32 支持

Stm32 开发板有两种可能的 6 PWM 模式：
- 硬件 6 PWM 模式
- 软件 6 PWM 模式

####  硬件 6 PWM 模式
在硬件 6 PWM 模式下，用户通常只使用一个定时器（定时器 1）来控制所有 6 个 PWM 通道。Stm32 开发板通常至少有一个定时器具有自动互补通道，这避免了复杂的通道反转配置。SimpleFOC库 会自动启用此控制模式，如果您向 BLDCDriver6PWM 类的构造函数提供支持此接口的引脚。例如，STM32 Bluepill 和 STM32 Nucleo 开发板都有由以下引脚支持的此接口：

 `T1C1` | `T1C2` | `T1C3` | `T1C1N` | `T1C2N` | `T1C3N` 
 --- | --- | ---| ---| ---| ---
 `PA8` | `PA9` | `PA10` | `PB13` | `PB14` | `PB15`  

其中 T1Cx 是定时器 1 的通道，T1CxN 是它们的互补通道（反转通道）。每对 T1Cx 和 T1CxN 用于一对高 / 低 PWM 引脚。如果您向 BLDCDriver6PWM 类的构造函数提供这些引脚，库将配置必要的定时器和寄存器。例如：
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
BLDCDriver6PWM driver = BLDCDriver6PWM(PA8, PB13, PA9, PB14, PA10, PB15);
```

####  软件 6 PWM 模式
如果您的开发板无法使用硬件 6 PWM 模式，SimpleFOC库 允许您使用任何定时器的任何两个通道作为高 / 低侧 PWM 对。基本上，库会自动在提供的低侧引脚上配置互补通道。此代码正常工作的唯一要求与 Arduino UNO 完全相同，每个相的高 / 低侧 PWM 对应属于同一个定时器。
例如，如果我们以 STM32 Nucleo F401RE 开发板为例，我们可以使用：
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
BLDCDriver6PWM driver = BLDCDriver6PWM(7, 2, 6, 3, 5, 4);
```
其中

 `T1C1` | `T1C3` | `T2C3` | `T2C2` | `T3C1` | `T3C2` 
 --- | --- | ---| ---| ---| ---
 `7` | `2` | `6` | `3` | `5` | `4`  

在 Bluepill 上我们可以使用：
```cpp
//  BLDCDriver6PWM( int phA_h, int phA_l, int phB_h, int phB_l, int phC_h, int phC_l, int en)
BLDCDriver6PWM driver = BLDCDriver6PWM(PA8, PA9, PB6, PB7, PB8, PB9);
```
其中

 `T1C1` | `T1C2` | `T4C1` | `T4C2` | `T4C3` | `T4C4` 
 --- | --- | ---| ---| ---| ---
 `PA8` | `PA9` | `PB6` | `PB7` | `PB8` | `PB9`  

### ESP32 支持
ESP32 开发板支持 MCPWM 接口，该接口适用于此类应用。每个 ESP32 开发板有两个 MCPWM 通道，可以支持两个 6 PWM 驱动器。ESP32 没有特定的引脚要求，每个引脚都可以在 PWM 模式下使用。但请确保不要使用启动时具有预定义状态的引脚，因为这可能导致故障。你可以在网上轻松找到此信息，这里有一个[YouTube 视频](https://www.youtube.com/watch?v=c0tMGlJVmkw)提供更多细节。


### 低侧电流检测注意事项

由于 ADC 转换必须与所有相上生成的 PWM 同步，因此重要的是为所有相生成的所有 PWM 都具有对齐的 PWM。由于微控制器通常有多个定时器用于在其引脚上生成 PWM，不同架构的微控制器在不同定时器生成的 PWM 之间具有不同程度的对齐。


<blockquote class="info">
<p class="heading">经验法则：PWM 定时器引脚</p>
为了最大限度地提高低侧电流检测的工作几率，我们建议确保为驱动器选择的 PWM 引脚都属于同一个定时器。
找出哪些引脚属于不同的定时器可能需要花一些时间查阅 MCU 数据手册 😄为了节省您的时间，我们创建了一个为不同 MCU 架构选择合适 PWM 引脚的快速指南 <a href="choosing_pwm_pins">参见文档</a>。您也可以随时向社区寻求帮助 - <a href="https://community.simplefoc.com/">社区链接</a>！
</blockquote>

## 步骤 2.1 PWM 配置
```cpp
// pwm frequency to be used [Hz]
// for atmega328 either 4k or 32kHz
// esp32/stm32/teensy configurable
driver.pwm_frequency = 20000;
```
以下是不同微控制器及其在 Arduino SimpleFOC库 中使用的 PWM 频率和分辨率的列表。

MCU | 默认频率 |最大频率 | PWM 分辨率 | 中心对齐 | 可配置频率
--- | --- | --- | --- | ---
Arduino UNO(Atmega328) | 32 kHz | 32 kHz | 8bit | yes | yes (either 4kHz or 32kHz)
STM32 | 25kHz | 50kHz | 14bit | yes | yes
ESP32 | 30kHz | 50kHz | 10bit | yes | yes
Teensy | 25kHz | 50kHz | 8bit | yes | yes

所有这些设置都在库源代码的 `drivers/hardware_specific/x_mcu.cpp/h `中定义。


### 低侧电流检测注意事项
由于 ADC 转换需要一些时间才能完成，并且此转换只能在特定的时间窗口内进行（当所有相都接地 - 低侧 MOSFET 导通时），因此使用适当的 PWM 频率很重要。PWM 频率将决定 PWM 的每个周期有多长，进而决定低侧开关导通的时间。较高的 PWM 频率将为 ADC 读取电流值留下更少的时间。

另一方面，较高的 PWM 频率将产生更平稳的操作，因此这里肯定存在权衡。

<blockquote class="info">
<p class="heading">经验法则：PWM 频率</p>
经验法则是保持在 20kHz 左右。

<code class="highlighter-rouge">
driver.pwm_frequency = 20000;
</code>
</blockquote>



## 步骤 2.2 死区（死时间）


<img src="extras/Images/dead_zone.png" class="width30">

```cpp
// dead_zone [0,1] - default 0.02 - 2%
driver.dead_zone = 0.05;
```
死区参数定义为在切换有源 MOSFET 之间保留的占空比量。每次高 / 低侧停用和低 / 高侧激活时，都会注入一半的 dead_zone。此参数等同于死时间，死时间可以计算为：

```cpp
dead_time = 1/pwm_frequency*dead_zone
```

## 步骤 2.2 电压
驱动器类负责将 PWM 占空比设置到驱动器输出引脚，它需要知道所连接的直流电源电压。

此外，驱动器类允许用户设置驱动器将设置到输出引脚的绝对直流电压限制。
```cpp
// power supply voltage [V]
driver.voltage_power_supply = 12;
// Max DC voltage allowed - default voltage_power_supply
driver.voltage_limit = 12;
```

<a href="javascript:show('bldc','motor');" class="btn btn-bldc btn-motor btn-primary">BLDCMotor</a> 
<a href="javascript:show('stepper','motor');" class="btn btn-stepper btn-motor">HybridStepperMotor</a> 

<div class="motor motor-bldc"  markdown="1">

<img src="extras/Images/limits.png" class="width60">
</div>
<div class="motor motor-stepper hide"  markdown="1">
<img src="extras/Images/hybrid_limits.jpg" class="width60">
</div>

此参数也被 BLDCMotor 类使用。如上图所示，一旦设置了电压限制 driver.voltage_limit，它将被传送到 BLDCMotor 类中的 FOC 算法，相电压将以 driver.voltage_limit/2 为中心。

因此，如果担心电机产生过高电流，此参数非常重要。在这些情况下，此参数可用作安全功能。

## 步骤 2.3 初始化
设置所有必要的配置参数后，调用驱动器函数 init()。此函数使用配置参数，并为驱动器代码执行配置所有必要的硬件和软件。
```cpp
// driver init
driver.init();
```

此函数负责：
- 确定并配置用于 PWM 生成的硬件定时器
- 验证所有提供的引脚是否可用于生成 PWM
- 配置 PWM 通道

如果由于某种原因驱动器配置失败，此函数将返回 0；如果一切顺利，函数将返回 1。因此，我们建议您在继续之前检查初始化函数是否成功执行
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
如果您希望在 driver.init() 期间看到更详细的驱动器配置调试输出，并查看有关驱动器配置和可能错误的更多详细信息，您可以使用 SimpleFOCDebug 类。
为了启用详细调试模式，请确保在 driver.init() 调用之前启用调试，最好在 setup() 函数的顶部。
```cpp
Serial.begin(115200); // to output the debug information to the serial
SimpleFOCDebug::enable(&Serial);
```
更多信息参见[SimpleFOCDebug 文档](debugging).

<blockquote class="info"> 
📢 我们强烈建议在开始使用 <span class="simple">Simple<span class="foc">FOC</span>库</span> 时使用调试模式。
它提供比标准监控输出更多的信息，有助于排查潜在问题，甚至是特定于 MCU 架构的问题。
</blockquote>

## 步骤 3. 实时使用 BLDCDriver6PWM

BLDC 驱动器类是为与 SimpleFOC库 一起使用而开发的，并为 BLDCMotor 类中实现的 FOC 算法提供抽象层。但是 BLDCDriver3PWM 类也可以作为独立类使用，并且可以选择使用 BLDC 驱动器实现任何其他类型的控制算法。

## FOC 算法支持
在 FOC 控制的上下文中，所有驱动器的使用都由运动控制算法在内部完成，只需将驱动器链接到 BLDCMotor 类即可启用。
```cpp
// linking the driver to the motor
motor.linkDriver(&driver)
```

## 独立驱动器
如果您希望将 BLDC 驱动器用作独立设备并在其周围实现自己的逻辑，这很容易做到。以下是一个非常简单的独立应用程序的示例代码。
```cpp
// BLDC driver standalone example
#include <SimpleFOC.h>

// BLDC driver instance
BLDCDriver6PWM driver = BLDCDriver6PWM(5, 6, 9,10, 3, 11, 8);

void setup() {
  
  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 20000;
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  // dead_zone [0,1] - default 0.02 - 2%
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
