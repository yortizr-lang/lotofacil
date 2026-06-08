import { getTranslations } from 'next-intl/server';
import type { Stats } from '@/types/stats';

function mix(a: number[], b: number[], t: number): string {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',');
}

export default async function Heatmap({ stats }: { stats: Stats }) {
  const t = await getTranslations('stats');
  const valores = Object.values(stats.frecuencias);
  if (!valores.length) return null;
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const total = stats.rango[1];

  return (
    <div className="card">
      <h3>{t('mapaCalor')}</h3>
      <div className="meta">{t('mapaCalorDesc')}</div>
      <div className="heat">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const c = stats.frecuencias[String(n)] ?? 0;
          const tt = (c - min) / (max - min || 1);
          const col =
            tt < 0.5
              ? mix([58, 180, 255], [255, 194, 61], tt * 2)
              : mix([255, 194, 61], [255, 93, 143], (tt - 0.5) * 2);
          return (
            <div key={n} className="cell" title={`${n}: ${c}×`} style={{ background: `rgb(${col})` }}>
              {n}
            </div>
          );
        })}
      </div>
      <div className="legend">
        <span>{t('leyendaMenos')}</span>
        <span className="scale" />
        <span>{t('leyendaMas')}</span>
      </div>
    </div>
  );
}
