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

# Teensy支持

| MCU | 2 PWM模式 | 4PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置 |
| --- | --- | --- | --- | --- | --- |
| teensy3 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| teensy4 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |


| MCU | 串联式 | 低侧 | 高侧 |
| --- | --- | --- | --- |
| teensy3 | ✔️ | ❌ | ❌ |
| teensy4 | ✔️ | ✔️（一个电机） | ❌ |

Arduino <span class="simple">简易<span class="foc">FOC</span>库</span>最近也开始支持Teensy开发板。测试最频繁的开发板是Teensy 4.1和Teensy 3.2，但4.x和3.x系列中的大多数开发板应该都能直接使用该库。

| 开发板 | 名称 | 规格 | 链接 | 价格 |
| ---- | --- | --- | --- | --- |
| [<img src="extras/Images/teensy41_4.jpg" class="imgtable150">](https://www.pjrc.com/store/teensy41.html) | Teensy 4.1 | ARM Cortex-M7 <br>- 3.3V逻辑电平<br> - 35个PWM<br>- 18个模拟输入 <br>- 600 MHz | [pjrc.com](https://www.pjrc.com/store/teensy41.html) | 25欧元 |
| [<img src="extras/Images/teensy32.jpg" class="imgtable150">](https://www.pjrc.com/store/teensy32.html) | Teensy 3.2 | ARM Cortex-M4 <br>- 3.3V逻辑电平<br> - 12个PWM<br>- 21个模拟输入 <br>- 72 MHz | [pjrc.com](https://www.pjrc.com/store/teensy32.html) | 20欧元 |

如果您在使用Teensy开发板时遇到问题，或者有兴趣扩展支持范围，请随时在我们的[社区论坛](https://community.simplefoc.com)上发帖！

## Arduino IDE支持包
为了在Arduino IDE中使用Teensy开发板，请按照安装[Teensyduino插件](https://www.pjrc.com/teensy/td_download.html)的步骤安装Teensy支持包。