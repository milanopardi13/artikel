import { getSiteOrigin } from "@/lib/site-url";
import type { Locale } from "@/lib/i18n/types";

/**
 * Absolute, self-referencing canonical URL for a locale-prefixed route.
 *
 *   canonical("fa", "/about")         → https://site/fa/about
 *   canonical("en", "")               → https://site/en
 *   canonical("fa", "/patterns/qg")   → https://site/fa/patterns/qg
 */
export function canonical(locale: Locale, path = ""): string {
  const base = getSiteOrigin();
  const p = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${base}/${locale}${p}`.replace(/\/+$/, "");
}

/** Robots metadata for pages that must never be indexed (search, auth, admin…). */
export const NOINDEX: { index: false; follow: true } = { index: false, follow: true };
