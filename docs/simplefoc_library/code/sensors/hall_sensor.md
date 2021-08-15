---
layout: default
title: Hall sensors
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /hall_sensors
nav_order: 2
parent: Position Sensors
grand_parent: Writing the Code
grand_grand_parent: Arduino <span 类="simple">Simple<span 类="foc">FOC</span>library</span>
---


# 霍尔传感器的设置
<div class="width60">
<img src="extras/Images/hall_schema.jpg" style="width:48.5%;display:inline"><img src="extras/Images/hall.png" style="width:48.5%;display:inline">
</div>

## 步骤1.实例化 `HallSensor` 类
为了初始化霍尔传感器 ，你需要提供 `A`, `B`和 `C` (有时称为 `U`,`V` 和`W`)通道的引脚编号和电机的极对 `pp` 的数量。

```cpp
// Hall sensor instance
// HallSensor(int hallA, int hallB , int cpr, int index)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);
```

## 步骤2.配置

此外，霍尔传感器还有一个可选参数，你可以设置，上拉位置。霍尔传感器通常需要上拉，如果你的传感器需要上拉，而你手上没有，你可以使用 Arduino pullups。这是通过改变 `sensor.pullup` 的值来设置的。默认值设置为 `Pullup::USE_EXTERN`，但如果你想改变它，使用MCU的做:

```cpp
// use internal pullups
sensor.pullup = Pullup::USE_INTERN;
```
<blockquote class="warning"><p class="heading">Arduino Pullup 20kΩ</p> 使用内部拉拔时要小心，Arduino在20kΩ左右有相对较高的拉拔值，这意味着更高的速度(较短的脉冲持续时间)可能会有一些问题。建议上拉值在1kΩ和5kΩ之间.</blockquote>

## 步骤3.中断设置
有两种方法可以运行大厅传感器与Simple FOC library。
- 使用 [hardware external interrupt](#hardware-external-interrupt) 
   - Arduino UNO(Atmega328) pins `2` 和 `3`
   - STM32 boards any pin
   - ESP32 any pin
- 使用 [software pin change interrupt](#software-pin-change-interrupt) 通过使用这样的库例如 [PciManager library](https://github.com/prampec/arduino-pcimanager)
   - 只对 Arduino devices (Atmga328 and Atmage2560)

<blockquote class="warning"><p class="heading">Software interrupts</p> 使用硬件外部中断通常会得到更好和更可靠的性能，但软件中断在较低的速度下工作得很好。特别是在没有足够的硬件中断引脚的板上，有了这个功能基本上可以在这些板上实现FOC.</blockquote>
### 硬件外部中断

Arduino UNO有两个硬件外部中断引脚，引脚 `2` 和 `3`,Arduino Mega有6个中断引脚, 引脚  `2`， `3`，`18`， `19`， `20`和 `2` ，而ESP32和STM32 boards可以使用所有的digital pins 为 interrupt pins，使实现更加容易。

Simple FOC `HallSensor` 类已经实现了初始化和传感器`A`, `B` 和 `C` 通道回调。你需要做的就是定义两个函数 `doA()`, `doB()` 和 `doC()`,传感器回调函数的缓冲函数`sensor.handleA()`, `sensor.handleB()` 和  `sensor.handleC()`.

```cpp
// interrupt routine initialization
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}
```
并将这些功能提供给霍尔传感器中断初始化功能 `sensor.enableInterrupts()`.

```cpp
// enable hall sensor hardware interrupts
sensor.enableInterrupts(doA, doB, doC)
```
你可以按照自己的意愿命名缓冲函数。将它们提供给传感器 `sensor.enableInterrupts()` function是很重要的。这个过程是可伸缩性和简单性之间的折衷。这允许你有多个传感器连接到同一个MCU。你所需要做的就是实例化new  `HallSensor`类并创建新的缓冲函数。例如:

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

###  软件引脚改变中断

对于Arduino Uno和使用Atmega328芯片的电路板，我们将不得不使用软件中断库来使用这个库中的霍尔传感器，因为我们将需要3个中断引脚，而Atmega328只有2个。 
我建议使用 [PciManager library](https://github.com/prampec/arduino-pcimanager).

在代码中使用这个库的步骤非常类似于 [hardware interrupt](#arduino-hardware-external-interrupt).
The SimpleFOC `HallSensor` 类仍然为你提供了所有的回调 `A`, `B` and `C` 通道，但Simple FOC library 会为你初始化中断。

为了使用 `PCIManager` library 你需要在你的代码中包含它:
```cpp
#include <PciManager.h>
#include <PciListenerImp.h>
```
下一步和之前一样，你只需要初始化new `HallSensor` instance.
```cpp
HallSensor sensor = HallSensor(2, 3, 4, 11);
// A, B and C interrupt callback buffers
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}
```
然后你声明监听器 `PciListenerImp `:
```cpp
// sensor interrupt init
PciListenerImp listenA(sensor.pinA, doA);
PciListenerImp listenB(sensor.pinB, doB);
PciListenerImp listenC(sensor.pinC, doC);
```
最后，传感器 `sensor.init()` 运行后跳过对传感器 `sensor.enableInterrupts()` 并调用 `PCIManager` library 来注册所有传感器通道的中断。

```cpp
// initialize sensor hardware
sensor.init();
// interrupt initialization
PciManager.registerListener(&listenA);
PciManager.registerListener(&listenB);
PciManager.registerListener(&listenC);
```
就是这样，非常简单。如果你想要多个传感器，你只需初始化新的类实例，创建新的`A`, `B` and `C` 回调，初始化新的监听器。下面是一个简单的例子:

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

## 步骤4.实时使用霍尔传感器

使用霍尔传感器实现在这个库有两种方法:
- 作为FOC算法的电机位置传感器
- 作为独立位置传感器

### FOC算法的位置传感器

使用霍尔传感器与 foc algorithm 实现在这个库，一旦你已经初始化传感器 `sensor.init()`它并启用中断传感器 `sensor.enableInterrupts(...)` 你只需要通过执行链接它到BLDC电机:

```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

要在任何给定的时间获得霍尔传感器的角度和速度，你可以使用公共方法:
```cpp
类 HallSensor{
 public:
    // shaft velocity getter
    float getVelocity();
	  // shaft angle getter
    float getAngle();
}
```

下面是一个只使用硬件中断的快速示例:
```cpp
#include <SimpleFOC.h>

// Hall sensor instance
// HallSensor(int hallA, int hallB , int cpr, int index)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// Interrupt routine initialization
// channel A and B callbacks
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
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```


下面是一个使用软件中断的快速示例:
```cpp
#include <SimpleFOC.h>

// Hall sensor instance
// HallSensor(int hallA, int hallB , int cpr, int index)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// Interrupt routine initialization
// channel A and B callbacks
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
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```
