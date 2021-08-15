---
layout: default
title: Voltage Mode
parent: Torque Mode
grand_parent: Motion Control
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /voltage_torque_mode
nav_order: 1
---

# Torque control using voltage 
This torque control approach allows you to run the BLDC motor as it is simple DC motor, where you set the target voltage <i>U<sub>q</sub></i> to be set to the motor and the FOC algorithm calculates the necessary phase voltages <i>u<sub>a</sub></i> ,<i>u<sub>b</sub></i> and <i>u<sub>c</sub></i> for smooth operation. This mode is enabled by:
```cpp
// voltage torque control mode
motor.torque_controller = TorqueControlType::voltage;
```
## How does it work exactly
 <a name="foc_image"></a><img src="extras/Images/voltage_loop.png" class="width40">

The voltage control algorithm reads the angle <i>a</i> from the position sensor and the gets target <i>U<sub>q</sub></i> voltage value from the user and using the FOC algorithm sets the appropriate <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> and <i>u<sub>c</sub></i> voltages to the motor. FOC algorithm ensures that these voltages generate the magnetic force in the motor rotor exactly with <i>90 degree</i> offset from its permanent magnetic field, which guarantees maximal torque, this is called commutation.

The assumption is that the torque generated in the motor is proportional the voltage as <i>U<sub>q</sub></i> set buy user. Maximal torque corresponds to the maximal <i>U<sub>q</sub></i> which is conditioned by the power supply voltage available, and the minimal torque is of course for <i>U<sub>q</sub></i> = 0.

If the user provides the phase resistance value of the motor, the user can set the desired current <i>I<sub>d</sub></i> and the library will automatically calculate the appropriate voltage <i>U<sub>q</sub></i>. This can be done either through the constructor for example
```cpp
// BLDCMotor(pole pair number, phase resistance)
BLDCMotor motor = BLDCMotor( 11, 2.5 );
```
or just setting the parameter:
```cpp
motor.phase_resistance = 2.5; // ex. 2.5 Ohms
```

<a name="foc_image"></a><img src="extras/Images/voltage_mode.png" class="width50">

<blockquote class="warning">
⚠️ The resulting current in the motor can, in some cases, be higher than the desired current <i>I<sub>d</sub></i> but the order of the magnitude should be preserved.
</blockquote>

For more info about the theory of the torque control check the section [Digging deeper section](digging_deeper) or go directly to [torque control theory](voltage_torque_control).

## Configuration parameters
This control loop is very basic and it doesn't really have any configuration parameters. 

## Torque control example code
A simple example of the voltage based torque control and setting the target **current** by serial command interface. 

```cpp
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.variable(&motor.target, cmd); }

void setup() { 
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // set the torque control type
  motor.phase_resistance = 12.5; // 12.5 Ohms
  motor.torque_controller = TorqueControlType::voltage;
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target current");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target current using serial terminal:"));
  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();

  // user communication
  command.run();
}
```