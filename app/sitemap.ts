import { MetadataRoute } from 'next'
import { getArticleList } from '@/lib/articles';

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: 'https://shizukani-cp.github.io/blog/',
    },
  ];

  const posts = await getArticleList();

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://shizukani-cp.github.io/blog/${post.slug}`,
    lastModified: new Date(post.date.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
  }));

  return [...defaultPages, ...blogPages];
}
