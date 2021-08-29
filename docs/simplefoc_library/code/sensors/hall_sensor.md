---
layout: default
title: 霍尔传感器设置
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /hall_sensors
nav_order: 2
parent: 位置传感器
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 霍尔传感器设置
<div class="width60">
<img src="extras/Images/hall_schema.jpg" style="width:48.5%;display:inline"><img src="extras/Images/hall.png" style="width:48.5%;display:inline">
</div>

## 步骤1.实例化 `HallSensor` 类
为了初始化霍尔传感器 ，你需要提供 `A`, `B`和 `C` (有时称为 `U`,`V` 和`W`)通道的引脚编号和电机的极对 `pp` 的数量。

```cpp
// 霍尔传感器实例
// HallSensor(int hallA, int hallB , int cpr, int index)
//  - hallA, hallB, hallC    - 霍尔传感器 A、 B 和 C 引脚
//  - pp                     - 极对数
HallSensor sensor = HallSensor(2, 3, 4, 11);
```

## 步骤2.配置

此外，霍尔传感器还有一个可选参数的上拉位置。霍尔传感器通常需要上拉，如果你的传感器需要上拉电阻，而你手上没有，你可以使用 Arduino pullups。则可以使用Arduino pullups的`encoder.pullup` 值来设置。默认值设置为`Pullup::USE_EXTERN` 但如果你想改用MCU的内部上拉，可以:

```cpp
// 使用内部上拉
sensor.pullup = Pullup::USE_INTERN;
```
<blockquote class="warning"><p class="heading">Arduino Pullup 20kΩ</p> 使用内部上拉时要小心，Arduino有比较高的20kΩ左右的上拉电阻，这意味着可能较高转速下(较短的脉冲持续时间)会出现一些问题。推荐的上拉值在1kΩ到5kΩ之间。.</blockquote>
## 步骤3.中断设置
有两种使用Simple FOC库运行霍尔传感器的方法。
- 使用 [hardware external interrupt](#hardware-external-interrupt) 
   - Arduino UNO(Atmega328) pins `2` 和 `3`
   - STM32 boards any pin
   - ESP32 any pin
- 使用 [software pin change interrupt](#software-pin-change-interrupt) 通过使用这样的库例如 [PciManager library](https://github.com/prampec/arduino-pcimanager)
   - 只对 Arduino devices (Atmga328 and Atmage2560)

<blockquote class="warning"><p class="heading">软件中断</p> 使用硬件外部中断通常会得到更好和更可靠的性能，但是软件中断在较低的速度下也运行得很好，特别是在没有足够的硬件中断引脚的板上。有了这个功能基本上可以在这些板上实现FOC。</blockquote>
### 硬件外部中断

Arduino UNO有两个硬件外部中断引脚，pin `2` 和 `3`，Arduino Mega有6个中断引脚，  `2`, `3`, `18`, `19`, `20`和 `2` ，而STM32如Nucleo和Bluepill可以以任意引脚为中断引脚，使实现更加容易。对于Arduino Uno，编码器通道 `A` 和 `B` 必须连接到pins `2` 和 `3`，以便使用硬件中断。

Simple FOC `HallSensor` 类已经实现了初始化和编码器`A`, `B` 和 `C` 通道回调。你需要做的就是定义三个函数 `doA()`, `doB()` 和 `doC()`,传感器回调函数的buffer函数`sensor.handleA()`, `sensor.handleB()` 和  `sensor.handleC()`.

```cpp
// 中断例程初始化
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}
```
并将这些功能提供给霍尔传感器中断初始化功能 `sensor.enableInterrupts()`.

```cpp
// 启用霍尔编码器硬件中断
sensor.enableInterrupts(doA, doB, doC)
```
你可以自行命名buffer函数。将它们提供给 `sensor.enableInterrupts()`是很重要的。这个过程是可伸缩性和简单性之间的权衡。这可以实现一个MCU连接多个编码器。你所需要做的就是实例化新的  `HallSensor`类并创建新的buffer函数。例如:

```cpp
//  编码器 1
HallSensor sensor1 = HallSensor(...);
void doA1(){sensor1.handleA();}
void doB1(){sensor1.handleB();}
void doC1(){sensor1.handleC();}
//  编码器 2
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

###  软件中断

如果你无法使用Arduino UNO的pin `2` 和 `3` ，或者想使用多个编码器，你就必须使用软件中断方法。

我建议使用[PciManager library](https://github.com/prampec/arduino-pcimanager).

在代码中使用这个库的步骤与 [hardware interrupt](#arduino-hardware-external-interrupt)非常相似。SimpleFOC  `Encoder` 类提供所有 `A`, `B` 和 `Index` 通道的回调，但Simple FOC library 不会初始化中断。

为了使用 `PCIManager`，你需要将它include进你的代码中:

```cpp
#include <PciManager.h>
#include <PciListenerImp.h>
```
下一步和前面一样，初始化新 `HallSensor` 实例
```cpp
HallSensor sensor = HallSensor(2, 3, 4, 11);
// A、B和C中断调回buffers
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}
```
然后你声明监听器 `PciListenerImp `:
```cpp
// 初始化编码器中断
PciListenerImp listenA(sensor.pinA, doA);
PciListenerImp listenB(sensor.pinB, doB);
PciListenerImp listenC(sensor.pinC, doC);
```
最后，在运行 `encoder.init()` 之后，跳过 `encoder.enableInterrupts()` 并调用`PCIManager` library来注册所有编码器通道的中断。

```cpp
// 初始化编码器硬件
sensor.init();
// 初始化中断
PciManager.registerListener(&listenA);
PciManager.registerListener(&listenB);
PciManager.registerListener(&listenC);
```
就是这样，非常简单。如果你想要多个编码器，你只需初始化新的 `Encoder`实例，创建新的`A`, `B` 和 `C` 回调，初始化新的监听器。下面是一个简单的例子:

```cpp
// 编码器 1
HallSensor sensor1 = HallSensor(2, 3, 4, 11);
void doA1(){sensor1.handleA();}
void doB1(){sensor1.handleB();}
void doC1(){sensor1.handleC();}
PciListenerImp listenC1(sensor1.pinC, doC1);

// 编码器 2
HallSensor sensor2 = HallSensor(5, 6, 7, 11);
void doA2(){sensor2.handleA();}
void doB2(){sensor2.handleB();}
void doC2(){sensor2.handleC();}
PciListenerImp listenA2(sensor2.pinA, doA2);
PciListenerImp listenB2(sensor2.pinB, doB2);
PciListenerImp listenC2(sensor2.pinC, doC2);

void setup(){
...
  // 编码器 1
  sensor1.init();
  sensor1.enableInterrupts(doA1,doB1); // 两个硬件中断
  PciManager.registerListener(&listenC1); // 一个软件中断

  // 编码器 2
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

要利用这个库通过编码器实现FOC算法，一旦你已经初始化传感器 `sensor.init()`它并启用中断传感器 `sensor.enableInterrupts(...)` 你只需要通过执行链接它到BLDC电机:

```cpp
motor.linkSensor(&sensor);
```

### 独立的传感器

获得霍尔传感器的角度和速度，你可以使用public方法:
```cpp
类 HallSensor{
 public:
    // 获取轴速度
    float getVelocity();
	  // 获取轴角度
    float getAngle();
}
```

下面是一个只使用硬件中断的快速示例:
```cpp
#include <SimpleFOC.h>

// 霍尔传感器实例
// HallSensor(int hallA, int hallB , int cpr, int index)
//  - hallA, hallB, hallC    - 霍尔传感器 A、 B 和 C 引脚
//  - pp                     - 极对数
HallSensor sensor = HallSensor(2, 3, 4, 11);

// 中断例程初始化
// 通道A和B回调
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

void setup() {
  // 监视点
  Serial.begin(115200);

  // 检查是否需要内部上拉
  sensor.pullup = Pullup::USE_EXTERN;
  
  // 初始化磁传感器硬件
  sensor.init();
  // 启用硬件中断
  sensor.enableInterrupts(doA, doB, doC);

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // 在终端显示角度和角速度
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```


下面是一个使用软件中断的快速示例:
```cpp
#include <SimpleFOC.h>

// 霍尔传感器实例
// HallSensor(int hallA, int hallB , int cpr, int index)
//  - hallA, hallB, hallC    - 霍尔传感器 A、 B 和 C 引脚
//  - pp                     - 极对数
HallSensor sensor = HallSensor(2, 3, 4, 11);

// 中断例程初始化
// 通道A和B回调
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

// 初始化传感器中断
PciListenerImp listenA(sensor.pinA, doA);
PciListenerImp listenB(sensor.pinB, doB);
PciListenerImp listenC(sensor.pinC, doC);

void setup() {
  // 监视点
  Serial.begin(115200);

  // 检查是否需要内部上拉
  sensor.pullup = Pullup::USE_EXTERN;
  
  // 初始化磁传感器硬件
  sensor.init();
  // 中断初始化
  PciManager.registerListener(&listenA);
  PciManager.registerListener(&listenB);
  PciManager.registerListener(&listenC);

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // 在终端显示角度和角速度
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```
