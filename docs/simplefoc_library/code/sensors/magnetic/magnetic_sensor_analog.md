---
layout: default
title: 磁性传感器模拟输出设置
parent: 磁力传感器
grand_parent: 位置传感器
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /magnetic_sensor_analog
toc: true
---



# 模拟输出磁性传感器设置


## 步骤 1. 实例化 `MagneticSensorAnalog` 类

为了将模拟输出磁性位置传感器与 <span class="simple">Simple<span class="foc">FOC</span>库</span> 一起使用，首先创建 `MagneticSensorAnalog` 类的实例：
```cpp
// MagneticSensorAnalog(uint8_t _pinAnalog, int _min, int _max)
//  pinAnalog     - the pin that is reading the analog output from magnetic sensor
//  min_raw_count - the smallest expected reading.  
//  max_raw_count - the largest value read.  
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);
```

类的参数如下：
- `pinAnalog` - 读取磁性传感器模拟输出的引脚
- `min_raw_count` - 预期的最小读数。虽然你可能期望它是 0，但通常约为 15。如果这个值设置错误，每转一圈会有一个小的卡顿
- `max_raw_count` - 读取到的最大值。虽然你可能期望它是 2^10 = 1023，但通常约为 1020。注意：对于 ESP32（具有 12 位 ADC），该值将接近 4096

<blockquote class="info"> <p class="heading"> 💡 找出最小值和最大值</p>
每个微控制器和每个传感器都有所不同，因此我们建议你使用 `examples/sensor_test/magentic_sensor_analog_example/find_raw_min_max` 中提供的示例来找出传感器的最大值和最小值。
</blockquote>
最后，初始化之后，只需要调用 `init()` 函数。这个函数会初始化传感器硬件。所以你的磁性传感器初始化代码会像这样：
```cpp
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);

void setup(){
  ...
  sensor.init();
  ...
}
```

如果你想使用多个磁性传感器，确保将它们的 ADC 引脚连接到不同的 Arduino 引脚上，并按照上述相同的思路操作，下面是一个简单的示例：
```cpp
MagneticSensorAnalog sensor1 = MagneticSensorAnalog(A1, 14, 1020);
MagneticSensorAnalog sensor2 = MagneticSensorAnalog(A2, 14, 1020);

void setup(){
  ...
  sensor1.init();
  sensor2.init();
  ...
}
```

请查看 `magnetic_sensor_analog_example.ino` 示例以了解更多信息。


## 步骤 2. 实时使用磁性传感器

库中实现了两种使用磁性传感器的方式：
- 作为 FOC 算法的电机位置传感器
- 作为独立的位置传感器

### FOC 算法的位置传感器

要将传感器与库中实现的 FOC 算法一起使用，一旦你初始化了 `sensor.init()`，只需要通过执行以下操作将其链接到 BLDC 电机：

```cpp
motor.linkSensor(&sensor);
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

#### 示例代码

这是一个带有 BLDC 电机和驱动器的模拟输出磁性传感器的快速示例：

```cpp
#include <SimpleFOC.h>

// motor and driver
BLDCMotor motor = BLDCMotor(7);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// MagneticSensorAnalog(uint8_t _pinAnalog, int _min, int _max)
//  pinAnalog     - the pin that is reading the analog output from magnetic sensor
//  min_raw_count - the smallest expected reading.  
//  max_raw_count - the largest value read.  
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);

void setup() {
  // driver
  driver.init()
  motor.linkDriver(&driver);

  // init magnetic sensor hardware
  sensor.init();
  motor.linkSensor(&sensor);

  // init motor hardware
  motor.init();
  motor.initFOC();

  Serial.println("Motor ready");
  _delay(1000);
}
void loop(){
  motor.loopFOC();
  motor.move();
}
```

### 独立传感器

要在任何给定时间获取磁性传感器的角度和速度，你可以使用以下公共方法：
```cpp
class MagneticSensorAnalog{
 public:
    // shaft velocity getter
    float getVelocity();
  	// shaft angle getter
    float getAngle();
}
```

<blockquote markdown="1" class="info">
<p class="heading" markdown="1">多次调用 `getVelocity`</p>
调用 `getVelocity` 时，只有当自上次调用以来的经过时间长于变量 `min_elapsed_time`（默认 100 微秒）中指定的时间时，它才会计算速度。如果自上次调用以来的经过时间短于 `min_elapsed_time`，该函数将返回之前计算的值。如有必要，可以轻松更改变量 `min_elapsed_time`：

```cpp
sensor.min_elapsed_time = 0.0001; // 100us by default
```
</blockquote>

#### 示例代码

这是一个使用其模拟输出的 AS5600 磁性传感器的快速示例：
```cpp
#include <SimpleFOC.h>

// MagneticSensorAnalog(uint8_t _pinAnalog, int _min, int _max)
//  pinAnalog     - the pin that is reading the analog output from magnetic sensor
//  min_raw_count - the smallest expected reading.  
//  max_raw_count - the largest value read.  
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // initialise magnetic sensor hardware
  sensor.init();

  Serial.println("Sensor ready");
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