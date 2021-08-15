---
layout: default
title: Commander Interface
nav_order: 1
permalink: /commander_interface
parent: Communication
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Commander interface

Commander is a simple and flexible interface monitoring, supervision, configuration and control using the G-code like communication protocol. The communication is based on `ASCII` character command ids which makes simple and efficient to parse on any mcu. After the command id has been received the function attached to this command is called and provided the remaining string of characters received which follows the command character. 

<img src="extras/Images/cmd_motor.gif" class="img100">
<img src="extras/Images/cmd_motor_get.gif" class="img100">

This g-code like interface provides callback to configure and tune any:
- BLDC or Stepper motor
  - PID controllers
  - Low pass filters
  - Motion control
  - monitoring
  - limits
  - enable/disable
  - sensor offsets
  - phase resistance 
  - ... 
- PID controllers
- Low pass filters
- Or float variables

Furthermore commander enables you to easily create your own commands and extend this interface in any way you might need for your particular application.

## What happens when user sends a command?
When the commander received the string:

<img src="extras/Images/cmd1.png" class="width20">

It first checks the command id, identifies its `M` and sends the remaining string to the motor handling callback. Then the motor callback checks what is the coommand id, finds `V` and sends the remaining string to the PID velocity callbacK. Then the PID velocity callback scans the command id and finds it is the `D`, so derivative gain and sets the value.

Commander | Motor callback (cmd id `M` )  | PID callback (cmd id `V` ) 
--- | ---| ---
<img src="extras/Images/cmd2.png" > | <img src="extras/Images/cmd3.png" > | <img src="extras/Images/cmd4.png" >

The other example is if the commander receives:

<img src="extras/Images/cmd5.png" class="width20">

First id that it finds is `O`, which is for example motor. It calls the callback that is assigned to this command (which is in this case motor callback) with the string remaining string. Then the motor callback finds the command `E` and knows its the status (enabled/disabled) either getting or getting. It checks the value and sees that the value is empty, which means the user has sent a get request. 

Commander | Motor callback (cmd id `O` ) 
--- | ---
<img src="extras/Images/cmd6.png" class="img100"> | <img src="extras/Images/cmd7.png" class="img100"> 


## Using the commander interface
Command interface is implemented in the `Commander` class.
```cpp
// Commander interface constructor
// - serial  - optionally receives HardwareSerial/Stream instance
// - eol     - optionally receives eol character - by default it is the newline: "\n" 
// - echo    - option echo last typed character (for command line feedback) - defualt false
Commander commander = Commander(Serial, "\n", false);
```
The end of line (eol) character is an optional input of the `Commander` class which represents end of command character. User can define its own end of command characters here, but by default the character used is newline character `\n`. For example i

<blockquote class="warning"><p class="heading">BEWARE: EOL characters</p> Different operating systems have different EOL characters by default. Newline character is probably the most common one but there is also the carriage return '\r' for linux users. Be sure to provide it to the constructor of the Commander class if you wish to use it with your setup!</blockquote>

The echo flag can be used as a debugging feature but it is not recommended to be used for real time motor control and configuration!

Next step would be to add the commander function that reads the `Serial` instance that you provided into the Arduino `loop()`:
```cpp
void loop(){
  ...
  commander.run(); // reads Serial instance form constructor
}
```

If you did not provide the `Serial` instance to the `Commander` constructor you can provide it to the `run()` function. 
```cpp
void loop(){
  ...
  commander.run(Serial); // reads Serial instance form run
}
```
Or, if you wish to use the commander without `Serial` and using just string variables then you can provide and `char*` variables to the `run()` function:
```cpp
char* my_string = "user command";
commander.run(my_string); // reads the string
```

<blockquote class="warning"><p class="heading"> Serial output</p>
The <code class="highlighter-rouge">Commander</code> class will always try to print the output to the serial instance provided in the constructor. If it did not receive one in the constructor, then it will use the one provided in the <code class="highlighter-rouge">run()</code> function. If it does not any of the two, it will not output anywhere, but the user can still use it.</blockquote>

### Configuration 
Commander class has two configuration parameters:
- `verbose` - Serial output mode
- `decimal_places` - Number of decimal places for floating point numbers 

Number of decimal places for floating point numbers can be changed easily by setting the parameter `decimal_places`:
```cpp
commander.decimal_places = 4; // default 3
```

Serial output mode can be easily changed by setting the parameter `verbose`
```cpp
// VerboseMode::nothing        - display nothing - good for monitoring
// VerboseMode::on_request     - display only on user request
// VerboseMode::user_friendly  - display textual messages to the user (default)
commander.verbose = VerboseMode::user_friendly;
```

There are three types of output modes:
-  `VerboseMode::nothing` - this mode does not output anything to the serial terminal - it is very useful when `Commander` is used in combination with [monitoring](monitoring) to avoid unkonwn values in the Arduino's Serial Plotter for example
- `VerboseMode::on_request` - this mode outputs only there resutls of get and set commands and will not output any additional unnecessary (human readable) text.
- `VerboseMode::user_friendly` - this mode is the default mode and is intended for the cases when it is the user who sends the commands using the serial monitor. This mode will in addition to all the necessary get and set values output additional text for easier comprehension for human user.

### Adding commands
In order to add the callback for a given command character to the `Commander` you will need to call the function `add()` that receives the command character, the function pointer and the commands label:
```cpp
// creating the command A in the commander
// - command id - character
// - callback   - function pointer - void callback(char* cmd)
// - label      - label of the command (optional) 
commander.add('A',doSomething,"do something");
```
The only real requirement for the type of the function you can use as the callback is that hey need to return `void` and they have to receive `char*` string:
```cpp
void doSomething(char* cmd){ ... }
```
With this simple interface you can create your own commands very simply and subscribe them to the `Commander` using just one line of code.

In addition to this flexible interface for adding generic callbacks the `Commander` class additionally implements standardized callbacks for:
- BLDC motor (`BLDCMotor`)  - `commander.motor(&motor, cmd)`
- Stepper motor (`StepperMotor`) - `commander.motor(&motor, cmd)`
- PID controller (`PIDController`) - `commander.pid(&pid, cmd)`
- Low pass filter (`LowPassFilter`) - `commander.lpf(&lpf, cmd)`
- Any numeric variable (`float`) - `commander.scalar(&variable, cmd)`

For example if you are interested in full configuration of one `motor` your code could look something like this:
```cpp
BLDCMotor motor = .....
Commander commander = ....

// defined wrapper for generic callback
void onMotor(char* cmd){commander.motor(&motor, cmd);}

void setup(){
  ...
  commander.add('m',onMotor,"my motor");
  ...
}
void loop(){
  ...
  commander.run();
}
```
Or maybe you wish to tune the velocity PID and you and change the target value of the motor and you wish to remove unnecessary memory overhead due to the other functionalities you do nto necessarily need, then your code could look something like:
something like this:
```cpp
BLDCMotor motor = .....
Commander commander = ....

// defined wrappers for generic callbacks
void onPid(char* cmd){commander.pid(&motor.PID_velocity, cmd);}
void onLpf(char* cmd){commander.lpf(&motor.LPF_velocity, cmd);}
void onTarget(char* cmd){commander.scalar(&motor.tagret, cmd);}

void setup(){
  ...
  commander.add('C',onPid,"PID vel");
  commander.add('L',onLpf,"LPF vel");
  commander.add('T',onTarget,"target vel");
  ...
}
void loop(){
  ...
  commander.run();
}
```

This simple interface provides the user a simple way to make communicate and configure  multiple motors, PID controllers, low pass filters, scalar variables and custom commands in the same time if necessary. 
It also makes the tuning of the custom control loops much easier since you can close the loop with a pid controller `PIDController` very easily and just add it to the commander to tune it in real time. 

You can find more examples in library examples `examples/utils/communication_test/commander` folder.

## List of commands

All built-in commands and subcommands are defined in the library source, in file `src/communication/commands.h`.
If you wish to change the character id of a certain command that is the place to do it. 😄

In general we can separate the commands into:
- [Commander commands](#commander-commands) - commands specific for the `Commander` class
- [PID commands](#pid-commands)  - commands specific for the `PIDController` class
- [Low pass filter commands](#low-pass-filter-commands) - commands specific for the `LowPassFilter` class
- [Motor commands](#motor-commands) - commands specific for the `FOCMotor` classes

### Commander commands
When using the `Commander` in your program the user will have three built-in default commands he can use:
- `?` - list all the commands available
- `#` - get/set decimal point number
  - Examples:
    - get decimal places `#`
    - set 5 decimal places: `#5`
- `@` - get/set verbose output mode
  - Examples:
    - get mode: `@`
    - set user frinedly mode : `@3`
    - set noting mode : `@0`
    - set on request mode : `@1`

The list command `?` will display all the commands that were added to the `Commander` and their labels. For example if we have the added commands like these ones:
```cpp
void setup(){
  ...
  commander.add('M',doSomeMotor,"some motor");
  commander.add('P',doSomePID,"some pid");
  commander.add('R',doSomeOtherMotor,"some other motor");
  ...
}
```
Here is the example of the output of the list `?` command in *user-friendly* mode:
```sh
$ ?
M: some motor
P: some pid
R: some other motor
``` 

### PID commands
When using a standard callback for `PIDController` class:`commander.pid(&pid,cmd)` the user will have available set of possible commands:
- **P**: PID controller P gain
- **I**: PID controller I gain
- **D**: PID controller D gain
- **R**: PID controller output ramp
- **L**: PID controller output limit

For example if you have a PID controller added to the `commander`:
```cpp
PIDController pid = ....
Commander commander = ...

void onPid(char* cmd){ commander.pid(&pid,cmd); }
void setup(){
  ...
  commander.add('C',onPid,"my pid");
  ...
}
void loop(){
  ...
  commander.run();
}
```
You will be able to configure (set and get) its parameters from serial monitor:
```sh
$ CP           # get P gain
P: 1.0
$ CD0.05       # set D gain
D: 0.05
$ CO           # unknown command
err
$ CL3.25       # set output limit
limit: 3.25
``` 

### Low pass filter commands
When using a standard callback for `LowPassFilter` class:`commander.lpf(&lpf,cmd)` the user will have available a command:
- **F**: Low pass filter time constant

For example if you have a low pass filter added to the `commander`:
```cpp
LowPassFilter filter = ....
Commander commander = ...

void onLpf(char* cmd){ commander.lpf(&filter,cmd); }
void setup(){
  ...
  commander.add('A',onLpf,"my lpf");
  ...
}
void loop(){
  ...
  commander.run();
}
```
You will be able to configure (set and get) its parameters from serial monitor:
```sh
$ AF           # get time constant
Tf: 1.0
$ AF0.05       # set time constant
Tf: 0.05
$ AW           # unknown command
err
``` 
### Motor commands
When using a standard callback for `BLDCMotor` and `StepperMotor` classes:`commander.motor(&motor,cmd)` the user will have available set of possible commands:

- **Q** - Q current PID controller & LPF (see [pid](#pid-commands) and [lpf](#low-pass-filter-commands) for commands)
- **D** - D current PID controller & LPF (see [pid](#pid-commands) and [lpf](#low-pass-filter-commands) for commands)
- **V** - Velocity PID controller & LPF  (see [pid](#pid-commands) and [lpf](#low-pass-filter-commands) for commands) 
- **A** - Angle PID controller & LPF-  (see [pid](#pid-commands) and [lpf](#low-pass-filter-commands) for commands)
- **L** - Limits     
  -  **C** - Current  
  -  **U** - Voltage   
  -  **V** - Velocity  
- **C** - Motion control type config 
  - **D** - downsample motion loop 
  - `0` - torque    
  - `1` - velocity 
  - `2` - angle    
  - `3` - velocity_openloop 
  - `4` - angle_openloop    
- **T** - Torque control type
  - `0` - voltage      
  - `1` - dc_current     
  - `2` - foc_current 
- **E** - Motor status (enable/disable) 
  - `0` - enable    
  - `1` - disable  
- **R** - Motor phase resistance               
- **S** - Sensor offsets     
  - **M** - sensor offset          
  - **E** - sensor electrical zero             
- **W** - PWM settings     
  - **T** - pwm modulation type         
  - **C** - pwm waveform centering boolean 
- **M** - Monitoring control    
  - **D** - downsample monitoring     
  - **C** - clear monitor        
  - **S** - set monitoring variables  
  - **G** - get variable value        
- '' - Target get/set                  

<img src="extras/Images/motor_cmd.png" class="img100">

For example if you have a BLDC motor added to the `commander`:
```cpp
BLDCMotor motor = ....
Commander commander = ...

void onMotor(char* cmd){ commander.motor(&motor,cmd); }
void setup(){
  ...
  commander.add('M',onMotor,"my motor");
  ...
}
void loop(){
  ...
  commander.run();
}
```

You will be able to configure (set and get) its parameters from serial monitor:
```sh
$ MVP                 # get PID velocity P gain
PID vel| P: 0.20
$ MVP1.2              # set PID velocity P gain
PID vel| P: 1.20
$ MAI                 # get PID angle I gain
PID angle| I: 0.00 
$ MAF                 # get LPF angle time constant 
LPF angle| Tf: 0.00
$ MLV50.4             # set velocity limit
Limits| vel: 50.4
$ MLC                 # get current limit
Limits| curr: 0.5
$ MT                  # get torque control mode
Torque: volt
$ MT1                 # set torque control mode
Torque: dc curr
$ MT2                 # set torque control mode
Torque: foc curr
$ ME                  # get motor status enabled/disabled
Status: 1
$ MSM                 # get sensor offset
Sensor| offset: 0.0
$ MSM1.2              # set sensor offset
Sensor| offset: 1.2
$ MC                  # get motion control mode
Motion: torque
$ MC3                 # set motion control mode
Motion: vel open
$ MC2                 # set motion control mode
Motion: angle
$ MCD100              # get motion control downsampling
Motion: downsample: 100
$ MMG0                # get variable - target
Monitor | target: 0.0
$ MMG1                # get variable - voltage q
Monitor | Vq: 1.4
$ MMG6                # get variable - angle
Monitor | angle: 23.5 
$ MMG6                # get variable - angle
Monitor | angle: 24.6 
$ MMG6                # get variable - angle
Monitor | angle: 25.5 
$ M0                  # set target
Target: 0.0
$ M0.4                # set target
Target: 0.4
$ @1                  # set verbose mode: on_request
Verb | on! 
$ MMG6                # get variable - angle
26.5
$ MMG5                # get variable - velocity
2.57
$ #6                  # set 6 decimal places
Decimal: 6
$ MMG6                # get variable - angle
27.732821
$ @0                  # set verbose mode: nothing
Verb: off!
$ MMG6                # get variable - angle
$ MMG6                # get variable - angle
$ @2                  # set verbose mode: user_friendly
Verb: on!
$ MMG6                # get variable - angle
Monitor | angle: 25.532131 
```

#### Motor monitoring control commands
Commander interface enables the user to control the output of the [monitoring](monitoring) functionality. The combination of the two enables user a full control of the motor configuration and tuning as well as full control of variables that are outputted to the user. In order to use his functionality the user needs to enable monitoring for the motor which is really straight-forward:
```cpp
BLDCMotor motor = ....
Commander commander = ...

void onMotor(char* cmd){ commander.motor(&motor,cmd); }
void setup(){
  ...
  motor.useMonitoring(Serial);
  commander.add('M',onMotor,"my motor");
  ...
}
void loop(){
  ...
  motor.monitor();
  commander.run();
}
```
Finally once the motor is added to the commander interface the use will be able to configure the monitoring with commands:
- **M** - Monitoring control    
  - **D** - downsample monitoring     
  - **C** - clear monitor        
  - **S** - set monitoring variables        

Using these commands you can change the downsampling rate (`motor.monitor_downsampling`) of the `monitor()` function that will determine your output sampling frequency. For example if your `loop` time is around 1ms, then with downsampling of monitor function with the rate of 100, it will output the motor variables each 100ms.  
If monitor dowsampling is set to 0  the `monitor()` function is disabled. The same is true if the `motor.monitor_variables` bitmap is empty (equal to `0`). Therefore the command **C** effectively does:
```cpp
// when command MC is called
motor.monitor_variables = 0;
```
Finally the command **MS** is used to get/set the `motor.monitor_variables` bitmap. 

Therefore te communication could look something like this:
```sh
$ MMD                 # get monitor downsampling rate
Monitor | downsample: 10 
$ MMD1000             # set monitor downsampling rate
Monitor | downsample: 1000 
$ MMS                 # get monitor variables
Monitor | 0000000
$ MMS1000001          # set monitor variables (target and angle)
Monitor | 1000001
1.000 0.999
1.000 0.985
1.000 1.064
.....
1.000 1.040
$ MMS0100000          # set monitor variables (voltage q)
Monitor | 0100000
1.234
-0.345
...
0.772
$ MMC                 # clear monitoring variables
Monitor | clear
$ MMS                 # get monitoring variables
Monitor | 0000000
```

<blockquote class="info"><p class="heading">📈 Good practice for visualization</p>
When using monitoring to tune the motion control parameters or just to visualize the different variables it makes sense to disable the commander outputs so that in the serial monitor you only have monitor output. To do that use the mode <code class="highlighter-rouge">VerboseMode::nothing</code> of the commander by sending the command <code class="highlighter-rouge">@0</code>. See all <a href="#commander-commands">commander commands</a>.
</blockquote>


## Example code using the motor commands
This is one simple example of using motor commands with monitoring in the code. For more examples browse through the library examples, especially through the `examples/utils/communication_tes/commander` folder.
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


// commander interface
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

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
  motor.controller = MotionControlType::torque;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsample = 0; // initially disable real-time monitoring

  // initialise motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();

  // set the inital target value
  motor.target = 2;

  // define the motor id
  command.add('A', onMotor, "motor");

  // Run user commands to configure and the motor (find the full command list in docs.simplefoc.com)
  Serial.println(F("Motor commands sketch | Initial motion control > torque/voltage : target 2V."));
  
  _delay(1000);
}


void loop() {
  // iterative setting FOC phase voltage
  motor.loopFOC();

  // iterative function setting the outter loop target
  motor.move();

  // monitoring
  motor.monitor();
  // user communication
  command.run();
}
```

## *Simple**FOC**Studio* by [@JorgeMaker](https://github.com/JorgeMaker)

SimpleFOCStudio is an awesome application built by [@JorgeMaker](https://github.com/JorgeMaker) which we will try to keep up to date with out library. It is a python application that uses commander interface for tunning and configuring the motor. 

<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">

For more info how to install and use this application visit the studio [docs <i class="fa fa-external-link"></i>](studio). 

