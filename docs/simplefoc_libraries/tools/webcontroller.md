---
layout: default
title:  Simple<b>FOC</b>WebController
nav_order: 3
permalink: /webcontroller
parent: 工具
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>工具集</span>
toc: true
---



#  *Simple**FOC**网页控制器*  <small>作者 [@geekuillaume](https://github.com/geekuillaume) </small>

这是一个用于<span class="simple">Simple<span class="foc">FOC</span>库</span>的控制器界面。它使用Web串口（WebSerial）通过串口通信和[命令器（Commander）](commander_interface)接口与合适的微控制器进行通信。

该应用程序的大部分代码由[@geekuillaume](https://github.com/geekuillaume)提供，他的github仓库可在此处找到[链接](https://github.com/geekuillaume/simplefoc-webcontroller)，他的应用程序可在此处访问[链接](https://simplefoc.besson.co/)。我们的应用是他代码的分支，进一步扩展了对更多设备和配置参数的支持，并简化了监控可视化。

<a href ="https://github.com/geekuillaume/simplefoc-webcontroller" class="btn btn"><i class="fa fa-github"></i> Github仓库</a> <a href ="https://webcontroller.simplefoc.com/" class="btn btn-primary"><i class="fa fa-github"></i> 打开 <span class="simple">Simple<span class="foc">FOC</span>网页控制器</span></a>   


<img  src="extras/Images/webcontroller.gif" >

<blockquote class="info">
<p class="heading">📢 早期阶段项目</p>
该项目仍处于早期阶段，我们期待您的耐心，并期待听到您的反馈。由于社区中有许多人比我们更了解这类应用，欢迎提交问题和拉取请求。
</blockquote>

### 功能：
- 与*Simple**FOC**库*2.3+版本即插即用
- 电机的实时调优和配置
- 电机变量的实时绘图和监控
- 支持多电机


## 使用*Simple**FOC**网页控制器*

<a href ="https://webcontroller.simplefoc.com/" class="btn btn-primary"><i class="fa fa-github"></i> 打开 <span class="simple">Simple<span class="foc">FOC</span>网页控制器</span></a>  

*Simple**FOC**网页控制器*不需要任何安装，唯一要求是您的浏览器支持`WebSerial`。在此处查看支持的浏览器[链接](https://caniuse.com/web-serial)。

### 运动控制调优模块
一旦您的应用程序在浏览器中运行，并连接到运行<span class="simple">Simple<span class="foc">FOC</span>库</span>的微控制器。您可以轻松更改不同运动控制环路的大多数控制参数，并可视化不同的监控变量。

<img src="extras/Images/webcontroller_motor.png"  class="width80">

### 集成串口终端

*Simple**FOC**网页控制器*还集成了串口终端，便于调试和监控。

<img  src="extras/Images/webcontroller_init.png" class="width80">


## Arduino代码
基本上，您需要做三件事：
1. 使用命令器接口并将电机添加到命令器
2. 使用监控功能，并在循环中添加`motor.monitor()`
3. 将`motor.monitor_start_char`和`motor.monitor_end_char`设置为与添加到命令器中的电机ID相同的字符

以下是代码示例：

```cpp
#include <SimpleFOC.h>

....

// 包含命令器接口
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup(){
  ....
  // 将电机添加到命令器接口
  // 电机的字母ID（此处为'M'）
  char motor_id = 'M';
  command.add(motor_id,doMotor,"motor");
  // 告诉电机使用监控功能
  motor.useMonitoring(Serial);
  // 配置监控以被网页控制器正确解析
  motor.monitor_start_char = motor_id; // 与命令器中的电机ID相同的字母
  motor.monitor_end_char = motor_id; // 与命令器中的电机ID相同的字母

  command.verbose = VerboseMode::machine_readable; // 可通过网页控制器设置 - 可选
  ...

}
void loop(){
  ....

  ....
  // 实时监控调用
  motor.monitor();
  // 实时命令器调用
  command.run();
}
