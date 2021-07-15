---
layout: default
title: Current Sensing
nav_order: 5
parent: Writing the Code
permalink: /current_sense
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: True
has_toc: False
---

# Current sensing 

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> has as a goal to support FOC implementation with (at least) three most standard types of current sensing:

- [In-line current sensing](inline_current_sense)
- [Low-side current sensing](low_side_current_sense) - *Not supported yet*
- [High-side current sensing](high_side_current_sense) - *Not supported yet*

up to this moment ( [check the releases <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases) ), Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> supports only in-line current sensing. 

Each one of the current sensing classes will implement all the necessary functionalities for simple and robust implementation of FOC algorithm:
- Hardware config
  - ADC resoluton and frequency
  - Automatic zero offset finding
- Driver synchronisation
  - ADC acquisition events triggering
  - Adaptive alignment with driver phases
- Reading the phase currents
  - Calculation of the current vector magnitude 
  - Calculation of the FOC d and q currents 

Each of the implemented classes can be used as stand-alone classes and they can be used to read current values on BLDC driver outputs out of scope of the Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>, see example codes in `utils > current_sense_test`.
In order for FOC algorithm to work the current sense classes are linked to a `BLDCMotor` class which uses the driver to read the FOC currents.   

## 🎯 Our implementation goals
The current sense code will be written in a way to support as many different drivers out there as possible and in a way to be fully interchangeable. Due to the very hardware specific implementations of the ADC acquisition for different MCU architectures and due to very different driver/adc synchronisation requirements for different current sensing approaches this task is probably one of the most complex challenges for the <span class="simple">Simple<span class="foc">FOC</span>library</span> so far. Therefore the worrk will be done in iterations and each release will better and better support.  Please make sure to follow out github and [check the releases <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases).

Also make sure to follow our [community forum](https://community.simplefoc.com), a lot of discussions is being held about current sensing and its applications!

## Digging deeper
For more theoretical explanations and source code implementations of the current sensing and its integration into the FOC and motion  check out the [digging deeper section](digging_deeper).