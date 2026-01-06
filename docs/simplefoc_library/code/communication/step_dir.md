---
layout: default
title: Step-Dir Interface
nav_order: 2
permalink: /step_dir_interface
parent: 内置通信接口
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 步进-方向接口

步进/方向通信是运行步进电机最常见的通信接口之一。它非常基础，使用两个数字信号：`step`（步进）和`direction`（方向）。`step`信号产生一个短脉冲，表示电机应该以预定义的长度执行一步，`direction`信号决定运动方向（例如，`HIGH`为正向，`LOW`为反向）。

如前所述，这种接口特别适合步进电机，因为它们的运动本质上就是以步为单位的。但该接口也可以用于许多与步进电机无关的场景。一般来说，步进/方向接口可以描述为一个计数器，其中`direction`信号决定计数方向，`step`提供要计数的脉冲：
```cpp
// on rising edge of step signal 
if(direction == HIGH) counter++;
else counter--; 
```
 最后，要获得你感兴趣的值，只需将当前计数器值乘以步长值：
```cpp
received_value = counter*my_step;
```

## 如何使用步进 - 方向监听器
为了更简洁地实现这一功能，SimpleFOC库基于`StepDirListener`类实现了一个中断式的接口版本：
```cpp
// StepDirListener(step, dir, counter_to_value)
// - step              - step pin number
// - dir               - dir pin number
// - step_per_rotation - transformation variable from step count to your variable (ex. motor angle in radians)
StepDirListener step_dir = StepDirListener( 2, 5, _2PI/200.0 );
```
定义StepDirListener类后，其硬件引脚会在init()函数中进行配置，该函数需要添加到setup()函数中。

```cpp
// init step and dir pins
step_dir.init();
```
此外，为了实现实际的计数功能，库采用了基于中断的方法，因此StepDirListener提供了handle()函数，你只需对其进行封装，例如：
```cpp
// static wrapper function
void onStep() { step_dir.handle(); }
```
最后，你可以通过将封装函数提供给enableInterrupt()函数来启用计数器：
```cpp
// enable interrupts 
step_dir.enableInterrupt(onStep);
```

最终，用户有两种方式获取接收的值。可以通过调用getValue()函数读取：
```cpp
float my_variable = step_dir.getValue();
```
第二种获取值的方式是，关联你希望StepDirListener在每次更新计数器时同步更新的变量：
```cpp
// some variable user wants to update 
float my_value;
// attach the variable to be updated on each step (optional) 
step_dir.attach(&my_value);
```

<blockquote class="warning"><p class="heading">⚠️ 注意：性能不是最优</p>像步进/方向这样的简单通信方式，设计上更适合用硬件处理，而基于软件中断的实现通常不是最优解决方案。它能为用户提供良好的测试基础，但难以保证长期的稳定性。</blockquote>


## 示例代码 
这是一个简单的步进 - 方向监听器代码。更多示例请查看库的`examples/utils/communication_test/step_dir`文件夹。
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
