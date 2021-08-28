---
layout: default
title: 无刷倒立摆
parent: 实例项目
description: "Arduino Simple Field Oriented Control (FOC) library ."
nav_order: 4
permalink: /simplefoc_pendulum
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---


# 使用SimpleFOCShield的倒立摆项目<br>

这是一个完全基于Arduino [SimpleFOC library 和 SimpleFOC shield](https://github.com/simplefoc/Arduino-FOC)设计和控制的，基于无刷电机的倒立摆

<p><img src="https://github.com/simplefoc/Arduino-FOC-reaction-wheel-inverted-pendulum/raw/master/images/swing-up.gif" class="width40">   <img src="https://github.com/simplefoc/Arduino-FOC-reaction-wheel-inverted-pendulum/raw/master/images/stabilization.gif" class="width40"></p>
从许多方面来说，这是一个非常有趣的项目，它主要针对：
- 需要一个好的平台测试他们先进算法的学生。
- 有些许空闲时间和动力创造炫酷东西 ：D 的任何人。

### YouTube展示视频：D
<iframe class="youtube"  src="https://www.youtube.com/embed/Ih-izQyXJCI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
对于我来说，这个项目最让人兴奋的点是能够使用 FOC 算法。

**本项目使用无刷直流电机的主要优势：**

-  高扭矩重量比
   - 更轻且更强
-  低角速度时扭矩大
   - 电机无需以高转速运转也可以获得高扭矩
-  无齿轮箱和齿隙，使得本倒立摆可以：
   - 非常流畅的运作=非常稳定的倒立摆

到目前为止，由于硬件复杂、成本高、用户使用不友好、文档完备的成熟软件缺乏，绝大多数FOC的使用都仅局限于高端应用程序领域。本项目将直接有益于FOC算法和无刷直流电机技术的推广，希望你也能在你的项目中多多使用这些技术。

## 必需的零部件有什么？
<img src="https://github.com/simplefoc/Arduino-FOC-reaction-wheel-inverted-pendulum/raw/master/images/img1.png" class="width60">

由于使用了无刷电机和 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> ，这也许是倒立摆最简单的硬件设置之一。

<img src="https://github.com/simplefoc/Arduino-FOC-reaction-wheel-inverted-pendulum/raw/master/images/components.gif" class="width60">

有关3d打印件和其他硬件的详细资料，请查看 [github 仓库](https://github.com/simplefoc/Arduino-FOC-reaction-wheel-inverted-pendulum)。

## 连接所有元件
除了一些3d打印件、螺丝、轴承外，本项目还需要以下这些电子元件：

 [Arduino UNO](https://store.arduino.cc/arduino-uno-rev3)     | [Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>](arduino_simplefoc_shield_showcase) | 2x [2AMT 103 encoder（编码器）](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D) | [IPower GBM4198H-120T](https://www.ebay.com/itm/iPower-Gimbal-Brushless-Motor-GBM4108H-120T-for-5N-7N-GH2-ILDC-Aerial-photo-FPV/254541115855?hash=item3b43d531cf:g:q94AAOSwPcVVo571) 
 ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ 
 <img src="extras/Images/arduino_uno.jpg" style="width:150px"> | <img src="extras/Images/shield_to_v13.jpg" style="width:150px"> | <img src="extras/Images/enc1.png" style="width:150px">       | <img src="extras/Images/mot.jpg" style="width:150px">        

### 编码器1 （电机）
- SFOC的 `A` 和 `B`相引脚连接编码器接头 `P_ENC`，端子 `A` 和 `B`。 

### 编码器2 （摆）
<blockquote class="warning"> <p class="heading">引脚限制</p>
Arduino UNO 没有足够的硬件中断引脚供两个编码器连接，因此我们需要用到软件中断库。</blockquote>


- 编码器 `A` 和 `B` 相连接到引脚 `A0` 和 `A1`。


### 电机
- 电机 `a`相、 `b`相 和 `c`相直接连接电机接头 `TB_M1`。


## Arduino 代码
那么一起阅读这个例程的所有代码并开始编写吧
你需要做的第一件事是引入 `SimpleFOC` 库：

```cpp
#include <SimpleFOC.h>
```
请确保你安装了该库。如若没有安装，请返回 [”让我们开始吧“](installation) 页面查看。

此外，在此案例中，我们使用了两个编码器，因此我们需要引入一个软件中断库。
我们建议使用 `PciManager`。如果你还没有安装它，可以直接使用 Arduino 库管理器安装。更多信息，请查看  `Encoder`类 [文档](encoder) 。
一旦安装好，请将其引入你的程序中：

```cpp
// 软件中断库
#include <PciManager.h>
#include <PciListenerImp.h>
```

### 编码器1 （电机） 代码

首先，我们定义 `Encoder` 中A、B相通道的引脚以及每转脉冲数。
```cpp
// 定义编码器
Encoder encoder = Encoder(2, 3, 500);
```
然后，我们定义回调函数。
```cpp
// A相和B相的回调函数
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}
```
最后，在 `setup()` 函数中，我们初始化编码器并启用中断：
```cpp
// 初始化编码器硬件
encoder.init();
// 使能硬件中断
encoder.enableInterrupts(doA, doB);
```
现在就让我们一起设置倒立摆编码器吧。

<blockquote class="info">更多编码器参数配置信息，请查看<code class="highlighter-rouge">Encoder</code><a href="encoder">文档</a>.</blockquote>
### 编码器2 （摆）代码
首先，我们定义 `Encoder` 中A、B通道的引脚以及每转脉冲数。
```cpp
// 定义编码器
Encoder pendulum = Encoder(A0, A1, 1000);
```
然后，我们定义回调函数。
```cpp
// 通道A和通道B回调函数
void doPA(){pendulum.handleA();}
void doPB(){pendulum.handleB();}
```
接着，我们定义 `PciManager` 中的引脚更改监听器：
```cpp
// 引脚更改监听器
PciListenerImp listenerPA(pendulum.pinA, doPA);
PciListenerImp listenerPB(pendulum.pinB, doPB);
```
最后，在 `setup()` 函数中，我们先初始化倒立摆编码器：
```cpp
// 初始化硬件编码器
pendulum.init();
```
然后，我们用`PciManager`库的接口替代调用 `encoder.enableInterrupt()` 函数来附加中断。
```cpp
// 中断初始化
PciManager.registerListener(&listenerPA);
PciManager.registerListener(&listenerPB);
```
现在倒立摆已经准备就绪了，让我们一起设置电机吧。

### 电机代码
首先，我们需要定义 `BLDCMotor` 中的极对数为 `11`。
```cpp
// 定义无刷直流电机
BLDCMotor motor = BLDCMotor(11);
```

<blockquote class="warning">如果你不确定你电机的极对数是什么，请查看<code class="highlighter-rouge">find_pole_pairs.ino</code>的例子。</blockquote>
接着，我们需要定义 `BLDCDriver3PWM` 中电机的 PWM 引脚编号以及驱动器的使能引脚。
```cpp
// 定义无刷直流驱动器
BLDCDriver3PWM driver  = BLDCDriver3PWM(9, 10, 11, 8);
```

然后，在 `setup()`中我们要先配置电源电压（如果不是跟例程一样是12V），再初始化驱动器。
```cpp
// 电源电压
// 默认 12 v
driver.voltage_power_supply = 12;
driver.init();
```
然后，我们通过指定 `motor.controller`变量来告诉电机运行哪个控制环。
```cpp
// 设置要使用的控制回路类型
motor.controller = MotionControlType::torque;
```
<blockquote class="info">更多电压控制环的信息，请查看<a href="voltage_loop">文档</a>。</blockquote>
最后，我们将编码器和驱动板与电机连接，初始化硬件，初始化Field Oriented Control（FOC）。
```cpp  
// 将电机连接到传感器上
motor.linkSensor(&encoder);
// 把电机连接到驱动器上
motor.linkDriver(&driver);

// 初始化运动
motor.init();
// 对齐编码器并启动FOC
motor.initFOC();
```
对驱动电机来说，最后也是最重要的一步当然就是将FOC例程放入 `loop` 函数中，让它能够不断循环了。
```cpp
void loop() {
// 迭代FOC函数
motor.loopFOC();

// 迭代函数设置和计算角度/位置环路
// 这个函数可以在比loopFOC函数低得多的频率下运行
motor.move(target_voltage);
}
```
现在我们能够读取两个编码器和设置电机电压了，接下来我们需要编写稳定算法。
<blockquote class="info">更多参数和控制环配置信息，请查看<code class="highlighter-rouge">BLDCMotor</code><a href="motors_config">文档</a>.</blockquote>
### 控制算法代码

控制算法主要分为两阶段，分别是稳定和摇摆。

#### 稳定

为了稳定倒立摆，我们会使用状态空间控制器，它考虑了倒立摆系统的三个重要变量：

- 倒立摆角度 - `p_angle`
- 倒立摆速度 - `p_vel`
- 电机速度 - `m_vel`

最终控制器的代码十分简单，仅仅是运用了线性控制理论进行计算：
```cpp
target_voltage =  40*p_angle + 7*p_vel + 0.3*m_vel;
```
你可以把增益 `40`、`7` 和 `0.3`看作是权重，它告诉我们对这些变量的重要程度。显然，最高权重的是倒立摆角度，而最低的则是电机速度。基本上，如果我们设置电机速度的权重为 `0` ，那么你的倒立摆会仍然保持稳定，但你的电机可能永远不会停止转动。他总会保有一定的速度。另一方面，如果你将其权重调得很高，控制电机运动将优先于倒立摆稳定，你的倒立摆可能会变得不再稳定。因此，这里涉及到一个权衡。

这是将一个相对复杂的话题简单化的解释。另外，我还想向你推荐一个对类似方法解释还得不错的[youtube视频](https://www.youtube.com/watch?v=E_RDCFOlJx4)。

更加有趣的是，一个这样的系统实际上并不需要以采样时间小于20ms下运行。在我的例程里，它的运行速度约25ms，但你甚至还可以以50ms运行。

<blockquote class="warning"><p class="heading">注意</p>FOC算法<code class="highlighter-rouge">motor.loopFOC()</code>会以~1ms运行，但控制算法和函数<code class="highlighter-rouge">motor.move()</code>以~25ms降低采样。</blockquote>

#### 摆动

本例中实现的摆动可能是最简单的一个，这意味着硬件设计得足够好而无需再编写一些花哨的算法来实现它：D

这是摆动的hte代码：
```cpp
target_voltage = -_sign(pendulum.getVelocity())*motor.voltage_power_supply*0.4;
```
它真正的作用是检查倒立摆运动的方向 `sign(pendulum.getVelocity())`并在相反方向（`-`）设置非常高的电压值 `motor.voltage_power_supply*0.4` 。
也就是说算法在尝试加速倒立摆的运动（因为倒立摆加速度是由电机加速度的作用引起的，但方向相反）
你需要调整你正在设置的电压值。以我的倒立摆为例，40%的最大电压足以使倒立摆向上摆动。更高的电压会让其摆动得过快以致于倒立摆到达顶部时无法保持稳定，而更低的电压则根本不足以让倒立摆向上摆动。




#### 整合

现在我们仅需要决定什么时候需要摆动，什么时候需要稳定。从根本上来说，我们需要确定我们认为不可能恢复的角度和继续上摆的角度。
在我的例程中，我将该数值设定为 `0.5 radians`, `~30degrees`。

完整的控制算法代码如下：
```cpp
// 控制回路每次~25ms
if(loop_count++ > 25){
  
  // 计算摆角
  float pendulum_angle = constrainAngle(pendulum.getAngle() + M_PI);

  float target_voltage;
  if( abs(pendulum_angle) < 0.5 ) // 如果角度足够小稳定
    target_voltage =  40*pendulum_angle + 7*pendulum.getVelocity() + 0.3*motor.shaftVelocity();
  else // 倒立摆
    // 设置40%的最大电压到电机，以便摆动
    target_voltage = -sign(pendulum.getVelocity())*motor.voltage_power_supply*0.4;

  // 将目标电压设置到电机上
  motor.move(target_voltage);

  // 重新启动计数器
  loop_count=0;
}
```
那么现在我们能够读取倒立摆角度、控制电机、运行控制算法了！接下来，让我们来编写完整的代码吧！

```cpp
#include <SimpleFOC.h>
// 软件中断库
#include <PciManager.h>
#include <PciListenerImp.h>


// 无刷直流电机初始化
BLDCMotor motor = BLDCMotor(11);
// 定义无刷直流驱动器
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);
// 电机编码器初始化
Encoder encoder = Encoder(2, 3, 500);
// 中断程序 
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}


// 倒立摆编码器初始化
Encoder pendulum = Encoder(A1, A2, 1000);
// 中断程序
void doPA(){pendulum.handleA();}
void doPB(){pendulum.handleB();}
// PCI管理中断
PciListenerImp listenerPA(pendulum.pinA, doPA);
PciListenerImp listenerPB(pendulum.pinB, doPB);

void setup() {
  
  // 初始化电机编码器硬件
  encoder.init();
  encoder.enableInterrupts(doA,doB);
  
  // 驱动程序配置
  driver.voltage_power_supply = 12;
  driver.init();
  
  // 初始化倒立摆编码器
  pendulum.init();
  PciManager.registerListener(&listenerPA);
  PciManager.registerListener(&listenerPB);
  
  // 设置要使用的控制回路类型
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // 将电机连接到编码器
  motor.linkSensor(&encoder);
  // 把电机连接到驱动器上
  motor.linkDriver(&driver);
  
  // 初始化运动
  motor.init();
  // 校准编码器并启动FOC
  motor.initFOC();
  
}

// 循环下采样计数器
long loop_count = 0;

void loop() {
  // ~1ms 
  motor.loopFOC();

  // 控制回路每次~25ms
  if(loop_count++ > 25){
    
    // 计算摆角
    float pendulum_angle = constrainAngle(pendulum.getAngle() + M_PI);

    float target_voltage;
    if( abs(pendulum_angle) < 0.5 ) // 如果角度足够小稳定
      target_voltage = controllerLQR(pendulum_angle, pendulum.getVelocity(), motor.shaft_velocity);
    else // 倒立摆
      // 设置40%的最大电压到电机，以便摆动
      target_voltage = -_sign(pendulum.getVelocity())*driver.voltage_power_supply*0.4;

    // 将目标电压设置到电机上
    motor.move(target_voltage);

    // 将目标电压设置到电机上
    loop_count=0;
  }
   

}

// 函数限制-和之间的夹角，以-180度和180度表示
float constrainAngle(float x){
    x = fmod(x + M_PI, _2PI);
    if (x < 0)
        x += _2PI;
    return x - M_PI;
}

// LQR稳定控制器功能
// 计算需要设置电机的电压，以稳定摆
float controllerLQR(float p_angle, float p_vel, float m_vel){
  // 如果角度可控
  // 计算控制律
  // LQR controller u = k*x
  //  - k = [40, 7, 0.3]
  //  - x = [摆角，摆速度，电机速度]' 
  float u =  40*p_angle + 7*p_vel + 0.3*m_vel;
  
  // 限制设定给电机的电压
  if(abs(u) > driver.voltage_power_supply*0.7) u = sign(u)*driver.voltage_power_supply*0.7;
  
  return u;
}
```
