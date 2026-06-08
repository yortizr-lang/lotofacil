'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Stats } from '@/types/stats';

/** Hash determinista FNV-1a: misma fecha -> mismos números. */
function hashFecha(fecha: string): number {
  let h = 2166136261;
  for (let i = 0; i < fecha.length; i++) {
    h ^= fecha.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function numerosDesdeFecha(fecha: string, cantidad: number, rango: number): number[] {
  let seed = hashFecha(fecha) || 1;
  const out: number[] = [];
  let guard = 0;
  while (out.length < cantidad && guard++ < 1000) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const n = 1 + (seed % rango);
    if (!out.includes(n)) out.push(n);
  }
  return out.sort((a, b) => a - b);
}

export default function GeneradorFecha({ stats }: { stats: Stats }) {
  const t = useTranslations('genFecha');
  const td = useTranslations('disclaimer');
  const [fecha, setFecha] = useState('');
  const [nums, setNums] = useState<number[] | null>(null);
  const [extra, setExtra] = useState<number | null>(null);

  function generar() {
    if (!fecha) return;
    const principales = numerosDesdeFecha(fecha, stats.cantidad || 5, stats.rango[1]);
    setNums(principales);
    setExtra(stats.extra ? 1 + (hashFecha(fecha + '#x') % stats.extra.rango[1]) : null);
  }

  return (
    <div className="console gen-card">
      <div className="gen-card-head">
        <h4>🎂 {t('titulo')}</h4>
        <p className="gen-sub">{t('sub')}</p>
      </div>

      <div className="display">
        <label className="fecha-label">
          {t('label')}
          <input
            type="date"
            className="fecha-input"
            value={fecha}
            max="2025-12-31"
            onChange={(e) => setFecha(e.target.value)}
          />
        </label>
        <div className="balotas" style={{ marginTop: 20 }}>
          {!nums && <span className="placeholder">{t('placeholder')}</span>}
          {nums?.map((n, i) => (
            <div key={i} className={`balota t${i % 6}`} style={{ animationDelay: `${i * 100}ms` }}>
              {n}
            </div>
          ))}
          {extra != null && (
            <div className="balota extra" style={{ animationDelay: `${(nums?.length ?? 0) * 100}ms` }}>
              {extra}
            </div>
          )}
        </div>
      </div>

      <div className="actions">
        <button className="btn" onClick={generar} disabled={!fecha}>
          {t('generar')}
        </button>
      </div>
      <p className="nota-compacta">{td('compacto')}</p>
    </div>
  );
}
