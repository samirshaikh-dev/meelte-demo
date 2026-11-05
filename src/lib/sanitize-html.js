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
