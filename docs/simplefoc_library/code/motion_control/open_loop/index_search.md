---
layout: default
title: 索引搜索程序
nav_order: 3
permalink: /index_search_loop
parent: 开环运动控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 索引搜索程序
只有当`Encoder` 的构造函数提供了索引引脚时，才能执行索引搜索程序。该程序首先使电机恒定转速运动，而后便进行索引引脚的搜索。要设置电机的转速，可以修改参数：

```cpp
// 索引搜索速度 - 默认为1rad/s
motor.velocity_index_search = 2;
```
索引搜索会在`motor.initFOC()`函数中执行。

该程序的速度控制环实际上与 [开环速度](/velocity_loop) 控制相同，唯一的区别是电压设定值将不在是`motor.volatge_limit` (或 `motor.curren_limit*motor.phase_resistance`)而是`motor.voltage_sensor_align`.



## 使用索引搜索的代码示例

这是一个运动控制的例程，它使用编码器作为位置传感器，特别是带索引的编码器。索引搜索速度设置为`3 RAD/s`:

```cpp
// 索引搜索速度 [rad/s]
motor.velocity_index_search = 3;
```

在 `motor.initFOC()`中通过索引搜索对齐电机和位置传感器后，电机将以角速度 `2 RAD/s` 开始旋转并保持此速度。

```cpp
#include <SimpleFOC.h>

// 电机实例
BLDCMotor motor = BLDCMotor(11);
// 驱动器实例
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);

// 编码器实例
Encoder encoder = Encoder(2, 3, 500, A0);
// 回调通道A和B
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
void doIndex(){encoder.handleIndex();}


void setup() {
  
  // 初始化编码传感器硬件
  encoder.init();
  encoder.enableInterrupts(doA, doB,doIndex); 

  // 连接电机和传感器
  motor.linkSensor(&encoder);

  // 配置驱动器
  driver.init();
  motor.linkDriver(&driver);

  // 索引搜索速度 [rad/s]
  motor.velocity_index_search = 3; // rad/s
  motor.voltage_sensor_align = 4; // Volts

  // 设置运动控制环
  motor.controller = MotionControlType::velocity;

  // 配置控制器
  // 默认参数见defaults.h

  // 速度PI控制器参数
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  // 默认为电源电压
  motor.voltage_limit = 6;
  // 基于斜坡电压的急动控制
  // 默认值为300v/s，即0.3v/ms
  motor.PID_velocity.output_ramp = 1000;
 
  // 速度低通滤波时间常数
  motor.LPF_velocity.Tf = 0.01;


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

// 角度设置点变量
float target_velocity = 2;

void loop() {
  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
  motor.move(target_velocity);

}

```
