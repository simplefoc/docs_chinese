---
layout: default
title: 制作指南
description: "Arduino SimpleFOCMini board fabrication"
parent: <span class="simple">Simple<span class="foc">FOC</span>Mini</span>
grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
nav_order: 2
permalink: /mini_fabrication
has_children: true
has_toc: false
toc: true
---

# <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 制作指南
以下是制作 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 电路板的快速指南。该电路板是使用 EasyEDA 软件设计的，这使得通过 JLCPCB 网站进行制作变得非常容易。


## 分步指南
第一步是进入 [EasyEDA 的项目库](https://oshwlab.com/the.skuric/simplefocmini)，在 EasyEDA 编辑器中打开 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> 项目。
<p><img src="extras/Images/mini_fab (3).png" class="width60"></p>

然后，你需要点击打开 <span class="simple">Simple<span class="foc">FOC</span>Mini</span> PCB 文件，接着在顶部菜单栏的“制造”下拉菜单中选择“一键下单 PCB/SMT”。
<p><img src="extras/Images/mini_fab (4).png" class="width60"></p>

会弹出一个窗口，询问是否要进行设计规则检查，这不是必需的，所以你可以点击“否，继续下单”。
<p><img src="extras/Images/mini_fab (5).png" class="width60"></p>
文件生成后，会弹出一个新窗口，在那里你只需点击“确定”。
<p><img src="extras/Images/mini_fab (6).png" class="width60"></p>

你将被重定向到 [JLCPCB 网站](https://cart.jlcpcb.com/quote?orderType=1&stencilLayer=2&stencilWidth=100&stencilLength=100&stencilCounts=5)，所有条目都已填写完毕。你只需要选择你想要制作的电路板颜色和数量，然后到页面底部点击“确认”。
<p><img src="extras/Images/mini_fab (7).png" class="width60"></p>
BOM（物料清单）和 CPL 文件应该会自动加载，之后你可以点击“下一步”。你需要提供购买描述，填写“DIY”即可。
<p><img src="extras/Images/mini_fab (8).png" class="width60"></p>
在下一个窗口中，你会看到 BOM 中列出的所有元件，这里建议你取消勾选两个通孔 female header 元件 H1 和 P1。其他所有内容都没问题，你可以点击“下一步”。
<p><img src="extras/Images/mini_fab (9).png" class="width60"></p>
就这样，最后一个窗口会显示你的购买摘要，并展示电路板的可视化效果。剩下要做的就是将其加入购物车，然后完成付款和 shipping 信息填写。
<p><img src="extras/Images/mini_fab (1).png" class="width60"></p>


## 制作价格
在 JLCPCB 网站上，5 块电路板的批量价格约为 32 美元，即每块电路板 7.5 美元。运费取决于你需要电路板的紧急程度，最慢的选项最便宜，16 个工作日送达的运费为 3 美元，而 2-5 天送达的运费从 20-50 美元不等。
