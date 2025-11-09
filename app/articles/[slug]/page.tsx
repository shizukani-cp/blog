import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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

  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return (
    <main className="article">
      <h1>{data.title}</h1>
      <time>{formatDate(parseInt(data.date, 10))}</time>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </main>
  );
}
