---
layout: default
title: Library Examples
parent: Library Source
nav_order: 5
permalink: /library_examples
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# **库实例**[v1.6](https://github.com/simplefoc/Arduino-FOC/releases)

此库附带“32”个文档化示例，展示了库的基本用法，包括：

- **不同的微控制器架构**：
    - Arduino UNO，Nucleo：除了“硬件特定”示例以外的所有内容`
    - Bluepill: `bluepill\u位置\u控制.ino`
    - HMBGC万向节控制器: `position_control.ino`, `voltage_control.ino`
    - ESP32控制器 : `position_control.ino`, `voltage_control.ino`
- **不同位置传感器**：
  - 编码器 
  - 磁传感器（SPI、I2C、模拟）, 
  - 霍尔传感器
- ***不同的BLDC驱动器**：
  - <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 
  - HMBGC万向节控制器: `HMBGC_example`
  - DRV8302: `DRV8305_driver`
- **不同的运动控制**：
  - 转矩/电压控制: `torque_voltage_control.ino`
  - 速度控制:  `velocity_motion_control.ino`
  - 位移/角度控制: `position_motion_control.ino`
  - 速度开环:  `open_loop_velocity_example.ino`
  - 位移/角度开环: `open_loop_position_example.ino`
- **大量的实用功能**：
  - 求极对数: `find_pole_pair_number.ino`
  - 寻找零偏移和传感器方向: `find_sensor_offset_and_direction.ino`
  - 传感器对准和电机齿槽测试:  `alignment_and_cogging_test.ino`

## 文件夹结构示例

```shell
> examples例子
├───hardware_specific_examples
│   ├───Bluepill_examples                         # example of STM32 Bluepill code
│   │   ├───encoder
│   │   └───magnetic_sensor
│   ├───DRV8305_driver                            # example of code with DRV8302 config
│   │   └───motor_full_control_serial_examples
│   ├───ESP32                                     # example of ESP32 controller code
│   │   ├───encoder 
│   │   └───magnetic_sensor
│   └───HMBGC_example                             # example of HMBGC controller code
│       ├───position_control
│       └───voltage_control
├───motion_control
│   ├───open_loop_motor_control                   # example of open-loop motor control
│   │   ├───open_loop_position_example
│   │   └───open_loop_velocity_example
│   ├─── position_motion_control                  # example of angle/position motion control loop with configuration
│   ├─── torque_voltage_control                   # example of the voltage/torque control loop with configuration
│   └─── velocity_motion_control                  # example of velocity motion control loop with configuration
|
├───motor_commands_serial_examples
│   ├───encoder
│   ├───hall_sensor
│   └───magnetic_sensor
└───utils
    ├───alignment_and_cogging_test                # example estimating alignment and cogging performance
    ├───find_pole_pair_number                     # example estimating pole pair number of the motor
    ├───find_sensor_offset_and_direction          # example determining sensor zero_electrical_offset and natural direction
    └───sensor_test                               # examples for sensor testing
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
