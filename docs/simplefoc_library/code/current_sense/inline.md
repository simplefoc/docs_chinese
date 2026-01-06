---
layout: default
title: 在线电流检测
nav_order: 1
permalink: /inline_current_sense
parent: 电流检测
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---

# 串联电流检测


<img src="extras/Images/comparison_cs.png" class="width40">

串联电流检测技术是最简单且最精确的一种。分流电阻与电机相串联，在这些分流电阻上测量到的电流即为电机相电流，与PWM占空比状态无关。因此，这种实现方式非常适合Arduino设备，因为可以在任何时候对ADC进行采样以读取电流，并且ADC采集持续时间不像其他电流检测方法那样重要。这种方法的缺点在于硬件方面，这种电流检测架构需要高精度的双向放大器，其PWM抑制能力比常规的低侧或高侧放大器要好得多。

<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">无刷直流电机</a>
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type btn-stepper"> 步进电机</a>

<p class="type type-bldc" ><img src="extras/Images/in-line.png" class="width50"></p>
<p class="type type-stepper hide" ><img src="extras/Images/inline_stepper.png" class="width60"></p>


## 各MCU架构的电流检测支持情况

串联电流检测目前支持几乎所有<span class="simple">Simple<span class="foc">FOC</span>library</span>所支持的MCU架构。唯一不支持的架构是ESP8266，它没有2个ADC引脚，因此无法运行FOC。

MCU | 串联电流检测
--- | ---
Arduino（8位） | ✔️
Arduino DUE  | ✔️
STM32  | ✔️
STM32 B_G431B_ESC1 | ✔️
ESP32 | ✔️
ESP8266 | ❌
SAMD21 | ✔️
SAMD51 | ✔️
Teensy | ✔️
Raspberry Pi Pico | ✔️
Portenta H7 | ✔️
Renesas（UNO R4） | ❌（待定）


## 硬件配置

<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">无刷直流电机</a>
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> 步进电机</a>

要使用<span class="simple">Simple<span class="foc">FOC</span>library</span>实例化串联电流传感器，只需创建`InlineCurrentSense`类的一个实例。
<div class="type type-bldc"  markdown="1">

```cpp
// InlineCurrentSensor constructor
//  - shunt_resistor  - shunt resistor value
//  - gain  - current-sense op-amp gain
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
//  - phC   - C phase adc pin (optional)
InlineCurrentSense current_sense  = InlineCurrentSense(0.01, 20, A0, A1, A2);
```

该类接受分流电阻值shunt_resistor、放大增益gain以及两个或三个 ADC 通道引脚作为参数，具体取决于您可能拥有的测量硬件。为正确的驱动器 / 电机相指定正确的 adc 通道非常重要。因此，如果您的引脚A0测量 A 相电流，引脚A1测量 B 相电流，请确保按该顺序将它们提供给构造函数。

<blockquote class="info">
📢 这里有一个关于为不同MCU架构选择合适ADC引脚的快速指南 <a href="choosing_adc_pins">参见文档</a>。
</blockquote>

或者，可以通过指定每安培毫伏比mVpA来创建InlineCurrentSense，这在基于霍尔传感器的电流检测（如 ACS712）中更为常见。
```cpp
// InlineCurrentSensor constructor
//  - mVpA  - mV per Amp ratio
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
//  - phC   - C phase adc pin (optional)
InlineCurrentSense current_sense  = InlineCurrentSense(66.0,  A0, A1, A2);
```

### 测量 3 相中的 2 相电流
{:.no_toc}
磁场定向控制算法可以在测量 2 相或 3 相电流的情况下运行。如果测量 3 相中的 2 相电流，在定义InlineCurrentSense类时，将未使用的相值设为标志_NC（未连接）。

例如，如果测量 A 相（模拟引脚 A0）和 C 相（模拟引脚 A1）的电流，而不测量 B 相的电流，则定义电流检测类如下：

```cpp
// InlineCurrentSensor constructor
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, A0, _NC, A1);
```

更多示例：

```cpp
// InlineCurrentSensor constructor
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, _NC, A0, A1); // when measuring B and C phase currents and not measuring A

// InlineCurrentSensor constructor
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, A0, A1, _NC); // when measuring A and B phase currents and not measuring C
// or
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, A0, A1); // when measuring A and B phase currents and not measuring C
```
</div>
<div class="type type-stepper hide"  markdown="1">

```cpp
// InlineCurrentSensor constructor
//  - shunt_resistor  - shunt resistor value
//  - gain  - current-sense op-amp gain
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
InlineCurrentSense current_sense  = InlineCurrentSense(0.01, 20, A0, A1);
```

该类接受分流电阻值shunt_resistor、放大增益gain以及两个或三个 ADC 通道引脚作为参数，具体取决于您可能拥有的测量硬件。为正确的驱动器 / 电机相指定正确的 adc 通道非常重要。因此，如果您的引脚A0测量 A 相电流，引脚A1测量 B 相电流，请确保按该顺序将它们提供给构造函数。

<blockquote class="info">
📢 这里有一个关于为不同MCU架构选择合适ADC引脚的快速指南 <a href="choosing_adc_pins">参见文档</a>。
</blockquote>

或者，可以通过指定每安培毫伏比mVpA来创建InlineCurrentSense，这在基于霍尔传感器的电流检测（如 ACS712）中更为常见。
```cpp
// InlineCurrentSensor constructor
//  - mVpA  - mV per Amp ratio
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin 
InlineCurrentSense current_sense  = InlineCurrentSense(66.0,  A0, A1);
```

</div>



### 自定义增益

InlineCurrentSense类的构造函数只允许您指定一个分流电阻值和一个放大增益。如果您的硬件配置对于不同的相有不同的分流 / 放大值，您可以通过更改gain_x属性来指定它们：

<div class="type type-bldc"  markdown="1">

```cpp
// default values of per phase gains
current_sense.gain_a = 1.0 / shunt_resistor / gain;
current_sense.gain_b = 1.0 / shunt_resistor / gain;
current_sense.gain_c = 1.0 / shunt_resistor / gain;
```

例如，Arduino SimpleFOCShield v2 的 B 相电流检测是反相的。在这种情况下，您可以指定：
```cpp
// inverse current sensing gain on phase b
current_sense.gain_b *= -1;
```

</div>
<div class="type type-stepper hide"  markdown="1">

```cpp
// default values of per phase gains
current_sense.gain_a = 1.0 / shunt_resistor / gain;
current_sense.gain_b = 1.0 / shunt_resistor / gain;
```

例如，要反相 B 相电流测量，您可以轻松地将其增益更改为：
```cpp
// inverse current sensing gain on phase b
current_sense.gain_b *= -1;
```

</div>




## 初始化电流检测

创建电流检测后，就可以对其进行初始化。这个init()函数配置用于读取的 ADC 硬件，并找到每个通道的 ADC 零偏移。
```cpp
// init current sense
current_sense.init();
```

初始化函数负责：
- 配置用于电流检测的 ADC
- 校准 - 去除偏移

如果由于某种原因 ADC 配置失败，该函数将返回0；如果一切顺利，函数将返回1。

因此，我们建议您在继续之前检查初始化函数是否执行成功：

```cpp
// init current sense
if (current_sense.init())  Serial.println("Current sense init success!");
else{
  Serial.println("Current sense init failed!");
  return;
}
```
一旦您的电流检测已初始化和校准，您就可以开始测量电流了！

### 启用调试输出
如果您希望在current_sense.init()期间看到更详细的电流检测配置调试输出，并了解有关配置和可能错误的更多详细信息，您可以使用SimpleFOCDebug类。

为了启用详细调试模式，请确保在current_sense.init()调用之前启用调试，最好在setup()函数的顶部。
```cpp
Serial.begin(115200); // to output the debug information to the serial
SimpleFOCDebug::enable(&Serial);
```
更多信息参见[SimpleFOCDebug 文档](debugging).

<blockquote class="info"> 
📢 我们强烈建议在开始使用<span class="simple">Simple<span class="foc">FOC</span>library</span>时使用调试模式。它提供的信息比标准监控输出多得多，有助于排查潜在问题，甚至是特定于MCU架构的问题。
</blockquote>



## 在 FOC 算法中使用电流检测
<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

<div class="type type-bldc"  markdown="1">

要将InlineCurrentSense与 FOC 算法一起使用，您需要做的第一件事是将您的电流检测与BLDCDriver相关联:
```cpp
BLCDriverXPWM driver = BLCDriverXPWM(...); 
...
InlineCurrentSense current_sense  = InlineCurrentSense(...);

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

要将`InlineCurrentSense`与FOC算法一起使用，您需要做的第一件事是将您的电流检测与`StepperDriver`相关联：

```cpp
StepperDriverXPWM driver = StepperDriverXPWM(...); 
...
InlineCurrentSense current_sense  = InlineCurrentSense(...);

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
<p class="heading"> API 更变 - <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.2.2</p>

从库版本 v2.2.2 开始引入了与电流检测的驱动器链接，以便在 ADC 和 PWM 定时器之间传播不同的硬件特定参数，用于电流检测的高级同步。
</blockquote>

一旦驱动器链接到电流检测，最后一步是将电流检测与您希望使用它的motor链接：
```cpp
// link motor and current sense
motor.linkCurrentSense(&current_sense);
```
### 在您的 FOC 代码中放置current_sense配置的位置？

至关重要的是，电流检测init函数要在driver.init函数调用之后调用。这将确保在进行电流检测校准时驱动器已配置，并且驱动器的有效配置可用。此外，电流检测init函数必须在通过initFOC函数启动 foc 算法之前调用。最后，我们建议将电流检测init放在motor.init()和motor.initFOC()函数之间，以确保在电流检测init期间驱动器已启用（但这不是强制性的）。以下是建议的代码结构：

```cpp
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
  // start the FOC
  motor.initFOC();
}
```
函数initFOC()将确保driver和current_sense类都对齐，电流检测的 A 相正好是驱动器的 A 相等等，这一点非常重要。为了验证这一点，initFOC将调用电流检测的函数current_sense.driverAlign(...)。


### 与驱动器相的对齐`driverAlign(...)`


<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

initFOC内部的电流检测和驱动器对齐是通过调用以下函数完成的：
```cpp
current_sense.driverAlign(voltage_sensor_align);
```

该函数将使用driver实例（通过current_sense.linkDriver(&driver)链接到电流检测）向每个相施加电压（电压可以使用参数motor.voltage_sensor_align设置），并检查测量的电流是否与施加的电压方向一致。
此对齐程序能够纠正：
- adc 引脚顺序错误
- 增益符号错误

如果在initFOC期间为电机启用了[监控](monitoring)，监控器将显示对齐状态：
 - `0` - 失败
 - `1` - 成功且未做任何更改
 - `2` - 成功但引脚已重新配置
 - `3` - 成功但增益已反转
 - `4` - 成功但引脚已重新配置且增益已反转

如果您对自己的配置有信心，并且希望跳过对齐程序，您可以在调用motor.initFOC()之前设置skip_align标志：
```cpp
// skip alignment procedure
current_sense.skip_align = true;
```

<div class="type type-bldc"  markdown="1">

例如，对于 Arduino SimpleFOCShield v2，您的代码可能类似于：
```cpp
// one possible combination of current sensing pins for SimpleFOCShield v2
// shunt - 10milliOhm
// gain  - 50 V/V 
InlineCurrentSense current_sense  = InlineCurrentSense(0.01, 50.0, A0, A2);

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
  current_sense.gain_b *=-1;
  // skip alignment
  current_sense.skip_align = true;
  ... 
  // start the FOC
  motor.initFOC();
}
```
</div>

<div class="type type-stepper hide"  markdown="1">
例如，对于Arduino <span class="simple">Simple<span class="foc">FOC</span> <b>Step</b>Shield</span> v1，如果您对自己的配置有信心，并且希望跳过对齐程序，您可以在调用`motor.initFOC()`之前设置`skip_align`标志：

```cpp
// one possible combination of current sensing pins for SimpleFOC StepShield v1
// ACS712-05 current sensor 185mV/A
InlineCurrentSense current_sense  = InlineCurrentSense(185.0f, A0, A2);

voi loop(){
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
  // skip alignment
  current_sense.skip_align = true;
  ... 
  // start the FOC
  motor.initFOC();
}
```
</div>


## 独立电流检测


<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

要将串联电流传感器用作独立传感器，在配置硬件并校准后，您可以通过调用以下函数读取相电流：
```cpp
PhaseCurrent_s  current = current_sense.getPhaseCurrents();
```
<div class="type type-bldc"  markdown="1">

该函数返回PhaseCurrent_s结构，该结构有三个变量a、b和c。例如，您可以将它们打印出来；
```cpp
Serial.println(current.a);
Serial.println(current.b);
Serial.println(current.c); // 0 if only two currents mode
```
如果您在InlineCurrentSense中仅使用两相电流测量，它将返回第三相电流current.c等于 0。

</div>

<div class="type type-stepper hide"  markdown="1">

该函数返回PhaseCurrent_s结构，该结构有两个变量a和b。例如，您可以将它们打印出来；
```cpp
Serial.println(current.a);
Serial.println(current.b);
```
</div>

有时相电流难以解释，因此该电流检测类使您能够读取变换后的电流矢量幅度。电机所汲取的绝对直流电流。 
```cpp
float current_mag = current_sense.getDCCurrent();
```

此外，如果您可以访问连接到驱动器的电机位置传感器，您可以通过将其提供给getDCCurrent方法来获取电机所汲取的直流电流的有符号值。
```cpp
float current = current_sense.getDCCurrent(motor_electrical_angle);
```

最后，如果您可以访问电机位置传感器，电流检测类将能够告诉您电机所汲取的 FOC 电流 D 和 Q。
```cpp
DQCurrent_s current = current_sense.getFOCCurrents(motor_electrical_angle);
```
该函数返回DQCurrent_s结构，该结构有两个变量d和q。例如，您可以将它们打印出来：
```cpp
Serial.println(current.d);
Serial.println(current.q);
```
### 示例代码

<a href="javascript:show('bldc','type');" id="btn-bldc" class="btn btn-type btn-bldc btn-primary">BLDC motors</a> 
<a href ="javascript:show('stepper','type');" id="btn-stepper" class="btn btn-type  btn-stepper"> Stepper motors</a>

<div class="type type-bldc"  markdown="1">

以下是使用SimpleFOClibrary和SimpleFOCShield v2 的串联电流检测作为独立传感器的简单示例。
```cpp
#include <SimpleFOC.h>

// current sensor
// shunt resistor value
// gain value
// pins phase A,B
InlineCurrentSense current_sense = InlineCurrentSense(0.01f, 50.0f, A0, A2);

void setup() {
  // initialise the current sensing
  current_sense.init();

  // for SimpleFOCShield v2.01/v2.0.2
  current_sense.gain_b *= -1;
  
  Serial.begin(115200);
  Serial.println("Current sense ready.");
}

void loop() {

    PhaseCurrent_s currents = current_sense.getPhaseCurrents();
    float current_magnitude = current_sense.getDCCurrent();

    Serial.print(currents.a*1000); // milli Amps
    Serial.print("\t");
    Serial.print(currents.b*1000); // milli Amps
    Serial.print("\t");
    Serial.print(currents.c*1000); // milli Amps
    Serial.print("\t");
    Serial.println(current_magnitude*1000); // milli Amps
}
```

</div>

<div class="type type-stepper hide"  markdown="1">

以下是使用SimpleFOClibrary和SimpleFOC <b>Step</b>Shield v1 的串联电流检测作为独立传感器的简单示例。
```cpp
#include <SimpleFOC.h>

// ACS712-05B current sensor 185mV/A
// gain value
// pins phase A,B
InlineCurrentSense current_sense = InlineCurrentSense(185.0f, A0, A2);

void setup() {
  // initialise the current sensing
  current_sense.init();
  
  Serial.begin(115200);
  Serial.println("Current sense ready.");
}

void loop() {

    PhaseCurrent_s currents = current_sense.getPhaseCurrents();
    float current_magnitude = current_sense.getDCCurrent();

    Serial.print(currents.a*1000); // milli Amps
    Serial.print("\t");
    Serial.print(currents.b*1000); // milli Amps
    Serial.print("\t");
    Serial.println(current_magnitude*1000); // milli Amps
}

```

</div>