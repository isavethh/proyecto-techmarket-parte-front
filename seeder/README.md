# TechMarket Seeder — Cuentas Bolivia

Seeder externo que crea **3 cuentas de prueba** contextualizadas para Bolivia, **sin modificar el backend**.

---

## Cuentas creadas

| Rol           | Nombre                  | Email                             | Ciudad              |
|---------------|-------------------------|-----------------------------------|---------------------|
| `cliente`     | Juan Carlos Mamani      | juan.mamani@gmail.com             | La Paz              |
| `empresa`     | ElectroBolivia SRL      | ventas@electrobolivia.com.bo      | Santa Cruz de la Sierra |
| `especialista`| Carlos Condori Flores   | carlos.condori.tech@gmail.com     | Cochabamba          |

**Contraseña de todas las cuentas:** `TechBolivia2026!`

---

## Opción A — Script PowerShell (vía API REST)

Llama directamente a los endpoints HTTP del IAM service. **Recomendado para desarrollo.**

### Requisitos
- El IAM service debe estar corriendo en `http://localhost:8080`
- El usuario `admin.global` debe existir (creado por Flyway V4)

### Uso

```powershell
# Con parámetros por defecto (localhost:8080)
.\seed_techmarket.ps1

# Con URL personalizada
.\seed_techmarket.ps1 -BaseUrl "http://localhost:8080"

# Con credenciales admin distintas
.\seed_techmarket.ps1 -AdminUsername "admin.global" -AdminPassword "MiPassword123!"
```

### Endpoints consumidos

| Método | Endpoint          | Descripción                        |
|--------|-------------------|------------------------------------|
| `POST` | `/auth/login`     | Login admin + login de cada cuenta |
| `POST` | `/auth/register`  | Registro público de cada cuenta    |
| `GET`  | `/users/profile`  | Verificación del perfil creado     |
| `PUT`  | `/users/profile`  | Actualización de perfil            |

---

## Opción B — Migración SQL (Flyway V9)

Inserta los usuarios directamente en la base de datos PostgreSQL, siguiendo el mismo patrón que `V4__seed_global_admin_user.sql`.

### Uso como migración Flyway

Copiar el archivo al directorio de migraciones del IAM service:

```powershell
Copy-Item .\V9__seed_bolivia_test_accounts.sql `
  ..\TechMarket-Backend\TechMarket-IAM\src\main\resources\db\migration\
```

Flyway lo ejecutará automáticamente al arrancar el servicio.

### Uso manual (psql)

```powershell
# PowerShell: usar Get-Content + pipe (el operador < no funciona en PS)
Get-Content .\V9__seed_bolivia_test_accounts.sql | docker exec -i iam-postgres psql -U iam_user -d iam_service

# O con psql instalado localmente
Get-Content .\V9__seed_bolivia_test_accounts.sql | psql -h localhost -p 5432 -U iam_user -d iam_service
```

### Verificación SQL

```sql
SELECT u.username, u.email, u.first_name, u.last_name,
       u.city, u.country, u.user_type, r.name AS rol
FROM iam_user u
JOIN iam_user_roles ur ON ur.user_id = u.id
JOIN iam_role r        ON r.id = ur.role_id
WHERE u.username IN ('juan.mamani', 'electrobolivia', 'carlos.condori.tech');
```

---

## Notas

- El hash bcrypt en el SQL corresponde a `TechBolivia2026!` con cost=10.
- El `tenant_id = '00000000-0000-0000-0000-000000000000'` es el tenant global (creado por Flyway V3/V4).
- El rol `especialista` corresponde al tipo "técnico" en el sistema.
- Todos los INSERTs usan `WHERE NOT EXISTS` para ser **idempotentes** (se pueden ejecutar varias veces sin duplicar datos).
