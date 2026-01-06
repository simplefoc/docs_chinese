---
layout: default
title: 编写代码
parent: 开始上手
description: "Writing the Arduino program for your SimpleFOCShield."
nav_order: 3
permalink: /foc_shield_code
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
toc: true
---

# 编写代码
当你确定了电路板的合适[硬件配置](pads_soldering)，并且所有硬件
- 微控制器
- BLDC 电机
- 位置传感器
- 电源

都已[准备好连接](foc_shield_connect_hardware)后，就可以开始最令人兴奋的部分——编码了！

Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 完全受 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 支持，因此请确保你安装了该库的最新版本。如果你还没有获取该库，请按照[安装说明](installation)进行操作。

开始为 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 编码时，建议采用以下步骤：
- [测试传感器](#step-1-testing-the-sensor)
- [测试电机](#step-2-testing-the-motor)
- [电压运动控制](#step-3-voltage-motion-control)
- [更复杂的控制策略](#step-4-more-complex-control-strategies) - 位置和速度

你也可以遵循我们的[入门指南](example_from_scratch)！

## 步骤1：测试传感器
首先确保你的传感器正常工作。运行库中特定于你的传感器的示例之一。你可以在以下路径找到库示例：
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
当传感器读取到正确的值后，你可以继续测试电机和传感器的组合。

<blockquote class="warning"> <p class="heading">警告：更新示例引脚分配</p> 
测试传感器时，请确保更新你在 <a href="pads_soldering">硬件配置</a>中选择的引脚分配。
</blockquote>

## 步骤 2：测试电机
在运行 FOC 算法之前测试 BLDC 电机，我们建议运行开环示例！
```sh
motion_control >
    open_loop_motor_control >
             - open_loop_position_example
             - open_loop_velocity_example
```
<blockquote class="warning"> <p class="heading">警告：更新示例引脚分配</p> 
测试电机时，请确保更新你在 <a href="pads_soldering">硬件配置</a>中选择的引脚分配。
</blockquote>

如果你不确定你的电机有多少极对，请查看示例代码：
```sh
utils >
    find_pole_pair_number >
             - encoder
             - magnetic_sensor
```
这段代码将估算你的电机的极对数量。请多次运行此代码以获得良好的估算结果。通常，该代码 10 次中有 7 次会显示良好的读数。


## 步骤 3：电压运动控制
当你的传感器正常工作，并且你知道了电机的正确极对数量后，就可以开始使用 FOC 算法了。最佳实践是从电压控制的示例开始：
```sh
motion_control > 
        torque_voltage_control > 
                       - encoder
                       - magnetic_sensor
                       - hall_sensors
```

## 步骤 4：更复杂的控制策略
当你准备好使用电压进行 torque 控制后，就可以继续学习位置和速度控制算法了。它们需要更多的时间来调试，但能让你获得更好的结果。你可以通过以下路径找到运动控制环路的库示例：

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
有关可能的 SimpleFOCShield 项目的更多信息，请访问[示例项目](examples)
