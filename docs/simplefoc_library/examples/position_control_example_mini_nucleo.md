---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span>Mini</span> & Nucleo
parent: 示例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 10
permalink: /mini_example_nucleo
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---



# 位置控制示例<br>使用 <span class="simple">Simple<span class="foc">FOC</span>Mini</span>
在这个无刷电机位置控制示例中，我们将使用以下硬件：

[Stm32 Nucleo-64](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | [Arduino <span class="simple">Simple<span class="foc">FOC</span>Mini</span>](simplefocmini) | [AMT 103 编码器](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM4108H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571)
--- | --- | --- | ---
<img src="extras/Images/nucleo.jpg" class="imgtable150"> |  <img src="https://simplefoc.com/assets/img/mini.jpg" class="imgtable150">  | <img src="extras/Images/enc1.png" class="imgtable150">  | <img src="extras/Images/mot.jpg" class="imgtable150">


# 连接所有设备
<p><img src="extras/Images/connection_mini_nucleo.jpg" class="width60"></p>

有关 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 的更多信息，请查看 [文档](simplefocmini)。目前，有两个版本的 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 开发板可用：v1.0 和 v1.1。两个版本之间的主要区别在于引脚的顺序。此示例可用于两个版本的开发板，但引脚分配略有不同。<br>
选择您的 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 版本：


<a href="javascript:show(0,'mini');" class="btn btn-mini btn-0 btn-primary"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.0</a>
<a href ="javascript:show(1,'mini');" class="btn btn-mini  btn-1"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.1</a>

<p class="mini mini-0" ><img src="extras/Images/mini_connection_mucleo.png" class="width60"></p>
<p class="mini mini-1 hide" ><img src="extras/Images/miniv11_connection_mucleo.png" class="width60"></p>

## 编码器
- 通道 `A` 和 `B` 连接到 Arduino UNO 的引脚 `2` 和 `3`。

## 电机
- 电机相 `a`、`b` 和 `c` 直接连接到 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 开发板的电机端子连接器 `M1`、`M2` 和 `M3`。

## <span class="simple">Simple<span class="foc">FOC</span>Mini</span>

<a href="javascript:show(0,'mini');" class="btn btn-mini btn-0 btn-primary"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.0</a>
<a href ="javascript:show(1,'mini');" class="btn btn-mini  btn-1"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.1</a>

<div markdown="1" class="mini mini-0">

- 将 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 开发板连接到 Nucleo 开发板最方便的方法是将其堆叠在引脚 `10-13` 上。
  - `GND` - `GND`
  - `IN1` - `13`
  - `IN2` - `12`
  - `IN3` - `11`
  - `EN` - `10`

</div>


<div markdown="1" class="mini mini-1 hide">

- 将 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 开发板连接到 Nucleo 开发板最方便的方法是将其堆叠在引脚 `10-13` 上。
  - `GND` - `GND`
  - `EN` - `13`
  - `IN3` - `12`
  - `IN2` - `11`
  - `IN1` - `10`

</div>

# Arduino 代码
让我们浏览一下这个示例的完整代码并一起编写它。
首先，您需要包含 `SimpleFOC` 库：
```cpp
#include <SimpleFOC.h>
```
确保您已安装该库。如果还没有安装，请查看 [入门页面](installation)


## 编码器代码
首先，我们定义 `Encoder` 类，包含 A 和 B 通道引脚以及每转的脉冲数。
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
就是这样，让我们设置电机。

<blockquote class="info">有关编码器的更多配置参数，请查看 <code class="highlighter-rouge">Encoder</code> 类的 <a href="encoder">文档</a>。</blockquote>


## 电机代码


<a href="javascript:show(0,'mini');" class="btn btn-mini btn-0 btn-primary"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.0</a>
<a href ="javascript:show(1,'mini');" class="btn btn-mini  btn-1"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.1</a>

首先，我们需要定义 `BLDCMotor` 类，包含极对数（`11`）
```cpp
// define BLDC motor
BLDCMotor motor = BLDCMotor(11);
```
<blockquote class="warning">如果您不确定极对数是多少，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code> 示例。</blockquote>


接下来，我们需要定义 `BLDCDriver3PWM` 类，包含电机的 PWM 引脚号和驱动器使能引脚


<div markdown="1" class="mini mini-0">

```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(13, 12, 11, 10);
```
</div>
<div markdown="1" class="mini mini-1 hide">

```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(10, 11, 12, 13);
```
</div>


然后在 `setup()` 中，如果电源电压不是 `12` 伏，我们首先配置电源电压并初始化驱动器。
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
就是这样，现在让我们看看完整的代码！
<blockquote class="info">有关更多配置参数和控制环路，请查看 <code class="highlighter-rouge">BLDCMotor</code> 类的 <a href="motors_config">文档</a>。</blockquote>

## 完整的 Arduino 代码
在完整代码中，我添加了一个小型串行 [命令器接口](commander_interface)，以便能够实时更改位置/角度目标值。




<a href="javascript:show(0,'mini');" class="btn btn-mini btn-0 btn-primary"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.0</a> 
<a href ="javascript:show(1,'mini');" class="btn btn-mini  btn-1"><span class="simple">Simple<span class="foc">FOC</span>Mini</span> V1.1</a> 

<div markdown="1" class="mini mini-0">

```cpp
#include <SimpleFOC.h>

// init BLDC motor
BLDCMotor motor = BLDCMotor( 11 );
// init driver
BLDCDriver3PWM driver = BLDCDriver3PWM(13, 12, 11, 10);
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


<div markdown="1" class="mini mini-1 hide">

```cpp
#include <SimpleFOC.h>

// init BLDC motor
BLDCMotor motor = BLDCMotor( 11 );
// init driver
BLDCDriver3PWM driver = BLDCDriver3PWM(10, 11, 12, 13);
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