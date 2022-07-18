---
layout: default
title: Commander 接口
nav_order: 1
permalink: /commander_interface
parent: 内置通信接口
grand_parent: 代码
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
has_children: true
has_toc: false
---

# Commander 接口

Commander是一个简单而灵活的监控，配置和控制接口，使用类似G代码的通信协议。由于是基于“ASCII”字符命令ID，从而在任何mcu上解析都简单高效。接收到命令ID后，将调用绑定到此命令的函数，并接收到命令字符后面的剩余字符串。

<img src="extras/Images/cmd_motor.gif" class="img100">
<img src="extras/Images/cmd_motor_get.gif" class="img100">

此类似于G代码的接口提供回调来配置和调整：

- [PID 控制器](commander_pid)
- [低通滤波器](commander_lpf)
- [标量变量](commander_scalar)
- [运动控制](commander_target) <b><i>新</i>📢</b>
  - 立即设定目标值和限制（例如角速度扭矩）
  - 改变运动和扭矩控制模式
  - 启用/禁用电机

- 无刷直流或步进电机的[全集成配置](commander_motor)
  - PID控制器
  - 低通滤波器
  - 运动控制
  - 监测
  - 约束
  - 启用/禁用
  - 传感器偏移
  - 相电阻
  - ... 

此外，利用commander接口可以轻松创建自己的命令，并以可能需要的任何方式扩展此接口。这里有关于如何制作[自定义命令](commander_custom)的链接 。

## 当用户发送命令时会发生什么？
commander收到字符串时：

<img src="extras/Images/cmd1.png" class="width20">

它首先检查命令ID，发现是'M'，则将剩余字符串发送给电机回调函数处理。电机的回调函数进一步检查命令ID是什么，发现是'V'，则将剩余字符串发送到速度PID回调函数。然后速度PID回调函数扫描命令ID并发现它是'D'，因此会设置D环数值。

Commander | 马达回调（cmd id`M`） | PID回调（cmd id`V`） 
--- | ---| ---
<img src="extras/Images/cmd2.png" > | <img src="extras/Images/cmd3.png" > | <img src="extras/Images/cmd4.png" >

另一个例子是，如果Commander收到：

<img src="extras/Images/cmd5.png" class="width20">

它找到的第一个ID是'O'，比如是motor，则将剩余的字符串发送给此命令的回调函数（本例中为电机的回调函数）。然后，电机的回调函数发现是命令“E”，并获知这个命令是要获取还是设置其所指示的状态（已启用/已禁用）。它检查剩余的字符值是否为空，如果为空则意味着用户发送的是get请求。

Commander | Motor callback (cmd id `O` ) 
--- | ---
<img src="extras/Images/cmd6.png" class="img100"> | <img src="extras/Images/cmd7.png" class="img100"> 


## 使用Commander接口
命令接口在`Commander` 类中实现。

```cpp
// Commander 接口构型
// - serial  - 可选择接收 HardwareSerial 或 Stream 实例
// - eol     - 可选择接收 eol 字符 - 默认另起一行： "\n" 
// - echo    - 可选的 echo 行结束符（命令行反馈）  - 默认 false
Commander commander = Commander(Serial, "\n", false);
```
行结束符EOL是`Commander`类的可选输入，表示命令字符的结束。用户可以在此处定义自己的命令结束字符，但默认情况下使用的字符是换行符`\n`。比如

<blockquote class="warning"><p class="heading">注意：EOL行结束符</p> 
不同的操作系统有不同的默认行结束符。而换行符可能是最常见的字符，linux用户也有回车符'\r'。如果你希望用的是换行符作为命令字符的结束，请确保将它传给Commander类的构造函数中。</blockquote>

echo标志位可用作调试功能，但不建议用于实时电机控制和配置！



下一步是添加commander函数，该函数将读取所绑定的`Serial`实例到Arduino`loop()`：

```cpp
void loop(){
  ...
  commander.run(); // 从 constructor 读取 Serial 实例
}
```

如果没有将`Serial`实例传给`Commander`构造函数，则可以将其绑定给 `run()` 函数。

```cpp
void loop(){
  ...
  commander.run(Serial); // 从 run 读取 Serial 实例
}
```
或者，如果你希望使用不带 `Serial` 且仅使用字符串变量的commander，则可以向 `run()`函数提供和 `char*` 变量：

```cpp
char* my_string = "user command";
commander.run(my_string); // 读取字符串
```

<blockquote class="warning"><p class="heading"> 串口输出</p>
<code class="highlighter-rouge">Commander</code> 类会尝试将输出打印到构造函数中提供的串口实例。如果在构造函数中没串口实例，则会始终在 <code class="highlighter-rouge">run()</code> 函数中的串口实例。如果以上都没有，则不会在任何地方输出，但用户仍然能够使用它。</blockquote>



### 配置
Commander有两个配置参数：
- `verbose`-串口输出模式
- `decimal_places`-浮点数的小数位数

通过设置参数`decimal_places`，可以轻松更改浮点数的小数位数：

```cpp
commander.decimal_places = 4; // 默认为3位小数
```

通过设置参数`verbose`，可以轻松更改串口输出模式

```cpp
// VerboseMode::nothing        - 不显示任何信息 - 适用于与监视器结合使用时
// VerboseMode::on_request     - 仅显示用户请求的信息
// VerboseMode::user_friendly  - 向用户显示文本信息（默认）
commander.verbose = VerboseMode::user_friendly;
```

有三种类型的输出模式：
-  `VerboseMode:：nothing`-此模式不会向串口终端输出任何内容-例如，当`Commander`与 [monitoring](monitoring) 结合使用时，它就有效避免Arduino的串口绘图仪中出现未知值
- `VerboseMode:：on_request`-此模式仅输出get和set命令的结果，不会输出任何其他不必要的（可读的）文本。
- `VerboseMode:：user_friendly`-此模式是默认模式，适用于由用户使用串口监视器发送命令的情况。除了所有必要的get和set值外，该模式还将输出额外的文本，以便于用户理解。

### 添加命令
你可以用`add()`来添加给定的命令字符的回调函数，该函数接收命令字符、函数指针和命令标签：

```cpp
// 在 commander 中创建 command A 
// - command id - 字符串
// - 回调   - 函数指针 - 返回 void (char* cmd)
// - 标签      - 命令标签 （可选）
commander.add('A',doSomething,"do something");
```
对于可以用作回调函数的函数类型，唯一的实际要求是它们需要返回`void`，并且必须接收`char*`字符串：

```cpp
void doSomething(char* cmd){ ... }
```
使用这个简单的接口，你可以非常简单地创建自己的命令，并使用一行代码将它们订阅到`Commander`。

除了此用于添加通用回调的灵活接口之外，`Commander`类还为以下对象实现了标准化回调：

- 无刷直流电动机 (`BLDCMotor`) 或者 步进电机  (`StepperMotor`)  - `commander.motor(&motor, cmd)`- [查看更多](commander_motor)
- PID控制器(`PIDController`) - `commander.pid(&pid, cmd)`- [查看更多](commander_pid)
- 低通滤波器 (`LowPassFilter`) - `commander.lpf(&lpf, cmd)`- [查看更多](commander_lpf)
- 任何数值变量(`float`) - `commander.scalar(&variable, cmd)`- [查看更多](commander_scalar)
- 目标设定控制 (`BLDCMotor` or `StepperMotor`) - `commander.target(&motor, cmd)` - [查看更多](commander_target)
- 全运动控制 (`BLDCMotor` or `StepperMotor`) - `commander.motion(&motor, cmd)` - [查看更多](commander_target)

例如，如果你想完整配置一个`motor`，你的代码可能如下所示：

```cpp
BLDCMotor motor = .....
Commander commander = ....

// 定义封装通用回调
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
如果希望调整速度PID，更改电机的目标值，同时希望消除由于不需要的其他功能而产生的不必要的内存开销，那么你的代码可能如下所示：

```cpp
BLDCMotor motor = .....
Commander commander = ....

// 定义封装通用回调
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



这个接口为用户提供了一种简单的方式，可以同时通信和配置多个电机、PID控制器、低通滤波器、标量变量或者自定义命令。它还能使自定义控制回路的调整更加容易，因为你可以非常轻松地使用pid控制器`PIDController`关闭回路，只需将其添加到commander即可实时调整。

你可以在库examples`examples/utils/communication\u test/commander`文件夹中找到更多示例。

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

### 可用命令列表
所有内置命令和子命令都在库源代码中定义，位于文件 `src/communication/commands.h` 中。

如果您想更改某个命令的字符 id 就按这里操作。 😄

一般来说，我们可以将命令分为：

- [Commander 命令](#commander-commands) - 特定于 `Commander` 类的命令
- [PID 命令](commands_pid)  - 特定于 `PIDController` 类的命令
- [Low pass filter 命令](command_lpf) - 特定于 `LowPassFilter` 类的命令
- [Motor 命令](command_motor) - 特定于 `FOCMotor` 类的命令

将 `scalar` 变量添加到 command 或运动控制 `target` 时，唯一使用的命令字母是提供给 `commander.add` 的那个。

- [标量变量](commander_scalar) - 增加标量 `float` 变量
- [运动控制和目标设定](commander_target) - 为 `FOCMotor` 类设置目标

Commander 提供了一种非常简单的方法来扩展命令列表并实现新的命令列表

- [自定义命令](commander_custom) - 创建自己的回调

##  Arduino IDE 中带串行监视器的命令


将命令接口添加到代码后，您将能够使用 Arduino IDE 的串行监视器与其通信

<img src="C:\QMQ\6GitHub\sfoc-\旧英（用新英文覆盖-对比）\code\communication\commander\extras\Images\commander.png">

串行监视器中的命令参数与使用 `Serial` 的所有其他 Arduino 代码相同。

确保：

- 将波特率设置为与 `ino` 文件中相同的值：例如，如果在 `ino` 文件中有 `Serial.begin(115200)`，则波特率应为 `115200` 
- 确保将终止字符设置为  `newline`

## *Simple**FOC**Studio* by [@JorgeMaker](https://github.com/JorgeMaker)

SimpleFOCStudio是由[@JorgeMaker](https://github.com/JorgeMaker) 构建的一个很棒的应用程序我们会尽量在没有库的情况下保持最新。它是一个python应用程序，使用commander接口来调试和配置电机。

<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">

有关如何安装和使用此应用程序的更多信息，请访问 docs <i class="fa fa-external-link"></i>](studio). 

