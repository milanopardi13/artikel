import type { Metadata } from "next";
import "../globals.css";
import { notFound } from "next/navigation";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchPalette } from "@/components/layout/SearchPalette";
import { PageTransition } from "@/components/layout/PageTransition";
import { getNavData } from "@/lib/data/nav";
import { LOCALES, dirOf, type Locale } from "@/lib/i18n/types";
import { dictionaries } from "@/lib/i18n/dictionary";
import { getSiteOrigin } from "@/lib/site-url";

// Content is admin-managed at runtime (data/content.json) → render on demand so edits are live.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = dictionaries[(locale as Locale) ?? "fa"];
  const base = getSiteOrigin();
  return {
    title: { default: d?.brand ?? "Rosie Atelier", template: `%s · Rosie Atelier` },
    description: d?.tagline,
    // Fixed to a bare origin — the canonical URL itself is set per-page so it always
    // points at the real route (e.g. /fa/about), never at the locale root.
    metadataBase: new URL(base),
    openGraph: {
      type: "website",
      siteName: d?.brand ?? "Rosie Atelier",
      title: d?.brand,
      description: d?.tagline,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      images: [{ url: "/images/og/rosie-atelier.jpg", width: 1200, height: 630, alt: d?.tagline ?? "Rosie Atelier" }],
    },
    twitter: {
      card: "summary_large_image",
      title: d?.brand,
      description: d?.tagline,
      images: ["/images/og/rosie-atelier.jpg"],
    },
  };
}


const themeScript = `(function(){try{var t=localStorage.getItem('ra-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!LOCALES.includes(raw as Locale)) notFound();
  const locale = raw as Locale;
  const nav = await getNavData();

  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* preload only the font this locale actually renders first */}
        {locale === "fa" ? (
          <link rel="preload" href="/fonts/iransanse-web/IRANSansWeb.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        ) : (
          <link rel="preload" href="/fonts/instrument-serif/instrument-serif-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        )}
      </head>
      <body className="min-h-dvh flex flex-col">
        <AppProviders locale={locale}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">Skip to content</a>
          <Header nav={nav} />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <CartDrawer />
          <SearchPalette />
        </AppProviders>
      </body>
    </html>
  );
}
