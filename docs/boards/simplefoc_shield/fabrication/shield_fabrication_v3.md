---
layout: default
title: Shield v3.x
description: "Arduino SimpleFOCShield board fabrication"
parent: 制作指南
grand_parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
nav_order: 3
permalink: /arduino_simplefoc_shield_fabrication_v3
toc: true
---

# <span class="simple">简易<span class="foc">FOC</span>扩展板</span> 制作指南 <small><i>v3.x 版本</i></small>
以下是 Arduino <span class="simple">简易<span class="foc">FOC</span>扩展板</span> [版本 <i class="fa fa-tag"></i>V3.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases) 的快速制作指南。


<p align="">
<img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v3.2/images/top.png"  class="width30"><img src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v3.2/images/bottom.png"  class="width30">
</p>


<blockquote class="info"> 📢 官方 Easy EDA 项目 <a href="https://oshwlab.com/the.skuric/simplefocshield_copy_copy"> 点击此处 <i class="fa fa-external-link"></i></a><br></blockquote>
<blockquote>
<a href="https://oshwlab.com/the.skuric/simplefocshield_copy_copy"><img src="extras/Images/shield_easyeda.jpg" class="width40"></a>
</blockquote>

## 电路板版本发布
查看发布时间线，请点击 [这里](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)。

| 版本 | 链接 | 发布日期 | 说明 |
|-----|-----|----|----|
| *简易**FOC**扩展板* v3.1 | release v3.1 | 10/22 | - 完全重新设计<br>- 改用 DRV8313 芯片<br>- 改用 ACS712 芯片<br>- 更小尺寸：56mm x 53mm<br>- 引出故障和复位引脚（可选）<br>- 故障LED指示<br>- 完全使用EasyEDA开发 |
| *简易**FOC**扩展板* v3.2 | [release v3.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.4) | 04/24 | - 正式发布<br>- 解决了 #9 号漏洞 [链接](https://github.com/simplefoc/Arduino-SimpleFOCShield/issues/9) |





[<i class="fa fa-github"></i> Github](https://github.com/simplefoc/Arduino-SimpleFOCShield) 仓库包含：
- <b><i class="fa fa-file"></i> 原理图</b> - PDF文件
- <b><i class="fa fa-file"></i> Gerber文件</b> - Gerber、NC钻孔及装配文件
- <b><i class="fa fa-file"></i> 物料清单（BOM）</b> - Excel表格
- <b><i class="fa fa-file"></i> 3D模型</b> - 3D PDF和STEP文件
- <b><i class="fa fa-file"></i> PCB设计项目</b> - EasyEDA/Altium Designer格式


## 制作流程和成本
制作价格在很大程度上取决于电路板的数量以及你选择的PCB制造商和元件供应商。以下是两篇不错的文章，解释了如何选择PCB制造商（来自 [electronics-notes.com](https://www.electronics-notes.com/articles/constructional_techniques/printed-circuit-board-pcb/how-to-choose-right-best-pcb-manufacturer.php)）和元件供应商（来自 [electronics-notes.com](https://www.electronics-notes.com/articles/constructional_techniques/printed-circuit-board-pcb/how-to-choose-right-best-pcb-manufacturer.php)）。但在大多数情况下，价格往往是关键因素。

一般来说，制作板子主要有两种方式：
- PCB制作 + 自行组装 - [了解更多](#pcb制作--自行组装)
- PCB制作和组装服务
  - 使用嘉立创（JLCPCB）- [了解更多](#使用嘉立创（JLCPCB）进行PCBA制作的分步指南--首选方案-) 📢 **首选（更简单）方案**
  - 使用其他制造商 - [了解更多](#其他制造商的pcb制作和组装服务)


## PCB制作 + 自行组装
与v1和v2版本相比，v3版本的扩展板不再使用大型SMD元件。因此，这个版本的自行制作要求稍高一些，因为所有的电阻、电容和二极管都采用0603封装（而v1和v2版本采用1206封装）。不过，如果你有兴趣用这种方式制作该板，以下是一个快速指南。

### PCB制作
下载 [<i class="fa fa-file"></i> gerber文件](https://github.com/simplefoc/Arduino-SimpleFOCShield) 并提供给你选择的PCB制造商。到目前为止，我使用过 [seeedstrudio](https://www.seeedstudio.com/) 和 [JLCPCB](https://jlcpcb.com/)。10块PCB的价格大约是5美元，但运费大约是20美元。

| 数量 | SeedStudio | JLCPCB |
|---- | ---- | ---- |
| 5 | 5欧元 | 2欧元 |
| 10 | 5欧元 | 2欧元 |
| 30 | 30欧元 | 15欧元 |
| 50 | 50欧元 | 30欧元 |

<i class="fa fa-info-circle"></i> <i><small>除了上述价格外，你还需要支付约20欧元的运费。</small></i>

### 元件采购
以下是制作该电路板所需的所有元件的完整清单：
<table>
      <thead>
         <tr>
            <th>元件</th>
            <th>描述</th>
            <th>数量</th>
            <th>制造商编号（仅示例）</th>
         </tr>
      </thead>
      <tbody>
         <tr>
            <td colspan="4"><b>DRV8313 电路：</b> <a href="https://www.ti.com/lit/ds/symlink/drv8313.pdf?ts=1719079575798"><i class="fa fa-file"></i> 数据手册</a></td>
         </tr>
         <tr>
            <td>C5</td>
            <td>470 nF</td>
            <td>1</td>
            <td><a href="https://jlcpcb.com/partdetail/Yageo-CC0603ZRY5V6BB474/C327269">CC0603ZRY5V6BB474</a></td>
         </tr>
         <tr>
            <td>C6</td>
            <td>100 uF（电解电容）</td>
            <td>1</td>
            <td><a href="https://jlcpcb.com/partdetail/279343-VT1V101MCRE77/C294520">VT1V101M-CRE77</a></td>
         </tr>
         <tr>
            <td>C7, C8</td>
            <td>1 uF</td>
            <td>2</td>
            <td><a href="https://jlcpcb.com/partdetail/1943-CL10B104KB8NNNC/C1591">CL10B104KB8NNNC</a></td>
         </tr>
         <tr>
            <td>R6, R5</td>
            <td>4.7 kΩ</td>
            <td>2</td>
            <td><a href="https://jlcpcb.com/parts/componentSearch?searchTxt=0603WAF4701T5E">0603WAF4701T5E</a></td>
         </tr>
         <tr>
            <td>R3</td>
            <td>330 Ω</td>
            <td>1</td>
            <td><a href="https://jlcpcb.com/partdetail/23865-0603WAF3300T5E/C23138">0603WAF3300T5E</a></td>
         </tr>
         <tr>
            <td>DRV8313</td>
            <td>电机驱动芯片</td>
            <td>1</td>
            <td><a href="https://jlcpcb.com/partdetail/TexasInstruments-DRV8313PWPR/C92482">DRV8313PWPR</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>上拉和下拉电阻</b></td>
         </tr>
         <tr>
            <td>PULL_SCL, PULL_SDA, R2</td>
            <td>4.7 kΩ</td>
            <td>3</td>
            <td><a href="https://jlcpcb.com/parts/componentSearch?searchTxt=0603WAF4701T5E">0603WAF4701T5E</a></td>
         </tr>
         <tr>
            <td>PULL_A, PULL_B, PULL_I</td>
            <td>3.3 kΩ</td>
            <td>3</td>
            <td><a href="https://jlcpcb.com/partdetail/23705-0603WAF3301T5E/C22978">RN73H2ETTD3001F50</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>LED电路</b></td>
         </tr>
         <tr>
            <td>D1, D2</td>
            <td>LED（任意颜色）</td>
            <td>2</td>
            <td><a href="https://jlcpcb.com/partdetail/73147-19_213_Y2C_CQ2R2L_3T_CY/C72038">19-213/Y2C-CQ2R2L/3T(CY)</a></td>
         </tr>
         <tr>
            <td>R1</td>
            <td>4.7 kΩ</td>
            <td>1</td>
            <td><a href="https://jlcpcb.com/parts/componentSearch?searchTxt=0603WAF4701T5E">0603WAF4701T5E</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>线性稳压器电路</b></td>
         </tr>
         <tr>
            <td>L1</td>
            <td>L78M08</td>
            <td>1</td>
            <td><a href="https://jlcpcb.com/partdetail/Stmicroelectronics-L78M08ABDTTR/C273659">L78M08ABDT-TR</a></td>
         </tr>
         <tr>
             <td>CL1</td>
            <td>0.1 uF</td>
            <td>1</td>
            <td><a href="https://jlcpcb.com/partdetail/Yageo-CC0603KRX7R9BB104/C14663">CC0603KRX7R9BB104</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>电流检测电路</b></td>
         </tr>
         <tr>
            <td>CBYP1,CBYP2</td>
            <td>1 uF</td>
            <td>2</td>
            <td><a href="https://jlcpcb.com/partdetail/16531-CL10A105KB8NNNC/C15849">CL10A105KB8NNNC</a></td>
         </tr>
         <tr>
             <td>CS1,CS2</td>
            <td>ACS712ELCTR-05B-T 电流检测芯片</td>
            <td>2</td>
            <td><a href="https://jlcpcb.com/partdetail/45473-ACS712ELCTR_05BT/C44471">ACS712ELCTR-05B-T</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>端子连接器</b></td>
         </tr>
         <tr>
            <td>TB_M1</td>
            <td>3脚，5mm</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-03BE?qs=%2Fha2pyFadujMo%2F8XIx7GL3VaKbn4rpnI4huWO6RUre2577fclJuWwA%3D%3D">TB002-500-03BE</a></td>
         </tr>
         <tr>
            <td>TB_PWR</td>
            <td>2脚，5mm</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/CUI-Devices/TB002-500-02BE?qs=%2Fha2pyFadujMo%2F8XIx7GL%2F8B4TM%252BUPJvcyODkgPPYDPGTjOBZNS5pw%3D%3D">TB002-500-02BE</a></td>
         </tr>
         <tr>
            <td colspan="4"><b>排针连接器</b></td>
         </tr>
         <tr>
            <td>P1, P4, P2, P3</td>
            <td>8脚、10脚、6脚 female，长脚</td>
            <td>2</td>
            <td><a href="https://www.sparkfun.com/products/11417">sparkfun</a> <a href="https://store.arduino.cc/strip-2x3-6-8-10-ways-arduino-uno-printed?queryID=70fa5b2be995a4e88b89876392222482">Arduino</a> </td>
         </tr>
         <tr>
            <td>P_ENC</td>
            <td>5脚，公/母</td>
            <td>1</td>
            <td><a href="https://www.mouser.fr/ProductDetail/649-1012937990501BLF ">649-1012937990501BLF</a></td>
         </tr>
      </tbody>
   </table>

你可以从链接 [<i class="fa fa-file"></i> 物料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield) 下载相同的清单（针对PCB制造商进行了优化）。
<blockquote class="warning"> <p class="heading">注意</p>
我选择的带有制造商编号的元件并非固定不变，如有必要，你可以根据价格和参数进行优化。</blockquote>

## 使用JLCPCB进行PCBA制作的分步指南--首选方案- 📢


以下是制作 <span class="simple">简易<span class="foc">FOC</span>扩展板</span> 的快速指南。该电路板使用EasyEDA软件设计，因此非常容易通过JLCPCB网站进行制作。


## 分步指南


第一步是进入 [EasyEDA的项目库](https://oshwlab.com/the.skuric/simplefocshield_copy_copy)，在EasyEDA编辑器中打开 <span class="simple">简易<span class="foc">FOC</span>扩展板</span> 项目。
<p><img src="extras/Images/v3 (1).jpg" class="width60"></p>

然后，你需要点击打开 <span class="simple">简易<span class="foc">FOC</span>扩展板</span> 的PCB文件，然后在顶部菜单栏的下拉菜单 ***Fabrication*** 中选择 ***One-click order PCB/SMT***。
<p><img src="extras/Images/v3 (2).jpg" class="width60"></p>

会弹出一个窗口，询问是否要进行设计规则检查，这不是必需的，所以你可以点击 ***No, continue and Order***。
<p><img src="extras/Images/v3 (3).jpg" class="width60"></p>
<p><img src="extras/Images/v3 (4).jpg" class="width60"></p>
文件生成后，会弹出一个新窗口，你只需点击 *** OK *** 即可。
<p><img src="extras/Images/v3 (5).jpg" class="width60"></p>
你将被重定向到 [JLCPCB网站](https://cart.jlcpcb.com/quote?orderType=1&stencilLayer=2&stencilWidth=100&stencilLength=100&stencilCounts=5)，所有条目都已填写完毕。你只需选择要制作的电路板颜色和数量。
<p><img src="extras/Images/v3 (6).jpg" class="width60"></p>
然后到页面底部，点击 ***Confirm***。
<p><img src="extras/Images/v3 (7).jpg" class="width60"></p>
Gerber文件查看器将打开，你可以点击 **Next**。
<p><img src="extras/Images/v3 (8).jpg" class="width60"></p>
BOM和CPL文件应该会自动加载，然后你可以点击 ***Continue***。
<p><img src="extras/Images/v3 (9).jpg" class="width60"></p>

在下一个窗口中，你将看到BOM（物料清单）中显示的所有元件，在我的案例中，可能会因为临时缺货而缺少一些元件。
<p><img src="extras/Images/v3 (10).jpg" class="width60"></p>
如果出现这种情况，用可用的元件替换缺失的元件。
- 确保在搜索提示中添加封装 `0603`
- 勾选有库存的框
- 也可以尝试勾选基本元件框（基本元件更便宜）
<p><img src="extras/Images/v3 (11).jpg" class="width60"></p>

当你准备好所有元件后，确保选中所有元件，然后可以点击 ***Next***。
<p><img src="extras/Images/v3 (12).jpg" class="width60"></p>

下一个窗口将显示元件在电路板上的放置情况。在这里你可以看到电路板上的元件，并验证它们的方向是否正确。
有三个元件几乎总是会放错方向：
- LM7808稳压器
- 两个二极管
要纠正它们的方向，选中它们并点击 ***Rotate*** 两次！
<p><img src="extras/Images/v3 (13).jpg" class="width60"></p>

所有元件放置好后，点击 **Next**。
<p><img src="extras/Images/v3 (14).jpg" class="width60"></p>

这样，困难的部分就完成了。下一个窗口会询问订单原因，你可以选择最适合你的选项。在我的案例中，我通常选择 ***DIY***。
<p><img src="extras/Images/v3 (15).jpg" class="width60"></p>

剩下要做的就是将其加入购物车，然后完成付款和地址信息填写。
<p><img src="extras/Images/v3 (16).jpg" class="width60"></p>


## 其他制造商的PCB制作和组装服务
这种选择简单得多，并且能产生更好的结果。对于数量大于50片的情况，它甚至更便宜。
要订购电路板，请下载 [<i class="fa fa-file"></i> Gerber文件](https://github.com/simplefoc/Arduino-SimpleFOCShield) 和 [<i class="fa fa-file"></i> 物料清单](https://github.com/simplefoc/Arduino-SimpleFOCShield)，并提供给你选择的制造商。我使用的是 [JLCPCB](https://jlcpcb.com/)。

<iframe class="youtube"  src="https://www.youtube.com/embed/sax_9sUgBuk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<blockquote class="warning">该视频是针对扩展板的v2版本制作的，但相同的步骤也可用于v3.x版本。此外，该视频制作于2021年，在此期间，JLCPCB网站界面有所演变，但重要步骤仍然相同。</blockquote>

## 完全组装版本
从我们的 [商店](https://simplefoc.com/shop) 订购你自己的经过全面测试和组装的 Arduino <span class="simple">简易<span class="foc">FOC</span>扩展板</span>。
