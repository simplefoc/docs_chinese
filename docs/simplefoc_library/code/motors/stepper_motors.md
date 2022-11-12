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

  

## 步骤1. 为步进电机创建实例

要创建步进电机实例，你需要指定电机的极对数。  `pole pairs` 。

```cpp
// StepperMotor(  int pp, (optional R, KV))
//  - pp  - 极对数
//  - R   - 相电阻值 - 可选的
//  - KV  - 电机KV值 [rpm/V] - 可选的
StepperMotor motor = StepperMotor(50, 1.5, 20.6);
```

<blockquote class="info"><p class="heading">极对数 </p>
大多数步进电机每旋转一周是200步，所以电机极对数是50。实际上，你可以通过用每旋转一周的步数除以 <code class="highlighter-rouge">4</code>来得到 <code class="highlighter-rouge">pole_paris</code> 极对数。<br><br>
如果你不确定你电机的极对数 <code class="highlighter-rouge">pole_paris</code> number ，library 库提供了<code class="highlighter-rouge">find_pole_pairs_number.ino</code>实例来计算 <code class="highlighter-rouge">pole_paris</code> number 极对数。
 </blockquote>
<blockquote class="warning" markdown="1">
<p class="heading">经验法则：KV值</p>
我们建议将提供给库的KV值设置为比数据表中给定或实验的数值高50-70%。根据电机的力学，在电机额定KV值的100%到200%之间都为适当值。
</blockquote>
<blockquote class="info" markdown="1">
<p class="heading">获取额定KV值 </p>如果不知道你电机的<code class="highlighter-rouge">KV值</code>。通过在电压力矩控制中设定电压为1V，就可以轻易获取到KV值，即为当时电机转速-1V时电机转速。额定KV值的单位是 rpm/V, 而<span class="simple">Simple<span class="foc">FOC</span>library</span>显示速度单位为rad/s。获取到1V时电机转速后，需乘以30/π≈10，将其转化为rpm。

```cpp
KV = velocity_at_one_volt * 30/pi
```

你也可以用library库给定的例程 `examples/utils/calibration/find_KV_rating.ino`.


### 相电阻和KV值

提供相电阻和KV值能使用户能够不用测量就能控制电机电流。（不经常用于基于电流的力矩模式`foc_current` 和 `dc_current`）。在电压控制模式下，用户能够控制（和限制）电机的假定电流。更多信息，请查阅[力矩控制文档](voltage_torque_mode)。

在许多方面来说，基于电流运行会比电压更好。因为无刷直流电机的力矩与电流而不是与电压成比例，特别是相同的电压值在不同的电机上会产生不同的电流（由于相电阻不同）。一旦设置了相电阻后，用户就可以该无刷直流电机的电流限制，而不是电压限制。

值得一提的是，由于电压值和电流值属于不同的概念，如果你设置了相电阻的阻值，很可能需要重新调整速度控制或者位置控制参数。一般的经验是将所有的P，I和D的数值除以`motor.phase_resistance` 值，基于这个点开始调可能会比较好。

最后，如果想要在基于电压（电压模式）和基于电流（DC current或FOC current）的力矩控制之间实时切换的话，建议添加相电阻这个参数，因为上述的力矩控制会以电流值作为数目（目标值），因此用户无需改变运功控制参数（PID值）。

<blockquote class="info">
<p class="heading">开环运动控制会用到KV值和相电阻值</p>
KV值和相电阻值也会用在开环控制中，让用户限制电机电流，而非电压。详情请参阅 <a href="open_loop_motion_control">开环运动控制文档</a>.
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

### 步骤4.1 PWM调制方式

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
motor.voltage_sensor_align = 3; // 默认 3V
```

如果传感器为编码器或有索引引脚，可以通过设定变量`motor.velocity_index_search`来设置索引搜索速度值

```cpp
// 增量编码器索引搜索速度 [rad/s]
motor.velocity_index_search = 3; // 默认为 1 rad/s
```

### 步骤4.3 位置传感器偏移

对于某些应用实例，指定传感器为绝对零偏移是十分方便的，你可以通过改变参数 `motor.sensor_offset`定义它：

```cpp
// 传感器偏移[rad]
motor.sensor_offset = 0; // 默认为 0 rad
```

### 步骤4.4 电机相电阻和KV值

电机相电阻和KV值是一个可选参数，对于基于电流的力矩模式来说不是很重要，这两个变量用于电压力矩模式和开环运动模式中预估电机电流。如果设定了相电阻 `motor.phase_resistance`和电机KV值 `motor.KV_rating`（可以在构造函数或者setup()中设置），library库会使用当前电流来实现控制，它会自动计算所需的电压。在setup函数中，你可以设置以下值来改变这个参数：

```cpp
// 电机相电阻 [Ohms]
motor.phase_resistance = 2.54; // Ohms - 没有设置默认值
// 电机KV值 [rpm/V]
motor.KV_rating = 100; // rpm/volt - 没有设置默认值
```

详情请参阅 [力矩控制文档](voltage_torque_mode).

### 步骤4.5 运动控制参数

 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中有3种不同的闭环控制：

- [torque control loop using voltage（用电压控制力矩）](torque_control)
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


```cpp
// 设置控制环类型
motor.controller = MotionControlType::angle;

// 基于控制类型配置控制器
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;

// 速度低通滤波时间常数
motor.LPF_velocity.Tf = 0.01;

// 角度环控制器
motor.P_angle.P = 20;

// 运动控制限制
// 角度环速度极限
motor.velocity_limit = 50;
// 或者电压限制
motor.voltage_limit = 12; // Volts -  默认为驱动器电压限制
// 或者电流限制 - 如果设定了相电阻
motor.current_limit = 1; // Amps -  默认为2安培
```


### 步骤4.7 完成配置

最后，通过运行 `init()` 函数完成初始化配置，该函数使用所配置的值初始化所有的硬件和软件电机组件。

```cpp
// 初始化电机
motor.init();
```

## 步骤5. 校准电机和所有传感器 - FOC 初始化

在位置传感器、驱动器以及电机配置好后，开始运动控制前，为了初始化 FOC 算法，我们需要校准所有零部件。这都可以用函数 `motor.initFOC()`来完成。

```cpp
// 校正传感器，启动FOC
motor.initFOC();
```

<blockquote class="info"><p class="heading"> 开环控制时可以跳过！</p>在不需要使用传感器时该函数起不到任何作用，但如有必要或者你觉得更方便的话，也可以继续调用该函数。 </blockquote>

该函数能实现以下功能：

- 根据电机方向，检查或纠正位置传感器方向。
- 如有必要，搜索编码器索引。
- 根据位置传感器检测电机电气偏移。

这个函数会进行最终检查，当正在使用电机时，它会禁用你的电机，向你传递可能存在的错误信息。如果一切都配置完好，在调用这个函数后，FOC已经准备好，我们的设置也已经完成！

校准程序会不可避免的运转几次电机，这并不可取。因此，对于大多数位置传感器（除了编码器）和电流检测，这个校准程序可以用步骤5.1的方法跳过。

### 步骤5.1 跳过校准 - 位置传感器

如果你使用的是绝对式传感器，比如磁传感器或霍尔传感器，一旦完成校准过程并获取了电机零电气偏移方向，你就不再需要跑完整个校准程序。你可以在`motor.initFOC()` 中提供传感器偏移量 `zero_electric_offset` 和传感器方向 `sensor_direction` 来跳过校正程序：

```cpp
// 校正传感器，启动FOC
//motor.initFOC(zero_electric_offset, sensor_direction);
motor.initFOC(2.15, Direction::CW);
```

用电机参数也同样可以完成：

```cpp
// 校准传感器，启用FOC
motor.zero_electric_offset  = 2.15; // rad
motor.sensor_direction = Direction::CW; // CW or CCW
motor.initFOC();
```

你可以运行 `find_sensor_offset_and_direction.ino` 实例来找到这些值。

一般来说，如果你知道这两个值中的任何一个，请确保在程序中给定该值，`iniFOC`会跳过这部分校准。例如，对编码器传感器来说，零电气偏移量总在变化，但传感器方向保持不变，所以你可以给定该值，跳过校准序列的大部分内容。

## 步骤6. 实时运动控制

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>的实时运动控制通过以下两个函数实现：

- `motor.loopFOC()` - 低层次力矩控制
- `motor.move(float target)` - 高层次运动控制


函数 `loopFOC()`实现力矩控制环。当步进电机支持 [使用电压模式的力矩控制](voltage_torque_mode) 时，该函数就会从传感器中读取电流、电机角度，将其转变为电气角度，并转换成q轴<i>U<sub>q</sub></i>电压命令 `motor.voltage_q`到适当的相电压<i>u<sub>a</sub></i>， <i>u<sub>b</sub></i>和<i>u<sub>c</sub></i>，然后设置给电机。如果给定步进电机相电阻和KV值，该函数会进一步计算假定电流，用户能直接控制这个假定电流值<i> I<sub>q</sub></i>。 

```cpp
// 函数可运行低层次的力矩控制环
// 计算可得电机角度，从而设定恰当的电压值给相位PWM信号
// 运行速度越快越好 Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```

<blockquote class="info"><p class="heading"> 开环控制时可以跳过！</p> 电机在开环控制运行时该函数没有任何效果！</blockquote>

这个函数的执行时间至关重要，因此 `motor.loopFOC()` 函数越快执行越好。

> 运行这个函数的速度越快越好！

最后，一旦我们有办法给电机设定力矩命令 （电流 <i>I<sub>q</sub></i> 或电压 <i>I<sub>q</sub></i>）使用FOC算法，就可以进行运动控制。这是通过 `motor.move()` 函数完成的。

```cpp
// 函数执行的运动控制环由电机控制器参数配置
// - 函数无需在每个循环执行时运行 - 取决于用例
//
// 设置电机控制器的电压、角度或速度目标值
// 如果没有设置，电机将使用变量motor.target中的目标值
motor.move(target);
```

 `move()` 方法执行算法的运动控制环。如果是由变量 `motor.controller` 控制的。它可以执行纯电压回路、速度回路或角度回路。

它接收一个参数 `float target` ，该参数是当前用户定义的目标值。

- 如果用户运行 [速度环](velocity_loop) 或 [速度开环](velocity_openloop)， `move` 函数把 `target` 作为目标速度 <i>v<sub>d</sub></i> 来解释。
- 如果用户运行 [角度环](angle_loop) or [角度开环](angle_openloop), `move` 函数把 `target` 作为目标角度 <i>a<sub>d</sub></i> 来解释。 
- 如果用户运行 [力矩环](torque_control)，`move` 函数把 `target` 作为目标电压 <i>u<sub>d</sub></i> 或目标电流<i>i<sub>q</sub></i>来解释。（如果相电阻给定）

 `target` 参数是可选的，如果未设置，则由公用的电机变量 `motor.target` 设置目标值，代码是：

```cpp
motor.target = 2;
motor.move();
```

## 步骤 6.1 运动控制降采样

对于许多运动控制应用实例来说，它能理清每个运动控制环所运行的多个力矩控制环。这会使得运转更加顺畅，高速运转下性能表现更佳。因此，library库对使用参数`motor.motion_downsample`设定的 `move()` 函数启用了非常简单的降采样策略。

```cpp
// 降采样值
motor.motion_downsample = 5; // - 时间 (默认为 0 - 禁用)
```

降采样策略工作原理十分简单，尽管 `motor.move()` 在每个 arduino `loop` 都会被调用，它仅会在每个 `motor.motion_downsample` 调用中运行。这个参数是可选的并能够实时配置。

<blockquote class="warning"><p class="heading">注意：运动控制影响</p>
不同的降采样值可能需要略微调整运动参数。</blockquote>  


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