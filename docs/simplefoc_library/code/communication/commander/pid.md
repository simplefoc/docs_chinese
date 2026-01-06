---
layout: default
title: PID 配置
nav_order: 2
permalink: /commander_pid
parent: Commander 接口
grand_parent: 内置通信接口
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用命令器进行 PID 配置
当为 `PIDController` 类使用标准回调函数 `commander.pid(&pid,cmd)` 时，用户将可以使用一系列可能的命令：
- **P**：PID 控制器比例增益
- **I**：PID 控制器积分增益
- **D**：PID 控制器微分增益
- **R**：PID 控制器输出斜坡
- **L**：PID 控制器输出限制

例如，如果你将一个 PID 控制器添加到 `commander` 中：
```cpp
PIDController pid = ....
Commander commander = ...

void onPid(char* cmd){ commander.pid(&pid,cmd); }
void setup(){
  ...
  commander.add('C',onPid,"my pid");
  ...
}
void loop(){
  ...
  commander.run();
}
```
你将能够从串口监视器配置（设置和获取）其参数：
```sh
$ CP           # get P gain
P: 1.0
$ CD0.05       # set D gain
D: 0.05
$ CO           # unknown command
err
$ CL3.25       # set output limit
limit: 3.25
``` 