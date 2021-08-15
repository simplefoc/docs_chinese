---
layout: default
title: BLDCMotor
nav_order: 1
permalink: /bldcmotor
parent: Motor code
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 配置无刷直流电机

<div class="width60">
<img src="extras/Images/mot2.jpg" style="width:30%;display:inline"><img src="extras/Images/bigger.jpg" style="width:30%;display:inline"><img src="extras/Images/mot.jpg" style="width:30%;display:inline">
</div>

用 `BLDCMotor` 类可以完成所有直流无刷电机的控制。这个类可以实现：
- 直流无刷电机 FOC 算法
- 运动控制主循环
- 监控
- 用户通信接口

## 步骤1. 创建无刷直流电机的实例
为了举例说明无刷直流电机的使用，我们需要创建 `BLDCMotor` 类的一个实例和提供电机的极对数 `pole pairs` 。
```cpp
//  BLDCMotor(int pp, (optional R))
//  - pp  - pole pair number
//  - R   - phase resistance value - optional
BLDCMotor motor = BLDCMotor(11 , 10.5);
```

<blockquote class="info"><p class="heading">极对数 </p>
如果你不确定电机的极对数（ <code class="highlighter-rouge">pole_paris</code> number ）。library 库提供了一个 实例 <code class="highlighter-rouge">find_pole_pairs_number.ino</code> 来计算你电机的极对数（ <code class="highlighter-rouge">pole_paris</code> number）。
 </blockquote>
<blockquote class="info"><p class="heading">相位电阻 </p>
如果你提前知道你的电机的相位电阻值 <code class="highlighter-rouge">R</code>，我们建议你把它提供给 library 库。然后 library 库会计算内部电压值，用户只需要处理电流。不过这算是一个可选的功能。
 </blockquote>

## 步骤2. 连接传感器
定义好 `motor` 和初始化 sensor 之后，执行以下代码来连接 `motor` 和 `sensor` ：
```cpp
// link the sensor to the motor
motor.linkSensor(&sensor);
```
方法 `linkSensor` 能够将电机连接到本库的任何传感器。 `sensor` 将用于确定电机的 FOC 算法中的电路位置，以及速度和位置的运动控制主循环。更多信息请参阅 [位置传感器文档](sensors) 。

<blockquote class="info">当使用开环运动控制时，不需要进行连接。</blockquote>
## 步骤3. 连接驱动程序
定义好 `motor` 和初始化 driver 之后，执行以下代码来连接 `motor` 和 `driver` ：
```cpp
// link the driver to the motor
motor.linkDriver(&driver);
```

 `BLDCMotor` 类期望接收到一个 `BLDCDriver` 类实例，通过，默认的 `BLDCDriver3PWM` 和 `BLDCDriver6PWM` 类来实现。 `driver`  能够实现所有涉及到微控制器架构和驱动硬件的具体操作。 更多信息请参阅 [直流无刷电机驱动文档](bldcdriver) ！


## 步骤4.连接电流传感器
如果你有电流传感器 `current_sense` ，你可以使用以下代码连接到电机：
```cpp
// link the current sensor to the motor
motor.linkCurrentSense(&current_sense);
```
如果你有 Library 库支持的电流传感器，才需要进行这个连接操作。 更多信息请参阅 [电流传感器文档](current_sense) ！

## 步骤5. 配置参数

如果你选择不设置某些配置参数，它们将会使用`defaults.h` 文件中定义的默认值，查看 [library 库源代码](source_code) 来进行更深入的挖掘。

### 步骤5.1 PWM 调制方式

无刷直流电机有四种 FOC 调制方式：
- 正弦 PWM 调制
- 空间矢量 PWM 调制
- 块换向 - *有利于电流控制应用*
    - Trapesoidal 120
    - Trapesoidal 150

可以改变 `motor.foc_modulation` 变量来传输：
```cpp
// choose FOC modulation
// FOCModulationType::SinePWM; (default)
// FOCModulationType::SpaceVectorPWM;
// FOCModulationType::Trapezoid_120;
// FOCModulationType::Trapezoid_150;
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```
正弦PWM和空间矢量换向模式将产生正弦电流和平稳运行，但块换向执行得更快，因此更适合于较高的速度。建议使用带有霍尔传感器的梯形 120 （Trapesoidal 120）换向。其他的交换模式也可以工作，但这个性能最好。

<blockquote class="info"> <p class="heading">FOC 电流力矩控制要求</p> FOC 力矩控制需要正弦电流，因此请使用正弦 PWM 或空间矢量 PWM</blockquote>
有关这些方法的理论和源代码实现的更多信息，请查看 [FOC实现文档](foc_implementation) 或访问 [深入挖掘部分](digging_deeper) 。


### 步骤5.2 传感器和电机调整参数
用于电机和传感器校准的电压设置变量 `motor.voltage_sensor_align` ：
```cpp
// aligning voltage [V]
motor.voltage_sensor_align = 3; // default 3V
```

如果你的传感器是一个编码器，如果它有一个 I 引脚，你可以通过设置变量来设置 I 搜索速度的值 `motor.velocity_index_search` ：
```cpp
// incremental encoder index search velocity [rad/s]
motor.velocity_index_search = 3; // default 1 rad/s
```

### 步骤5.3 位置传感器偏置
在某些应用中，可以方便地指定传感器的绝对零偏移量，你可以通过改变参数来定义它  `motor.sensor_offset`:
```cpp
// sensor offset [rad]
motor.sensor_offset = 0; // default 0 rad
```
这个参数可实时修改。

### 步骤5.3 电机相位电阻
电机相电阻是一个可选参数，它对于基于电流的力矩模式不是很重要，但如果使用电压模式并且用户指定了 `motor.phase_resistance` （无论是在构造函数中，还是在 `setup()` 函数中）该library 库将允许用户使用电流值工作，它将自动计算所需的电压。在setup函数中，你可以设置以下值来改变这个参数：
```cpp
// motor phase resistance [Ohms]
motor.phase_resistance = 2.54; // Ohms - default not set
```
在许多方面来说，用电流工作比电压更好。因为无刷直流电机的力矩与电流成比例，而不是与电压成比例，特别是相同的电压值会对不同的电机产生非常不同的电流（由于相电阻不同）。知道相电阻之后，用户就可以设置其无刷直流电机的电流限制，而不是电压限制。

重要的是，一旦你指定了相位电阻值，因为电压和电流的值在不同的数量级，你很可能要重新调 [velocity motion control](velocity_loop) 和 [angle motion control](angle_loop) 参数。经验法则是用`motor.phase_resistance` 值除以所有的 `P`, `I` 和 `D` 增益。这会是一个很好的起点。

最后，建议在电压 ([（电压模式）](voltage_mode)) 和电流（[直流电流](dc_current_torque_mode) 和 [FOC 电流](foc_current_torque_mode)）力矩控制策略之间实时切换的时候使用该参数。通过这种方式，所有的力矩控制电路都将以电流作为输入（目标值），用户将不必改变运动控制参数（PID值）。

如果需要，相位电阻可以实时改变。

### 步骤 5.4 力矩控制模式
在 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中有3种不同的力矩控制模式：
- [电压模式](voltage_mode)
- [直流电流](dc_current_torque_mode)
- [FOC 电流](foc_current_torque_mode)

[直流电流](dc_current_torque_mode) 和 [FOC 电流](foc_current_torque_mode) 需要电流检测和控制电流，并限制电机的实际电流。而 [电压模式](voltage_mode) 近似于电机电流，不使用任何电流检测。 更多信息请查阅 [力矩控制文档](torque_mode) 。

力矩模式可以通过改变电机属性 `torque_controller` 来设置。
```cpp
// set torque mode to be used
// TorqueControlType::voltage    ( default )
// TorqueControlType::dc_current
// TorqueControlType::foc_current
motor.torque_controller = TorqueControlType::foc_current;
```

### 步骤5.5. 电机控制参数 

在 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中有3种不同的闭环控制策略：
- [力矩控制](voltage_loop)
- [速度运动控制](velocity_loop)
- [位置/角度运动控制](angle_loop)

另外 <span class="simple">Simple<span class="foc">FOC</span>library</span> 也有两种开环控制策略：
- [速度开环控制](velocity_openloop)
- [位置开环控制](angle_openloop)

通过改变 `motor.controller` 变量来设置它：
```cpp
// set motion control loop to be used
// MotionControlType::torque      - torque control 
// MotionControlType::velocity    - velocity motion control
// MotionControlType::angle       - position/angle motion control
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle;
```
<blockquote class="warning"><p class="heading"> 注意！</p>该参数没有默认值，实时执行之前必须要设置这个值。</blockquote>
每种运动控制策略都有自己的参数，更多信息请参阅 [运动控制文档](motion_control) 。

下面是所有运动控制配置参数的列表：
```cpp
// set control loop type to be used
motor.controller = MotionControlType::angle;

// controller configuration based on the control type 
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;
// jerk control it is in Volts/s or Amps/s
// for most of applications no change is needed 
motor.PID_velocity.output_ramp = 1e6;

// velocity low pass filtering time constant
motor.LPF_velocity.Tf = 0.01;

// angle loop controller
motor.P_angle.P = 20;
motor.P_angle.I = 0; // usually set to 0  - P controller is enough
motor.P_angle.D = 0; // usually set to 0  - P controller is enough
// acceleration limit
motor.P_angle.output_ramp = 1e6;

// motion control limits
// angle loop velocity limit
motor.velocity_limit = 50;
// either voltage limit
motor.voltage_limit = 12; // Volts -  default driver.voltage_limit
// or current limit - if phase_resistance set
motor.current_limit = 12; // Amps -  default 0.5 Amps
```

### 步骤5.6 完成配置
最后，通过运行 `init()` 函数完成配置，该函数使用配置值完成所有的硬件和软件电机组件。
```cpp
// initialize motor
motor.init();
```

## 步骤6. 调整电机和所有传感器

在配置好位置传感器、电流传感器、驱动器和电机之后，在控制运动之前，我们需要对所有硬件部件进行校准，以便初始化 FOC 算法。这是在函数 `motor.initFOC()` 内完成的。
```cpp
// align sensor and start FOC
motor.initFOC();
```
<blockquote class="info"><p class="heading"> 开环控制时可以跳过它！</p>如果没有附加传感器，这个功能实际上不会做任何事情，不过如果有必要的话你仍然可以调用它。 </blockquote>
这个功能可以做几件事：
- 根据电机的方向检查/修改位置传感器的方向
- 如有必要，搜索编码器的索引
- 找到电机相对于位置传感器的电位移
- 检查/修改电流传感的引脚和增益信号，如果存在的话确保它与驱动器对齐

这个功能是最后的检查功能，它将禁用你的电机，并显示你的信息是什么错误（使用 [监控](monitoring) 时）。如果一切都配置好了，在调用这个函数之后，FOC就准备就绪，我们的设置也就完成了！

校准程序将必须移动你的电机几次，可能不是理想的行为，因此，对于大多数位置传感器（编码除外）和电流传感器，可以通过遵循步骤 6.1 和 6.2 跳过这个校准过程。 

### 步骤6.1 跳过校准 - 位置传感器

如果你使用绝对传感器，如磁传感器或霍尔传感器，一旦你做了校准程序和有电机的零电位移传感器方向，你就不再需要完整的校准序列。因此，对于 `motor.initFOC()` ，你可以提供传感器偏移 `zero_electric_offset` 和传感器方向 `sensor_direction` ，来避免校准程序：
```cpp
// align sensor and start FOC
//motor.initFOC(zero_electric_offset, sensor_direction);
motor.initFOC(2.15, Direction::CW);
```
同样地，可以通过使用电机参数来完成：
```cpp
// align sensor and start FOC
motor.zero_electric_offset  = 2.15; // rad
motor.sensor_direction = Direction::CW; // CW or CCW
motor.initFOC();
```
可以运行 `find_sensor_offset_and_direction.ino` 实例来找到这些值。

一般地说，如果你知道这两个值中的任何一个，请务必提供它。 `iniFOC` 会跳过这部分校准。例如，对于编码器传感器，零电偏移一直在变化，但传感器方向会保持不变，因此你可以提供它，并跳过大部分校准程序。

### 步骤6.2 跳过校准 - 电流检测

对于电流传感器，最好避免通过指定的电流检测标志 `skip_align` 来完成的校准过程：
```cpp
current_sense.skip_align  = true; // default false
```
但要确保设置好所有增益，所有 ADC 引脚都校准到驱动器/电机相位。更多信息请参阅 [电流检测文档](current_sense)。

## 步骤7. 实时运动控制

用两个功能来完成 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 的实时运动控制：
- `motor.loopFOC()` - 低力矩控制
- `motor.move(float target)` - 高力矩控制


函数 `loopFOC()` 的行为直接依赖于力矩控制模式。如果是使用电压模式，它从传感器得到当前的电机角度，转变为电的角度。转换 `motor.voltage_q` 电压命令的 q 轴 <i>U<sub>q</sub></i> 到设置好的适当的相位电压 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> ，把它们设置到电机上。 而如果它用于 FOC 电流模式的直流情况下，它还会读取电流传感器并运行闭环电流控制。

```cpp
// Function running the low level torque control loop
// it calculates the gets motor angle and sets the appropriate voltages 
// to the phase pwm signals
// - the faster you can run it the better Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```

<blockquote class="info"><p class="heading"> 开环控制时可以跳过它！</p>如果电机是开环控制的，此功能将不起作用！ </blockquote>
在电压模式和电流控制模式下，执行时间都是很关键的。因此，尽可能快地执行 `motor.loopFOC()` 函数是非常重要的。

<blockquote class="warning"><p class="heading">经验法则：执行时间</p>
运行这个函数时，越快越好，这里是使用不同力矩模式的近似循环执行时间。
<table>
<tr>
<td>MCU</td>
<td><a href="voltage_mode">Voltage mode（电压模式）</a></td>
<td><a href="dc_current_torque_mode">DC current（直流电流）</a></td>
<td><a href="foc_current_torque_mode">FOC current（FOC 电流）</a></td>
</tr>
<tr>
<td>Arduino UNO</td>
<td>~ 700 us</td>
<td>~ 1.2 ms</td>
<td>~ 1.5 ms</td>
</tr>
<tr>
<td>Esp32</td>
<td>~ 100 us</td>
<td>~ 200 us</td>
<td>~ 300 us</td>
</tr>
<tr>
<td>Bluepill</td>
<td>~ 200 us</td>
<td>~ 500 ms</td>
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

最后，当我们使用FOC算法设置了电机的力矩命令（电流 <i>i<sub>q</sub></i> 或电压 <i>u<sub>q</sub></i>）电机之后，我们就可以进行运动控制了。这是通过 `motor.move()` 函数完成的。
```cpp
// Function executing the motion control loops configured by the motor.controller parameter of the motor. 
// - This function doesn't need to be run upon each loop execution - depends of the use case
//
// target  Either torque, angle or velocity based on the motor.controller
//         If it is not set the motor will use the target set in its variable motor.target
motor.move(target);
```

 `move()` 方法执行算法的运动控制循环。如果是由 `motor.controller` 变量控制的，它会执行纯力矩回路、速度回路或角度回路。

它得到一个当前用户定义的目标值参数 `float target` 。
- 如果用户运行 [速度环](velocity_loop) 或 [速度开环](velocity_openloop)， `move` 函数把 `target` 作为目标速度来解释。
- 如果用户运行 [角度环](angle_loop) or [角度开环](angle_openloop), `move` 函数把 `target` 作为目标角度来解释。
- 如果用户运行 [力矩环](voltage_loop), `move` 函数把 `target` 作为电压 <i>u<sub>q</sub></i> 或电流 <i>i<sub>q</sub></i> （如果提供了相位电阻）。

 `target` 参数是可选的，如果未设置，则由公用的电机变量 `motor.target` 设置目标值，代码是：

```cpp
motor.target = 2;
motor.move();
```

## 步骤7.1 降采样运动控制
对于许多运动控制应用来说，为每个运动控制回路运行多个力矩控制回路都应该有意义。这可以提供更好的高速性能，对平滑度有很大的影响。因此， library 库提供简单的使用 `motor.motion_downsample` 参数设置  `move()` 函数进行降采样：

```cpp
// downsampling value
motor.motion_downsample = 5; // - times (default 0 - disabled)
```
降采样以一种非常简单的方式工作，即使在每个arduino `loop` 中调用 `motor.move()` ，它只执行 `motor.motion_downsample` ，这个是可选参数，可实时配置。

<blockquote class="warning"><p class="heading">注意：运动控制的影响</p>
降采样的不同值可能需要对运动参数进行一些调整。</blockquote>  


这就是它，你有了完整运动控制的 FOC 无刷直流电机。
## 用户界面

<span class="simple">Simple<span class="foc">FOC</span>library</span> 有2种实时用户接口：

- [Monitoring functionality（监控功能）](monitoring)
- [Motor commands（用户指令）](communication)


## 深入挖掘
更多 FOC 算法和运动控制方法的理论解释和源代码实现，查看 [挖掘更深的部分](digging_deeper)。

## 实例代码
基于 FOC 算法的简单的用电压控制无刷直流电机力矩的实例。
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
