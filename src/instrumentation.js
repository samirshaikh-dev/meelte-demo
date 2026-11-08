/**
 * Next.js Instrumentation Hook
 * Invoked once when the Next.js server boots up.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@/lib/logger");
    logger.info(
      {
        runtime: process.env.NEXT_RUNTIME,
        env: process.env.NODE_ENV,
      },
      "Next.js server runtime initialized with Pino logger"
    );
  }
}

