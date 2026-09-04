import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";

const docs = ["privacy", "terms", "licenses"] as const;
type Doc = (typeof docs)[number];
type Props = { params: Promise<{ locale: Locale; doc: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, doc } = await params;
  const d = dictionaries[locale];
  return { title: d.footer[doc as Doc] ?? d.footer.legal, alternates: { canonical: canonical(locale, `/legal/${doc}`) } };
}
export default async function LegalPage({ params }: Props) {
  const { locale, doc } = await params;
  if (!docs.includes(doc as Doc)) notFound();
  const d = dictionaries[locale];
  const fa = locale === "fa";
  const body: Record<Doc, string[]> = {
    privacy: fa ? ["ما فقط داده‌هایی را جمع‌آوری می‌کنیم که برای ارائه‌ی سرویس لازم است: ایمیل، سفارش‌ها و علاقه‌مندی‌ها.", "داده‌ها به هیچ شخص ثالثی فروخته نمی‌شود."] : ["We only collect data needed to provide the service: email, orders and favourites.", "Data is never sold to third parties."],
    terms: fa ? ["استفاده از رزی آتلیه به معنای پذیرش این شرایط است.", "هر الگو تحت لایسنس مشخص خود عرضه می‌شود."] : ["Using Rosie Atelier means accepting these terms.", "Each pattern is offered under its specific license."],
    licenses: fa ? ["لایسنس شخصی: استفاده در فضای شخصی، بدون فروش.", "لایسنس تجاری: چاپ و فروش تا ۵۰۰ واحد یا یک پروژه.", "لایسنس گسترده: نامحدود، شامل برندینگ."] : ["Personal: use in your own space, no resale.", "Commercial: print and sell up to 500 units or one project.", "Extended: unlimited, including branding."],
  };
  return (
    <>
      <PageHero eyebrow={d.footer.legal} title={d.footer[doc as Doc]} />
      <div className="container-x prose-ra pb-20">{body[doc as Doc].map((p) => <p key={p}>{p}</p>)}</div>
    </>
  );
}
