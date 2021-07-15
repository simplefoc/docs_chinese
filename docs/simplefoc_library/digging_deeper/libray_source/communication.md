---
layout: default
title: Motor commands
parent: Library Source
nav_order: 4
permalink: /commands_source
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Motor commands list [v2.1](https://github.com/simplefoc/Arduino-FOC/releases)

The command ids used by the commander interface are defined in the library source by the default values in the header file: `src/communication/commands.h`, hre is the list of hte commands:
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

By modifying this header file you can modify the default command character for the whole library.
