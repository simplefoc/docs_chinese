---
layout: default
title: 速度控制实例
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /velocity_control_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# 基于Drotek's L6234 driver的速度控制例程<br>
[Drotek's L6234 breakout board（转接板）](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html) 是一款十分简单的三相无刷直流电机驱动器。它十分适用于FOC初学者。本速度控制例程项目就用到了 SimpleFOClibrary 和以下硬件：

 [Arduino UNO](https://store.arduino.cc/arduino-uno-rev3)     | [Drotek L6234 breakout board（转接板）](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html) | [AMT 103 encoder（编码器）](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM8017-120T](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) 
 ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ 
 <img src="extras/Images/arduino_uno.jpg" class="imgtable150"> | <img src="extras/Images/l6234.jpg" style="width:140px">      | <img src="extras/Images/enc1.png" class="imgtable150">       | <img src="extras/Images/big.jpg" class="imgtable150">        


# 连接所有硬件
有关 Arduino UNO 与 L6234 接线的深入讲解，请查看 [接线案例](arduino_l6234)。
<p><img src="extras/Images/uno_l6234.jpg" class="width60"></p>
### 编码器
- 编码器通道 `A` 和 `B` 连接到 Arduino 的外部中断引脚 `2` 和 `3`。 

### L6234 转接板 
- 连接到 Arduino 引脚`9`、`10` 和`11` （你也可以使用引脚 `5` 和 `6`）。
- 此外，你能连接 `enable` 引脚到 Arduino 的任一数字引脚。图中展示的是连接到引脚 `8` ，但这是自行选择的。你可以直接连接驱动器使能到 5v。
- 确保电源公共地与你的 Arduino 相连接。

### 电机
- 电机 `a`相、 `b`相 和 `c`相直接连接到驱动板输出信号。



# Arduino 代码
让我们一起阅读这个例程的所有代码并开始编写吧。
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
// 硬件中断启用
encoder.enableInterrupts(doA, doB);
```
那么这就让我们一起设置电机吧。

<blockquote class="info">更多编码器参数配置信息，请查看<code class="highlighter-rouge">Encoder</code><a href="encoder">文档</a>.</blockquote>
## 电机代码
首先，我们需要定义 `BLDCMotor` 中的极对数为 `14`
```cpp
// 定义无刷直流电机
BLDCMotor motor = BLDCMotor(14);
```
<blockquote class="warning">如果你不确定你电机的极对数是什么，请查看 <code class="highlighter-rouge">find_pole_pairs.ino</code> 的例子。</blockquote>
接着，我们需要定义 `BLDCDriver3PWM` 中电机的 PWM 引脚数字以及驱动器的使能引脚。
```cpp
// 定义无刷直流驱动
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
```

然后，在 `setup()`中我们要先配置电源电压（如果不是跟例程一样是12V），再初始化驱动器。
```cpp
// 电源电压
// 默认 12 V
driver.voltage_power_supply = 12;
driver.init();
```
然后，我们通过指定 `motor.controller`变量来告诉电机运行哪个模式。
```cpp
// 设置要使用的控制回路类型
// 运动控制类型::转矩
// 运动控制类型::速度
// 运动控制类型::角度
motor.controller = MotionControlType::velocity;
```
现在我们要来配置速度环PI控制器参数。
```cpp
// 速度PI控制器参数
// 默认 P=0.5 I = 10
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
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
<blockquote class="info">更多速度控制环的信息，请查看<a href="velocity_loop">文档</a>.</blockquote>
最后，我们将编码器和驱动板与电机连接，初始化硬件，初始化 Field Oriented Control（FOC）。
```cpp  
// 将电机连接到传感器上
motor.linkSensor(&encoder);
// 连接驱动器
motor.linkDriver(&driver);

// 初始化运动
motor.init();
// 校准编码器并启动FOC
motor.initFOC();
```
对驱动电机来说，最后也是最重要的一步当然就是将`focloop()`放入 `loop` 函数中，让它能够不断循环了。
```cpp
void loop() {
// 迭代FOC函数
motor.loopFOC();

// 迭代函数设置和计算速度环
// 这个函数可以在比 loopFOC 函数低得多的频率下运行
motor.move(target_velocity);
}
```
那么现在就让我们看看完整的代码吧！
<blockquote class="info">更多参数和控制环配置信息，请查看<code class="highlighter-rouge">BLDCMotor</code><a href="motors_config">文档</a>.</blockquote>
## 完整Arduino代码
在完整代码中，我加入了一个小型串行 [commander接口](commander_interface)，使其能够实时改变速度的目标值。
```cpp
#include <SimpleFOC.h>

// 定义无刷直流电机
BLDCMotor motor = BLDCMotor( 14 );
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);

// 定义编码器
Encoder encoder = Encoder(2, 3, 2048);
// 通道A和B回调
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// 速度设定值变量
float target_velocity = 0;
// commander 接口
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.scalar(&target_velocity, cmd); }

void setup() {
  
  // 初始化硬件编码器
  encoder.init();
  // 硬件中断启用
  encoder.enableInterrupts(doA, doB);

  // 电源电压
  // 默认 12 V
  driver.voltage_power_supply = 12;
  driver.init();
  // 把电机连接到驱动器上
  motor.linkDriver(&driver);

  // 设置要使用的控制回路类型
  motor.controller = MotionControlType::velocity;

  // 速度PI控制器参数
  // 默认 P=0.5 I = 10
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // 默认电压电源
  motor.voltage_limit = 6;
  
  // 速度低通滤波
  // 默认的5ms -尝试不同的值，选择最好的。
  // 越低过滤越少
  motor.LPF_velocity.Tf = 0.01;
  

  // 将电机连接到传感器上
  motor.linkSensor(&encoder);

  // 初始化电机
  motor.init();
  // 校准编码器并启动FOC
  motor.initFOC();

  // 添加目标命令T
  command.add('T', doTarget, "target velocity");

  // 监控端口
  Serial.begin(115200);
  Serial.println("Motor ready.");
  Serial.println("Set the target velocity using serial terminal:");
  _delay(1000);
}


void loop() {
  // 迭代foc函数
  motor.loopFOC();

  // 迭代函数设置和计算速度环
  // 这个函数可以在比 loopFOC 函数低得多的频率下运行
  motor.move(target_velocity);

  // 用户沟通
  command.run();
}
```
