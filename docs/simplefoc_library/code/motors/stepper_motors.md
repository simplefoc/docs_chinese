---
layout: default
title: 步进电机
nav_order: 2
permalink: /steppermotor
parent: 电机配置代码
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 步进电机配置

<div class="width60">
<img src="extras/Images/nema17_2.jpg" style="width:30%;display:inline"><img src="extras/Images/nema17_1.jpg" style="width:30%;display:inline"><img src="extras/Images/nema23.jpg" style="width:30%;display:inline">
</div>

用 `StepperMotor` 类可以实现步进电机的控制：
- 步进电机 FOC 算法
- 运动控制主循环
- 监控
- 用户通信接口

## 步骤1. 为步进电机创建实例
要创建步进电机实例，你需要指定电机的极对数。  `pole pairs` 。
```cpp
// StepperMotor(  int pp)
// - pp  - 极对数
StepperMotor motor = StepperMotor( 50 );
```
<blockquote class="info"><p class="heading">极对数 </p>
大多数步进电机每旋转一周是200步，所以电机极对数是50。实际上，你可以通过用每旋转一周的步数除以 <code class="highlighter-rouge">4</code>来得到 <code class="highlighter-rouge">pole_paris</code> 极对数。<br><br>
如果你不确定你电机的极对数 <code class="highlighter-rouge">pole_paris</code> number ，library 库提供了<code class="highlighter-rouge">find_pole_pairs_number.ino</code>实例来计算 <code class="highlighter-rouge">pole_paris</code> number 极对数。
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

 `StepperMotor` 类期望接收到一个 `StepperDriver` 类实例，默认使用`StepperDriver4PWM` 类来实现。 `driver`  主要处理所有有关MCU结构和驱动硬件相关的所有硬件操作。更多信息请参阅 [直流无刷电机驱动文档](bldcdriver) ！

## 步骤4. 配置

如果选择不自行设置其中一些参数，则会用`defaults.h` 文件中所定义的默认值，查看 [library 库源代码](source_code) 来进行更深入的挖掘。

### 步骤4.1 调制方式

通过改变 `motor.foc_modulation` 实现：
```cpp
// 选择FOC调制类型
// FOCModulationType::SinePWM;
motor.foc_modulation = FOCModulationType::SinePWM;
```
当前的版本 <a href="https://github.com/simplefoc/Arduino-FOC/releases"> <i class="fa fa-tag"> current version</i></a>  的 `StepperMotor` 类只有正弦PWM调制。

有关这些方法的理论和源代码实现的更多信息，请查看 [FOC实现文档](foc_implementation) 或访问 [深入挖掘部分](digging_deeper) 。


### 步骤4.2 传感器和电机校正参数
用于电机和传感器校正的电压设置motor.voltage_sensor_align`：
```cpp
// 校正电压 [V]
// 默认 6V
motor.voltage_sensor_align = 3;
```

### 步骤4.3运动控制参数

 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中有3种不同的闭环控制：
- [torque control loop using voltage（用电压控制力矩）](voltage_loop)
- [position/angle motion control（位置/角度运动控制）](angle_loop)
- [velocity motion control（速度运动控制）](velocity_loop)

另外 <span class="simple">Simple<span class="foc">FOC</span>library</span> 也有两种开环控制策略：
- [position open-loop control（位置开环控制）](angle_openloop)
- [velocity open-loop control（速度开环控制）](velocity_openloop)

通过改变 `motor.controller` 变量来设置它：
```cpp
// 设置FOC控制环
// MotionControlType::torque      - 基于电压的力矩控制环 
// MotionControlType::velocity    - 速度运动控制环
// MotionControlType::angle       - 位置/角度运动控制环
// MotionControlType::velocity_openloop    - 开环速度控制
// MotionControlType::angle_openloop       - 开环位置控制
motor.controller = MotionControlType::angle;
```
<blockquote class="warning"><p class="heading"> 注意！</p>该参数没有默认值，实时执行之前必须要设置这个值。</blockquote>
每种运动控制策略都有自己的参数，更多信息请参阅 [运动控制文档](motion_control) 。

下面是所有运动控制配置参数的列表：
```cpp
// 设置控制环类型
motor.controller = MotionControlType::angle;

// 基于控制类型配置控制器
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;
// 以Volts/s或者Amps/s进行急动控制
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
// 电压限制
motor.voltage_limit = 12; // Volts -  默认为驱动器电压限制
```
### 步骤4.4 完成配置
最后，通过运行 `init()` 函数完成初始化配置，该函数使用所配置的值初始化所有的硬件和软件电机组件。
```cpp
// 初始化电机
motor.init();
```

## 步骤5. FOC 初始化

在电机和传感器初始化和配置之后，开始控制运动之前，我们需要初始化 FOC 算法。
```cpp
// 校正传感器，启动FOC
motor.initFOC();
```
<blockquote class="danger"><p class="heading"> 开环控制时可以跳过！</p>开环控制时，不应该调用这个函数！ </blockquote>
该函数校正传感器和电机的零位，并初始化 FOC 变量，在 Arduino 的 `setup` 函数中运行。调用这个函数之后，FOC就准备好了，设置也完成了！

如果你使用的是绝对传感器，比如磁传感器，你可以在 `initFOC()` 中提供传感器偏移量 `zero_electric_offset` 和传感器方向 `sensor_direction` 来跳过校正程序：
```cpp
// 校正传感器，启动FOC
//motor.initFOC(zero_electric_offset, sensor_direction);
motor.initFOC(2.15, Direction::CW);
```
你可以运行 `find_sensor_offset_and_direction.ino` 实例来找到这些值。

有关 `initFOC()` 中实际发生的情况的更多信息，请查看 [FOC 源代码实现](foc_implementation) 。

## 步骤6. 实时运动控制

用两个函数来完成 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 的实时运动控制： `motor.loopFOC()` 和 `motor.move(float target)` 。
```cpp
// 函数实时运行FOC算法
// 计算可得电机角度，从而设定恰当的电压值给相位PWM信号
// 运行速度越快越好 Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```
<blockquote class="danger"><p class="heading"> 开环控制时可以跳过！</p>开环控制时，不应该调用这个函数！</blockquote>
 `loopFOC()` 函数从传感器获取当前电机角度， 将其转换成电角度并将正交 <i>U<sub>q</sub></i> 电压 `motor.voltage_q` 转换为电机上相应的相电压 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 。

将 <i>U<sub>q</sub></i> 转换到 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i>  是由 ***Sinusoidal PWM*** 的配置参数 `motor.foc_modulation` 定义的。 

<blockquote class="info"><p class="heading"> 新特性 - <i>U<sub>d</sub></i> 直流支持！</p><i><b>Sinusoidal PWM</b></i> 支持直流电压设置 <i>U<sub>d</sub></i> ，直流电压可以通过改变 <code class="highlighter-rouge">motor.voltage_d</code>变量来设定！这是一个新特性，在当前版本中会被更多地使用。</blockquote>
这个函数的执行时间很关键，因此，尽可能快地执行 `motor.loopFOC()` 函数是非常重要的！

> 格式待整合

<blockquote class="warning"><p class="heading">经验法则：执行时间</p>

> 运行这个函数的速度越快越好！

<ul style="margin-bottom:0em">
    <li> Arduino UNO <code class="highlighter-rouge">loop()</code> ~ 1ms </li>
    <li> Esp32 <code class="highlighter-rouge">loop()</code> ~ 500us</li>
    <li> Bluepill <code class="highlighter-rouge">loop()</code> ~ 200us</li>
    <li> Nucleo <code class="highlighter-rouge">loop()</code> ~ 100us</li>
</ul>
</blockquote>


最后，利用 FOC 算法设置电机的相位电压，进行运动控制。这是通过 `motor.move()` 函数完成的。

```cpp
// 函数执行的控制环由电机控制器参数配置
// - 函数无需在每个循环执行时运行 - 取决于用例
//
// 设置电机控制器的电压、角度或速度目标值
//         如果没有设置，电机将使用变量motor.target中的目标值
motor.move(target);
```

 `move()` 方法执行算法的控制回路。如果是由变量 `motor.controller` 控制的。它可以执行纯电压回路、速度回路或角度回路。

它接收一个参数 `float target` ，该参数是当前用户定义的目标值。
- 如果用户运行 [速度环](velocity_loop) 或 [速度开环](velocity_openloop)， `move` 函数把 `target` 作为目标速度 <i>v<sub>d</sub></i> 来解释。
- 如果用户运行 [角度环](angle_loop) or [角度开环](angle_openloop), `move` 函数把 `target` 作为目标角度 <i>a<sub>d</sub></i> 来解释。 
- 如果用户运行 [电压环](voltage_loop)，`move` 函数把 `target` 作为目标电压 <i>u<sub>d</sub></i> 来解释。

 `target` 参数是可选的，如果未设置，则由公用的电机变量 `motor.target` 设置目标值，代码是：

```cpp
motor.target = 2;
motor.move();
```

这就是它，你有了完整运动控制的 FOC 无刷直流电机。

## 用户接口

<span class="simple">Simple<span class="foc">FOC</span>library</span> 有2种实时用户接口：

- [Monitoring functionality（监控功能）](monitoring)
- [Motor commands（用户指令）](communication)


## 深入挖掘
更多 FOC 算法和运动控制方法的理论解释和源代码实现，查看 [深入挖掘的部分](digging_deeper) 。

## 实例代码
基于 FOC 算法的简单的用电压控制步进电机力矩的实例。
```cpp
/**
 * 基于电压的力矩控制环实例
 */
#include <SimpleFOC.h>

// 步进电机实例
StepperMotor motor = StepperMotor( 50 );
// 步进电机驱动器实例
StepperDriver4PWM driver = StepperDriver4PWM(9, 10, 5, 6, 7, 8);
// 传感器实例
MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C);

void setup() { 
  
  // 初始化编码传感器硬件
  sensor.init();
  // 连接电机和传感器
  motor.linkSensor(&sensor);

  // 驱动器配置
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接驱动器
  motor.linkDriver(&driver);

  // 设置运动控制环
  motor.controller = MotionControlType::torque;

  // 初始化运动
  motor.init();
  // 校正传感器，启动FOC
  motor.initFOC();

  // 设置目标电压
  motor.target = 2;

  _delay(1000);
}

void loop() {

  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
  motor.move();
}
```
