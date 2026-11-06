#!/usr/bin/env node

import crypto from "node:crypto";

const password = process.argv[2] || "MeelteHR@2026";
const salt = crypto.randomBytes(16).toString("hex");
const iterations = 100000;
const keyLen = 64;
const digest = "sha512";

const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLen, digest);
const hash = derivedKey.toString("hex");
const hashString = `pbkdf2$${iterations}$${salt}$${hash}`;

const sessionSecret = crypto.randomBytes(32).toString("hex");

console.log("\n==========================================");
console.log(" Meelte HR Credentials Generator");
console.log("==========================================\n");
console.log(`Password input:      "${password}"`);
console.log("\nAdd the following lines to your local .env file:\n");
console.log(`HR_EMAIL="hr@meelte.com"`);
console.log(`HR_PASSWORD_HASH="${hashString}"`);
console.log(`HR_SESSION_SECRET="${sessionSecret}"`);
console.log("\n==========================================\n");

