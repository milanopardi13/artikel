/**
 * Resolve the configured NEXT_PUBLIC_SITE_URL to a bare origin
 * (scheme + host [+ port], with no path and no trailing slash).
 *
 * Tolerates a value that mistakenly includes a path segment — e.g. someone sets
 * `https://site.netlify.app/fa`. That path would otherwise leak into every
 * sitemap URL, robots URL and canonical/OG tag (producing `…/fa/fa/…`).
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.netlify.app";
  try {
    const u = new URL(raw.trim().replace(/\/+$/, ""));
    return u.origin;
  } catch {
    return raw.trim().replace(/\/+$/, "");
  }
}
