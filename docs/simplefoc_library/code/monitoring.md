---
layout: default
title: 监测
nav_order: 7
permalink: /monitoring
parent: 编写代码
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---



# 监控（遥测）功能

`BLDCMotor` 和 `StepperMotor` 类都支持使用 `Serial` 端口的基本遥测功能。

这种遥测（在以下文档中也称为“监控”）将允许你使用诸如 Arduino IDE 串行绘图仪或我们的 [<span class="simple">Simple<span class="foc">FOC</span>Studio</span> 工具](/studio) 等工具可视化电机的关键参数。

<span class="simple">Simple<span class="foc">FOC</span>库</span> 监控是将电机变量以制表符分隔的形式实时输出到串行终端。通过在 `setup` 函数中包含以下行来启用它：

```cpp
motor.useMonitoring(Serial);
```

<blockquote class="info">
注意：你也可以使用其他串行端口，例如 Serial1、Serial2，具体取决于你的 MCU 支持情况。
</blockquote>

<blockquote class="warning" markdown=1>

目前，使用 <code class="highlighter-rouge">motor.useMonitoring</code> 启用监控时，<i>也会</i>启用调试输出 - 详见 [调试](debugging)。

在未来的版本中，调试输出和遥测输出将被分离，并且 <code class="highlighter-rouge">motor.useMonitoring</code> 函数可能会被弃用。

如果不希望有调试输出或调试输出给你带来了问题，你可以这样禁用调试输出（但保留监控）：
</blockquote>

```cpp
motor.useMonitoring(Serial);
SimpleFOCDebug::enable(NULL);
```

## 实时电机变量监控

要实际产生任何输出，你还必须在 loop 函数中添加以下行：
```cpp
motor.monitor()
```

监控函数可以输出 7 种不同的电机特定变量：
- `target` - 当前目标值，特定于所使用的运动控制（可以是电流 [A]、电压 [V]、速度 [rad/s] 或位置 [rad]）
- `voltage.q` - [V] -  q 方向的设定电压
- `voltage.d` - [V] - d 方向的设定电压
- `current.q` - [mA] - q 方向的测量电流（如果有电流检测），如果没有电流检测但提供了相电阻，则为估算电流
- `current.d` - [mA] -  d 方向的测量电流（如果有电流检测）
- `shaft_velocity` - [rad/s] - 电机速度
- `shaft_angle` - [rad] - 电机位置

要设置要监控的首选值，你只需在 setup() 函数中更改 motor.monitoring_variables 参数：
```cpp
motor.monitor_variables = _MON_TARGET | _MON_VEL | _MON_ANGLE; // default _MON_TARGET | _MON_VOLT_Q | _MON_VEL | _MON_ANGLE
```
默认情况下，监控的变量是 target、voltage.q、velocity、angle。该参数是一个 7 位数字的位图，其中每一位表示一个 bool 标志，指示是否应输出该变量（1 表示输出，0 表示不输出）。因此，我们定义了一组有用的监控常量，你可以组合它们以更轻松地处理监控：
```cpp
#define _MON_TARGET 0b1000000 // monitor target value
#define _MON_VOLT_Q 0b0100000 // monitor voltage q value
#define _MON_VOLT_D 0b0010000 // monitor voltage d value
#define _MON_CURR_Q 0b0001000 // monitor current q value - if measured
#define _MON_CURR_D 0b0000100 // monitor current d value - if measured
#define _MON_VEL    0b0000010 // monitor velocity value
#define _MON_ANGLE  0b0000001 // monitor angle value
```

此外，使用 motor.monitor() 函数输出实时执行变量在很多情况下可能会对电机性能产生负面影响，因此尽可能减少该函数的调用次数非常重要，特别是在以较低波特率显示许多变量时。你可以通过设置参数 motor.monitor_downsample 轻松实现：
```cpp
// downsampling
motor.monitor_downsample = 100; // default 10
```

该变量告诉 motor.monitor() 每调用 monitor_downsample 次时将变量输出到串行端口。简而言之，它会在每 monitor_downsample 次循环调用时将变量输出到串行端口。

以下是完整配置代码的示例：
```cpp
...
void setup(){
    ...

    Serial.begin(115200); // the higher the better
    motor.useMonitoring(Serial);
    //display variables
    motor.monitor_variables = _MON_TARGET | _MON_VEL | _MON_ANGLE; 
    // downsampling
    motor.monitor_downsample = 100; // default 10
    
    ...
}
void loop(){
    ....

    motor.monitor();
}

```



实时监控功能旨在用于实时可视化，特别适合 Arduino IDE 的 Serial Plotter

<img class="width60" src="extras/Images/plotter.jpg">

或者在 Serial Terminal 中
```sh
...
voltage,target,velocity
1.17	2.00	2.29
1.23	2.00	1.96
1.30	2.00	1.65
1.28	2.00	1.80
1.20	2.00	2.20
1.07	2.00	2.70
0.91	2.00	3.22
0.69	2.00	3.74
0.40	2.00	4.34
0.18	2.00	4.57
0.09	2.00	4.38
0.06	2.00	4.04
0.08	2.00	3.58
0.11	2.00	3.14
0.18	2.00	2.65
0.27	2.00	2.13
0.37	2.00	1.65
0.47	2.00	1.26
0.55	2.00	0.99
0.64	2.00	0.77
0.71	2.00	0.67
...
```

<blockquote class="warning"><p class="heading"> 执行时间影响</p>此方法旨在与 <code class="highlighter-rouge">loopFOC()</code> 和 <code class="highlighter-rouge">move()</code> 函数一起在主循环函数中调用。因此，<code class="highlighter-rouge">motor.monitor()</code> 会影响执行性能并降低 FOC 算法的采样频率，因此在运行代码时请考虑到这一点。</blockquote>


## 监控输出格式

SimpleFOC库 允许格式化监控输出。它允许你设置起始字符、结束字符、值分隔符以及用于变量监控的小数位数。

```cpp
motor.monitor_start_char = '\0'; //!< monitor starting character
motor.monitor_end_char = '\0'; //!< monitor outputs ending character 
motor.monitor_separator = '\t'; //!< monitor outputs separation character
```
初始参数的设置是为了让 Arduino IDE 的串行绘图仪能够很好地解析变量。但是如果你希望使用其他一些串行绘图仪应用程序，例如[CieNTi/serial_port_plotter](https://github.com/CieNTi/serial_port_plotter)，你可以轻松调整监控格式，以便在其中可视化电机变量

```cpp
motor.monitor_separator= ' ';
motor.monitor_end_char= ';';
motor.monitor_start_char= '$';
```

或者例如对于[nathandunk/BetterSerialPlotter](https://github.com/nathandunk/BetterSerialPlotter)，我们只需要将分隔符值更改为空格字符。
```cpp
motor.monitor_separator= ' ';
```

此外，可以使用 monitor_decimals 变量更改用于显示监控变量的小数位数。默认设置为 4。
```cpp
motor.monitor_decimals = 4; //!< monitor outputs decimal places
``` 
## 自定义串行终端监控

如果你希望实现自己的监控功能，或者只是将电机变量输出到 Serial 终端，以下是 BLDCMotor 和 StepperMotor 类的公共变量，你可以随时访问它们。
```cpp
// current target value
float target;
// current motor angle
float shaft_angle;
// current motor velocity 
float shaft_velocity;
// current target velocity
float shaft_velocity_sp;
// current target angle
float shaft_angle_sp;

// current voltage set to the motor (voltage.q, voltage.d)
DQVoltage_s voltage;
// current (if) measured on the motor (current.q, current.d)
DQCurrent_s current;
// phase voltages 
float Ua, Ub, Uc;

```
你可以通过在变量前添加 motor. 来访问这些变量中的任何一个。例如：
```cpp
Serial.println(motor.shaft_angle);// print current motor position to the serial terminal
// or
Serial.println(motor.Ua); // print phase voltage Ua to the serial terminal
```

如你所见，监控仅在一个方向上工作，并且假设你将自己实现用户通信。

## 使用电机命令进行实时用户通信
  
为了实现用户和电机之间的双向通信，Arduino SimpleFOC库 为你提供了 [电机命令接口](communication)。