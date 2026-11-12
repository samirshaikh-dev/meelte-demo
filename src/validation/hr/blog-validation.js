import { z } from "zod";
import { BLOG_POST_CATEGORIES, BLOG_STATUSES } from "@/constants/blog-constants";
import { isRichTextEmpty } from "./job-validation";

/**
 * meelTe — Blog CMS Validation Schemas
 *
 * Validates every write to the `blog_posts` Firestore collection at the
 * `/api/hr/blog` boundary (AI_RULE.md §2.1: "Validation is the schema") and
 * drives the `/hr/blog` editor form via react-hook-form + zodResolver.
 *
 * The document shape mirrors `src/constants/blog-constants.js`:
 *   title, slug, excerpt, content (HTML), coverImage, category, tags,
 *   status, publishedAt, updatedAt.
 */

/** Slugs are the public permalink (`/blog/{slug}`): lowercase words, single hyphens. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Upper bound for the HTML body, well inside the 1 MiB Firestore document limit. */
const MAX_CONTENT_LENGTH = 200000;

/** Optional field that must be a secure https URL when filled. */
const optionalHttpsUrl = z
  .string()
  .trim()
  .max(500, "URLs cannot exceed 500 characters.")
  .refine((val) => !val || /^https:\/\/\S+$/i.test(val), {
    message: "Enter a secure https URL.",
  })
  .optional();

const titleSchema = z
  .string()
  .trim()
  .min(3, "Story title must be at least 3 characters.")
  .max(120, "Story title cannot exceed 120 characters.");

const slugSchema = z
  .string()
  .trim()
  .max(120, "Slugs cannot exceed 120 characters.")
  // An empty slug means "derive it from the title" — the service layer owns
  // slug generation, so validation must not reject a blank field.
  .transform((val) => (val === "" ? undefined : val))
  .refine((val) => val === undefined || SLUG_PATTERN.test(val), {
    message: "Slugs use lowercase letters, numbers and single hyphens only.",
  })
  .optional();

const tagsSchema = z
  .array(z.string().trim().min(1, "Tags cannot be empty.").max(30, "Tags cannot exceed 30 characters."))
  .max(8, "Add up to 8 tags.");

/**
 * Draft validation schema: only the title is required, matching the job
 * draft contract. Everything else may be filled in before publishing.
 */
export const blogPostDraftSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  category: z.string().trim().max(60).optional(),
  excerpt: z.string().trim().max(280, "Excerpts cannot exceed 280 characters.").optional(),
  content: z.string().max(MAX_CONTENT_LENGTH, "The story body is too large.").optional(),
  coverImage: optionalHttpsUrl,
  coverImageAlt: z.string().trim().max(160, "Alt text cannot exceed 160 characters.").optional(),
  tags: tagsSchema.optional(),
  featured: z.boolean().optional(),
  status: z.enum([...Object.values(BLOG_STATUSES)]).optional(),
});

/**
 * Publish validation schema: everything a public story needs so `/blog`,
 * `/blog/[slug]`, the RSS feed and the JSON-LD never render half-empty
 * content. The body must contain real text, not just empty markup.
 */
export const blogPostPublishSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  category: z
    .string()
    .trim()
    .min(1, "Please select a category.")
    .refine((val) => BLOG_POST_CATEGORIES.includes(val), {
      message: "Please select a valid category.",
    }),
  excerpt: z
    .string()
    .trim()
    .min(20, "Write an excerpt of at least 20 characters for cards and search results.")
    .max(280, "Excerpts cannot exceed 280 characters."),
  content: z
    .string()
    .max(MAX_CONTENT_LENGTH, "The story body is too large.")
    .refine((val) => !isRichTextEmpty(val), {
      message: "Story body is required before publishing.",
    }),
  coverImage: optionalHttpsUrl,
  coverImageAlt: z.string().trim().max(160, "Alt text cannot exceed 160 characters.").optional(),
  tags: tagsSchema.default([]),
  featured: z.boolean().optional(),
  status: z.enum([...Object.values(BLOG_STATUSES)]).optional(),
});

/**
 * Returns the first issue message of a failed safeParse result, for API
 * routes that report one actionable error instead of the full issue list.
 *
 * @param {z.ZodSafeParseError} parseResult
 * @returns {string}
 */
export function getFirstValidationMessage(parseResult) {
  return (
    parseResult?.error?.issues?.[0]?.message ||
    "Please check the highlighted fields and try again."
  );
}

/**
 * Initial values for the blog editor form, shared by `/hr/blog/new` and
 * `/hr/blog/[id]/edit`.
 *
 * Deliberately clock-free (AI_RULE.md §2.6): no `new Date()`, so it is safe
 * to call during the prerender of both form pages. Author defaults match the
 * public normalizer fallbacks in `src/services/site/blog/blog-service.js`,
 * so a saved draft and its rendered article can never disagree.
 *
 * @param {Object | null} existingPost - Normalized blog post being edited
 * @returns {Object} react-hook-form defaultValues
 */
export function getInitialBlogFormValues(existingPost = null) {
  if (existingPost) {
    return {
      title: existingPost.title || "",
      slug: existingPost.slug || "",
      category: existingPost.category || "",
      excerpt: existingPost.excerpt || "",
      content: existingPost.content || "",
      coverImage: existingPost.coverImage || "",
      coverImageAlt: existingPost.coverImageAlt || "",
      tags: Array.isArray(existingPost.tags) ? existingPost.tags : [],
    };
  }

  return {
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    coverImage: "",
    coverImageAlt: "",
    tags: [],
  };
}
