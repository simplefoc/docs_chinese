---
layout: default
title: 编写代码
parent: 开始上手
description: "Writing the Arduino program for your SimpleFOCShield."
nav_order: 3
permalink: /foc_shield_code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
---

# 编写代码
当板子的 [硬件配置](pads_soldering) 完成并且 [连接](foc_shield_connect_hardware)好：
- 单片机
- 无刷直流电机
- 位置传感器
- 电源

我们就可以开始最激动人心的部分，写代码！

Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 完全支持 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> ，因此请务必安装最新版本的  <span class="simple">Simple<span class="foc">FOC</span>library</span> 。如果您仍然没有自己的库，请按照 [安装说明](installation) 操作。

当开始为 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 编写代码时，建议的步骤是：

- [测试传感器](#step-1-testing-the-sensor)
- [测试电机](#step-2-testing-the-motor)
- [电压运动控制](#step-3-voltage-motion-control)
- [更复杂的控制策略](#step-4-more-complex-control-strategies) - 位置和速度

## 第 1 步. 测试传感器
首先确保你的传感器能正常工作，可以运行适用于你的传感器的实例。下面为SimpleFOCLibrary所支持的传感器的测试实例：
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
当你的传感器读数良好时，你可以组合测试电机和传感器。

<blockquote class="warning"> <p class="heading">修改实例的引脚</p> 
当测试传感器时，注意是否需要修改你在 <a href="pads_soldering">硬件配置</a>中选择的引脚。</blockquote>


## 第 2 步. 测试电机
为了在运行 FOC 算法之前测试无刷直流电机，我们建议运行开环实例！
```sh
motion_control >
    open_loop_motor_control >
             - open_loop_position_example
             - open_loop_velocity_example
```
<blockquote class="warning"> <p class="heading">修改实例的引脚</p> 
当测试传感器时，注意是否需要修改你在 <a href="pads_soldering">硬件配置</a>中选择的引脚。</blockquote>


如果你不确定你的电机的极对数，使用下面的示例检查：
```sh
utils >
    find_pole_pair_number >
             - encoder
             - magnetic_sensor
```
这个代码将计算你的电机的极对数。请多次运行此代码以获得更准确的计算。代码运行 7/10 次的结果比较准确（运行10次，有7次的结果是准确的）。


## 第 3 步. 电压运动控制
传感器工作正常，且电机的极对数正确时，你就可以开始使用FOC算法。最好的做法是从一个电压控制的实例开始：
```sh
motion_control > 
        torque_voltage_control > 
                       - encoder
                       - magnetic_sensor
                       - hall_sensors
```

## 第 4 步. 更复杂的控制方法
当你使用电压控制扭矩，你可以继续尝试位置和速度的控制算法。它们会花更多的时间去调整，但是你可能可以获得更好的效果。你可以浏览下述目录找到相应的运动控制例程。

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
