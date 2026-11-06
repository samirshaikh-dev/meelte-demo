#!/usr/bin/env node

/**
 * empty-hr-firebase.mjs
 *
 * Standalone maintenance script to empty Cloud Firestore collections ("hr_jobs", "hr_candidates")
 * and uploaded files in Firebase Storage ("hr/resumes") for the meelTe HR Portal.
 *
 * Usage:
 *   node scripts/empty-hr-firebase.mjs           # Asks for interactive confirmation
 *   node scripts/empty-hr-firebase.mjs --force   # Bypasses confirmation (for automation / CI)
 *   node scripts/empty-hr-firebase.mjs --yes     # Alias for --force
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  listAll,
  deleteObject,
} from "firebase/storage";

const COLLECTIONS_TO_EMPTY = ["hr_jobs", "hr_candidates"];
const STORAGE_PREFIXES_TO_EMPTY = ["hr/resumes"];

/**
 * Resolves Firebase configuration from environment variables or .env/.env.local files.
 */
function resolveFirebaseConfig() {
  if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    return process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  }
  if (process.env.FIREBASE_CONFIG) {
    return process.env.FIREBASE_CONFIG;
  }

  const envFiles = [".env.local", ".env"];
  for (const envFile of envFiles) {
    const envPath = path.resolve(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const match =
        content.match(/NEXT_PUBLIC_FIREBASE_CONFIG\s*=\s*(.*)/) ||
        content.match(/FIREBASE_CONFIG\s*=\s*(.*)/);

      if (match && match[1]) {
        let val = match[1].trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        return val;
      }
    }
  }

  return null;
}

/**
 * Prompts user for interactive terminal confirmation.
 */
function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Empties all documents from a target Firestore collection in batches of 500.
 */
async function emptyFirestoreCollection(db, collectionName) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);

  if (snapshot.empty) {
    console.log(`  - "${collectionName}": 0 documents (already empty).`);
    return 0;
  }

  let totalDeleted = 0;
  const docs = snapshot.docs;
  const batchSize = 450; // Firestore maximum is 500 operations per batch

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = writeBatch(db);
    const chunk = docs.slice(i, i + batchSize);
    for (const docSnap of chunk) {
      batch.delete(docSnap.ref);
    }
    await batch.commit();
    totalDeleted += chunk.length;
  }

  console.log(`  ✓ "${collectionName}": deleted ${totalDeleted} document(s).`);
  return totalDeleted;
}

/**
 * Recursively deletes all files under a Firebase Storage prefix.
 */
async function emptyStoragePrefix(storage, prefix) {
  let deletedCount = 0;

  async function deleteFolder(folderRef) {
    try {
      const result = await listAll(folderRef);

      // Delete files in this folder
      for (const itemRef of result.items) {
        await deleteObject(itemRef);
        deletedCount += 1;
      }

      // Recursively delete sub-prefixes
      for (const subPrefixRef of result.prefixes) {
        await deleteFolder(subPrefixRef);
      }
    } catch (err) {
      // If folder does not exist or storage rules restrict, log softly
      if (err.code !== "storage/object-not-found") {
        console.warn(`    [Storage Notice] Could not list "${folderRef.fullPath}": ${err.message}`);
      }
    }
  }

  const rootRef = ref(storage, prefix);
  await deleteFolder(rootRef);

  if (deletedCount > 0) {
    console.log(`  ✓ "${prefix}": deleted ${deletedCount} storage file(s).`);
  } else {
    console.log(`  - "${prefix}": 0 storage files found.`);
  }

  return deletedCount;
}

async function main() {
  const isForce =
    process.argv.includes("--force") ||
    process.argv.includes("-f") ||
    process.argv.includes("--yes") ||
    process.argv.includes("-y");

  console.log("\n=======================================================");
  console.log("       meelTe Firebase Data Cleanup Utility");
  console.log("=======================================================\n");

  const rawConfig = resolveFirebaseConfig();
  if (!rawConfig) {
    console.error(
      "Error: NEXT_PUBLIC_FIREBASE_CONFIG was not found in environment, .env.local, or .env."
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

  console.log(`Target Firebase Project: ${firebaseConfig.projectId || "Unknown"}`);
  console.log(`Firestore collections to empty: ${COLLECTIONS_TO_EMPTY.join(", ")}`);
  console.log(`Storage folders to empty:       ${STORAGE_PREFIXES_TO_EMPTY.join(", ")}\n`);

  if (!isForce) {
    if (!process.stdin.isTTY) {
      console.error(
        "Error: Non-interactive environment detected. Pass --force or --yes to execute data deletion."
      );
      process.exit(1);
    }

    const answer = await askConfirmation(
      "⚠️  WARNING: This will permanently delete all records in the specified collections!\nAre you sure you want to proceed? (yes/no): "
    );

    if (answer !== "yes" && answer !== "y") {
      console.log("\nOperation cancelled. No data was deleted.\n");
      process.exit(0);
    }
  }

  console.log("\nDeleting Firestore documents...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  for (const collectionName of COLLECTIONS_TO_EMPTY) {
    try {
      await emptyFirestoreCollection(db, collectionName);
    } catch (err) {
      console.error(`  ✗ Error emptying collection "${collectionName}":`, err.message);
    }
  }

  console.log("\nDeleting Storage files...");
  for (const prefix of STORAGE_PREFIXES_TO_EMPTY) {
    try {
      await emptyStoragePrefix(storage, prefix);
    } catch (err) {
      console.error(`  ✗ Error cleaning storage prefix "${prefix}":`, err.message);
    }
  }

  console.log("\n Cleanup completed successfully!\n");
}

main().catch((err) => {
  console.error("\nExecution failed:", err.message);
  process.exit(1);
});

