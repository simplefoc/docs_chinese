---
layout: default
title: LPF 配置
nav_order: 3
permalink: /commander_lpf
parent: Commander 接口
grand_parent: 内置通信接口
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用命令器进行低通滤波器配置
当为 `LowPassFilter` 类使用标准回调函数 `commander.lpf(&lpf,cmd)` 时，用户将获得以下命令：
- **F**：低通滤波器时间常数

例如，如果你已将一个低通滤波器添加到命令器中：
```cpp
LowPassFilter filter = ....
Commander commander = ...

void onLpf(char* cmd){ commander.lpf(&filter,cmd); }
void setup(){
  ...
  commander.add('A',onLpf,"my lpf");
  ...
}
void loop(){
  ...
  commander.run();
}
```
你将能够从串口监视器配置（设置和获取）其参数：
```sh
$ AF           # get time constant
Tf: 1.0
$ AF0.05       # set time constant
Tf: 0.05
$ AW           # unknown command
err
``` 
