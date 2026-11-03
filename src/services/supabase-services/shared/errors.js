// Domain error contract for the read-only Supabase Web API client.
// Callers branch on `code`, never on the message text.

export const MEELTE_WEB_API_ERROR = {
  NOT_CONFIGURED: "NOT_CONFIGURED",
  NOT_FOUND: "NOT_FOUND",
};

export class MeelteWebApiError extends Error {
  constructor(code, message, { status = 0, cause } = {}) {
    super(message);
    this.name = "MeelteWebApiError";
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}
