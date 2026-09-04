import type { Metadata } from "next";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { enrichPortfolio, getSite } from "@/lib/data/queries";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";
import { t } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const site = await getSite();
  const m = site.seo.find((s) => s.path === "/portfolio");
  return { title: m ? { absolute: t(m.title, locale) } : dictionaries[locale].nav.portfolio, description: m ? t(m.description, locale) : undefined, alternates: { canonical: canonical(locale, "/portfolio") } };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const site = await getSite();
  const d = dictionaries[locale];
  const items = site.portfolios.map((p) => enrichPortfolio(site, p));
  const lead = items.find((p) => p.size === "hero" && p.featured) ?? items[0];
  const rest = items.filter((p) => p.id !== lead?.id);
  const cats = site.categories.filter((c) => site.portfolios.some((p) => p.categoryId === c.id));

  return (
    <>
      {lead && <PortfolioHero item={lead} locale={locale} eyebrow={d.nav.portfolio} title={locale === "fa" ? "گالری دیجیتال طراحی" : "A digital design gallery"} description={d.home.portfolioDesc} />}
      <section className="container-x section-y">
        <PortfolioGrid items={rest} categories={cats} />
      </section>
    </>
  );
}
