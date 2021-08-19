---
layout: default
title: Library Installation
parent: Installation
nav_order: 1
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /library_download
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# Installing <span class="simple">Simple<span class="foc">FOC</span>library（安装完整的SimpleFOC库）</span>

## <i class="fa fa-desktop"></i> 通过Arduino Library Manager安装
最简单的方式是直接通过 `Arduino IDE`中的 *Arduino Library Manager* 获取库。
<p><img src="extras/Images/alm.gif" class="width80"></p>  
- 打开Arduino IDE, 点击 `Tools > Manage Libraries...`，启动  *Arduino Library Manager*。
- 搜索 *"Simple FOC"* 库并安装 [最新版本 <i class="fa fa-tag"></i>.](https://github.com/simplefoc/Arduino-FOC/releases)
- 重新打开Arduino IDE，就能在 `File > Examples > Simple FOC`中看到库例程。

## <i class="fa fa-github"></i> 通过Github安装
如果你更倾向于从[github仓库](https://github.com/simplefoc/Arduino-FOC)直接下载库，请看以下指引。

### <i class="fa fa-download"></i> 压缩包下载
- 进入 [<i class="fa fa-code-fork"></i> main](https://github.com/simplefoc/Arduino-FOC) 。
- 首先点击 `Clone or Download > Download ZIP`。
- 解压下载的压缩包到`Arduino Libraries` 文件夹（ 文件夹路径 Windows: `Documents > Arduino > libraries`）。 
- 重新打开Arduino IDE，就能在 `File > Examples > Simple FOC`中看到库例程。

### <i class="fa fa-terminal"></i> 电脑终端克隆
- 打开电脑终端并运行下列代码：
```sh  
cd #arduino libraries folder
git clone https://github.com/simplefoc/Arduino-FOC.git
```
- 重新打开Arduino IDE，就能在 `File > Examples > Simple FOC`中看到库例程。
