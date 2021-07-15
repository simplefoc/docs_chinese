---
layout: default
title: Torque Mode
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /torque_mode
nav_order: 1
has_children: True
has_toc: False
parent: Motion Control
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Torque control modes

<img src="extras/Images/torque_modes.gif">

<span class="simple">Simple<span class="foc">FOC</span>library</span> gives you the choice of using 3 different torque control strategies:
- [Voltage mode](voltage_torque_mode) - `voltage`
- [DC current mode](dc_current_torque_mode) - `dc_current`
- [FOC current mode](foc_current_torque_mode) - `foc_current`

### Voltage mode - `voltage`
Torque control through voltage is the most basic torque control type, and it provides you an abstraction of the BLDC motor so that you can control it as a DC motor. It is based on the principle that the current is directly proportional to the voltage (it neglects the current dynamics) and therefore does not need any current sensing hardware.  For more info about this approach, visit our [digging deeper section](voltage_torque_control). **This torque control approach will be able to work on any BLDC driver board, regardless if it has current sensing or not.**

### DC current mode - `dc_current`
DC current control mode enables you to control the current of the BLDC motor as if it was a DC motor. Current sensing is used to obtain a overall magnitude of the current the motor is drawing and its direction, and the assumption is that the torque is proportional to the overall current. The benefit of this approach is that the true current set to the BLDC motor can be controlled very precisely it is a bit faster and more stable to execute for less-performant microcontrollers (such as Atmega328 family).

### FOC current mode - `foc_current`
FOC current control is the only true torque control approach. It controls two components of the current vector `q` and `d`. The torque is assumed to be proportional to the `q` current component and the `d` component of the current is controlled to remain equal to 0.

### Comparison

Torque control type | PROS | CONS
----- | ----- | ------
Voltage  | ✔️ Very simple and fast <br>✔️ Good performance with any MCU <br> ✔️ Very smooth on low speeds<br> ✔️ No current sense needed   | ❌ Not optimal on high speeds <br> ❌ Cannot control true current draw <br> ❌ Torque is approximated (low error on low speeds)
DC current  | ✔️ Can control true current draw <br> ✔️ Suitable for low performance MUCs <br> ✔️ Current limiting  | ❌ More complex to execute  (slower) <br> ❌ Can achieve lower speeds than voltage mode <br>❌ Torque is approximated (low error on low speeds) <br> ❌ Needs current sensing
FOC current  | ✔️ True torque control (any velocity) <br> ✔️ Can control true current draw <br> ✔️ Very efficient on higher velocities <br> ✔️ Current limiting | ❌ The most complex to execute (slowest) <br> ❌ Not suitable for low-performing MCUs (can become unstable) <br> ❌ Needs current sensing

For more information about the source code implementation of the motion control strategies check the [library source code documentation](motion_control_implementation)