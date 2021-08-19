---
layout: default
title: Getting started
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /example_from_scratch
parent: Writing the Code
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
---

# Let's get started（让我们开始吧） 

当你的 <span class="simple">Simple<span class="foc">FOC</span>library</span> [安装](installation) 完成和准备好必要的 [硬件](supported_hardware) 之后，我们就可以开始有趣的部分了，编写代码让电机动起来！

## Step 1. Testing the sensor（第1步. 测试传感器）
一切都连接良好的第一个信号是传感器读数良好。要测试传感器，请浏览库实例 `examples/utils/sensor_test` ，并找到您的传感器实例。这个实例的结构是这样的：

```cpp
#include <SimpleFOC.h>

Encoder encoder = Encoder(2, 3, 500);
// interrupt routine intialisation
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

void setup() {
  // monitoring port
  Serial.begin(115200);
  
  // initialise encoder hardware
  sensor.init();
  // hardware interrupt enable
  encoder.enableInterrupts(doA, doB);

  Serial.println("Encoder ready");
  _delay(1000);
}

void loop() {
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```
请确保更改传感器参数来适应你的应用程序，如引脚编号、每转的脉冲、总线地址等。如果不确定某些参数，请务必查看 [传感器文档](sensors) 。


如果您的传感器连接良好并且一切正常运行，那么你的串行终端应该有传感器角度和速度的输出。

<blockquote class="info"> <p class="heading">☑️ 简单的测试</p> 确保测试电机时，电机的一个旋转输出的传感器角度是  <b>6.28 </b>弧度。</blockquote>

## Step 2. Testing the driver（第2步. 测试驱动程序）
当传感器在运行时，你可以继续进行测试。测试驱动程序的最简单方法是使用库的实例。如果你有充裕的时间，你可以使用 `examples/utils/driver_standalone_test` 文件夹中的实例来测试驱动程序。这些实例将驱动程序作为一个独立的模块进行测试，你可以将任何电压值设置到驱动器的任何相位。
```cpp
#include <SimpleFOC.h>
// BLDC driver instance
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

void setup() {
  // pwm frequency to be used [Hz]
  driver.pwm_frequency = 50000;
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;

  // driver init
  driver.init();

  // enable driver
  driver.enable();

  _delay(1000);
}

void loop() {
    // setting pwm (A: 3V, B: 1V, C: 5V)
    driver.setPwm(3,1,5);
}
```
<blockquote class="info"> <p class="heading">☑️ 简单的测试</p>
确保所有相位输出的是 PWM 信号，可以尝试在每个相位和地之间连接一个小的led 灯或者使用万用表测量它。</blockquote>

## Step 2. Testing the driver + motor combination - open-loop（第2步. 测试驱动器+电机组合-开环）
如果你已经连接了电机，而且驱动器工作良好，我们建议你使用实例 `examples/motion_control/open_loop_motion_control`中的开环运动控制实例来测试电机+驱动器组合。如果你的驱动程序与实例中提供的不一样，请浏览 [驱动程序文档](drivers_config) ，并查找你需要的驱动程序和代码。此外，你可以浏览在 `examples/utils/driver_standalone_test` 文件夹中的实例，并查看如何使用。

下面是 `BLDCDriver3PWM` 开环速度控制的一个实例：
```cpp
// Open loop motor control example
#include <SimpleFOC.h>

// BLDC motor & driver instance
// BLDCMotor motor = BLDCMotor(pole pair number, phase resistance (optional) );
BLDCMotor motor = BLDCMotor(11);
// BLDCDriver3PWM driver = BLDCDriver3PWM(pwmA, pwmB, pwmC, Enable(optional));
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }

void setup() {

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  // motor.phase_resistance = 3.52 // [Ohm]
  // motor.current_limit = 2;   // [Amps] - if phase resistance defined
  motor.voltage_limit = 3;   // [V] - if phase resistance not defined
  motor.velocity_limit = 5; // [rad/s] cca 50rpm
 
  // open loop control config
  motor.controller = MotionControlType::velocity_openloop;

  // init motor hardware
  motor.init();

  // add target command T
  command.add('T', doTarget, "target velocity");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}
void loop() {

  // open loop velocity movement
  // using motor.voltage_limit and motor.velocity_limit
  motor.move();

  // user communication
  command.run();
}
```
这个实例代码有一些非常重要的规则。
1. 确保你使用正确的驱动的类和正确的 pwm 引脚，这个通常是很简单的，你可以在我们的 [驱动文档](drivers_config) 中找到很多关于这个方面的的文档。如果你不确定，也不能正常运行，请毫不犹豫地到我们的 [社区论坛](https://community.simplefoc.com) 上提问。
2. 确保使用适当的电压限制。 `motor.voltage_limit` 将直接确定通过电机的电流： `current = phase_resistance*motor.voltage_limit` 。所以，为了避免过高的电流，请设法找到你电机的相位电阻。设置  `motor.voltage_limit` 使电流不超过 2 Amps ，例如： `motor.voltage_limit = 2*phase_resistance` 。最好的选择是通过设置参数 `motor.phase_resistance` 来提供电机的相位电阻值，然后你可以用 `motor.current_limit` 而不是 `motor.voltage_limit` 使这个问题变得简单。 如果你找不到你的电机的相位电阻，当他开始变小的时候 `motor.voltage_limit < 1;`也不能用你的万用表测量它。
3. 确保正确输入极对数。很多数据表中找到极对数，如果你不确定，不要担心这一步就是为了准确地测出这个值。 😄

<blockquote class="info"> <p class="heading">☑️ 简单的测试</p> 1. 在速度模式下，将你的目标速度设置为 <b>6.28 rad/s</b>，这应该正好是每秒旋转一周。<br>2. 在位置模式下，设置目标位置为 <b>6.28 rad</b>，应该正好旋转一周。 <br> 如果不是，这意味着你的极对数可能不是很对，试着改变它，直到你恰好旋转一周（或在速度模式下每秒旋转一周）</blockquote>

## Step 3. Closed-loop control - torque using voltage（第3步. 闭环控制 - 使用电压控制力矩）

当你有一个工作传感器、工作电机和驱动器的时候，你就可以继续进行闭环运动控制测试。第一个要测试的是使用电压控制力矩控制的模式，这是 <span class="simple">Simple<span class="foc">FOC</span>library</span> 中闭环控制的最简单形式。你可以在库实例的文件夹中找到不同传感器的该模式实例： `examples/motion_control/torque_control` 。
下面是 `BLDCMotor3PWM` 驱动器和 `Encoder` 作为位置传感器的一个实例：

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

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // add current limit
  // motor.phase_resistance = 3.52 // [Ohm]
  // motor.current_limit = 2;   // [Amps] - if phase resistance defined

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // set the initial motor target
  // motor.target = 0.2; // Amps - if phase resistance defined  
  motor.target = 2; // Volts 

  // add target command T
  // command.add('T', doTarget, "target current"); // - if phase resistance defined
  command.add('T', doTarget, "target voltage");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal:"));
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
到目前为止，您已经知道了传感器、驱动器和电机如何配置好。如果之前的运行都是正常的，那这一步也不会有太大的问题。

这里要采取两个重要的步骤，确保你的电机没有使用过高的 `motor.voltage_sensor_align` 值，以防止电流过大。这条规则和开环的 `motor.voltage_limit` 是一样的。如果你不确定你的相位电阻是多少，从小的值开始测： `motor.voltage_sensor_align < 1` 。此外，您还可以定义电机的相位电阻，然后使用 `motor.current_limit` 值，这个变量将限制 `motor.voltage_sensor_align` 所以你不用再为它担心了。但如果你指定了相位电阻值，你就不用为电机设置电压命令，但要设置电流命令，更多信息请参阅 [力矩控制文件](voltage_torque_mode) for more info 。

第二个重要的技巧是使用 [监控](monitoring) 功能。这将帮助您调试可能出现的问题，在初始化和校准时会输出电机的状态。如果初始化失败，电机将被禁用，你可以用手毫无阻力地移动电机，如果代码可以运行，你的电机会开始旋转，你就可以通过串行终端设置电压（/电流，如果设置了`motor.phase_resistance` set）。 

<blockquote class="info"> <p class="heading">☑️ 简单的测试</p> 
确保电机的初始化完成得很好。监控会输出你传感器的偏移，方向，极对数的检查，它会告诉你它是成功的或者是失败的。 </blockquote>

## Step 5. Testing the current sense - if available（第5步. 测试电流传感器 - 如果可用）
如果你的设置里具有 SimpleFOClibrary 支持的电流传感器，那么我们建议在执行此步骤之前，确保你至少可以使用电压控制闭环力矩（第3步）。

最好的开始方式是使用电压将电流传感器添加到力矩控制代码中（第3步）。并通过监控将d、q电流输出到串行终端。

下面是一个代码实例：
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

  // current sense init hardware
  current_sense.init();
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // add current limit
  // motor.phase_resistance = 3.52 // [Ohm]
  // motor.current_limit = 2;   // [Amps] - if phase resistance defined

  // use monitoring with serial 
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsampling = 100; // set downsampling can be even more > 100
  motor.monitor_variables = _MON_CURR_Q | _MON_CURR_D; // set monitoring of d and q currents

  // initialize motor
  motor.init();
  // align sensor and start FOC
  motor.initFOC();

  // set the initial motor target
  // motor.target = 0.2; // Amps - if phase resistance defined  
  motor.target = 2; // Volts 

  // add target command T
  // command.add('T', doTarget, "target current"); // - if phase resistance defined
  command.add('T', doTarget, "target voltage");
  command.verbose = VerboseMode::nothing; // disable commander output to serial

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal:"));
  _delay(1000);
}

void loop() {
  // main FOC algorithm function
  motor.loopFOC();

  // Motion control function
  motor.move();

  // display the currents
  motor.monitor();
  // user communication
  command.run();
}
```
这个实例的代码几乎与第3步的代码完全相同。所以你配置电机，传感器和驱动器的时候应该没有太大的问题。在这一步，将测试你的电流传感器是否工作良好。在调用这个实例的代码几乎与第3步的代码完全相同。所以你配置电机，传感器和驱动器的时候应该没有太大的问题。在这一步，将测试你的电流传感器是否工作良好。在调用 `motor.monitor()` 函数时，将读取电流传感器，并将当前的 d 和 q 输出到串行终端。你可以打开串口绘图仪来可视化它们。

<blockquote class="info"> <p class="heading">☑️ 简单的测试 </p> 
1. 用手握住电机，改变不同的目标电压/电流值。确保电机静止时电流  d 非常接近0。确保电流 q  与你设置的电机电压成比例。 <br>
2. 让电机旋转。注意你的电流 d 和 q 下降到一个较低的水平，然后是静态电机。观察一下在低速时电流 d 几乎为0，之后就与电机速度成比例上升。 
</blockquote>

请浏览 [电流传感器文档](current_sense) ，查看支持的传感器和所有配置参数。


## Step 6. Full FOC motion control using current sensing - if available（第6步. 使用电流传感器控制全 FOC 运行-如果可用）
当你配置和测试好你的电机、位置传感器、驱动器和电流传感器之后，你就可以进行真正的 FOC 控制。
```cpp
#include <SimpleFOC.h>

// BLDC motor & driver instance
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(5, 10, 6, 8);

// encoder instance
Encoder encoder = Encoder(2, 3, 500);
// channel A and B callbacks
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// inline current sensor instance
InlineCurrentSense current_sense = InlineCurrentSense(0.01, 50.0, A0, A2);

// commander communication instance
Commander command = Commander(Serial);
void doMotor(char* cmd){ command.motor(&motor, cmd); }

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

  // set control loop type to be used
  motor.torque_controller = TorqueControlType::foc_current;
  motor.controller = MotionControlType::torque;

  // controller configuration based on the control type 
  motor.PID_velocity.P = 0.05;
  motor.PID_velocity.I = 1;
  motor.PID_velocity.D = 0;
  // default voltage_power_supply
  motor.voltage_limit = 12;
  
  // velocity low pass filtering time constant
  motor.LPF_velocity.Tf = 0.01;

  // angle loop controller
  motor.P_angle.P = 20;
  // angle loop velocity limit
  motor.velocity_limit = 20;

  // use monitoring with serial for motor init
  // monitoring port
  Serial.begin(115200);
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsampling = 0; // initially disable the real-time monitor

  // current sense init and linking
  current_sense.init();
  motor.linkCurrentSense(&current_sense);

  // initialise motor
  motor.init();
  // align encoder and start FOC
  motor.initFOC(); 

  // set the inital target value
  motor.target = 2;

  // subscribe motor to the commander
  command.add('M', doMotor, "motor");

  // Run user commands to configure and the motor (find the full command list in docs.simplefoc.com)
  Serial.println(F("Motor commands sketch | Initial motion control > torque/current : target 0Amps."));
  
  _delay(1000);
}

void loop() {
  // iterative setting FOC phase voltage
  motor.loopFOC();

  // iterative function setting the outer loop target
  motor.move();

  // motor monitoring
  motor.monitor();
  // user communication
  command.run();
}
```

要查看所有的 FOC 力矩控制参数，请访问 [力矩控制文档](torque_mode)。在第4步中，如果你在调整速度和位置的过程中设置了相位电阻。你很可能不需要再重新调整它们。

然而，最重要的事情还是使用 [命令界面](commander_interface) 来调整力矩控制的 PID 控制器和低 pas 滤波器的参数，通过这种方式，你将能够快速测试，实时更改控制器的参数，并且看到结果。一旦达到你满意的情况，你就可以在代码中写入这些值，然后停止使用命令。

<blockquote class="info"> <p class="heading">☑️ 简单的测试</p> 
将目标电流设置为 <b>0Amps</b> ，并尝试用手移动电机，确保像电机失灵一样地没有任何阻力。然后尝试设置小的电流值 (<b><0.5A</b>) ，看看你是否能感觉到电机的力量作用在你的手上。如果你能感觉到，那么这一步就成功了！ 
</blockquote>

