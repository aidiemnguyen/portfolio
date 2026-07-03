import { ResumeViewer } from "@/components/Resume/ResumeViewer";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ print?: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.resume.pageTitle,
    robots: { index: false, follow: false },
  };
}

export default async function ResumePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { print } = await searchParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <ResumeViewer
      locale={locale}
      dictionary={dictionary}
      autoPrint={print === "1"}
    />
  );
}
