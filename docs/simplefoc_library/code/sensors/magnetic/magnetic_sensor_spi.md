---
layout: default
title: Magnetic sensor SPI
parent: Magnetic sensor
grand_parent: Position Sensors
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /magnetic_sensor_spi
---


# SPI磁传感器设置

为了使用你的SPl磁位置传感器simpleFOClibrary首先创建一个`MagneticSensorSPI`类的实例:

```cpp
// MagneticSensorSPI(int cs, float _cpr, int _angle_register)
//  cs              - SPI chip select pin 
//  bit_resolution - magnetic sensor resolution
//  angle_register  - (optional) angle read register - default 0x3FFF
MagneticSensorSPI sensor = MagneticSensorSPI(10, 14, 0x3FFF);
```
类的参数为:
- `chip_select` - 你连接的传感器与SPI通信使用的pin number
- `bit_resolution` - 你的传感器分辨率(传感器内部计数器寄存器的位数)
- `angle register` - 包含角值的寄存器号。 <br>默认值 `angle_register` 数被设定 `0x3FFF` ，因为它是大多数低成本AS5048/AS5047传感器的角度寄存器。

此外，该库允许你通过设置变量来配置SPl通信时钟速度和SPl模式:
```cpp
// spi mode (phase/polarity of read/writes) i.e one of SPI_MODE0 | SPI_MODE1 (default) | SPI_MODE2 | SPI_MODE3
sensor.spi_mode = SPI_MODE0;
// speed of the SPI clock signal - default 1MHz
sensor.clock_speed = 500000;
```

最后，在配置之后，你需要做的唯一一件事就是调用 `init()` 函数。该功能准备SPl接口和初始化传感器硬件。所以你的磁传感器初始化代码如下:

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

如果你希望使用多个磁传感器，请确保将它们的 `chip_select` 引脚连接到不同的arduino引脚，并遵循上面的相同想法，这里是一个简单的例子:

```cpp
MagneticSensorSPI sensor1 = MagneticSensorSPI(10, 14, 0x3FFF);
MagneticSensorSPI sensor1 = MagneticSensorSPI(9, 14, 0x3FFF);

void setup(){
  ...
  sensor1.init();
  sensor2.init();
  ...
}
```

### 多个 SPI busses 
对于可能的微控制器，库为你提供了一种方法来提供你希望它使用的SPl总线，而不是默认的`SPI`类。

```cpp
// these are valid pins (mosi, miso, sclk) for 2nd SPI bus on storm32 board (stm32f107rc)
SPIClass SPI_2(PB15, PB14, PB13);
void setup(){
  // init magnetic sensor   
  sensor.init(&SPI_2);
}
```

### 常见传感器的快速配置

对于最常见的SPI磁传感器，该库提供了简化的配置构造函数。即AS5047/AS5147 14位SPI传感器和MA70 14位SSl传感器。

```cpp
// instance of AS5047/AS5147 sensor
MagneticSensorSPI sensor = MagneticSensorSPI(10, AS5147_SPI);
// instance of MA730 sensor
MagneticSensorSPI sensor = MagneticSensorSPI(10, MA730_SPI);
```
如果你想实现自己的快速配置结构，你需要创建一个结构的实例:
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
并将其提供给构造函数，下面是一个示例:
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

请检查 `magnetic_sensor_spi_example.ino` 并举一个快速测试你的传感器的例子。SPl磁传感器的所有特性都在 `MagneticSensorSPI.cpp/h` 的文件中实现


## 实时使用磁传感器

在这个库中有两种方法来使用磁传感器:
- 作为电机位置传感器用于FOC算法
- 作为独立位置传感器

### FOC算法的位置传感器

我们要使用这个库中实现的FOC算法的传感器，一旦你初始化了 `sensor.init()` ，你需要通过执行将它链接到无刷直流电机

```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

如果在任何给定时间获得磁传感器的角度和速度的时候，你可以使用公共方法:
```cpp
class MagneticSensorSPI{
 public:
    // shaft velocity getter
    float getVelocity();
  	// shaft angle getter
    float getAngle();
}
```

下面是一个带有SPl通信的AS5047U磁传感器的快速示例:
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
  // display the angle and the angular velocity to the terminal
  Serial.print(as5047u.getAngle());
  Serial.print("\t");
  Serial.println(as5047u.getVelocity());
}
```
