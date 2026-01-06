---
layout: default
title: 选项参考
nav_order: 1
permalink: /cheetsheet/options_reference
parent: 选项速查表
grand_parent: 实用指南
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: False
has_toc: False
toc: true
---



# 选项

<span class="simple">Simple<span class="foc">FOC</span>库</span>有许多选项，以下表格汇总了重要的选项，集中在一个方便的地方供您即时参考。

## 驱动器选项

驱动器选项在调用`driver.init()`之前设置，通常在初始化后不会更改。

| 选项 | 默认值 | 支持的电机类型 | 描述 |
| --- | --- | --- | --- |
| driver.pwm_frequency | 取决于微控制器 | 无刷直流电机、步进电机 | PWM频率，单位为Hz |
| driver.voltage_power_supply | 12V | 无刷直流电机、步进电机 | 电源电压，单位为伏特 |
| driver.voltage_limit | 未设置 | 无刷直流电机、步进电机 | 输出电压的硬限制，单位为伏特。实际上与电源电压成比例地限制PWM占空比 |
| driver.intialized |  | 无刷直流电机、步进电机 | 只读。如果初始化成功则为true，否则为false |
| driver.enable_active_high | true | 无刷直流电机 | 如果为true，通过向使能引脚写入'1'来启用驱动器。如果为false，通过向使能引脚写入'0'来启用驱动器 |
| driver.dead_zone | 0.02 | 六相PWM无刷驱动器 | 每个PWM周期的死区时间量，以占空比100%的比例表示。为[0,1]范围内的浮点数。值低于10%是合理的 |

## 电机选项

| 选项 | 默认值 | 描述 |
| --- | --- | --- |
| motor.controller | MotionControlType::torque | 运动控制模式 |
| motor.torque_controller | TorqueControlType::voltage | 扭矩控制模式 |
| motor.motion_downsample | 0 | 设置为大于1的值可减少move()的执行频率（与loopFOC()相比）。在快速微控制器上，减少move()的调用频率是有意义的 |
| motor.phase_resistance | 未设置 | 电机相电阻。如果设置，用于根据电压限制计算电流限制。单位为欧姆 |
| motor.KV_rating | 未设置 | 电机KV额定值，有效值。也可以通过电机构造函数设置，在构造函数中可以以RPM/V为单位指定KV |
| motor.phase_inductance | 未设置 | 电机电感，单位为亨利。也可以通过电机构造函数设置 |
| motor.voltage_limit | 12V | 全局电压限制。限制Q轴电压 |
| motor.current_limit | 2A | 全局电流限制。限制Q轴电流 |
| motor.velocity_limit | 20rad/s | 全局速度限制。单位为弧度/秒 |
| motor.foc_modulation | FOCModulationType::SinePWM | FOC调制模式 |
| motor.modulation_centered | 1（true） | 1/True：围绕驱动器的voltage_limit÷2进行中心调制；0/False：拉至0 |
| motor.sensor_offset | 0 | 电机零点与传感器零点的偏移量。可用于使位置0呈现特定的电机方向。为了用户方便。单位为弧度 |
| motor.voltage_sensor_align | motor.voltage_limit | 限制电机对齐期间的电压（从而限制电流）。单位为伏特 |
| motor.velocity_index_search | 未设置 | 限制电机初始化期间的电机速度。以弧度/秒为单位给出值 |
| motor.zero_electric_angle | 未设置 | FOC控制所需。通常在电机FOC初始化期间设置。如果在motor.initFOC()之前设置，则在对齐期间跳过电角度零点的测量 |
| motor.sensor_direction | 未设置 | 通常在电机FOC初始化期间设置。确定传感器方向与电机正方向的关系（根据电机电缆的连接方式，可能相反）。如果在motor.initFOC()之前设置，则在对齐期间跳过传感器自然方向的测量 |
| motor.motor_status | FOCMotorStatus::motor_uninitialized | 只读。跟踪电机初始化状态。您可以检查它以查看初始化是否成功、校准是否完成等 |

## PID调优选项

| 选项 | 使用的模式 | 描述 |
| --- | --- | --- |
| motor.PID_velocity.P | 所有闭环模式 | 速度PID控制器的P值。因情况而异。典型值为0.2至0.6，但可能有很大不同 |
| motor.PID_velocity.I | 所有闭环模式 | 速度PID控制器的I值。因情况而异。典型值为2.0至20.0，但可能有很大不同 |
| motor.PID_velocity.D | 所有闭环模式 | 速度PID控制器的D值。通常设置为0。典型值为0或非常低的值，如0.001 |
| motor.PID_velocity.ramp | 所有闭环模式 | 速度PID控制器的最大变化量。典型值1000.0，设置得更低以限制加速度 |
| motor.PID_velocity.limit | 所有闭环模式 | 速度PID控制器的输出限制。设置为将速度限制到此最大值 |
| motor.P_angle.P | 闭环位置控制 | 角度P控制器的P值。因情况而异。典型值为10.0至20.0，但可能有很大不同 |
| motor.LPF_velocity.Tf | 所有闭环模式 | 速度低通滤波器时间常数。值大于0，最大1.0。值越低，传感器速度变化的影响越慢 |
| motor.LPF_angle.Tf | 所有闭环模式 | 角度低通滤波器时间常数。值大于0，最大1.0。值越低，传感器角度变化的影响越慢 |
| motor.PID_current_q.P | 扭矩电流控制 | Q轴电流控制器的P值 |
| motor.PID_current_q.I | 扭矩电流控制 | Q轴电流控制器的I值 |
| motor.PID_current_q.D | 扭矩电流控制 | Q轴电流控制器的D值 |
| motor.PID_current_q.ramp | 扭矩电流控制 | Q轴电流控制器的最大变化量 |
| motor.PID_current_q.limit | 扭矩电流控制 | Q轴电流控制器的输出限制 |
| motor.PID_current_d.P | 扭矩电流控制 | D轴电流控制器的P值 |
| motor.PID_current_d.I | 扭矩电流控制 | D轴电流控制器的I值 |
| motor.PID_current_d.D | 扭矩电流控制 | D轴电流控制器的D值 |
| motor.PID_current_d.ramp | 扭矩电流控制 | D轴电流控制器的最大变化量 |
| motor.PID_current_d.limit | 扭矩电流控制 | D轴电流控制器的输出限制 |
| motor.LPF_current_q.Tf | 扭矩电流控制 | Q轴电流低通滤波器时间常数 |
| motor.LPF_current_d.Tf | 扭矩电流控制 | D轴电流低通滤波器时间常数 |
