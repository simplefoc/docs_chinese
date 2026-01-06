---
layout: default
title:  位置控制实例
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /position_control_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---



# 位置控制示例<br>使用 <span class="simple">简易<span class="foc">FOC</span>扩展板</span>
在这个无刷电机位置控制示例中，我们将使用以下硬件：

[Arduino UNO](https://store.arduino.cc/arduino-uno-rev3) | [Arduino <span class="simple">简易<span class="foc">FOC</span>扩展板</span>](arduino_simplefoc_shield_showcase) | [AMT 103 编码器](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM4108H-120T 电机](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571)
--- | --- | --- | ---
<img src="extras/Images/arduino_uno.jpg" class="imgtable150"> |  <img src="extras/Images/shield_to_v13.jpg" class="imgtable150">  | <img src="extras/Images/enc1.png" class="imgtable150">  | <img src="extras/Images/mot.jpg" class="imgtable150">


# 连接所有部件
有关 Arduino UNO 和 <span class="simple">简易<span class="foc">FOC</span>扩展板</span> 连接的更深入解释，请查看 [连接示例](arduino_simplefoc_shield)。
<p><img src="extras/Images/foc_shield_v13.jpg" class="width60"></p>

有关 <span class="simple">简易<span class="foc">FOC</span>扩展板</span> 的更多信息，请查看 [文档](arduino_simplefoc_shield_showcase)。

## 编码器
- A 相和 B 相连接到编码器接口 `P_ENC` 的 A 端和 B 端。

## 电机
- 电机的 a、b、c 相直接连接到电机端子接口 `TB_M1`。


### 小小的动力 :D
<p><img src="extras/Images/simple_foc_shield_v13_small.gif" class="width60"></p>

# Arduino 代码
让我们浏览这个示例的完整代码并一起编写它。
首先，你需要包含 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
确保你已经安装了该库。如果你还没有安装，请查看 [入门页面](installation)。


## 编码器代码
首先，我们定义 `Encoder` 类，指定 A 相和 B 相的引脚以及每转的脉冲数。
```cpp
// define Encoder
Encoder encoder = Encoder(2, 3, 2048);
```
然后，我们定义缓冲回调函数。
```cpp
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
在 `setup()` 函数中，我们初始化编码器并启用中断：
```cpp
// initialize encoder hardware
encoder.init();
// hardware interrupt enable
encoder.enableInterrupts(doA, doB);
```
这就是编码器的设置，接下来设置电机。

<blockquote class="info">有关编码器的更多配置参数，请查看 <code class="highlighter-rouge">Encoder</code> 类的 <a href="encoder">文档</a>。</blockquote>


## 电机代码
首先，我们需要定义 `BLDCMotor` 类，并指定极对数（`11`）。
```cpp
// define BLDC motor
BLDCMotor motor = BLDCMotor(11);
```
<blockquote class="warning">如果你不确定你的电机极对数，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code> 示例。</blockquote>


接下来，我们需要定义 `BLDCDriver3PWM` 类，指定电机的 PWM 引脚和驱动器使能引脚。
```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

然后在 `setup()` 中，如果电源电压不是 `12` 伏，我们首先配置电源电压，然后初始化驱动器。

```cpp
// power supply voltage
// default 12V
driver.voltage_power_supply = 12;
driver.init();
```
然后，我们通过指定 `motor.controller` 变量来告诉电机运行哪个控制环路。
```cpp
// set control loop type to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```
现在我们配置速度 PI 控制器参数。
```cpp
// velocity PI controller parameters
// default P=0.5 I = 10
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
// jerk control using voltage voltage ramp
// default value is 300 volts per sec  ~ 0.3V per millisecond
motor.PID_velocity.output_ramp = 1000;

//default voltage_power_supply
motor.voltage_limit = 6;
```
此外，我们可以配置低通滤波器时间常数 `Tf`。
```cpp
// velocity low pass filtering
// default 5ms - try different values to see what is the best. 
// the lower the less filtered
motor.LPF_velocity.Tf = 0.01;
```
最后，我们配置位置 P 控制器增益和速度限制变量。
```cpp
// angle P controller 
// default P=20
motor.P_angle.P = 20;
//  maximal velocity of the position control
// default 20
motor.velocity_limit = 4;
```
<blockquote class="info">有关角度控制环路参数的更多信息，请查看 <a href="angle_loop">文档</a>。</blockquote>

接下来，我们将编码器和驱动器连接到电机，进行硬件初始化和磁场定向控制的初始化。
```cpp  
// link the motor to the sensor
motor.linkSensor(&encoder);
// link the motor to the driver
motor.linkDriver(&driver);

// initialize motor
motor.init();
// align encoder and start FOC
motor.initFOC();
```
电机代码中最后一个重要部分当然是 `loop` 函数中的 FOC 程序。
```cpp
void loop() {
// iterative FOC function
motor.loopFOC();

// iterative function setting and calculating the angle/position loop
// this function can be run at much lower frequency than loopFOC function
motor.move(target_angle);
}
```
这就是全部内容，现在让我们看看完整的代码！

<blockquote class="info">有关更多配置参数和控制环路，请查看 <code class="highlighter-rouge">BLDCMotor</code> 类的 <a href="motors_config">文档</a>。</blockquote>

## 完整的 Arduino 代码
在完整代码中，我添加了一个小型的串行 [命令器接口](commander_interface)，以便能够实时更改位置/角度目标值。

```cpp
#include <SimpleFOC.h>

// init BLDC motor
BLDCMotor motor = BLDCMotor( 11 );
// init driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
//  init encoder
Encoder encoder = Encoder(2, 3, 2048);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// angle set point variable
float target_angle = 0;
// commander interface
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.scalar(&target_angle, cmd); }

void setup() {

  // initialize encoder hardware
  encoder.init();
  // hardware interrupt enable
  encoder.enableInterrupts(doA, doB);
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // power supply voltage
  // default 12V
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor to the driver
  motor.linkDriver(&driver);

  // set control loop to be used
  motor.controller = MotionControlType::angle;
  
  // controller configuration based on the control type 
  // velocity PI controller parameters
  // default P=0.5 I = 10
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // jerk control using voltage voltage ramp
  // default value is 300 volts per sec  ~ 0.3V per millisecond
  motor.PID_velocity.output_ramp = 1000;
  
  //default voltage_power_supply
  motor.voltage_limit = 6;

  // velocity low pass filtering
  // default 5ms - try different values to see what is the best. 
  // the lower the less filtered
  motor.LPF_velocity.Tf = 0.01;

  // angle P controller 
  // default P=20
  motor.P_angle.P = 20;
  //  maximal velocity of the position control
  // default 20
  motor.velocity_limit = 4;
  
  // initialize motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();

  // add target command T
  command.add('T', onTarget, "target angle");

  // monitoring port
  Serial.begin(115200);
  Serial.println("Motor ready.");
  Serial.println("Set the target angle using serial terminal:");
  _delay(1000);
}

void loop() {
  // iterative FOC function
  motor.loopFOC();

  // function calculating the outer position loop and setting the target position 
  motor.move(target_angle);

  // user communication
  command.run();
}
```
