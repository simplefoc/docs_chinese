---
layout: default
title: Index Search loop 
nav_order: 3
permalink: /index_search_loop
parent: Open-Loop Motion control
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 索引搜索程序
只有在为 `Encoder` 的构造函数提供了 `index` pin，才会执行查找编码器索引。搜索是通过设置一个恒定的速度，直到它到达 index pin。要设置所需的搜索速度，请修改参数:

```cpp
// index search velocity - default 1rad/s
motor.velocity_index_search = 2;
```
索引搜索在`motor.initFOC()`函数中执行。

速度控制实际上与 [速度开环](/velocity_loop) 控制相同，唯一的区别是电压设定值将不在是`motor.volatge_limit` (或 `motor.curren_limit*motor.phase_resistance`)而是`motor.voltage_sensor_align`.



## 使用索引搜索的代码示例

这是一个运动控制程序的例子，它使用编码器作为位置传感器，特别是编码器与 `index` 信号。索引搜索速度设置为3 RAD/s:

```cpp
// index search velocity [rad/s]
motor.velocity_index_search = 3;
```

通过执行索引搜索，电机和位置传感器在 `motor.initFOC()` 中对齐后。电机将以角速度 `2 RAD/s` 开始旋转并保持此值。

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
