/**
 * Display casing for names typed by merchants and event hosts.
 *
 * Both public surfaces show user-entered titles, and many are typed entirely in
 * lowercase ("twoweelar garege", "tech founders & investors meetup"). Title-casing
 * those improves the catalogue without overwriting deliberate casing, so any value
 * that already contains an uppercase letter (iPhone, BATA, McDonald's, Holi 2026)
 * is returned untouched.
 *
 * Lives in `src/lib` rather than in the offer or event formatters because the two
 * surfaces must agree: the offer card, the offer detail page, the event card, the
 * event detail page and the route wrappers that build metadata and JSON-LD all
 * render the same name, and a second copy of this rule would let them drift.
 */
export function formatDisplayName(value) {
  if (typeof value !== "string") return "";

  const name = value.replace(/\s+/g, " ").trim();
  if (!name || /[A-Z]/.test(name)) return name;

  return name.replace(/(^|[\s\-/&])([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
}

export default formatDisplayName;
