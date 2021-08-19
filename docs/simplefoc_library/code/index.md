---
layout: default
title: Writing the Code
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /code
has_children: True
has_toc: False
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# Getting to know the <span class="simple">Simple<span class="foc">FOC</span>library</span> code<span class="simple">（Simple<span class="foc">FOC</span>库使用教程）</span> 

安装好 [SimpleFOC库](installation) ，准备好所有必须的 [硬件](supported_hardware) 后, 我们就要开始了解驱动电机的Arduino代码。以下是编写程序时的所有重要步骤。

## 第0步 引入库
在开始前，先引入库中的头文件：
```cpp
#include <SimpleFOC.h>
```

## 第1步 <a href="sensors" class="remove_dec">设置位置传感器</a>

编写程序的第一步是初始化和配置位置传感器。
该库支持以下位置传感器：

 - [编码器](encoder): 支持光学、电容式、磁编码器 （ABI方式）
 - [磁性传感器](magnetic_sensor): 支持SPI, I2C, PWM以及Analog （模拟输出）
 - [霍尔传感器](hall_sensors): 3x霍尔探头, 磁性传感器 （UVW 接口）

选择恰当的位置传感器运行以下例程：

<a href ="javascript:showMagnetic();" id="mag" class="btn btn-primary">磁性传感器</a> <a href="javascript:showEncoder();" id="enc" class="btn">编码器</a> 

```c
#include <SimpleFOC.h>

// Encoder(pin_A, pin_B, PPR)
Encoder sensor = Encoder(2, 3, 2048);
// channel A and B callbacks
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}

 
void setup() {  
  // initialize encoder hardware
  sensor.init();
  // hardware interrupt enable
  sensor.enableInterrupts(doA, doB);

}

void loop() {
  
}
```

```c++
#include <SimpleFOC.h>

// SPI example
// MagneticSensorSPI(int cs, float bit_resolution, int angle_register)
MagneticSensorSPI sensor = MagneticSensorSPI(10, 14, 0x3FFF);

void setup() {
  // initialize magnetic sensor hardware
  sensor.init();
}

void loop() {

}
```

<div id="enc_p" class="hide_p">
例程中以编码器作为位置传感器在类 <code class="highlighter-rouge">Encoder</code> 中的实现与定义如下：
  <ul>
    <li> <code class="highlighter-rouge">A</code> 和 <code class="highlighter-rouge">B</code> 通道的引脚编号: <code class="highlighter-rouge">2</code> 和 <code class="highlighter-rouge">3</code></li>
    <li> 编码器  <code class="highlighter-rouge">PPR</code> (每转脉冲数): <code class="highlighter-rouge">2048</code></li>
    <li> <code class="highlighter-rouge">Index</code> 引脚编号 <i>（可选）</i> </li>
  </ul> 
</div>

<div id="mag_p" class="hide_p">
在例程中，我们使用了14 位磁性传感器进行设置，比如：<a href="https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D">AS5047u<i class="fa fa-external-link"></i></a>, 并将其与引脚<code class="highlighter-rouge">10</code>连接。<br>
磁性传感器使用SPI方式通讯，在类<code class="highlighter-rouge">MagneticSensorSPI</code>中的实现与定义如下：
  <ul>
    <li><code class="highlighter-rouge">chip_select</code> 引脚: <code class="highlighter-rouge">10</code> </li>
    <li> 传感器总 <code class="highlighter-rouge">CPR</code>（每圈脉冲数）:   <code class="highlighter-rouge">CPR = 2^14bit =16384</code></li>
    <li> <code class="highlighter-rouge">angle</code> SPI 注册: <code class="highlighter-rouge">0x3FFF</code></li> 
  </ul>
</div>


运行 `sensor.init()`，初始化传感器硬件引脚

完整的设置和参数配置文件，请访问<a href="sensors"> 位置传感器 docs <i class="fa fa-external-link"></i></a>。


## 第2步 <a href="drivers_config" class="remove_dec">设置驱动器</a>
配置好位置传感器后，我们开始初始化和配置驱动器。该库支持由类`BLDCDriver3PWM` 和 `BLDCDriver6PWM`  控制的无刷直流电机驱动器以及由类`StepperDriver4PWM` 控制的步进电机驱动器。

类`BLDCDriver3PWM`的实现需要以下参数 ：

-  `A`, `B` 和 `C` 相对应的引脚编号
- `enable` 的引脚编号 *（可选）*

例如：
```cpp
#include <SimpleFOC.h>

//  BLDCDriver3PWM( pin_pwmA, pin_pwmB, pin_pwmC, enable (optional))
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// instantiate sensor 

void setup() {  

  // init sensor

  // power supply voltage
  driver.voltage_power_supply = 12;
  // driver init
  driver.init();

}

void loop() {

}
```


完整的设置和参数配置文件，请访问 <a href="drivers_config"> 驱动器 docs <i class="fa fa-external-link"></i></a>。


## 第3步 <a href="current_sense" class="remove_dec">设置电流检测</a>
配置好位置传感器及驱动器后，如果驱动器支持电流检测的话，我们开始初始化和配置电流检测。如果不支持的话，可以跳过这一步。 该库仅支持in-line电流检测 `InlineCurrentSense`这一种电流检测方式。 

类`InlineCurrentSense` 的实现需要以下参数：
- 分流电阻器值 `shunt_resistance`
- 放大器增益 `gain`
-  A, B （以及可选C）相对应的引脚编号

例如：
```cpp
#include <SimpleFOC.h>

// instantiate driver
// instantiate sensor

//  InlineCurrentSense(shunt_resistance, gain, adc_a, adc_b)
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50, A0, A2);


void setup() {  

  // init sensor

  // init driver

  // init current sense
  current_sense.init();

}

void loop() {

}
```


完整的设置和参数配置文件，请访问<a href="current_sense"> 电流检测 docs <i class="fa fa-external-link"></i></a>。



## 第4步 <a href="motors_config" class="remove_dec">设置电机</a>
配置好位置传感器及驱动器后，我们开始初始化和配置电机。 该库支持由 `BLDCMotor` 类控制的无刷直流电机以及由 `StepperMotor` 类控制的步进电机。仅需填入电机极对数就能实现这两个类的控制。

```cpp
// StepperMotor(int pole_pairs)
StepperMotor motor = StepperMotor(50);
```
```cpp 
// BLDCMotor(int pole_pairs)
BLDCMotor motor = BLDCMotor(11);
```


在这一例程，我们使用了无刷直流电机：
```cpp
#include <SimpleFOC.h>

//  BLDCMotor( int pole_pairs )
BLDCMotor motor = BLDCMotor( 11);
 
// instantiate driver
// instantiate sensor 
// instantiate current sensor   

void setup() {  
  // init sensor
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // init driver
  // link the motor to the driver
  motor.linkDriver(&driver);
  
  // init current sense
  // link to the motor
  motor.linkCurrentSense(&current_sese);

  // set control loop type to be used
  motor.controller = MotionControlType::velocity;
  // initialize motor
  motor.init();

}

void loop() {

}
```

在电机实例 `motor` 创建后，我们需要用`motor.linkSensor()` 连接电机与传感器，用 `motor.linkDriver()`连接电机与驱动器。  <br>下一步是配置电机。在这个配置例子中，我们仅用到了位置控制环：

```cpp
// set control loop type to be used
motor.controller = MotionControlType::velocity;
```
最后，我们运行  `motor.init()` 功能，结束电机 `motor` 的设置。

完整的设置和参数配置文件，请访问 <a href="motors_config"> 电机 docs <i class="fa fa-external-link"></i></a>.


## 第5步 [FOC 例程及实时位置控制](motion_control)
在初始化位置传感器、驱动器和电机之后，运行FOC算法之前，我们需要校准电机和传感器。这个过程被称为 `motor.initFOC()`. 
在这一步之后，我们将拥有一个能够正常工作的位置传感器以及配置好的电机，我们的FOC算法将知道怎样基于位置传感器的测量设定合适的电压。

在FOC算法的实时例程里，我们需要在Arduino `loop()`加入功能模块 `motor.loopFOC()` 和 `motor.move(target)` 。
- `motor.loopFOC()`：FOC 算法执行——应该尽可能快地被执行 `> 1kHz`。
- `motor.move(target)`： 位置控制例程——取决于`motor.controller` 参数。

下面是其在代码中的呈现：

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate driver
// instantiate sensor 
// instantiate current sensor   

void setup() {  
  
  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver

  // init current sense
  // link motor and current sense

  // configure motor
  // init motor

  // align encoder and start FOC
  motor.initFOC();
}

void loop() {
  // FOC algorithm function
  motor.loopFOC();

  // velocity control loop function
  // setting the target velocity or 2rad/s
  motor.move(2);
}
```

无刷直流电机完整的设置和参数配置文件，请访问 <a href="bldcmotor"> 无刷直流电机 docs  <i class="fa fa-external-link"></i></a>， 步进电机的完整文件，请访问 <a href="steppermotor"> 步进电机 docs  <i class="fa fa-external-link"></i></a>。


## 第6步 <a href="monitoring" class="remove_dec"> 监测 </a>

类 `BLDCMotor` 和 `StepperMotor` 提供监测功能。为了使其拥有监测的特性，你需要确保你想要输出的串口例程 `Serial` 激活了`motor.useMonitoring()` 。 在  `motor.init()` 和 `motor.initFOC()` 的运作下，类 `Serial` 将输出电机初始化状态。 

如果你对实时输出电机状态变量感兴趣（即使这样会影响它的性能——编写串口的速度会很慢！），你可以添加功能模块 `motor.monitor()` 唤起 Arduino`loop()`的运作 。

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate driver
// instantiate senor

void setup() {  
  
  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver

  // init current sense
  // link motor and current sense

  // use monitoring with the BLDCMotor
  Serial.begin(115200);
  // monitoring port
  motor.useMonitoring(Serial);
  
  // configure motor
  // init motor
  
  // align encoder and start FOC
}

void loop() {
  
  // FOC execution
  // motion control loop

  // monitoring function outputting motor variables to the serial terminal 
  motor.monitor();
}
```
完整的设置和参数配置文件，请访问 <a href="monitoring"> 监测 docs</a>。


## 第7步 <a href="communication" class="remove_dec"> 命令接口</a>

最后，为了配置控制算法，设定目标值，以用户友好的方式获得状态变量（不仅仅是像使用`motor.monitor()`那样的跳变）。Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>  为你提供像通信接口一样的 G 代码，组成类 `Commander` 。

以下代码是用户使用接口进行通信的基础实现方式：

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate senor

//instantiate commander
Commander commander = Commander(Serial);
void doMotor(char* cmd){commander.motor(&motor, cmd);}

void setup() {  
  
  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver

  // init current sense
  // link motor and current sense
  
  // enable monitoring
  
  // subscribe motor to the commands
  commander.add('M',doMotor,"motor");

  // init motor
  
  // align encoder and start FOC
}

void loop() {
  
  // FOC execution
  // motion control loop
  // monitor variables

  // read user commands
  commander.run();
}
```
完整的设置和参数配置文件，请访问 <a href="communication"> 通信 docs</a>。


<script type="text/javascript">
    hideClass('language-c');
    document.getElementById("enc_p").style.display = "none";

    function showMagnetic(){
        document.getElementById("enc").classList.remove("btn-primary");
        document.getElementById("mag").classList.add("btn-primary");
        hideClass('language-c');
        showClass('language-c++');
        hideClass('hide_p');
        document.getElementById("mag_p").style.display = "block";


        return 0;
    }
    
    function showEncoder(){
        document.getElementById("mag").classList.remove("btn-primary");
        document.getElementById("enc").classList.add("btn-primary");
        showClass('language-c');
        hideClass('language-c++');
        hideClass('hide_p');
        document.getElementById("enc_p").style.display = "block";
    
        return 0;
    }

  function hideClass(class_name){
    var elems = document.getElementsByClassName(class_name);
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
    }
  }
  function showClass(class_name){
    var elems = document.getElementsByClassName(class_name);
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "block";
    }
  }

</script>


## 第8步 [分步使用教程](example_from_scratch)

现在你应该已经熟悉SimpleFOC库的代码框架并且能够开始编写自己的应用程序了。为了使这一过程更加简单易懂，我们为你提供了详细的分步使用教程以确保你能够在初次接触这个库时一步一步的顺利进行。

## 🎨 完整的Arduino代码例程

现在你已经学习完Arduino项目的所有部分了，这是一些额外配置的完整代码例程，请浏览这些代码以便更好地将先前介绍的所有部分内容融会贯通。这就是该库的代码例程： `motor_full_control_serial_examples/magnetic_sensor/full_control_serial.ino`。

```cpp
#include <SimpleFOC.h>

// magnetic sensor instance - SPI
MagneticSensorSPI sensor = MagneticSensorSPI(AS5147_SPI, 10);

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// commander interface
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // initialise magnetic sensor hardware
  sensor.init();
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // set control loop type to be used
  motor.controller = MotionControlType::torque;

  // contoller configuration based on the control type 
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  motor.PID_velocity.D = 0;
  // default voltage_power_supply
  motor.voltage_limit = 12;

  // velocity low pass filtering time constant
  motor.LPF_velocity.Tf = 0.01;

  // angle loop controller
  motor.P_angle.P = 20;
  // angle loop velocity limit
  motor.velocity_limit = 50;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

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
  // velocity, position or voltage
  // if tatget not set in parameter uses motor.target variable
  motor.move();
  
  // user communication
  command.run();
}
```

## 开源代码库
对扩展和调整SimpleFOC库源代码有兴趣的朋友，可以在 <a href="source_code">SimpleFOC库源代码 docs</a> 中找到完整文档。