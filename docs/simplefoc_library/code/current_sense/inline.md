---
layout: default
title: Inline Current Sense
nav_order: 1
permalink: /inline_current_sense
parent: Current Sensing
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 在线电流传感

内联电流传感技术是使用最简单、最精确的技术。分流电阻器与电机相位对齐，无论PWM占空比的状态如何，在这些分流电阻器上测量的电流都将是电机相位电流。因此，这种实现非常适合于 Arduino 设备，因为adc可以在任何时候进行采样以读取电流，并且adc采集持续时间与其他电流传感方法一样重要。这种方法的缺点是硬件，这种电流传感结构要求高精度双向放大器具有比常规低压侧或高压侧放大器更好的PWM抑制。

<img src="extras/Images/in-line.png" class="width60">

## 步骤1.硬件配置

```cpp
// InlineCurrentSensor constructor
//  - shunt_resistor  - shunt resistor value
//  - gain  - current-sense op-amp gain
//  - phA   - A phase adc pin
//  - phB   - B phase adc pin
//  - phC   - C phase adc pin (optional)
InlineCurrentSense current_sense  = InlineCurrentSense(0.01, 20, A0, A1, A2);
```
要使用 <span class="simple">Simple<span class="foc">FOC</span>library </span>实例化内联电流传感器，只需创建`InlineCurrentSense`类的实例。此类将分流电阻值`shunt_resistor`、放大增益 `gain` 和两个或三个ADC通道引脚作为参数，具体取决于你可能拥有的可用测量硬件。为正确的驱动器/电机相位指定正确的adc通道非常重要。因此，如果你的针脚`A0`测量相电流`A`，针脚 `A1` '测量相电流`B`，请确保按顺序将它们提供给构造器。

<blockquote class="info">
Field Oriented Control algorithm can run with both 2 or 3 phase current measurements.
</blockquote>

`InlineCurrentSense`的构造函数仅允许你指定一个分流电阻值和一个放大增益。如果你的硬件配置对于不同的相位具有不同的分流/amp值，你可以通过更改`gain_x`属性来指定它们：

```cpp
// default values of per phase gains
current_sense.gain_a = 1.0 / shunt_resistor / gain;
current_sense.gain_b = 1.0 / shunt_resistor / gain;
current_sense.gain_c = 1.0 / shunt_resistor / gain;
```

例如，Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield </span>v2将电流感应的B相反转。因此，在这种情况下，你可以指定：

```cpp
// inverse current sensing gain on phase b
current_sense.gain_b *= -1;
```

一旦创建了当前意义，就可以初始化它。此`init（）`函数配置ADC硬件以进行读取，并为每个通道查找ADC的零偏移量。

```cpp
// init current sense
current_sense.init();
```
一旦你的电流感应被初始化和校准，你就可以开始测量电流了！

## 使用电流传感和FOC算法
要将`InlineCurrentSense`与FOC算法结合使用，只需将其添加到与你希望使用的`BLDCMotor`的链接中：

```cpp
// link motor and current sense
motor.linkCurrentSense(&current_sense);
```
`initFOC（）`函数中对齐所有传感器的`BLDCMotor`类将把`InlineCurrentSense`与链接到电机的`BLDCDriver`对齐。

```cpp
// prepare sensors for FOC
motor.initFOC();
```
函数`initFOC（）`将调用两个重要的测量函数：

- `current_sense.driverSync(...)`
- `current_sense.driverAlign(...)`

### 驱动程序同步`driverSync(...)`
<img src="extras/Images/comparison_cs.png" class="width40">

由于内联电流传感技术不需要触发ADC采集的特定事件，`driverSync（）`函数实际上什么都不做。如上图所示，此功能对于低压侧和高压侧电流感应非常重要。

### 与电机相位对齐 `driverAlign(...)`

通过调用以下函数完成对齐：
```cpp
current_sense.driverAlign(&driver, voltage_sensor_align);
```
使用驱动器实例应用此功能将电压应用于每个相位，并检查测量的电流是否对应于施加电压的方向。
此校准程序能够纠正以下情况：

- adc引脚顺序不正确
- 不正确的增益符号

如果在`initFOC`期间为电机启用 [monitoring](monitoring) ，监控器将显示对齐状态：

 - `0` - 失败
 - `1` - 成功了，什么也没变
 - `2` - 成功，但引脚重新配置
 - `3` - 成功与增益相反
 - `4` - 成功，但引脚重新配置和增益倒置

如果你在配置中确定并且希望跳过对齐过程，则可以指定在调用`motor.initFOC()`之前设置 `skip_align` 标志：

```cpp
// skip alignment procedure
current_sense.skip_align = true;
```



例如，Arduino <span class="simple">simple<span class="foc">foc</span>Shield </span>v2，你的代码与此类似：

```cpp
// invert phase b gain
current_sense.gain_b *=-1;
// skip alignment
current_sense.skip_align = true;
...
// align all sensors
motor.initFOC();
```


## 独立电流检测

配置硬件并校准后，要将内联电流传感器用作独立传感器，可以通过调用以下命令读取相位电流：
```cpp
PhaseCurrent_s  current = current_sense.getPhaseCurrents();
```
This function returns the `PhaseCurrent_s` structure that which has three variables `a`, `b` and `c`. So you can print them out for example;

此函数返回具有三个变量`a`, `b` 和 `c`的`PhaseCurrent_s`结构。例如，你可以把它们打印出来；

```cpp
Serial.println(current.a);
Serial.println(current.b);
Serial.println(current.c); // 0 if only two currents mode
```
如果在`InlineCurrentSense`中仅使用两相电流测量值，则它将返回等于0的第三个电流 `current.c` 。

有时相位电流很难解释，而电流测量能够直观的读取转换后的电流矢量幅值。电机所消耗的绝对直流电流。
```cpp
float current_mag = current_sense.getDCCurrent();
```

此外，如果你有权访问与驱动器相连的电机位置传感器，则可以通过将其提供给`getDCCurrent`方法，获得电机正在消耗的直流电流的符号值。

```cpp
float current = current_sense.getDCCurrent(motor_electrical_angle);
```

最后，如果你有权访问电机位置传感器，你的电流感应类将能够告诉你电机正在绘制的FOC电流D和Q。
```cpp
DQCurrent_s current = current_sense.getFOCCurrents(motor_electrical_angle);
```
此函数返回具有两个变量`d`和`q`的 `DQCurrent_s` 结构。你可以将其打印出来，例如：

```cpp
Serial.println(current.d);
Serial.println(current.q);
```
### 示例代码
这里是一个简单的例子，使用<span class="simple">Simple<span class="foc">FOC</span>library</span>和<span class="simple">Simple<span class="foc">FOC</span>Shield</span>作为独立传感器。

```cpp
#include <SimpleFOC.h>

// current sensor
// shunt resistor value
// gain value
// pins phase A,B
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

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