---
layout: default
title: Microcontrollers
nav_order: 4
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /microcontrollers
parent: Supported Hardware
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: true
has_toc: false
---

# Supported microcontrollers

Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> supports:
- [Arduino UNO/MEGA, Arduino DUE](arduino_mcu) 
- [STM32](stm32_mcu)
- [ESP32](esp32_mcu)
- [Teensy](teensy_mcu)
- [SAMD21/SAMD51](samd_mcu)
- [Raspberry Pi Pico](rpi_mcu) - *initial support*

devices *off-the-shelf*, using Arduino IDE, and with small modifications many more... 😃



# Choosing the microcontroller

Even though <span class="simple">Simple<span class="foc">FOC</span>library</span> supports many microcontrollers and all of the will work with most of the BLDC motors+BLDC driver+sensor combinations, their performance will not be the same. So here are some comparisons and our thoughts how to chose your mcu and where to start.

This is teh comparison of the PWM features implemented for different microcontroller families:

MCU | 2 PWM mode | 4PWM mode | 3 PWM mode | 6 PWM mode | pwm frequency config 
--- | --- |--- |--- |--- |--- 
Arduino (8-bit) | ✔️ | ✔️ | ✔️ | ✔️ | ❌ (32kHz)
Arduino DUE  | ✔️ | ✔️ | ✔️ | ❌ | ✔️
stm32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️
esp32 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
samd21/51 | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 
teensy | ✔️ | ✔️ | ✔️ | ❌ | ✔️ 
Raspberry Pi Pico | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ 

Fwom this table you can see that if you need teh 6PWM mode for your application you should avoid using Teensy and Arduino DUE boards for now.


Even though all the MCUs from the table above (and many more) are supported in the library and all of the will work with most of the BLDC motors+BLDC driver+sensor combinations, their performance will not be the same. So here is a quick guide how to choose which MCU to use.

Board | Family | `loopFOC() + move()` - encoder | `loopFOC() + move()` - magnetic sensor SPI | `loopFOC() + move()` - magnetic sensor I2C
--- | --- | --- | --- | --- |
HMBGC V2.2 | Arduino 8-bit | 800us (ipr = 0),  ~10ms (ipr > 10000) | (doesn't support SPI) | 1100us
Arduino UNO | Arduino 8-bit | 800us (ipr = 0),  ~10ms (ipr > 20000) | 1200us | ~1000us
Bluepill | STM32 | 200us (ipr = 0), ~1ms (ipr > 50000) | 300us | ~1000us
Nucleo-64 | STM32 | 100us (ipr = 0), ~500us (ipr > 50000) | 200us | ~1000us
Arduino DUE | Arduino SAM | 200us (ipr = 0), ~800us (ipr > 50000) | 300us | ~1000us
ESP32 D1 R32 | ESP32 | 100us (ipr = 0), ~500us (ipr > 50000) | 200us | ~1000us
Teensy3.1 | Teensy | 200us (ipr = 0), ~800us (ipr > 50000) | 300us | ~1000us
Nano 33 | SAMD21  | 200us (ipr = 0), ~800us (ipr > 50000) | 300us | ~1000us

*ipr = interrupt callbacks per second.


In the table above you can a comparison of the execution times of the FOC loop for different MCUs. When you are deciding which MCU to use with your project please make sure that your loop execution time `loopFOC() + move()`, in the worst case, will not be greater 3-4ms. And for optimal performance your loop time should be under 2ms. Make sure to account for multiple motors.

## Gimbal controllers
Gimbal controllers are the most simple and surely the cheapest solution for running FOC algorithm with your gimbal motor. They are perfect for smooth position/velocity controlling two BLDC motors with sensors if you don't have high constraints on dynamics. Their main disadvantage is that they use all the external interrupt pins for PWM signals and therefore you cannot access them from outside. That would mean that even if you only need one motor (3PWMs) you will still not be able to use pin `2` and `3` for encoder `A` and `B` signals. This means, if you are planing to use encoders with these boards you will need to use software interrupts. The good news is that this will work, the bad news is that the performance of counting encoder signals will be impaired. So I would suggest you to use Magnetic sensors with communication interface (SPI, I2C...) with these boards if possible.  

Don't let this discourage you from using the gimbal controllers with FOC, just be aware of possible side-effects when deciding which motor and sensor to use. 

<blockquote class="warning"> Make sure your gimbal controller has communication interface pins you need, available before buying it. </blockquote>

## Arduino MCUs
Arduino devices, such as UNO,MEGA,NANO and similar, are probably the most commonly used microcontrollers there is, and therefore probably with this library as well. The simplicity of using these boards si incomparable. If you are planning to run this library with the Arduino device I would certainly suggest you to think about using Magnetic sensors instead of encoders. Encoders are highly inefficient sensors (at least their implementation for Arduino UNO & MEGA) and due to constant counting the interrupt signals of the encoder produces a large difference of execution time depending on velocities you are driving your motor. 

<blockquote class="warning">
<p class="heading">Encoder CPR: Rule of thumb for Arduino UNO/MEGA</p>
For Arduino UNO, the maximum number of pulses/second should not exceed 20,000. After this value it start to have execution issues. 
Please take this in consideration when choosing the encoder and especially if using more than one motor.<br>
<p class="heading">Example</p>
If your CPR value is 10000, you will be able to spin your motor with max velocity 120rpm - 2 rotations/second 
</blockquote>

Additionally Arduino UNO has only two encoder interrupt pins and if you are running two motors with encoders on your Arduino UNO you will be forced to use software interrupt callback which introduce additional augmentation in execution times. Arduino MEGA has 6 interrupts and you should not have this problem.

This library will enable you to use Arduino UNO/MEGA as your FOC brain and you can still do a lot of cool stuff with it even with two motors. Just be aware of the role of thumb if you are using the encoders. 

## STM32 devices
Stm32 devices are probably the best choice for the FOC implementation MCU. They are very powerful and have many external interrupt pins. They don't loose too much performance due to counting and have much lower loop times making the FOC algorithm much smoother. Stm32 Bluepill can run up to 4 BLDC motors without a problem and Nucleo-64 can run 6+.

The biggest problem of using the STM32 boards in the community is the complexity of programming these devices. But since they have been integrated into the Arduino IDE even this is not a problem any more. Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> code for stm32 devices is exactly the same as for Arduino UNO except the different pin numbers. Therefore I strongly urge you to consider using these devices in your projects because the results are awesome. 😃

<blockquote class="info"> Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> is completely compatible with Nucleo-64 devices. And from the shield version 1.3.1 you will be able to stack 2 of the shields with the Nucleo boards as well.</blockquote>

## ESP32 devices
ESP32 devices are very interesting choice for running this library. They have superb communication interfaces and they move the user interaction with the motor  to the next level. ESP32 devices are, in theory, capable of running 4 BLDC motors at the same time with this library. ANd their performance will be much better than the one of the Arduino devices. Especially since they don't have problems with external interrupt limitations.

There are two main problems when using ESP32 boards with for real time motor control.

- ESP32 boards were not originally designed for precise real-time control tasks, they have exceptional communication capabilities, therefore sometimes you can have some strange problems due to this fact. But in 99% of situations this board will perform exceptionally well, it is just if you were planning bring it to its limits when the strange things can happen.
- The other problem of this board is the pinout limitations. Make sure, if you are new with the ESP32, that you watch this [YouTube video](https://www.youtube.com/watch?v=c0tMGlJVmkw). On startup some of the GPIOs have to be in specific states in order to the ESP32 to boot normally. But this is not a big problem once you get used to it!

This board has a lot of benefits and it seems like we will see much more of it in the domain of real-time motor control in future.



<h2><i class="fa fa-lg"><svg id="fab-discourse" style="width:20px;fill:#44a8fa" viewBox="0 0 448 512"><path d="M225.9 32C103.3 32 0 130.5 0 252.1 0 256 .1 480 .1 480l225.8-.2c122.7 0 222.1-102.3 222.1-223.9C448 134.3 348.6 32 225.9 32zM224 384c-19.4 0-37.9-4.3-54.4-12.1L88.5 392l22.9-75c-9.8-18.1-15.4-38.9-15.4-61 0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128z"></path> </svg></i> <span class="simple">Simple<span class="foc">FOC</span> Community</span></h2>

If you have ported the library to another device or you are searching for help to port it to some specific device don't hesitate to post in [community forum](https://community.simplefoc.com) 

It is always helpful to hear the stories/problems/suggestions of people implementing the code and you might find a lot of answered questions there already! 

<div class="image_icon width80" >
    <a href="https://community.simplefoc.com" target="_blank">
        <img src="extras/Images/community.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
