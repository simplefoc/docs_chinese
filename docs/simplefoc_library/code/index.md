---
layout: default
title: 代码
nav_order: 3
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /code
has_children: True
has_toc: False
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# 开始上手Simple<span class="foc">FOClibrary</span>

安装好 [SimpleFOClibrary](installation) ，准备好所有必须的 [硬件](supported_hardware) 后, 我们就要开始了解驱动电机的Arduino代码。以下是编写程序时的所有重要步骤。

## 第0步 include库
在开始前，先include库中的头文件：
```cpp
#include <SimpleFOC.h>
```

## 步骤1 <a href="sensors" class="remove_dec">设置位置传感器</a>

编写程序的第一步是初始化和配置位置传感器。
该库支持以下位置传感器：

 - [编码器](encoder): 支持光学、电容式、磁编码器 （ABI方式）
 - [磁性传感器](magnetic_sensor): 支持SPI, I2C, PWM以及Analog （模拟输出）
 - [霍尔传感器](hall_sensors): 3x霍尔探头, 磁性传感器 （UVW 接口）
 - [通用传感器](generic_sensor) **新📢**：简化传感器的实现，用于添加自定义传感器

选择恰当的位置传感器运行以下例程：

<script type="text/javascript">
    function show(id,cls){
        Array.from(document.getElementsByClassName(cls)).forEach(
        function(e){e.style.display = "none";});
        document.getElementById(id).style.display = "block";
        Array.from(document.getElementsByClassName("btn-"+cls)).forEach(
        function(e){e.classList.remove("btn-primary");});
        document.getElementById("btn-"+id).classList.add("btn-primary");
    }
</script>

<a href="javascript:show(0,'sensor');" id="bnt-0 " class="btn btn-sensor btn-primary">编码器</a> 
<a href ="javascript:show(1,'sensor');" id="btn-1" class="btn btn-sensor">磁性传感器</a> 
<a href ="javascript:show(2,'sensor');" id="btn-2" class="btn btn-sensor"> 霍尔传感器</a> 

```c
#include <SimpleFOC.h>

// Encoder(pin_A, pin_B, PPR每圈脉冲数)
Encoder sensor = Encoder(2, 3, 2048);
// 回调通道A和B 
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}

 
void setup() {  
  // 初始化磁传感器硬件
  sensor.init();
  // 启用硬件中断
  sensor.enableInterrupts(doA, doB);

}

void loop() {
  
}
```

Encoders as position sensors are implemented in the class `Encoder` and are defined by its:

位置传感器的编码器在`Encoder`类中实现，并由其定义：

  - `A` 和 `B` 通道的引脚编号： `2` 和 `3`
  - 编码器  `PPR` (每转脉冲数)： `2048`
  - `Index` 引脚数量 *（可选）*

</div>





```cpp
#include <SimpleFOC.h>

// SPI 例程
// MagneticSensorSPI(int cs芯片选择引脚, float bit_resolution传感器分辨率, int angle_register角度读取寄存器)
MagneticSensorSPI sensor = MagneticSensorSPI(10, 14, 0x3FFF);

void setup() {
  // 初始化磁传感器硬件
  sensor.init();
}

void loop() {

}
```

这是连接到引脚  `10` 的基于 14 位 SPI 的磁传感器 <a href="https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D">（例如AS5047u） <i class="fa fa-external-link"></i></a>  的示例初始化。<br>
通信的磁传感器在`MagneticSensorSPI`类中实现，并由其定义

 - `chip_select` 引脚: `10`
 - ht 传感器整体的位分辨率 `12`   `CPR`  可以计算为 `CPR = 2^14bit =16384` 
 - `angle` SPI 寄存器: `0x3FFF`

</div>



```cpp
#include <SimpleFOC.h>

// 霍尔传感器实例
// HallSensor(int hallA, int hallB , int hallC , int pp)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 11);

// 中断程序初始化
// 通道 A and B 回调
void doA(){sensor.handleA();}
void doB(){sensor.handleB();}
void doC(){sensor.handleC();}

void setup() {
  // 初始化传感器硬件
  sensor.init();
  // 硬件中断
  sensor.enableInterrupts(doA, doB, doC);
}

void loop() {

}
```

这是一个霍尔位置传感器连接到 `11` 极对电机的例子。<br>
霍尔传感器实现了 `HallSensors` 类，并由其定义 

 -  引脚 `hallA`, `hallB` 和 `hallC`：`2`, `3` 和 `4`
 - 电机极对数： `11`

</div>


执行 `sensor.init()`，初始化传感器硬件引脚

完整的设置和参数配置文件，请访问<a href="sensors"> 位置传感器 docs <i class="fa fa-external-link"></i></a>。


## 步骤2 <a href="drivers_config" class="remove_dec">设置驱动器</a>
配置好位置传感器后，我们开始初始化和配置驱动器。该库支持由类`BLDCDriver3PWM` 和 `BLDCDriver6PWM`  控制的[无刷直流电机驱动器](bldcdriver)以及由类  `StepperDriver2PWM` 和  `StepperDriver4PWM` 控制的 [步进电机驱动器](stepperdriver) 。

<a href="javascript:show('0d','driver');" id="btn-0d" class="btn-driver btn btn-primary">BLDC Driver - 3PWM</a> 

<a href ="javascript:show('1d','driver');" id="btn-1d" class="btn-driver btn">Stepper Driver 4PWM</a>



类`BLDCDriver3PWM` 的实例化需要以下参数 ：

-  用于 `A`, `B` 和 `C` 相对应的 pwm 引脚
- `enable` 的引脚编号 *（可选）*

例如：
```cpp
#include <SimpleFOC.h>

//  BLDCDriver3PWM( pin_pwmA, pin_pwmB, pin_pwmC, enable使能引脚（可选的）)
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 实例化传感器

void setup() {  

  // 初始化传感器

  // pwm 频率 [Hz]
  driver.pwm_frequency = 20000;
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  // 允许的最大直流电压-默认电压
  driver.voltage_limit = 12;
  // 初始化 driver
  driver.init();

}

void loop() {

}
```

</div>

<div id="1d" class="driver" markdown="1" style="display:none">

`StepperDriver4PWM` 的实例化需要以下参数 ：

- 相位 `1` 的 pwm 引脚号: `1A`, `1B`
- 相位 `2` 的 pwm 引脚号: `2A`, `2B`
- 每个相位的使能引脚 *（可选）*: `EN1` 和 `EN2`

例如：

```cpp
#include <SimpleFOC.h>

// 步进 driver 实例
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9,10, 7, 8);

// 实例化传感器 

void setup() {
  
  // 初始化传感器

  // pwm频率 [Hz]
  driver.pwm_frequency = 20000;
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  // 允许的最大直流电压 - 默认电压
  driver.voltage_limit = 12;
  
  // 初始化 driver
  driver.init();

}

void loop() {

}
```

</div>

完整的设置和参数配置文件，请访问 <a href="drivers_config"> 驱动器 docs <i class="fa fa-external-link"></i></a>。


## 步骤3 <a href="current_sense" class="remove_dec">设置电流检测</a>
配置好位置传感器及驱动器后，如果驱动器支持电流检测的话，就要初始化和配置电流检测。如果不支持的话，可以跳过这一步。 该库支持两种类型的电流检测架构：

- 在线电流检测 `InlineCurrentSense`. 
- 低端电流检测 `LowsideCurrentSense`. 



类`InlineCurrentSense` 的实例化需要以下参数：
- 采样电阻的阻值 `shunt_resistance`
- 放大增益 `gain`
-  A, B （以及可选C）相对应的引脚编号

例如：
```cpp
#include <SimpleFOC.h>

// 实例化驱动器
// 实例化传感器

//  InlineCurrentSense(shunt_resistance, gain, adc_a, adc_b)
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50, A0, A2);


void setup() {  

  // 初始化传感器

  // 初始化驱动器

  // 连接 driver 和电流检测
  current_sense.linkDriver(&driver);        
  // 初始化电流检测
  current_sense.init();

}

void loop() {

}
```

</div>


<div id="1cs" class="cs" markdown="1" style="display:none">


`LowsideCurrentSense` class is instantiated by providing:

- shunt resistor value `shunt_resistance`
- amplifier gain `gain`
- analog pin numbers for phases `A`, `B` (and optionally `C`) 

For example:

```cpp
#include <SimpleFOC.h>

// 实例化 driver
// 实例化传感器

//  LowsideCurrentSense(shunt_resistance, gain, adc_a, adc_b, adc_c)
LowsideCurrentSense current_sense = LowsideCurrentSense(0.01, 50, A0, A1, A2);


void setup() {  

  // 初始化传感器

  // 初始化 driver

  // 连接 driver 和电流检测
  current_sense.linkDriver(&driver);
  // 初始化电流检测
  current_sense.init();

}

void loop() {

}
```

</div>

完整的设置和参数配置文件，请访问<a href="current_sense"> 电流检测 docs <i class="fa fa-external-link"></i></a>。



## 步骤4 <a href="motors_config" class="remove_dec">设置电机</a>
配置好位置传感器及驱动器后，我们开始初始化和配置电机。 该库支持由 `BLDCMotor` 类控制的无刷直流电机以及由 `StepperMotor` 类控制的步进电机。通过电机的 `pole_pairs` 以及可选的电机相电阻和 KV 额定值来实例化这两个类。

<a href="javascript:show('0m','motor');" id="btn-0m" class="btn-motor btn btn-primary">BLDC motor</a> 
<a href ="javascript:show('1m','motor');" id="btn-1m" class="btn-motor btn">Stepper motor</a>

<div id="0m" class="motor" markdown="1" style="display:block">


在这一例程，我们使用了无刷直流电机：
```cpp
#include <SimpleFOC.h>

//  BLDCMotor( pole_pairs , ( phase_resistance, KV_rating  optional) )
BLDCMotor motor = BLDCMotor(11, 9.75);
 
// 实例化驱动器
// 实例化传感器 
// 实例化电流检测   

void setup() {  
  // 初始化传感器
  // 连接电机和传感器
  motor.linkSensor(&sensor);

  // 初始化驱动器
  // 连接电机和驱动器
  motor.linkDriver(&driver);
  // 连接 driver 和电流检测
  
  // 连接电机和电流检测
  motor.linkCurrentSense(&current_sese);

  // 设置控制环类型
  motor.controller = MotionControlType::velocity;
  // 初始化电机
  motor.init();
    
  // 初始化电流检测

}

void loop() {

}
```

</div>

<div id="1m" class="motor" markdown="1" style="display:none">

In this example we will use Stepper motor:

```cpp
#include <SimpleFOC.h>

//  StepperMotor( int pole_pairs , (phase_resistance, KV_rating optional))
StepperMotor motor = StepperMotor(50);
 
// instantiate driver
// instantiate sensor 
// instantiate current sensor   

void setup() {  
  // init sensor
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // init driver
  // link the motor to the driver
  motor.linkDriver(&driver);
  
  // set control loop type to be used
  motor.controller = MotionControlType::velocity;
  // initialize motor
  motor.init();

}

void loop() {

}
```

</div>

在 创建`motor` 实例后，我们需要用`motor.linkSensor()` 连接传感器，用 `motor.linkDriver()`连接驱动器。  <br>下一步是配置电机。在这个配置例子中，我们仅用到了运动控制：

```cpp
// 设置控制环类型
motor.controller = MotionControlType::velocity;
```
最后，我们执行  `motor.init()` 函数，完成电机 `motor` 的设置。

完整的设置和参数配置文件，请访问 <a href="motors_config"> 电机 docs <i class="fa fa-external-link"></i></a>.


## 步骤5 [FOC 例程及实时位置控制](motion_control)
在初始化位置传感器、驱动器和电机之后，在运行FOC算法之前，我们需要校准电机和传感器。这个过程被称为 `motor.initFOC()`. 
在这一步之后，我们将拥有一个能够正常工作的位置传感器以及配置好的电机，我们的FOC算法就可以基于位置传感器的测量设定合适的电压。

在FOC算法的实时运行时，我们需要在Arduino `loop()`中添加函数 `motor.loopFOC()` 和 `motor.move(target)` 。
- `motor.loopFOC()`：FOC 算法执行——应该尽可能快地被执行 ，频率`> 1kHz`。
- `motor.move(target)`： 位置控制例程——取决于`motor.controller` 参数。

下面是其在代码中的呈现：

```cpp
#include <SimpleFOC.h>

// 实例化电机
// 实例化驱动器
// 实例化传感器
// 实例化电流检测

void setup() {  
  
  // 初始化传感器
  // 连接电机和传感器

  // 初始化驱动器
  // 连接电机和驱动器
  // 连接 driver 和电流检测

  // 连接电机和电流检测

  // 配置电机
  // 初始化电机

  // 初始化电流检测    
    
  // 校准编码器，启用FOC
  motor.initFOC();
}

void loop() {
  // FOC算法函数
  motor.loopFOC();

  // 速度控制环函数
  // 设置目标速度或2rad/s
  motor.move(2);
}
```

无刷直流电机完整的设置和参数配置文件，请访问 <a href="bldcmotor"> 无刷直流电机 docs  <i class="fa fa-external-link"></i></a>， 步进电机的完整文件，请访问 <a href="steppermotor"> 步进电机 docs  <i class="fa fa-external-link"></i></a>。


## 步骤6 <a href="monitoring" class="remove_dec"> 监测 </a>

类 `BLDCMotor` 和 `StepperMotor` 提供监测函数。为了实现检测，你需要确保`motor.useMonitoring()` 调用了你想要输出的串口实例 `Serial`。 在  `motor.init()` 和 `motor.initFOC()` 的运行过程中，类 `Serial` 将输出电机初始化状态。 

如果你希望实时输出电机状态变量（这样会影响它的性能——串口输出的速度会很慢！），你可以在 Arduino`loop()`中添加函数`motor.monitor()` 。

```cpp
#include <SimpleFOC.h>

// 实例化电机
// 实例化驱动器
// 实例化传感器

void setup() {  lly in order to configure the control algorithm, set the target values and get the state variables in the user-friendly way (not just dumping as using motor.monitor()) Arduino SimpleFOClibrary provides you wit
  
  // 初始化传感器
  // 连接电机和传感器

  // 初始化驱动器
  // 连接电机和驱动器
  // 连接 driver 和电流检测 

  // 初始化电流检测
  // 连接电机和电流检测

  // 监视无刷直流电机
  Serial.begin(115200);
  // 监视点
  motor.useMonitoring(Serial);
  
  // 配置电机
  // 初始化电机
  // 初始化电流检测
  
  // 校准编码器，启用FOC
}

void loop() {
  
  // 执行FOC
  // 运动控制环

  // 监视函数向串行终端输出电机变量的监控
  motor.monitor();
}
```
完整的设置和参数配置文件，请访问 <a href="monitoring"> 监测 docs</a>。


## 步骤7 <a href="communication" class="remove_dec"> 命令接口</a>

最后，为了配置控制算法，设定目标值，以用户友好的方式获得状态变量（不只是像使用`motor.monitor()`那样的转储）。Arduino <span class="simple">Simple<span class="foc">FOC</span>库</span>  为你提供像通信接口一样的 G 代码，组成类 `Commander` 。



<a href="javascript:show('0c','commander');" id="btn-0c" class="btn-commander btn btn-primary">完整的电机 commander</a> 
<a href ="javascript:show('1c','commander');" id="btn-1c" class="btn-commander btn">仅电机目标值</a>
<a href ="javascript:show('2c','commander');" id="btn-2c" class="btn-commander btn">运动控制目标+Led控制</a>

<div id="0c" class="commander" markdown="1" style="display:block">

以下代码是用户使用接口进行通信的基础实现：

```cpp
#include <SimpleFOC.h>

// 实例化电机
// 实例化传感器

// commander实例化
Commander commander = Commander(Serial);
void doMotor(char* cmd){commander.motor(&motor, cmd);}

void setup() {  
  
  // 初始化传感器
  // 连接电机和传感器

  // 初始化驱动器
  // 连接电机和驱动器
  // 连接 driver 和电流检测

  // 初始化电流检测
  // 连接电机和电流检测
  
  // 启用监视器
  
  // 订阅电机至commands
  commander.add('M',doMotor,"motor");

  // 初始化电机
  
  // 初始化电流检测
    
  // 校准编码器，启用FOC
}

void loop() {
  
  // 执行FOC
  // 运动控制环
  // 电机变量

  // 读取用户命令
  commander.run();
}
```
</div>

<div id="1c" class="commander" markdown="1" style="display:none">

使用 commander 设置电机目标值的基本实现的代码：

```cpp
#include <SimpleFOC.h>

// 实例化电机
// 实例化传感器

//实例化 commander
Commander commander = Commander(Serial);
void doTarget(char* cmd){commander.scalar(&motor.target, cmd);}

void setup() {  
  
  // 初始化传感器
  // 连接电机和传感器

  // 初始化 driver
  // 连接电机和 driver
  // 连接 driver 和电流检测


  // 初始化电流检测
  // 连接电机和电流检测
  
  // 启用监控
  
  // 订阅电机命令
  commander.add('T',doTarget,"target");

  // 初始化电机

  // 初始化电流检测
  
  // 校准编码器，启用FOC
}

void loop() {
  
  // 执行FOC
  // 运动控制环
  // 电机变量

  // 读取用户命令
  commander.run();
}
```

</div>



完整的设置和参数配置文件，请访问 <a href="communication"> 通信 docs</a>。


## 步骤8 [分步使用教程](example_from_scratch)

现在你应该已经熟悉SimpleFOClibrary的代码框架并且能够开始编写自己的应用程序了。为了使这一过程更加简单易懂，我们为你提供了详细的分步使用教程以确保你能够在初次接触这个库时一步一步的顺利进行。

## 🎨 完整的Arduino代码例程

现在你已经学习完Arduino项目的所有部分了，这是一些额外配置的完整代码例程，请浏览这些代码以便更好地将先前介绍的所有部分内容融会贯通。这就是该库的代码例程： `motor_full_control_serial_examples/magnetic_sensor/full_control_serial.ino`。

```cpp
#include <SimpleFOC.h>

// 磁传感器实例 - SPI
MagneticSensorSPI sensor = MagneticSensorSPI(AS5147_SPI, 10);

// 无刷直流电机及驱动器实例
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// commander接口
Commander command = Commander(Serial);
void onMotor(char* cmd){ command.motor(&motor, cmd); }

void setup() {

  // 初始化磁传感器硬件
  sensor.init();
  // 连接电机和传感器
  motor.linkSensor(&sensor);

  // 配置驱动器
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
 // 连接驱动器
  motor.linkDriver(&driver);

  // 设置控制环类型
  motor.controller = MotionControlType::torque;

  // 基于控制环类型配置控制器 
  motor.PID_velocity.P = 0.2;
  motor.PID_velocity.I = 20;
  motor.PID_velocity.D = 0;
  // 默认为电源电压
  motor.voltage_limit = 12;

  // 速度低通滤波时间常数
  motor.LPF_velocity.Tf = 0.01;

  // 角度环控制器
  motor.P_angle.P = 20;
 // 角度环速度限制
  motor.velocity_limit = 50;

  // 使用串口监视电机初始化
  // 监视点
  Serial.begin(115200);
  // 如果不需要，可以注释掉此行
  motor.useMonitoring(Serial);

  // 初始化电机
  motor.init();
  // 校准编码器，启用FOC
  motor.initFOC();

  // 设置初始目标值
  motor.target = 2;

  // 定义电机 id
  command.add('A', onMotor, "motor");

  // 运行用户命令配置电机（完整命令列表见docs.simplefoc.com）
  Serial.println(F("Motor commands sketch | Initial motion control > torque/voltage : target 2V."));
  
  _delay(1000);
}


void loop() {
  // 迭代设置FOC相电压
  motor.loopFOC();

  // 设置外部环目标的迭代函数
  // 速度，位置或电压
  // 如果在参数中未设置目标，则使用电机目标变量
  motor.move();
  
  // 用户通信
  command.run();
}
```

## 开源代码库
对扩展和调整SimpleFOClibrary源代码有兴趣的朋友，可以在 <a href="source_code">SimpleFOClibrary 源代码 docs</a> 中找到完整文档。