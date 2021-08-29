---
layout: default
title: 无刷直流电机
nav_order: 1
permalink: /bldcmotor
parent: 电机配置代码
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 无刷直流电机配置

<div class="width60">
<img src="extras/Images/mot2.jpg" style="width:30%;display:inline"><img src="extras/Images/bigger.jpg" style="width:30%;display:inline"><img src="extras/Images/mot.jpg" style="width:30%;display:inline">
</div>

 `BLDCMotor` 类可以实现所有直流无刷电机的控制。这个类可以实现：
- 直流无刷电机 FOC 算法
- 运动控制
- 监控
- 通信接口

## 步骤1. 创建无刷直流电机的实例
要实例化无刷直流电机，我们需要创建 `BLDCMotor` 类的实例并为其提供电机的极对数 `pole pairs` 。
```cpp
//  BLDCMotor(int pp, (optional R))
//  - pp  - 极对数
//  - R   - 相电阻值 - 可选的
BLDCMotor motor = BLDCMotor(11 , 10.5);
```

<blockquote class="info"><p class="heading">极对数 </p>
如果你不确定电机的极对数（ <code class="highlighter-rouge">pole_paris</code> number ）。library 库提供了一个 实例 <code class="highlighter-rouge">find_pole_pairs_number.ino</code> 来计算你电机的极对数（ <code class="highlighter-rouge">pole_paris</code> number）。
 </blockquote>
<blockquote class="info"><p class="heading">相位电阻 </p>
如果你提前知道你的电机的相位电阻值 <code class="highlighter-rouge">R</code>，我们建议你把它提供给 library 库。然后 library 库会计算内部电压值，用户只需要处理电流。不过这算是一个可选的功能。
 </blockquote>

## 步骤2. 连接传感器
定义好 `motor` 和初始化传感器后，执行以下代码来连接 `motor` 和 `sensor` ：
```cpp
// 连接电机和传感器
motor.linkSensor(&sensor);
```
 `linkSensor` 能够将电机连接到本库的任何传感器。 `sensor` 用于为FOC算法和速度或位置控制确定电机的电气位置。更多信息请参阅 [位置传感器文档](sensors) 。

<blockquote class="info">当使用开环运动控制时，不需要进行连接。</blockquote>
## 步骤3. 连接驱动器
定义好 `motor` 和初始化 driver 之后，执行以下代码来连接 `motor` 和 `driver` ：
```cpp
// 连接驱动器和电机
motor.linkDriver(&driver);
```

 `BLDCMotor` 类期望接收到一个 `Driver` 类实例，默认使用 `BLDCDriver3PWM` 和 `BLDCDriver6PWM` 类来实现。 `driver`  主要处理所有有关MCU结构和驱动硬件相关的所有硬件操作。更多信息请参阅 [直流无刷电机驱动文档](bldcdriver) ！


## 步骤4.连接电流传感器
如果你有电流传感器 `current_sense` ，你可以使用以下代码连接到电机：
```cpp
// 连接电流传感器和电机
motor.linkCurrentSense(&current_sense);
```
只有本库支持的电流传感才需要此步骤。 更多信息请参阅 [电流传感器文档](current_sense) ！

## 步骤5. 配置参数

如果选择不自行设置其中一些参数，则会用`defaults.h` 文件中所定义的默认值，查看 [library 库源代码](source_code) 来进行更深入的挖掘。

### 步骤5.1 PWM 调制方式

无刷直流电机一共有四种 FOC 调制方式：
- Sinusoidal PWM 调制
- Space Vector PWM 调制
- Block commutation - *有利于电流控制应用*
    - Trapesoidal 120
    - Trapesoidal 150

通过 `motor.foc_modulation` 配置：
```cpp
// 选择FOC调制类型
// FOCModulationType::SinePWM; （默认）
// FOCModulationType::SpaceVectorPWM;
// FOCModulationType::Trapezoid_120;
// FOCModulationType::Trapezoid_150;
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```
Sinusoidal PWM和 Space vector commutation模式会产生正弦电流和平稳运行，但Block commutation执行速度更快，因此更适合于较高转速的情况。建议用霍尔传感器来实现Trapesoidal 120。其他的模式也可以，但这个性能最好。

<blockquote class="info"> <p class="heading">FOC 电流力矩控制要求</p> FOC 力矩控制需要正弦电流，因此请使用Sinusoidal PWM 或Space Vector PWM</blockquote>
有关这些方法的理论和源代码实现的更多信息，请查看 [FOC实现文档](foc_implementation) 或访问 [深入挖掘部分](digging_deeper) 。


### 步骤5.2 传感器和电机校正
用于电机和传感器校正通过 `motor.voltage_sensor_align` 来设置：
```cpp
// 调整电压 [V]
motor.voltage_sensor_align = 3; // 默认 3V
```

如果传感器是编码器，如果它有index引脚，你可以通过设置motor.velocity_index_search来设置index搜索速度：
```cpp
// 增加编码器索引的搜索速度 [rad/s]
motor.velocity_index_search = 3; // 默认 1 rad/s
```

### 步骤5.3 位置传感器偏置
在某些应用中，可以方便地指定传感器的绝对零偏移量，你可以通过改变motor.sensor_offset参数来实现:
```cpp
// 传感器偏置 [rad]
motor.sensor_offset = 0; // 默认 0 rad
```
这个参数可实时修改。

### 步骤5.3 电机相电阻
电机相电阻是一个可选参数，对于基于电流的力矩模式来说不是很重要，但如果使用电压模式并且设置了相电阻 `motor.phase_resistance` （可以在构造函数或者setup()中设置），该库使用当前电流来实现控制，它会自动计算所需的电压。在setup函数中，你可以设置以下值来改变这个参数：
```cpp
// 电机相电阻 [Ohms]
motor.phase_resistance = 2.54; // Ohms - 没有设置默认值
```
在许多方面来说，基于电流运行会比电压更好。因为无刷直流电机的力矩与电流而不是与电压成比例，特别是相同的电压值在不同的电机上会产生不同的电流（由于相电阻不同）。一旦设置了相电阻后，用户就可以该无刷直流电机的电流限制，而不是电压限制。

要注意，由于电压值和电流值属于不同的概念，如果你设置了相电阻的阻值，很可能需要重新调整速度控制或者位置控制参数。一般的经验是将所有的P，I和D的数值除以`motor.phase_resistance` 值，基于这个点开始调可能会比较好。

最后，如果想要在基于电压（电压模式）和基于电流（DC current或FOC current）的力矩控制之间实时切换的话，建议添加相电阻这个参数，因为上述的力矩控制会以电流值作为数目（目标值），因此用户无需改变运功控制参数（PID值）。

相电阻可以实时改变。

### 步骤 5.4 力矩控制模式
在 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中有3种不同的力矩控制模式：
- [voltage模式](voltage_mode)
- [DC current模式](dc_current_torque_mode)
- [FOC current模式](foc_current_torque_mode)

[DC current](dc_current_torque_mode) 和 [FOC current](foc_current_torque_mode) 需要电流检测和控制电流，并限制电机的实际电流。而 [voltage模式](voltage_mode) 只是近似于电机电流，不使用任何电流检测。 更多信息请查阅 [力矩控制文档](torque_mode) 。

力矩模式可以通过改变电机属性 `torque_controller` 来设置。
```cpp
// 设置要使用的扭矩模式
// 转矩控制类型::电压    （默认）
// 转矩控制类型::直流电流
// 转矩控制类型::磁场定向控制电流
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

通过改变 `motor.controller` 变量来设置：
```cpp
// 设置要使用的运动控制回路
// 运动控制类型::扭矩	-扭矩控制
// 运动控制类型::速度	-速度运动控制
// 运动控制类型::角度	-位置/角度运动控制
// 运动控制类型::速度开环	-速度开环控制
// 运动控制类型::角度开环	-位置开环控制
motor.controller = MotionControlType::angle;
```
<blockquote class="warning"><p class="heading"> 注意！</p>该参数没有默认值，实时执行之前必须要设置这个值。</blockquote>
每种运动控制策略都有自己的参数，更多信息请参阅 [运动控制文档](motion_control) 。

下面是所有运动控制配置参数的列表：
```cpp
// 设置要使用的控制回路类型
motor.controller = MotionControlType::angle;

// 根据控制类型配置控制器
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;
// 电压/秒或安培/秒
// 对于大多数应用程序，不需要更改
motor.PID_velocity.output_ramp = 1e6;

// 速度低通滤波时间常数
motor.LPF_velocity.Tf = 0.01;

// 角度环控制器
motor.P_angle.P = 20;
motor.P_angle.I = 0; // 通常设置为0 - 仅需使用P控制器
motor.P_angle.D = 0; // 通常设置为0 - 仅需使用P控制器
// 加速度限制
motor.P_angle.output_ramp = 1e6;

// 运动控制限制
// 角度环速度极限
motor.velocity_limit = 50;
// 或者电压限制
motor.voltage_limit = 12; // 电压-默认为驱动器电压限制
// 或电流限制-如果相位电阻设置
motor.current_limit = 12; // 安培-默认0.5安培
```

### 步骤5.6 完成配置
最后，通过运行 `init()` 函数完成初始化配置，该函数使用所配置的值初始化所有的硬件和软件电机组件。
```cpp
// 初始化电机
motor.init();
```

## 步骤6. 校正电机和所有传感器

在配置好位置传感器、电流传感器、驱动器和电机之后，在控制运动之前，我们需要对所有硬件部件进行校正，以便初始化 FOC 算法。这是在函数 `motor.initFOC()` 内完成的。
```cpp
// 校正传感器，启动FOC
motor.initFOC();
```
<blockquote class="info"><p class="heading"> 开环控制时可以跳过！</p>如果没有附加传感器，这个功能实际上不会做任何事情，不过如果有必要的话你仍然可以调用它。 </blockquote>
这个函数可以会做：
- 根据电机的方向检查/修改位置传感器的方向
- 如有必要，搜索编码器的索引
- 查找相对于位置传感器的电机位移
- 检查/修改电流传感的引脚和增益信号，如果存在的话确保它与驱动器校正

这个函数是最后的检查函数，它将禁用你的电机，并显示错误信息（使用 [监控](monitoring) 时）。如果一切都配置好了，在调用这个函数之后，FOC就准备就绪，我们的设置也就完成了！

校正程序将必须转几次电机，可能是你不想的，因此，对于大多数位置传感器（编码除外）和电流传感器，可以通过遵循步骤 6.1 和 6.2 跳过这个校正过程。 

### 步骤6.1 跳过校正 - 位置传感器

如果你使用绝对传感器，如磁传感器或霍尔传感器，一旦你完成校正程序和确定了电机的零电位移传感器方向，就不再需要完整的校正。因此，对于 `motor.initFOC()` ，你可以提供传感器偏移 `zero_electric_offset` 和传感器方向 `sensor_direction` ，来跳过校正程序：
```cpp
// 校正传感器并启动FOC
//motor.initFOC(zero_electric_offset, sensor_direction);
motor.initFOC(2.15, Direction::CW);
```
同样地，可以通过设置电机参数来实现：
```cpp
// 校正传感器并启动FOC
motor.zero_electric_offset  = 2.15; // rad
motor.sensor_direction = Direction::CW; // CW or CCW
motor.initFOC();
```
可以运行 `find_sensor_offset_and_direction.ino` 实例来找到这些值。

一般地说，如果你知道这两个值中的任何一个，请务必设置。 `iniFOC` 会跳过这部分校正。例如，对于编码器，零电偏移一直在变化，但传感器方向会保持不变，因此你可以设置它，并跳过大部分校正程序。

### 步骤6.2 跳过校正 - 电流检测

对于电流传感器，也可以通过设定电流检测标志 `skip_align` 来跳过的校正过程：
```cpp
current_sense.skip_align  = true; // 默认 false
```
但要确保设置好所有增益，所有 ADC 引脚都正确。更多信息请参阅 [电流检测文档](current_sense)。

## 步骤7. 实时运动控制

用两个功能来完成 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 的实时运动控制：
- `motor.loopFOC()` - 低力矩控制
- `motor.move(float target)` - 高力矩控制


函数 `loopFOC()` 的行为直接取决于力矩控制模式。如果是使用电压模式，它从传感器中获取当前的电机角度，转变为电角度并将q轴的U<sub>q</sub>电压指令 `motor.voltage_q` 转换为适当的相位电压 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> ，把它们输出到电机上。 而如果它用于DC或FOC current模式，它还会读取电流传感器并运行闭环电流控制。

```cpp
// 函数运行低电平转矩控制回路
// 它计算得到电机角度和设置适当的电压
// 到相位PWM信号
// -运行速度越快越好 Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```

<blockquote class="info"><p class="heading"> 开环控制时可以跳过！</p>如果电机是开环控制的，此功能将不起作用！ </blockquote>
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

最后，当我们使用FOC算法设置了电机的力矩命令（电流 <i>i<sub>q</sub></i> 或电压 <i>u<sub>q</sub></i>）之后，我们就可以进行运动控制了。这是通过 `motor.move()` 函数完成的。
```cpp
// 函数执行由电机配置的运动控制循环。控制器参数的电机。
// -这个函数不需要在每个循环执行时运行-取决于用例
//
// 基于电机控制器的转矩、角度或速度
//         如果没有设置，电机将使用其可变电机。target中的目标设置
motor.move(target);
```

 `move()` 方法执行算法的运动控制。如果是由 `motor.controller` 控制的，它会执行纯力矩控制、速度控制或角度控制。

它接收当前用户定义的目标值参数 `float target` 。
- 如果用户运行 [速度环](velocity_loop) 或 [速度开环](velocity_openloop)， `move` 函数把 `target` 作为目标速度来解释。
- 如果用户运行 [角度环](angle_loop) or [角度开环](angle_openloop), `move` 函数把 `target` 作为目标角度来解释。
- 如果用户运行 [力矩环](voltage_loop), `move` 函数把 `target` 作为电压 <i>u<sub>q</sub></i> 或电流 <i>i<sub>q</sub></i> （如果提供了相位电阻）。

 `target` 参数是可选的，如果未设置，则由公用的电机变量 `motor.target` 设置目标值，代码是：

```cpp
motor.target = 2;
motor.move();
```

## 步骤7.1 降采样运动控制
对于许多运动控制应用来说，为每个运动控制都运行多个力矩控制都是有意义。这可以提供更好的高速性能，对平滑度有很大的影响。因此， library 库提供简单的使用 `motor.motion_downsample` 参数设置  `move()` 函数进行下采样：

```cpp
// 将采样值
motor.motion_downsample = 5; // - 次 (default 0 - 禁用)
```
这个下采样很简单，也就是在每一个 `loop()` 都会调用 `motor.move()` ，而这个`move()`只会计数到 `motor.motion_downsample` 时才会执行。该参数可选，也可以实时配置。

<blockquote class="warning"><p class="heading">注意：运动控制的影响</p>
下采样的不同值可能需要对运动参数进行一些调整。</blockquote>  


至此，你有了完整运动控制的 FOC 无刷直流电机。
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
 * 基于电压的力矩控制环实例
 */
#include <SimpleFOC.h>

// 无刷直流电机的实例
BLDCMotor motor = BLDCMotor(11);
// 驱动程序实例
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
// 传感器实例
MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C);

void setup() { 
  
  // 初始化编码传感器硬件
  sensor.init();
  // 将电机连接到传感器上
  motor.linkSensor(&sensor);

  // 驱动器配置
  // 电源电压V
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接驱动器
  motor.linkDriver(&driver);

  // 调整电压
  motor.voltage_sensor_align = 3;
  
  // 选择FOC调制
  motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

  // 设置转矩模式
  motor.torque_controller = TorqueControlType::voltage;
  // 设置要使用的运动控制回路
  motor.controller = MotionControlType::torque;

  // 初始化运动
  motor.init();
  // 校正传感器并启动FOC
  motor.initFOC();

  _delay(1000);
}

// 设置目标电压
float target_voltage = 2;

void loop() {

  // 主要FOC算法函数
  motor.loopFOC();

  // 运动控制函数
  motor.move(target_voltage);
}
```
