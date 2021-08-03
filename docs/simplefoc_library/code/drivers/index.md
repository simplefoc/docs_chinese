---
layout: default
title: Driver code
nav_order: 3
parent: Writing the Code
permalink: /drivers_config
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# Driver configuration（驱动器配置）

<div class="width60">
<img src="extras/Images/drv8302.png" style="width:25%;display:inline"><img src="extras/Images/bgc_30.jpg" style="width:25%;display:inline"><img src="extras/Images/l6234.jpg" style="width:25%;display:inline"><img src="extras/Images/l298n.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 支持无刷直流电机和步进电机：

- [无刷直流电机 <i class="fa fa-external-link"></i>](bldcdriver)
    
    - **3 PWM 信号** ( 3 相 ) - `BLDCDriver3PWM`
    - **6 PWM 信号** ( 3 相 ) - `BLDCDriver6PWM`
- [Stepper drivers <i class="fa fa-external-link"></i>](stepperdriver)
    - **4 PWM 信号** ( 2 相 )  - `StepperDriver4PWM`

    

该代码可以适应不同的驱动器，并且通用性高。
这些类可以作为独立的类使用，可以用来设置某些PWM值作为驱动器输出，参见 `utils > driver_standalone_test` 中的实例代码。