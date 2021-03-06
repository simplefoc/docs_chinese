---
layout: default
title: 磁力传感器
parent: 位置传感器
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 3
permalink: /magnetic_sensor
has_children: True
has_toc: False
---


# 磁力传感器
<div class="width60">
<img src="extras/Images/mag0.jpg" style="width:32%;display:inline"><img src="extras/Images/mag.jpg" style="width:32%;display:inline"><img src="extras/Images/mag2.jpg" style="width:32%;display:inline">
</div>


磁力传感器在这个库中 ([current version <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases)) 支持的通信方式有:
- **SPI** - [MagneticSensorSPI](magnetic_sensor_spi)
- **I2C** - [MagneticSensorI2C](magnetic_sensor_i2c)
- **Analog** - [MagneticSensorAnalog](magnetic_sensor_analog)
- **PWM** - [MagneticSensorPWM](magnetic_sensor_pwm)
- **ABI** - *equivalent to encoder sensors* - [encoder docs <i class="fa fa-external-link"></i>](encoder)
- **UVW** - *equivalent to hall sensors* - [hall sensors docs <i class="fa fa-external-link"></i>](hall_sensors).

