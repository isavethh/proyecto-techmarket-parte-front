# =============================================================================
# TechMarket - Seeder Bolivia
# Crea 3 cuentas de prueba: Cliente, Empresa y Tecnico (especialista)
# Contextualizadas para Bolivia
# Compatible con PowerShell 5.1+
# =============================================================================
# Uso:
#   # Via API REST (si el IAM service esta corriendo en localhost:8080):
#   .\seed_techmarket.ps1
#
#   # Via SQL directo en Docker:
#   .\seed_techmarket.ps1 -Modo sql
#
#   # Con URL personalizada:
#   .\seed_techmarket.ps1 -BaseUrl "http://localhost:8080"
#
#   # Especificando credenciales del admin:
#   .\seed_techmarket.ps1 -AdminPassword "MiPassword"
# =============================================================================

param(
    [string]$BaseUrl        = "http://localhost:8080",
    [string]$AdminPassword  = "Admin1234!",
    [string]$AdminUsername  = "admin.global",
    [ValidateSet("api", "sql")]
    [string]$Modo           = "api",
    # Para modo SQL:
    [string]$DockerContainer = "iam-postgres",
    [string]$DbName          = "iam_service",
    [string]$DbUser          = "iam_user"
)

# ─── Helpers de output ────────────────────────────────────────────────────────

function Write-Header {
    param([string]$text)
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "===========================================================" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$text)
    Write-Host "  >> $text" -ForegroundColor Yellow
}

function Write-OK {
    param([string]$text)
    Write-Host "  OK  $text" -ForegroundColor Green
}

function Write-Fail {
    param([string]$text)
    Write-Host "  ERR $text" -ForegroundColor Red
}

function Write-Info {
    param([string]$text)
    Write-Host "      $text" -ForegroundColor Gray
}

# ─── HTTP helper ──────────────────────────────────────────────────────────────

function Invoke-Api {
    param(
        [string]$Method,
        [string]$Path,
        [object]$Body        = $null,
        [string]$Token       = $null,
        [hashtable]$ExtraHeaders = @{}
    )

    $uri     = "$BaseUrl$Path"
    $headers = @{ "Content-Type" = "application/json" }

    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    foreach ($k in $ExtraHeaders.Keys) {
        $headers[$k] = $ExtraHeaders[$k]
    }

    $params = @{
        Method      = $Method
        Uri         = $uri
        Headers     = $headers
        ErrorAction = "Stop"
    }

    if ($Body) {
        $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
    }

    try {
        return Invoke-RestMethod @params
    }
    catch {
        $code   = ""
        $detail = ""
        if ($_.Exception.Response) {
            $code = $_.Exception.Response.StatusCode.value__
        }
        if ($_.ErrorDetails) {
            $detail = $_.ErrorDetails.Message
        }
        throw "HTTP $code en $Method $Path :: $detail"
    }
}

# ─── Registro ─────────────────────────────────────────────────────────────────

function Register-User {
    param([hashtable]$data)
    try {
        return Invoke-Api -Method POST -Path "/auth/register" -Body $data
    }
    catch {
        if ("$_" -match "409" -or "$_" -match "already" -or "$_" -match "duplicate" -or "$_" -match "exist") {
            Write-Info "Usuario ya existe, continuando..."
            return $null
        }
        throw $_
    }
}

# ─── Login ────────────────────────────────────────────────────────────────────

function Login-User {
    param([string]$email, [string]$password)
    # El login devuelve accessToken directamente tras registro
    # Si OTP esta habilitado, solo /auth/register devuelve token directamente
    $resp = Invoke-Api -Method POST -Path "/auth/login" -Body @{
        email    = $email
        password = $password
    }

    # Si hay OTP requerido, devolvemos null y lo notificamos
    if ($resp.otpRequired -eq $true) {
        Write-Info "OTP requerido para este usuario. El perfil no se podra verificar via API."
        Write-Info "Usa -Modo sql para evitar OTP, o desactiva OTP en application.yml."
        return $null
    }

    if ($resp.accessToken) { return $resp.accessToken }
    if ($resp.token)       { return $resp.token }
    return $null
}

# ─── Update perfil ────────────────────────────────────────────────────────────

function Update-Profile {
    param([string]$token, [hashtable]$data)
    Invoke-Api -Method PUT -Path "/users/profile" -Body $data -Token $token | Out-Null
}

# ─── Seed de una cuenta ───────────────────────────────────────────────────────

function Seed-Cuenta {
    param(
        [string]$Nombre,
        [string]$Email,
        [hashtable]$RegData,
        [hashtable]$ProfileData
    )

    Write-Header "Cuenta: $Nombre"

    # 1. Registro
    Write-Step "Registrando via POST /auth/register ..."
    $token = $null
    try {
        $resp = Register-User $RegData
        if ($resp) {
            Write-OK "Cuenta creada."
            # El registro puede devolver el token directamente
            if ($resp.accessToken) { $token = $resp.accessToken }
            elseif ($resp.token)   { $token = $resp.token }
        }
    }
    catch {
        Write-Fail "Error al registrar: $_"
    }

    # 2. Login si no tenemos token aun
    if (-not $token) {
        Write-Step "Obteniendo token via POST /auth/login ..."
        try {
            $token = Login-User $Email $RegData.password
            if ($token) {
                Write-OK "Login exitoso."
            }
        }
        catch {
            Write-Info "Login no disponible (OTP activo o credenciales incorrectas): $_"
        }
    }

    # 3. Update de perfil (solo si tenemos token)
    if ($token) {
        Write-Step "Actualizando perfil via PUT /users/profile ..."
        try {
            Update-Profile $token $ProfileData
            Write-OK "Perfil actualizado."
        }
        catch {
            Write-Fail "No se pudo actualizar perfil: $_"
        }

        Write-Step "Verificando via GET /users/profile ..."
        try {
            $perfil = Invoke-Api -Method GET -Path "/users/profile" -Token $token
            Write-OK "Perfil leido:"
            Write-Info "  Nombre : $($perfil.nombre) $($perfil.apellido)"
            $emailVal = if ($perfil.email) { $perfil.email } else { $Email }
            Write-Info "  Email  : $emailVal"
            Write-Info "  Ciudad : $($perfil.ciudad)"
            $tipoVal = if ($perfil.tipo) { $perfil.tipo } else { $RegData.tipo }
            Write-Info "  Tipo   : $tipoVal"
        }
        catch {
            Write-Info "  (GET /users/profile no disponible: $_)"
        }
    }
    else {
        Write-Info "Sin token - perfil no actualizado via API."
        Write-Info "La cuenta fue creada correctamente en la BD."
        Write-Info "Usa -Modo sql para poblar el perfil directamente."
    }
}

# =============================================================================
# DATOS
# =============================================================================

$PASSWORD = "TechBolivia2026!"

$cuentas = @(
    @{
        Nombre = "Juan Carlos Mamani Quispe (cliente - La Paz)"
        Email  = "juan.mamani@gmail.com"
        Reg    = @{
            email           = "juan.mamani@gmail.com"
            password        = $PASSWORD
            confirmPassword = $PASSWORD
            tipo            = "cliente"
            nombre          = "Juan"
            apellido        = "Mamani Quispe"
            telefono        = "+59171234567"
            pais            = "Bolivia"
            ciudad          = "La Paz"
            terminos        = $true
        }
        Profile = @{
            nombre      = "Juan Carlos"
            apellido    = "Mamani Quispe"
            telefono    = "+59171234567"
            ciudad      = "La Paz"
            descripcion = "Comprador frecuente de electronica y gadgets en La Paz. Cliente desde 2026."
        }
    },
    @{
        Nombre = "ElectroBolivia SRL (empresa - Santa Cruz)"
        Email  = "ventas@electrobolivia.com.bo"
        Reg    = @{
            email           = "ventas@electrobolivia.com.bo"
            password        = $PASSWORD
            confirmPassword = $PASSWORD
            tipo            = "empresa"
            nombre          = "ElectroBolivia"
            apellido        = "SRL"
            telefono        = "+59122345678"
            pais            = "Bolivia"
            ciudad          = "Santa Cruz de la Sierra"
            terminos        = $true
        }
        Profile = @{
            nombre      = "ElectroBolivia"
            apellido    = "SRL"
            telefono    = "+59122345678"
            ciudad      = "Santa Cruz de la Sierra"
            descripcion = "Distribuidora oficial de equipos tecnologicos y accesorios en Bolivia. Sucursales en Santa Cruz, La Paz y Cochabamba."
        }
    },
    @{
        Nombre = "Carlos Condori Flores (especialista - Cochabamba)"
        Email  = "carlos.condori.tech@gmail.com"
        Reg    = @{
            email           = "carlos.condori.tech@gmail.com"
            password        = $PASSWORD
            confirmPassword = $PASSWORD
            tipo            = "especialista"
            nombre          = "Carlos"
            apellido        = "Condori Flores"
            telefono        = "+59176543210"
            pais            = "Bolivia"
            ciudad          = "Cochabamba"
            terminos        = $true
        }
        Profile = @{
            nombre      = "Carlos"
            apellido    = "Condori Flores"
            telefono    = "+59176543210"
            ciudad      = "Cochabamba"
            descripcion = "Tecnico certificado en reparacion de laptops y PCs. Especialista en redes. 8 anios de experiencia en Cochabamba."
        }
    }
)

# =============================================================================
# MODO SQL (directo a Docker)
# =============================================================================

function Run-SqlMode {
    Write-Header "Modo SQL - Inyectando via Docker"

    $sqlFile = Join-Path $PSScriptRoot "V9__seed_bolivia_test_accounts.sql"
    if (-not (Test-Path $sqlFile)) {
        Write-Fail "No se encontro el archivo: $sqlFile"
        exit 1
    }

    Write-Step "Ejecutando SQL en contenedor: $DockerContainer ..."
    try {
        Get-Content $sqlFile | docker exec -i $DockerContainer psql -U $DbUser -d $DbName
        Write-OK "SQL ejecutado correctamente."
    }
    catch {
        Write-Fail "Error al ejecutar SQL: $_"
        Write-Host ""
        Write-Host "  Verifica que Docker este corriendo y el contenedor '$DockerContainer' exista." -ForegroundColor Magenta
        Write-Host "  Nombre del contenedor: docker ps" -ForegroundColor Magenta
        exit 1
    }
}

# =============================================================================
# MODO API
# =============================================================================

function Run-ApiMode {
    Write-Header "Modo API - Llamando endpoints REST"

    # Verificar conectividad al servicio
    Write-Step "Verificando conectividad con $BaseUrl ..."
    try {
        $health = Invoke-RestMethod -Method GET -Uri "$BaseUrl/actuator/health" -ErrorAction Stop
        Write-OK "Servicio disponible. Estado: $($health.status)"
    }
    catch {
        Write-Fail "No se puede conectar a $BaseUrl"
        Write-Host ""
        Write-Host "  Asegurate de que el IAM service este corriendo." -ForegroundColor Magenta
        Write-Host "  Comando: docker compose up -d  (desde TechMarket-IAM/)" -ForegroundColor Magenta
        exit 1
    }

    # Seed cada cuenta
    $i = 1
    foreach ($cuenta in $cuentas) {
        Write-Header "$i/3 - $($cuenta.Nombre)"
        Seed-Cuenta -Nombre $cuenta.Nombre -Email $cuenta.Email `
                    -RegData $cuenta.Reg -ProfileData $cuenta.Profile
        $i++
    }
}

# =============================================================================
# EJECUCION PRINCIPAL
# =============================================================================

Write-Header "TechMarket Seeder - Bolivia"
Write-Host ""
Write-Host "  Modo       : $Modo" -ForegroundColor White
Write-Host "  Contrasena : $PASSWORD" -ForegroundColor White
Write-Host "  Fecha      : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White

if ($Modo -eq "sql") {
    Run-SqlMode
}
else {
    Run-ApiMode
}

# =============================================================================
# RESUMEN FINAL
# =============================================================================

Write-Header "RESUMEN FINAL"
Write-Host ""
Write-Host "  Contrasena compartida: $PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "  ROL           | EMAIL                                | CIUDAD" -ForegroundColor Cyan
Write-Host "  --------------|--------------------------------------|---------------------" -ForegroundColor Cyan
Write-Host "  cliente       | juan.mamani@gmail.com               | La Paz" -ForegroundColor White
Write-Host "  empresa       | ventas@electrobolivia.com.bo        | Santa Cruz de la Sierra" -ForegroundColor White
Write-Host "  especialista  | carlos.condori.tech@gmail.com       | Cochabamba" -ForegroundColor White
Write-Host ""
Write-Host "  Endpoints usados (modo api):" -ForegroundColor Gray
Write-Host "    GET  /actuator/health  - verificacion de servicio" -ForegroundColor Gray
Write-Host "    POST /auth/register    - registro publico" -ForegroundColor Gray
Write-Host "    POST /auth/login       - autenticacion" -ForegroundColor Gray
Write-Host "    GET  /users/profile    - verificar perfil" -ForegroundColor Gray
Write-Host "    PUT  /users/profile    - actualizar perfil" -ForegroundColor Gray
Write-Host ""
Write-Host "  Si el login falla por OTP, ejecuta con:" -ForegroundColor Gray
Write-Host "    .\seed_techmarket.ps1 -Modo sql" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Completado: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green
Write-Host ""
