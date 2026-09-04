import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { dictionaries } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/types";
import { canonical } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: dictionaries[locale].nav.contact, alternates: { canonical: canonical(locale, "/contact") } };
}
export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const d = dictionaries[locale];
  const fa = locale === "fa";
  return (
    <>
      <PageHero eyebrow={d.nav.contact} title={d.footer.contactTitle} description={fa ? "برای همکاری، سفارش یا هر پرسشی، پیام بگذارید." : "For collaboration, orders or any question — leave a message."} />
      <section className="container-x grid gap-10 pb-20 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          {[[MapPin, fa ? "تهران، خیابان ولیعصر" : "Valiasr St., Tehran"], [Phone, "+98 21 8800 0000"], [Mail, "hello@rosieatelier.com"]].map(([Icon, v], i) => {
            const I = Icon as typeof MapPin;
            return <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm"><I className="h-4 w-4 text-accent" /><span dir={i ? "ltr" : undefined}>{v as string}</span></div>;
          })}
        </div>
        <div className="lg:col-span-8"><InquiryForm kind="contact" /></div>
      </section>
    </>
  );
}
