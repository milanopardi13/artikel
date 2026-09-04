import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { PatternGrid } from "@/components/product/Grids";
import { enrichPattern, getSite } from "@/lib/data/queries";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";
import { t } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const site = await getSite();
  const s = site.spaces.find((x) => x.slug === slug);
  return s ? { title: t(s.name, locale), alternates: { canonical: canonical(locale, `/spaces/${slug}`) } } : {};
}
export default async function SpacePage({ params }: Props) {
  const { locale, slug } = await params;
  const site = await getSite();
  const s = site.spaces.find((x) => x.slug === slug);
  if (!s) notFound();
  const d = dictionaries[locale];
  const patterns = site.patterns.filter((p) => p.spaceIds.includes(s.id)).map((p) => enrichPattern(site, p));
  return (
    <>
      <PageHero eyebrow={d.nav.spaces} title={t(s.name, locale)} description={d.home.spacesDesc} image={s.image} />
      <section className="container-x section-y"><PatternGrid patterns={patterns} /></section>
    </>
  );
}
