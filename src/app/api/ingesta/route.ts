import { NextResponse } from 'next/server';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Ingesta de un sorteo nuevo (reemplaza el antiguo endpoint de WordPress).
 * POST /api/ingesta   header: x-agatha-token: <INGEST_TOKEN>
 * body: { loteria, numero_sorteo, fecha, principales:[..], super_balota?:number|null }
 * Lo consume el microservicio scraper de Node.
 */
export async function POST(request: Request) {
  const token = request.headers.get('x-agatha-token');
  if (!process.env.INGEST_TOKEN || token !== process.env.INGEST_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const pool = getPool();
  if (!pool) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 });

  let body: {
    loteria?: string;
    numero_sorteo?: string;
    fecha?: string;
    principales?: number[];
    super_balota?: number | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { loteria, numero_sorteo, fecha, principales, super_balota } = body;
  if (!loteria || !numero_sorteo || !fecha || !Array.isArray(principales) || principales.length === 0) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [lot] = await conn.query<RowDataPacket[]>('SELECT id FROM loterias WHERE nombre = ?', [loteria]);
    if (!lot.length) return NextResponse.json({ error: 'Lotería no encontrada' }, { status: 404 });
    const loteriaId = Number(lot[0].id);

    await conn.beginTransaction();
    const [ins] = await conn.query<ResultSetHeader>(
      'INSERT INTO sorteos (loteria_id, numero_sorteo, fecha_sorteo) VALUES (?, ?, ?)',
      [loteriaId, String(numero_sorteo), String(fecha)]
    );
    const sorteoId = ins.insertId;

    const filas: [number, number, string][] = principales.map((n) => [sorteoId, Number(n), 'principal']);
    if (super_balota != null) filas.push([sorteoId, Number(super_balota), 'extra']);
    await conn.query('INSERT INTO resultados_detalle (sorteo_id, numero, tipo_bola) VALUES ?', [filas]);

    await conn.commit();
    return NextResponse.json({ ok: true, sorteo_id: sorteoId });
  } catch (e) {
    await conn.rollback();
    console.error('ingesta', e);
    return NextResponse.json({ error: 'Error al insertar' }, { status: 500 });
  } finally {
    conn.release();
  }
}
