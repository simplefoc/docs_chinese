---
layout: default
title: Arduino
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /arduino_mcu
parent: 单片机
grand_parent: 支持的硬件
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Arduino 8位支持

| MCU | 2 PWM模式 | 4 PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置 |
| --- | --- | --- | --- | --- | --- |
| Arduino（8位） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️（4kHz或32kHz） |

此表显示了8位Arduino支持的功能。基本上所有功能都支持，除了频率设置，PWM频率固定为32kHz。


| 开发板 | 名称 | 规格 | 链接 | 价格 |
| ---- | --- | --- | --- | --- |
| [<img src="extras/Images/arduino_uno.jpg" class="imgtable150">](https://store.arduino.cc/arduino-uno-rev3-smd) | Arduino UNO | ATMega328 <br>- 5V逻辑电平<br> - 6个PWM<br>- 2个中断<br>- 16MHz | [Ebay](https://www.ebay.com/itm/NEW-Arduino-UNO-R3-ATMEGA328P-CH340G-Microcontroller-Board-Bootloader-USB/323962801627?hash=item4b6db00ddb:g:ihUAAOSwLc1dNWCd)<br> [Arduino商店](https://store.arduino.cc/arduino-uno-rev3-smd) | 5欧元<br>25欧元 |
| [<img src="extras/Images/mega.png" class="imgtable150">](https://store.arduino.cc/arduino-mega-2560-rev3) | Arduino Mega | ATMega2560 <br>- 5V逻辑电平<br> - 15个PWM<br>- 6个中断<br>- 16MHz | [Ebay](https://www.ebay.com/itm/MEGA-2560-R3-Development-Board-CH340G-ATMEGA-2560-Kit-USB-Cable-For-Arduino-New/253764643649?epid=25019988960&_trkparms=ispr%3D1&hash=item3b158d2b41:g:C44AAOSwomJapjfF&enc=AQAEAAACYIQvEcHUrT7nmUC3yY5qbPyaBN1nJEDYW8MyypsJPgXK3AqiNsU0sSphPu4g6Qid31UfuUmxbibd03S6nwGFOtPRQtA6b7fwyQa%2BlHjHz58lNHKPszpYYTTo0kkJEDqmhf4Wiz0dmrGPE5aFjKQswyzpK0%2FagGHK8e518kkvgI15vEk3BEXEnW%2BgpNypJKacwMKe1INf06jl%2BrC%2FW50ef2gL1FPUQyUq9fK4Rm4tPSr28E52usHYczBDbdMdghFUExt3Ge%2B0iSj4t%2BcsyM2NGC%2BjCDDA8FBe3W5K8wg80e2DQwtM1R8Bpxrt6qJdyWZWigo8m4dpWLS%2Brmys9YJWASnU6mnFZoy4SLPUBLFK560rONYnB7aPohtZNJ%2BjCJPDLOQISm6tmGZVF5fMNu6iLYwYG8WG7J3c7rGVeUiDnJdf%2Fz68BNLAvth%2FnSoI9w7Jau%2Fd19gx3WYQbxgipDAmxgrVhGYlPrEvTSqCLIno1u3W%2FTI7FhSpNW%2Bgzw94kG%2FFgR9ieLRyv9p0w%2BYY3rrJepqCtlCJNkKflPpj4WAcXxBHHaQLJOr2mr7E2wRdwTBstIdCtoMmIp%2BjTRJFApIoT7fnEEIcMZyfLvbQZtemIQKHxpuibWKjQZU99awWsbMBlE0SRWaxRhML5YGORIjmgbIUyFdy9fiWHDcRpoKQJPsV6N3HUkRg9yU9cZ0m5w4ywXpiv7vHA8JFZg7hy5INiPGWwcxTRabpanq%2FWCB%2Bb4AN6%2BFP4%2Bqes86XVNe0YemDM1cBQWiHHjGxAHbw8gWuCZvXoc7XsJE5lrmQTsB1%2F%2FG6&checksum=253764643649687cd36869924033b58b75e082ef568d)<br>[Arduino商店](https://store.arduino.cc/arduino-mega-2560-rev3) | 10欧元<br>35欧元 |
| [<img src="extras/Images/nano.png" class="imgtable150">](https://www.ebay.com/itm/Nano-V3-0-USB-ATmega328P-AU-16MHz-5V-CH340G-Micro-Controller-Board-For-Arduino/223471184608?hash=item3407ebaae0:g:-gMAAOSwdzBcpfIA) | Arduino NANO | ATMega328<br> -5V逻辑电平<br> - 6个PWM <br>- 2个中断<br> - 16MHz  | [Ebay](https://www.ebay.com/itm/Nano-V3-0-USB-ATmega328P-AU-16MHz-5V-CH340G-Micro-Controller-Board-For-Arduino/223471184608?hash=item3407ebaae0:g:-gMAAOSwdzBcpfIA) | 3欧元 |
| [<img src="extras/Images/leonardo.jpg" class="imgtable150">](https://www.ebay.com/itm/273179578365?_trkparms=ispr%3D1&hash=item3f9ac58ffd:g:YfwAAOSwPHxa4ZlY&amdata=enc%3AAQAGAAACoPYe5NmHp%252B2JMhMi7yxGiTJkPrKr5t53CooMSQt2orsSlHY%252FYTip4QFVjNQrCEJt6hoLoNTcHEHwr8khbAFvff6C28MEXvk7mrnZA4pnppdXKQsL%252FE9Wh8pAUc3iWzm1VJuF%252FS5wNILaEU4f7M8nBd0QJTxlrqHLkH3pOz3U%252B3sQ8%252B0KzepjpsiVtDx8Mb3TzypIm%252FmlUEMVUVW2UTJUHVzzjFjTPCATEWPIB4zndeCTbYhRS%252B7liEL%252BVUmcgbVcIcyrRXDzBsVdgvAa91GftapFNDglXxkR%252Bp9iR1C68H9v5%252B2YcMo6jqYJFuxxUQNW19o3woxchbmhxAhx1iGBYe86d%252FyD%252FUKX8c0sdKPTDGbzEh1XInVUQTM1h%252B%252FiU8cevC1RlPYF7wk0TER7vrptfpP%252BN1QOo726q7kCLOP2raujcGnPDQ77VWTt5RVl1uaKgB4ir2fPSGmQp%252BPmtysS7YSj0MjXlEdh%252FLFkM%252FPNR6Ty1dIE1KKq0ky98Vzi5mbOsN7SmyzLPRCM5sb6ecB%252Ff4vhFnVCqdDzKcjssSAlZk5xA4bBKRPXL7KF3FB%252F1jDXsCTK%252B20YnLh4aL4d2MVYYzGlE7376p8OALxJPnP85C3dUCpqfXen%252BApo0qwcv2vaxJXLwAm5I9c92EDOqd7Uux%252BK2O8flq%252BqMnv747wbUi0M%252BSMiBu8oE41TsibPTuskN9iatKrvaSGClewOK7GWErvTdEA3XowqzP6yVd6ZnAqC%252BbH47zHhm6GengdbCxu5ls5YwinEgFtzI6YW4SdRpoaLHosmKFo291YEZlCoSwZ7PpMddXD%252FW8rBq647RjFSZGWhiU3AEC03N9H1mJGhbAkSkX4LH11VprxwYEkhVnIpDR7v0MGFgxdfr37i3eDxUw%253D%253D%7Campid%3APL_CLK%7Cclp%3A2334524) | Arduino Leonardo | ATMega32u4<br> -5V逻辑电平<br> - 7个PWM <br>- 5个中断<br> - 16MHz  | [Arduino商店](https://store-usa.arduino.cc/products/arduino-leonardo-with-headers)<br>[Ebay](https://www.ebay.com/itm/273179578365?_trkparms=ispr%3D1&hash=item3f9ac58ffd:g:YfwAAOSwPHxa4ZlY&amdata=enc%3AAQAGAAACoPYe5NmHp%252B2JMhMi7yxGiTJkPrKr5t53CooMSQt2orsSlHY%252FYTip4QFVjNQrCEJt6hoLoNTcHEHwr8khbAFvff6C28MEXvk7mrnZA4pnppdXKQsL%252FE9Wh8pAUc3iWzm1VJuF%252FS5wNILaEU4f7M8nBd0QJTxlrqHLkH3pOz3U%252B3sQ8%252B0KzepjpsiVtDx8Mb3TzypIm%252FmlUEMVUVW2UTJUHVzzjFjTPCATEWPIB4zndeCTbYhRS%252B7liEL%252BVUmcgbVcIcyrRXDzBsVdgvAa91GftapFNDglXxkR%252Bp9iR1C68H9v5%252B2YcMo6jqYJFuxxUQNW19o3woxchbmhxAhx1iGBYe86d%252FyD%252FUKX8c0sdKPTDGbzEh1XInVUQTM1h%252B%252FiU8cevC1RlPYF7wk0TER7vrptfpP%252BN1QOo726q7kCLOP2raujcGnPDQ77VWTt5RVl1uaKgB4ir2fPSGmQp%252BPmtysS7YSj0MjXlEdh%252FLFkM%252FPNR6Ty1dIE1KKq0ky98Vzi5mbOsN7SmyzLPRCM5sb6ecB%252Ff4vhFnVCqdDzKcjssSAlZk5xA4bBKRPXL7KF3FB%252F1jDXsCTK%252B20YnLh4aL4d2MVYYzGlE7376p8OALxJPnP85C3dUCpqfXen%252BApo0qwcv2vaxJXLwAm5I9c92EDOqd7Uux%252BK2O8flq%252BqMnv747wbUi0M%252BSMiBu8oE41TsibPTuskN9iatKrvaSGClewOK7GWErvTdEA3XowqzP6yVd6ZnAqC%252BbH47zHhm6GengdbCxu5ls5YwinEgFtzI6YW4SdRpoaLHosmKFo291YEZlCoSwZ7PpMddXD%252FW8rBq647RjFSZGWhiU3AEC03N9H1mJGhbAkSkX4LH11VprxwYEkhVnIpDR7v0MGFgxdfr37i3eDxUw%253D%253D%7Campid%3APL_CLK%7Cclp%3A2334524) | 10欧元-20欧元 |

Arduino <span class="simple">简易<span class="foc">磁场定向控制</span>库</span>最初是作为Arduino UNO库开发的，并且已经过优化，可用于这类设备。但它不仅限于Arduino UNO，您还可以在Arduino MEGA以及基本上任何带有ATMega328芯片或ATMega2560的开发板上运行它，例如Arduino Nano、Arduino pro-mini等类似开发板。

| 开发板 | 名称 | 规格 | 链接 | 价格 |
| ---- | --- | --- | --- | --- |
| [<img src="extras/Images/pinout.jpg" class="imgtable150">](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | HMBGC V2.2 | ATMega328<br> - 5V逻辑电平<br> - 6个PWM <br>- 0个中断<br> - 无SPI<br>- 16MHz <br> - 2x BLDC驱动器 | [Ebay](https://www.ebay.com/itm/HMBGC-V2-0-3-Axle-Gimbal-Controller-Control-Plate-Board-Module-with-Sensor/351497840990?hash=item51d6e7695e:g:BAsAAOSw0QFXBxrZ:rk:1:pf:1) | 20欧元 |
| [<img src="extras/Images/bgc_30.jpg" class="imgtable150">](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | BGC 3.0 | ATMega328<br>- 5V逻辑电平<br> - 6个PWM <br>- 0个中断<br> - 16MHz <br> - 2x BLDC驱动器 | [Aliexpress](https://fr.aliexpress.com/item/4000411471994.html?spm=a2g0o.productlist.0.0.5d047d57y4zGC4&algo_pvid=861ada4b-b12f-4019-be84-fae9870a12ed&algo_expid=861ada4b-b12f-4019-be84-fae9870a12ed-1&btsid=0ab6f83a15906954691168349e30d7&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) | 10欧元 |

对于初学者来说，一个有趣的示例开发板是基于ATMega328芯片的云台控制器板，这些板通常集成了用于运行两个电机的BLDC驱动硬件。它们的性能有限，但非常适合初始设置。

# Arduino DUE支持

| MCU | 2 PWM模式 | 4PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置 |
| --- | --- | --- | --- | --- | --- |
| Arduino DUE  | ✔️ | ✔️ | ✔️ | ❌ | ✔️ |

目前，Arduino DUE不支持6pwm模式。如果您对该支持感兴趣，请随时在我们的[社区论坛](https://community.simplefoc.com)上发帖。

| 开发板 | 名称 | 规格 | 链接 | 价格 |
| ---- | --- | --- | --- | --- |
| [<img src="extras/Images/due.jpg" class="imgtable150">](https://store.arduino.cc/arduino-due) | Arduino DUE | ARM Cortex-M3 <br>- 3.3V逻辑电平<br> - 12个PWM<br>- 所有引脚均可中断 <br> - 12个模拟输入 <br>- 84MHz | [Ebay](https://www.ebay.com/itm/ARM-Cortex-M3-Control-Board-Module-DUE-R3-SAM3X8E-32-bit-Arduino-Without-Cable/113795035918?hash=item1a7eb6730e:g:7usAAOSws3ldD45r)<br> [Arduino商店](https://store.arduino.cc/arduino-due) | 15欧元<br>35欧元 |

Arduino <span class="simple">简易<span class="foc">磁场定向控制</span>库</span>也将支持基于ARM的Arduino DUE开发板！

## Arduino IDE支持包
为了在Arduino IDE中使用Arduino DUE，请使用Arduino IDE开发板管理器安装Arduino DUE开发板支持包。

# Arduino UNO R4

| MCU | 2 PWM模式 | 4PWM模式 | 3 PWM模式 | 6 PWM模式 | PWM频率配置 |
| --- | --- | --- | --- | --- | --- |
| Renesas（UNO R4 Minima） | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |


目前，Arduino UNO R4不支持电流检测。如果您对该支持感兴趣，请随时在我们的[社区论坛](https://community.simplefoc.com)上发帖。

| 开发板 | 名称 | 规格 | 链接 | 价格 |
| ---- | --- | --- | --- | --- |
| [<img src="https://store.arduino.cc/cdn/shop/products/ABX00080_00.default_915d4754-8188-471c-aeb8-b3967aba76e5_643x483.jpg" class="imgtable150">](https://store.arduino.cc/pages/uno-r4) | Arduino UNO R4 Minima | ARM Cortex-M4 <br>- 5V逻辑电平<br> - 6个PWM<br>- 所有引脚均可中断 <br> -6个模拟输入 <br>- 48MHz | [Arduino商店](https://store.arduino.cc/products/uno-r4-minima) | 18欧元 |

## Arduino IDE支持包
为了在Arduino IDE中使用Arduino UNO R4，请使用Arduino IDE开发板管理器安装相应的支持包。