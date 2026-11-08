import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  checkApplyRateLimit,
  recordApplyAttempt,
  getClientIp,
  findActiveJobBySlugOrId,
  isJobOpen,
  submitJobApplication,
} from "@/services/site/careers/applications";
import {
  publicApplicationSchema,
  validateResumeBuffer,
} from "@/validation/careers/application-validation";

/**
 * POST /api/site/careers/jobs/[slug]/apply
 *
 * Public endpoint to submit job applications.
 */
export async function POST(request, context) {
  const params = await context.params;
  const slug = params?.slug;

  // 1. Abuse Protection: Rate Limiting
  const clientIp = getClientIp(request);
  const rateLimit = checkApplyRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many applications from this network. Please try again later.",
        code: "RATE_LIMITED",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  // 2. Parse FormData
  let formData;
  try {
    formData = await request.formData();
  } catch (parseErr) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid multipart form data.",
        code: "INVALID_REQUEST",
      },
      { status: 400 }
    );
  }

  // 3. Abuse Protection: Honeypot validation
  const honeypot = formData.get("website");
  if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't submit your application.",
        code: "INVALID_REQUEST",
      },
      { status: 400 }
    );
  }

  // 4. Job Liveness Check
  const job = await findActiveJobBySlugOrId(slug);
  if (!job || !isJobOpen(job)) {
    return NextResponse.json(
      {
        success: false,
        error: "This role is no longer accepting applications.",
        code: "JOB_CLOSED",
      },
      { status: 410 }
    );
  }

  // 5. Text fields validation
  const rawFields = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    linkedinUrl: formData.get("linkedinUrl") || "",
    portfolioUrl: formData.get("portfolioUrl") || "",
    experience: formData.get("experience") || "",
    currentCompany: formData.get("currentCompany") || "",
    noticePeriod: formData.get("noticePeriod") || "",
    expectedSalary: formData.get("expectedSalary") || "",
    coverNote: formData.get("coverNote") || "",
    consent: formData.get("consent"),
    website: honeypot || "",
  };

  const validation = publicApplicationSchema.safeParse(rawFields);
  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed.",
        code: "VALIDATION_FAILED",
        fieldErrors: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // 6. Resume file validation
  const resumeFile = formData.get("resume");
  if (!resumeFile || typeof resumeFile === "string" || typeof resumeFile.arrayBuffer !== "function") {
    return NextResponse.json(
      {
        success: false,
        error: "Please upload your resume document.",
        code: "INVALID_RESUME",
        fieldErrors: { resume: ["Please upload your resume document."] },
      },
      { status: 400 }
    );
  }

  let fileBuffer;
  try {
    const arrayBuf = await resumeFile.arrayBuffer();
    fileBuffer = Buffer.from(arrayBuf);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process the uploaded file.",
        code: "INVALID_RESUME",
      },
      { status: 400 }
    );
  }

  const resumeCheck = validateResumeBuffer(fileBuffer, resumeFile.name);
  if (!resumeCheck.valid) {
    return NextResponse.json(
      {
        success: false,
        error: resumeCheck.error,
        code: "INVALID_RESUME",
        fieldErrors: { resume: [resumeCheck.error] },
      },
      { status: 400 }
    );
  }

  // 7. Atomic Submission to Firestore & Storage
  try {
    const result = await submitJobApplication({
      job,
      candidateData: validation.data,
      resumeBuffer: fileBuffer,
      resumeFileName: resumeFile.name,
      resumeMimeType: resumeCheck.mimeType,
    });

    // Record rate limit attempt
    recordApplyAttempt(clientIp);

    return NextResponse.json(
      {
        success: true,
        data: {
          appliedAt: result.appliedAt,
          jobTitle: result.jobTitle,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === "ALREADY_APPLIED") {
      logger.warn(
        { operation: "job_application", code: "ALREADY_APPLIED" },
        "Candidate already applied for this role"
      );
      return NextResponse.json(
        {
          success: false,
          error: "You've already applied for this role.",
          code: "ALREADY_APPLIED",
        },
        { status: 409 }
      );
    }

    logger.error(
      { err, operation: "job_application" },
      "Failed to save job application"
    );

    return NextResponse.json(
      {
        success: false,
        error: "We couldn't save your application. Please try again.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}

