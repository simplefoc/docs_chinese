---
layout: default
title: 电机指令
parent: 库源
nav_order: 4
permalink: /commands_source
grand_parent: 深入研究
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 电机指令列表 [v2.1](https://github.com/simplefoc/Arduino-FOC/releases)

 commander 接口使用的指令 ID 在库源代码中由头文件 `src/communication/commands.h` 中的默认值定义，以下是指令列表：
```cpp

// list of commands
 #define CMD_C_D_PID   'D' //!< current d PID & LPF
 #define CMD_C_Q_PID   'Q' //!< current d PID & LPF
 #define CMD_V_PID     'V' //!< velocity PID & LPF
 #define CMD_A_PID     'A' //!< angle PID & LPF
 #define CMD_STATUS    'E' //!< motor status enable/disable
 #define CMD_LIMITS    'L' //!< limits current/voltage/velocity
 #define CMD_MOTION_TYPE  'C' //!< motion control type
 #define CMD_TORQUE_TYPE  'T' //!< torque control type
 #define CMD_SENSOR    'S' //!< sensor offsets
 #define CMD_MONITOR   'M' //!< monitoring
 #define CMD_RESIST    'R' //!< motor phase resistance

 // commander configuration
 #define CMD_SCAN    '?' //!< command scaning the network - only for commander
 #define CMD_VERBOSE '@' //!< command setting output mode - only for commander
 #define CMD_DECIMAL '#' //!< command setting decimal places - only for commander

 // subcomands
 //pid - lpf
 #define SCMD_PID_P     'P' //!< PID gain P
 #define SCMD_PID_I     'I' //!< PID gain I
 #define SCMD_PID_D     'D' //!< PID gain D
 #define SCMD_PID_RAMP  'R' //!< PID ramp
 #define SCMD_PID_LIM   'L' //!< PID limit
 #define SCMD_LPF_TF    'F' //!< LPF time constant
 // limits
 #define SCMD_LIM_CURR  'C' //!< Limit current
 #define SCMD_LIM_VOLT  'U' //!< Limit voltage
 #define SCMD_LIM_VEL   'V' //!< Limit velocity
 //sensor
 #define SCMD_SENS_MECH_OFFSET 'M' //!< Sensor offset
 #define SCMD_SENS_ELEC_OFFSET 'E' //!< Sensor electrical zero offset
 // monitoring
 #define SCMD_DOWNSAMPLE 'D' //!< Monitoring downsample value
 #define SCMD_CLEAR      'C' //!< Clear all monitored variables
 #define SCMD_GET        'G' //!< Get variable only one value
 #define SCMD_SET        'S' //!< Set variables to be monitored
```

通过修改此头文件，您可以修改整个库的默认指令字符。
