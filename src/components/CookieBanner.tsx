'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CookieBanner() {
  const t = useTranslations('cookies');
  const path = usePathname();
  const pais = path.split('/').filter(Boolean)[0] ?? 'co';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('lotofacil_consent')) setVisible(true);
    } catch {
      /* almacenamiento no disponible: no mostramos el banner */
    }
  }, []);

  function decidir(valor: 'aceptado' | 'rechazado') {
    try {
      localStorage.setItem('lotofacil_consent', valor);
    } catch {
      /* ignore */
    }
    setVisible(false);
    // Aquí podría dispararse Google Consent Mode v2 según `valor`.
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite">
      <p>
        {t('banner')}{' '}
        <Link href={`/${pais}/legal/cookies`}>{t('masInfo')}</Link>
      </p>
      <div className="cookie-actions">
        <button className="ck-btn ghost" onClick={() => decidir('rechazado')}>
          {t('rechazar')}
        </button>
        <button className="ck-btn" onClick={() => decidir('aceptado')}>
          {t('aceptar')}
        </button>
      </div>
    </div>
  );
}
