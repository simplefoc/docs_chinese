---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Mini</span> & UNO
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 9
permalink: /mini_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---



# 位置控制示例<br>使用 <span class="simple">Simple<span class="foc">FOC</span>Mini</span>
在这个无刷电机位置控制示例中，我们将使用以下硬件：

[Arduino UNO](https://store.arduino.cc/arduino-uno-rev3) | [Arduino <span class="simple">Simple<span class="foc">FOC</span>Mini</span>](simplefocmini) | [AMT 103 编码器](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM4108H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571)
--- | --- | --- | --- 
<img src="extras/Images/arduino_uno.jpg" class="imgtable150"> |  <img src="https://simplefoc.com/assets/img/mini.jpg" class="imgtable150">  | <img src="extras/Images/enc1.png" class="imgtable150">  | <img src="extras/Images/mot.jpg" class="imgtable150"> 


# 连接所有组件
<p><img src="extras/Images/connection_mini.jpg" class="width60"></p>

有关 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 的更多信息，请查看 [文档](simplefocmini)。目前，有两个版本的 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 板可用：v1.0 和 v1.1。两个版本之间的主要区别是引脚的顺序。本示例可用于两个版本的板，但在引脚分配上有细微差异。<br>
选择你的 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 版本：



<a href="javascript:show(0,'mini');" class="btn btn-mini btn-0 btn-primary"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.0</a> 
<a href ="javascript:show(1,'mini');" class="btn btn-mini  btn-1"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.1</a> 


<p class="mini mini-0" ><img src="extras/Images/mini_connection_uno.png" class="width60"></p>
<p class="mini  mini-1 hide" ><img src="extras/Images/miniv11_connection_uno.png" class="width60"></p>

## 编码器
- 通道 `A` 和 `B` 连接到 Arduino UNO 的引脚 `2` 和 `3`。

## 电机
- 电机相 `a`、`b` 和 `c` 直接连接到 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 板的电机端子连接器 `M1`、`M2` 和 `M3`。


## <span class="simple">Simple<span class="foc">FOC</span>Mini</span>


<a href="javascript:show(0,'mini');" class="btn btn-mini btn-0 btn-primary"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.0</a> 
<a href ="javascript:show(1,'mini');" class="btn btn-mini  btn-1"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.1</a> 

<div markdown="1" class="mini mini-0">
- 将 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> v1.0 板连接到 Arduino UNO 最方便的方法是将其堆叠在引脚 `8-12` 上。
  - `GND` - `12`
  - `IN1` - `11`
  - `IN2` - `10`
  - `IN3` - `9`
  - `EN` - `8`


<blockquote class="warning" markdown="1">
引脚 `12` 不是真正的接地引脚。由于 mini 的 `GND` 引脚不传输电力，我们可以通过将引脚 `12` 声明为数字输出并将其设置为 `LOW` 来近似作为 `GND` 引脚。不过这种技术并非总是有效。如果发现电机即使在开环控制模式下也会振动，那么应该放弃这种方法，将 mini 的 `GND` 引脚连接到 Arduino UNO 的 `GND` 引脚。这样振动应该会完全停止。
</blockquote>

</div>

<div markdown="1" class="mini mini-1 hide">

- 将 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> v1.1 板连接到 Arduino UNO 最方便的方法是将其堆叠在引脚 `9-12` 上。
  - `GND` - `GND`
  - `EN` - `12`
  - `IN3` - `11`
  - `IN2` - `10`
  - `IN1` - `9`

</div>



# 小小的动力 :D
<p><img src="extras/Images/mini_gif1.gif" class="width60"></p>


# Arduino 代码
让我们浏览这个示例的完整代码并一起编写它。
首先需要做的是包含 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
确保你已经安装了该库。如果还没有安装，请查看 [入门页面](installation)。


## 编码器代码
首先，我们定义 `Encoder` 类，指定 A 和 B 通道引脚以及每转的脉冲数。
```cpp
// define Encoder
Encoder encoder = Encoder(2, 3, 2048);
```
然后定义缓冲回调函数。
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
就这样，让我们设置电机。

<blockquote class="info">有关编码器的更多配置参数，请查看 <code class="highlighter-rouge">Encoder</code> 类的 <a href="encoder">文档</a>。</blockquote>

## 电机代码

<a href="javascript:show(0,'mini');" class="btn btn-mini btn-0 btn-primary"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.0</a> 
<a href ="javascript:show(1,'mini');" class="btn btn-mini  btn-1"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.1</a> 

首先，我们需要定义 `BLDCMotor` 类，并指定极对数（`11`）
```cpp
// define BLDC motor
BLDCMotor motor = BLDCMotor(11);
```
<blockquote class="warning">如果你不确定你的极对数是多少，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code> 示例。</blockquote>

<div markdown="1" class="mini mini-1 hide">

接下来，我们需要定义 `BLDCDriver3PWM` 类，指定电机的 PWM 引脚号和驱动器使能引脚
```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 12);
```

</div>


<div markdown="1" class="mini mini-0">

接下来，我们需要定义 `BLDCDriver3PWM` 类，指定电机的 PWM 引脚号和驱动器使能引脚

```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(11, 10, 9, 8);
```

</div>

然后在 `setup()` 中，如果电源电压不是 `12` 伏，我们首先配置电源电压并初始化驱动器。

```cpp
// power supply voltage
// default 12V
driver.voltage_power_supply = 12;
driver.init();
```

<div markdown="1" class="mini mini-0">

此外，我们添加代码将引脚 `12` 声明为数字输出并设置为 `LOW`，用作公共接地信号。在 `setup` 中我们添加

```cpp
pinMode(12,OUTPUT); // declares pin 12 as output and sets it to LOW
```

</div>

然后，我们通过指定 `motor.controller` 变量来告诉电机运行哪个控制环路。
```cpp
// set control loop type to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```
现在我们配置速度 PI 控制器参数
```cpp
// velocity PI controller parameters
// default P=0.5 I = 10
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;

//default voltage_power_supply
motor.voltage_limit = 6;
```
此外，我们可以配置低通滤波器时间常数 `Tf`
```cpp
// velocity low pass filtering
// default 5ms - try different values to see what is the best. 
// the lower the less filtered
motor.LPF_velocity.Tf = 0.02;
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
电机代码中最后一个重要的部分当然是 `loop` 函数中的 FOC 程序。
```cpp
void loop() {
// iterative FOC function
motor.loopFOC();

// iterative function setting and calculating the angle/position loop
// this function can be run at much lower frequency than loopFOC function
motor.move();
}
```
就这样，现在让我们看看完整的代码！
<blockquote class="info">有关更多配置参数和控制环路，请查看 <code class="highlighter-rouge">BLDCMotor</code> 类的 <a href="motors_config">文档</a>。</blockquote>

## 完整的 Arduino 代码
在完整的代码中，我添加了一个小型的串行 [命令器接口](commander_interface)，以便能够实时更改位置/角度目标值。



<div markdown="1" class="mini mini-0">

```cpp
#include <SimpleFOC.h>

// init BLDC motor
BLDCMotor motor = BLDCMotor( 11 );
// init driver
BLDCDriver3PWM driver = BLDCDriver3PWM(11, 10, 9, 8);
//  init encoder
Encoder encoder = Encoder(2, 3, 2048);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// commander interface
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.motion(&motor, cmd); }

void setup() {

  pinMode(12,OUTPUT); // declares pin 12 as output and sets it to LOW

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
  
  //default voltage_power_supply
  motor.voltage_limit = 6;

  // velocity low pass filtering
  // default 5ms - try different values to see what is the best. 
  // the lower the less filtered
  motor.LPF_velocity.Tf = 0.02;

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
  command.add('T', doTarget, "motion control");

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
  motor.move();

  // commander interface with the user
  commander.run();

}
```

</div>

<div markdown="1" class="mini mini-1 hide">

```cpp
#include <SimpleFOC.h>

// init BLDC motor
BLDCMotor motor = BLDCMotor( 11 );
// init driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 12);
//  init encoder
Encoder encoder = Encoder(2, 3, 2048);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// commander interface
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.motion(&motor, cmd); }

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
  
  //default voltage_power_supply
  motor.voltage_limit = 6;

  // velocity low pass filtering
  // default 5ms - try different values to see what is the best. 
  // the lower the less filtered
  motor.LPF_velocity.Tf = 0.02;

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
  command.add('T', doTarget, "motion control");

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
  motor.move();

  // commander interface with the user
  commander.run();

}
```

</div>