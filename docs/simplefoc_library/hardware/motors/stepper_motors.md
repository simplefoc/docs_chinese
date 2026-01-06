---
layout: default
title: 步进电机
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stepper_motors
parent: 电机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 步进电机

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>支持市面上大多数常见的步进电机。

步进电机是无刷直流电机的一个子集，它们具有以下一些特点：
- 两相电机 - 4 根线
- 极对数相对较多 >50
- 内阻通常 >5Ω
- 电流通常低于 <5A

步进电机是最常见的 hobby 电机之一，应用广泛。使用步进电机的主要优点是：
- 价格 - *电机和驱动器都相当便宜*
- 使用简单 - *方向和步进接口*
- 性能良好 - *保持扭矩高，速度可达 1000rpm*

## 步进电机使用磁场定向控制的好处
在开环（无位置传感器）控制模式下使用步进电机的主要问题是，我们不得不忽略电机及其负载的所有动态特性。我们假设电机能够服从我们发出的任何指令。因此，在使用步进电机时，我们往往会低估电机的能力，以确保电机能够完成我们要求的所有动作。

这一点在 3D 打印机上很容易看到，例如，如果你将打印机的移动速度设置得过高，电机就会开始丢步（错过步骤或无法跟随），从而破坏你的打印成果。因此，打印机通常有一个进给率因子，使你能够放慢指令速度，避免电机无法完成的动作。

步进电机开环控制的另一个问题是不知道电机的位置，这使得控制算法无法应对来自环境的干扰。同样在 3D 打印中，这个问题被称为丢步。如果 3D 打印机的喷嘴卡住一秒钟，3D 打印机不会知道，它会继续向电机发送命令，就好像电机一直在跟随指令一样。这往往会导致打印失败。

因此，将 FOC 算法用于步进电机的一些好处是：
- 更好的动态性能
  - 需要适当选择步进驱动器 + 位置传感器 + 微控制器
- 不会丢步
  - 抗干扰能力
- 更节能
  - 电机电压经过调制，以最小化定位误差 -（通常是固定的）
- **可反向驱动**

## 一些支持的电机

以下是不同价格范围的步进电机示例，这些电机已成功通过该库的测试。

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | ---- | ----
[<img src="extras/Images/nema14.jpg" style="height:100px">](https://www.ebay.com/itm/New-Geeetech-Nema14-35-BYGHW-stepper-motor-for-3d-printer-Reprap-Prusa/272847009701) | NEMA14 BYGHW | - 50PP（200 步）<br>- 18N.cm<br>- 12V/1.2A<br>- 8.8Ω<br>- 35x35x35mm | [Ebay](https://www.ebay.com/itm/New-Geeetech-Nema14-35-BYGHW-stepper-motor-for-3d-printer-Reprap-Prusa/272847009701) | 10 美元
[<img src="extras/Images/nema17_1.jpg" style="height:100px">](https://www.ebay.com/itm/NEMA-17-Stepper-Motor-12V-0-4A-for-CNC-Reprap-3D-Printer-Extruder-36oz-in-26Ncm/401853894019?hash=item5d905bcd83:g:u04AAOSwRBFdp-IP) | NEMA17 42BYGH34-0400A | - 50PP（200 步）<br>- 26N.cm<br>- 12V/0.4A<br>- 30Ω<br>- 42x42x34mm | [Ebay](https://www.ebay.com/itm/NEMA-17-Stepper-Motor-12V-0-4A-for-CNC-Reprap-3D-Printer-Extruder-36oz-in-26Ncm/401853894019?hash=item5d905bcd83:g:u04AAOSwRBFdp-IP) | 12 美元
[<img src="extras/Images/nema17_2.jpg" style="height:100px">](https://www.ebay.com/itm/Nema-17-Stepper-Motor-Bipolar-2A-59Ncm-83-6oz-in-48mm-Body-4-lead-3D-Printer-CNC/282285186801?hash=item41b9821ef1:g:7dUAAOSwEzxYSl25) | NEMA 17HS19-2004S1 | - 50PP（200 步）<br>- 59N.cm<br>- 12V/2A<br>- 4Ω<br>- 42x42x48mm | [Ebay](https://www.ebay.com/itm/Nema-17-Stepper-Motor-Bipolar-2A-59Ncm-83-6oz-in-48mm-Body-4-lead-3D-Printer-CNC/282285186801?hash=item41b9821ef1:g:7dUAAOSwEzxYSl25) | 17 美元
[<img src="extras/Images/nema23.jpg" style="height:100px">](https://www.ebay.com/itm/Nema-23-Stepper-Motor-4-Wire-Bipolar-2-Phase-1-8-57BYGH-for-CNC-3D-Printer/372619819064) | NEMA23 57BYGH | - 50PP（200 步）<br>- >100N.cm<br>- 12V/2.5A<br>- 1.2Ω<br>- 56x56x56mm | [Ebay](https://www.ebay.com/itm/Nema-23-Stepper-Motor-4-Wire-Bipolar-2-Phase-1-8-57BYGH-for-CNC-3D-Printer/372619819064) | 30 美元
