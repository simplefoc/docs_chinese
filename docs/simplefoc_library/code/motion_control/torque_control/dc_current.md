---
layout: default
title: DC Current Mode
permalink: /dc_current_torque_mode
nav_order: 2 
parent: Torque Mode
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
---

# 转矩控制采用直流电流
这个控制回路允许你运行BLDC motor，因为它是一个电流控制DC motor。这种力矩控制算法需要电流传感硬件。用户将目标电流<i>I<sub>d</sub></i>设置为FOC算法计算所需的相电压<i>u<sub>a</sub></i> ,<i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> ，以维持它。启用该模式的有:

```cpp
// DC current torque control mode
motor.torque_controller = TorqueControlType::dc_current;
```

## 它到底是如何工作的？
 <a name="foc_image"></a><img src="extras/Images/dc_current_mode.png">

直流电流转矩控制算法读取无刷直流电机的相电流(通常是<i>i<sub>a</sub></i> 和 <i>i<sub>b</sub></i>)。

此外，该算法从位置传感器读取转子角度 <i>a</i>。 <i>i<sub>DC</sub></i>电流通过克拉克和帕克(简化)逆变换转换为直流电流。使用目标电流值<i>I<sub>d</sub></i>和测量的 <i>i<sub>DC</sub></i> PID 控制器计算适当的电压<i>U<sub>q</sub></i> 要设置到电机，<i>U<sub>d</sub></i> 保持在 0。最后FOC算法设置适当的<i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 电压到电机。FOC算法确保这些电压产生的磁力恰好与电机转子的永磁场偏移<i>90 degree</i>，这保证了最大转矩，这称为换向。

这种转矩控制模式的假设是电机中产生的转矩与电机所绘制的 <i>i<sub>DC</sub></i> 直流电流成比例(<i>i<sub>DC</sub></i> = <i>i<sub>q</sub></i>)。因此，通过控制该电流，用户可以控制转矩值。这个假设只有在低速时才成立，对于较高的速度，当前的<i>i<sub>d</sub></i>分量会变得更高， <i>i<sub>DC</sub></i>=<i>i<sub>q</sub></i>不再成立。

## 配置参数
为了使该循环平稳运行，用户需要配置PID控制器参数`PID_current_q`和低通滤波器`LPF_current_q`时间常数。

```cpp
// PID parameters - default 
motor.PID_current_q.P = 5;                       // 3    - Arduino UNO/MEGA
motor.PID_current_q.I = 1000;                    // 300  - Arduino UNO/MEGA
motor.PID_current_q.D = 0;
motor.PID_current_q.limit = motor.voltage_limit; 
motor.PID_current_q.ramp = 1e6;                  // 1000 - Arduino UNO/MEGA
// Low pass filtering - default 
LPF_current_q.Tf= 0.005;                         // 0.01 - Arduino UNO/MEGA
```



## 转矩控制示例代码

一个简单的例子，基于直流电流的扭矩控制，使用内联电流传感器和设置目标值的串行命令接口。

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
  motor.torque_controller = TorqueControlType::dc_current; 
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // foc current control parameters (Arduino UNO/Mega)
  motor.PID_current_q.P = 5;
  motor.PID_current_q.I= 300;
  motor.LPF_current_q.Tf = 0.01; 

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