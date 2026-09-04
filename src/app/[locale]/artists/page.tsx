import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { artistStats, getSite } from "@/lib/data/queries";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";
import { href } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: dictionaries[locale].nav.artists, alternates: { canonical: canonical(locale, "/artists") } };
}

export default async function ArtistsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const site = await getSite();
  const d = dictionaries[locale];
  const artists = site.artists.map((a) => {
    const s = artistStats(site, a.id);
    return { ...a, featuredPattern: s.patterns[0] ?? null, portfolioPreview: s.portfolios.map((p) => p.cover), counts: { patterns: s.patterns.length, projects: s.portfolios.length } };
  });
  return (
    <>
      <PageHero eyebrow={d.nav.artists} title={d.home.artistsTitle} description={d.home.artistsDesc}>
        <Button href={href(locale, "/creators/join")} variant="outline">{d.nav.becomeCreator}</Button>
      </PageHero>
      <div className="container-x pb-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {artists.map((a, i) => <Reveal key={a.id} delay={(i % 3) * 70}><ArtistCard artist={a} variant="large" /></Reveal>)}
        </div>
      </div>
    </>
  );
}
