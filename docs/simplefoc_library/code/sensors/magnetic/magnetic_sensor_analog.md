---
layout: default
title: Magnetic sensor Analog
parent: Magnetic sensor
grand_parent: Position Sensors
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /magnetic_sensor_analog
---


# 磁传感器设置

为了使用SimpleFOClibrary的模拟输出磁位置传感器，首先创建一个`MagneticSensorAnalog` class的实例:

```cpp
// MagneticSensorAnalog(uint8_t _pinAnalog, int _min, int _max)
//  pinAnalog     - the pin that is reading the analog output from magnetic sensor
//  min_raw_count - the smallest expected reading.  
//  max_raw_count - the largest value read.  
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);
```

类的参数为
- `pinAnalog` - 读取磁传感器模拟输出的引脚， , 
- `min_raw_count` - 最小的预期读数。虽然你可能期望它是O，但通常是-15。如果出现这种错误，将导致每次旋转只需轻轻点击一次。
- `max_raw_count` - 读取的最大值。虽然你可能期望它是2^10 = 1023，但它通常是-1020。注意:对于ESP32(带有12位ADC的值将更接近4096)

<blockquote class="info"> <p class="heading"> 💡 求最小值和最大值</p>
每个mcu和每个传感器都有一点不同，所以我们建议你使用提供的例子 <code class="highlighter-rouge">examples/sensor_test/magentic_sensor_analog_example/find_raw_min_max</code>用你的传感器求最大值和最小值
</blockquote>

最后，在初始化之后，唯一需要做的事情就是调用 `init()` 函数。该函数初始化传感器硬件。所以你的磁传感器初始化代码如下:

```cpp
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);

void loop(){
  ...
  sensor.init();
  ...
}
```

如果你希望使用多个磁传感器，请确保将它们的ADC pins连接到不同的arduino pins，并遵循上面的相同想法，这里是一个简单的例子:

```cpp
MagneticSensorAnalog sensor1 = MagneticSensorAnalog(A1, 14, 1020);
MagneticSensorAnalog sensor2 = MagneticSensorAnalog(A2, 14, 1020);

void loop(){
  ...
  sensor1.init();
  sensor2.init();
  ...
}
```

请检查 `magnetic_sensor_analog_example.ino` 举个例子来了解更多。


## 实时使用磁传感器

． 在这个库中有两种方法来使用磁传感器:

- 作为电机位置传感器用于FOC algorithm
- 作为独立位置传感器。

### FOC算法的位置传感器

To use the ensor with the FOC algorithm implemented in this library, once when you have initialized `sensor.init()` you just need to link it to the BLDC motor by executing:

当你要使用这个库中实现的FOC算法的传感器的时候，一旦你初始化了 `sensor.init()` ，你只需要通过执行以下命令将它链接到BLDC电机:

```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

要在任何给定时间获得磁传感器的角度和速度，你可以使用公共方法:
```cpp
class MagneticSensorAnalog{
 public:
    // shaft velocity getter
    float getVelocity();
  	// shaft angle getter
    float getAngle();
}
```

下面是一个使用AS5600磁传感器模拟输出的快速示例:

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
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```