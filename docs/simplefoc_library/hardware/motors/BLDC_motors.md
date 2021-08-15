---
layout: default
title: BLDC motors
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /bldc_motors
parent: Motors
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 无刷直流电机

Arduino SimpleFOClibrary支持大多数常见的三相无刷直流电机，包括

- [云台电机](#gimbal-motors) -低 KV（高内阻~10Ω）。
- [高性能无刷直流电机](#high-performance-motors) -高KV（低内阻<1Ω ）。

# 云台电机

云台电机基本上适用于任何无刷直流电机驱动器。但由于高性能驱动器有针对大电流优化的电流测量电路，使用它们不会有任何好处。因此，低功率无刷直流电机驱动器将具有与昂贵的高功率、高性能的云台电机驱动器相当的性能。在我看来这是很酷的！😃 这是开始开发<span class="simple">Simple<span class="foc">FOC</span>Shield</span>的主要动力之一。

云台电机的一些特点是：

 - 低速时，高扭矩
 - 运行平稳
 - 内阻>10Ω
 - 电流达5A

云台电机是非常通用的，它们的主要好处是在低速和高扭矩运行时非常平稳。它们可以用于不同的应用程序，从而高质量的代替你的步进电机或者直流伺服电机来运行平稳的云台相机和许多不同的机器人应用程序。一个非常有趣的应用例子是在某些学生实验中无刷直流电机为项目提供了高度的控制和动力，例如板球系统，倒立摆，平衡机器人等。

<blockquote class="info"> <p class="heading">示例</p>请确保查看基于SimpleFOClibrary、SimpleFOCShield和一个云台电机开发的<a href="simplefoc_pendulum">倒立摆<i class="fa fa-external-link"></i></a>项目</blockquote>

以下列举了一些不同价格范围、已经与library库测试成功的云台电机。

示例 | 描述 | 规格                                              | 链接 | 价格 
---- | ---- | ---- | ---- | ----
[<img src="extras/Images/mot.jpg" style="height:100px">](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571) | IPower GBM4198H-120T |  - 12N14P <br> - 98g  <br> - 11.4Ω <br> - 45x25mm| [Ebay](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/252025852824?hash=item3aade95398:g:q94AAOSwPcVVo571:rk:2:pf:1&frcectupt=true) | 25$
 [<img src="extras/Images/mot2.jpg" style="height:100px">](https://www.ebay.com/itm/Brushless-Gimbal-Motor-BGM4108-130HS-for-DYS-BLG3SN-DSLR-Camera-Mount-DIY/281372437636?epid=1239081107&hash=item41831aac84:g:K3kAAOSwVFlT20du) | BGM4108-130HS |  - 24N22P <br> - 93g  <br> - 17Ω <br> - 46x25mm| [Ebay](https://www.ebay.com/itm/Brushless-Gimbal-Motor-BGM4108-130HS-for-DYS-BLG3SN-DSLR-Camera-Mount-DIY/281372437636?epid=1239081107&hash=item41831aac84:g:K3kAAOSwVFlT20du) | 30$
 [<img src="extras/Images/mot3.jpg" style="height:100px">](https://www.ebay.com/itm/Alloy-2208-90KV-Gimbal-Brushless-Motor-for-Gopro3-RC-Drone-Camera-100-200g/223195701385?hash=item33f7802089:g:cjUAAOSw1iVbyccJ) | 2208 90KV Gimbal motor |  - 12N14P <br> - 39g  <br> - 13-16Ω <br> - 29x25mm| [Ebay](https://www.ebay.com/itm/Alloy-2208-90KV-Gimbal-Brushless-Motor-for-Gopro3-RC-Drone-Camera-100-200g/223195701385?hash=item33f7802089:g:cjUAAOSw1iVbyccJ) | 15$
 [<img src="extras/Images/bigger.jpg" style="height:100px">](https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html) | GBM5108-120T |  - 24N22P <br> - 175g  <br> - 12.6Ω <br> - 60x24mm| [Onedrone](https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html) | 90$
 [<img src="extras/Images/big.jpg" style="height:100px">](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | GBM8017-120T | - 24N22P <br> - 318g  <br> - 14.7Ω <br> - 90x13mm| [Aliexpress](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 150$

# 高性能电机

云台电机只是所有无刷直流电机的一个子集。正如前面章节所建议的，当使用高扭矩（电流 > 5A），低电阻（~1Ω）无刷直流电机时（如无人机电机），请确保你的无刷直流驱动器可以支持必要的电流。 <span class="simple">Simple<span class="foc">FOC</span>library</span> 已经测试了几个高性能的无刷直流驱动程序 ([supported BLDC drivers list](drivers))。

例如，如果选择 [Aliexpress DRV8302 board ](https://bit.ly/2BZZ5fG) ，我们需要寻找峰值电流低于27A和连续电流为15A的电机。以下是一些适合这一类别的电机：

示例 | 描述 | 规格 | 链接 | 价格 
---- | ---- | ---- | ---- | ----
[<img src="extras/Images/n2830.png" style="height:100px">](https://ebay.to/2OTy7tk) | N2830 1000KV |  - 7.4-11.1V <br> - (max)20A  <br> - 0.104Ω <br> - 28 x 28mm| [Ebay](https://ebay.to/2OTy7tk) | 10$
[<img src="extras/Images/c2216.png" style="height:100px">](https://ebay.to/2ZZTT4S) | C2216 880KV |  - 7-18V <br> - (max)22A  <br> - 0.108Ω <br> - 28 x 34mm| [Ebay](https://ebay.to/2ZZTT4S) | 20$
  [<img src="extras/Images/ml4114.png" style="height:100px">](https://amzn.to/3f38b9p) | GARTT ML4114 330KV |  - 36V <br> - (max)25A  <br> - 0.1082Ω <br> - 40 x 20mm| [Amazon](https://amzn.to/3f38b9p) | 40$
 [<img src="extras/Images/jk42.png" style="height:100px">](https://amzn.to/3hB7h5r) | WJN-Motor JK42BL |  - 24V <br> - (max)15A  <br> - 0.8Ω <br> - 42 x 61mm| [Amazon](https://amzn.to/3hB7h5r) | 60$
 [<img src="extras/Images/mad5008.png" style="height:100px">](https://amzn.to/2OWwgE3) | MAD5008-240KV |  - 36V <br> - (max)22A  <br> - 0.08Ω <br> - 56 x 25mm|  [Amazon](https://amzn.to/2OWwgE3) | 60$