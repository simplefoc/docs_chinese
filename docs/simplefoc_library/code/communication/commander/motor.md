---
layout: default
title: 完整电机配置指令
nav_order: 4
permalink: /commander_motor
parent: Commander 接口
grand_parent: 内置通信接口
grand_grand_parent: 编写代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用命令器进行完整电机配置

<img src="extras/Images/motor_cmd.png" class="img150">

当为 `BLDCMotor` 和 `StepperMotor` 类使用标准回调函数 `commander.motor(&motor,cmd)` 时，用户将获得一系列可用命令：

- **Q** - Q 电流 PID 控制器和低通滤波器（有关命令，请参见 [pid](commander_pid) 和 [lpf](commander_lpf)）
  - **P** - 比例增益
  - **I** - 积分增益
  - **D** - 微分增益
  - **L** - 饱和限制
  - **R** - 斜坡参数
  - **F** - 低通滤波时间常数
- **D** - D 电流 PID 控制器和低通滤波器（有关命令，请参见 [pid](commander_pid) 和 [lpf](commander_lpf)）
- **V** - 速度 PID 控制器和低通滤波器（有关命令，请参见 [pid](commander_pid) 和 [lpf](commander_lpf)）
- **A** - 角度 PID 控制器和低通滤波器（有关命令，请参见 [pid](commander_pid) 和 [lpf](commander_lpf)）
- **L** - 限制
  - **C** - 电流
  - **U** - 电压
  - **V** - 速度
- **R** - 电机相电阻
- **I** - 电机相电感
- **K** - 电机 KV 额定值
- **S** - 传感器偏移
  - **M** - 传感器偏移量
  - **E** - 传感器电气零点
- **W** - PWM 设置
  - **T** - PWM 调制类型
  - **C** - PWM 波形居中布尔值
- **M** - 监控控制
  - **D** - 下采样监控
  - **C** - 清除监控
  - **S** - 设置监控变量
  - **G** - 获取变量值
- **C** - 运动控制类型配置 - [参见运动控制](commander_target)
  - **D** - 下采样运动循环
  - `0` - 扭矩
  - `1` - 速度
  - `2` - 角度
  - `3` - 速度开环
  - `4` - 角度开环
- **T** - 扭矩控制类型 - [参见运动控制](commander_target)
  - `0` - 电压
  - `1` - 直流电流
  - `2` - FOC 电流
- **E** - 电机状态（启用/禁用） - [参见运动控制](commander_target)
  - `0` - 启用
  - `1` - 禁用
- **else** - 目标设置接口 - [参见运动控制目标](commander_target)
    取决于运动控制模式：
    - 扭矩模式 - 扭矩目标（例如 `M2.5`）
    - 速度（开环和闭环）模式 - 速度目标和扭矩限制（例如 `M10 2.5` 或 `M10` 仅更改目标而不更改限制）
    - 角度（开环和闭环）模式 - 角度目标、速度限制、扭矩限制（例如 `M3.5 10 2.5` 或 `M3.5` 仅更改目标而不更改限制）

所有内置命令和子命令都在库源代码的 `src/communication/commands.h` 文件中定义。

例如，如果您将 BLDC 电机添加到 `commander`：
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

您将能够从串行监视器配置（设置和获取）其参数：
```sh
$ MVP                 # get PID velocity P gain
PID vel| P: 0.20
$ MVP1.2              # set PID velocity P gain
PID vel| P: 1.20
$ MAI                 # get PID angle I gain
PID angle| I: 0.00 
$ MAF                 # get LPF angle time constant 
LPF angle| Tf: 0.00
$ MLV50.4             # set velocity limit
Limits| vel: 50.4
$ MLC                 # get current limit
Limits| curr: 0.5
$ MT                  # get torque control mode
Torque: volt
$ MT1                 # set torque control mode
Torque: dc curr
$ MT2                 # set torque control mode
Torque: foc curr
$ ME                  # get motor status enabled/disabled
Status: 1
$ MSM                 # get sensor offset
Sensor| offset: 0.0
$ MSM1.2              # set sensor offset
Sensor| offset: 1.2
$ MC                  # get motion control mode
Motion: torque
$ MC3                 # set motion control mode
Motion: vel open
$ MC2                 # set motion control mode
Motion: angle
$ MCD100              # get motion control downsampling
Motion: downsample: 100
$ MMG0                # get variable - target
Monitor | target: 0.0
$ MMG1                # get variable - voltage q
Monitor | Vq: 1.4
$ MMG6                # get variable - angle
Monitor | angle: 23.5 
$ MMG6                # get variable - angle
Monitor | angle: 24.6 
$ MMG6                # get variable - angle
Monitor | angle: 25.5 
$ M0                  # set target
Target: 0.0
$ M0.4                # set target
Target: 0.4
$ @1                  # set verbose mode: on_request
Verb | on! 
$ MMG6                # get variable - angle
26.5
$ MMG5                # get variable - velocity
2.57
$ #6                  # set 6 decimal places
Decimal: 6
$ MMG6                # get variable - angle
27.732821
$ @0                  # set verbose mode: nothing
Verb: off!
$ MMG6                # get variable - angle
$ MMG6                # get variable - angle
$ @2                  # set verbose mode: user_friendly
Verb: on!
$ MMG6                # get variable - angle
Monitor | angle: 25.532131 
```

## 电机监控控制命令
命令器接口使用户能够控制 [监控](monitoring)  功能的输出。两者的结合使用户能够完全控制电机配置和调整，以及完全控制输出给用户的变量。为了使用此功能，用户需要为电机启用监控，这非常简单：
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
最后，一旦电机添加到命令器接口，用户将能够使用以下命令配置监控：
- **M** - 监控控制    
  - **D** - 下采样监控     
  - **C** - 清除监控        
  - **S** - 设置监控变量       

使用这些命令，您可以更改 monitor() 函数的下采样率（motor.monitor_downsampling），这将决定您的输出采样频率。例如，如果您的 loop 时间约为 1ms，那么监控函数的下采样率为 100 时，它将每 100ms 输出一次电机变量。

如果监控下采样设置为 0，则 monitor() 函数被禁用。如果 motor.monitor_variables 位图为空（等于 0），情况也是如此。因此，命令 C 实际上执行：
```cpp
// when command MC is called
motor.monitor_variables = 0;
```
最后，命令 **MS** 用于获取 / 设置 motor.monitor_variables 位图。

因此，通信可能如下所示：
```sh
$ MMD                 # get monitor downsampling rate
Monitor | downsample: 10 
$ MMD1000             # set monitor downsampling rate
Monitor | downsample: 1000 
$ MMS                 # get monitor variables
Monitor | 0000000
$ MMS1000001          # set monitor variables (target and angle)
Monitor | 1000001
1.000 0.999
1.000 0.985
1.000 1.064
.....
1.000 1.040
$ MMS0100000          # set monitor variables (voltage q)
Monitor | 0100000
1.234
-0.345
...
0.772
$ MMC                 # clear monitoring variables
Monitor | clear
$ MMS                 # get monitoring variables
Monitor | 0000000
```

<blockquote class="info"><p class="heading">📈 可视化的良好实践</p>当使用监控来调整运动控制参数或只是为了可视化不同变量时，禁用命令器输出是有意义的，这样在串行监视器中您只得到监控输出。要做到这一点，请通过发送命令 <code class="highlighter-rouge">@0</code> 使用命令器的 <code class="highlighter-rouge">VerboseMode::nothing</code> 模式。参见所有 <a href="commander_interface#commander-commands">命令器命令</a>。</blockquote>


## 使用电机命令的示例代码
这是一个在代码中使用电机命令和监控的简单示例。有关更多示例，请浏览库示例，特别是 examples/utils/communication_tes/commander 文件夹。
```cpp
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}


// commander interface
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link driver
  motor.linkDriver(&driver);

  // set control loop type to be used
  motor.controller = MotionControlType::torque;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsample = 0; // initially disable real-time monitoring

  // initialise motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC();

  // set the inital target value
  motor.target = 2;

  // define the motor id
  command.add('A', onMotor, "motor");

  // Run user commands to configure and the motor (find the full command list in docs.simplefoc.com)
  Serial.println(F("Motor commands sketch | Initial motion control > torque/voltage : target 2V."));
  
  _delay(1000);
}


void loop() {
  // iterative setting FOC phase voltage
  motor.loopFOC();

  // iterative function setting the outter loop target
  motor.move();

  // monitoring
  motor.monitor();
  // user communication
  command.run();
}
```

## *Simple**FOC**Studio* 作者 [@JorgeMaker](https://github.com/JorgeMaker)

SimpleFOCStudio 是一个很棒的应用程序，由[@JorgeMaker](https://github.com/JorgeMaker) 开发，我们将努力使其与我们的库保持更新。这是一个使用命令器接口来调整和配置电机的 python 应用程序。
<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">

有关如何安装和使用此应用程序的更多信息，请访问工作室[文档 <i class="fa fa-external-link"></i>](studio). 

