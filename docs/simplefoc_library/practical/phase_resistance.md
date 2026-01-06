---
layout: default
title: 相点阻
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /phase_resistance
parent: 实用指南
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 相电阻

“相电阻”这一术语在含义和测量方法上可能存在一些歧义。本页面旨在解释如何测量其值，这是 SimpleFOC 中多种控制算法所必需的。

在本文档中，相电阻指的是电机内部单个线圈的电阻，单位为欧姆。线电阻是两个（非中心）电机引线之间的电阻。

## 三相电机的识别

对于三相 BLDC 电机，首先需要了解电机是星形（Y 形）还是三角形（Δ 形）绕组。了解之后，通过相间测量值计算相电阻就很简单了。

此外，三相电机可能有 3 根或 4 根引线，这会影响相电阻的测量方式。对于星形电机，第四根引线对应中心点（又称“星点”），与其他引线之间的电阻测量值最小。

![3-phase-configurations.svg](extras/Images/3-phase-configurations.svg)

> 三相电机的常见配置（[来源](https://en.wikipedia.org/wiki/File:Delta-Star_Transformation.svg)）。

## 测量步骤

不同线圈配置和引线数量的相电阻测量步骤。你需要一个可以测量电阻的万用表和清醒的头脑。

### 3 线星形

图示：

![3-phase-3-wire-star.svg](extras/Images/3-phase-3-wire-star.svg "3-phase-3-wire-star.svg")

步骤：

1. 用万用表测量任意两根引线之间的电阻（单位为欧姆），这称为“线电阻”。所有三对可能的引线测量值必须相同。
2. **将测量值除以 2**，得到电机的相电阻最终值。

> 在星形配置中，每对引线之间测量的是两个相的电阻，因此测量得到的电阻必须除以 `2`。

### 4 线星形

图示：

![3-phase-4-wire-star.svg](extras/Images/3-phase-4-wire-star.svg)

在这种情况下，你需要首先确定连接到“中心点”的引线（在上图中标记为 `N_abc`）。

步骤：

1. 用万用表测量所有引线对之间的电阻（单位为欧姆），寻找与其他引线对相比电阻恰好为一半的引线。
2. 电阻最小的那根引线连接到“中心点”。给它做好标记。
3. 测量你刚刚确定的中心点与其余三根引线中任意一根之间的电阻。这个值就是电机的相电阻。

> 在 4 线星形配置中，中心点（第四根引线）与三根主引线中任意一根之间的电阻就是相电阻，因为该测量不涉及其他相。

### 3 线三角形

图示：

![3-phase-3-wire-delta.svg](extras/Images/3-phase-3-wire-delta.svg)

步骤：

1. 用万用表测量所有引线对之间的电阻（单位为欧姆）。所有测量值必须相等。
2. **将测量值乘以 1.5**，得到电机的相电阻最终值。

> 在三角形配置中，测量的是所有相的总电阻；其中一相与其余两相串联后的部分并联。由于所有相电阻相等，测量值必须乘以 `1.5`。
