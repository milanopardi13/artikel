import { NextResponse } from "next/server";
import { storeBackendName } from "@/lib/data/store";
import { adminConfigured } from "@/lib/auth";

/**
 * Unauthenticated readiness probe — handy for Netlify/Vercel debugging and uptime checks.
 * Reports *which* storage backend is active and whether admin auth is configured, never secrets.
 *
 * On serverless hosts (Netlify/Vercel) a `backend: "file"` line means admin saves will NOT
 * persist — set UPSTASH_REDIS_REST_URL/TOKEN (or BLOB_READ_WRITE_TOKEN).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "rosie-atelier",
      time: new Date().toISOString(),
      storage: { backend: storeBackendName(), persistent: storeBackendName() !== "file" },
      admin: { configured: adminConfigured() },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
