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
