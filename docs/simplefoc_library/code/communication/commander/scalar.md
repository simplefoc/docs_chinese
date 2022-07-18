---
layout: default
title: Scalar variable
nav_order: 1
permalink: /commander_scalar
parent: Commander Interface
grand_parent: Communication
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用 Commander 的标量变量

Commander 接口具有用于设置/获取标量变量的内置功能。要将它与所需的变量（例如`variable`）一起使用，请使用回调`commander.scalar(&variable,cmd)`。

例如，将变量添加到 `commander`：
```cpp

Commander commander = ...

// 定义我的变量
float my_variable = 1.234;

void onScalar(char* cmd){ commander.scalar(&my_variable,cmd); }
void setup(){
  ...
  commander.add('A',onScalar,"my variable");
  ...
}
void loop(){
  ...
  commander.run();
}
```

能从串行监视器配置（设置和获取）它：
```sh
$ ?           # 列出可用命令
A: my variable
$ A           # 获取时间常数
1.234
$ A0.05       # 设定时间常数
0.05
$ A           # 获取时间常数
0.05
```
