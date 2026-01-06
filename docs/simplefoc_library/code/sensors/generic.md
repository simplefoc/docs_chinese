---
layout: default
title: 通用传感器
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /generic_sensor
nav_order: 4
parent: 位置传感器
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---



# 实现自定义传感器

`GenericSensor` 是 <span class="simple">简易<span class="foc">FOC</span>库</span> 的一个新类，它简化了新传感器的实现过程。通过这个类，你可以在一个 Arduino 文件中添加自定义传感器并将其与电机连接起来。


## 步骤 1. 实现读取传感器的函数
基本上，你在 Arduino 代码中需要做的就是实现一个读取传感器并返回 0 到 2π 之间弧度角度的函数：
```cpp
float readMySensorCallback(){
 // read my sensor
 // return the angle value in radians in between 0 and 2PI
 return ...;
}
```

此外，你还可以选择性地实现一个初始化传感器的函数
```cpp
void initMySensorCallback(){
  // do the init
}
```

## 步骤 2. 实例化 `GenericSensor` 类
要初始化传感器类，你需要向它提供指向传感器读取函数的指针，以及可选的指向传感器初始化函数的指针。
```cpp
// GenericSensor class constructor
//  - readCallback pointer to the function reading the sensor angle
//  - initCallback pointer to the function initialising the sensor (optional)
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);
```

然后，你将能够使用电机实例访问电机的角度和速度：
```cpp
motor.shaft_angle; // motor angle
motor.shaft_velocity; // motor velocity
```

或者通过传感器实例：
```cpp
sensor.getAngle(); // motor angle
sensor.getVelocity(); // motor velocity
```


## 步骤 3. 在实时环境中使用你的传感器

有两种方式可以使用本库中实现的传感器：
- 作为 FOC 算法的电机位置传感器
- 作为独立的位置传感器

### 独立传感器
你可以将传感器用作独立传感器。要在任何给定时间获取传感器的角度和速度，可以使用以下公共方法：
```cpp
class GenericSensor{
 public:
    // shaft velocity getter
    float getVelocity();
	  // shaft angle getter
    float getAngle();
}
```

<blockquote markdown="1" class="info">
<p class="heading" markdown="1">多次调用 `getVelocity`</p>
当调用 `getVelocity` 时，只有当前一次调用以来的经过时间长于变量 `min_elapsed_time`（默认 100 微秒）时，它才会计算速度。如果自上次调用以来的经过时间短于 `min_elapsed_time`，该函数将返回之前计算的值。如有必要，可以轻松更改变量 `min_elapsed_time`：

```cpp
sensor.min_elapsed_time = 0.0001; // 100us by default
```
</blockquote>

以下是一个简单示例：
```cpp
#include <SimpleFOC.h>

float readMySensorCallback(){
 // read my sensor
 // return the angle value in radians in between 0 and 2PI
 return ...;
}

void initMySensorCallback(){
  // do the init
}

// create the sensor
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // initialize sensor hardware
  sensor.init();

  Serial.println("My sensor ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  sensor.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

### 用于 FOC 算法的位置传感器

要将传感器与本库中实现的 foc 算法一起使用，一旦你初始化了 `sensor.init()`，只需通过执行以下操作将其链接到 BLDC 电机：
```cpp
motor.linkSensor(&sensor);
```

因此，一般来说，你的代码会是这样的：

```cpp
#include <SimpleFOC.h>

float readMySensorCallback(){
 // read my sensor
 // return the angle value in radians in between 0 and 2PI
 return ...;
}

void initMySensorCallback(){
  // do the init
}

// create the sensor
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);

....
BLDCMotor motor = ....
...

void setup() {
   ....
  // initialize sensor hardware
  sensor.init();
  // link to the motor
  motor.linkSensor(&sensor);
  ...
  motor.initFOC();
  ...
}
void loop() {
  ....
}
```

## 新传感器支持完整示例 - ESP32 硬件编码器

以下是一个基于 ESP32 架构实现的基于硬件计数器的编码器示例代码，<span class="simple">简易<span class="foc">FOC</span>库</span> 默认不支持该架构。

为了设置计数器和所有硬件参数，这里我们使用 [ESP32Encoder](https://github.com/madhephaestus/ESP32Encoder) 库，示例的完整代码如下：
```cpp
#include <SimpleFOC.h>
#include <ESP32Encoder.h>

// create the ESP32Encoder class
ESP32Encoder encoder;
// define the sensor cpr (500x4)
int64_t cpr = 2000;
// function intialising the sensor
void initMySensorCallback(){
  // use pin 25 and 26 (Arduino pins 2,3) for the encoder
  encoder.attachFullQuad(25, 26);
}
// function reading the encoder 
float readMySensorCallback(){
  // return the value in between 0 - 2PI
  float a = ((float)(encoder.getCount()%cpr)*_2PI/((float)cpr));
  return a > 0 ? a : a + _2PI;
}
// create the generic sensor
GenericSensor sensor = GenericSensor(readMySensorCallback, initMySensorCallback);

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(16, 27, 5, 12); // (Arduino pins 5,6,10,8)


// commander communication instance
Commander command = Commander(Serial);
void doMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // initialize sensor hardware
  sensor.init();
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // set control loop type to be used
  motor.controller = MotionControlType::torque;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialise motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();

  // subscribe motor to the commander
  command.add('M', doMotor, "motor");

  _delay(1000);
}


void loop() {
  // iterative setting FOC phase voltage
  motor.loopFOC();

  // iterative function setting the outter loop target
  motor.move();

  // user communication
  command.run();
}
```