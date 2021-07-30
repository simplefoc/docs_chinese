---
layout: default
title: Writing the code
parent: Getting Started
description: "Writing the Arduino program for your SimpleFOCShield."
nav_order: 3
permalink: /foc_shield_code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
---

# Writing the code（编写代码）
当板子的 [硬件配置](pads_soldering) 完成并且准备好 [连接](foc_shield_connect_hardware)：
- 单片机
- 无刷直流电机
- 位置传感器
- 电源

我们就可以开始最激动人心的部分，编码！

Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 完全由 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 支持，因此请务必安装最新版本的  <span class="simple">Simple<span class="foc">FOC</span>library</span> 。如果您仍然没有自己的库版本，请按照 [安装说明](installation) 操作。

当开始为 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 编写代码时，建议的方法是：

- [测试传感器](#step-1-testing-the-sensor)
- [测试电机](#step-2-testing-the-motor)
- [电压运动控制](#step-3-voltage-motion-control)
- [更复杂的控制策略](#step-4-more-complex-control-strategies) - 位置和速度

## 第 1 步. 测试传感器
首先确保你的传感器正常工作。运行一个专属于你的传感器的库实例。你可以
```sh
utils >
    sensor_test >
            encoder >
             - encoder_example
             - encoder_software_interrupts_example
            magnetic_sensors >
             - magnetic_sensor_i2c_example
             - magnetic_sensor_spi_example
             - magnetic_sensor_analog_example
            hall_sensors >
             - hall_sensor_example
             - hall_sensor_software_interrupts_example
```
当你的传感器读数良好时，你可以继续测试电机和传感器的组合。

<blockquote class="warning"> <p class="heading">更新实例的引脚</p> 
当测试传感器时，确保更新你在 <a href="pads_soldering">硬件配置</a>中选择的引脚。</blockquote>

## 第 2 步. 测试电机
为了在运行 FOC 算法之前测试无刷直流电机，我们建议运行开环示例！
```sh
motion_control >
    open_loop_motor_control >
             - open_loop_position_example
             - open_loop_velocity_example
```
<blockquote class="warning"> <p class="heading">更新实例的引脚</p> 
当测试传感器时，确保更新你在 <a href="pads_soldering">硬件配置</a>中选择的引脚。</blockquote>

如果你不确定你的电机的极对数，请检查示例代码：
```sh
utils >
    find_pole_pair_number >
             - encoder
             - magnetic_sensor
```
这个代码将计算你的电机的极对数。请多次运行此代码以获得准确的计算。代码运行 7/10 次的结果比较准确（运行10次，有7次的结果是准确的）。


## 第 3 步. 电压运动控制
当你的传感器开始工作，电机的极对数正确时，你可以开始使用FOC算法。最好的做法是从一个电压控制的例子开始：
```sh
motion_control > 
        torque_voltage_control > 
                       - encoder
                       - magnetic_sensor
                       - hall_sensors
```

## 第 4 步. 更复杂的控制策略
当你使用电压控制扭矩，你可以继续位置和速度的控制算法。他们会花更多的时间去调整，但是你有机会获得更好的结果。通过浏览这些例子，你可以找到循环的运动控制的库实例：

```sh
motion_control > 
        position_motion_control > 
                       - encoder
                       - magnetic_sensor
                       - hall_sensors
        torque_voltage_control > 
                       - encoder
                       - magnetic_sensor
                       - hall_sensors
        velocity_motion_control > 
                       - encoder
                       - magnetic_sensor
                       - hall_sensors
```
有关 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 项目的更多信息，请访问 [项目实例](examples) 。
