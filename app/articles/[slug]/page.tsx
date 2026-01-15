import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import "highlight.js/styles/github-dark.css";

interface Props {
  params: Promise<{ slug: string }>;
}

type Heading = {
  id: string;
  text: string;
  level: number;
};

type ArticleMeta = {
  slug: string;
  title: string;
  date: number;
};

const LEVEL_AND_SIZE: Record<number, number> = {
  1: 25, 2: 20, 3: 15, 4: 12, 5: 10, 6: 8,
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric", month: "2-digit", day: "2-digit",
});

function formatDate(dateNum: number) {
  const s = dateNum.toString();
  const date = new Date(`${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}`);
  return dateFormatter.format(date).replace(/\//g, "-");
}

function extractHeadings(markdown: string): Heading[] {
  const cleanMarkdown = markdown.replace(/```[\s\S]*?```/g, '');
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(cleanMarkdown)) !== null) {
    const text = match[2].trim();
    headings.push({
      level: match[1].length,
      text,
      id: encodeURIComponent(text),
    });
  }
  return headings;
}

const getArticle = cache(async (slug: string) => {
  try {
    const fullPath = path.join(process.cwd(), "articles", `${slug}.md`);
    const fileContents = await fs.promises.readFile(fullPath, "utf8");
    return matter(fileContents);
  } catch {
    return null;
  }
});

const getArticleList = cache(async (): Promise<ArticleMeta[]> => {
  const articlesDir = path.join(process.cwd(), "articles");
  const fileNames = fs.readdirSync(articlesDir).filter((name) => name.endsWith(".md"));

  const articles = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDir, fileName);
      const fileContents = await fs.promises.readFile(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title,
        date: parseInt(data.date, 10),
      };
    })
  );

  return articles.sort((a, b) => b.date - a.date);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Not Found" };
  return { title: article.data.title, description: article.data.description };
}

export async function generateStaticParams() {
  const articles = await getArticleList();
  return articles.map((a) => ({ slug: a.slug }));
}

function TableOfContents({ headings }: { headings: Heading[] }) {
  return (
    <nav id="sidebar">
      {headings.map((h) => (
        <p key={h.id} style={{ fontSize: `${LEVEL_AND_SIZE[h.level] / 13}rem` }}>
          <a href={`#${h.id}`}>{h.text}</a>
        </p>
      ))}
    </nav>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const [article, allArticles] = await Promise.all([
    getArticle(slug),
    getArticleList(),
  ]);

  if (!article) notFound();

  const { data, content } = article;
  const headings = extractHeadings(content);

  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const newer = allArticles[currentIndex - 1];
  const older = allArticles[currentIndex + 1];

  return (
    <>
      <aside><TableOfContents headings={headings} /></aside>
      <main className="article">
        <h1>{data.title}</h1>
        <time>{formatDate(data.date)}</time>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            h1: ({ children }) => <h1 id={encodeURIComponent(String(children))}>{children}</h1>,
            h2: ({ children }) => <h2 id={encodeURIComponent(String(children))}>{children}</h2>,
            h3: ({ children }) => <h3 id={encodeURIComponent(String(children))}>{children}</h3>,
            h4: ({ children }) => <h4 id={encodeURIComponent(String(children))}>{children}</h4>,
            h5: ({ children }) => <h5 id={encodeURIComponent(String(children))}>{children}</h5>,
            h6: ({ children }) => <h6 id={encodeURIComponent(String(children))}>{children}</h6>,
          }}
        >
          {content}
        </ReactMarkdown>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {older ? (
              <Link
                href={`/articles/${older.slug}/`}
                className="group flex w-full flex-col rounded-lg border border-gray-700 p-4 transition-all hover:border-blue-500 hover:bg-gray-800 sm:w-[48%]"
              >
                <span className="mb-2 text-xs font-bold text-gray-500 group-hover:text-blue-400">
                  &laquo; 前の記事
                </span>
                <span className="line-clamp-2 text-sm font-bold text-gray-200 group-hover:text-blue-300">
                  {older.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block sm:w-[48%]" />
            )}

            {newer && (
              <Link
                href={`/articles/${newer.slug}/`}
                className="group flex w-full flex-col items-end rounded-lg border border-gray-700 p-4 text-right transition-all hover:border-blue-500 hover:bg-gray-800 sm:w-[48%]"
              >
                <span className="mb-2 text-xs font-bold text-gray-500 group-hover:text-blue-400">
                  次の記事 &raquo;
                </span>
                <span className="line-clamp-2 text-sm font-bold text-gray-200 group-hover:text-blue-300">
                  {newer.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
