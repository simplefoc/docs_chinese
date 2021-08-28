---
layout: default
title: 库实例
parent: Library Source
nav_order: 5
permalink: /library_examples
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# **库实例**[v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

此库附带“32”个文档化示例，展示了库的基本用法，包括：

- **不同的微控制器架构**：
    - Arduino UNO，Nucleo：除了 `hardware_specific_examples`以外的所有内容
    - Bluepill:`bluepill_position_control.ino`
    - HMBGC万向节控制器: `position_control.ino`、`voltage_control.ino`
    - ESP32控制器 : `position_control.ino`、 `voltage_control.ino`
- **不同位置传感器**：
  - 编码器 
  - 磁传感器（SPI、I2C、模拟）, 
  - 霍尔传感器
- **不同的BLDC驱动器**：
  - <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 
  - HMBGC万向节控制器: `HMBGC_example`
  - DRV8302: `DRV8305_driver`
- **不同的运动控制**：
  - 力矩/电压控制: `torque_voltage_control.ino`
  - 速度控制:  `velocity_motion_control.ino`
  - 位置/角度控制: `position_motion_control.ino`
  - 开环速度:  `open_loop_velocity_example.ino`
  - 开环位置/角度: `open_loop_position_example.ino`
- **大量的实用功能**：
  - 求极对数: `find_pole_pair_number.ino`
  - 寻找零偏移和传感器方向: `find_sensor_offset_and_direction.ino`
  - 传感器对准和电机齿槽测试:  `alignment_and_cogging_test.ino`

## 例程文件夹结构

```shell
> examples
├───hardware_specific_examples
│   ├───Bluepill_examples                         # STM32 Bluepill 代码示例
│   │   ├───encoder
│   │   └───magnetic_sensor
│   ├───DRV8305_driver                            # 使用DRV8302配置的代码示例
│   │   └───motor_full_control_serial_examples
│   ├───ESP32                                     # ESP32控制器代码的示例
│   │   ├───encoder 
│   │   └───magnetic_sensor
│   └───HMBGC_example                             # HMBGC控制器代码的示例
│       ├───position_control
│       └───voltage_control
├───motion_control
│   ├───open_loop_motor_control                   # 开环电机控制的示例
│   │   ├───open_loop_position_example
│   │   └───open_loop_velocity_example
│   ├─── position_motion_control                  # 具有配置的角度/位置运动控制回路的示例
│   ├─── torque_voltage_control                   # 具有配置的电压/转矩控制回路的例子
│   └─── velocity_motion_control                  # 带有配置的速度运动控制回路的示例
|
├───motor_commands_serial_examples
│   ├───encoder
│   ├───hall_sensor
│   └───magnetic_sensor
└───utils
    ├───alignment_and_cogging_test                # 预校准和锯齿性能的示例
    ├───find_pole_pair_number                     # 估计电机的极子对数的示例
    ├───find_sensor_offset_and_direction          # 确定传感器零电位偏移量和自然方向的示例
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
