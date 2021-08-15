---
layout: default
title: High-Side Current Sense
nav_order: 3
permalink: /high_side_current_sense
parent: Current Sensing
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# High-side current sensing
High-side current sensing is probably the least common current sensing technique form the three discussed in this library. The main reason why is because it requires high-voltage supporting amplifiers. The shunt resistors are placed in between high-side mosfets and the DC power supply voltage, making the amplifiers always have high voltages on their terminals. The other drawback of this approach is that since the current passing through the shunt resistors is phase current only if the  corresponding high side mosfet is on we can only measure it in those moments. The PWM frequency is usually 20 to 50 kHz, which means that the high-side mosfets turns on and off 20,000 to 50,000 times per second, therefore the synchronization in between PWM setting and ADC acquisition is very very important.

High-side current sensing will be implemented later in the process, once when inline and low-side sensing is supported. The main issue at the moment is very hardware specific synchronisation procedure of the PWM generation and ADC triggering. Therefore it is possible that this implantation will be done one MCU architecture at the time. 
<img src="extras/Images/high-side.png" class="width50">
<img src="extras/Images/high_side_sync.png" class="width40">