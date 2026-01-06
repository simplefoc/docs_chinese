---
layout: default
title: 库的单位
nav_order: 5
permalink: /library_units
parent: 实用指南
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 库中的单位

所有电机/驱动器/传感器参数和控制变量的定义单位如下：

物理量 | 描述 | 单位 | 备注 
--- | --- | --- | ---
位置/角度 | `弧度` | `RAD` | 电机和传感器位置以弧度为单位
速度 | `弧度每秒` | `RAD/s` | 电机和传感器速度以弧度每秒为单位
扭矩/电流 | `安培` | `A`  | 电机扭矩或电流
电压 | `伏特` | `V` | 电机/驱动器电压
相电阻 | `欧姆` | `Ω` | 电机相电阻
相电感 | `亨利` | `H` | 电机相电感
KV 额定值 | `每分钟每伏特转数` | `rpm/V` | 电机速度常数
PWM 频率 | `赫兹` | `Hz` | 电机/驱动器 PWM 频率
PWM 占空比 | `无单位` | - | 所有占空比范围：`0 - 1.0`


## 位置/角度单位

电机和传感器位置以弧度定义。电机的一整圈等于$$2\pi$$（6.14）弧度，等于360度。

### 一些以弧度（`RAD`）为单位的重要变量

- `motor.shaft_angle` - 电机当前位置（弧度）
- `motor.electrical_angle` - 电机当前电气位置（弧度）
- `motor.target` - 电机目标位置（弧度）（在闭环和开环角度控制中）
- `sensor.getAngle()` - 传感器当前位置（弧度）（在闭环控制中）

### 将角度转换为度

要将角度从弧度转换为度，可使用以下公式：


$$
a_{deg} = a_{rad} \cdot \frac{360}{2\pi}
$$

#### 以度为单位设置目标角度

例如，如果你希望以度为单位设置目标角度：

```cpp
motor.target = my_target_in_degrees * _2PI/360;
```

或者，例如，如果你正在使用[命令器接口](commander)以度为单位设置目标角度：

```cpp
void onTarget(char* cmd){ 
    // get the target angle in degrees
    float target_angle_deg = atof(cmd);
    // set the target angle in radians
    motor.target = target_angle_deg * _2PI/360;
}
...
void setup(){
    ...
    // add the command to the commander
    commander.add('A', onTarget, "angle in degrees");
    ...
}
```

#### 以度为单位读取传感器角度

如果你你想以度为单位读取电机位置，可以轻松使用以下方法进行转换

```cpp
float angle_deg = motor.shaft_angle * 360/_2PI;
```

对于Sensor类的输出，也可以进行同样的操作：
```cpp
float angle_deg = sensor.getAngle() * 360/_2PI;
```

### 将角度转换为转数（圈数）

要将角度从弧度转换为转数（圈数），可使用以下公式：

$$
a_{rot} = a_{rad} \cdot \frac{1}{2\pi}
$$

#### 以转数为单位设置目标角度

例如，如果你希望以转数为单位设置目标角度：

```cpp
motor.target = my_target_in_turns / _2PI;
```

或者，例如，如果你正在使用[命令器接口](commander)以转数为单位设置目标角度：

```cpp
void onTarget(char* cmd){ 
    // get the target angle in turns
    float target_angle_turns = atof(cmd);
    // set the target angle in radians
    motor.target = target_angle_turns / _2PI;
}
... 
void setup(){
    ...
    // add the command to the commander
    commander.add('A', onTarget, "angle in turns");
    ...
}
```

#### 以转数为单位读取传感器角度

如果你想以转数为单位读取电机位置，可以轻松使用以下方法进行转换：

```cpp
float angle_turns = motor.shaft_angle / _2PI;
```

对于Sensor类的输出，也可以进行同样的操作：
```cpp
float angle_turns = sensor.getAngle() / _2PI;
```

## 速度单位

所有与速度相关的参数 / 变量，无论是电机还是传感器，都以弧度每秒定义。电机的一整圈等于
2π
（6.14）弧度，等于 360 度。其他一些标准速度单位是 RPM（每分钟转数）和 1/s（每秒转数）。


### 一些以弧度每秒（RAD/s）为单位的重要变量

- `motor.shaft_velocity` - 电机当前速度（弧度每秒）
- `motor.velocity_limit` - 速度限制（弧度每秒）
- `motor.feedback_velocity` - 电机当前速度（弧度每秒）（在闭环控制中）
- `motor.target` - 电机目标速度（弧度每秒）（在闭环和开环速度控制中）
- `sensor.getVelocity()` - 传感器当前速度（弧度每秒）（在闭环控制中）

### 将速度转换为 RPM

要将速度从弧度每秒转换为 RPM，可使用以下公式：

$$
v_{RPM} = v_{RAD/s} \cdot \frac{60}{2\pi}
$$

<blockquote class="info" markdown="block">
<p class="heading">经验法则</p>

电机以RPM为单位的速度大约是其以弧度每秒 `RAD/s`单位的速度的 10 倍，因为$$\frac{60}{2\pi}\approx 10$$

所以转换可以近似为：

$$v_{RPM} = 10 \cdot v_{RAD/s} $$

</blockquote>

#### 以 RPM 为单位设置目标速度

例如，如果你希望以 RPM 为单位设置目标速度：

```cpp
motor.target = my_target_in_RPM * _2PI/60;
```

或者，例如，如果你正在使用[命令器接口](commander)以 RPM 为单位设置目标速度：

```cpp
void onTarget(char* cmd){ 
    // get the target velocity in RPM
    float target_velocity_RPM = atof(cmd);
    // set the target velocity in radians per second
    motor.target = target_velocity_RPM * _2PI/60;
}
...
void setup(){
    ...
    // add the command to the commander
    commander.add('V', onTarget, "velocity in RPM");
    ...
}
```

#### 以 RPM 为单位读取传感器速度

如果你想以 RPM 为单位读取电机速度，可以轻松使用以下方法进行转换：

```cpp
float velocity_RPM = motor.shaft_velocity * 60/_2PI;
```

对于Sensor类的输出，也可以进行同样的操作：
```cpp
float velocity_RPM = sensor.getVelocity() * 60/_2PI;
```

### 将速度转换为每秒转数

要将速度从弧度每秒转换为每秒转数，可使用以下公式：

$$
v_{tps} = v_{rad/s} \cdot \frac{1}{2\pi}
$$

#### 以每秒转数为单位设置目标速度

例如，如果你希望以每秒转数为单位设置目标速度：

```cpp
motor.target = my_target_in_tps / _2PI;
```

或者，例如，如果你正在使用[命令器接口](commander)以每秒转数为单位设置目标速度：

```cpp
void onTarget(char* cmd){ 
    // get the target velocity in turns per second
    float target_velocity_tps = atof(cmd);
    // set the target velocity in radians per second
    motor.target = target_velocity_tps / _2PI;
}
...
void setup(){
    ...
    // add the command to the commander
    commander.add('V', onTarget, "velocity in turns per second");
    ...
}
```

#### 以每秒转数为单位读取传感器速度

如果你想以每秒转数为单位读取电机速度，可以轻松使用以下方法进行转换：

```cpp
float velocity_tps = motor.shaft_velocity / _2PI;
```

对于Sensor类的输出，也可以进行同样的操作：
```cpp
float velocity_tps = sensor.getVelocity() / _2PI;
```

## 扭矩 / 电流单位

电机扭矩或电流以安培为单位定义。扭矩与流过电机绕组的电流成正比。扭矩常数
K 
t
是描述电机扭矩和电流之间关系的参数。

### 一些以安培 [A] 为单位的重要变量

- `motor.current_limit` - 电机电流限制（安培）
- `motor.target` - 电机目标电流（安培）（在闭环扭矩控制中或在带电流估计的电压控制中）
- `motor.currents.q` - 电机当前 Q 轴电流（安培）
- `motor.currents.q` - 电机当前 D 轴电流（安培）
- `current_sense.getFOCCurrent()` - 电机当前 FOC 电流（安培）
- `current_sense.getDCCurrents()` - 当前测量的电流大小（安培）
- `current_sense.getPhaseCurrents()` -  电机相电流（安培）
- `PhaseCurrent_s` - 存储电机相电流（安培）的结构
- `DQCurrent_s` - 存储 D 轴和 Q 轴电机电流（安培）的结构
- `ABCurrent_s` - 存储 Alpha 和 Beta 电机电流（安培）的结构


### 将电流转换为扭矩

电机扭矩通过扭矩常数
K 
t
与电流直接成正比。扭矩常数在电机数据手册中定义，通常可以近似为与电气（反电动势）常数相同$$K_t \approx K_e$$.

$$
\tau = K_t \cdot I
$$

#### 以Nm为单位设置目标扭矩

例如，如果你希望以 Nm 为单位设置目标扭矩：

```cpp
float Kt = ....; // datasheet value
motor.target = my_target_in_Nm / Kt; // Nm / (Nm/A) = Amps
```

或者，例如，如果你正在使用[命令器接口](commander)以 Nm 为单位设置目标扭矩：

```cpp
void onTarget(char* cmd){ 
    // get the target torque in Nm
    float target_torque_Nm = atof(cmd);
    // set the target current in Amperes
    motor.target = target_torque_Nm / Kt;
}
...
void setup(){
    ...
    // add the command to the commander
    commander.add('T', onTarget, "torque in Nm");
    ...
}
```

#### 以 Nm 为单位读取传感器电流

如果你想以 Nm 为单位读取电机电流，可以轻松使用以下方法进行转换：

```cpp
float current_Nm = motor.currents.q * Kt;
```

或者直接从电流传感器读取：

```cpp
DQCurrent_s c = current_sense.getFOCCurrent();
float current_Nm = c.q * Kt; // torque in Nm
```
