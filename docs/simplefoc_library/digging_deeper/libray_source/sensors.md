---
layout: default
title: Sensor support
parent: Library Source
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
nav_order: 3
permalink: /sensor_support
---

# Supporting additional sensors [v2.1](https://github.com/simplefoc/Arduino-FOC/releases)

In order to be able to use a new type of sensor with the FOC algorithm implemented with Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>, it needs to be wrapped in a class which extends the `Sensor` class. And it needs to implement just few generic functions.
```cpp
class Sensor{
public:
    // get current angle (rad) 
    virtual float getAngle() = 0;
    // get current angular velocity (rad/s)
    // already implemented 
    virtual float getVelocity();
    // returns 0 if it does need search for absolute zero
    // 1 - encoder with index (with index not found yet)
    // 0 - every other sensor 
    // by default returns 0
    virtual int needsSearch();
}
```

## Step 1. Header file `MySensor.h `
Lets make a mockup example of the new sensor implementation. We start with the `MySensor.h ` file: 

```cpp
#include <SimpleFOC.h>

class MySensor: public Sensor{
 public:
    MySensor(...);

    // initialize the sensor hardware
    void init();

    // Abstract functions of the Sensor class implementation
    // get current angle (rad) 
    float getAngle();
};
```

## Step 2. Class implementation file `MySensor.cpp`
Now let's implement the `MySensor.cpp` file:
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

// Abstract functions of the Sensor class implementation
// get current angle (rad) 
MySensor::getAngle(){
    // get the position value directly from the sensor
    // for example
    return sensor.read() ;
}
```

## Step 3. Arduino program
Finally we will be able to use it in Arduino code:
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




