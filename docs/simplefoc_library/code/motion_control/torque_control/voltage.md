---
layout: default
title: Voltage Mode
parent: Torque Mode
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /voltage_torque_mode
nav_order: 1
---

# 电压转矩控制
这种转矩控制方法允许你运行无刷直流电机，因为它是简单的直流电机，你设置目标电压 <i>U<sub>q</sub></i> 将被设置到电机和FOC算法计算所需的相电压 <i>u<sub>a</sub></i> ,<i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> ，以平稳运行。启用此模式的是

```cpp
// voltage torque control mode
motor.torque_controller = TorqueControlType::voltage;
```
## 它到底是如何工作的
 <a name="foc_image"></a><img src="extras/Images/voltage_loop.png" class="width40">

电压控制算法从位置传感器读取角度 <i>a</i> ，从用户获得目标 <i>U<sub>q</sub></i>电压值，并使用FOC算法设置适当的 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 电压到电机。FOC算法确保这些电压产生的磁力恰好与电机转子的永磁场偏移 <i>90 degree</i> ，这保证了最大转矩，这称为换向。

假设电机产生的转矩与 <i>U<sub>q</sub></i> 设定的用户电压成正比。最大转矩对应于可用电源电压条件下的最大 <i>U<sub>q</sub></i>，最小转矩当然为对于<i>U<sub>q</sub></i> = 0。

如果用户提供电机的相电阻值，用户可以设置所需的电流 <i>I<sub>d</sub></i> ，库将自动计算出合适的电压 <i>U<sub>q</sub></i>。例如，下面这个可以通过构造函数来完成：

```cpp
// BLDCMotor(pole pair number, phase resistance)
BLDCMotor motor = BLDCMotor( 11, 2.5 );
```
或者只是设置参数:
```cpp
motor.phase_resistance = 2.5; // ex. 2.5 Ohms
```

<a name="foc_image"></a><img src="extras/Images/voltage_mode.png" class="width50">

<blockquote class="warning">
⚠️ 在某些情况下，电动机中产生的电流可能比所需的电流高<i>I<sub>d</sub></i> 但数量级应该是保持不变。
</blockquote>


关于转矩控制理论的更多信息，请查看 [Digging deeper section](digging_deeper) •或者直接去 [torque control theory](voltage_torque_control).

## 配置参数
这个控制回路是非常基本的它没有任何配置参数。

## 转矩控制示例代码
一个简单的例子，基于电压的转矩控制和设定目标 **current** 的串行命令界面。

```cpp
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.variable(&motor.target, cmd); }

void setup() { 
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // set the torque control type
  motor.phase_resistance = 12.5; // 12.5 Ohms
  motor.torque_controller = TorqueControlType::voltage;
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target current");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target current using serial terminal:"));
  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();

  // user communication
  command.run();
}
```