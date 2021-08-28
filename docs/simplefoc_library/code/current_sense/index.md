---
layout: default
title: 电流检测
nav_order: 5
parent: 代码
permalink: /current_sense
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# 电流检测

Arduino<span class="simple">Simple<span class="foc">FOC</span>library </span>的目标是通过（至少）三种最标准的电流传感支持FOC：

- [在线电流检测](inline_current_sense)
- [低压侧电流检测](low_side_current_sense) - *暂不支持*
- [高压侧电流检测](high_side_current_sense) - *暂不支持*

到目前为止( [检查发行版 <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases) ), Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 只支持在线电流检测

当前的每一种检测类别都将实现所有必要的功能，以实现简单鲁棒的FOC算法：
- 硬件配置
  - ADC分辨率与频率
  - 自动零偏移查找
- 驱动器同步
  - ADC模拟量采集的事件触发
  - 驱动器相位自适应对准
- 读取相电流
  - 电流矢量幅值的计算
  - FOC d和q电流的计算

每个实现的类都可以用作独立类，它们也可以用于读取Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>范围之外的BLDC驱动器输出的电流值，请参见`utils > current_sense_test`中的示例代码。

为了使FOC算法工作，电流检测类与`BLDCMotor` 类相链接，该类使用驱动器读取FOC电流。

## 🎯我们的执行目标
电流检测代码希望支持尽可能多的不同驱动程序，同时也希望可以完全互换。由于针对不同MCU架构，ADC采集会有不同的硬件实现，以及不同电流传感方法对驱动器/ADC同步要求非常不同，该任务可能是SmpleFOC库中最复杂的挑战之一远的因此，这项工作将在迭代中完成，并且每个版本都将越来越好地提供支持。请确保遵循github并[检查发行版<i class="fa-fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases).

同时确保关注我们的[社区论坛](https://community.simplefoc.com)，许多关于当前传感及其应用的讨论正在进行中！

## 深入挖掘
有关当前传感及其与FOC和运动的集成的更多理论解释和源代码实现，请查看[深入挖掘部分](digging_deeper)。

