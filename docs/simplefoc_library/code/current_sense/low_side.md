---
layout: default
title: Low-Side Current Sense
nav_order: 2
permalink: /low_side_current_sense
parent: Current Sensing
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Low-side current sensing
Low-side current sensing is probably the most common current sensing technique. The main reason why is because it does not require neither high-performance PWM rejection current sense amplifiers (as inline does) neither high-voltage supporting amplifiers (as high-side does). The shunt resistors are always placed in between low side mosfets and the ground making sure that the amplifiers always has very low voltages on its terminals. The main drawback of this approach is that since the current passing through the shunt resistors is phase current only if the  corresponding low side mosfet is on we can only measure it in those moments. The PWM frequency is usually 20 to 50 kHz, which means that the low-side mosfets turns on and off 20,000 to 50,000 times per second, therefore the synchronization in between PWM setting and ADC acquisition is very very important.

Low side current sensing will be implemented soon. The main issue at the moment is very hardware specific synchronisation procedure of the PWM generation and ADC triggering. Therefore it is possible that this implantation will be done one MCU architecture at the time. 


<img src="extras/Images/low-side.png" class="width50">
<img src="extras/Images/low_side_sync.png" class="width40">