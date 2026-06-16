// Endpoints PÚBLICOS de atribución de referidos (sin token).
// Viven en TechMarket-IA (8082). Se usan en el flujo de registro de empresas:
// una empresa que llega por un link de embajador queda atribuida a ese embajador.

const IA_BASE_URL =
  process.env.NEXT_PUBLIC_TECHMARKET_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

const TENANT_ID = "00000000-0000-0000-0000-000000000000";

export type ClaimReferralPayload = {
  code: string;
  nombre: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  pais?: string;
  tipo?: string;
};

/**
 * Atribuye una empresa recién registrada al embajador dueño del código.
 * Best-effort: nunca lanza, para no romper el registro si la atribución falla.
 */
export async function claimReferral(payload: ClaimReferralPayload): Promise<boolean> {
  if (!IA_BASE_URL || !payload.code?.trim() || !payload.nombre?.trim()) {
    return false;
  }

  try {
    const response = await fetch(
      new URL("/api/ambassadors/referrals/claim", IA_BASE_URL).toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id": TENANT_ID,
        },
        body: JSON.stringify(payload),
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

/** Registra un clic sobre el link de referido (best-effort). */
export async function trackReferralClick(code: string): Promise<void> {
  if (!IA_BASE_URL || !code?.trim()) {
    return;
  }

  try {
    await fetch(
      new URL(
        `/api/ambassadors/referral-links/${encodeURIComponent(code.trim())}/track-click`,
        IA_BASE_URL,
      ).toString(),
      {
        method: "POST",
        headers: { "X-Tenant-Id": TENANT_ID },
      },
    );
  } catch {
    // best-effort, no bloquear la UI
  }
}
