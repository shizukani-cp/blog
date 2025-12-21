import { glob } from "glob";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import RSS from "rss";

export const dynamic = "force-static";

export async function GET() {
  const feed = new RSS({
    title: "静カニのブログ",
    description: "静カニのブログのRSS",
    feed_url: "https://shizukani-cp.github.io/blog/rss.xml",
    site_url: "https://shizukani-cp.github.io/blog",
    language: "ja",
  });

  const articleDir = path.join(process.cwd(), "articles");
  const files = await glob("**/*.md", { cwd: articleDir });

  const articles = files
    .map((file) => {
      const filePath = path.join(articleDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);

      let articleDate: Date | null = null;

      // ===== frontmatter date =====
      if (data.date !== undefined) {
        // number: YYYYMMDD 想定
        if (typeof data.date === "number") {
          const s = String(data.date);
          const m = s.match(/^(\d{4})(\d{2})(\d{2})$/);
          if (m) {
            articleDate = new Date(+m[1], +m[2] - 1, +m[3]);
          }
        }

        // string
        if (!articleDate && typeof data.date === "string") {
          const d = new Date(data.date);
          if (!isNaN(d.getTime())) {
            articleDate = d;
          }
        }
      }

      // ===== fallback: filename date =====
      if (!articleDate) {
        const fileName = path.basename(file, ".md");
        const m = fileName.match(/^(\d{4})(\d{2})(\d{2})/);
        if (m) {
          articleDate = new Date(+m[1], +m[2] - 1, +m[3]);
        } else {
          articleDate = new Date();
        }
      }

      const slug = path.join("/articles", file.replace(/\.md$/, ""));
      const url = `https://shizukani-cp.github.io/blog${slug}`;

      return {
        title: data.title,
        description: data.description || "",
        url,
        guid: url,
        date: articleDate,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  articles.forEach((article) => {
    feed.item(article);
  });

  return new Response(feed.xml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

