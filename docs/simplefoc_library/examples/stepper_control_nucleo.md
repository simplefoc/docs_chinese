---
layout: default
title:  Stepper Motor Control Nucleo-64
parent: Example projects
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 8
permalink: /stepper_control_nucleo
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# 基于L298N和Stm32 Nucleo-64的步进电机控制例程<br>
运行此步进电机控制例程需要用到以下硬件：

 [Stm32 Nucleo-64](https://www.mouser.fr/ProductDetail/STMicroelectronics/NUCLEO-F446RE?qs=%2Fha2pyFaduj0LE%252BzmDN2WNd7nDNNMR7%2Fr%2FThuKnpWrd0IvwHkOHrpg%3D%3D) | [L298N driver](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df) | [AMT 103 encoder（编码器）](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [NEMA 17](https://www.ebay.com/itm/Nema-17-Stepper-Motor-Bipolar-2A-59Ncm-83-6oz-in-48mm-Body-4-lead-3D-Printer-CNC/282285186801?hash=item41b9821ef1:g:7dUAAOSwEzxYSl25) 
 ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ 
 <img src="extras/Images/nucleo.jpg" class="imgtable150">     | <img src="extras/Images/l298n.jpg" class="imgtable150">      | <img src="extras/Images/enc1.png" class="imgtable150">       | <img src="extras/Images/nema17_2.jpg" class="imgtable150">   

# 连接所有硬件

这是 L298N 和 Nucleo-64 的连接范例：

<p><img src="extras/Images/stepper_connection.png" class="img400"></p>
## L298N
- 通道 `ENA` 和 `ENB` 连接到引脚 `7` 和 `8`
- 通道 `IN1`、 `IN2`,、`IN3` 以及 `IN4` 连接到引脚 `5`、 `6`、`9`、 `10`
- 公共地连接于 Nucleo 和 L298N 之间
- 12V电源直接连接到驱动器

## 编码器
- 通道 `A` 和 `B` 连接到 引脚 `A0` 和 `A1` 
- 这个例程中没有用到I引脚，但你可以简单修改例程来支持该通道。

## 电机
- 电机 `A1`相、 `A2`相、 `B1`相和 `B2` 相直接连接到 L298N 芯片的电机连接器。



# 完整 Arduino 代码

```cpp
#include <SimpleFOC.h>

// Stepper motor instance
StepperMotor motor = StepperMotor(50);
// Stepper driver instance
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9, 10,  8, 7);

// encoder instance
Encoder encoder = Encoder(A1, A2, 2048);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}



// commander interface
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // choose FOC modulation
  motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor to the sensor
  motor.linkDriver(&driver);

  // set control loop type to be used
  motor.controller = MotionControlType::torque;

  // controller configuration based on the control type 
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  motor.PID_velocity.D = 0;
  // default voltage_power_supply
  motor.voltage_limit = 12;

  // velocity low pass filtering time constant
  motor.LPF_velocity.Tf = 0.01;

  // angle loop controller
  motor.P_angle.P = 20;
  // angle loop velocity limit
  motor.velocity_limit = 50;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialise motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();

  // set the initial target value
  motor.target = 2;

  // define the motor id
  command.add('M', onMotor, "motor");

  // Run user commands to configure and the motor (find the full command list in docs.simplefoc.com)
  Serial.println(F("Motor commands sketch | Initial motion control > torque/voltage : target 2V."));
  
  _delay(1000);
}


void loop() {
  // iterative setting FOC phase voltage
  motor.loopFOC();

  // iterative function setting the outter loop target
  // velocity, position or voltage
  // if tatget not set in parameter uses motor.target variable
  motor.move();

  // user communication
  command.run();
}
```

