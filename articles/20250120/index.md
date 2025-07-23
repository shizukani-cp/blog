---
description: "公開したくないけどデバイス間でコードを共有したいときのための(クソ)アプリの使い方・作り方"
title: "公開したくないけどデバイス間でコードを共有したいときのための(クソ)アプリ"
date: 20250120
use_prism: true
---
プライベートで2つ以上デバイスを持っているとき、動かないなどで公開したくないけど、とりあえず共有したい、そんなこと、ありませんかね？  
というわけで、作ってみました。
## 技術的概要
サーバー…cloudflare workers  
データベース…cloudflare D1  
ローカルのクライアント…python(気合)  
なんか気合とかいう不穏な文字が見えた方、それは嘘です。
ちなみにですが、このアプリにはcloudflare workersの試運転というのも兼ねてたりします。
## 使い方
デプロイはしていますが、アクセスされまくったら余裕で無料枠を超えるので、URLは公開しないでおきます。
ですが、作り方はしっかり下に書いてあるので、そっちを参照してください。
で、とりあえずヘルプを見るまではこちら。
```sh
git clone https://github.com/shizukani-cp/tmp-code-share.git
cd tmp-code-share
uv sync
uv run python app.py -h
```
こうやってみると、argparseの力は偉大ですね。  
…とここまで書いて気付いたのですが、.envを書かないと-hだけでもエラー吐きますね。
ということで、.envの例も書いておきます。もちろん、実際のURLやAPIキーは書いていませんよ。
```.env
TMP_FILE_SHARE_BASE_URL="https://tmp-code-share.your-user-name.workers.dev/"
TMP_FILE_SHARE_API_KEY="your-random-string"
```
## 作り方
まずは、cloudflareに登録して、tmp-code-shareという名前でworkerを作りましょう。
そしたら、コードを編集するボタンなり、アイコン(</>みたいなやつ)なりがあるはずなので、そっちを押してもらって、以下のコードを入力します。
```javascript
export default {
  async fetch(request, env) {
    if (request.headers.get('Authorization') !== `Bearer ${env.API_KEY}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);

    switch (request.method) {
      case 'GET':
        return this.handleGet(env, path);
      case 'POST':
        return this.handlePost(request, env, path);
      case 'PUT':
        return this.handlePut(request, env, path);
      case 'DELETE':
        return this.handleDelete(env, path);
      default:
        return new Response('Method not allowed', { status: 405 });
    }
  },

  async handleGet(env, path) {
    const { results } = await env.DB.prepare(
      'SELECT * FROM files WHERE path = ?'
    ).bind(path).all();
  
    if (results.length === 0) {
      return new Response('Not found', { status: 404 });
    }
  
    const file = results[0];
    if (file.is_directory) {
      const { results: children } = await env.DB.prepare(
        "SELECT * FROM files WHERE path LIKE ? || '%' AND path != ?"
      ).bind(path === '/' ? '' : path, path).all();
  
      const directoryContents = {
        path: file.path,
        is_directory: true,
        children: children.map(child => ({
          path: child.path,
          is_directory: child.is_directory,
          content: child.is_directory ? null : child.content
        }))
      };
  
      return new Response(JSON.stringify(directoryContents), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(file.content, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  },

  async handlePost(request, env, path) {
    const content = await request.text();
    const isDirectory = path.endsWith('/');

    try {
      await env.DB.prepare(
        'INSERT INTO files (path, content, is_directory) VALUES (?, ?, ?)'
      ).bind(path, isDirectory ? null : content, isDirectory ? 1 : 0).run();
      return new Response('Created', { status: 201 });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },

  async handlePut(request, env, path) {
    const content = await request.text();

    try {
      const { results } = await env.DB.prepare(
        'UPDATE files SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE path = ? AND is_directory = 0'
      ).bind(content, path).run();

      if (results.changes === 0) {
        return new Response('Not found', { status: 404 });
      }
      return new Response('Updated', { status: 200 });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },

  async handleDelete(env, path) {
    try {
      if (path.endsWith('/')) {
        const { results } = await env.DB.prepare(
          "DELETE FROM files WHERE path LIKE ?"
        ).bind(path + '%').run();

        if (results.changes === 0) {
          return new Response('Not found', { status: 404 });
        }
      } else {
        const { results } = await env.DB.prepare(
          'DELETE FROM files WHERE path = ?'
        ).bind(path).run();

        if (results.changes === 0) {
          return new Response('Not found', { status: 404 });
        }
      }

      return new Response('Deleted', { status: 200 });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
```
そしたらデプロイボタンを押します。これでコードは完了です。
次に、DBらへんをいじっていきます。  
まずは、D1のページにアクセスしましょう。たぶん`https://dash.cloudflare.com/********************************/workers/d1`の形式になっています。
そこで、「+作成」ボタンを押してもらって、「tmp-code-share-db」とでも名前をつけて作成しましょう。
で、上側の「コンソール」を押してコンソールタブを開いたら、次のSQL文を実行してください。
```SQL
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL UNIQUE,
  content TEXT,
  is_directory BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
改行がなくても普通に実行できるので、気にしなくていいです。
次に、このDBとworkerをつなげましょう。
つなげないと使えませんからね。
workerのページ(`https://dash.cloudflare.com/********************************/workers/services/view/tmp-code-share/production`の形式)を開いて、設定のタブへ行きます。
その中の、「バインディング」という項目を探して、「+作成」ボタン→「D1 データベース」と押します。
変数名は「DB」にして、D1 データベースのところにはさっきの「tmp-code-share-db」を選択しておきます。
そして、展開ボタンを押します。これで、やっとDBとworkerをつなげます。  
ここまでくればあともう一息です。さっきの「バインディング」の上の変数とシークレットを探します。
そして、「+追加」ボタンを押しましょう。「タイプ」はシークレットを選んでください。
特に絶対というわけではないのですが、APIキーを入れるので、シークレットにしておく方が気持ち的には安全だと思います。
「変数名」は「API_KEY」にして、最後の値に関しては、自分でランダム文字列を適当に生成して格納してください。
そして、「展開」ボタンを…と行きたいところですが、 **今の文字列は展開すると見れなくなる** ので、今のうちにメモっておきましょう。
メモリ終わりましたか？では、「展開」ボタンを押してください。これで、サーバー側が完成しました。  
最後に、さっきの「使い方」に書いてあるものを(ちゃんと.envを修正して)試して、エラーがなかったら成功です!
## 最後に
こういうアプリって、ほかの人が作ったものを使うよりもロマンがあるんで、いいんですよねぇ。
