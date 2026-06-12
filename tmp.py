import os
import re

ARTICLES_DIR = "./articles"

TAG_MAP = {
    "読書感想文": ["読書感想文"],
    "Neovim": ["Neovim", "Vim"],
    "Vim駅伝": ["Vim駅伝"],
    "N本ノック": ["N本ノック"],
    "dotfiles": ["dotfiles"],
}

for filename in os.listdir(ARTICLES_DIR):
    if not filename.endswith(".md"):
        continue
    filepath = os.path.join(ARTICLES_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "tags:" in content:
        continue

    detected_tags = set()
    for keyword, tags in TAG_MAP.items():
        if keyword in content:
            detected_tags.update(tags)

    tags_str = "\ntags: [" + ", ".join([f'"{t}"' for t in detected_tags]) + "]"
    parts = content.split("---", 2)
    if len(parts) >= 3:
        parts[1] = parts[1].rstrip() + tags_str + "\n"
        new_content = "---" + parts[1] + "---" + parts[2]
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

print("自動タグ付け完了")
