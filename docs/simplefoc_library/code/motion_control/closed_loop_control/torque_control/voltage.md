---
layout: default
title: 基于电压
parent: Torque Control
grand_parent: Closed-Loop control
grand_grand_parent: Motion Control
grand_grand_grand_parent: Writing the Code
grand_grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /voltage_torque_mode
nav_order: 1
---

# 基于电压的力矩控制

基于电压的力矩控制能够像直流电机那样控制直流无刷电机，即设置目标电压U<sub>q</sub>，然后FOC算法计算出所需的相电压u<sub>a</sub>，u<sub>b</sub>和u<sub>c</sub>达到顺滑控制效果。该模式设置如下：

```cpp
// 基于电压的力矩控制模式
motor.torque_controller = TorqueControlType::voltage;
```
以下用电压控制电机力矩的三种不同方法，需要具备电机机械参数的不同知识：
- [纯电压控制](#pure-voltage-control) - 不需要电机参数
- [假定电流控制](#voltage-control-with-current-estimation) - 需相电阻值
- [带反电动势能补偿的假定电流控制](#voltage-control-with-current-estimation-and-back-emf-compensation) - 需相电阻和电机KV值

基于电压控制的三种力矩控制技术框图可以表示为：
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
<a href ="javascript:show(0);" id="btn-0" class="btn btn-primary">电压控制</a>
<a href ="javascript:show(1);" id="btn-1" class="btn">电压控制+相电阻</a>
<a href ="javascript:show(2);" id="btn-2" class="btn">电压控制+相电阻+KV值</a>

<img style="display:block" id="0" class="gallery_img" src="extras/Images/voltage_loop_0000.jpg"/>
<img style="display:none" id="1" class="gallery_img" src="extras/Images/voltage_loop_0001.jpg"/>
<img style="display:none" id="2" class="gallery_img" src="extras/Images/voltage_loop_0002.jpg"/>

## 纯电压控制

<a name="foc_image"></a><img src="extras/Images/voltage_loop_0000.jpg">

电压控制算法从位置传感器读取角度a，从用户获取目标U<sub>q</sub>电压值，并使用FOC算法为电机设定适当的U<sub>a</sub>， U<sub>b</sub>和U<sub>c</sub>电压。FOC算法确保这些电压在电机转子中产生的磁力与电机的永磁场恰好有 <i>90度</i> 偏移，从而保证转矩最大，这称为换向。

纯电压控制假设电机中产生的转矩（与电流I = k \tau成正比）与用户设定的电压U<sub>q</sub>成正比。最大转矩对应的最大U<sub>q</sub>受电源可输入电压限制，最小转矩就是U<sub>q</sub> = 0。
$$
U_q \approx I = k\tau
$$

<blockquote class="warning">
<p class="heading">⚠️ 实际限制</p> 
这种力矩控制方法设置最简单、最快捷，它不以任何方式限制电流!
</blockquote>



### 预期电机运转行为
如果用户设定所需电压U<sub>q</sub> 为 0 A，电机应不运转并有少量电阻。电阻虽不算大，但比电机与驱动器断开时更大。

而如果设定一个所需电压U<sub>g</sub>到特定值，电机应开始运转，达到的速度会与电压U<sub>q</sub>成正比。这种运转行为非常类似于通过改变电线上的电压来控制直流电机。




## 带假定电流的电压控制

这种力矩控制策略框图如下：

<a name="foc_image"></a><img src="extras/Images/voltage_loop_0001.jpg">

如果用户给定电机相电阻值 R， 然后设定所需电流I<sub>d</sub>（生成所需力矩I<sub>d</sub>= K<sub>Td</sub>) ，library库会自动计算出适当的电压U<sub>q</sub>。

$$
U_q = I_d R = (k\tau_d) R
$$

用户可以通过建构指定电机的相电阻，如下所示：

```cpp
// BLDCMotor(pole pair number极对数, phase resistance相电阻)
BLDCMotor motor = BLDCMotor( 11, 2.5 );
```
或者单纯通过设置参数:
```cpp
motor.phase_resistance = 2.5; // 如：2.5 Ohms
```

<blockquote class="warning">
<p class="heading">⚠️ 实际限制</p> 
在某些情况下，电机中产生的电流可能高于所需电流I<sub>d</sub>，但应保持在同一数量级。你对相阻值R越了解，假定电流就会工作得越好。

然而，由于电流I<sub>d</sub>不仅仅依赖于电压U<sub>q</sub>，还依赖于反电势电压，因此这种电流假定策略是非常有限的。这种关系  (U<sub>q</sub>=I<sub>d</sub>R)  仅在电机不转动（没有产生反电动势电压）时为真。如果电机转动，产生的反电动势电压将降低电机电压的设定值 \(I<sub>d</sub>R = U<sub>q</sub> - U<sub>bemf</sub>\)。这种方法实际上限制了只有在电机静止时，可以给电机设定到期望电流 (I<sub>d</sub>\) ，一旦电机移动，设置到电机的实际电流就会降低。


关于力矩控制理论的更多信息，请查看 [深入挖掘部分](digging_deeper) 或者直接去 [力矩控制理论中心](voltage_torque_control).

### 预期电机运转行为
如果用户设定期望电流为 0 A，电机应不运转并有少量电阻。电阻虽不算大，但比电机与驱动器断开时更大。

而如果设定期望电流到特定值，电机应开始运转，达到的速度会与设定的电流I<sub>d</sub>成正比。

<blockquote class="info">
<p class="heading"> 电流I<sub>d</sub>>0时，电机无法运转</p>
如果期望电流已设定为非0的数值，但电机仍不能运转，可能是相电阻过低，可以尝试增加它。
</blockquote>



## 带假定电流和反电动势能的电压控制

这种力矩控制策略框图如下：

<a name="foc_image"></a><img src="extras/Images/voltage_loop_0002.jpg" >

如果用户给定电机相电阻值 R 和电机 KV 值， 然后直接设定所需电流I<sub>d</sub>（生成所需力矩I<sub>d</sub>= K<sub>Td</sub>) ，library库会自动计算出适当的电压U<sub>q</sub>。与此同时，通过获取电机速度V补偿产生的反电动势电压。
$$
U_q = I_d R + U_{bemf}= (k\tau_d) R + \frac{v}{KV}
$$

用户可以通过建构指定电机的相电阻和KV值，如下所示：
```cpp
// BLDCMotor(极对数, 相电阻, KV值[rpm/V])
BLDCMotor motor = BLDCMotor( 11, 2.5, 120 );
```

<blockquote class="info">
<p class="heading"> 经验法则：KV值 </p> 
电机KV值是设定电压（U<sub>q</sub>）为1V时，电机每分钟的转速。如果不知道你电机的KV值，可以用library库简单测量。在电压模式下运行电机，并将目标电压设置为1V，读取电机速度。<span class="simple">Simple<span class="foc">FOC</span>library</span>显示速度单位为rad/s，要将其转化为rpm，只需乘以30/π≈10。 <br><br>
如上所述，电机反电动势能常数总是略少于KV值的倒数（k<sub>bemf</sub><1/KV）。根据经验应设定KV值比数据表给定或实验的数值高10-20%。<br>

有了相电阻R值和KV值， <span class="simple">Simple<span class="foc">FOC</span>library</span> 库能够给电机设定假定电流。若电机参数无误，足以让用户进行电机力矩控制😄。

<blockquote class="warning">
<p class="heading">⚠️ 实际限制</p> 
反电动势电压是 (U<sub>bemf</sub>=k<sub>bemf</sub>v) 。而由于电机BEMF常数并不会完全符合k<sub>bemf</sub>=1/KV，基于电机KV值计算出来的反电动势电压也仅是一个近似值。
而显示的反电动势常数通常会略微小于KV值的倒数：k<sub>bemf</sub>=1/KV
</blockquote>



### 预期电机运转行为

如果用户设置所需的电流为0A，电机的电阻会非常低，远低于上述两种转矩控制策略，电机应该会断开。

<blockquote class="info">
<p class="heading"> 电流为0时，电机运转</p>
如果期望电流设定为0，但你手上正在运转的电机保持继续运转，没有完全停止，可能是你的KV值过高，可以尝试降低它。
</blockquote>

当设定一个特定的期望电流I<sub>d</sub>，电机会加速到最大速度。它的加速度值与电机转矩成正比，并与当前I<sub>d</sub>成正比。所以若电流较大，你的电机会加速得更快，若电流较小，它会加速得更慢。但对于无负载电机，无论设定的目标电流I<sub>d</sub>是多少，电机都应达到最大速度。

<blockquote class="info">
<p class="heading"> 电流I<sub>d</sub>>0时，电机无法运转</p>
如果期望电流已设定为非0的数值，但电机仍不能运转，可能是相电阻过低，可以尝试增加它。
</blockquote>

更多关于力矩控制理论部分的信息，请查阅 [深入挖掘部分](digging_deeper) 或 [力矩控制理论中心](voltage_torque_control)。



## 力矩控制示例代码
下面是一个简单的基于电压的力矩控制，可以在串行的commander接口设定目标 **current** 。

```cpp
#include <SimpleFOC.h>

// 无刷直流电机及驱动器实例
BLDCMotor motor = BLDCMotor(11);
BLDCDriver3PWM driver = BLDCDriver3PWM(9, 5, 6, 8);

// 编码器实例
Encoder encoder = Encoder(2, 3, 500);
// 回调通道A和B
void doA(){encoder.handleA();}
void doB(){encoder.handleB();}

// commander实例化
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup() { 
  
  // 初始化编码传感器硬件
  encoder.init();
  encoder.enableInterrupts(doA, doB); 
  // 连接电机和传感器
  motor.linkSensor(&encoder);

  // 配置驱动器
  // 电源电压 [V]
  driver.voltage_power_supply = 12;
  driver.init();
  // 连接驱动器
  motor.linkDriver(&driver);

  // 设置力矩控制类型：
  motor.phase_resistance = 12.5; // 12.5 Ohms
  motor.torque_controller = TorqueControlType::voltage;
  // 设置运动控制环
  motor.controller = MotionControlType::torque;

  // 监视串口
  Serial.begin(115200);
  // 如果不需要，可以注释掉此行
  motor.useMonitoring(Serial);

  // 初始化电机
  motor.init();
  // 校准编码器，启用FOC
  motor.initFOC();

  // 添加目标命令M
  command.add('M', doMotor, "motor");

  Serial.println(F("Motor ready."));
  Serial.println(F("Set the target current using serial terminal:"));
  _delay(1000);
}

void loop() {

  // FOC算法主函数
  motor.loopFOC();

  // 运动控制函数
  motor.move();

  // 用户通信
  command.run();
}
```