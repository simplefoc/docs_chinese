---
layout: default
title: 运动控制
nav_order: 5
permalink: /commander_target
parent: Commander 接口
grand_parent: 内置通信接口
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用命令器进行高级运动控制

`Commander` 中的运动控制接口可以通过三种方式集成到用户的应用程序中：
- [目标设置接口](#一行代码设置目标) - `commander.target(&motor,cmd)`
    - 在一个命令中设置目标值以及所有限制
- [运动控制接口](#运动控制接口) - `commander.motion(&motor,cmd)`
    - 在一个命令中设置目标值以及所有限制
    - 更改[运动控制](motion_control)模式
    - 更改[扭矩控制](torque_control)模式
    - 启用/禁用电机模式
- [完整配置接口](commander_motor) - `commander.motor(&motor,cmd)` 
    - 包含上述所有功能 + 电机的完整参数配置...



## 一行代码设置目标
命令器接口允许用户一次设置运动控制的目标值以及限制。然而，不同的运动控制策略有不同数量的限制（角度、速度、扭矩），因此根据所使用的运动控制模式，命令的行为会有所变化：

如果将三个接口中的任何一个添加到 `Commander` 中，用户就可以使用此功能。

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

### 扭矩控制模式
如果电机在 MotionControlType::torque 模式下运行，此模式没有相关的运动控制限制，用户只能设置目标扭矩。


**串行终端通信示例**
```sh
$ ?
M: motion control
$ M1   # target torque1V for voltage mode or 1A for foc_current or dc_current
Target: 1.000
```


### 速度控制模式
如果电机在 MotionControlType::velocity 或 MotionControlType::velocity_openloop 模式下运行，用户可以同时设置速度目标和扭矩（电流或电压）限制。

不过，限制设置是可选的，用户也可以只设置目标速度，命令器会遵循之前命令或代码中设置的限制。

**串行终端通信示例**

```sh
$ ?
M: motion control
$ M1            # target velocity 1rad/s  - using torque limit set earlier or in arduino code
Target: 1.000
$ M5 2          # target velocity 5rad/s and torque limit of 2V in voltage mode or 2A for foc_current or dc_current
Target: 2.000
$ M-5           # target velocity -5rad/s  - using torque limit set in the last command
Target: -5.000
```


### 角度控制模式
如果电机在 MotionControlType::angle 或 MotionControlType::angle_openloop 模式下运行，用户可以同时设置角度目标、速度限制和扭矩（电流或电压）限制。

不过，限制设置是可选的，用户也可以只设置目标速度，命令器会遵循之前命令或代码中设置的限制。
**串行终端通信示例**
```sh
$ ?
M: motion control
$ M1            # target angle 1rad/s  - using torque and velocity limits set earlier or in arduino code
Target: 1.000
$ M5 2          # target angle 5rad and velocity limit 2rad/s - using torque limit set earlier or in arduino code
Target: 5.000
$ M50 10 2      # target angle 50rad, velocity limit 10rad/s, torque limit of 2V in voltage mode or 2A for foc_current or dc_current
Target: 50.000
```
## 运动控制接口
运动控制接口允许用户通过 Commander 控制电机运动的各个方面。用户可以使用的命令如下：

- **C** - 运动控制类型配置
  - **D** - 下采样运动循环
  - `0` - 扭矩    
  - `1` - 速度 
  - `2` - 角度    
  - `3` - 速度开环 
  - `4` - 角度开环    
- **T** - 扭矩控制类型
  - `0` - 电压      
  - `1` - 直流电流     
  - `2` - 磁场定向控制电流 
- **E** - 电机状态（启用 / 禁用）
  - `0` - 启动    
  - `1` - 禁用  
- **else** - 目标设置接口 - [参见运动控制目标](#target-setting-in-one-line) <br> 
    取决于运动控制模式:
    - 扭矩模式 - 扭矩目标（例如 M2.5）
    - 速度（开环和闭环）模式 - 速度目标和扭矩限制（例如M10 2.5 或 M10 仅更改目标而不改变限制）
    - 角度（开环和闭环）模式 - 角度目标、速度限制、扭矩限制（例如M3.5 10 2.5 或 M3.5 仅更改目标而不改变限制）     

所有内置命令和子命令都在库源代码的 src/communication/commands.h 文件中定义。


### 如何使用？
例如，如果您将一个无刷直流电机添加到 commander 中：
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

您将能够控制电机的运动：
```sh
$ ?                   # list commands
M: motion control
$ MC                  # get motion control mode
Motion:angle
$ MT                  # get torque control mode
Torque: volt
$ M10                 # set target angle of 10 rad
Target: 10.000 
$ M-10 40 5           # set target angle of -10 rad, velocity limit at 40rad/s and torque(voltage) limit at 5V
Target: -10.000 
$ MC1                 # set velocity control mode
Motion:vel
$ M10                 # set target velocity of 10 rad/s
Target: 10.000 
$ M-10 3              # set target velocity of 10 rad/s and torque(voltage) limit of 3V
Target: -10.000 
$ M0                  # set target velocity of 0 rad/s
Target: 0.000
$ ME0                 # disable motor
Status: 0
$ ME1                 # enable motor
Status: 1
$ MT2                 # set foc current torque mode
Torque: foc curr
$ MC2                 # set angle control mode
Motion:angle
$ M10 60 0.5          # set target angle of 10 rad, velocity limit at 60rad/s and torque(current) limit at 0.5Amps
Limits| vel: 50.4
$ M0                  # set target angle of 0 rad
Target: 0.000
$ MC0                 # set torque control mode
Motion:torque
$ M0.4                # set target torque 0.4 Amps
```
