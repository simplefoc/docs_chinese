---
layout: default
title: BLDC drivers
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /bldc_drivers
parent: Drivers
grand_parent: Supported Hardware
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 无刷直流电机驱动器

这个库将与大多数3相无刷直流电机驱动器兼容。如 [<i class="fa fa-file"></i> L6234](https://www.st.com/en/motor-drivers/l6234.html), [<i class="fa fa-file"></i> DRV8305](https://www.ti.com/product/DRV8305), [<i class="fa fa-file"></i> DRV8313](https://www.ti.com/product/DRV8313)  甚至 [<i class="fa fa-file"></i> L293](http://www.ti.com/lit/ds/symlink/l293.pdf). 

目前，低成本的无刷直流驱动板仍然很难找到，这使得我们对硬件的选择受到了很大的限制。这是开发这款通用且简单的无刷直流驱动器<span>Simple<span>FOC</span>Shield</span>的动机之一。幸运的是，社区已经开始在这个方向不断发展，无刷直流电机成为爱好社区的标准指日可待，这真是令人兴奋！😃

你需要在你的项目选择什么样的无刷直流驱动器，直接取决于你正在使用的无刷直流电机。我们可以将其分为两组：

- [低功率无刷直流电机驱动器](#low-power-boards---gimbal-motors-) - 云台电机 (R>10Ω)
- [高性能无刷直流电机驱动器](#high-performance-boards) - 大功率无刷直流电机(R<1Ω)

# 低功率板（云台电机）

以下的一些无刷直流驱动板是为云台电机和现成的library库专门设计的。云台电机通常极对数大于10，内阻&gt;10Ω。它们在低速时具有非常稳定的性能。云台电机非常通用，能够高质完美的替代步进电机和直流伺服电机。

| 示例                                                         | 描述                                                         | 规格                                                         | 链接                                                         | 价格 |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| [<img src="https://simplefoc.com/assets/img/v1.jpg" style="height:100px">](https://simplefoc.com/simplefoc_shield_product) | Arduino<br> <span class="simple">Simple<span class="foc">FOC</span>Shield</span>v1 | - L6234 芯片<br> - 1 motor <br>- Arduino Shield <br> - Encoder+I2C Pullups | [更多信息](https://simplefoc.com/simplefoc_shield_product)   | 15€  |
| [<img src="https://simplefoc.com/assets/img/v2.jpg" style="height:100px">](https://simplefoc.com/simplefoc_shield_product) | Arduino<br> <span class="simple">Simple<span class="foc">FOC</span>Shield</span>v2 | - L6234 芯片<br> - 1 motor <br>- Arduino Shield <br> - Encoder+I2C Pullups <br> - In-line 电流检测<br> - 车载电压调节器 | [更多信息](https://simplefoc.com/simplefoc_shield_product_v2) | 20€  |
| [<img src="extras/Images/l6234.jpg" style="height:100px">](https://www.ebay.com/itm/L6234-Breakout-Board/153204519965?hash=item23abb3741d:g:LE4AAOSwe35bctgg) | Drotek L6234<br> breakout board                              | - L6234 芯片 <br> - 1 motor <br> - 25x25mm                   | [Drotek](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)<br> [Ebay](https://www.ebay.fr/itm/L6234-Breakout-Board-/153204519965) | 30€  |

或者，你也可以找到集成无刷直流驱动器和微型控制器芯片的云台电机控制板。

| 示例                                                         | 描述        | 规格                                                         | 链接                                                         | 价格 |
| ------------------------------------------------------------ | ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| [<img src="extras/Images/pinout.jpg" style="height:100px">](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | HMBGC V2.2  | - 4599 mosfet<br> - 2 motors  <br> - 50x30mm <br> - Atmega328 | [Ebay](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | 20€  |
| [<img src="extras/Images/bgc_30.jpg" style="height:100px">](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | BGC 3.0     | - 4599 mosfet<br> - 2 motors  <br> - 50x50mm <br> - Atmega328 | [Aliexpress](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 10€  |
| [<img src="extras/Images/bgc31.jpg" style="height:100px">](https://www.ebay.com/itm/BGC-3-1-MOS-Large-Current-Two-Axis-Brushless-Gimbal-Controller-Driver-Alexmos/302692769869?hash=item4679e5204d:g:m9AAAOSweHtdzM8o) | BGC 3.1     | - l6234<br> - 2 motors  <br> - 50x50mm <br> - Atmega328      | [Ebay](https://www.ebay.com/itm/BGC-3-1-MOS-Large-Current-Two-Axis-Brushless-Gimbal-Controller-Driver-Alexmos/302692769869?hash=item4679e5204d:g:m9AAAOSweHtdzM8o) | 10€  |
| [<img src="extras/Images/strom.jpg" style="height:100px">](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | Storm32 BGC | - DRV8313 <br> - 3 motors  <br> - 50x50mm <br> - Stm32f103   | [Ebay](https://www.ebay.com/itm/Storm32-BGC-32Bit-3-Axis-Brushless-Gimbal-Controller-V1-32-DRV8313-Motor-Driver/174343022855?hash=item2897a76907:g:20YAAOSwbEhfBo28) | 25€  |

最后，运行云台电机最便宜的解决方案之一是使用双直流电机驱动器，如:

| 示例                                                         | 描述                 | 规格                                                         | 链接                                                         | 价格 |
| ------------------------------------------------------------ | -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| [<img src="extras/Images/l298n.jpg" style="height:100px">](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df) | Stepper driver L298N | - L298N  芯片<br> - 1 motor <br>- 5V-35V <br> - 2A(MAX single bridge) | [Ebay](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df) | 2€   |

## 高性能驱动板
<span>Simple<span>FOC</span>library</span>基本支持任何可以使用3路PWM或6路PWM信号控制的无刷直流电机驱动器。到目前为止([version 1.3.1](https://github.com/simplefoc/Arduino-FOC/releases))，library库还没有实现电流控制环。电机力矩通过电压直接控制([更多信息](voltage_torque_control))

以下是经测试，与library库兼容的驱动板：

示例|描述|规格|链接|价格
---- | ---- | ---- | --- | --- 
[<img src="extras/Images/drv8302.png" style="height:100px">](https://fr.aliexpress.com/item/4000126430773.html?spm=a2g0o.productlist.0.0.702a312aXmzuUK&algo_pvid=50131a88-ac88-4755-bb71-978c07ec461e&algo_expid=50131a88-ac88-4755-bb71-978c07ec461e-5&btsid=0b0a119a15957548552557385e6f5e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_)| DRV8302 driver | - DRV8302 芯片 <br> - 1 motor <br>- 45V/27A <br> - BEMF/current sensing  <br> - fault protection | [Aliexpress](https://fr.aliexpress.com/item/4000126430773.html?spm=a2g0o.productlist.0.0.702a312aXmzuUK&algo_pvid=50131a88-ac88-4755-bb71-978c07ec461e&algo_expid=50131a88-ac88-4755-bb71-978c07ec461e-5&btsid=0b0a119a15957548552557385e6f5e&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 30€
[<img src="extras/Images/drv8301.png" style="height:100px">](https://fr.aliexpress.com/item/4000203180955.html?spm=a2g0o.productlist.0.0.39871962xgolNI&algo_pvid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e&algo_expid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e-4&btsid=0b0a01f815957554085321097e9fdf&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_)| DRV8301 driver | - DRV8301 芯片<br> - 1 motor <br>- 45V/27A <br> - BEMF/current sensing  <br> - fault protection <br> - SPI configuration | [Aliexpress](https://fr.aliexpress.com/item/4000203180955.html?spm=a2g0o.productlist.0.0.39871962xgolNI&algo_pvid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e&algo_expid=a86f85ad-3d0b-46cd-a05a-cb7c89e92c9e-4&btsid=0b0a01f815957554085321097e9fdf&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 45€
[<img src="extras/Images/B-G431B-ESC1_SPL.jpg" style="height:100px">](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html)| B-G431B-ESC1 | - STM32G431CB 芯片 <br> - On-board ST-LINK/V2-1 <br> - 1 motor <br>- 30V/40A <br> - current sensing  <br> - fault protection     | [STM webiste](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html) <br> [Mouser](https://eu.mouser.com/ProductDetail/STMicroelectronics/B-G431B-ESC1/?qs=%2Fha2pyFaduj9HtQf9%2FgsBmvGqEl7EbEPOyTxg06xIidkuUIykXhpkA%3D%3D) | 16€
[<img src="extras/Images/SHIELD_IFX007T.jpg" style="height:100px">](https://www.infineon.com/cms/en/product/evaluation-boards/bldc-shield_ifx007t/)| Infineon <br> BLDC-SHIELD_IFX007T shield | -  IFX007T half-bridges <br> - 1 motor <br>- 40V/30A <br> - BEMF/current sensing  <br> - fault protection | [Infineon](https://www.infineon.com/cms/en/product/evaluation-boards/bldc-shield_ifx007t/) | 40€
[<img src="https://simplefoc.com/assets/img/dagor/Dagor_iso.png" style="height:120px">](https://github.com/byDagor/Dagor-Brushless-Controller)| [@byDagor](https://github.com/byDagor) <br> Dagor Brushless Controller | -  DRV8305 驱动器 <br> - 1 motor <br>- 25V/40A <br> - Current sensing  <br> - Integrated sensor<br> - Esp32 based<br> - fault protection | [simplefoc shop](https://simplefoc.com/shop)<br> <i>comming soon</i> | 40€
[<img src="extras/Images/powershield.jpg" style="height:120px">](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield)| Arduino<br> <span class="simple">Simple<span class="foc">FOC</span><span class="power">Power</span>Shield</span> | -  BTN8982 half-bridges <br> - 1 motor <br>- 40V/30A<br> - fault protection <br> <b>Release v1:</b> <br> - In-line 电流检测 <br> - I2C/Hall/Encoder pullups*<br> - 2x Stackable* |  [simplefoc shop](https://simplefoc.com/shop)<br> <i>comming soon</i> | ~25€
