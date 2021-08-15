---
layout: default
title: Encoder
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /encoder
nav_order: 1
parent: Position Sensors
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 编码器设置
<div class="width60">
<img src="extras/Images/enc0.jpg" style="width:32%;display:inline"><img src="extras/Images/enc.jpg" style="width:32%;display:inline"><img src="extras/Images/enc1.png" style="width:32%;display:inline">
</div>

## 步骤1.实例化 `Encoder` 类
要初始化编码器，你需要提供编码器 `A` 和 `B`通道引脚，编码器 `PPR` 和 可选的`index` 引脚。
```cpp
/63/  Encoder(int encA, int encB , int cpr, int index)
//  - encA, encB    - encoder A and B pins
//  - ppr           - impulses per rotation  (cpr=ppr*4)
//  - index pin     - (optional input)
Encoder encoder = Encoder(2, 3, 8192, A0);
```
## 步骤2.配置
当Encoder 类被实例化时，我们需要配置它。我们可以配置的第一个特性是启用或禁用`Quadrature` 模式。如果编码器以正交模式运行，则通过检测信号 `A` 和 `B` - `CPR = 4xPPR`的每次 `CHANGE` ，其每次旋转的脉冲数(`PPR`)增加四倍。在某些应用中，当编码器`PPR`过高时，Arduino可能无法处理，所以最好不要使用`Quadrature` mode。默认情况下，所有编码器都使用`Quadrature` mode。如果你想启用或禁用这个参数，请在`init()` 调用之前在Arduino  `setup()` 函数中执行:

```cpp
// Quadrature mode enabling and disabling
//  Quadrature::ON - CPR = 4xPPR  - default
//  Quadrature::OFF - CPR = PPR
encoder.quadrature = Quadrature::OFF;
```
<blockquote class="warning"><p class="heading">CPR, PPR?!</p> PPR(每转脉冲数)——这是编码器每转脉冲数的物理量。
CPR(每旋转计数)-这是编码器完全旋转后计数器中的数字。
现在，取决于你是否使用正交模式(计算脉冲的每条边)或不(仅计算上升边)，你将对相同的PPR有不同的CPR。
对于求积模式，你会有CPR= 4xPPR，如果不使用求积模式，你会有CPR=PPR</blockquote>
此外，编码器还有一个更重要的参数，这就是上拉位置。很多编码器都需要上拉，如果你有一个需要上拉的编码器，但你手上没有，你可以使用Arduino pullups的值来设置编码器。`encoder.pullup` 变量的值来设置。默认值设置为`Pullup::USE_EXTERN` 但如果你想改变它，使用MCU的做:

```cpp
// check if you need internal pullups
// Pullup::USE_EXTERN - external pullup added  - default
// Pullup::USE_INTERN - needs internal arduino pullup
encoder.pullup = Pullup::USE_INTERN;
```
<blockquote class="warning"><p class="heading">Arduino Pullup 20kΩ</p> 使用内部上拉时要小心，Arduino有比较高值的拉拔在20kΩ左右，这意味着可能对于较高的速度(较短的脉冲持续时间)会出现一些问题。推荐的上拉值在1kΩ到5kΩ之间。.</blockquote>

## 步骤3.编码器中断设置
有两种使用Simple FOC库运行编码器的方法。
- 使用 [hardware external interrupt](#hardware-external-interrupt) 
   - Arduino UNO(Atmega328) 引脚 `2` 和 `3`
   
   - ##### STM32 任何引脚
   
   - ESP32 任何引脚
   
   -  ESP32 any pin
-  使用[software pin change interrupt](#software-pin-change-interrupt)，如 [PciManager library](https://github.com/prampec/arduino-pcimanager)
   
   - 仅适用于Arduino设备(Atmga328和Atmage2560)

<blockquote class="warning"><p class="heading">软件中断</p> 使用硬件外部中断通常会得到更好和更可靠的性能，但是软件中断在较低的速度下工作得很好。特别是在没有足够的硬件中断引脚的板上，有了这个功能基本上可以在这些板上实现FOC。.</blockquote>

### 硬件外部中断
Arduino UNO有两个硬件外部中断引脚，pin `2` 和 `3`,Arduino Mega有6个中断引脚，  `2`, `3`, `18`, `19`, `20`和 `2` ，而STM32如Nucleo和Bluepill可以使用他们所有的引脚为中断引脚，使实现更加容易。

对于Arduino Uno，编码器通道 `A` 和 `B` 必须连接到pins `2` 和 `3`，以便使用硬件中断。

SimpleFOC的 `Encoder` 类已经实现了初始化和编码器 `A` 和 `B`通道回调。你所需要做的就是定义两个函数 `doA()` 和 `doB()`，编码器回调函数中的的buffer函数

`encoder.handleA()` 和 `encoder.handleB()`. 

```cpp
// interrupt routine initialization
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
并将这些函数提供给编码器中断初始化函数 `encoder.enableInterrupts()`

```cpp
// enable encoder hardware interrupts
encoder.enableInterrupts(doA, doB)
```
你可以自行命名buffer函数。将它们提供给 `encoder.enableInterrupts()` 是很重要的。这个过程是可伸缩性和简单性之间的折衷。这允许你有多个编码器连接到同一个MCU。你所需要做的就是实例化新的 `Encoder` class并创建新的buffer函数。例如:

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

#### index引脚的配置
为了有效地读取index引脚 ，SimpleFOC library 使你能够使用与通道 `A` 和 `B`相同的方法。首先，你需要提供 `Encoder`类的index引脚编号:

```cpp
Encoder encoder = Encoder(pinA, pinB, cpr, index_pin);
```
如果你正在使用Arduino board，比如Arduino Mega，有超过2个硬件中断，你可以将你的index引脚链接到硬件中断引脚(例如Arduino Mega 引脚`21`)。代码示例如下:

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
函数 `enableInterrupts` 可以处理所有初始化。

如果你使用Arduino UNO来运行这个算法，而你没有足够的硬件中断引脚，你需要使用软件中断库，如[PciManager library](https://github.com/prampec/arduino-pcimanager)。使用带有index的编码器的Arduino UNO代码如下:

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
如果你跑的程序占用了所有的硬件中断引脚，同样可以用上面的程序来配置引脚`A`和`B`。软件中断的效果不亚于硬件中断，，尤其是在你没有其他选择的情况下。每转一圈，`index` 引脚产生一个中断，它不是必要的，所以性能上软件或硬件中断不会改变太多。

为了更好地探索编码器功能与硬件和软件中断方法的差异，请检查编码器示例 `encoder_example.ino` 和 `encoder_software_interrupts_example.ino`.

### 软件中断引脚
如果你无法使用Arduino UNO的pin `2` 和 `3` ，或者想使用多个编码器，你就必须使用软件中断方法。

我建议使用[PciManager library](https://github.com/prampec/arduino-pcimanager).

在代码中使用这个库的步骤与 [hardware interrupt](#arduino-hardware-external-interrupt)非常相似。SimpleFOC  `Encoder` 类提供所有 `A`, `B` 和 `Index` 通道的回调，但Simple FOC library 不会初始化中断。

为了使用 `PCIManager`，你需要将它包含在你的代码中:

```cpp
#include <PciManager.h>
#include <PciListenerImp.h>
```
下一步和前面一样，初始化新 `Encoder` 的实例。

```cpp
Encoder encoder = Encoder(10, 11, 8192);
// A and B interrupt callback buffers
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
然后声明监听器 `PciListenerImp `:
```cpp
// encoder interrupt init
PciListenerImp listenerA(encoder.pinA, doA);
PciListenerImp listenerB(encoder.pinB, doB);
```
最后，在运行 `encoder.init()` 之后，跳过 `encoder.enableInterrupts()` 并调用`PCIManager` library来注册所有编码器通道的中断。

```cpp
// initialize encoder hardware
encoder.init();
// interrupt initialization
PciManager.registerListener(&listenerA);
PciManager.registerListener(&listenerB);
```
就是这样，非常简单。如果你想要多个编码器，你只需初始化新的 `Encoder`实例，创建新的`A` 和 `B` 回调，初始化新的监听器。下面是一个简单的例子:

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
你可以查看 `HMBGC_example.ino` 示例，以查看该代码的实际操作。

#### index引脚的配置
在软件中断的情况下使用index pin是非常简单的。你只需要将它作为附加参数提供给 `Encoder` 的初始化。

```cpp
Encoder encoder = Encoder(pinA, pinB, cpr, index_pin);
```
然后，创建与 `A` 和 `B` 通道相同类型的回调buffer函数，并使用`PCIManager` 初始化和注册 `index`通道的监听器。下面是一个示例:

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
  enc1.init();
  // enable interrupt
  PciManager.registerListener(&listenerA);
  PciManager.registerListener(&listenerB);
  PciManager.registerListener(&listenerIndex);
...
}
```

## 步骤4.实时使用编码器

在这个库中有两种使用编码器的方法:

- 作为电机位置传感器用于FOC算法
- 作为独立位置传感器

### 用于FOC算法的位置传感器

To use the encoder sensor with the foc algorithm implemented in this library, once when you have initialized `encoder.init()` it and enabled interrupts `encoder.enableInterrupts(...)` you just have to link it to the BLDC motor by executing:

要利用这个库通过编码器实现FOC算法，一旦你初始化了 `encoder.init()` 它和启用了中断 `encoder.enableInterrupts(...)` 你只需要通过执行以下命令将它链接到BLDC电机:

```cpp
motor.linkSensor(&encoder);
```

### 独立的传感器

要获得编码器的角度和速度，你可以使用public方法:
```cpp
class Encoder{
 public:
    // shaft velocity getter
    float getVelocity();
	  // shaft angle getter
    float getAngle();
}
```

下面是一个简单的例子:
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
  // display the angle and the angular velocity to the terminal
  Serial.print(encoder.getAngle());
  Serial.print("\t");
  Serial.println(encoder.getVelocity());
}
```



