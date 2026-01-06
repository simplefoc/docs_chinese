---
layout: default
title: I2C磁性传感器设置
parent: 磁力传感器
grand_parent: 位置传感器
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 2
permalink: /magnetic_sensor_i2c
toc: true
---


# I2C 磁性传感器设置

## 步骤 1. 实例化 `MagneticSensorI2C` 类

为了将 I2C 磁性位置传感器与 <span class="simple">Simple<span class="foc">FOC</span>库</span> 一起使用，首先创建 `MagneticSensorI2C` 类的实例：
```cpp
// MagneticSensorI2C(uint8_t _chip_address, float _cpr, uint8_t _angle_register_msb)
//  chip_address         - I2C chip address
//  bit_resolution       - resolution of the sensor
//  angle_register_msb   - angle read register msb
//  bits_used_msb        - number of used bits in msb register
MagneticSensorI2C sensor = MagneticSensorI2C(0x36, 12, 0x0E, 4);
```

类的参数如下：
 - `chip_address` - 磁性传感器的 I2C 地址
 - `bit_resolution` - 传感器的分辨率（传感器内部计数器寄存器的位数）
 - `angle_register_msb` - 包含角度值 MSB 部分的寄存器编号（例如，AS5600 为 `0x0E`，AS5048 为 `0xFE`）
 - `bits_used_msb` - MSB 寄存器中使用的位数

<blockquote class="info"> <p class="heading">如何找到 MSB 寄存器值和使用的位数值？</p>

由于 I2C 寄存器是字节（8 位）寄存器，它们包含 12-14 位的角度表示，分为两个字节地址，即 MSB（最高有效字节）和 LSB（最低有效字节）。
要实例化 I2C 磁性传感器，您需要提供 MSB 寄存器地址，并告诉库角度值如何在两个寄存器中分离。通过指定 MSB 寄存器中使用的位数和 `bit_resolution` 值，库可以计算 LSB 寄存器中使用的位数，并重建完整的角度值。
<br>
MSB/LSB 划分示例：
<ul>
<li>AS5600（12 位）- MSB（4 位），LSB（8 位）</li>
<li>AS5048B（14 位）：- MSB（8 位），LSB（6 位）</li>
</ul>
</blockquote>
<blockquote class="info">
<p class="heading">AS5600 示例</p>
<ul>
  <li>首先，我们打开 AS5600 传感器的 <a href="https://ams.com/documents/20143/36005/AS5600_DS000365_5-00.pdf" target="_blank">数据手册 <i class="fa fa-external-link"></i></a>。</li>
  <li>在数据手册中，我们找到 I2C 寄存器表（第 18 页）</li>
  <li>`angle_register_msb` 值是第一个（数据手册中靠上的）寄存器值 - `0x0E`</li>
  <li>`bits_used_msb` 值是 MSB 寄存器中的位数 - `4`</li>
</ul>
</blockquote>

最后，配置完成后，只需调用 `init()` 函数。此函数准备 I2C 接口并配置传感器硬件。因此，磁性传感器初始化代码如下所示：
```cpp
MagneticSensorI2C sensor = MagneticSensorI2C(0x36, 12, 0x0E, 4);

void setup(){
  ...
  sensor.init();
  ...
}
```

如果您希望使用多个通过 SPI 接口的磁性传感器，请确保您的传感器具有不同的地址，以下是一个简单示例：
```cpp
MagneticSensorI2C sensor1 = MagneticSensorI2C(0x36, 12, 0x0E, 4);
MagneticSensorI2C sensor2 = MagneticSensorI2C(0x37, 12, 0x0E, 4);

void setup(){
  ...
  sensor1.init();
  sensor2.init();
  ...
}
```


### 多个 I2C 总线

此外，库允许您使用 `init()` 函数将已配置的 I2C 总线连接到传感器。
```cpp
Wire.setClock(400000);
Wire.begin();

// providing 
sensor.init(&Wire)
```
对于可能的微控制器（不适用于 Arduino UNO），您可以为多个 I2C 传感器使用不同的 I2C 总线。请参见 `utils > sensor_test > magnetic_sensors > magnetic_sensor_i2c_dual_bus_examples` 中的示例。


###  常见传感器的快速配置

对于最常见的 I2C 磁性传感器，库提供了简化的配置构造函数。即适用于 AS5600 12 位传感器和 AS5048 14 位传感器。
```cpp
// instance of AS5600 sensor
MagneticSensorI2C sensor1 = MagneticSensorI2C(AS5600_I2C);
// instance of AS5048B sensor
MagneticSensorI2C sensor2 = MagneticSensorI2C(AS5048_I2C);
```
如果您希望实现自己的快速配置结构，您需要创建该结构的实例：
```cpp
struct MagneticSensorI2CConfig_s  {
  int chip_address;
  int bit_resolution; 
  int angle_register;
  int data_start_bit; 
};
```
并将其提供给构造函数，以下是一个示例：
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


请查看 `magnetic_sensor_i2_example.ino` 示例，以快速测试您的传感器。I2C 磁性传感器的所有功能都在 `MagneticSensorI2C.cpp/h` 文件中实现。

## 步骤 2. 实时使用磁性传感器

库中实现的磁性传感器有两种使用方式：
- 作为 FOC 算法的电机位置传感器
- 作为独立的位置传感器

### FOC 算法的位置传感器

要将传感器与库中实现的 FOC 算法一起使用，一旦初始化 `sensor.init()`，只需通过执行以下操作将其链接到 BLDC 电机：

```cpp
motor.linkSensor(&sensor);
```


您将能够使用电机实例访问电机的角度和速度：
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

以下是一个带无刷直流电机和驱动器的 AS5600 磁性传感器快速示例：

```cpp
#include <SimpleFOC.h>

// motor and driver
BLDCMotor motor = BLDCMotor(7);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// as5600 sensor quick config
MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C);

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

要在任何给定时间获取磁性传感器的角度和速度，您可以使用公共方法：
```cpp
class MagneticSensorI2C{
 public:
    // shaft velocity getter
    float getVelocity();
  	// shaft angle getter
    float getAngle();
}
```

<blockquote markdown="1" class="info">
<p class="heading" markdown="1">多次调用 `getVelocity`</p>
调用 `getVelocity` 时，只有当自上一次调用以来的经过时间长于变量 `min_elapsed_time`（默认 100us）中指定的时间时，它才会计算速度。如果自上次调用以来的经过时间短于 `min_elapsed_time`，该函数将返回先前计算的值。如有必要，可以轻松更改变量 `min_elapsed_time`：

```cpp
sensor.min_elapsed_time = 0.0001; // 100us by default
```
</blockquote>

#### 示例代码

以下是一个采用 I2C 通信的 AS5600 磁性传感器快速示例：
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
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  as5600.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(as5600.getAngle());
  Serial.print("\t");
  Serial.println(as5600.getVelocity());
}
```
