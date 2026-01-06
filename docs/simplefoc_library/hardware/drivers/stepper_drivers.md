---
layout: default
title: 步进驱动器
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stepper_drivers
parent: 驱动板
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 步进电机驱动器
该库将与大多数具有2个全H桥或4个半桥的2相步进电机驱动板兼容，例如[<i class="fa fa-file"></i> MC33926](https://www.nxp.com/docs/en/data-sheet/MC33926.pdf)、[<i class="fa fa-file"></i> L298](https://www.st.com/resource/en/datasheet/l298.pdf)、[<i class="fa fa-file"></i> L293](http://www.ti.com/lit/ds/symlink/l293.pdf) 以及更多其他型号。为了使驱动板能够与该库配合工作，它需要能够通过以下方式进行控制：

- 4个PWM信号，或者
- 2个PWM信号 + 2个方向信号。

<blockquote class="warning"><p class="heading">⚠️ 不支持DIR/STEP步进驱动器！</p>
该库不支持具有DIR+STEP（步进和方向）接口的步进驱动器，例如A4988、DRV8825、TB6600、TB6560以及类似型号。
</blockquote>

步进驱动器的选择直接取决于所使用的步进电机，基本上要确保步进驱动器能够提供电机运行所需的电流。


## 支持的板卡示例
以下是一些受该库支持的步进驱动板。

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | --- | ---
[<img src="extras/Images/ms1508.jpg" style="height:100px">](https://www.ebay.com/itm/Dual-Channel-DC-Motor-Driver-Mini-Module-PWM-Speed-Control-Beyond-L298N-S2U/124342998274?hash=item1cf36b9502:g:zJoAAOSwFuZbSF25)| 步进驱动器MX1508| - MX1508芯片 <br> - 1个电机 <br>- 5V-10V <br> - 2.5A | [Ebay](https://www.ebay.com/itm/Dual-Channel-DC-Motor-Driver-Mini-Module-PWM-Speed-Control-Beyond-L298N-S2U/124342998274?hash=item1cf36b9502:g:zJoAAOSwFuZbSF25) | 1欧元
[<img src="extras/Images/l298n.jpg" style="height:100px">](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df)| 步进驱动器L298N| - L298N芯片 <br> - 1个电机 <br>- 5V-35V <br> - 2A（单个桥最大） | [Ebay](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df) | 2欧元
[<img src="extras/Images/shiled_stepper.jpg" style="height:100px">](https://www.ebay.com/itm/L298P-扩展板-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O)| 扩展板 R3直流电机驱动模块 | - L298P芯片 <br> - 1个电机 <br>- 5V-35V <br> - 2A（单个桥最大） | [Ebay](https://www.ebay.com/itm/L298P-扩展板-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O) | 6欧元
[<img src="extras/Images/shiled_stepper1.jpg" style="height:100px">](https://www.ebay.com/itm/L298P-扩展板-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O)| Arduino电机驱动扩展板V1| - L293D芯片 <br> - 1个电机 <br>- 5V-35V <br> - 0.6A（峰值1.2A） | [Ebay](https://www.ebay.com/itm/L298P-扩展板-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O) | 6欧元
[<img src="extras/Images/shiled_stepper3.jpg" style="height:100px">](https://www.ebay.com/itm/Motor-Stepper-Servo-Robot-扩展板-for-Arduino-I2C-v2-Kit-w-PWM-Driver-TOP/201415058167?hash=item2ee545e2f7:g:IkgAAOSwJ-5aTI4Q)| Arduino电机驱动扩展板V2| - TB6612芯片 <br> - 1个电机 <br>- 5V-35V <br> - 1.2A（峰值3A） | [Ebay](https://www.ebay.com/itm/Motor-Stepper-Servo-Robot-扩展板-for-Arduino-I2C-v2-Kit-w-PWM-Driver-TOP/201415058167?hash=item2ee545e2f7:g:IkgAAOSwJ-5aTI4Q) | 25欧元
[<img src="extras/Images/扩展板_monster.jpg" style="height:100px">](https://www.ebay.com/itm/L298N-Dual-VNH2SP30-Stepper-Motor-Driver-Module-30A-Monster-Moto-扩展板-Replace/112031018900?hash=item1a1591af94:g:R4YAAOSwEaBaTafh)| Arduino Monster电机扩展板| - VNH2SP30芯片 <br> - 1个电机 <br>- 5V-16V <br> - 14A（峰值30A） | [Ebay](https://www.ebay.com/itm/L298N-Dual-VNH2SP30-Stepper-Motor-Driver-Module-30A-Monster-Moto-扩展板-Replace/112031018900?hash=item1a1591af94:g:R4YAAOSwEaBaTafh) | 8欧元

<span class="simple">简易<span class="foc">FOC</span>库</span>也将支持一些完全集成的解决方案

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | --- | ---
[<img src="extras/Images/smartstepper.png" style="height:100px">](https://fr.aliexpress.com/item/1005002994341057.html?spm=a2g0o.productlist.0.0.6b7c1dc3oF0O7M&algo_pvid=211a8bd5-fe47-4797-aab2-afb283ded43b&algo_exp_id=211a8bd5-fe47-4797-aab2-afb283ded43b-37&pdp_ext_f=%7B%22sku_id%22%3A%2212000023120630182%22%7D)| Misfit智能步进电机| - samd21微控制器 <br> - A4954驱动芯片 <br> - 易于安装在NEMA17上 <br> - 集成AS5047A传感器 <br> - 1个电机 <br>- 8V-32V <br> - 2A | [AliExpress](https://fr.aliexpress.com/item/1005002994341057.html?spm=a2g0o.productlist.0.0.6b7c1dc3oF0O7M&algo_pvid=211a8bd5-fe47-4797-aab2-afb283ded43b&algo_exp_id=211a8bd5-fe47-4797-aab2-afb283ded43b-37&pdp_ext_f=%7B%22sku_id%22%3A%2212000023120630182%22%7D)<br> [MisfitTech](https://misfittech.net/nema-17-smart-stepper/) | 20-40欧元
[<img src="extras/Images/BIGTREETECH_S42B_v1.1.png" style="height:100px">](https://fr.aliexpress.com/wholesale?catId=0&initiative_id=SB_20211004101249&SearchText=BIGTREETECH+S42B)| BIGTREETECH S42B |  - stm32微控制器 <br> - 2个A4950驱动芯片 <br> - 易于安装在NEMA17上 <br> - 集成TLE5012传感器 <br> - 1个电机 <br>- 12V-24V <br> - 2A <br> [查看社区帖子](https://community.simplefoc.com/t/running-simplefoc-on-a-bigtreetech-s42b/736) | [AliExpress](https://fr.aliexpress.com/wholesale?catId=0&initiative_id=SB_20211004101249&SearchText=BIGTREETECH+S42B) <br>[Amazon](https://www.amazon.fr/BIGTREETECH-commande-emp%C3%AAche-limpression-multiples/dp/B08JLN4PJR/ref=sr_1_5?__mk_fr_FR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=BIGTREETECH+S42B&qid=1633371175&qsid=259-6486797-8245010&sr=8-5&sres=B08JLN4PJR%2CB0991B8ZRL%2CB0882QGFZR%2CB07WC71M4R%2CB08182XHZZ%2CB091M7MDS3%2CB08BR7WMS7%2CB08VRM44Z2%2CB097Y5N5KG%2CB07WPY4979%2CB07TJWSV51%2CB089SPPGKJ%2CB08N6C9XCL%2CB08FHM91F2%2CB08B67DHWZ%2CB08ZSD3QBP%2CB08B1G8W39%2CB097RBJ3YR%2CB07W1Q42KK%2CB08VS8PJX7) | 20-40欧元

另外，您可以使用两个直流电机驱动板，每个用于电机的一个相位。以下是一些示例：

示例 | 描述 | 规格 | 链接 | 价格
---- | ---- | ---- | --- | ---
[<img src="extras/Images/pololu.jpg" style="height:100px">](https://www.pololu.com/product/1212) | Pololu MC33926 | - MC33926芯片 <br> - 1个电机 <br>- 5V-28V <br> - 最大5A| [Drotek](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)<br> [Ebay](https://www.pololu.com/product/1212) | 18欧元
[<img src="extras/Images/BTS7960B.jpg" style="height:100px">](https://fr.aliexpress.com/item/32965904058.html)| Aideepen BTS7960B| - BTS7960B芯片 <br> - 1个电机 <br>- 5V-30V <br> - 最大43A| [Aliexpress](https://fr.aliexpress.com/item/32965904058.html) | 10欧元


最后，您也可以使用两个3相[无刷直流电机驱动器](bldc_drivers)。每个无刷直流电机驱动器都有3个半桥，您需要从中使用2个。当您将两个驱动器组合使用时，将使用它们6个输出引脚中的4个。
