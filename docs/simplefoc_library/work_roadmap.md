---
layout: default
title: 工作路线
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
nav_order: 8
permalink: /roadmap
---

#  功能路线图

本页面并未严格维护，可能有些过时。

<div class="image_icon" >
    <a href="https://simplefoc.notion.site/Developement-4149a181ea5b4383964cc8cc250e7d11" >
        <img src="extras/Images/roadmap.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
        <p >Notion上的路线图</p>
    </a>
</div>
<div class="image_icon" >
    <a href="https://github.com/simplefoc/Arduino-FOC/releases" >
        <img src="extras/Images/releases.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
        <p >Github更新日志</p>
    </a>
</div>

有关库版本功能的更多信息，请访问 [github releases <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases). 

# 旧路线图
<details markdown=1>

## 运动控制与 FOC 算法
- [x] **电机控制：低边电流采样** - 第 1 项
- [ ] **电机控制：带 DMA 的串联电流采样** - 第 2 项
- [ ] 电机控制：高边电流采样
- [x] **错误修复：浮点角度溢出** 
- [x] 电机控制：串联电流采样
- [x] **电机控制：支持步进电机**
- [x] 电机控制：支持霍尔传感器换相
- [x] 电机控制：支持全开环运行（无传感器）
- [x] 添加加速度斜坡支持
- [x] 速度低通滤波器
- [x] 定时器中断执行而非在loop()中：❌ 无实际性能提升
- [x] 正弦波查找表实现
- [X] 实现空间矢量调制方法：纯 SVM
- [x] 实现空间矢量调制方法：PWM SVM

## 微控制器（MCU）支持
- [ ] ESP8266 - 初步支持 
- [ ] Portenta H7 - 初步支持 
- [ ] Renesas support - 初步支持
- [x] Arduino leonardo 
- [x] Raspberry pi Pico - [PR #78](https://github.com/simplefoc/Arduino-FOC/pull/78)
- [x] SAM - Arduino DUE
- [x] SAMD21/51
- [x] Teensy support
- [x] ESP32 support
- [x] STM32 Nucleo support
- [x] STM32 Bluepill support
- [x] nRF52 support
- [x] 硬件特定代码分离：更易于设备间移植 `hardware_utils.cpp/.h`

## 驱动器支持
- [x] 驱动器支持：在 6PWM 模式下禁用相位
- [x] 驱动器支持：实现对 MOSFET 高低对的控制支持
- [x] 驱动器支持：DRV8302 开发板

## 传感器支持
- [ ] 作为位置传感器的惯性测量单元（IMU）
- [ ] 反电动势（Back-EMF）支持
- [ ] 无传感器 FOC 支持
- [ ] 支持磁性编码器 SSI
- [x] 支持磁性编码器 PWM
- [x] 支持磁性编码器模拟量
- [x] 支持磁性编码器 I2C
- [x] 支持磁性编码器 ABI
- [x] 支持磁性编码器 SPI
- [x] 霍尔传感器支持
- [x] 编码器索引正确实现
## 用户交互
- [ ] 为低内存设备制作精简版命令器（Commander）
- [ ] 制作瞬时位置、速度、扭矩设置的目标设置接口（例如 q 10 20 1）
- [x] 实现电机命令 
- [x] 支持监控

## 易用性
- [ ] 更多文档和示例
- [x] SimpleFOClibrary 入门页面
- [x] SimpleFOCShield 入门页面
- [x] 使库可在 Arduino 库管理器中获取
- [x] 制作 Arduino 代码的精简版 - 单个 Arduino 文件包含所有内容
- [x] 从 README 中分离文档
- [x] 正确介绍 Arduino SimpleFOCShield

## 视频 
- [ ] 视频：发布使用该库和示例的视频教程 
- [ ] 视频：编码设置和流程视频
- [x] 视频：HMBGC 示例上运行的两个电机
- [x] 视频：简单演示的初始视频

</details>


