---
layout: default
title: PlatformIO
parent: Installation
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /library_platformio
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---



#  使用PlatformIO安装SimpleFOC库

使用PlatformIO安装SimpleFOC库并不困难，依照下述说明可以指引你在几分钟内完成项目代码的建立和编译。

## 专业人士的快速设置

你可以在 PlatformIO 的 Arduino 项目中使用 SimpleFOC，仅需通过库管理器添加库。

<b>你需要在你的 platformio.ini 文件中使用如下选项:</b>
```ini
lib_archive = false
```



# 详细说明

## 准备工作

* 在整个安装过程中，需要保持与国际互联网的链接

* 首先，需要安装[Visual Studio Code](https://code.visualstudio.com/download)

* 打开Visual Studio Code，使用扩展管理工具安装PlatfromIO

  ![platformio_screenshot1](C:\Users\Administrator\Desktop\SimpleFOClibrary\3.1安装\platformio_screenshot1.png)

  1.选择扩展管理

  2.输入“PlatformIO”进行搜索

  3.从列表中选择“PlatformIO”，（位于搜索结果的第一个）

  4.点击“安装”，稍等片刻PlatfromIO即可安装完毕，安装完毕后，按照系统提示点击“重新加载”即可

  恭喜你可以开始你的第一个项目了！

## 创建项目

  可以按照如下步骤建立一个新的项目：

![platformio_screenshot2](C:\Users\Administrator\Desktop\SimpleFOClibrary\3.1安装\platformio_screenshot2.png)

  1.从侧边栏选择“PlatformIO"图标

  2.选择“Open”按钮，在主窗口打开PlatformIO

  3.点击“Create New Project”

  此时，会弹出新建项目向导：

![platformio_screenshot3](C:\Users\Administrator\Desktop\SimpleFOClibrary\3.1安装\platformio_screenshot3.png)

  1.首先，输入新建项目的名称。比如：simplefoc_test_project

  2.选择开发板。SimpleFOC 支持多种MCU架构, 具体参考 [hardware/mcus]

  3.一旦你选择了开发板，请确保勾选“Arduino”框架复选框。PlatformIO 支持多种框架，但SimpleFOC是一个基于 Arduino库的，必须有Arduino框架支持。

![image-20211227133443750](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20211227133443750.png)

  4.点击“finish"结束向导。

此时，如果你是首次使用这个开发板创建项目，PlatformIO会自动下载所需的编译器、工具和核心库文件。根据你的网速，需要等待一段时间，请耐心等待。

## 在项目中添加SimpleFOC库

上述过程就绪后，你将看到如下画面：

![platformio_screenshot4](C:\Users\Administrator\Desktop\SimpleFOClibrary\3.1安装\platformio_screenshot4.png)

现在就可以为项目添加SimpleFOC库了：

![platformio_screenshot5](C:\Users\Administrator\Desktop\SimpleFOClibrary\3.1安装\platformio_screenshot5.png)

1.点击PlatformIO图标，点击"Libraries"按钮

2.在搜索栏输入“Simple FOC”

3.点击“Add to Project"进行安装即可。

![platformio_screenshot6](C:\Users\Administrator\Desktop\SimpleFOClibrary\3.1安装\platformio_screenshot6.png)

1.点击“Add Library"按钮后会弹出“Add Library"向导

![platformio_screenshot7](C:\Users\Administrator\Desktop\SimpleFOClibrary\3.1安装\platformio_screenshot7.png)

1.从下拉列表中选择你的项目

2.点击“Add”添加库

酷！现在你的项目就和SimpleFOC完成了关联。

## 配置项目

在你的项目文件的根目录中打开platformio.ini文件，如下所示，具体内容因开发不同而不尽相同

```ini
​```ini
; PlatformIO Project Configuration File
;
;   Build options: build flags, source filter
;   Upload options: custom upload port, speed and extra flags
;   Library options: dependencies, extra library storages
;   Advanced options: extra scripting
;
; Please visit documentation for the other options and examples
; https://docs.platformio.org/page/projectconf.html

[env:mkrwifi1010]
platform = atmelsam
board = mkrwifi1010
framework = arduino
lib_deps = askuric/Simple FOC@^2.2
lib_archive = false
```

<blockquote class='warning'>
<p class='heading'>⚠️ 重要提示！</p>
此时你需要添加 <code class='highlighter-rouge'>lib_archive = false</code> 语句，确保PlatformIO能够正确编译SimpleFOC库。
</blockquote>


你也可以根据需求自行添加配置选项，比如通过添加monitor_speed选项配置调试用串口的输出波特率，如下：

```ini
monitor_speed = 115200
```

具体配置选项取决于你使用的开发板，我们并不能把所有的选项罗列出来，你可以参考PlatformIO的文档。

## 开始编程

你可以通过编辑*src/main.cpp*文件进行编程了。

## Youtube 向导 [@owennewo](https://github.com/owennewo)

<iframe class="youtube" src="https://www.youtube.com/embed/3B88qCny7Kg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 扩展用法

PlatformIO可以方便的进行 SimpleFOC 库的版本控制，这便于你修改代码，或者在正式版发布前通过使用最新的dev分支版本体验最新的功能。

按照如下步骤使用不同版本的库：

1.打开你常用的git客户端，从https://github.com/simplefoc/Arduino-FOC.git获取 SimpleFOC 库2.此时会在你的本地系统中建立一个名为 "Arduino-FOC"的目录，其中包括了库文件

3.使用操作系统命令或者VisualStudioCode内的命令行模式打开PlatformIO项目目录，找到库目录。

4.在你的项目目录中，建立一个Arduino-FOC目录的快捷方式

Mac/Linux :

```shell
ln -s /path/to/Arduino-FOC
```

Windows：

```shell
mklink /J Arduino-FOC C:\path\to\Arduino-FOC`
```

提示：如果你之前通过版本管理的方式添加过库的话，则需要通过修改platformio.ini文件将其删除
