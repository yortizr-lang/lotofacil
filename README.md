# Lotofácil — Next.js 15 full-stack (sin WordPress)

Resultados de loterías y análisis estadístico. Stack moderno: **Next.js 15 + MySQL**,
sin CMS intermedio. Next habla directo con la base de datos desde Server Components y
Route Handlers usando `mysql2`.

## Arquitectura
- **Frontend + API**: Next.js 15 (App Router, TypeScript, next-intl, ISR).
- **Datos**: MySQL (Hostinger). Acceso vía `src/lib/db.ts` (pool) y `src/lib/api.ts` (consultas).
- **Ingesta**: `POST /api/ingesta` (protegida por token). El microservicio scraper de Node
  publica aquí los sorteos nuevos (antes lo hacía contra WordPress).
- **Lectura cliente**: la tabla histórica pagina contra `GET /api/resultados` (mismo origen).

Sin `WP_API_BASE` ni plugin de WordPress. Si no defines las variables `DB_*`,
la app funciona con datos de demostración.

## Estado: NO indexable
`robots: noindex` en metadata + `X-Robots-Tag` en `next.config.mjs` + `public/robots.txt`.

## Puesta en marcha
```bash
npm install
# 1) crear el esquema (una vez) en tu MySQL:
#    mysql -u USER -p DB < db/schema.sql      (o impórtalo en phpMyAdmin)
# 2) copiar variables y completarlas:
cp .env.local.example .env.local
npm run dev          # http://localhost:3000  (redirige a /co)
```
Sin `.env.local` o sin `DB_*`, arranca en modo DEMO (sin BD).

## Ingesta desde el scraper
El scraper Node debe hacer `POST` a `/api/ingesta` con la cabecera `x-agatha-token: <INGEST_TOKEN>`
y cuerpo:
```json
{ "loteria": "Baloto", "numero_sorteo": "2588", "fecha": "2026-06-07",
  "principales": [3, 11, 22, 30, 41], "super_balota": 7 }
```

## Despliegue en Hostinger (app + MySQL juntos)
1. **Base de datos** (hPanel → Bases de datos MySQL): crea la base y un usuario, anota
   nombre/usuario/contraseña. Como la app corre en el mismo hosting, `DB_HOST=localhost`.
2. **Esquema**: abre phpMyAdmin e importa `db/schema.sql` (crea tablas + semilla de loterías).
3. **App Node**: conecta el repo de GitHub (auto-deploy). Build: `npm run build`. Arranque: `npm run start`.
4. **Variables de entorno en hPanel** (no en `.env.local`, que se borra en cada redeploy):
   `DB_HOST=localhost`, `DB_PORT=3306`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
   `INGEST_TOKEN`, `NPM_CONFIG_PRODUCTION=false`, y para ocultarlo: `SITE_USER`, `SITE_PASS`.

## Ocultar el sitio durante el desarrollo
Dos capas:
- **No indexar**: `robots: noindex` + `X-Robots-Tag` + `public/robots.txt` (ya activos).
- **Contraseña**: define `SITE_USER` y `SITE_PASS` en hPanel. El middleware exige Basic Auth
  en todo el sitio (pide usuario/contraseña en el navegador), así Google ni nadie ve el
  contenido. `/api/ingesta` queda fuera para que el scraper use su `INGEST_TOKEN`.

**Al lanzar**: borra `SITE_USER`/`SITE_PASS`, cambia `robots.txt` a `Allow: /`, pon
`index: true` en los metadatos y quita la cabecera `X-Robots-Tag` de `next.config.mjs`.

## Estructura
```
db/schema.sql                  Esquema MySQL (loterias, sorteos, resultados_detalle)
src/
  app/
    [country]/                 home del país + [loteria] (página de lotería) + legal/[doc]
    api/resultados/route.ts    histórico paginado (lee MySQL)
    api/ingesta/route.ts       alta de sorteos (token)
  lib/db.ts                    pool MySQL
  lib/api.ts                   consultas (getEstadisticas, getResultados) + fallback demo
  config/                      loterias.ts (catálogo + nombreWP) y legal.ts
  components/                  Predictor, GeneradorFecha, ArchivoHistorico, CalientesFrios, ...
```

## Añadir una lotería / país
`src/config/loterias.ts` (el `nombreWP` debe coincidir con el `nombre` en la tabla `loterias`),
y para un país nuevo: `src/i18n/routing.ts` (locales) + `src/i18n/request.ts` (idioma).
