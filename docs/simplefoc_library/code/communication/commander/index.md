---
layout: default
title: Commander Interface
nav_order: 1
permalink: /commander_interface
parent: Communication
grand_parent: Writing the Code
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Commander 接口

Commander是一个简单而灵活的监控，配置和控制接口，使用类似G代码的通信协议。该通信基于“ASCII”字符命令ID，这使得在任何mcu上解析都简单高效。接收到命令id后，将调用附加到此命令的函数，并提供接收到的命令字符后面的剩余字符串。

<img src="extras/Images/cmd_motor.gif" class="img100">
<img src="extras/Images/cmd_motor_get.gif" class="img100">

此类似于g代码的接口提供回调来配置和调整：
- 无刷直流或步进电机
  - PID控制器
  - 低通滤波器
  - 运动控制
  - 监测
  - 约束
  - 启用/禁用
  - 传感器偏移
  - 相电阻
  - ... 
- PID控制器
- 低通滤波器
- 浮点变量

此外，commander使你能够轻松创建自己的命令，并以特定应用程序可能需要的任何方式扩展此接口。

## 当用户发送命令时会发生什么？
commander收到字符串时：

<img src="extras/Images/cmd1.png" class="width20">

它首先检查命令id，发现是'M'，则将剩余字符串发送给电机处理回调。电机的回调检查命令id是什么，发现是'V'，则将剩余的字符串发送到速度PID回调。然后速度PID回调扫描命令id并发现它是'D'，因此会设置D环数值。

Commander | 马达回调（cmd id`M`） | PID回调（cmd id`V`） 
--- | ---| ---
<img src="extras/Images/cmd2.png" > | <img src="extras/Images/cmd3.png" > | <img src="extras/Images/cmd4.png" >

另一个例子是，如果Commander收到：

<img src="extras/Images/cmd5.png" class="width20">

它找到的第一个id是'O'，比如是motor，则将剩余的字符串传给此命令的回调函数（本例中为电机的回调函数）。然后，电机的回调函数发现是命令“E”，并知道其所指示的状态（已启用/已禁用）为setting还是getting。它检查该值并查看该值是否为空，如果为空则意味着用户发送的是get请求。

Commander | Motor callback (cmd id `O` ) 
--- | ---
<img src="extras/Images/cmd6.png" class="img100"> | <img src="extras/Images/cmd7.png" class="img100"> 


## 使用Commander接口
命令接口在`Commander` 类中实现。

```cpp
// Commander interface constructor
// - serial  - optionally receives HardwareSerial/Stream instance
// - eol     - optionally receives eol character - by default it is the newline: "\n" 
// - echo    - option echo last typed character (for command line feedback) - defualt false
Commander commander = Commander(Serial, "\n", false);
```
行结束符EOL是“Commander”类的可选输入，表示命令字符的结束。用户可以在此处定义自己的命令结束字符，但默认情况下使用的字符是换行符“\n”。比如我

<blockquote class="warning"><p class="heading">注意：EOL行结束符</p> 
不同的操作系统有不同的默认行结束符。而换行符可能是最常见的字符，linux用户也有回车符'\r'。如果你希望用的是换行符作为命令字符的结束，请确保将它传给Commander类的构造函数中。</blockquote>

echo标志位可用作调试功能，但不建议用于实时电机控制和配置！

Next step would be to add the commander function that reads the `Serial` instance that you provided into the Arduino `loop()`:

下一步是添加commander函数，该函数将读取你提供的`Serial`实例到Arduino`loop()`：

```cpp
void loop(){
  ...
  commander.run(); // reads Serial instance form constructor
}
```

如果没有将`Serial`实例传给`Commander`构造函数，则可以将其提供给 `run()` 函数。

```cpp
void loop(){
  ...
  commander.run(Serial); // reads Serial instance form run
}
```
或者，如果你希望使用不带 `Serial` 且仅使用字符串变量的commander，则可以向 `run()`函数提供和 `char*` 变量：

```cpp
char* my_string = "user command";
commander.run(my_string); // reads the string
```

<blockquote class="warning"><p class="heading"> 串行输出</p>
<code class="highlighter-rouge">Commander</code> 类会尝试将输出打印到构造函数中提供的串行实例。如果在构造函数中没串行实例，则会始终在 <code class="highlighter-rouge">run()</code> 函数中的串行实例。如果以上都没有，则不会在任何地方输出，但用户仍然能够使用它。</blockquote>


### 配置
Commander有两个配置参数：
- `verbose`-串行输出模式
- `decimal_places`-浮点数的小数位数

通过设置参数`decimal_places`，可以轻松更改浮点数的小数位数：

```cpp
commander.decimal_places = 4; // default 3
```

通过设置参数`verbose`，可以轻松更改串行输出模式

```cpp
// VerboseMode::nothing        - display nothing - good for monitoring
// VerboseMode::on_request     - display only on user request
// VerboseMode::user_friendly  - display textual messages to the user (default)
commander.verbose = VerboseMode::user_friendly;
```

有三种类型的输出模式：
-  `VerboseMode:：nothing`-此模式不会向串行终端输出任何内容-例如，当`Commander`与 [monitoring](monitoring) 结合使用时，它非常有用，以避免Arduino的串行绘图仪中出现未知值
- `VerboseMode:：on_request`-此模式仅输出get和set命令的结果，不会输出任何其他不必要的（可读的）文本。
- `VerboseMode:：user_friendly`-此模式是默认模式，适用于由用户使用串行监视器发送命令的情况。除了所有必要的get和set值外，该模式还将输出额外的文本，以便于用户理解。

### 添加命令
为了将给定命令字符的回调添加到`Commander`中，你需要调用函数 `add()` ，该函数接收命令字符、函数指针和命令标签：

```cpp
// creating the command A in the commander
// - command id - character
// - callback   - function pointer - void callback(char* cmd)
// - label      - label of the command (optional) 
commander.add('A',doSomething,"do something");
```
对于可以用作回调函数的函数类型，唯一的实际要求是它们需要返回`void`，并且必须接收`char*`字符串：

```cpp
void doSomething(char* cmd){ ... }
```
使用这个简单的接口，你可以非常简单地创建自己的命令，并使用一行代码将它们订阅到`Commander`。

除了此用于添加通用回调的灵活接口之外，`Commander`类还为以下对象实现了标准化回调：

- 无刷直流电动机 (`BLDCMotor`)  - `commander.motor(&motor, cmd)`
- 步进电机 (`StepperMotor`) - `commander.motor(&motor, cmd)`
- PID控制器(`PIDController`) - `commander.pid(&pid, cmd)`
- 低通滤波器 (`LowPassFilter`) - `commander.lpf(&lpf, cmd)`
- 任何数值变量(`float`) - `commander.scalar(&variable, cmd)`

例如，如果你对一个`motor`的完整配置感兴趣，你的代码可能如下所示：

```cpp
BLDCMotor motor = .....
Commander commander = ....

// defined wrapper for generic callback
void onMotor(char* cmd){commander.motor(&motor, cmd);}

void setup(){
  ...
  commander.add('m',onMotor,"my motor");
  ...
}
void loop(){
  ...
  commander.run();
}
```
或者，你可能希望调整速度PID，更改电机的目标值，并希望消除由于你不需要的其他功能而产生的不必要的内存开销，那么你的代码可能如下所示：
大概是这样的：

```cpp
BLDCMotor motor = .....
Commander commander = ....

// defined wrappers for generic callbacks
void onPid(char* cmd){commander.pid(&motor.PID_velocity, cmd);}
void onLpf(char* cmd){commander.lpf(&motor.LPF_velocity, cmd);}
void onTarget(char* cmd){commander.scalar(&motor.tagret, cmd);}

void setup(){
  ...
  commander.add('C',onPid,"PID vel");
  commander.add('L',onLpf,"LPF vel");
  commander.add('T',onTarget,"target vel");
  ...
}
void loop(){
  ...
  commander.run();
}
```



这个接口为用户提供了一种简单的方式，可以同时通信和配置多个电机、PID控制器、低通滤波器、标量变量或者自定义命令。它还使自定义控制回路的调整更加容易，因为你可以非常轻松地使用pid控制器`PIDController`关闭回路，只需将其添加到commander即可实时调整。

你可以在库examples`examples/utils/communication\u test/commander`文件夹中找到更多示例。

## 命令列表

所有内置命令和子命令都在库源文件`src/communication/commands.h`中定义。如果你希望更改某个命令的字符id，则可以在此进行操作。😄

通常，我们可以将命令分为：
- [Commander 命令](#commander-commands) - `Commander` 类的命令
- [PID 命令](#pid-commands)  -  `PIDController`类的命令
- [Low pass filter 命令](#low-pass-filter-commands) - `LowPassFilter`类的命令
- [Motor 命令](#motor-commands) - `FOCMotor` 类的命令

### Commander 命令
在你的程序中使用 `Commander`时，用户可以使用三个内置的默认命令：

- `?` - 列出所有可用的命令
- `#` - 获取/设置小数点位数
  - 示例：
    - 小数点位数 `#`
    - 设置小数点精确到后5位： `#5`
- `@` - 获取/设置`Commander`的输出模式
  - 示例：
    - 获取当前模式： `@`
    - 设置user frinedly模式：`@3`
    - 设置nothing模式：`@0`
    - 设置on request模式： `@1`

list命令`?`会显示所有添加到`Commander`的命令和他的标签。比如如果我们添加了如下命令：

```cpp
void setup(){
  ...
  commander.add('M',doSomeMotor,"some motor");
  commander.add('P',doSomePID,"some pid");
  commander.add('R',doSomeOtherMotor,"some other motor");
  ...
}
```
以下是以 *user-friendly*模式输出 `?` 的示例：

```sh
$ ?
M: some motor
P: some pid
R: some other motor
```

### PID 命令
When using a standard callback for `PIDController` class:`commander.pid(&pid,cmd)` the user will have available set of possible commands:

当对 `PIDController` 类：`commander.pid(&pid,cmd)`使用标准回调时，用户将拥有一组可用的可能命令：

- **P**: PID控制器P增益
- **I**: PID控制器I增益
- **D**: PID控制器D增益
- **R**: PID控制器输出斜率
- **L**:PID控制器输出约束

例如，如果在`commander`中添加了PID控制器：

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
你将能够从串行监视器配置 (set and get) 其参数：

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

### 低通滤波器命令
使用 `LowPassFilter` 类的标准回调时：`commander.lpf（&amp;lpf，cmd）`用户将有一个可用的命令：

- **F**: 低通滤波器时间常数

例如，如果在`commander`中添加了低通滤波器：

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
你将能够从串行监视器配置(set and get)其参数：

```sh
$ AF           # get time constant
Tf: 1.0
$ AF0.05       # set time constant
Tf: 0.05
$ AW           # unknown command
err
```
### 电机指令
当对`BLDCMotor`和`StepperMotor`类使用标准回调时：`commander.motor(&motor,cmd)`用户将拥有一组可用的可能命令：

- **Q** - Q当前PID控制器和低通滤波器（有关命令，请参见[pid](#pid-commands)和[lpf](#low-pass-filter-commands)）
- **D** - D当前PID控制器和低通滤波器（有关命令，请参见[pid](#pid-commands)和 [lpf](#low-pass-filter-commands)）
- **V** - 速度PID控制器和低通滤波器（有关命令，[pid](#pid-commands)和 [lpf](#low-pass-filter-commands)）
- **A** - 角度PID控制器和低通滤波器-（有关命令，请参见[pid](#pid-commands)和 [lpf](#low-pass-filter-commands) ）
- **L** -约束
  -  **C** - 电流
  -  **U** - 电压   
  -  **V** - 速度 
- **C** - 运动控制模式配置
  - **D** - 下采样运动回路
  - `0` - 力矩
  - `1` - 速度 
  - `2` - 角度
  - `3` - 速度开环
  - `4` - 角度开环
- **T** - 力矩控制模式
  - `0` - 电压  
  - `1` - 直流电流
  - `2` - FOC电流
- **E** - 电机状态 (启用/禁用) 
  - `0` - 启用
  - `1` - 禁用
- **R** - 电机相电阻              
- **S** - 传感器偏移
  - **M** - 传感器偏移     
  - **E** - 传感器电气零点    
- **W** - PWM设置
  - **T** - pwm 调制类型   
  - **C** - pwm 波形中心布尔
- **M** - 监控   
  - **D** - 下采样监测
  - **C** - 清除监视器
  - **S** - 设置监控变量 
  - **G** - 获取变量值        
- '' - 目标获取/设置                  

<img src="extras/Images/motor_cmd.png" class="img100">

例如，如果在`commander`中添加了无刷直流电机：

```cpp
BLDCMotor motor = ....
Commander commander = ...

void onMotor(char* cmd){ commander.motor(&motor,cmd); }
void setup(){
  ...
  commander.add('M',onMotor,"my motor");
  ...
}
void loop(){
  ...
  commander.run();
}
```

你将能够从串行监视器配置(set and get)其参数：

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

#### 电机监控命令
Commander接口使用户能够控制 [monitoring](monitoring)功能的输出。两者的结合使用户能够完全控制电机配置和调参，以及完全控制输出给用户的变量。为了使用其功能，用户需要启用对电机的监控，这是非常直接的：

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
最后，一旦电机添加到commander接口，用户将能够使用以下命令配置监控：

- **M** - 监控   
  - **D** - 下采样监测
  - **C** - 清除监视器
  - **S** - 设置监控变量

使用这些命令，你可以更改 `monitor()` 函数的下采样率(`motor.monitor_downsampling`)，该函数将确定输出采样频率。例如，如果 `loop` 时间约为1ms，则监视器功能的下采样率为100，它将每100ms输出一次电机变量。
如果monitor dowsampling设置为0， `monitor()` 函数将被禁用。如果`motor.monitor_variables`位图为空（等于`0`），则情况也是如此。因此，命令**C**有效地执行以下操作：

```cpp
// when command MC is called
motor.monitor_variables = 0;
```
最后，命令**MS**用于获取/设置 `motor.monitor_variables` 位图。

因此，通信可如下所示：
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

<blockquote class="info"><p class="heading">📈 Good practice for visualization</p>
When using monitoring to tune the motion control parameters or just to visualize the different variables it makes sense to disable the commander outputs so that in the serial monitor you only have monitor output. To do that use the mode <code class="highlighter-rouge">VerboseMode::nothing</code> of the commander by sending the command <code class="highlighter-rouge">@0</code>. See all <a href="#commander-commands">commander commands</a>.
</blockquote>


## 使用motor命令的示例代码
这是在代码中使用motor命令进行监控的一个简单示例。有关更多示例，请浏览库示例，尤其是`examples/utils/communication_tes/commander`文件夹。

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

## *Simple**FOC**Studio* by [@JorgeMaker](https://github.com/JorgeMaker)

SimpleFOCStudio是由[@JorgeMaker](https://github.com/JorgeMaker) 构建的一个很棒的应用程序我们会尽量在没有库的情况下保持最新。它是一个python应用程序，使用commander接口来调试和配置电机。

<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">

有关如何安装和使用此应用程序的更多信息，请访问 docs <i class="fa fa-external-link"></i>](studio). 

