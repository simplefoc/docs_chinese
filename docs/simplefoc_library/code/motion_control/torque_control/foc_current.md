---
layout: default
title: FOC Current Mode
parent: Torque Mode
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /foc_current_torque_mode
nav_order: 3 
---

# 使用FOC电流进行扭矩控制
这种转矩控制模式允许你对无刷直流电机进行真正的转矩控制，它需要电流传感来做到这一点。用户设置目标电流 <i>I<sub>d</sub></i> 为FOC算法计算所需的相电压 <i>u<sub>a</sub></i> ,<i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> ，以便通过测量相电流(<i>i<sub>a</sub></i>, <i>i<sub>b</sub></i> 和 <i>i<sub>c</sub></i>)和转子角 <i>a</i>来维持它。这种模式是通过以下方式实现的:

```cpp
// FOC current torque control mode
motor.torque_controller = TorqueControlType::foc_current;
```

## 它到底是如何工作的
 <a name="foc_image"></a><img src="extras/Images/foc_current_mode.png">

FOC电流转矩控制算法读取无刷直流电机(通常为<i>i<sub>a</sub></i> 和 <i>i<sub>b</sub></i>)的相电流。此外，该算法从位置传感器读取转子角度 <i>a</i> 。采用 克拉克逆变 和 帕克变换 将相电流转换为 `d` 电流 <i>i<sub>d</sub></i> 和 `q` 电流 <i>i<sub>q</sub></i> 。 使用目标电流值 <i>I<sub>d</sub></i> 和测量电流 <i>i<sub>q</sub></i> 和 <i>i<sub>d</sub></i>, PID控制器为每个轴计算适当的电压 <i>U<sub>q</sub></i> 和 <i>U<sub>d</sub></i>设置到电机，保持 <i>i<sub>q</sub></i>=<i>I<sub>d</sub></i> 和<i>i<sub>d</sub></i>=0。最后使用 帕克+克拉克 (或者 空间矢量) 变换 FOC 算法设置适当的 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 电压到电机。通过测量相电流，这种转矩控制算法确保这些电压在电机转子中产生适当的电流和磁力，与它的永久磁场正好 <i>90 °</i>，这保证了最大的转矩，这被称为换向。



电机产生的转矩与 q-axis电流 <i>i<sub>q</sub></i>成比例，使这种转矩控制模式成为无刷直流电动机的 *true torque control* 。

## 配置参数
为了使该循环平稳运行，用户需要配置 PID 控制器参数的 `PID_current_q` 和低通滤波器 `LPF_current_q` 时间常数。

```cpp
// Q axis
// PID parameters - default 
motor.PID_current_q.P = 5;                       // 3    - Arduino UNO/MEGA
motor.PID_current_q.I = 1000;                    // 300  - Arduino UNO/MEGA
motor.PID_current_q.D = 0;
motor.PID_current_q.limit = motor.voltage_limit; 
motor.PID_current_q.ramp = 1e6;                  // 1000 - Arduino UNO/MEGA
// Low pass filtering - default 
LPF_current_q.Tf= 0.005;                         // 0.01 - Arduino UNO/MEGA

// D axis
// PID parameters - default 
motor.PID_current_d.P = 5;                       // 3    - Arduino UNO/MEGA
motor.PID_current_d.I = 1000;                    // 300  - Arduino UNO/MEGA
motor.PID_current_d.D = 0;
motor.PID_current_d.limit = motor.voltage_limit; 
motor.PID_current_d.ramp = 1e6;                  // 1000 - Arduino UNO/MEGA
// Low pass filtering - default 
LPF_current_d.Tf= 0.005;                         // 0.01 - Arduino UNO/MEGA
```


## 转矩控制示例代码

这是一个简单的例子 FOC 基于电流的扭矩控制，使用内联电流传感器，并通过串口命令界面设置目标值。

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

// current sensor
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

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

  // current sense init hardware
  current_sense.init();
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // set torque mode:
  motor.torque_controller = TorqueControlType::foc_current; 
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // foc current control parameters (Arduino UNO/Mega)
  motor.PID_current_q.P = 5;
  motor.PID_current_q.I= 300;
  motor.PID_current_d.P= 5;
  motor.PID_current_d.I = 300;
  motor.LPF_current_q.Tf = 0.01; 
  motor.LPF_current_d.Tf = 0.01; 

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