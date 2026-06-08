import type { RowDataPacket } from 'mysql2';
import type { Stats, Sorteo, PaginaResultados } from '@/types/stats';
import { LOTERIAS } from '@/config/loterias';
import { getPool } from '@/lib/db';

export const PER_PAGE = 20;
const DEMO_TOTAL = 124;

/* ============================ DEMO ============================ */

function genFrecuencias(max: number, base: number): Record<string, number> {
  const o: Record<string, number> = {};
  let s = max * 7 + 3;
  for (let n = 1; n <= max; n++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    o[String(n)] = base + (s % 55);
  }
  return o;
}

function mkSorteoDemo(slug: string, idx: number): Sorteo {
  const l = LOTERIAS[slug];
  const principales: number[] = [];
  let seed = (idx + 3) * 97 + l.rango;
  while (principales.length < l.balotas) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const num = 1 + (seed % l.rango);
    if (!principales.includes(num)) principales.push(num);
  }
  principales.sort((a, b) => a - b);
  const d = new Date(2026, 4, 31 - idx * 3);
  return {
    numero_sorteo: String(2587 - idx),
    fecha: d.toISOString().slice(0, 10),
    principales,
    extra: l.extra ? 1 + (((idx + 1) * 7) % l.extra.rango) : null,
  };
}

function demoStats(slug: string): Stats {
  const l = LOTERIAS[slug];
  const frecuencias = genFrecuencias(l.rango, 36);
  const ordenadas = Object.entries(frecuencias)
    .map(([n, c]) => ({ numero: +n, veces: c }))
    .sort((a, b) => b.veces - a.veces);
  const calientes = ordenadas.slice(0, 8);
  const frios = ordenadas
    .slice(-8)
    .reverse()
    .map((x, i) => ({ numero: x.numero, ultima: '2026-04-0' + ((i % 9) + 1), dias: 12 + i * 7 }));
  const pares = Object.entries(frecuencias)
    .filter(([n]) => +n % 2 === 0)
    .reduce((s, [, c]) => s + c, 0);
  const impares = Object.values(frecuencias).reduce((s, c) => s + c, 0) - pares;
  return {
    nombre: l.nombreBD,
    rango: [1, l.rango],
    cantidad: l.balotas,
    extra: l.extra ? { rango: [1, l.extra.rango], nombre: l.extra.nombre } : null,
    frecuencias,
    calientes,
    frios,
    sorteos: Array.from({ length: 5 }, (_, k) => mkSorteoDemo(slug, k)),
    avanzado: {
      pares,
      impares,
      suma_media: Math.round((((l.rango + 1) / 2) * l.balotas) * 10) / 10,
    },
    aviso: 'DEMO: datos simulados. Configura las variables DB_* para datos reales.',
  };
}

function demoResultados(slug: string, page: number, perPage: number): PaginaResultados {
  const start = (page - 1) * perPage;
  const items = Array.from({ length: Math.max(0, Math.min(perPage, DEMO_TOTAL - start)) }, (_, k) =>
    mkSorteoDemo(slug, start + k)
  );
  return { items, total: DEMO_TOTAL, page, per_page: perPage };
}

/* ============================ HELPERS BD ============================ */

type Pool = NonNullable<ReturnType<typeof getPool>>;

async function loteriaId(pool: Pool, nombre: string): Promise<number | null> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM loterias WHERE nombre = ?', [nombre]);
  return rows.length ? Number(rows[0].id) : null;
}

async function detallePorSorteo(
  pool: Pool,
  ids: number[]
): Promise<Record<number, { principales: number[]; extra: number | null }>> {
  if (!ids.length) return {};
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT sorteo_id, numero, tipo_bola FROM resultados_detalle WHERE sorteo_id IN (${placeholders}) ORDER BY numero ASC`,
    ids
  );
  const out: Record<number, { principales: number[]; extra: number | null }> = {};
  for (const r of rows) {
    const sid = Number(r.sorteo_id);
    if (!out[sid]) out[sid] = { principales: [], extra: null };
    if (r.tipo_bola === 'extra') out[sid].extra = Number(r.numero);
    else out[sid].principales.push(Number(r.numero));
  }
  return out;
}

/* ============================ API ============================ */

export async function getEstadisticas(slug: string): Promise<Stats | null> {
  const l = LOTERIAS[slug];
  if (!l) return null;

  const pool = getPool();
  if (!pool) return demoStats(slug);

  try {
    const id = await loteriaId(pool, l.nombreBD);
    if (!id) return demoStats(slug);

    const [frec] = await pool.query<RowDataPacket[]>(
      `SELECT r.numero, COUNT(*) veces
         FROM resultados_detalle r JOIN sorteos s ON r.sorteo_id = s.id
        WHERE s.loteria_id = ? AND r.tipo_bola = 'principal'
        GROUP BY r.numero`,
      [id]
    );
    const frecuencias: Record<string, number> = {};
    for (const r of frec) frecuencias[String(r.numero)] = Number(r.veces);

    const [cal] = await pool.query<RowDataPacket[]>(
      `SELECT r.numero, COUNT(*) veces
         FROM resultados_detalle r JOIN sorteos s ON r.sorteo_id = s.id
        WHERE s.loteria_id = ? AND r.tipo_bola = 'principal'
        GROUP BY r.numero ORDER BY veces DESC, r.numero ASC LIMIT 8`,
      [id]
    );
    const calientes = cal.map((r) => ({ numero: Number(r.numero), veces: Number(r.veces) }));

    const [fri] = await pool.query<RowDataPacket[]>(
      `SELECT r.numero, MAX(s.fecha_sorteo) ultima
         FROM resultados_detalle r JOIN sorteos s ON r.sorteo_id = s.id
        WHERE s.loteria_id = ? AND r.tipo_bola = 'principal'
        GROUP BY r.numero ORDER BY ultima ASC, r.numero ASC LIMIT 8`,
      [id]
    );
    const hoy = Date.now();
    const frios = fri.map((r) => {
      const ultima = String(r.ultima).slice(0, 10);
      return {
        numero: Number(r.numero),
        ultima,
        dias: Math.floor((hoy - new Date(ultima).getTime()) / 86400000),
      };
    });

    const [ult] = await pool.query<RowDataPacket[]>(
      `SELECT id, numero_sorteo, fecha_sorteo FROM sorteos
        WHERE loteria_id = ? ORDER BY fecha_sorteo DESC, id DESC LIMIT 5`,
      [id]
    );
    const det = await detallePorSorteo(pool, ult.map((s) => Number(s.id)));
    const sorteos: Sorteo[] = ult.map((s) => ({
      numero_sorteo: String(s.numero_sorteo),
      fecha: String(s.fecha_sorteo).slice(0, 10),
      principales: det[Number(s.id)]?.principales ?? [],
      extra: det[Number(s.id)]?.extra ?? null,
    }));

    const pares = Object.entries(frecuencias).filter(([n]) => +n % 2 === 0).reduce((s, [, c]) => s + c, 0);
    const impares = Object.values(frecuencias).reduce((s, c) => s + c, 0) - pares;
    const [sm] = await pool.query<RowDataPacket[]>(
      `SELECT ROUND(AVG(suma),1) media FROM (
         SELECT SUM(r.numero) suma FROM resultados_detalle r JOIN sorteos s ON r.sorteo_id = s.id
          WHERE s.loteria_id = ? AND r.tipo_bola = 'principal' GROUP BY r.sorteo_id) t`,
      [id]
    );

    return {
      nombre: l.nombreBD,
      rango: [1, l.rango],
      cantidad: l.balotas,
      extra: l.extra ? { rango: [1, l.extra.rango], nombre: l.extra.nombre } : null,
      frecuencias,
      calientes,
      frios,
      sorteos,
      avanzado: { pares, impares, suma_media: Number(sm[0]?.media ?? 0) },
    };
  } catch (e) {
    console.warn('getEstadisticas: sin BD o error de conexión — usando datos demo:', (e as Error).message);
    return demoStats(slug);
  }
}

export async function getResultados(slug: string, page = 1, perPage = PER_PAGE): Promise<PaginaResultados | null> {
  const l = LOTERIAS[slug];
  if (!l) return null;

  const pool = getPool();
  if (!pool) return demoResultados(slug, page, perPage);

  try {
    const id = await loteriaId(pool, l.nombreBD);
    if (!id) return demoResultados(slug, page, perPage);

    const [tot] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) total FROM sorteos WHERE loteria_id = ?', [id]);
    const total = Number(tot[0]?.total ?? 0);
    const offset = (page - 1) * perPage;

    const [sor] = await pool.query<RowDataPacket[]>(
      `SELECT id, numero_sorteo, fecha_sorteo FROM sorteos
        WHERE loteria_id = ? ORDER BY fecha_sorteo DESC, id DESC LIMIT ? OFFSET ?`,
      [id, perPage, offset]
    );
    const det = await detallePorSorteo(pool, sor.map((s) => Number(s.id)));
    const items: Sorteo[] = sor.map((s) => ({
      numero_sorteo: String(s.numero_sorteo),
      fecha: String(s.fecha_sorteo).slice(0, 10),
      principales: det[Number(s.id)]?.principales ?? [],
      extra: det[Number(s.id)]?.extra ?? null,
    }));

    return { items, total, page, per_page: perPage };
  } catch (e) {
    console.warn('getResultados: sin BD o error de conexión — usando datos demo:', (e as Error).message);
    return demoResultados(slug, page, perPage);
  }
}
