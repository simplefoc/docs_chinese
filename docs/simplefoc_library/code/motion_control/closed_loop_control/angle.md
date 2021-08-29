---
layout: default
title: 位置控制环
description: "Arduino Simple Field Oriented Control (FOC) library 。"
nav_order: 3
permalink: /angle_loop
parent: 闭环运动控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 位置控制环
这个控制回路可以让你实时调整电机到所需的角度。启用该模式:
```cpp
// 设置角度/位置控制环
motor.controller = MotionControlType::angle;
```
你可以通过运行 `motion_control/position_motion_control/`文件夹中的示例来测试这个算法。

## 它是如何工作的?

角度/位置控制环闭环于速度控制环外围。而速度控制环闭环于力矩控制环外围，无论该力矩控制是哪一种。如果力矩控制是电压模式且没有设置相电阻，那么速度控制会利用U<sub>q</sub>来设定力矩命令。

<img src="extras/Images/angle_loop_v.png">

如果力矩控制采用的电流模式（DC_current或FOC_current）或者是设置了相电阻的电压模式，那么速度控制会设置目标值为电流i<sub>q</sub>。

<img src="extras/Images/angle_loop_i.png">

因此，角度控制环是通过在速度控制换上增加一个级联控制环来实现的。该控制环通过在增加PID控制器以及低通滤波器实现闭环。控制器读取电机（或滤波器的输出）的角度，进而决定电机以怎样的速度v<sub>d</sub>来到达所期望的位置a<sub>d</sub>。然后速度控制环读取当前滤波后的速度v<sub>f</sub>，并设置所能达到目标速度v<sub>d</sub>的力矩（电压U<sub>q</sub>或电流i<sub>q</sub>）到力矩控制环。

> wait to modify



## 控制器参数
要调整这个控制环，你可以设置参数的第一速度PID控制器，低通滤波器和约束，
``` cpp
// 速度PID控制器参数
// 默认P=0.5 I=10 D=0
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;
// 基于斜坡电压的急动控制
// 默认值为300v/s，即0.3v/ms
motor.PID_velocity.output_ramp = 1000;

// 速度低通滤波器
// 默认为5ms - 可以不断尝试，获取最佳数值
// 数值越低，滤波频率越小
motor.LPF_velocity.Tf = 0.01;

// 设置限制
// 电压限制
motor.voltage_limit = 10; // Volts - 默认为驱动器电压限制
// 电流限制
motor.current_limit = 2; // Amps - 默认为0.2Amps
```
然后对角度PID 控制器、低通滤波器和约束:

```cpp
// 角度PID控制器
// 默认P=20
motor.P_angle.P = 20; 
motor.P_angle.I = 0;  // 仅需使用P控制器
motor.P_angle.D = 0;  // 仅需使用P控制器
// 基于斜坡输出的加速控制
// 此变量单位为rad/s^2，用于限制加速极限
motor.P_angle.output_ramp = 10000; // 默认为1e6 rad/s^2

// 角度低通滤波器
// 默认为0 - 禁用
// 仅用于噪音极大的位置传感器 - 尽量避免使用并使其保持在较小数值
motor.LPF_angle.Tf = 0; // 默认为0

// 设置限制
// 位置控制的最大速度
motor.velocity_limit = 4; // rad/s - 默认为20
```
为达到最佳性能，调整好速度 PID 和角度 PID 控制器的参数非常重要。速度PID控制器通过更新结构体 `motor.PID_velocity`的参数实现调整，例如 [速度控制回路](velocity_loop)。 

- 一般的规律应该是降低比例增益 `P` ，减少振动。
- 可能不需要接触 `I` 或 `D` 值。
  

 角度PID控制器通过调节结构体 `motor.P_angle`的参数。
- 在大多数应用中，只需一个简单的 `P` 控制器就足够了(`I=D=0`)
- 比例增益 `P` 会令响应更灵敏，但过高会因为不稳定并引起振动。
- `output_ramp` 值等于加速度极限-默认值接近无穷大，有需要就设置相应值。

对于角度控制，你也可以看到速度低通滤波器的影响。
- 从速度控制到角度控制， `LPF_velocity.Tf` 值变化不大。所以如果你调整过速度环的话，保持原样即可。
- `LPF_angle.Tf` 在大多数情况下等于0，表示禁用。

此外，你可以配置控制器的 `velocity_limit` 值，以防止控制器将电机的速度 <i>v<sub>d</sub></i> 设置得过高。

- 如果把 `velocity_limit` 设得非常低，电机会以这个速度在所期望的位置之间转动。
- 如果你保持高值，你甚至不会注意到这个变量的存在。 😃 

最后，每个应用程序都有一点不同，你可能需要对控制器值进行一些调优，以达到所需的行为。

有关此方法的更多理论和源代码文档，请查看 [digging deeper section](digging_deeper)。

## 位置控制示例代码

这是一个非常基础的基于电压力矩的位置运动控制程序的完整配置例程。当运行此代码时，电机将在角度`-1 RAD`和`1 RAD`之间每 `1 秒`移动。

```cpp
#include <SimpleFOC.h>

// 电机实例
BLDCMotor motor = BLDCMotor(11);
// 驱动器实例
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);

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
  driver.init();
  motor.linkDriver(&driver);

  // 设置运动控制环
  motor.controller = MotionControlType::angle;

  // 配置控制器
  // 默认参数见defaults.h

  // 基于控制类型配置控制器
  // 速度PID控制器参数
  // 默认P=0.5 I=10 D=0
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  motor.PID_velocity.D = 0.001;
  // 基于斜坡电压的急动控制
  // 默认值为300v/s，即0.3v/ms
  motor.PID_velocity.output_ramp = 1000;

  // 速度低通滤波器
  // 默认为5ms - 可以不断尝试，获取最佳数值
  // 数值越低，滤波频率越小
  motor.LPF_velocity.Tf = 0.01;

  // 角度P控制器 - 默认为P=20
  motor.P_angle.P = 20;

  // 位置控制的速度极限
  // 默认 20
  motor.velocity_limit = 4;
  // 默认为电源电压
  motor.voltage_limit = 10;

  // 监视串口
  Serial.begin(115200);
  // 如果不需要，可以注释掉此行
  motor.useMonitoring(Serial);
  
  // 初始化电机
  motor.init();
  // 校准编码器，启用FOC
  motor.initFOC();


  Serial.println("Motor ready.");
  _delay(1000);
}

// 角度设定点变量
float target_angle = 1;
// 改变方向时间戳
long timestamp_us = _micros();

void loop() {

  // 每秒
  if(_micros() - timestamp_us > 1e6) {
      timestamp_us = _micros();
      // 调换角度
      target_angle = -target_angle;   
  }

  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
  motor.move(target_angle);
}
```


## 工程实例
这里是一个项目的例子，它使用位置控制，并描述了full hardware + software setup设置

<div class="image_icon width30">
    <a href="position_control_example">
        <img src="extras/Images/position_control_example.jpg">
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
在[example projects](example_projects) 部分中可以找到更多项目。