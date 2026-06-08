import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/** Idioma de los textos según el país (subcarpeta). */
const IDIOMA_POR_PAIS: Record<string, 'es' | 'en'> = {
  co: 'es',
  mx: 'es',
  es: 'es',
  us: 'en',
};

export default getRequestConfig(async ({ requestLocale }) => {
  // En Next 15 el locale llega como promesa.
  let pais = await requestLocale;

  if (!pais || !routing.locales.includes(pais as (typeof routing.locales)[number])) {
    pais = routing.defaultLocale;
  }

  const idioma = IDIOMA_POR_PAIS[pais] ?? 'es';

  return {
    locale: pais,
    messages: (await import(`../../messages/${idioma}.json`)).default,
  };
});
