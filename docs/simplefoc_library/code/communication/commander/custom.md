---
layout: default
title: Custom commands
nav_order: 6
permalink: /commander_custom
parent: Commander Interface
grand_parent: Communication
grand_grand_parent: Writing the Code
grand_grand_grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 使用自定义功能拓展commander

使用自己的未在 <span class="simple">Simple<span class="foc">FOC</span>library</span> 上实现的功能拓展commander接口，您只需要：

1. 执行你的回调函数 `void myFunc(char*){}`
2. 将它添加到 commander `commander.add('.',myFunc,"..")`

```cpp
void myFunc(char*){
  // 做一些有用的事
}

Commander commander = Commander(...)
void setup(){
...
  commander.add('A',myFunc,"my functionality");
...
}
void loop(){
  ...
  commander.run()
}
```

## 实例

这是一个使用两个新功能扩展commander接口的示例代码，打开和关闭 LED 灯并读取 5 个模拟引脚。

```cpp

#include <SimpleFOC.h>

// 实例化 commander
Commander command = Commander(Serial);

// LED控制功能
void doLed(char* cmd){ 
    if(atoi(cmd)) digitalWrite(LED_BUILTIN, HIGH); 
    else digitalWrite(LED_BUILTIN, LOW); 
};
// 获取模拟输入
void doAnalog(char* cmd){ 
    if (cmd[0] == '0') Serial.println(analogRead(A0));
    else if (cmd[0] == '1') Serial.println(analogRead(A1));
    else if (cmd[0] == '2') Serial.println(analogRead(A2));
    else if (cmd[0] == '3') Serial.println(analogRead(A3));
    else if (cmd[0] == '4') Serial.println(analogRead(A4));
};

void setup() {
    // 定义引脚
    pinMode(LED_BUILTIN, OUTPUT);
    pinMode(A0, INPUT);
    pinMode(A1, INPUT);
    pinMode(A2, INPUT);
    pinMode(A3, INPUT);
    pinMode(A4, INPUT);

    // 要使用的串行端口
    Serial.begin(115200);

    // 添加新命令
    command.add('L', doLed, "led on/off");
    command.add('A', doAnalog, "analog read A0-A4");

    Serial.println(F("Commander listening"));
    Serial.println(F(" - Send ? to see the node list..."));
    Serial.println(F(" - Send L0 to turn the led off and L1 to turn it off"));
    Serial.println(F(" - Send A0-A4 to read the analog pins"));
    _delay(1000);
}


void loop() {

    // 用户通信
    command.run(); 
    _delay(10);
}
```

然后在你的串行终端中，你可以
```sh 
$ ?            # 列出命令
L: led on/off
A: analog read A0-A4
$ L0           # led 关闭
$ A1           # 读取 A1
321            
$ A3           # 读取 A3
1023            
$ L1           # led 开启
$ L0           # led 关闭
```
