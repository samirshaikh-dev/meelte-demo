import "server-only";
import pino from "pino";
import {
  isProduction,
  defaultLogLevel,
  serviceName,
  redactPaths,
  redactCensor,
} from "./config";
import { sanitizeError, maskEmail, truncatePayload } from "./sanitize";

/**
 * Primary Pino structured logger instance.
 * Optimized for high-throughput Node.js execution with sensitive field redaction
 * and pretty printing in local development.
 */
export const logger = pino({
  level: defaultLogLevel,
  base: {
    service: serviceName,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: redactPaths,
    censor: redactCensor,
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }),
});

/**
 * Creates a child logger with bound module or request metadata.
 *
 * @param {string} moduleName - Name of the calling service/module/route
 * @param {Record<string, unknown>} [context={}] - Optional metadata bindings
 * @returns {pino.Logger}
 */
export function getChildLogger(moduleName, context = {}) {
  return logger.child({
    module: moduleName,
    ...context,
  });
}

export { sanitizeError, maskEmail, truncatePayload };
export default logger;

