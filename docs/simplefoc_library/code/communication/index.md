---
layout: default
title: 内置通信接口
nav_order: 8
permalink: /communication
parent: 编写代码
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---


# 内置通信接口
<span class="simple">Simple<span class="foc">FOC</span>库</span>实现了一个简单的通信解决方案，用于快速便捷地原型开发、调试和监控您的装置：
- 📈 监控和变量监测 - [监测](monitoring)
- ⚙️ 调试和配置接口 - [命令器接口](commander_interface)

此外，我们将尝试提供最简单形式的通信协议实现：
- [步进-方向接口](step_dir_interface)
- PWM接口 - *暂不支持*


<blockquote class="info"><p class="heading">那CAN和RS485呢？</p>
<span class="simple">Simple<span class="foc">FOC</span>库</span>的主要目标是为BLDC和步进电机提供高效的底层运动电机控制。而说到通信协议，这通常有点超出本库的范围。这主要是因为，根据具体应用、装置适应性和可用硬件，人们可以实现和使用各种各样的通信策略来控制电机。此外，如果应用需要诸如CAN、RS485等高级通信协议，市面上有很多优秀的库深入涵盖了这一主题，您将很容易把它们与本库关联起来。我们会尝试提供一些示例。
</blockquote>