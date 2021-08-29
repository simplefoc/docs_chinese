---
layout: default
title: 基于SPI的磁性传感器设置
parent: 磁力传感器
grand_parent: 位置传感器
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /magnetic_sensor_spi
---


# 基于SPI的磁性传感器设置

要用基于SPl的磁性位置传感器，首先创建一个`MagneticSensorSPI`类的实例:

```cpp
// MagneticSensorSPI(int cs, float _cpr, int _angle_register)
// cs              - SPI 芯片选择引脚
// bit_resolution  - 传感器分辨率
// angle_register  - （可选的）角度读取寄存器 - 默认 0x3FFF
MagneticSensorSPI sensor = MagneticSensorSPI(10, 14, 0x3FFF);
```
这个类的参数有:
- `chip_select` - 用于连接传感器的SPI通信的片选引脚
- `bit_resolution` - 传感器的分辨率(传感器内部计数器寄存器的位数)
- `angle register` - 包含角度值的寄存器。 <br>默认值 `angle_register` 设定为 `0x3FFF` ，因为它是大多数低成本AS5048/AS5047传感器的角度寄存器。

此外，该库可以通过设置类中的变量来配置SPl通信的模式和始终信号速度:
```cpp
// spi 模式 （相位/极性） i.e one of SPI_MODE0 | SPI_MODE1（默认）| SPI_MODE2 | SPI_MODE3
sensor.spi_mode = SPI_MODE0;
// SPI 时钟信号速度 - 默认 1MHz
sensor.clock_speed = 500000;
```

在配置相关参数后，唯一要做的是调用 `init()` 函数。该函数预备了SPl接口和初始化传感器。磁性传感器初始化代码如下:

```cpp
MagneticSensorSPI sensor = MagneticSensorSPI(10, 14, 0x3FFF);

void setup(){
  ...
  sensor.spi_mode = SPI_MODE0; // spi 模式 - 可选的
  sensor.clock_speed = 500000; // spi 时钟频率 - 可选的
  sensor.init();
  ...
}
```

如果你希望使用多个I2C磁性传感器，请确保将它们的 `chip_select` 引脚连接到不同的arduino引脚，并遵循上面的相同步骤。下面是一个简单的示例:

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

### 多SPI总线
对于可能的微控制器，本库提供了一种替代默认的SPI总线方法。

```cpp
// 引脚 mosi、miso、sclk 为 2nd SPI bus on storm32 board (stm32f107rc) 的可用引脚
SPIClass SPI_2(PB15, PB14, PB13);
void setup(){
  // 初始化磁性传感器   
  sensor.init(&SPI_2);
}
```

### 常见传感器的快速配置

对于最常见的SPI磁性传感器，本库提供了简化的配置构造函数，即AS5047/AS5147 14位SPI传感器和MA70 14位SSl传感器。

```cpp
// AS5047/AS5147传感器实例
MagneticSensorSPI sensor = MagneticSensorSPI(10, AS5147_SPI);
// MA730传感器实例
MagneticSensorSPI sensor = MagneticSensorSPI(10, MA730_SPI);
```
如果你想实现自己的快速配置结构，你需要创建一个结构体的实例:
```cpp
struct MagneticSensorSPIConfig_s  {
  int bit_resolution;
  int angle_register;
  int spi_mode; // 默认 SPI_MODE0
  long clock_speed;  // 默认 1MHz
  int data_start_bit; // 默认 13
  int command_rw_bit; // 默认 14
  int command_parity_bit; // 默认 15
};
```
并将其提供给构造函数，下面是一个示例:
```cpp
// 12位, 0x3FFF角度寄存器, spi模式1, 1MHz, 默认启用位, rw 命令和奇偶校验位
MagneticSensorSPIConfig_s MySensorConfig = {
  .bit_resolution=12, 
  .angle_register=0x3FFF, 
  .spi_mode=SPI_MODE1, 
  .clock_speed=1000000, 
  .data_start_bit=13,
  .command_rw_bit=14,
  .command_parity_bit=15
  }; 

// 在传感器类中配置所需的传感器
MagneticSensorSPI sensor = MagneticSensorSPI(10, MySensorConfig);
void setup(){
  sensor.init();
  ...
}
```

Please check the `magnetic_sensor_spi_example.ino` example for a quick test of your sensor. All the features of SPI magnetic sensors are implemented in the `MagneticSensorSPI.cpp/h` files. 

请用 `magnetic_sensor_spi_example.ino` 例程来快速测试你的传感器。SPl磁性传感器的所有特性都在 `MagneticSensorSPI.cpp/h` 的文件中实现


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
class MagneticSensorSPI{
 public:
    // 获取轴速度
    float getVelocity();
  	// 获取轴角度
    float getAngle();
}
```

下面是一个基于SPl通信的AS5047U磁性传感器的快速示例:
```cpp
#include <SimpleFOC.h>

// MagneticSensorSPI(int cs, float _cpr, int _angle_register)
// cs              - SPI芯片选择引脚
// bit_resolution  - 传感器分辨率
// angle_register  - （可选的）角度读取寄存器 - 默认 0x3FFF
MagneticSensorSPI as5047u = MagneticSensorSPI(10, 14, 0x3FFF);
// 快速配置
MagneticSensorSPI as5047u = MagneticSensorSPI(10, AS4147_SPI);

void setup() {
  // 监视点
  Serial.begin(115200);

  // 初始化磁性传感器硬件
  as5047u.init();

  Serial.println("as5047u ready");
  _delay(1000);
}

void loop() {
  // 在终端显示角度和角速度
  Serial.print(as5047u.getAngle());
  Serial.print("\t");
  Serial.println(as5047u.getVelocity());
}
```
