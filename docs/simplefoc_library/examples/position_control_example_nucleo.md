---
layout: default
title:  Position Control Nucleo-64
parent: Example projects
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 5
permalink: /position_control_nucleo_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# 基于<span class="simple">Simple<span class="foc">FOC</span>Shield</span>和Stm32 Nucleo-64的位置控制例程<br>
运行这个无刷电机位置控制例程需要用到以下硬件：

 [Stm32 Nucleo-64](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | [Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](arduino_simplefoc_shield_showcase) | [AMT 103 encoder（编码器）](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [GBM5108-120T](https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html) 
 ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ 
 <img src="extras/Images/nucleo.jpg" class="imgtable150">     | <img src="extras/Images/shield_to_v13.jpg" class="imgtable150"> | <img src="extras/Images/enc1.png" class="imgtable150">       | <img src="extras/Images/bigger.jpg" class="imgtable150">     


# 连接所有硬件
有关 Nucleo 板子与 SimpleFOCShield 接线的深入讲解，请查看 [接线案例](nucleo_connection)。
<p><img src="extras/Images/nucleo_foc_shield_connection.jpg" class="width60"></p>
有关SimpleFOCShield 的更多信息，请查看 [文档](arduino_simplefoc_shield_showcase)。

## 编码器
- 通道 `A` 和 `B` 连接到编码器的 `P_ENC`, 端子 `A` 和 `B`。
- I引脚可以直接连接到 `P_ENC` 以及 端子 terminal `I`。
## 电机
- 电机的 `a` 相， `b` 相和 `c` 相直接与电机终端连接器 `TB_M1` 连接。


# Arduino 代码
让我们一起阅读这个例程的所有代码并开始编写吧
你需要做的第一件事是引入 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
请确保你安装了该库。如若没有安装，请返回 [页面”让我们开始吧“](installation) 查看。


## 编码器代码
首先，我们定义 `Encoder` 中A、B通道的引脚以及每转脉冲数。
```cpp
// define Encoder
Encoder encoder = Encoder(A1, A2, 2048, A0);
```
然后，我们定义buffer回调函数。
```cpp
// channel A, B and index callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
void doI(){encoder.handleIndex();}
```
在函数 `setup()` 中，我们初始化编码器以及启用中断：
```cpp
// initialize encoder hardware
encoder.init();
// hardware interrupt enable
encoder.enableInterrupts(doA, doB, doI);
```
那么这就让我们一起设置电机吧。

<blockquote class="info">更多编码器参数配置信息，请查看 <code class="highlighter-rouge">Encoder</code><a href="encoder">文档</a>。</blockquote>

## 电机代码
首先，我们需要定义 `BLDCMotor` 中的极对数为 `11`
```cpp
// define BLDC motor
BLDCMotor motor = BLDCMotor(11);
```
<blockquote class="warning">如果你不确定你电机的极对数是什么，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code> 的例子。</blockquote>

接着，我们需要定义 `BLDCDriver3PWM` 中电机的 PWM 引脚数字以及驱动器的使能引脚。
```cpp
// define BLDC driver
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

然后，在 `setup()`中我们要先配置电源电压（如果不是跟例程一样是12V），再初始化驱动器。
```cpp
// power supply voltage
// default 12V
driver.voltage_power_supply = 12;
driver.init();
​```oltage_power_supply = 12;
```
下一件事我们要改变的是index search velocity：
```cpp
// index search velocity
// default 1 rad/s
motor.velocity_index_search = 3;
```

然后，我们通过指定 `motor.controller`变量来告诉电机运行模式。
```cpp
// set control loop type to be used
// MotionControlType::torque
// MotionControlType::velocity
// MotionControlType::angle
motor.controller = MotionControlType::angle;
```
现在我们要来配置速度环PI控制器参数。
```cpp
// velocity PI controller parameters
// default P=0.5 I = 10
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
```
此外，我们可以配置低通滤波器的时间常数 `Tf`。
```cpp
// velocity low pass filtering
// default 5ms - try different values to see what is the best. 
// the lower the less filtered
motor.LPF_velocity.Tf = 0.01;
```
最后，我们配置位置P控制器增益和速度约束变量。
```cpp
// angle P controller 
// default P=20
motor.P_angle.P = 20;
//  maximal velocity of the position control
// default 20
motor.velocity_limit = 20;
```
<blockquote class="info">更多角度环参数信息，请查看 <a href="angle_loop">文档</a>.</blockquote>
接着，我们将编码器和驱动板与电机连接，初始化硬件，初始化Field Oriented Control（FOC）。
```cpp  
// link the motor to the sensor
motor.linkSensor(&encoder);
// link the motor to the driver
motor.linkDriver(&driver);

// initialize motor
motor.init();
// align encoder and start FOC
motor.initFOC();

// initial target value
motor.target = 0;
```
对驱动电机来说，最后也是最重要的一步当然就是将`focloop()`置于 `loop` 函数中，让它能够不断循环了。
```cpp
void loop() {
// iterative FOC function
motor.loopFOC();

// iterative function setting and calculating the angle/position loop
// this function can be run at much lower frequency than loopFOC function
motor.move();
}
```
以上就是初始化和配置电机、FOC、运动控制的全部代码。现在让我们启用用户通信吧。
<blockquote class="info">更多参数和控制环配置信息，请查看 <code class="highlighter-rouge">BLDCMotor</code><a href="motors_config">文档</a>。</blockquote>
## 电机监视器初始化
为了能够启用它，我们需要在调用  `motor.init()` and `motor.initFOC()`之前启用[监控](monitoring) 。
```cpp  
Serial.begin(115200);
// enable monitoring functionality
motor.useMonitoring(Serial);
```

## 用户通信

最后，Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 能够允许你实时改变所有参数配置、阅读电机状态变量以及通过使用 [commander接口](communication) 设定目标值。

首先，实例化 commander ：
```cpp
Commander command = Commander(Serial);
```
接着，创建一个通用电机回调的封装：
```cpp
void onMotor(char* cmd){ command.motor(&motor, cmd); }
```
之后，订阅这个新的 command 回调：
```cpp
void setup(){
  ....
  command.add('M', onMotor, "motor");
  ....
}
```
然后，将命令例程函数置于 Arduino `loop`中：
```cpp
void loop(){
  ....
  command.run();
}
```

那么现在这一切都配置好，准备就绪了，让我们一起来看完整的代码吧！

更多 [监视](monitoring) 和 [电机命令](communicaiton) 的信息，请访问 [编写代码部分](code)。

## 完整Arduino代码

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

// commander interface
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

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

  // index search velocity
  // default 1 rad/s
  motor.velocity_index_search = 3;

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
  
  // velocity low pass filtering
  // default 5ms - try different values to see what is the best. 
  // the lower the less filtered
  motor.LPF_velocity.Tf = 0.01;

  // angle P controller 
  // default P=20
  motor.P_angle.P = 20;
  //  maximal velocity of the position control
  // default 20
  motor.velocity_limit = 20;
  
  // monitoring port
  Serial.begin(115200);
  // enable monitoring functionality
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();

  // initial angle target
  // it will be changed by the commander class
  motor.target = 0;

  // define the motor id
  command.add('M', onMotor, "motor");

  Serial.println("Motor ready.");
  Serial.println("Set the target angle using serial terminal:");
  _delay(1000);
}

void loop() {
  // iterative FOC function
  motor.loopFOC();

  // position motion control loop
  motor.move();
   
  // user communication
  command.run();
}
```