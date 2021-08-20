---
layout: default
title: 步进电机
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stepper_motors
parent: 支持的无刷直流电机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 步进电机

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>支持绝大多数常见的步进电机。

步进电机是无刷直流电机的子集，以下是它们的一些特点：

 - 2相4线
 - 相对较高的极对数 >50
 - 内阻一般 >5Ω
 - 电流一般 <5A

步进电机是最常见的电机之一。它们随处可见。使用步进电机的主要好处是：

- 价格实惠——电机和驱动器都很便宜
- 使用简便——通过方向和步进接口就可使用
- 性能良好—持续扭矩大，速度可达1000rpm

# 步进电机使用FOC控制算法的好处

在开环（无位置传感器）控制模式下使用步进电机的主要问题是，我们不得不忽略电机的负载和其动力学问题。因此，在使用步进电机的时候，我们往往会选择强劲的超过我们应用需求的电机，以弥补无感时候的控制缺陷。

这在3D打印机中很容易看到，例如，如果你设置打印机的运动速度过高，电机将开始跳步（漏步或不能跟上），然后你的打印就废了。因此，打印机通常有一个时间常数来使得电机能够跟上单片机发送的运动指令，避免电机跟不上导致打印失败。

步进电机开环控制的另一个问题是不知道电机此时的运动位置，这使得控制算法无法对环境干扰做出响应。同样以3D打印为例，如果3D打印机的喷嘴卡住了一秒钟，但是由于3D打印机不知道这一状况的发生，因此它将继续向电机发送命令，最后导致打印失败。

因此，将FOC算法用于步进电机的一些好处可归纳为：

- 动力更强
  - 再适当的步进驱动器+位置传感器+ 单片机的基础下
- 不会丢步
  - 抗干扰能力强
- 更节能
  - 自适应调整电机电压，使定位误差最小化—

# 部分支持的电机

以下列举了一些不同价格范围、并且成功测试过可用于SFOC的步进电机。

示例 | 描述 | 规格 | 链接 | 价格 
---- | ---- | ---- | ---- | ----
[<img src="extras/Images/nema14.jpg" style="height:100px">](https://www.ebay.com/itm/New-Geeetech-Nema14-35-BYGHW-stepper-motor-for-3d-printer-Reprap-Prusa/272847009701) | NEMA14 BYGHW |  - 50PP (200 steps) <br> - 18N.cm  <br> - 12V/1.2A <br> - 8.8Ω <br> - 35x35x35mm| [Ebay](https://www.ebay.com/itm/New-Geeetech-Nema14-35-BYGHW-stepper-motor-for-3d-printer-Reprap-Prusa/272847009701) | 10$
[<img src="extras/Images/nema17_1.jpg" style="height:100px">](https://www.ebay.com/itm/NEMA-17-Stepper-Motor-12V-0-4A-for-CNC-Reprap-3D-Printer-Extruder-36oz-in-26Ncm/401853894019?hash=item5d905bcd83:g:u04AAOSwRBFdp-IP) | NEMA17 42BYGH34-0400A |  - 50PP (200 steps) <br> - 26N.cm  <br> - 12V/0.4A  <br> - 30Ω <br> - 42x42x34mm| [Ebay](https://www.ebay.com/itm/NEMA-17-Stepper-Motor-12V-0-4A-for-CNC-Reprap-3D-Printer-Extruder-36oz-in-26Ncm/401853894019?hash=item5d905bcd83:g:u04AAOSwRBFdp-IP) | 12$
 [<img src="extras/Images/nema17_2.jpg" style="height:100px">](https://www.ebay.com/itm/Nema-17-Stepper-Motor-Bipolar-2A-59Ncm-83-6oz-in-48mm-Body-4-lead-3D-Printer-CNC/282285186801?hash=item41b9821ef1:g:7dUAAOSwEzxYSl25) | NEMA 17HS19-2004S1 |  - 50PP (200 steps) <br> - 59N.cm  <br> - 12V/2A  <br> - 4Ω<br> - 42x42x48mm| [Ebay](https://www.ebay.com/itm/Nema-17-Stepper-Motor-Bipolar-2A-59Ncm-83-6oz-in-48mm-Body-4-lead-3D-Printer-CNC/282285186801?hash=item41b9821ef1:g:7dUAAOSwEzxYSl25) | 17$
 [<img src="extras/Images/nema23.jpg" style="height:100px">](https://www.ebay.com/itm/Nema-23-Stepper-Motor-4-Wire-Bipolar-2-Phase-1-8-57BYGH-for-CNC-3D-Printer/372619819064) | NEMA23 57BYGH  | - 50PP (200 steps) <br> - >100N.cm <br> - 12V/2.5A  <br> - 1.2Ω <br> - 56x56x56mm| [Ebay](https://www.ebay.com/itm/Nema-23-Stepper-Motor-4-Wire-Bipolar-2-Phase-1-8-57BYGH-for-CNC-3D-Printer/372619819064) | 30$
