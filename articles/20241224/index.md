---
description: "AIがリア充かどうか判定してくれるクソアプリの紹介記事です。"
title: "AIがリア充かどうか判定してくれるアプリ"
date: 20241224
use_prism: true
---
こんにちは。クリスマスイブですね。この記事は[Qiita クソアプリカレンダー](https://qiita.com/advent-calendar/2024/kuso-app)の5枚目、24日目の記事です。クソアプリの入荷状況がすごくて、見ていてもはや面白かったですね…。
さて、みなさんは、もちろんクリぼっちですよね？実際にそうなのかどうか判定してくれる、クソアプリを作りました。
## 使い方
Llamaを使っている関係で、デプロイしていないので、`git clone`でもしていただいて、使ってください。

`git clone`を出してきている時点で、お察しの方もいるかもしれませんが、ターミナルで動かす前提ですので、ご容赦ください。
## 使ってみた感じ
LLMにLlamaを使っているのもあるのか、無能です。最後の判定の時に、リア充かどうかをきちんと答えてくれません。
ChatGPTのAPIを叩くようにしてもよかったのですが、お金がかかるのがいやなので、実装しませんでした。まぁ、Llamaでも電気代が必要ですが。
## ソースコード
```python
import requests

history = [
    {
        "role": "system",
        "content": "あなたはユーザーがリア充か判定してくれるボットです。質問をして、その回答をもとに決めてください。また、応答は質問のみにしてください。"
    },
    {
        "role": "system",
        "content": "なお、「現実生活（リアル）が充実している」ということを「リア充」と呼ぶものとします。"
    }
]

def call_llm():
    return requests.post("http://localhost:11434/v1/chat/completions", json={"model": "llama3.2", "messages": history}).json()["choices"][0]["message"]["content"]

while True:
    history.append({"role": "user", "content": "質問は何ですか？"})
    llm_responce = call_llm()
    del history[-1]
    history.append({"role": "assistant", "content": llm_responce})
    print("LLM:", llm_responce)
    user_responce = input("User: ")
    if user_responce.lower() in ("exit", "quit"): break
    history.append({"role": "user", "content": user_responce})

history.append({"role": "user", "content": "私はリア充と考えられますか？"})
print("LLM:", call_llm())
```
## 最後に
いかがでしょうか。まぁ、クソアプリなので、使ってもらえないと思いますが、何はともあれよいクソアプリライフを！
