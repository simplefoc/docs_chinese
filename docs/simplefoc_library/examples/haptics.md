---
layout: default
title: 触觉 - 线控转向
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 7
permalink: /haptics_examples
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# 基于SimpleFOCShield和Arduino UNO的线控转向<br>

[Arduino UNO](https://store.arduino.cc/arduino-uno-rev3) | 2x[Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](arduino_simplefoc_shield_showcase) | [AMT 103 encoder](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [AS5600](https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK) | 2x[IPower GBM4198H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571)
--- | --- | --- | --- | --- 
<img src="extras/Images/arduino_uno.jpg" class="imgtable150"> |  <img src="extras/Images/shield_to_v13.jpg" class="imgtable150">  | <img src="extras/Images/enc1.png" class="imgtable150"> | <img src="extras/Images/as5600.jpg" class="imgtable150">  | <img src="extras/Images/mot.jpg" class="imgtable150"> 


## 连接所有硬件
下面图片是本项目使用的初始设置。接下来，请查看 Arduino 代码看下对应的引脚数字。

<p><img src="extras/Images/steer_by_wire_connection.jpg" class="width60"></p>
## Arduino 代码
这个例程的代码十分简单易懂。由于要驱动两个无刷直流电机，我们需要使用到 Arduino UNO 的全部6个pwm引脚，这意味着我们没有多余的硬件中断引脚。因此，我们需要使用软件中断。在本例程中，我们会使用到 `PciManager` 库。它操作简易，因此尤为推荐，当然也可以用其他软件中断库来取代它。

两个电机可以同时在力矩/电压控制模式下进行控制，一个电机搭配作为传感器的编码器，另一个将使用具有I2C通信的磁性传感器（AS5600）。
在所有电机和传感器初始化后，无需进行配置，我们就可以初始化这两个电机的FOC算法`initFOC（）`并准备好进行实时执行。

不要忘记将*smart stuff* 置于 `loop()` 函数中。 😄

为了维持两个电机位置间的虚拟链接，我们编写下列代码：
```cpp
motor1.move( 5*(motor2.shaft_angle - motor1.shaft_angle));
motor2.move( 5*(motor1.shaft_angle - motor2.shaft_angle));
```

本控制算法设置电机的电压与电机同另一电机位置的距离成比例。
常数 `5` 是一个增益，它需要根据实验情况而定，每次设置都会有所不同。但一般来说，数量越高，连接越坚固，就越难在电机位置之间引入偏移。



下面就是例程的完整代码。

```cpp
#include <SimpleFOC.h>
// 软件中断库
#include <PciManager.h>
#include <PciListenerImp.h>

BLDCMotor motor1 = BLDCMotor(11);
BLDCDriver3PWM driver1 = BLDCDriver3PWM(3, 10, 6, 7);
Encoder encoder1 = Encoder(A2, 2, 500, A0);
void doA1(){encoder1.handleA();}
void doB1(){encoder1.handleB();}
void doI1(){encoder1.handleIndex();}

// 编码器中断初始化
PciListenerImp listenerA(encoder1.pinA, doA1);
PciListenerImp listenerB(encoder1.pinB, doB1);
PciListenerImp listenerI(encoder1.index_pin, doI1);

BLDCMotor motor2 =  BLDCMotor( 11);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(9, 11, 5, 8);
MagneticSensorI2C sensor2 = MagneticSensorI2C(0x36, 12, 0x0E, 4);

void setup() {

  // 初始化硬件编码器
  encoder1.init();  
  // 中断初始化
  PciManager.registerListener(&listenerA);
  PciManager.registerListener(&listenerB);
  PciManager.registerListener(&listenerI);
  // 将电机连接到传感器上
  motor1.linkSensor(&encoder1);

  // 初始化驱动程序
  driver1.init();
  // 连接驱动器
  motor1.linkDriver(&driver1);

  // 设置要使用的控制回路类型
  motor1.controller = MotionControlType::torque;
  // 初始化电机
  motor1.init();
  // 校准编码器并启动FOC
  motor1.initFOC();
  
  // 初始化磁传感器硬件
  sensor2.init();
  // 将电机连接到传感器上
  motor2.linkSensor(&sensor2);
  // 初始化驱动器
  driver2.init();
  // 连接驱动器
  motor2.linkDriver(&driver2);
  // 设置要使用的控制回路类型
  motor2.controller = MotionControlType::torque;
  // 初始化电机
  motor2.init();
  // 校准编码器并启动FOC
  motor2.initFOC();
  
  Serial.println("Steer by wire ready!");
  _delay(1000);
}

void loop() {
  // 迭代设定FOC相位电压
  motor1.loopFOC();
  motor2.loopFOC();

  // 虚拟链接代码
  motor1.move( 5*(motor2.shaft_angle - motor1.shaft_angle));
  motor2.move( 5*(motor1.shaft_angle - motor2.shaft_angle));
  
}
```


# 基于SimpleFOCShield和Stm Nucleo-64的触碰速度控制<br>


[Stm32 Nucleo-64](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | 2x [Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](arduino_simplefoc_shield_showcase) | 2x[AMT 103 encoder](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [GBM5108-120T](https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html)  | [IPower GBM4198H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571)
--- | --- | --- | --- | ---
<img src="extras/Images/nucleo.jpg" class="imgtable150"> |  <img src="extras/Images/shield_to_v13.jpg" class="imgtable150">  | <img src="extras/Images/enc1.png" class="imgtable150">  | <img src="extras/Images/bigger.jpg" class="imgtable150"> | <img src="extras/Images/mot.jpg" class="imgtable150"> 

## 连接所有硬件
下面图片是本项目使用的初始设置。接下来，请查看 Arduino 代码看下对应的引脚数字。
<p><img src="extras/Images/gauge_connection.jpg" class="width60"></p>
## Arduino 代码

这个例程使用 Nucleo-64 板和两个带编码器的无刷直流电机。Nucleo 没有硬件中断缺乏的问题 （每个引脚都能外部中断），不会发生因使用6个pwn引脚而出现的复杂情况。Nucleo 和Arduino UNO 唯一的区别是 Nucleo 的引脚 `11` 不能用于PWM，因此我们需要使用引脚`13`替代。代码的其余部分非常简单。

我们定义两个电机和编码器并将其连接到一起。
```cpp
#include <SimpleFOC.h>

BLDCMotor motor1 = BLDCMotor(11);
BLDCDriver3PWM driver1 = BLDCDriver3PWM(9, 6, 5, 7);
Encoder encoder1 = Encoder(A1, A2, 8192);
void doA1(){encoder1.handleA();}
void doB1(){encoder1.handleB();}


BLDCMotor motor2 = BLDCMotor(11);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(3, 13, 10, 8);
Encoder encoder2 = Encoder(A3, 2, 500);
void doA2(){encoder2.handleA();}
void doB2(){encoder2.handleB();}


void setup() {

  // 初始化硬件编码器
  encoder1.init();
  encoder1.enableInterrupts(doA1,doB1);
  
  encoder2.init();
  encoder2.enableInterrupts(doA2,doB2);
  // 将电机连接到传感器上
  motor1.linkSensor(&encoder1);
  motor2.linkSensor(&encoder2);
  
  // 配置驱动程序
  driver1.init();
  driver2.init();

  // 把电机连接到驱动器上
  motor1.linkDriver(&driver1);
  motor2.linkDriver(&driver2);
}
void loop(){}
```

然后，我们通过定义运动控制类型，其中一个电机为电压控制，另一个电机为速度控制：

```cpp
// 设置要使用的控制回路类型
motor1.controller = MotionControlType::torque;
motor2.controller = MotionControlType::velocity;
```
此外，我们通过增加 `Tf` 值引入更高程度的滤波，并提高一点积分增益 `I` ，以便更好地追踪。
```cpp
// 增加过滤
motor2.LPF_velocity.Tf = 0.02;
// 上升I环收益
motor2.PID_velocity.I = 40;
```
最后，完成 `setup()` ，我们就能初始化电机和FOC算法。

再次提醒不要忘记将*smart stuff* 置于 `loop()` 函数中。*虚拟连接* 代码如下所示：
```cpp
// 虚拟链接代码
motor1.move(5*(motor2.shaft_velocity/10 - motor1.shaft_angle));
motor2.move(10*motor1.shaft_angle);
```
此控制方案基本上能说明 `motor2`的目标速度与 `motor1`的位置成比例。此外，它还能将 `motor1`的电压设置为与`motor2`的速度差和 `motor1`的位置差成比例。这将在这两个变量之间创建一个 *虚拟连接* 。

常数 `5` 是与上一例程中类似的增益。它仅仅会使得 `motor1`在跟随 `motor2` 速度时或快或慢地进行响应，并希望两者响应差值保持在0。

常数 `10` 有点不同。这是一个比例因子，能够有助于更好地将速度映射到位置。例如，在本例中，我们使用的 `motor2` 的最大速度为`60rad/秒`，但我们不希望仪表旋转10圈以显示此速度。我们希望它1圈最多旋转`~6弧度`，因此常数为`10`。但你也许将运行一个无人机电机，它以数千转/分的速度旋转，这种情况下你可能想要设置更大的缩放比例达100甚至1000。
此外，也许你会想要一个非常精确的低速电机，它的转速低于1弧度/秒. 你会想要使用`~0.1`或更小的值。因此，这将取决于你的应用程序和你需要的精度。

此外，还有一件有趣的事情需要注意，这个比例因子可以是可变的，所以你也可以实时更改它。

以下是完整的例程代码：

```cpp
#include <SimpleFOC.h>

BLDCMotor motor1 = BLDCMotor(11);
BLDCDriver3PWM driver1 = BLDCDriver3PWM(9, 6, 5, 7);
Encoder encoder1 = Encoder(A1, A2, 8192);
void doA1(){encoder1.handleA();}
void doB1(){encoder1.handleB();}


BLDCMotor motor2 = BLDCMotor(11);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(3, 13, 10, 8);
Encoder encoder2 = Encoder(A3, 2, 500);
void doA2(){encoder2.handleA();}
void doB2(){encoder2.handleB();}

void setup() {

  // 初始化硬件编码器
  encoder1.init();
  encoder1.enableInterrupts(doA1,doB1);
  
  encoder2.init();
  encoder2.enableInterrupts(doA2,doB2);
  // 将电机连接到传感器上
  motor1.linkSensor(&encoder1);
  motor2.linkSensor(&encoder2);
  
  // 配置驱动程序
  driver1.init();
  driver2.init();
  // 把电机连接到驱动器上
  motor1.linkDriver(&driver1);
  motor2.linkDriver(&driver2);
    
  // 设置要使用的控制回路类型
  motor1.controller = MotionControlType::torque;
  motor2.controller = MotionControlType::velocity;

  motor2.LPF_velocity.Tf = 0.02;
  motor2.PID_velocity.I = 40;

  // 使用串行监控电机初始化
  // 监控端口
  Serial.begin(115200);
  // 启用监控
  motor1.useMonitoring(Serial);
  motor2.useMonitoring(Serial);

  // 初始化运动
  motor1.init();
  motor2.init();
  // 校准编码器并启动FOC
  motor1.initFOC();
  motor2.initFOC();

  Serial.println("Interactive gauge ready!");
  _delay(1000);
}


void loop() {
  // 迭代设定FOC相位电压
  motor1.loopFOC();
  motor2.loopFOC();

  // 设定外循环目标的迭代函数
  motor1.move(5*(motor2.shaft_velocity/10 - motor1.shaft_angle));
  motor2.move(10*dead_zone(motor1.shaft_angle));
  
}

float dead_zone(float x){
  return abs(x) < 0.2 ? 0 : x;
}
```