import { APP_URL } from "../config/site";

/**
 * Named crawlers we explicitly welcome. Every agent below gets the same
 * directive as `*` — the whole site is crawlable. The list is kept for two
 * reasons: it documents the search/AI engines this marketing site targets for
 * AEO/GEO (see `public/llms.txt`), and it protects the intent if a future
 * wildcard rule ever narrows.
 *
 * There is nothing to disallow: this repository has no `/admin/` or `/api/`
 * routes (all dynamic data lives on the external backend), and blocking
 * `/_next/` would stop crawlers from fetching the CSS/JS needed to render
 * pages — so no path is excluded for anyone.
 */
const WELCOMED_CRAWLERS = [
  // OpenAI & ChatGPT
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic Claude
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Claude-Search",
  // Perplexity AI
  "PerplexityBot",
  "Perplexity-Search",
  // DeepSeek
  "DeepSeekBot",
  // Mistral AI
  "MistralBot",
  // xAI & Grok
  "GrokBot",
  "xAI",
  // Google
  "Googlebot",
  "Google-Extended",
  // Apple
  "Applebot",
  "Applebot-Extended",
  // Microsoft / Bing
  "Bingbot",
  // Meta / Facebook
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  // Amazon
  "Amazonbot",
  // ByteDance / TikTok
  "Bytespider",
  // Cohere & Other AI Crawlers
  "cohere-ai",
  "cohere-training-data-crawler",
  "CCBot",
  "YouBot",
  "Diffbot",
  "DuckDuckBot",
  "Timpibot",
  "KagiBot",
];

export default function robots() {
  const siteUrl = APP_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: WELCOMED_CRAWLERS,
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
