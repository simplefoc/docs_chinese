---
layout: default
title: Shield v1.x
description: "Arduino SimpleFOCShield board fabrication"
parent: 制作指南
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
nav_order: 1
permalink: /arduino_simplefoc_shield_fabrication_v1
toc: true
---

# Shield v1.x 制作指南
本文将介绍 Arduino SimpleFOCShield [version <i class="fa fa-tag"></i>V1.3.3](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 版本的制作方法。

<p align="">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v1.3.3/images/top.png"  class="width30"><img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v1.3.3/images/bottom.png"  class="width30">
</p>

## 版本信息
SimpleFOCShield 的发布时间线可点击[此处](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)查看。各版本详情如下：

| 版本 | 链接 | 发布日期 | 说明 |
|-----|------|----------|------|
| SimpleFOCShield v1.3 | [release v1.3](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3) | 04/20 | 初始版本 |
| SimpleFOCShield v1.3.1 | [release v1.3.1](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3.1) | 07/20 | 增加了 Nucleo 堆叠支持 |
| SimpleFOCShield v1.3.2 | [release v1.3.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3.2) | 09/20 | 增加了 I2C 上拉电阻 |
| SimpleFOCShield v1.3.3 | [release v1.3.3](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3.3) | 12/20 | 适配 L6234 电路 + 完整的 Arduino 接口 |

[Github 仓库](https://github.com/simplefoc/Arduino-SimpleFOCShield)包含以下内容：
- 原理图（PDF 文件）
-  Gerber 文件（Gerber、NC Drill 和装配文件）
- 物料清单（BOM，Excel 表格）
- 3D 模型（3D PDF 和 STEP 文件）
- PCB 设计项目（Altium Designer 2019）

## 制作流程与成本
制作成本很大程度上取决于电路板的数量以及所选择的 PCB 制造商和元件供应商。电子笔记网站上有两篇不错的文章，分别介绍了如何选择 [PCB 制造商](https://www.electronics-notes.com/articles/constructional_techniques/printed-circuit-board-pcb/how-to-choose-right-best-pcb-manufacturer.php)和[元件供应商](https://www.electronics-notes.com/articles/constructional_techniques/printed-circuit-board-pcb/how-to-choose-right-best-pcb-manufacturer.php)（两者链接相同）。但在大多数情况下，价格往往是主要考虑因素。

### PCB 制作 + 自行组装 - 推荐选择 📢
对于小批量制作该电路板，这可能是首选方案。你可以从制造商处订购 PCB，从心仪的供应商处购买元件，然后自行焊接电路板。该电路板设计相对易于焊接。

#### PCB 制作
下载[Gerber 文件](https://github.com/simplefoc/Arduino-SimpleFOCShield)并提供给你选择的 PCB 制造商。目前，常用的有 Seeed Studio 和 JLCPCB。10 块 PCB 的价格约为 5 美元，但运费约为 20 美元。

| 数量 | SeedStudio | JLCPCB |
|------|------------|--------|
| 5 | 5€ | 2€ |
| 10 | 5€ | 2€ |
| 30 | 30€ | 15€ |
| 50 | 50€ | 30€ |

> 注意：除上述价格外，你还需支付约 20€ 的运费。

#### 元件采购
以下是制作该电路板所需的所有元件完整清单：

| 元件 | 描述 | 数量 | 制造商编号 |
|------|------|------|------------|
|  **L6234 电路**：[数据手册](https://www.st.com/resource/en/datasheet/l6234.pdf) |
| C1 | 0.1 uF | 1 | [C1206C104M5RECAUTO](https://www.mouser.fr/ProductDetail/KEMET/C1206C104M5RECAUTO?qs=MLItCLRbWswBKiY20DF1SA%3D%3D) |
| C2 | 0.01 uF | 1 | [C1206C103J3RAUTO](https://www.mouser.fr/ProductDetail/KEMET/C1206C103J3RAUTO?qs=%2Fha2pyFaduhAFP6oO4LLeYMkrC9QNia0EjiZTqcgzLScln%252BPiND5Ww%3D%3D) |
| C3 | 1 uF | 1 | [C1206X105K3RAC3316](https://www.mouser.fr/ProductDetail/KEMET/C1206X105K3RAC3316?qs=%2Fha2pyFaduilEz%252BiJtRzoz0gb0S3v4m%252B2vm5WoIZPYxGhbTceT8iyu5uY%252BnsPWGD) |
| C4 | 0.22 uF | 1 | [C1206C224J5RECAUTO7210](https://www.mouser.fr/ProductDetail/KEMET/C1206C224J5RECAUTO7210?qs=%2Fha2pyFaduiFNVbEFQqG8g760vwSal6p%252BrMckdrZBQmtOlARWq3l2WWJv5HhNnqv) |
| CAP1 | 100 uF（电解电容） | 1 | [EEEHAV101XAP](https://www.mouser.fr/ProductDetail/Panasonic/EEE-HAV101XAP?qs=%2Fha2pyFadujAo14cOabh4%2FHGWJclSBJVoXpO6qVRwLQTQ6LscWsHQA%3D%3D) |
| BAT1 | 肖特基二极管 | 1 | [TBAT54S,LM](https://www.mouser.fr/ProductDetail/Toshiba/TBAT54SLM?qs=kdd6aVn74hyQL5%252Beb9w%252BHw%3D%3D) |
| L6234 | 电机驱动芯片 | 1 | [L6234PD](https://www.mouser.fr/ProductDetail/STMicroelectronics/L6234PD?qs=lgHKUCmDFtgFRXXnpwFpNg%3D%3D) |
| **上拉和下拉电阻** |
| PULL_SCL, PULL_SDA, R2 | 4.7kΩ | 3 | [603-RC1210FR-074K7L](https://www.mouser.fr/ProductDetail/603-RC1210FR-074K7L) |
| PULL_A, PULL_B, PULL_I | 3kΩ | 3 | [RN73H2ETTD3001F50](https://www.mouser.fr/ProductDetail/KOA-Speer/RN73H2ETTD3001F50?qs=%2Fha2pyFadugz1PN4m8q5QBmmNYUlMOzQI3k%2FT%252B8vFrn5l%2FvB8B97FQ%3D%3D) |
| **LED 电路** |
| D1 | 红色 LED | 1 | [156120RS75300](https://www.mouser.fr/ProductDetail/Wurth-Elektronik/156120RS75300?qs=%2Fha2pyFaduhtSsTKzZu8BG2kEWNH5l3iOIVGi20HkjmxMeBY4VpJSw%3D%3D) |
| R1 | 620Ω | 1 | [RN73H2ETTD6200F50](https://www.mouser.fr/ProductDetail/KOA-Speer/RN73H2ETTD6200F50?qs=%2Fha2pyFadugz1PN4m8q5QKhCzpicGijTcn6N2kk6lgXhcYi6JSLlrg%3D%3D) |
|**端子连接器** |
| TB_M1 | 3 针，5mm | 1 | [TB002-500-03BE](https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-03BE?qs=%2Fha2pyFadujMo%2F8XIx7GL3VaKbn4rpnI4huWO6RUre2577fclJuWwA%3D%3D) |
| TB_PWR | 2 针，5mm | 1 | [TB002-500-02BE](https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-02BE?qs=%2Fha2pyFadujMo%2F8XIx7GL%2F8B4TM%252BUPJvcyODkgPPYDPGTjOBZNS5pw%3D%3D) |
|**header 连接器** |
| P1, P4 | 8 针， female，长 | 2 | [872-920-0086-01](https://www.mouser.fr/ProductDetail/872-920-0086-01) |
| P2 | 10 针， female，长 | 1 | [872-920-0087-01](https://www.mouser.fr/ProductDetail/872-920-0087-01) |
| P3 | 6 针， female，长 | 1 | [6fx1L-254mm](https://www.mouser.fr/ProductDetail/Gravitech/6fx1L-254mm?qs=%2Fha2pyFadugTMKIzmATdF3ycHTdv4fz%2FLeD9aI6nqeEU9o9FRZ5XDw%3D%3D) |
| P_ENC | 5 针， male/female | 1 | [649-1012937990501BLF](https://www.mouser.fr/ProductDetail/649-1012937990501BLF) |

你也可以下载[物料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield)（针对 PCB 制造商进行了优化）。以 Mouser 作为元件供应商为例，每个电路板的元件价格约为 10 美元，运费同样约为 20 美元（订单金额低于 50 美元时）。

> 注意：我所选择的带有制造商编号的元件并非固定不变，如有必要，你可以在价格和参数方面进行优化。

#### 电路板组装与焊接
当你获得所有元件和 PCB 后，就可以开始组装了。所有元件都相对容易焊接。所有电容为 `1206` 封装，所有电阻为 `1210` 封装，连接器均为通孔式，没有真正的小型 SMD 元件。因此，只要有一定的耐心，使用普通的电烙铁花一点时间就能完成焊接。

> 注意：电路板上本身就有元件的标识名称，便于确定每个元件的安装位置。如果你需要打印版本的，在 Gerber 文件的 Pick and Place 文件夹中也有装配图。

### PCB 制作与组装服务
这种选择更简单，且对于数量大于 50 片的情况，成本甚至更低，效果也更好。
要订购电路板，下载[Gerber 文件](https://github.com/simplefoc/Arduino-SimpleFOCShield)和[物料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield)并提供给你选择的制造商。例如，可以选择 [JLCPCB](https://jlcpcb.com/)。

<iframe class="youtube"  src="https://www.youtube.com/embed/sax_9sUgBuk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


### 完全组装版本
你可以从我们的[商店](https://simplefoc.com/shop)订购经过全面测试和组装的 Arduino SimpleFOCShield。
