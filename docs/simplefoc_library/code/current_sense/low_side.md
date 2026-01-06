---
layout: default
title: 低侧电流检测
nav_order: 2
permalink: /low_side_current_sense
parent: 电流检测
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---

# 低侧电流检测

<img src="extras/Images/low_side_sync.png" class="width50">

低侧电流检测可能是最常见的电流检测技术。主要原因是它既不需要高性能的抗PWM干扰电流检测放大器（如串联检测），也不需要高压支持放大器（如高端检测）。分流电阻总是放置在低侧MOSFET和地之间，确保放大器的端子上始终只有非常低的电压。这种方法的主要缺点是，由于流过分流电阻的电流只有在相应的低侧MOSFET导通时才是相电流，所以我们只能在这些时刻测量它。PWM频率通常为20至50kHz，这意味着低侧MOSFET每秒开关20,000至50,000次，因此PWM设置和ADC采集之间的同步非常重要。

所有架构的低侧电流检测都在我们的路线图上，我们正在积极开发。目前的主要问题是PWM生成和ADC触发的硬件特定同步程序。因此，我们一次针对一种MCU架构进行开发。😃

<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">无刷直流电机</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type btn-stepper"> 步进电机</a> 

<p class="type type-bldc" ><img src="extras/Images/low-side.png" class="width50"></p>
<div class="type type-stepper hide" >

<img src="extras/Images/lowside_stepper.png" class="width60">

<blockquote class="info">
<p class="heading">步进电机低侧电流检测的其他拓扑结构</p>
有关步进电机低侧电流检测的其他拓扑结构的更多信息，请参见社区论坛中的链接<a href="https://community.simplefoc.com/t/low-side-current-sensing-for-stepper-motors/7235">步进电机低侧电流检测</a>。
</blockquote>
</div>


<blockquote class="info" markdown="1">
<p class="heading"  markdown="1">将`LowsideCurrentSense`类与串联电流检测硬件一起使用</p>
在<span class="simple">Simple<span class="foc">FOC</span>库</span>中，低侧电流检测是在`LowsideCurrentSense`类中实现的。该类设计用于`BLDCDriver`和`StepperDriver`类，用于测量电机的相电流，其中ADC转换与驱动器的PWM生成同步。`LowsideCurrentSense`类实现了这种同步，尽管它主要设计用于低侧电流检测硬件，但也可以用于串联电流检测硬件。在某些情况下，甚至建议将其与串联电流检测硬件一起使用，例如stm32架构，因为它使用DMA进行ADC转换，性能更好。
</blockquote>


## 各MCU架构的电流检测支持

低侧电流检测目前支持<span class="simple">Simple<span class="foc">FOC</span>库</span>支持的几种MCU架构。ESP32架构具有最通用的支持，支持每芯片多个电机。Stm32系列f1、f4、l4、g4和f7受支持，仅支持一个电机的低侧检测。STM32开发板的一个特例是B-G431-ESC1开发套件，其硬件配置有非常特定的低侧实现，并且库完全支持它。Samd21架构正在开发中，它初步支持一个电机，但由于尚未经过广泛测试，我们建议不要依赖我们的实现。Teensy4也初步支持一个电机的低侧检测。

MCU | 低侧电流检测 | ADC转换类型 | 最大PWM频率 | 支持的ADC
--- | --- | --- | --- | --- 
Arduino（8位） |  ❌ | - | -| -
Arduino DUE  |  ❌ | - | -| -
STM32（一般情况） |❌ | - | -| -
STM32f1系列 | ✔️（一个电机） | DMA | ~20kHz| 所有
STM32f4系列 | ✔️（一个电机） | DMA| ~25kHz| 所有
STM32g4系列 | ✔️（一个电机） | DMA| ~25kHz| 所有
STM32l4系列 | ✔️（一个电机） | DMA| ~25kHz| 所有
STM32f7系列 | ✔️（一个电机） | DMA| ~25kHz | 所有
STM32h7系列 | ✔️（一个电机） | DMA| ~25kHz | 所有
STM32 B_G431B_ESC1 | ✔️ | DMA| ~25kHz| 所有
ESP32 with MCPWM |✔️ | 中断| ~20kHz| 所有
ESP32 with LEDC | ❌ | -| -| -
ESP8266 | ❌ | -| -| -
SAMD21 | ✔️/❌（一个电机，测试不足） | 中断 | ?| ?
SAMD51 | ❌ | -| -| -
Teensy3 |  ❌| -| -| -
Teensy4 |  ✔️（初步）| 中断| ~20kHz| ADC1
Raspberry Pi Pico | ❌ | -| -|
Portenta H7 |  ❌ | -| -| -
Renesas（UNO R4） | ❌（待定） | -| -| -

### 重要的硬件注意事项

低侧电流检测需要`driver`生成的PWM与ADC触发高度同步。在选择要使用的MCU和要与低侧电流检测一起使用的驱动器时，有三个主要注意事项：
1. ADC转换类型 - DMA或基于中断
2. PWM频率考虑因素
3. 适当的PWM和ADC引脚考虑因素


有关驱动器参数的更多信息，请参见[驱动器文档](drivers_config)！

### 1. ADC转换类型

低侧电流检测支持几种架构，主要有两种不同的技术：基于中断的ADC转换和基于DMA的ADC转换。
在基于中断的ADC转换中，ADC转换由PWM定时器在PWM占空比的中心（所有相接地时）触发。在这种情况下，MCU必须等待ADC转换完成才能执行其他任务。
在基于DMA的ADC转换中，ADC转换由PWM定时器在PWM占空比的中心（所有相接地时）触发，但ADC转换由DMA控制器在后台完成。这允许MCU在ADC转换进行时执行其他任务。

<blockquote class="info">
<p class="heading">经验法则：ADC转换类型</p>
由于基于DMA的ADC转换效率高得多，因此建议尽可能使用支持它的MCU架构。
</blockquote>

### 2. PWM频率考虑因素

由于ADC转换需要一些时间完成，并且这种转换只能在特定的时间窗口内进行（当所有相都接地 - 低侧MOSFET导通时），因此使用适当的PWM频率非常重要。PWM频率将决定PWM的每个周期有多长，进而决定低侧开关导通的时间。较高的PWM频率将为ADC读取电流值留下更少的时间。

另一方面，较高的PWM频率将产生更平滑的操作，因此这里肯定存在权衡。

<blockquote class="info">
<p class="heading">经验法则：PWM频率</p>
经验法则是保持在20kHz左右。

<code class="highlighter-rouge">
driver.pwm_frequency = 20000;
</code>
</blockquote>

### 3. 适当的PWM和ADC引脚考虑因素

由于ADC转换必须与所有相上生成的PWM同步，因此重要的是为所有相生成的PWM都具有对齐的PWM，并且支持ADC转换的触发。由于微控制器通常有多个用于PWM生成的定时器和多个用于读取模拟值的ADC，因此为正确的相选择正确的引脚非常重要。

<blockquote class="info">
<p class="heading">经验法则：PWM定时器和ADC引脚</p>
为了最大限度地提高低侧电流检测的工作几率，我们建议确保为驱动器选择的PWM引脚都属于同一个定时器，为电流检测选择的ADC引脚都属于同一个ADC。<br>
📢 以下是为不同MCU架构选择合适PWM引脚的快速指南 <a href="choosing_pwm_pins">参见文档</a>。<br>
📢 以下是为不同MCU架构选择合适ADC引脚的快速指南 <a href="choosing_adc_pins">参见文档</a>。
</blockquote>


## 硬件配置
<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">无刷直流电机</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type btn-stepper"> 步进电机</a> 

<div class="type type-bldc"  markdown="1">

```cpp
// LowsideCurrentSense constructor
//  - shunt_resistor  - shunt resistor value
//  - gain  - current-sense op-amp gain
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
//  - phC   - C phase adc pin (optional)
LowsideCurrentSense current_sense  = LowsideCurrentSense(0.01, 20, A0, A1, A2);
```
</div>
<div class="type type-stepper hide"  markdown="1">

```cpp
// LowsideCurrentSense constructor
//  - shunt_resistor  - shunt resistor value
//  - gain  - current-sense op-amp gain
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
LowsideCurrentSense current_sense  = LowsideCurrentSense(0.01, 20, A0, A1);
```
</div>

要使用SimpleFOC库实例化低侧电流传感器，只需创建LowsideCurrentSense类的实例。此类将分流电阻值shunt_resistor、放大增益gain以及两个或三个 ADC 通道引脚作为参数，具体取决于您可能拥有的测量硬件。为正确的驱动器 / 电机相指定正确的 adc 通道非常重要。因此，如果您的引脚A0测量相电流A，引脚A1测量相电流B，请确保按该顺序将它们提供给构造函数。

或者，可以通过指定每安培毫伏比mVpA来创建LowsideCurrentSense，这在基于霍尔传感器的电流检测（如 ACS712）中更为常见。


<div class="type type-stepper hide"  markdown="1">

```cpp
// LowsideCurrentSense constructor
//  - mVpA  - mV per Amp ratio
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
LowsideCurrentSense current_sense  = LowsideCurrentSense(66.0,  A0, A1);
```
</div>
<div class="type type-bldc"  markdown="1">

```cpp
// LowsideCurrentSense constructor
//  - mVpA  - mV per Amp ratio
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
//  - phC   - C phase adc pin (optional)
LowsideCurrentSense current_sense  = LowsideCurrentSense(66.0,  A0, A1, A2);
```

### 测量 3 相中的 2 相电流
{:.no_toc}
磁场定向控制算法可以使用 2 相或 3 相电流测量运行。如果测量 3 相中的 2 相电流，在定义LowsideCurrentSense类时，将标志_NC（未连接）放在不使用的相值处。

例如，如果测量 A 相（模拟引脚 A0）和 C 相（模拟引脚 A1）上的电流，而不测量 B 相上的电流，则定义电流检测类为：

```cpp
// LowsideCurrentSense constructor
LowsideCurrentSense current_sense  = LowsideCurrentSense(shunt_resistor, gain, A0, _NC, A1);
```

Some more examples:

```cpp
// LowsideCurrentSense constructor
LowsideCurrentSense current_sense  = LowsideCurrentSense(shunt_resistor, gain, _NC, A0, A1); // when measuring B and C phase currents and not measuring A

// LowsideCurrentSense constructor
LowsideCurrentSense current_sense  = LowsideCurrentSense(shunt_resistor, gain, A0, A1, _NC); // when measuring A and B phase currents and not measuring C
// or
LowsideCurrentSense current_sense  = LowsideCurrentSense(shunt_resistor, gain, A0, A1); // when measuring A and B phase currents and not measuring C
```

</div>

### 自定义增益
<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type btn-stepper"> Stepper motors</a> 


LowsideCurrentSense类的构造函数只允许您指定一个分流电阻值和一个放大增益。如果您的硬件配置对于不同的相具有不同的分流 / 放大值，您可以通过更改gain_x属性来指定它们：
<div class="type type-bldc"  markdown="1">

```cpp
// default values of per phase gains
current_sense.gain_a = 1.0 / shunt_resistor / gain;
current_sense.gain_b = 1.0 / shunt_resistor / gain;
current_sense.gain_c = 1.0 / shunt_resistor / gain;
```

例如，  [AliExpress DRV8302开发板](https://fr.aliexpress.com/wholesale?catId=0&initiative_id=SB_20211003032006&SearchText=bldc+drv8302) 的所有电流检测相都是反相的。因此，在这种情况下，您可以指定：
```cpp
// inverse current sensing gain
current_sense.gain_a *= -1;
current_sense.gain_b *= -1;
current_sense.gain_c *= -1;
```

</div>
<div class="type type-stepper hide"  markdown="1">

```cpp
// default values of per phase gains
current_sense.gain_a = 1.0 / shunt_resistor / gain;
current_sense.gain_b = 1.0 / shunt_resistor / gain;
```

例如，要反转 B 相电流测量，您可以轻松地将其增益更改为：
```cpp
// inverse current sensing gain on phase b
current_sense.gain_b *= -1;
```

</div>


## 同步电流检测与驱动器 PWM

<img src="extras/Images/low_side_sync.png" class="width40"> 

由于低侧电流检测技术需要在所有低侧 MOSFET 导通时（所有相接地时）准确触发 ADC 采集，因此要将LowsideCurrentSense与 FOC 算法一起使用，您需要做的第一件事是将电流检测与BLDCDriver关联（链接）：
```cpp
// link current sense and driver
current_sense.linkDriver(&driver);
```
电流检测将使用驱动器参数进行不同的同步和校准程序。
<blockquote class="warning">
<p class="heading">API变更 - <span class="simple">Simple<span class="foc">FOC</span>库</span> v2.2.2</p>
从库版本v2.2.2开始引入了与电流检测的驱动器链接，以便在ADC和PWM定时器之间传播电流检测高级同步所需的不同硬件特定参数。
</blockquote>

## 初始化电流检测

创建电流检测并将其与驱动器链接后，就可以对其进行初始化了。此init()函数配置用于读取的 ADC 硬件，并找到每个通道的 ADC 零偏移。
```cpp
// init current sense
current_sense.init();
```

初始化函数负责
- 配置用于电流检测的 ADC
- 校准 - 偏移去除

如果由于某种原因 ADC 配置失败，此函数将返回0；如果一切顺利，函数将返回1。
因此，我们建议您在继续之前检查初始化函数是否成功执行：

```cpp
// init current sense
if (current_sense.init())  Serial.println("Current sense init success!");
else{
  Serial.println("Current sense init failed!");
  return;
}
```

当您的电流检测已初始化和校准后，您就可以开始测量电流了！


### 启用调试输出
如果您希望在current_sense.init()期间看到电流检测配置的更详细的调试输出，并查看有关配置和可能错误的更多详细信息，您可以使用SimpleFOCDebug类。
为了启用详细调试模式，请确保在current_sense.init()调用之前启用调试，最好在setup()函数的顶部。
```cpp
Serial.begin(115200); // to output the debug information to the serial
SimpleFOCDebug::enable(&Serial);
```
更多信息请参见[SimpleFOCDebug 文档](debugging).

<blockquote class="info"> 
📢我们强烈建议在开始使用<span class="simple">Simple<span class="foc">FOC</span>库</span>时使用调试模式。
它提供了比标准监控输出多得多的信息，有助于排查潜在问题，甚至是特定于MCU架构的问题
</blockquote>


## 将电流检测与 FOC 算法一起使用
<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

<div class="type type-bldc"  markdown="1">

要将LowsideCurrentSense与 FOC 算法一起使用，您需要做的第一件事是将电流检测与BLDCDriver关联:
```cpp
BLCDriverXPWM driver = BLCDriverXPWM(...); 
...
LowsideCurrentSense current_sense  = LowsideCurrentSense(...);

void setup(){
  ...
  // init driver
  driver.init();
  // link current sense and driver
  current_sense.linkDriver(&driver);
  ...
  current_sense.init();
  ...
}
```

</div>
<div class="type type-stepper hide"  markdown="1">
要将`LowsideCurrentSense`与FOC算法一起使用，您需要做的第一件事是将电流检测与`StepperDriver`关联:

```cpp
StepperDriverXPWM driver = StepperDriverXPWM(...); 
...
LowsideCurrentSense current_sense  = LowsideCurrentSense(...);

void setup(){
  ...
  // init driver
  driver.init();
  // link current sense and driver
  current_sense.linkDriver(&driver);
  ...
  current_sense.init();
  ...
}
```
</div>

电流检测将使用驱动器参数进行不同的同步和校准程序。

<blockquote class="warning">
<p class="heading">API变更 - <span class="simple">Simple<span class="foc">FOC</span>库</span> v2.2.2</p>

从库版本 v2.2.2 开始引入了与电流检测的驱动器链接，以便在 ADC 和 PWM 定时器之间传播电流检测高级同步所需的不同硬件特定参数。
</blockquote>

将驱动器链接到电流检测后，最后一步是将电流检测与您要使用它的motor链接：
```cpp
// link motor and current sense
motor.linkCurrentSense(&current_sense);
```

### 在您的 FOC 代码中放置`current_sense`配置的位置？

非常重要的是，电流检测init函数要在BLDCDriver初始化函数调用之后调用。这将确保在进行电流检测校准时驱动器已启用。此外，电流检测init函数必须在初始化电机并使用initFOC函数启动 foc 算法之前调用。

因此，建议的代码结构如下：

```cpp
void setup(){
  .... 
  // driver init
  driver.init();
  // link the driver to the current sense
  current_sense.linkDriver(&driver);
  ....
  // motor init
  motor.init();
  .... 
  // init current sense
  current_sense.init();
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);
  ...
  // start the FOC
  motor.initFOC();
}
```
函数initFOC()将确保BLDCDriver和LowsideCurrentSense类都对齐，非常重要的是，电流检测的 A 相正好是驱动器的 A 相，电流检测的 B 相正好是驱动器的 B 相，C 相也是如此。为了验证这一点，initFOC将调用电流检测的函数current_sense.driverAlign(...)。

### 与电机相的对齐`driverAlign(...)`

<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

initFOC内部的电流检测和驱动器对齐是通过调用以下函数完成的：
```cpp
current_sense.driverAlign(voltage_sensor_align);
```

该函数将使用driver实例（通过current_sense.linkDriver(&driver)链接到电流检测）向每个相施加电压（电压可以使用参数motor.voltage_sensor_align设置），并检查测量的电流是否与施加的电压方向一致。
此对齐过程能够纠正：
- adc 引脚顺序不正确
- 增益符号不正确


如果在initFOC期间为电机启用了[监控](monitoring)，监控将显示对齐状态：
 - `0` - 失败
 - `1` - 成功且未更改
 - `2` - 成功但引脚已重新配置
 - `3` - 成功但增益已反转
 - `4` - 成功但引脚已重新配置且增益已反转

如果您对自己的配置有把握，并且希望跳过对齐过程，可以在调用motor.initFOC()之前设置skip_align标志：

```cpp
// skip alignment procedure
current_sense.skip_align = true;
```

<div class="type type-bldc"  markdown="1">

例如，对于[AliExpress DRV8302 开发板](https://fr.aliexpress.com/wholesale?catId=0&initiative_id=SB_20211003032006&SearchText=bldc+drv8302)，您的代码可能类似于以下内容：
```cpp
// one possible combination of current sensing pins for SimpleFOCShield v2
// shunt - 5milliOhm
// gain  -  12.22 V/V 
LowsideCurrentSense current_sense = LowsideCurrentSense(0.005f, 12.22f, IOUTA, IOUTB, IOUTC);

void loop(){
  .... 
  // driver init
  driver.init();
  // link the driver to the current sense
  current_sense.linkDriver(&driver);
  ....
  // motor init
  motor.init();
  .... 
  // init current sense
  current_sense.init();
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);
  ...
  // invert phase b gain
  current_sense.gain_a *=-1;
  current_sense.gain_b *=-1;
  current_sense.gain_c *=-1;
  // skip alignment
  current_sense.skip_align = true;
  ... 
  // start the FOC
  motor.initFOC();
}
```
参见库示
例 `/examples/hardware_specific_examples/DRV8302_driver/esp32_current_control_low_side`中基于 Aliexpress DRB8302 的开发板的完整示例。

</div>

## 独立电流检测

<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

由于低侧电流检测必须与相关驱动器的 PWM 同步，因此将其用作独立传感器没有意义。
但是，一旦您将电流检测与driver链接，您就可以使用它来读取相电流、总电流幅度和 DQ 电流。

可以通过调用以下命令读取相电流：
```cpp
PhaseCurrent_s  current = current_sense.getPhaseCurrents();
```
<div class="type type-bldc"  markdown="1">

此函数返回PhaseCurrent_s结构，该结构有三个变量a、b和c。例如，您可以打印它们；
```cpp
Serial.println(current.a);
Serial.println(current.b);
Serial.println(current.c); // 0 if only two currents mode
```

如果您在InlineCurrentSense中仅使用两相电流测量，它将返回第三个电流current.c等于 0。
</div>

<div class="type type-stepper hide"  markdown="1">

此函数返回PhaseCurrent_s结构，该结构有两个变量a和b。例如，您可以打印它们；
```cpp
Serial.println(current.a);
Serial.println(current.b);
```
</div>

有时相电流难以解释，因此该电流检测类使您能够读取变换后的电流矢量幅度。电机消耗的绝对直流电流。
```cpp
float current_mag = current_sense.getDCCurrent();
```

此外，如果您可以访问连接到驱动器的电机的位置传感器，您可以通过将其提供给getDCCurrent方法来获取电机消耗的直流电流的有符号值。
```cpp
float current = current_sense.getDCCurrent(motor_electrical_angle);
```

最后，如果您可以访问电机位置传感器，电流检测类将能够告诉您电机正在消耗的 FOC 电流 D 和 Q。
```cpp
DQCurrent_s current = current_sense.getFOCCurrents(motor_electrical_angle);
```
此函数返回DQCurrent_s结构，该结构有两个变量d和q。例如，您可以打印它们：
```cpp
Serial.println(current.d);
Serial.println(current.q);
```

### 示例代码

<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

以下是使用SimpleFOC库并直接读取电机电流的低侧电流检测的简单示例。


<div class="type type-bldc"  markdown="1">

```cpp
#include <SimpleFOC.h>


// define the motor and the driver
BLDCMotor motor = BLDCMotor(...);
BLDCDriverXPWM driver = BLDCDriverXPWM(...);

// current sensor
// shunt resistor value
// gain value
// pins phase A,B
LowsideCurrentSense current_sense = LowsideCurrentSense(0.01, 50.0, A0, A1, A2);

void setup() {

  // init driver
  driver.init();
  current_sense.linkDriver(&driver);
  ...

  // init motor
  motor.init();
  ...

  // initialise the current sensing
  current_sense.init();
  motor.linkCurrentSense(&current_sense);
  
  ...
  motor.initFOC();
  ...

  Serial.begin(115200);
  Serial.println("Setup ready.");
}

void loop() {
    // foc and motion controls
    motor.loopFOC();
    motor.move();

    PhaseCurrent_s currents = current_sense.getPhaseCurrents();

    Serial.print(currents.a*1000); // milli Amps
    Serial.print("\t");
    Serial.print(currents.b*1000); // milli Amps
    Serial.print("\t");
    Serial.println(currents.c*1000); // milli Amps
}
```
</div>
<div class="type type-stepper hide"  markdown="1">

```cpp
#include <SimpleFOC.h>


// define the motor and the driver
StepperMotor motor = StepperMotor(...);
StepperDriverXPWM driver = StepperDriverXPWM(...);

// current sensor
// shunt resistor value
// gain value
// pins phase A,B
LowsideCurrentSense current_sense = LowsideCurrentSense(0.01, 50.0, A0, A1);

void setup() {

  // init driver
  driver.init();
  current_sense.linkDriver(&driver);
  ...

  // init motor
  motor.init();
  ...

  // initialise the current sensing
  current_sense.init();
  motor.linkCurrentSense(&current_sense);
  
  ...
  motor.initFOC();
  ...

  Serial.begin(115200);
  Serial.println("Setup ready.");
}

void loop() {
    // foc and motion controls
    motor.loopFOC();
    motor.move();

    PhaseCurrent_s currents = current_sense.getPhaseCurrents();

    Serial.print(currents.a*1000); // milli Amps
    Serial.print("\t");
    Serial.println(currents.b*1000); // milli Amps
}

```

</div>