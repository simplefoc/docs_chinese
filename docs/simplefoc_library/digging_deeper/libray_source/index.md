---
layout: default
title: Arduino SimpleFOClibrary 源代码
nav_order: 1
parent: Digging deeper
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /source_code
has_children: True
has_toc: false
---

# Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 源代码[v2.1](https://github.com/simplefoc/Arduino-FOC/releases)
arduino库代码被组织成标准 [Arduino library structure（Arduino的库结构）](https://github.com/arduino/Arduino/wiki/Library-Manager-FAQ)。
该库包含两种类型的无刷直流电机的FOC实现，即 `BLDCMotor` 的标准三相无刷直流电机和`StepperMotor`的两相步进电机。该库实现了许多位置传感器，它们都位于 `senors`目录以及 `drivers`目录中的驱动程序中。该库还实现了电流传感器，它们被放在 `current_sense`目录中，以及几个通信接口，被放在`communication`文件夹中。最后，所有实用程序函数和类都放在 `common`文件夹中。

## Arduino的库代码结构
```sh
| src
| ├─ SimpleFOC.h               # 主要包括文件
| | 
| ├─ BLDCMotor.cpp/h           # 无刷直流电机操作类
| ├─ StepperMotor.cpp/h        # 步进电机操作类
| |
│ ├─── common                  # 包含所有通用实用程序类和函数
| ├─── drivers                 # PWM设置和驱动程序处理的具体代码
| ├─── sensors                 # 位置传感器专用码
| ├─── current_sense           # 实现实行检测
| ├─── communication           # 实现通信协议
```

<blockquote class="info">更多信息，请访问<a href="http://source.simplefoc.com/" target="_blank"> full source code documentation <i class="fa fa-external-link fa-sm"></i></a></blockquote>

## 电机
### `BLDCMotor.cpp/h`
无刷直流电机的实现
- FOC算法的实现
- 运动控制实现

### `StepperMotor.cpp/h`
无刷直流电机的实现
- FOC算法的实现
- 运动控制实现

<blockquote class="info"><a href="foc_implementation"><i class="fa fa-copy"></i> FOC implementation details</a> ——实现FOC算法代码的详细解释及逐步教程文件。
</blockquote>
<blockquote class="info">
     <a href="motion_control_implementation"><i class="fa fa-copy"></i> Motion control implementation details</a> ——运动控制算法与代码实现选择文件。
</blockquote>



## 驱动器
此库中支持的所有驱动程序都放在驱动程序目录中。
```sh
| ├─── drivers  
| | ├─ BLDCDriver3PWM.cpp/h         # 实现通用3路PWM无刷直流驱动器
| | ├─ BLDCDriver6PWM.cpp/h         # 实现通用6路PWM无刷直流驱动器
| | ├─ StepperDriver2PWM.cpp/h      # 实现通用2路PWM步进电机
| | ├─ StepperDriver4PWM.cpp/h      # 实现通用4路PWM步进电机
| | |      
| | ├─ hardware_api.h               # 常用MCU专用API处理PWM设置和配置
| | |
| | ├─── hardware_specific          # 特定于MCU的 hardware_api.h实现
| | | ├─ atmega2560_mcu.cpp         # 实现ATMega 2560
| | | ├─ atmega328_mcu.cpp          # ATMega 328 (Arduino UNO) implementation
| | | ├─ esp32_mcu.cpp              # 实现esp32
| | | ├─ stm32_mcu.cpp              # 实现stm32 
| | | ├─ teensy_mcu.cpp             # 实现teensy 
| | | └─ generic_mcu./h             # 实现generic - 如不具备上述条件(不完整)
```
所有BLDC驱动程序都能实现抽象类`BLDCDriver`。

```cpp
class BLDCDriver{
    public:
        
        /** 初始化硬件 */
        virtual int init();
        /** 启用硬件 */
        virtual void enable();
        /** 禁用硬件 */
        virtual void disable();

        long pwm_frequency; //!< 以赫兹为单位的PWM频率值
        float voltage_power_supply; //!< 电源电压
        float voltage_limit; //!< 设定到电机的极限电压
            
        //给硬件设置相电压
        //
        // @参数Ua—A相电压
        // @参数Ub—B相电压
        // @参数Uc—C相电压
        virtual void setPwm(float Ua, float Ub, float Uc);
        

        // 设置阶段状态，启用/禁用  
        //
        // @A相状态:主动/禁用(高阻抗)
        // @B相状态:主动/禁用(高阻抗)
        // @C相状态:主动/禁用(高阻抗)
        virtual void setPhaseState(int sa, int sb, int sc) = 0;
};
```
所有的步进驱动程序都能实现`StepperDriver`抽象类。

```cpp
class StepperDriver{
    public:
        
        /** 初始化硬件 */
        virtual int init();
        /** 启用硬件 */
        virtual void enable();
        /** 禁用硬件 */
        virtual void disable();

        long pwm_frequency; //!< 以赫兹为单位的PWM频率值
        float voltage_power_supply; //!< 电源电压
        float voltage_limit; //!< 设定到电机的极限电压
    
        /** 
         * 给硬件设置相电压
         * 
         * @参数Ua相A电压
         * @参数Ub相B电压
        */
        virtual void setPwm(float Ua, float Ub);
};
```

此外，所有支持simplefoc库的MCU体系结构都必须实现头文件`hardware_api.h`。现成支持的体系结构将在`hardware_specific`文件夹中实现`hardware_api.h`。如果你希望实现新的MCU，请至少创建一个新的MCU实例：`my_new_mcu.cpp`  并实现文档中的所有功能，或者至少能实现你需要的功能。

## 传感器

```sh
| ├─── sensors 
| │ ├─ Encoder.cpp/h                # 实现正交编码器操作的编码器类
| │ ├─ MagneticSensorSPI.cpp/h      # 实现磁性传感器的SPI通信
| │ ├─ MagneticSensorI2C.cpp/h      # 实现磁性传感器的I2C通信
| │ ├─ MagneticSensorAnalog.cpp/h   # 实现磁性传感器的模拟输出
    └─ HallSensor.cpp/h             # 实现霍尔传感器
```
该库能实现的所有位置传感器类目都放置在该目录里，所有这些都将实现抽象传感器类`Sensor`。为了能够连接上电机 (`BLDCMotor` 和 `StepperMotor` )，每个传感器都需要执行`Sensor` 。如果你想实现自己版本的传感器，请扩展该类并实现虚拟函数，你将能够使用它运行FOC算法。
你可以通过执行`motor.linkSensor(your sensor)`来连接电机和传感器

```cpp
class Sensor{
public:
    // 获得实时角度(rad) 
    virtual float getAngle() = 0;
    // 获得实时角速度(rad/s)
    // 初始-可被覆盖
    virtual float getVelocity();

    // 如果确实需要搜索绝对零，则返回0
    // 1 - encoder with index (引脚还没有找到)
    // 0 - everything else (& 编码器引脚被发现)
    // 初始为默认返回0
    virtual int needsSearch();
}
```

## 电流检测

```sh
| ├─── current_sense 
| │ ├─ InlineCurrentSense.cpp/h     # 实现内联电流传感器
| | |
| | ├─ hardware_api.h               # 常用MCU专用API处理adc设置和配置
| | |
| | ├─── hardware_specific          # 特定于MCU的 hardware_api.h 实现
| |   └─ generic_mcu./h             # 通用实现——目前通用 MCU 完成这项工作
```
所有的Current Sense类都实现了`CurrentSense`接口。这个接口仍然是全新的并且可能随着更多的电流控制环被实现而在将来的版本中进行更改。

```cpp
class CurrentSense{
    public:

    // 函数初始化CurrentSense
    // adc和同步的所有初始化都在这里实现
    virtual void init() = 0;
    
    // 函数读取相电流a, b和c
    //   这个函数将通过函数与foc控件一起使用
    //   CurrentSense::getFOCCurrents(electrical_angle)
    //   - 如果只有两个相位测量可用，则返回电流c等于0
    //
    //  @返回PhaseCurrent_s当前值
    virtual PhaseCurrent_s getPhaseCurrents() = 0;
    // 函数读取设定到电机上的电流大小
    //  如果可能的话，它返回绝对值或带符号的大小
    //  它可以接收电机的电角度来帮助计算
    //  此函数与当前控件一起使用(不是foc)
    //  
    // @参数 angle_el - 电机的电气角度(可选)
    virtual float getDCCurrent(float angle_el = 0);

    // 用于FOC控制，读取电机的DQ电流
    //   它在内部使用getPhaseCurrents函数
    // 
    // @参数 angle_el - 电机的电气角度
    DQCurrent_s getFOCCurrents(float angle_el);

    // 驱动同步和校准功能

    //用于实现与驱动程序同步和电流传感所需的所有功能。
    // 如果不需要这样的东西，它可以被保留为空(返回1)
    // @返回 0-表示失败，1-表示成功
    virtual int driverSync(BLDCDriver *driver) = 0;
    //用于验证，是否:
    //   - 相电流方向正确 
    //   - 它们的顺序与驱动阶段相同
    // 
    // 这个函数会纠正对齐错误，如果不需要这样的东西，它可以保留为空(返回1)。
    // @返回 0-表示失败;返回正数(带状态)表示成功
    virtual int driverAlign(BLDCDriver *driver, float voltage) = 0;
    
    bool skip_align = false; //!< 在 initFOC() 期间应验证相电流方向的可变信号
};
```

## 通信

```sh
| ├─── communication 
| │ ├─ Communicator.cpp/h     # 实现Commander交互接口
| │ ├─ commands.h             # 命令列表定义
| | |
| │ └─ StepDirListener.cpp/h  # 实现Step/dir 监听器
```

此文件夹包含所有内置支持的通信协议。

### `Commander.cpp/h`
Commander class 工具
- 灵活的g码式通信
- 串行通信的处理
- 内置处理 `FOCMotor`、`PIDController`和`LowPassFilter`
- 其他...
<blockquote class="info">
     <a href="commander_interface"><i class="fa fa-copy"></i> Commander functionality </a> ——commander class文档
</blockquote>
<blockquote class="info">
     <a href="commands_source"><i class="fa fa-copy"></i> Commands list </a> ——motor commands functionality文档
</blockquote>


### `StepDirListener.cpp/h`
StepDirListener class 工具
- step+dir通信协议的简单实现
<blockquote class="info">
     <a href="step_dir_interface"><i class="fa fa-copy"></i> Step/direction listener functionality </a> ——step dir listener class文档
</blockquote>



## 通用
```sh
│ ├─── common                  # 包含所有通用实用程序类和函数
| | |
| | ├─ defaults.h              # 默认运动控制参数
| | ├─ foc_utils.cpp./h        # FOC算法的效用函数
| | ├─ time_utils.cpp/h        # 用于处理时间度量和延迟的实用函数
| | ├─ pid.cpp./h              # 实现PID控制器
| | ├─ lowpass_filter.cpp./h   # 实现低通滤波器
| | |
| | ├─── base_classes
| | | ├─ FOCMotor.cpp./h        # 实现所有通用的电机
| | | ├─ BLDCDriver.h           # 实现所有通用无刷直流驱动程序
| | | ├─ StepperDriver.h        # 实现所有通用步进驱动程序
| | | └─ Sensor./h              # 实现所有通用已实现的传感器
| |
```
通用目录包含了<span class="simple">Simple<span class="foc">FOC</span>library</span>所有的定义和通用实用程序函数。它包含`base_classes` 目录中电机、传感器和驱动器的抽象类的定义。它有两个实用函数库，用于时间管理`time_utils.cpp/h`和FOC helpers `foc_utils.cpp/h`。最后给出了两个信号处理类的定义和实现：pid控制器`pid.cpp/h`和低通滤波器`lowpass_filter.cpp/h`。它还包含 `defaults.h`头文件中库的默认配置参数。
包含所有默认配置变量的头文件

```cpp
// 默认配置值
// 将此文件更改为应用程序的最佳值

#define DEF_POWER_SUPPLY 12.0 //!< 默认供电电压
//速度PI控制器参数
#define DEF_PID_VEL_P 0.5 //!< 默认PID控制器P值
#define DEF_PID_VEL_I 10 //!<  默认PID控制器I值
#define DEF_PID_VEL_D 0 //!<  默认PID控制器D值
#define DEF_PID_VEL_U_RAMP 1000 //!< 默认PID控制器电压斜坡值
// 角P参数
#define DEF_P_ANGLE_P 20 //!<默认P控制器P值
#define DEF_VEL_LIM 20 //!< 极限角速度
// 搜索引脚
#define DEF_INDEX_SEARCH_TARGET_VELOCITY 1 //!< 默认引脚搜索速度
// 调整电压
#define DEF_VOLTAGE_SENSOR_ALIGN 6.0 //!< 传感器和电机调零的默认电压
// 低通滤波器速度
#define DEF_VEL_FILTER_Tf 0.005 //!< 默认速度滤波时间常数
```



## 深入了解

有关FOC程序的更多信息以及实现FOC算法的代码的详细说明，请访问： <a href="foc_implementation"> FOC implementation details <i class="fa fa-external-link fa-sm"></i></a>

有关运动控制算法和代码实现选项的文档，请访问 <a href="motion_control_implementation"> Motion control implementation details <i class="fa fa-external-link fa-sm"></i></a>

该库为不同的微控制器提供了许多电机控制示例。更多内容，请访问 [library examples <i class="fa fa-external-link"></i>](library_examples)

要深入了解源代码，请访问 <a href="http://source.simplefoc.com/" target="_blank"> Doxygen generated code documentation <i class="fa fa-external-link fa-sm"></i></a>

<div class="image_icon width80" >
    <a href="http://source.simplefoc.com/" target="_blank">
        <img src="extras/Images/source_docs.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
