-- Esquema MySQL para Lotofácil (sin WordPress)
-- Ejecutar una vez en la base de datos de Hostinger (phpMyAdmin o CLI).

CREATE TABLE IF NOT EXISTS loterias (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sorteos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  loteria_id    INT NOT NULL,
  numero_sorteo VARCHAR(40) NOT NULL,
  fecha_sorteo  DATE NOT NULL,
  KEY idx_loteria_fecha (loteria_id, fecha_sorteo),
  CONSTRAINT fk_sorteo_loteria FOREIGN KEY (loteria_id) REFERENCES loterias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS resultados_detalle (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  sorteo_id INT NOT NULL,
  numero    INT NOT NULL,
  tipo_bola ENUM('principal','extra') NOT NULL DEFAULT 'principal',
  KEY idx_sorteo (sorteo_id),
  KEY idx_numero (numero, tipo_bola),
  CONSTRAINT fk_detalle_sorteo FOREIGN KEY (sorteo_id) REFERENCES sorteos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Semilla de loterías (los `nombre` deben coincidir con `nombreWP` de src/config/loterias.ts)
INSERT IGNORE INTO loterias (nombre) VALUES
  ('Baloto'), ('Baloto Revancha'), ('MiLoto'),
  ('Melate'), ('La Primitiva'), ('Powerball'), ('Mega Millions');
