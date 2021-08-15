---
layout: default
title: Torque Control
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /voltage_loop
nav_order: 1
parent: Closed-Loop Motion control
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 转矩控制回路

<span class="simple">Simple<span class="foc">FOC</span>library</span> 让你选择使用3种不同的转矩控制策略:

- [Voltage mode](voltage_torque_mode) - `voltage`
- [DC current mode](dc_current_torque_mode) - `dc_current`
- [FOC current mode](foc_current_torque_mode) - `foc_current`

在短电压**voltage control mode**是最简单的近似电机扭矩控制，它是基本的，可以运行在任何电机+驱动器+mcu组合里。**DC current mode** 是电机转矩近似的下一步，它比电压模式更精确，但需要电流传感和更强大的微控制器。**FOC current mode** 是控制电机真正的扭矩，它不是一个近似值，它还需要电流传感器，甚至比直流电流模式更多的处理能力。参见 [torque mode docs](torque_mode)文档中的深入解释。

将控制器 `controller` 参数设置为:

```cpp
// torque control loop
motor.controller = MotionControlType::torque;
```

如果采用电压控制方式，如果用户不向电机提供相阻参数，则转矩控制回路的输入为目标电压 <i>U<sub>q</sub></i>：

<a name="foc_image"></a><img src="extras/Images/torque_loop_v.png">

如果采用一种基于电流的转矩控制模式(DC电流或FOC电流)，则控制回路中的输入将是目标电流<i>i<sub>q</sub></i>。如果用户向电机类提供相电阻值，则在电压模式下也是如此。

<a name="foc_image"></a><img src="extras/Images/torque_loop_i.png">

力矩控制回路是所有其他运动控制回路的基础。想了解有关蓝色框内容的更多信息，请查看 [torque mode docs](torque_mode)。

## 配置参数
根据你希望使用的扭矩控制类型，你需要考虑不同的参数。
- [Voltage mode](voltage_mode)  - 最简单的一个-没有参数，除了可能 `motor.phase_resistance`
- [DC current mode](dc_current_torque_mode) - 1xPID controller + 1xLPF
- [FOC current mode](foc_current_torque_mode) - 2xPID controller + 2xLPF filters 

现在，让我们来看一个例子！

## 电压控制的例子
你可以通过运行 `voltage_control.ino`.这个示例来测试这个算法。

在这里，我们提供了一个例子的扭矩使用电压控制程序与全运动控制配置。程序使用FOC算法给电机设定目标 <i>U<sub>q</sub></i>  2V电压。由于相位电阻参数不可用，电机目标将以伏特为单位。

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

  Serial.println(F("Motor ready."));
  Serial.println(F("Target voltage is 2V"));
  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(2);
}
```

如果我们将pahse resitance添加到 `BLDCMotor` 的构造函数中，电机目标将以Amps为单位。
```cpp
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11, 12.34); // 12.34 Ohms
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

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

  Serial.println(F("Motor ready."));
  Serial.println(F("Target current is 0.5Amps"));
  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(0.5);
}
```

## 工程实例
这里是一个项目的例子，它使用位置控制，并描述了full hardware + software setup设置

<div class="image_icon width30">
    <a href="simplefoc_pendulum">
        <img src="extras/Images/foc_pendulum.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

在[example projects](example_projects) 部分中可以找到更多项目。