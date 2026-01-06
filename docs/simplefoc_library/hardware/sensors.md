---
layout: default
title: 传感器
nav_order: 3
parent: 支持的硬件
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /position_sensors
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 位置传感器
该库目前支持以下类型的位置传感器：
- [编码器](#编码器)
- [磁性传感器](#磁性传感器)
- [霍尔传感器](#霍尔传感器)
- *IMU（开发中）*

## 编码器
编码器是目前工业界和爱好者社区中最常用的位置传感器。其主要优点是精度高、标准化程度高且噪声水平极低。<span class="simple">简易<span class="foc">FOC</span>库</span>几乎支持所有你能找到的编码器类型。以下是一个解释编码器主要工作原理的精彩短视频：[YouTube 视频](https://www.youtube.com/watch?v=qT6FdvcEsMs)

编码器位置跟踪（脉冲计数）算法的代码效率，尤其是在 Arduino 设备上的实现，是 FOC 算法性能和平滑度的主要限制因素之一。编码器精度和执行效率之间存在明显的权衡，因此为你的应用选择合适的编码器非常重要。

示例 | 描述 | 链接 | 价格
---- | ---- | ---- | ----
[<img src="extras/Images/enc.jpg"  style="height:100px">](https://www.ebay.com/itm/360-600P-R-Photoelectric-Incremental-Rotary-Encoder-5V-24V-AB-Two-Phases-Shaft/254214673272?hash=item3b30601378:m:mDiuW1F2qXINSH51TqAjhTg) | 光学编码器<br>2400cpr | [Ebay](https://www.ebay.fr/itm/L6234-Breakout-Board-/153204519965) | 10美元
[<img src="extras/Images/enc1.png" style="height:100px">](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | 光学编码器<br>AMT103<br>可配置 cpr 48-8192 | [Mouser](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | 20美元
[<img src="extras/Images/mag.jpg"  style="height:100px">](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D) | 磁性编码器<br>AS5047U<br>16384cpr | [Mouser](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D)<br>[YouTube 演示](https://www.youtube.com/watch?v=Gl-DiOqXXJ8) | 15美元



<blockquote class="warning">
<p class="heading">编码器 CPR：Arduino UNO 的经验法则</p>
对于 Arduino UNO，每秒的最大脉冲数不应超过 20,000。超过这个值后，就会开始出现执行问题。
选择编码器时，请考虑这一点，尤其是在使用多个电机的情况下。<br>
<p class="heading">示例</p>
如果你的 CPR 值为 10000，那么你的电机最大转速将能达到 120rpm - 2 转/秒
</blockquote>

## 磁性传感器
磁性位置传感器相比编码器有许多优势：
- 位置计算效率非常高（无需计数）
- 执行时间不取决于速度或传感器数量
- 不需要中断硬件
- 绝对位置值
- 价格低于编码器
- 安装简单

磁性传感器通常有几种不同的通信协议：
- ABI（✔️ 支持）- *与编码器接口完全相同*
- SPI（✔️ 支持）
- I2C（✔️ 支持）
- 模拟（✔️ 支持）
- UVW（✔️ 支持）- *与霍尔传感器接口完全相同*
- PWM（✔️ 支持）
- SSI

PWM 和 SSI 协议将测试其性能，并在后续步骤中实现。
如果您有兴趣实现其他通信方式，请[告诉我们](contact)！

以下是一些受支持的磁性传感器：

示例 | 描述 | 链接 | 价格
---- | ---- | ---- | ----
[<img src="extras/Images/mag.jpg"  style="height:100px">](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D) | AS5047<br>SPI/ABI/PWM/UVW<br>14位 | [Mouser](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D) | 15美元
[<img src="extras/Images/mag2.jpg"  style="height:100px">](https://www.ebay.com/itm/AS5048-Magnetic-Encoder-PWM-SPI-Interface-14-Bit-Precision-For-Brushless-Motor/153636871434?hash=item23c5789d0a:g:oOMAAOSwd-5ddaWQ) | AS5048A<br>SPI/PWM<br>绝对式<br>14位 | [Ebay](https://www.ebay.com/itm/AS5048-Magnetic-Encoder-PWM-SPI-Interface-14-Bit-Precision-For-Brushless-Motor/153636871434?hash=item23c5789d0a:g:oOMAAOSwd-5ddaWQ) | 10美元
[<img src="extras/Images/as5600.jpg"  style="height:100px">](https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK) | AS5600<br>I2C/PWM<br>12位 | [Ebay](https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK) | 5美元


<blockquote class="warning"><p class="heading">注意：I2C 上拉电阻</p>
并非所有 I2C 总线都需要上拉电阻。但在某些情况下可能是必要的。特别是使用 STM32 开发板时。在这些情况下，你将无法与传感器通信。
为了实现通信，通常需要在 5V/3.3V 与 SCL 和 SDA 通道之间连接 4.7kOhm 的电阻。以下是一个关于此问题的很好的 stack overflow 问题：<a href="https://electronics.stackexchange.com/questions/102611/what-happens-if-i-omit-the-pullup-resistors-on-i2c-lines">链接</a>。
<br>
在未来版本的 <span class="simple">简易<span class="foc">FOC</span> Shield</span> 中，我将尝试也包含这些上拉电阻。
</blockquote>

<blockquote class="warning"><p class="heading">注意：UVW 接口</p>
如果您希望使用磁性传感器的 UVW 接口，请确保将磁性传感器配置为与电机具有相同的极对数。此外，请注意磁性传感器和电机相位的对齐非常重要，可能需要一些时间来实现。
</blockquote>

## 霍尔传感器

霍尔传感器在过去的 FOC 控制中非常常见，因为它们的换向简单。电机通常配备 3 个霍尔传感器，用于读取转子磁铁位置，并能以 60 度的分辨率确定电机的电角度。

扇区 | 电角度 | Hall A | Hall B | Hall C
--- | ---| -- | - | -
1 | 0-60 | 1 | 0 | 1
2 | 60-120 | 1 | 0 | 0
3 | 120-180 | 1 | 1 | 0
4 | 180-240 | 0 | 1 | 0
5 | 240-300 | 0 | 1 | 1
6 | 300-360 | 0 | 0 | 1

这些传感器的主要优点是非常便宜，并且几乎可以添加到任何 BLDC 电机上。但如今，随着磁性传感器的出现，它们的使用越来越少。这些传感器的主要缺点之一是由于角度测量的量化程度较高，低速运行不平稳。

这些传感器的主要应用领域是各种运输车辆中的电动机。它们的电机通常功率非常高，在如此高的电流和磁场下，依赖任何类型的通信（I2C、SPI、SSI 等）都不是一个好选择。使用霍尔传感器的另一个原因是如果你无法接触到电机轴，或者无法将传感器与电机轴同轴安装。霍尔传感器安装在电机转子周围，这使得它们非常不具侵入性且易于集成。

你可以在任何电子供应商处找到霍尔传感器 IC，从 Ebay 和 Aliexpress 到 Mouser 和 Digikey，也可以在大多数当地电子商店找到。

示例 | 描述 | 链接 | 价格
---- | ---- | ---- | ----
[<img src="extras/Images/hall.png"  style="height:100px">](https://fr.aliexpress.com/item/32590021901.html?spm=a2g0o.productlist.0.0.6eec671cZA32JT&algo_pvid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a&algo_expid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a-58&btsid=0b8b035915993735716435630eb78b&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 49E 霍尔传感器（10个） | [Aliexpress](https://fr.aliexpress.com/item/32590021901.html?spm=a2g0o.productlist.0.0.6eec671cZA32JT&algo_pvid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a&algo_expid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a-58&btsid=0b8b035915993735716435630eb78b&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 1美元

如果适合你的应用，你也可以考虑购买集成霍尔效应传感器的 BLDC 电机。

示例 | 描述 | 链接 | 价格
---- | ---- | ---- | ----
[<img src="extras/Images/hall1.png"  style="height:100px">](https://fr.aliexpress.com/item/4000086664014.html?spm=a2g0o.productlist.0.0.338073065g29WW&s=p&ad_pvid=20200905233621305169369584280003211148_6&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-29&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | BLDC 电机<br>集成霍尔传感器<br>100W | [Aliexpress](https://fr.aliexpress.com/item/4000086664014.html?spm=a2g0o.productlist.0.0.338073065g29WW&s=p&ad_pvid=20200905233621305169369584280003211148_6&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-29&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 40美元
[<img src="extras/Images/hallw.png"  style="height:100px">](https://fr.aliexpress.com/item/4000242695485.html?spm=a2g0o.productlist.0.0.338073065g29WW&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-17&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | BLDC 电机<br>集成霍尔传感器<br>30W | [Aliexpress](https://fr.aliexpress.com/item/4000242695485.html?spm=a2g0o.productlist.0.0.338073065g29WW&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-17&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 25美元

<blockquote class="warning"><p class="heading">电机选择</p>
购买 BLDC 电机前，请务必阅读 <a href="motors">支持的电机文档</a>。
</blockquote>
      