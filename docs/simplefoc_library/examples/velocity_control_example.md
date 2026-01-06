---
layout: default
title: 速度控制示例
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /velocity_control_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---


# 速度控制示例<br>使用 Drotek 的 L6234 驱动器
[Drotek 的 L6234  breakout 板](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)是一款非常简约的三相无刷直流电机驱动器，非常适合快速开启你的 FOC 体验。这里我们介绍使用 <span class="simple">简易<span class="foc">FOC</span>库</span>和以下硬件的速度控制示例项目：

[Arduino UNO](https://store.arduino.cc/arduino-uno-rev3) | [Drotek L6234 breakout 板](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html) | [AMT 103 编码器](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM8017-120T](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_)
--- | --- | --- | ---
<img src="extras/Images/arduino_uno.jpg" class="imgtable150"> |  <img src="extras/Images/l6234.jpg" style="width:140px">  | <img src="extras/Images/enc1.png" class="imgtable150">  | <img src="extras/Images/big.jpg" class="imgtable150">


# 连接所有组件
如需更深入了解 Arduino UNO 与 L6234 的连接，请查看[连接示例](arduino_l6234)。
<p><img src="extras/Images/uno_l6234.jpg" class="width60"></p>

### 编码器
- 编码器通道 `A` 和 `B` 连接到 Arduino 的外部中断引脚 `2` 和 `3`。

### L6234 breakout 板
- 连接到 Arduino 引脚 `9`、`10` 和 `11`（也可以使用引脚 `5` 和 `6`）。
- 此外，你可以将 `使能` 引脚连接到 Arduino 的任何数字引脚，图片中显示的是引脚 `8`，但这是可选的。你也可以将驱动器使能直接连接到 5V。
- 确保连接电源和 Arduino 的公共接地。

### 电机
- 电机相 `a`、`b` 和 `c` 直接连接到驱动器输出。


# Arduino 代码
让我们浏览这个示例的完整代码并一起编写。
首先，你需要包含 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
确保你已安装该库。如果还没有安装，请查看[入门页面](installation)

## 编码器代码
首先，我们定义 `Encoder` 类，包含 A 和 B 通道引脚以及每转脉冲数。
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
就这样，接下来设置电机。

<blockquote class="info">有关编码器的更多配置参数，请查看 <code class="highlighter-rouge">Encoder</code> 类的<a href="encoder">文档</a>。</blockquote>


## 电机代码
首先，我们需要定义 `BLDCMotor` 类，并指定极对数（`14`）
```cpp
// define BLDC motor
BLDCMotor motor = BLDCMotor(14);
```
<<blockquote class="warning">如果你不确定你的极对数是多少，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code> 示例。</blockquote>



接下来，我们需要定义 `BLDCDriver3PWM` 类，包含电机的 PWM 引脚号和驱动器使能引脚

```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

然后在 `setup()` 中，如果电源电压不是 `12` 伏，我们首先配置电源电压并初始化驱动器。
```cpp
// power supply voltage
// default 12V
driver.voltage_power_supply = 12;
driver.init();
```
然后，我们通过指定 `motor.controller` 变量来告诉电机运行哪个控制环。
```cpp
// set control loop type to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::velocity;
```
现在，我们配置 PI 控制器参数
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
motor.LPF_velocity.Tf = 0.01;
```
<blockquote class="info">有关速度控制环参数的更多信息，请查看<a href="velocity_loop">文档</a>。</blockquote>

最后，我们将编码器和驱动器连接到电机，进行硬件初始化和磁场定向控制的初始化。
```cpp  
// link the motor to the sensor
motor.linkSensor(&encoder);
// link driver
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

// iterative function setting and calculating the velocity loop
// this function can be run at much lower frequency than loopFOC function
motor.move(target_velocity);
}
```
就这样，现在来看看完整代码！
<blockquote class="info">有关更多配置参数和控制环，请查看 <code class="highlighter-rouge">BLDCMotor</code> 类的<a href="motors_config">文档</a>。</blockquote>

## 完整的 Arduino 代码
在完整代码中，我添加了一个小型串行[命令器接口](commander_interface)，以便能够实时更改速度目标值。
```cpp
#include <SimpleFOC.h>

// define BLDC motor
BLDCMotor motor = BLDCMotor( 14 );
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);

// define Encoder
Encoder encoder = Encoder(2, 3, 2048);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// velocity set point variable
float target_velocity = 0;
// commander interface
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.scalar(&target_velocity, cmd); }

void setup() {
  
  // initialize encoder hardware
  encoder.init();
  // hardware interrupt enable
  encoder.enableInterrupts(doA, doB);

  // power supply voltage
  // default 12V
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor to the driver
  motor.linkDriver(&driver);

  // set control loop type to be used
  motor.controller = MotionControlType::velocity;

  // velocity PI controller parameters
  // default P=0.5 I = 10
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  //default voltage_power_supply
  motor.voltage_limit = 6;
  
  // velocity low pass filtering
  // default 5ms - try different values to see what is the best. 
  // the lower the less filtered
  motor.LPF_velocity.Tf = 0.01;
  

  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // initialize motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target velocity");

  // monitoring port
  Serial.begin(115200);
  Serial.println("Motor ready.");
  Serial.println("Set the target velocity using serial terminal:");
  _delay(1000);
}


void loop() {
  // iterative foc function 
  motor.loopFOC();

  // iterative function setting and calculating the velocity loop
  // this function can be run at much lower frequency than loopFOC function
  motor.move(target_velocity);

  // user communication
  command.run();
}
```
