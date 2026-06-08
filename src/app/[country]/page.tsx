import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PAISES, loteriasDePais } from '@/config/loterias';
import { routing } from '@/i18n/routing';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((country) => ({ country }));
}

export default async function PaisHome({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const pais = PAISES[country];
  if (!pais) notFound();

  setRequestLocale(country);
  const t = await getTranslations('home');
  const ts = await getTranslations('site');
  const loterias = loteriasDePais(country);

  return (
    <div className="page">
      <header className="home-head">
        <h1 className="home-title">
          {pais.flag} {t('titulo', { pais: pais.nombre })}
        </h1>
        <p className="home-intro">{t('intro')}</p>
      </header>

      <div className="loteria-grid">
        {loterias.map((l, i) => (
          <Link
            key={l.slug}
            href={`/${country}/${l.slug}`}
            className="loteria-card"
            style={{ animationDelay: `${0.08 + i * 0.06}s` }}
          >
            <h2>{l.titulo}</h2>
            <p className="lp">
              {l.balotas} números · 1–{l.rango}
              {l.extra ? ` + ${l.extra.nombre}` : ''}
            </p>
            <span className="arrow">{t('verEstadisticas')} →</span>
          </Link>
        ))}
      </div>

      <footer>{ts('nombre')} — {ts('tagline')}</footer>
    </div>
  );
}
