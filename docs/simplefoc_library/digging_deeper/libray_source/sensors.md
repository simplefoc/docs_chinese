---
layout: default
title: 传感器的支持
parent: 库源
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
nav_order: 3
permalink: /sensor_support
toc: true
---



# 通用位置传感器定义
这个类特意设计得很简单，作为所有类型传感器的基础。目前我们有编码器、磁编码器和霍尔传感器的实现。这个基类提取了最基本的共同特征，以便FOC驱动器能够获取其运行所需的数据。

要实现你自己的传感器，请创建这个类的子类，并实现`getSensorAngle()`方法。`getSensorAngle()`返回一个浮点值，单位为**弧度**，表示当前轴角，范围在`0`到`2*PI`（一整圈）之间。

为了正常工作，传感器类的`update()`方法必须足够快地被调用。通常，`BLDCMotor`的`loopFOC()`函数在每次迭代中调用它一次，所以你必须确保足够快地调用`loopFOC()`，这对电机和传感器的正确运行都很重要。

`Sensor`基类提供了`getVelocity()`的实现，并以精确的方式处理完整旋转的计数，但如果你愿意，也可以额外重写这些方法，为你的硬件提供更优的实现。


```cpp
class Sensor{
    public:
        /**
         * Get mechanical shaft angle in the range 0 to 2PI. This value will be as precise as possible with
         * the hardware. Base implementation uses the values returned by update() so that 
         * the same values are returned until update() is called again.
         */
        virtual float getMechanicalAngle();

        /**
         * Get current position (in rad) including full rotations and shaft angle.
         * Base implementation uses the values returned by update() so that the same
         * values are returned until update() is called again.
         * Note that this value has limited precision as the number of rotations increases,
         * because the limited precision of float can't capture the large angle of the full 
         * rotations and the small angle of the shaft angle at the same time.
         */
        virtual float getAngle();
        
        /** 
         * On architectures supporting it, this will return a double precision position value,
         * which should have improved precision for large position values.
         * Base implementation uses the values returned by update() so that the same
         * values are returned until update() is called again.
         */
        virtual double getPreciseAngle();

        /** 
         * Get current angular velocity (rad/s)
         * Can be overridden in subclasses. Base implementation uses the values 
         * returned by update() so that it only makes sense to call this if update()
         * has been called in the meantime.
         */
        virtual float getVelocity();

        /**
         * Get the number of full rotations
         * Base implementation uses the values returned by update() so that the same
         * values are returned until update() is called again. 
         */
        virtual int32_t getFullRotations();

        /**
         * Updates the sensor values by reading the hardware sensor.
         * Some implementations may work with interrupts, and not need this.
         * The base implementation calls getSensorAngle(), and updates internal
         * fields for angle, timestamp and full rotations.
         * This method must be called frequently enough to guarantee that full
         * rotations are not "missed" due to infrequent polling.
         * Override in subclasses if alternative behaviours are required for your
         * sensor hardware.
         */
        virtual void update();

        /** 
         * returns 0 if it does need search for absolute zero
         * 0 - magnetic sensor (& encoder with index which is found)
         * 1 - ecoder with index (with index not found yet)
         */
        virtual int needsSearch();
    protected:
        /** 
         * Get current shaft angle from the sensor hardware, and 
         * return it as a float in radians, in the range 0 to 2PI.
         * 
         * This method is pure virtual and must be implemented in subclasses.
         * Calling this method directly does not update the base-class internal fields.
         * Use update() when calling from outside code.
         */
        virtual float getSensorAngle()=0;
        /**
         * Call Sensor::init() from your sensor subclass's init method if you want smoother startup
         * The base class init() method calls getSensorAngle() several times to initialize the internal fields
         * to current values, ensuring there is no discontinuity ("jump from zero") during the first calls
         * to sensor.getAngle() and sensor.getVelocity()
         */
        virtual void init();
};

```
# 支持更多传感器 [v2.2](https://github.com/simplefoc/Arduino-FOC/releases)
为了能够将新型传感器与Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>实现的FOC算法一起使用，需要扩展`Sensor`类。在最简单的情况下，只需实现一个函数。

## 步骤1：头文件`MySensor.h`
让我们制作一个新传感器实现的模拟示例。我们从`MySensor.h`文件开始：
```cpp
#include <SimpleFOC.h>

class MySensor: public Sensor{
 public:
    MySensor(...);

    // initialize the sensor hardware
    void init();

    // Get current shaft angle from the sensor hardware, and 
    // return it as a float in radians, in the range 0 to 2PI.
    //  - This method is pure virtual and must be implemented in subclasses.
    //    Calling this method directly does not update the base-class internal fields.
    //    Use update() when calling from outside code.
    float getSensorAngle();
};
```

## 步骤2：类实现文件`MySensor.cpp`
现在让我们实现`MySensor.cpp`文件：
```cpp
#include "MySensor.h"

MySensor::MySensor(...){
    // define all the necessary sensor variables
    // or leave empty if not necessary
}
MySensor::init(){
    // setup all the needed sensor hardware 
    // for example
    sensor.hardwareInit();
}

MySensor::getSensorAngle(){
    // Get current shaft angle from the sensor hardware, and 
    // return it as a float in radians, in the range 0 to 2PI.
    return sensor.read() ;
}
```

## 步骤3：Arduino程序
最后，我们可以在Arduino代码中使用它：
```cpp
#include <SimpleFOC.h>
#include "MySensor.h"

// instantiate the MySensor
MySensor my_sensor = MySensor(...);

// instantiate the motor
BLDCMotor motor = BLDCMotor(...)

// driver
BLDCDriver3PWM driver = BLDCDriver3PWM(...)

void setup(){
    // init MySensor position tracking
    my_sensor.init();

    // link MySensor with the motor
    motor.linkSensor(&my_sensor);

    // driver config
    driver.init();
    motor.linkDriver(&driver);

    // get ready for FOC
    motor.init();
    motor.initFOC();
}
void loop(){
    // do FOC
    motor.loopFOC();
    motor.move(target);
}

```

## （可选）Arduino程序 - 独立传感器
最后，我们可以在Arduino代码中使用它：
```cpp
#include <SimpleFOC.h>
#include "MySensor.h"

// instantiate the MySensor
MySensor my_sensor = MySensor(...);

void setup(){
    // init MySensor position tracking
    my_sensor.init();
}
void loop(){
    // update the sensor states - IMPORTANT
    my_sensor.update();
    // display the angle and velocity
    Serial.print(my_sensor.getAngle());
    Serial.print("\t")
    Serial.print(my_sensor.getVelocity());
}

```




