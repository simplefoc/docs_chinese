---
layout: default
title: 霍尔传感器
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /hall_sensors
nav_order: 2
parent: 位置传感器
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---



# 霍尔传感器设置
<div class="width60">
<img src="extras/Images/hall_schema.jpg" style="width:48.5%;display:inline"><img src="extras/Images/hall.png" style="width:48.5%;display:inline">
</div>

## 步骤1. 实例化`HallSensor`类
要初始化霍尔传感器，你需要提供`A`、`B`和`C`（有时也称为`U`、`V`和`W`）通道的引脚号以及电机的极对数`pp`。
```cpp
// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);
```

## 步骤2. 配置

此外，霍尔传感器还有一个可选参数可以设置，即上拉位置。霍尔传感器通常需要上拉电阻，如果你需要但手头没有，可以使用Arduino的内部上拉电阻。这可以通过更改`sensor.pullup`变量的值来设置。默认值设置为`Pullup::USE_EXTERN`，但如果你想将其更改为使用MCU的内部上拉电阻，可以这样做：
```cpp
// use internal pullups
sensor.pullup = Pullup::USE_INTERN;
```
<blockquote class="warning"><p class="heading">Arduino 上拉电阻 20kΩ</p> 使用内部上拉电阻时要小心，Arduino的上拉电阻值相对较高，约为20kΩ，这意味着在较高速度下（脉冲持续时间较短时）可能会出现一些问题。推荐的上拉电阻值在1kΩ到5kΩ之间。</blockquote>

### 步骤2.1 速度异常值去除

从v2.2.3版本开始，`HallSensor`类在其速度计算中实现了异常值去除功能。它基于一个简单的原理，即所有计算出的高于某个最大预期速度的速度都被视为异常值。要修改最大预期电机速度，可以修改`velocity_max`变量。该变量默认设置为1000rad/s，这对于大多数应用来说是一个很好的起点。除非你使用的是高性能电机，此时1000rad/s（约10,000rpm）仍可能被电机达到，在这种情况下，请将此值增加到电机无法达到的数值。

```cpp
// maximal expected velocity
sensor.velocity_max = 1000; // 1000rad/s by default ~10,000 rpm
```
## 步骤3. 中断设置（可选）

从v2.3.4版本开始，`HallSensor`类不再需要基于中断的操作。基于中断的操作仍然可用，并且在某些应用中可能性能更好，但它不再是必需的。如果你不使用中断，可以跳过此步骤，直接进入[步骤4. 实时使用霍尔传感器](#步骤4-实时使用霍尔传感器)。

使用<span class="simple">简易<span class="foc">FOC</span>库</span>运行霍尔传感器有两种方式：
- 使用[硬件外部中断](#硬件外部中断)
  - Arduino UNO（ATmega328）引脚`2`和`3`
  - STM32开发板的任何引脚
  - ESP32的任何引脚
  - Teensy的任何引脚
  ...
- 使用[软件引脚变化中断](#软件引脚变化中断)，通过使用诸如[PciManager库](https://github.com/prampec/arduino-pcimanager)之类的库
  - 仅适用于Arduino设备（ATmega328和ATmega2560）

<blockquote class="warning"><p class="heading">软件中断</p> 使用硬件外部中断通常会带来更好、更可靠的性能，但软件中断在较低速度下也能很好地工作。特别是在那些没有足够硬件中断引脚的开发板上，此功能基本上可以在这些开发板上启用FOC。</blockquote>

<blockquote class="info" markdown="1"> <p class="heading">经验法则：硬件/软件还是无中断？</p>
1. 先从无中断开始，看看性能是否足以满足你的应用。
2. 如果性能不够，并且你有足够的硬件中断引脚，请尝试使用硬件中断。
3. 否则，如果你使用的是Arduino开发板，请尝试使用软件中断。（预期性能最差的解决方案）
</blockquote>

### 硬件外部中断
Arduino UNO有两个硬件外部中断引脚，引脚`2`和`3`，Arduino Mega有6个中断引脚，引脚`2`、`3`、`18`、`19`、`20`和`21`，而ESP32和STM32开发板可以将其所有数字引脚用作中断引脚，这使得实现更加容易。

简易FOC的`HallSensor`类已经实现了初始化和传感器`A`、`B`和`C`通道回调函数。
你需要做的就是定义两个函数`doA()`、`doB()`和`doC()`，它们是传感器回调函数`sensor.handleA()`、`sensor.handleB()`和`sensor.handleC()`的缓冲函数。
```cpp
// interrupt routine initialization
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}
```
然后将这些函数提供给霍尔传感器中断初始化函数`sensor.enableInterrupts()`
```cpp
// enable hall sensor hardware interrupts
sensor.enableInterrupts(doA, doB, doC)
```
你可以随意命名缓冲函数。重要的是将它们提供给`sensor.enableInterrupts()`函数。这个过程是在可扩展性和简单性之间的权衡。这允许你将多个传感器连接到同一个MCU。你只需要实例化新的`HallSensor`类并创建新的缓冲函数。
```cpp
// sensor 1
HallSensor sensor1 = HallSensor(...);
void doA1(){sensor1.handleA();}
void doB1(){sensor1.handleB();}
void doC1(){sensor1.handleC();}
// sensor 2
HallSensor sensor2 = HallSensor(...);
void doA2(){sensor2.handleA();}
void doB2(){sensor2.handleB();}
void doC2(){sensor2.handleC();}

void setup(){
...
  sensor1.init();
  sensor1.enableInterrupts(doA1,doB1,doC1);
  sensor2.init();
  sensor2.enableInterrupts(doA2,doB2,doC2);
...
}
```

### 软件引脚变化中断

对于Arduino UNO和其他使用ATmega328芯片的开发板，我们将不得不使用软件中断库来通过此库使用霍尔传感器，因为我们需要三个中断引脚，而ATmega328只有2个。
建议使用[PciManager库](https://github.com/prampec/arduino-pcimanager)。

在代码中使用该库的步骤与[硬件中断](#arduino-硬件外部中断)非常相似。
简易FOC的`HallSensor`类仍然为你提供所有`A`、`B`和`C`通道的回调，但简易FOC库不会为你初始化中断。

为了使用`PCIManager`库，你需要在代码中包含它：
```cpp
#include <PciManager.h>
#include <PciListenerImp.h>
```
下一步与之前相同，你只需初始化新的`HallSensor`实例。
```cpp
HallSensor sensor = HallSensor(2, 3, 4, 11);
// A, B and C interrupt callback buffers
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}
```
然后声明监听器`PciListenerImp`：
```cpp
// sensor interrupt init
PciListenerImp listenA(sensor.pinA, doA);
PciListenerImp listenB(sensor.pinB, doB);
PciListenerImp listenC(sensor.pinC, doC);
```
最后，运行`sensor.init()`后，跳过调用`sensor.enableInterrupts()`，并调用`PCIManager`库为所有传感器通道注册中断。

```cpp
// initialize sensor hardware
sensor.init();
// interrupt initialization
PciManager.registerListener(&listenA);
PciManager.registerListener(&listenB);
PciManager.registerListener(&listenC);
```
就是这样，非常简单。如果你想要多个传感器，只需初始化新的类实例，创建新的`A`、`B`和`C`回调，初始化新的监听器。
```cpp
// sensor 1
HallSensor sensor1 = HallSensor(2, 3, 4, 11);
void doA1(){sensor1.handleA();}
void doB1(){sensor1.handleB();}
void doC1(){sensor1.handleC();}
PciListenerImp listenC1(sensor1.pinC, doC1);

// sensor 2
HallSensor sensor2 = HallSensor(5, 6, 7, 11);
void doA2(){sensor2.handleA();}
void doB2(){sensor2.handleB();}
void doC2(){sensor2.handleC();}
PciListenerImp listenA2(sensor2.pinA, doA2);
PciListenerImp listenB2(sensor2.pinB, doB2);
PciListenerImp listenC2(sensor2.pinC, doC2);

void setup(){
...
  // sensor 1
  sensor1.init();
  sensor1.enableInterrupts(doA1,doB1); // two hardware interrupts
  PciManager.registerListener(&listenC1); // one software interrupt

  // sensor 2
  sensor2.init();
  PciManager.registerListener(&listenA2);
  PciManager.registerListener(&listenB2);
  PciManager.registerListener(&listenC2);
...
}
```

## 步骤4. 实时使用霍尔传感器

该库中实现的使用霍尔传感器的方式有两种：
- 作为FOC算法的电机位置传感器
- 作为独立的位置传感器

### FOC算法的位置传感器

要将霍尔传感器与该库中实现的foc算法一起使用，一旦你初始化了`sensor.init()`并启用了中断`sensor.enableInterrupts(...)`，你只需通过执行以下操作将其链接到BLDC电机：

```cpp
motor.linkSensor(&sensor);
```

然后你将能够使用电机实例访问电机的角度和速度：
```cpp
motor.shaft_angle; // motor angle
motor.shaft_velocity; // motor velocity
```

或者通过传感器实例：
```cpp
sensor.getAngle(); // motor angle
sensor.getVelocity(); // motor velocity
```

#### 示例代码


<a href ="javascript:show('noint','type');" class="btn btn-type  btn-noint  btn-primary">无中断</a>
<a href="javascript:show('hint','type');" class="btn btn-type btn-hint">硬件中断</a>
<a href ="javascript:show('sint','type');"  class="btn btn-type btn-sint">软件中断</a>


<div class="type type-hint hide"  markdown="1">

这是一个使用**硬件中断**的快速示例：
```cpp
#include <SimpleFOC.h>

// Motor instance
BLDCMotor motor = BLDCMotor(11);
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 10);

// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// Interrupt routine initialization
// channel A, B and C callbacks
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

void setup() {
  // monitoring port
  Serial.begin(115200);

  // driver config
  driver.init();
  motor.linkDriver(&driver);
  
  // initialize sensor hardware
  sensor.init();
  // hardware interrupt enable
  sensor.enableInterrupts(doA, doB, doC);
  // link the motor and the sensor
  motor.linkSensor(&sensor);

  // enable motor
  motor.init();
  // align sensor and start FOC 
  motor.initFOC();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // FOC algorithm function
  motor.loopFOC();

  // motion control
  motor.move();
}
```

</div>


<div class="type type-sint hide"  markdown="1">

这是一个使用**软件中断**的快速示例：
```cpp
#include <SimpleFOC.h>

// Motor instance
BLDCMotor motor = BLDCMotor(11);
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 10);

// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// Interrupt routine initialization
// channel A, B and C callbacks
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

// sensor interrupt init
PciListenerImp listenA(sensor.pinA, doA);
PciListenerImp listenB(sensor.pinB, doB);
PciListenerImp listenC(sensor.pinC, doC);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // driver config
  driver.init();
  motor.linkDriver(&driver);
  
  // initialize sensor hardware
  sensor.init();
  // interrupt initialization
  PciManager.registerListener(&listenA);
  PciManager.registerListener(&listenB);
  PciManager.registerListener(&listenC);
  
  // link the motor and the sensor
  motor.linkSensor(&sensor);

  // enable motor
  motor.init();
  // align sensor and start FOC 
  motor.initFOC();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // FOC algorithm function
  motor.loopFOC();

  // motion control
  motor.move();
}
```

</div>


<div class="type type-noint"  markdown="1">

这是一个**无中断**的霍尔传感器代码快速示例：
```cpp
#include <SimpleFOC.h>

// Motor instance
BLDCMotor motor = BLDCMotor(11);
// driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 10);

// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // driver config
  driver.init();
  motor.linkDriver(&driver);
  
  // initialize sensor hardware
  sensor.init();
  // link the motor and the sensor
  motor.linkSensor(&sensor);

  // enable motor
  motor.init();
  // align sensor and start FOC 
  motor.initFOC();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // FOC algorithm function
  motor.loopFOC();

  // motion control
  motor.move();
}
```

</div>



### 独立传感器

要在任何给定时间获取霍尔传感器的角度和速度，你可以使用公共方法：
```cpp
class HallSensor{
 public:
    // shaft velocity getter
    float getVelocity();
	  // shaft angle getter
    float getAngle();
}
```

<blockquote markdown="1" class="info">
<p class="heading" markdown="1">多次调用`getVelocity`</p>
调用`getVelocity`时，只有当前一次调用的时间间隔长于`min_elapsed_time`变量中指定的时间（默认100us）时，它才会计算速度。如果自上次调用以来的时间间隔短于`min_elapsed_time`，则该函数将返回先前计算的值。如有必要，可以轻松更改`min_elapsed_time`变量：

```cpp
sensor.min_elapsed_time = 0.0001; // 100us by default
```
</blockquote>

#### 示例代码

<a href ="javascript:show('noint','type');" class="btn btn-type  btn-noint  btn-primary">无中断</a>
<a href="javascript:show('hint','type');" class="btn btn-type btn-hint">硬件中断</a>
<a href ="javascript:show('sint','type');"  class="btn btn-type btn-sint">软件中断</a>


<div class="type type-hint hide"  markdown="1">

这是一个使用**硬件中断**的快速示例：
```cpp
#include <SimpleFOC.h>

// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// Interrupt routine initialization
// channel A, B and C callbacks
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

void setup() {
  // monitoring port
  Serial.begin(115200);

  // check if you need internal pullups
  sensor.pullup = Pullup::USE_EXTERN;
  
  // initialize sensor hardware
  sensor.init();
  // hardware interrupt enable
  sensor.enableInterrupts(doA, doB, doC);

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  sensor.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

</div>

<div class="type type-sint hide"  markdown="1">

这是一个使用**软件中断**的快速示例：
```cpp
#include <SimpleFOC.h>

// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// Interrupt routine initialization
// channel A, B and C callbacks
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

// sensor interrupt init
PciListenerImp listenA(sensor.pinA, doA);
PciListenerImp listenB(sensor.pinB, doB);
PciListenerImp listenC(sensor.pinC, doC);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // check if you need internal pullups
  sensor.pullup = Pullup::USE_EXTERN;
  
  // initialize sensor hardware
  sensor.init();
  // interrupt initialization
  PciManager.registerListener(&listenA);
  PciManager.registerListener(&listenB);
  PciManager.registerListener(&listenC);

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  sensor.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```
</div>
<div class="type type-noint"  markdown="1">

这是一个**无中断**的霍尔传感器代码快速示例：
```cpp
#include <SimpleFOC.h>

// Hall sensor instance
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

void setup() {
  // monitoring port
  Serial.begin(115200);
  
  // initialize sensor hardware
  sensor.init();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  sensor.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

</div>