---
layout: default
title: Library Source
nav_order: 1
parent: Digging deeper
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /source_code
has_children: True
has_toc: false
---

# Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span> 源代码[v2.1](https://github.com/simplefoc/Arduino-FOC/releases)
arduino库代码被组织成标准 [Arduino library structure](https://github.com/arduino/Arduino/wiki/Library-Manager-FAQ). （Arduino的库结构）
该库包含两种类型的无刷直流电机的FOC实现，即`无刷直流电机` 类的标准三相无刷直流电机和`步进电机`类的两相步进电机。该库实现了许多位置传感器，它们都位于 `senors`目录以及 `drivers`目录中的驱动程序中。该库还实现了电流传感器，它们被放在 `current_sense`目录中，以及几个通信接口，被放在`communication`文件夹中。最后，所有实用程序函数和类都放在 `common`文件夹中。

## Arduino library source structure
```sh
| src
| ├─ SimpleFOC.h               # Main include file
| | 
| ├─ BLDCMotor.cpp/h           # BLDC motor handling class  
| ├─ StepperMotor.cpp/h        # Stepper motor handling class 
| |
│ ├─── common                  # Contains all the common utility classes and functions
| ├─── drivers                 # PWM setting and driver handling specific code
| ├─── sensors                 # Position sensor specific code
| ├─── current_sense           # Current sense implementations
| ├─── communication           # Communication protocols implementation
```

<blockquote class="info">For more info visit <a href="http://source.simplefoc.com/" target="_blank"> full source code documentation <i class="fa fa-external-link fa-sm"></i></a></blockquote>
## Motors
### `BLDCMotor.cpp/h`
无刷直流电机类的实现
- FOC算法的实现
- 运动控制实现

### `StepperMotor.cpp/h`
无刷直流电机类的实现
- FOC算法的实现
- 运动控制实现


<blockquote class="info"><a href="foc_implementation"><i class="fa fa-copy"></i> FOC implementation details</a> - Documentation of the procedures and detailed explanations of the code implementing FOC algorithm 
</blockquote>
<blockquote class="info">
     <a href="motion_control_implementation"><i class="fa fa-copy"></i> Motion control implementation details</a> - Documentation of the motion control algorithms and code implementation choices
</blockquote>


## Drivers
此库中支持的所有驱动程序都放在驱动程序目录中。
```sh
| ├─── drivers  
| | ├─ BLDCDriver3PWM.cpp/h         # Implementation of generic 3PWM bldc driver
| | ├─ BLDCDriver6PWM.cpp/h         # Implementation of generic 6PWM bldc driver
| | ├─ StepperDriver2PWM.cpp/h      # Implementation of generic 2PWM stepper driver
| | ├─ StepperDriver4PWM.cpp/h      # Implementation of generic 4PWM stepper driver
| | |      
| | ├─ hardware_api.h               # common mcu specific api handling pwm setting and configuration
| | |
| | ├─── hardware_specific          # mcu specific hadrware_api.h implementations
| | | ├─ atmega2560_mcu.cpp         # ATMega 2560 implementation
| | | ├─ atmega328_mcu.cpp          # ATMega 328 (Arduino UNO) implementation
| | | ├─ esp32_mcu.cpp              # esp32 implementation
| | | ├─ stm32_mcu.cpp              # stm32 implementation
| | | ├─ teensy_mcu.cpp             # teensy implementation
| | | └─ generic_mcu./h             # generic implementation - if not nay of above (not complete)   
```
所有BLDC驱动程序都实现抽象类`BLDCDriver`。

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
所有的步进驱动程序都实现了`StepperDriver`抽象类。

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

此外，所有支持simplefoc库的MCU体系结构都必须实现头文件`hardware_api.h`。现成支持的体系结构将在`hardware_specific`文件夹中实现`hardware_api.h`。如果您希望实现新的MCU，请至少创建一个新的MCU实例：`my_new_mcu.cpp`  并实现文档中的所有功能，或者至少是您需要的功能。

## Sensors

```sh
| ├─── sensors 
| │ ├─ Encoder.cpp/h                # Encoder class implementing the Quadrature encoder operations
| │ ├─ MagneticSensorSPI.cpp/h      # class implementing SPI communication for Magnetic sensors
| │ ├─ MagneticSensorI2C.cpp/h      # class implementing I2C communication for Magnetic sensors
| │ ├─ MagneticSensorAnalog.cpp/h   # class implementing Analog output for Magnetic sensors
    └─ HallSensor.cpp/h             # class implementing Hall sensor
```
所有的位置传感器类目在库中实现都需要放置在目录里，所有这些都将实现抽象的传感器类：`Sensor`每个传感器都需要执行以下操作`Sensor` 类为了能够连接上电机 (`BLDCMotor` and `StepperMotor` class)。如果您想实现自己版本的传感器，请扩展该类并实现虚拟函数，您将能够使用它运行FOC算法。
您可以通过执行以下操作来连接电机和传感器`motor.linkSensor(your sensor)`

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

## Current Sense

```sh
| ├─── current_sense 
| │ ├─ InlineCurrentSense.cpp/h     # Inline current sensor implementation
| | |
| | ├─ hardware_api.h               # common mcu specific api handling adc setting and configuration
| | |
| | ├─── hardware_specific          # mcu specific hadrware_api.h implementations
| |   └─ generic_mcu./h             # generic implementation - for now generic mcu does the job 
```
所有的Current Sense类都实现了 `CurrentSense`接口。这个接口仍然是全新的，当更多的当前控制循环被实现时，可能会在将来的版本中进行更改。

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

## Communication

```sh
| ├─── communication 
| │ ├─ Communicator.cpp/h     # Commander communication interface implementation
| │ ├─ commands.h             # Command list definition
| | |
| │ └─ StepDirListener.cpp/h  # Step/dir listener implementation
```

此文件夹包含所有内置支持的通信协议。

### `Commander.cpp/h`
Commander class 工具
- 灵活的g码式通信
- 串行通信的处理
- 内置处理 `FOCMotor`、`PIDController`和`LowPassFilter`'类
- 其他...
<blockquote class="info">
     <a href="commander_interface"><i class="fa fa-copy"></i> Commander functionality </a> - Documentation of the commander class
</blockquote>
<blockquote class="info">
     <a href="commands_source"><i class="fa fa-copy"></i> Commands list </a> - Documentation of the motor commands functionality
</blockquote>

### `StepDirListener.cpp/h`
StepDirListener class 工具
- step+dir通信协议的简单实现
<blockquote class="info">
     <a href="step_dir_interface"><i class="fa fa-copy"></i> Step/direction listener functionality </a> - Documentation of the step dir listener class
</blockquote>


## Common
```sh
│ ├─── common                  # Contains all the common utility classes and functions
| | |
| | ├─ defaults.h              # default motion control parameters
| | ├─ foc_utils.cpp./h        # utility functions of the FOC algorithm
| | ├─ time_utils.cpp/h        # utility functions for dealing with time measurements and delays
| | ├─ pid.cpp./h              # class implementing PID controller
| | ├─ lowpass_filter.cpp./h   # class implementing Low pass filter
| | |
| | ├─── base_classes
| | | ├─ FOCMotor.cpp./h        # common class for all implemented motors  
| | | ├─ BLDCDriver.h           # common class for all BLDC drivers  
| | | ├─ StepperDriver.h        # common class for all Stepper drivers
| | | └─ Sensor./h              # common class for all implemented sensors
| |
```
通用目录包含了<span class="simple">Simple<span class="foc">FOC</span>library</span>的所有定义和通用实用程序函数。它包含`base_classes` 目录中电机、传感器和驱动器的抽象类的定义。它有两个实用函数库，用于时间管理`time_utils.cpp/h`和FOC helpers `foc_utils.cpp/h`。最后给出了两个信号处理类的定义和实现：pid控制器`pid.cpp/h`和低通滤波器`lowpass_filter.cpp/h`。它还包含 `defaults.h`头文件中库的默认配置参数。
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



## Digging deeper

有关FOC程序的更多信息以及实现FOC算法的代码的详细说明，请访问： <a href="foc_implementation"> FOC implementation details <i class="fa fa-external-link fa-sm"></i></a>

有关运动控制算法和代码实现选项的文档，请访问 <a href="motion_control_implementation"> Motion control implementation details <i class="fa fa-external-link fa-sm"></i></a>

该库为不同的微控制器提供了许多电机控制示例。查看更多关于请访问 [library examples <i class="fa fa-external-link"></i>](library_examples)

要深入了解源代码，请访问 <a href="http://source.simplefoc.com/" target="_blank"> Doxygen generated code documentation <i class="fa fa-external-link fa-sm"></i></a>

<div class="image_icon width80" >
    <a href="http://source.simplefoc.com/" target="_blank">
        <img src="extras/Images/source_docs.jpg" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>

