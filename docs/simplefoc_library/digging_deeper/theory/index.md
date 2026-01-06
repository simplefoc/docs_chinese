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
toc: true
---

# 理论爱好者角落

本部分旨在解释 Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>实现中的一些有趣的理论特性。目前，我仅简要撰写了几个主题，但计划涵盖更多主题并进行更深入的探讨。


<div style="display:grid; width:100%">
    <div >
        <a href="voltage_torque_control">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> 采用电压的扭矩控制</h3>
        </a>
        <p> 关于使用电压而非电流进行扭矩控制的简要解释和原理说明。 </p>
    </div>
    <div>
        <a href="foc_theory">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> 磁场定向控制算法</h3>
        </a>
        <p> 对所实现的调制方法以及 BLDC 电机 FOC 算法主要原理的简要概述。</p>
    </div>
    <div>
        <a href="low_pass_filter">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> 低通滤波器理论</h3>
        </a>
        <p> 低通滤波器的微分方程及实现细节。</p>
    </div>
    <div>
        <a href="pi_controller">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> PID 控制器理论</h3>
        </a>
        <p> PID 控制器的微分方程及实现细节。</p>
    </div>
    <div>
        <a href="alignment_procedure">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> 传感器-电机校准流程</h3>
        </a>
        <p> 对电机和位置传感器校准流程以及初始转子位置重要性的解释。</p>
    </div>
    <div>
        <a href="current_sense_align">
            <h3 style="color:inherit"> <i class="fa fa-lg fa-graduation-cap" style="padding:10px"></i> 电流传感校准流程</h3>
        </a>
        <p> 对自动电流传感校准流程的解释。</p>
    </div>
<div>