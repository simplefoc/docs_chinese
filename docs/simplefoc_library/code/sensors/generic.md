---
layout: default
title: Generic sensor
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /generic_sensor
nav_order: 4
parent: Position Sensors
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 自定义传感器实现

`GenericSensor` 是 <span class="simple">Simple<span class="foc">FOC</span>library</span> 中一个全新的类，它简化了新传感器的实现。用这个类，你可以添加一个自定义传感器到代码中并将其与arduino文件中的电机连接。


## 步骤一 读取传感器函数实现
基本上，你只需在 arduino 代码中实现以下这个函数，它能读取传感器，返回0到2PI之间，以rad为单位的角度值：
```cpp
float readMySensorCallback(){
 // 读取传感器
 // 返回0到2PI之间，以rad为单位的角度值
 return ...;
}
```

此外，你可以选择执行初始化传感器函数
```cpp
void initMySensorCallback(){
  // 初始化
}
```

## 步骤二 初始化类 `GenericSensor` 
要初始化传感器类，需要为它提供读取传感器函数的指针，以及初始化传感器函数的指针（这是可选的）。

```cpp
// GenericSensor class 建构
//  - 读取传感器角度函数指针 readCallback 
//  - 初始化传感器函数指针 initCallback （可选的）
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);
```

## 步骤三 实时使用传感器

library库中有两个方式可以实现传感器的使用：
- 作为FOC算法的电机位置传感器
- 作为独立的位置传感器

### 独立传感器
你可以把你的传感器作为独立传感器使用。为了获取给定时间内传感器的角度和速度，你可以使用以下通用方法：
```cpp
class GenericSensor{
 public:
    // 获取轴速度
    float getVelocity();
	  // 获取轴角度
    float getAngle();
}
```

以下是便捷的例程：
```cpp
#include <SimpleFOC.h>

float readMySensorCallback(){
 // 读取传感器
 // 返回0到2PI之间，以rad为单位的角度值
 return ...;
}

void initMySensorCallback(){
  // 初始化
}

// 创建传感器
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);

void setup() {
  // 监控端口
  Serial.begin(115200);

  // 初始化传感器
  sensor.init();

  Serial.println("My sensor ready");
  _delay(1000);
}

void loop() {
  // 注意 - 尽可能高频的调用
  // 更新传感器值
  sensor.update();
  // 显示角度和角速度到终端
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

### FOC算法的位置传感器

要在library库中实现foc算法传感器的使用，初始化了`sensor.init()`后，只需要执行以下命令将它连接到BLDC无刷电机：

```cpp
motor.linkSensor(&sensor);
```

一般来说，你的代码会跟如下代码类似：
```cpp
#include <SimpleFOC.h>

float readMySensorCallback(){
 // 读取传感器
 // 返回0到2PI之间，以rad为单位的角度值
 return ...;
}

void initMySensorCallback(){
  // 初始化
}

// 创建传感器
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);

....
BLDCMotor motor = ....
...

void setup() {
   ....
  // 初始化传感器
  sensor.init();
  // 连接电机
  motor.linkSensor(&sensor);
  ...
  motor.initFOC();
  ...
}
void loop() {
  ....
}
```

## 创建新传感器支持的完整例程 -  ESP32 编码器

以下是ESP32架构下基于硬件计数器的编码器的实现例程。 <span class="simple">Simple<span class="foc">FOC</span>library</span>库默认不支持此编码器。

为了设置计数器和其他硬件参数，我用使用了库[ESP32Encoder](https://github.com/madhephaestus/ESP32Encoder) ，完整例程代码如下所示：

```cpp
#include <SimpleFOC.h>
#include <ESP32Encoder.h>

// 创建类 ESP32Encoder 
ESP32Encoder encoder;
// 定义传感器 cpr (500x4)
int64_t cpr = 2000;
// 初始化传感器函数
void initMySensorCallback(){
  // 编码器用引脚25和26 (Arduino引脚2和3) 
  encoder.attachFullQuad(25, 26);
}
// 读取编码器函数
float readMySensorCallback(){
  // 返回值在 0 - 2PI 之间
  float a = ((float)(encoder.getCount()%cpr)*_2PI/((float)cpr));
  return a > 0 ? a : a + _2PI;
}
// 创建通用传感器
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);

// BLDC无刷电机和驱动器实例
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(16, 27, 5, 12); // (Arduino引脚5、6、10、8)


// 命令通信实例
Commander command = Commander(Serial);
void doMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // 初始化传感器
  sensor.init();
  // 连接电机到传感器
  motor.linkSensor(&sensor);

  // 配置驱动器
  // 电源输入电压[V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接驱动器
  motor.linkDriver(&driver);

  // 设置要用到的控制环类型
  motor.controller = MotionControlType::torque;

  // 使用串口监控电机初始化
  // 监控端口
  Serial.begin(115200);
  // 如不需要，可注释掉
  motor.useMonitoring(Serial);

  // 初始化电机
  motor.init();
  // 校准编码器，启动FOC
  motor.initFOC();

  // 订阅电机到commander命令
  command.add('M', doMotor, "motor");

  _delay(1000);
}


void loop() {
  // 迭代设置FOC相电压
  motor.loopFOC();

  // 迭代函数设置外部环目标
  motor.move();

  // 用户通信
  command.run();
}
```