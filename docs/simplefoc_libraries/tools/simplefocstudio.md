---
layout: default
title:  Simple<b>FOC</b>Studio
nav_order: 2
permalink: /studio
parent: 工具
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>工具集</span>
toc: true
---


# *Simple**FOC**Studio*  <small>作者：[@JorgeMaker](https://github.com/JorgeMaker) </small>

<span class="simple">Simple<span class="foc">FOC</span>库</span>的图形用户界面。该应用程序允许通过串口通信和[Commander](commander_interface)接口，对任何由<span class="simple">Simple<span class="foc">FOC</span>库</span>控制的BLDC/步进电机设备进行调谐和配置。


<img  src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/new_gif.gif" class="width80">


### 功能特点：
- 与*Simple**FOC**库*2.1+版本即插即用
- 电机的实时调谐和配置
- 电机变量的实时绘图和监控
- 代码生成功能，便于将调谐好的参数集成到你的代码中
- 基于PyQt5构建，并采用标准化的`SimpleFOCConnector`接口，可作为从Python到*Simple**FOC**库*设备的网关。


## 安装
别担心，即使你从未使用过终端，*Simple**FOC**Studio*的安装也很简单！😃
只需几个步骤：
1. 如果尚未安装Python，请先安装
    - 我们建议使用Anaconda。[安装方法如下](https://docs.anaconda.com/anaconda/install/)。
    - 当Anaconda安装完成后，打开终端（Windows系统用anaconda prompt）并运行：
    ```sh
    conda create -n simplefoc python=3.6.0
    ```
    - 完成后，以后就无需再运行该命令，只需执行：
    ```sh
    conda activate simplefoc
    ```
2. 克隆此仓库或下载 zip 文件
3. 使用终端进入包含仓库的文件夹
    -  命令大致如下：
    ```sh
    cd  some_path_on_disk/SimpleFOCStudio
    ```
4. 安装的最后一步是安装SimpleFOCStudio所需的所有必要库：
    ```sh
    pip install -r "requirements.txt"
    ```

完成上述所有步骤后，无需重复操作。下次使用时，只需在终端中进入SimpleFOCStudio目录并运行以下命令：
```sh
python simpleFOCStudio.py
```
如果使用 Anaconda：
```sh   
conda activate simplefoc
python simpleFOCStudio.py
```

## *Simple**FOC**Studio*的使用
*Simple**FOC**Studio* 有几个实用功能：
- 一种简单的电机设置调谐方法
  - 表单视图（Form view）用于快速进行运动控制 PID/LPF 调谐
  - 树状视图（TreeView）用于更深入的调谐和试验
- 代码生成功能，用于将找到的参数传输到你的 Arduino 代码中
- 集成了各种 commander 功能的串口终端

### 运动控制调谐窗口
应用程序运行后，点击工具栏中的<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/add_motor.png" style="height:18px">电机按钮添加设备。你可以选择<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/tree.png" style="height:18px">树状视图或<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/form.png" style="height:18px">表单视图。

- 要连接设备，首先点击<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/configure.png" style="height:18px">配置按钮配置串口
- 输入串口信息并点击确定
- 然后添加你在 commander 中设置的设备命令 ID，通常是`M`
   - 命令`M`对应的 Arduino 代码 `command.add('M',doMotor,"my motor")`
   - 命令`A`对应的 Arduino 代码 `command.add('A',doMotor,"my motor")`
- 然后点击 <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/connect.png" style="height:18px">连接按钮，就可以开始使用了！

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/treeview.png" class="width50"><img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/formview.png" class="width50">

### 代码生成

SimpleFOCStudio帮助你更轻松地将精心调谐的参数传输到 Arduino 代码中。当你对系统性能满意后，可以自动生成已调谐参数的 Arduino 代码。生成代码的步骤：
- 点击工具栏中的<img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/src/gui/resources/gen.png" style="height:18px">Arduino 按钮。
- 选择你想要生成代码的参数集，然后点击确定
- 在新标签页中，你将看到已调谐参数的代码。

生成的代码可以直接复制粘贴到`setup()`函数中，放在调用`motor.init()`之前。

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/gen.gif" class="width60">


### 集成串口终端

*Simple**FOC**Studio* 还集成了串口终端，方便调试和监控。

  <img src="https://raw.githubusercontent.com/JorgeMaker/SimpleFOCStudio/main/DOC/term.png" class="width60">


## Arduino代码
基本上你需要做两件事：
1. 使用 commander 接口并将电机添加到 commander 中
2. 使用监控功能，并在循环中添加`motor.monitor()`

以下是代码示例：

```cpp
#include <SimpleFOC.h>

....

// include commander interface
Commander command = Commander(Serial);
void doMotor(char* cmd) { command.motor(&motor, cmd); }

void setup(){
  ....
  // add the motor to the commander interface
  // The letter (here 'M') you will provide to the SimpleFOCStudio
  command.add('M',doMotor,'motor');
  // tell the motor to use the monitoring
  motor.useMonitoring(Serial);
  motor.monitor_downsample = 0; // disable monitor at first - optional
  ...

}
void loop(){
  ....

  ....
  // real-time monitoring calls
  motor.monitor();
  // real-time commander calls
  command.run();
}
```
