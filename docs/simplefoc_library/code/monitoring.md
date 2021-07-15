---
layout: default
title: Monitoring
nav_order: 7
permalink: /monitoring
parent: Writing the Code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# Monitoring functionality

Both `BLDCMotor` and `StepperMotor` classes support monitoring using `Serial` port which is enabled by:
```cpp
motor.useMonitoring(Serial);
```

Monitoring has two main goals:
- [Display motor status during the init and alignment procedure](#monitoring-the-motor-init) 
- [Real-time monitoring of motor variables](#real-time-motor-variables-monitoring)

## Monitoring the motor init
The `motor` will output to the serial port its status during the initialization `motor.init()` and the alignment procedure `motor.initFOC()`. Enabling this functionality will not directly influence the real-time performance because there is no predefined monitoring in real time-loop in the functions `motor.loopFOC()` and `motor.move()`.

This is an example of the `motor` initialization monitoring output gone well:
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: sensor direction==CW
MOT: PP check: OK!
MOT: Zero elec. angle: 4.28
MOT: Align current sense.
MOT: Success: 2
MOT: Ready.
```

Failed motor initialization due to the position sensor:
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: Failed to notice movement
MOT: Init FOC failed.
```

And failed motor initialization due to the current sense:
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: sensor direction==CW
MOT: PP check: OK!
MOT: Zero elec. angle: 4.28
MOT: Align current sense.
MOT: Fail!
MOT: Init FOC failed.
```

## Real-time motor variables monitoring

Second role of the monitoring is the real-time tab separated output of the motor variables to the serial terminal. And it is enabled including this line in to `loop` function:
```cpp
motor.monitor()
```

Monitoring function can output 7 different motor specific variables:
- `target` - current target value, specific to the motion control used (either current, voltage, velocity or position)
- `voltage.q` - set voltage in q direction
- `voltage.d` - set voltage in d direction
- `current.q` - measured current in q direction ( if current sense available )
- `current.d` - measured current in d direction ( if current sense available )
- `shaft_velocity` - motor velocity
- `shaft_angle` - motor position

To set the preferred values to be monitored you can just change the `motor.monitoring_variables` parameter in the `setup()` function.:
```cpp
motor.monitor_variables = _MON_TARGET | _MON_VEL | _MON_ANGLE; // default _MON_TARGET | _MON_VOLT_Q | _MON_VEL | _MON_ANGLE
```
By default the monitored variables are `target`,`voltage.q`,`velocity`,`angle`.  This parameter is a bitmap with seven bit number where each bit represents `bool` flag signaling if the variable should be outputted (`1`) of not (`0`). Therefore we have defined a set of helping monitoring constants you can combine to easier handling of monitoring:
```cpp
#define _MON_TARGET 0b1000000 // monitor target value
#define _MON_VOLT_Q 0b0100000 // monitor voltage q value
#define _MON_VOLT_D 0b0010000 // monitor voltage d value
#define _MON_CURR_Q 0b0001000 // monitor current q value - if measured
#define _MON_CURR_D 0b0000100 // monitor current d value - if measured
#define _MON_VEL    0b0000010 // monitor velocity value
#define _MON_ANGLE  0b0000001 // monitor angle value
```

Furthermore, outputting the real-time execution variables using `motor.monitor()` function can in many cases have a negative effect of the motor performance  therefore it is important reduce the number of calls of this function as much as possible, especially if displaying many variables with lower baudrates. This you can easily do by setting the parameter `motor.monitor_downsample`:
```cpp
// downsampling
motor.monitor_downsample = 100; // default 10
```
This variable tells `motor.monitor()` to output the variables to the serial each `monitor_downsample` number of calls. So in short, it will output the variables to the serial each `monitor_downsample` loop calls.

Here is an example of a full comfiguration code:
```cpp
...
void setup(){
    ...

    Serial.begin(115200); // the higher the better
    motor.useMonitoring(Serial);
    //display variables
    motor.monitor_variables = _MON_TARGET | _MON_VEL | _MON_ANGLE; 
    // downsampling
    motor.monitor_downsample = 100; // default 10
    
    ...
}
void loop(){
    ....

    motor.monitor();
}

```



The real-time monitoring function is intended to be used for real-time visualization, particularly suitable for Arduino IDE's `Serial Plotter`

<img class="width60" src="extras/Images/plotter.jpg">

Or in `Serial Terminal`
```sh
...
voltage,target,velocity
1.17	2.00	2.29
1.23	2.00	1.96
1.30	2.00	1.65
1.28	2.00	1.80
1.20	2.00	2.20
1.07	2.00	2.70
0.91	2.00	3.22
0.69	2.00	3.74
0.40	2.00	4.34
0.18	2.00	4.57
0.09	2.00	4.38
0.06	2.00	4.04
0.08	2.00	3.58
0.11	2.00	3.14
0.18	2.00	2.65
0.27	2.00	2.13
0.37	2.00	1.65
0.47	2.00	1.26
0.55	2.00	0.99
0.64	2.00	0.77
0.71	2.00	0.67
...
```

<blockquote class="warning"><p class="heading"> Execution time impairment</p>
The intention of this method is to be called in main loop function along the <code class="highlighter-rouge">loopFOC()</code> and <code class="highlighter-rouge">move()</code> function. Therefore, <code class="highlighter-rouge">motor.monitor()</code> is going to impact the execution performance and reduce the sampling frequency of the FOC algorithm so therefore take it in consideration when running the code.  </blockquote>

## Custom serial terminal monitoring 

If you wish to implement you own monitoring functions or just output the motor variables to the `Serial` terminal here are the public variables of the `BLDCMotor` and `StepperMotor` class that you can access at any time.
```cpp
// current target value
float target;
// current motor angle
float shaft_angle;
// current motor velocity 
float shaft_velocity;
// current target velocity
float shaft_velocity_sp;
// current target angle
float shaft_angle_sp;

// current voltage set to the motor (voltage.q, voltage.d)
DQVoltage_s voltage;
// current (if) measured on the motor (current.q, current.d)
DQCurrent_s current;
// phase voltages 
float Ua, Ub, Uc;

```
You can access any of these variables by adding `motor.` before it. For example:
```cpp
Serial.println(motor.shaft_angle);// print current motor position to the serial terminal
// or
Serial.println(motor.Ua); // print phase voltage Ua to the serial terminal
```

As you can see monitoring works only in one direction and it assumes you will implement the user communication on your own.

## Real-time user communication using motor commands
  
For two-way communication in between user and the motor the Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>  provides you with the [Motor commands interface](communication).