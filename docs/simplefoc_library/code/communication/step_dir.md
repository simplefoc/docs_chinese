---
layout: default
title: Step-Dir Interface
nav_order: 2
permalink: /step_dir_interface
parent: Communication
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 步进方向接口

步进/方向通信是运行步进电机最常用的通信接口之一。它是非常基本的，它使用两个数字信号，`step` 和`direction`步进信号产生短脉冲，该脉冲表示电机应按预定长度进行步进，`step` 信号确定运动方向（例如,HIGH`向前，`LOW`向后）。

如前所述，该接口特别适用于步进电机，因为其运动设计为以步进为特征。但这个接口可以用在许多不同的方式，与步进电机无关。通常，step/dir接口可描述为计数器，其中`direction`信号确定计数方向，`step`提供要计数的脉冲：

```cpp
// on rising edge of step signal 
if(direction == HIGH) counter++;
else counter--; 
```
最后，要获得你感兴趣的值，只需将当前计数器值乘以阶跃值：
```cpp
received_value = counter*my_step;
```

## 如何使用步进-方向监听器
为了以更简洁的方式执行此操作，<span class="simple">Simple<span class="foc">FOC</span>library</span>基于 `StepDirListener` 实现了此接口的基于中断的版本：

```cpp
// StepDirListener(step, dir, counter_to_value)
// - step              - step pin number
// - dir               - dir pin number
// - step_per_rotation - transformation variable from step count to your variable (ex. motor angle in radians)
StepDirListener step_dir = StepDirListener( 2, 5, _2PI/200.0 );
```
一旦定义了`StepDirListener`，它的硬件管脚将在`init()`函数中配置，该函数需要添加到`setup()` 函数中。

```cpp
// init step and dir pins
step_dir.init();
```
此外，为了进行实际计数，该库使用基于中断的方法，因此`StepDirListener`为你提供了只需封装的 `handle()` 函数，例如：

```cpp
// static wrapper function
void onStep() { step_dir.handle(); }
```
最后，你可以通过向`enableInterrupt()`函数提供封装函数来启用计数器：

```cpp
// enable interrupts 
step_dir.enableInterrupt(onStep);
```

最后，用户有两种方法来获取接收到的值。可以通过调用`getValue()`函数来读取：
```cpp
float my_variable = step_dir.getValue();
```
获取该值的第二种方法是附加希望`StepDirListener`每次更新计数器时更新的变量：
```cpp
// some variable user wants to update 
float my_value;
// attach the variable to be updated on each step (optional) 
step_dir.attach(&my_value);
```

<blockquote class="warning"><p class="heading">⚠️ 注意：次优性能</p>
最简单的通信形式（如step/dir）设计为在硬件和软件中处理，基于中断，这些通信接口的实现通常不是最佳解决方案。它将为用户提供良好的测试基础，但很难保证长期的健壮性。
</blockquote>


## 示例代码
This is a simple code of step-dir listener. See more examples in library examples `examples/utils/communication_test/step_dir` folder.

这是一个简单的step dir listener代码。请参阅示例库`examples/utils/communication_test/step_dir`文件夹中的更多示例。

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
