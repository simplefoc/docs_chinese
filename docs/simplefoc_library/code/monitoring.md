---
layout: default
title: Monitoring
nav_order: 7
permalink: /monitoring
parent: Writing the Code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# 监控功能

 `BLDCMotor` 和 `StepperMotor` 类支持使用 `Serial` 进行监控，这是通过：

```cpp
motor.useMonitoring(Serial);
```

监控有两个主要目标：
- [在初始化和校准过程中显示电机的状态](#monitoring-the-motor-init) 
- [实时监控电机的变量](#real-time-motor-variables-monitoring)

## 监控电机初始化
电机在初始化`motor.init()` 和校准过程 `motor.initFOC()`期间，电机将向串口输出其状态。启用此功能不会直接影响实时性能，因为在 `motor.loopFOC()` 和`motor.move()`函数中没有预定义的实时循环监控。

这是一个输出正常的电机初始化监控实例：

```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: sensor direction==CW
MOT: PP check: OK!
MOT: Zero elec. angle: 4.28
MOT: Align current sense.
MOT: Success: 2
MOT: Ready.
```

位置传感器导致电机初始化失败：
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: Failed to notice movement
MOT: Init FOC failed.
```

以及电流传感导致的电机初始化失败：
```sh
MOT: Monitor enabled!
MOT: Init
MOT: Enable driver.
MOT: Align sensor.
MOT: sensor direction==CW
MOT: PP check: OK!
MOT: Zero elec. angle: 4.28
MOT: Align current sense.
MOT: Fail!
MOT: Init FOC failed.
```

## 电机变量实时监控

监控的第二个作用是实时标签分离输出电机变量到串行终端。它是启用的，包括这行循环函数：
```cpp
motor.monitor()
```

监控功能可输出7种不同的电机具体变量:：
- `target` - 当前目标值，具体到所使用的运动控制（电流、电压、速度或位置）
- `voltage.q` - 设置 q 方向电压
- `voltage.d` - 设置 d 方向电压
- `current.q` - q 方向电流测量（如果电流传感可用）
- `current.d` - d 方向电流测量（如果电流传感可用）
- `shaft_velocity` - 电机速度
- `shaft_angle` - 电机位置

设置监视的首选值，可以在`setup()` 函数中更改 `motor.monitoring_variables` 参数。

```cpp
motor.monitor_variables = _MON_TARGET | _MON_VEL | _MON_ANGLE; // default _MON_TARGET | _MON_VOLT_Q | _MON_VEL | _MON_ANGLE
```
默认情况下，监控的变量为 `target`,`voltage.q`,`velocity`,`angle`。该参数是一个带有7位数字的位图，变量应该输出 (1) 而不是 (0)，则每个位代表 `bool` 标志信号。因此，我们定义了一组帮助监控常量，可以组合起来更容易地处理监控：

```cpp
#define _MON_TARGET 0b1000000 // monitor target value
#define _MON_VOLT_Q 0b0100000 // monitor voltage q value
#define _MON_VOLT_D 0b0010000 // monitor voltage d value
#define _MON_CURR_Q 0b0001000 // monitor current q value - if measured
#define _MON_CURR_D 0b0000100 // monitor current d value - if measured
#define _MON_VEL    0b0000010 // monitor velocity value
#define _MON_ANGLE  0b0000001 // monitor angle value
```

此外，使用`motor.monitor()` 函数输出实时执行变量在许多情况下会对电机性能产生负面影响，因此，应该尽可能减少对该函数的调用，特别是在显示许多波特率较低的变量时。你可以通过设置参数`motor.monitor_downsample`做到这一点：

```cpp
// downsampling
motor.monitor_downsample = 100; // default 10
```
每个`monitor_downsample` 调用时，这个变量告诉 `motor.monitor()` 将变量输出到串行。它将把变量输出到每个`monitor_downsample`循环调用的串行中。
下面是一个完整的配置代码实例：

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
这个方法的目的是沿着<code class="highlighter-rouge">loopFOC()</code>和<code class="highlighter-rouge">move()</code>函数在主循环函数中调用。因此，<code class="highlighter-rouge">motor.monitor()</code>将会影响执行性能，降低FOC算法的采样频率，因此在运行代码时要考虑到它。  </blockquote>

## 自定义串行终端监控

如果希望实现自己的监控功能或只是将电机变量输出到`Serial`串行终端，这里有`BLDCMotor`和`StepperMotor` 类的公共变量，可以随时访问它们。

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
在此之前可以通过添加`motor`来访问这些变量中的任何一个。例如：

```cpp
Serial.println(motor.shaft_angle);// print current motor position to the serial terminal
// or
Serial.println(motor.Ua); // print phase voltage Ua to the serial terminal
```

监视只能在一个方向上工作，并且假设它实现用户通信。

## 使用电机命令实时用户通信

为了在用户和电机之间进行双向通信， Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>  为你提供了 [电机命令接口](communication)。