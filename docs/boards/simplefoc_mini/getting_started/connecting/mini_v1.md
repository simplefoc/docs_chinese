---
layout: default
title: Mini v1
description: "Connecting SimpleFOCMini with your hardware."
nav_order: 1
permalink: /mini_v1_connect_hardware
parent: 连接硬件
grand_parent: 开始制作MINI
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Mini</span>
grand_grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
toc: true
---



# 将硬件连接到 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> v1

将 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 连接到微控制器、无刷直流电机和电源非常简单。

<p>
<img src="extras/Images/mini_where.png" class="width40">
</p>

## 微控制器
- <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 设计为独立的无刷直流驱动器，基本上可以与任何微控制器配合使用。
- 该板有 10 个引脚用于连接微控制器

<p>
<img src="extras/Images/mini_req_opt.png" class="width30">
</p>

有 5 个引脚需要连接

| 引脚名称 | 描述 |
| --- | --- |
| GND | 接地（公共地） |
| IN1 | PWM 输入相 1 |
| IN2 | PWM 输入相 2 |
| IN3 | PWM 输入相 3 |
| EN | 驱动器使能 |

<blockquote class="warning"><p class="heading">注意：引脚顺序</p>
<span class="simple">Simple<span class="foc">FOC</span>Mini</span> 的 v1.1 版本与 v1.0 版本相比，IN1、IN2、IN3 和 EN 的顺序有所改变。
</blockquote>

使用 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 时必须连接这些引脚。3 个 PWM 引脚和使能引脚用于控制 DRV8313 驱动器，在 <span class="simple">Simple<span class="foc">FOC</span>库</span> 中，它们对应于 `BLDCDriver3PWM` 类的参数。公共接地引脚也非常重要，以确保驱动器芯片能正确读取所有 PWM 和使能引脚。一旦确定将哪些引脚用于 `INx` 和 `EN` 引脚，就可以在 Arduino 草图中将它们提供给 `BLDCDriver3PWM` 类。

```cpp
BLDCDriver3PWM driver = BLDCDriver3PWM(IN1, IN2, IN3, EN);
```

此外还有 5 个可选引脚。

引脚名称 | 描述
--- | --- 
3.3V | 3.3V 输出 - **不是输入**  
GND | 	接地
nRT | 复位（低电平有效）
nSP | 休眠（低电平有效）
nFT | 故障输出（低电平有效）

SimpleFOCMini 基于 DRV8313 驱动器，该驱动器集成了 3.3V 稳压器，在某些应用中可能用于为传感器等供电。因此，SimpleFOCMini 的 3.3V 引脚可用作 3.3V 电源引脚，最大输出电流为 10mA。SimpleFOCMini 引脚上露出的两个 GND 引脚都连接到同一个地，因此您可以选择对您的应用更方便的那个。
<blockquote class="warning"><p class="heading">注意：3.3V LDO 电源限制</p>DRV8313 带有 3.3V 稳压器，它连接到 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 的 3.3V 引脚。但是它的限制是 10mA，通常不足以给微控制器供电。但它可能足以给 LED 灯或某些位置传感器供电。</blockquote>

<br>
引脚 nFT（故障）是 SimpleFOCMini 的低电平有效输出，可通过读取该引脚来验证 DRV8313 驱动器是否正常工作。如果该引脚为低电平，则表示 DRV8313 处于故障状态，无法驱动电机。然后，引脚 nRT（复位）也是低电平有效，可用于复位 DRV8313 驱动器以重新初始化其内部状态并退出故障状态，这不能通过简单地切换使能引脚来完成。最后，引脚 nSP（休眠）是低电平有效引脚，可将 DRV8313 置于低功耗休眠模式，消耗电流低于 1uA。


## 无刷直流电机
- 电机相 a、b 和 c 直接连接到电机端子连接器 M1、M2 和 M3

<blockquote class="warning"><p class="heading">注意：功率限制</p><span class="simple">Simple<span class="foc">FOC</span>Mini</span> 设计用于内部电阻高于 R>10 欧姆的云台电机。该板的绝对最大电流为 5A。请确保在您的项目中使用该板时，所使用的无刷直流电机符合这些限制。<br>如果您仍然想将此驱动器与电阻非常低（R < 1 欧姆）的无刷直流电机一起使用，请确保限制设置到板上的电压。<br>有关电机选择的更多信息，请访问 <a href="bldc_motors">无刷直流电机文档</a></blockquote>

## 电源
- 电源电缆直接连接到端子引脚  `+` 和`-` 
- 所需电源电压为 8V 至 35V。


## 连接示意图示例

SimpleFOCMini 可以连接到任何微控制器 (MCU) 的引脚组合，只要确保 mini 的 GND 引脚连接到 MCU 的 GND 引脚，MCU 的 3 个具备 PWM 功能的引脚连接到 `IN1`、`IN2` 和 `IN3` 引脚，并且 MCU 的一个数字引脚连接到 EN 引脚。
下图显示了 SimpleFOCMini 与 Nucleo 开发板的连接示例。

<img src="extras/Images/mini_connection_mucleo.png" class="width60">

<span class="simple">Simple<span class="foc">FOC</span>Mini</span> 可以直接插入 Nucleo 板的 Arduino 引脚座（从引脚 10 到 GND 引脚），这样可以减少所需的导线数量。有关此示例连接的更多信息，请参见  [此库示例](mini_example_nucleo)。

--- | --- | --- | ---| --- | ---
Mini 引脚 | EN | IN3 | IN2 | IN1 | GND
Nucleo 引脚 | 10 | 11 | 12 | 13 | GND

```cpp
BLDCDriver3PWM driver = BLDCDriver3PWM(13, 12, 11, 10);
```

下图显示了 SimpleFOCMini 与 Arduino UNO 的连接示例。 
<img src="extras/Images/mini_connection_uno.png" class="width60">

<span class="simple">Simple<span class="foc">FOC</span>Mini</span> 可以直接插入 UNO 板的 Arduino 引脚座（从引脚 8 到 12 引脚，引脚 12 可作为 GND 引脚），这样可以减少所需的导线数量。有关此示例连接的更多信息，请参见 [此库示例](mini_example)。

--- | --- | --- | ---| --- | ---
Mini 引脚 | EN | IN3 | IN2 | IN1 | GND
UNO 引脚 | 8 | 9 | 10 | 11 | 12

```cpp
BLDCDriver3PWM driver = BLDCDriver3PWM(11, 10, 9, 8);
```

下面显示了 Arduino UNO 与 SimpleFOCMini 连接的另一个示例
<img src="extras/Images/mini_connection_uno2.png" class="width60">

--- | --- | --- | ---| --- | ---
Mini 引脚 | EN | IN3 | IN2 | IN1 | GND
UNO 引脚 | 4 | 5 | 6 | 9 | GND

```cpp
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 6, 5, 4);
```

下图显示了 SimpleFOCMini 与 stm32 Bluepill 开发板的连接示例。
<img src="extras/Images/mini_connection_bluepill.png" class="width60">


--- | --- | --- | ---| --- | ---
Mini 引脚 | EN | IN3 | IN2 | IN1 | GND
Bluepill 引脚 | PB15 | PA8 | PA9 | PA10 | GND

```cpp
BLDCDriver3PWM driver = BLDCDriver3PWM(PA10, PA9, PA8, PB15);
```