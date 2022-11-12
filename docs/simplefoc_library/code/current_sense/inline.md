---
layout: default
title: 在线电流检测
nav_order: 1
permalink: /inline_current_sense
parent: 电流检测
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 在线电流检测

在线电流检测技术是最易用和精确的一种。采样电阻与电机相串联，无论PWM占空比的状态如何，在这些采样电阻上测量的电流都是电机相位电流。因此，这种方法非常适合于 Arduino 设备，因为adc可以在任何时候进行采样以获得电流，并且adc采集持续时间与其他电流传感方法同样重要。这种方法的短板在于硬件上，这种电流检测结构要求高精度双向放大器具有比常规低侧或高侧放大器更好的PWM抑制。

<img src="extras/Images/in-line.png" class="width60"><img src="extras/Images/comparison_cs.png" class="width30">


## 电流检测支持的MCU

SimpleFOClibrary的在线电流检测现已支持几乎所有的MCU架构。仅不支持没带有两个ADC引脚的ESP8266，无法使其正常运行FOC。 
单片机 | 在线电流检测 
--- | --- 
Arduino (8-bit) | ✔️ 
Arduino DUE  | ✔️ 
stm32  | ✔️ 
stm32 B_G431B_ESC1 | ✔️ 
esp32 | ✔️ 
esp8266 | ❌  
samd21 | ✔️  
samd51 | ✔️  
teensy | ✔️ 
Raspberry Pi Pico | ✔️ 
Portenta H7 | ✔️ 

## 硬件配置

```cpp
// InlineCurrentSensor 构型
//  - shunt_resistor  - 分流电阻值
//  - gain  - 电流检测放大增益
//  - phA   - A 相 adc 引脚
//  - phB   - B 相 adc 引脚
//  - phC   - C 相 adc 引脚 （引脚）
InlineCurrentSense current_sense  = InlineCurrentSense(0.01, 20, A0, A1, A2);
```
要使用 <span class="simple">Simple<span class="foc">FOC</span>library </span>实例化在线电流检测，只需创建`InlineCurrentSense`实例。此类将采样电阻值`shunt_resistor`、放大增益 `gain` 和两个或三个ADC通道引脚作为参数（具体取决于可用测量的硬件）。为正确的驱动器/电机相位指定正确的adc通道非常重要。因此，如果你的针脚`A0`测量相电流`A`，针脚 `A1` 测量相电流`B`，请确保顺序是`A0`,`A1`。

### 检测三相电流中的两相
FOC算法能进行两相或者三相的电流检测，如果想要检测三相中的两相，你可以在定义 `InlineCurrentSense` 类时，把没有使用到的相值放上标志 `_NC` (即不连接)。

例如，你想检测A相电流 (模拟引脚 A0) 以及C相电流 (模拟引脚 A1) ，而不检测B相电流，那么你就可以这样定义电流检测类：

```cpp
// InlineCurrentSensor构型
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, A0, _NC, A1);
```

更多例程如下：

```cpp
// InlineCurrentSensor构型
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, _NC, A0, A1); // 当检测B，C相时，不检测A相

// InlineCurrentSensor构型
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, A0, A1, _NC); // 当检测A，B相时，不检测C相
// 或者
InlineCurrentSense current_sense  = InlineCurrentSense(shunt_resistor, gain, A0, A1); // 当检测A，B相时，不检测C相
```

### 自定义增益

`InlineCurrentSense`的构造函数仅允许你指定一个采样电阻值和一个放大增益。如果你的硬件配置对于不同的相位具有不同的分流/amp值，你可以通过更改`gain_x`属性来指定它们：

```cpp
// 每相增益默认值
current_sense.gain_a = 1.0 / shunt_resistor / gain;
current_sense.gain_b = 1.0 / shunt_resistor / gain;
current_sense.gain_c = 1.0 / shunt_resistor / gain;
```

例如，Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield </span>v2将电流感应的B相反转。因此，在这种情况下，你需要：

```cpp
// 调转电流检测b相增益
current_sense.gain_b *= -1;
```

## 初始化电流检测

电流检测创建后需要进行初始化。此`init（）`函数配置ADC硬件以进行读取，并为每个通道查找ADC的零偏移量。

```cpp
// 初始化电流检测
current_sense.init();
```

初始化函数作用：
- 为电流检测配置 ADC 
- 校准 - 去除偏移 

如果由于某种原因ADC配置失败，该函数将返回`0`，如果一切正常，该函数将返回`1`。所以我们建议你在继续之前检查 init 函数是否被成功执行:

```cpp
// 初始化电流检测
if (current_sense.init())  Serial.println("Current sense init success!");
else{
  Serial.println("Current sense init failed!");
  return;
}
```
电流感应初始化和校准后，就可以开始测量电流了！

## 使用电流传感和FOC算法
要将`InlineCurrentSense`与FOC算法结合使用，首先你需要连接电流检测到`BLDCDriver`：
```cpp
// 连接电流检测和驱动器
current_sense.linkDriver(&driver);
```
电流检测将根据不同的驱动器参数进行不同的同步和校准程序。
<blockquote class="warning">
<p class="heading"> API 改变 - <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.2.2</p>
版本v2.2.2引入了连接电流检测和驱动器程序，以便ADC和PWM计时器不同的硬件也能普遍适用，实现电流检测高级同步。
</blockquote>


驱动器连接上电流检测后，接下来就是连接电流检测到你想要使用的无刷电机上：
```cpp
// 连接电机和电流检测
motor.linkCurrentSense(&current_sense);
```
### 那么应该在FOC代码的哪个地方加入 `电流检测` 配置呢？

在`BLDCMotor` 和 `BLDCDriver` 初始化函数调用后调用电流检测初始化函数是尤为重要的。这能够保证电流检测校准时驱动器处于启用状态。此外，在用`initFOC`函数启动foc算法前调用电流检测初始化函数也是十分重要的。

因此建议代码结构如下：


```cpp
void loop(){
  .... 
  // 初始化驱动器
  driver.init();
  // 连接驱动器和电流检测
  current_sense.linkDriver(&driver);
  ....
  // 初始化电机
  motor.init();
  .... 
  // 初始化电流检测
  current_sense.init();
  // 连接电流检测和电机
  motor.linkCurrentSense(&current_sense);
  ...
  // 启动FOC
  motor.initFOC();
}
```

为确保 `BLDCDriver`和 `CurrentSense` 两个类能很好的对齐，函数 `initFOC()`必须保证电流检测的 `A` 相对应驱动器的 `A` 相，电流检测的 `B` 相对应驱动器的 `B` 相， `C`相亦是如此。为证实这点， `initFOC`将调用电流检测函数`current_sense.driverAlign(...)`.

### 与电机相位对齐 `driverAlign(...)`

通过调用以下函数完成`initFOC`里的电流检测与驱动器对齐：
```cpp
current_sense.driverAlign(voltage_sensor_align);
```
此函数用于向驱动器（用`current_sense.linkDriver(&driver)`连接电流检测）的每一相施加电压（用`motor.voltage_sensor_align`设置），而后检查所检测的电流是否与所施加的电压方向相对应。此函数可以纠正：

- 不正确的adc引脚顺序
- 不正确的增益（正或负）

如果在`initFOC`期间为电机启用 [monitoring](monitoring) ，监控器将显示对齐状态：

 - `0` - 失败
 - `1` - 成功了，且没有改变其他配置
 - `2` - 成功，但引脚重新配置
 - `3` - 成功，但增益相反
 - `4` - 成功，但引脚重新配置且增益相反

如果你在配置中确定并且希望跳过对齐过程，则可以指定在调用`motor.initFOC()`之前设置 `skip_align` 标志位：

```cpp
// 跳过校准过程
current_sense.skip_align = true;
```



例如，Arduino <span class="simple">simple<span class="foc">foc</span>Shield </span>v2，你的代码类似：

```cpp
// 对于SimpleFOCShield v2, 电流检测引脚的可能组合方案
// 分流电阻 - 10milliOhm
// 增益  - 50 V/V 
InlineCurrentSense current_sense  = InlineCurrentSense(0.01, 50.0, A0, A2);

voi loop(){
  .... 
  // 初始化驱动器
  driver.init();
  // 连接驱动器和电流检测
  current_sense.linkDriver(&driver);
  ....
  // 初始化电机
  motor.init();
  .... 
  // 初始化电流检测
  current_sense.init();
  // 连接电流检测和电机
  motor.linkCurrentSense(&current_sense);
  ...
  // 调转B相增益
  current_sense.gain_b *=-1;
  // 跳过校准
  current_sense.skip_align = true;
  ... 
  // 启动FOC
  motor.initFOC();
}
```


## 独立电流检测

配置硬件并校准后，要把在线电流检测用作独立传感器，可以通过调用以下命令读取相位电流：
```cpp
PhaseCurrent_s  current = current_sense.getPhaseCurrents();
```
此函数返回的结构体`PhaseCurrent_s`包括`a`, `b` 和 `c`三个变量。例如，你可以把它们打印出来；

```cpp
Serial.println(current.a);
Serial.println(current.b);
Serial.println(current.c); // 仅使用两相电流测量值，返回0
```
如果在`InlineCurrentSense`中仅使用两相电流测量值，则它将返回等于0的第三个电流 `current.c` 。

有时相位电流很难解释，而电流检测能够直观的读取转换后的电流矢量幅值。电机所消耗的绝对直流电流。
```cpp
float current_mag = current_sense.getDCCurrent();
```

此外，如果你可以访问与驱动器链接的电机位置传感器，则可以通过将其提供给`getDCCurrent`，获得电机正在消耗的直流电流的值。

```cpp
float current = current_sense.getDCCurrent(motor_electrical_angle);
```

最后，如果你可以访问电机位置传感器，你的电流检测类将能够告知电机当前的FOC的Q电流和Q电流。
```cpp
DQCurrent_s current = current_sense.getFOCCurrents(motor_electrical_angle);
```
此函数返回包含两个变量`d`和`q`的 `DQCurrent_s` 结构体。你可以将其打印出来，例如：

```cpp
Serial.println(current.d);
Serial.println(current.q);
```
### 示例代码
这里是一个简单的例子，使用<span class="simple">Simple<span class="foc">FOC</span>library</span>和<span class="simple">Simple<span class="foc">FOC</span>Shield</span>作为独立传感器。

```cpp
#include <SimpleFOC.h>

// 电流传感器
// 分流电阻值
// 增益值
// A相、B相引脚
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

void setup() {
  // 初始化电流检测
  current_sense.init();

  // 针对 SimpleFOCShield v2.01/v2.0.2 版本
  current_sense.gain_b *= -1;
  
  Serial.begin(115200);
  Serial.println("Current sense ready.");
}

void loop() {

    PhaseCurrent_s currents = current_sense.getPhaseCurrents();
    float current_magnitude = current_sense.getCurrent();

    Serial.print(currents.a*1000); // milli Amps
    Serial.print("\t");
    Serial.print(currents.b*1000); // milli Amps
    Serial.print("\t");
    Serial.print(currents.c*1000); // milli Amps
    Serial.print("\t");
    Serial.println(current_magnitude*1000); // milli Amps
}

```