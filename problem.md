You are working on the admin "Jobs Management" module of my hiring portal. Investigate first, find the root cause, then fix it. Do not guess; read the code before changing anything.

## Problem

1. On the "Create New Job" page (/jobs/new or similar), a banner appears at the top: "You have an unsaved in-progress draft from 01:03 PM" with a "Restore Draft" button and a close (X) icon. I don't want this.
2. On the "Jobs Management" page, the tabs show All 0 / Active 0 / Draft 0 / Expired 0 / Archived 0 and the table says "No jobs matched your current filter criteria". So the drafts I saved are NOT showing in the job list, even though a draft clearly exists.

## Suspected root cause (verify, don't assume)

The draft is probably stored only on the client (localStorage / sessionStorage / Zustand / Redux persist / React state) and never saved as a real job record with status = "draft" in the backend/database. That would explain both symptoms: the Create page finds a local draft and shows "Restore Draft", while the Jobs list fetches from the API and gets nothing.

Please confirm by checking:
- Where "Save Draft" writes to (localStorage key, API call, store) and what the component behind the "Restore Draft" banner reads from.
- Whether the Job model/schema has a status field with a "draft" value, and whether the create/update endpoints accept it.
- What the Jobs list API returns and how the All/Active/Draft/Expired/Archived counts are calculated. Check whether "draft" jobs are excluded by a query filter, or whether the counts come from a separate endpoint.
- Any auth/ownership filter (createdBy, companyId) that could hide drafts.
- Any validation that blocks saving a draft with missing required fields (title, location, etc.).

Report the actual root cause in 3-5 lines before editing code.

## Required behavior

**Create New Job page**
- Remove the "Restore Draft" banner entirely, including the localStorage draft-detection logic. Delete dead code, don't just hide it with CSS.
- "Save Draft" saves the job to the backend with status = "draft". Relax validation for drafts so only Job Title is required (or whatever minimum makes sense).
- After saving, show a success toast ("Draft saved") and redirect to Jobs Management with the Draft tab active (or stay on the page, whichever fits the current flow).
- Add support for editing an existing draft: /jobs/:id/edit loads the saved draft data into the 4-step form (Basics, Location & Pay, Details, Review & Publish). Saving again updates the same record, with no duplicates.
- "Publish" on the final step changes status from draft to active (or whatever the publish flow already sets) on the same record.

**Jobs Management page**
- Show all jobs from the API, including drafts, in the table with these columns: Job Title & Role, Department, Type & Setup, Applicants, Deadline, Status, Actions.
- Tabs (All, Active, Draft, Expired, Archived) must show correct counts from real data and filter the table properly. Search and department filters must work together with the tabs.
- Draft rows show a "Draft" status badge, "—" for Applicants and Deadline if not set, and a "Last edited" timestamp.
- Draft row actions: Continue Editing, Publish, Delete (with a confirmation dialog). Active rows keep their existing actions.
- Empty state should be clean and professional, with an icon, a message like "No drafts yet", and a "Create New Job" button, instead of just plain text.
- Keep the current purple design system, spacing and components. No new UI libraries.

## Constraints
- Don't break existing job creation, publishing or applicant flows.
- If a DB schema or migration change is needed, add a proper migration and tell me.
- If any existing local drafts are stored client-side, add a one-time cleanup of the old localStorage key so stale data doesn't linger.
- Follow the existing code style, folder structure, and API/response patterns.

## Deliverables
1. Root cause explanation (short).
2. List of files changed and why.
3. The fix implemented.
4. Manual test steps I can follow:
   - Create a job, save as draft, see it in the Draft tab and the All tab.
   - Edit the draft, change the title, save, and confirm there's no duplicate.
   - Publish the draft, and confirm it moves to the Active tab.
   - Delete a draft, and confirm the counts update.
   - Open Create New Job fresh and confirm there is no "Restore Draft" banner.
5. Run the build/lint/tests and report the results.