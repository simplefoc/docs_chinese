---
layout: default
title: 让我们开始吧
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /example_from_scratch
parent: 编写代码
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 
toc: true
---


#  让我们开始吧

一旦你安装好了 <span class="simple">Simple<span class="foc">FOC</span>library</span> [库](installation)，并且拥有了所有必要的 [硬件](supported_hardware)，我们终于可以开始有趣的部分了——编写代码并让电机转动起来！

## 步骤 1. 测试传感器
一切连接正常的第一个迹象是传感器读数正常。要测试传感器，请浏览库示例 `examples/utils/sensor_test` 并找到适合你的传感器的示例。
示例的结构大致如下：



<a href="javascript:show('enc','sensor');" class="btn btn-sensor btn-enc btn-primary">Encoder</a> 
<a href ="javascript:show('mspi','sensor');"  class="btn btn-sensor btn-mspi">Magnetic sensor SPI</a>
<a href ="javascript:show('mi2c','sensor');"  class="btn btn-sensor btn-mi2c">Magnetic sensor I2C</a>
<a href ="javascript:show('manalog','sensor');"  class="btn btn-sensor btn-manalog">Magnetic sensor Analog</a>
<a href ="javascript:show('hall','sensor');"  class="btn btn-sensor btn-hall">Hall sensors</a>


<div class="sensor sensor-manalog hide"  markdown="1">

```cpp
#include <SimpleFOC.h>

// MagneticSensorAnalog(uint8_t _pinAnalog, int _min, int _max)
// - pinAnalog      - the pin that is reading the pwm from magnetic sensor
// - min_raw_count  - the smallest expected reading. 
// - max_raw_count  - the largest value read. 
MagneticSensorAnalog sensor = MagneticSensorAnalog(A1, 14, 1020);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // initialise magnetic sensor hardware
  sensor.init();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // iterative function updating the sensor internal variables
  // it is usually called in motor.loopFOC()
  // this function reads the sensor hardware and 
  // has to be called before getAngle nad getVelocity
  sensor.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

</div>


<div class="sensor sensor-mi2c hide"  markdown="1">

```cpp
#include <SimpleFOC.h>

// Example of AS5600 configuration 
MagneticSensorI2C sensor = MagneticSensorI2C(AS5600_I2C);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // configure i2C
  Wire.setClock(400000);
  // initialise magnetic sensor hardware
  sensor.init();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // iterative function updating the sensor internal variables
  // it is usually called in motor.loopFOC()
  // this function reads the sensor hardware and 
  // has to be called before getAngle nad getVelocity
  sensor.update();
  
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

</div>


<div class="sensor sensor-mspi  hide"  markdown="1">

```cpp
#include <SimpleFOC.h>

// MagneticSensorSPI(MagneticSensorSPIConfig_s config, int cs)
//  config  - SPI config
//  cs      - SPI chip select pin 
MagneticSensorSPI sensor = MagneticSensorSPI(AS5147_SPI, 10);

void setup() {
  // monitoring port
  Serial.begin(115200);

  // initialise magnetic sensor hardware
  sensor.init();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // iterative function updating the sensor internal variables
  // it is usually called in motor.loopFOC()
  // this function reads the sensor hardware and 
  // has to be called before getAngle nad getVelocity
  sensor.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

</div>


<div class="sensor sensor-hall  hide"  markdown="1">

```cpp
#include <SimpleFOC.h>

// Hall sensor instance
// HallSensor(int hallA, int hallB , int cpr, int index)
//  - hallA, hallB, hallC    - HallSensor A, B and C pins
//  - pp                     - pole pairs
HallSensor sensor = HallSensor(2, 3, 4, 14);

void setup() {
  // monitoring port
  Serial.begin(115200);
  
  // initialise sensor hardware
  sensor.init();

  Serial.println("Sensor ready");
  _delay(1000);
}

void loop() {
  // iterative function updating the sensor internal variables
  // it is usually called in motor.loopFOC()
  sensor.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(sensor.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
  delay(100);
}
```

</div>


<div class="sensor sensor-enc"  markdown="1">

```cpp
#include <SimpleFOC.h>

Encoder encoder = Encoder(2, 3, 500);
// interrupt routine initialisation
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

void setup() {
  // monitoring port
  Serial.begin(115200);
  
  // initialise encoder hardware
  encoder.init();
  // hardware interrupt enable
  encoder.enableInterrupts(doA, doB);

  Serial.println("Encoder ready");
  _delay(1000);
}

void loop() {
  // IMPORTANT
  // read sensor and update the internal variables
  encoder.update();
  // display the angle and the angular velocity to the terminal
  Serial.print(encoder.getAngle());
  Serial.print("\t");
  Serial.println(sensor.getVelocity());
}
```

</div>

请务必根据你的应用修改传感器参数，例如引脚号、每转脉冲数、总线地址等。如果你对某些参数不确定，请查阅 [传感器文档](sensors)。


如果你的传感器连接良好且一切正常，你应该能在串口终端中看到传感器的角度和速度输出。
 
 <blockquote class="info" markdown="1"> <p class="heading">☑️ 简单测试</p> 
 确保测试电机旋转一周时，输出为 <b>6.28</b>（2π） `弧度`。<br>如果你不熟悉弧度（RAD），可以在[这里](library_units)找到关于库单位的更多信息。
 </blockquote>

## 步骤 2. 仅测试驱动器
当你的传感器工作正常后，就可以进行驱动器测试了。测试驱动器最简单的方法是使用库示例。如果时间允许，你可以使用 `examples/utils/driver_standalone_test` 文件夹中的示例来测试驱动器。这些示例将驱动器作为独立模块进行测试，通过它们你可以为驱动器的任何相设置任意电压值。




<a href="javascript:show('3pwm','driver');" class="btn btn-driver btn-3pwm btn-primary">3PMW BLDC Driver</a> 
<a href ="javascript:show('6pwm','driver');"  class="btn btn-driver btn-6pwm">6PMW BLDC Driver</a> 
<a href ="javascript:show('2pwm','driver');"  class="btn btn-driver btn-2pwm">2PWM Stepper Driver</a>
<a href ="javascript:show('4pwm','driver');"  class="btn btn-driver btn-4pwm">4PWM Stepper Driver</a>


<div class="driver driver-3pwm"  markdown="1">

```cpp
#include <SimpleFOC.h>

// BLDCDriver3PWM(pwmA, pwmB, pwmC, (en optional))
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

void setup() {
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;

  // driver init
  if (!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }

  // enable driver
  driver.enable();
  Serial.println("Driver ready!");
  _delay(1000);
}

void loop() {
    // setting pwm
    // phase A: 3V
    // phase B: 6V
    // phase C: 5V
    driver.setPwm(3,6,5);
}
```
</div>

<div class="driver driver-6pwm hide"  markdown="1">

```cpp
#include <SimpleFOC.h>

// BLDCDriver6PWM(pwmAh, pwmAl, pwmBh, pwmBl, pwmCh, pwmCl, (en optional))
BLDCDriver6PWM driver = BLDCDriver6PWM(5, 6, 9,10, 3, 11, 8);

void setup() {

  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  // daad_zone [0,1] - default 0.02f - 2%
  driver.dead_zone = 0.05f;

  // driver init
  if (!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }

  // enable driver
  driver.enable();
  Serial.println("Driver ready!");
  _delay(1000);
}

void loop() {
    // setting pwm
    // phase A: 3V
    // phase B: 6V
    // phase C: 5V
    driver.setPwm(3,6,5);
}
```

</div>

<div class="driver driver-2pwm hide"  markdown="1">

```cpp
#include <SimpleFOC.h>

// StepperDriver2PWM(pwm1, dir1, pwm2, dir2,(en1, en2 optional))
StepperDriver2PWM driver = StepperDriver2PWM(3, 4, 5, 6, 11, 12);

void setup() {
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  
  // driver init
  if (!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }

  // enable driver
  driver.enable();
  Serial.println("Driver ready!");
  _delay(1000);
}

void loop() {
    // setting pwm
    // phase A: 3V
    // phase B: 6V
    driver.setPwm(3,6);
}
```
</div>

<div class="driver driver-4pwm hide"  markdown="1">


```cpp
#include <SimpleFOC.h>

// StepperDriver4PWM(ph1A, ph1B, ph2A, ph2B, (en1, en2 optional))
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9,10, 7, 8);

void setup() {
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // Max DC voltage allowed - default voltage_power_supply
  driver.voltage_limit = 12;
  
  // driver init
  if (!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }

  // enable driver
  driver.enable();
  Serial.println("Driver ready!");
  _delay(1000);
}

void loop() {
    // setting pwm
    // phase A: 3V
    // phase B: 6V
    driver.setPwm(3,6);
}
```
</div>

准备好代码后，将其上传到你的开发板并打开串口终端。如果一切连接正确，你的 PWM 驱动器应该就绪，并且你应该在串口终端中看到 `Driver ready!` 消息。如果驱动器初始化不正确，请检查以下事项：
1. 请务必根据你的应用修改驱动器参数，例如引脚号、PWM 频率、电源电压等。如果你对某些参数不确定，请查阅  [驱动器文档](drivers_config)。

2. 确保使用正确的驱动器类和正确的 PWM 引脚，这通常很简单，你可以在我们的 [驱动器文档](drivers_config) 和 [选择 PWM 引脚指南](choosing_pwm_pins) 中找到很多相关文档。如果你不确定且无法使其工作，请随时在我们的 [社区论坛](https://community.simplefoc.com) 上提问。

<blockquote class="info" markdown="1"> <p class="heading">☑️ 简单测试</p>

1. 打开串口监视器，确认已显示 `Driver ready!`。如果显示 `Driver init failed!`，请查看调试输出以获取更多关于出错原因的信息。

2. 确保所有相都输出PWM信号，你可以尝试在每相和地之间连接一个小LED灯，或者用万用表测量。
</blockquote>

## 步骤 3. 测试驱动器 + 电机组合 - 开环控制
如果你已经连接好电机，并且确定驱动器工作正常，我们建议你使用 `examples/motion_control/open_loop_motion_control `中的开环控制示例来测试电机 + 驱动器组合。如果你的驱动器与示例中提供的不同，请查阅 [驱动器文档](drivers_config)，找到适合你的驱动器和代码。此外，你还可以浏览` examples/utils/driver_standalone_test `文件夹中的示例，查看其中的用法。

<blockquote class="warning"> <p class="heading">请注意</p>
在尝试此示例之前，请至少简要查看代码下方的规则。从这里开始，实际电流将流过你的电子设备，并且你的驱动器无法测量它（至少在此示例中不能）。</blockquote>

因此，此步骤的主要目的是测试电机参数，例如极对数，并验证驱动器是否能够驱动电机。

<a href="javascript:show('bldc3','open');" class="btn btn-open btn-bldc3 btn-primary">BLDC Motor + 3PMW driver</a>
<a href="javascript:show('bldc6','open');" class="btn btn-open btn-bldc6">BLDC Motor + 6PMW driver</a> 
<a href ="javascript:show('stepper2','open');"  class="btn btn-open btn-stepper2">Stepper Motor + 2PMW driver</a> 
<a href ="javascript:show('stepper4','open');"  class="btn btn-open btn-stepper4">Stepper Motor + 4PMW driver</a> 

<div class="open open-bldc3" markdown="1">

下面是使用**BLDC motor** 和 **3PWM driver**的开环速度控制示例。.

```cpp
#include <SimpleFOC.h>

// BLDCMotor(pole pair number, phase resistance (optional) );
BLDCMotor motor = BLDCMotor(11);
// BLDCDriver3PWM(pwmA, pwmB, pwmC, Enable(optional));
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimit(char* cmd) { command.scalar(&motor.voltage_limit, cmd); }

void setup() {

  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // limit the maximal dc voltage the driver can set
  // as a protection measure for the low-resistance motors
  // this value is fixed on startup
  driver.voltage_limit = 6;
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  // limit the voltage to be set to the motor
  // start very low for high resistance motors
  // current = voltage / resistance, so try to be well under 1Amp
  motor.voltage_limit = 3;   // [V]
 
  // open loop control config
  motor.controller = MotionControlType::velocity_openloop;

  // init motor hardware
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }

  // set the target velocity [rad/s]
  motor.target = 6.28; // one rotation per second

  // add target command T
  command.add('T', doTarget, "target velocity");
  command.add('L', doLimit, "voltage limit");

  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {

  // open loop velocity movement
  motor.move();

  // user communication
  command.run();
}
```

</div>

<div class="open open-bldc6 hide" markdown="1">


下面是使用  **BLDC motor** 和 **6PWM driver** 的开环速度控制示例。

```cpp
#include <SimpleFOC.h>

// BLDCMotor(pole pair number, phase resistance (optional) );
BLDCMotor motor = BLDCMotor(11);
// BLDCDriver6PWM(pwmAh, pwmAl, pwmBh, pwmBl, pwmCh, pwmCl, (en optional))
BLDCDriver6PWM driver = BLDCDriver6PWM(5, 6, 9,10, 3, 11, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimit(char* cmd) { command.scalar(&motor.voltage_limit, cmd); }

void setup() {

  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // limit the maximal dc voltage the driver can set
  // as a protection measure for the low-resistance motors
  // this value is fixed on startup
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  // limit the voltage to be set to the motor
  // start very low for high resistance motors
  // current = voltage / resistance, so try to be well under 1Amp
  motor.voltage_limit = 3;   // [V]
 
  // open loop control config
  motor.controller = MotionControlType::velocity_openloop;

  // init motor hardware
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }

  // set the target velocity [rad/s]
  motor.target = 6.28; // one rotation per second

  // add target command T
  command.add('T', doTarget, "target velocity");
  command.add('L', doLimit, "voltage limit");

  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {

  // open loop velocity movement
  motor.move();

  // user communication
  command.run();
}
```

</div>

<div class="open open-stepper2 hide"  markdown="1">


下面是使用 **Stepper motor** 和 **2PWM driver**的开环速度控制示例。

```cpp
#include <SimpleFOC.h>

// StepperMotor(pole pair number, phase resistance (optional) );
StepperMotor motor = StepperMotor(50);
// StepperDriver2PWM(pwm1, dir1, pwm2, dir2,(en1, en2 optional))
StepperDriver2PWM driver = StepperDriver2PWM(9, 5, 6, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimit(char* cmd) { command.scalar(&motor.voltage_limit, cmd); }

void setup() {

  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // limit the maximal dc voltage the driver can set
  // as a protection measure for the low-resistance motors
  // this value is fixed on startup
  driver.voltage_limit = 6;
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  // limit the voltage to be set to the motor
  // start very low for high resistance motors
  // current = voltage / resistance, so try to be well under 1Amp
  motor.voltage_limit = 3;   // [V]
 
  // open loop control config
  motor.controller = MotionControlType::velocity_openloop;

  // init motor hardware
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }

  // set the target velocity [rad/s]
  motor.target = 6.28; // one rotation per second

  // add target command T
  command.add('T', doTarget, "target velocity");
  command.add('L', doLimit, "voltage limit");

  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {

  // open loop velocity movement
  motor.move();

  // user communication
  command.run();
}
```
</div>

<div class="open open-stepper4 hide"  markdown="1">


下面是使用 **4PWM driver** 和 **Stepper motor**的开环速度控制示例。
```cpp
#include <SimpleFOC.h>

// StepperMotor(pole pair number, phase resistance (optional) );
StepperMotor motor = StepperMotor(50);
// StepperDriver4PWM(ph1A, ph1B, ph2A, ph2B, (en1, en2 optional))
StepperDriver4PWM driver = StepperDriver4PWM(5, 6, 9,10, 7, 8);

// instantiate the commander
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimit(char* cmd) { command.scalar(&motor.voltage_limit, cmd); }

void setup() {

  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // limit the maximal dc voltage the driver can set
  // as a protection measure for the low-resistance motors
  // this value is fixed on startup
  driver.voltage_limit = 6;
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link the motor and the driver
  motor.linkDriver(&driver);

  // limiting motor movements
  // limit the voltage to be set to the motor
  // start very low for high resistance motors
  // current = voltage / resistance, so try to be well under 1Amp
  motor.voltage_limit = 3;   // [V]
 
  // open loop control config
  motor.controller = MotionControlType::velocity_openloop;

  // init motor hardware
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }

  // set the target velocity [rad/s]
  motor.target = 6.28; // one rotation per second

  // add target command T
  command.add('T', doTarget, "target velocity");
  command.add('L', doLimit, "voltage limit");

  Serial.println("Motor ready!");
  Serial.println("Set target velocity [rad/s]");
  _delay(1000);
}

void loop() {

  // open loop velocity movement
  motor.move();

  // user communication
  command.run();
}
```
</div>

准备好代码后，将其上传到你的开发板并打开串口终端。如果一切连接正确，你应该看到电机旋转。如果电机不旋转，请检查以下事项：
1. 确保使用正确的驱动器类和正确的 PWM 引脚，这通常很简单，你可以在我们的 [驱动器文档](drivers_config) 和 [选择 PWM 引脚指南](choosing_pwm_pins) 中找到很多相关文档。

2. 确保使用适当的电压限制。所有这些示例都假设你使用的是高相电阻（~10 欧姆）的云台型电机。对于更高功率的电机，电流可能会过高，使你的电机 + 驱动器处于危险之中。根据经验，如果你的电机有伺服型插头，应该没问题。
`motor.voltage_limit` 将直接决定通过电机的电流：电流 = `motor.voltage_limit / motor`.`phase_resistance`。
因此，为避免过高的电流，请尝试找出电机的相电阻，并设置 `motor.voltage_limit` 使得电流不超过 2A，例如：`motor.voltage_limit = 2 ` 相电阻。最好的方法是通过设置参数 `motor.phase_resistance` 向电机提供相电阻值，然后你可以使用 `motor.current_limit` 而不是 `motor.voltage_limit`，这会使问题简单得多。如果你想尝试测量电机的相电阻，可以在 [这里](phase_resistance) 找到我们的指南。
如果你找不到电机的相电阻并且无法用万用表测量，请从小处开始：motor.voltage_limit < 1;

3. 确保输入正确的极对数。你可以在大多数数据手册中找到，如果你不确定实际数量，别担心，这一步旨在测试 / 找到确切的值。😄

<blockquote class="info" markdown="1"> <p class="heading">☑️ 简单测试</p>

1. 在串口终端中确认电机和驱动器已成功初始化。确保你能看到 `电机就绪！`，而不是 `电机初始化失败！` 或 `驱动器初始化失败！`。
2. 在速度模式下：(`motor.controller = MotionControlType::velocity_openloop;`) <br>
将目标速度设置为（`T6.28`）<b>6.28（$2π$）弧度/秒</b>（输入 `T6.28`），这应该正好是每秒一圈。
3. 在位置模式下，(`motor.controller = MotionControlType::angle_openloop;`) <br>
将目标位置设置为 <b>6.28（$2π$）弧度</b>（输入 `T6.28`），它应该正好是一圈。

如果你的电机在速度模式下每秒旋转的圈数不是一圈，或者在角度模式下旋转的圈数不是一圈，这可能意味着你的极对数不正确。尝试更改它，直到获得正好一圈（或在速度模式下每秒一圈）。
 
 </blockquote>

## 步骤 4. 闭环控制 - 使用电压的 torque 控制

一旦你有了工作正常的传感器、电机和驱动器，就可以进行闭环控制测试了。首先要测试的是使用电压的 torque 控制模式，这是 SimpleFOClibrary 中可用的最简单的闭环控制形式。你可以在库示例文件夹` examples/motion_control/torque_control` 中找到不同传感器的这种 torque 模式示例。

<a href="javascript:show('temp','cl');" class="btn btn-cl btn-temp btn-primary">Sketch template</a>
<a href="javascript:show('bldc','cl');" class="btn btn-cl btn-bldc">BLDC Motor + 3PMW driver + Encoder</a> 
<a href ="javascript:show('stepper','cl');"  class="btn btn-cl btn-stepper">Stepper Motor + 2PMW driver + Encoder</a> 



<div class="cl cl-temp" markdown="1">


下面是一个带有` TODO `条目的示例草图，你可以为你的电机、驱动器和传感器实现这些条目。

```cpp
#include <SimpleFOC.h>

// TODO: motor instance 
// TODO: driver instance

// TODO: sensor instance

// instantiate the commander
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup() { 
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);

  // TODO: driver config
  // init the sensor
  sensor.init()
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // TODO: driver config
  // init the driver
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link driver
  motor.linkDriver(&driver);

  // TODO: motor conf

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // use monitoring with serial
  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }
  // align sensor and start FOC
  if(!motor.initFOC()){
    Serial.println("FOC init failed!");
    return;
  }

  // set the initial motor target
  motor.target = 2; // Volts 

  // add target command M
  command.add('M', doMotor, "Motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal and command M:"));
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

<div class="cl cl-bldc hide" markdown="1">

下面是使用 **3PWM driver** 和 **Encoder**传感器的 **BLDC motor** 的示例草图。

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
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // driver init
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link driver
  motor.linkDriver(&driver);

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }
  // align sensor and start FOC
  if(!motor.initFOC()){
    Serial.println("FOC init failed!");
    return;
  }

  // set the initial motor target
  motor.target = 2; // Volts 

  // add target command M
  command.add('M', doMotor, "Motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal and command M:"));
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

<div class="cl cl-stepper hide" markdown="1">

下面是使用 **2PWM driver** 和 **Encoder** 传感器的 **Stepper motor** 的示例草图。

```cpp
#include <SimpleFOC.h>

// Stepper motor & driver instance
StepperMotor motor = StepperMotor(11);
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
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // driver init
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link driver
  motor.linkDriver(&driver);

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // comment out if not needed
  motor.useMonitoring(Serial);

  // initialize motor
  motor.init();
  // align sensor and start FOC
  if(!motor.initFOC()){
    Serial.println("FOC init failed!");
    return;
  }

  // set the initial motor target
  motor.target = 2; // Volts 

  // add target command M
  command.add('M', doMotor, "Motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal and command M:"));
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

到目前为止，你已经知道了传感器、驱动器和电机的良好配置。如果到目前为止一切正常，你很可能在这一步也不会遇到任何问题。你可以根据自己的设置调整上述示例，并将代码上传到开发板。

<blockquote class="info" markdown="1"> <p class="heading">☑️ 简单测试</p>

1.  如果一切连接正确，你应该看到电机旋转，并且能够通过串口终端（命令 `M`）设置目标电压。
2.  如果电机不旋转，请通过检查串口终端输出来确认电机和驱动器已成功初始化（确保你能看到 `电机就绪！`，而不是 `电机初始化失败！` 或 `驱动器初始化失败！`）。
</blockquote>

可能出现的最常见问题是：
- 电机根本不旋转
   - 驱动器可能没有正确初始化，请检查串口终端输出是否有任何错误。
- 电机在 `motor.initFOC()` 函数执行期间旋转，但之后不旋转
   - 验证 `motor.initFOC()` 函数的输出，可能是传感器对齐或极对数有问题。
- 电机旋转但不稳定且噪音很大
   - 验证 `motor.initFOC()` 函数的输出
      - 检查极对数检查，如果失败，可能意味着极对数不正确，请尝试更改。
      - 如果串口终端中一切似乎正常，传感器可能没有正确对齐，请尝试升高 / 降低 `motor.voltage_sensor_align` 值。

<blockquote class="warning" markdown="1"> <p class="heading">请注意</p>

确保使用不太高的 `motor.voltage_sensor_align` 值，以防止过高的电流。规则与开环控制中的 `motor.voltage_limit` 相同。如果你不确定你的相电阻，请从小处开始：`motor.voltage_sensor_align < 1`。此外，你也可以定义电机相电阻，然后使用 `motor.current_limit` 变量，该变量将限制 `motor.voltage_sensor_align`，你就不必再担心它了。但是，如果你指定了相电阻值，你将不再向电机设置电压命令，而是电流命令，有关更多信息，请参见 [torque 控制文档](voltage_torque_mode)。</blockquote>

### 步骤 4.1. 速度和角度控制

一旦上述代码运行良好，你就可以进行速度和角度运动控制了。
- 要从 torque 控制切换到速度控制，只需将 `motor.controller` 变量更改为 `MotionControlType::velocity`，并将 `motor.target` 设置为所需速度（以弧度 / 秒 RAD/s 为单位）。
- 要从 torque 控制切换到角度控制，只需将 `motor.controller` 变量更改为 `MotionControlType::angle`，并将 `motor.target` 设置为所需角度（以弧度 RAD 为单位）。
- 通过 `Commander` 接口通过串口终端切换到速度控制的另一种方法
  - 要启动速度控制模式，请在串口终端中输入 `MC1` 并按回车。
    - 要设置目标速度，请在串口终端中输入 `M6.28` 并按回车。这将把目标速度设置为每秒一圈。
    - 要停止电机，请在串口终端中输入 `M0` 并按回车。这将把目标速度设置为零。
  - 要启动角度控制模式，请在串口终端中输入 `MC2` 并按回车。
    - 要设置目标角度，请在串口终端中输入 `M0` 并按回车。这将把目标角度设置为一圈。
    - 当你的电机处于 `0` 角度时，尝试在串口终端中输入 `M6.28` 并按回车。这将把目标角度设置为一圈。
  - 要返回 torque 控制模式，请在串口终端中输入 `MC0 `并按回车。
  - 有关` Commander `接口的更多信息，请参见 [Commander 文档。](commander_interface)


速度和角度运动控制模式有额外的配置参数，可能需要这些参数来获得电机的平稳和稳定运行。你可以在 [运动控制文档](closed_loop_motion_control) 中找到有关这些参数的更多信息。

## 步骤 5. 测试电流检测（如果可用）
如果你的设置具有 SimpleFOClibrary 支持的电流检测功能，那么我们建议你在执行此步骤之前，至少确保能够使用电压进行闭环 torque 控制（步骤 4）。

最好的开始方法是将电流检测添加到使用电压的 torque 控制代码（步骤 4）中，并使用监控将 d 和 q 电流输出到串口终端。

<a href="javascript:show('temp','current');" class="btn btn-current btn-temp btn-primary">Sketch template</a>
<a href="javascript:show('bldc','current');" class="btn btn-current btn-bldc">BLDC Motor + 3PMW driver + Encoder + Inline Current Sensing</a> 
<a href ="javascript:show('stepper','current');"  class="btn btn-current btn-stepper">Stepper Motor + 2PMW driver + Encoder + Inline Current Sensing</a> 



<div class="current current-temp" markdown="1">


下面是一个带有 `TODO` 条目的示例草图，你可以为你的电机、驱动器、电流检测和传感器实现这些条目。

```cpp
#include <SimpleFOC.h>

// TODO: motor instance 
// TODO: driver instance

// TODO: sensor instance

// TODO: current sense instance

// instantiate the commander
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup() { 
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);

  // TODO: driver config
  // init the sensor
  sensor.init()
  // link the motor to the sensor
  motor.linkSensor(&sensor);

  // TODO: driver config
  // init the driver
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link driver
  motor.linkDriver(&driver);
  // link driver to cs
  current_sense.linkDriver(&driver);

  // TODO: current sense config
  // current sense init
  if(!current_sense.init()){
    Serial.println("Current sense init failed!");
    return;
  }
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // TODO: motor conf

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // use monitoring with serial
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsampling = 100; // set downsampling can be even more > 100
  motor.monitor_variables = _MON_CURR_Q | _MON_CURR_D; // set monitoring of d and q currents

  // initialize motor
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }
  // align sensor and start FOC
  if(!motor.initFOC()){
    Serial.println("FOC init failed!");
    return;
  }

  // set the initial motor target
  motor.target = 2; // Volts 

  // add target command M
  command.add('M', doMotor, "Motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal and command M:"));
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
</div>

<div class="current current-bldc hide" markdown="1">

以下是使用 **3PWM driver**、**Encoder** 和 **Inline Current Sensing** 的 **BLDC motor** 示例代码。

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
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup() { 
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // driver init
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link driver
  motor.linkDriver(&driver);
  // link driver to cs
  current_sense.linkDriver(&driver);

  // current sense init hardware
  if(!current_sense.init()){
    Serial.println("Current sense init failed!");
    return;
  }
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // use monitoring with serial
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsampling = 100; // set downsampling can be even more > 100
  motor.monitor_variables = _MON_CURR_Q | _MON_CURR_D; // set monitoring of d and q currents

  // initialize motor
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }
  // align sensor and start FOC
  if(!motor.initFOC()){
    Serial.println("FOC init failed!");
    return;
  }

  // set the initial motor target
  motor.target = 2; // Volts 

  // add target command M
  command.add('M', doMotor, "Motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal and command M:"));
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
</div>

<div class="current current-stepper hide" markdown="1">

以下是使用**2PWM driver**, **Encoder** 和**Inline Current Sensing**的**Stepper motor**示例代码。

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
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup() { 
  
  // use monitoring with serial 
  Serial.begin(115200);
  // enable more verbose output for debugging
  // comment out if not needed
  SimpleFOCDebug::enable(&Serial);
  
  // initialize encoder sensor hardware
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // link the motor to the sensor
  motor.linkSensor(&encoder);

  // driver config
  // power supply voltage [V]
  driver.voltage_power_supply = 12;
  // driver init
  if(!driver.init()){
    Serial.println("Driver init failed!");
    return;
  }
  // link driver
  motor.linkDriver(&driver);
  // link driver to cs
  current_sense.linkDriver(&driver);

  // current sense init hardware
  if(!current_sense.init()){
    Serial.println("Current sense init failed!");
    return;
  }
  // link the current sense to the motor
  motor.linkCurrentSense(&current_sense);

  // aligning voltage
  motor.voltage_sensor_align = 5;

  // set motion control loop to be used
  motor.torque_controller = TorqueControlType::voltage;
  motor.controller = MotionControlType::torque;

  // use monitoring with serial
  // comment out if not needed
  motor.useMonitoring(Serial);
  motor.monitor_downsampling = 100; // set downsampling can be even more > 100
  motor.monitor_variables = _MON_CURR_Q | _MON_CURR_D; // set monitoring of d and q currents

  // initialize motor
  if(!motor.init()){
    Serial.println("Motor init failed!");
    return;
  }
  // align sensor and start FOC
  if(!motor.initFOC()){
    Serial.println("FOC init failed!");
    return;
  }

  // set the initial motor target
  motor.target = 2; // Volts 

  // add target command M
  command.add('M', doMotor, "Motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target using serial terminal and command M:"));
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
</div>

这份示例代码与步骤 3 的代码几乎完全相同，因此你在配置电机、传感器和驱动器时应该不会遇到太多困难。本步骤中，你将测试电流检测功能是否正常工作。调用 `motor.monitor()` 函数时，系统会读取电流检测数据，并将 d 轴电流和 q 轴电流打印到串口终端。你可以打开串口绘图器（Serial Plotter）来可视化这些数据。

<blockquote class="info" markdown="1"> <p class="heading">☑️ 简单测试</p> 

1. 若所有连接正常，电机应能旋转，且你可通过串口终端（输入命令 `M`）设置目标电压。
2. 用手握住电机，设置不同的目标电压/电流值。确保电机静止时，d 轴电流非常接近 0；同时确保 q 轴电流与你设置的电机电压成正比。<br>
3. 让电机自由旋转，观察 d 轴电流和 q 轴电流是否降至低于电机静止时的数值。同时尝试观察：低转速时 d 轴电流几乎为 0，且会随着电机转速的增加而成比例上升。
</blockquote>

如果电机未旋转，请通过查看串口终端输出来确认电机和驱动器已成功初始化（确保能看到 ` Motor ready!`，而非` Motor init failed!`、`Driver init failed!` 或 `Current sense init failed!`）。我们的调试界面会在驱动器、电流检测和电机初始化过程中输出大量信息，可帮助你排查装置可能存在的问题。若电流检测功能出现问题，请查阅 [电流检测文档](current_sense)，了解支持的传感器及所有配置参数。

可能出现的最常见问题如下：
- 电流检测引脚并非 ADC 引脚 —— 更多信息请参见 [ADC 引脚选择指南](choosing_adc_pins)。
- 驱动器未与电流检测模块关联 —— 确保代码中包含 `current_sense.linkDriver(&driver)`; 这一行。
- PWM 定时器与 ADC 无法同步 —— 更多信息请参见 [PWM 引脚选择指南](choosing_pwm_pins)。
- 电流检测对齐失败 —— 验证 `motor.initFOC()` 函数的调试输出，并尝试修改 `motor.voltage_sensor_align `的值。

## 步骤 6. 基于电流检测的完整 FOC 运动控制（如支持）

当你已完成电机、位置传感器、驱动器和电流检测模块的配置与测试后，即可尝试真正的磁场定向控制（Field Oriented Control, FOC）。

- 要从基于电压的转矩控制切换到基于电流的转矩控制，只需将 `motor.torque_controller` 变量改为` TorqueControlType::foc_current`，并将 `motor.controller` 变量设置为` MotionControlType::torque`。
- 另一种切换到电流控制模式的方法是通过 `Commander` 接口借助串口终端操作：
  - 要启动电流控制模式，在串口终端中输入 `MT2` 并按回车。
    - 要设置目标电流，在串口终端中输入 `M0.5`（单位：安培）并按回车，这会将目标电流设置为 0.5 安培。
    - 要停止电机，在串口终端中输入 `M0` 并按回车，这会将目标电流设置为 0。
  - 要返回电压控制模式，在串口终端中输入 `MT0` 并按回车。
  - 有关 `Commander` 接口的更多信息，请参见 [Commander 文档](commander_interface)。


<blockquote class="info"> <p class="heading">☑️ 简单测试</p> 

1. 将目标电流设置为 <b>0 安培</b>，尝试用手转动电机，确保感觉完全无阻力，就像电机未启用一样。

2. 然后尝试设置一个较小的电流值（<b><0.5 安培</b>），观察是否能感受到电机对人手施加的作用力。若能感受到，则说明一切就绪，可以进行后续操作！
</blockquote>


电流控制模式有额外的配置参数，要使电机运行平稳且稳定，可能需要配置这些参数。有关这些参数的更多信息，请参见 [转矩控制文档](torque_control)。


不过，最重要的技巧仍是使用 [Commander 接口](commander_interface) 来调整转矩控制的 PID 控制器和低通滤波器参数。通过这种方式，你可以实时修改和测试控制器参数，观察其效果。满意后，可将这些参数写入代码，不再使用 Commander 接口。

### 步骤 6.1. 速度和角度控制

当电流控制功能正常工作后，你可以继续进行速度和角度运动控制。
- 要从电流控制切换到速度控制，只需将 `motor.controller` 变量改为 `MotionControlType::velocity`，并将 `motor.target` 设置为所需速度（单位：弧度 / 秒 RAD/s）。
- 要从电流控制切换到角度控制，只需将 `motor.controller` 变量改为 `MotionControlType::angle`，并将 `motor.target` 设置为所需角度（单位：弧度 RAD）。
- 你也可以使用 `Commander` 接口，通过 `MC1` 和 `MC2` 命令切换到速度和角度控制模式。

速度和角度运动控制模式有额外的配置参数，要使电机运行平稳且稳定，可能需要配置这些参数。有关这些参数的更多信息，请参见 [运动控制文档](closed_loop_motion_control)。

