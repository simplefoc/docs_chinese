---
layout: default
title: 完整电机配置
nav_order: 4
permalink: /commander_motor
parent: Commander 接口
grand_parent: Communication
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用 Commander 的完整电机配置

<img src="extras/Images/motor_cmd.png" class="img150">

当对 `BLDC Motor` 和 `Stepper Motor` 类使用标准回调时：`commander.motor(& motor,cmd)` 可用命令：

- **Q** - Q 电流 PID 控制器 & LPF (命令参考 [pid](commander_pid) 和 [lpf](commander_lpf) )
  - **P** - 比例增益
  - **I** - 积分增益
  - **D** - 微分增益
  - **L** - 饱和极限
  - **R** - 梯度参数
  - **F** - 低通滤波时间常数
- **D** - D 电流 PID 控制器 & LPF (命令参考 [pid](commander_pid) 和 [lpf](commander_lpf) )
- **V** - 速度 PID 控制器 & LPF  (命令参考 [pid](commander_pid) 和 [lpf](commander_lpf) ) 
- **A** - 角度 PID 控制器 & LPF-  (命令参考 [pid](commander_pid) 和 [lpf](commander_lpf) )
- **L** - 限制    
  -  **C** - 电流  
  -  **U** - 电压   
  -  **V** - 速度  
- **R** - 电机相电阻                
- **K** - 电机KV额定值              
- **S** - 传感器偏移     
  - **M** - 传感器偏移          
  - **E** - 传感器电零位             
- **W** - PWM 设置     
  - **T** - pwm 调制类型         
  - **C** - pwm 波形居中布尔型
- **M** - 监控控制
  - **D** - 下采样监控     
  - **C** - 清除监控器        
  - **S** - 设置监控变量  
  - **G** - 获取变量值        
- **C** - 运动控制类型配置  - [查看运动控制](commander_target)
  - **D** - 下采样运动 loop
  - `0` - 力矩    
  - `1` - 速度 
  - `2` - 角度    
  - `3` - 速度_开环 
  - `4` - 角度_开环    
- **T** - 力矩控制类型 - [查看运动控制](commander_target)
  - `0` - 力矩      
  - `1` - dc_current     
  - `2` - foc_current 
- **E** - 电机状态（启用/禁用） - [查看运动控制](commander_target)
  - `0` - 开启    
  - `1` - 禁用  
- **else** - 目标设置界面 - [查看运动控制目标](commander_target) <br> 
    根据于运动控制模式：
    - 力矩模式 - 力矩目标 (例如 `M2.5`) 
    - 速度（开环和闭环）模式 - 速度目标和力矩限制（例如`M10 2.5` 或`M10` 只更改目标而没有限制）
    - 角度（开环和闭环）模式 - 角度目标、速度限制、力矩限制（例如`M3.5 10 2.5` 或`M3.5` 只更改目标而没有限制）       

所有内置命令和子命令都在库源中定义，在文件 `src/communication/commands.h` 中

例如，如果将 BLDC 电机添加到 `commander`：

```cpp
BLDCMotor motor = ....
Commander commander = ...

void onMotor(char* cmd){ commander.motor(&motor,cmd); }
void setup(){
  ...
  commander.add('M',onMotor,"my motor motion");
  ...
}
void loop(){
  ...
  commander.run();
}
```

能从串行监视器配置（设置和获取）其参数：

```sh
$ MVP                 # 获得 PID 速度 P 增益
PID vel| P: 0.20
$ MVP1.2              # 设置 PID 速度 P 增益
PID vel| P: 1.20
$ MAI                 # 获得 PID 角度 I 增益
PID angle| I: 0.00 
$ MAF                 # 获得 LPF 角度时间常数 
LPF angle| Tf: 0.00
$ MLV50.4             # 设置速度限制
Limits| vel: 50.4
$ MLC                 # 获得电流限制
Limits| curr: 0.5
$ MT                  # 获得力矩控制模式
Torque: volt
$ MT1                 # 设置力矩控制模式
Torque: dc curr
$ MT2                 # 设置力矩控制模式
Torque: foc curr
$ ME                  # 电机状态启用/禁用
Status: 1
$ MSM                 # 获取传感器偏移
Sensor| offset: 0.0
$ MSM1.2              # 设置传感器偏移
Sensor| offset: 1.2
$ MC                  # 获取运动控制模式
Motion: torque
$ MC3                 # 获取运动控制模式
Motion: vel open
$ MC2                 # 获取运动控制模式
Motion: angle
$ MCD100              # 获得运动控制下采样
Motion: downsample: 100
$ MMG0                # 获取变量 - 目标
Monitor | target: 0.0
$ MMG1                # 获取变量 - 电压 q
Monitor | Vq: 1.4
$ MMG6                # 获取变量 - 角度
Monitor | angle: 23.5 
$ MMG6                # 获取变量 - 角度
Monitor | angle: 24.6 
$ MMG6                # 获取变量 - 角度
Monitor | angle: 25.5 
$ M0                  # 设定目标
Target: 0.0
$ M0.4                # 设定目标
Target: 0.4
$ @1                  # 设置详细模式：on_request
Verb | on! 
$ MMG6                # 获取变量 - 角度
26.5
$ MMG5                # 获取变量 - 速度
2.57
$ #6                  # 设置 6 位小数
Decimal: 6
$ MMG6                # 获取变量 - 角度
27.732821
$ @0                  # 设置详细模式：无
Verb: off!
$ MMG6                # 获取变量 - 角度
$ MMG6                # 获取变量 - 角度
$ @2                  # 设置详细模式： user_friendly
Verb: on!
$ MMG6                # 获取变量 - 角度
Monitor | angle: 25.532131 
```

## 电机监控控制命令
Commander 界面使用户能够控制  [监控](monitoring) 功能的输出。两者的结合使用户能够完全控制电机配置和调试，以及完全控制输出给用户的变量。用户需要启用对电机的监控来使用它：

```cpp
BLDCMotor motor = ....
Commander commander = ...

void onMotor(char* cmd){ commander.motor(&motor,cmd); }
void setup(){
  ...
  motor.useMonitoring(Serial);
  commander.add('M',onMotor,"my motor");
  ...
}
void loop(){
  ...
  motor.monitor();
  commander.run();
}
```
最后，将电机添加到 commander 界面，用户就能使用命令配置监控：
- **M** - 监控控制    
  - **D** - 下采样监控     
  - **C** - 清除监控器        
  - **S** - 设置监控变量        

使用这些命令，可以更改决定输出采样频率的 `monitor()` 函数的下采样率 (`motor.monitor_downsampling`)。 例如，如果 `loop` 时间约为 1ms，然后以 100 的速率对监视功能进行下采样，它将每 100ms 输出一次电机变量。

如果监控的下采样设置为 0，则 `monitor()` 功能被禁用。 如果 `motor.monitor_variables` 位图为空（等于 `0`），情况也是如此。 因此命令 **C** 有效地执行：

```cpp
// when command MC is called
motor.monitor_variables = 0;
```
最后， **MS** 命令用于获取/设置 `motor.monitor_variables` 位图。

因此，通信可能长这样：

```sh
$ MMD                 # 获取显示器下采样率
Monitor | downsample: 10 
$ MMD1000             # 设置监视器下采样率
Monitor | downsample: 1000 
$ MMS                 # 获取监控变量
Monitor | 0000000
$ MMS1000001          # 设置监控变量（目标和角度）
Monitor | 1000001
1.000 0.999
1.000 0.985
1.000 1.064
.....
1.000 1.040
$ MMS0100000          # 设置监控变量（电压 q）
Monitor | 0100000
1.234
-0.345
...
0.772
$ MMC                 # 清除监控变量
Monitor | clear
$ MMS                 # 获取监控变量
Monitor | 0000000
```

<blockquote class="info"><p class="heading">📈 可视化的好习惯</p>
当使用监控器来调试运动控制的参数或只是为了可视化不同的变量时，禁用 commander 输出是有意义的，这样在串行监视器中你只有监视器输出。发送命令 <code class="highlighter-rouge">@0</code> 使用 commander 模式 <code class="highlighter-rouge">VerboseMode::nothing</code>。 查看所有 <a href="commander_interface#commander-commands">commander 命令</a>.
</blockquote>

## 使用电机命令的示例代码
这是在代码中使用带有监控的电机命令的一个简单示例。 有关更多示例，请浏览库示例，尤其是 `examples/utils/communication_tes/commander` 文件夹。

```cpp
#include <SimpleFOC.h>

// BLDC 电机和驱动器实例
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 编码器实例
Encoder encoder = Encoder(2, 3, 500);
// 通道 A 和 B 回调
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}


// commander 界面
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // 初始化编码器传感器硬件
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // 将电机连接到传感器
  motor.linkSensor(&encoder);

  // 驱动程序配置
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接driver
  motor.linkDriver(&driver);

  // 设置要使用的控制回路类型
  motor.controller = MotionControlType::torque;

  // 使用串行监控电机初始化
  // 监控端口
  Serial.begin(115200);
  // 如果不需要，请注释掉
  motor.useMonitoring(Serial);
  motor.monitor_downsample = 0; // 最初禁用实时监控

  // 初始化电机
  motor.init();
  // 对齐编码器并启动 FOC
  motor.initFOC();

  // 设置初始目标值
  motor.target = 2;

  // 定义电机 id
  command.add('A', onMotor, "motor");

  // 运行用户命令来配置和电机（在 docs.simplefoc.com 中找到完整的命令列表）
  Serial.println(F("Motor commands sketch | Initial motion control > torque/voltage : target 2V."));
  
  _delay(1000);
}


void loop() {
  // 迭代设置 FOC 相电压
  motor.loopFOC();

  // 设置外循环目标的迭代函数
  motor.move();

  // 监控
  motor.monitor();
  // 用户通信
  command.run();
}
```

## *Simple**FOC**Studio* by [@JorgeMaker](https://github.com/JorgeMaker)

SimpleFOCStudio 是由 [@JorgeMaker](https://github.com/JorgeMaker) 构建的一个很棒的应用程序，我们将尝试在没有库的情况下保持更新。 它是一个 python 应用程序，使用命令接口来调整和配置电机。

<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">

有关如何安装和使用此应用程序的更多信息，请访问 studio [docs <i class="fa fa-external-link"></i>](studio). 

