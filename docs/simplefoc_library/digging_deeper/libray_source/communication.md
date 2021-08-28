---
layout: default
title: 电机命令
parent: Library Source
nav_order: 4
permalink: /commands_source
grand_parent: Digging deeper
grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# **电机命令列表**[v2.1](https://github.com/simplefoc/Arduino-FOC/releases)

从输入指令界面输入命令ID，调用库源中由头文件中的默认值定义：`src/communication/commands.h`，hre是hte命令的列表：

```cpp

// 命令列表               
 #define CMD_C_D_PID   'D' //!< 电流d PID和LPF
 #define CMD_C_Q_PID   'Q' //!< 电流q PID和LPF
 #define CMD_V_PID     'V' //!< 电压 PID和LPF
 #define CMD_A_PID     'A' //!< 角度 PID 和 LPF
 #define CMD_STATUS    'E' //!< 电机状态启用/禁用
 #define CMD_LIMITS    'L' //!< 限制电流/电压/速度
 #define CMD_MOTION_TYPE  'C' //!< 运动控制类型
 #define CMD_TORQUE_TYPE  'T' //!< 转矩控制类型
 #define CMD_SENSOR    'S' //!< 传感器补偿
 #define CMD_MONITOR   'M' //!< 监控
 #define CMD_RESIST    'R' //!< 电机相阻抗

 // commander配置
 #define CMD_SCAN    '?' //!< 命令扫描网络 - 仅为commander
 #define CMD_VERBOSE '@' //!< 命令设置输出模式 - 仅为commander
 #define CMD_DECIMAL '#' //!< 命令设置小数点 - 仅为commander

 // subcomands
 //pid - lpf
 #define SCMD_PID_P     'P' //!< PID增益P
 #define SCMD_PID_I     'I' //!< PID增益I
 #define SCMD_PID_D     'D' //!< PID增益D
 #define SCMD_PID_RAMP  'R' //!< PID坡道
 #define SCMD_PID_LIM   'L' //!< PID限制
 #define SCMD_LPF_TF    'F' //!< 通滤波器时间常数
 // limits                
 #define SCMD_LIM_CURR  'C' //!< 极限电流
 #define SCMD_LIM_VOLT  'U' //!< 极限电压
 #define SCMD_LIM_VEL   'V' //!< 极限速度
 //sensor                       
 #define SCMD_SENS_MECH_OFFSET 'M' //!< 传感器补偿
 #define SCMD_SENS_ELEC_OFFSET 'E' //!< 传感器电零点补偿
 // monitoring					  
 #define SCMD_DOWNSAMPLE 'D' //!< 监控下行样本值
 #define SCMD_CLEAR      'C' //!< 清除所有监控变量
 #define SCMD_GET        'G' //!< 只获取变量的一个值
 #define SCMD_SET        'S' //!< 设置要监视的变量
```

通过修改该头文件，你可以修改整个库的默认命令字符。
