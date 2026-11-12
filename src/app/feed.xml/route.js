import { fetchPublicBlogPosts } from "@/services/site/blog";
import { APP_URL, SITE_NAME, APP_DESCRIPTION } from "@/config/site";

/**
 * RSS 2.0 syndication feed for the meelTe Blog (`/feed.xml`).
 *
 * Pulls the 30 newest published stories through the cached blog service, so
 * the feed shares the hub's 60-second freshness window and never bundles mock
 * content. Post titles, excerpts and categories travel inside CDATA sections
 * with `]]>` sequences stripped first, so author punctuation can never break
 * the XML envelope; URLs are assembled from slugified segments only.
 */
const FEED_PAGE_SIZE = 30;

/** Guards text destined for a CDATA section. */
function toCdata(text) {
  if (!text) return "";
  return String(text).replace(/]]>/g, "]]]]><![CDATA[>");
}

function buildFeedItem(post) {
  const postUrl = `${APP_URL}/blog/${encodeURIComponent(post.slug)}`;

  return `
    <item>
      <title><![CDATA[${toCdata(post.title)}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${toCdata(post.excerpt)}]]></description>
      <category><![CDATA[${toCdata(post.category)}]]></category>${
        post.publishedAt
          ? `\n      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`
          : ""
      }
    </item>`;
}

export async function GET() {
  const posts = await fetchPublicBlogPosts({ pageSize: FEED_PAGE_SIZE });

  const channelItems = posts.map(buildFeedItem).join("");
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${APP_URL}/blog</link>
    <description>${APP_DESCRIPTION}</description>
    <language>en-IN</language>
    <atom:link href="${APP_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${channelItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
