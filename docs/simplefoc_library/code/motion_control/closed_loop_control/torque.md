---
layout: default
title: 力矩控制环
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /voltage_loop
nav_order: 1
parent: 闭环运动控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 力矩控制环

<span class="simple">Simple<span class="foc">FOC</span>library</span> 让你选择使用3种不同的力矩控制策略:

- [电压——力矩控制模式](voltage_torque_mode) - `voltage`
- [直流电流——力矩控制模式](dc_current_torque_mode) - `dc_current`
- [FOC电流——力矩控制模式](foc_current_torque_mode) - `foc_current`

简单来说，**voltage control mode**是最简单的接近电机力矩控制的方法。它基本在任何电机+驱动器+mcu的组合中运行。**DC current mode** 是**voltage control mode**的更进一步，它比**voltage control mode**更精确，但需要电流传感和更强大的mcu。**FOC current mode** 是真正的电机力矩控制方法，不同于前两者的“近似”，因此也需要电流传感器，也比**DC current mode**对MCU的处理能力有更高的要求。参见 [torque mode docs](torque_mode)文档中的深入解释。

通过 `controller` 设置运动控制模式的参数:

```cpp
// 力矩控制环
motor.controller = MotionControlType::torque;
```

如果采用电压控制模式，而用户不向电机提供相电阻阻值，则力矩控制环的输入为目标电压 <i>U<sub>q</sub></i>：

<a name="foc_image"></a><img src="extras/Images/torque_loop_v.png">

如果采用电流控制模式(DC电流或FOC电流)，则控制环中的输入则为目标电流<i>i<sub>q</sub></i>。另外如果用户向电机提供相电阻阻值，则在电压模式下输入也为目标电流<i>i<sub>q</sub></i>。

<a name="foc_image"></a><img src="extras/Images/torque_loop_i.png">

力矩控制环是所有其他运动控制环的基础。想了解有关蓝色框内容的更多信息，请查看 [torque mode docs](torque_mode)。

## 配置参数
根据希望使用的力矩控制类型，你需要考虑不同的参数。
- [Voltage mode](voltage_mode)  - 最简单。无需参数，或者是 `motor.phase_resistance`
- [DC current mode](dc_current_torque_mode) - PID控制器x1 + 低通滤波器x1
- [FOC current mode](foc_current_torque_mode) - PID控制器x2 + 低通滤波器x2

现在，让我们看个例程

## 电压控制例程
你可以通过运行 `voltage_control.ino`.这个例程来测试算法。

下面是一个利用电压实现的力矩控制以及完整的运动控制配置例程。该例程使用了FOC算法，设置了2v的目标电压U<sub>q</sub>。由于没有设置相电阻的阻值，则该电机的目标为电压，即单位为v。

```cpp
#include <SimpleFOC.h>

// 无刷直流电机及驱动器实例
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 编码器实例
Encoder encoder = Encoder(2, 3, 500);
// 回调通道A和B
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

void setup() { 
  
  // 初始化编码传感器硬件
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // 连接电机和传感器
  motor.linkSensor(&encoder);

  // 配置驱动器
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接驱动器
  motor.linkDriver(&driver);

  // 设置力矩控制类型
  motor.torque_controller = TorqueControlType::voltage;
  // 设置运动控制环
  motor.controller = MotionControlType::torque;

  // 使用串口监视
  Serial.begin(115200);
  // 如果不需要，可以注释掉此行
  motor.useMonitoring(Serial);

  // 初始化电机
  motor.init();
  // 校准编码器，启用FOC
  motor.initFOC();

  Serial.println(F("Motor ready."));
  Serial.println(F("Target voltage is 2V"));
  _delay(1000);
}

void loop() {

  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
  motor.move(2);
}
```

如果再BLDC的构造函数上设置了相电阻，那么电机的目标为电流，即单位为A。

```cpp
#include <SimpleFOC.h>

// 无刷直流电机及驱动器实例
BLDCMotor motor = BLDCMotor(11, 12.34); // 12.34 Ohms
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 编码器实例
Encoder encoder = Encoder(2, 3, 500);
// 回调通道A和B
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

void setup() { 
  
  // 初始化编码传感器硬件
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // 连接电机和传感器
  motor.linkSensor(&encoder);

  // 配置驱动器
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接驱动器
  motor.linkDriver(&driver);

  // 设置力矩控制类型
  motor.torque_controller = TorqueControlType::voltage;
  // 设置运动控制环
  motor.controller = MotionControlType::torque;

  // 使用串口监视
  Serial.begin(115200);
  // 如果不需要，可以注释掉此行
  motor.useMonitoring(Serial);

  // 初始化电机
  motor.init();
  // 校准编码器，启用FOC
  motor.initFOC();

  Serial.println(F("Motor ready."));
  Serial.println(F("Target current is 0.5Amps"));
  _delay(1000);
}

void loop() {

  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
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