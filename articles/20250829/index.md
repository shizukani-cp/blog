---
title: "全てはDiscordへ(VivaldiからEdgeへの移行第一弾)"
description: "VivaldiからEdgeに乗り換えるとき、Vivaldiのサイドバーの機能の一つのメール機能をDiscordとGmailを組み合わせてやったろうという記事です。"
date: 20250829
---
こんにちは。静カニです。昔、Edgeを使っていたのですが、カスタマイズ性等々を求めてVivaldiに行きました。
そして、半年ぐらい経ったと思います。Vivaldi、重いです。とっても重い。
ノートパソコンでブラウザ開きながらAndroidエミュレーターで重い処理をさせて、そこでさらにMinecraftをするような人です。ブラウザを軽くするだけでマイクラをするときに快感マシマシになりそうだなぁ。
ということで、軽いEdgeに帰還することにしました。ですが、Vivaldiは、標準の機能がいっぱいあります。
それが欲しくて移行したのです(なおそのせいで重くなって戻ることにもなった模様)。
その中で、戻ってきてかなり大きかったのは、サイドバーから使える機能が大体持っていかれているという事実です。お気に入り以外ないです。
という訳で、この中のメール機能が必須級だったので、Discordを使って気持ちよくなったという記事です。前置き長いですが本編行きます。
## メール機能のどこがうれしかったのか
私は、メールアドレスを二つ持っているのですが、その両方へのメールが一括で見られるのです。
これがとてもうれしかった。では、また一括で見たい。どうすればいいでしょうか？
そういえば、自分専用のDiscordサーバーの「#フィード」チャンネルには、MinecraftのDiscordサーバーに流れてきたものが入っているのみです。
ここにメールが届いたよという通知を入れてはどうでしょうか。そして、そこにメールへの直接のリンクを置けば、そこから見ることができます。
という訳で、早速実装していきましょう。
## 作り方
まず、私のメールアドレスはどちらもGoogleアカウントなので、Gmailとの連携が強いGASを使っていきます。
そして、GASとDiscordを連携させるのは、WebHookでGASからDiscordに投稿させることでできます。という訳で、まずはDiscordのWebHookを作りに行きます。
### Discord側
こういう順番でクリック


1. チャンネルの名前の一番右にある「チャンネルの編集」という名の設定アイコン
1. 「連携サービス」
1. 「ウェブフック」
1. 「新しいウェブフック」  
1. 新しく出てきたやつ
1. 「ウェブフックのURLをコピー」
これでURLのコピーが完了。お好みで名前とアイコンをよしなにしてもいいかも。ちなみにここのアイコンを変えても投稿されるものには反映されないけどなぜか名前は反映されます。
### GAS側


1. スクリプトプロパティに「WEBHOOK_URL」を追加して値をさっきコピーしたやつにする
1. 以下のスクリプトをコピペする(参考:[GmailのメッセージをDiscordへ転送する｜いちご](https://note.com/lispict/n/n674157c0ebb8))
```javascript
function hook() {
  const threads = GmailApp.search('is:unread');  // 未読のスレッドを取得

  if (threads.length == 0) {
    Logger.log('新規メッセージなし');
    return
  }

  threads.forEach(function (thread) {
    const messages = thread.getMessages();

    const payloads = messages.map(function (message) {
      message.markRead();  // メールを既読に設定する

      const author = message.getFrom();
      const subject = message.getSubject();
      const to = extractEmail(message.getTo());
      const id = message.getId();

      const webhook = getWebhookUrl();

      Logger.log({ author: author, subject: subject, to: to, id: id })
      const payload = {
        content: `GMail: https://mail.google.com/mail/u/${to}/#inbox/${id}`,
        embeds: [{
          title: subject,
          author: {
            name: author,
          },
        }],
      }
      return {
        url: webhook,
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        avatar_url: "https://static.vecteezy.com/system/resources/previews/002/557/425/original/google-mail-icon-logo-isolated-on-transparent-background-free-vector.jpg"
      }
    })

    Logger.log(payloads);
    UrlFetchApp.fetchAll(payloads);
  })
}

function extractEmail(str) {
  const emailRegex = /<([^>]+)>/;
  const match = str.match(emailRegex);
  return match ? match[1] : null;
}

function getWebhookUrl() {
  return  PropertiesService.getScriptProperties().getProperty('WEBHOOK_URL');
}
```
これで未読のメールがない場合は未読のメールを適当に作ってやると、Discordのチャンネルの方にメッセージが入ってると思います。
ちなみにメールの他にこのブログやvim駅伝のRSSも入れたかったのですが、できませんでした。無念。
