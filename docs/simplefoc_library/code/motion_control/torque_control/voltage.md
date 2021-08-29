---
layout: default
title: 基于电压
parent: 力矩控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /voltage_torque_mode
nav_order: 1
---

# 基于电压的力矩控制

基于电压的力矩控制能够像直流电机那样控制直流无刷电机，即设置目标电压U<sub>q</sub>，然后FOC算法计算出所需的相电压u<sub>a</sub>，u<sub>b</sub>和u<sub>c</sub>达到顺滑控制效果。该模式设置如下：

```cpp
// 基于电压的力矩控制模式
motor.torque_controller = TorqueControlType::voltage;
```
## 它到底是如何工作的
 <a name="foc_image"></a><img src="extras/Images/voltage_loop.png" class="width40">

基于电压控制的算法从位置传感器读取角度 <i>a</i> ，从用户中获得目标电压值 <i>U<sub>q</sub></i>，然后用FOC算法设置适当的 <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 电压到电机。FOC算法确保这些电压产生的磁力恰好与电机转子的永磁场偏移 <i>90度</i> ，从而保证了最大力矩，这称为换向。

假设电机产生的力矩与设定电压 <i>U<sub>q</sub></i> 成正比，也就是说最大力矩与<i>U<sub>q</sub></i> 有关，而这个<i>U<sub>q</sub></i> 则受到供电电压的限制。最小力矩当然即<i>U<sub>q</sub></i> = 0。

如果用户设置了电机的相电阻值，那么用户就可以设置期望电流 <i>I<sub>d</sub></i> ，而后库会自动计算出相应的目标电压 <i>U<sub>q</sub></i>。例如，下面这个可以通过构造函数来完成：

```cpp
// BLDCMotor(pole pair number极对数, phase resistance相电阻)
BLDCMotor motor = BLDCMotor( 11, 2.5 );
```
或者单纯通过设置参数:
```cpp
motor.phase_resistance = 2.5; // 如：2.5 Ohms
```

<a name="foc_image"></a><img src="extras/Images/voltage_mode.png" class="width50">

<blockquote class="warning">
⚠️ 在某些情况下，电动机中产生的电流可能比所需的电流高<i>I<sub>d</sub></i> 但数量级应该是保持不变。
</blockquote>


关于力矩控制理论的更多信息，请查看 [Digging deeper section](digging_deeper) 或者直接去 [torque control theory](voltage_torque_control).

## 配置参数
这个控制环基本无需任何配置参数。

## 力矩控制示例代码
下面是一个简单的基于电压的力矩控制，可以在串行的commander接口设定目标 **current** 。

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

// commander实例化
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.variable(&motor.target, cmd); }

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

  // 设置力矩控制类型：
  motor.phase_resistance = 12.5; // 12.5 Ohms
  motor.torque_controller = TorqueControlType::voltage;
  // 设置运动控制环
  motor.controller = MotionControlType::torque;

  // 监视串口
  Serial.begin(115200);
  // 如果不需要，可以注释掉此行
  motor.useMonitoring(Serial);

  // 初始化电机
  motor.init();
  // 校准编码器，启用FOC
  motor.initFOC();

  // 添加目标命令T
  command.add('T', doTarget, "target current");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target current using serial terminal:"));
  _delay(1000);
}

void loop() {

  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
  motor.move();

  // 用户通信
  command.run();
}
```