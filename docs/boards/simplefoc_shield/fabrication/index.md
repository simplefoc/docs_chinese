---
layout: default
title: 制作指南
description: "Arduino SimpleFOCShield board fabrication"
parent: <span class="simple">Simple<span class="foc">FOC</span>Shield</span>
grand_parent: <span class="simple">Simple<span class="foc">FOC</span> Boards</span>
nav_order: 2
permalink: /arduino_simplefoc_shield_fabrication
has_children: true
has_toc: false
---
# <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 制作指南
以下是 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span> 的快速制作指南，查看最新版本请点击 [最新版本 <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)。这里我们将展示 <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v1、v2 和 v3 这三个最新版本。

<div class="image_icon width30" >
    <a href="arduino_simplefoc_shield_fabrication_v1" >
        <img style="width:50%;display:inline" src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v1.3.3/images/top.png" > <img style="width:50%;display:inline" src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v1.3.3/images/bottom.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
        <p> <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v1</p>
    </a>
</div>

<div class="image_icon width30" >
    <a href="arduino_simplefoc_shield_fabrication_v2" >
        <img style="width:50%;display:inline" src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v2.0.4/images/top.png" > <img style="width:50%;display:inline" src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v2.0.4/images/bottom.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
        <p > <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v2</p>
    </a>
</div>

<div class="image_icon width30" >
    <a href="arduino_simplefoc_shield_fabrication_v3" >
        <img style="margin-left:3%;margin-right:3%;width:42%;display:inline" src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v3.2/images/top.png" > <img style="margin-left:3%;margin-right:3%;width:42%;display:inline" src="https://raw.githubusercontent.com/simplefoc/Arduino-SimpleFOCShield/v3.2/images/bottom.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
        <p > <span class="simple">Simple<span class="foc">FOC</span>Shield</span> v3</p>
    </a>
</div>

## 电路板版本发布
要查看发布时间线，请点击 [这里](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases)

版本  |链接 | 发布日期 | 说明
----- | ----- | ---- | ----
*Simple**FOC**Shield* **v1.3** |[release v1.3](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3) | 2020年4月 | 初始版本
*Simple**FOC**Shield* v1.3.1 | [release v1.3.1](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3.1) | 2020年7月 | 增加了 Nucleo 堆叠支持
*Simple**FOC**Shield* v1.3.2 |[release v1.3.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3.2) | 2020年9月 | 增加了 I2C 上拉电阻
*Simple**FOC**Shield* v1.3.3 |[release v1.3.3](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v1.3.3) | 2020年12月 | 适配 L6234 电路 + 完整的 Arduino 引脚
*Simple**FOC**Shield* **v2.0** |[release v2.0](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0) | 2021年1月 | - 3A 串联电流检测<br>- 5V 稳压器<br>- 新的硬件配置引脚排列
*Simple**FOC**Shield* v2.0.1 |[release v2.0.1](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.1) | 2021年1月 | - 减小过孔尺寸<br>- 可配置范围
*Simple**FOC**Shield* v2.0.2 |[release v2.0.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.2) | 2021年2月 | 将 7805（连接到 5V）替换为 78M08（连接到 VIN），以兼容 stm32 Nucleo-64
*Simple**FOC**Shield* v2.0.3 |[release v2.0.3](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.3) | 2021年3月 | - 缩短了从 ADC 到电流检测的线路<br>- 打字错误修复：底面标签交换了 A 相和 B 相
*Simple**FOC**Shield* v2.0.4 |[release v2.0.4](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v2.0.4) | 2021年9月 | - 上拉配置简化<br>- 最大输入电压 35V<br>- 移除 CAP2，换成 CL1<br>- 项目的 Easy EDA 版本
*Simple**FOC**Shield* v3.1 |release v3.1 | 2022年10月 | - 完全重新设计<br>- 改用 DRV8313<br>- 改用 ACS712<br>- 更小的尺寸：56mm x 53mm<br>- 引出故障和复位引脚（可选）<br>- 故障 LED 指示<br>- 完全使用 EasyEDA 开发
*Simple**FOC**Shield* **v3.2** |[release v3.2](https://github.com/simplefoc/Arduino-SimpleFOCShield/releases/tag/v3.2) | 2024年4月 | - 正式发布<br>- 解决了漏洞 [#9](https://github.com/simplefoc/Arduino-SimpleFOCShield/issues/9)


## 完全组装版本
可从我们的 [商店](https://simplefoc.com/simplefoc_shield_product) 订购经过全面测试和组装的 Arduino <span class="simple">Simple<span class="foc">FOC</span>Shield</span>。
