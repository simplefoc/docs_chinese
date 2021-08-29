---
layout: default
title:  Simple<b>FOC</b>Studio
nav_order: 4
permalink: /studio
parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# *Simple**FOC**Studio*  <small>by [@JorgeMaker](https://github.com/JorgeMaker) </small>

<span class="simple">Simple<span class="foc">FOC</span>library </span>的图形用户界面，允许使用串行端口通信和 [Commander](commander_interface) 接口来调整和配置任何BLDC/步进电机的 <span class="simple">Simple<span class="foc">FOC</span>library </span>受控设备。

<img  src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">


### 特点:
- 即插即用 *Simple**FOC**library* 2.1版+
- 电机的实时调整和配置
- 实时
- 代码生成，以便在写代码时更轻松地集成优化参数
- 基于 PyQt5 和标准化的`SimpleFOCConnector`接口构建，该接口可用作从python到 *Simple**FOC**library* 设备的网关。


## 安装
别担心，*Simple**FOC**Studio*很容易安装，即使你以前从未使用过终端！😃
只需采取几个步骤：

1. 如果尚未安装Python，请安装它
    - 我们建议使用蟒蛇Anaconda [点击这里查看如何安装](https://docs.anaconda.com/anaconda/install/)
    - 运行Anaconda后，打开终端（在windows Anaconda提示符下）并运行：
    ```sh
    conda create -n simplefoc python=3.6.0
    ```
    - 完成此操作后，你将不再需要再次运行该命令，从现在起，你只需要：
    ```sh
    conda activate simplefoc
    ```
2. 复制此存储库或下载zip文件
3. 使用终端输入包含存储库的文件夹
    -  该命令如下所示：
    ```sh
    cd  some_path_on_disk/SimpleFOCStudio
    ```
4. 安装的最后一步是为 *Simple**FOC**Studio* 安装所有必要的库：
    ```sh
    pip install -r "requirements.txt"
    ```

当你完成上述所有步骤后，无需再重复。下次只需在 *Simple**FOC**Studio* 目录中打开终端并运行以下命令：
```sh
python simpleFOCStudio.py
```
或者如果使用 Anaconda ：
```sh   
conda activate simplefoc
python simpleFOCStudio.py
```

## 使用 *Simple**FOC**Studio*
*Simple**FOC**Studio* 有几个有用的功能:

- 调整电机设置的简单方法
  - 用于快速运动控制PID/LPF调整的窗体视图
  - TreeView控件 可进行更深入的挖掘和实验
- 将找到的参数转换为 Arduino 代码形式
- 集成了各种命令功能的串行终端

### Motion control tunning windows
当运行应用程序时，单击 <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/add_motor.png" style="height:18px">工具栏中的“style="height:18px">电机按钮。你可以选择<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/tree.png" style="height:18px">“style="height:18px">TreeView或<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/form.png" style="height:18px">FormView。

- 要连接到你的设备，首先通过单击<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/configure.png" style="height:18px">配置按钮

- 添加com端口信息并单击“OK”

- 然后添加已添加到指挥官的设备命令ID，通常为`M`
   - 命令`M`，Arduino 代码：`Command.add（'M'，doMotor，“my motor”）`
   - 命令`A` , Arduino 代码 : `command.add('A',doMotor,"my motor")`
   
- 然后点击<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/connect.png" style="height:18px">连接按钮！

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/treeview.png" class="width50"><img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/formview.png" class="width50">

### 代码生成

*Simple**FOC**Studio* 帮助你更轻松地将经过仔细调整的参数传输到Arduino的代码中。一旦你对系统的性能感到满意，你就可以自动生成已调整参数的arduino代码。要生成代码，请执行以下操作：

- 点击<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/gen.png" style="height:18px">工具栏中的Arudino按钮。
- 选择要为其生成代码的参数集，然后单击“OK”
- 在新选项卡中，你将得到一个优化参数的代码。

在调用`motor.init（）`之前，你可以在 setup() 函数中复制/粘贴生成的代码

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/gen.gif" class="width60">


### 集成串行终端

*Simple**FOC**Studio* 还集成了串行终端，便于调试和监控。

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/term.png" class="width60">


## Arduino 代码
基本上，你需要做两件事：
1. 使用commander界面并将电机添加到commander
2. 使用监视器并在循环中添加`motor.monitor（）`

下面是代码的模型：

```cpp
#include <SimpleFOC.h>

....

// 包括 commander 接口
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup(){
  ....
  // 将电机添加到 commander 接口
  // 你将提供给SimpleFOCStudio的字符(这里是M)
  command.add('M',doMotor,'motor');
  // 让电机使用监控
  motor.useMonitoring(Serial);
  motor.monitor_downsample = 0; // 首先禁用监视器-可选
  ...

}
void loop(){
  ....

  ....
  // 实时监控通信
  motor.monitor();
  // 实时 commander通信
  command.run();
}
```