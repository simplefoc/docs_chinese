---
layout: default
title: 编码器设置
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /encoder
nav_order: 1
parent: 位置传感器
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---



# 编码器设置
<div class="width60">
<img src="extras/Images/enc0.jpg" style="width:32%;display:inline"><img src="extras/Images/enc.jpg" style="width:32%;display:inline"><img src="extras/Images/enc1.png" style="width:32%;display:inline">
</div>

## 步骤1. 实例化`Encoder`类
要初始化编码器，你需要提供编码器的`A`和`B`通道引脚、编码器的`PPR`以及可选的`index`引脚。
```cpp
//  Encoder(int encA, int encB , int cpr, int index)
//  - encA, encB    - encoder A and B pins
//  - ppr           - impulses per rotation  (cpr=ppr*4)
//  - index pin     - (optional input)
Encoder encoder = Encoder(2, 3, 8192, A0);
```
## 步骤2. 配置
当实例化Encoder类后，我们需要对其进行配置。首先可以配置的功能是启用或禁用`Quadrature`（正交）模式。如果编码器运行在正交模式下，其每转脉冲数（`PPR`）会通过检测`A`和`B`信号的每个`CHANGE`（变化）而 quadruple（变为四倍），即`CPR = 4xPPR`。在某些应用中，当编码器的`PPR`较高时，可能会给Arduino带来过大负担，因此最好不使用正交模式。默认情况下，所有编码器都使用正交模式。如果要启用或禁用此参数，请在Arduino的`setup()`函数中`init()`调用之前进行操作：
```cpp
// Quadrature mode enabling and disabling
//  Quadrature::ON - CPR = 4xPPR  - default
//  Quadrature::OFF - CPR = PPR
encoder.quadrature = Quadrature::OFF;
```
<blockquote class="warning"><p class="heading">CPR、PPR？！</p> PPR（每转脉冲数）——这是编码器每转的物理脉冲数。CPR（每转计数）——这是编码器完整旋转一圈后计数器中的数值。现在，根据是否使用正交模式（计数脉冲的每个边沿），对于相同的PPR，会得到不同的CPR。在正交模式下，CPR = 4xPPR；如果不使用正交模式，CPR = PPR。</blockquote>

此外，编码器还有一个重要参数是上拉位置。许多编码器需要上拉电阻，如果你有一个需要上拉电阻但手头没有的编码器，可以使用Arduino的内部上拉电阻。这可以通过更改`encoder.pullup`变量的值来设置。默认值为`Pullup::USE_EXTERN`（使用外部上拉），如果你想将其改为使用MCU（微控制器）的内部上拉，请执行：
```cpp
// check if you need internal pullups
// Pullup::USE_EXTERN - external pullup added  - default
// Pullup::USE_INTERN - needs internal arduino pullup
encoder.pullup = Pullup::USE_INTERN;
```
<blockquote class="warning"><p class="heading">Arduino 上拉电阻 20kΩ</p> 使用内部上拉电阻时要小心，Arduino的上拉电阻值相对较高，约为20kΩ，这意味着在较高速度下（脉冲持续时间较短时）可能会出现一些问题。推荐的上拉电阻值在1kΩ到5kΩ之间。</blockquote>

## 步骤3. 编码器中断设置
使用Simple FOC库运行编码器有两种方式：
- 使用[硬件外部中断](#硬件外部中断)
  - Arduino UNO（ATmega328）引脚`2`和`3`
  - STM32开发板的任何引脚
  - ESP32的任何引脚
- 使用[软件引脚变化中断](#软件引脚变化中断)，可借助如[PciManager库](https://github.com/prampec/arduino-pcimanager)之类的库
  - 仅适用于Arduino设备（ATmega328和ATmega2560）

<blockquote class="warning"><p class="heading">软件中断</p> 使用硬件外部中断通常会带来更好、更可靠的性能，但软件中断在较低速度下也能很好地工作。特别是在那些没有足够硬件中断引脚的开发板上，此功能基本上可以使FOC在这些开发板上运行。</blockquote>

### 硬件外部中断
Arduino UNO有两个硬件外部中断引脚，引脚`2`和`3`；Arduino Mega有6个中断引脚，引脚`2`、`3`、`18`、`19`、`20`和`21`；而STM32开发板（如Nucleo和Bluepill）可以将其所有数字引脚用作中断引脚，这使得实现更加容易。

对于Arduino Uno，要使用硬件中断，编码器通道`A`和`B`必须准确连接到引脚`2`和`3`。


Simple FOC的`Encoder`类已经实现了初始化和编码器`A`、`B`通道的回调函数。

你只需要定义两个函数`doA()`和`doB()`，它们是编码器回调函数`encoder.handleA()`和`encoder.handleB()`的缓冲函数。
```cpp
// interrupt routine initialization
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
然后将这些函数提供给编码器中断初始化函数`encoder.enableInterrupts()`。

```cpp
// enable encoder hardware interrupts
encoder.enableInterrupts(doA, doB)
```
你可以随意命名缓冲函数，重要的是将它们提供给`encoder.enableInterrupts()`函数。这种做法是在可扩展性和简单性之间的权衡。这使你可以在同一个MCU上连接多个编码器。你只需要实例化新的`Encoder`类并创建新的缓冲函数。

```cpp
// encoder 1
Encoder enc1 =  Encoder(...);
void doA1(){enc1.handleA();}
void doB1(){enc1.handleB();}
// encoder 2
Encoder enc2 =  Encoder(...);
void doA2(){enc2.handleA();}
void doB2(){enc2.handleB();}

void setup(){
...
  enc1.init();
  enc1.enableInterrupts(doA1,doB1);
  enc2.init();
  enc2.enableInterrupts(doA2,doB2);
...
}
```

#### 索引引脚配置
为了有效地读取索引引脚，Simple FOC库允许你使用与`A`和`B`通道相同的方法。首先，你需要向`Encoder`类提供索引引脚号：
```cpp
Encoder encoder = Encoder(pinA, pinB, cpr, index_pin);
```
如果你使用的是Arduino Mega等类似的Arduino开发板，并且有两个以上的硬件中断引脚，你可以将索引引脚连接到硬件中断引脚（例如Arduino Mega的引脚`21`）。你的代码将如下所示：

```cpp
Encoder encoder =  Encoder(2,3,600,21);
// A and B interrupt routine 
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
void doIndex(){encoder.handleIndex();}

void setup(){
  ...
  encoder.enableInterrupts(doA,doB,doIndex);
  ...
  }
```
函数`enableInterrupts`将为你处理所有的初始化工作。

如果你使用Arduino UNO运行此算法，且没有足够的硬件中断引脚，则需要使用软件中断库，如[PciManager库](https://github.com/prampec/arduino-pcimanager)。使用带索引的编码器的Arduino UNO代码可以是：
```cpp
Encoder encoder =  Encoder(2,3,600,A0);
// A and B interrupt routine 
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
void doIndex(){encoder.handleIndex();}

// software interrupt listener for index pin
PciListenerImp listenerIndex(encoder.index_pin, doIndex);

void setup(){
  ...
  // hardware interrupts for A and B
  encoder.enableInterrupts(doA,doB);
  // software interrupt for index
  PciManager.registerListener(&listenerIndex);
  ...
  }
```
对于`A`和`B`引脚，如果你的应用导致硬件中断引脚不足，也可以采用相同的程序。软件中断非常强大，其产生的结果与硬件中断相当，特别是在你别无选择的情况下。`index`（索引）引脚每转产生一个脉冲，因此它不是很关键，所以使用软件还是硬件中断在性能方面不会有太大变化。


要更好地了解使用硬件和软件中断方法的编码器函数之间的差异，请查看示例`encoder_example.ino`和`encoder_software_interrupts_example.ino`。

### 软件引脚变化中断
如果你无法访问Arduino UNO的引脚`2`和`3`，或者想使用多个编码器，则必须使用软件中断方法。
建议使用[PciManager库](https://github.com/prampec/arduino-pcimanager)。

在代码中使用该库的步骤与[硬件中断](#arduino-hardware-external-interrupt)非常相似。
SimpleFOC的`Encoder`类仍然为你提供所有的`A`、`B`和`Index`（索引）通道的回调函数，但Simple FOC库不会为你初始化中断。


为了使用`PCIManager`库，你需要在代码中包含它：
```cpp
#include <PciManager.h>
#include <PciListenerImp.h>
```
下一步与之前相同，你只需初始化新的`Encoder`实例。
```cpp
Encoder encoder = Encoder(10, 11, 8192);
// A and B interrupt callback buffers
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
接下来，你声明监听器`PciListenerImp`：
```cpp
// encoder interrupt init
PciListenerImp listenerA(encoder.pinA, doA);
PciListenerImp listenerB(encoder.pinB, doB);
```
最后，在运行`encoder.init()`之后，跳过`encoder.enableInterrupts()`的调用，调用`PCIManager`库为所有编码器通道注册中断。
```cpp
// initialize encoder hardware
encoder.init();
// interrupt initialization
PciManager.registerListener(&listenerA);
PciManager.registerListener(&listenerB);
```
就是这样，非常简单。如果你想要多个编码器，只需初始化新的类实例，创建新的`A`和`B`回调函数，初始化新的监听器。

```cpp
// encoder 1
Encoder enc1 =  Encoder(9, 10, 8192);
void doA1(){enc1.handleA();}
void doB1(){enc1.handleB();}
PciListenerImp listA1(enc1.pinA, doA1);
PciListenerImp listB1(enc1.pinB, doB1);

// encoder 2
Encoder enc2 =  Encoder(13, 12, 8192);
void doA2(){enc2.handleA();}
void doB2(){enc2.handleB();}
PciListenerImp listA2(enc2.pinA, doA2);
PciListenerImp listB2(enc2.pinB, doB2);

void setup(){
...
  // encoder 1
  enc1.init();
  PciManager.registerListener(&listA1);
  PciManager.registerListener(&listB1);
  // encoder 2
  enc2.init();
  PciManager.registerListener(&listA2);
  PciManager.registerListener(&listB2);
...
}
```
你可以查看 HMBGC_example.ino 示例，了解这段代码的实际应用。
#### 索引引脚配置
在软件中断的情况下启用索引引脚非常简单。你只需要在`Encoder`类初始化时将其作为附加参数提供。
```cpp
Encoder encoder = Encoder(pinA, pinB, cpr, index_pin);
```
之后，你为`index`通道创建与`A`和`B`通道相同类型的回调缓冲函数，并使用`PCIManager`工具像初始化和注册`A`和`B`的监听器一样初始化和注册`index`通道的监听器。
```cpp
// class init
Encoder encoder =  Encoder(9, 10, 8192,11);
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
void doIndex(){encoder.handleIndex();}
// listeners init
PciListenerImp listenerA(encoder.pinA, doA);
PciListenerImp listenerB(encoder.pinB, doB);
PciListenerImp listenerIndex(encoder.index_pin, doIndex);

void setup(){
...
  // enable the hardware
  encoder.init();
  // enable interrupt
  PciManager.registerListener(&listenerA);
  PciManager.registerListener(&listenerB);
  PciManager.registerListener(&listenerIndex);
...
}
```

## 步骤4. 实时使用编码器

此库中实现的编码器有两种使用方式：
- 作为FOC算法的电机位置传感器
- 作为独立的位置传感器

### FOC算法的位置传感器

要将编码器传感器与本库中实现的foc算法一起使用，一旦你初始化了`encoder.init()`并启用了中断`encoder.enableInterrupts(...)`，你只需通过执行以下操作将其链接到BLDC电机：

```cpp
motor.linkSensor(&encoder);
```

然后，你将能够使用电机实例访问电机的角度和速度：
```cpp
motor.shaft_angle; // motor angle
motor.shaft_velocity; // motor velocity
```

或者通过传感器实例：
```cpp
encoder.getAngle(); // motor angle
encoder.getVelocity(); // motor velocity
```


### 独立传感器

要在任何给定时间获取编码器的角度和速度，你可以使用公共方法：
```cpp
class Encoder{
 public:
    // shaft velocity getter
    float getVelocity();
	  // shaft angle getter
    float getAngle();
}
```

<blockquote markdown="1" class="info">
<p class="heading" markdown="1">多次调用`getVelocity`</p>
调用`getVelocity`时，只有当前一次调用以来的经过时间长于变量`min_elapsed_time`（默认100us）中指定的时间时，它才会计算速度。如果自上次调用以来的经过时间短于`min_elapsed_time`，则该函数将返回先前计算的值。如有必要，可以轻松更改变量`min_elapsed_time`：

```cpp
encoder.min_elapsed_time = 0.0001; // 100us by default
```
</blockquote>

#### 示例代码


<a href="javascript:show('hint','type');" class="btn btn-type btn-hint btn-primary">硬件中断</a> 
<a href ="javascript:show('sint','type');"  class="btn btn-type btn-sint"> 软件中断</a>


<div class="type type-hint"  markdown="1">

以下是使用**硬件中断**的快速示例：

```cpp
#include <SimpleFOC.h>

Encoder encoder = Encoder(2, 3, 8192);
// interrupt routine initialization
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

void setup() {
  // monitoring port
  Serial.begin(115200);

  // enable/disable quadrature mode
  encoder.quadrature = Quadrature::ON;

  // check if you need internal pullups
  encoder.pullup = Pullup::USE_EXTERN;
  
  // initialize encoder hardware
  encoder.init();
  // hardware interrupt enable
  encoder.enableInterrupts(doA, doB);

  Serial.println("Encoder ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  encoder.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(encoder.getAngle());
  Serial.print("\t");
  Serial.println(encoder.getVelocity());
}
```

</div>


<div class="type type-sint hide"  markdown="1">


以下是使用**软件中断**的快速示例：
```cpp
#include <SimpleFOC.h>
#include <PciManager.h>
#include <PciListenerImp.h>

Encoder encoder = Encoder(2, 3, 8192);
// interrupt routine initialization
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// sensor interrupt init
PciListenerImp listenA(encoder.pinA, doA);
PciListenerImp listenB(encoder.pinB, doB);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // enable/disable quadrature mode
  encoder.quadrature = Quadrature::ON;

  // check if you need internal pullups
  encoder.pullup = Pullup::USE_EXTERN;
  
  // initialize encoder hardware
  encoder.init();
  // interrupt initialization
  PciManager.registerListener(&listenA);
  PciManager.registerListener(&listenB);

  Serial.println("Encoder ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT - call as frequently as possible
  // update the sensor values 
  encoder.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(encoder.getAngle());
  Serial.print("\t");
  Serial.println(encoder.getVelocity());
}
```
</div>