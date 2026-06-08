import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const files = import.meta.glob('../../../articles/*.md', { eager: true });

  const items = Object.entries(files).map(([filePath, post]: [string, any]) => {
    const slug = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
    const data = post.frontmatter;

    let articleDate = new Date();
    if (data.date !== undefined) {
      if (typeof data.date === "number") {
        const s = String(data.date);
        const m = s.match(/^(\d{4})(\d{2})(\d{2})$/);
        if (m) articleDate = new Date(+m[1], +m[2] - 1, +m[3]);
      } else if (typeof data.date === "string") {
        const d = new Date(data.date);
        if (!isNaN(d.getTime())) articleDate = d;
      }
    } else {
      const m = slug.match(/^(\d{4})(\d{2})(\d{2})/);
      if (m) articleDate = new Date(+m[1], +m[2] - 1, +m[3]);
    }

    return {
      title: data.title,
      description: data.description || '',
      link: `${context.site}/blog/articles/${slug}/`,
      pubDate: articleDate,
    };
  });

  items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: '静カニのブログ',
    description: '静カニのブログのRSS',
    site: `${context.site}/blog`,
    items: items,
  });
}
