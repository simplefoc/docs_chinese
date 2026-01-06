---
layout: default
title: Commander 接口
nav_order: 1
permalink: /commander_interface
parent: 内置通信接口
grand_parent: 编写代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: true
has_toc: false
toc: true
---


# 命令器接口

命令器（Commander）是一个简单灵活的接口，用于监控、管理、配置和控制，它采用类G代码的通信协议。该通信基于`ASCII`字符命令ID，这使得在任何微控制器（MCU）上解析都变得简单高效。当接收到命令ID后，与该命令关联的函数会被调用，并接收后续接收到的字符串作为参数。

<img src="extras/Images/cmd_motor.gif" class="img100">
<img src="extras/Images/cmd_motor_get.gif" class="img100">

这种类G代码接口提供回调功能，可配置和调整以下各项：
- [PID控制器](commander_pid)
- [低通滤波器](commander_lpf)
- [标量变量](commander_scalar)
- [运动控制](commander_target) <b><i>新功能</i>📢</b>
  - 同时设置目标值和限制（如角度、速度、扭矩）
  - 更改运动和扭矩控制模式
  - 启用/禁用电机
- [BLDC或步进电机的完全集成配置](commander_motor)
  - PID控制器
  - 低通滤波器
  - 运动控制
  - 监控
  - 限制
  - 启用/禁用
  - 传感器偏移
  - 相电阻
  - ...

此外，命令器使您能够轻松创建自己的命令，并以任何您特定应用所需的方式扩展此接口。
有关如何[创建自定义命令](commander_custom)的文档链接在此。

## 当用户发送命令时会发生什么？
当命令器接收到字符串：

<img src="extras/Images/cmd1.png" class="width20">

它首先检查命令ID，识别出是`M`，然后将剩余字符串发送到电机处理回调函数。接着，电机回调函数检查命令ID，找到`V`，并将剩余字符串发送到速度PID回调函数。然后，速度PID回调函数扫描命令ID，发现是`D`（微分增益），并设置相应的值。

命令器 | 电机回调函数（命令ID `M`） | PID回调函数（命令ID `V`）
--- | ---| ---
<img src="extras/Images/cmd2.png" > | <img src="extras/Images/cmd3.png" > | <img src="extras/Images/cmd4.png" >

另一个例子是命令器接收到：

<img src="extras/Images/cmd5.png" class="width20">

它找到的第一个ID是`O`，例如代表电机。它调用分配给该命令的回调函数（在这种情况下是电机回调函数），并传入剩余的字符串。然后，电机回调函数找到命令`E`，知道这是状态（启用/禁用）命令，可能是获取状态或设置状态。它检查值，发现值为空，这意味着用户发送了一个获取请求。

命令器 | 电机回调函数（命令ID `O`）
--- | ---
<img src="extras/Images/cmd6.png" class="img100"> | <img src="extras/Images/cmd7.png" class="img100">


## 使用命令器接口
命令接口在`Commander`类中实现。
```cpp
// Commander interface constructor
// - serial  - optionally receives HardwareSerial/Stream instance
// - eol     - optionally receives eol character - by default it is the newline: "\n" 
// - echo    - option echo last typed character (for command line feedback) - defualt false
Commander commander = Commander(Serial, "\n", false);
```
行结束（eol）字符是Commander类的可选输入，代表命令结束字符。用户可以在此定义自己的命令结束字符，但默认使用的是换行符\n。例如

<blockquote class="warning"><p class="heading">注意：EOL characters</p>不同的操作系统默认有不同的EOL字符。换行符可能是最常见的，但Linux用户还有回车符'\r'。如果您希望在设置中使用它，请确保将其提供给Commander类的构造函数！</blockquote>

回显标志可用作调试功能，但不建议在实时电机控制和配置中使用！

下一步是将读取您提供的Serial实例的命令器函数添加到 Arduino 的loop()中：
```cpp
void loop(){
  ...
  commander.run(); // reads Serial instance form constructor
}
```

如果您没有向Commander构造函数提供Serial实例，可以将其提供给run()函数。
```cpp
void loop(){
  ...
  commander.run(Serial); // reads Serial instance form run
}
```
或者，如果您希望不使用Serial，而只使用字符串变量，可以向run()函数提供char*变量：
```cpp
char* my_string = "user command";
commander.run(my_string); // reads the string
```

<blockquote class="warning"><p class="heading">串行输出</p><code class="highlighter-rouge">Commander</code>类将始终尝试向构造函数中提供的串行实例输出内容。如果在构造函数中没有接收到，它将使用在<code class="highlighter-rouge">run()</code>函数中提供的实例。如果两者都没有，它将不会输出到任何地方，但用户仍然可以使用它。</blockquote>


### 添加命令
为了向Commander添加给定命令字符的回调函数，您需要调用add()函数，该函数接收命令字符、函数指针和命令标签：
```cpp
// creating the command A in the commander
// - command id - character
// - callback   - function pointer - void callback(char* cmd)
// - label      - label of the command (optional) 
commander.add('A',doSomething,"do something");
```
您可以用作回调的函数类型的唯一真正要求是，它们需要返回void，并且必须接收char*字符串：
```cpp
void doSomething(char* cmd){ ... }
```
通过这个简单的接口，您可以非常轻松地创建自己的命令，并只需一行代码就可以将它们注册到Commander。

除了这个用于添加通用回调的灵活接口外，Commander类还实现了标准化的回调，用于：
- BLDC (`BLDCMotor`) or Stepper (`StepperMotor`) motor  - `commander.motor(&motor, cmd)` - [查看更多](commander_motor)
- PID controller (`PIDController`) - `commander.pid(&pid, cmd)` - [查看更多](commander_pid)
- Low pass filter (`LowPassFilter`) - `commander.lpf(&lpf, cmd)` - [查看更多](commander_lpf)
- Any numeric variable (`float`) - `commander.scalar(&variable, cmd)` - [查看更多](commander_scalar)
- Target setting control (`BLDCMotor` or `StepperMotor`) - `commander.target(&motor, cmd)` - [查看更多](commander_target)
- Full motion control (`BLDCMotor` or `StepperMotor`) - `commander.motion(&motor, cmd)` - [查看更多](commander_target)


例如，如果您对一个motor的完整配置感兴趣，您的代码可能如下所示：
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
或者，您可能希望调整速度 PID，更改电机的目标值，并且希望消除由于不需要的其他功能而产生的不必要的内存开销，那么您的代码可能如下所示：
```cpp
BLDCMotor motor = .....
Commander commander = ....

// defined wrappers for generic callbacks
void onPid(char* cmd){commander.pid(&motor.PID_velocity, cmd);}
void onLpf(char* cmd){commander.lpf(&motor.LPF_velocity, cmd);}
void onTarget(char* cmd){commander.target(&motor, cmd);}

void setup(){
  ...
  commander.add('C',onPid,"PID vel");
  commander.add('L',onLpf,"LPF vel");
  commander.add('T',onTarget,"target vel (+ torque limit)");
  ...
}
void loop(){
  ...
  commander.run();
}
```

这个简单的接口为用户提供了一种简单的方式，在必要时可以同时通信和配置多个电机、PID 控制器、低通滤波器、标量变量和自定义命令。
它也使自定义控制回路的调整变得更加容易，因为您可以很容易地用 PID 控制器PIDController闭合回路，并将其添加到命令器中进行实时调整。

您可以在库示例的examples/utils/communication_test/commander文件夹中找到更多示例。
## 命令器内置命令
在程序中使用Commander时，用户将有三个内置的默认命令可以使用：
- `?` - 列出所有可用命令
- `#` - 获取 / 设置小数位数
  - 示例：
    - 获取小数位数: `#`
    - 设置 5 位小数：`#5`
- `@` - 获取 / 设置详细输出模式
  - 示例：
    - 获取模式： `@`
    - 设置用户友好模式： `@2`
    - 设置无输出模式: `@0`
    - 设置请求时输出模式: `@1`

列表命令`?`将显示所有已添加到Commander的命令及其标签。例如，如果我们添加了如下这些命令：
```cpp
void setup(){
  ...
  commander.add('M',doSomeMotor,"some motor");
  commander.add('P',doSomePID,"some pid");
  commander.add('R',doSomeOtherMotor,"some other motor");
  ...
}
```
以下是在用户友好模式下，列表`?`命令的输出示例：
```sh
$ ?
M: some motor
P: some pid
R: some other motor
``` 

### 配置命令
Commander 类有两个配置参数：
- `verbose` - 串行输出模式
- `decimal_places` - 浮点数的小数位数

可以通过设置`decimal_places`参数轻松更改浮点数的小数位数：
```cpp
commander.decimal_places = 4; // default 3
```

可以通过设置`verbose`参数轻松更改串行输出模式
```cpp
// VerboseMode::nothing           - display nothing - good for monitoring
// VerboseMode::on_request        - display only on user request
// VerboseMode::user_friendly     - display textual messages to the user (default)
// VerboseMode::machine_readable  - display machine readable messages 
commander.verbose = VerboseMode::user_friendly;
```

有四种输出模式：
-  `VerboseMode::nothing` - 此模式不向串行终端输出任何内容 - 当Commander与[监控](monitoring)结合使用时非常有用，例如避免在 Arduino 的串行绘图仪中出现未知值
```shell
$ MLU1.2 # set voltage limit to 1.2V for the motor with the command id 'M'
$        # no response   
```
- `VerboseMode::on_request` - 此模式仅输出获取和设置命令的结果，不会输出任何额外的（人类可读的）文本。
```shell
$ MLU1.2 # set voltage limit to 1.2V for the motor with the command id 'M'
$ 1.2    # set value is 1.2  
```
- `VerboseMode::user_friendly` - 此模式是默认模式，适用于用户使用串行监视器发送命令的情况。除了所有必要的获取和设置值外，此模式还会输出额外的文本，以便人类用户更容易理解。
```shell
$ MLU1.2                  # set voltage limit to 1.2V for the motor with the command id 'M'
$ Limits| volt: 1.2000    # human readable return - value is 1.2  
```
- `VerboseMode::machine_readable` - 此模式用于软件更轻松地解析返回值。此模式本质上与`VerboseMode::on_request`相同，但它会在返回值之前重复命令字符。
```shell
$ MLU1.2 # set voltage limit to 1.2V for the motor with the command id 'M'
$ MLU1.2 # machine readable format, command repeated + set value is 1.2  
```

## 可用命令列表

所有内置命令和子命令都在库源代码的`src/communication/commands.h`文件中定义。
如果您希望更改某个命令的字符 ID，这就是要修改的地方。 😄

通常，我们可以将命令分为：
- [Commander commands](#commander-commands) - 特定于Commander类的命令
- [PID commands](commander_pid)  - 特定于PIDController类的命令
- [Low pass filter commands](commander_pid) - 特定于LowPassFilter类的命令
- [Motor commands](commander_motor) - 特定于FOCMotor类的命令

当向命令器添加scalar变量或运动控制target时，唯一使用的命令字母是提供给commander.add的字母。
- [Scaler variable](commander_scalar) - 添加标量float变量
- [Motion control and target setting](commander_target) - 为FOCMotor类设置目标

命令器提供了一种非常简单的方式来扩展命令列表并实现新命令
- [Custom commands](commander_custom) - 创建自己的回调函数


## 在 Arduino IDE 中使用带有串行监视器的命令器


一旦将命令器接口添加到代码中，您就能够使用 Arduino IDE 的串行监视器与它通信

<img src="extras/Images/commander.png">

串行监视器中的命令器参数与其他任何使用Serial的 Arduino 代码相同。
确保:
- 设置波特率与ino文件中的相同：例如，如果在ino文件中有Serial.begin(115200)，则波特率应设置为115200
- 确保将终止字符设置为newline（换行）

## *Simple**FOC**Studio* 作者[@JorgeMaker](https://github.com/JorgeMaker)

SimpleFOCStudio 是一个很棒的应用程序，由[@JorgeMaker](https://github.com/JorgeMaker)开发，我们将努力使其与我们的库保持同步。这是一个使用命令器接口来调整和配置电机的 python 应用程序。

<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">

有关如何安装和使用此应用程序的更多信息，请访问工作室[文档 <i class="fa fa-external-link"></i>](studio). 

