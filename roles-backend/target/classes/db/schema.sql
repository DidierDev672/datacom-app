-- Esquema de ejemplo para PostgreSQL. La tabla rolesx debe existir en el
-- entorno. Este script permite crearla/seedearla localmente de forma rapida.

CREATE TABLE IF NOT EXISTS rolesx (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO rolesx (name, description)
SELECT 'LIDER', 'Líder de equipo'
WHERE NOT EXISTS (SELECT 1 FROM rolesx WHERE name = 'LIDER');

INSERT INTO rolesx (name, description)
SELECT 'ADMIN', 'Administrador del sistema'
WHERE NOT EXISTS (SELECT 1 FROM rolesx WHERE name = 'ADMIN');

INSERT INTO rolesx (name, description)
SELECT 'USUARIO', 'Usuario estándar'
WHERE NOT EXISTS (SELECT 1 FROM rolesx WHERE name = 'USUARIO');
