import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/kitchen/', '/delivery/', '/sales/', '/unauthorized/'],
      },
      // Allow AI crawlers for GEO — important for ChatGPT, Perplexity etc.
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/kitchen/', '/delivery/', '/sales/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
    ],
    sitemap: 'https://planetsswaad.netlify.app/sitemap.xml',
    host: 'https://planetsswaad.netlify.app',
  };
}
