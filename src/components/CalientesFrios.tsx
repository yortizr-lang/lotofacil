import { getTranslations } from 'next-intl/server';
import type { Stats } from '@/types/stats';

/** Consulta de números calientes y fríos (informativo, para el jugador). */
export default async function CalientesFrios({ stats }: { stats: Stats }) {
  const t = await getTranslations('stats');

  return (
    <div className="cf-grid">
      <div className="card cf-card">
        <h3>🔥 {t('calientesTitulo')}</h3>
        <p className="meta">{t('calientesDesc')}</p>
        <div className="cf-balls">
          {stats.calientes.slice(0, 6).map((r) => (
            <div className="cf-ball" key={r.numero}>
              <span className="balota sm hotball">{r.numero}</span>
              <small>{t('veces', { n: r.veces })}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="card cf-card">
        <h3>❄️ {t('friosTitulo')}</h3>
        <p className="meta">{t('friosDesc')}</p>
        <div className="cf-balls">
          {stats.frios.slice(0, 6).map((r) => (
            <div className="cf-ball" key={r.numero}>
              <span className="balota sm coolball">{r.numero}</span>
              <small>{t('dias', { n: r.dias })}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
