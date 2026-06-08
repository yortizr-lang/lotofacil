'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PaginaResultados } from '@/types/stats';

export default function ArchivoHistorico({
  loteria,
  inicial,
}: {
  loteria: string;
  inicial: PaginaResultados;
}) {
  const t = useTranslations('archivo');
  const [data, setData] = useState<PaginaResultados>(inicial);
  const [cargando, setCargando] = useState(false);

  const totalPaginas = Math.max(1, Math.ceil(data.total / data.per_page));

  async function irA(page: number) {
    if (page < 1 || page > totalPaginas || cargando) return;
    setCargando(true);
    try {
      const res = await fetch(`/api/resultados?loteria=${loteria}&page=${page}&per_page=${data.per_page}`);
      if (res.ok) setData(await res.json());
    } catch {
      /* mantener página actual ante error */
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="card">
      <div className="meta">{t('subtitulo', { total: data.total })}</div>

      <div className={cargando ? 'arch-list cargando' : 'arch-list'}>
        {data.items.map((s) => (
          <div className="arch-row" key={s.numero_sorteo}>
            <div className="arch-left">
              <div className="n">#{s.numero_sorteo}</div>
              <div className="d">{s.fecha}</div>
            </div>
            <div className="arch-balls">
              {s.principales.map((n, i) => (
                <span key={i}>{n}</span>
              ))}
              {s.extra != null && <span className="x">{s.extra}</span>}
            </div>
          </div>
        ))}
        {data.items.length === 0 && <p className="placeholder">{t('vacio')}</p>}
      </div>

      <div className="pager">
        <button className="pg-btn" onClick={() => irA(data.page - 1)} disabled={data.page <= 1 || cargando}>
          ← {t('anterior')}
        </button>
        <span className="pg-info">
          {cargando ? t('cargando') : t('pagina', { page: data.page, total: totalPaginas })}
        </span>
        <button
          className="pg-btn"
          onClick={() => irA(data.page + 1)}
          disabled={data.page >= totalPaginas || cargando}
        >
          {t('siguiente')} →
        </button>
      </div>
    </div>
  );
}
