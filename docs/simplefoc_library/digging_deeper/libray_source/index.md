---
layout: default
title: 库源
nav_order: 1
parent: 深入研究
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /source_code
has_children: True
has_toc: false
toc: true
---


#  Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 源代码 [v2.1](https://github.com/simplefoc/Arduino-FOC/releases)
Arduino 库代码按照标准的 [Arduino 库结构](https://github.com/arduino/Arduino/wiki/Library-Manager-FAQ) 进行组织。
该库包含两种类型无刷直流电机的 FOC 实现，分别是 `BLDCMotor` 类中的标准三相无刷直流电机和 `StepperMotor` 类中的两相步进电机。库中实现了多种位置传感器，它们都放在 `sensors` 目录下，驱动器则放在 `drivers` 目录下。库中还实现了电流传感器，放在 `current_sense` 目录下，以及几个通信接口，放在 `communication` 文件夹中。最后，所有的实用函数和类都放在 `common` 文件夹中。
## Arduino 库源代码结构
```sh
| src
| ├─ SimpleFOC.h               # 主要头文件
| | 
| ├─ BLDCMotor.cpp/h           # 无刷直流电机处理类  
| ├─ StepperMotor.cpp/h        # 步进电机处理类 
| |
│ ├─── common                  # 包含所有通用的实用类和函数
| ├─── drivers                 # PWM 设置和驱动器处理的特定代码
| ├─── sensors                 # 位置传感器的特定代码
| ├─── current_sense           # 电流检测实现
| ├─── communication           # 通信协议实现
```

<blockquote class="info">更多信息请访问 <a href="http://source.simplefoc.com/" target="_blank"> 完整源代码文档 <i class="fa fa-external-link fa-sm"></i></a></blockquote>

## 电机
### `BLDCMotor.cpp/h`
无刷直流电机类实现
- FOC 算法实现
- 运动控制实现

### `StepperMotor.cpp/h`
无刷直流电机类实现
- FOC 算法实现
- 运动控制实现


<blockquote class="info"><a href="foc_implementation"><i class="fa fa-copy"></i> FOC 实现细节</a> - 实现 FOC 算法的程序文档和代码详细解释</blockquote>
<blockquote class="info"><a href="motion_control_implementation"><i class="fa fa-copy"></i> 运动控制实现细节</a> - 运动控制算法和代码实现选择的文档</blockquote>


## 驱动器
本库支持的所有驱动器都放在 drivers 目录下。
```sh
| ├─── drivers  
| | ├─ BLDCDriver3PWM.cpp/h         # 通用 3PWM 无刷直流驱动器实现
| | ├─ BLDCDriver6PWM.cpp/h         # 通用 6PWM 无刷直流驱动器实现
| | ├─ StepperDriver2PWM.cpp/h      # 通用 2PWM 步进驱动器实现
| | ├─ StepperDriver4PWM.cpp/h      # 通用 4PWM 步进驱动器实现
| | |      
| | ├─ hardware_api.h               # 处理 PWM 设置和配置的通用微控制器特定 API
| | |
| | ├─── hardware_specific          # 微控制器特定的 hardware_api.h 实现
| | | ├─ atmega2560_mcu.cpp         # ATMega 2560 实现
| | | ├─ atmega328_mcu.cpp          # ATMega 328（Arduino UNO）实现
| | | ├─ esp_mcu.cpp              # esp32 实现
| | | ├─ stm32_mcu.cpp              # stm32 实现
| | | ├─ teensy_mcu.cpp             # teensy 实现
| | | └─ generic_mcu./h             # 通用实现 - 如果不是上述任何一种（不完整）  
```
所有无刷直流驱动器都实现了抽象类 BLDCDriver。
```cpp
class BLDCDriver{
    public:
        
        /** Initialise hardware */
        virtual int init();
        /** Enable hardware */
        virtual void enable();
        /** Disable hardware */
        virtual void disable();

        long pwm_frequency; //!< pwm frequency value in hertz
        float voltage_power_supply; //!< power supply voltage 
        float voltage_limit; //!< limiting voltage set to the motor
            
        //Set phase voltages to the hardware 
        //
        // @param Ua - phase A voltage
        // @param Ub - phase B voltage
        // @param Uc - phase C voltage
        virtual void setPwm(float Ua, float Ub, float Uc);
        

        // Set phase state, enable/disable  
        //
        // @param sc - phase A state : active / disabled ( high impedance )
        // @param sb - phase B state : active / disabled ( high impedance )
        // @param sa - phase C state : active / disabled ( high impedance )
        virtual void setPhaseState(int sa, int sb, int sc) = 0;
};
```
所有步进驱动器都实现了 StepperDriver 抽象类。
```cpp
class StepperDriver{
    public:
        
        /** Initialise hardware */
        virtual int init();
        /** Enable hardware */
        virtual void enable();
        /** Disable hardware */
        virtual void disable();

        long pwm_frequency; //!< pwm frequency value in hertz
        float voltage_power_supply; //!< power supply voltage 
        float voltage_limit; //!< limiting voltage set to the motor
            
        /** 
         * Set phase voltages to the hardware 
         * 
         * @param Ua phase A voltage
         * @param Ub phase B voltage
        */
        virtual void setPwm(float Ua, float Ub);
};
```

此外，所有支持 simplefoc 库的微控制器架构都必须实现头文件 hardware_api.h。现成支持的架构将在 hardware_specific 文件夹中实现 hardware_api.h。如果您想实现一个新的微控制器，请创建一个新的 my_new_mcu.cpp 实例，并实现 hardware_api.h 中的所有函数，或者至少是您需要的函数。
## 传感器

```sh
| ├─── sensors 
| │ ├─ Encoder.cpp/h                # 实现正交编码器操作的编码器类
| │ ├─ MagneticSensorSPI.cpp/h      # 实现磁性传感器 SPI 通信的类
| │ ├─ MagneticSensorI2C.cpp/h      # 实现磁性传感器 I2C 通信的类
| │ ├─ MagneticSensorAnalog.cpp/h   # 实现磁性传感器模拟输出的类
    └─ HallSensor.cpp/h             # 实现霍尔传感器的类
```
本库中实现的所有位置传感器类都放在这个目录中，并且它们都将实现抽象传感器类 Sensor。每个传感器都需要实现 Sensor 类，以便能够链接到电机（BLDCMotor 和 StepperMotor 类）。

如果您想实现自己的传感器版本，只需扩展这个类并实现虚函数，您就能够使用 FOC 算法。

您可以通过 motor.linkSensor(your sensor) 将电机和传感器链接起来
```cpp
class Sensor{
public:
    // get current angle (rad) 
    virtual float getAngle() = 0;
    // get current angular velocity (rad/s)
    // initially implemented - can be overridden
    virtual float getVelocity();

    // returns 0 if it does need search for absolute zero
    // 1 - encoder with index (with index not found yet)
    // 0 - everything else (& encoder with index which is found)
    // initially implemented by default returns 0
    virtual int needsSearch();
}
```

## 电流检测

```sh
| ├─── current_sense 
| │ ├─ InlineCurrentSense.cpp/h     # 串联电流传感器实现
| | |
| | ├─ hardware_api.h               # 处理 ADC 设置和配置的通用微控制器特定 API
| | |
| | ├─── hardware_specific          # 微控制器特定的 hardware_api.h 实现
| |   └─ generic_mcu./h             # 通用实现 - 目前通用微控制器可以胜任 
```
所有电流检测类都实现了 CurrentSense 接口。这个接口还比较新，在未来更多电流控制环路实现的版本中可能会有所变化。
```cpp
class CurrentSense{
    public:

    // Function intialising the CurrentSense class
    // All the necessary intialisations of adc and sync should be implemented here
    virtual void init() = 0;
    
    // Function reading the phase currents a, b and c
    //   This function will be used with the foc control through the function 
    //   CurrentSense::getFOCCurrents(electrical_angle)
    //   - it returns current c equal to 0 if only two phase measurements available
    //
    //  @return PhaseCurrent_s current values
    virtual PhaseCurrent_s getPhaseCurrents() = 0;
    // Function reading the magnitude of the current set to the motor
    //  It returns the abosolute or signed magnitude if possible
    //  It can receive the motor electrical angle to help with calculation
    //  This function is used with the current control  (not foc)
    //  
    // @param angle_el - electrical angle of the motor (optional) 
    virtual float getDCCurrent(float angle_el = 0);

    // Function used for FOC contorl, it reads the DQ currents of the motor 
    //   It uses the function getPhaseCurrents internally
    // 
    // @param angle_el - motor electrical angle
    DQCurrent_s getFOCCurrents(float angle_el);

    // driver sync and align functions

    //Function intended to implement all that is needed to sync and current sensing with the driver.
    // If no such thing is needed it can be left empty (return 1)
    // @returns -  0 - for failure &  1 - for success 
    virtual int driverSync(BLDCDriver *driver) = 0;
    //Function intended to verify if:
    //   - phase current are oriented properly 
    //   - if their order is the same as driver phases
    // 
    // This function corrects the alignment errors if possible ans if no such thing is needed it can be left empty (return 1)
    // @returns -  0 - for failure &  positive number (with status) - for success 
    virtual int driverAlign(BLDCDriver *driver, float voltage) = 0;
    
    bool skip_align = false; //!< variable signaling that the phase current direction should be verified during initFOC()
};
```

## 通信

```sh
| ├─── communication 
| │ ├─ Communicator.cpp/h     # 指令器通信接口实现
| │ ├─ commands.h             # 命令列表定义
| | |
| │ └─ StepDirListener.cpp/h  # 步进/方向监听器实现
```

这个文件夹包含所有内置支持的通信协议。

### `Commander.cpp/h`
指令器类实现
- 灵活的类 g 代码通信
- 串行通信处理
- 内置 FOCMotor、PIDController 和 LowPassFilter 类的处理
- 更多...
<blockquote class="info"><a href="commander_interface"><i class="fa fa-copy"></i> 指令器功能 </a> - 指令器类的文档</blockquote>
<blockquote class="info"><a href="commands_source"><i class="fa fa-copy"></i> 命令列表 </a> - 电机命令功能的文档</blockquote>

### `StepDirListener.cpp/h`
步进 / 方向监听器类实现
- 步进 + 方向通信协议的简单实现
<blockquote class="info">
     <a href="step_dir_interface"><i class="fa fa-copy"></i> 步进/方向监听器功能 </a> - 步进方向监听器类的文档
</blockquote>


## Common
```sh
│ ├─── common                  # 包含所有通用的实用类和函数
| | |
| | ├─ defaults.h              # 默认运动控制参数
| | ├─ foc_utils.cpp./h        # FOC 算法的实用函数
| | ├─ time_utils.cpp/h        # 用于时间测量和延迟的实用函数
| | ├─ pid.cpp./h              # 实现 PID 控制器的类
| | ├─ lowpass_filter.cpp./h   # 实现低通滤波器的类
| | |
| | ├─── base_classes
| | | ├─ FOCMotor.cpp./h        # 所有已实现电机的通用类  
| | | ├─ BLDCDriver.h           # 所有无刷直流驱动器的通用类  
| | | ├─ StepperDriver.h        # 所有步进驱动器的通用类
| | | └─ Sensor./h              # 所有已实现传感器的通用类
| |
```
common 目录包含 SimpleFOClibrary 的所有定义和通用实用函数。它在 base_classes 目录中包含电机、传感器和驱动器的抽象类定义。它有两个实用函数库，分别用于时间管理 time_utils.cpp/h 和 FOC 辅助函数 foc_utils.cpp/h。最后，它包含两个信号处理类的定义和实现：PID 控制器 pid.cpp/h 和低通滤波器 lowpass_filter.cpp/h。它还在 defaults.h 头文件中包含库的默认配置参数。
包含所有默认配置变量的头文件
```cpp
// default configuration values
// change this file to optimal values for your application

#define DEF_POWER_SUPPLY 12.0 //!< default power supply voltage
// velocity PI controller params
#define DEF_PID_VEL_P 0.5 //!< default PID controller P value
#define DEF_PID_VEL_I 10 //!<  default PID controller I value
#define DEF_PID_VEL_D 0 //!<  default PID controller D value
#define DEF_PID_VEL_U_RAMP 1000 //!< default PID controller voltage ramp value
// angle P params
#define DEF_P_ANGLE_P 20 //!< default P controller P value
#define DEF_VEL_LIM 20 //!< angle velocity limit default
// index search 
#define DEF_INDEX_SEARCH_TARGET_VELOCITY 1 //!< default index search velocity
// align voltage
#define DEF_VOLTAGE_SENSOR_ALIGN 6.0 //!< default voltage for sensor and motor zero alignemt
// low pass filter velocity
#define DEF_VEL_FILTER_Tf 0.005 //!< default velocity filter time constant
```



## 深入了解

有关 FOC 程序和实现 FOC 算法的代码的详细解释，请访问：<a href="foc_implementation"> FOC 实现细节 <i class="fa fa-external-link fa-sm"></i></a>

有关运动控制算法和代码实现选择的文档，请访问 <a href="motion_control_implementation"> 运动控制实现细节 <i class="fa fa-external-link fa-sm"></i></a>

该库为不同的微控制器提供了许多电机控制示例。更多信息请参见 库示例 <i class="fa fa-external-link"></i>

要更深入地了解源代码，请访问 <a href="http://source.simplefoc.com/" target="_blank"> Doxygen 生成的代码文档 <i class="fa fa-external-link fa-sm"></i></a>

<div class="image_icon width80" >
    <a href="http://source.simplefoc.com/" target="_blank">
        <img src="extras/Images/source_docs.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

