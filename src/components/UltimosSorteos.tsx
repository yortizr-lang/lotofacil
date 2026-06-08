import { getTranslations } from 'next-intl/server';
import type { Stats } from '@/types/stats';

/** Estadística avanzada en tira de 3 métricas. */
export async function Avanzado({ stats }: { stats: Stats }) {
  const t = await getTranslations('stats');
  return (
    <div className="stats-strip">
      <div className="stat-card">
        <div className="v">{stats.avanzado.pares}</div>
        <div className="k">{t('pares')}</div>
      </div>
      <div className="stat-card">
        <div className="v">{stats.avanzado.impares}</div>
        <div className="k">{t('impares')}</div>
      </div>
      <div className="stat-card">
        <div className="v">{stats.avanzado.suma_media}</div>
        <div className="k">{t('sumaMedia')}</div>
      </div>
    </div>
  );
}
