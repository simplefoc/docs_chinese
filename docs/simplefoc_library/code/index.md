---
layout: default
title: 编写代码
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /code
has_children: True
has_toc: False
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---

# 了解 <span class="simple">简易<span class="foc">FOC</span>库</span> 代码

一旦你安装好了 <span class="simple">简易<span class="foc">FOC</span>库</span> [安装说明](installation)，并且拥有了所有必要的 [硬件](supported_hardware)，我们终于可以开始熟悉将运行电机的 Arduino 代码了。以下是编写代码时所有最重要的步骤！

## 步骤 0. 包含库
让我们从包含库头文件开始：
```cpp
#include <SimpleFOC.h>
```

## 步骤 1. <a href="sensors" class="remove_dec">位置传感器设置</a>

编写代码的第一步是初始化和配置位置传感器。
该库支持以下位置传感器：
 - [编码器](encoder): 光学、电容、磁性编码器（ABI）
 - [磁性编码器](magnetic_sensor): SPI、I2C、模拟或 PWM
 - [霍尔传感器](hall_sensors): 3x 霍尔传感、磁性传感器（UVW 接口）
 - [通用传感器](generic_sensor) **新功能📢**: 用于添加自定义传感器的简化传感器实现

选择一个位置传感器用于本示例：

<a href="javascript:show(0,'sensor');" id="btn-0" class="btn btn-sensor btn-primary">Encoder</a> 
<a href ="javascript:show(1,'sensor');" id="btn-1" class="btn btn-sensor">Magnetic sensor</a> 
<a href ="javascript:show(2,'sensor');" id="btn-2" class="btn btn-sensor">Hall sensors</a> 

<div class="sensor-0 sensor" markdown="1" style="display:block">

```cpp
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


作为位置传感器的编码器在 Encoder 类中实现，由以下参数定义：
- A 和 B 通道引脚号：2 和 3
- 编码器 PPR（每转脉冲数）：2048
- 索引引脚号（可选）

   

</div>

<div class="sensor sensor-1" markdown="1" style="display:none">


```cpp
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

这是一个 14 位 SPI 基磁性传感器的初始化示例，例如 <a href="https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D">AS5047u <i class="fa fa-external-link"></i></a>，连接到引脚 10。
使用 SPI 协议的磁性传感器在 MagneticSensorSPI 类中实现，由以下参数定义：
 - 片选 引脚：10
 - 传感器的总位分辨率 12，CPR 可计算为 CPR = 2^14 位 = 16384
 - 角度 SPI 寄存器：0x3FFF

</div>

<div class="sensor sensor-2" markdown="1" style="display:none">


```cpp
#include <SimpleFOC.h>

// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// Interrupt routine initialization
// channel A and B callbacks
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

void setup() {
  // initialize sensor hardware
  sensor.init();
  // hardware interrupt enable
  sensor.enableInterrupts(doA, doB, doC);
}

void loop() {

}
```

这是一个连接到 11 极对电机的 3x 霍尔位置传感器示例。<br>
霍尔传感器在 HallSensors 类中实现，由以下参数定义：
 - 引脚 hallA、hallB 和 hallC：2、3 和 4
 - 电机极对数：11

</div>


通过运行 sensor.init() 初始化硬件引脚。

有关设置和所有配置参数的完整文档，请访问 <a href="sensors"> 位置传感器文档 <i class="fa fa-external-link"></i></a>。


## 步骤 2. <a href="drivers_config" class="remove_dec">驱动器设置</a>

设置好位置传感器后，我们继续初始化和配置驱动器。该库支持由 BLDCDriver3PWM 和 BLDCDriver6PWM 类处理的 [BLDC 驱动器](bldcdriver)，以及由 StepperDriver2PWM 和 StepperDriver4PWM 类处理的 [步进驱动器](stepperdriver)。

<a href="javascript:show('0d','driver');" id="btn-0d" class="btn-driver btn btn-primary">BLDC Driver - 3PWM</a> 
<a href ="javascript:show('1d','driver');" id="btn-1d" class="btn-driver btn">Stepper Driver 4PWM</a>


<div class="driver driver-0d" markdown="1" style="display:block">

BLDCDriver3PWM 类通过提供以下参数实例化：
- 相位 A、B 和 C 的 PWM 引脚
- 使能 引脚号（可选）

例如：
```cpp
#include <SimpleFOC.h>

//  BLDCDriver3PWM( pin_pwmA, pin_pwmB, pin_pwmC, enable (optional))
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// instantiate sensor 

void setup() {  

  // init sensor

  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 20000;
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  // driver init
  driver.init();

}

void loop() {

}
```
</div>

<div class="driver driver-1d" markdown="1" style="display:none">

StepperDriver4PWM 类通过提供以下参数实例化：
- 相位 1 的 PWM 引脚：1A、1B
- 相位 2 的 PWM 引脚：2A、2B
- 每相使能引脚（可选）：EN1 和 EN2

例如:
```cpp
#include <SimpleFOC.h>

// Stepper driver instance
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9,10, 7, 8);

// instantiate sensor 

void setup() {
  
  // init sensor

  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 20000;
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  
  // driver init
  driver.init();

}

void loop() {

}
```

</div>


有关设置和所有配置参数的完整文档，请访问 <a href="drivers_config"> 驱动器文档 <i class="fa fa-external-link"></i></a>。


## 步骤 3. <a href="current_sense" class="remove_dec">电流检测设置</a>
在位置传感器和驱动器之后，如果有电流检测功能，我们可以继续初始化和配置它。如果没有电流检测功能，可以跳过此步骤。该库支持两种类型的电流检测架构：
- 串联电流检测 `InlineCurrentSense`. 
- 低侧电流检测  `LowsideCurrentSense`. 


<a href="javascript:show('0cs','cs');" id="btn-0cs" class="btn-cs btn btn-primary">In-line current sensing</a> 
<a href ="javascript:show('1cs','cs');" id="btn-1cs" class="btn-cs btn">Low side current sensing</a>


<div  class="cs cs-0cs" markdown="1" style="display:block">

InlineCurrentSense 类通过提供以下参数实例化：
- 分流电阻值 shunt_resistance
- 放大器增益 gain
- 相位 A、B（可选 C）的模拟引脚号

例如:
```cpp
#include <SimpleFOC.h>

// instantiate driver
// instantiate sensor

//  InlineCurrentSense(shunt_resistance, gain, adc_a, adc_b)
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50, A0, A2);


void setup() {  

  // init sensor

  // init driver

  // link the driver with the current sense
  current_sense.linkDriver(&driver);
  // init current sense
  current_sense.init();

}

void loop() {

}
```
</div>


<div class="cs cs-1cs" markdown="1" style="display:none">
LowsideCurrentSense 类通过提供以下参数实例化：
- 分流电阻值 shunt_resistance
- 放大器增益 gain
- 相位 A、B（可选 C）的模拟引脚号

例如:
```cpp
#include <SimpleFOC.h>

// instantiate driver
// instantiate sensor

//  LowsideCurrentSense(shunt_resistance, gain, adc_a, adc_b, adc_c)
LowsideCurrentSense current_sense = LowsideCurrentSense(0.01, 50, A0, A1, A2);


void setup() {  

  // init sensor

  // init driver

  // link the driver with the current sense
  current_sense.linkDriver(&driver);
  // init current sense
  current_sense.init();

}

void loop() {

}
```
</div>

有关设置和所有配置参数的完整文档，请访问 <a href="current_sense"> 电流检测文档 <i class="fa fa-external-link"></i></a>。



## 步骤 4. <a href="motors_config" class="remove_dec">电机设置</a>
在位置传感器和驱动器之后，我们继续初始化和配置电机。该库支持由 BLDCMotor 类处理的 BLDC 电机，以及由 StepperMotor 和 HybridStepperMotor 类处理的步进电机。这两个类都通过提供电机的 极对数 以及可选的电机相电阻和 KV 额定值来实例化。


<a href="javascript:show('0m','motor');" id="btn-0m" class="btn-motor btn btn-primary">BLDC motor</a> 
<a href ="javascript:show('1m','motor');" id="btn-1m" class="btn-motor btn">Stepper motor</a>
<a href ="javascript:show('2m','motor');" id="btn-2m" class="btn-motor btn">HybridStepper motor</a>


<div class="motor motor-0m" markdown="1" style="display:block">

在本示例中，我们将使用 BLDC 电机：
```cpp
#include <SimpleFOC.h>

//  BLDCMotor( pole_pairs , ( phase_resistance, KV_rating  optional) )
BLDCMotor motor = BLDCMotor(11, 9.75);
 
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
  // link driver and the current sense
  
  // link the motor to current sense
  motor.linkCurrentSense(&current_sense);

  // set control loop type to be used
  motor.controller = MotionControlType::velocity;
  // initialize motor
  motor.init();

  // init current sense
  

}

void loop() {

}
```
</div>

<div class="motor motor-1m" markdown="1" style="display:none">

在本示例中，我们将使用步进电机：
```cpp
#include <SimpleFOC.h>

//  StepperMotor( int pole_pairs , (phase_resistance, KV_rating optional))
StepperMotor motor = StepperMotor(50);
 
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
  // link driver and the current sense
  
  // link the motor to current sense
  motor.linkCurrentSense(&current_sense);

  // set control loop type to be used
  motor.controller = MotionControlType::velocity;
  // initialize motor
  motor.init();
  
  // init current sense

}

void loop() {

}
```
</div>


<div class="motor motor-2m" markdown="1" style="display:none">

在本示例中，我们将使用混合步进电机（与 BLDC 驱动器耦合的步进电机）：
```cpp
#include <SimpleFOC.h>

//  HybridStepperMotor( int pole_pairs , (phase_resistance, KV_rating optional))
HybridStepperMotor motor = HybridStepperMotor(50);

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
  // link driver and the current sense
  
  // link the motor to current sense
  motor.linkCurrentSense(&current_sese);

  // set control loop type to be used
  motor.controller = MotionControlType::velocity;
  // initialize motor
  motor.init();

  // init current sense

}

void loop() {

}
```
</div>

创建电机 motor 的实例后，我们需要将电机与传感器 motor.linkSensor() 链接，并将电机类与它所连接的驱动器 motor.linkDriver() 链接。 <br>
下一步是配置步骤，为了本示例的目的，我们将只配置我们将要使用的运动控制环：
```cpp
// set control loop type to be used
motor.controller = MotionControlType::velocity;
```
为了完成 motor 设置，我们运行 motor.init() 函数。

有关设置和所有配置参数的完整文档，请访问 <a href="motors_config"> 电机文档 <i class="fa fa-external-link"></i></a>。


## 步骤 5.[ FOC 程序和实时运动控制](motion_control)
当我们初始化了位置传感器、驱动器和电机之后，在运行 FOC 算法之前，我们需要对齐电机和传感器。这通过调用 motor.initFOC() 来完成。此步骤之后，我们有一个功能正常的位置传感器，我们已经配置了电机，并且我们的 FOC 算法知道如何根据位置传感器测量值设置适当的电压。

对于 FOC 算法的实时程序，我们需要在 Arduino loop() 中添加 motor.loopFOC() 和 motor.move(target) 函数。
- `motor.loopFOC()`:  FOC 算法执行 - 应尽可能快地执行 > 1kHz
- `motor.move(target)`: 运动控制程序 - 取决于 motor.controller 参数

代码如下所示：

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
  // link driver and the current sense

  // link motor and current sense

  // configure motor
  // init motor

  // init current sense

  // align encoder and start FOC
  motor.initFOC();
}

void loop() {
  // FOC algorithm function
  motor.loopFOC();

  // velocity control loop function
  // setting the target velocity to 2rad/s
  motor.move(2);
}
```

有关 BLDC 电机的设置和所有配置参数的完整文档，请访问 <a href="bldcmotor"> BLDCMotor 文档 <i class="fa fa-external-link"></i></a>，对于步进电机，请访问 <a href="steppermotor"> StepperMotor 文档 <i class="fa fa-external-link"></i></a>


## 步骤 6. <a href="monitoring" class="remove_dec">监控</a>

BLDCMotor 和 StepperMotor 类提供监控功能。要启用监控功能，请确保调用 motor.useMonitoring() 并传入你想要输出的 Serial 端口实例。它使用 Serial 类在 motor.init() 函数以及 motor.initFOC() 函数期间输出电机初始化状态。

如果你有兴趣实时输出电机状态变量（尽管这会影响性能 - 写入 Serial 端口很慢！），请将 motor.monitor() 函数调用添加到 Arduino loop() 函数中。

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate driver
// instantiate senor

void setup() {
  
  // init the serial port
  Serial.begin(115200);

  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver
  // link driver and the current sense


  // init current sense
  // link motor and current sense

  // use monitoring with the BLDCMotor
  Serial.begin(115200);
  // monitoring port
  motor.useMonitoring(Serial);
  
  // configure motor
  // init motor

  // init current sense
  
  // align encoder and start FOC
}

void loop() {
  
  // FOC execution
  // motion control loop

  // monitoring function outputting motor variables to the serial terminal 
  motor.monitor();
}
```
有关 BLDCMotor 和 StepperMotor 监控的更多文档，请参见 <a href="monitoring"> 监控文档</a>。


## 步骤 7. <a href="debugging" class="remove_dec">调试输出</a>


简易FOC库 提供了一个信息丰富的调试接口，可以通过调用 SimpleFOCDebug::enable(&Serial) 函数启用。此函数启用库到 Serial 端口的调试输出。

此调试接口将输出更详细的信息，包括：
- 驱动器初始化（在 driver.init() 函数期间）
- 电流检测初始化（在 current_sense.init() 函数期间）
- 电机初始化（在 motor.init() 函数期间）
- 电机 FOC 初始化（在 motor.initFOC() 函数期间）

调试输出将提供有关电机、驱动器和电流检测在初始化过程中及之后的状态的更多信息，并将帮助你调试设置。

它还将提供特定于 MCU 架构的信息，例如哪些定时器和通道用于 PWM 生成，哪些 ADC 用于电流检测，TIME-ADC 同步是否工作等。
<blockquote class="info"> 
📢 我们强烈建议在开始使用 <span class="simple">简易<span class="foc">FOC</span>库</span> 时使用调试模式。

它提供的信息比标准监控输出多得多，有助于排查潜在问题，甚至是特定于 MCU 架构的问题。
</blockquote>

<blockquote class="warning">  
<p class="heading"> 内存使用 </p>
调试输出是字符串，可能会占用相当多的内存空间，因此不建议在最终应用程序中使用它。
</blockquote>

调试输出默认是禁用的，可以通过在任何 driver、sensor、current_sense 或 motor 初始化（init 调用）之前调用 SimpleFOCDebug::enable(&Serial) 函数来启用。最好将 SimpleFOCDebug::enable(&Serial) 函数调用放在 setup() 函数的开头。

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate driver
// instantiate senor

void setup() {
  
  // init the serial port
  // enable the debugging output
  SimpleFOCDebug::enable(&Serial);

  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver
  // link driver and the current sense


  // init current sense
  // link motor and current sense

  // enable monitoring
  
  // configure motor
  // init motor

  // init current sense
  
  // align encoder and start FOC
}

void loop() {
  
  // FOC execution
  // motion control loop
  // monitor variables
}
```
有关 简易FOC库 调试功能的更多文档，请参见 <a href="debugging"> 调试文档</a>。


## 步骤 8. <a href="communication" class="remove_dec">命令器接口</a>

最后，为了以用户友好的方式配置控制算法、设置目标值和获取状态变量（不仅仅是像使用 motor.monitor() 时那样 dumping），简易FOC库 以 Commander 类的形式为你提供了类似 g 代码的通信接口。



<a href="javascript:show('0c','commander');" id="btn-0c" class="btn-commander btn btn-primary">Full motor commander</a> 
<a href ="javascript:show('1c','commander');" id="btn-1c" class="btn-commander btn">Only motor target value</a>
<a href ="javascript:show('2c','commander');" id="btn-2c" class="btn-commander btn">Motion control target + Led control</a>


<div class="commander commander-0c" markdown="1" style="display:block">

以下代码是与用户的完整通信接口的一个基本实现：

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate senor

//instantiate commander
Commander commander = Commander(Serial);
void doMotor(char* cmd){commander.motor(&motor, cmd);}

void setup() {  
  
  // init the serial port
  // enable the debugging output

  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver
  // link driver and the current sense


  // init current sense
  // link motor and current sense
  
  // enable monitoring
  
  // subscribe motor to the commands
  commander.add('M',doMotor,"motor");

  // init motor

  // init current sense
  
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
</div>

<div class="commander commander-1c" markdown="1" style="display:none">

以下代码是使用命令器设置电机目标值的一个基本实现：

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate senor

//instantiate commander
Commander commander = Commander(Serial);
void doTarget(char* cmd){commander.scalar(&motor.target, cmd);}

void setup() {  
  
  // init the serial port
  // enable the debugging output

  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver
  // link driver and the current sense


  // init current sense
  // link motor and current sense
  
  // enable monitoring
  
  // subscribe motor to the commands
  commander.add('T',doTarget,"target");

  // init motor

  // init current sense
  
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
</div>

<div class="commander commander-2c" markdown="1" style="display:none">

以下代码是一个基本示例，展示了使用命令器接口进行运动控制，同时结合打开和关闭 led 灯。 

```cpp
#include <SimpleFOC.h>

// instantiate motor
// instantiate senor

//instantiate commander
Commander commander = Commander(Serial);
void doMotion(char* cmd){commander.motion(&motor, cmd);}
void doLed(char* cmd){
  if(cmd == '0')
    digitalWrite(13,LOW);
  else
    digitalWrite(13,HIGH);
}

void setup() {  
  
  // init the serial port
  // enable the debugging output

  // init sensor
  // link motor and sensor

  // init driver
  // link motor and driver
  // link driver and the current sense


  // init current sense
  // link motor and current sense
  
  // enable monitoring
  
  // subscribe motor to the commands
  commander.add('M',doMotion,"motion control");
  pinMode(13,OUTPUT);
  commander.add('L',doLed,"led control");

  // init motor

  // init current sense
  
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
</div>



有关设置和所有配置参数的完整文档，请访问 <a href="commander_interface"> 通信文档</a>。

## 步骤 9. [循序渐进的入门指南](example_from_scratch)

现在你已经熟悉了 简易FOC库 代码的结构，你终于可以开始编写自己的应用程序了。为了使这一步不那么复杂，我们为你提供了详细的循序渐进指南。当你第一次使用该库时，一定要浏览我们的循序渐进入门指南。

## 🎨 示例的完整 Arduino 代码

上面，你已经了解了 Arduino 程序的所有部分及其用途。以下是带有一些额外配置的完整代码示例。请仔细阅读代码，以更好地理解如何将前面介绍的所有部分集成到一个代码中。这是库示例 motor_full_control_serial_examples/magnetic_sensor/full_control_serial.ino 的代码。

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
  // monitoring port
  Serial.begin(115200);
  // enable the debugging output
  SimpleFOCDebug::enable(&Serial);

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
  // iterative setting of the FOC phase voltage
  motor.loopFOC();

  // iterative function setting the outter loop target
  // velocity, position or voltage
  // if target not set in parameter uses motor.target variable
  motor.move();
  
  // user communication
  command.run();
}
```

## 库源代码
如果你有兴趣扩展和改编 简易FOC库 源代码，你可以在 <a href="source_code">库源代码文档</a> 中找到完整的文档。