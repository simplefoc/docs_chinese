---
layout: default
title: StepperDriver
nav_order: 2
permalink: /stepperdriver
parent: Driver code
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# Stepper Driver configuration

<div class="width60">
<img src="extras/Images/l298n.jpg" style="width:25%;display:inline"><img src="extras/Images/sd_m13.jpg" style="width:25%;display:inline"><img src="extras/Images/shield_monster.jpg" style="width:25%;display:inline">
</div>

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> implements support for two types of Stepper driver control interfaces:<br>
- [4PWM <i class="fa fa-external-link"></i>](stepper_driver_4pwm) - class `StepperDriver4PWM`
- [2PWM <i class="fa fa-external-link"></i>](stepper_driver_2pwm) - class `StepperDriver2PWM`

Classes `StepperDriver2PWM` and  `StepperDriver4PWM` provide an abstraction layer of all the hardware/platform specific code for all the supported platforms: atmega328, esp32, stm32, sam, samd and teensy. 
They implement:
- PWM configuration
    - PWM frequency
    - PWM center-alignment 
    - Direction channel handling (2PWM)
    - Complementary direction channel  (2PWM)
- PWM duty cycle setting 
- Voltage limiting

These classes can be used as stand-alone classes and they can be used to set certain PWM value to the stepper driver outputs, see example codes in `utils > driver_standalone_test`.
In order for FOC algorithm to work the `StepperDriverxPWM` classes are linked to a `StepperMotor` class which uses the driver to set the appropriate phase voltages.   

The driver code is written in a way to support as many different drivers out there as possible and in a way to be fully interchangeable. 

## Digging deeper
For more theoretical explanations and source code implementations of the FOC algorithm and the motion control approaches check out the [digging deeper section](digging_deeper).
