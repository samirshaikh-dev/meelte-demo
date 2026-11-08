import "server-only";

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = !isProduction;

export const defaultLogLevel =
  process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

export const serviceName = process.env.SERVICE_NAME || "meelte-nextjs-web";

export const redactPaths = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "secret",
  "serviceAccountKey",
  "credential",
  "private_key",
  "client_secret",
  "headers.cookie",
  "headers.authorization",
  "req.headers.cookie",
  "req.headers.authorization",
  "*.password",
  "*.token",
  "*.secret",
  "*.accessToken",
  "*.refreshToken",
];

export const redactCensor = "[REDACTED]";

