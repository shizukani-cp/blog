import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

interface ArticleData {
  title: string;
  description: string;
  date: number;
  use_prism: boolean;
  content: string;
}

function formatDate(date: number) {
  const date_s = date.toString();
  const year = parseInt(date_s.substring(0, 4), 10);
  const month = parseInt(date_s.substring(4, 6), 10);
  const day = parseInt(date_s.substring(6, 8), 10);
  return `${year}年${month.toString().padStart(2, "0")}月${day
      .toString()
      .padStart(2, "0")
    }日`;
}

interface Props {
  params: { slug: string };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const fullPath = path.join(process.cwd(), "articles", `${slug}.md`);

  // Markdownファイル存在チェック
  if (!fs.existsSync(fullPath)) {
    notFound(); // 404ページ表示
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // 必要に応じてMarkdownをHTMLやReact要素に変換する処理を追加してな

  return (
    <main className="article">
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <time>{formatDate(parseInt(data.date, 10))}</time>
      <section>{content}</section>
    </main>
  );
}
