import { NextResponse } from 'next/server';
import { getResultados, PER_PAGE } from '@/lib/api';

/**
 * Resultados paginados (datos propios, MySQL directo).
 * El cliente consulta /api/resultados (mismo origen) y getResultados consulta
 * la base de datos en el servidor. Si no hay BD configurada, devuelve datos demo.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const loteria = searchParams.get('loteria') ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') ?? String(PER_PAGE), 10) || PER_PAGE));

  const data = await getResultados(loteria, page, perPage);
  if (!data) {
    return NextResponse.json({ error: 'Lotería no encontrada' }, { status: 404 });
  }
  return NextResponse.json(data);
}
