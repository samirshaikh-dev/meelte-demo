import { CACHE_TAGS, DETAIL_REVALIDATE_SECONDS } from "../shared/constants";
import { MEELTE_WEB_API_ERROR, MeelteWebApiError } from "../shared/errors";
import { firstObject, request } from "../shared/request";
import { normalizeAd } from "../normalizers/ad";
import { normalizeId } from "../normalizers/primitives";

/**
 * One public offer, or null when it does not exist.
 *
 * A malformed id short-circuits to null so the page renders its 404 without an
 * upstream round trip; a NOT_FOUND from PostgREST is treated the same way.
 * Every other failure propagates so the page can show its temporary-error copy.
 */
export async function getPublicAd(id) {
  const normalizedId = normalizeId(id);
  if (!normalizedId) return null;

  try {
    const data = await request(
      "web_get_ad",
      { p_id: normalizedId },
      {
        accept: "application/vnd.pgrst.object+json",
        revalidate: DETAIL_REVALIDATE_SECONDS,
        tag: CACHE_TAGS.ads,
      }
    );
    const ad = normalizeAd(firstObject(data));
    return ad?.id ? ad : null;
  } catch (error) {
    if (error instanceof MeelteWebApiError && error.code === MEELTE_WEB_API_ERROR.NOT_FOUND) {
      return null;
    }
    throw error;
  }
}
