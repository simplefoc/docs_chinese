---
layout: default
title: 无刷直流电机驱动器
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /bldc_drivers
parent: 驱动板
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 无刷直流电机驱动器
该库将与大多数三相无刷直流电机驱动器兼容。例如 [<i class="fa fa-file"></i> L6234](https://www.st.com/en/motor-drivers/l6234.html)、[<i class="fa fa-file"></i> DRV8305](https://www.ti.com/product/DRV8305)、[<i class="fa fa-file"></i> DRV8313](https://www.ti.com/product/DRV8313)，甚至 [<i class="fa fa-file"></i> L293](http://www.ti.com/lit/ds/symlink/l293.pdf)。

目前，低成本的无刷直流电机驱动板仍然相对难以找到，这使得我们的硬件选择相当有限。这也是开发 <span class="simple">简易<span class="foc">FOC</span>扩展板</span>（一种多功能且简单的无刷直流电机驱动器）的动机之一。幸运的是，社区在这方面正开始势头渐增，无刷直流电机很可能在不久的将来也成为业余爱好者社区的标准，这真的很令人兴奋！😃

在项目中需要哪种无刷直流电机驱动器，直接取决于所使用的无刷直流电机。因此，我们可以将它们分为两类：
- [低功率无刷直流电机驱动器](#低功率驱动板---云台电机-) - *云台电机（电阻>10Ω）*
- [高性能无刷直流电机驱动器](#高性能驱动板) - *大功率无刷直流电机（电阻<1Ω）*

## 低功率驱动板 （云台电机）
以下是一些专为云台电机设计的无刷直流电机驱动板，可直接与该库配合使用。云台电机通常有超过10个极对，内部电阻>10Ω。它们设计用于低速下的非常平稳运行。云台电机用途广泛，非常适合高质量地替代步进电机和直流伺服电机。

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | ---
[<img src="https://simplefoc.com/assets/img/v1.jpg" style="height:100px">](https://simplefoc.com/simplefoc_shield_product)| Arduino<br> <span class="simple">简易<span class="foc">FOC</span>扩展板</span> v1| - L6234芯片 <br> - 8-24V <br> - 最大5安培 <br> - 1个电机 <br>- Arduino扩展板 <br> - 编码器+I2C上拉电阻 | [更多信息](https://simplefoc.com/simplefoc_shield_product) | 15欧元
[<img src="https://simplefoc.com/assets/img/v2.jpg" style="height:100px">](https://simplefoc.com/simplefoc_shield_product)| Arduino<br> <span class="simple">简易<span class="foc">FOC</span>扩展板</span> v2| - L6234芯片 <br> - 8-24V <br> - 最大5安培 <br> - 1个电机 <br>- Arduino扩展板 <br> - 编码器+I2C上拉电阻 <br> - 串联电流检测 <br> - 板载稳压器 | [简易FOC商店](https://simplefoc.com/simplefoc_shield_product_v2) <br> [阿里巴巴国际站](https://fr.aliexpress.com/item/1005002496275228.html?spm=a2g0o.productlist.0.0.51b44925t9nr53&algo_pvid=42a7dd52-305b-4cb0-af17-60a892aaad3a&algo_exp_id=42a7dd52-305b-4cb0-af17-60a892aaad3a-0&pdp_ext_f=%7B%22sku_id%22%3A%2212000020877377792%22%7D#feedback) <br> [易贝](https://www.ebay.com/itm/165027599242?hash=item266c69538a:g:bZIAAOSw8QJg9mvD)| 约20欧元
[<img src="extras/Images/mini.png" style="height:100px">](https://github.com/simplefoc/SimpleFOCMini) | <span class="simple">简易<span class="foc">FOC</span>迷你板</span> v1 | - DRV8313芯片 <br> - 8-30V <br> - 最大2.5安培 <br> - 板载3.3V低压差稳压器 <br> - 1个电机 <br> - 21x26毫米 | [简易FOC商店](https://simplefoc.com/shop)<br> [阿里巴巴国际站](https://fr.aliexpress.com/item/1005005866301316.html?spm=a2g0o.productlist.main.15.6654IW63IW63Ci&algo_pvid=31b447fa-3006-48a9-9fc7-c058fba95965&algo_exp_id=31b447fa-3006-48a9-9fc7-c058fba95965-7&pdp_npi=4%40dis%21EUR%214.23%214.23%21%21%214.43%214.43%21%40211b600e17142231512592395e5343%2112000034628489263%21sea%21FR%21179781912%21AC&curPageLogUid=GMs1Q35zslL1&utparam-url=scene%3Asearch%7Cquery_from%3A)<i></i> | 5-15欧元
[<img src="extras/Images/l6234.jpg" style="height:100px">](https://www.ebay.com/itm/L6234-Breakout-Board/153204519965?hash=item23abb3741d:g:LE4AAOSwe35bctgg) | Drotek L6234<br>  转接板 | - L6234芯片 <br> - 1个电机 <br> - 25x25毫米 | [Drotek](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)<br> [易贝](https://www.ebay.fr/itm/L6234-Breakout-Board-/153204519965) | 30欧元
[<img src="extras/Images/dual_simplefoc.jpg" style="height:100px">](https://github.com/ToanTech/Deng-s-foc-controller) | Deng FOC控制器<br> 转接板 | - L6234芯片 <br> - 8-24V <br> - 最大5安培 <br> - 2个电机 <br> - 39x56毫米 | [阿里巴巴国际站](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)<br> [易贝](https://www.ebay.com/itm/373690016017?hash=item5701a92111:g:YkYAAOSwF8ZhHgi3) | 35-50欧元

此外，您可以找到集成了无刷直流电机驱动器和微控制器芯片的云台控制器板。

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | ---
[<img src="extras/Images/pinout.jpg" style="height:100px">](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | HMBGC V2.2 | - 4599场效应管<br> - 2个电机  <br> - 50x30毫米 <br> - Atmega328 | [易贝](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | 20欧元
[<img src="extras/Images/bgc_30.jpg" style="height:100px">](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | BGC 3.0 | - 4599场效应管<br> - 2个电机  <br> - 50x50毫米 <br> - Atmega328 | [阿里巴巴国际站](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 10欧元
[<img src="extras/Images/bgc31.jpg" style="height:100px">](https://www.ebay.com/itm/BGC-3-1-MOS-Large-Current-Two-Axis-Brushless-Gimbal-Controller-Driver-Alexmos/302692769869?hash=item4679e5204d:g:m9AAAOSweHtdzM8o) | BGC 3.1  | - l6234<br> - 2个电机  <br> - 50x50毫米 <br> - Atmega328 | [易贝](https://www.ebay.com/itm/BGC-3-1-MOS-Large-Current-Two-Axis-Brushless-Gimbal-Controller-Driver-Alexmos/302692769869?hash=item4679e5204d:g:m9AAAOSweHtdzM8o) | 10欧元
[<img src="extras/Images/strom.jpg" style="height:100px">](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | Storm32 BGC | - DRV8313 <br> - 3个电机  <br> - 50x50毫米 <br> - Stm32f103 | [易贝](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | 25欧元

最后，运行云台无刷直流电机的最便宜解决方案之一是使用双直流电机驱动器，例如：

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | ---
[<img src="extras/Images/l298n.jpg" style="height:100px">](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df)| 步进驱动器L298N| - L298N芯片 <br> - 1个电机 <br>- 5V-35V <br> - 2A（单个桥臂最大值） | [易贝](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df) | 2欧元

<blockquote class="warning">
<p class="heading">L298N的局限性</p>
L298N基于双极晶体管技术，晶体管上升时间相对较长，可能导致运行不平稳。
我们建议仅在闭环模式下使用基于L298N的驱动板，因为位置传感器可以纠正驱动器可能产生的噪声。
对于初学者来说，它也可能是一个很好的板子，可以作为一种廉价的解决方案来熟悉FOC，但有一定的性能限制。
</blockquote>

## 高性能驱动板
<span class="simple">简易<span class="foc">FOC</span>库</span>基本上支持任何可以使用3路PWM或6路PWM信号控制的无刷直流电机驱动器。此外，具有电流检测功能的驱动器可以直接控制扭矩，而所有其他驱动器可以使用估计电流（[更多信息](voltage_torque_control)）。

以下是经过测试且与该库兼容的驱动板：

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | ---
[<img src="extras/Images/drv8302.png" style="height:100px">](https://fr.aliexpress.com/item/4000126430773.html?spm=a2g0o.productlist.0.0.702a312aXmzuUK&algo_pvid=50131a88-ac88-4755-bb71-978c07ec461e&algo_expid=50131a88-ac88-4755-bb71-978c07ec461e-5&btsid=0b0a119a15957548552557385e6f5e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_)| DRV8302驱动器 | - DRV8302芯片 <br> - 1个电机 <br>- 45V/27A <br> - 反电动势/电流检测  <br> - 故障保护| [阿里巴巴国际站](https://fr.aliexpress.com/item/4000126430773.html?spm=a2g0o.productlist.0.0.702a312aXmzuUK&algo_pvid=50131a88-ac88-4755-bb71-978c07ec461e&algo_expid=50131a88-ac88-4755-bb71-978c07ec461e-5&btsid=0b0a119a15957548552557385e6f5e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 30欧元
[<img src="extras/Images/drv8301.png" style="height:100px">](https://fr.aliexpress.com/item/4000203180955.html?spm=a2g0o.productlist.0.0.39871962xgolNI&algo_pvid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e&algo_expid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e-4&btsid=0b0a01f815957554085321097e9fdf&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_)| DRV8301驱动器 | - DRV8301芯片 <br> - 1个电机 <br>- 45V/27A <br> - 反电动势/电流检测  <br> - 故障保护 <br> - SPI配置| [阿里巴巴国际站](https://fr.aliexpress.com/item/4000203180955.html?spm=a2g0o.productlist.0.0.39871962xgolNI&algo_pvid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e&algo_expid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e-4&btsid=0b0a01f815957554085321097e9fdf&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 45欧元
[<img src="extras/Images/B-G431B-ESC1_SPL.jpg" style="height:100px">](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html)| B-G431B-ESC1 | - STM32G431CB芯片 <br> - 板载ST-LINK/V2-1 <br> - 1个电机 <br>- 30V/40A <br> - 低侧电流检测  <br> - 故障保护     | [意法半导体网站](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html) <br> [贸泽电子](https://eu.mouser.com/ProductDetail/STMicroelectronics/B-G431B-ESC1/?qs=%2Fha2pyFaduj9HtQf9%2FgsBmvGqEl7EbEPOyTxg06xIidkuUIykXhpkA%3D%3D) | 16欧元
[<img src="extras/Images/SHIELD_IFX007T.jpg" style="height:100px">](https://www.infineon.com/cms/en/product/evaluation-boards/bldc-shield_ifx007t/)| 英飞凌 <br> BLDC-SHIELD_IFX007T扩展板 | -  IFX007T半桥 <br> - 1个电机 <br>- 40V/30A <br> - 反电动势/低侧电流检测  <br> - 故障保护 | [英飞凌](https://www.infineon.com/cms/en/product/evaluation-boards/bldc-shield_ifx007t/) | 40欧元
[<img src="https://simplefoc.com/assets/img/dagor/Dagor_iso.png" style="height:120px">](https://github.com/byDagor/Dagor-Brushless-Controller)| [@byDagor](https://github.com/byDagor) <br> Dagor无刷控制器 | -  DRV8305驱动器 <br> - 1个电机 <br>- 25V/40A <br> - 电流检测  <br> - 集成传感器<br> - 基于Esp32<br> - 故障保护 | [简易FOC商店](https://simplefoc.com/shop)<br> <i>alpha批次已售罄</i> | 40欧元
[<img src="extras/Images/powershield.jpg" style="height:120px">](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield)| Arduino<br> <span class="simple">简易<span class="foc">FOC</span><span class="power">功率</span>扩展板</span> | -  BTN8982半桥 <br> - 1个电机 <br>- 40V/30A<br> - 故障保护 <br> <b>版本v1：</b> <br> - 串联电流检测  <br> - I2C/霍尔/编码器上拉电阻*<br> - 2x可堆叠*    |  [制作](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield)  | 约20欧元
[<img src="extras/Images/high_perf_new.png" style="height:100px">](https://github.com/ChenDMLSY/FOC-SimpleFOC-MotorDriveDevelopmentBoard)| FOC-简易FOC-电机驱动开发板 | - IR2103驱动器 <br> - 1个电机 <br>- 36V/20A <br> - 低侧电流检测| [阿里巴巴国际站](https://fr.aliexpress.com/item/1005002852603523.html?spm=a2g0o.productlist.0.0.76861dc3dEgETJ&algo_pvid=48101b3f-ba22-40b0-b6de-421d79a675b8&algo_exp_id=48101b3f-ba22-40b0-b6de-421d79a675b8-2&pdp_ext_f=%7B%22sku_id%22%3A%2212000022467783080%22%7D) [易贝](https://www.ebay.com/itm/373689972247?hash=item5701a87617:g:i0IAAOSwrKlhHf~r) | 30欧元
[<img src="extras/Images/odrive.jpg" style="height:100px">](https://odriverobotics.com/shop/odrive-v36)| ODRIVE V3.6 |  - 需要STlink编程器 <br> - 2个电机 <br>- 12-48V <br> - 60A（峰值120A） <br> - 低侧电流检测| [阿里巴巴国际站](https://www.aliexpress.com/item/1005002349959313.html?spm=a2g0o.productlist.0.0.6248381eOCYTRO&algo_pvid=30554e7d-0b77-44fc-a790-e35040ce3de9&algo_exp_id=30554e7d-0b77-44fc-a790-e35040ce3de9-0&pdp_ext_f=%7B%22sku_id%22%3A%2212000020231141543%22%7D) <br> [ODrive商店](https://odriverobotics.com/shop) | 70-100欧元 <br> 200欧元


<blockquote class="warning">
<p class="heading">IFX007T和BTN8982芯片的局限性</p>
IFX007T和BTN8982基于相对较旧的晶体管技术，晶体管上升时间相对较长，可能导致运行不平稳。
我们建议仅在闭环模式下使用基于这些芯片的驱动板，因为位置传感器可以纠正驱动器可能产生的噪声。
对于初学者来说，它也可能是一个很好的板子，可以作为一种廉价的解决方案来熟悉大电流FOC，但有一定的性能限制。
</blockquote>