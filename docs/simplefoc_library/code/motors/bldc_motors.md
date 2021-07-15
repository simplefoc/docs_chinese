---
layout: default
title: BLDCMotor
nav_order: 1
permalink: /bldcmotor
parent: Motor code
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# BLDC Motor configuration

<div class="width60">
<img src="extras/Images/mot2.jpg" style="width:30%;display:inline"><img src="extras/Images/bigger.jpg" style="width:30%;display:inline"><img src="extras/Images/mot.jpg" style="width:30%;display:inline">
</div>

All BLDC motors are handled with the `BLDCMotor` class. This class implements:
- BLDC FOC algorithm
- Motion control loops
- Monitoring
- User communication interface

## Step 1. Creating the instance of the BLDC motor
To instantiate the BLDC motor we need to create an instance of the `BLDCMotor` class and provide it the number of `pole pairs` of the motor.
```cpp
//  BLDCMotor(int pp, (optional R))
//  - pp  - pole pair number
//  - R   - phase resistance value - optional
BLDCMotor motor = BLDCMotor(11 , 10.5);
```

<blockquote class="info"><p class="heading">Pole pair number </p>
If you are not sure what your <code class="highlighter-rouge">pole_paris</code> number is. The library provides an example code to estimate your <code class="highlighter-rouge">pole_paris</code> number in the examples <code class="highlighter-rouge">find_pole_pairs_number.ino</code>.
 </blockquote>
<blockquote class="info"><p class="heading">Phase resisatnce </p>
If you know in advance your motor's phase resistance value <code class="highlighter-rouge">R</code>, we suggest you to provide it to the library. The library will then calculate the voltage values internally and  the user will be dealing only with currents. But this is an optional feature.
 </blockquote>

## Step 2. Linking the sensor 
Once when you have the `motor` defined and the sensor initialized you need to link the `motor` and the `sensor` by executing:    
```cpp
// link the sensor to the motor
motor.linkSensor(&sensor);
```
Method `linkSensor` is able to link the motor to any sensor implemented in this library. The `sensor` will be used to determine electrical position of the motor for the FOC algorithm as well as for the motion control loops of velocity and position. See the [position sensor docs](sensors) for more info!

<blockquote class="info">Linking is not necessary when using the openloop motion control.</blockquote>

## Step 3. Linking the driver 
Once when you have the `motor` defined and the driver initialized you need to link the `motor` and the `driver` by executing:    
```cpp
// link the driver to the motor
motor.linkDriver(&driver);
```

The `BLDCMotor` class expect to receive a `BLDCDriver` class instance, implemented by default with classes `BLDCDriver3PWM` and `BLDCDriver6PWM`. The `driver` deals with all the hardware specific operations related to specific microcontroller architecture and driver hardware. See the [bldc driver docs](bldcdriver) for more info!


## Step 4. Linking the current sense 
If you have a current sensor `current_sense` you can link it to the `motor` using:
```cpp
// link the current sensor to the motor
motor.linkCurrentSense(&current_sense);
```
This linking step is only necessary if you have a current sense supported by this library. See the [current sense docs](current_sense) for more info!

## Step 5. Configuration paramters

If you choose not to set some of the configuration parameters they will take values defined in the `defaults.h` file.
Check the [library source code](source_code) to dig deeper.

### Step 5.1 PWM Modulation type

There are four types of Field Oriented Control modulation types implemented for BLDC motors:
- Sinusoidal PWM modulation
- Space Vector PWM modulation
- Block commutation - *beneficial for current control applications*
    - Trapesoidal 120
    - Trapesoidal 150

You can set them by changing the `motor.foc_modulation` variable:
```cpp
// choose FOC modulation
// FOCModulationType::SinePWM; (default)
// FOCModulationType::SpaceVectorPWM;
// FOCModulationType::Trapezoid_120;
// FOCModulationType::Trapezoid_150;
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;
```
Sinusoidal PWM and Space vector commutation patters will produce sinusoidal currents and smooth operation but block commutation will be faster to execute, therefore more suitable for higher velocities. It is suggested to use the Trapesoidal 120 commutation with Hall sensors. Other commutation patterns will work as well but this one will have the best performance.

<blockquote class="info"> <p class="heading">FOC currents torque control requirements</p> FOC torque control requires sinusoidal currents therefore please use either Sinusoidal PWM or Space vector PWM</blockquote>

For more information about the theory of these approaches please and source code implementation check the [FOC implementation docs](foc_implementation) or visit the [digging deeper section](digging_deeper).


### Step 5.2 Sensor and motor aligning parameters
The voltage used for the motor and sensor alignment set the variable `motor.voltage_sensor_align`:
```cpp
// aligning voltage [V]
motor.voltage_sensor_align = 3; // default 3V
```

If your sensor is an encoder and if it has an index pin, you can set the index search velocity value by set the variable `motor.velocity_index_search`:
```cpp
// incremental encoder index search velocity [rad/s]
motor.velocity_index_search = 3; // default 1 rad/s
```

### Step 5.3 Position sensor offset
For some applications it is convenient to specify the sensor absolute zero offset, you can define it by changing the parameter  `motor.sensor_offset`:
```cpp
// sensor offset [rad]
motor.sensor_offset = 0; // default 0 rad
```
This parameter can be changed in real-time.

### Step 5.3 Motor phase resistance
Motor phase resistance is an optional parameter which is not very important for current based torque modes, but if the voltage mode is used and if user specifies the `motor.phase_resistance` (either in constructor or in the `setup()` function) the library will allow user to work with current value and it will calculate the necessary voltages automatically. In the setup function you can change this parameter by setting:
```cpp
// motor phase resistance [Ohms]
motor.phase_resistance = 2.54; // Ohms - default not set
```
Working with currents instead of voltages is better in may ways, since the torque of the BLDC motor is proportional to the current and not voltages and especially since the same voltage value will produce very different currents for different motors (due to the different phase resistance). Once when the phase resistance is provided the user will be able to set current limit for its BLDC motor instead of voltage limit which is much easier to understand. 

It is important to say that once you specify the phase resistance value, you will most probably have to retune the [velocity motion control](velocity_loop) and [angle motion control](angle_loop) parameters, due to the reason that the voltages and currents values are in different orders of magnitude. The rule of thumb is to divide all the `P`, `I` and `D` gains with the `motor.phase_resistance` value. That will be a good staring point.

Finally, this parameter is suggested to be used if one whats to switch in real time in between voltage ([voltage mode](voltage_mode)) and current based ([DC current](dc_current_torque_mode) and [FOC current](foc_current_torque_mode)) torque control strategies. Since in this way all the torque control loops will have current as input (target value) the user will not have to change the motion control parameters (PID values). 

Phase resistance can be changed in real-time if needed.

### Step 5.4 Torque control mode
There are 3 different torque control modes implemented in the Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>: 
- [Voltage mode](voltage_mode)
- [DC current](dc_current_torque_mode)
- [FOC current](foc_current_torque_mode)

[DC current](dc_current_torque_mode) and [FOC current](foc_current_torque_mode) require current sensing and are controlling current and limiting the real current the motor is drawing, whereas [voltage mode](voltage_mode) approximates the motor current and does not use any current sensing. Read more in [torque control docs](torque_mode).

The torque mode can be set by changing the motor attribute `torque_controller`.
```cpp
// set torque mode to be used
// TorqueControlType::voltage    ( default )
// TorqueControlType::dc_current
// TorqueControlType::foc_current
motor.torque_controller = TorqueControlType::foc_current;
```

### Step 5.5 Motion control parameters  

There are 3 different closed loop control strategies implemented in the Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>: 
- [Torque control loop](voltage_loop)
- [Velocity motion control](velocity_loop)
- [Position/angle motion control](angle_loop)

Additionally <span class="simple">Simple<span class="foc">FOC</span>library</span> implements two open loop control strategies as well:
- [Velocity open-loop control](velocity_openloop)
- [Position open-loop control](angle_openloop)

You set it by changing the `motor.controller` variable. 
```cpp
// set motion control loop to be used
// MotionControlType::torque      - torque control 
// MotionControlType::velocity    - velocity motion control
// MotionControlType::angle       - position/angle motion control
// MotionControlType::velocity_openloop    - velocity open-loop control
// MotionControlType::angle_openloop       - position open-loop control
motor.controller = MotionControlType::angle;
```
<blockquote class="warning"><p class="heading"> Important!</p>This parameter doesn't have a default value and it has to be set before real-time execution starts.</blockquote>

Each motion control strategy has its own parameters and you can find more about them on [motion control docs](motion_control). 

Here is the list of all the motion control configuration parameters:
```cpp
// set control loop type to be used
motor.controller = MotionControlType::angle;

// controller configuration based on the control type 
motor.PID_velocity.P = 0.2;
motor.PID_velocity.I = 20;
motor.PID_velocity.D = 0.001;
// jerk control it is in Volts/s or Amps/s
// for most of applications no change is needed 
motor.PID_velocity.output_ramp = 1e6;

// velocity low pass filtering time constant
motor.LPF_velocity.Tf = 0.01;

// angle loop controller
motor.P_angle.P = 20;
motor.P_angle.I = 0; // usually set to 0  - P controller is enough
motor.P_angle.D = 0; // usually set to 0  - P controller is enough
// acceleration limit
motor.P_angle.output_ramp = 1e6;

// motion control limits
// angle loop velocity limit
motor.velocity_limit = 50;
// either voltage limit
motor.voltage_limit = 12; // Volts -  default driver.voltage_limit
// or current limit - if phase_resistance set
motor.current_limit = 12; // Amps -  default 0.5 Amps
```  

### Step 5.6 Configuration done - `motor.init()`
Finally the configuration is terminated by running `init()` function which prepares all the hardware and software motor components using the configured values.
```cpp
// initialize motor
motor.init();
```

## Step 6. Align motor and all the sensors - Field Oriented Control init

After the position sensor, current sense, driver and the motor are configured, and before we can start the motion control we need to align all  hardware components in order to initialize the FOC algorithm. This is done in the scope of the funciton `motor.initFOC()`
```cpp
// align sensor and start FOC
motor.initFOC();
```
<blockquote class="info"><p class="heading"> Can be skipped for openloop control!</p>If no sensor is attached this function will not really do anything, but you can still call it if necessary or more convenient. </blockquote>

This function does several things:
- Checks/modifies position sensor direction in respect to the motor's direction
- Searches for encoder index if necessary
- Finds the motor electrical offset in respect to the position sensor
- Checks/modifies current sense pinout and gains signs if one available to make sure it aligned with the driver 

This function is a final check function and it will disable your motor and display you a message what is wrong. (when using the [monitoring](monitoring) ). If everything is well configured, after the call of this function FOC is ready and our setup is done!  

The alignment procedure will have to move your motor several times and might not be desirable behavior, therefore for most of the position sensors (except encodes) and current senses, this alignment procedure can be skipped by following the steps 6.1 an 6.2. 

### Step 6.1 Skip alignment - position sensor

If you are using absolute sensors such as magnetic sensors or hall sensors, once you have done the alignment procedure and once you have the motor's zero electrical offset sensor direction you no longer need the full calibration sequence. Therefore, to the `motor.initFOC()` you can provide the sensor offset `zero_electric_offset` and sensor direction `sensor_direction` to avoid alignment procedure:
```cpp
// align sensor and start FOC
//motor.initFOC(zero_electric_offset, sensor_direction);
motor.initFOC(2.15, Direction::CW);
```
The same can be done by using the motor parameters:
```cpp
// align sensor and start FOC
motor.zero_electric_offset  = 2.15; // rad
motor.sensor_direction = Direction::CW; // CW or CCW
motor.initFOC();
```
You can find these values by running the `find_sensor_offset_and_direction.ino` example.

More generally, if you know any of these two values make sure to provide and the `iniFOC` will skip that part of the calibration. For example, for encoder sensors the zero electrical offset changes all the time but the sensor direction will stay the same so you can provide it and skip a large part of the calibration sequence.
### Step 6.2 Skip alignment - current sense

For the current sensors it is as well possible to avoid the calibration procedure an that is done by specifying the curren sense flag called `skip_align`:
```cpp
current_sense.skip_align  = true; // default false
```
But make sure that all of your gains are well set and all of your ADC pins are aligned to the driver/motor phases. For more information about the alignment please visit the [current sense docs](current_sense).

## Step 7. Real-time motion control

The real-time motion control of theArduino <span class="simple">Simple<span class="foc">FOC</span>library</span> is realized with two functions: 
- `motor.loopFOC()` - low level torque control 
- `motor.move(float target)` - high level motion control


The function `loopFOC()` behavior directly depends of the torque control mode usd. If used in volatge mode it  gets the current motor angle from the sensor, turns it into the electrical angle and transforms the q-axis <i>U<sub>q</sub></i> voltage command  `motor.voltage_q` to the appropriate phase voltages <i>u<sub>a</sub></i>, <i>u<sub>b</sub></i> and <i>u<sub>c</sub></i> which are set then set to the motor. Whereas if it is used in DC of FOC current modes it additionally reads the current sensor and runs the closed loop current control.

```cpp
// Function running the low level torque control loop
// it calculates the gets motor angle and sets the appropriate voltages 
// to the phase pwm signals
// - the faster you can run it the better Arduino UNO ~1ms, Bluepill ~ 100us
motor.loopFOC();
```

<blockquote class="info"><p class="heading"> Can be skipped for openloop control!</p>This function will have no effect if the motor is run in open loop! </blockquote>

This function is execution time is critical both in the voltage mode and in current control modes. Therefore it is very important that the `motor.loopFOC()` function is executed as fast as possible.

<blockquote class="warning"><p class="heading">Rule od thumb: execution time</p>
The faster you can run this function the better, here is approximative loops execution time using different torque modes.
<table>
<tr>
<td>MCU</td>
<td><a href="voltage_mode">Voltage mode</a></td>
<td><a href="dc_current_torque_mode">DC current</a></td>
<td><a href="foc_current_torque_mode">FOC current</a></td>
</tr>
<tr>
<td>Arduino UNO</td>
<td>~ 700 us</td>
<td>~ 1.2 ms</td>
<td>~ 1.5 ms</td>
</tr>
<tr>
<td>Esp32</td>
<td>~ 100 us</td>
<td>~ 200 us</td>
<td>~ 300 us</td>
</tr>
<tr>
<td>Bluepill</td>
<td>~ 200 us</td>
<td>~ 500 ms</td>
<td>~ 700 us</td>
</tr>
<tr>
<td>Nucleo</td>
<td>~ 100 us</td>
<td>~ 150 us</td>
<td>~ 200 us</td>
</tr>
</table>
</blockquote>

Finally, once we have a way to set the torque command (current <i>i<sub>q</sub></i> or voltage <i>u<sub>q</sub></i>) to the motor using the FOC algorithm we can proceed to the motion control. And this is done with `motor.move()` function.
```cpp
// Function executing the motion control loops configured by the motor.controller parameter of the motor. 
// - This function doesn't need to be run upon each loop execution - depends of the use case
//
// target  Either torque, angle or velocity based on the motor.controller
//         If it is not set the motor will use the target set in its variable motor.target
motor.move(target);
```

The `move()` method executes the motion control loops of the algorithm. If is governed by the `motor.controller` variable. It executes either pure torque loop, velocity loop or angle loop.

It receives one parameter `float target` which is current user defined target value.
- If the user runs [velocity loop](velocity_loop) or [velocity open-loop](velocity_openloop), `move` function will interpret `target` as the target velocity.
- If the user runs [angle loop](angle_loop) or [angle open-loop](angle_openloop), `move` will interpret `target` parameter as the target angle. 
- If the user runs the [torque loop](voltage_loop), `move` function will interpret the `target` parameter as either voltage <i>u<sub>q</sub></i> or current <i>i<sub>q</sub></i> (if phase resistance provided). 

The `target` parameter is optional and if it is not set, the target value will be set by the public motor variable `motor.target`. The equivalent code would be:

```cpp
motor.target = 2;
motor.move();
```

## Step 7.1 Motion control downsampling
For many motion control applications it will make sense run multiple torque control loops for each motion control loop. This can have a great impact on the smoothness and can provide better high-speed performance. Therefore this library enables a very simple downsampling strategy for the `move()` function which is set using the parameter `motor.motion_downsample`:
```cpp
// downsampling value
motor.motion_downsample = 5; // - times (default 0 - disabled)
```
The downsampling strategy works in a very simple way, even though the `motor.move()` is called in each arduino `loop` it will only be executed each `motor.motion_downsample` calls. This parameter si optional and can be configured in real time. 

<blockquote class="warning"><p class="heading">BEWARE: Motion control impact</p>
Different values of the downsampling might require a bit of tuning of motion parameters.</blockquote>  


And that is it, you have your complete Field Oriented Controlled BLDC motor with motion control. 
## User interaction

<span class="simple">Simple<span class="foc">FOC</span>library</span> implements two types of real-time user interaction:
- [Monitoring functionality](monitoring)
- [Motor commands](communication)


## Digging deeper
For more theoretical explanations and source code implementations of the FOC algorithm and the motion control approaches check out the [digging deeper section](digging_deeper).

## Example code
A simple BLDC motor torque control using voltage based on the FOC algorithm.
```cpp
/**
 * Torque control example using voltage control loop.
 */
#include <SimpleFOC.h>

// BLDC motor instance
BLDCMotor motor = BLDCMotor(11);
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);
// sensor instance
MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C);

void setup() { 
  
  // initialize encoder sensor hardware
  sensor.init();
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // aligning voltage
  motor.voltage_sensor_align = 3;
  
  // choose FOC modulation
  motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

  // set torque mode
  motor.torque_controller = TorqueControlType::voltage;
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  _delay(1000);
}

// target voltage to be set to the motor
float target_voltage = 2;

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move(target_voltage);
}
```
