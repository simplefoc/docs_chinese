---
layout: default
title: Communication
nav_order: 8
permalink: /communication
parent: Writing the Code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---


# Built-in communication interfaces
<span class="simple">Simple<span class="foc">FOC</span>library</span> implements a simple communication solution for fast and easy prototyping, tunning and monitoring of your setup:
- 📈 Supervision and variable monitoring - [Monitoring](monitoring) 
- ⚙️ Tunning and Configuration interface - [Commander interface](commander_interface)

Additionally we will try to provide an implementation of the simplest forms of the communication protocols:
- [Step-direction interface](step_dir_interface)
- PWM interface - *not supported yet*


<blockquote class="info"><p class="heading">What about CAN and RS485?</p>
<span class="simple">Simple<span class="foc">FOC</span>library</span>'s main objective is to provide an efficient low level motion motor control for BLDC and stepper motors. Now when it comes to the communication protocols, that is usually a bit out of scope of this library. This is mostly due to the vast universe of possible communication strategies one can implement and use for control of the motor, depending on the specific application, setup adaptability and the hardware available. Moreover, if the application requires advanced communication protocols such as CAN, RS485 and similar there are great libraries out there that cover this topic in depth and you will have no issue linking them to this library. We will try to provide some examples.
</blockquote>
