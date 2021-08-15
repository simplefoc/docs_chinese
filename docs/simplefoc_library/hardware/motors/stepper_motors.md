---
layout: default
title: Stepper motors
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stepper_motors
parent: Motors
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 步进电机

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>支持绝大多数常见的步进电机。

步进电机是无刷直流电机的子集，以下是它们的一些特点：

 - 2相电机 - 4线
 - 相对较高的极对数 >50
 - 内阻一般 >5Ω
 - 电流一般 <5A

步进电机是最常见的电机之一。它们随处可见。使用步进电机的主要好处是：

- 价格实惠——电机和驱动器都很便宜
- 使用简便——方向和步进接口
- 性能良好—高保持扭矩，速度可达1000rpm

# 步进电机使用Field Oriented Control的好处

在开环（无位置传感器）控制模式下使用步进电机的主要问题是，我们不得不忽略电机及其负载的所有动态。我们假定电机能够服从我们可能有的任何命令。因此，在使用步进电机的时候，我们往往会低估电机为确保做出我们要求它做的所有动作的能力。

这在3D打印机中很容易看到，例如，如果你设置打印机的运动速度过高，电机将开始跳步（漏步或不能跟上），这将毁掉你的打印。因此，打印机通常有一个馈电速率因子，这使你能够减慢你的指令，并避免你的电机将无法跟上的运动。

步进电机开环控制的另一个问题是不知道电机在哪里，这使得控制算法无法对环境干扰做出响应。同样，在3D打印中，这个问题被称为丢步。如果3D打印机的喷嘴卡住了一秒钟，3D打印机不知道这一状况的发生，它将继续向电机发送命令，就好像电机一直在跟随。这通常会导致印刷损坏。

因此，将FOC算法用于步进电机的一些好处是：

- 动力更强
  - 选择适当的步进驱动器+位置传感器+ 单片机是必要的
- 不会丢步
  - 抗干扰性
- 更节能
  - 调整电机电压，使定位误差最小化—（通常固定）
- 可后置驱动

# 某些支持的电机

以下列举了一些不同价格范围、已经与library库测试成功的云台电机。

示例 | 描述 | 规格 | 链接 | 价格 
---- | ---- | ---- | ---- | ----
[<img src="extras/Images/nema14.jpg" style="height:100px">](https://www.ebay.com/itm/New-Geeetech-Nema14-35-BYGHW-stepper-motor-for-3d-printer-Reprap-Prusa/272847009701) | NEMA14 BYGHW |  - 50PP (200 steps) <br> - 18N.cm  <br> - 12V/1.2A <br> - 8.8Ω <br> - 35x35x35mm| [Ebay](https://www.ebay.com/itm/New-Geeetech-Nema14-35-BYGHW-stepper-motor-for-3d-printer-Reprap-Prusa/272847009701) | 10$
[<img src="extras/Images/nema17_1.jpg" style="height:100px">](https://www.ebay.com/itm/NEMA-17-Stepper-Motor-12V-0-4A-for-CNC-Reprap-3D-Printer-Extruder-36oz-in-26Ncm/401853894019?hash=item5d905bcd83:g:u04AAOSwRBFdp-IP) | NEMA17 42BYGH34-0400A |  - 50PP (200 steps) <br> - 26N.cm  <br> - 12V/0.4A  <br> - 30Ω <br> - 42x42x34mm| [Ebay](https://www.ebay.com/itm/NEMA-17-Stepper-Motor-12V-0-4A-for-CNC-Reprap-3D-Printer-Extruder-36oz-in-26Ncm/401853894019?hash=item5d905bcd83:g:u04AAOSwRBFdp-IP) | 12$
 [<img src="extras/Images/nema17_2.jpg" style="height:100px">](https://www.ebay.com/itm/Nema-17-Stepper-Motor-Bipolar-2A-59Ncm-83-6oz-in-48mm-Body-4-lead-3D-Printer-CNC/282285186801?hash=item41b9821ef1:g:7dUAAOSwEzxYSl25) | NEMA 17HS19-2004S1 |  - 50PP (200 steps) <br> - 59N.cm  <br> - 12V/2A  <br> - 4Ω<br> - 42x42x48mm| [Ebay](https://www.ebay.com/itm/Nema-17-Stepper-Motor-Bipolar-2A-59Ncm-83-6oz-in-48mm-Body-4-lead-3D-Printer-CNC/282285186801?hash=item41b9821ef1:g:7dUAAOSwEzxYSl25) | 17$
 [<img src="extras/Images/nema23.jpg" style="height:100px">](https://www.ebay.com/itm/Nema-23-Stepper-Motor-4-Wire-Bipolar-2-Phase-1-8-57BYGH-for-CNC-3D-Printer/372619819064) | NEMA23 57BYGH  | - 50PP (200 steps) <br> - >100N.cm <br> - 12V/2.5A  <br> - 1.2Ω <br> - 56x56x56mm| [Ebay](https://www.ebay.com/itm/Nema-23-Stepper-Motor-4-Wire-Bipolar-2-Phase-1-8-57BYGH-for-CNC-3D-Printer/372619819064) | 30$
