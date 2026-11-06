#!/usr/bin/env node

/**
 * seed-hr-firebase.mjs
 *
 * Standalone seed script to populate Cloud Firestore collections ("hr_jobs" and "hr_candidates")
 * with initial jobs and candidates for the Meelte HR Portal.
 *
 * Usage:
 *   node scripts/seed-hr-firebase.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Frontend Developer (Next.js / React)",
    department: "Engineering",
    employmentType: "Full-time",
    workplaceType: "Hybrid",
    location: "Bengaluru, India",
    description:
      "We are looking for a skilled Frontend Developer to build clean, responsive, and accessible web experiences for Meelte. You will collaborate with design and backend teams to implement high-impact hyperlocal discovery interfaces.",
    responsibilities:
      "- Develop performant Next.js 16 components with Tailwind CSS.\n- Maintain strict accessibility (WCAG 2.2 AA) and responsive layouts.\n- Ensure zero Cumulative Layout Shift and high Core Web Vitals.\n- Coordinate API contracts with Supabase PostgREST and backend services.",
    requirements:
      "- 3+ years experience with React, Next.js (App Router), and modern JavaScript.\n- Strong expertise in Tailwind CSS and component-driven architecture.\n- Experience with accessible design primitives and state management.\n- Passion for clean code, typography, and polished SaaS UI.",
    salaryRange: "₹10,00,000 - ₹16,00,000 / yr",
    deadline: "2026-12-15",
    status: "Active",
    applicantCount: 18,
    createdAt: "2026-10-20",
    updatedAt: "2026-11-01",
  },
  {
    id: "job-2",
    title: "Field Acquisition Specialist",
    department: "Operations",
    employmentType: "Full-time",
    workplaceType: "On-site",
    location: "Gaya & Ranchi, India",
    description:
      "Lead ground merchant acquisition across local retail hubs and shopkeepers. You will onboard neighborhood shops, educate merchants on Meelte's photo menu import, and expand local offer inventory.",
    responsibilities:
      "- Visit local shopkeepers, restaurants, and service providers.\n- Onboard merchants to Meelte and assist with initial shop ad setup.\n- Build trusted rapport with neighborhood business associations.\n- Report weekly acquisition metrics and feedback directly to Operations HR.",
    requirements:
      "- Excellent in-person communication and rapport-building skills.\n- Fluency in Hindi and local regional dialects.\n- Self-motivated, comfortable with field travel and direct merchant outreach.\n- Prior experience in merchant acquisition or retail sales preferred.",
    salaryRange: "₹3,50,000 - ₹5,50,000 / yr + Incentives",
    deadline: "2026-12-31",
    status: "Active",
    applicantCount: 42,
    createdAt: "2026-10-15",
    updatedAt: "2026-10-28",
  },
  {
    id: "job-3",
    title: "Community Growth Manager",
    department: "Marketing",
    employmentType: "Full-time",
    workplaceType: "Hybrid",
    location: "Bengaluru, India",
    description:
      "Drive grassroots community growth and engagement across local neighborhoods. Coordinate local event hosts, foster creator networks, and amplify hyper-local events.",
    responsibilities:
      "- Engage with local community clubs, sports leagues, and workshop organizers.\n- Oversee the ambassador program across pilot cities.\n- Design creative organic campaigns celebrating neighborhood culture.\n- Monitor user feedback and host satisfaction.",
    requirements:
      "- 2+ years in community management, social growth, or local marketing.\n- Strong copywriting and community storytelling abilities.\n- Analytical mindset with an eye for engagement metrics.",
    salaryRange: "₹6,00,000 - ₹9,50,000 / yr",
    deadline: "2026-11-30",
    status: "Active",
    applicantCount: 27,
    createdAt: "2026-10-24",
    updatedAt: "2026-11-02",
  },
  {
    id: "job-4",
    title: "Backend Engineer (Go / Supabase / Postgres)",
    department: "Engineering",
    employmentType: "Full-time",
    workplaceType: "Remote",
    location: "India (Remote)",
    description:
      "Build scalable services, edge functions, and database schemas supporting location-based feeds, real-time messaging, and high-concurrency event join requests.",
    responsibilities:
      "- Design and optimize Postgres schemas, indexes, and PostgREST endpoints.\n- Build resilient microservices and edge functions.\n- Maintain high reliability, low-latency API contracts, and security audits.",
    requirements:
      "- 4+ years backend development experience in Go, Node.js, or Python.\n- In-depth Postgres indexing and SQL query optimization skills.\n- Experience with high-throughput distributed systems.",
    salaryRange: "₹14,00,000 - ₹22,0,000 / yr",
    deadline: "2026-12-20",
    status: "Draft",
    applicantCount: 0,
    createdAt: "2026-11-02",
    updatedAt: "2026-11-02",
  },
  {
    id: "job-5",
    title: "Merchant Onboarding Associate",
    department: "Operations",
    employmentType: "Contract",
    workplaceType: "On-site",
    location: "Ranchi, India",
    description:
      "Support new shopkeepers through the digital verification and catalog creation process. Ensure shop ads meet quality guidelines.",
    responsibilities:
      "- Verify merchant photo uploads and menu OCR data.\n- Provide hands-on guidance to new merchants during their first 30 days.\n- Resolve catalog and listing questions promptly.",
    requirements:
      "- Customer-first mindset and high attention to detail.\n- Basic computer literacy and smartphone fluency.\n- Previous experience in customer support or retail operations is a plus.",
    salaryRange: "₹25,000 / month",
    deadline: "2026-10-31",
    status: "Expired",
    applicantCount: 31,
    createdAt: "2026-09-15",
    updatedAt: "2026-11-01",
  },
  {
    id: "job-6",
    title: "UI/UX Product Designer",
    department: "Product Design",
    employmentType: "Full-time",
    workplaceType: "Hybrid",
    location: "Bengaluru, India",
    description:
      "Lead product design across mobile and web platforms, defining design systems, micro-interactions, and high-density, accessible interface patterns.",
    responsibilities:
      "- Create end-to-end design flows in Figma for Flutter mobile and Next.js web.\n- Maintain and evolve design token contracts and component libraries.\n- Conduct user interviews with consumers and local shopkeepers.",
    requirements:
      "- Portfolio demonstrating strong typography, spacing, and system design.\n- Deep understanding of iOS, Android, and web accessibility standards.\n- Experience designing for mobile-first audiences in India.",
    salaryRange: "₹12,00,000 - ₹18,00,000 / yr",
    deadline: "2026-10-15",
    status: "Archived",
    applicantCount: 14,
    createdAt: "2026-09-01",
    updatedAt: "2026-10-16",
  },
];

const INITIAL_CANDIDATES = [
  {
    id: "cand-1",
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    appliedJobId: "job-1",
    appliedJobTitle: "Frontend Developer (Next.js / React)",
    appliedDate: "2026-11-03",
    status: "Under Review",
    experience: "3.5 years",
    currentCompany: "HyperTech Solutions",
    resumeUrl: "#",
    notes: [
      {
        id: "n-1",
        author: "HR Operations",
        date: "2026-11-04",
        text: "Strong React 19 and Tailwind portfolio. Code sample shows good accessibility focus.",
      },
    ],
  },
  {
    id: "cand-2",
    fullName: "Pooja Verma",
    email: "pooja.verma@example.com",
    phone: "+91 98234 56789",
    location: "Gaya, Bihar",
    appliedJobId: "job-2",
    appliedJobTitle: "Field Acquisition Specialist",
    appliedDate: "2026-11-02",
    status: "Shortlisted",
    experience: "2 years",
    currentCompany: "LocalPay Merchant Ops",
    resumeUrl: "#",
    notes: [
      {
        id: "n-2",
        author: "Field Lead",
        date: "2026-11-03",
        text: "Extensive ground retail experience in Gaya market. Speaks Magahi and Hindi fluently.",
      },
    ],
  },
  {
    id: "cand-3",
    fullName: "Rohan Nair",
    email: "rohan.nair@example.com",
    phone: "+91 97123 45678",
    location: "Bengaluru, Karnataka",
    appliedJobId: "job-1",
    appliedJobTitle: "Frontend Developer (Next.js / React)",
    appliedDate: "2026-11-01",
    status: "Interview Scheduled",
    experience: "4 years",
    currentCompany: "Kite Mobility",
    resumeUrl: "#",
    notes: [
      {
        id: "n-3",
        author: "HR Lead",
        date: "2026-11-02",
        text: "Technical interview round scheduled with Engineering for Nov 6th.",
      },
    ],
  },
  {
    id: "cand-4",
    fullName: "Sneha Mukherjee",
    email: "sneha.m@example.com",
    phone: "+91 99456 78901",
    location: "Ranchi, Jharkhand",
    appliedJobId: "job-2",
    appliedJobTitle: "Field Acquisition Specialist",
    appliedDate: "2026-10-29",
    status: "Under Review",
    experience: "1.5 years",
    currentCompany: "Zomato Partner Network",
    resumeUrl: "#",
    notes: [],
  },
  {
    id: "cand-5",
    fullName: "Vikramaditya Rathore",
    email: "vikram.rathore@example.com",
    phone: "+91 98321 09876",
    location: "Bengaluru, Karnataka",
    appliedJobId: "job-3",
    appliedJobTitle: "Community Growth Manager",
    appliedDate: "2026-10-28",
    status: "Shortlisted",
    experience: "3 years",
    currentCompany: "PlaySpots Club",
    resumeUrl: "#",
    notes: [
      {
        id: "n-4",
        author: "Marketing HR",
        date: "2026-10-30",
        text: "Managed 500+ member sports communities. Good culture fit for local events pillar.",
      },
    ],
  },
  {
    id: "cand-6",
    fullName: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "+91 97654 32109",
    location: "Pune, Maharashtra",
    appliedJobId: "job-1",
    appliedJobTitle: "Frontend Developer (Next.js / React)",
    appliedDate: "2026-10-26",
    status: "Rejected",
    experience: "1 year",
    currentCompany: "Freelance",
    resumeUrl: "#",
    notes: [
      {
        id: "n-5",
        author: "HR Operations",
        date: "2026-10-28",
        text: "Looking for more experienced App Router & Next.js production background.",
      },
    ],
  },
  {
    id: "cand-7",
    fullName: "Karan Patel",
    email: "karan.patel@example.com",
    phone: "+91 98112 23344",
    location: "Ranchi, Jharkhand",
    appliedJobId: "job-5",
    appliedJobTitle: "Merchant Onboarding Associate",
    appliedDate: "2026-10-20",
    status: "Offered",
    experience: "2.5 years",
    currentCompany: "RetailEase Agency",
    resumeUrl: "#",
    notes: [
      {
        id: "n-6",
        author: "Operations HR",
        date: "2026-10-25",
        text: "Offer letter released for contract onboarding position.",
      },
    ],
  },
];

/**
 * Reads and parses NEXT_PUBLIC_FIREBASE_CONFIG or FIREBASE_CONFIG
 * by inspecting process.env, .env.local, and .env.
 */
function resolveFirebaseConfig() {
  if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    return process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  }
  if (process.env.FIREBASE_CONFIG) {
    return process.env.FIREBASE_CONFIG;
  }

  const envFiles = [".env.local", ".env"];
  for (const fileName of envFiles) {
    const fullPath = path.resolve(process.cwd(), fileName);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (
        line.startsWith("NEXT_PUBLIC_FIREBASE_CONFIG=") ||
        line.startsWith("FIREBASE_CONFIG=")
      ) {
        const eqIdx = line.indexOf("=");
        let val = line.slice(eqIdx + 1).trim();

        if (
          (val.startsWith("'") && val.endsWith("'")) ||
          (val.startsWith('"') && val.endsWith('"'))
        ) {
          val = val.slice(1, -1);
        }

        return val.replace(/\\'/g, "'");
      }
    }
  }

  return null;
}

const rawConfig = resolveFirebaseConfig();
if (!rawConfig) {
  console.error(
    "Error: NEXT_PUBLIC_FIREBASE_CONFIG is not defined in environment, .env.local, or .env."
  );
  process.exit(1);
}

let firebaseConfig;
try {
  firebaseConfig = typeof rawConfig === "string" ? JSON.parse(rawConfig) : rawConfig;
} catch (e) {
  console.error("Error: Could not parse Firebase JSON configuration:", e.message);
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding HR Jobs and Candidates into Firestore...\n");

  console.log(`Seeding ${INITIAL_JOBS.length} jobs into "hr_jobs"...`);
  for (const job of INITIAL_JOBS) {
    const docRef = doc(db, "hr_jobs", job.id);
    await setDoc(docRef, {
      ...job,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`  ✓ Seeded job: ${job.title} (${job.id})`);
  }

  console.log(`\nSeeding ${INITIAL_CANDIDATES.length} candidates into "hr_candidates"...`);
  for (const candidate of INITIAL_CANDIDATES) {
    const docRef = doc(db, "hr_candidates", candidate.id);
    await setDoc(docRef, {
      ...candidate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`  ✓ Seeded candidate: ${candidate.fullName} (${candidate.id})`);
  }

  console.log("\n Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
