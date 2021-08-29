---
layout: default
title: 磁性传感器模拟输出设置
parent: 磁力传感器
grand_parent: 位置传感器
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /magnetic_sensor_analog
---


# 磁性传感器模拟输出设置

要用磁性位置传感器的模拟输出，首先创建一个`MagneticSensorAnalog` 的实例:

```cpp
// MagneticSensorAnalog(uint8_t _pinAnalog, int _min, int _max)
//  pinAnalog     - 此引脚可以从磁性传感器读取模拟输出
//  min_raw_count - 预期读取的最小数值
//  max_raw_count - 读取的最大数值  
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);
```

这个类的参数有:
- `pinAnalog` - 读取磁性传感器模拟输出的引脚， , 
- `min_raw_count` - 最小的预期读数。虽然你可能期望它是O，但通常是0~15。如果出现这种错误，将导致每次旋转会轻轻咔哒一下。
- `max_raw_count` - 读取的最大值。虽然你可能期望它是2^10 = 1023，但它通常是1020~1023。注意:仅对于ESP32(带有12位ADC的MCU会接近4096)

<blockquote class="info"> <p class="heading"> 💡 求最小值和最大值</p>
每种mcu，每种传感器都有一点不同，所以我们建议你使用提供的例程 <code class="highlighter-rouge">examples/sensor_test/magentic_sensor_analog_example/find_raw_min_max</code>来确定你的传感器的最大值和最小值
</blockquote>


最后，在初始化之后，唯一需要做的事情就是调用 `init()` 函数。该函数初始化传感器硬件。所以你的磁性传感器初始化代码如下:

```cpp
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);

void loop(){
  ...
  sensor.init();
  ...
}
```

如果你希望使用多个模拟输出的磁性传感器，请确保将它们的模拟输出引脚连接到不同的arduino  ADC引脚上，并遵循上面的相同想法，这里是一个简单的例子:

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


## 实时使用磁性传感器

． 在这个库中有两种方法来使用磁性传感器:

- 作为电机位置传感器，用于FOC算法
- 作为独立位置传感器。

### 用于FOC算法的位置传感器

在本库中要用位置传感器来实现FOC算法的话，一旦初始化了 `sensor.init()` ，就需要链接到无刷直流电机:

```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

要在任意时刻获取磁性传感器输出的速度和角度，可以用下面的公共函数：

```cpp
class MagneticSensorSPI{
 public:
    // 获取轴速度
    float getVelocity();
  	// 获取轴角度
    float getAngle();
}
```

```cpp
class MagneticSensorAnalog{
 public:
    // 获取轴速度
    float getVelocity();
  	// 获取轴角度
    float getAngle();
}
```

下面是一个使用AS5600磁性传感器模拟输出的快速示例:

```cpp
#include <SimpleFOC.h>

// MagneticSensorAnalog(uint8_t _pinAnalog, int _min, int _max)
//  pinAnalog     - 此引脚可以从磁性传感器读取模拟输出
//  min_raw_count - 预期读取的最小数值 
//  max_raw_count - 读取的最大数值  
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);

void setup() {
  // 监视点
  Serial.begin(115200);

  // 初始化磁性传感器硬件
  sensor.init();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // 在终端显示角度和角速度
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```