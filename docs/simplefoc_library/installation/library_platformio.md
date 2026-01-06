---
layout: default
title: PlatformIO安装库
parent: 安装
nav_order: 2
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /library_platformio
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 使用 PlatformIO 安装 <span class="simple">简易<span class="foc">FOC</span>库</span>

在 PlatformIO 中使用 SimpleFOC 一点也不难！按照以下说明操作，几分钟内就能完成设置并编译代码。

## 专业人士快速设置

你可以在 PlatformIO 的 Arduino 项目中使用 SimpleFOC。只需通过库管理器添加该库即可。

<b>你的 platformio.ini 文件中需要有这个选项：</b>
```ini
lib_archive = false
```

# 详细说明

## 先决条件

- 在整个设置过程中，你需要保持网络连接活跃，直到项目设置完成。
- 首先，安装 [Visual Studio Code](https://code.visualstudio.com/download)
- 运行 Visual Studio Code，通过扩展管理器安装 PlatformIO：

<img src="extras/Images/platformio_screenshot1.png"  class="width80">
1. 选择扩展管理器
2. 在搜索框中输入“PlatformIO”
3. 从列表中选择 PlatformIO 扩展（应该是第一个结果）
4. 点击安装 - 几分钟后 PlatformIO 将安装完成，系统会提示你重新加载 Visual Studio Code

恭喜，你已经准备好开始你的第一个项目了！

## 创建项目

要创建一个使用 SimpleFOC 的新项目，请按照以下步骤操作：

<img src="extras/Images/platformio_screenshot2.png" class="width80">
1. 选择左侧边栏的 PlatformIO 菜单
2. 选择“打开”以打开 platformIO 主屏幕
3. 点击“新建项目”

你将进入新项目向导：

<img src="extras/Images/platformio_screenshot3.png" class="width50">
1. 给你的项目起一个名字，例如 simplefoc_test_project
2. 选择你的开发板。SimpleFOC 支持多种 MCU 架构，详见 [hardware/mcus]
3. 选择好开发板后，确保“Arduino”框架被选中。PlatformIO 支持其他框架，但 SimpleFOC 是一个 Arduino 库，必须在 Arduino 框架中运行。
4. 点击完成

此时，如果这是你为该开发板创建的第一个项目，PlatformIO 将下载所有必需的编译器、工具和核心库文件。根据你的网络速度，这可能需要相当长的时间，请耐心等待！

## 向项目添加 简易FOC库

当所有安装完成后，你应该会看到类似这样的界面：

<img src="extras/Images/platformio_screenshot4.png" class="width80">

现在你可以向项目添加 SimpleFOC 库了：

<img src="extras/Images/platformio_screenshot5.png" class="width80">
1. 点击 PlatformIO 图标，从菜单中选择“库”
2. 在搜索框中输入“Simple FOC”
3. 点击该库

<img src="extras/Images/platformio_screenshot6.png" class="width80">
1. 点击“添加库”以显示“添加库”向导
<img src="extras/Images/platformio_screenshot7.png" class="width50">
1. 从下拉菜单中选择你的项目
2. 点击“添加”以添加库

太好了！SimpleFOC 库现在已与你的项目关联。

## 配置项目

打开项目根目录下的 platformio.ini 文件。根据你选择的开发板，它看起来应该类似这样：

```ini
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

<blockquote class='warning'><p class='heading'>重要！⚠️</p>你必须添加 <code class='highlighter-rouge'>lib_archive = false</code> 这一行，才能使 SimpleFOC 在 PlatformIO 中正确编译。</blockquote>

你可能还想添加一些其他选项，比如 monitor_speed 来设置调试输出的串口速度。

```ini
monitor_speed = 115200
```

可用选项取决于你的开发板，我们无法在此一一涵盖，但 PlatformIO 的文档中有相关说明。

## 开始编码！

你可以在 src/main.cpp 文件中开始编写代码。

## [@owennewo](https://github.com/owennewo)的 Youtube 教程

<iframe class="youtube" src="https://www.youtube.com/embed/3B88qCny7Kg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## 高级用法

PlatformIO 让你可以轻松使用 SimpleFOC 库的源代码版本。这使你能够修改代码，或者使用最新的 “dev” 分支版本的库，以便在正式发布前试用新功能。

要使用库的源代码版本，请尝试以下步骤：

1. 使用你喜欢的 git 客户端，从 https://github.com/simplefoc/Arduino-FOC.git 克隆 simplefoc 库
2. 这将在你的文件系统上创建一个 “Arduino-FOC” 文件夹，其中包含库的源代码
3. 进入你的 PlatformIO 项目，然后在项目内进入 lib 文件夹。你可以使用操作系统的 shell，或者 Visual Studio Code 中的内置 shell。
4. 在项目的 lib 文件夹内，创建一个指向你的 Arduino-FOC 文件夹的符号链接
Mac/Linux 系统：<br/>
`% ln -s /path/to/Arduino-FOC`<br/>
Windows:<br/>
`% mklink /J Arduino-FOC C:\path\to\Arduino-FOC`

注意：如果你之前已经通过 PlatformIO 的库管理向项目添加了库的发布版本，则需要从 platformio.ini 文件中删除该引用