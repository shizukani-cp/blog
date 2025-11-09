import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";

interface Article {
  title: string;
  description: string;
  date: number;
  use_prism: boolean;
  slug: string;
}

function formatDate(date: number) {
  const date_s = date.toString();
  const year = parseInt(date_s.substring(0, 4), 10);
  const month = parseInt(date_s.substring(4, 6), 10);
  const day = parseInt(date_s.substring(6, 8), 10);
  return `${year}年${month.toString().padStart(2, "0")}月${day.toString().padStart(2, "0")
    }日`;
}

function Card({ article }: { article: Article }) {
  return (
    <a className="card" href={`/articles/${article.slug}`}>
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <small>{formatDate(article.date)}</small>
    </a>
  );
}

export async function getArticles() {
  const postsDirectory = path.join(process.cwd(), "articles");
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });

  const fileNames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);

  const articles = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: data.title,
      description: data.description,
      date: parseInt(data.date, 10),
      use_prism: !!data.use_prism,
      slug,
    };
  });

  articles.sort((a, b) => b.date - a.date);

  return articles;
}

export default async function Home() {
  const articles = await getArticles();
  return (
    <main id="pages">
      <div className="cards">
        {articles.map((article) => (
          <Card
            key={article.slug}
            article={article}
          />
        ))}
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "静カニのブログのホーム | 静カニのブログ",
  description: "静カニのブログのホーム",
};

