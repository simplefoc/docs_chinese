---
layout: default
title: 云台控制器实例
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /gimbal_velocity_example
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# 基于HMBGC V2.2 的速度控制例程<br>
这是一个基于FOC算法使用万向节控制板的简单炫酷例程。它本来是不可以用于闭环位置控制的，但 <span class="simple">Simple<span class="foc">FOC</span>library</span> 不仅让闭环控制成为可能还使其变得相当简单。

以下是这个项目会使用到的硬件：

 [HMBGC V2.2](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | [AMT 103 encoder（编码器）](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM8017-120T](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) 
 ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ 
 <img src="extras/Images/pinout.jpg" class="imgtable150">     | <img src="extras/Images/enc1.png" class="imgtable150">       | <img src="extras/Images/big.jpg" class="imgtable150">        


# 连接所有硬件
有关HMBGC V2.2接线的深入讲解，请查看 [接线案例](hmbgc).
<p><img src="extras/Images/hmbgc_v22.jpg" class="width60">
</p>

## 编码器
<blockquote class="warning"> <p class="heading">引脚限制</p>
HMBGC不能连接Arduino的外部中断引脚<code class="highlighter-rouge">2</code>和<code class="highlighter-rouge">3</code>，只能连接模拟引脚<code class="highlighter-rouge">A0-A7</code>。
因此，我们需要用软件中断库来读取编码器通道。更多编码器的代码实现信息，请查看<a href="encoder">代码实现</a>。</blockquote>



- 编码器通道 `A` 和 `B` 连接到引脚 `A0` 和 `A1`。

## 电机
- 电机 `a`相、 `b`相 和 `c`相直接连接到驱动板输出信号。
- 电机端子 `M1` 使用 Arduino 引脚 `9`、`10`、`11`，端子 `M2` 使用引脚 `3`、`5`、`6`。



# Arduino 代码
让我们一起阅读这个例程的所有代码并开始编写吧
你需要做的第一件事是引入 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
请确保你安装了该库。如若没有安装，请返回 [页面”让我们开始吧“](installation) 查看。

此外，云台控制器（如：HMBGC）是无法访问硬件中断引脚，因此你需要引入一个软件中断库。

我们建议使用 `PciManager`。如果你还没有安装它，可以直接使用 Arduino library manager安装。更多信息，请查看  `Encoder` [文档](encoder) 。
一旦安装好，请将其引入你的程序中：

```cpp
// 软件中断库
#include <PciManager.h>
#include <PciListenerImp.h>
```

## 编码器代码
首先，我们定义 `Encoder` 中A、B通道的引脚以及每转脉冲数。
```cpp
// 定义编码器
Encoder encoder = Encoder(A0, A1, 2048);
```
然后，我们定义buffer回调函数。
```cpp
// 通道A和B回调
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
接着，我们定义 `PciManager` 中的引脚更改监听器：
```cpp
// 引脚更改监听器
PciListenerImp listenerA(encoder.pinA, doA);
PciListenerImp listenerB(encoder.pinB, doB);
```
在 `setup()` 函数中，我们先初始化编码器：
```cpp
// 初始化硬件编码器
encoder.init();
```
然后，我们用`PciManager`库的接口替代调用 `encoder.enableInterrupt()` 函数来添加中断。
```cpp
// 中断初始化
PciManager.registerListener(&listenerA);
PciManager.registerListener(&listenerB);
```
那么这就让我们一起设置电机吧。

<blockquote class="info">更多编码器参数配置信息，请查看<code class="highlighter-rouge">Encoder</code><a href="encoder">文档</a>。</blockquote>
## 电机代码
首先，我们需要定义 `BLDCMotor` 中的极对数为 `14`。
```cpp
// 定义无刷直流电机
BLDCMotor motor = BLDCMotor(14);
```
<blockquote class="warning">如果你不确定你电机的极对数是什么，请查看<code class="highlighter-rouge">find_pole_pairs.ino</code>的例子。</blockquote>
接着，我们需要定义 `BLDCDriver3PWM` 中电机的 PWM 引脚编号以及驱动器的使能引脚。
```cpp
// 定义无刷直流驱动器
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11);
```

然后，在 `setup()`中我们要先配置电源电压（如果不是跟例程一样是12V），再初始化驱动器。
```cpp
// 电源电压
// 默认 12 V
driver.voltage_power_supply = 12;
driver.init();
```
然后，我们通过指定 `motor.controller`变量来告诉电机运行哪个控制环。
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
// 使用电压陡坡的急速控制
// 默认值为300伏/秒~ 0.3伏/毫秒
motor.PID_velocity.output_ramp = 1000;

// 默认电压供电
motor.voltage_limit = 6;
```
此外，我们可以配置低通滤波器的时间常数 `Tf`。
```cpp
// 速度低通滤波
// 默认的5ms -尝试不同的值，选择最好的。
// 越低过滤越少
motor.LPF_velocity.Tf = 0.01;
```
<blockquote class="info">更多速度环参数信息，请查看<a href="velocity_loop">文档</a>.</blockquote>
最后，我们将编码器和驱动板与电机连接，初始化硬件，初始化 Field Oriented Control（FOC）。
```cpp  
// 将电机连接到传感器上
motor.linkSensor(&encoder);
// 连接驱动器
motor.linkDriver(&driver);

// 初始化电机
motor.init();
// 校准编码器并启动FOC
motor.initFOC();
```
对驱动电机来说，最后也是最重要的一步当然就是将`loopFOC`放入 `loop` 函数中，让它能够不断循环了。
```cpp
void loop() {
// 迭代FOC函数
motor.loopFOC();

// 迭代函数设置和计算速度环
// 这个函数可以在比loopFOC函数低得多的频率下运行
motor.move(target_velocity);
}
```
那么现在就让我们看看完整的代码吧！
<blockquote class="info">更多参数和控制环配置信息，请查看<code class="highlighter-rouge">BLDCMotor</code><a href="motors_config">文档</a>.</blockquote>
## 完整Arduino代码
在完整代码中，我加入了一个小型串行 [commander接口](commander_interface)，使其能够实时改变速度的目标值。
```cpp
#include <SimpleFOC.h>
// 软件中断库
#include <PciManager.h>
#include <PciListenerImp.h>


// 定义无刷直流电机
BLDCMotor motor = BLDCMotor( 14 );
// 定义无刷直流驱动器
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11);
// 定义无刷直流电机
Encoder encoder = Encoder(A0, A1, 500);
// 中断程序初始化
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// 编码器中断初始化
PciListenerImp listenerA(encoder.pinA, doA);
PciListenerImp listenerB(encoder.pinB, doB);

// 目标变量
float target_velocity=0;
// Commander 接口
Commander command = Commander(Serial);
void onTarget(char* cmd){ command.scalar(&target_velocity, cmd); }

void setup() {
  // 初始化硬件编码器
  encoder.init();
  // 中断初始化
  PciManager.registerListener(&listenerA);
  PciManager.registerListener(&listenerB);
  // 将电机连接到传感器上
  motor.linkSensor(&encoder);

  // 电源电压
  // 默认 12 v
  driver.voltage_power_supply = 12;
  driver.init();
  // 把马达连接到驱动器上
  motor.linkDriver(&driver);

  // 设置要使用的FOC环路
  // 运动控制类型::转矩
  // 运动控制类型::速度
  // 运动控制类型::角度
  motor.controller = MotionControlType::velocity;

  // 根据控制配置控制器
  // 速度PI控制器参数
  // 默认 P=0.5 I = 10
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // 使用电压陡坡的急速控制
  // 默认值为300伏/秒~ 0.3伏/毫秒
  motor.PID_velocity.output_ramp = 1000;

  // 速度低通滤波
  // 默认的5ms -尝试不同的值，选择最好的。
  // 越低过滤越少
  motor.LPF_velocity.Tf = 0.01;

  //默认电压电源
  motor.voltage_limit = 6;

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
  // 迭代FOC函数
  motor.loopFOC();

  // 0.5赫兹正弦波
  //target_velocity = sin( micros()*1e-6 *2*M_PI * 0.5 );
  motor.move(target_velocity);

  // 迭代函数设置速度目标
  command.run();
}
```
