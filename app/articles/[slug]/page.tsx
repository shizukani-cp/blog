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
  params: { slug: string };
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
  1: 25,
  2: 20,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
};

function formatDate(date: number) {
  const date_s = date.toString();
  const year = parseInt(date_s.substring(0, 4), 10);
  const month = parseInt(date_s.substring(4, 6), 10);
  const day = parseInt(date_s.substring(6, 8), 10);
  return `${year}年${month.toString().padStart(2, "0")}月${day
    .toString()
    .padStart(2, "0")}日`;
}

function extractHeadings(markdown: string): Heading[] {
  const cleanMarkdown = markdown.replace(/```[\s\S]*?```/g, '');

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(cleanMarkdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = encodeURIComponent(text);
    headings.push({ id, text, level });
  }
  return headings;
}

const getArticle = cache(async (slug: string) => {
  const fullPath = path.join(process.cwd(), "articles", `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  return matter(fileContents);
});

const getAllArticles = cache(async (): Promise<ArticleMeta[]> => {
  const articlesDir = path.join(process.cwd(), "articles");
  const fileNames = fs.readdirSync(articlesDir).filter((name) =>
    name.endsWith(".md")
  );

  const articles = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(articlesDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: parseInt(data.date, 10),
    };
  });

  return articles.sort((a, b) => b.date - a.date);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "記事が見つかりません" };
  }

  const { data } = article;

  return {
    title: data.title,
    description: data.description || "記事の詳細です",
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
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

  const article = await getArticle(slug);
  const allArticles = await getAllArticles();

  if (!article) {
    notFound();
  }

  const { data, content } = article;
  const headings = extractHeadings(content);

  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const newerArticle = allArticles[currentIndex - 1] || null;
  const olderArticle = allArticles[currentIndex + 1] || null;

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
            {olderArticle ? (
              <Link
                href={`/articles/${olderArticle.slug}/`}
                className="group flex w-full flex-col rounded-lg border border-gray-700 p-4 transition-all hover:border-blue-500 hover:bg-gray-800 sm:w-[48%]"
              >
                <span className="mb-2 text-xs font-bold text-gray-500 group-hover:text-blue-400">
                  &laquo; 前の記事
                </span>
                <span className="line-clamp-2 text-sm font-bold text-gray-200 group-hover:text-blue-300">
                  {olderArticle.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block sm:w-[48%]" />
            )}

            {newerArticle && (
              <Link
                href={`/articles/${newerArticle.slug}/`}
                className="group flex w-full flex-col items-end rounded-lg border border-gray-700 p-4 text-right transition-all hover:border-blue-500 hover:bg-gray-800 sm:w-[48%]"
              >
                <span className="mb-2 text-xs font-bold text-gray-500 group-hover:text-blue-400">
                  次の記事 &raquo;
                </span>
                <span className="line-clamp-2 text-sm font-bold text-gray-200 group-hover:text-blue-300">
                  {newerArticle.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
