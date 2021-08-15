---
layout: default
title: Step-Dir Interface
nav_order: 2
permalink: /step_dir_interface
parent: Communication
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# Step-direction interface

Step/direction communication is one of the most common communication interface for running stepper motors. It is very basic, it uses two digital signals, `step` and `direction`.  `step` signal produces and short impulse which signals that the motor should do a step with predefined length and `direction` signal determines the direction of the movement (ex. `HIGH` forward, `LOW` backward). 

As stated before this interface is particularly well suited for stepper motors because their motion is designed to be characterised by steps. But this interface can be used in many different ways that have nothing to do with stepper motors. In general step/dir interface can be described as a counter where `direction` signal determines the counting direction and `step` provides the impulses to be counted:
```cpp
// on rising edge of step signal 
if(direction == HIGH) counter++;
else counter--; 
```
 Finally to obtain the value you are interested in you just need to multiplied the current counter value with your step value:
```cpp
received_value = counter*my_step;
```

## How to use Step-direction listener
In order to do this in a more concise manner <span class="simple">Simple<span class="foc">FOC</span>library</span> implements an interrupt based version of this interface based on the `StepDirListener` class:
```cpp
// StepDirListener(step, dir, counter_to_value)
// - step              - step pin number
// - dir               - dir pin number
// - step_per_rotation - transformation variable from step count to your variable (ex. motor angle in radians)
StepDirListener step_dir = StepDirListener( 2, 5, _2PI/200.0 );
```
Once the `StepDirListener` class has been defined its hardware pins will be configured in the `init()` funciton which  needs to be added to the `setup()` function.

```cpp
// init step and dir pins
step_dir.init();
```
Furthermore, in order to do the actual counting this library uses the interrupt based approach, therefore the `StepDirListener` provides you the `handle()` function that you just need to wrap for example:
```cpp
// static wrapper function
void onStep() { step_dir.handle(); }
```
and finally you can enable the counter by providing the wrapper function to the `enableInterrupt()` function:
```cpp
// enable interrupts 
step_dir.enableInterrupt(onStep);
```

Finally, the user has two ways to get the received value. It can be read by calling the `getValue()` function:
```cpp
float my_variable = step_dir.getValue();
```
The second way to get the value is to attach the variable you wish the `StepDirListener` updates each time it updates the counter:
```cpp
// some variable user wants to update 
float my_value;
// attach the variable to be updated on each step (optional) 
step_dir.attach(&my_value);
```

<blockquote class="warning"><p class="heading">⚠️ BEWARE: Suboptimal performance</p>
The simplest forms of communication such as step/dir are designed to be handled in hardware and software, interrupt based, implementation of these communication interfaces is usually not the optimal solution. It will provide the user a good base for testing purposes, but it is hard guarantee long-term robustness.  
</blockquote>


## Example code 
This is a simple code of step-dir listener. See more examples in library examples `examples/utils/communication_test/step_dir` folder.
```cpp
/**
 * A simple example of reading step/dir communication 
 *  - this example uses interrupts
*/

#include <SimpleFOC.h>

// angle 
float received_angle = 0;

// StepDirListener( step_pin, dir_pin, counter_to_value)
StepDirListener step_dir = StepDirListener(2, 3, 360.0/200.0); // receive the angle in degrees
void onStep() { step_dir.handle(); }

void setup() {

  Serial.begin(115200);
  
  // init step and dir pins
  step_dir.init();
  // enable interrupts 
  step_dir.enableInterrupt(onStep);
  // attach the variable to be updated on each step (optional) 
  // the same can be done asynchronously by caling step_dir.getValue();
  step_dir.attach(&received_angle);
    
  Serial.println(F("Step/Dir listenning."));
  _delay(1000);
}

void loop() {
  Serial.print(received_angle);   // automatically updated by the StepDirListener class
  Serial.print("\t");
  Serial.println(step_dir.getValue()); // getter of the StepDirListener class
  _delay(500);
}
```
