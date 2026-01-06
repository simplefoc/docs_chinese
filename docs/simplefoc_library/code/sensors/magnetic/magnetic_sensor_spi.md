---
layout: default
title: 基于SPI的磁性传感器设置
parent: 磁力传感器
grand_parent: 位置传感器
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /magnetic_sensor_spi
toc: true
---


# SPI 磁性传感器设置

## 步骤 1. 实例化 `MagneticSensorSPI` 类

为了将 SPI 磁性位置传感器与 <span class="simple">Simple<span class="foc">FOC</span>library</span> 一起使用，首先创建 `MagneticSensorSPI` 类的实例：
```cpp
// MagneticSensorSPI(int cs, float _cpr, int _angle_register)
//  cs              - SPI chip select pin 
//  bit_resolution - magnetic sensor resolution
//  angle_register  - (optional) angle read register - default 0x3FFF
MagneticSensorSPI sensor = MagneticSensorSPI(10, 14, 0x3FFF);
```
类的参数包括：
- `chip_select` - 连接到传感器用于 SPI 通信的引脚号
- `bit_resolution` - 传感器的分辨率（传感器内部计数器寄存器的位数）
- `angle register` - 包含角度值的寄存器编号。默认的 `angle_register` 编号设置为 `0x3FFF`，因为它是大多数低成本 AS5048/AS5047 传感器的角度寄存器。

此外，库允许通过设置变量来配置 SPI 通信时钟速度和 SPI 模式：
```cpp
// spi mode (phase/polarity of read/writes) i.e one of SPI_MODE0 | SPI_MODE1 (default) | SPI_MODE2 | SPI_MODE3
sensor.spi_mode = SPI_MODE0;
// speed of the SPI clock signal - default 1MHz
sensor.clock_speed = 500000;
```

最后，配置完成后，只需调用 `init()` 函数。该函数准备 SPI 接口并初始化传感器硬件。因此，磁性传感器初始化代码如下：
```cpp
MagneticSensorSPI sensor = MagneticSensorSPI(10, 14, 0x3FFF);

void setup(){
  ...
  sensor.spi_mode = SPI_MODE0; // spi mode - OPTIONAL
  sensor.clock_speed = 500000; // spi clock frequency - OPTIONAL
  sensor.init();
  ...
}
```

如果希望使用多个磁性传感器，请确保将它们的 `chip_select` 引脚连接到不同的 Arduino 引脚，并按照上述相同的思路操作，以下是一个简单示例：
```cpp
MagneticSensorSPI sensor1 = MagneticSensorSPI(10, 14, 0x3FFF);
MagneticSensorSPI sensor2 = MagneticSensorSPI(9, 14, 0x3FFF);

void setup(){
  ...
  sensor1.init();
  sensor2.init();
  ...
}
```

### 多个 SPI 总线
对于可能的微控制器，库提供了一种方式，可以为其提供希望使用的 SPI 总线，而不是默认的 `SPI` 类。
```cpp
// these are valid pins (mosi, miso, sclk) for 2nd SPI bus on storm32 board (stm32f107rc)
SPIClass SPI_2(PB15, PB14, PB13);
void setup(){
  // init magnetic sensor   
  sensor.init(&SPI_2);
}
```

### 常见传感器的快速配置

对于最常见的 SPI 磁性传感器，库提供了简化的配置构造函数。即适用于 AS5047/AS5147 14 位 SPI 传感器和 MA70 14 位 SSI 传感器。

```cpp
// instance of AS5047/AS5147 sensor
MagneticSensorSPI sensor = MagneticSensorSPI(10, AS5147_SPI);
// instance of MA730 sensor
MagneticSensorSPI sensor = MagneticSensorSPI(10, MA730_SPI);
```
如果希望实现自己的快速配置结构，需要创建该结构的实例：
```cpp
struct MagneticSensorSPIConfig_s  {
  int bit_resolution;
  int angle_register;
  int spi_mode; // default SPI_MODE0
  long clock_speed;  // default 1MHz
  int data_start_bit; // default 13
  int command_rw_bit; // default 14
  int command_parity_bit; // default 15
};
```
并将其提供给构造函数，示例如下：
```cpp
// 12 bit, 0x3FFF angle register, spi mode 1, 1MHz, default start bit, rw command, and parity bit 
MagneticSensorSPIConfig_s MySensorConfig = {
  .bit_resolution=12, 
  .angle_register=0x3FFF, 
  .spi_mode=SPI_MODE1, 
  .clock_speed=1000000, 
  .data_start_bit=13,
  .command_rw_bit=14,
  .command_parity_bit=15
  }; 

// the sensor class with desired sensor configuration
MagneticSensorSPI sensor = MagneticSensorSPI(10, MySensorConfig);
void setup(){
  sensor.init();
  ...
}
```

Please check the `magnetic_sensor_spi_example.ino` example for a quick test of your sensor. All the features of SPI magnetic sensors are implemented in the `MagneticSensorSPI.cpp/h` files. 


## 步骤 2. 在实时中使用磁性传感器

库中实现的磁性传感器有两种使用方式：
- 作为 FOC 算法的电机位置传感器
- 作为独立的位置传感器

### FOC 算法的位置传感器

要将传感器与库中实现的 FOC 算法一起使用，一旦初始化 `sensor.init()`，只需通过执行以下操作将其链接到 BLDC 电机：

```cpp
motor.linkSensor(&sensor);
```

然后，您将能够使用电机实例访问电机的角度和速度：
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

以下是带有 BLDC 电机和驱动器的 AS5047 磁性传感器的快速示例：

```cpp
#include <SimpleFOC.h>

// motor and driver
BLDCMotor motor = BLDCMotor(7);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
 
// as5600 sensor quick config
MagneticSensorSPI sensor = MagneticSensorSPI(AS5047_SPI);

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

要在任何给定时间获取磁性传感器的角度和速度，可以使用公共方法：
```cpp
class MagneticSensorSPI{
 public:
    // shaft velocity getter
    float getVelocity();
  	// shaft angle getter
    float getAngle();
}
```

<blockquote markdown="1" class="info">
<p class="heading" markdown="1">多次调用 `getVelocity`</p>
调用 `getVelocity` 时，只有当自上次调用以来的经过时间长于变量 `min_elapsed_time`（默认 100us）中指定的时间时，它才会计算速度。如果自上次调用以来的经过时间短于 `min_elapsed_time`，则该函数将返回先前计算的值。如有必要，可以轻松更改变量 `min_elapsed_time`：

```cpp
sensor.min_elapsed_time = 0.0001; // 100us by default
```
</blockquote>


#### 示例代码

以下是带有 SPI 通信的 AS5047U 磁性传感器的快速示例：
```cpp
#include <SimpleFOC.h>

// MagneticSensorSPI(int cs, float _cpr, int _angle_register)
// cs              - SPI chip select pin 
// bit_resolution  - sensor resolution
// angle_register  - (optional) angle read register - default 0x3FFF
MagneticSensorSPI as5047u = MagneticSensorSPI(10, 14, 0x3FFF);
// or quick config
MagneticSensorSPI as5047u = MagneticSensorSPI(10, AS4147_SPI);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // initialise magnetic sensor hardware
  as5047u.init();

  Serial.println("as5047u ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  as5047u.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(as5047u.getAngle());
  Serial.print("\t");
  Serial.println(as5047u.getVelocity());
}
```
