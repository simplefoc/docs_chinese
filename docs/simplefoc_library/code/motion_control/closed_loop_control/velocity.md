---
layout: default
title: 速度控制环
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /velocity_loop
nav_order: 2
parent: 闭环运动控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 速度控制环
这个控制回路会以期望速度旋转电机。启用该模式的有:
```cpp
// 设置速度控制环
motor.controller = MotionControlType::velocity;
```
 `motion_control/velocity_motion_control/` 文件夹中的示例可以测试此算法


## 它是如何工作的
速度控制环闭环于力矩控制环外围，无论该力矩控制是哪一种。如果力矩控制是电压模式且没有设置相电阻，那么速度控制会利用Uq来设定力矩命令。

<img src="extras/Images/velocity_loop_v.png" >

如果力矩控制采用的电流模式（DC_current或FOC_current）或者是设置了相电阻的电压模式，那么速度控制会设置目标值为电流iq。

<img src="extras/Images/velocity_loop_i.png" >

速度控制是通过在力矩控制环中加入速度PID控制器实现的。PID控制器读取电机速度v，滤波为v<sub>f</sub>，并设置目标力矩（电压Uq或电流iq）到力矩控制环，以达到并保持用户设定的期望速度v<sub>d</sub>。

## 控制器参数
要调整这个控制环，你可以设置角度PID控制器和速度测量低通滤波器的参数。
``` cpp
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

// 设置限制
// 电压限制
motor.voltage_limit = 10; // Volts - 默认为驱动器电压极限
// 电流限制 
motor.current_limit = 2; // Amps - 默认为0.2Amps
```
 PID控制器的参数为比例增益 `P`、积分增益 `I`、微分增益 `D` 和 `output_ramp`。

- 通常，通过提高比例增益 `P` ，你的电机控制器反应会更灵敏，但太高会导致不稳定。设置为 `0`会禁用控制器的比例增益。
- 同样地积分增益 `I` 越高，电机对干扰的反应就越快，但过大的值同样会导致不稳定。设置为 `0` 将禁用控制器的积分增益。
- 微分增益D通常是最难设置的，因此建议将其设置为 `0` ，主要调整 `P` 和 `I` 。一旦它们调好了但有过充，就添加一点 `D` 分量来抵消。
- `output_ramp` 旨在减少发送给电机的电压值的最大变化。该值越高，Pl控制器更改Ua值的速度就越快。相反越低，变化就越小，控制器的响应就越慢。这个参数的值设置为 `Volts per second[V/s` 或者换句话说控制器在一个时间单位可以提高多少伏的电压。假如你设置你的 `voltage_ramp` 值为10 V/s，并且`loop()`平均每1ms运行一次，那么你的控制器将能够改变 <i>U<sub>q</sub></i> 的值每次`10[V/s]*0.001[s] = 0.01V` ，这不是很多。

此外，为了速度测量更平滑，Simple FOC 库 实现了速度低通滤波器。[低通滤波器](https://en.wikipedia.org/wiki/Low-pass_filter) 是信号平滑的标准形式，它只有一个参数-滤波时间常数 `Tf`。
- 当该值越低，过滤器的影响越小。如果你把 `Tf` 换成 `0` 那就基本上完全去掉了过滤器。确切`Tf`值很难预先猜测，但Tf值的范围一般在 `0` 到 `0.5` 秒之间。

如果出于某种原因，你希望限制发送到你的电机的电压，则需要使用 `voltage_limit` 。

为了获得最佳性能，我们将对参数进行一些调整。 😁

有关此方法的更多理论和源代码文档，请查看 [digging deeper section](digging_deeper).

## 速度运动控制实例

这里是一个基本的例子，速度运动控制与电压模式转矩控制与完整的配置。该计划将设定目标速度为`2 RAD/s` 并保持它(抵抗干扰)。

```cpp
#include <SimpleFOC.h>

// 电机实例
BLDCMotor motor = BLDCMotor( pole_pairs , phase_resistance );
// 驱动器实例
BLDCDriver3PWM driver = BLDCDriver3PWM(pwmA, pwmB, pwmC, enable);

// 磁传感器实例
MagneticSensorSPI AS5x4x = MagneticSensorSPI(chip_select, 14, 0x3FFF);

void setup() {
 
  // 初始化磁传感器硬件
  AS5x4x.init();
  // 连接电机和传感器
  motor.linkSensor(&AS5x4x);

  // 配置驱动器
  driver.init();
  motor.linkDriver(&driver);

  // 设置运动控制环
  motor.controller = MotionControlType::velocity;

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

  // 由于相电阻已给定，因此我们设置电流限制而非电压限制
  // 默认为0.2
  motor.current_limit = 1; // Amps

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

// 速度设置点变量
float target_velocity = 2; // 2Rad/s ~ 20rpm

void loop() {
  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
  motor.move(target_velocity);
}
```

## 工程实例
这里是一个项目的例子，它使用位置控制，并描述了full hardware + software setup设置


<div class="image_icon width30">
    <a href="velocity_control_example">
        <img src="extras/Images/uno_l6234_velocity.jpg"  >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
<div class="image_icon width30">
    <a href="gimbal_velocity_example">
        <img src="extras/Images/hmbgc_v22_velocity_control.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

在[example projects](example_projects) 部分中可以找到更多项目。