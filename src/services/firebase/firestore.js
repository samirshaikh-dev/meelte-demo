import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";

/**
 * Creates a new document in a specified collection with an automatic server timestamp.
 *
 * @param {string} collectionPath - Name or path of the Firestore collection
 * @param {Record<string, unknown>} data - Document fields to persist
 * @returns {Promise<string>} Created document ID
 */
export async function createDocument(collectionPath, data) {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, collectionPath), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Retrieves a document by its ID from a specified collection.
 *
 * @param {string} collectionPath - Name or path of the Firestore collection
 * @param {string} id - Document ID
 * @returns {Promise<{ id: string, [key: string]: unknown } | null>}
 */
export async function getDocument(collectionPath, id) {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionPath, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/**
 * Updates an existing document in a specified collection.
 *
 * @param {string} collectionPath - Name or path of the Firestore collection
 * @param {string} id - Document ID
 * @param {Record<string, unknown>} data - Fields to update
 */
export async function updateDocument(collectionPath, id, data) {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionPath, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Sets a document by ID with optional merge.
 *
 * @param {string} collectionPath - Name or path of the Firestore collection
 * @param {string} id - Document ID
 * @param {Record<string, unknown>} data - Document data
 * @param {boolean} [merge=true] - Whether to merge with existing fields
 */
export async function setDocument(collectionPath, id, data, merge = true) {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionPath, id);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge }
  );
}

/**
 * Deletes a document by ID from a specified collection.
 *
 * @param {string} collectionPath - Name or path of the Firestore collection
 * @param {string} id - Document ID
 */
export async function deleteDocument(collectionPath, id) {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionPath, id);
  await deleteDoc(docRef);
}

/**
 * Queries documents from a collection with optional constraints.
 *
 * @param {string} collectionPath - Name or path of the Firestore collection
 * @param {Array} [constraints=[]] - Firestore query constraints (where, orderBy, limit, etc.)
 * @returns {Promise<Array<{ id: string, [key: string]: unknown }>>}
 */
export async function queryDocuments(collectionPath, constraints = []) {
  const db = getFirebaseDb();
  const collectionRef = collection(db, collectionPath);
  const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/**
 * Example domain helper: create a product document in Firestore
 *
 * @param {{ name: string, description: string, price?: number, [key: string]: unknown }} data
 * @returns {Promise<string>} Created product ID
 */
export async function createProduct(data) {
  return createDocument("products", data);
}

