---
layout: default
title: LPF 配置
nav_order: 3
permalink: /commander_lpf
parent: Commander 接口
grand_parent: Communication
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

#  使用 Commander 配置低通滤波器
当使用 `LowPassFilter` 类的标准回调时：`commander.lpf(&lpf,cmd)` 用户可用一个命令：

- **F**: 低通滤波器时间常数

例如，如果在 `commander` 中添加了低通滤波器：

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
可以从串行监视器配置（设置和获取）其参数：

```sh
$ AF           # 获取时间常数
Tf: 1.0
$ AF0.05       # 设定时间常数
Tf: 0.05
$ AW           # 未知命令
err
```
