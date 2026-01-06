---
layout: default
title: 库示例
parent: 库源
nav_order: 5
permalink: /library_examples
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 库示例 [v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

该库附带32个带文档的示例，展示了库的基本用法，包括：
- **不同的微控制器架构**：
    - Arduino UNO、Nucleo：除“硬件特定示例”外的所有内容
    - Bluepill：`bluepill_position_control.ino`
    - HMBGC云台控制器：`position_control.ino`、`voltage_control.ino`
    - ESP32控制器：`position_control.ino`、`voltage_control.ino`
- **不同的位置传感器**：
  - 编码器
  - 磁性传感器（SPI、I2C、模拟）
  - 霍尔传感器
- **不同的BLDC驱动器**：
  - <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
  - HMBGC云台控制器：`HMBGC_example`
  - DRV8302：`DRV8305_driver`
- **不同的运动控制**：
  - 扭矩/电压控制：`torque_voltage_control.ino`
  - 速度控制：`velocity_motion_control.ino`
  - 位置/角度控制：`position_motion_control.ino`
  - 速度开环：`open_loop_velocity_example.ino`
  - 位置/角度开环：`open_loop_position_example.ino`
- **许多实用功能**：
  - 查找极对数：`find_pole_pair_number.ino`
  - 查找零点偏移和传感器方向：`find_sensor_offset_and_direction.ino`
  - 传感器校准和电机齿槽效应测试：`alignment_and_cogging_test.ino`

## 示例文件夹结构
```shell
> examples
├───hardware_specific_examples
│   ├───Bluepill_examples                         # STM32 Bluepill代码示例
│   │   ├───encoder
│   │   └───magnetic_sensor
│   ├───DRV8305_driver                            # 带DRV8302配置的代码示例
│   │   └───motor_full_control_serial_examples
│   ├───ESP32                                     # ESP32控制器代码示例
│   │   ├───encoder 
│   │   └───magnetic_sensor
│   └───HMBGC_example                             # HMBGC控制器代码示例
│       ├───position_control
│       └───voltage_control
├───motion_control
│   ├───open_loop_motor_control                   # 开环电机控制示例
│   │   ├───open_loop_position_example
│   │   └───open_loop_velocity_example
│   ├─── position_motion_control                  # 带配置的角度/位置运动控制环示例
│   ├─── torque_voltage_control                   # 带配置的电压/扭矩控制环示例
│   └─── velocity_motion_control                  # 带配置的速度运动控制环示例
|
├───motor_commands_serial_examples
│   ├───encoder
│   ├───hall_sensor
│   └───magnetic_sensor
└───utils
    ├───alignment_and_cogging_test                # 校准和齿槽效应性能评估示例
    ├───find_pole_pair_number                     # 电机极对数估计示例
    ├───find_sensor_offset_and_direction          # 传感器电气零点偏移和自然方向确定示例
    └───sensor_test                               # 传感器测试示例
        ├───encoder
        │   ├───encoder_example
        │   └───encoder_software_interrupts_example
        ├───hall_sensors
        │   ├───hall_sensor_example
        │   └───hall_sensor_software_interrupts_example
        └───magnetic_sensors
            ├───magnetic_sensor_analog_example
            ├───magnetic_sensor_i2c_example
            └───magnetic_sensor_spi_example
```
