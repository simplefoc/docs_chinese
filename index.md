---
layout: default
title: Home
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) project documentation."
permalink: /基于Arduino 的 SimpleFOC 控制器 😃中文文档
---
# 基于Arduino 的 SimpleFOC 控制器😃中文文档

![Library Compile](https://github.com/simplefoc/Arduino-FOC/workflows/Library%20Compile/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![arduino-library-badge](https://www.ardu-badge.com/badge/Simple%20FOC.svg?)

We live in very exciting times 😃! BLDC motors are entering the hobby community more and more and many great projects have already emerged leveraging their far superior dynamics and power capabilities. BLDC motors have numerous advantages over regular DC motors but they have one big disadvantage, the complexity of control. Even though it has become relatively easy to design and manufacture PCBs and create our own hardware solutions for driving BLDC motors the proper low-cost solutions are yet to come. One of the reasons for this is the apparent complexity of writing the BLDC driving algorithms, Field oriented control (FOC) being an example of one of the most efficient ones.
The solutions that can be found on-line are almost exclusively very specific for certain hardware configuration and the microcontroller architecture used.
Additionally, most of the efforts at this moment are still channeled towards the high-power applications of the BLDC motors and proper low-cost and low-power FOC supporting boards are very hard to find today and even may not exist. <br>
Therefore this is an attempt to: 

- 🎯 Demystify FOC algorithm and make a robust but simple Arduino library: [Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> ](#arduino-simplefoclibrary-v160)
  - <i>Support as many <b>motor + sensor + current sense + driver + mcu</b> combinations out there</i>
- 🎯 Develop a modular FOC supporting BLDC driver boards:
   - *Low-power* gimbal driver (<5Amps) :   [Arduino <span class="simple">Simple<b>FOC</b>Shield</span> ](arduino_simplefoc_shield_showcase).
   - ***NEW*** 📢: *Medium-power* BLDC driver (<30Amps): [Arduino <span class="simple">Simple<b>FOC</b>PowerShield</span> ](https://github.com/simplefoc/Arduino-SimpleFOC-PowerShield).
   - See also [@byDagor](https://github.com/byDagor)'s *fully-integrated* ESP32 based board: [Dagor Brushless Controller](https://github.com/byDagor/Dagor-Brushless-Controller)


<blockquote class="info">
   <p class="heading">NEW RELEASE 📢: <span class="simple">Simple<span class="foc">FOC</span>library</span> v2.1.1 - <a href="https://github.com/simplefoc/Arduino-FOC/releases/tag/v2.1.1">see release</a></p>
   <ul>
      <li>Raspberry pi Pico initial support  - <a href="rpi_mcu">see in docs</a></li>
      <li>SAMD51 support  - <a href="samd_mcu">see in docs</a></li>
      <li>full support of the <a href="studio">Simple<b>FOC</b>Studio</a> - <a href="studio">see in docs</a></li>
      <li>added initial support for <code class="highlighter-rouge">MagneticSensorPWM</code> <a href="magnetic_sensor_pwm">see in docs</a></li>
      <li>improved esp32 implementation to avoid the need for <code class="highlighter-rouge">mcpwm.h</code> changes by @tschundler</li>
      <li>added examples fot the PowerShield</li>
      <li>added examples to find the raw max and min of the analog and pwm sensor</li>
      <li>extension of the Commander interface EOL character + additional commands  - <a href="commander_interface">see in docs</a></li>
   </ul>
</blockquote>


## Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> <i><small>v2.1.1</small></i>
<iframe class="youtube"  src="https://www.youtube.com/embed/Y5kLeqTc6Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
This video demonstrates the Simple FOC library basic usage, electronic connections and shows its capabilities.

### 特性
- **Arduino compatible**: 
   - Arduino library code
  - Arduino Library Manager integration
- **Open-Source**: Full code and documentation available on github
- **Easy to setup and configure**: 
  - Easy hardware configuration
  - Easy [tuning the control loops](motion_control)
- **Modular**:
  - Supports as many [sensors,  BLDC motors  and  driver boards](supported_hardware) as possible
  - Supports multiple [MCU architectures](microcontrollers):
     - Arduino: UNO, MEGA, any board with ATMega328 chips
     - STM32 boards: [Nucleo](https://www.st.com/en/evaluation-tools/stm32-nucleo-boards.html), [Bluepill](https://stm32-base.org/boards/STM32F103C8T6-Blue-Pill.html) ...
     - ESP32
     - Teensy boards
- **Plug & play**: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 


## Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <i><small>v2.0.3</small></i>
<iframe class="youtube"  src="https://www.youtube.com/embed/G5pbo0C6ujE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
### 特性
- **Plug & play**: In combination with Arduino *Simple**FOC**library* - [github](https://github.com/simplefoc/Arduino-FOC)
- **Low-cost**: Price of €15 - [Check the pricing](https://www.simplefoc.com/shop) 
- **In-line current sensing**: Up to 3Amps/5Amps bidirectional
   - configurable: 3.3Amps - 3.3V adc, 5Amps - 5V adc
- **Integrated 8V regulator**: 
   - Enable/disable by soldering pads
- **Max power 120W** - max current 5A, power-supply 12-24V
   - Designed for Gimbal motors with the internal resistance >10 Ωs. 
- **Stackable**: running 2 motors in the same time
- **Encoder/Hall sensors interface**: Integrated 3.3kΩ pullups (configurable)
- **I2C interface**: Integrated 4.7kΩ pullups (configurable)
- **Configurable pinout**: Hardware configuration - soldering connections
- **Arduino headers**: Arduino UNO, Arduino MEGA, STM32 Nucleo boards...
- **Open Source**: Fully available fabrication files - [how to make it yourself](https://docs.simplefoc.com/arduino_simplefoc_shield_fabrication)

##### If you are interested in this board as a product, find more information on this link: [Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](https://simplefoc.com/simplefoc_shield_product)


<p><img src="extras/Images/simple_foc_shield_v13_small.gif" class="img200" ><img src="https://simplefoc.com/assets/img/v1.jpg" class="img200 img_half" ><img src="https://simplefoc.com/assets/img/v2.jpg" class="img200 img_half" ></p>
## Alternative FOC supporting projects
These are just a few of the alternative FOC supporting projects which provide hardware and software solutions. 

<a href="https://odriverobotics.com/" >Odrive</a> | <a href="https://www.youtube.com/watch?v=g2BHEdvW9bU">Trinamic</a> | <a href="https://www.infineon.com/cms/en/product/evaluation-boards/bldc_shield_tle9879/" >Infineon</a> | <a href="https://github.com/gouldpa/FOC-Arduino-Brushless">FOC-Arduino-Brushless</a>
------------ | ------------- | ------------ | -------------
<img src="https://static1.squarespace.com/static/58aff26de4fcb53b5efd2f02/t/5c2c766921c67c143049cbd3/1546417803031/?format=1200w" style="width:100%;max-width:250px"  > | <img src="https://i3.ytimg.com/vi/g2BHEdvW9bU/maxresdefault.jpg" style="width:100%;max-width:250px"  > | <img src="https://www.infineon.com/export/sites/default/_images/product/evaluation-boards/BLDC_Motor_Shild_with_TLE9879QXA40.jpg_1711722916.jpg" style="width:100%;max-width:250px"  >| <img src="https://hackster.imgix.net/uploads/attachments/998086/dev_kit_89eygMekks.jpg?auto=compress%2Cformat&w=1280&h=960&fit=max" style="width:100%;max-width:250px"  >
✔️ Open Source | ❌ Open Source | ✔️ Open Source(recently) | ✔️ Open Source
✔️Simple to use | ✔️ Simple to use | ✔️Simple to use | ❌ Simple to use
❌ Low cost ($100) | ❌ Low cost ($100) | ✔️Low cost ($40) | ✔️ Low cost
❌ Low power (>50A) | ✔️ Low power  | ✔️  Low power | ✔️ Low power
❌ Stepper support | ❌ Stepper support | ❌ Stepper support | ❌ Stepper support