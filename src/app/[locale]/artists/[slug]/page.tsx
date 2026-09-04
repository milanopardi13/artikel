import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { artistStats, enrichEducation, enrichPattern, enrichPortfolio, enrichProduct, getSite } from "@/lib/data/queries";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";
import { t } from "@/lib/utils";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const site = await getSite();
  const a = site.artists.find((x) => x.slug === slug);
  return a ? { title: t(a.name, locale), description: t(a.bio, locale), alternates: { canonical: canonical(locale, `/artists/${slug}`) } } : {};
}

export default async function ArtistPage({ params }: Props) {
  const { locale, slug } = await params;
  const site = await getSite();
  const artist = site.artists.find((x) => x.slug === slug);
  if (!artist) notFound();
  const s = artistStats(site, artist.id);
  const patternIds = new Set(s.patterns.map((p) => p.id));
  const collections = site.collections.filter((c) => c.patternIds.some((id) => patternIds.has(id)));
  const reviews = locale === "fa"
    ? [{ name: "مریم ک.", text: "کیفیت فایل‌ها عالی و تکرار کاملاً بی‌درز بود. برای پروژه‌ی هتل استفاده کردیم.", rating: 5 }, { name: "استودیو ۱۴", text: "همکاری حرفه‌ای، تحویل به‌موقع.", rating: 5 }, { name: "امیر ر.", text: "پالت رنگی دقیقاً با فضا هماهنگ شد.", rating: 4 }]
    : [{ name: "Maryam K.", text: "File quality was excellent and the repeat perfectly seamless. Used for a hotel project.", rating: 5 }, { name: "Studio 14", text: "Professional collaboration, delivered on time.", rating: 5 }, { name: "Amir R.", text: "The palette matched the space exactly.", rating: 4 }];

  return (
    <article className="pt-[var(--header-h)]">
      <ProfileHeader artist={artist} counts={{ patterns: s.patterns.length, products: s.products.length, projects: s.portfolios.length }} />
      <ProfileTabs
        portfolios={s.portfolios.map((p) => enrichPortfolio(site, p))}
        patterns={s.patterns.map((p) => enrichPattern(site, p))}
        products={s.products.map((p) => enrichProduct(site, p))}
        education={s.education.map((e) => enrichEducation(site, e))}
        collections={collections}
        reviews={reviews}
      />
    </article>
  );
}
