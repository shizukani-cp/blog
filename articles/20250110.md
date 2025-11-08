---
description: "私がvimiumという拡張機能を使っていること関連で書き散らした記事"
title: "vimiumはいいぞ"
date: 20250110
use_prism: true
---
## この記事について
この記事は、[Vim駅伝](https://vim-jp.org/ekiden/)の293本目の記事です。あと二週間ぐらいで300本！

ちなみに、前回は[tositada](https://github.com/tositada17/)さんの
[lazyvimに2ヶ月入って、vscodeに戻ってみる。](https://zenn.dev/tositada/articles/b57f06b83848f8)です。

エディターを乗り換えているあたり、私の[この](https://shizukani-cp.github.io/blog/articles/20240925/)記事と通ずるところがありそうに感じました。
## vimiumって？
[vimium](https://chromewebstore.google.com/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb)というのは、ChromeやEdge、Safariで動く拡張機能で、
vimっぽいキー操作を追加してくれます。
ちなみに、例えばブラウザのタブを閉じるとき、`x`キーを押すのですが、デフォルトの`Ctrl + w`も使えるので、初心者には結構ありがたいです。
## 私の場合
私は、Edgeを使っているのですが、垂直タブという機能を使っています。そして、vimiumを使うと水平タブでも垂直タブでも切り替えられるのですが、
ちょっと面白いことがあります。
まず、普通にページをやっていると、`j`で下にスクロール、`k`で上にスクロールするのですが、タブ切り替えの時、`J`で上のタブに行き、
`K`で下のタブへ行ってしまいます。
つまり、上下が逆転してしまっているのです。

…とここまで書いて気づきましたが、拡張機能の設定で、Custom key mappingsの項があるので、そこに書けばよいですね…。
というわけで、これを解決するためのカスタマイズ用の場所に書いた内容はこんな感じです。
```vim
unmap J
unmap K
map J nextTab
map K previousTab
```
…短いですね
## まとめ
vimiumはいいぞ!垂直タブ使っている人はカスタマイズしないと混乱するぞ!ほかの記事見てね!

ｺﾝｺﾝ 私「はぁい」

ｶﾞﾁｬ 謎の人「勢いで宣伝ねじ込むな」

私「…」
