---
layout: default
title:  Simple<b>FOC</b>Studio
nav_order: 4
permalink: /studio
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# *Simple**FOC**Studio*  <small>by [@JorgeMaker](https://github.com/JorgeMaker) </small>

Graphical user interface for the <span class="simple">Simple<span class="foc">FOC</span>library</span>. This application allows to tune and configure any BLDC/Stepper  <span class="simple">Simple<span class="foc">FOC</span>library</span> controlled device, using serial port communications and the [Commander](commander_interface) interface.


<img  src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">


### Features:
- Plug and play with the *Simple**FOC**library* version 2.1+
- Real-time tuning and configuration of the motors
- Real-time plotting and monitoring of motor variables
- Code generation for easier integration of the tuned parameters in your code
- Built on PyQt5 and a standardized `SimpleFOCConnector` interface that can be used as a gateway form python to the *Simple**FOC**library* device.


## Installation
Don't worry, *Simple**FOC**Studio* is easy to install even if you have never used the terminal before! 😃
There are just couple of steps to take:
1. Install Python if you don't have it installed yet
    - We suggest to use Anaconda. [Here is how to install it.](https://docs.anaconda.com/anaconda/install/)
    - Once you have your Anaconda running open your terminal (on windows anaconda prompt) and run:
    ```sh
    conda create -n simplefoc python=3.6.0
    ```
    - Once this is done you will never have to run that command again, from now on you will just need:
    ```sh
    conda activate simplefoc
    ```
2. Clone this repository or download the zip file
3. Enter the folder containing the repository using the terminal
    -  the command will be something like this:
    ```sh
    cd  some_path_on_disk/SimpleFOCStudio
    ```
4. Final step of the installation is installing all the necessary libraries for the *Simple**FOC**Studio* :
    ```sh
    pip install -r "requirements.txt"
    ```

Once you have done all the steps above you do not need to repeat them any more. All you need to do the next time is open your terminal in the *Simple**FOC**Studio* directory and run the command:
```sh
python simpleFOCStudio.py
```
Or if using Anaconda:
```sh   
conda activate simplefoc
python simpleFOCStudio.py
```

## Using the *Simple**FOC**Studio*
*Simple**FOC**Studio* has several useful features:
- A simple approach to tuning your motor setup
  - Form view for fast motion control PID/LPF tuning
  - TreeView for more in depth tunning and experimenting
- Code generation for transferring the found parameters into your arduino code
- Serial terminal integrated with various commander features

### Motion control tunning windows
Once you have your application running add a device by clicking the  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/add_motor.png" style="height:18px"> motor button in the toolbar. You can choose either the <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/tree.png" style="height:18px"> TreeView or the <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/form.png" style="height:18px">FormView.
- To connect to your device first configure the serial port by clicking on <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/configure.png" style="height:18px">Configure button
- Add your com port info and click OK
- Then add the device command ID that you've added to the commander usually its `M`
   - Command `M` , Arduino code : `command.add('M',doMotor,"my motor")`
   - Command `A` , Arduino code : `command.add('A',doMotor,"my motor")`
- Then click to the <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/connect.png" style="height:18px">Connect button and you should be ready to go!

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/treeview.png" class="width50"><img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/formview.png" class="width50">

### Code generation

*Simple**FOC**Studio* helps you to easier transfer your carefully tuned parameters to the Arduino code. Once you are happy with the performance of your system you can automatically generate the arduino code of the parameters you have tuned. To generate the code :
- Click on the <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/gen.png" style="height:18px"> Arudino button in the toolbar.
- Choose which sets of parameters you wish to generate the code for and click OK
- In the new tab you will have a code of your tuned parameters.

The generated code you can just copy/paste in your `setup()` function, just before calling the `motor.init()`

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/gen.gif" class="width60">


### Integrated serial terminal

*Simple**FOC**Studio* also has integrated serial terminal for easier debugging and monitoring.

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/term.png" class="width60">


## Arduino code
Basically there are two things you need to do:
1. Use the commander interface and add the motor to the commander
2. Use the monitoring and add the `motor.monitor()` in the loop

Here is a mockup of the code:

```cpp
#include <SimpleFOC.h>

....

// include commander interface
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup(){
  ....
  // add the motor to the commander interface
  // The letter (here 'M') you will provide to the SimpleFOCStudio
  command.add('M',doMotor,'motor');
  // tell the motor to use the monitoring
  motor.useMonitoring(Serial);
  motor.monitor_downsample = 0; // disable monitor at first - optional
  ...

}
void loop(){
  ....

  ....
  // real-time monitoring calls
  motor.monitor();
  // real-time commander calls
  command.run();
}
```