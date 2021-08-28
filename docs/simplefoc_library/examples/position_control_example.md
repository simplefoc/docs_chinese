---
layout: default
title:  位置控制实例
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /position_control_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# 基于<span class="simple">Simple<span class="foc">FOC</span>Shield</span>的位置控制例程<br>
运行这个无刷电机位置控制例程需要用到以下硬件：

 [Arduino UNO](https://store.arduino.cc/arduino-uno-rev3)     | [Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](arduino_simplefoc_shield_showcase) | [AMT 103 encoder（编码器）](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM4198H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571) 
 ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ 
 <img src="extras/Images/arduino_uno.jpg" class="imgtable150"> | <img src="extras/Images/shield_to_v13.jpg" class="imgtable150"> | <img src="extras/Images/enc1.png" class="imgtable150">       | <img src="extras/Images/mot.jpg" class="imgtable150">        


# 连接所有硬件
有关 Arduino UNO 与 SimpleFOCShield 接线的深入讲解，请查看 [接线案例](arduino_simplefoc_shield)。
<p><img src="extras/Images/foc_shield_v13.jpg" class="width60"></p>
有关 SimpleFOCShield 的更多信息，请查看 [文档](arduino_simplefoc_shield_showcase)。

## 编码器
- 通道 `A` 和 `B` 连接到编码器的 `P_ENC`, 端子 `A` 和 `B`。

## 电机
- 电机的 `a` 相， `b` 相和 `c` 相直接与电机终端连接器 `TB_M1` 连接。


### Small motivation :D 
<p><img src="extras/Images/simple_foc_shield_v13_small.gif" class="width60"></p>
# Arduino 代码
让我们一起阅读这个例程的所有代码并开始编写吧
你需要做的第一件事是引入 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
请确保你安装了该库。如若没有安装，请返回 [页面”让我们开始吧“](installation) 查看


## 编码器代码
首先，我们定义 `Encoder` 中A、B通道的引脚以及每转脉冲数。
```cpp
// 定义编码器
Encoder encoder = Encoder(2, 3, 2048);
```
然后，我们定义buffer回调函数。
```cpp
// 通道A和B回调
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
在函数 `setup()` 中，我们初始化编码器以及启用中断：
```cpp
// 初始化硬件编码器
encoder.init();
// 启用硬件中断
encoder.enableInterrupts(doA, doB);
```
那么这就让我们一起设置电机吧。

<blockquote class="info">更多编码器参数配置信息，请查看 <code class="highlighter-rouge">Encoder</code><a href="encoder">文档</a>。</blockquote>
## 电机代码
首先，我们需要定义 `BLDCMotor` 中的极对数为 `11`
```cpp
// 定义无刷直流电机
BLDCMotor motor = BLDCMotor(11);
```
<blockquote class="warning">如果你不确定你电机的极对数是什么，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code>的例子</blockquote>
接着，我们需要定义 `BLDCDriver3PWM` 中电机的 PWM 引脚数字以及驱动器的使能引脚。
```cpp
// 定义无刷直流驱动器
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

然后，在 `setup()`中我们要先配置电源电压（如果不是跟例程一样是12V），再初始化驱动器。
```cpp
// 电源电压
// 默认 12 V
driver.voltage_power_supply = 12;
driver.init();
```
然后，我们通过指定 `motor.controller`变量来告诉电机运行哪个控制模式。
```cpp
// 设置要使用的控制回路类型
// 运动控制类型::转矩
// 运动控制类型::速度
// 运动控制类型::角度
motor.controller = MotionControlType::angle;
```
现在我们要来配置 速度环PI 控制器参数。
```cpp
// 速度PI控制器参数
// default P=0.5 I = 10
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
// 使用电压陡坡的急速控制
// 默认值为300伏/秒~ 0.3伏/毫秒
motor.PID_velocity.output_ramp = 1000;

// 默认电压电源
motor.voltage_limit = 6;
```
此外，我们可以配置低通滤波器的时间常数 `Tf`。
```cpp
// 速度低通滤波
// 默认的5ms -尝试不同的值，选择最好的。
// 越低过滤越少
motor.LPF_velocity.Tf = 0.01;
```
最后，我们配置位置的 P控制器 增益和速度约束变量。
```cpp
// 角P控制器
// 默认 P=20
motor.P_angle.P = 20;
// 位置控制的最大速度
// 默认 20
motor.velocity_limit = 4;
```
<blockquote class="info">更多角度环参数信息，请查看<a href="angle_loop">文档</a>。</blockquote>
接着，我们将编码器和驱动板与电机连接，初始化硬件，初始化Field Oriented Control（FOC）。
```cpp  
// 将电机连接到传感器上
motor.linkSensor(&encoder);
// 把电机连接到驱动器上
motor.linkDriver(&driver);

// 初始化电机
motor.init();
// 校准编码器并启动FOC
motor.initFOC();
```
对驱动电机来说，最后也是最重要的一步当然就是将`loopfoc()`置于 `loop` 函数中，让它能够不断循环了。
```cpp
void loop() {
// 迭代FOC函数
motor.loopFOC();

// 迭代函数设置和计算角度/位置环路
// 这个函数可以在比 loopFOC 函数低得多的频率下运行
motor.move(target_angle);
}
```
那么现在就让我们看看完整的代码吧！
<blockquote class="info">更多参数和控制环配置信息，请查看 <code class="highlighter-rouge">BLDCMotor</code><a href="motors_config">文档</a>。</blockquote>
## 完整的Arduino代码
在完整代码中，我加入了一个小型串行 [commander接口](commander_interface)，使其能够实时改变位置或角度的目标值。

```cpp
#include <SimpleFOC.h>

// 初始化无刷直流电机
BLDCMotor motor = BLDCMotor( 11 );
// 初始化驱动器
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
// 初始化编码器
Encoder encoder = Encoder(2, 3, 2048);
// 通道A和B回调
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// 角度设定点变量
float target_angle = 0;
// commander 接口
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.scalar(&target_angle, cmd); }

void setup() {

  // 初始化硬件编码器
  encoder.init();
  // 硬件中断启用
  encoder.enableInterrupts(doA, doB);
  // 将电机连接到传感器上
  motor.linkSensor(&encoder);

  // 电源电压
  // 默认 12 V
  driver.voltage_power_supply = 12;
  driver.init();
  // 把电机连接到驱动器上
  motor.linkDriver(&driver);

  // 设置要使用的控制回路
  motor.controller = MotionControlType::angle;
  
  // 根据控制配置控制器
  // 速度PI控制器参数
  // 默认 P=0.5 I = 10
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // 使用电压陡坡的急速控制
  // 默认值为300伏/秒~ 0.3伏/毫秒
  motor.PID_velocity.output_ramp = 1000;
  
  // 默认电压电源
  motor.voltage_limit = 6;

  // 速度低通滤波
  // 默认的5ms -尝试不同的值，选择最好的。
  // 越低过滤越少
  motor.LPF_velocity.Tf = 0.01;

  // 角P控制器 
  // 默认 P=20
  motor.P_angle.P = 20;
  // 位置控制的最大速度
  // 默认 20
  motor.velocity_limit = 4;
  
  // 初始化电机
  motor.init();
  // 校准编码器并启动FOC
  motor.initFOC();

  // 添加目标命令T
  command.add('T', doTarget, "target angle");

  // 监控端口
  Serial.begin(115200);
  Serial.println("Motor ready.");
  Serial.println("Set the target angle using serial terminal:");
  _delay(1000);
}

void loop() {
  // 迭代FOC函数
  motor.loopFOC();

  // 函数计算外部位置循环并设置目标位置 
  motor.move(target_angle);

}
```
