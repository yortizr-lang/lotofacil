/** Un sorteo individual. */
export interface Sorteo {
  numero_sorteo: string;
  fecha: string;
  principales: number[];
  extra: number | null;
}

/** Estadísticas de una lotería (calientes/fríos/frecuencias/últimos). */
export interface Stats {
  nombre: string;
  rango: [number, number];
  cantidad: number;
  extra: { rango: [number, number]; nombre: string } | null;
  frecuencias: Record<string, number>;
  calientes: { numero: number; veces: number }[];
  frios: { numero: number; ultima: string; dias: number }[];
  sorteos: Sorteo[];
  avanzado: { pares: number; impares: number; suma_media: number };
  aviso?: string;
}

/** Página del histórico de resultados (paginado). */
export interface PaginaResultados {
  items: Sorteo[];
  total: number;
  page: number;
  per_page: number;
}
