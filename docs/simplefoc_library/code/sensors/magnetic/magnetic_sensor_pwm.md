---
layout: default
title: Magnetic sensor PWM
parent: Magnetic sensor
grand_parent: Position Sensors
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /magnetic_sensor_pwm
---


# 磁传感器设置PWM输出
<img src="./extras/Images/pwm_sensor.png">

为了使用你的PWM输出磁位置传感器与SimpleFOClibrary首先创建一个`MagneticSensorPWM` 的实例:

```cpp
// MagneticSensorPWM(uint8_t _pinPWM, int _min_raw_count, int _max_raw_count)
// - _pinPWM:         the pin that is reading the pwm from magnetic sensor
// - _min_raw_count:  the minimal length of the pulse (in microseconds)
// - _max_raw_count:  the maximal length of the pulse (in microseconds)
MagneticSensorPWM sensor = MagneticSensorPWM(2, 4, 904);
```

类的参数为
- `pinPWM` - 从磁传感器读取模拟输出的引脚。
- `min_raw_count` - 期望的最小脉冲时间(以微秒计)。这通常是脉冲初始化时间的长度
- `max_raw_count` - 以微秒为单位的最大脉冲时间。这是初始化脉冲时间加上数据发送时间的值。

<blockquote class="info"> <p class="heading"> 💡求最小值和最大值</p>
每个mcu和每个传感器都有一点不同，所以我们建议你使用提供的例子 <code class="highlighter-rouge">examples/sensor_test/magentic_sensor_pwm_example/find_raw_min_max</code> 找出传感器的最大值和最小值
</blockquote>

<blockquote class="info"> 📚 请查阅27页AS5048 datasheet 或者 AS5600 datasheet 的第27页以获得关于PWM传感器如何编码角度的更深入的解释. <a href="https://ams.com/documents/20143/36005/AS5048_DS000298_4-00.pdf">AS5048 </a>, <a href="https://ams.com/documents/20143/36005/AS5600_DS000365_5-00.pdf">AS5600</a>   </blockquote>

在这个库中有两种方法来使用PWM传感器:

- 阻塞方式 - 基于 `pulseln` function
- 基于中断的,非阻塞


### 阻碍实现

在创建传感器类之后，你需要做的唯一一件事就是调用 `init()` 函数。该函数初始化传感器硬件。所以你最终的磁传感器代码看起来像:

```cpp
MagneticSensorPWM sensor = MagneticSensorPWM(2, 4, 904);

void loop(){
  ...
  sensor.init();
  ...
}
```

如果你希望使用多个磁传感器，请确保你将它们的 `chip_select`  pins连接到不同的arduino pins，遵循上述相同的思路，这里是一个简单的例子:

```cpp
MagneticSensorPWM sensor1 = MagneticSensorPWM(2, 4, 904);
MagneticSensorPWM sensor2 = MagneticSensorPWM(3, 4, 904);

void loop(){
  ...
  sensor1.init();
  sensor2.init();
  ...
}
```
请检查 `magnetic_sensor_analog_pwm.ino` ，来看更多例子吧!

<blockquote class="warning">
<p class="heading">注意:阻止支持限制” ⚠️</p>
磁传感器的阻塞支持可以说是在本库支持的所有位置传感技术中性能最差的。每当代码从传感器读取角度时，它将读取一个脉冲，由于磁传感器的PWM频率约为1kHz，这意味着读取角度的最短执行时间约为1ms。但在Arudino UNO和类似的mcu情况下，这可能是唯一的选择
</blockquote>


### 基于中断的实现

为了异步读取磁传感器，在非阻塞的方式，该库提出了基于中断的方法。我们要启用这种方法，首先需要创建一个简单的缓冲处理函数:
```cpp
// create the class
MagneticSensorPWM sensor = MagneticSensorPWM(3, 4, 904);
// create teh buffering function
void doPWM(){sensor.handlePWM();}
```

然后，在 `setup` 函数中，用户需要调用 `init()` 函数，然后调用 `attachInterrupt` 函数，参数中包含缓冲函数。下面是一个示例代码:

```cpp
// create the class
MagneticSensorPWM sensor = MagneticSensorPWM(3, 4, 904);
// create teh buffering function
void doPWM(){sensor.handlePWM();}

void loop(){
  ...
  // init the sensor
  sensor.init();
  // enable the interrupt and start reading the sensor
  sensor.enableInterrupt(doPWM);
  ...
}
```
下面是两个传感器的示例代码:
```cpp
MagneticSensorPWM sensor1 = MagneticSensorPWM(2, 4, 904);
void doPWM1(){sensor1.handlePWM();} 
MagneticSensorPWM sensor2 = MagneticSensorPWM(3, 4, 904);
void doPWM2(){sensor2.handlePWM();}

void loop(){
  ...
  sensor1.init();  
  sensor1.enableInterrupt(doPWM1);
  sensor2.init();  
  sensor2.enableInterrupt(doPWM2);
  ...
}
```
请你确保查看示例 `magnetic_sensor_pwm` 和 `magnetic_sensor_pwm_software_interrupt` ，如果你用完硬件中断引脚，使用软件中断的例子。


## 实时使用磁传感器

在这个库中有两种方法来使用磁传感器:
- 作为电机位置传感器用于FOC算法
- 作为独立位置传感器

### FOC算法的位置传感器

要使用这个库中实现的FOC算法的传感器，一旦你初始化了 `sensor.init()`(并且可能启动了中断)，你只需要通过执行以下命令将它链接到电机:



```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

要在任何给定时间获得磁传感器的角度和速度，你可以使用公共方法:
```cpp
class MagneticSensorPWM{
 public:
    // shaft velocity getter
    float getVelocity();
  	// shaft angle getter
    float getAngle();
}
```

这里是一个快速的例子，AS5048A磁传感器使用它的pwm输出:
```cpp
#include <SimpleFOC.h>

// MagneticSensorPWM(uint8_t _pinPWM, int _min, int _max)
// - _pinPWM:         the pin that is reading the pwm from magnetic sensor
// - _min_raw_count:  the minimal length of the pulse (in microseconds)
// - _max_raw_count:  the maximal length of the pulse (in microseconds)
MagneticSensorPWM sensor = MagneticSensorPWM(2, 4, 904);
void doPWM(){sensor.handlePWM();}

void setup() {
  // monitoring port
  Serial.begin(115200);

  // initialise magnetic sensor hardware
  sensor.init();
  // comment out to use sensor in blocking (non-interrupt) way
  sensor.enableInterrupt(doPWM);

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