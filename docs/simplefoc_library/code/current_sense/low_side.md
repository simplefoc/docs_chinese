# 低侧电流检测
低侧电流检测可能是最常见的电流检测技术。主要原因是它既不需要高性能PWM抑制电流检测放大器（如在线检测放大器），也不需要支持高压的放大器（如高侧放大器）。采样电阻始终置于低侧MOSFET和地之间，确保放大器的端子上始终具有非常低的电压。这种方法的主要缺点是，由于只有相应的低侧mosfet开启时，通过采样电阻的电流才是相电流，而我们只能在这些时刻测量到相电流。PWM频率通常为20至50 kHz，这意味着低侧MOSFET每秒开关20000至50000次，因此PWM设置和ADC采集之间的同步非常重要。

低侧电流检测已经纳入我们的开发路线图，并已开启了实质性工作。因为这里的主要工作是在不同硬件条件下完成PWM波形产生和ADC触发的同步，因此我们只能区分逐个MCU架构进行测试。😃


<img src="extras/Images/low-side.png" class="width50">
<img src="extras/Images/low_side_sync.png" class="width40">


+
## 电流检测支持的 MCU 

低侧电流检测现已支持许多基于<span class="simple">Simple<span class="foc">FOC</span>library</span>的MCU。ESP32 具有最广泛的支持，每个芯片支持多个电机。现刚开始支持 Stm32 系列 f1、f4 和 g4，初代仅支持单电机的低侧电流检测。 其中，stm32 中 有一个特例 BG431_ESC1 开发套件。它的硬件配置具有与众不同的特性，库可以完全支持其实现低侧电流检测。 我们正在开发 Samd21，初代仅支持单电机，但目前尚未经过广泛测试，我们建此方案不要完全依靠我们实现。

MCU | 低侧电流检测           
--- | --- 
Arduino (8-bit) |  ❌
Arduino DUE  |  ❌
stm32 (in general) |❌ 
stm32f1 family | ✔️ (单电机) 
stm32f4 family | ✔️ (单电机) 
stm32g4 family | ✔️ (单电机) 
stm32 B_G431B_ESC1 | ✔️ 
esp32 |✔️ 
esp8266 | ❌ 
samd21 | ✔️/❌ (单电机，测试不佳) 
samd51 | ❌ 
teensy |  ❌
Raspberry Pi Pico | ❌
Portenta H7 |  ❌


### 重要硬件的考虑因素

低端电流检测要求`驱动器` 和 ADC 触发产生的 PWM 高度同步。 因此，选择`驱动器`参数时，有以下两个主要考虑因素：

1. PWM 频率
2. PWM 引脚


更多驱动器参数，请查阅 [驱动器文档](drivers_config)!

####  1. PWM 频率考虑

由于 ADC 转换需要一些时间才能完成，而且这种转换只能在特定的时间窗口内发生（当所有相位都接地 - 低侧 MOSFET 导通时），所以适当的 PWM 频率尤为重要。 PWM 频率将决定 PWM 的每个周期有多长，以及低侧开关开启的时间。 较高的 PWM 频率将使 ADC 读取当前值的时间更短。

此外，更高的 PWM 频率有助于更流畅的运行，因此在这显然需要做出取舍。

<blockquote class="info">
<p class="heading">经验法则: PWM 频率</p>
根据经验判断，应保持在 20kHz 左右。

<code class="highlighter-rouge">
driver.pwm_frequency = 20000;
</code>
</blockquote>

####  2. PWM 引脚考虑

由于ADC 转换必须与所有相位生成的 PWM 同步，因此对齐所有相位生成的 PWM至关重要。 此外，单片机的引脚上通常有多个用于产生 PWM 的计时器，因此不同架构的单片机在不同计时器下产生的 PWM 之间的对齐状况不同。

<blockquote class="info">
<p class="heading">经验法则：PWM 计时器引脚</p>
为了尽可能保证低测电流检测运作正常，我们建议你为你的驱动器选择同属一个计时器的 PWM 引脚。
要想知道哪些引脚属于不同的计时器，你可能需要花费一些时间从 MCU 数据表寻找
此外，你也可以在社区寻求帮助 - <a href="https://community.simplefoc.com/">社区链接</a>!
</blockquote>

我们建议使用如下代码结构：

```cpp
void loop(){
  .... 
  // 初始化驱动器
  driver.init();
  // 连接驱动器到电流检测
  current_sense.linkDriver(&driver);
  ....
  // 初始化电机
  motor.init();
  .... 
  // 初始化电流检测
  current_sense.init();
  // 连接电流检测到电机
  motor.linkCurrentSense(&current_sense);
  ...
  // 启动 FOC
  motor.initFOC();
}
```
函数 `initFOC()` 能确保 `BLDCDriver` 和 `LowsideCurrentSense` 两个类校准对齐。尤为重要的是电流检测的 `A` 相要恰好为驱动器的 `A` 相， `B` 相要恰好是驱动器的 `B`相， `C`相亦如此。 为了验证这点，`initFOC` 将调用电流检测函数`current_sense.driverAlign(...)`。


## 硬件配置

```cpp
// 电压测电流检测连接
//  - 采样电阻  - 采样电阻阻值
//  - 增益  - 电流检测运放增益
//  - A相   - A相 ADC输入引脚
//  - B相   - B相 ADC输入引脚
//  - C相   - C相 ADC输入引脚 (可选)
LowsideCurrentSense current_sense  = LowsideCurrentSense(0.01, 20, A0, A1, A2);
```
使用Simple<span class="foc">FOC</span>library提供的LowsideCurrentSense类创建低侧电流检测实例。该类的参数主要是：采样电阻阻值、运放增益、2相或3相的ADC输入引脚（取决于具体硬件）。电机相序与的ADC通道的正确对应关系至关重要，例如：如果A0引脚检测A相电流，则A1引脚检测B相电流,以此类推。

<blockquote class="info">
矢量控制控制算法可以在2相电流检测和3相电流检测模式下运行.
</blockquote>

LowsideCurrentSense类的构造函数只允许配置一个采样电阻阻值和一个运放增益。如果你的硬件条件是各相采样电阻和增益不相同，可以通过配置`gain_x`属性。

```cpp
// 各项增益的默认值
current_sense.gain_a = 1.0 / shunt_resistor / gain;
current_sense.gain_b = 1.0 / shunt_resistor / gain;
current_sense.gain_c = 1.0 / shunt_resistor / gain;
```

已  [AliExpress DRV8302 board](https://fr.aliexpress.com/wholesale?catId=0&initiative_id=SB_20211003032006&SearchText=bldc+drv8302)板为例， has all the current sensing phases inverted inverted该板各相均被反相，故你可按照如下代码实现配置：
```cpp
// 增益反相
current_sense.gain_a *= -1;
current_sense.gain_b *= -1;
current_sense.gain_c *= -1;
```

一旦current sense实例创建即可被立即进行初始化。`init()`函数用来配置ADC硬件的读操作和ADC通道的零值偏置。

```cpp
// 初始化current sens
current_sense.init();
```
完成了current sens的初始化和校准后，就可以开始电流检测了。

## 使用current sense的FOC算法
使用LowsideCurrentSense的FOC算法，你只需将current_sense连接至需要使用`BLDCMotor`：

```cpp
// 连接current_sense与无刷电机
motor.linkCurrentSense(&current_sense);
```
The `BLDCMotor` class in the `initFOC()` function where it aligns all the sensors, will align the `LowsideCurrentSense` with the `BLDCDriver` that is linked to the motor. 

  `BLDCMotor`类的`initFOC()` 函数用于校准所有传感器的相位对齐，它将与`BLDCDriver` 连接的`LowsideCurrentSense` 进行连接校准。

```cpp
// 为FOC准备传感器
motor.initFOC();
```
 `initFOC()` 会调用两个current sense 类中至关重用的函数：

- `current_sense.driverSync(...)`
- `current_sense.driverAlign(...)`

### 驱动同步函数`driverSync(...)`
<img src="extras/Images/low_side_sync.png" class="width40"> 

低侧电流采样技术需要在所有低侧mosfets位于导通（各相接地）状态时，使用`driverSync()`严格同步触发驱动PWM和ADC采样。

### 电机相序对齐 `driverAlign(...)`

使用该函数完成`initFOC` 中的电流检测和驱动器对齐

```cpp
current_sense.driverAlign(voltage_sensor_align);
```
该函数使用`驱动器` 实例（连接电流检测到`current_sense.linkDriver(&driver)`输出各相电压（电压可以使用参数 `motor.voltage_sensor_align`设置）并检查所测得的电流是否与输出电压方向一致。

此对齐过程能够纠正以下错误:

- adc引脚错误 
- 增益符号错误

如果在initFOC方法中使能了[monitoring](monitoring)选项，则在对齐过程中对显示如下信息：

 - `0` - 失败
 - `1` - 成功，为改变配置
 - `2` - 成功，引脚被重新配置
 - `3` - 成功，增益方向改变（极性）
 - `4` - 成功，引脚被重新配置、增益方向改变

如果你确认自己的配置正确，想跳过对齐的过程，可以在调用`motor.initFOC()`语句前置位skip_align标志，如下：

```cpp
// 跳过对齐过程
current_sense.skip_align = true;
```

以 [AliExpress DRV8302 开发板](https://fr.aliexpress.com/wholesale?catId=0&initiative_id=SB_20211003032006&SearchText=bldc+drv8302)，结合Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v2为例 , 你可以使用如下代码：

```cpp
+// SimpleFOCShield v2 一种可能实现的电流检测引脚组合
// 分流电阻 - 5milliOhm
// 增益  -  12.22 V/V 
LowsideCurrentSense current_sense = LowsideCurrentSense(0.005f, 12.22f, IOUTA, IOUTB, IOUTC);

voi loop(){
  .... 
  // 初始化驱动板
  driver.init();
  // 连接驱动板到电流检测
  current_sense.linkDriver(&driver);
  ....
  // 初始化电机
  motor.init();
  .... 
  // 初始化电流检测
  current_sense.init();
  // 连接电流检测到电机
  motor.linkCurrentSense(&current_sense);
  ...
  // 改变B相增益方向
  current_sense.gain_a *=-1;
  current_sense.gain_b *=-1;
  current_sense.gain_c *=-1;
  // 跳过对齐
  current_sense.skip_align = true;
  ... 
  // 启动 FOOC
  motor.initFOC();
}
```

基于 AliExpress DRB8302 板子的完整例程参阅library库例程 `/examples/hardware_specific_examples/DRV8302_driver/esp32_current_control_low_side`.

## 独立电流检测

由于低侧电流检测必须与对应的驱动器的PWM进行同步，因此将其作为独立传感器使用是没有意义的。但你如果对 `BLDCMotor`（无刷电机）电流感兴趣，你可以使用它来查阅你相电流，总电流大小和DQ电流的信息。

读取相电流可以通过执行下述语句实现：

```cpp
PhaseCurrent_s  current = current_sense.getPhaseCurrents();
```
该函数返回了一个包含了a,b,c三个变量的 `PhaseCurrent_s` 结构体，你可以打印出来如下：

```cpp
Serial.println(current.a);
Serial.println(current.b);
Serial.println(current.c); // 2相模式时输出为0
```
如果你在 `LowsideCurrentSense`中配置为2相模式，则第三相返回值电流值为0.

有时相电流很难解释，因此这个电流检测类使您能够读取转换后的电流矢量大小。电机输出的是绝对直流电流。

```cpp
float current_mag = current_sense.getDCCurrent();
```

此外，如果你有一个连接到驱动器的电机的位置传感器，你可以通过提供给 `getDCCurrent` 方法得到电机此时的直流电流的符号值。

```cpp
float current = current_sense.getDCCurrent(motor_electrical_angle);
```

最后，如果你有电机位置传感器，current sense类将获取当前的FOC电流、D值和Q值。

```cpp
DQCurrent_s current = current_sense.getFOCCurrents(motor_electrical_angle);
```
该函数返回了一个包含d,q两个变量的结构体 `DQCurrent_s` ，可以将他们打印显示如下：

```cpp
Serial.println(current.d);
Serial.println(current.q);
```

### 例程
下面是一个使用SimpleFOC库的低侧模式并直接读取电机电路的简单例程：

```cpp
#include <SimpleFOC.h>


// 定义电机和驱动
motor = ...
driver = ...

// 电路传感器
// 采样阻值
// 增益
// A，B相连接引脚
LowsideCurrentSense current_sense = LowsideCurrentSense(0.01, 50.0, A0, A2);

void setup() {

  // 初始化驱动
  driver.init();
  current_sense.linkDriver(&driver);
  ...

  // 初始化电机
  motor.init();
  ...

  // 初始化电流传感器
  current_sense.init();
  motor.linkCurrentSense(&current_sense);
  
  ...
  motor.initFOC();
  ...

  Serial.begin(115200);
  Serial.println("Setup ready.");
}

void loop() {
    // foc和监控
    motor.loopFOC();
    motor.move();

    PhaseCurrent_s currents = current_sense.getPhaseCurrents();
    float current_magnitude = current_sense.getDCCurrent();

    Serial.print(currents.a*1000); // 毫安
    Serial.print("\t");
    Serial.print(currents.b*1000); // 毫安
    Serial.print("\t");
    Serial.print(currents.c*1000); // 毫安
    Serial.print("\t");
    Serial.println(current_magnitude*1000); // 毫安
}
```