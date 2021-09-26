---
layout: default
title: Teensy
nav_order: 5
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /teensy_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 支持 Teensy

MCU | 2路PWM模式 | 4路PWM模式 | 3路PWM模式 | 6路PWM模式 | pwm频率配置 
--- | --- |--- |--- |--- |--- 
teensy | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 

Arduino <span>Simple<span>FOC</span>library</span>最近也开始支持Teensy boards。我们用来测试的测试板是 Teensy 4.1 和 Teensy 3.2，但大多数4.x和3.X系列的板子实际上都可以开箱即用，与库一起工作。

 板子示意图 | 名称 | 规格 | 链接 | 价格 
---- | --- | --- | --- | --- 
[<img src="extras/Images/teensy41_4.jpg" class="imgtable150">](https://www.pjrc.com/store/teensy41.html) | Teensy 4.1 | ARM Cortex-M7 <br>- 3.3V logic<br> - 35 PWMs<br>- 18个模拟输入 <br>- 600 MHz | [pjrc.com](https://www.pjrc.com/store/teensy41.html)| 25€ 
[<img src="extras/Images/teensy32.jpg" class="imgtable150">](https://www.pjrc.com/store/teensy32.html) | Teensy 3.2 | ARM Cortex-M4 <br>- 3.3V logic<br> - 12 PWMs<br>- 21个模拟输入 <br>- 72 MHz | [pjrc.com](https://www.pjrc.com/store/teensy32.html)| 20€ 

如果你对你的驱动板有问题或者有兴趣扩展支持，请不要犹豫，马上在[社区论坛](https://community.simplefoc.com)发帖！

## Arduino IDE支持包
为了使用 Arduino IDE 中的 Teensy 板子，请按照[Teensyduino addon](https://www.pjrc.com/teensy/td_download.html)中的步骤安装 Teensy 支持包。