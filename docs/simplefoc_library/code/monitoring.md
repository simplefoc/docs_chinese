---
layout: default
title: 监控
nav_order: 7
permalink: /monitoring
parent: 代码
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# 监控功能（遥测）

 `BLDCMotor` 和 `StepperMotor` 都支持使用串口进行基础遥测。

这种遥测（在下文中也称为监控）支持使用Arduino IDE串行绘图仪或[ simple  foc Studio tool](/ Studio)等工具可视化电机的关键参数。

<span class="simple">Simple<span class="foc">FOC</span>library</span>监控是电机变量到串行终端的实时标签分离输出。它通过在 `setup` 函数中添加以下这行启用:

```cpp
motor.useMonitoring(Serial);
```

<blockquote class="info">
注意：你也可以使用其他串口，例如：你MCU也支持的串口1和串口2。
</blockquote>

<blockquote class="warning">
此时，使用 <code class="highlighter-rouge">motor.useMonitoring</code> 启用监控功能会进行调试输出。更多信息，请参阅 [debugging]。

在未来的版本中会分开调试输出和遥测输出，<code class="highlighter-rouge">motor.useMonitoring</code> 函数可能会被弃用。

如果调试输出结果不理想，你可以像以下这样禁用调试输出（但保持监控）：

```cpp
motor.useMonitoring(Serial);
SimpleFOCDebug::enable(NULL);
```

## 电机变量实时监控

通过添加以下这行代码到`loop`函数，你可以获得实时监控输出。

```cpp
motor.monitor()
```

监控功能可输出7种不同的电机具体变量:

- `target` - 当前目标值，具体到所使用的运动控制（电流 [A]、电压 [V]、速度 [rad/s] 或位置 [rad]）
- `voltage.q` - 设置 电压分量q
- `voltage.d` - 设置电压分量d
- `current.q` - 电流分量q的测量值 [mA]（如果电流检测可用）或者预测电流（如果电流检测不可用且给定相电阻）
- `current.d` - 电流分量d的测量值 [mA]（如果电流检测可用）
- `shaft_velocity` - 电机速度 [rad/s] 
- `shaft_angle` - 电机位置  [rad]

设置监视的首选值，可以在`setup()` 函数中更改 `motor.monitoring_variables` 参数。

```cpp
motor.monitor_variables = _MON_TARGET | _MON_VEL | _MON_ANGLE; // 默认 _MON_TARGET | _MON_VOLT_Q | _MON_VEL | _MON_ANGLE
```
默认情况下，监控的变量为 `target`,`voltage.q`,`velocity`,`angle`。该参数是一个7bit值，其中每个位代表 `bool` 标志信号，来表示变量应该输出 (1) 还是不输出 (0)，。因此，我们定义了一组帮助监控常量，可以组合起来更容易地处理监控：

```cpp
#define _MON_TARGET 0b1000000 // 监视器目标值
#define _MON_VOLT_Q 0b0100000 // 监视器电压q值
#define _MON_VOLT_D 0b0010000 // 监视器电压d值
#define _MON_CURR_Q 0b0001000 // 监视器电流q值 - 如有测量
#define _MON_CURR_D 0b0000100 // 监视器电流d值 - 如有测量
#define _MON_VEL    0b0000010 // 监视器速度值
#define _MON_ANGLE  0b0000001 // 监视器角度值
```

此外，使用`motor.monitor()` 函数输出实时执行变量在许多情况下会对电机性能产生负面影响，因此，应该尽可能减少对该函数的调用，特别是在低波特率时输出很多变量。你可以通过参数`motor.monitor_downsample`来设置：

```cpp
// 下采样
motor.monitor_downsample = 100; // 默认为10
```
这个变量告诉 `motor.monitor()` 直到计数到`monitor_downsample`时才将变量输出到串行。也就是说每到一次`monitor_downsample`循环才会输出一次变量。
下面是一个完整的配置代码实例：

```cpp
...
void setup(){
    ...

    Serial.begin(115200); // 越高越好
    motor.useMonitoring(Serial);
    //显示变量
    motor.monitor_variables = _MON_TARGET | _MON_VEL | _MON_ANGLE; 
    // 下采样
    motor.monitor_downsample = 100; // 默认为10
    
    ...
}
void loop(){
    ....

    motor.monitor();
}

```



实时监控功能主要用于实时可视化，特别适用于Arduino IDE的`Serial Plotter`

<img class="width60" src="extras/Images/plotter.jpg">

或者在 `Serial Terminal`
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

<blockquote class="warning"><p class="heading"> 执行时间障碍</p>
这个方法的目的是在主循环函数中顺着<code class="highlighter-rouge">loopFOC()</code>和<code class="highlighter-rouge">move()</code>函数调用。因此，<code class="highlighter-rouge">motor.monitor()</code>将会影响执行性能，降低FOC算法的采样频率，因此在运行代码时要考虑这个因素。  </blockquote>


## 自定义串行终端监控

如果希望实现自己的监控功能或只是将电机变量输出到`Serial`串行终端，这里有`BLDCMotor`和`StepperMotor` 类的公共变量，可以随时访问。

```cpp
// 电流目标值
float target;
// 当前电机角度
float shaft_angle;
// 当前电机速度
float shaft_velocity;
// 当前目标速度
float shaft_velocity_sp;
// 当前目标角度
float shaft_angle_sp;

// 当前设置的电机电压 (voltage.q, voltage.d)
DQVoltage_s voltage;
// 当前电机电流 (current.q, current.d) - 如有测量
DQCurrent_s current;
// 相电压
float Ua, Ub, Uc;

```
在此之前可以通过添加`motor`来访问这些变量中的任何一个。例如：

```cpp
Serial.println(motor.shaft_angle);// 打印当前电机位置至串口终端
// 或者
Serial.println(motor.Ua); // 打印相电压Ua至串口终端
```

监视只能在一个方向上工作，并且假设它实现用户通信。

## 使用电机命令实时用户通信

为了在用户和电机之间进行双向通信， Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>  为你提供了 [电机命令接口](communication)。