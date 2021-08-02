---
layout: default
title: StepperMotor
nav_order: 2
permalink: /steppermotor
parent: Motor code
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Stepper Motor configuration（步进电机配置）

<div class="width60">
<img src="extras/Images/nema17_2.jpg" style="width:30%;display:inline"><img src="extras/Images/nema17_1.jpg" style="width:30%;display:inline"><img src="extras/Images/nema23.jpg" style="width:30%;display:inline">
</div>

用 `StepperMotor` 类可以实现步进电机的控制：
- 步进电机 FOC 算法
- 运动控制主循环
- 监控
- 用户通信接口

## Step 1. Creating the instance of the stepper motor（步骤1. 为步进电机创建实例）
为了举例说明步进电机的使用，需要指定电机的极对数  `pole pairs` 。
```cpp
// StepperMotor(  int pp)
// - pp  - pole pair number
StepperMotor motor = StepperMotor( 50 );
```
<blockquote class="info"><p class="heading">极对数 </p>
大多数步进电机每旋转一周是200步，电机极对数是50。在实践中，你可以通过用每周旋转的步数除以 <code class="highlighter-rouge">4</code>来得到 <code class="highlighter-rouge">pole_paris</code> 极对数。<br><br>
如果你不确定你电机的极对数 <code class="highlighter-rouge">pole_paris</code> number ，library 库提供了<code class="highlighter-rouge">find_pole_pairs_number.ino</code>实例来计算 <code class="highlighter-rouge">pole_paris</code> number 极对数。
 </blockquote>


## Step 2. Linking the sensor （步骤2. 连接传感器）
定义好 `motor` 和初始化 sensor 之后，执行以下代码来连接 `motor` 和 `sensor` ：  
```cpp
// link the sensor to the motor
motor.linkSensor(&sensor);
```
方法 `linkSensor` 能够将电机连接到本库的任何传感器。 `sensor` 将用于确定电机的 FOC 算法中的电路位置，以及速度和位置的运动控制主循环。更多信息请参阅 [位置传感器文档](sensors) 。

<blockquote class="info">当使用开环运动控制时，不需要进行连接。</blockquote>

## Step 3. Linking the driver （步骤3. 连接驱动程序）
定义好 `motor` 和初始化 driver 之后，执行以下代码来连接 `motor` 和 `driver` ：
```cpp
// link the driver to the motor
motor.linkDriver(&driver);
```

 `StepperMotor` 类期望接收到一个 `StepperDriver` 类实例，通过，默认的 `StepperDriver4PWM` 来实现。 `driver`  能够实现所有涉及到微控制器架构和驱动硬件的具体操作。 更多信息请参阅 [步进电机驱动文档](stepperdriver) ！

## Step 4. Configuration（步骤4. 配置）

如果你选择不设置某些配置参数，它们将会使用`defaults.h` 文件中定义的默认值，查看 [library 库源代码](source_code) 来进行更深入的挖掘。

### Step 4.1 Modulation type（步骤4.1 调制方式）

可以改变 `motor.foc_modulation` 变量来传输：
```cpp
// choose FOC modulation
// FOCModulationType::SinePWM;
motor.foc_modulation = FOCModulationType::SinePWM;
```
当前的版本 <a href="https://github.com/simplefoc/Arduino-FOC/releases"> <i class="fa fa-tag"> current version</i></a>  的 `StepperMotor` 类只有正弦PWM调制。

有关这些方法的理论和源代码实现的更多信息，请查看 [FOC实现文档](foc_implementation) 或访问 [深入挖掘部分](digging_deeper) 。


### Step 4.2 Sensor and motor aligning parameters（步骤4.2 传感器和电机校准参数）
用于电机和传感器校准的电压设置变量`motor.voltage_sensor_align`：
```cpp
// aligning voltage [V]
// default 6V
motor.voltage_sensor_align = 3;
```

### Step 4.3 Motion control parameters  （步骤4.3运动控制参数）

 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 中有3种不同的闭环控制：
- [torque control loop using voltage（用电压控制力矩）](voltage_loop)
- [position/angle motion control（位置/角度运动控制）](angle_loop)
- [velocity motion control（速度运动控制）](velocity_loop)

另外 <span class="simple">Simple<span class="foc">FOC</span>library</span> 也有两种开环控制策略：
- [position open-loop control（位置开环控制）](angle_openloop)
- [velocity open-loop control（速度开环控制）](velocity_openloop)

通过改变 `motor.controller` 变量来设置它：
```cpp
// set FOC loop to be used
// MotionControlType::torque      - torque control loop using voltage
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
// voltage limit
motor.voltage_limit = 12; // Volts -  default driver.voltage_limit
```
### Step 4.4 Configuration done - `motor.init()` （步骤4.4 完成配置）
最后，通过运行 `init()` 函数完成配置，该函数使用配置值完成所有的硬件和软件电机组件。
```cpp
// initialize motor
motor.init();
```

## Step 5. Field Oriented Control initialization（步骤5. FOC 初始化）

在电机和传感器初始化和配置之后，开始控制运动之前，我们需要初始化 FOC 算法。
```cpp
// align sensor and start FOC
motor.initFOC();
```
<blockquote class="danger"><p class="heading"> 开环控制时可以跳过它！</p>开环控制时，不应该调用这个函数！ </blockquote>

该函数校准传感器和电机的零位，并初始化 FOC 变量，在 Arduino 的 `setup` 函数中运行。调用这个函数之后，FOC就准备好了，设置也完成了！

如果你使用的是绝对传感器，比如磁传感器，你可以在 `initFOC()` 中提供传感器偏移量 `zero_electric_offset` 和传感器方向 `sensor_direction` 来避免校准程序：
```cpp
// align sensor and start FOC
//motor.initFOC(zero_electric_offset, sensor_direction);
motor.initFOC(2.15, Direction::CW);
```
你可以运行 `find_sensor_offset_and_direction.ino` 实例来找到这些值。

有关 `initFOC()` 中实际发生的情况的更多信息，请查看 [FOC 源代码实现](foc_implementation) 。

## Step 6. Real-time motion control（步骤6. 实时运动控制）

用两个函数来完成 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 的实时运动控制： `motor.loopFOC()` 和 `motor.move(float target)` 。
```cpp
// Function running FOC algorithm in real-time
// it calculates the gets motor angle and sets the appropriate voltages 
// to the phase pwm signals
// - the faster you can run it the better Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```
<blockquote class="danger"><p class="heading"> 开环控制时可以跳过它！</p>开环控制时，不应该调用这个函数！</blockquote>

 `loopFOC()` 函数从传感器获取当前电机角度， 将其转换成电角度并将正交 <i>U<sub>q</sub></i> 电压 `motor.voltage_q` 转换为电机上相应的相电压 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 。

将 <i>U<sub>q</sub></i> 转换到 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i>  是由 ***Sinusoidal PWM*** 的配置参数 `motor.foc_modulation` 定义的。 

<blockquote class="info"><p class="heading"> 新特性 - <i>U<sub>d</sub></i> 直流电压支持！</p><i><b>Sinusoidal PWM</b></i> 支持直流电压设置 <i>U<sub>d</sub></i> ，直流电压可以通过改变 <code class="highlighter-rouge">motor.voltage_d</code>变量来设定！这是一个新特性，在当前版本中会被更多地使用。</blockquote>

这个函数的执行时间很关键，因此，尽可能快地执行 `motor.loopFOC()` 函数是非常重要的！

<blockquote class="warning"><p class="heading">经验法则：执行时间</p>


运行这个函数的速度越快越好！
<ul style="margin-bottom:0em">
    <li> Arduino UNO <code class="highlighter-rouge">loop()</code> ~ 1ms </li>
    <li> Esp32 <code class="highlighter-rouge">loop()</code> ~ 500us</li>
    <li> Bluepill <code class="highlighter-rouge">loop()</code> ~ 200us</li>
    <li> Nucleo <code class="highlighter-rouge">loop()</code> ~ 100us</li>
</ul>
</blockquote>


最后，利用 FOC 算法设置电机的相位电压，进行运动控制。这是通过 `motor.move()` 函数完成的。

```cpp
// Function executing the control loops configured by the motor.controller parameter of the motor. 
// - This function doesn't need to be run upon each loop execution - depends of the use case
//
// target  Either voltage, angle or velocity based on the motor.controller
//         If it is not set the motor will use the target set in its variable motor.target
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
