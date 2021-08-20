---
layout: default
title: 支持的传感器
nav_order: 3
parent: 支持的硬件
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /position_sensors
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 位置传感器

该库目前支持的位置传感器类型 ([releases <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases))：

- [编码器](#encoders) 
- [磁传感器](#magnetic-sensors)
- [霍尔传感器](#hall-sensors)
- *IMU (研发中)*

# 编码器

无论在工业和业余社区，编码器都是目前最受欢迎的位置传感器。它的主要优点是精度高、标准化和噪音低。SimpleFOClibrary几乎支持市面上所有类型的编码器。下面这个短视频解释了编码器的主要工作原理：[YouTube video](https://www.youtube.com/watch?v=qT6FdvcEsMs)

制约FOC算法性能和平滑度的主要因素之一是编码器位置跟踪（脉冲计数）算法的效率，尤其是在Arduino设备上的实现的代码效率。在编码器精度和执行效率之间最好有一个明显的权衡，因此为你的应用程序找到一个合适的编码器非常重要。

示例型号  | 描述 | 链接 | 价格 
---- | ---- | ---- | ----
[<img src="extras/Images/enc.jpg"  style="height:100px">](https://www.ebay.com/itm/360-600P-R-Photoelectric-Incremental-Rotary-Encoder-5V-24V-AB-Two-Phases-Shaft/254214673272?hash=item3b30601378:m:mDiuW1F2qXINSH51TqAjhTg)  | Optical encoder<br>2400cpr | [Ebay](https://www.ebay.fr/itm/L6234-Breakout-Board-/153204519965) | 10$
[<img src="extras/Images/enc1.png" style="height:100px">](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | Optical encoder<br>AMT103 <br> configurable cpr 48-8192 |  [Mouser](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D)  | 20$
[<img src="extras/Images/mag.jpg"  style="height:100px">](hhttps://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D) | Margetic encoder <br> AS5047U <br> 16384cpr |  [Mouser](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D)<br> [Youtube demo](https://www.youtube.com/watch?v=Gl-DiOqXXJ8)   | 15$



<blockquote class="warning">
<p class="heading">编码器CPR的选择: Arduino UNO的经验法则</p>
对于Arduino UNO，最大脉冲数每秒最好不要超过20,000。在这个值之后，它的执行会出现问题。请在选择编码器时考虑到这一点，特别是如果使用多个电机。<br>
<p class="heading">例如</p>
如果你的CPR值是10000，你的电机的最大测得准的转速就是120转，即2转每秒
</blockquote>




# 磁传感器

磁位置传感器与其他编码器相比有许多优点：

- 高效位置计算（无需计算步进）
- 执行时间并不依赖于速度或传感器的数量
- 不需要中断硬件
- 可获得绝对位置值
- 价格便宜
- 易于安装

磁传感器通常带有几种不同的通信协议：

- ABI (✔️ 支持)
- SPI (✔️ 支持)
- I2C (✔️ 支持)
- 模拟信号 (✔️ 支持)
- UVW (✔️ 支持) —等同于霍尔传感器接口
- PWM (✔️ 支持)
- SSI 

PWM和SSI正在开发测试中，如果你有兴趣参与测试,请 [让我们知道](contact)

这里是一些支持的磁传感器：

选型示例  | 描述 | 链接 | 价格 
---- | ---- | ---- | ----
[<img src="extras/Images/mag.jpg"  style="height:100px">](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D) | AS5047<br> SPI/ABI/PWM/UVW <br> 14位 |  [Mouser](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D) | 15$
[<img src="extras/Images/mag2.jpg"  style="height:100px">](https://www.ebay.com/itm/AS5048-Magnetic-Encoder-PWM-SPI-Interface-14-Bit-Precision-For-Brushless-Motor/153636871434?hash=item23c5789d0a:g:oOMAAOSwd-5ddaWQ) | AS5048A<br> SPI/PWM <br> absolute <br> 14位 |  [Ebay](https://www.ebay.com/itm/AS5048-Magnetic-Encoder-PWM-SPI-Interface-14-Bit-Precision-For-Brushless-Motor/153636871434?hash=item23c5789d0a:g:oOMAAOSwd-5ddaWQ) | 10$
[<img src="extras/Images/as5600.jpg"  style="height:100px">](https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK) | AS5600 <br> I2C/PWM <br> 12位 | [Ebay](https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK) | 5$ 

<blockquote class="warning"><p class="heading">注意：12C 上拉</p>
并不是所有的12C 总线都需要上拉电阻。但在某些情况下，它们可能是必要的。特别是使用STM32板时。在这些情况下，不上拉的话你将无法与传感器通信。为了实现通信，通常需要在5V/3.3V和SCL和SDA通道之间安装4.7k欧电阻。关于这个问题具体可查看<a href="https://electronics.stackexchange.com/questions/102611/what-happens-if-i-omit-the-pullup-resistors-on-i2c-lines"> link </a>. 
<br>
在<span class="simple">Simple<span class="foc">FOC</span>Shield</span>的未来版本中，我也将尝试包括这些上拉方式。
</blockquote>

<blockquote class="warning"><p class="heading">注意：UVW接口</p>
如果你希望使用磁传感器的UVW接口，请确保将你的磁传感器配置为与电机具有相同的极对数。还要注意磁传感器和电机相位的对齐是非常重要的，可能需要一些时间来耐心调整。
</blockquote>



# 霍尔传感器

由于霍尔传感器通讯方式简单，因此过去已被广泛用于FOC控制。电机通常装有3个霍尔传感器，读取转子磁铁位置，并能以60度的分辨率确定电机的电角度。

情况 | 电角度 | Hall A | Hall B | Hall C
--- | ---| -- | - | - 
 1| 0-60 | 1 | 0 | 1
 2| 60-120 | 1 | 0 | 0  
 3| 120-180 | 1 | 1 | 0
 4| 180-240 | 0 | 1 | 0 
 5| 240-300 | 0 | 1 | 1  
 3| 300-360 | 0 | 0 | 1

这些传感器的主要优点是它们非常便宜，而且可以安装在任何无刷直流电机上。如今，随着磁传感器的出现，它们被使用得越来越少。而这类传感器的主要缺点是因角度测量的步进值太高导致低速运行不平稳。


这类传感器的主要应用领域是各种运输车辆上的电动机。他们支持的电机通常功率很高，而可以依赖于任一类型通信方式(12C, SPI, SSI ...)并且支持如此高的电流和磁场的传感器仅此一种。此外，使用霍尔传感器的另一个原因是，如果你不能操作电机轴或者不能将传感器同轴安装到电机轴。霍尔传感器可以安装在电机转子周围，这使得它们无需插入且易于集成。

你可以在任何电子产品供应商中找到霍尔传感器，从淘宝、Ebay、Aliexpress到Mouser、Digikey。

选型示例  | 描述 | 链接                                                         | 价格 
---- | ---- | ---- | ----
[<img src="extras/Images/hall.png"  style="height:100px">](https://fr.aliexpress.com/item/32590021901.html?spm=a2g0o.productlist.0.0.6eec671cZA32JT&algo_pvid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a&algo_expid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a-58&btsid=0b8b035915993735716435630eb78b&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) |  49E Hall Sensor (10x) |  [Aliexpress](https://fr.aliexpress.com/item/32590021901.html?spm=a2g0o.productlist.0.0.6eec671cZA32JT&algo_pvid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a&algo_expid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a-58&btsid=0b8b035915993735716435630eb78b&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 1$

如果这与你的应用程序相匹配，你可以考虑购买带集成霍尔传感器的电机。

选型示例  | 描述 | 链接 | 价格 
---- | ---- | ---- | ----
[<img src="extras/Images/hall1.png"  style="height:100px">](https://fr.aliexpress.com/item/4000086664014.html?spm=a2g0o.productlist.0.0.338073065g29WW&s=p&ad_pvid=20200905233621305169369584280003211148_6&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-29&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 无刷电机 <br>带霍尔传感器款<br> 100W |  [Aliexpress](https://fr.aliexpress.com/item/4000086664014.html?spm=a2g0o.productlist.0.0.338073065g29WW&s=p&ad_pvid=20200905233621305169369584280003211148_6&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-29&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 40$
[<img src="extras/Images/hallw.png"  style="height:100px">](https://fr.aliexpress.com/item/4000242695485.html?spm=a2g0o.productlist.0.0.338073065g29WW&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-17&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 无刷电机 <br>带霍尔传感器款<br> 30W  |  [Aliexpress](https://fr.aliexpress.com/item/4000242695485.html?spm=a2g0o.productlist.0.0.338073065g29WW&algo_pvid=e2271fc5-6c48-4ca9-9961-ed620ada16d6&algo_expid=e2271fc5-6c48-4ca9-9961-ed620ada16d6-17&btsid=0b8b034515993741819075226e8e8e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 25$

<blockquote class="warning"><p class="heading">选择电机</p>
在购买BLDC电机之前，请务必阅读<a href="motors">支持的电机</a>
</blockquote>