---
layout: default
title: 开环位置控制
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /angle_openloop
nav_order: 2
parent: 开环控制
grand_parent: 运动控制
grand_grand_parent: 代码
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 开环位置控制
该模式无需设置任何位置传感器，而控制无刷直流电机达到所期望的角度。该模式设置如下：

```cpp
// 设置开环位置控制
motor.controller = MotionControlType::angle_openloop;
```
<script type="text/javascript">
    function show(id){
        Array.from(document.getElementsByClassName('gallery_img')).forEach(
        function(e){e.style.display = "none";});
        document.getElementById(id).style.display = "block";
        Array.from(document.getElementsByClassName("btn-primary")).forEach(
        function(e){e.classList.remove("btn-primary");});
        document.getElementById("btn-"+id).classList.add("btn-primary");
    }
</script>
<a href ="javascript:show(0);" id="btn-0" class="btn  btn-primary">电压限制</a>
<a href ="javascript:show(1);" id="btn-1" class="btn">电流限制</a>
<a href ="javascript:show(2);" id="btn-2" class="btn ">反电势补偿的电流限制</a>

<img style="display:display" id="0" class="gallery_img " src="extras/Images/open_loop_angle (3).png"/>
<img style="display:none" id="1" class="gallery_img " src="extras/Images/open_loop_angle (1).png"/>
<img style="display:none" id="2" class="gallery_img " src="extras/Images/open_loop_angle (2).png"/>

你可以通过运行 `motion_control/open_loop_motor_control/` 文件夹中的示例来测试这个算法。

这种控制算法非常简单。用户设定目标角度 <i>a<sub>d</sub></i>。算法只需要将当前角度 <i>a<sub>c</sub></i> 和期望角度 <i>a<sub>d</sub></i>相减来确定所需转动的方向，然后以可能的最高速度`motor.velocity_limit`（实际最大的速度）朝该方向转动。而为了设置这个转速，它使用了 [速度开环控制](velocity_openloop)相同的算法，即对目标速度进行积分，计算出所需设置到电机a<sub>c</sub>的值。然后，通过 `SinePWM` 或者 `SpaceVectorPWM` 调制，在a<sub>c</sub>的方向上施加电机的最大允许电压 `motor.voltage_limit` 。

```cpp
// 计算目标位置距离
d_angle = target_angle - past_angle;
// 用最大允许位移限制距离
d_angle = constrain(d_angle, -velocity_limit*d_time, velocity_limit*d_time)
// 计算下一角度
next_angle = past_angle + d_angle;
```

## 配置
``` cpp
// 选择FOC调制类型（可选的）
motor.foc_modulation = FOCModulationType::SpaceVectorPWM;

// 位置控制最大速度
// 默认为20
motor.velocity_limit = 20;

// 限制电压
motor.voltage_limit = 3;   // Volts
// 限制电流 - 如果相电阻给定
motor.current_limit = 0.5 // Amps

```

角度开环控制（如果没有提供相电阻）需设置电机电压等于 `motor.voltage_limit`

```cpp
voltage = voltage_limit; // Volts
```

由于不同电机相电阻不同，在相同电压值下会产生截然不同的电流，因此这种方式是很低效的。

对云台电机来说，由于它的相电阻通常为5-15欧姆，因此在电压限制为5-10V的开环电路中运行，它的电流能达到0.5-2A。而对无人机电机来说，由于它的相电阻仅为0.05-0.2欧姆，因此电压限制应低于1伏。

### 电流限制方法

我们建议你设置相电阻 `phase_resistance` ，然后设置电机的电流限制 `motor.current_limit` 来代替电压限制。这个所设定的电流可能会超，但至少你清楚电机运行时的电流近似值。你可以通过电机相电阻`phase_resistance` 来估算出大致的电流：

```cpp
voltage = current_limit * phase_resistance; // Amps
```
使用这种控制策略的最佳方式是提供电机相电阻值和KV值。这样 Library 库能够计算出反电动势电压和预测出更加精确的消耗电流。有了电流和反电动势电流，Library 库能够给电机设定更加合适的电压。

```cpp
voltage = current_limit*phase_resistance + desired_velocity/KV; // Amps
```

### 速度限制

你的电机从一个位置到另一个位置的速度取决于设置的最大转速 `motor.velocity_limit` 。该值越高，位置切换就越快。但由于当前模式为开环开环控制，无法获知电机是否能按照这个转速运行，因此要确保 `velocity_limit`这个值是电机所能达到的值。当然也要注意要实现更高的转速和力矩，就要提高`motor.voltage_limit` 变量或电动机 `motor.current_limit` 的值。

### 实时改变限制

此外，有需要的话，你可以实时改变电压限制 `motor.voltage_limit` (`motor.current_limit`) 和转速限制 `motor.velocity_limit` 

## 开环位置控制实例
这里是一个基本的开环位置控制以及完整的配置的例程。该例程将目标位置设定并保持在 ` 0RAD` ，用户可以通过串口终端改变目标位置。

```cpp
// 开环电机控制实例
#include <SimpleFOC.h>

// 无刷直流电机及驱动器实例
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// commander实例化
Commander command = Commander(Serial);
void doTarget(char* cmd) { command.scalar(&motor.target, cmd); }
void doLimitVolt(char* cmd) { command.scalar(&motor.voltage_limit, cmd); }
void doLimitVelocity(char* cmd) { command.scalar(&motor.velocity_limit, cmd); }

void setup() {

  // 配置驱动器
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接电机和驱动器
  motor.linkDriver(&driver);

  // 限制电机运动
  motor.voltage_limit = 3;   // [V]
  motor.velocity_limit = 5; // [rad/s] cca 50rpm
  // 配置开环控制
  motor.controller = MotionControlType::angle_openloop;

  // 初始化电机
  motor.init();
  motor.initFOC();

  // 添加目标命令T
  command.add('T', doTarget, "target angle");
  command.add('L', doLimitVolt, "voltage limit");
  command.add('V', doLimitVelocity, "velocity limit");

  Serial.begin(115200);
  Serial.println("Motor ready!");
  Serial.println("Set target position [rad]");
  _delay(1000);
}

void loop() {
  motor.loopFOC(); 
  // 开环角度运动
  // 使用电机电压限制和电机速度限制
  motor.move();
  
  // 用户通信
  command.run();
}
```