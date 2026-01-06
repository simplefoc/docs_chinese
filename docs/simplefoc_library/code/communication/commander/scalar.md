---
layout: default
title: 标量变量
nav_order: 1
permalink: /commander_scalar
parent: Commander 接口
grand_parent: 内置通信接口
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用命令器的标量变量


命令器接口具有设置/获取标量变量的内置功能。要将其与所需变量（例如 `variable`）一起使用，请使用回调函数 `commander.scalar(&variable,cmd)`。

例如，如果你向 `commander` 添加了一个变量：
```cpp

Commander commander = ...

// define my variable
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

你将能够从串口监视器配置（设置和获取）它：
```sh
$ ?           # list available commands 
A: my variable
$ A           # get time constant
1.234
$ A0.05       # set time constant
0.05
$ A           # get time constant
0.05
``` 
