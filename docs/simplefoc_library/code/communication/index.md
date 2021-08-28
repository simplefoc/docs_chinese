---
layout: default
title: 内置通信接口
nav_order: 8
permalink: /communication
parent: 代码
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---


# 内置通信接口
<span class="simple">Simple<span class="foc">foc</span>库</span>实现了一个简单的通信方案，可快速方便地对所设置的参数进行测试、调试和监控：

- 📈 监督和变量监测 - [Monitoring](monitoring) 
- ⚙️ 调试和配置接口 - [Commander interface](commander_interface)

 此外，我们尝试提供一个可以简单执行的通信协议，该协议支持：

- [Step-Direction 接口 ](step_dir_interface)
- PWM接口-*尚不支持*

<blockquote class="info"><p class="heading">关于CAN总线和RS485</p>
    <span class=“simple”>SimpleFOC 库</span>的主要目标是提供一个简单且有效率的无刷电机和步进电机控制方法。所以通信协议方面的实现其实超出了本库的目标范畴。之所以这样说，是因为根据特定的应用、开发体系适应和硬件能力，可用于控制电机的通信协议其实是多种多样的。再者，当一个应用需要更采用高级通信协议（如CAN、RS485等）时，其实有很多更棒的库可以采用，这些库都可以顺畅无比的连接到SFOC库中。我们会尝试提供一些这方面的例程。


