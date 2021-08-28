---
layout: default
title: 理论
parent: 深入研究
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 1
permalink: /theory_corner
has_children: True
has_toc: False
---

# 相关理论研究

本节旨在解释 Arduino <span>Simple <span>FOC </span></span>library实现的一些有趣的理论特性。目前，我只简要地写了几个主题，但计划涵盖更多的主题，更深入。

<div style="display:grid; width:100%">
    <div >
        <a href="voltage_torque_control">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i>基于电压的力矩控制</h3>
        </a>
        <p>简短地解释和论证了用电压代替电流的力矩控制。</p>
    </div>
    <div>
        <a href="foc_theory">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> Field Oriented Control(FOC)算法</h3>
        </a>
        <p>简要概述了用于无刷直流电机的FOC算法的调制方法和主要使用规则。</p>
    </div>
    <div>
        <a href="low_pass_filter">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i>低通滤波理论</h3>
        </a>
        <p>低通滤波器微分方程和实现细节。</p>
    </div>
    <div>
        <a href="pi_controller">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> PID控制器理论</h3>
        </a>
        <p>PID控制器微分方程及实现细节。</p>
    </div>
<div>


