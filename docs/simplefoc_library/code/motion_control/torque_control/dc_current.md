---
layout: default
title: 基于直流电流
permalink: /dc_current_torque_mode
nav_order: 2 
parent: 力矩控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."

---

# 基于直流电流的力矩控制
这个控制环能够像直流电机那样控制直流无刷电机。这种力矩控制算法需要电流检测硬件的支持。用户设置的目标电流<i>I<sub>d</sub></i>用于FOC算法计算出所需维持的相电压<i>u<sub>a</sub></i> ,<i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 。该模式设置如下：

```cpp
// 直流电流力矩控制模式
motor.torque_controller = TorqueControlType::dc_current;
```

## 它到底是如何工作的？
 <a name="foc_image"></a><img src="extras/Images/dc_current_mode.png">

直流电流力矩控制算法读取无刷直流电机的相电流(通常是<i>i<sub>a</sub></i> 和 <i>i<sub>b</sub></i>)。

此外，该算法从位置传感器读取角度 <i>a</i>。 相电流通过逆Clarke和简化的Park变换转换为直流电流i<sub>DC</sub>。而后，PID控制器利用目标电流I<sub>d</sub>和测量电流i<sub>DC</sub>计算出相应的设置到电机的电压值U<sub>q</sub>，而U<sub>d</sub>始终保持为0。最后，FOC对电机设置相应的<i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> 和 <i>u<sub>c</sub></i> 。FOC会确保这些电压产生的磁力恰好与电机转子的永磁场保持<i>90度</i>偏移，从而保证了最大力矩，这称为换向。

这种力矩控制模式是假设在电机的力矩是和电机的直流电流i<sub>DC</sub>成比例的（i<sub>DC</sub>=i<sub>q</sub>），因此可以通过控制电流来实现力矩的控制。但是这种假设仅限于低速的情况，在高速情况下，i<sub>d</sub>分量会变得很高，致使i<sub>DC</sub>=i<sub>q</sub>就不成立了。

## 配置参数
为了可以平稳运行，用户需要配置PID控制器`PID_current_q`参数和低通滤波器`LPF_current_q`时间常数。

```cpp
// PID参数 - 默认
motor.PID_current_q.P = 5;                       // 3    - Arduino UNO/MEGA
motor.PID_current_q.I = 1000;                    // 300  - Arduino UNO/MEGA
motor.PID_current_q.D = 0;
motor.PID_current_q.limit = motor.voltage_limit; 
motor.PID_current_q.ramp = 1e6;                  // 1000 - Arduino UNO/MEGA
// 低通滤波器 - 默认
LPF_current_q.Tf= 0.005;                         // 0.01 - Arduino UNO/MEGA
```



## 力矩控制示例代码

下面是一个简单的利用了在线电流检测的基于直流电流的力矩控制，可以在串行的commander接口设定目标值。

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

// 电流检测
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

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

  // 电流检测初始化硬件
  current_sense.init();
  // 连接电流检测器和电机
  motor.linkCurrentSense(&current_sense);

  // 设置力矩模式：
  motor.torque_controller = TorqueControlType::dc_current; 
  // 设置运动控制环
  motor.controller = MotionControlType::torque;

  // 电流控制参数 (Arduino UNO/Mega)
  motor.PID_current_q.P = 5;
  motor.PID_current_q.I= 300;
  motor.LPF_current_q.Tf = 0.01; 

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