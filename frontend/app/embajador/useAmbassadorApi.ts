"use client";

import { useState, useEffect, useCallback } from "react";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api/apiClient";
import { getAiInsights } from "@/lib/api/ambassador/aiApi";
import type { AiInsight } from "@/lib/api/ambassador/types";

// ---------------------------------------------------------------------------
// Types matching REAL backend responses
// ---------------------------------------------------------------------------

export type ApiProfile = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  pais: string;
  ciudad: string | null;
  avatar: string | null;
  estado: string;
  nivel: string;
  codigoReferido: string;
  defaultReferralLinkId?: string | null;
};

export type ApiStats = {
  negociosReferidos: number;
  negociosActivos: number;
  conversionRate: number;
  comisionesTotales: string;
  nivel: string;
};

export type ApiReferral = {
  id: string;
  nombre: string | null;
  tipo: string;
  estado: string;
  fechaRegistro: string;
  comisionGenerada: string;
};

export type ApiReferralDetail = {
  id: string;
  nombre: string;
  estado: string;
  pais: string | null;
  ciudad: string | null;
  categoria: string | null;
  fechaRegistro: string | null;
  ultimaActividad: string | null;
  ventasTotales: number;
  comisionGenerada: number;
  plan: string | null;
  contacto: {
    nombre: string | null;
    email: string | null;
    telefono: string | null;
  } | null;
};

export type ApiReferralActivity = {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
};

export type ApiReferralNote = {
  id: string;
  nota: string;
  fecha: string;
};

export type ApiReferralMetrics = {
  totalReferidos: number;
  activos: number;
  pendientes: number;
  conversionRate: number;
  comisionTotal: string;
  porMes: Array<{
    mes: string;
    referidos: number;
    activos: number;
  }>;
};

export type ApiReferralBusinessMetrics = {
  monthlyLeads: number;
  conversionRate: number;
  growthRate: number;
  rating: number;
  valueScore: number;
  ventasTotales: number;
  commissionGenerated: number;
  reputationContribution: number;
};

export type ApiReferralUserInsights = {
  userScore: number;
  userView: string;
  topComment: string;
  strengths: string[];
  risks: string[];
};

export type ApiNetworkNode = {
  id: string;
  nombre: string;
  nivel: string;
  subEmbajadores: ApiNetworkNode[];
};

export type ApiCommission = {
  id: string;
  referido: string;
  concepto: string;
  monto: string;
  estado: string;
  fecha: string;
};

export type ApiCommissionsSummary = {
  totalGenerado: string;
  disponible: string;
  pendiente: string;
  pagado: string;
};

export type ApiLead = {
  id: string;
  nombre: string;
  tipo: string;
  contacto?: string | null;
  telefono?: string | null;
  email?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  notas?: string | null;
  proximaAccion?: string | null;
  historialAcciones?: Array<{
    id: string;
    tipo: string;
    nota: string;
    fecha: string;
  }> | null;
  fechaUltimoContacto?: string | null;
  fuente?: string | null;
  estado: string;
  fechaCreacion?: string | null;
  probabilidadCierre?: number | null;
  [key: string]: unknown;
};

export type ApiSettings = {
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  mostrarPerfilPublico: boolean;
  idioma: string;
};

export type ApiReferralCode = {
  codigo: string;
  tipo: string;
  usos: number;
  activo: boolean;
};

export type ApiNetworkRanking = {
  posicion: number;
  id: string;
  nombre: string;
  conversiones: number;
  comisiones: string;
};

export type ApiNetworkMember = {
  id: string;
  nombre: string;
  nivel: string;
  referidos: number;
  estado: string;
};

export type ApiNetworkInvitation = {
  id: string;
  email: string;
  estado: string;
};

export type ApiReferralLink = {
  id: string;
  nombre: string;
  codigo: string;
  url: string;
  clics: number;
  conversiones: number;
  activo: boolean;
};

export type ApiReferralLinkStats = {
  linkId: string;
  codigo: string;
  clicks: number;
  registros: number;
  conversionRate: number;
  comisionesGeneradas: string;
};

export type ApiReferralLinkQr = {
  qrUrl: string;
};

export type ApiOnboardingSummary = {
  id: string;
  referidoId: string;
  nombre: string;
  progreso: number;
  estado: string;
};

export type ApiOnboardingDetail = {
  id: string;
  referido: string;
  estado: string;
  progreso: number;
  pasos: Array<{
    id: string;
    nombre: string;
    completado: boolean;
  }>;
};

export type ApiOnboardingTask = {
  id: string;
  titulo: string;
  estado: string;
  fechaLimite: string | null;
};

export type ApiOnboardingMilestone = {
  id: string;
  nombre: string;
  orden: number;
};

export type ApiOnboardingSnapshot = {
  perfil: {
    id: string;
    nombre: string;
    estado: string;
    tipo: string | null;
    pais: string | null;
    ciudad: string | null;
    contacto?: {
      nombre: string | null;
      email: string | null;
      telefono: string | null;
    } | null;
  };
  catalogo: {
    totalProductos: number;
    activos: number;
  };
  publicaciones: unknown[];
  evidencias: unknown[];
  promocion: {
    codigo: string | null;
  };
  checklist: Array<{
    id: string;
    nombre: string;
    completado: boolean;
  }>;
  notas: ApiReferralNote[];
  accionesPendientes: unknown[];
};

export type ApiCommissionDetail = {
  id: string;
  referido: string;
  concepto: string;
  monto: string;
  porcentaje: number;
  estado: string;
  fechaGeneracion: string;
};

export type ApiWallet = {
  saldoDisponible: string;
  saldoPendiente: string;
  totalRetirado: string;
};

export type ApiPayout = {
  id: string;
  monto: string;
  estado: string;
  fecha: string | null;
};

export type ApiPayoutMethod = {
  id: string;
  tipo: string;
  banco: string | null;
  ultimos4: string | null;
  predeterminado: boolean;
};

export type ApiPerformanceReport = {
  periodo: string;
  clics: number;
  leads: number;
  conversiones: number;
  conversionRate: number;
  comisiones: string;
};

export type ApiReferralReport = {
  referido: string;
  tipo: string;
  estado: string;
  ventasGeneradas: number;
  comision: string;
};

export type ApiConversionFunnel = {
  clics: number;
  leads: number;
  registros: number;
  activos: number;
};

export type ApiAiInsights = {
  radar: Array<{
    etiqueta: string;
    valor: number;
  }>;
  recomendacion: string;
};

export type ApiDashboard = {
  profile: ApiProfile;
  stats: ApiStats;
  recentReferrals: ApiReferral[];
  recentCommissions: ApiCommission[];
  pendingActions: Array<{
    id: string;
    tipo: string;
    descripcion: string;
    fecha: string;
  }>;
};

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function profileDisplayData(p: ApiProfile) {
  const fullName = `${p.nombre} ${p.apellido}`.trim();
  const initials = `${(p.nombre?.[0] ?? "").toUpperCase()}${(p.apellido?.[0] ?? "").toUpperCase()}`;
  return { fullName, initials };
}

// ---------------------------------------------------------------------------
// Generic fetch hook
// ---------------------------------------------------------------------------

function useApiFetch<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!path) {
      setData(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const nextData = await apiGet<T>(path);
      setData(nextData);
      return nextData;
    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo cargar la informacion.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ---------------------------------------------------------------------------
// Typed hooks for each endpoint
// ---------------------------------------------------------------------------

export function useAmbassadorProfile() {
  return useApiFetch<ApiProfile>("/api/ambassadors/profile");
}

export function useAmbassadorDashboard() {
  return useApiFetch<ApiDashboard>("/api/ambassadors/dashboard");
}

export function useAmbassadorStats() {
  return useApiFetch<ApiStats>("/api/ambassadors/profile/stats");
}

/**
 * Computed stats fallback — derives stats from profile + referrals + commissions
 * when the /stats endpoint is unavailable (500).
 */
export function useComputedStats() {
  const { data: profile } = useAmbassadorProfile();
  const { data: referrals } = useAmbassadorReferrals();
  const { data: summary } = useAmbassadorCommissionsSummary();
  const { data: apiStats, error: statsError } = useAmbassadorStats();

  // If API stats work, use them
  if (apiStats && !statsError) return apiStats;

  // Otherwise compute from other endpoints
  if (!profile || !referrals) return null;

  const negociosReferidos = referrals.length;
  const negociosActivos = referrals.filter((r) => r.estado === "ACTIVE").length;
  const conversionRate = negociosReferidos > 0 ? Math.round((negociosActivos / negociosReferidos) * 100) : 0;

  return {
    negociosReferidos,
    negociosActivos,
    conversionRate,
    comisionesTotales: summary?.totalGenerado ?? "Bs 0",
    nivel: profile.nivel,
  } as ApiStats;
}

export function useAmbassadorReferrals() {
  return useApiFetch<ApiReferral[]>("/api/ambassadors/referrals");
}

export function useAmbassadorReferralMetrics() {
  return useApiFetch<ApiReferralMetrics>("/api/ambassadors/referrals/metrics");
}

export function useAmbassadorReferralDetail(referralId: string | null) {
  return useApiFetch<ApiReferralDetail>(referralId ? `/api/ambassadors/referrals/${referralId}` : null);
}

export function useAmbassadorReferralBusinessMetrics(referralId: string | null) {
  return useApiFetch<ApiReferralBusinessMetrics>(referralId ? `/api/ambassadors/referrals/${referralId}/metrics` : null);
}

export function useAmbassadorReferralUserInsights(referralId: string | null) {
  return useApiFetch<ApiReferralUserInsights>(referralId ? `/api/ambassadors/referrals/${referralId}/user-insights` : null);
}

export function useAmbassadorReferralActivity(referralId: string | null) {
  return useApiFetch<ApiReferralActivity[]>(referralId ? `/api/ambassadors/referrals/${referralId}/activity` : null);
}

export function useAmbassadorReferralNotes(referralId: string | null) {
  return useApiFetch<ApiReferralNote[]>(referralId ? `/api/ambassadors/referrals/${referralId}/notes` : null);
}

export function createAmbassadorReferralNote(referralId: string, nota: string) {
  return apiPost<ApiReferralNote>(`/api/ambassadors/referrals/${referralId}/notes`, { nota });
}

export function useAmbassadorNetworkTree() {
  return useApiFetch<ApiNetworkNode>("/api/ambassadors/network/tree");
}

export function useAmbassadorNetwork() {
  return useApiFetch<ApiNetworkMember[]>("/api/ambassadors/network");
}

export function useAmbassadorNetworkInvitations() {
  return useApiFetch<ApiNetworkInvitation[]>("/api/ambassadors/network/invitations");
}

export function createAmbassadorNetworkInvitation(payload: { email: string; nombre: string; telefono?: string }) {
  return apiPost<{ id: string; estado: string }>("/api/ambassadors/network/invitations", payload);
}

export function deleteAmbassadorNetworkInvitation(invitationId: string) {
  return apiDelete<{ mensaje: string }>(`/api/ambassadors/network/invitations/${invitationId}`);
}

export function useAmbassadorCommissions() {
  return useApiFetch<ApiCommission[]>("/api/ambassadors/commissions");
}

export function useAmbassadorCommissionsSummary() {
  return useApiFetch<ApiCommissionsSummary>("/api/ambassadors/commissions/summary");
}

export function useAmbassadorCommissionDetail(commissionId: string | null) {
  return useApiFetch<ApiCommissionDetail>(commissionId ? `/api/ambassadors/commissions/${commissionId}` : null);
}

export function disputeAmbassadorCommission(commissionId: string, payload: { motivo: string; descripcion?: string }) {
  return apiPost<{ id: string; estado: string }>(`/api/ambassadors/commissions/${commissionId}/dispute`, payload);
}

export function useAmbassadorLeads() {
  return useApiFetch<ApiLead[]>("/api/ambassadors/leads");
}

export function patchAmbassadorLead(leadId: string, payload: Partial<{
  nombre: string;
  tipo: string;
  estado: string;
  contacto: string;
  telefono: string;
  email: string;
  ciudad: string;
  pais: string;
  notas: string;
  proximaAccion: string;
  fuente: string;
  probabilidad: number;
  fechaUltimoContacto: string;
}>) {
  return apiPatch<ApiLead>(`/api/ambassadors/leads/${leadId}`, payload);
}

export function createAmbassadorLeadActivity(leadId: string, payload: { tipo: string; nota: string; fecha?: string }) {
  return apiPost<{ id: string; tipo: string; nota: string; fecha: string }>(
    `/api/ambassadors/leads/${leadId}/activities`,
    payload,
  );
}

export function updateAmbassadorLeadStatus(leadId: string, estado: string) {
  return apiPatch<{ id: string; estado: string }>(`/api/ambassadors/leads/${leadId}/status`, { estado });
}

export function convertAmbassadorLead(leadId: string) {
  return apiPost<{ referidoId: string; mensaje: string }>(`/api/ambassadors/leads/${leadId}/convert`);
}

export function useAmbassadorOnboarding() {
  return useApiFetch<ApiOnboardingSummary[]>("/api/ambassadors/onboarding");
}

export function useAmbassadorOnboardingDetail(onboardingId: string | null) {
  return useApiFetch<ApiOnboardingDetail>(onboardingId ? `/api/ambassadors/onboarding/${onboardingId}` : null);
}

export function useAmbassadorOnboardingTasks(onboardingId: string | null) {
  return useApiFetch<ApiOnboardingTask[]>(onboardingId ? `/api/ambassadors/onboarding/${onboardingId}/tasks` : null);
}

export function useAmbassadorOnboardingSnapshot(onboardingId: string | null) {
  return useApiFetch<ApiOnboardingSnapshot>(onboardingId ? `/api/ambassadors/onboarding/${onboardingId}/snapshot` : null);
}

export function useAmbassadorOnboardingMilestones() {
  return useApiFetch<ApiOnboardingMilestone[]>("/api/ambassadors/onboarding/milestones");
}

export function updateAmbassadorOnboarding(businessId: string, payload: { etapa?: string; nota?: string }) {
  return apiPatch<ApiOnboardingSummary>(`/api/ambassadors/onboarding/${businessId}`, payload);
}

export function createAmbassadorOnboardingTask(onboardingId: string, payload: { titulo: string; fechaLimite?: string }) {
  return apiPost<{ id: string; mensaje: string }>(`/api/ambassadors/onboarding/${onboardingId}/tasks`, payload);
}

export function updateAmbassadorOnboardingTaskStatus(taskId: string, estado: string) {
  return apiPatch<{ id: string; estado: string }>(`/api/ambassadors/onboarding/tasks/${taskId}/status`, { estado });
}

export function completeAmbassadorOnboardingMilestone(onboardingId: string, milestoneId: string) {
  return apiPatch<{ mensaje: string }>(`/api/ambassadors/onboarding/${onboardingId}/milestones/${milestoneId}`, {});
}

export function createAmbassadorOnboardingNote(onboardingId: string, nota: string) {
  return apiPost<{ id: string; mensaje: string }>(`/api/ambassadors/onboarding/${onboardingId}/notes`, { nota });
}

export function createAmbassadorOnboardingAction(onboardingId: string, accion: string, nota?: string) {
  return apiPost<{ id: string; estado: string }>(`/api/ambassadors/onboarding/${onboardingId}/actions`, { accion, nota });
}

export function useAmbassadorSettings() {
  return useApiFetch<ApiSettings>("/api/ambassadors/settings");
}

export function useAmbassadorReferralCodes() {
  return useApiFetch<ApiReferralCode[]>("/api/ambassadors/referral-codes");
}

export function useAmbassadorReferralLinks() {
  return useApiFetch<ApiReferralLink[]>("/api/ambassadors/referral-links");
}

export function useAmbassadorReferralLinkStats(linkId: string | null) {
  return useApiFetch<ApiReferralLinkStats>(linkId ? `/api/ambassadors/referral-links/${linkId}/stats` : null);
}

export function useAmbassadorReferralLinkQr(linkId: string | null) {
  return useApiFetch<ApiReferralLinkQr>(linkId ? `/api/ambassadors/referral-links/${linkId}/qr` : null);
}

export function createAmbassadorReferralLink(payload: { nombre: string; segmento?: string; ciudad?: string }) {
  return apiPost<{ id: string; codigo: string; url: string }>("/api/ambassadors/referral-links", payload);
}

export function useAmbassadorNetworkRanking() {
  return useApiFetch<ApiNetworkRanking[]>("/api/ambassadors/network/ranking");
}

export function useAmbassadorWallet() {
  return useApiFetch<ApiWallet>("/api/ambassadors/wallet");
}

export function useAmbassadorPayouts() {
  return useApiFetch<ApiPayout[]>("/api/ambassadors/payouts");
}

export function useAmbassadorPayoutMethods() {
  return useApiFetch<ApiPayoutMethod[]>("/api/ambassadors/payout-methods");
}

export function createAmbassadorPayoutMethod(payload: {
  tipo: string;
  banco?: string;
  numeroCuenta: string;
  titular?: string;
}) {
  return apiPost<{ id: string; mensaje: string }>("/api/ambassadors/payout-methods", payload);
}

export function withdrawAmbassadorWallet(payload: { monto: string; metodoPagoId: string }) {
  return apiPost<{ id: string; estado: string; fechaEstimada: string }>("/api/ambassadors/wallet/withdraw", payload);
}

export function useAmbassadorPerformanceReport() {
  return useApiFetch<ApiPerformanceReport>("/api/ambassadors/reports/performance");
}

export function useAmbassadorReferralsReport() {
  return useApiFetch<ApiReferralReport[]>("/api/ambassadors/reports/referrals");
}

export function useAmbassadorConversionFunnel() {
  return useApiFetch<ApiConversionFunnel>("/api/ambassadors/reports/conversion-funnel");
}

/**
 * Insights de IA del embajador desde TechMarket-AI (:8091, Gemini). Devuelve la lista de
 * insights accionables ({@link AiInsight}). No usa useApiFetch porque ese helper solo apunta al
 * servicio principal (:8082); aqui se consume el servicio de IA via apiClient (service "ai").
 */
export function useAmbassadorAiInsights() {
  const [data, setData] = useState<AiInsight[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAiInsights()
      .then((insights) => {
        if (active) setData(insights);
      })
      .catch((err) => {
        if (active) {
          setData(null);
          setError(err instanceof Error ? err.message : "No se pudieron cargar los insights de IA.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
