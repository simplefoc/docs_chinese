---
layout: default
title: 无刷直流电机 
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /bldc_motors
parent: 电机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 无刷直流电机 

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>支持大多数常见的三相无刷直流电机，包括
- [云台电机](#云台电机) - 低KV值（较高电阻~10Ω）
- [高性能无刷直流电机](#高性能电机) - 高KV值（低电阻<1Ω）。

## 云台电机

云台电机基本上可以与任何无刷直流电机驱动器一起工作，但由于高性能驱动器的电流测量电路是为大电流优化的，所以使用它们并没有任何优势。因此，对于云台电机来说，低功率无刷直流电机驱动器的性能与昂贵的高功率、高性能驱动器相当。在我看来这非常酷！😃 这也是开始开发<span class="simple">简易<span class="foc">FOC</span>扩展板</span>的主要动机之一。

云台电机的一些特点是：
- 低转速下高扭矩
- 运行非常平稳
- 内阻>10Ω
- 电流高达5A

云台电机用途广泛，其主要优点是在低速下运行非常平稳且扭矩大。它们可用于许多不同的应用，从高质量替代步进电机或直流伺服电机，到非常平稳的相机云台以及许多不同的机器人应用。一个非常有趣的用例是学生实验，无刷直流电机提供了高度的控制和动态性能，例如球板系统、倒立摆、平衡机器人等类似应用。
<blockquote class="info"> <p class="heading">示例</p>一定要查看使用<span class="simple">简易<span class="foc">FOC</span>库</span>、<span class="simple">简易<span class="foc">FOC</span>屏蔽板</span>和一个云台电机开发的<a href="simplefoc_pendulum">反作用轮倒立摆 <i class="fa fa-external-link"></i></a>。</blockquote>

以下是一些不同价格范围的云台电机示例，它们已成功通过该库的测试。

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | ---- | ----
[<img src="extras/Images/mot.jpg" style="height:100px">](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571) | IPower GBM4198H-120T | - 12N14P<br>- 98g<br>- 11.4Ω<br>- 45x25mm | [Ebay](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/252025852824?hash=item3aade95398:g:q94AAOSwPcVVo571:rk:2:pf:1&frcectupt=true) | 25美元
[<img src="extras/Images/mot2.jpg" style="height:100px">](https://www.ebay.com/itm/Brushless-Gimbal-Motor-BGM4108-130HS-for-DYS-BLG3SN-DSLR-Camera-Mount-DIY/281372437636?epid=1239081107&hash=item41831aac84:g:K3kAAOSwVFlT20du) | BGM4108-130HS | - 24N22P<br>- 93g<br>- 17Ω<br>- 46x25mm | [Ebay](https://www.ebay.com/itm/Brushless-Gimbal-Motor-BGM4108-130HS-for-DYS-BLG3SN-DSLR-Camera-Mount-DIY/281372437636?epid=1239081107&hash=item41831aac84:g:K3kAAOSwVFlT20du) | 30美元
[<img src="extras/Images/mot3.jpg" style="height:100px">](https://www.ebay.com/itm/Alloy-2208-90KV-Gimbal-Brushless-Motor-for-Gopro3-RC-Drone-Camera-100-200g/223195701385?hash=item33f7802089:g:cjUAAOSw1iVbyccJ) | 2208 90KV 云台电机 | - 12N14P<br>- 39g<br>- 13-16Ω<br>- 29x25mm | [Ebay](https://www.ebay.com/itm/Alloy-2208-90KV-Gimbal-Brushless-Motor-for-Gopro3-RC-Drone-Camera-100-200g/223195701385?hash=item33f7802089:g:cjUAAOSw1iVbyccJ) | 15美元
[<img src="extras/Images/bigger.jpg" style="height:100px">](https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html) | GBM5108-120T | - 24N22P<br>- 175g<br>- 12.6Ω<br>- 60x24mm | [Onedrone](https://www.onedrone.com/store/ipower-gbm5108-120t-gimbal-motor.html) | 90美元
[<img src="extras/Images/big.jpg" style="height:100px">](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | GBM8017-120T | - 24N22P<br>- 318g<br>- 14.7Ω<br>- 90x13mm | [Aliexpress](https://fr.aliexpress.com/item/32483131130.html?spm=a2g0o.productlist.0.0.6ddd749fFd3u9E&algo_pvid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb&algo_expid=a67f2ec1-5341-4f97-ba3e-720e24f6c4fb-10&btsid=0b0a187915885172220541390e7eed&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 150美元


## 高性能电机
云台电机只是所有无刷直流电机中的一个子集。如前几章所述，当使用高扭矩（电流>5A）、低电阻（~1Ω）的无刷直流电机（如无人机电机）时，请确保您的无刷直流驱动器能够支持所需的电流。<span class="simple">简易<span class="foc">FOC</span>库</span>已经通过几种高性能无刷直流驱动器的测试（[支持的无刷直流驱动器列表](drivers)）。

例如，如果我们仅限于[Aliexpress DRV8302 板](https://bit.ly/2BZZ5fG)，我们将寻找峰值电流低于27A且持续电流为15A的电机。以下是一些可以归入该类别的电机：

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | ---- | ----
[<img src="extras/Images/n2830.png" style="height:100px">](https://ebay.to/2OTy7tk) | N2830 1000KV | - 7.4-11.1V<br>- （最大）20A<br>- 0.104Ω<br>- 28 x 28mm | [Ebay](https://ebay.to/2OTy7tk) | 10美元
[<img src="extras/Images/c2216.png" style="height:100px">](https://ebay.to/2ZZTT4S) | C2216 880KV | - 7-18V<br>- （最大）22A<br>- 0.108Ω<br>- 28 x 34mm | [Ebay](https://ebay.to/2ZZTT4S) | 20美元
[<img src="extras/Images/ml4114.png" style="height:100px">](https://amzn.to/3f38b9p) | GARTT ML4114 330KV | - 36V<br>- （最大）25A<br>- 0.1082Ω<br>- 40 x 20mm | [Amazon](https://amzn.to/3f38b9p) | 40美元
[<img src="extras/Images/jk42.png" style="height:100px">](https://aliexpress.com/item/1005001858931568.html?gatewayAdapt=glo2fra) | WJN-Motor JK42BL | - 24V<br>- （最大）15A<br>- 0.8Ω<br>- 42 x 61mm | [Aliexpress](https://aliexpress.com/item/1005001858931568.html?gatewayAdapt=glo2fra) | 60美元
[<img src="extras/Images/mad5008.png" style="height:100px">](https://amzn.to/2OWwgE3) | MAD5008-240KV | - 36V<br>- （最大）22A<br>- 0.08Ω<br>- 56 x 25mm | [Amazon](https://amzn.to/2OWwgE3) | 60美元