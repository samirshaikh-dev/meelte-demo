import DOMPurify from "dompurify";

/**
 * Safe HTML Sanitizer for Rich Text Content
 * Runs DOMPurify in the browser and provides a safe fallback during SSR,
 * avoiding heavyweight server dependencies like jsdom.
 *
 * @param {string} html
 * @returns {string} Sanitized HTML string
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== "string") return "";

  if (typeof window === "undefined") {
    // SSR fallback: strip script, iframe, and inline event handlers
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/on\w+='[^']*'/gi, "");
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "h2", "h3", "strong", "em", "ul", "ol", "li", "br", "span"],
    ALLOWED_ATTR: ["class"],
  });
}

/**
 * Elements that never survive sanitization, together with their contents.
 * The unclosed variant (a stray `<script src=…>` with no matching close tag)
 * matches the second alternative, which has no closer at all.
 */
const BLOCKED_ELEMENTS =
  /<(script|iframe|object|embed|form|style|link|meta|base|math|svg|template)\b[^>]*>[\s\S]*?<\/\1\s*>|<(?:script|iframe|object|embed|form|style|link|meta|base|math|svg|template)\b[^>]*\/?>/gi;

/**
 * An opening (or void) tag: name plus attributes. The attribute segment
 * allows quoted strings to contain `>` so `title="a > b"` keeps parsing as
 * one tag.
 */
const OPEN_TAG_RE = /<([a-zA-Z][^\s/>]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

/** One attribute inside a tag: name, `=`, and a quoted or bare value. */
const ATTR_RE = /([a-zA-Z-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;

/**
 * Attributes kept by the server-side article pass. Mirrors the DOMPurify
 * `ALLOWED_ATTR` list below plus `id`/`class` bookkeeping — notably it
 * excludes `style` (CSS can smuggle tracking `url()`s and overlay positioning)
 * and `srcset`/`data-*` (URL-bearing, unverifiable here). `id` is also
 * excluded: DOM clobbering on a public page is a real vector.
 */
const SAFE_ARTICLE_ATTRS = new Set([
  "href", "src", "alt", "title", "class", "width", "height", "loading", "target", "rel",
]);

/**
 * URL schemes that must never reach an href or src. `data:` is allowed for
 * image sources only (SVG data URLs stay script-inert inside <img>); every
 * `data:` href is blocked because navigating to one can execute script in
 * some browsers.
 */
function isDangerousUrl(value, attrName) {
  const v = value.trim().toLowerCase();
  if (v.startsWith("javascript:") || v.startsWith("vbscript:")) return true;
  if (v.startsWith("data:")) {
    if (attrName === "src" && v.startsWith("data:image/")) return false;
    return true;
  }
  return false;
}

/** Unquotes an attribute value ("x", 'x' or bare x). */
function unquote(value) {
  return value.replace(/^["']|["']$/g, "");
}

/**
 * Rewrites one tag's attribute string: drops any attribute not in the
 * allowlist and any href/src whose value uses a dangerous scheme.
 */
function cleanArticleAttributes(attrs) {
  return attrs.replace(ATTR_RE, (full, name, value) => {
    const lower = name.toLowerCase();
    if (!SAFE_ARTICLE_ATTRS.has(lower)) return "";
    if (lower === "href" || lower === "src") {
      if (isDangerousUrl(unquote(value), lower)) return "";
    }
    return full;
  });
}

/**
 * Sanitizes full-length blog article HTML before it is rendered with
 * `dangerouslySetInnerHTML` on `/blog/[slug]`.
 *
 * The article page is a Server Component, so in production this runs the
 * no-window pass below — blocked elements dropped with their contents, plus
 * a tag-level attribute allowlist that removes `on*` handlers, `style`,
 * non-allowlisted attributes, and `javascript:`/`vbscript:`/`data:` URLs
 * (image `data:` sources excepted). Content is authored in Firestore by
 * meelTe staff, so this is defence-in-depth against a misconfigured or
 * compromised write path, not a boundary for public input. In the browser
 * (admin previews) DOMPurify runs with the same tag allowlist.
 *
 * @param {string} html - Raw article HTML from the blog service
 * @returns {string} Sanitized article HTML
 */
export function sanitizeArticleHtml(html) {
  if (!html || typeof html !== "string") return "";

  if (typeof window === "undefined") {
    return html
      .replace(BLOCKED_ELEMENTS, "")
      .replace(OPEN_TAG_RE, (tag, tagName, attrs) =>
        `<${tagName}${cleanArticleAttributes(attrs)}>`
      );
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "h2", "h3", "h4", "strong", "em", "b", "i", "u", "small", "sup", "sub",
      "ul", "ol", "li", "a", "blockquote", "br", "hr", "span", "img",
      "figure", "figcaption", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["class", "href", "title", "target", "rel", "src", "alt", "width", "height", "loading"],
  });
}
