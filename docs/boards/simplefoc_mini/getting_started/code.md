---
layout: default
title: 编写代码
parent: 开始制作MINI
description: "code"
nav_order: 2
permalink: /mini_code
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Mini</span>
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span>开发板</span>
toc: true
---


# 编写代码
当你将所有[硬件连接好](mini_connect_hardware)之后：
- 微控制器
- 无刷直流电机
- 位置传感器
- 电源

我们就可以开始最令人兴奋的部分——编码了！

<span class="simple">Simple<span class="foc">FOC</span>Mini</span>完全受Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>支持，因此请确保你安装了最新版本的<span class="simple">Simple<span class="foc">FOC</span>库</span>。如果你还没有获取该库的版本，请按照[安装说明](installation)进行操作。

开始为Arduino <span class="simple">Simple<span class="foc">FOC</span>Mini</span>编码时，建议的步骤是：

- [测试传感器](#step-1-testing-the-sensor)
- [测试电机](#step-2-testing-the-motor)
- [电压运动控制](#step-3-voltage-motion-control)
- [更复杂的控制策略](#step-4-more-complex-control-strategies)——位置和速度

你也可以参考我们的[入门指南](example_from_scratch)！

## 步骤1. 测试传感器
首先要确保你的传感器能正常工作。运行库中针对你的传感器的示例之一。你可以在以下路径找到库示例：
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

当你的传感器能读取到正确的值后，就可以继续测试电机和传感器的组合了。

<blockquote class="warning"> <p class="heading">更新示例引脚分配</p>
测试传感器时，确保更新引脚分配。</blockquote>

## 步骤 2. 测试电机
在运行 FOC 算法之前测试无刷直流电机，我们建议运行开环示例！
```sh
motion_control >
    open_loop_motor_control >
             - open_loop_position_example
             - open_loop_velocity_example
```
<blockquote class="warning"> <p class="heading">更新示例引脚分配</p>测试电机时，确保更新你在<a href="mini_connect_hardware">硬件配置</a>中选择的引脚分配。</blockquote>
如果你不确定你的电机有多少极对数，请查看示例代码：

```sh
utils >
    find_pole_pair_number >
             - encoder
             - magnetic_sensor
```
这段代码会估算你的电机的极对数。请多次运行这段代码以获得准确的估算结果。通常情况下，10 次中有 7 次能得到较好的读数。


## 步骤 3. 电压运动控制
当你的传感器正常工作，并且你知道了电机正确的极对数后，就可以开始使用 FOC 算法了。最佳做法是从电压控制的示例开始：
```sh
motion_control > 
        torque_voltage_control > 
                       - encoder
                       - magnetic_sensor
                       - hall_sensors
```

## 步骤 4. 更复杂的控制策略
当你准备好使用电压进行转矩控制后，就可以继续学习位置和速度控制算法了。这些算法需要多花一点时间进行调优，但能让你获得很好的结果。你可以通过以下路径找到运动控制环路的库示例：

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
要了解更多关于SimpleFOCMini的可能项目，请访问 [示例项目](examples)
