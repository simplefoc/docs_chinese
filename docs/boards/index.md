---
layout: default
title: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
description: "SimpleFOC boards"
nav_order: 2
permalink: /boards
has_children: true
has_toc: false
---

# <span class="simple">Simple<span class="foc">FOC</span> 板子</span>

<span class="simple">Simple<span class="foc">FOC</span>project</span> 的目标就是开发与<span class="simple">Simple<span class="foc">FOC</span>library</span>兼容、低成本且易使用的BLDC无刷驱动板，并进行全开源！

直至目前为止，<span class="simple">Simple<span class="foc">FOC</span>project</span>已开发了三种官方无刷驱动板，分别为：
- <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
- <span class="simple">Simple<span class="foc">FOC</span> <b>Power</b>Shield</span>
- <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 📢**最新发布**

## Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small>v2.0.4</small> - <small>[点击查看更多](arduino_simplefoc_shield_showcase)</small>

这是一款全开源、低成本的 BLDC 无刷电机驱动板，主要用于 5 安培及以上的低功率 FOC 应用。 该板与 Arduino UNO 以及所有带有标准 Arduino 接头的板子完全兼容。<span class="simple">Simple<span class="foc">FOC</span>Shield</span>和<span class="simple">Simple<span class="foc">FOC</span>library</span>有机结合，为用户控制无刷电机提供了硬件和软件双重便利。

<div class="width40">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/master/images/top.png"/>
</div>
### 特性

- **即插即用**：结合 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
- **低成本**: 15 -20欧元的价格 - [查看价格](https://www.simplefoc.com/simplefoc_shield_product) 
- **在线电流检测**: 双向电流可达 3Amps/5Amps
  - 可选配置：3.3Amps - 3.3V adc, 5Amps - 5V adc
- **集成 8V 调节器**: 
  - 通过焊盘启用/禁用
- **最大功率 120W** - 最大电流 5A, 输入电源 12-24V（最高35V）
  - 适用于内阻 >10Ω 的云台电机. 
- **可叠板**：可以同时运行2个电机
- **编码器/霍尔传感器接口**：集成的3.3kΩ上拉电阻（可选）
- **I2C 接口**：集成的4.7kΩ上拉电阻（可选）
- **可配置的引脚**：硬件配置 - 通过焊接连接
- **Arduino headers**：Arduino UNO, Arduino MEGA, STM32 Nucleo boards...
- **开源**：提供制板文件 - [如何自制](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)






## Arduino <span class="simple">Simple<span class="foc">FOC</span> <b>Power</b>Shield</span> <small>v0.2</small> <small>⚠️<i>( 正在开发中 )</i></small>

这是一款使用FOC算法，可驱动BLDC无刷电机的强大 arduino shield。板子基于 [BTN8982](https://www.infineon.com/dgdl/Infineon-BTN8982TA-DS-v01_00-EN.pdf?fileId=db3a30433fa9412f013fbe32289b7c17)  半桥， 能支持高达 30 Amps 持续电流和50Amps 峰值电流，这使其成为几乎能运行任何BLDC无刷电机的驱动板。


<div class="width40">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOC-PowerShield/main/images/top.png"/>
</div>
<blockquote class="warning" markdown="1">
<p class="heading"> ⚠️ 注意: BTN8982/IFX007T 性能问题</p>
BTN8982和IFX007T驱动器基于旧的H桥技术，是为直流电机设计的。它们有非常长的晶管体上升时间（许多微秒不等），这导致许多情况会呈现出相当一部分的PWM占空比。当BLDC无刷电机运行时，精确的PWM占空比设置对于电机流畅高效运作尤为重要。因此，这些驱动板无法在高频PWM（大约 15kHz）上流畅运行。更多相关信息，请查阅社区线程[链接](https://community.simplefoc.com/t/simplefoc-powershield/582).<br>
这个性能限制也是导致<span class="simple">Simple<span class="foc">FOC</span> <b>Power</b>Shield</span> project至今还在搁置的主要原因。尽管你可以从 Aliexpress 或者一些其他平台买到这些板子，但它们仍未在simplefoc.com售卖。
<br>
尽管如此，这并不意味着该板本身没有功能，或者它不会在您的项目中工作。对于中高功率的无刷电机控制来说，它仍然是一个最便宜（最简单）的解决方案。通过适当的调整控制回路，你仍然能得到好的运行结果。
</blockquote>





### 特性

- **即插即用**：结合 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
- **低成本**: 制作价格低于25欧元 - **⚠️ 没有在simplefoc.com上售卖**
- **高侧电流检测**: *Simple**FOC**library* 暂不支持
- **在线电流检测**: *Simple**FOC**library* 可以支持
- **最大功率 <500W** - 最大电流 30A, 输入电源 24V
- **Arduino headers**: Arduino UNO, Arduino MEGA, STM32 Nucleo boards, Aruidno DUE...
- **小尺寸**：53mm x 60mm
- **编码器/霍尔传感器接口**：集成的3.3kΩ上拉电阻（可选）
- **开源**：

   - 提供制板文件
        - 如果你是第一次制板，请参考*Simple**FOC**Shield*上的小指引:  [如何自制](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)
   - Altium 项目
   - 3d 模型
   - 原理图

关于板子的更多信息，请查阅 [此链接](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield)



## 📢**最新发布**: <span class="simple">Simple<span class="foc">FOC</span>Mini</span> <small>v1.0</small>

体积小，成本低的 BLDC 无刷驱动板完全兼容<span class="simple">Simple<span class="foc">FOC</span>library</span>

<img src="extras/Images/mini.png" class="width40"/><img  src="https://user-images.githubusercontent.com/36178713/164240473-5abd7453-9d38-4f25-9195-378c39180054.jpg"  class="width40"/>




## 特征
- **即插即用**：结合 Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
- **基于DRV8313芯片** - [参数列表](https://www.ti.com/lit/ds/symlink/drv8313.pdf?ts=1650461862269&ref_url=https%253A%252F%252Fwww.google.com%252F)
  
  - 输入电压: 8-24V
  - 最大电流: 每相2.5A
  - 板载 3.3V LDO
- **小尺寸**: 26x20 mm
- **全开源**
  
  - [EasyEDA](https://easyeda.com/the.skuric/simplefocmini)
  - [GitHub](https://github.com/simplefoc/SimpleFOCMini) 
- **低成本**: 
   
   - JLCPCB 制板花费 3-5 欧元
- 在 [商城](https://www.simplefoc.com/shop) 购买成品: 7-10 欧元
   
   关于板子的更多信息，请查阅 [此链接](https://github.com/simplefoc/SimpleFOCMini)