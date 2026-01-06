---
layout: default
title: 步进电机
nav_order: 2
permalink: /steppermotor
parent: 电机配置代码
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 步进电机配置

<div class="width60">
<img src="extras/Images/nema17_2.jpg" style="width:30%;display:inline"><img src="extras/Images/nema17_1.jpg" style="width:30%;display:inline"><img src="extras/Images/nema23.jpg" style="width:30%;display:inline">
</div>

所有步进电机都由`StepperMotor`类处理。该类实现了：
- 步进电机FOC算法
- 运动控制环路
- 监控功能

使用<span class="simple">Simple<span class="foc">FOC</span>库</span>驱动步进电机主要有两种方式：

类 | 驱动器类型 | 优点 | 缺点 
---- | ---- | ----
`StepperMotor` | `StepperDriver4PWM` <br> `StepperDriver2PWM` | ✔️ 能利用电机的全电压容量（速度）<br> ✔️ 易于理解 | ❌ 2/4 PWM步进驱动器的选择非常有限 
`HybridStepperMotor` | `BLDCDriver3PWM` <br> `BLDCDriver6PWM` | ✔️ 可以使用任何常规的BLDC驱动器 | ❌ 电机的电压容量（速度）降低（最大70%）<br> ❌ 理解起来稍复杂

这两个类都实现了FOC算法、运动控制环路以及电流检测，因此类的选择取决于可用的硬件。


## 步骤1. 创建步进电机实例
要创建步进电机实例，需要指定电机的`极对数`。


<a href="javascript:show('stepper','motor');" class="btn btn-stepper btn-motor btn-primary">StepperMotor</a> 
<a href="javascript:show('hybrid','motor');" class="btn btn-hybrid btn-motor">HybridStepperMotor</a> 


<div class="motor motor-stepper"  markdown="1">
```cpp
// StepperMotor(  int pp, (optional R, KV, L))
// - pp            - pole pair number 
// - R             - motor phase resistance - optional
// - KV            - motor kv rating (rmp/v) - optional
// - L             - motor phase inductance [H] - optional
StepperMotor motor = StepperMotor(50, 1.5, 20.6, 0.01);
```
</div>

<div class="motor motor-hybrid hide"  markdown="1">
```cpp
// HybridStepperMotor(  int pp, (optional R, KV, L))
// - pp            - pole pair number
// - R             - motor phase resistance - optional
// - KV            - motor kv rating (rmp/v) - optional
// - L             - motor phase inductance [H] - optional
HybridStepperMotor motor = HybridStepperMotor(50, 1.5, 20.6, 0.01);
```
</div>

<blockquote class="info"><p class="heading">极对数</p>
大多数步进电机是每转200步的电机，这使它们成为50极对电机。实际上，可以通过将每转步数除以<code class="highlighter-rouge">4</code>来得到<code class="highlighter-rouge">pole_pairs</code>数。<br><br>
如果不确定<code class="highlighter-rouge">pole_pairs</code>数是多少，库提供了一个示例代码来估算<code class="highlighter-rouge">pole_pairs</code>数，该示例在<code class="highlighter-rouge">examples/utils/calibration/find_pole_pairs_number.ino</code>中。
 </blockquote>

<blockquote class="warning" markdown="1">
<p class="heading">经验法则：KV值</p>
我们建议将提供给库的`KV`值设置为比数据手册中给出的或通过实验确定的KV值高50-70%。根据电机的机械结构，合适的值将在电机KV额定值的100%到200%之间。
</blockquote>

<blockquote class="info" markdown="1">
<p class="heading">查找KV额定值</p>
如果不确定电机的<code class="highlighter-rouge">KV</code>值，可以很容易地在电压扭矩控制下，将设定值设为1伏时电机的速度来确定，即<code class="highlighter-rouge">velocity_at_one_volt</code>。KV额定值的单位是转每分钟每伏，而<span class="simple">Simple<span class="foc">FOC</span>库</span>使用弧度每秒而不是转每分钟。因此，当获得1伏设定值下达到的速度时，可以将其乘以$$30/\pi$$ 

```cpp
KV = velocity_at_one_volt * 30/pi
```
你也可以使用提供的库示例`examples/utils/calibration/find_KV_rating.ino`。
<br>

</blockquote>

### 电机相电阻和KV额定值
结合相电阻（在基于电流的扭矩模式`foc_current`和`dc_current`中不太常用）提供KV额定值，将使用户能够在不测量电流的情况下控制电机电流。用户将能够使用电压控制模式来控制（和限制）电机的估计电流。更多信息请参见[扭矩控制文档](voltage_torque_mode)。

在许多方面，使用电流而不是电压更好，因为BLDC电机的扭矩与电流成正比，而不是与电压成正比，特别是因为相同的电压值会对不同的电机产生非常不同的电流（由于不同的相电阻）。一旦提供了相电阻值，用户将能够为其BLDC电机设置电流限制，而不是电压限制，这更容易理解。

需要说明的是，一旦指定了相电阻值，很可能需要重新调整[速度运动控制](velocity_loop)和[角度运动控制](angle_loop)参数，因为电压和电流值的数量级不同。经验法则是将所有`P`、`I`和`D`增益除以`motor.phase_resistance`值，这将是一个很好的起点。

最后，如果要在基于电压（[电压模式](voltage_torque_mode)）和基于电流（[直流电流](dc_current_torque_mode)和[FOC电流](foc_current_torque_mode)）的扭矩控制策略之间实时切换，建议使用此参数。因为这样所有的扭矩控制环路都将以电流作为输入（目标值），用户不必更改运动控制参数（PID值）。


<blockquote class="info">
<p class="heading">开环运动控制将使用KV和相电阻值  </p>
KV额定值和相电阻值也将用于开环控制，以允许用户限制电机消耗的电流，而不是限制电压。更多信息请参见
<a href="open_loop_motion_control">开环运动控制文档</a>。
</blockquote>


## 步骤2. 连接传感器
定义好`motor`并初始化传感器后，需要通过执行以下命令将`motor`和`sensor`连接起来：    
```cpp
// link the sensor to the motor
motor.linkSensor(&sensor);
```
`linkSensor`方法能够将电机链接到该库中实现的任何传感器。`sensor`将用于确定FOC算法的电机电气位置以及速度和位置的运动控制环路。有关更多信息，请参见[位置传感器文档](sensors)！

<blockquote class="info">使用开环运动控制时无需链接。</blockquote>

## 步骤3. 连接驱动器
定义好`motor`并初始化驱动器后，需要通过执行以下命令将`motor`和`driver`连接起来：  
```cpp
// link the driver to the motor
motor.linkDriver(&driver);
```

`StepperMotor`类期望接收`StepperDriver`类实例，而`HybridStepperMotor`可以接收`BLDCDriver`实例。`driver`处理与特定微控制器架构和驱动器硬件相关的所有硬件特定操作。有关更多信息，请参见[步进驱动器文档](stepperdriver)！


类 | 驱动器类型
---- | ----
`StepperMotor` | `StepperDriver4PWM` <br> `StepperDriver2PWM`
`HybridStepperMotor` | `BLDCDriver3PWM` <br> `BLDCDriver6PWM`

## 步骤4. 配置

如果选择不设置某些配置参数，它们将采用`defaults.h`文件中定义的值。
查看[库源代码](source_code)以深入了解。

### 步骤4.1 PWM调制类型

可以通过更改`motor.foc_modulation`变量来设置它们：
```cpp
// choose FOC modulation
// FOCModulationType::SinePWM;
motor.foc_modulation = FOCModulationType::SinePWM;
```
目前，`StepperMotor`类仅实现了正弦PWM调制<a href="https://github.com/simplefoc/Arduino-FOC/releases"> <i class="fa fa-tag"> 当前版本</i></a>，而`HybridStepperMotor`类支持正弦PWM和空间矢量PWM调制，其中空间矢量PWM效率更高，能提供更好的性能。


类 | FOC调制类型
---- | ----
`StepperMotor` | `FOCModulationType::SinePWM`
`HybridStepperMotor` | `FOCModulationType::SinePWM` <br> `FOCModulationType::SpaceVectorPWM`（推荐）

有关这些方法的理论和源代码实现的更多信息，请查看[FOC实现文档](foc_implementation)或访问[深入探讨部分](digging_deeper)。


### 步骤4.2 传感器和电机对齐参数
用于电机和传感器对齐的电压设置变量`motor.voltage_sensor_align`：
```cpp
// aligning voltage [V]
motor.voltage_sensor_align = 3; // default 3V
```

如果传感器是编码器并且有索引引脚，可以通过设置变量`motor.velocity_index_search`来设置索引搜索速度值：
```cpp
// incremental encoder index search velocity [rad/s]
motor.velocity_index_search = 3; // default 1 rad/s
```

### 步骤4.3 位置传感器偏移
对于某些应用，指定传感器绝对零偏移是很方便的，可以通过更改参数`motor.sensor_offset`来定义：
```cpp
// sensor offset [rad]
motor.sensor_offset = 0; // default 0 rad
```
此参数可以实时更改。


### 步骤4.4 电机相电阻和KV额定值

电机相电阻和KV额定值是可选参数，在基于电流的扭矩模式中不使用。这些变量用于在电压扭矩模式和开环运动控制中估算电机电流。如果用户指定了`motor.phase_resistance`和`motor.KV_rating`（无论是在构造函数中还是在`setup()`函数中），库将允许用户使用电流值，并会自动计算必要的电压。在设置函数中，可以通过以下方式更改此参数：
```cpp
// motor phase resistance [Ohms]
motor.phase_resistance = 2.54; // Ohms - default not set
// motor KV rating [rpm/V]
motor.KV_rating = 100; // rpm/volt - default not set
```

更多信息请参见[扭矩控制文档](voltage_torque_mode)。


### 步骤4.5 运动控制参数  

Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>实现了3种不同的闭环控制策略：
- [使用电压的扭矩控制环路](torque_control)
- [位置/角度运动控制](angle_loop)
- [速度运动控制](velocity_loop)

此外，<span class="simple">Simple<span class="foc">FOC</span>库</span>还实现了两种开环控制策略：
- [位置开环控制](angle_openloop)
- [速度开环控制](velocity_openloop)

通过更改`motor.controller`变量来设置：
```cpp
// set FOC loop to be used
// MotionControlType::torque      - torque control loop using voltage
// MotionControlType::velocity    - velocity motion control
// MotionControlType::angle       - position/angle motion control
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle;
```
<blockquote class="warning"><p class="heading">重要！</p>此参数没有默认值，必须在实时执行开始前设置。</blockquote>

每种运动控制策略都有其自己的参数，更多信息可以在[运动控制文档](motion_control)中找到。

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

### 步骤4.7 配置完成 - `motor.init()`
最后，通过运行`init()`函数终止配置，该函数使用配置的值准备所有硬件和软件电机组件。
```cpp
// initialize motor
motor.init();
```

## 步骤5. 对齐电机和所有传感器 - 磁场定向控制初始化

在配置好位置传感器、驱动器和电机之后，在开始运动控制之前，需要对齐所有硬件组件以初始化FOC算法。这在`motor.initFOC()`函数的范围内完成：
```cpp
// align sensor and start FOC
motor.initFOC();
```
<blockquote class="info"><p class="heading">开环控制可以跳过！</p>如果没有连接传感器，此函数实际上不会做任何事情，但如果有必要或更方便，仍然可以调用它。</blockquote>


此函数做了几件事：
- 检查驱动器（和电流检测，如果可用）是否初始化良好
- 检查/修改位置传感器方向相对于电机方向
- 必要时搜索编码器索引
- 找到相对于位置传感器的电机电气偏移
- 检查/修改电流检测引脚分配和增益符号（如果有），以确保其与驱动器对齐


如果由于某种原因`initFOC`失败，此函数将返回`0`，并会禁用电机，并显示错误信息（当使用[监控](monitoring)时）。如果所有配置都正确，调用此函数将返回`1`，设置完成，FOC可以使用了！因此，建议在继续之前检查初始化函数是否成功执行：

```cpp
// init current sense
if (motor.initFOC())  Serial.println("FOC init success!");
else{
  Serial.println("FOC init failed!");
  return;
}
```
对齐过程必须多次移动电机，这可能不是理想的行为，因此对于大多数位置传感器（编码器除外）和电流检测，可以通过步骤5.1跳过此对齐过程。

### 步骤5.1 跳过对齐 - 位置传感器

如果使用绝对传感器，如磁性传感器或霍尔传感器，一旦完成对齐过程，并且知道电机的零电气偏移传感器方向，就不再需要完整的校准序列。因此，可以向`motor.initFOC()`提供传感器偏移`zero_electric_offset`和传感器方向`sensor_direction`，以避免对齐过程：
```cpp
// align sensor and start FOC
//motor.initFOC(zero_electric_offset, sensor_direction);
motor.initFOC(2.15, Direction::CW);
```
也可以通过使用电机参数来完成：
```cpp
// align sensor and start FOC
motor.zero_electric_offset  = 2.15; // rad
motor.sensor_direction = Direction::CW; // CW or CCW
motor.initFOC();
```
可以通过运行`find_sensor_offset_and_direction.ino`示例找到这些值。

更一般地说，如果知道这两个值中的任何一个，一定要提供，`iniFOC`将跳过校准的该部分。例如，对于编码器传感器，零电气偏移会一直变化，但传感器方向会保持不变，因此可以提供它并跳过大部分校准序列。

## 步骤6. 实时运动控制

Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>的实时运动控制通过两个函数实现：
- `motor.loopFOC()` - 低级扭矩控制
- `motor.move(float target)` - 高级运动控制


`loopFOC()`函数实现扭矩控制环路。由于步进电机仅支持[使用电压模式的扭矩](voltage_torque_mode)，此函数将从传感器读取当前电机角度，将其转换为电气角度，并将q轴<i>U<sub>q</sub></i>电压命令`motor.voltage_q`转换为适当的相电压<i>u<sub>a</sub></i>、<i>u<sub>b</sub></i>和<i>u<sub>c</sub></i>，然后将这些电压设置到电机。如果提供了步进电机的相电阻和KV额定值，此函数还将计算估计电流，用户将能够直接控制此估计电流值<i>I<sub>q</sub></i>。

```cpp
// Function running the low level torque control loop
// it calculates the gets motor angle and sets the appropriate voltages 
// to the phase pwm signals
// - the faster you can run it the better Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```

<blockquote class="info"><p class="heading">开环控制可以跳过！</p>如果电机以开环方式运行，此函数将无效！</blockquote>

此函数的执行时间至关重要，因此`motor.loopFOC()`函数的执行速度越快越好。

<blockquote class="warning"><p class="heading">经验法则：执行时间</p>
这个函数运行得越快越好 😃
</blockquote>

最后，一旦有了使用FOC算法向电机设置扭矩命令（电流<i>I<sub>q</sub></i>或电压<i>U<sub>q</sub></i>）的方法，就可以进行运动控制了。这通过`motor.move()`函数完成：
```cpp
// Function executing the motion control loops configured by the motor.controller parameter of the motor. 
// - This function doesn't need to be run upon each loop execution - depends of the use case
//
// target  Either torque, angle or velocity based on the motor.controller
//         If it is not set the motor will use the target set in its variable motor.target
motor.move(target);
```

`move()`方法执行算法的运动控制环路。它由`motor.controller`变量控制。它执行纯扭矩环路、速度环路或角度环路。

它接收一个参数`float target`，这是用户定义的当前目标值。
- 如果用户运行[速度环路](velocity_loop)或[速度开环](velocity_openloop)，`move`函数将把`target`解释为目标速度。
- 如果用户运行[角度环路](angle_loop)或[角度开环](angle_openloop)，`move`将把`target`参数解释为目标角度。
- 如果用户运行[扭矩环路](torque_control)，`move`函数将把`target`参数解释为电压<i>u<sub>q</sub></i>或电流<i>i<sub>q</sub></i>（如果提供了相电阻）。


`target`参数是可选的，如果未设置，目标值将由公共电机变量`motor.target`设置。等效代码如下：

```cpp
motor.target = 2;
motor.move();
```

## 步骤6.1 运动控制下采样
对于许多运动控制应用，为每个运动控制环路运行多个扭矩控制环路是有意义的。这对平滑度有很大影响，并能提供更好的高速性能。因此，该库为`move()`函数启用了一种非常简单的下采样策略，通过参数`motor.motion_downsample`设置：
```cpp
// downsampling value
motor.motion_downsample = 5; // - times (default 0 - disabled)
```
下采样策略的工作方式非常简单，即使在每个arduino`loop`中调用`motor.move()`，它也只会每`motor.motion_downsample`次调用执行一次。此参数是可选的，可以实时配置。

<blockquote class="warning"><p class="heading">注意：运动控制影响</p>
不同的下采样值可能需要对运动参数进行一些调整。</blockquote>  


这样，就有了完整的磁场定向控制步进电机及其运动控制。

## 用户交互

<span class="simple">Simple<span class="foc">FOC</span>库</span>实现了两种类型的实时用户交互：

- [监控功能](monitoring)
- [电机命令](communication)


## 深入探讨
有关FOC算法和运动控制方法的更多理论解释和源代码实现，请查看[深入探讨部分](digging_deeper)。

## 示例代码


一个简单的基于FOC算法的使用电压的步进电机扭矩控制示例。

<a href="javascript:show('stepper','motor');" class="btn btn-stepper btn-motor btn-primary">StepperMotor</a> 
<a href="javascript:show('hybrid','motor');" class="btn btn-hybrid btn-motor">HybridStepperMotor</a> 


<div class="motor motor-stepper"  markdown="1">

```cpp
/**
 * Torque control example using voltage control loop.
 */
#include <SimpleFOC.h>

// Stepper motor instance
StepperMotor motor = StepperMotor( 50 );
// Stepper driver instance
StepperDriver4PWM driver = StepperDriver4PWM(9, 10, 5, 6, 7, 8);
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

  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // setting target voltage
  motor.target = 2;

  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();
}
```
</div>

<div class="motor motor-hybrid dide"  markdown="1">

```cpp
/**
 * Torque control example using voltage control loop.
 */
#include <SimpleFOC.h>

// Stepper motor instance
HybridStepperMotor motor = HybridStepperMotor( 50 );
// BLDC driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 5, 8);
// sensor instance
MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C);

void setup() { 
  
  // initialize encoder sensor hardware
  sensor.init();
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // much more efficient than SinePWM
  motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // setting target voltage
  motor.target = 2;

  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();
}
```
</div>