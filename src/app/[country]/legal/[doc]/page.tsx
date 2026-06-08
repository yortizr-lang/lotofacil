import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PAISES } from '@/config/loterias';
import { LEGAL, LEGAL_DOCS, type LegalSlug } from '@/config/legal';

export const revalidate = 3600;

export function generateStaticParams() {
  const params: { country: string; doc: string }[] = [];
  for (const country of routing.locales) {
    for (const doc of LEGAL_DOCS) {
      params.push({ country, doc });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; doc: string }>;
}): Promise<Metadata> {
  const { country, doc } = await params;
  const idioma = PAISES[country]?.idioma ?? 'es';
  const d = LEGAL[idioma]?.[doc as LegalSlug];
  return { title: d ? `${d.titulo} — Lotofácil` : 'Lotofácil', robots: { index: false, follow: false } };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ country: string; doc: string }>;
}) {
  const { country, doc } = await params;
  const p = PAISES[country];
  if (!p || !LEGAL_DOCS.includes(doc as LegalSlug)) notFound();

  setRequestLocale(country);
  const d = LEGAL[p.idioma][doc as LegalSlug];

  return (
    <div className="page legal-page">
      <div className="crumbs">
        <Link href={`/${country}`}>
          {p.flag} {p.nombre}
        </Link>{' '}
        &nbsp;/&nbsp; {d.titulo}
      </div>
      <h1 className="legal-title">{d.titulo}</h1>
      {d.parrafos.map((parrafo, i) => (
        <p key={i} className="legal-p">
          {parrafo}
        </p>
      ))}
      <footer>Lotofácil</footer>
    </div>
  );
}
