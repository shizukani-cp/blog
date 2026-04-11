import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

type ArticleMeta = {
  slug: string;
  title: string;
  date: number;
};

export const getArticleList = cache(async (): Promise<ArticleMeta[]> => {
  const articlesDir = path.join(process.cwd(), "articles");
  const fileNames = fs.readdirSync(articlesDir).filter((file) => {
    return fs.statSync(`articles/${file}`).isFile() && file.endsWith('.md');
  });

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

