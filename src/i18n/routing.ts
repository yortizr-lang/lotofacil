import { defineRouting } from 'next-intl/routing';

/**
 * En Lotofácil el "locale" de next-intl ES el código de país.
 * Esto produce URLs por subcarpeta de país (/co/baloto, /mx/melate)
 * para concentrar autoridad SEO y geolocalizar, mientras el idioma
 * de los textos se deriva del país en `request.ts`.
 */
export const routing = defineRouting({
  locales: ['co', 'mx', 'es', 'us'],
  defaultLocale: 'co',
  localePrefix: 'always',
});

export type Pais = (typeof routing.locales)[number];
