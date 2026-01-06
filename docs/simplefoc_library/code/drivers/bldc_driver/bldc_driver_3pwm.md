---
layout: default
title: 3路PWM无刷直流电机
nav_order: 1
permalink: /bldcdriver3pwm
parent: 无刷直流驱动器配置
grand_parent: 驱动程序
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# BLDC驱动 3PWM - `BLDCDriver3PWM`

这个类提供了大多数常见的3PWM无刷直流电机驱动器的抽象层。基本上，任何可以使用3PWM信号运行的BLDC驱动板都可以用这个类来表示。
例如：
- Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
- Arduino <span class="simple">Simple<span class="foc">FOC</span> <span class="power">Power</span>Shield</span>
- L6234 breakout板
- HMBGC v2.2
- DRV830x（可在3PWM或6PWM模式下运行）
- X-NUCLEO-IHM07M1
- 等等

<a href="javascript:show('bldc','motor');" class="btn btn-bldc btn-motor btn-primary">BLDCMotor</a> 
<a href="javascript:show('stepper','motor');" class="btn btn-stepper btn-motor">HybridStepperMotor</a> 



<div class="motor motor-bldc"  markdown="1">
<img src="extras/Images/3pwm_driver.png" class="width40">
</div>

<div class="motor motor-stepper hide"  markdown="1">
<img src="extras/Images/hybrid_3pwm.jpg" class="width40">

<blockquote class="warning" markdown="1">
⚠️ **注意：** 当将3PWM BLDC驱动器与步进电机一起使用时，确保公共相`Uo`连接到驱动器的C相引脚。
</blockquote>

</div>





## 步骤1. 硬件设置
要创建与BLDC驱动器的接口，你需要指定每个电机相的3个`pwm`引脚编号，以及可选的`enable`引脚。
```cpp
//  BLDCDriver3PWM( int phA, int phB, int phC, int en)
//  - phA, phB, phC - A,B,C phase pwm pins
//  - enable pin    - (optional input)
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

此外，这个 bldc 驱动类允许用户为每个相提供使能信号（如果有的话）。SimpleFOC库将处理每个使能引脚的启用 / 禁用调用，并且如果使用Trapezoidal_120或Trapezoidal_150调制类型，使用这些引脚，库将能够为电机相设置高阻抗，这非常适合反电动势控制，例如：

```cpp
//  BLDCDriver3PWM( int phA, int phB, int phC, int enA, int enB, int enC )
//  - phA, phB, phC - A,B,C phase pwm pins
//  - enA, enB, enC - enable pin for each phase (optional)
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8, 7, 6);
```

<blockquote class="info"> 📢 这里有一个关于为不同MCU架构选择合适PWM引脚的快速指南 <a href="choosing_pwm_pins">参见文档</a>。</blockquote>

<blockquote class="warning" markdown="1">
<p class="heading">⚠️ <b>注意：</b> 当将3PWM BLDC驱动器与步进电机一起使用时，确保公共相`Uo`连接到驱动器的C相引脚。</p>

即使公共相Uo物理上连接到其他驱动器输出（A或B），请在驱动构造函数中将其作为C相引脚提供。这对于步进电机的正确运行很重要。

考虑驱动器连接到 MCU 引脚的示例如下：

```cpp
#define PIN_A 9
#define PIN_B 10
#define PIN_C 11
#define ENABLE 8
```

如果公共相Uo连接到驱动器引脚A，你仍然应该在驱动构造函数中将其作为C相引脚提供：
```cpp
// common phase `Uo` connected to driver pin `A` so it is provided as the `C` phase pin
BLDCDriver3PWM driver = BLDCDriver3PWM(PIN_C, PIN_B, PIN_A, ENABLE);
```

如果公共相Uo连接到驱动器引脚B，你应该在驱动构造函数中将其作为C相引脚提供：
```cpp
// common phase `Uo` connected to driver pin `B` so it is provided as the `C` phase pin
BLDCDriver3PWM driver = BLDCDriver3PWM(PIN_A, PIN_C, PIN_B, ENABLE);
```

或者如果公共相Uo连接到驱动器引脚C，你应该在驱动构造函数中将其作为C相引脚提供：
```cpp
// common phase `Uo` connected to driver pin `C` so it is provided as the `C` phase pin
BLDCDriver3PWM driver = BLDCDriver3PWM(PIN_A, PIN_B, PIN_C, ENABLE);
``` 
</blockquote>

### 低侧电流检测注意事项

由于 ADC 转换必须与所有相上生成的 PWM 同步，重要的是为所有相生成的 PWM 都具有对齐的 PWM。由于微控制器通常有多个定时器用于在其引脚上生成 PWM，不同架构的微控制器在不同定时器生成的 PWM 之间具有不同程度的对齐。


<blockquote class="info">
<p class="heading">经验法则：PWM定时器引脚</p>
为了最大限度地提高低侧电流检测的工作效果，我们建议确保为驱动器选择的所有PWM引脚都属于同一个定时器。

找出哪些引脚属于不同的定时器可能需要花一些时间查看 MCU 数据手册 😄
你也可以随时向社区寻求帮助 - <a href="https://community.simplefoc.com/">社区连接</a>!
</blockquote>

## 步骤 2.1 PWM 配置
```cpp
// pwm frequency to be used [Hz]
// for atmega328 either 4k or 32kHz
// esp32/stm32/teensy configurable
driver.pwm_frequency = 20000;
```

以下是不同微控制器及其在 Arduino SimpleFOC库中使用的 PWM 频率和分辨率的列表。

MCU | 默认频率 | 最大频率 | PWM 分辨率 | 中心对齐 | 可配置频率
--- | --- | --- | --- | ---
Arduino UNO (Atmega328) | 32 kHz | 32 kHz | 8 位 | 是 | 是（4kHz 或 32kHz）
STM32 | 25kHz | 50kHz | 14 位 | 是 | 是
ESP32 | 30kHz | 50kHz | 10 位 | 是 | 是
Teensy | 25kHz | 50kHz | 8 位 | 是 | 是

所有这些设置都在库源代码的drivers/hardware_specific/x_mcu.cpp/h中定义。

### 低侧电流检测注意事项
 
由于 ADC 转换需要一些时间完成，并且这种转换只能在特定的时间窗口内进行（当所有相都接地 - 低侧 mosfet 导通时），使用适当的 PWM 频率很重要。PWM 频率将决定 PWM 的每个周期有多长，进而决定低侧开关导通的时间。较高的 PWM 频率将为 ADC 读取电流值留下更少的时间。

另一方面，较高的 PWM 频率将产生更平滑的操作，因此这里肯定存在权衡。

<blockquote class="info">
<p class="heading">经验法则：PWM频率</p>
经验法则是保持在20kHz左右。
<code class="highlighter-rouge">
driver.pwm_frequency = 20000;
</code>
</blockquote>



## 步骤 2.2 电压
驱动类负责将 pwm 占空比设置到驱动输出引脚，它需要知道所连接的直流电源电压。

此外，驱动类允许用户设置驱动将设置到输出引脚的绝对直流电压限制。
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

这个参数也被BLDCMotor类使用。如上图所示，一旦设置了电压限制driver.voltage_limit，它将被传送到BLDCMotor类中的 FOC 算法，相电压将以driver.voltage_limit/2为中心。

因此，如果担心电机产生过高的电流，这个参数非常重要。在这些情况下，这个参数可以用作安全特性。

## 步骤 2.3 初始化
一旦设置了所有必要的配置参数，就会调用驱动函数init()。这个函数使用配置参数，为驱动代码执行配置所有必要的硬件和软件。

```cpp
// driver init
driver.init();
```

这个函数负责：
- 确定并配置用于 PWM 生成的硬件定时器
- 验证所有提供的引脚是否可用于生成 PWM
- 配置 PWM 通道

如果由于某种原因驱动配置失败，这个函数将返回0；如果一切顺利，函数将返回1。所以我们建议你在继续之前检查初始化函数是否成功执行
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
如果你希望在driver.init()期间看到更详细的驱动配置调试输出，并查看有关驱动配置和可能错误的更多细节，你可以使用SimpleFOCDebug类。

为了启用详细调试模式，确保在driver.init()调用之前启用调试，最好在setup()函数的顶部。

```cpp
Serial.begin(115200); // to output the debug information to the serial
SimpleFOCDebug::enable(&Serial);
```
更多信息参见[SimpleFOCDebug 文档](debugging).

<blockquote class="info"> 
📢 我们强烈建议在开始使用<span class="simple">Simple<span class="foc">FOC</span>库</span>时使用调试模式。

它提供了比标准监控输出多得多的信息，并且可以帮助解决潜在的问题，甚至是特定于MCU架构的问题。
</blockquote>

## 步骤 3. 在实时中使用BLDCDriver3PWM

BLDC 驱动类是为了与SimpleFOC库一起使用而开发的，并为BLDCMotor类中实现的 FOC 算法提供抽象层。但是BLDCDriver3PWM类也可以作为独立类使用，并且可以选择使用 bldc 驱动实现任何其他类型的控制算法。

## FOC 算法支持
在 FOC 控制的上下文中，所有驱动的使用都由运动控制算法在内部完成，只需将驱动链接到BLDCMotor类即可启用。
```cpp
// linking the driver to the motor
motor.linkDriver(&driver)
```

## 独立驱动
如果你希望将 bldc 驱动用作独立设备并在其周围实现自己的逻辑，这很容易做到。以下是一个非常简单的独立应用程序的示例代码。
```cpp
// BLDC driver standalone example
#include <SimpleFOC.h>

// BLDC driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

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
    // phase A: 3V, phase B: 6V, phase C: 5V
    driver.setPwm(3,6,5);
}
```

具有三个使能引脚（每个相一个）的 BLDC 驱动的示例代码。这段代码将一次将一个相置于高阻抗模式，并在其余两个相上施加 3 伏和 6 伏电压。 
```cpp
// BLDC driver standalone example
#include <SimpleFOC.h>

// BLDC driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8, 7, 6);

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