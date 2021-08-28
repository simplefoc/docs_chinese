---
layout: default
title: 支持的传感器
parent: Library Source
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
nav_order: 3
permalink: /sensor_support
---

# 支持附加传感器 [v2.1](https://github.com/simplefoc/Arduino-FOC/releases)

为了能够使用一种新型传感器，该传感器采用Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>实现的FOC算法，需要将其封装在一个扩展`Sensor`的类中。它只需要实现几个通用函数。

```cpp
class Sensor{
public:
    // 获得当前角度(rad)
    virtual float getAngle() = 0;
    // 获得当前角速度(rad/s)
    // 已实现
    virtual float getVelocity();
    // 如果需要搜索绝对零，则返回0
    // 1 - 编码器与引脚 (没找到引脚)
    // 0 - 每一个传感器 
    // 默认返回0
    virtual int needsSearch();
}
```

## 步骤1 头文件`MySensor.h `
让我们制作一个新传感器实现的模型示例。我们从`MySensor.h `文件开始：

```cpp
#include <SimpleFOC.h>

class MySensor: public Sensor{
 public:
    MySensor(...);

    // 初始化传感器硬件
    void init();

    // 实现 Sensor 抽象函数
    // 获得当前角度(rad)
    float getAngle();
};
```

## 步骤2 类实现文件 `MySensor.cpp`
现在让我们实现`MySensor.cpp` 文件：

```cpp
#include "MySensor.h"

MySensor::MySensor(...){
    // 定义所有必要的传感器变量
    // 如果没有必要，也可以空着
}
MySensor::init(){
    // 安装所有需要的传感器硬件
    // 例如
    sensor.hardwareInit();
}

// 实现 Sensor 抽象函数
// 获得当前角度(rad)
MySensor::getAngle(){
    // 直接从传感器获取位置值
    // 例如
    return sensor.read() ;
}
```

## 步骤3 Arduino项目
最后，我们将能够在Arduino代码中使用它：
```cpp
#include <SimpleFOC.h>
#include "MySensor.h"

// 实例化 MySensor
MySensor my_sensor = MySensor(...);

// 实例化运动
BLDCMotor motor = BLDCMotor(...)

// 驱动器
BLDCDriver3PWM driver = BLDCDriver3PWM(...)

void setup(){
    // init MySensor 位置跟踪
    my_sensor.init();

    // 连接 MySensor 与电机
    motor.linkSensor(&my_sensor);

    // 驱动程序配置
    driver.init();
    motor.linkDriver(&driver);

    // 准备 FOC
    motor.init();
    motor.initFOC();
}
void loop(){
    // do FOC
    motor.loopFOC();
    motor.move(target);
}

```



