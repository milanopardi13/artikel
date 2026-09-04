import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { PatternGrid, ProductGrid } from "@/components/product/Grids";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { enrichPattern, enrichPortfolio, enrichProduct, getSite } from "@/lib/data/queries";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";
import { href, t } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const site = await getSite();
  const c = site.categories.find((x) => x.slug === slug);
  return c ? { title: t(c.name, locale), description: t(c.description, locale), alternates: { canonical: canonical(locale, `/styles/${slug}`) } } : {};
}

export default async function StylePage({ params }: Props) {
  const { locale, slug } = await params;
  const site = await getSite();
  const c = site.categories.find((x) => x.slug === slug);
  if (!c) notFound();
  const d = dictionaries[locale];
  const patterns = site.patterns.filter((p) => p.categoryId === c.id).map((p) => enrichPattern(site, p));
  const products = site.products.filter((p) => p.categoryId === c.id).map((p) => enrichProduct(site, p));
  const projects = site.portfolios.filter((p) => p.categoryId === c.id).map((p) => enrichPortfolio(site, p));
  return (
    <>
      <PageHero eyebrow={d.nav.styles} title={t(c.name, locale)} description={t(c.description, locale)} image={c.image} />
      <section className="container-x section-y">
        <SectionHeader eyebrow={d.nav.patterns} title={`${t(c.name, locale)} · ${d.nav.patterns}`} href={href(locale, `/patterns?category=${c.slug}`)} hrefLabel={d.nav.viewAll} />
        <div className="mt-8"><PatternGrid patterns={patterns} /></div>
      </section>
      {projects.length > 0 && (
        <section className="bg-background-secondary"><div className="container-x section-y">
          <SectionHeader eyebrow={d.nav.portfolio} title={d.common.relatedProjects} href={href(locale, "/portfolio")} hrefLabel={d.nav.viewAll} />
          <div className="mt-8 grid gap-5 md:grid-cols-2">{projects.slice(0, 2).map((p) => <div key={p.id} className="aspect-[16/10]"><PortfolioCard item={p} /></div>)}</div>
        </div></section>
      )}
      {products.length > 0 && (
        <section className="container-x section-y">
          <SectionHeader eyebrow={d.nav.products} title={d.common.relatedProducts} href={href(locale, `/shop?category=${c.slug}`)} hrefLabel={d.nav.viewAll} />
          <div className="mt-8"><ProductGrid products={products} /></div>
        </section>
      )}
    </>
  );
}
