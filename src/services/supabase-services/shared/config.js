import "server-only";

import { MEELTE_WEB_API_ERROR, MeelteWebApiError } from "./errors";

/**
 * Resolve the PostgREST base URL and anon key from the server environment.
 *
 * This is the only module under `supabase-services/` that reads `process.env`,
 * which keeps the secret boundary greppable and prevents an accidental
 * client-side import from reaching a credential (AI_RULE.md §2.1).
 */
export function getApiConfig() {
  const base = process.env.MEELTE_API_BASE?.trim();
  const key = process.env.MEELTE_SUPABASE_ANON_KEY?.trim();

  if (!base || !key) {
    throw new MeelteWebApiError(
      MEELTE_WEB_API_ERROR.NOT_CONFIGURED,
      "The meelTe Web API is not configured."
    );
  }

  let parsedBase;
  try {
    parsedBase = new URL(base);
  } catch {
    throw new MeelteWebApiError(
      MEELTE_WEB_API_ERROR.NOT_CONFIGURED,
      "The meelTe Web API base URL is invalid."
    );
  }

  if (parsedBase.protocol !== "https:") {
    throw new MeelteWebApiError(
      MEELTE_WEB_API_ERROR.NOT_CONFIGURED,
      "The meelTe Web API base URL must use HTTPS."
    );
  }

  return {
    base: parsedBase.toString().replace(/\/$/, ""),
    key,
  };
}
