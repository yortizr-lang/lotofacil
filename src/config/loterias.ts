/**
 * Catálogo de países y loterías.
 * `nombreBD` es el valor exacto del campo `nombre` en la tabla `loterias`
 * y el campo `nombre` de la tabla `loterias` en MySQL (lo usan las consultas).
 */

export interface LoteriaConfig {
  slug: string;
  nombreBD: string;
  titulo: string;
  balotas: number;
  rango: number;
  descripcion: string;
  extra?: { rango: number; nombre: string };
}

export interface PaisConfig {
  codigo: string;
  nombre: string;
  flag: string;
  idioma: 'es' | 'en';
  loterias: string[];
}

export const PAISES: Record<string, PaisConfig> = {
  co: { codigo: 'co', nombre: 'Colombia', flag: '🇨🇴', idioma: 'es', loterias: ['baloto', 'baloto-revancha', 'miloto'] },
  mx: { codigo: 'mx', nombre: 'México', flag: '🇲🇽', idioma: 'es', loterias: ['melate'] },
  es: { codigo: 'es', nombre: 'España', flag: '🇪🇸', idioma: 'es', loterias: ['primitiva'] },
  us: { codigo: 'us', nombre: 'Estados Unidos', flag: '🇺🇸', idioma: 'en', loterias: ['powerball', 'mega-millions'] },
};

export const LOTERIAS: Record<string, LoteriaConfig> = {
  'baloto':          { slug: 'baloto',          nombreBD: 'Baloto',          titulo: 'Baloto',          balotas: 5, rango: 43, extra: { rango: 16, nombre: 'Súper balota' },
    descripcion: 'El Baloto es la lotería nacional de Colombia. Se eligen 5 números del 1 al 43 más una Súper Balota del 1 al 16, con sorteos los miércoles y sábados.' },
  'baloto-revancha': { slug: 'baloto-revancha', nombreBD: 'Baloto Revancha', titulo: 'Baloto Revancha', balotas: 5, rango: 43,
    descripcion: 'Revancha es el sorteo adicional del Baloto: con el mismo tiquete se juega una segunda combinación de 5 números del 1 al 43.' },
  'miloto':          { slug: 'miloto',          nombreBD: 'MiLoto',          titulo: 'MiLoto',          balotas: 5, rango: 39,
    descripcion: 'MiLoto es una lotería diaria de Colombia. Se eligen 5 números del 1 al 39, con sorteos de lunes a sábado.' },
  'melate':          { slug: 'melate',          nombreBD: 'Melate',          titulo: 'Melate',          balotas: 6, rango: 56,
    descripcion: 'Melate es una de las loterías más populares de México. Se seleccionan 6 números del 1 al 56, con sorteos los miércoles, viernes y domingos.' },
  'primitiva':       { slug: 'primitiva',       nombreBD: 'La Primitiva',    titulo: 'La Primitiva',    balotas: 6, rango: 49,
    descripcion: 'La Primitiva es una lotería tradicional de España. Se eligen 6 números del 1 al 49, además del complementario y el reintegro.' },
  'powerball':       { slug: 'powerball',       nombreBD: 'Powerball',       titulo: 'Powerball',       balotas: 5, rango: 69, extra: { rango: 26, nombre: 'Powerball' },
    descripcion: 'Powerball is one of the largest U.S. lotteries. Players pick 5 numbers from 1 to 69 plus a Powerball from 1 to 26, with draws three times a week.' },
  'mega-millions':   { slug: 'mega-millions',   nombreBD: 'Mega Millions',   titulo: 'Mega Millions',   balotas: 5, rango: 70, extra: { rango: 25, nombre: 'Mega Ball' },
    descripcion: 'Mega Millions is a major U.S. lottery. Players pick 5 numbers from 1 to 70 plus a Mega Ball from 1 to 25, with draws twice a week.' },
};

export function loteriasDePais(pais: string): LoteriaConfig[] {
  return (PAISES[pais]?.loterias ?? []).map((s) => LOTERIAS[s]).filter(Boolean);
}

export function paisTieneLoteria(pais: string, slug: string): boolean {
  return PAISES[pais]?.loterias.includes(slug) ?? false;
}
