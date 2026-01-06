---
layout: default
title: 索引搜索程序
nav_order: 3
permalink: /index_search_loop
parent: 开环控制
grand_parent: 运动控制
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 索引搜索程序
只有当 `Encoder` 类的构造函数提供了 `index` 引脚时，才会执行编码器索引的查找。搜索通过将电机设置为恒定速度来进行，直到它到达索引引脚。要设置所需的搜索速度，请更改以下参数：

```cpp
// index search velocity - default 1rad/s
motor.velocity_index_search = 2;
```
索引搜索在` motor.initFOC()` 函数中执行。

这个速度控制环的实现与 [开环速度控制](/velocity_openloop) 完全相同，唯一的区别是设置给电机的电压不是 `motor.voltage_limit`，而是 `motor.voltage_sensor_align`。

## 使用索引搜索的代码示例


<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>


这是一个运动控制程序的示例，它使用编码器作为位置传感器，特别是带有 index 信号的编码器。索引搜索速度设置为 3 RAD/s：

```cpp
// index search velocity [rad/s]
motor.velocity_index_search = 3;
```

在 motor.initFOC() 中通过执行索引搜索对电机和位置传感器进行对齐后，电机将以 2 RAD/s 的角速度开始旋转并保持该值。

<div class="type type-b" markdown="1">

```cpp
#include <SimpleFOC.h>

// motor instance
BLDCMotor motor = BLDCMotor(11);
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500, A0);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
void doIndex(){encoder.handleIndex();}


void setup() {
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB,doIndex); 

  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  driver.init();
  motor.linkDriver(&driver);

  // index search velocity [rad/s]
  motor.velocity_index_search = 3; // rad/s
  motor.voltage_sensor_align = 4; // Volts

  // set motion control loop to be used
  motor.controller = MotionControlType::velocity;

  // controller configuration 
  // default parameters in defaults.h

  // velocity PI controller parameters
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // default voltage_power_supply
  motor.voltage_limit = 6;
  // jerk control using voltage voltage ramp
  // default value is 300 volts per sec  ~ 0.3V per millisecond
  motor.PID_velocity.output_ramp = 1000;
 
  // velocity low pass filtering time constant
  motor.LPF_velocity.Tf = 0.01;


  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  
  // initialize motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();


  Serial.println("Motor ready.");
  _delay(1000);
}

// angle set point variable
float target_velocity = 2;

void loop() {
  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(target_velocity);

}

```

</div>

<div class="type type-s hide" markdown="1">

```cpp
#include <SimpleFOC.h>

// motor instance
StepperMotor motor = StepperMotor(50);
// driver instance
StepperDriver2PWM driver = StepperDriver2PWM(9, 10, 11, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500, A0);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
void doIndex(){encoder.handleIndex();}


void setup() {
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB,doIndex); 

  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  driver.init();
  motor.linkDriver(&driver);

  // index search velocity [rad/s]
  motor.velocity_index_search = 3; // rad/s
  motor.voltage_sensor_align = 4; // Volts

  // set motion control loop to be used
  motor.controller = MotionControlType::velocity;

  // controller configuration 
  // default parameters in defaults.h

  // velocity PI controller parameters
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // default voltage_power_supply
  motor.voltage_limit = 6;
  // jerk control using voltage voltage ramp
  // default value is 300 volts per sec  ~ 0.3V per millisecond
  motor.PID_velocity.output_ramp = 1000;
 
  // velocity low pass filtering time constant
  motor.LPF_velocity.Tf = 0.01;


  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  
  // initialize motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();


  Serial.println("Motor ready.");
  _delay(1000);
}

// angle set point variable
float target_velocity = 2;

void loop() {
  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(target_velocity);

}

```
</div>