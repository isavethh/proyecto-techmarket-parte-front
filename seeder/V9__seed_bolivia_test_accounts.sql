-- =============================================================================
-- Flyway Migration V9: Seed 3 cuentas de prueba para Bolivia
--
--   1. Juan Mamani Quispe     → cliente      (La Paz)
--   2. ElectroBolivia SRL     → empresa      (Santa Cruz de la Sierra)
--   3. Carlos Condori Flores  → especialista (Cochabamba)
--
-- Contraseña bcrypt para: TechBolivia2026!
-- Hash generado con bcrypt cost 10
-- =============================================================================

-- NOTA: Copiar este archivo a TechMarket-IAM/src/main/resources/db/migration/
--       si se desea aplicar vía Flyway. De lo contrario, ejecutar manualmente
--       contra la base de datos iam_service.
-- =============================================================================

-- ─── CONTRASEÑA COMPARTIDA ────────────────────────────────────────────────────
-- Plaintext : TechBolivia2026!
-- BCrypt    : $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9y
-- Generado con BCryptPasswordEncoder(strength=10)
-- =============================================================================

-- =============================================================================
-- 1. CLIENTE — Juan Carlos Mamani Quispe — La Paz, Bolivia
-- =============================================================================

INSERT INTO iam_user (
    tenant_id,
    username,
    email,
    active,
    version,
    first_name,
    last_name,
    phone,
    country,
    city,
    user_type,
    terms_accepted
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    'juan.mamani',
    'juan.mamani@gmail.com',
    TRUE,
    0,
    'Juan',
    'Mamani Quispe',
    '+59171234567',
    'Bolivia',
    'La Paz',
    'cliente',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM iam_user
    WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
      AND (
        LOWER(username) = LOWER('juan.mamani')
        OR LOWER(email) = LOWER('juan.mamani@gmail.com')
      )
);

INSERT INTO iam_user_credential (user_id, tenant_id, password_hash)
SELECT
    u.id,
    '00000000-0000-0000-0000-000000000000',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9y'
FROM iam_user u
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('juan.mamani')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_credential c WHERE c.user_id = u.id
);

INSERT INTO iam_user_roles (user_id, role_id)
SELECT
    u.id,
    r.id
FROM iam_user u
JOIN iam_role r
  ON r.tenant_id = '00000000-0000-0000-0000-000000000000'
 AND LOWER(r.name) = LOWER('cliente')
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('juan.mamani')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO iam_user_scope (tenant_id, user_id, branch_id, scope_type)
SELECT
    '00000000-0000-0000-0000-000000000000',
    u.id,
    NULL,
    'TENANT'
FROM iam_user u
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('juan.mamani')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_scope s WHERE s.user_id = u.id
);

-- =============================================================================
-- 2. EMPRESA — ElectroBolivia SRL — Santa Cruz de la Sierra, Bolivia
-- =============================================================================

INSERT INTO iam_user (
    tenant_id,
    username,
    email,
    active,
    version,
    first_name,
    last_name,
    phone,
    country,
    city,
    user_type,
    terms_accepted
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    'electrobolivia',
    'ventas@electrobolivia.com.bo',
    TRUE,
    0,
    'ElectroBolivia',
    'SRL',
    '+59122345678',
    'Bolivia',
    'Santa Cruz de la Sierra',
    'empresa',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM iam_user
    WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
      AND (
        LOWER(username) = LOWER('electrobolivia')
        OR LOWER(email) = LOWER('ventas@electrobolivia.com.bo')
      )
);

INSERT INTO iam_user_credential (user_id, tenant_id, password_hash)
SELECT
    u.id,
    '00000000-0000-0000-0000-000000000000',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9y'
FROM iam_user u
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('electrobolivia')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_credential c WHERE c.user_id = u.id
);

INSERT INTO iam_user_roles (user_id, role_id)
SELECT
    u.id,
    r.id
FROM iam_user u
JOIN iam_role r
  ON r.tenant_id = '00000000-0000-0000-0000-000000000000'
 AND LOWER(r.name) = LOWER('empresa')
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('electrobolivia')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO iam_user_scope (tenant_id, user_id, branch_id, scope_type)
SELECT
    '00000000-0000-0000-0000-000000000000',
    u.id,
    NULL,
    'TENANT'
FROM iam_user u
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('electrobolivia')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_scope s WHERE s.user_id = u.id
);

-- =============================================================================
-- 3. TÉCNICO / ESPECIALISTA — Carlos Condori Flores — Cochabamba, Bolivia
-- =============================================================================

INSERT INTO iam_user (
    tenant_id,
    username,
    email,
    active,
    version,
    first_name,
    last_name,
    phone,
    country,
    city,
    user_type,
    terms_accepted
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    'carlos.condori.tech',
    'carlos.condori.tech@gmail.com',
    TRUE,
    0,
    'Carlos',
    'Condori Flores',
    '+59176543210',
    'Bolivia',
    'Cochabamba',
    'especialista',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM iam_user
    WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
      AND (
        LOWER(username) = LOWER('carlos.condori.tech')
        OR LOWER(email) = LOWER('carlos.condori.tech@gmail.com')
      )
);

INSERT INTO iam_user_credential (user_id, tenant_id, password_hash)
SELECT
    u.id,
    '00000000-0000-0000-0000-000000000000',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9y'
FROM iam_user u
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('carlos.condori.tech')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_credential c WHERE c.user_id = u.id
);

INSERT INTO iam_user_roles (user_id, role_id)
SELECT
    u.id,
    r.id
FROM iam_user u
JOIN iam_role r
  ON r.tenant_id = '00000000-0000-0000-0000-000000000000'
 AND LOWER(r.name) = LOWER('especialista')
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('carlos.condori.tech')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

INSERT INTO iam_user_scope (tenant_id, user_id, branch_id, scope_type)
SELECT
    '00000000-0000-0000-0000-000000000000',
    u.id,
    NULL,
    'TENANT'
FROM iam_user u
WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
  AND LOWER(u.username) = LOWER('carlos.condori.tech')
  AND NOT EXISTS (
    SELECT 1 FROM iam_user_scope s WHERE s.user_id = u.id
);

-- =============================================================================
-- Verificación (ejecutar manualmente para confirmar):
-- =============================================================================
-- SELECT u.username, u.email, u.first_name, u.last_name, u.city, u.user_type,
--        r.name AS rol
-- FROM iam_user u
-- JOIN iam_user_roles ur ON ur.user_id = u.id
-- JOIN iam_role r        ON r.id = ur.role_id
-- WHERE u.tenant_id = '00000000-0000-0000-0000-000000000000'
--   AND u.username IN ('juan.mamani', 'electrobolivia', 'carlos.condori.tech');
-- =============================================================================
