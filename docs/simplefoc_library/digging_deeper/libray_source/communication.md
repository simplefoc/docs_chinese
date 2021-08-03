---
layout: default
title: Motor commands
parent: Library Source
nav_order: 4
permalink: /commands_source
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# **电机命令列表**[v2.1](https://github.com/simplefoc/Arduino-FOC/releases)

从输入指令界面输入命令ID，调用库源中由头文件中的默认值定义：`src/communication/commands.h`，hre是hte命令的列表：

```cpp

// list of commands                指令列表
 #define CMD_C_D_PID   'D' //!< current d PID & LPF
						        电流d-PID和LPF
 #define CMD_C_Q_PID   'Q' //!< current d PID & LPF
                                  电流d-PID和LPF
 #define CMD_V_PID     'V' //!< velocity PID & LPF
                                  速度PID和LPF
 #define CMD_A_PID     'A' //!< angle PID & LPF
                                  角度PID和LPF
 #define CMD_STATUS    'E' //!< motor status enable/disable
                                  电机状态启用/禁用
 #define CMD_LIMITS    'L' //!< limits current/voltage/velocity
                                  限制电流/电压/速度
 #define CMD_MOTION_TYPE  'C' //!< motion control type
                                  电机控制类型
 #define CMD_TORQUE_TYPE  'T' //!< torque control type
                                  转矩控制类型
 #define CMD_SENSOR    'S' //!< sensor offsets
                                  传感器偏移补偿
 #define CMD_MONITOR   'M' //!< monitoring
                                  监控参数
 #define CMD_RESIST    'R' //!< motor phase resistance
                                  电机相电阻

 // commander configuration
 #define CMD_SCAN    '?' //!< command scaning the network - only for commander
                                    命令扫描网络
 #define CMD_VERBOSE '@' //!< command setting output mode - only for commander
                                    命令设置输出模式
 #define CMD_DECIMAL '#' //!< command setting decimal places - only for commander
                                    命令设置小数点位置

 // subcomands
 //pid - lpf
 #define SCMD_PID_P     'P' //!< PID gain P
                                    增益P
 #define SCMD_PID_I     'I' //!< PID gain I
                                    增益I
 #define SCMD_PID_D     'D' //!< PID gain D
                                    增益D
 #define SCMD_PID_RAMP  'R' //!< PID ramp
                                    PID斜坡
 #define SCMD_PID_LIM   'L' //!< PID limit
                                    PID限值
 #define SCMD_LPF_TF    'F' //!< LPF time constant
                                    LPF时间常数
 // limits                          极限 
 #define SCMD_LIM_CURR  'C' //!< Limit current
                                    限值（极限）电流
 #define SCMD_LIM_VOLT  'U' //!< Limit voltage
                                    限值（极限）电压
 #define SCMD_LIM_VEL   'V' //!< Limit velocity
                                    限值（极限）速度
 //sensor                          （传感器）
 #define SCMD_SENS_MECH_OFFSET 'M' //!< Sensor offset
                                    传感器偏移补偿
 #define SCMD_SENS_ELEC_OFFSET 'E' //!< Sensor electrical zero offset
 // monitoring					  （监控指令）
 #define SCMD_DOWNSAMPLE 'D' //!< Monitoring downsample value
                                    监测下采样值
 #define SCMD_CLEAR      'C' //!< Clear all monitored variables
                                    清除所有监控变量
 #define SCMD_GET        'G' //!< Get variable only one value
                                    仅获取一个变量值
 #define SCMD_SET        'S' //!< Set variables to be monitored
                                    设置要监视的变量
```

By modifying this header file you can modify the default command character for the whole library.
