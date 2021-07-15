---
layout: default
title: Getting started
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /example_from_scratch
parent: Writing the Code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# Let's get started

Once when you have your <span class="simple">Simple<span class="foc">FOC</span>library</span> [installed](installation) and you have all the necessary [hardware](supported_hardware), we can finally start the fun part, let's white the code and move the motor!

## Step 1. Testing the sensor
The first sign that tells us that everything is well connected is if the sensor readings are good. To test the sensor please browse the library examples `examples/utils/sensor_test` and find the example for your sensor. 
The example will have a structure something like this:
```cpp
#include <SimpleFOC.h>

Encoder encoder = Encoder(2, 3, 500);
// interrupt routine intialisation
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

void setup() {
  // monitoring port
  Serial.begin(115200);
  
  // initialise encoder hardware
  sensor.init();
  // hardware interrupt enable
  encoder.enableInterrupts(doA, doB);

  Serial.println("Encoder ready");
  _delay(1000);
}

void loop() {
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```
Make sure to change the sensor parameters to suite your application, such as pin numbers, impulses per revolution, bus addresses and similar. Make sure to go through the [sensor docs](sensors) if you are not sure in some of the parameters.  


If your sensor is well connected and if everything works well, you should have in your serial terminal an output of your sensor angle and velocity. 

<blockquote class="info"> <p class="heading">☑️ Simple test</p> Make sure to test that one rotation of the motor gives you <b>6.28</b> radians of sensor angle.</blockquote>

## Step 2. Testing the driver
Once your sensor is working you can proceed to the driver test. The simplest way to test the driver is to use the library examples. If you have a luxury of time you can test the driver using the examples in `examples/utils/driver_standalone_test` folder. These examples test the driver as a standalone module and with them you can set any voltage value to any of the driver phases. 
```cpp
#include <SimpleFOC.h>
// BLDC driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

void setup() {
  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 50000;
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;

  // driver init
  driver.init();

  // enable driver
  driver.enable();

  _delay(1000);
}

void loop() {
    // setting pwm (A: 3V, B: 1V, C: 5V)
    driver.setPwm(3,1,5);
}
```
<blockquote class="info"> <p class="heading">☑️ Simple tests</p>
Make sure that all phases output PWM signals, you can try to connect a small led light in between each phase and ground or just measure it with the multimeter.</blockquote>

## Step 2. Testing the driver + motor combination - open-loop
If you already have your motor connected and if you are sure your driver works well we advise you to test the motor+driver combination using the open-loop motion control examples in the `examples/motion_control/open_loop_motion_control`. If your driver is not the same as the ones provided in the examples go though the [driver docs](drivers_config) and find the driver and the code that will work for you. Additionally you can browse through the examples in teh `examples/utils/driver_standalone_test` folder and see the used in there.

Now here is an example of the open-loop velocity control for the `BLDCDriver3PWM`:
```cpp
// Open loop motor control example
#include <SimpleFOC.h>

// BLDC motor & driver instance
// BLDCMotor motor = BLDCMotor(pole pair number, phase resistance (optional) );
BLDCMotor motor = BLDCMotor(11);
// BLDCDriver3PWM driver = BLDCDriver3PWM(pwmA, pwmB, pwmC, Enable(optional));
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }

void setup() {

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  // motor.phase_resistance = 3.52 // [Ohm]
  // motor.current_limit = 2;   // [Amps] - if phase resistance defined
  motor.voltage_limit = 3;   // [V] - if phase resistance not defined
  motor.velocity_limit = 5; // [rad/s] cca 50rpm
 
  // open loop control config
  motor.controller = MotionControlType::velocity_openloop;

  // init motor hardware
  motor.init();

  // add target command T
  command.add('T', doTarget, "target velocity");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}
void loop() {

  // open loop velocity movement
  // using motor.voltage_limit and motor.velocity_limit
  motor.move();

  // user communication
  command.run();
}
```
This example code has few very important rules. 
1. Make sure you use the right driver class and right pwm pins, this one is usually very simple and you can find a lot of docs about these things in our [driver docs](drivers_config). If you are not sure and cannot seem to make it work please do not hesitate to ask in our [community forum](https://community.simplefoc.com).
2. Make sure to use proper voltage limit. `motor.voltage_limit` will directly determine the current passing through the motor: `current = phase_resistance*motor.voltage_limit`. So to avoid too high currents please try to find what is the phase resistance of your motor and set the `motor.voltage_limit` such that the current does not surpass 2 Amps for example: `motor.voltage_limit = 2*phase_resistance`. The best option would be to provide your phase resistance value to the motor by setting the parameter `motor.phase_resistance` and then you can use `motor.current_limit` instead of the `motor.voltage_limit` making this issue much simpler. If you cannot find the phase resistance of your motor and cannot measure it with your multimeter start small: `motor.voltage_limit < 1;`
3. Make sure to put the right pole pair number. This you can find in most data-sheets, if you are not sure what is the true number don't worry this step in intended to test exactly this value. 😄

<blockquote class="info"> <p class="heading">☑️ Simple tests</p> 1. In velocity mode, set your target velocity of your motor to <b>6.28 rad/s</b>, this should be exactly one rotation per second.<br>2. In position mode, set the target position of <b>6.28 rad</b>, it should be exactly one rotation <br> If it is not that means your pole pairs number is probably not good,, try changing it until you get exactly one rotation (or one rotation per second in velocity mode)</blockquote>

## Step 3. Closed-loop control - torque using voltage

Once you have a working sensor, working motor and driver you can proceed to the closed-loop motion control testing. The first one to test is the torque control mode using voltage, this one is the simplest form of the closed loop control that is available in the <span class="simple">Simple<span class="foc">FOC</span>library</span>. You can find the examples of this torque mode for different sensors in the library examples folder `examples/motion_control/torque_control`.
Here is an example of the `BLDCMotor3PWM` driver and `Encoder` as position sensor:
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
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }

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

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // add current limit
  // motor.phase_resistance = 3.52 // [Ohm]
  // motor.current_limit = 2;   // [Amps] - if phase resistance defined

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // set the initial motor target
  // motor.target = 0.2; // Amps - if phase resistance defined  
  motor.target = 2; // Volts 

  // add target command T
  // command.add('T', doTarget, "target current"); // - if phase resistance defined
  command.add('T', doTarget, "target voltage");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal:"));
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
Until now, you already know the good configuration of your sensor, your driver and your motor. If everything worked until this point you most probably will not have any issues with this step as well. 

There are only two important steps to be taken here, make sure you use not too high `motor.voltage_sensor_align` value to prevent too high currents. The rule is the same as for the `motor.voltage_limit` for the open loop. If you are not sure what is your phase resistance, start small: `motor.voltage_sensor_align < 1`. Additionally, you can define the motor phase resistance as well and then use the `motor.current_limit` variable, this variable will limit the `motor.voltage_sensor_align` and you will not have to worry about it any more. But if you specify the phase resistance value you will no longer be setting voltage command to the motor but current command, see [torque control docs](voltage_torque_mode) for more info.

Second important tip is to use [monitoring](monitoring) functionality. This will help you to debug the possible issues that might arise and it will output the motor status during the initialization and the alignment. If the initialisation fails the motor will be disabled you will be able to move the motor by hand without any resistance, if the code works your motor will start spinning and you will be abele to set the voltage (current if `motor.phase_resistance` set) through the serial terminal.

<blockquote class="info"> <p class="heading">☑️ Simple test</p> 
Make sure that the motor intialisation has finished well. Monitoring will tell you the sensnor offset, direciton, pole pairs check and it will tell you if it has been successful or if it failed. </blockquote>

## Step 5. Testing the current sense - if available
If your setup has current sensing that is supported by the <span class="simple">Simple<span class="foc">FOC</span>library</span> then we would suggest you to still make sure that you can run at least closed-loop torque control using voltage (Step 3.) before doing this step. 

The best way to start is to add the current sensing to the code of the torque control using voltage (step 3.) and output the d and q currents to the serial terminal using monitoring.

Here is the an example of a such code:
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

// current sensor
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }

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

  // current sense init hardware
  current_sense.init();
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // add current limit
  // motor.phase_resistance = 3.52 // [Ohm]
  // motor.current_limit = 2;   // [Amps] - if phase resistance defined

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsampling = 100; // set downsampling can be even more > 100
  motor.monitor_variables = _MON_CURR_Q | _MON_CURR_D; // set monitoring of d and q currents

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // set the initial motor target
  // motor.target = 0.2; // Amps - if phase resistance defined  
  motor.target = 2; // Volts 

  // add target command T
  // command.add('T', doTarget, "target current"); // - if phase resistance defined
  command.add('T', doTarget, "target voltage");
  command.verbose = VerboseMode::nothing; // disable commander output to serial

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal:"));
  _delay(1000);
}

void loop() {
  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();

  // display the currents
  motor.monitor();
  // user communication
  command.run();
}
```
This example code is almost exactly the same as the step 3. code so you should not have much troubles configuring motor, sensor and driver. In this step you will be testing if your current sense is working well. In the call of the `motor.monitor()` function the current sense will be read and the current d and q are going to be outputted to the serial terminal. You can open the Serial Plotter to visualise them. 

<blockquote class="info"> <p class="heading">☑️ Simple tests</p> 
1. Hold the motor with your hand and chaneg different target voltage/current values. Make sure that the current d is very close to 0 when the motor is static. And make sure that the current q is proportional to the voltage you are setting to the motor. <br>
2. Leave the motor to rotate. See that your currents d and q drop to a lower level then for static motor. Also try to see that the current d is almost 0 for low velocities and starts rising proportionally to the motor velocity. 
</blockquote>

Please go through the [current sense docs](current_sense) to see the supported sensors and all the configuration parameters.


## Step 6. Full FOC motion control using current sensing - if available
Once you have your motor, position sensor, driver and current sense configured and tested you can got proceed to the true foc control. 
```cpp
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(5, 10, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// inline current sensor instance
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

// commander communication instance
Commander command = Commander(Serial);
void doMotor(char* cmd){ command.motor(&motor, cmd); }

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

  // set control loop type to be used
  motor.torque_controller = TorqueControlType::foc_current;
  motor.controller = MotionControlType::torque;

  // controller configuration based on the control type 
  motor.PID_velocity.P = 0.05;
  motor.PID_velocity.I = 1;
  motor.PID_velocity.D = 0;
  // default voltage_power_supply
  motor.voltage_limit = 12;
  
  // velocity low pass filtering time constant
  motor.LPF_velocity.Tf = 0.01;

  // angle loop controller
  motor.P_angle.P = 20;
  // angle loop velocity limit
  motor.velocity_limit = 20;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsampling = 0; // initially disable the real-time monitor

  // current sense init and linking
  current_sense.init();
  motor.linkCurrentSense(&current_sense);

  // initialise motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC(); 

  // set the inital target value
  motor.target = 2;

  // subscribe motor to the commander
  command.add('M', doMotor, "motor");

  // Run user commands to configure and the motor (find the full command list in docs.simplefoc.com)
  Serial.println(F("Motor commands sketch | Initial motion control > torque/current : target 0Amps."));
  
  _delay(1000);
}

void loop() {
  // iterative setting FOC phase voltage
  motor.loopFOC();

  // iterative function setting the outer loop target
  motor.move();

  // motor monitoring
  motor.monitor();
  // user communication
  command.run();
}
```

To see all of the FOC torque control parameters please visit the [torque control docs](torque_mode). The goon news is that if you have set the phase resistance during the tuning the velocity and position motion control loops in step 4. you will most probably not need to retune them. 

However the most important tip is still to use the [commander interface](commander_interface) to tune hte torque control PID controller and Low pas filter parameters, this way you will be able to test quickly and change the parameters of controllers in real-time and see what will happen. One time you are satisfied you can write these values in code and quit using the commander. 

<blockquote class="info"> <p class="heading">☑️ Simple test</p> 
Set your target current to <b>0Amps</b> and try to move the motor by hand, make sure it feels like there is absolutely no resistance, like the motor is disabled. Then try to set a small current (<b><0.5A</b>) value and see if you can feel the motor force acting on your hand. If you can feel it you should be ready to go! 
</blockquote>
