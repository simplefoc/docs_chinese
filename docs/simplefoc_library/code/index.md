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

选择恰当的位置传感器运行以下例程：

<a href ="javascript:showMagnetic();" id="mag" class="btn btn-primary">磁性传感器</a> <a href="javascript:showEncoder();" id="enc" class="btn">编码器</a> 

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

```c++
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

<div id="enc_p" class="hide_p">
例程中以编码器作为位置传感器在类 <code class="highlighter-rouge">Encoder</code> 中的实现与定义如下：
  <ul>
    <li> <code class="highlighter-rouge">A</code> 和 <code class="highlighter-rouge">B</code> 通道的引脚编号: <code class="highlighter-rouge">2</code> 和 <code class="highlighter-rouge">3</code></li>
    <li> 编码器  <code class="highlighter-rouge">PPR</code> (每转脉冲数): <code class="highlighter-rouge">2048</code></li>
    <li> <code class="highlighter-rouge">I</code> 引脚 <i>（可选）</i> </li>
  </ul> 
</div>


<div id="mag_p" class="hide_p">
在例程中，我们使用了14 位磁性传感器进行设置，比如：<a href="https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D">AS5047u<i class="fa fa-external-link"></i></a>, 并将其与引脚<code class="highlighter-rouge">10</code>连接。<br>
磁性传感器使用SPI方式通讯，在类<code class="highlighter-rouge">MagneticSensorSPI</code>中的实现与定义如下：
  <ul>
    <li><code class="highlighter-rouge">chip_select</code> 引脚: <code class="highlighter-rouge">10</code> </li>
    <li> 传感器总 <code class="highlighter-rouge">CPR</code>（每圈脉冲数）:   <code class="highlighter-rouge">CPR = 2^14bit =16384</code></li>
    <li> <code class="highlighter-rouge">angle</code> SPI 寄存器: <code class="highlighter-rouge">0x3FFF</code></li> 
  </ul>
</div>



执行 `sensor.init()`，初始化传感器硬件引脚

完整的设置和参数配置文件，请访问<a href="sensors"> 位置传感器 docs <i class="fa fa-external-link"></i></a>。


## 步骤2 <a href="drivers_config" class="remove_dec">设置驱动器</a>
配置好位置传感器后，我们开始初始化和配置驱动器。该库支持由类`BLDCDriver3PWM` 和 `BLDCDriver6PWM`  控制的无刷直流电机驱动器以及由类`StepperDriver4PWM` 控制的步进电机驱动器。

类`BLDCDriver3PWM`的实例化需要以下参数 ：

-  `A`, `B` 和 `C` 相对应的引脚编号
- `enable` 的引脚编号 *（可选）*

例如：
```cpp
#include <SimpleFOC.h>

//  BLDCDriver3PWM( pin_pwmA, pin_pwmB, pin_pwmC, enable使能引脚（可选的）)
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 实例化传感器

void setup() {  

  // 初始化传感器

  // 电源电压
  driver.voltage_power_supply = 12;
  // 初始化驱动器
  driver.init();

}

void loop() {

}
```


完整的设置和参数配置文件，请访问 <a href="drivers_config"> 驱动器 docs <i class="fa fa-external-link"></i></a>。


## 步骤3 <a href="current_sense" class="remove_dec">设置电流检测</a>
配置好位置传感器及驱动器后，如果驱动器支持电流检测的话，就要初始化和配置电流检测。如果不支持的话，可以跳过这一步。 该库暂时仅支持在线电流检测 `InlineCurrentSense`这一种电流检测方式。 

类`InlineCurrentSense` 的实例化需要以下参数：
- 采样电阻的阻值 `shunt_resistance`
- 放大增益 `gain`
-  A, B （以及可选C）相对应的引脚编号

例如：
```cpp
#include <SimpleFOC.h>

// 实例化驱动器
// 实例化传感器

//  InlineCurrentSense(shunt_resistance分流电阻, gain增益, adc_a, adc_b)
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50, A0, A2);


void setup() {  

  // 初始化传感器

  // 初始化驱动器

  // 初始化电流检测
  current_sense.init();

}

void loop() {

}
```


完整的设置和参数配置文件，请访问<a href="current_sense"> 电流检测 docs <i class="fa fa-external-link"></i></a>。



## 步骤4 <a href="motors_config" class="remove_dec">设置电机</a>
配置好位置传感器及驱动器后，我们开始初始化和配置电机。 该库支持由 `BLDCMotor` 类控制的无刷直流电机以及由 `StepperMotor` 类控制的步进电机。仅需填入电机极对数就能实现这两个类的控制。

```cpp
// StepperMotor(int pole_pairs极对数)
StepperMotor motor = StepperMotor(50);
```
```cpp 
// BLDCMotor(int pole_pairs极对数)
BLDCMotor motor = BLDCMotor(11);
```


在这一例程，我们使用了无刷直流电机：
```cpp
#include <SimpleFOC.h>

//  BLDCMotor( int pole_pairs极对数 )
BLDCMotor motor = BLDCMotor( 11);
 
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
  
  // 初始化电流检测
  // 连接其至电机
  motor.linkCurrentSense(&current_sese);

  // 设置控制环类型
  motor.controller = MotionControlType::velocity;
  // 初始化电机
  motor.init();

}

void loop() {

}
```

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

  // 初始化电流检测
  // 连接电机和电流检测

  // 配置电机
  // 初始化电机

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

void setup() {  
  
  // 初始化传感器
  // 连接电机和传感器

  // 初始化驱动器
  // 连接电机和驱动器

  // 初始化电流检测
  // 连接电机和电流检测

  // 监视无刷直流电机
  Serial.begin(115200);
  // 监视点
  motor.useMonitoring(Serial);
  
  // 配置电机
  // 初始化电机
  
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

  // 初始化电流检测
  // 连接电机和电流检测
  
  // 启用监视器
  
  // 订阅电机至commands
  commander.add('M',doMotor,"motor");

  // 初始化电机
  
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
完整的设置和参数配置文件，请访问 <a href="communication"> 通信 docs</a>。


<script type="text/javascript">
    hideClass('language-c');
    document.getElementById("enc_p").style.display = "none";

    function showMagnetic(){
        document.getElementById("enc").classList.remove("btn-primary");
        document.getElementById("mag").classList.add("btn-primary");
        hideClass('language-c');
        showClass('language-c++');
        hideClass('hide_p');
        document.getElementById("mag_p").style.display = "block";


        return 0;
    }
    
    function showEncoder(){
        document.getElementById("mag").classList.remove("btn-primary");
        document.getElementById("enc").classList.add("btn-primary");
        showClass('language-c');
        hideClass('language-c++');
        hideClass('hide_p');
        document.getElementById("enc_p").style.display = "block";
    
        return 0;
    }

  function hideClass(class_name){
    var elems = document.getElementsByClassName(class_name);
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
    }
  }
  function showClass(class_name){
    var elems = document.getElementsByClassName(class_name);
    for (i = 0; i < elems.length; i++) {
        elems[i].style.display = "block";
    }
  }

</script>


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