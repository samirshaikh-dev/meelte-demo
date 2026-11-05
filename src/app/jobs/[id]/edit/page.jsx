import { redirect } from "next/navigation";

export default async function RedirectToHrJobsEdit({ params }) {
  const { id } = await params;
  redirect(`/hr/jobs/${id}/edit`);
}
