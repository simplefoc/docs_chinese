---
layout: default
title: 磁性传感器PWM输出设置
parent: 磁力传感器
grand_parent: 位置传感器
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /magnetic_sensor_pwm
---


# 磁性传感器PWM输出设置
<img src="./extras/Images/pwm_sensor.png">

要用磁性位置传感器的PWM输出，首先创建一个`MagneticSensorPWM` 的实例:

```cpp
// MagneticSensorPWM(uint8_t _pinPWM, int _min, int _max)
// - _pinPWM:         此引脚可以从磁性传感器读取PWM信号
// - _min_raw_count:  最小脉冲长度（单位：微秒）
// - _max_raw_count:  最小脉冲长度（单位：微秒）
MagneticSensorPWM sensor = MagneticSensorPWM(2, 4, 904);
```

这个类的参数有:
- `pinPWM` - 从磁性传感器读取PWM的引脚。
- `min_raw_count` - 以ms为单位的最小期望脉冲时间。这通常是脉冲初始化时间长度
- `max_raw_count` - 以ms为单位的最大脉冲时间。这是初始化脉冲时间加上数据发送时间的值。

<blockquote class="info"> <p class="heading"> 💡求最小值和最大值</p>
每种mcu，每种传感器都有一点不同，所以我们建议你使用提供的例程 <code class="highlighter-rouge">examples/sensor_test/magentic_sensor_pwm_example/find_raw_min_max</code> 来确定你的传感器的最大值和最小值
</blockquote>


<blockquote class="info"> 📚 请查阅27页AS5048 datasheet 或者 AS5600 datasheet 的第27页以获得关于PWM传感器如何编码角度的更深入的解释. <a href="https://ams.com/documents/20143/36005/AS5048_DS000298_4-00.pdf">AS5048 </a>, <a href="https://ams.com/documents/20143/36005/AS5600_DS000365_5-00.pdf">AS5600</a>   </blockquote>
在这个库中有两种方法来使用PWM传感器:

- 阻塞方式 - 基于 `pulseln` 函数
- 非阻塞方式 - 基于中断


### 基于阻塞式的实现

在初始化之后，唯一需要做的事情就是调用 `init()` 函数。该函数初始化传感器硬件。所以你的磁性传感器初始化代码如下:

```cpp
MagneticSensorPWM sensor = MagneticSensorPWM(2, 4, 904);

void loop(){
  ...
  sensor.init();
  ...
}
```

如果你希望使用多个PWM输出的磁性传感器，请确保你将它们的 `pinPWM`  引脚连接到不同的arduino引脚上，并遵循上面的相同想法，这里是一个简单的例子:

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
磁性传感器的阻塞支持可以说是在本库支持的所有位置传感技术中性能最差的。每当代码从传感器读取角度时，它将读取一个脉冲，由于磁性传感器的PWM频率约为1kHz，这意味着读取角度的最短执行时间约为1ms。但在Arudino UNO和类似的mcu情况下，这可能是唯一的选择
</blockquote>


### 基于中断的实现

为了以非阻塞的方式异步读取磁性传感器，，该库提出了基于中断的方法。我们要启用这种方法，首先需要创建一个简单的缓冲处理函数:
```cpp
// 创建类
MagneticSensorPWM sensor = MagneticSensorPWM(3, 4, 904);
// 创建 teh buffering 函数
void doPWM(){sensor.handlePWM();}
```

然后，在 `setup` 函数中，用户需要调用 `init()` 函数，然后调用 `attachInterrupt` 函数，参数中包含缓冲函数。下面是一个示例代码:

```cpp
// 创建类
MagneticSensorPWM sensor = MagneticSensorPWM(3, 4, 904);
// 创建 teh buffering 函数
void doPWM(){sensor.handlePWM();}

void loop(){
  ...
  // 初始化传感器
  sensor.init();
  // 启用中断，开始读取传感器
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
请你确保查看示例 `magnetic_sensor_pwm` 和 `magnetic_sensor_pwm_software_interrupt` ，如果你用完了硬件中断引脚，可以使用软件中断的例子。


## 实时使用磁性传感器

在这个库中有两种方法来使用磁性传感器:
- 作为电机位置传感器，用于FOC算法
- 作为独立位置传感器

### 用于FOC算法的位置传感器

在本库中要用位置传感器来实现FOC算法的话，一旦初始化了 `sensor.init()` (以及可能要开启中断)，就需要链接到无刷直流电机:



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
class MagneticSensorPWM{
 public:
    // 获取轴速度
    float getVelocity();
  	// 获取轴角度
    float getAngle();
}
```

这里是一个快速的例子，AS5048A磁性传感器使用它的pwm输出:
```cpp
#include <SimpleFOC.h>

// MagneticSensorPWM(uint8_t _pinPWM, int _min, int _max)
// - _pinPWM:         此引脚可以从磁性传感器读取PWM信号
// - _min_raw_count:  最小脉冲长度（单位：微秒）
// - _max_raw_count:  最小脉冲长度（单位：微秒）
MagneticSensorPWM sensor = MagneticSensorPWM(2, 4, 904);
void doPWM(){sensor.handlePWM();}

void setup() {
  // 监视点
  Serial.begin(115200);

  // 初始化磁性传感器硬件
  sensor.init();
  // 以阻塞（非中断）方式使用传感器，请注释掉此行
  sensor.enableInterrupt(doPWM);

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