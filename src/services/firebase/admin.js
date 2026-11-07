import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { initializeFirestore, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let adminApp = null;
let adminDb = null;
let adminBucket = null;

function resolveStorageBucket() {
  if (process.env.FIREBASE_STORAGE_BUCKET) {
    return process.env.FIREBASE_STORAGE_BUCKET;
  }
  const raw = process.env.FIREBASE_CONFIG || process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (!raw) return undefined;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed.storageBucket;
  } catch {
    return undefined;
  }
}

function resolveServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err.message);
    }
    return null;
  }
}

/**
 * Returns the singleton Firebase Admin App instance.
 */
export function getAdminApp() {
  if (adminApp) return adminApp;
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const serviceAccount = resolveServiceAccount();
  const bucketName = resolveStorageBucket();

  const options = {
    storageBucket: bucketName,
  };

  if (serviceAccount) {
    options.credential = cert(serviceAccount);
  }

  adminApp = initializeApp(options);
  return adminApp;
}

/**
 * Returns the Cloud Firestore admin database instance with HTTP/1.1 REST transport.
 */
export function getAdminDb() {
  if (adminDb) return adminDb;
  const app = getAdminApp();
  try {
    adminDb = initializeFirestore(app, { preferRest: true });
  } catch {
    adminDb = getFirestore(app);
  }
  return adminDb;
}

/**
 * Returns the Firebase Storage default admin Bucket instance.
 */
export function getAdminBucket() {
  if (adminBucket) return adminBucket;
  const app = getAdminApp();
  const bucketName = resolveStorageBucket();
  adminBucket = getStorage(app).bucket(bucketName || undefined);
  return adminBucket;
}

