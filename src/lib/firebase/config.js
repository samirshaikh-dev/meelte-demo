import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Safely parses the single-variable Firebase JSON configuration.
 * Supports NEXT_PUBLIC_FIREBASE_CONFIG (recommended for client + server)
 * and falls back to FIREBASE_CONFIG.
 */
function parseFirebaseConfig() {
  const rawConfig =
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG || process.env.FIREBASE_CONFIG;

  if (!rawConfig) {
    return null;
  }

  try {
    return typeof rawConfig === "string" ? JSON.parse(rawConfig) : rawConfig;
  } catch (error) {
    console.warn("Failed to parse Firebase configuration:", error.message);
    return null;
  }
}

const firebaseConfig = parseFirebaseConfig();

let app = null;
let db = null;
let storage = null;

if (firebaseConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
}

/**
 * Returns the initialized Firebase app or throws a user-friendly error.
 */
export function getFirebaseApp() {
  if (!app) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[Firebase] Missing NEXT_PUBLIC_FIREBASE_CONFIG. Set it in .env.local to enable Firebase."
      );
    }
    throw new Error(
      "Service is temporarily unavailable. Please try again shortly."
    );
  }
  return app;
}

/**
 * Returns the Cloud Firestore instance or throws a user-friendly error.
 */
export function getFirebaseDb() {
  if (!db) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[Firestore] Database is uninitialized due to missing configuration."
      );
    }
    throw new Error(
      "Unable to connect to the service. Please refresh or try again in a moment."
    );
  }
  return db;
}

/**
 * Returns the Firebase Storage instance or throws a user-friendly error.
 */
export function getFirebaseStorage() {
  if (!storage) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[Firebase Storage] Storage is uninitialized due to missing configuration."
      );
    }
    throw new Error(
      "File service is temporarily unavailable. Please try again in a few moments."
    );
  }
  return storage;
}

export { app, db, storage };
