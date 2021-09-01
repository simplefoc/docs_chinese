---
layout: default
title: v2.0.2版本
description: "Arduino SimpleFOCShield board fabrication"
parent: 制作指南
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
nav_order: 2
permalink: /arduino_simplefoc_shield_fabrication_v2
---
# <span class="simple">Simple<span class="foc">FOC</span>Shield</span> <small><i>v2.0.2</i></small> 的制作指南
下面是一个如何制作 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> [version <i class="fa fa-tag"></i>V2.0.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 的快速指南。


<p align="">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v2.0.2/images/top.png"  class="width30"><img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v2.0.2/images/bottom.png"  class="width30">
</p>

## 驱动器的版本
查看发布的时间表，点击 [这里](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 

Version  | link | Release date | Comment
----- | ----- | ---- | ----
*Simple**FOC**Shield* v2.0 |[release v2.0](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0) | 01/21 | - 3A 在线电流 <br/>- 5V 稳压器 <br/>- 新的引脚配置 
*Simple**FOC**Shield* v2.0.1 |[release v2.0.1](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.1) | 01/21 | - 减少通孔尺寸 <br/> - configurable range > wait to translate 
*Simple**FOC**Shield* v2.0.2 |[release v2.0.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) | 01/21 | 将 7805（连接到 5V）替换为 7808（连接到 VIN）以兼容 stm32 Nucleo-64 




[<i class="fa fa-github"></i> Github](https://github.com/simplefoc/Arduino-SimpleFOCShield) repository contains: 
- <b><i class="fa fa-file"></i> Schematics</b> - PDF 文件
- <b><i class="fa fa-file"></i> Gerber</b> - Gerber, NC Drill & 装配文件
- <b><i class="fa fa-file"></i>  **Bill Of Materials (BOM)（物料清单）** - Excel 表格
- <b><i class="fa fa-file"></i> 3D model</b> -  3D PDF & STEP文件
- <b><i class="fa fa-file"></i> PCB design project（PCB设计项目）</b> - Altium Designer 2019


## 制造工艺及成本
制造的价格将由板的数量和PCB制造商和组件供应商决定。这里有两篇很好的文章，解释了如何从 [electronics-notes.com](https://www.electronics-notes.com/articles/constructional_techniques/printed-circuit-board-pcb/how-to-choose-right-best-pcb-manufacturer.php) 网站选择 PCB 制造商和从 [pcbonline.com](https://www.pcbonline.com/blog/How_to_Choose_a_PCB_Component_Supplier_165.html) 网站选择组件供应商。但在大多数情况下人们选择的重点考虑因素是价格。 :)

## 制造 PCB +自行装配
虽然大多数元件都是比较大贴片元件，比较方便焊接，但电流检测放大器会有点困难。 如果您对这种制作电路板的方式感兴趣，这里有一个制作方法的快速指南。

### PCB 制造

下载 [<i class="fa fa-file"></i> gerber files](https://github.com/simplefoc/Arduino-SimpleFOCShield) 提供给 PCB 制造商。目前，我使用了 [seeedstrudio](https://www.seeedstudio.com/) 和 [JLCPCB](https://jlcpcb.com/)。 10 个 PCB 的价格约是 5\$，但运输费用大约用了 20\$。

| Quantity（数量） | SeedStudio | JLCPCB |
| ---------------- | ---------- | ------ |
| 5                | 5€         | 2€     |
| 10               | 5€         | 2€     |
| 30               | 30€        | 15€    |
| 50               | 50€        | 30€    |

<i class="fa fa-info-circle"></i> <i><small>除此之外，你还需要支付大约  20€ （20欧元）的运费。</small></i>

### 采购元器件
这里你制造板子需要的所有组件的完整的列表：
<table>
      <thead>
         <tr>
            <th>元件</th>
            <th>说明</th>
            <th>数量</th>
            <th>商品编号</th>
         </tr>
      </thead>
      <tbody>
         <tr>
            <td colspan="4"><b>L6234 电路:</b> <a href="https://www.st.com/resource/en/datasheet/l6234.pdf"><i class="fa fa-file"></i> Datasheet</a></td>
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
            <td>100 uF (Electrolytic)</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/Panasonic/EEE-HAV101XAP?qs=%2Fha2pyFadujAo14cOabh4%2FHGWJclSBJVoXpO6qVRwLQTQ6LscWsHQA%3D%3D">EEEHAV101XAP</a></td>
         </tr>
         <tr>
            <td>BAT1</td>
            <td>Schottky diodes</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/Toshiba/TBAT54SLM?qs=kdd6aVn74hyQL5%252Beb9w%252BHw%3D%3D">TBAT54S,LM</a></td>
         </tr>
         <tr>
            <td>L6234</td>
            <td>Motor driver chip</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/STMicroelectronics/L6234PD?qs=lgHKUCmDFtgFRXXnpwFpNg%3D%3D">L6234PD</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>上拉和下拉电阻</b></td>
         </tr>
         <tr>
            <td>PULL_SCL, PULL_SDA, R2</td>
            <td>4.7kΩ </td>
            <td>3</td>
            <td><a href="https://www.mouser.fr/ProductDetail/603-RC1210FR-074K7L">603-RC1210FR-074K7L</a></td>
         </tr>
         <tr>
            <td>PULL_A, PULL_B, PULL_I</td>
            <td>3kΩ </td>
            <td>3</td>
            <td><a href="https://www.mouser.fr/ProductDetail/KOA-Speer/RN73H2ETTD3001F50?qs=%2Fha2pyFadugz1PN4m8q5QBmmNYUlMOzQI3k%2FT%252B8vFrn5l%2FvB8B97FQ%3D%3D">RN73H2ETTD3001F50</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>LED 电路</b></td>
         </tr>
         <tr>
            <td>D1</td>
            <td>Red LED</td>
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
            <td>L7808</td>
            <td>1</td>
            <td><a href="https://eu.mouser.com/ProductDetail/STMicroelectronics/L7808ABD2T-TR/?qs=%2Fha2pyFaduhJaWWi9Q0Ux5qBhxdStDSDVBKjt6TWzIYi2UHCV3ncDg%3D%3D">L7808ABD2T-TR</a></td>
         </tr>
         <tr>
             <td>CAP2</td>
            <td>10 uF (Electrolytic)</td>
            <td>1</td>
            <td><a href="https://eu.mouser.com/ProductDetail/Lelon/VZH-100M1HTR-0606/?qs=%2Fha2pyFadug9fpMd9zS1WVuLY1XOmrV1BVzFD1joM%252BDTbPmM%252BxSOHg%3D%3D">VZH100M1HTR-0606</a></td>
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
             <td>INA1, INA2</td>
            <td>INA240A2 current sense amp</td>
            <td>2</td>
            <td><a href="https://eu.mouser.com/ProductDetail/Texas-Instruments/INA240A2QPWRQ1/?qs=Bho%2FbeBaDEy8f96mmgMD%2Fw%3D%3D">INA240A2</a></td>
         </tr>
         <tr>
            <td>RCS1, RCS2</td>
            <td>0.01Ohm (or 0.006Ohm) 2512</td>
            <td>2</td>
            <td><a href="https://eu.mouser.com/ProductDetail/Vishay-Dale/WSLT2512R0100FEA/?qs=eFWhpKjIuGgySlBeZZzAWQ%3D%3D">WSLT2512R0100FEA</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>端子连接器</b></td>
         </tr>
         <tr>
            <td>TB_M1</td>
            <td>3 pin, 5mm</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-03BE?qs=%2Fha2pyFadujMo%2F8XIx7GL3VaKbn4rpnI4huWO6RUre2577fclJuWwA%3D%3D">TB002-500-03BE</a></td>
         </tr>
         <tr>
            <td>TB_PWR</td>
            <td>2 pin, 5mm</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-02BE?qs=%2Fha2pyFadujMo%2F8XIx7GL%2F8B4TM%252BUPJvcyODkgPPYDPGTjOBZNS5pw%3D%3D">TB002-500-02BE</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>排针排母</b></td>
         </tr>
         <tr>
            <td>P1, P4</td>
            <td>8 pin, female, long</td>
            <td>2</td>
            <td><a href="https://www.mouser.fr/ProductDetail/872-920-0086-01">872-920-0086-01</a></td>
         </tr>
         <tr>
            <td> P2</td>
            <td>10 pin, female, long</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/872-920-0087-01">872-920-0087-01</a></td>
         </tr>
         <tr>
            <td>P3</td>
            <td>6  pin, female, long</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/Gravitech/6fx1L-254mm?qs=%2Fha2pyFadugTMKIzmATdF3ycHTdv4fz%2FLeD9aI6nqeEU9o9FRZ5XDw%3D%3D">6fx1L-254mm</a></td>
         </tr>
         <tr>
            <td>P_ENC</td>
            <td> 5 pin, male/female</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/649-1012937990501BLF ">649-1012937990501BLF</a></td>
         </tr>
      </tbody>
   </table>

同样的列表（为PCB制造商做了一点优化）可以从 [<i class="fa fa-file"></i> 材料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield)。我制造板子时，在 [Mouser](https://www.mouser.com/) 供应商那里采购。但这个板的组件应该很容易找到任何其他供应商。组件的价格大约是每个板子 10\$ ，运费大约是 20\$ （订单低于 50\$）。   

<blockquote class="warning"> <p class="heading">注意</p>
我选择的元件型号的组件并不是唯一的，如果有必要可以在价格和价值方面考虑其他类似型号。 </blockquote>


### 驱动器的装配和焊接

准备好PCB和元器件后就可以开始动手啦。所有部件都挺容易焊接的。所有电容都是 `1206`封装，所有电阻都是 `1210`封装，连接器都是过孔的，没有小 SMD 元件。所以耐心地用一个常规的烙铁，花一点时间来焊接这个板是没有问题的。因此，深呼吸，慢慢enjoy焊接20分钟吧。

<blockquote class="info"> <p class="heading">Note</p>
板子本身已经有了元件的符号，所以应该很容易确定哪个组件在哪里。如果您想要打印版本，在 <a href="https://github.com/simplefoc/Arduino-SimpleFOCShield"><i class="fa fa-file"></i> gerber 文件</a> 的 Pick 和 Place 文件夹中还有一个组装图。
</blockquote>



## PCB 制造和装配服务 - **推荐** 📢

这个选项更简单，并且产生更好的结果。如果数量大的话，价格会更便宜，比如 > 50 个。要订购电路板，请下载 [<i class="fa fa-file"></i> Gerber 文件](https://github.com/simplefoc/Arduino-SimpleFOCShield) 和 [<i class="fa fa-file"></i> 材料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield) ，并将其提供给您选择的制造商。在我的例子中，我使用 [JLCPCB](https://jlcpcb.com/)。

<iframe class="youtube"  src="https://www.youtube.com/embed/sax_9sUgBuk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<<<<<<< HEAD

## 完成装配好的版本
从我们的 [商店](https://simplefoc.com/simplefoc_shield_product) 中购买完成测试好装配好的 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 。
=======
## 完成装配好的版本

从我们的 [商店](https://simplefoc.com/simplefoc_shield_product) 中购买完成测试好装配好的 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 。

