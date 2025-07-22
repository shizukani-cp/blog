#!/usr/bin/env python3

import re, glob, json, hashlib, datetime, sys, argparse, os, shutil
from pathlib import Path
from io import StringIO
import yaml, markdown
from jinja2 import Template

ENCODE = "utf-8"
EXTENSIONS = ["tables", "fenced_code"]

RSS_ITEM_TEMPLATE = """
<item>
    <title>{title}</title>
    <link>https://shizukani-cp.github.io/blog/articles/{date}</link>
    <description>{description}</description>
    <pubDate>{datetime}</pubDate>
    <guid>{hash}</guid>
</item>
"""

SITEMAP_ITEM_TEMPLATE = """
<url>
    <loc>https://shizukani-cp.github.io/blog/articles/{date}</loc>
</url>
"""

def get_articles(top):
    files = glob.glob(f"{top}/articles/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
    file_dates = [int(fname[-8:]) for fname in files]
    file_dates.sort()
    return [f"{top}/articles/{date}/index.md" for date in file_dates]

class Article:
    def __init__(self, filepath: Path):
        self.filepath = filepath
        self._split_config_content()
        self.md = markdown.Markdown(extensions=EXTENSIONS)

    def _split_config_content(self):
        self.mdstr = ""
        config_str = ""
        n = 0
        with open(self.filepath, "r", encoding=ENCODE) as f:
            for line in f.readlines():
                if re.fullmatch("^---+[\r\n]+", line):
                    n += 1
                    continue
                if n == 1:
                    config_str += line
                else:
                    self.mdstr += line

        with StringIO() as st:
            st.write(config_str)
            st.seek(0)
            self.config =  yaml.safe_load(st)

    def _to_html_with_template(self, template: Template) -> str :
        return template.render(
                               content=self.md.convert(self.mdstr),
                               config=self.config)

    def _get_html_file_name(self) -> Path :
        return Path(Path("docs") / (str(self.filepath.parent / self.filepath.stem) + ".html"))

    def html_save(self, template: Template):
        print("saving", str(self.filepath))
        with open(self._get_html_file_name(), "w", encoding=ENCODE) as f:
            f.write(self._to_html_with_template(template))

    def copy_files(self):
        date = self.config["date"]
        src_pattern = os.path.join("articles", date, "*")
        files = glob.glob(src_pattern)

        for src_path in files:
            if os.path.isdir(src_path):
                continue

            if os.path.basename(src_path) == "index.md":
                continue

            rel_path = os.path.relpath(src_path, "articles")
            dest_path = os.path.join("docs", "articles", rel_path)

            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy2(src_path, dest_path)

    def get_rss(self):
        return RSS_ITEM_TEMPLATE.format(
            title=self.config["title"],
            date=self.config["date"],
            description=self.config["description"],
            datetime=datetime.datetime(
                int(str(self.config["date"])[:4]),
                int(str(self.config["date"])[4:6]),
                int(str(self.config["date"])[6:])
            ),
            hash=hashlib.sha256(self.config["title"].encode()).hexdigest()
        )
    def get_sitemap(self):
        return SITEMAP_ITEM_TEMPLATE.format(
                date=self.config["date"],
        )

def load_template(templatefile):
    return Template(templatefile.read())

RSS_TEMPLATE = """<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>静カニのブログ</title>
  <link>https://shizukani-cp.github.io/blog/</link>
  <language>ja-jp</language>
  <description>静カニのブログ</description>
  {items}
</channel>
</rss>
"""

SITEMAP_TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  {items}
</urlset>
"""

def execute(arg):

    if arg.template is None:
        arg.template = open(Path(arg.top_dir) / "template.html", "r", encoding=ENCODE)

    template = load_template(arg.template)

    articles = [Article(Path(fname)) for fname in get_articles(arg.top_dir)]

    if len(articles) == 0:
        sys.exit("記事がありません")

    configs = []
    for article in articles:
        article.html_save(template)
        article.copy_files()
        configs.append(article.config)

    with open(Path(arg.top_dir) / "scripts" / "articles.json.js", "w", encoding=ENCODE) as f:
        f.write(f"window.articles = JSON.parse('{json.dumps(configs, ensure_ascii=False)}');")

    with open(Path(arg.top_dir) / "rss.xml", "w", encoding=ENCODE) as f:
        f.write(RSS_TEMPLATE.format(items="\n".join([article.get_rss() for article in articles])))

    with open(Path(arg.top_dir) / "sitemap.xml", "w", encoding=ENCODE) as f:
        f.write(SITEMAP_TEMPLATE.format(items="\n".join([article.get_sitemap() for article in articles])))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument("--top_dir", default=".")
    parser.add_argument("--template", "-t", type=argparse.FileType("r", encoding=ENCODE))

    args = parser.parse_args()

    execute(args)
