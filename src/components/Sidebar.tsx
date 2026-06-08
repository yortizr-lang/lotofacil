'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PAISES, loteriasDePais } from '@/config/loterias';

export default function Sidebar() {
  const t = useTranslations('nav');
  const path = usePathname();
  const seg = path.split('/').filter(Boolean);
  const paisActual = seg[0] ?? 'co';
  const loteriaActual = seg[1];

  return (
    <aside className="sidebar">
      <Link href={`/${paisActual}`} className="side-brand">
        <span className="orb">L</span>
        <span className="side-brand-txt">
          <b>Lotofácil</b>
          <small>{t('tagline')}</small>
        </span>
      </Link>

      <div className="side-heading">{t('paises')}</div>
      <nav className="side-nav">
        {Object.values(PAISES).map((p) => {
          const activo = p.codigo === paisActual;
          return (
            <div key={p.codigo} className={`side-pais ${activo ? 'active' : ''}`}>
              <Link href={`/${p.codigo}`} className="side-pais-link">
                <span className="flag">{p.flag}</span>
                {p.nombre}
              </Link>
              {activo && (
                <div className="side-lots">
                  {loteriasDePais(p.codigo).map((l) => (
                    <Link
                      key={l.slug}
                      href={`/${p.codigo}/${l.slug}`}
                      className={`side-lot ${l.slug === loteriaActual ? 'on' : ''}`}
                    >
                      {l.titulo}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="side-legal">
        <div className="side-heading">{t('legales')}</div>
        <Link className="side-lot" href={`/${paisActual}/legal/aviso-legal`}>{t('aviso')}</Link>
        <Link className="side-lot" href={`/${paisActual}/legal/privacidad`}>{t('privacidad')}</Link>
        <Link className="side-lot" href={`/${paisActual}/legal/cookies`}>{t('cookies')}</Link>
        <Link className="side-lot" href={`/${paisActual}/legal/contacto`}>{t('contacto')}</Link>
      </div>
    </aside>
  );
}
