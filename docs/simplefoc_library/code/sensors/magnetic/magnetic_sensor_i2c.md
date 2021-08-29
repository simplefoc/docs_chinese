---
layout: default
title: I2C磁性传感器设置
parent: 磁力传感器
grand_parent: 位置传感器
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /magnetic_sensor_i2c
---


# l2C磁性传感器设置

要用基于I2C的磁性位置传感器，首先创建一个`MagneticSensorI2C`类的实例:

```cpp
// MagneticSensorI2C(uint8_t _chip_address, float _cpr, uint8_t _angle_register_msb)
//  chip_address         - I2C芯片地址
//  bit_resolution       - 传感器分辨率
//  angle_register_msb   - 角度读取寄存器msb
//  bits_used_msb        - msb寄存器使用的分辨率位数
MagneticSensorI2C sensor = MagneticSensorI2C(0x36, 12, 0x0E, 4);
```

这个类的参数有:
 - `chip_address` - I2C 磁性传感器的地址
 - `bit_resolution` -传感器的分辨率(传感器内部计数器寄存器的位数)
 - `angle_register_msb` - 包含MSB部分角度值的寄存器。( ex. AS5600 - `0x0E`, AS5048 - `0xFE` ) 
 - `bits_used_msb` - MSB寄存器中使用的位数

<blockquote class="info"> <p class="heading">如何找到MSB的寄存器值和使用的位数?</p>
由于I2C寄存器是字节(8位)寄存器，它们包含12-14位的角度，用两个字节地址分隔开，分别是MSB(最高有效字节)和LSB(最低有效字节)。要实例化I2C磁性传感器，你需要提供MSB寄存器地址，并告知这两个寄存器所存储的角度值是如何分隔的。通过指定MSB寄存器包含的位数和 <code class="highlighter-rouge">bit_resolution</code> 值，库可以计算出LSB寄存器中使用了多少位，并可以重建完整的角度值。<br>
示例MSB / LSB:


<ul>
<li>AS5600 (12 bit) - MSB (4bit), LSB (8bit)</li>
<li>AS5048B (14bit): - MSB (8bit), LSB(6bit)</li>
</ul>
</blockquote>

<blockquote class="info">
<p class="heading">以AS5600为例</p>
<ul>
  <li> 首先我们打开传感器 AS5600 的 <a href="https://ams.com/documents/20143/36005/AS5600_DS000365_5-00.pdf" target="_blank"> datasheet <i class="fa fa-external-link"></i></a>.</li>
  <li> 在数据表中，我们找到了l2C寄存器表(第18页)</li>
  <li> <code class="highlighter-rouge">angle_register_msb</code> 的值是第一个(在数据表的上部)寄存器值 - <code class="highlighter-rouge">0x0E</code></li>
  <li> <code class="highlighter-rouge">bits_used_msb</code> 的值是MSB寄存器中的位数 - <code class="highlighter-rouge">4</code></li>
</ul>
</blockquote>




在配置相关参数后，唯一要做的是调用 `init()` 函数。该函数预备了I2C接口和初始化传感器。磁性传感器初始化代码如下:

```cpp
MagneticSensorI2C sensor = MagneticSensorI2C(0x36, 12, 0x0E, 4);

void loop(){
  ...
  sensor.init();
  ...
}
```

如果你希望使用多个I2C磁性传感器，请确保你的传感器有不同的地址，这里是一个简单的示例:
```cpp
MagneticSensorI2C sensor1 = MagneticSensorI2C(0x36, 12, 0x0E, 4);
MagneticSensorI2C sensor2 = MagneticSensorI2C(0x37, 12, 0x0E, 4);

void loop(){
  ...
  sensor1.init();
  sensor2.init();
  ...
}
```


### 多I2C总线 

此外，本库可以使用 `init()` 函数将已经配置好的 I2C 总线配置到传感器。

```cpp
Wire.setClock(400000);
Wire.begin();

// 假定 
sensor.init(&Wire)
```
对于可能的微控制器(Arduino UNO除外)，你可以为多个 I2C 传感器使用不同的l2C总线 。例子： `utils > sensor_test > magnetic_sensors > magnetic_sensor_i2c_dual_bus_examples`. 

###  常见传感器的快速配置 

对于最常见的 I2C 磁性传感器，该库提供了简化的配置构造函数。即AS5600 12位传感器和AS5048 14位传感器

```cpp
// AS5600传感器实例
MagneticSensorI2C sensor2 = MagneticSensorI2C(AS5600_I2C);
// AS5048B传感器实例
MagneticSensorI2C sensor2 = MagneticSensorI2C(AS5048_I2C);
```
如果你想实现自己的快速配置结构，你需要创建一个结构的实例:
```cpp
struct MagneticSensorI2CConfig_s  {
  int chip_address;
  int bit_resolution; 
  int angle_register;
  int data_start_bit; 
};
```
并将其提供给构造函数，下面是一个示例:
```cpp
// 配置AS5600传感器
MagneticSensorI2CConfig_s MySensorConfig = {
  .chip_address = 0x36, 
  .bit_resolution = 12, 
  .angle_register=0x0E, 
  .data_start_bit=11
  }; 

// 在传感器类中配置所需的传感器
MagneticSensorI2C sensor = MagneticSensorI2C(MySensorConfig);
void setup(){
  sensor.init();
  ...
}
```

请检查 `magnetic_sensor_i2_example.ino` 举一个快速测试你的传感器的例子。l2C磁性传感器的所有功能在`MagneticSensorI2C.cpp/h` 的文件上实现。

## 实时使用磁性传感器

在这个库中有两种方法来使用磁性传感器:
- 作为电机位置传感器，用于FOC算法
- 作为独立位置传感器

### 用于FOC算法的位置传感器

在本库中要用位置传感器来实现FOC算法的话，一旦初始化了 `sensor.init()` ，就需要链接到无刷直流电机

```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

要在任意时刻获取磁性传感器输出的速度和角度，可以用下面的公共函数：
```cpp
class MagneticSensorI2C{
 public:
    // 获取轴速度
    float getVelocity();
  	// 获取轴角度
    float getAngle();
}
```

下面是一个带有12C通信的AS5600磁性传感器的快速示例:
```cpp
#include <SimpleFOC.h>

// MagneticSensorI2C(uint8_t _chip_address, float _cpr, uint8_t _angle_register_msb)
//  chip_address         - I2C芯片地址
//  bit_resolution       - 传感器分辨率
//  angle_register_msb   - 角度读取寄存器msb
//  bits_used_msb        - msb寄存器使用的分辨率位数
MagneticSensorI2C as5600 = MagneticSensorI2C(0x36, 12, 0x0E, 4);
// 快速配置
MagneticSensorI2C as5600 = MagneticSensorI2C(AS5600_I2C);

void setup() {
  // 监视点
  Serial.begin(115200);

  // 初始化磁性传感器硬件
  as5600.init();

  Serial.println("AS5600 ready");
  _delay(1000);
}

void loop() {
  // 在终端显示角度和角速度
  Serial.print(as5600.getAngle());
  Serial.print("\t");
  Serial.println(as5600.getVelocity());
}
```