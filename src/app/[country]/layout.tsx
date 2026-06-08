import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { PAISES } from '@/config/loterias';
import Sidebar from '@/components/Sidebar';
import CookieBanner from '@/components/CookieBanner';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((country) => ({ country }));
}

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;

  if (!routing.locales.includes(country as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(country);
  const messages = await getMessages();
  const idioma = PAISES[country]?.idioma ?? 'es';

  return (
    <html lang={idioma}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="app">
            <Sidebar />
            <main className="main">{children}</main>
          </div>
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
