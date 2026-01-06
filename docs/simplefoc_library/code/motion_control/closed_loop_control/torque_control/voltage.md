---
layout: default
title: 基于电压
parent: 力矩控制
grand_parent: 闭环控制
grand_grand_parent: 运动控制
grand_grand_grand_parent: 编写代码
grand_grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /voltage_torque_mode
nav_order: 1
toc: true
---


#  使用电压进行扭矩控制
这种扭矩控制方法允许将 BLDC 和步进电机当作简单的直流电机来运行，用户设置要施加到电机的目标电压 $$U_q$$，FOC 算法会计算出必要的相电压 $$u_a$$、$$u_b$$ 和 $$u_c$$ 以实现平稳运行。通过以下方式启用此模式：
```cpp
// voltage torque control mode
motor.torque_controller = TorqueControlType::voltage;
```

有三种不同的使用电压控制电机扭矩的方式，它们对电机机械参数的了解要求不同：
- [纯电压控制 ](#pure-voltage-control) - 不需要电机参数
- [估算电流控制 ](#voltage-control-with-current-estimation) - 需要相电阻 R
- [带反电动势补偿的估算电流控制 ](#voltage-control-with-current-estimation-and-back-emf-compensation) - 需要相电阻 R和电机的 KV额定值
- [带反电动势和滞后补偿的估算电流控制](#voltage-control-with-current-estimation-and-back-emf-compensation) - 需要相电阻 R、电感 L 和电机的 KV 额定值

这三种基于电压控制的扭矩控制技术的框图可以表示为：

选择电机类型：

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

选择电压控制类型：

<a href ="javascript:show(0,'loop');" id="btn-0" class="btn btn-loop btn-primary">电压控制</a>
<a href ="javascript:show(1,'loop');" id="btn-1" class="btn btn-loop"> + 相电阻</a>
<a href ="javascript:show(2,'loop');" id="btn-2" class="btn btn-loop"> + KV 额定值</a>
<a href ="javascript:show(3,'loop');" id="btn-3" class="btn btn-loop"> + 相电感</a>

<div class="type type-b">
<img class="loop loop-0 width60" src="extras/Images/vm0.jpg"/>
<img class="loop loop-1 width60 hide" src="extras/Images/vm1.jpg"/>
<img  class="loop loop-2 width60 hide" src="extras/Images/vm2.jpg"/>
<img  class="loop loop-3 width60 hide" src="extras/Images/vm3.jpg"/>

</div>
<div class="type type-s hide">

<img id="4" class="loop width60 loop-0" src="extras/Images/voltage_loop_stepper1.jpg"/>
<img id="5" class="loop width60  loop-1 hide" src="extras/Images/voltage_loop_stepper2.jpg"/>
<img id="6" class="loop width60 loop-2 hide" src="extras/Images/voltage_loop_stepper3.jpg"/>
<img id="7"  class="loop width60 loop-3 hide" src="extras/Images/voltage_loop_stepper4.jpg"/>

</div>

## 纯电压控制

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>
<div class="type type-b">
<a name="foc_image"></a><img class="width60" src="extras/Images/vm0.jpg">
</div>
<div class="type type-s hide">
<a name="foc_image"></a><img class="width60" src="extras/Images/voltage_loop_stepper1.jpg">
</div>



电压控制算法从位置传感器读取角度 $$a$$ ，从用户那里获取目标 $$U_q$$电压值，并使用 FOC 算法为电机设置适当的$$u_a$$, $$u_b$$ 和 $$u_c$$电压。FOC 算法确保这些电压在电机转子中产生的磁力与永磁体磁场正好形成 <i>90 度</i> 偏移，这保证了最大扭矩，这称为换相。

纯电压控制的假设是，电机中产生的扭矩（与电流 $I = k \tau $ 成正比）与用户设置的电压$$U_q$$成正比。最大扭矩对应于最大 $$U_q$$ ，这取决于可用的电源电压，最小扭矩当然是 $$U_q= 0$$时的扭矩。

$$
U_q \approx I = k\tau
$$


<blockquote class="warning">
<p class="heading">⚠️ 实际限制</p>这种扭矩控制方法是设置起来最快、最简单的，但它根本不限制电流！</blockquote>


### 预期的电机行为

如果用户将期望电压$$U_q$$设置为 0 安培，电机不应移动，并且有一定的阻力，不会太大，但比电机与驱动器断开连接时要大。


如果设置某个期望电压 $$U_g$$，电机应该开始移动，达到的速度应该与设置的电压 $$U_q$$成正比。其行为应该与通过改变其导线上的电压来控制的直流电机非常相似。


## 带电流估算的电压控制

这种扭矩控制策略的框图如下

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>
<div class="type type-b">
<a name="foc_image"></a><img class="width60" src="extras/Images/vm1.jpg">
</div>
<div class="type type-s hide">
<a name="foc_image"></a><img class="width60" src="extras/Images/voltage_loop_stepper2.jpg">
</div>


如果用户提供电机的相电阻$$R$$值，用户可以设置期望电流 $$I_d$$（产生期望扭矩 $$I_d = k\tau_d$$），库会自动计算适当的电压 $$U_q$$。

$$
U_q = I_d R = (k\tau_d) R
$$

用户可以通过构造函数指定电机的相电阻，例如

<div class="type type-b" markdown="1">


```cpp
// BLDCMotor(pole pair number, phase resistance)
BLDCMotor motor = BLDCMotor( 11, 2.5 );
```

</div>
<div class="type type-s hide"  markdown="1">

```cpp
// StepperMotor(pole pair number, phase resistance)
StepperMotor motor = StepperMotor( 50, 1.0 );
```
</div>



或者只需设置参数：
```cpp
motor.phase_resistance = 1.5; // ex. 1.5 Ohms
```


<blockquote class="warning">
<p class="heading">⚠️ 实际限制</p> 
在某些情况下，电机中的实际电流可能会高于期望电流 <span data-type="inline-math" data-value="SV9k"></span>，但数量级应该保持一致。相电阻值 <span data-type="inline-math" data-value="Ug=="></span> 越准确，电流估算效果就越好。


然而，由于电流 \(I_d\)不仅取决于电压 \(U_q\)，还取决于反电动势电压，这种电流估算策略非常有限。关系 \(U_q=I_dR\) 仅在电机不移动（不产生反电动势电压）时成立。如果电机正在移动，产生的反电动势电压会降低施加到电机的电压 \( I_dR = U_q - U_{bemf}\)。因此，这种方法的实际限制是，只有当电机静止时，期望电流 \(I_d\) 才会施加到电机上，一旦电机移动，施加到电机的实际电流就会减小。

</blockquote>


### 预期的电机行为
如果用户将期望电流设置为 0 安培，电机不应移动，并且有一定的阻力，不会太大，但比电机与驱动器断开连接时要大。

如果设置某个期望电流 $$I_d$$ ，电机应该开始移动，达到的速度应该与设置的电流 $$I_d$$成正比。

<blockquote class="info">
<p class="heading">对于电流 <span data-type="inline-math" data-value="SV9kID4gMA=="></span> 电机不移动</p>
如果期望电流设置为非 0 的某个值，但电机不移动，可能相电阻值 <span data-type="inline-math" data-value="Ug=="></span> 太小。尝试增大它。
</blockquote>


## 带电流估算和反电动势补偿的电压控制

这种扭矩控制策略的框图如下

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC motors</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> Stepper motors</a>
<div class="type type-b">
<a name="foc_image"></a><img class="width60" src="extras/Images/vm2.jpg">
</div>
<div class="type type-s hide">
<a name="foc_image"></a><img class="width60" src="extras/Images/voltage_loop_stepper3.jpg">
</div>



如果用户提供相电阻 $$R$$值和电机的 $$KV$$额定值，用户可以直接设置期望电流 $$I_d$$（产生期望扭矩 $$I_d = k\tau_d$$）。库会通过跟踪电机速度 $$v$$来补偿产生的反电动势电压，从而自动计算适当的电压 $$U_q$$。


$$
U_q = I_d R + U_{bemf}= (k\tau_d) R + \frac{v}{KV}
$$

用户可以通过构造函数指定电机的相电阻和 KV 额定值，例如

<div class="type type-b"  markdown="1">

```cpp
// BLDCMotor(pole pair number, phase resistance [Ohms], KV rating [rpm/V])
BLDCMotor motor = BLDCMotor( 11, 2.5, 120 );
```

</div>
<div class="type type-s hide"  markdown="1">

```cpp
// StepperMotor(pole pair number, phase resistance [Ohms], KV rating [rpm/V])
StepperMotor motor = StepperMotor( 50, 1.5, 20 );
```

</div>

<blockquote class="info">
<p class="heading">经验法则：KV 值</p>
电机的 KV 额定值定义为施加 1 伏电压 <span data-type="inline-math" data-value="VV9x"></span> 时电机的转速（转/分）。如果不知道电机的 KV 额定值，可以使用该库轻松测量。在电压模式下运行电机，将目标电压设置为 1V，然后读取电机速度。<span class="simple">Simple<span class="foc">FOC</span>库</span>显示的速度单位是弧度/秒，要将其转换为转/分，只需乘以 <span data-type="inline-math" data-value="MzAvXHBpIFxhcHByb3ggMTA="></span>。<br><br>

如上所述，由于电机的反电动势常数总是略小于 KV 额定值的倒数( \(k_{bemf}<1/KV\) )，经验法则是将 KV 额定值设置为比数据手册中给出的或通过实验确定的高 10-20%。
</blockquote>



有了 $$R$$ 和 $$KV$$ 信息，SimpleFOC库就能估算施加到电机的电流，用户将能够控制电机扭矩，前提是电机参数足够正确😄。


<blockquote class="warning">
<p class="heading">⚠️ 实际限制</p> 
反电动势电压定义为 \(U_{bemf} = k_{bemf}v\)，而根据电机的 \(KV\) 额定值来计算反电动势电压只是一种近似方法，因为电机的反电动势常数 \(k_{bemf}\) 并不精确等于 \(k_{bemf}=1/KV\)。

可以证明，反电动势常数总是略小于 \(KV\) 额定值的倒数：


\[k_{bemf}<\frac{1}{KV}\]
</blockquote>

### 预期的电机行为 
如果用户将期望电流设置为 0 安培，电机的阻力应该非常小，比上述两种扭矩控制策略中的阻力小得多。电机应该感觉几乎像断开连接一样。

<blockquote class="info">
<p class="heading"> 对于电流为 0 时电机移动</p>
如果期望电流设置为 0，但用手移动电机后，电机自己继续转动且不会完全停止，可能 \(KV\) 值太高。尝试减小它。

</blockquote>


如果设置某个期望电流 $$I_d$$
，电机应该加速到其最大速度。加速度值与电机扭矩成正比，并且与电流 $$I_d$$成正比。因此，对于较大的电流，电机加速更快，对于较小的电流，电机加速更慢。但对于无负载的电机，无论设置的目标电流 $$I_d$$如何，电机都应达到其最大速度。


<blockquote class="info">
<p class="heading"> 对于电流 \(I_d > 0\) 电机不运行</p>
如果期望电流设置为非 0 的某个值，但电机不移动，可能相电阻值\(R\)太小。尝试增大它。
</blockquote>



## 带电流估算、反电动势和滞后补偿的电压控制

这种扭矩控制策略的框图如下

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC motors</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> Stepper motors</a>
<div class="type type-b">
<a name="foc_image"></a><img class="width60" src="extras/Images/vm3.jpg">
</div>
<div class="type type-s hide">
<a name="foc_image"></a><img class="width60" src="extras/Images/voltage_loop_stepper4.jpg">
</div>


如果用户提供相电阻 $$R$$值和电机的 $$KV$$ 额定值，用户可以直接设置期望电流 $$I_d$$（产生期望扭矩 $$I_d = k\tau_d$$）。库会通过跟踪电机速度 $$v$$来补偿产生的反电动势电压，从而自动计算适当的电压 $$U_q$$ 。$$U_q = I_d R + U_{bemf}= (k\tau_d) R + \frac{v}{KV}$$此外，如果用户设置相电感值 $$L$$，库将能够通过计算适当的 d 轴电压 $$U_d$$来补偿扭矩矢量的滞后

$$
U_d = -I_d L v n_{pp} = -(k\tau_d)L v n_{pp}
$$

其中 $$n_{pp}$$是电机的极对数。通过补偿由于电机旋转速度 $$v$$引起的扭矩矢量滞后，电机将能够以更高的最大速度旋转。因此，如果应用需要达到最大电机速度，滞后补偿将产生最大效果。


用户可以通过构造函数指定电机的相电阻和 KV 额定值，例如
<div class="type type-b"  markdown="1">


```cpp
// BLDCMotor(pole pair number, phase resistance [Ohms], KV rating [rpm/V], phase inductance [H])
BLDCMotor motor = BLDCMotor( 11, 2.5, 120, 0.01 );
```

</div>
<div class="type type-s hide"  markdown="1">

```cpp
// StepperMotor(pole pair number, phase resistance [Ohms], KV rating [rpm/V], phase inductance [H])
StepperMotor motor = StepperMotor( 50, 1.5, 20, 0.01 );
```

</div>


<blockquote class="info">
<p class="heading">经验法则：KV 值</p> 
电机

如上所述，由于电机的反电动势常数总是略小于 KV 额定值的倒数( \(k_{bemf}<1/KV\) )，经验法则是将 KV 额定值设置为比数据手册中给出的或通过实验确定的高 10-20%。
</blockquote>



有了 R 和 KV 信息，SimpleFOC库就能估算施加到电机的电流，用户将能够控制电机扭矩，前提是电机参数足够正确😄。


<blockquote class="warning">
<p class="heading">⚠️ 实际限制</p> 
反电动势电压定义为 \(U_{bemf} = k_{bemf}v\)，而基于电机的 \(KV\) 额定值来计算反电动势电压只是一种近似做法，因为电机的反电动势常数 \(k_{bemf}\) 并不精确等于 \(k_{bemf}=1/KV\)。
可以证明，反电动势常数总是略小于 KV 额定值的倒数：
\[k_{bemf}<\frac{1}{KV}\]
</blockquote>

### 预期的电机行为
如果用户将期望电流设置为 0 安培，电机的阻力应该非常小，比上述两种扭矩控制策略中的阻力小得多。电机应该感觉几乎像断开连接一样。 

<blockquote class="info">
<p class="heading"> 对于电流为 0 时电机移动</p>
如果期望电流设置为 0，但用手移动电机后，电机自己继续转动且不会完全停止，可能\(KV\)值太高。尝试减小它。
</blockquote>


如果设置某个期望电流 $$I_d$$，电机应该加速到其最大速度。加速度值与电机扭矩成正比，并且与电流 $$I_d$$成正比。因此，对于较大的电流，电机加速更快，对于较小的电流，电机加速更慢。但对于无负载的电机，无论设置的目标电流 $$I_d$$如何，电机都应达到其最大速度。

<blockquote class="info">
<p class="heading"> 对于电流\(I_d > 0\) 电机不运行</p>
如果期望电流设置为非 0 的某个值，但电机不移动，可能相电阻值\(R\)太小。尝试增大它。
</blockquote>

对于不同的电机相电感 L值，电机能够达到不同的最大速度。电感值越高，最大速度越高。然而，超过某个电感值后，电机的最大速度将不再受影响，因为它将达到其绝对最大速度。

<blockquote class="info">
<p class="heading"> 如何找到相电感\(L\) 值</p>
从低值开始，例如 0.1mH，将目标电流\(I_d\)设置为某个值，使电机能够加速到其最大速度。然后使用 Commander 界面更改电感，观察电机速度的变化。通过提高 \(L\) 值，速度应该会增加。超过某个 \(L\) 值后，速度将停止增加，如果继续增大，甚至可能会降低。因此，使用达到最大速度的最小\(L\) 值。  
</blockquote>



有关扭矩控制理论的更多信息，请查看[深入探讨部分](digging_deeper)或直接前往[扭矩控制理论](voltage_torque_control)。

## 扭矩控制示例代码
一个基于电压的扭矩控制的简单示例，并通过串行命令接口设置目标**电流**。

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">BLDC 电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>
<div class="type type-b" markdown="1">

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

// instantiate the commander
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

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

  // set the torque control type
  motor.phase_resistance = 12.5; // 12.5 Ohms
  motor.torque_controller = TorqueControlType::voltage;
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // add target command M
  command.add('M', doMotor, "motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target current using serial terminal:"));
  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();

  // user communication
  command.run();
}
```


</div>

<div class="type type-s hide" markdown="1">

```cpp
#include <SimpleFOC.h>

// Stepper motor & driver instance
StepperMotor motor = StepperMotor(50); // nema17 200 steps per revolution
StepperDriver2PWM driver = StepperDriver2PWM(9, 5, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// instantiate the commander
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

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

  // set the torque control type
  motor.phase_resistance = 1.5; // 1.5 Ohms
  motor.torque_controller = TorqueControlType::voltage;
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // add target command M
  command.add('M', doMotor, "motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target current using serial terminal:"));
  _delay(1000);
}

void loop() {

  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();

  // user communication
  command.run();
}
```


</div>
