---
layout: default
title: Magnetic sensor I2C
parent: Magnetic sensor
grand_parent: Position Sensors
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /magnetic_sensor_i2c
---


# l2C磁传感器设置

现在为了使用你的l2C磁位置传感器与Simple<span class="foc">FOC</span>library首先创建一个 `MagneticSensorI2C` 的实例:

```cpp
// MagneticSensorI2C(uint8_t _chip_address, float _cpr, uint8_t _angle_register_msb)
//  chip_address         - I2C chip address
//  bit_resolution       - resolution of the sensor
//  angle_register_msb   - angle read register msb
//  bits_used_msb        - number of used bits in msb register
MagneticSensorI2C sensor = MagneticSensorI2C(0x36, 12, 0x0E, 4);
```

类的参数是:
 - `chip_address` - I2C 磁传感器地址
 - `bit_resolution` -你的传感器分辨率(传感器内部计数器寄存器的位数)
 - `angle_register_msb` - 包含MSB部分角值的寄存器号。( ex. AS5600 - `0x0E`, AS5048 - `0xFE` ) 
 - `bits_used_msb` - MSB寄存器中使用的比特数

<blockquote class="info"> <p class="heading">如何找到MSB的寄存器值和使用的位值?</p>
由于l2C寄存器是字节(8位)寄存器，它们包含12-14位的角度表示，用两个字节地址分隔，MSB(最高有效字节)和LSB(最低有效字节)要实例化l2C磁传感器，你需要提供MSB寄存器地址，并告诉库两个寄存器中的角度值是如何分离的。通过指定MSB寄存器中使用的位数和 <code class="highlighter-rouge">bit_resolution</code> 值，库可以计算出LSB寄存器中使用了多少位，并可以重建完整的角度值。<br>
示例MSB / LSB部门:

<ul>
<li>AS5600 (12 bit) - MSB (4bit), LSB (8bit)</li>
<li>AS5048B (14bit): - MSB (8bit), LSB(6bit)</li>
</ul>
</blockquote>

<blockquote class="info">
<p class="heading">AS5600 例子</p>
<ul>
  <li> 首先我们打开传感器 AS5600 的 <a href="https://ams.com/documents/20143/36005/AS5600_DS000365_5-00.pdf" target="_blank"> datasheet <i class="fa fa-external-link"></i></a>.</li>
  <li> 在数据表中，我们找到了l2C寄存器表(第18页)</li>
  <li> <code class="highlighter-rouge">angle_register_msb</code> 的值是第一个(在数据表的上部)寄存器值 - <code class="highlighter-rouge">0x0E</code></li>
  <li> <code class="highlighter-rouge">bits_used_msb</code> 的值是MSB寄存器中的位数 - <code class="highlighter-rouge">4</code></li>
</ul>
</blockquote>



最后，在配置之后，只需调用`init()` 函数。完成 I2C 接口的准备和传感器硬件的配置。所以你的磁传感器初始化代码如下:

```cpp
MagneticSensorI2C sensor = MagneticSensorI2C(0x36, 12, 0x0E, 4);

void loop(){
  ...
  sensor.init();
  ...
}
```

如果你希望使用多个磁传感器使用SPl接口，那么需要确保你的传感器有不同的地址，这里是一个简单的例子:
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


### 多个I2C总线 

此外，该库允许你使用 `init()` 函数将已经配置好的 I2C 总线配置到传感器。

```cpp
Wire.setClock(400000);
Wire.begin();

// providing 
sensor.init(&Wire)
```
对于可能的微控制器(Arduino UNO除外)，你可以为多个 I2C 传感器使用不同的l2C总线 。例子： `utils > sensor_test > magnetic_sensors > magnetic_sensor_i2c_dual_bus_examples`. 

###  常见传感器的快速配置 

对于最常见的 I2C 磁传感器，该库提供了简化的配置构造函数。即AS5600 12位传感器和AS5048 14位传感器

```cpp
// instance of AS5600 sensor
MagneticSensorI2C sensor2 = MagneticSensorI2C(AS5600_I2C);
// instance of AS5048B sensor
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
// configuration for AS5600 sensor
MagneticSensorI2CConfig_s MySensorConfig = {
  .chip_address = 0x36, 
  .bit_resolution = 12, 
  .angle_register=0x0E, 
  .data_start_bit=11
  }; 

// the sensor class with desired sensor configuration
MagneticSensorI2C sensor = MagneticSensorI2C(MySensorConfig);
void setup(){
  sensor.init();
  ...
}
```

请检查 `magnetic_sensor_i2_example.ino` 举一个快速测试你的传感器的例子。l2C磁传感器的所有功能在`MagneticSensorI2C.cpp/h` 的文件上实现。

## 实时使用磁传感器

在这个库中有两种方法来使用磁传感器:
- 作为电机位置传感器用于FOC算法
- 作为独立位置传感器

### FOC算法的位置传感器

当你要使用这个库中实现的FOC算法的传感器，一旦你初始化了 `sensor.init()` ，你只需要通过执行以下命令将它链接到BLDC电机:

```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

当你要在任何给定时间获得磁传感器的角度和速度，你可以使用公共方法:
```cpp
class MagneticSensorI2C{
 public:
    // shaft velocity getter
    float getVelocity();
  	// shaft angle getter
    float getAngle();
}
```

下面是一个带有12C通信的AS5600磁传感器的快速示例:
```cpp
#include <SimpleFOC.h>

// MagneticSensorI2C(uint8_t _chip_address, float _cpr, uint8_t _angle_register_msb)
//  chip_address         - I2C chip address
//  bit_resolution       - resolution of the sensor
//  angle_register_msb   - angle read register msb
//  bits_used_msb        - number of used bits in msb register
MagneticSensorI2C as5600 = MagneticSensorI2C(0x36, 12, 0x0E, 4);
// or quick config
MagneticSensorI2C as5600 = MagneticSensorI2C(AS5600_I2C);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // init magnetic sensor hardware
  as5600.init();

  Serial.println("AS5600 ready");
  _delay(1000);
}

void loop() {
  // display the angle and the angular velocity to the terminal
  Serial.print(as5600.getAngle());
  Serial.print("\t");
  Serial.println(as5600.getVelocity());
}
```