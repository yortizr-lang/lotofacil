import { getTranslations } from 'next-intl/server';

/** Avisos legales en versión discreta, pensados para ir al pie de página. */
export default async function Disclaimer() {
  const t = await getTranslations('disclaimer');
  return (
    <aside className="legal">
      <p className="legal-note">{t('independiente')}</p>
      <p className="legal-resp">
        <b>{t('juegoResponsableTitulo')}.</b> {t('juegoResponsable')}
      </p>
    </aside>
  );
}
