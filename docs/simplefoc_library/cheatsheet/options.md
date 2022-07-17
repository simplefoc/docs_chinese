---
layout: default
title: Options Reference
nav_order: 1
permalink: /cheetsheet/options_reference
parent: 选项查阅
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: False
has_toc: False
---


# Options

<span class="simple">Simple<span class="foc">FOC</span>library</span> 有许多选项，下表总结了重要的选项供您立即参考。

## Driver 选项

Driver 选项在调用 `driver.init()` 之前设置，通常在初始化后不会更改。

选项 | 默认值 | 适用 | 说明 
--- | --- | --- | ---
driver.pwm_frequency | depends on MCU | BLDC, Stepper | PWM 频率, 是 Hz 
driver.voltage_power_supply | 12V | BLDC, Stepper | 以伏特为单位的电源电压 
driver.voltage_limit | NOT SET | BLDC, Stepper | 输出电压的硬限制，以伏特为单位。 有效地限制与电源电压成比例的 PWM 占空比。 
driver.intialized | | BLDC, Stepper | 只读。 如果初始化成功，则为 true，否则为 false 
driver.enable_active_high | true | BLDC | 如果为真，则通过写入“1”来启用driver以启用引脚。 如果为 false，则通过写入“0”来启用driver以启用引脚。 
driver.dead_zone | 0.02 | BLDCDriver6PWM | 每个 pwm 周期的死区时间量，占 100% 占空比的比例。 [0,1] 范围内的浮点数。 低于 10% 的值是有意义的。 

## Motor 选项

选项 | 默认值 | 说明 
--- | --- | ---
motor.controller | MotionControlType::torque | 运动控制方式 
motor.torque_controller | TorqueControlType::voltage | 扭矩控制方式 
motor.motion_downsample | 0 | 与 loopFOC() 相比，设置值 > 1 以减少 move() 的执行频率。 在快速 MCU 上，减少调用 move() 的频率是有意义的。 
motor.phase_resistance | NOT SET | 电机相电阻。 如果设置，使用电压限制来计算电流限制。 以欧姆为单位的值。 
motor.K_bemf | NOT SET | 电机反电动势常数，为 1/KV。 单位 1/rad/s/V。 通过电机构造函数设置，您可以在其中以 RPM/V 指定 KV。 
motor.voltage_limit | 12V | 全局电压限制。 限制 Q 轴电压。 
motor.current_limit | 2A | 全局电流限制。 限制 Q 轴电流。 
motor.velocity_limit | 20rad/s | 全局速度限制。 以 rad/s 为单位的值。 
motor.foc_modulation | FOCModulationType::SinePWM | FOC 调制方式。 
motor.modulation_centered | 1 (true) | 1/True：以 driver.voltage_limit÷2 为中心调制或 0/False：拉至 0 
motor.sensor_offset | 0 | 电机零位到传感器零位的偏移。 可用于使位置 0 采用特定的电机方向。 为了方便用户。 以rad为单位的值。 
motor.voltage_sensor_align | motor.voltage_limit | 在电机校准期间限制电压（并因此限制电流）。 以伏特为单位的值。 
motor.velocity_index_search | NOT SET | 在电机初始化期间限制电机速度。 以 rad/s 为单位给值。 
motor.zero_electric_angle | NOT SET | FOC 控制需要。 通常在电机 FOC 初始化期间设置。 可以存储并作为参数提供给 motor.initFOC()。 
motor.sensor_direction | NOT SET | 通常在电机 FOC 初始化期间设置。 确定传感器方向与电机正方向（可以相反，具体取决于您连接电机电缆的方式）。 可以存储并作为参数提供给 motor.initFOC()。 
motor.motor_status | FOCMotorStatus::motor_uninitialized | 只读。 跟踪电机初始化状态。 可以查看初始化是否成功、校准是否完成等。 

## PID Tuning Options

选项 | 模式 | 说明 
--- | --- | ---
motor.PID_velocity.P | 所有闭环模式 | 速度 PID 控制器 P 值。 因情况而异。 典型值为 0.2 到 0.6，但也可能有完全不同的值。 
motor.PID_velocity.I | 所有闭环模式 | 速度 PID 控制器 I 值。 因情况而异。 典型值为 2.0 到 20.0，但也可能有完全不同的值。 
motor.PID_velocity.D | 所有闭环模式 | 速度 PID 控制器 D 值。 通常设置为 0。典型值为 0，或非常低的值，如 0.001。 
motor.PID_velocity.ramp | 所有闭环模式 | 速度 PID 控制器的最大变化。 典型值 1000.0，设置得低一点以限制加速度。 
motor.PID_velocity.limit | 所有闭环模式 | 速度 PID 控制器输出限制。 设置将速度限制在此最大值。 
motor.P_angle.P | 闭环位置控制 | 角度 P 控制器 P 值。 因情况而异。 典型值为 10.0 到 20.0，但也可能有完全不同的值。 
motor.LPF_velocity.Tf | 所有闭环模式 | 速度低通滤波器时间常数。大于 0 的值，最大值为 1.0。该值越低，传感器对速度变化的影响越慢。 
motor.LPF_angle.Tf | 所有闭环模式 | 角度低通滤波器时间常数。 大于 0 的值，最大值为 1.0。 该值越低，传感器对角度变化的影响越慢。 
motor.PID_current_q.P | 扭矩电流控制 | Q 轴电流控制器 P 值。 
motor.PID_current_q.I | 扭矩电流控制 | Q 轴电流控制器 I 值。 
motor.PID_current_q.D | 扭矩电流控制 | Q 轴电流控制器 D 值。 
motor.PID_current_q.ramp | 扭矩电流控制 | Q 轴电流控制器最大变化。 
motor.PID_current_q.limit | 扭矩电流控制 | Q 轴电流控制器输出限制。 
motor.PID_current_d.P | 扭矩电流控制 | D 轴电流控制器 P 值。 
motor.PID_current_d.I | 扭矩电流控制 | D 轴电流控制器 I 值。 
motor.PID_current_d.D | 扭矩电流控制 | D 轴电流控制器 D 值。 
motor.PID_current_d.ramp | 扭矩电流控制 | D 轴电流控制器最大变化。 
motor.PID_current_d.limit | 扭矩电流控制 | D 轴电流控制器输出限制。 
motor.LPF_current_q.Tf | 扭矩电流控制 | Q 轴电流低通滤波器时间常数。 
motor.LPF_current_d.Tf | 扭矩电流控制 | D 轴电流低通滤波器时间常数。 

