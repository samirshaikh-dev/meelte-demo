You are working on the meelTe website (public Careers) and the admin portal (Jobs Management). Read the existing code first (Candidate model/schema, jobs model, jobs API, the job details page at /careers/[slug], and any file upload or storage setup). Do not guess field names; use what already exists. Report your audit before writing code.

## Current state

On the job details page (e.g. localhost:3000/careers/software-engineer), both "Apply for this position" and "Apply Now" open a mailto: link to hr@meelTe.com. It prefills the subject "Job Application: <title> (ID: job-1793946625996) — [Your Full Name]" and a body template with blank fields (Full Name, Phone Number, Current Location, LinkedIn Profile, Portfolio / GitHub) and "Please find my resume attached".

Problems:
- It depends on the user's mail client, and applications never reach our database.
- Resumes are not stored and can't be reviewed in the admin portal.
- The Applicants count in Jobs Management can't be real data.
- There is no validation, duplicate protection or spam protection.

## What I want

### 1. Remove the mailto flow
- Delete the mailto: links and the prefilled template code from both Apply buttons, and any helper that builds it. No dead code.

### 2. Application form
- Both Apply buttons open an application form for that specific job. Use a modal/drawer or a dedicated route like /careers/[slug]/apply, whichever fits the current code better. Show the job title and department at the top of the form.
- Fields:
  - Full name (required)
  - Email (required, validated)
  - Phone number (required, validated)
  - Current location (required)
  - LinkedIn URL (optional, validated)
  - Portfolio / GitHub URL (optional, validated)
  - Total experience or current role/company (optional, only if the Candidate model supports it)
  - Notice period / expected salary (optional, only if the model supports it)
  - Cover note (optional, max ~1000 chars)
  - Resume upload (required): PDF, DOC or DOCX, max 5 MB, with drag-and-drop and a clear file preview/remove button
  - Consent checkbox: "I agree to meelTe storing my details for hiring purposes" (required)
- Inline validation errors, loading state on submit, disabled button while submitting, success screen ("Application received" with the job title and what happens next), and a clear error state with retry.
- Match the current purple design system. No new UI libraries unless one already exists for forms.
- Fully responsive.

### 3. Candidate model: audit first, then change
- Compare the existing Candidate model against the form above and show me a table: field | exists? | action needed.
- Add only the missing fields. Make sure a candidate record links to a job (jobId reference), and store: status (default "applied"), appliedAt, resumeUrl or storage key, original resume filename, and source ("careers-page").
- Decide whether a person applying to several jobs is one Candidate with multiple Applications, or one record per application. Follow the existing design if one exists. If the current model can't support multiple jobs per person cleanly, propose the smallest change and tell me before doing it.
- If the schema changes, write a proper migration. Backfill defaults for existing records.

### 4. API
- Add a public endpoint, e.g. POST /api/careers/jobs/[jobId or slug]/apply, accepting multipart/form-data.
- Server-side steps:
  1. Confirm the job exists and is currently Active and not past its deadline. Otherwise return a clear error (no applications to draft, expired or archived jobs).
  2. Validate all fields server-side (use the validation library already in the project). Never trust client validation.
  3. Validate the resume: allowed extensions AND real MIME type/magic bytes, max 5 MB, sanitize the filename, and store it under a random unique name.
  4. Store the file using the storage already used in the project (S3, Cloudinary, GridFS or local). If there is none, tell me your recommendation before choosing. Resumes must NOT be publicly listable; use private storage with signed or authenticated access.
  5. Prevent duplicates: the same email applying to the same job twice returns a friendly "You've already applied for this role" message.
  6. Create the Candidate/Application record and update the job's applicant count.
  7. Return a consistent JSON response in the project's existing response format, with no internal IDs or stack traces leaked.
- Abuse protection: honeypot field, rate limiting per IP (e.g. 5 applications/hour), and a request size limit. Use CAPTCHA only if the project already has it.
- Optional (do it if email sending is already configured): send a confirmation email to the candidate, and a notification to hr@meelTe.com with the candidate details and a link to the admin page. Read the HR email from an environment variable, not hardcoded.

### 5. Admin side (minimum)
- The Applicants column in Jobs Management shows the real count.
- Clicking it, or a "View applicants" action, opens a list of candidates for that job: name, email, phone, location, applied date, status, and a Resume download/view action (authenticated admins only).
- Allow changing the candidate status (Applied, Shortlisted, Rejected, Hired) only if a status field/flow already exists. Otherwise just display it.
- If the admin candidates screen already exists, extend it rather than building a new one.

## Constraints
- Don't break the existing Careers page, job details page, admin job create/publish flow or existing Candidate usage.
- Follow the existing folder structure, code style and API patterns.
- Resume files and candidate data are personal data, so don't log them to the console and don't expose them in public API responses.

## Deliverables
1. Audit summary: the current Candidate model, the gap table, and anything unclear in the existing data flow.
2. Root list of files changed or added, and why.
3. The implementation, including migration and env variables needed (list them).
4. Manual test steps:
   - Click Apply on an active job, and the form opens (no mail client opens).
   - Submit with empty or invalid fields, and inline errors show.
   - Upload a .exe renamed to .pdf, and it is rejected. Upload a 6 MB PDF, and it is rejected.
   - Submit a valid application, and the success screen shows, the candidate appears in the DB with the correct jobId, and the Applicants count goes up by 1.
   - Apply again with the same email for the same job, and the duplicate message shows.
   - Archive or expire the job, then try to apply (via the old URL or the API directly), and it is rejected.
   - Open a resume from the admin portal, and it works for admins only.
5. Run build, lint and tests, and report the results.