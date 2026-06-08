import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PAISES, LOTERIAS, paisTieneLoteria } from '@/config/loterias';
import { routing } from '@/i18n/routing';
import { getEstadisticas, getResultados, PER_PAGE } from '@/lib/api';
import Predictor from '@/components/Predictor';
import GeneradorFecha from '@/components/GeneradorFecha';
import Heatmap from '@/components/Heatmap';
import { Avanzado } from '@/components/UltimosSorteos';
import ArchivoHistorico from '@/components/ArchivoHistorico';
import CalientesFrios from '@/components/CalientesFrios';
import Disclaimer from '@/components/Disclaimer';

export const revalidate = 3600;

export function generateStaticParams() {
  const params: { country: string; loteria: string }[] = [];
  for (const country of routing.locales) {
    for (const slug of PAISES[country]?.loterias ?? []) {
      params.push({ country, loteria: slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; loteria: string }>;
}): Promise<Metadata> {
  const { country, loteria } = await params;
  const l = LOTERIAS[loteria];
  const p = PAISES[country];
  const title = l && p ? `${l.titulo} ${p.nombre} — Resultados y Estadísticas` : 'Lotofácil';
  return { title, description: l?.descripcion, robots: { index: false, follow: false } };
}

export default async function LoteriaPage({
  params,
}: {
  params: Promise<{ country: string; loteria: string }>;
}) {
  const { country, loteria } = await params;

  if (!PAISES[country] || !paisTieneLoteria(country, loteria)) notFound();
  setRequestLocale(country);

  const stats = await getEstadisticas(loteria);
  if (!stats) notFound();

  const historico = await getResultados(loteria, 1, PER_PAGE);

  const l = LOTERIAS[loteria];
  const p = PAISES[country];
  const ts = await getTranslations('site');
  const tl = await getTranslations('loteria');
  const tst = await getTranslations('stats');
  const tx = await getTranslations('extras');

  const ultimo = stats.sorteos[0];

  return (
    <div className="page">
      <div className="crumbs">
        <Link href={`/${country}`}>
          {p.flag} {p.nombre}
        </Link>{' '}
        &nbsp;/&nbsp; {l.titulo}
      </div>

      {/* PROTAGONISTA: resultado más reciente */}
      {ultimo && (
        <section className="results-hero">
          <p className="rh-label">{tst('ultimoResultado')}</p>
          <h1 className="rh-title">{l.titulo}</h1>
          <p className="rh-meta">
            {tst('sorteoNum', { n: ultimo.numero_sorteo })} · {ultimo.fecha} · {p.nombre}
          </p>
          <div className="balotas">
            {ultimo.principales.map((n, i) => (
              <div className={`balota big t${i % 6}`} key={i} style={{ animationDelay: `${i * 90}ms` }}>
                {n}
              </div>
            ))}
            {ultimo.extra != null && (
              <div className="balota big extra" style={{ animationDelay: `${ultimo.principales.length * 90}ms` }}>
                {ultimo.extra}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Descripción breve de la lotería */}
      <div className="loteria-desc">
        <h2 className="ld-title">{tl('acercaDe', { loteria: l.titulo })}</h2>
        <p>{l.descripcion}</p>
      </div>

      {/* Archivo histórico paginado (atractivo principal) */}
      <div className="section-title">📋 {tst('ultimosSorteos')}</div>
      {historico && <ArchivoHistorico loteria={loteria} inicial={historico} />}

      {/* Consulta de números calientes y fríos */}
      <div className="section-title">🔥❄️ {tst('consultaTitulo')}</div>
      <CalientesFrios stats={stats} />

      {/* Estadística de apoyo */}
      <Avanzado stats={stats} />
      <div className="block-gap">
        <Heatmap stats={stats} />
      </div>

      {/* EXTRA: generadores (secundario, solo diversión) */}
      <div className="section-title">🎲 {tx('titulo')}</div>
      <div className="gen-grid">
        <Predictor stats={stats} />
        <GeneradorFecha stats={stats} />
      </div>

      <Disclaimer />

      <footer>
        {ts('nombre')} · {tl('resultadosY')} {l.titulo} ({p.nombre}). {stats.aviso ?? ''}
      </footer>
    </div>
  );
}
