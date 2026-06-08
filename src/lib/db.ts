import mysql from 'mysql2/promise';

/**
 * Pool de conexiones a MySQL (Hostinger).
 * Se cachea en globalThis para sobrevivir al hot-reload en desarrollo.
 * Si no hay variables de entorno de BD, devuelve null y la app usa datos demo.
 */
const g = globalThis as unknown as { _lotoPool?: mysql.Pool | null };

export function getPool(): mysql.Pool | null {
  if (g._lotoPool !== undefined) return g._lotoPool;

  const { DB_HOST, DB_USER, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    g._lotoPool = null;
    return null;
  }

  g._lotoPool = mysql.createPool({
    host: DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: DB_USER,
    password: process.env.DB_PASSWORD ?? '',
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
  });
  return g._lotoPool;
}
