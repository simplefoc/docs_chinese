---
layout: default
title: Arduino安装库
parent: 安装
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /library_download
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
toc: true
---


# 安装 <span class="simple">简易<span class="foc">FOC</span>库</span>

## <i class="fa fa-desktop"></i> 通过 Arduino 库管理器安装
获取该库最简单的方法是直接通过 `Arduino IDE` 和 *Arduino 库管理器*。
<p><img src="extras/Images/alm.gif" class="width80"></p>  
- 打开 Arduino IDE，通过点击 `工具 > 管理库...` 启动 *Arduino 库管理器*。
- 搜索 *"Simple FOC"* 库并安装[最新版本 <i class="fa fa-tag"></i>。](https://github.com/simplefoc/Arduino-FOC/releases)
- 重新打开 Arduino IDE，你应该能在 `文件 > 示例 > Simple FOC` 中找到该库的示例。

## <i class="fa fa-github"></i> 通过 Github 安装
如果你更愿意直接从 [github 仓库](https://github.com/simplefoc/Arduino-FOC) 下载该库。

### <i class="fa fa-download"></i> 下载 ZIP 文件
- 进入 [<i class="fa fa-code-fork"></i> 主分支](https://github.com/simplefoc/Arduino-FOC)
- 先点击 `Clone or Download > Download ZIP`。
- 解压缩文件并将其放置在 `Arduino 库` 文件夹中。Windows 系统：`文档 > Arduino > libraries`。
- 重新打开 Arduino IDE，你应该能在 `文件 > 示例 > Simple FOC` 中找到该库的示例。

### <i class="fa fa-terminal"></i> 使用终端克隆
- 打开终端并运行
- Open terminal and run
```sh  
cd #arduino libraries folder
git clone https://github.com/simplefoc/Arduino-FOC.git
```
- 重新打开 Arduino IDE，你应该能在 文件 > 示例 > Simple FOC 中找到该库的示例。
