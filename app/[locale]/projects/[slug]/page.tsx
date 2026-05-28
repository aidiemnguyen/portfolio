import { Navbar } from "@/components/Navbar/Navbar";
import { ProjectPage } from "@/components/ProjectPage/ProjectPage";
import { locales, isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getEraBySlug } from "@/lib/get-era";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const dictionary = await getDictionary(locale);
    for (const era of dictionary.eras) {
      params.push({ locale, slug: era.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const result = await getEraBySlug(locale, slug);

  if (!result) {
    return {};
  }

  return {
    title: `${result.era.project} — AI Diem`,
    description: result.era.description,
  };
}

export default async function ProjectRoute({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const result = await getEraBySlug(locale, slug);

  if (!result) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <>
      <main>
        <Navbar />
        <ProjectPage
          era={result.era}
          locale={result.locale}
          chapter={dictionary.chapter}
        />
      </main>
    </>
  );
}
