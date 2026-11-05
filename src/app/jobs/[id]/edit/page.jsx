import { redirect } from "next/navigation";

// Legacy `/jobs/{id}/edit` alias for the internal HR portal.
// The id only exists at request time, so this dynamic segment cannot be prerendered;
// `instant = false` marks the route as blocking instead of failing the build.
// Route segment config must live in a Server Component module, which this page is.
export const instant = false;

export default async function RedirectToHrJobsEdit({ params }) {
  const { id } = await params;
  redirect(`/hr/jobs/${id}/edit`);
}
