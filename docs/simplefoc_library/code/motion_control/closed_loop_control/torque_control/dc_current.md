---
layout: default
title: 基于直流电流
permalink: /dc_current_torque_mode
nav_order: 2 
parent: 力矩控制
grand_parent: 闭环控制
grand_grand_parent: 运动控制
grand_grand_grand_parent: 编写代码
grand_grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
toc: true
---


# 使用直流电流控制扭矩
<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>


<div class="type type-b" markdown="1">
这个控制环允许你将无刷直流电机当作电流控制的直流电机来运行。这种扭矩控制算法需要电流传感硬件。用户设置目标电流$$I_d$$，FOC算法计算出必要的相电压$$u_a$$、$$u_b$$和$$u_c$$以维持该电流。启用此模式的方式为：
</div>
<div class="type type-s hide" markdown="1">
这个控制环允许你将步进电机当作电流控制的直流电机来运行。这种扭矩控制算法需要电流传感硬件。用户设置目标电流$$I_d$$，FOC算法计算出必要的相电压$$u_a$$和$$u_b$$以维持该电流。启用此模式的方式为：
</div>

```cpp
// DC current torque control mode
motor.torque_controller = TorqueControlType::dc_current;
```

## 其具体工作原理
<a href ="javascript:show('b','type');" class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s"> 步进电机</a>

<div class="type type-b">
 <a name="foc_image"></a><img class="width60" src="extras/Images/dc_current_mode.png">
</div>
<div class="type type-s hide">
 <a name="foc_image"></a><img class="width60" src="extras/Images/dc_current_stepper.png">
</div>



<div class="type type-b" markdown="1">
直流电流扭矩控制算法读取步进电机的相电流($$i_a$$ 和 $$i_b$$)。相电流通过逆克拉克变换转换为电流$$i_\alpha$$ 和 $$i_\beta$$。 例如，如果测量到相电流$$i_a$$ 和 $$i_b$$：

$$
i_\alpha = i_a, \quad i_\beta =i_a\frac{1}{\sqrt{3}} + i_b\frac{2}{\sqrt{3}}
$$

</div>
<div class="type type-s hide" markdown="1">
直流电流扭矩控制算法读取步进电机的相电流($$i_a$$ 和 $$i_b$$). 
相电流通过逆克拉克变换（对于步进电机来说很简单）转换为电流 $$i_\alpha$$ and $$i_\beta$$ 。

$$
i_\alpha = i_a, \quad i_\beta =i_b 
$$

</div>
然后我们可以计算电机测得的电流大小为

$$
i_{DC} = \sqrt{i_\alpha^2 + i_\beta^2}
$$


由于这个大小不包含电流方向（正或负）的信息，我们需要利用电流的符号来确定电流方向。计算电流符号最简单的方法是使用电流矢量的$$i_q$$分量的符号，我们可以通过使用当前角度$$a$$的帕克变换来计算$$i_q$$。

$$
i_q = i_\beta \cos(a) - i_\alpha\sin(a) 
$$

最后，直流电流$$i_{DC}$$被计算为电流矢量$$i_q$$的大小。


$$ i_{DC} = \text{sign}(i_q)\cdot\sqrt{i_\alpha^2 + i_\beta^2}$$


PID 控制器使用目标电流值$$I_d$$ 和测得的$$i_{DC}$$计算要设置给电机的适当电压$$U_q$$。


$$
U_q = \text{PID}(I_d - i_{DC}) 
$$


而$$U_d$$ 保持为 0。

$$
U_d = 0 
$$

<div class="type type-s hide" markdown="1">

最后，扭矩控制算法找到产生计算出的$$U_q$$和$$U_d$$ 电压的适当电压$$u_a$$和$$u_b$$。这是通过帕克变换完成的。

</div>
<div class="type type-b" markdown="1">

最后，扭矩控制算法找到产生计算出的$$U_q$$和$$U_d$$电压的适当电压$$u_a$$、$$u_b$$和$$u_c$$。这是通过帕克 + 克拉克（或空间矢量）变换完成的。

</div>


<blockquote class="info" markdown="1">
<p class="header">注意</p>

这种扭矩控制模式的假设是，电机产生的扭矩与电机消耗的直流电流$$i_{DC}$$​ 成正比 （$$i_{DC}$$ = $$i_q$$）。因此，通过控制该电流，用户可以控制扭矩值。这个假设只在低速度下成立，在较高速度下，电流的$$i_d$$ 分量会变大，$$i_{DC}$$=$$i_q$$ 不再成立。

</blockquote>

## 配置参数
为了使这个控制环平稳运行，用户需要配置PID_current_q的 PID 控制器参数和低通滤波器LPF_current_q的时间常数。
```cpp
// PID parameters - default 
motor.PID_current_q.P = 5;                       // 3    - Arduino UNO/MEGA
motor.PID_current_q.I = 1000;                    // 300  - Arduino UNO/MEGA
motor.PID_current_q.D = 0;
motor.PID_current_q.limit = motor.voltage_limit; 
motor.PID_current_q.ramp = 1e6;                  // 1000 - Arduino UNO/MEGA
// Low pass filtering - default 
LPF_current_q.Tf= 0.005;                         // 0.01 - Arduino UNO/MEGA
```



## 扭矩控制示例代码

<a href ="javascript:show('b','type');"  class="btn btn-type btn-b btn-primary">无刷直流电机</a>
<a href ="javascript:show('s','type');" class="btn btn-type btn-s">步进电机</a>

一个使用内置电流传感器的基于直流电流的扭矩控制简单示例，并通过串行命令接口设置目标值。

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

// current sensor
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }

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
  // link the driver to the current sense
  current_sense.linkDriver(&driver);

  // current sense init hardware
  current_sense.init();
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // set torque mode:
  motor.torque_controller = TorqueControlType::dc_current; 
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // foc current control parameters (Arduino UNO/Mega)
  motor.PID_current_q.P = 5;
  motor.PID_current_q.I= 300;
  motor.LPF_current_q.Tf = 0.01; 

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target current");

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
StepperMotor motor = StepperMotor(50);
StepperDriver2PWM driver = StepperDriver2PWM(9, 5, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// current sensor
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }

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
  // link the driver to the current sense
  current_sense.linkDriver(&driver);

  // current sense init hardware
  current_sense.init();
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // set torque mode:
  motor.torque_controller = TorqueControlType::dc_current; 
  // set motion control loop to be used
  motor.controller = MotionControlType::torque;

  // foc current control parameters (Arduino UNO/Mega)
  motor.PID_current_q.P = 5;
  motor.PID_current_q.I= 300;
  motor.LPF_current_q.Tf = 0.01; 

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // add target command T
  command.add('T', doTarget, "target current");

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