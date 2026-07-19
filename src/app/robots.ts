import type { MetadataRoute } from 'next'

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-CloudVertexBot',
  'Meta-ExternalAgent',
  'FacebookBot',
  'PerplexityBot',
  'Amazonbot',
  'Applebot-Extended',
  'CCBot',
  'Cohere-ai',
  'AI2Bot',
  'Ai2Bot-Dolma',
  'Bytespider',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/api/',
      },
      {
        userAgent: AI_BOTS,
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
