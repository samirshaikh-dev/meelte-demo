import { cacheLife } from "next/cache";
import { fetchHrJobs, fetchHrJobBySlugOrId } from "@/services/hr/jobs/hr-jobs-service";

/**
 * Returns today's date formatted as YYYY-MM-DD.
 */
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats salary display string if admin provided minimum or maximum salary.
 */
function formatSalaryRange(job) {
  if (job.salaryRange) return job.salaryRange;
  if (!job.salaryMin && !job.salaryMax) return null;

  const currency = job.salaryCurrency || "₹ (INR)";
  const period = job.salaryPeriod || "per year";
  const currSymbol = currency.split(" ")[0] || "₹";

  const formatNumber = (num) => {
    if (num == null) return "";
    return Number(num).toLocaleString("en-IN");
  };

  if (job.salaryMin && job.salaryMax) {
    return `${currSymbol}${formatNumber(job.salaryMin)} – ${currSymbol}${formatNumber(job.salaryMax)} ${period}`;
  }
  if (job.salaryMin) {
    return `From ${currSymbol}${formatNumber(job.salaryMin)} ${period}`;
  }
  if (job.salaryMax) {
    return `Up to ${currSymbol}${formatNumber(job.salaryMax)} ${period}`;
  }
  return null;
}

/**
 * Maps a raw job document to a public-safe summary object for the Careers list.
 * Strips internal fields (applicantCount, notes, admin emails, etc.).
 */
function toPublicJobSummary(job) {
  return {
    id: job.id,
    slug: job.slug || job.id,
    title: job.title,
    department: job.department || "General",
    location: job.location || "Remote",
    workplaceType: job.workplaceType || "Remote",
    employmentType: job.employmentType || "Full-time",
    experienceLevel: job.experienceLevel || "Mid-level",
    deadline: job.deadline || null,
    createdAt: job.createdAt || null,
  };
}

/**
 * Maps a raw job document to a public-safe full job object for the details page.
 */
function toPublicJobDetail(job) {
  const summary = toPublicJobSummary(job);
  const formattedSalary = formatSalaryRange(job);

  return {
    ...summary,
    salaryRange: formattedSalary,
    salaryMin: job.salaryMin || null,
    salaryMax: job.salaryMax || null,
    salaryCurrency: job.salaryCurrency || "₹ (INR)",
    salaryPeriod: job.salaryPeriod || "per year",
    openings: job.openings || 1,
    description: job.description || "",
    responsibilities: job.responsibilities || "",
    requirements: job.requirements || "",
    skills: Array.isArray(job.skills) ? job.skills : [],
    updatedAt: job.updatedAt || job.createdAt || null,
  };
}

/**
 * Fetches all active, unexpired jobs for public display on the Careers page.
 * Strictly excludes Draft, Expired, and Archived jobs, as well as roles whose
 * application deadline has passed.
 *
 * Cached with the `minutes` profile (revalidate 60s, expire 1h) so a role the
 * admin publishes, archives, or lets expire disappears from the public site
 * within a minute — the Cache Components replacement for `export const
 * revalidate = 60`, which Next.js 16 rejects when `cacheComponents` is on.
 *
 * @returns {Promise<Array<Object>>} List of public job summaries
 */
export async function fetchPublicActiveJobs() {
  "use cache";
  cacheLife("minutes");

  try {
    const allJobs = await fetchHrJobs();
    const today = getTodayDateString();

    const activeJobs = allJobs
      .filter((job) => {
        // Status must be Active (case-insensitive)
        const isStatusActive = (job.status || "").toLowerCase() === "active";
        if (!isStatusActive) return false;

        // If deadline is specified, must be >= today
        if (job.deadline && job.deadline.trim().length > 0) {
          if (job.deadline < today) {
            return false;
          }
        }

        return true;
      })
      .map(toPublicJobSummary);

    return activeJobs;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Public Jobs Service] Failed to fetch active roles:", error.message);
    }
    return [];
  }
}

/**
 * Fetches a single public active job by its slug or ID.
 * Returns null if not found, if not Active, or if the deadline has passed.
 *
 * Cached with the `minutes` profile so the details page and its metadata share
 * one entry per slug and stay within the same 60-second freshness window as
 * the list.
 *
 * @param {string} slugOrId
 * @returns {Promise<Object | null>}
 */
export async function fetchPublicJobBySlugOrId(slugOrId) {
  "use cache";
  cacheLife("minutes");

  if (!slugOrId) return null;

  try {
    const job = await fetchHrJobBySlugOrId(slugOrId);
    if (!job) return null;

    // Check status
    const isStatusActive = (job.status || "").toLowerCase() === "active";
    if (!isStatusActive) return null;

    // Check deadline
    const today = getTodayDateString();
    if (job.deadline && job.deadline.trim().length > 0) {
      if (job.deadline < today) {
        return null;
      }
    }

    return toPublicJobDetail(job);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Public Jobs Service] Error fetching role "${slugOrId}":`, error.message);
    }
    return null;
  }
}

