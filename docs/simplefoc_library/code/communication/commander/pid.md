---
layout: default
title: PID 配置
nav_order: 2
permalink: /commander_pid
parent: Commander 接口
grand_parent: Communication
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

#  使用 Commander 配置 PID
当为 `PIDController` 类使用标准回调时：`commander.pid(&pid,cmd)` ，可用命令：

- **P**: PID 控制器 P 增益
- **I**: PID 控制器 I 增益
- **D**: PID 控制器 D 增益
- **R**: PID 控制器输出梯度
- **L**: PID 控制器输出限制

例如，如果将 PID 控制器添加到 `commander`：

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
能从串行监视器配置（设置和获取）其参数：
```sh
$ CP           # 获取 P 增益
P: 1.0
$ CD0.05       # 设置 D 增益
D: 0.05
$ CO           # 未知命令
err
$ CL3.25       # 设置输出限制
limit: 3.25
```