---
layout: default
title: 步进方向接口
nav_order: 2
permalink: /step_dir_interface
parent: 内置通信接口
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---


# 步进-方向监听器接口

步进/方向通信是运行步进电机最常用最基本的通信接口之一。它使用的是两个数字信号——`step` 和`direction`。`step`步进信号产生短脉冲，以表示电机将按设定的步长进行步进，`step` 信号确定运动方向（例如,`HIGH`向前，`LOW`向后）。

如上所述，该接口因其运动是以步进为特征的设计而特别使用于步进电机。但同时这个接口也能用于很多与步进电机无关的不同方式中。 通常step/dir接口可以作为一个双向计数器，其中`direction`信号为计数方向，`step`为要计数的脉冲数：

```cpp
// 阶跃信号
if(direction == HIGH) counter++;
else counter--; 
```
最后，只需将当前计数器值乘以步长即可获得你想要的值：
```cpp
received_value = counter*my_step;
```

## 如何使用步进-方向监听器
为了以更简洁的方式执行此操作，<span class="simple">Simple<span class="foc">FOC</span>library</span>基于 `StepDirListener` 实现了基于中断的接口的版本：

```cpp
// StepDirListener(step, dir, counter_to_value)
// - step              - step 引脚编号
// - dir               - dir 引脚编号
// - step_per_rotation - 采用步进计数法进行变量变换（电机角度（弧度））
StepDirListener step_dir = StepDirListener( 2, 5, _2PI/200.0 );
```
一旦定义了`StepDirListener`，则会在`init()`函数中配置引脚。`init()`函数需要添加到`setup()` 函数中。

```cpp
// 初始化 step 和 dir 引脚
step_dir.init();
```
此外，该库用中断的方法来进行实际计数，因此`StepDirListener`提供了只需封装的 `handle()` 函数，例如：

```cpp
// 静态封装函数
void onStep() { step_dir.handle(); }
```
你可以往`enableInterrupt()`函数传入封装函数来启用计数器：

```cpp
// 启用中断 
step_dir.enableInterrupt(onStep);
```

有两种方法来获取接收到的值。既可以通过getValue()`函数来读取：
```cpp
float my_variable = step_dir.getValue();
```
也可以绑定希望`StepDirListener`每次更新计数器时更新的变量。

```cpp
// 用户可以更新部分变量
float my_value;
// 可在每步绑定更新变量（可选）
step_dir.attach(&my_value);
```

<blockquote class="warning"><p class="heading">⚠️ 注意：次优性能</p>
最简单的通信形式（如step/dir）是在硬件和软件中处理，基于中断的实现通常不是最佳解决方案。它将为用户提供良好的测试基础，但很难保证长期的鲁棒性。 to be translate
</blockquote>



## 示例代码
这是一个简单的step-dir监听器的代码。请参阅示例库`examples/utils/communication_test/step_dir`文件夹中的更多示例。

```cpp
/**
 * 关于读取 step/dir 通信的简单实例 
 *  - 本实例使用中断
*/

#include <SimpleFOC.h>

// 角度 
float received_angle = 0;

// StepDirListener( step_pin, dir_pin, counter_to_value)
StepDirListener step_dir = StepDirListener(2, 3, 360.0/200.0); // 接收角度数
void onStep() { step_dir.handle(); }

void setup() {

  Serial.begin(115200);
  
  // 初始化 step 和 dir 引脚
  step_dir.init();
  // 启用中断 
  step_dir.enableInterrupt(onStep);
  // 可在每步附上更新变量（可选）
  // 调用 step_dir.getValue()，可异步处理同样的更新
  step_dir.attach(&received_angle);
    
  Serial.println(F("Step/Dir listenning."));
  _delay(1000);
}

void loop() {
  Serial.print(received_angle);   // 通过 StepDirListener class 自动更新
  Serial.print("\t");
  Serial.println(step_dir.getValue()); // 获取 StepDirListener class
  _delay(500);
}
```
