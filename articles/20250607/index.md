---
description: "ヘリウムガスで空を飛ぼうとするトチ狂った計算"
title: "ヘリウムガスで空を自由に飛びたいな"
date: 20250607
use_prism: false
---
はい。タケ○コプターのパクリ…じゃないですよ。ということで、ヘリウムガスで空を飛びたくなったので、ヘリウムガスをどれだけ用意すればよいか計算してみます。
## 計算の前提条件
- 人の体重: 60kg  
- ヘリウムガスの密度: 0.1786 kg/m³（常温・常圧）  
- 空気の密度: 1.225 kg/m³（常温・常圧）  
## 浮力の計算
浮力は、排除した空気の重量から風船内のヘリウムの重量を引いた値になります。なので、
```math
浮力 = 排除した空気の質量 - ヘリウムの質量
浮力 = 体積 × (空気の密度 - ヘリウムの密度)
     = 体積 × (1.225 - 0.1786)
     = 体積 × 1.0464
```
## 必要な風船の大きさ
60kgの人間を浮かせるには、浮力が60kg以上必要です。必要な浮力はこんな感じで求まります。
```math
60 = 体積 × 1.0464
体積 = 60 ÷ 1.0464
体積 ≈ 57.4 m³
```
## 結論
割と平均的な人を浮かせるだけでも直径約4.8mの巨大な球形の風船が必要になるようです。これは普通の家の2階分くらいの高さだそうです。ヤバすぎ…  
ちなみに私の体重3mgなら、0.00000286m³（約2.86mL）のヘリウムで十分浮かびます。ペットボトルのキャップにも入る量ですね。  
もし計算に誤りを見つけたりした方は、このブログのリポジトリ([https://github.com/shizukani-cp/blog](https://github.com/shizukani-cp/blog))にIssueやPull requestでお知らせください！
