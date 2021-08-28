---
layout: default
title:  Nucleo-64步进电机控制实例
parent: 实例项目
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

// 步进电机实例
StepperMotor motor = StepperMotor(50);
// 步进驱动实例
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9, 10,  8, 7);

// 编码器实例
Encoder encoder = Encoder(A1, A2, 2048);
// 通道A和B回调
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}



// commander 接口
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // 初始化编码器传感器硬件
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // 将电机连接到传感器上
  motor.linkSensor(&encoder);

  // 选择FOC调制
  motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 将电机连接到传感器上
  motor.linkDriver(&driver);

  // 设置要使用的控制回路类型
  motor.controller = MotionControlType::torque;

  // 根据控制配置控制器
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  motor.PID_velocity.D = 0;
  // 默认电压电源
  motor.voltage_limit = 12;

  // 速度低通滤波时间常数
  motor.LPF_velocity.Tf = 0.01;

  // 角环控制器
  motor.P_angle.P = 20;
  // 角开环速度极限
  motor.velocity_limit = 50;

  // 使用串行监控电机初始化
  // 监控端口
  Serial.begin(115200);
  // 如果不需要注释掉
  motor.useMonitoring(Serial);

  // 初始化电机
  motor.init();
  // 校准编码器并启动FOC
  motor.initFOC();

  // 设置初始目标值
  motor.target = 2;

  // 定义电机id
  command.add('M', onMotor, "motor");

  // 运行用户命令来配置和电机(在docs.simplefoc.com中找到完整的命令列表)
  Serial.println(F("Motor commands sketch | Initial motion control > torque/voltage : target 2V."));
  
  _delay(1000);
}


void loop() {
  // 迭代设定FOC相位电压
  motor.loopFOC();

  // 设定外循环目标的迭代函数
  // 速度、位置或电压
  // 如果参数中没有设定目标，则使用 motor.target 变量
  motor.move();

  // 用户沟通
  command.run();
}
```

