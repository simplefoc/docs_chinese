---
layout: default
title: 云台控制器示例
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /gimbal_velocity_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---



# 速度控制示例<br>使用 HMBGC V2.2 板
这是一个使用 FOC 算法的非常简单且很棒的示例，采用云台控制器板。它们本不打算用于闭环位置控制，但 <span class="simple">简易<span class="foc">FOC</span>库</span> 不仅让这成为可能，而且还相当简单。

以下是我们在这个项目中使用的硬件：

[HMBGC V2.2](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | [AMT 103 编码器](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM8017-120T](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_)
--- | --- | --- | ---
<img src="extras/Images/pinout.jpg" class="imgtable150"> | <img src="extras/Images/enc1.png" class="imgtable150"> | <img src="extras/Images/big.jpg" class="imgtable150">


# 连接所有部件
有关 HMBGC V2.2 连接的更深入解释，请查看 [连接示例](hmbgc)。
<p><img src="extras/Images/hmbgc_v22.jpg" class="width60">
</p>

## 编码器
<blockquote class="warning"> <p class="heading">引脚限制</p>
HMBGC 无法访问 Arduino 的外部中断引脚 <code class="highlighter-rouge">2</code> 和 <code class="highlighter-rouge">3</code>，而且我们唯一可以访问的引脚是模拟引脚 <code class="highlighter-rouge">A0-A7</code>。
因此，我们需要使用软件中断库来读取编码器通道，更多信息请查看编码器 <a href="encoder">代码实现</a>。</blockquote>

- 编码器通道 `A` 和 `B` 连接到引脚 `A0` 和 `A1`。

## 电机
- 电机相 `a`、`b` 和 `c` 直接连接到驱动器输出
- 电机端子 `M1` 使用 Arduino 引脚 `9`、`10`、`11`，`M2` 使用 `3`、`5`、`6`


# Arduino 代码
让我们浏览这个示例的完整代码并一起编写。
首先，你需要包含 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
确保你已经安装了该库。如果你还没有安装，请查看 [入门页面](installation)。

另外，对于像 HMBGC 这样的云台控制器，我们无法访问硬件中断引脚，所以你需要一个软件中断库。
我建议使用 `PciManager` 库。如果你还没有安装它，可以直接通过 Arduino 库管理器进行安装。更多信息请查看 `Encoder` 类 [文档](encoder)。
安装好后，请将其包含到草图中：
```cpp
// software interrupt library
#include <PciManager.h>
#include <PciListenerImp.h>
```

## 编码器代码
首先，我们定义 `Encoder` 类，包含 A 和 B 通道引脚以及每转脉冲数。
```cpp
// define Encoder
Encoder encoder = Encoder(A0, A1, 2048);
```
然后我们定义缓冲回调函数。
```cpp
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
接下来我们定义 `PciManager` 引脚变化监听器：
```cpp
// pin change listeners
PciListenerImp listenerA(encoder.pinA, doA);
PciListenerImp listenerB(encoder.pinB, doB);
``` 
在 `setup()` 函数中，首先初始化编码器：
```cpp
// initialize encoder hardware
encoder.init();
```
并且，代替调用 `encoder.enableInterrupt()` 函数，我们使用 `PciManager` 库接口来附加中断。

```cpp
// interrupt initialization
PciManager.registerListener(&listenerA);
PciManager.registerListener(&listenerB);
```
就这样，我们来设置电机。

<blockquote class="info">有关编码器的更多配置参数，请查看 <code class="highlighter-rouge">Encoder</code> 类 <a href="encoder">文档</a>。</blockquote>


## 电机代码
首先，我们需要定义 `BLDCMotor` 类，并指定极对数（`14`）
```cpp
// define BLDC motor
BLDCMotor motor = BLDCMotor(14);
```
<blockquote class="warning">如果你不确定你的极对数是多少，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code> 示例。</blockquote>


接下来，我们需要定义 `BLDCDriver3PWM` 类，包含电机的 PWM 引脚号
```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11);
```

然后在 `setup()` 中，如果电源电压不是 `12` 伏，首先配置电源电压并初始化驱动器。
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
现在我们配置 PI 控制器参数
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
此外，我们可以配置低通滤波器时间常数 `Tf`
```cpp
// velocity low pass filtering
// default 5ms - try different values to see what is the best. 
// the lower the less filtered
motor.LPF_velocity.Tf = 0.01;
```
<blockquote class="info">有关速度控制环参数的更多信息，请查看 <a href="velocity_loop">文档</a>。</blockquote>

最后，我们将编码器和驱动器连接到电机，进行硬件初始化和磁场定向控制初始化。
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
就这样，现在让我们看看完整的代码！
<blockquote class="info">有关更多配置参数和控制环，请查看 <code class="highlighter-rouge">BLDCMotor</code> 类 <a href="motors_config">文档</a>。</blockquote>

## 完整的 Arduino 代码
在完整代码中，我添加了一个小型串行 [命令器接口](commander_interface)，以便能够实时更改速度目标值。
```cpp
#include <SimpleFOC.h>
// software interrupt library
#include <PciManager.h>
#include <PciListenerImp.h>


// define BLDC motor
BLDCMotor motor = BLDCMotor( 14 );
// define driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11);
//  define Encoder
Encoder encoder = Encoder(A0, A1, 500);
// interrupt routine initialization
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// encoder interrupt init
PciListenerImp listenerA(encoder.pinA, doA);
PciListenerImp listenerB(encoder.pinB, doB);

// target variable
float target_velocity=0;
// commander interface
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.scalar(&target_velocity, cmd); }

void setup() {
  // initialize encoder hardware
  encoder.init();
  // interrupt initialization
  PciManager.registerListener(&listenerA);
  PciManager.registerListener(&listenerB);
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // power supply voltage
  // default 12V
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor to the driver
  motor.linkDriver(&driver);

  // set FOC loop to be used
  // MotionControlType::torque
  // MotionControlType::velocity
  // MotionControlType::angle
  motor.controller = MotionControlType::velocity;

  // controller configuration based on the control type 
  // velocity PI controller parameters
  // default P=0.5 I = 10
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // jerk control using voltage voltage ramp
  // default value is 300 volts per sec  ~ 0.3V per millisecond
  motor.PID_velocity.output_ramp = 1000;

  // velocity low pass filtering
  // default 5ms - try different values to see what is the best. 
  // the lower the less filtered
  motor.LPF_velocity.Tf = 0.01;

  //default voltage_power_supply
  motor.voltage_limit = 6;

  // initialize motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();
  
  // add target command T
  command.add('T', onTarget, "target velocity");

  // monitoring port
  Serial.begin(115200);
  Serial.println("Motor ready.");
  Serial.println("Set the target velocity using serial terminal:");
  _delay(1000);
}

void loop() {
  // iterative FOC function
  motor.loopFOC();

  // 0.5 hertz sine wave
  //target_velocity = sin( micros()*1e-6 *2*M_PI * 0.5 );
  motor.move(target_velocity);

  // iterative function setting the velocity target
  command.run();
}
```
