---
layout: default
title: Shield v2.x
description: "Arduino SimpleFOCShield board fabrication"
parent: 制作指南
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
nav_order: 2
permalink: /arduino_simplefoc_shield_fabrication_v2
toc: true
---


# <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small><i>v2.x</i></small> 制作指南
以下是制作 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> [版本 <i class="fa fa-tag"></i>V2.0.4](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 的快速指南


<p align="">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v2.0.4/images/top.png"  class="width30"><img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v2.0.4/images/bottom.png"  class="width30">
</p>


<blockquote class="info"> 📢 官方 Easy EDA 项目 <a href="https://oshwlab.com/the.skuric/simplefocshield"> 此处 <i class="fa fa-external-link"></i></a></blockquote>

## 电路板版本
要查看发布时间线，请点击 [这里](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)

版本  | 链接 | 发布日期 | 说明
----- | ----- | ---- | ----
*Simple**FOC**Shield* v2.0 |[版本 v2.0](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0) | 2021年1月 | - 3A 串联电流检测 <br>- 5V 稳压器 <br>- 新的硬件配置引脚排列 
*Simple**FOC**Shield* v2.0.1 |[版本 v2.0.1](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.1) | 2021年1月 | - 减小过孔尺寸 <br> - 可配置范围
*Simple**FOC**Shield* v2.0.2 |[版本 v2.0.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) | 2021年1月 | 将 7805（连接至 5V）替换为 7808（连接至 VIN），以兼容 stm32 Nucleo-64
*Simple**FOC**Shield* v2.0.3 |[版本 v2.0.3](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.3) | 2021年3月 | - 缩短从 ADC 到电流检测的线路 <br> - 拼写错误修复：底面标签交换了 A 相和 B 相
*Simple**FOC**Shield* v2.0.4 |[版本 v2.0.4](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.4) | 2021年9月 | - 上拉配置简化 <br> - 最大输入电压 35V <br> - 移除 CAP2，改用 CL1 <br> - 项目的 Easy EDA 版本





[<i class="fa fa-github"></i> Github](https://github.com/simplefoc/Arduino-SimpleFOCShield) 仓库包含：
- <b><i class="fa fa-file"></i> 原理图</b> - PDF 文件
- <b><i class="fa fa-file"></i>  Gerber 文件</b> - Gerber、NC 钻孔和装配文件
- <b><i class="fa fa-file"></i> 物料清单（BOM）</b> - Excel 表格
- <b><i class="fa fa-file"></i> 3D 模型</b> - 3D PDF 和 STEP 文件
- <b><i class="fa fa-file"></i> PCB 设计项目</b> - Altium Designer 2019


## 制作流程和成本
制作价格在很大程度上取决于电路板的数量以及您选择的 PCB 制造商和元件供应商。以下是两篇不错的文章，解释了如何选择 PCB 制造商（来自 [electronics-notes.com](https://www.electronics-notes.com/articles/constructional_techniques/printed-circuit-board-pcb/how-to-choose-right-best-pcb-manufacturer.php)）和元件供应商（来自 [electronics-notes.com](https://www.electronics-notes.com/articles/constructional_techniques/printed-circuit-board-pcb/how-to-choose-right-best-pcb-manufacturer.php)）。但在大多数情况下，价格往往是关键因素。

## PCB 制作 + 自行组装
尽管大多数元件是大型表面贴装元件，并且电路板特意设计为便于手工焊接，但电流检测放大器会稍微难一些。但如果您有兴趣以这种方式制作该电路板，以下是一个快速指南。

### PCB 制作
下载 [<i class="fa fa-file"></i> gerber 文件](https://github.com/simplefoc/Arduino-SimpleFOCShield) 并提供给您选择的 PCB 制造商。到目前为止，我使用过 [seeedstrudio](https://www.seeedstudio.com/) 和 [JLCPCB](https://jlcpcb.com/)。10 块 PCB 的价格约为 5 美元，但运费约为 20 美元。

数量 | SeedStudio |  JLCPCB
---- | ---- | ---- | ---
5 | 5 欧元 | 2 欧元
10 | 5 欧元 | 2 欧元
30 | 30 欧元 | 15 欧元
50 | 50 欧元 | 30 欧元
 
<i class="fa fa-info-circle"></i> <i><small>除了这些价格外，您还需支付约 20 欧元的运费。</small></i>

### 元件采购
以下是制作该电路板所需的所有元件的完整列表：
<table>
      <thead>
         <tr>
            <th>元件</th>
            <th>描述</th>
            <th>数量</th>
            <th>制造商编号</th>
         </tr>
      </thead>
      <tbody>
         <tr>
            <td colspan="4"><b>L6234 电路：</b> <a href="https://www.st.com/resource/en/datasheet/l6234.pdf"><i class="fa fa-file"></i> 数据手册</a></td>
         </tr>
         <tr>
            <td>C1</td>
            <td>0.1 uF</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KEMET/C1206C104M5RECAUTO?qs=MLItCLRbWswBKiY20DF1SA%3D%3D">C1206C104M5RECAUTO</a></td>
         </tr>
         <tr>
            <td>C2</td>
            <td>0.01 uF</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KEMET/C1206C103J3RACAUTO?qs=%2Fha2pyFaduhAFP6oO4LLeYMkrC9QNia0EjiZTqcgzLScln%252BPiND5Ww%3D%3D">C1206C103J3RAUTO</a></td>
         </tr>
         <tr>
            <td>C3</td>
            <td>1 uF</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KEMET/C1206X105K3RAC3316?qs=%2Fha2pyFaduilEz%252BiJtRzoz0gb0S3v4m%252B2vm5WoIZPYxGhbTceT8iyu5uY%252BnsPWGD">C1206X105K3RAC3316</a></td>
         </tr>
         <tr>
            <td>C4</td>
            <td>0.22 uF</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KEMET/C1206C224J5RECAUTO7210?qs=%2Fha2pyFaduiFNVbEFQqG8g760vwSal6p%252BrMckdrZBQmtOlARWq3l2WWJv5HhNnqv">C1206C224J5RECAUTO7210</a></td>
         </tr>
         <tr>
            <td>CAP1</td>
            <td>100 uF（电解电容）</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/Panasonic/EEE-HAV101XAP?qs=%2Fha2pyFadujAo14cOabh4%2FHGWJclSBJVoXpO6qVRwLQTQ6LscWsHQA%3D%3D">EEEHAV101XAP</a></td>
         </tr>
         <tr>
            <td>BAT1</td>
            <td>肖特基二极管</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/Toshiba/TBAT54SLM?qs=kdd6aVn74hyQL5%252Beb9w%252BHw%3D%3D">TBAT54S,LM</a></td>
         </tr>
         <tr>
            <td>L6234</td>
            <td>电机驱动芯片</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/STMicroelectronics/L6234PD?qs=lgHKUCmDFtgFRXXnpwFpNg%3D%3D">L6234PD</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>上拉和下拉电阻</b></td>
         </tr>
         <tr>
            <td>PULL_SCL、PULL_SDA、R2</td>
            <td>4.7kΩ </td>
            <td>3</td>
            <td><a href="https://www.mouser.fr/ProductDetail/603-RC1210FR-074K7L">603-RC1210FR-074K7L</a></td>
         </tr>
         <tr>
            <td>PULL_A、PULL_B、PULL_I</td>
            <td>3kΩ </td>
            <td>3</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KOA-Speer/RN73H2ETTD3001F50?qs=%2Fha2pyFadugz1PN4m8q5QBmmNYUlMOzQI3k%2FT%252B8vFrn5l%2FvB8B97FQ%3D%3D">RN73H2ETTD3001F50</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>LED 电路</b></td>
         </tr>
         <tr>
            <td>D1</td>
            <td>红色 LED</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/Wurth-Elektronik/156120RS75300?qs=%2Fha2pyFaduhtSsTKzZu8BG2kEWNH5l3iOIVGi20HkjmxMeBY4VpJSw%3D%3D">156120RS75300</a></td>
         </tr>
         <tr>
            <td>R1</td>
            <td>620Ω </td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KOA-Speer/RN73H2ETTD6200F50?qs=%2Fha2pyFadugz1PN4m8q5QKhCzpicGijTcn6N2kk6lgXhcYi6JSLlrg%3D%3D">RN73H2ETTD6200F50</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>线性稳压器电路</b></td>
         </tr>
         <tr>
            <td>L1</td>
            <td>L78M08</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/STMicroelectronics/L78M08CDT-TR?qs=ffCs9zvlEwgmdeb5KIHMuA%3D%3D">L78M08CDT-TR</a></td>
         </tr>
         <tr>
             <td>CL1</td>
            <td>0.1 uF</td>
            <td>1</td>
            <td><a href="https://eu.mouser.com/c/?q=C1206C104M5RECAUTO">C1206C104M5RECAUTO</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>电流检测电路</b></td>
         </tr>
         <tr>
            <td>CBY1</td>
            <td>0.1 uF</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KEMET/C1206C224J5RECAUTO7210?qs=%2Fha2pyFaduiFNVbEFQqG8g760vwSal6p%252BrMckdrZBQmtOlARWq3l2WWJv5HhNnqv">C1206C224J5RECAUTO7210</a></td>
         </tr>
         <tr>
             <td>INA1、INA2</td>
            <td>INA240A2 电流检测放大器</td>
            <td>2</td>
            <td><a href="https://eu.mouser.com/ProductDetail/Texas-Instruments/INA240A2QPWRQ1/?qs=Bho%2FbeBaDEy8f96mmgMD%2Fw%3D%3D">INA240A2</a></td>
         </tr>
         <tr>
            <td>RCS1、RCS2</td>
            <td>0.01 欧姆（或 0.006 欧姆）2512 封装</td>
            <td>2</td>
            <td><a href="https://eu.mouser.com/ProductDetail/Vishay-Dale/WSLT2512R0100FEA/?qs=eFWhpKjIuGgySlBeZZzAWQ%3D%3D">WSLT2512R0100FEA</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>端子连接器</b></td>
         </tr>
         <tr>
            <td>TB_M1</td>
            <td>3 针，5mm</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-03BE?qs=%2Fha2pyFadujMo%2F8XIx7GL3VaKbn4rpnI4huWO6RUre2577fclJuWwA%3D%3D">TB002-500-03BE</a></td>
         </tr>
         <tr>
            <td>TB_PWR</td>
            <td>2 针，5mm</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-02BE?qs=%2Fha2pyFadujMo%2F8XIx7GL%2F8B4TM%252BUPJvcyODkgPPYDPGTjOBZNS5pw%3D%3D">TB002-500-02BE</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>排针连接器</b></td>
         </tr>
         <tr>
            <td>P1、P4、P2、P3</td>
            <td>8 针、10 针、6 针母头，长脚</td>
            <td>2</td>
            <td><a href="https://www.sparkfun.com/products/11417">sparkfun</a> <a href="https://store.arduino.cc/strip-2x3-6-8-10-ways-arduino-uno-printed?queryID=70fa5b2be995a4e88b89876392222482">Arduino</a> </td>
         </tr>
         <tr>
            <td>P_ENC</td>
            <td>5 针，公头/母头</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/649-1012937990501BLF ">649-1012937990501BLF</a></td>
         </tr>
      </tbody>
   </table>

您可以在 [<i class="fa fa-file"></i> 物料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield) 链接下载相同的列表（针对 PCB 制造商进行了一些优化）。我使用 [Mouser](https://www.mouser.com/) 作为元件供应商，但该电路板的元件在其他任何供应商处都应该很容易找到。元件价格约为每块电路板 10 美元，运费同样约为 20 美元（对于 50 美元以下的订单）。
<blockquote class="warning"> <p class="heading">注意</p>
我选择的带有制造商编号的元件并非一成不变，如有必要，您可以在价格和参数方面对其进行优化。</blockquote>

### 电路板组装和焊接
当您拥有所有元件和 PCB 后，有趣的部分就开始了。所有元件都相对容易焊接。所有电容都是 `1206` 封装，所有电阻都是 `1210` 封装，连接器都是通孔的，没有真正的小型表面贴装元件。因此，只要有一些耐心，使用普通的电烙铁和一点时间，您应该能顺利焊接好这块电路板。所以，喝杯咖啡，深吸一口气，准备好享受 20 分钟的乐趣吧。唯一不太容易的部分是两个电流检测放大器 INA240，但它们也不是那么小😊。

<blockquote class="info"> <p class="heading">注意</p>
电路板本身已经印有元件的名称，因此应该很容易确定哪个元件放在哪里。如果您喜欢印刷版本，在 <a href="https://github.com/simplefoc/Arduino-SimpleFOCShield"><i class="fa fa-file"></i> gerber 文件</a> 的拾取和放置文件夹中还有装配图。
</blockquote>


## PCB 制作和组装服务 - **首选方案** 📢
这种选择简单得多，并且能产生更好的结果。对于数量大于 50 片的情况，它甚至更便宜。
要订购电路板，请下载 [<i class="fa fa-file"></i> Gerber 文件](https://github.com/simplefoc/Arduino-SimpleFOCShield) 和 [<i class="fa fa-file"></i> 物料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield) 并提供给您选择的制造商。我使用的是 [JLCPCB](https://jlcpcb.com/)。

<iframe class="youtube"  src="https://www.youtube.com/embed/sax_9sUgBuk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 完全组装版本
从我们的 [商店](https://simplefoc.com/shop) 订购您自己的经过全面测试和组装的 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>。
