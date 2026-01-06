---
layout: default
title: 无刷直流电机
nav_order: 1
permalink: /bldcmotor
parent: 电机配置代码
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 无刷直流电机配置

<div class="width60">
<img src="extras/Images/mot2.jpg" style="width:30%;display:inline"><img src="extras/Images/bigger.jpg" style="width:30%;display:inline"><img src="extras/Images/mot.jpg" style="width:30%;display:inline">
</div>

所有无刷直流电机都由`BLDCMotor`类处理。该类实现了：
- 无刷直流电机FOC算法
- 运动控制环路
- 监控功能

## 步骤1. 创建无刷直流电机实例
要实例化无刷直流电机，我们需要创建`BLDCMotor`类的一个实例，并为其提供电机的`极对数`。
```cpp
//  BLDCMotor(int pp, (optional R, KV))
//  - pp  - pole pair number
//  - R   - phase resistance value - optional
//  - KV  - motor KV rating [rpm/V] - optional
BLDCMotor motor = BLDCMotor(11, 10.5, 120);
```

<blockquote class="info"><p class="heading">极对数</p>
如果不确定`极对数`是多少，库中提供了一个示例代码来估算`极对数`，该示例位于`examples/utils/calibration/find_pole_pairs_number.ino`。
</blockquote>

<blockquote class="warning" markdown="1">
<p class="heading">经验法则：KV值</p>
我们建议将提供给库的`KV`值设置为比数据表中给出的或通过实验确定的KV值高50-70%。根据电机的机械结构，合适的值将在电机KV额定值的100%到200%之间。
</blockquote>

<blockquote class="info" markdown="1">
<p class="heading">查找KV额定值</p>
如果不确定电机的`KV`值，可以通过在电压转矩控制下，将设定值设为1伏时电机的速度`velocity_at_one_volt`轻松找到。KV额定值的单位是转每分钟每伏，而<span class="simple">Simple<span class="foc">FOC</span>库</span>使用弧度每秒而不是转每分钟。当获得1伏设定值下达到的速度时，可以将其乘以$$30/\pi$$。

```cpp
KV = velocity_at_one_volt * 30/pi
```

你也可以使用提供的库示例`examples/utils/calibration/find_KV_rating.ino`。
</blockquote>


### 电机相电阻、电感和KV额定值 
结合相电阻（在基于电流的转矩模式`foc_current`和`dc_current`中不太常用）提供KV额定值，将使用户能够在不测量电流的情况下控制电机电流。用户将能够使用电压控制模式控制（和限制）电机的估算电流。更多信息请参见[转矩控制文档](voltage_torque_mode)。

在很多方面，使用电流而非电压更好，因为无刷直流电机的转矩与电流成正比，而不是与电压成正比，特别是因为相同的电压值会对不同的电机产生非常不同的电流（由于相电阻不同）。一旦提供了相电阻值，用户将能够为其无刷直流电机设置电流限制，而不是电压限制，这更容易理解。

需要说明的是，一旦指定了相电阻值，很可能需要重新调整[速度运动控制](velocity_loop)和[角度运动控制](angle_loop)参数，因为电压和电流值的数量级不同。经验法则是将所有的`P`、`I`和`D`增益除以`motor.phase_resistance`值，这将是一个很好的起点。

最后，如果要在基于电压（[电压模式](voltage_torque_mode)）和基于电流（[直流电流](dc_current_torque_mode)和[FOC电流](foc_current_torque_mode)）的转矩控制策略之间实时切换，建议使用此参数。因为通过这种方式，所有的转矩控制环路都将以电流作为输入（目标值），用户不必更改运动控制参数（PID值）。

<blockquote class="info">
<p class="heading">开环运动控制将使用KV和相电阻值</p>
KV额定值和相电阻值也将用于开环控制，以便用户限制电机汲取的电流，而不是限制电压。更多信息请参见<a href="open_loop_motion_control">开环运动控制文档</a>。
</blockquote>

### 如何测量相电阻和电感？

相电阻相对容易测量，可以使用万用表测量电机各相的电阻。这里有一个关于如何测量无刷直流电机相电阻和电感的[简短指南](phase_resistance)。相电感的测量稍微复杂一些，因为没有多少万用表可以直接测量电感。

然而，<span class="simple">Simple<span class="foc">FOC</span>库</span>提供了测量电机相电阻和电感的工具。为了测量它们，你需要能够测量电流。

一旦设置好电流传感器，就可以使用`motor.characteriseMotor()`函数来测量相电阻和电感。该函数将运行一系列测试来确定这些参数，并将它们打印到串行监视器上。


<blockquote class="info">

<details markdown="1">
<summary style="cursor: pointer;"> <i class="fa fa-code"></i> 电机相位特性示例代码 </summary>

```cpp

#include <SimpleFOC.h>

// Stepper motor & BLDC driver instance
BLDCMotor motor = BLDCMotor(11);
// SimpleFOCShield
BLDCDriver3PWM driver = BLDCDriver3PWM(6, 10, 5, 8);

// inline current sensor instance
// ACS712-05B has the resolution of 0.185mV per Amp
LowsideCurrentSense current_sense = LowsideCurrentSense(185.0f, A0, A2);

void setup() {

  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 20;
  driver.init();
  // link driver
  motor.linkDriver(&driver);
  // link current sense and the driver
  current_sense.linkDriver(&driver);

  // current sense init and linking
  current_sense.init();
  motor.linkCurrentSense(&current_sense);

  // initialise motor
  motor.init();

  // find the motor parameters
  motor.characteriseMotor(3.5f);


  _delay(1000);
}


void loop() {
  // do nothing
  _delay(1000);
}
```

characteriseMotor函数的输出会打印到串行监视器上，内容如下：

```
MOT: Init
MOT: Enable driver.
MOT: Measuring phase to phase resistance, keep motor still...
MOT: Estimated phase to phase resistance: 5.94
MOT: Measuring inductance, keep motor still...
MOT: Inductance measurement complete!
MOT: Measured D-inductance in mH: 0.50
MOT: Measured Q-inductance in mH: 0.59
```

目前，SimpleFOC库认为 q 轴和 d 轴的电感值是相同的。因此，执行该示例后，请将 q 轴的电感值用于motor.phase_inductance参数。

</details>
</blockquote>


## 步骤2. 连接传感器
定义好`motor`并初始化传感器后，需要通过执行以下操作来连接`motor`和`sensor`： 
```cpp
// link the sensor to the motor
motor.linkSensor(&sensor);
```

linkSensor方法能够将电机与本库中实现的任何传感器相连接。该sensor将用于 FOC 算法确定电机的电气位置，以及用于速度和位置的运动控制环。更多信息请参见[位置传感器文档](sensors)！

<blockquote class="info">使用开环运动控制时无需连接。</blockquote>

## Step 3. 连接驱动器
定义好`motor`并初始化驱动器后，需要通过执行以下操作来连接`motor`和`driver`：  
```cpp
// link the driver to the motor
motor.linkDriver(&driver);
```

`BLDCMotor`类期望接收一个`BLDCDriver`类实例，默认由`BLDCDriver3PWM`和`BLDCDriver6PWM`类实现。`driver`处理与特定微控制器架构和驱动器硬件相关的所有硬件特定操作。更多信息请参见[bldc驱动器文档](bldcdriver)！


## 步骤4. 连接电流传感器
如果有电流传感器`current_sense`，可以使用以下方式将其连接到`motor`：
```cpp
// link the current sensor to the motor
motor.linkCurrentSense(&current_sense);
```
此连接步骤仅在拥有本库支持的电流传感器时才需要。更多信息请参见[电流传感文档](current_sense)！

## 步骤5. 配置参数

如果选择不设置某些配置参数，它们将采用`defaults.h`文件中定义的值。
查看[库源代码](source_code)以深入了解。

### 步骤5.1 PWM调制类型

无刷直流电机实现了四种磁场定向控制调制类型：
- 正弦PWM调制
- 空间矢量PWM调制
- 方波换向 - *有利于电流控制应用*
    - 梯形120
    - 梯形150

可以通过更改`motor.foc_modulation`变量来设置它们：
```cpp
// choose FOC modulation
// FOCModulationType::SinePWM; (default)
// FOCModulationType::SpaceVectorPWM;
// FOCModulationType::Trapezoid_120;
// FOCModulationType::Trapezoid_150;
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```
正弦PWM和空间矢量换向模式将产生正弦电流和平稳运行，但方波换向执行速度更快，因此更适合更高的速度。建议将梯形120换向与霍尔传感器一起使用。其他换向模式也可以工作，但这种模式将具有最佳性能。

<blockquote class="info"> <p class="heading">FOC电流转矩控制要求</p> FOC转矩控制需要正弦电流，因此请使用正弦PWM或空间矢量PWM</blockquote>

有关这些方法的理论和源代码实现的更多信息，请查看[FOC实现文档](foc_implementation)或访问[深入挖掘部分](digging_deeper)。


### 步骤5.2 传感器和电机对齐参数
用于电机和传感器对齐的电压设置变量`motor.voltage_sensor_align`：
```cpp
// aligning voltage [V]
motor.voltage_sensor_align = 3; // default 3V
```

如果你的传感器是编码器并且它有一个索引引脚，可以通过设置变量`motor.velocity_index_search`来设置索引搜索速度值：

```cpp
// incremental encoder index search velocity [rad/s]
motor.velocity_index_search = 3; // default 1 rad/s
```

### 步骤5.3 位置传感器偏移
对于某些应用，指定传感器绝对零偏移是很方便的，可以通过更改参数`motor.sensor_offset`来定义：
```cpp
// sensor offset [rad]
motor.sensor_offset = 0; // default 0 rad
```
此参数可以实时更改。


### 步骤5.4 电机相电阻和KV额定值

电机相电阻和KV额定值是可选参数，在基于电流的转矩模式中不使用。这些变量用于估算电压转矩模式和开环运动控制中的电机电流。如果用户指定了`motor.phase_resistance`和`motor.KV_rating`（无论是在构造函数中还是在`setup()`函数中），库将允许用户使用电流值，并会自动计算所需的电压。在设置函数中，可以通过以下方式更改此参数：

```cpp
// motor phase resistance [Ohms]
motor.phase_resistance = 2.54; // Ohms - default not set
// motor KV rating [rpm/V]
motor.KV_rating = 100; // rpm/volt - default not set
```

更多信息请参见[转矩控制文档](voltage_torque_mode)。

### 步骤5.5 转矩控制模式
Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>中实现了3种不同的转矩控制模式：
- [电压模式](voltage_torque_mode)
- [直流电流](dc_current_torque_mode)
- [FOC电流](foc_current_torque_mode)

[直流电流](dc_current_torque_mode)和[FOC电流](foc_current_torque_mode)需要电流传感，并控制和限制电机汲取的实际电流，而[电压模式](voltage_torque_mode)估算电机电流，不使用任何电流传感。更多信息请参见[转矩控制文档](torque_control)。

可以通过更改电机属性`torque_controller`来设置转矩模式。
```cpp
// set torque mode to be used
// TorqueControlType::voltage    ( default )
// TorqueControlType::dc_current
// TorqueControlType::foc_current
motor.torque_controller = TorqueControlType::foc_current;
```

### 步骤5.6 运动控制参数

Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>中实现了3种不同的闭环控制策略：
- [转矩控制环](torque_control)
- [速度运动控制](velocity_loop)
- [位置/角度运动控制](angle_loop)

此外，<span class="simple">Simple<span class="foc">FOC</span>库</span>还实现了两种开环控制策略：
- [速度开环控制](velocity_openloop)
- [位置开环控制](angle_openloop)

可以通过更改`motor.controller`变量来设置。
```cpp
// set motion control loop to be used
// MotionControlType::torque      - torque control 
// MotionControlType::velocity    - velocity motion control
// MotionControlType::angle       - position/angle motion control
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle;
```
<blockquote class="warning"><p class="heading">重要！</p>此参数没有默认值，必须在实时执行开始前设置。</blockquote>

每种运动控制策略都有其自己的参数，你可以在[运动控制文档](motion_control)中找到更多关于它们的信息。
```cpp
// set control loop type to be used
motor.controller = MotionControlType::angle;

// controller configuration based on the control type 
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;

// velocity low pass filtering time constant
motor.LPF_velocity.Tf = 0.01;

// angle loop controller
motor.P_angle.P = 20;

// motion control limits
// angle loop velocity limit
motor.velocity_limit = 50;
// either voltage limit
motor.voltage_limit = 12; // Volts -  default driver.voltage_limit
// or current limit - if phase_resistance set
motor.current_limit = 1; // Amps -  default 2 Amps
```

### 步骤5.7 配置完成 - `motor.init()`
最后，通过运行`init()`函数终止配置，该函数使用配置的值准备所有硬件和软件电机组件。
```cpp
// initialize motor
motor.init();
```

## 步骤6. 对齐电机和所有传感器 - 磁场定向控制初始化

在配置好位置传感器、电流传感、驱动器和电机之后，在开始运动控制之前，我们需要对齐所有硬件组件以初始化FOC算法。这在函数`motor.initFOC()`的范围内完成。
```cpp
// align sensor and start FOC
motor.initFOC();
```
<blockquote class="info"><p class="heading">开环控制可以跳过！</p>如果没有连接传感器，此函数实际上不会做任何事情，但如果有必要或更方便，你仍然可以调用它。</blockquote>


此函数做几件事：
- 检查驱动器（和电流传感，如果有的话）是否已正确初始化
- 检查/修改位置传感器方向相对于电机方向
- 必要时搜索编码器索引
- 找到电机相对于位置传感器的电气偏移
- 检查/修改电流传感引脚分配和增益符号（如果有），以确保其与驱动器对齐

如果由于某种原因`initFOC`失败，此函数将返回`0`，并将禁用你的电机，并显示错误信息（当使用[监控](monitoring)时）。如果所有配置都正确，调用此函数将返回`1`，我们的设置完成，FOC准备好使用了！因此，我们建议在继续之前检查初始化函数是否成功执行：

```cpp
// init current sense
if (motor.initFOC())  Serial.println("FOC init success!");
else{
  Serial.println("FOC init failed!");
  return;
}
```

对齐过程将不得不多次移动你的电机，这可能不是理想的行为，因此对于大多数位置传感器（编码器除外）和电流传感器，可以通过执行步骤6.1和6.2跳过此对齐过程。

### 步骤6.1 跳过对齐 - 位置传感器

如果你使用的是绝对传感器，如磁性传感器或霍尔传感器，一旦完成对齐过程，并且一旦获得电机的零电气偏移和传感器方向，就不再需要完整的校准序列。

在这种情况下，可以在电机参数中设置传感器偏移`zero_electric_offset`和传感器方向`sensor_direction`，以避免对齐过程：
```cpp
// set calibration values
motor.zero_electric_offset  = 2.15; // rad
motor.sensor_direction = Direction::CW; // CW or CCW
// then call initFOC()
motor.initFOC();
```
你可以通过运行`find_sensor_offset_and_direction.ino`示例找到这些值。

如果你设置这两个值中的任何一个，`initFOC`将跳过校准的该部分。例如，对于编码器传感器，零电气偏移会一直变化，但传感器方向将保持不变，因此你可以提供它并跳过大部分校准序列。

### 步骤6.2 跳过对齐 - 电流传感

对于电流传感器，也可以避免校准过程，这是通过指定称为`skip_align`的电流传感标志来完成的：
```cpp
current_sense.skip_align  = true; // default false
```
但要确保所有增益都设置正确，并且所有ADC引脚都与驱动器/电机相对齐。有关对齐的更多信息，请访问[电流传感文档](current_sense)。

## 步骤7. 实时运动控制

Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>的实时运动控制通过两个函数实现：
- `motor.loopFOC()` - 低级转矩控制
- `motor.move(float target)` - 高级运动控制


函数`loopFOC()`的行为直接取决于所使用的转矩控制模式。如果在电压模式下使用，它从传感器获取当前电机角度，将其转换为电气角度，并将q轴<i>U<sub>q</sub></i>电压命令`motor.voltage_q`转换为适当的相电压<i>u<sub>a</sub></i>、<i>u<sub>b</sub></i>和<i>u<sub>c</sub></i>，然后将这些电压设置到电机。而如果在直流或FOC电流模式下使用，它还会读取电流传感器并运行闭环电流控制。

```cpp
// Function running the low level torque control loop
// it calculates the gets motor angle and sets the appropriate voltages 
// to the phase pwm signals
// - the faster you can run it the better Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```

<blockquote class="info"><p class="heading">开环控制可以跳过！</p>如果电机运行在开环模式，此函数将无效！</blockquote>

此函数的执行时间在电压模式和电流控制模式中都至关重要。因此，`motor.loopFOC()`函数的执行速度越快越好。

<blockquote class="warning"><p class="heading">经验法则：执行时间</p>
你能运行此函数的速度越快越好，以下是使用不同转矩模式的近似循环执行时间。
<table>
<tr>
<td>MCU</td>
<td><a href="voltage_torque_mode">电压模式</a></td>
<td><a href="dc_current_torque_mode">直流电流</a></td>
<td><a href="foc_current_torque_mode">FOC电流</a></td>
</tr>
<tr>
<td>Arduino UNO</td>
<td>~ 700 us</td>
<td>~ 1.2 ms</td>
<td>~ 1.5 ms</td>
</tr>
<tr>
<td>ESP32</td>
<td>~ 100 us</td>
<td>~ 200 us</td>
<td>~ 300 us</td>
</tr>
<tr>
<td>Bluepill</td>
<td>~ 200 us</td>
<td>~ 500 us</td>
<td>~ 700 us</td>
</tr>
<tr>
<td>Nucleo</td>
<td>~ 100 us</td>
<td>~ 150 us</td>
<td>~ 200 us</td>
</tr>
</table>
</blockquote>


最后，一旦我们有了一种使用FOC算法向电机设置转矩命令（电流<i>i<sub>q</sub></i>或电压<i>u<sub>q</sub></i>）的方法，我们就可以进行运动控制了。这通过`motor.move()`函数完成。
```cpp
// Function executing the motion control loops configured by the motor.controller parameter of the motor. 
// - This function doesn't need to be run upon each loop execution - depends of the use case
//
// target  Either torque, angle or velocity based on the motor.controller
//         If it is not set the motor will use the target set in its variable motor.target
motor.move(target);
```

`move()`方法执行由电机的`motor.controller`变量配置的运动控制环路。它执行纯转矩环、速度环或角度环。

它接收一个参数`float target`，这是用户定义的当前目标值。
- 如果用户运行[速度环](velocity_loop)或[速度开环](velocity_openloop)，`move`函数将把`target`解释为目标速度。
- 如果用户运行[角度环](angle_loop)或[角度开环](angle_openloop)，`move`将把`target`参数解释为目标角度。
- 如果用户运行[转矩环](torque_control)，`move`函数将把`target`参数解释为电压<i>u<sub>q</sub></i>或电流<i>i<sub>q</sub></i>（如果提供了相电阻）。

`target`参数是可选的，如果未设置，目标值将由公共电机变量`motor.target`设置。等效代码如下：


```cpp
motor.target = 2;
motor.move();
```

## 步骤7.1 运动控制下采样
对于许多运动控制应用，为每个运动控制环运行多个转矩控制环是有意义的。这可以对平滑度产生很大影响，并能提供更好的高速性能。因此，该库为`move()`函数启用了一种非常简单的下采样策略，通过参数`motor.motion_downsample`设置：
```cpp
// downsampling value
motor.motion_downsample = 5; // - times (default 0 - disabled)
```
下采样策略的工作方式非常简单，即使在每个arduino`loop`中调用`motor.move()`，它也只会在每`motor.motion_downsample`次调用时执行一次。此参数是可选的，可以实时配置。

<blockquote class="warning"><p class="heading">注意：运动控制影响</p>
不同的下采样值可能需要对运动参数进行一些调整。</blockquote>


这样，你就有了完整的带有运动控制的磁场定向控制无刷直流电机。
## 用户交互

<span class="simple">Simple<span class="foc">FOC</span>库</span>实现了两种类型的实时用户交互：

- [监控功能](monitoring)
- [电机命令](communication)


## 深入挖掘
有关FOC算法和运动控制方法的更多理论解释和源代码实现，请查看[深入挖掘部分](digging_deeper)。

## 示例代码
一个使用基于FOC算法的电压的简单无刷直流电机转矩控制示例。
```cpp
/**
 * Torque control example using voltage control loop.
 */
#include <SimpleFOC.h>

// BLDC motor instance
BLDCMotor motor = BLDCMotor(11);
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
// sensor instance
MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C);

void setup() { 
  
  // initialize encoder sensor hardware
  sensor.init();
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // aligning voltage
  motor.voltage_sensor_align = 3;
  
  // choose FOC modulation
  motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

  // set torque mode
  motor.torque_controller = TorqueControlType::voltage;
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  _delay(1000);
}

// target voltage to be set to the motor
float target_voltage = 2;

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(target_voltage);
}
```
