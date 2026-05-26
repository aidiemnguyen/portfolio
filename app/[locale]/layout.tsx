import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { VoiceAssistant } from "@/components/VoiceAssistant/VoiceAssistant";
import { locales, isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import "../globals.scss";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }
  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);
  const cookieStore = await cookies();
  const theme =
    cookieStore.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-era="0"
      data-theme={theme}
    >
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider locale={locale} dictionary={dictionary}>
            {children}
            <VoiceAssistant />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
