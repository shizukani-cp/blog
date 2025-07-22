---
description: "このブログの実装の仕方で結構迷走していたので、それをまとめます"
title: "ブログのやり方で結構迷走してたからそれをまとめる"
date: 20240816
use_prism: false
---
# ブログのやり方で結構迷走してたからそれをまとめる
## 最初
初めは、HTMLを手打ちしていた。basestyle.cssはWebから持ってきたものの詰め合わせみたいな感じだが、それ以外はなんだかんだで全部手打ちでした。  
ですが、複数行のコードを表示するときにつまづきました。
## Vitepress
そういったことで、Vitepressというエンジンを使ってみました。しかし、肝心のGitHub Pagesへの公開をうまくできなかったので、変更することにしました。
## 今
とりあえずRustで[md2html](https://github.com/shizukani-cp/md2html.git)というツールを気合いで作って、それを使うことにしました。なので、使い方を見ればあるだろうと推測できますが、contentsフォルダーの直下にtemplate.htmlがいたり、それぞれの記事のフォルダーにentry.mdがいたりします。
## 2024/12/24追記
md2htmlだと説明分をHTMLにするたびに書かなくてはならず、面倒だったため、[blog_manage](https://github.com/shizukani-cp/blog_manage.git)というツールをつくりました。  
箇条書きがうまくいっていなかったりするのですが、とりあえずどうにかなっています。
