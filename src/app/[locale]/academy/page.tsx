import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { EducationCard } from "@/components/cards/EducationCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { StyleCard } from "@/components/cards/StyleCard";
import { enrichEducation, getSite } from "@/lib/data/queries";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";
import { faNum, href, t } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const site = await getSite();
  const m = site.seo.find((s) => s.path === "/academy");
  return { title: m ? { absolute: t(m.title, locale) } : dictionaries[locale].nav.education, description: m ? t(m.description, locale) : undefined, alternates: { canonical: canonical(locale, "/academy") } };
}

export default async function AcademyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const site = await getSite();
  const d = dictionaries[locale];
  const all = site.education.map((e) => enrichEducation(site, e));
  const courses = all.filter((e) => e.type === "course");
  const tutorials = all.filter((e) => e.type === "tutorial");
  const articles = all.filter((e) => e.type === "article").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const paths = all.filter((e) => e.type === "path");
  const popular = all.filter((e) => e.popular);
  const lead = all.find((e) => e.featured && e.type === "course") ?? all[0];
  const cats = site.categories.filter((c) => site.education.some((e) => e.categoryId === c.id));
  const n = (v: number) => (locale === "fa" ? faNum(v) : v);

  return (
    <>
      {/* Hero */}
      <section className="container-x pt-[calc(var(--header-h)+1.5rem)]">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-end rounded-xl bg-[#0f141c] p-8 text-white md:p-12 lg:col-span-5">
            <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10"><GraduationCap className="h-5 w-5" /></span>
            <p className="anim-blur-in text-label text-white/60">{d.nav.education}</p>
            <h1 className="anim-blur-in mt-3 font-display text-h1 text-balance" style={{ animationDelay: "80ms" }}>{d.home.educationTitle}</h1>
            <p className="anim-blur-in mt-4 max-w-md text-body-lg text-white/70" style={{ animationDelay: "160ms" }}>{d.home.educationDesc}</p>
            <div className="anim-fade-up mt-8 flex flex-wrap gap-6 text-caption text-white/60 tabular" style={{ animationDelay: "240ms" }}>
              <span><strong className="block font-display text-h3 text-white">{n(courses.length)}</strong>{d.common.course}</span>
              <span><strong className="block font-display text-h3 text-white">{n(tutorials.length)}</strong>{d.common.tutorial}</span>
              <span><strong className="block font-display text-h3 text-white">{n(paths.length)}</strong>{d.common.path}</span>
            </div>
          </div>
          {lead && (
            <Link href={href(locale, `/academy/${lead.slug}`)} className="group relative min-h-[360px] overflow-hidden rounded-xl lg:col-span-7">
              <Image src={lead.image} alt={t(lead.title, locale)} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="img-zoom object-cover" />
              <div className="absolute inset-0 vignette" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <p className="text-label text-white/70">{d.common.featured} · {d.common[lead.type]}</p>
                <h2 className="mt-2 max-w-xl font-display text-h1 text-balance">{t(lead.title, locale)}</h2>
                <p className="mt-2 max-w-lg text-body-sm text-white/75">{t(lead.excerpt, locale)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium border-b border-white/50 pb-0.5 group-hover:border-white">{d.nav.explore}<ArrowUpRight className="h-4 w-4 rtl-flip arrow-shift" /></span>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Featured courses */}
      <section className="container-x section-y">
        <SectionHeader eyebrow={d.common.course} title={locale === "fa" ? "دوره‌های منتخب" : "Featured courses"} />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{courses.map((e, i) => <Reveal key={e.id} delay={i * 70}><EducationCard item={e} variant="large" progress={i === 0 ? 35 : undefined} /></Reveal>)}</div>
      </section>

      {/* Learning paths */}
      {paths.length > 0 && (
        <section className="bg-background-secondary"><div className="container-x section-y">
          <SectionHeader eyebrow={d.common.path} title={locale === "fa" ? "مسیرهای یادگیری" : "Learning paths"} description={locale === "fa" ? "برنامه‌ی مرحله‌به‌مرحله برای رسیدن به سطح حرفه‌ای." : "Step-by-step programmes toward professional level."} />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {paths.map((p) => (
              <Reveal key={p.id}>
                <Link href={href(locale, `/academy/${p.slug}`)} className="group grid gap-0 overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-medium sm:grid-cols-5">
                  <div className="relative aspect-[4/3] sm:col-span-2 sm:aspect-auto"><Image src={p.image} alt="" fill sizes="40vw" className="img-zoom object-cover" /></div>
                  <div className="p-6 sm:col-span-3">
                    <p className="text-caption text-accent">{d.common.path}</p>
                    <h3 className="mt-1 font-display text-h3">{t(p.title, locale)}</h3>
                    <p className="mt-2 text-body-sm text-foreground-secondary">{t(p.excerpt, locale)}</p>
                    <ol className="mt-4 flex gap-2">{[1, 2, 3, 4].map((s) => <li key={s} className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-caption tabular group-hover:border-foreground transition-colors">{n(s)}</li>)}</ol>
                    <p className="mt-4 text-caption text-muted tabular">{n(p.lessons)} {d.common.lessons}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div></section>
      )}

      {/* Tutorials + articles + popular */}
      <section className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionHeader eyebrow={d.common.tutorial} title={locale === "fa" ? "آموزش‌های منتخب" : "Featured tutorials"} />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">{tutorials.map((e, i) => <Reveal key={e.id} delay={i * 70}><EducationCard item={e} /></Reveal>)}</div>
            <div className="mt-14">
              <SectionHeader eyebrow={d.common.article} title={locale === "fa" ? "تازه‌ترین مقالات" : "Latest articles"} />
              <div className="mt-4">{articles.map((e) => <EducationCard key={e.id} item={e} variant="row" />)}</div>
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-border p-5 lg:sticky lg:top-[calc(var(--header-h-compact)+1.5rem)]">
              <p className="text-label text-muted">{locale === "fa" ? "محبوب‌ترین‌ها" : "Popular"}</p>
              <div className="mt-2">{popular.slice(0, 5).map((e) => <EducationCard key={e.id} item={e} variant="row" />)}</div>
              <p className="mt-8 text-label text-muted">{d.nav.categories}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">{cats.map((c) => <StyleCard key={c.id} href={href(locale, `/academy?category=${c.slug}`)} title={t(c.name, locale)} image={c.image} className="aspect-[4/3]" />)}</div>
              <Button href={href(locale, "/creators/join")} variant="outline" className="mt-6 w-full">{d.nav.becomeCreator}</Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
