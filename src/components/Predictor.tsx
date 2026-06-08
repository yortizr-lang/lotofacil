'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Stats } from '@/types/stats';

function muestreoPonderado(
  frecuencias: Record<string, number>,
  cantidad: number,
  invertir: boolean
): number[] {
  const items = Object.entries(frecuencias).map(([n, c]) => ({
    n: +n,
    w: invertir ? 1 / (c + 1) : c,
  }));
  const elegidos: number[] = [];
  for (let k = 0; k < cantidad && items.length; k++) {
    const total = items.reduce((s, it) => s + it.w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      r -= items[i].w;
      if (r <= 0) {
        elegidos.push(items[i].n);
        items.splice(i, 1);
        break;
      }
    }
  }
  return elegidos.sort((a, b) => a - b);
}

export default function Predictor({ stats }: { stats: Stats }) {
  const t = useTranslations('predictor');
  const td = useTranslations('disclaimer');
  const [modo, setModo] = useState<'calientes' | 'frios'>('calientes');
  const [balotas, setBalotas] = useState<number[] | null>(null);
  const [extra, setExtra] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  async function generar() {
    setCargando(true);
    setBalotas(null);
    setExtra(null);
    await new Promise((r) => setTimeout(r, 700));
    const nums = muestreoPonderado(stats.frecuencias, stats.cantidad || 5, modo === 'frios');
    setBalotas(nums);
    if (stats.extra) setExtra(1 + Math.floor(Math.random() * stats.extra.rango[1]));
    setCargando(false);
  }

  return (
    <div className="console gen-card">
      <div className="gen-card-head">
        <h4>🎰 {t('tituloCard')}</h4>
        <p className="gen-sub">{t('subCard')}</p>
      </div>

      <div className="console-top">
        <div className="ctrl">
          <label>{t('criterio')}</label>
          <div className="seg">
            <button
              data-mode="calientes"
              className={modo === 'calientes' ? 'on' : ''}
              onClick={() => setModo('calientes')}
            >
              <span className="dot" />
              {t('calientes')}
            </button>
            <button
              data-mode="frios"
              className={modo === 'frios' ? 'on' : ''}
              onClick={() => setModo('frios')}
            >
              <span className="dot" />
              {t('frios')}
            </button>
          </div>
        </div>
      </div>

      <div className="display">
        <p className="hint">{modo === 'calientes' ? t('hintCalientes') : t('hintFrios')}</p>
        <div className="balotas">
          {cargando && <span className="placeholder">{t('mezclandoBalotas')}</span>}
          {!cargando && !balotas && <span className="placeholder">{t('placeholder')}</span>}
          {!cargando &&
            balotas?.map((n, i) => (
              <div key={i} className={`balota t${i % 6}`} style={{ animationDelay: `${i * 100}ms` }}>
                {n}
              </div>
            ))}
          {!cargando && extra != null && (
            <div className="balota extra" style={{ animationDelay: `${(balotas?.length ?? 0) * 100}ms` }}>
              {extra}
            </div>
          )}
        </div>
        {!cargando && extra != null && stats.extra && (
          <p className="extra-label">{stats.extra.nombre}</p>
        )}
      </div>

      <div className="actions">
        <button className="btn" onClick={generar} disabled={cargando}>
          {cargando ? t('mezclando') : balotas ? t('generarDeNuevo') : t('generar')}
        </button>
      </div>
      <p className="nota-compacta">{td('compacto')}</p>
    </div>
  );
}
