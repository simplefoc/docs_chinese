---
layout: default
title: Motion control
nav_order: 5
permalink: /commander_target
parent: Commander Interface
grand_parent: Communication
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用 Commander 进行高级运动控制

`Commander`中的运动控制界面可以通过三种方式集成到用户的应用程序中：

- [目标设定界面](#target-setting-in-one-line) - `commander.target(&motor,cmd)`
    - 在一个命令中设置所有限制的目标值
- [运动控制界面](#motion-control-interface) - `commander.motion(&motor,cmd)`
    - 在一个命令中设置所有限制的目标值
    - 改变 [运动控制](motion_control) 模式
    - 改变 [力矩控制](torque_control) 模式
    - 开启/关闭电机模式
- [全配置界面](commander_motor) - `commander.motor(&motor,cmd)` 
    - 以上 + 电机全参数配置...



## 一行设定目标
Commander 界面使用户能够同时设置运动控制的目标值和限制。 然而，不同的运动控制策略具有不同数量的限制（角度、速度、扭矩），因此不同的运动控制模式的命令不同：

如果将这三个接口中的任何一个添加到 `Commander` 中，用户就可以使用此功能。

- `commander.target(&motor,cmd)`
```cpp
...
void onTarget(char* cmd){ commander.target(&motor,cmd); }
void setup(){
  ...
  commander.add('M',onTarget,"target setting");
  ....
}
```

- `commander.motion(&motor,cmd)`
```cpp
...
void onMotion(char* cmd){ commander.motion(&motor,cmd); }
void setup(){
  ...
  commander.add('M',onMotion,"motion control");
  ....
}
```

- `commander.motor(&motor,cmd)`
```cpp
...
void onMotor(char* cmd){ commander.motor(&motor,cmd); }
void setup(){
  ...
  commander.add('M',onMotor,"full motor config");
  ....
}
```

### 力矩控制模式
如果电机在 `Motor Control Type::torque` 下运行，则没有与此模式相关的运动控制限制，用户只能设置目标力矩。

**示例串行终端通信**

```sh
$ ?
M: motion control 运动控制
$ M1   # 电压模式的目标力矩是 1V ， foc_current 或者 dc_current 是 1A 
Target: 1.000
```


### 速度控制模式
如果电机在 `MotionControlType::velocity` 或 `MotionControlType::velocity_openloop` 中运行，用户可以同时设置速度目标和转矩（电流或电压）限制。

但是，限制设置是可选的，用户也只能设置目标速度，commander将遵循之前命令或代码中设置的限制。

**示例串行终端通信**

```sh
$ ?
M: motion control 运动控制
$ M1            # 目标速度是 1rad/s  - 使用之前设置的或在arduino代码中的力矩限制

Target: 1.000
$ M5 2          # 目标速度是 5rad/s 和电压模式 2V 的力矩限制 或者 foc_current 或 dc_current 是 2A 
Target: 2.000
$ M-5           # 目标速度是 -5rad/s  - 使用上一条命令中设置的力矩限制
Target: -5.000
```


### 角度控制模式
如果电机运行 `MotionControlType::angle` 或 `MotionControlType::angle_openloop` ，用户可以同时设置角度目标、速度限制和力矩（电流或电压）限制。

但是，虽然限制设置是可选的，用户也只能设置目标速度，commander将遵循之前命令或代码中设置的限制。

**示例串行终端通信**

```sh
$ ?
M: motion control
$ M1            # 目标角度 1rad/s  - 使用之前设置的或在arduino代码中的力矩和速度限制
Target: 1.000
$ M5 2          # 目标角度是 5rad 和速度限制是 2rad/s - 使用之前设置的或在arduino代码中的力矩限制
Target: 5.000
$ M50 10 2      # 目标角度是 50rad, 速度限制是 10rad/s, 电压模式 2V 的力矩限制 或者  foc_current 或 dc_current 是 2A
Target: 50.000
```
## 运动控制界面
运动控制界面使用户能够通过 `Commander` 控制电机运动的各个方面。 用户可以使用的命令是：

- **C** - 运动控制类型配置
  - **D** - 下采样运动 loop 
  - `0` - 力矩
  - `1` - 速度
  - `2` - 角度    
  - `3` - 速度开环
  - `4` - 角度开环    
- **T** - 力矩运动类型
  - `0` - 电压      
  - `1` - dc_current     
  - `2` - foc_current 
- **E** - 电机状态（启用/禁用）
  - `0` - 启用 
  - `1` - 禁用  
- **else** - 目标设置界面 - [参见运动控制目标](#target-setting-in-one-line) <br> 
    根据运动控制方式而定：
    - 力矩模式 - 力矩目标 (例如 `M2.5`) 
    - 速度（开环和闭环）模式 - 速度目标和力矩限制（例如`M10 2.5` 或`M10` 只更改目标而没有限制）
    - 角度（开环和闭环）模式 - 角度目标、速度限制、力矩限制（例如`M3.5 10 2.5` 或`M3.5` 只更改目标而没有限制）          

所有内置命令和子命令都在库源中定义，在文件 `src/communication/commands.h` 中

### 如何使用？
例如，如果将 BLDC 电机添加到 `commander`：

```cpp
BLDCMotor motor = ....
Commander commander = ...

void onMotion(char* cmd){ commander.motion(&motor,cmd); }
void setup(){
  ...
  commander.add('M',onMotion,"motion control");
  ...
}
void loop(){
  ...
  commander.run();
}
```

能够控制电机的运动：
```sh
$ ?                   # 列出命令
M: motion control
$ MC                  # 获取运动控制模式
Motion:angle
$ MT                  # 获取力矩控制模式
Torque: volt
$ M10                 # 将目标角度设置为 10 rad
Target: 10.000 
$ M-10 40 5           # 将目标角度设置为 -10 rad，速度限制为 40rad/s，力矩（电压）限制为 5V
Target: -10.000 
$ MC1                 # 设置速度控制模式
Motion:vel
$ M10                 # 将目标速度设置为 10 rad/s
Target: 10.000 
$ M-10 3              # 设置目标速度为 10 rad/s 和力矩（电压）限制为 3V
Target: -10.000 
$ M0                  # 将目标速度设置为 0 rad/s
Target: 0.000
$ ME0                 # 禁用电机
Status: 0
$ ME1                 # 启用电机
Status: 1
$ MT2                 # 设置 foc 电流力矩模式
Torque: foc curr
$ MC2                 # 设置角度控制模式
Motion:angle
$ M10 60 0.5          # 将目标角度设置为 10 rad，速度限制为 60rad/s，扭矩（电流）限制为 0.5Amps
Limits| vel: 50.4
$ M0                  # 将目标角度设置为 0 rad
Target: 0.000
$ MC0                 # 设置力矩控制模式
Motion:torque
$ M0.4                # 设定目标力矩 0.4 Amps
```
