---
layout: default
title: 技术路线
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
nav_order: 8
permalink: /roadmap

---

#  技术路线

有关库版本功能的更多信息，请访问 [github releases <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases). 

这个页面并没有时常维护，有时可能会过时。

## 运动控制与FOC算法
- [ ] 电机控制：低压侧电流感应-No.1
- [ ] 错误修正：浮点角度溢出- No.2
- [ ] 电机控制：带DMA的内联电流感应 - No.3
- [ ] 电机控制：高压侧电流感应
- [x] 电机控制：内联电流感应
- [x] 电机控制：支持步进电机
- [x] 电机控制：支持霍尔传感器换向
- [x] 电机控制：支持完全开环操作（无传感器）
- [x] 添加对加速斜坡的支持
- [x] 速度低通滤波器
- [x] 计时器中断执行，而不是在`loop()`中”：❌ 没有真正的性能改进
- [x] 正弦波查找表的实现
- [X] 实现空间矢量调制的方法：SVM
- [x] 实现空间矢量调制的方法：PWM-SVM

## MCU 支持
- [ ] Raspberry pi Pico - [PR #78](https://github.com/simplefoc/Arduino-FOC/pull/78)
- [x] SAM - Arduino DUE
- [x] SAMD21/51
- [x] Teensy support
- [x] ESP32 support
- [x] STM32 Nucleo support
- [x] STM32 BLuepill support
- [x] 特定于硬件的代码分离 : 更容易在设备之间进行转移 `hardware_utils.cpp/.h`

## 驱动器支持
- [ ] 支持: 在6PWM模式下禁用PAHSE
- [x] 支持: 对高低侧MOSFET的控制
- [x] 支持: DRV8302 borads

## 传感器 support

- [ ] IMU 作为位置传感器
- [ ] 支持Back-EMF
- [ ] 支持Senosrless-FOC
- [ ] 支持磁性编码器SSI
- [x] 支持磁性编码器PWM
- [x] 支持磁编码器模拟
- [x] 支持磁性编码器I2C
- [x] 支持磁性编码器ABI
- [x] 支持磁性编码器SPI
- [x] 霍尔传感器
- [x] 合适的编码器索引

## 用户交互

- [ ] Commander为内存较低的设备制作最低版本
- [ ] 瞬时位置、速度、扭矩设定的目标设定界面（例如`q 10 20 1`）
- [x] 执行电机指令
- [x] 支持监控

## 可用性

- [ ] 更多文档和示例
- [x] <span class="simple">Simple<span class="foc">FOC</span>library</span> 入门页面
- [x] <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 入门页面
- [x] 在Arduino库管理器中访问库
- [x] 制作arduino代码的最低版本-全部包含在一个arduino文件中
- [x] 文档与 自述文件 README 的分离
- [x] Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的介绍

## 视频  

- [ ] 视频：发布使用库和示例的视频教程
- [ ] 视频：编码设置和程序视频
- [x] 视频：HMBGC上运行的两个电机示例
- [x] 视频：简单演示的视频











