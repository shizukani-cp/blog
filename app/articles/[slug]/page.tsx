import Script from "next/script";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

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

const LEVEL_AND_SIZE: Record<number, number> = {
  1: 25,
  2: 20,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
};

type Heading = {
  id: string;
  text: string;
  level: number;
};

function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = encodeURIComponent(text.trim());
    headings.push({ id, text, level });
  }
  return headings;
}

function Index({ headings }: { headings: Heading[] }) {
  return (
    <div id="index">
      {headings.map((h) => (
        <p
          key={h.id}
          style={{ fontSize: `${LEVEL_AND_SIZE[h.level] / 13}rem` }}
        >
          <a className="index" href={`#${h.id}`}>
            {h.text}
          </a>
        </p>
      ))}
    </div>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const fullPath = path.join(process.cwd(), "articles", `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const headings = extractHeadings(content);

  const contentWithIds = content.replace(
    /^(#{1,6})\s+(.+)$/gm,
    (_m, hashes, title) => {
      const level = hashes.length;
      const id = encodeURIComponent(title.trim());
      return `<h${level} id="${id}">${title}</h${level}>`;
    },
  );

  return (
    <>
      <aside id="sidebar">
        <Index headings={headings} />
      </aside>

      <main className="article">
        <h1>{data.title}</h1>
        <time>{formatDate(parseInt(data.date, 10))}</time>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
        >
          {contentWithIds}
        </ReactMarkdown>
      </main>
    </>
  );
}

