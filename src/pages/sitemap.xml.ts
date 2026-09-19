import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config';

export const GET: APIRoute = async () => {
  const baseUrl = new URL(siteConfig.site);
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
  const pages = [
    { path: '/', lastmod: undefined },
    { path: '/about/', lastmod: undefined },
    { path: '/tags/', lastmod: undefined },
    ...posts.map((post) => ({ path: `/${post.id}/`, lastmod: post.data.updatedDate || post.data.pubDate })),
    ...tags.map((tag) => ({ path: `/tags/${encodeURIComponent(tag)}/`, lastmod: undefined })),
  ];
  const urls = pages.map(({ path, lastmod }) => `  <url>\n    <loc>${new URL(path, baseUrl).href}</loc>${lastmod ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}\n  </url>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
