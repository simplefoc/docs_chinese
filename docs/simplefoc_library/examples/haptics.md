---
layout: default
title: 触觉 - 线控转向
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 7
permalink: /haptics_examples
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---


# 线控转向<br>使用<span class="simple">简易<span class="foc">FOC</span>扩展板</span>和 Arduino UNO

[Arduino UNO](https://store.arduino.cc/arduino-uno-rev3) | 2x[Arduino <span class="simple">简易<span class="foc">FOC</span>扩展板</span>](arduino_simplefoc_shield_showcase) | [AMT 103 编码器](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [AS5600](https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK) | 2x[IPower GBM4198H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571)
--- | --- | --- | --- | --- 
<img src="extras/Images/arduino_uno.jpg" class="imgtable150"> |  <img src="extras/Images/shield_to_v13.jpg" class="imgtable150">  | <img src="extras/Images/enc1.png" class="imgtable150"> | <img src="extras/Images/as5600.jpg" class="imgtable150">  | <img src="extras/Images/mot.jpg" class="imgtable150"> 


可在此处[下载](extras/gm4108_encoder_mount.zip)用于 IPower GM4108H-120T 电机的 3D 打印支架的 STL 文件以及 STEP 和 solidworks 项目，该支架带有 CUI amt103 编码器的安装座，在图片和 Youtube 视频中均有使用。

## 连接所有组件
以下是本项目中使用的设置图片。查看 Arduino 代码以了解所使用的引脚编号。

<p><img src="extras/Images/steer_by_wire_connection.jpg" class="width60"></p>

## Arduino 代码
本示例的代码非常简单。由于我们使用两个无刷直流电机，因此需要使用所有 6 个 PWM Arduino UNO 引脚，这意味着我们没有足够的硬件中断引脚。因此，我们需要使用软件中断。在本示例中，我们将使用 `PciManager` 库。它使用起来非常简单，我强烈推荐，但也可以使用其他类似的库。

两个电机都将在扭矩/电压控制模式下进行控制，一个电机将使用编码器作为传感器，另一个将使用具有 I2C 通信的磁传感器（AS5600）。
初始化两个电机和传感器后，无需进行其他配置，我们可以为两个电机初始化 FOC 算法 `initFOC()`，然后就可以进入实时执行阶段了。

“智能部分”位于 `loop()` 函数中。😄

为了维持两个电机位置之间的“虚拟链接”，我们编写了如下代码：
```cpp
motor1.move( 5*(motor2.shaft_angle - motor1.shaft_angle));
motor2.move( 5*(motor1.shaft_angle - motor2.shaft_angle));
```

此控制算法根据电机与另一个电机位置的距离为电机设置电压。
常数 `5` 是一个比例增益，它是通过经验得出的，并且对于每个设置都会有所不同。但一般来说，这个数字越高，链接就越“坚硬”，就越难在电机位置之间引入偏移。

就是这样，以下是本示例的完整代码。

```cpp
#include <SimpleFOC.h>
// software interrupt library
#include <PciManager.h>
#include <PciListenerImp.h>

BLDCMotor motor1 = BLDCMotor(11);
BLDCDriver3PWM driver1 = BLDCDriver3PWM(3, 10, 6, 7);
Encoder encoder1 = Encoder(A2, 2, 500, A0);
void doA1(){encoder1.handleA();}
void doB1(){encoder1.handleB();}
void doI1(){encoder1.handleIndex();}

// encoder interrupt init
PciListenerImp listenerA(encoder1.pinA, doA1);
PciListenerImp listenerB(encoder1.pinB, doB1);
PciListenerImp listenerI(encoder1.index_pin, doI1);

BLDCMotor motor2 =  BLDCMotor( 11);
BLDCDriver3PWM driver2 = BLDCDriver3PWM(9, 11, 5, 8);
MagneticSensorI2C sensor2 = MagneticSensorI2C(0x36, 12, 0x0E, 4);

void setup() {

  // initialise encoder hardware
  encoder1.init();  
  // interrupt initialization
  PciManager.registerListener(&listenerA);
  PciManager.registerListener(&listenerB);
  PciManager.registerListener(&listenerI);
  // link the motor to the sensor
  motor1.linkSensor(&encoder1);

  // init driver
  driver1.init();
  // link driver
  motor1.linkDriver(&driver1);

  // set control loop type to be used
  motor1.controller = MotionControlType::torque;
  // initialise motor
  motor1.init();
  // align encoder and start FOC
  motor1.initFOC();
  
  // initialise magnetic sensor hardware
  sensor2.init();
  // link the motor to the sensor
  motor2.linkSensor(&sensor2);
  // init driver
  driver2.init();
  // link driver
  motor2.linkDriver(&driver2);
  // set control loop type to be used
  motor2.controller = MotionControlType::torque;
  // initialise motor
  motor2.init();
  // align encoder and start FOC
  motor2.initFOC();
  
  Serial.println("Steer by wire ready!");
  _delay(1000);
}

void loop() {
  // iterative setting FOC phase voltage
  motor1.loopFOC();
  motor2.loopFOC();

  // virtual link code
  motor1.move( 5*(motor2.shaft_angle - motor1.shaft_angle));
  motor2.move( 5*(motor1.shaft_angle - motor2.shaft_angle));
  
}
```


# 触觉速度控制<br>使用<span class="simple">简易<span class="foc">FOC</span>扩展板</span>和 Stm32 Nucleo-64


[Stm32 Nucleo-64](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | 2x [Arduino <span class="simple">简易<span class="foc">FOC</span>扩展板</span>](arduino_simplefoc_shield_showcase) | 2x[AMT 103 编码器](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [GBM5108-120T](https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html)  | [IPower GBM4198H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571)
--- | --- | --- | --- | ---
<img src="extras/Images/nucleo.jpg" class="imgtable150"> |  <img src="extras/Images/shield_to_v13.jpg" class="imgtable150">  | <img src="extras/Images/enc1.png" class="imgtable150">  | <img src="extras/Images/bigger.jpg" class="imgtable150"> | <img src="extras/Images/mot.jpg" class="imgtable150"> 

## 连接所有组件
以下是本项目中使用的设置图片。查看 Arduino 代码以了解所使用的引脚编号。
<p><img src="extras/Images/gauge_connection.jpg" class="width60"></p>

## Arduino 代码

在本示例中，我们将使用 Nucleo-64 板和两个带编码器的无刷直流电机。由于 Nucleo 在硬件中断方面没有问题（每个引脚都可以是外部中断引脚），因此使用 6 个 PWM 引脚不会导致代码复杂化。Nucleo 和 Arduino UNO 之间的唯一区别是 Nucleo 引脚不能使用其引脚 `11` 进行 PWM，因此我们需要改用引脚 `13`。其余代码非常简单明了。

我们定义两个电机和两个编码器并将它们链接在一起。
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

  // initialise encoder hardware
  encoder1.init();
  encoder1.enableInterrupts(doA1,doB1);
  
  encoder2.init();
  encoder2.enableInterrupts(doA2,doB2);
  // link the motor to the sensor
  motor1.linkSensor(&encoder1);
  motor2.linkSensor(&encoder2);
  
  // config drivers
  driver1.init();
  driver2.init();

  // link the motor to the driver
  motor1.linkDriver(&driver1);
  motor2.linkDriver(&driver2);
}
void loop(){}
```

然后我们将一个电机的运动控制定义为电压控制，另一个定义为速度控制：

```cpp
// set control loop type to be used
motor1.controller = MotionControlType::torque;
motor2.controller = MotionControlType::velocity;
```
此外，我们通过增加 `Tf` 值引入了更高程度的滤波，并稍微提高了积分增益 `I` 以获得更好的跟随效果。

```cpp
// augment filtering
motor2.LPF_velocity.Tf = 0.02;
// rise I gain
motor2.PID_velocity.I = 40;
```
为了完成 `setup()` 函数，我们只需初始化电机和 FOC 算法。

“智能部分”同样在 `loop()` 函数中。“虚拟链接”代码如下：
```cpp
// virtual link code
motor1.move(5*(motor2.shaft_velocity/10 - motor1.shaft_angle));
motor2.move(10*motor1.shaft_angle);
```
这种控制策略基本上是说 `motor2` 的目标速度将与 `motor1` 的位置成比例。另一方面，它根据 `motor2` 的速度和 `motor1` 的位置之间的差异为 `motor1` 设置电压。这在这两个变量之间创建了一个“虚拟链接”。

常数 `5` 是比例增益，其作用与前一个示例相同。它只会使 `motor1` 在跟随 `motor2` 速度时或多或少地响应，并且希望将差异保持在 0。

常数 `10` 则有所不同。它是一个比例因子，有助于更好地将速度映射到位置。例如，在我们使用的示例中，`motor2` 的最大速度为 `60rad/s`，但我们不希望我们的仪表旋转 10 圈来显示这个速度。我们希望它最大旋转 1 圈 `~6rad`，因此常数为 `10`。但在你的情况下，也许你将运行一个无人机电机，它以数千转/分的速度旋转，你可能希望有更大的比例，比如 100 甚至 1000。
另一方面，也许你会想要一个非常精确的慢速电机，它的速度会低于 1 弧度/秒。那么你可能希望使用 `~0.1` 甚至更小的值。因此，这将取决于你的应用程序和你需要的精度。

另一个值得注意的有趣之处是，这个比例因子可以是可变的，所以你也可以实时改变它。

这里是完整的示例程序：
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

  // initialise encoder hardware
  encoder1.init();
  encoder1.enableInterrupts(doA1,doB1);
  
  encoder2.init();
  encoder2.enableInterrupts(doA2,doB2);
  // link the motor to the sensor
  motor1.linkSensor(&encoder1);
  motor2.linkSensor(&encoder2);
  
  // config drivers
  driver1.init();
  driver2.init();
  // link the motor to the driver
  motor1.linkDriver(&driver1);
  motor2.linkDriver(&driver2);
    
  // set control loop type to be used
  motor1.controller = MotionControlType::torque;
  motor2.controller = MotionControlType::velocity;

  motor2.LPF_velocity.Tf = 0.02;
  motor2.PID_velocity.I = 40;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // enable monitoring
  motor1.useMonitoring(Serial);
  motor2.useMonitoring(Serial);

  // initialise motor
  motor1.init();
  motor2.init();
  // align encoder and start FOC
  motor1.initFOC();
  motor2.initFOC();

  Serial.println("Interactive gauge ready!");
  _delay(1000);
}


void loop() {
  // iterative setting FOC phase voltage
  motor1.loopFOC();
  motor2.loopFOC();

  // iterative function setting the outter loop target
  motor1.move(5*(motor2.shaft_velocity/10 - motor1.shaft_angle));
  motor2.move(10*dead_zone(motor1.shaft_angle));
  
}

float dead_zone(float x){
  return abs(x) < 0.2 ? 0 : x;
}
```