---
layout: default
title: 步进电机驱动器
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /stepper_drivers
parent: 支持的驱动板
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 步进电机驱动器

该库将兼容大多数具有2个全H桥或4个半桥的2相步进电机驱动板，如 [<i class="fa fa-file"></i> MC33926](https://www.nxp.com/docs/en/data-sheet/MC33926.pdf), [<i class="fa fa-file"></i> L298](https://www.st.com/resource/en/datasheet/l298.pdf), [<i class="fa fa-file"></i> L293](http://www.ti.com/lit/ds/symlink/l293.pdf)。为了驱动板能配合库运行，需要使用4路pwm信号。

<blockquote class="warning"><p class="heading">⚠️不支持DIR/STEP步进驱动器！</p>
此库不支持DIR+STEP（步进和方向）接口的步进驱动程序，如A4988, DRV8825, TB6600, TB6560等。
</blockquote>

步进驱动器的选择直接取决于你所使用的步进电机，基本上要确保步进驱动器能提供电机执行所需的电流。



# 支持的驱动板示例

本库支持以下一些步进驱动板

示例 | 描述                             | 规格 | 链接 | 价格 
---- | ---- | ---- | --- | --- 
[<img src="extras/Images/ms1508.jpg" style="height:100px">](https://www.ebay.com/itm/Dual-Channel-DC-Motor-Driver-Mini-Module-PWM-Speed-Control-Beyond-L298N-S2U/124342998274?hash=item1cf36b9502:g:zJoAAOSwFuZbSF25)| Stepper driver MX1508| - MX1508  chip <br> - 1 motor <br>- 5V-10V <br> - 2.5A | [Ebay](https://www.ebay.com/itm/Dual-Channel-DC-Motor-Driver-Mini-Module-PWM-Speed-Control-Beyond-L298N-S2U/124342998274?hash=item1cf36b9502:g:zJoAAOSwFuZbSF25) | 1€
[<img src="extras/Images/l298n.jpg" style="height:100px">](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df)| Stepper driver L298N| - L298N  chip <br> - 1 motor <br>- 5V-35V <br> - 2A(MAX single bridge) | [Ebay](https://www.ebay.com/itm/L298N-DC-Stepper-Motor-Driver-Module-Dual-H-Bridge-Control-Board-for-Arduino/362863436137?hash=item547c58a169:g:gkYAAOSwe6FaJ5Df) | 2€
[<img src="extras/Images/shiled_stepper.jpg" style="height:100px">](https://www.ebay.com/itm/L298P-Shield-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O)| Shield R3 DC Motor Driver Module| - L298P  chip <br> - 1 motor <br>- 5V-35V <br> - 2A(MAX single bridge) | [Ebay](https://www.ebay.com/itm/L298P-Shield-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O) | 6€
[<img src="extras/Images/shiled_stepper1.jpg" style="height:100px">](https://www.ebay.com/itm/L298P-Shield-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O)| Arduino Motor Drive Shield V1| - L293D chip <br> - 1 motor <br>- 5V-35V <br> - 0.6A( 1.2 peak) | [Ebay](https://www.ebay.com/itm/L298P-Shield-R3-DC-Motor-Driver-Module-2A-H-Bridge-2-way-For-Arduino-UNO-2560/310787745501?hash=item485c64a6dd:g:m0sAAOSwXwdfMo5O) | 6€
[<img src="extras/Images/shiled_stepper3.jpg" style="height:100px">](https://www.ebay.com/itm/Motor-Stepper-Servo-Robot-Shield-for-Arduino-I2C-v2-Kit-w-PWM-Driver-TOP/201415058167?hash=item2ee545e2f7:g:IkgAAOSwJ-5aTI4Q)| Arduino Motor Drive Shield V2| - TB6612 chip <br> - 1 motor <br>- 5V-35V <br> - 1.2A (3A peak) | [Ebay](https://www.ebay.com/itm/Motor-Stepper-Servo-Robot-Shield-for-Arduino-I2C-v2-Kit-w-PWM-Driver-TOP/201415058167?hash=item2ee545e2f7:g:IkgAAOSwJ-5aTI4Q) | 25€
[<img src="extras/Images/shield_monster.jpg" style="height:100px">](https://www.ebay.com/itm/L298N-Dual-VNH2SP30-Stepper-Motor-Driver-Module-30A-Monster-Moto-Shield-Replace/112031018900?hash=item1a1591af94:g:R4YAAOSwEaBaTafh)| Arduino Monster motor shield| - VNH2SP30  chip <br> - 1 motor <br>- 5V-16V <br> - 14A (30A peak) | [Ebay](https://www.ebay.com/itm/L298N-Dual-VNH2SP30-Stepper-Motor-Driver-Module-30A-Monster-Moto-Shield-Replace/112031018900?hash=item1a1591af94:g:R4YAAOSwEaBaTafh) | 8€

或者，你可以使用两个直流电机驱动板，电机的每个相分别用一个。下面是一些例子：

示例 | 描述 | 规格 | 链接                                                         | 价格 
---- | ---- | ---- | --- | --- 
[<img src="extras/Images/pololu.jpg" style="height:100px">](https://www.pololu.com/product/1212) | Pololu MC33926 | - MC33926 chip <br> - 1 motor <br>- 5V-28V <br> - 5A MAX| [Drotek](https://store-drotek.com/212-brushless-gimbal-controller-l6234.html)<br> [Ebay](https://www.pololu.com/product/1212) | 18€
[<img src="extras/Images/BTS7960B.jpg" style="height:100px">](https://fr.aliexpress.com/item/32965904058.html)| Aideepen BTS7960B| - BTS7960B  chip <br> - 1 motor <br>- 5V-30V <br> - 43A MAX| [Aliexpress](https://fr.aliexpress.com/item/32965904058.html) | 10€

最后你也可以使用两个三相[无刷直流电机驱动器](bldc_drivers)。每个无刷直流驱动器有3个半桥，你需要使用当中的2个。当你结合他们2个，你将使用他们6个输出引脚当中的4个。
