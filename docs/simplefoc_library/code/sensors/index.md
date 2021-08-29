---
layout: default
title: 位置传感器
description: "Arduino Simple Field Oriented Control (FOC) library ."
permalink: /sensors
nav_order: 4
parent: 代码
has_children: True
has_toc: False
grand_parent: Arduino <span class="simple">Simple<span class="foc">FOC</span>library</span>
---

# 位置传感器
这个库支持现成的这些类型的位置传感器:

- [编码器](encoder): 
    - 传感器计数的 `A`, `B` 和 `index` :通道脉冲来估计位置。
    - 例子: 
        - 光学: [OMRON 1000P <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/OMRON-1000P-Incremental-Rotary-Encoder-1000p-r-E6B2-CWZ1X-Differential-Signal/303247826877?hash=item469afa9fbd:g:BsYAAOSwb2hdTCQB)
        - 电容式: [AMT103 CUI <i class="fa fa-external-link"></i>](https://www.mouser.fr/ProductDetail/CUI-Devices/AMT103-V?qs=%2Fha2pyFaduiAsBlScvLoAWHUnKz39jAIpNPVt58AQ0PVb84dpbt53g%3D%3D)
        - 磁: [AS5047U <i class="fa fa-external-link"></i>](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D) - using ABI
- [磁传感器](magnetic_sensor): 
    - 利用精确的磁场测量来估计位置的传感器。
        - 它们有很多不同的通信标准，比如: SPI, SSI, I2C, ABI, UVW, PWM...
        - **Supported communications:** ([releases <i class="fa fa-tag"></i>](https://github.com/simplefoc/Arduino-FOC/releases)) 
            - SPI, I2C, Analog, PWM
            - UVW (*霍尔传感接口*)
            - ABI (*编码器接口*)
    - 例子 :  [AS5048A <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/AS5048-Magnetic-Encoder-PWM-SPI-Interface-14-Bit-Precision-For-Brushless-Motor/153636871434?hash=item23c5789d0a:g:oOMAAOSwd-5ddaWQ), [AS5047U <i class="fa fa-external-link"></i>](https://www.mouser.fr/ProductDetail/ams/AS5X47U-TS_EK_AB?qs=sGAEpiMZZMve4%2FbfQkoj%252BBDLPCj82ZLyYIPEtADg0FE%3D), [AS5600 <i class="fa fa-external-link"></i>](https://www.ebay.com/itm/1PC-New-AS5600-magnetic-encoder-sensor-module-12bit-high-precision/303401254431?hash=item46a41fbe1f:g:nVwAAOSwTJJd8zRK)
- [霍尔传感器](hall_sensors): 
    - 传感器通过读取转子上的磁铁位置来估计转子位置。
    - 例子 :  [49E Hall sonde <i class="fa fa-external-link"></i>](https://fr.aliexpress.com/item/32590021901.html?spm=a2g0o.productlist.0.0.6eec671cZA32JT&algo_pvid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a&algo_expid=5729f98b-72a0-4cf8-b80a-adac9ecbbd2a-58&btsid=0b8b035915993735716435630eb78b&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) ,   [105 Hall sensor <i class="fa fa-external-link"></i>](https://fr.aliexpress.com/item/32968973849.html?spm=a2g0o.productlist.0.0.2727671c1QF3Xc&algo_pvid=701cd77d-e484-49ca-8ee8-35a76ed246a1&algo_expid=701cd77d-e484-49ca-8ee8-35a76ed246a1-12&btsid=0b8b034e15993753711202685ed51b&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_) 

所有类型的传感器都以通用的方式实现，以支持尽可能多的传感器。

<div class="image_icon width30" >
    <a href="encoder" class="text-center">
        <img src="extras/Images/enc0.jpg" style="width:32%;display:inline"><img src="extras/Images/enc.jpg" style="width:32%;display:inline"><img src="extras/Images/enc1.png" style="width:32%;display:inline">
        <i class="fa fa-external-link-square fa-2x"></i>
        <p >Encoders</p>
    </a>
</div>
<div class="image_icon width30" >
    <a href="magnetic_sensor" class="text-center">
        <img src="extras/Images/mag0.jpg" style="width:32%;display:inline"><img src="extras/Images/mag2.jpg" style="width:32%;display:inline"><img src="extras/Images/mag.jpg" style="width:32%;display:inline">
        <i class="fa fa-external-link-square fa-2x"></i>
        <p >Magnetic sensors</p>
    </a>
</div>
<div class="image_icon width30" >
    <a href="hall_sensors" class="text-center">
        <img src="extras/Images/hall_schema.jpg" style="width:48.5%;display:inline"><img src="extras/Images/hall.png" style="width:48.5%;display:inline">
        <i class="fa fa-external-link-square fa-2x"></i>
        <p >Hall sensors</p>
    </a>
</div>

## 支持另外的传感器
如果你有兴趣了解如何用仍未在Arduino SimpleFOClibrary支持的其他类型的传感器或者通信接口，请查看如何使用新传感器的简短例程子 [如何实现用新的传感器](sensor_support). 

有关代码的理论部分和源代码文档的更多细节，请访问 [digging deeper section](digging_deeper).


<h2><i class="fa fa-lg"><svg id="fab-discourse" style="width:20px;fill:#44a8fa" viewBox="0 0 448 512"><path d="M225.9 32C103.3 32 0 130.5 0 252.1 0 256 .1 480 .1 480l225.8-.2c122.7 0 222.1-102.3 222.1-223.9C448 134.3 348.6 32 225.9 32zM224 384c-19.4 0-37.9-4.3-54.4-12.1L88.5 392l22.9-75c-9.8-18.1-15.4-38.9-15.4-61 0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128z"></path> </svg></i> <span class="simple">Simple<span class="foc">FOC</span> Community</span></h2>
 最后，如果你已经实现了一个新的类型传感器或你正在搜索帮助实现一些特定的传感器类型，请不要犹豫，发帖交流！ [community forum](https://community.simplefoc.com) 

听到人们实现代码的故事/问题/建议总是很有帮助的，你可能会发现很多已经有答案的问题!

<div class="image_icon width80" >
    <a href="https://community.simplefoc.com" target="_blank">
        <img src="extras/Images/community.png" >
        <i class="fa fa-external-link-square fa-2x"></i>
    </a>
</div>
​    

