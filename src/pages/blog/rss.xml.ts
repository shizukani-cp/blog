import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');

  const items = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    link: `/blog/articles/${post.id}/`,
    pubDate: post.data.date,
  })).sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: '静カニのブログ',
    description: '静カニのブログのRSS',
    site: context.site ?? 'https://shizukani-cp.github.io/blog',
    items: items,
  });
}
