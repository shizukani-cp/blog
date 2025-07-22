---
title: "Gemini-CLI&gemini.nvim"
description: "Gemini-CLIが出たこととそれに関するプラグインを作った話です。"
date: 20250714
use_prism: false
---
# Gemini-CLI&gemini.nvim
最近、Gemini-CLIが出ましたね。なんだか自作でAIエージェントを作ろうと思っていたのを馬鹿馬鹿しく感じてしまいました。
それぐらい、自分的には衝撃を受けました。
## Gemini-CLIの機能について
とりあえず、`npm install -g @google/gemini-cli`でインストールして、`gemini`で起動できます。
### すごいと思った点
- ほぼ使い放題  
    一日の制限は1000回ぐらいだったので、よほどのことがない限り使い終わりません。  
- ファイル読み書き可能  
    aiderでもできますが、私の環境だとエラーを吐いてしまったので、何気に嬉しいです。  
    ちなみにaiderがエラーを吐いたせいで、自作AIエージェントを作ろうとしはじめました。  
- Google検索とかできる  
    これに関してはaiderでもできない。正直快挙。ただし今の所使っている場面は見られなかった。  
こんな感じです。
### ちょっとなぁと思った点
neovim用のプラグインがない。  
これに尽きます。じゃぁ、どうしましょう。ここで作るのがエンジニアです(異論は認めます)。
## gemini.nvim
というわけで、作りました。Gemini-CLIのNeovim用プラグイン。[こいつ](https://github.com/shizukani-cp/gemini.nvim)です。  
ここからは、技術的な詳細を書いていきます。  
ベースは、普段お世話になっていた[aider.nvim](https://github.com//aider.nvim)です。Gemini-CLIを見た瞬間に、「aider.nvimのaiderをgeminiに変えれば一瞬でプラグインできるぞ!」と思っていたのです。なので、aider.nvimの作者の[](https://github.com/)さんには感謝です。
そして、その改造、Gemini-CLIにやってもらいました。つまり、Gemini-CLIのためのプラグインをGemini-CLIに書かせました。
経緯としてはこんな感じです。
そしてこちら、なんと私史上初の自作neovimプラグインです。ちなみに昔、vimで強制シーザー暗号プログラミングさせられるネタプラグインを作ろうとしたのですが、失敗しました。
にしても、「必要は発明の母」ですね。名言は身近にあるものです。
