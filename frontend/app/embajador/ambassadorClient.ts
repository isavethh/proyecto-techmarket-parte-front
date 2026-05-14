const API_URL = process.env.NEXT_PUBLIC_TECHMARKET_API_URL || "http://localhost:8082";

export async function loginAmbassador(email = "admin@gmail.com", password = "admin") {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(`Login error ${res.status}`);

  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userId", data.userId);
  }
  return data;
}

async function ambassadorApi(path: string, options: RequestInit = {}) {
  let token = "";
  let userId = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken") || "";
    userId = localStorage.getItem("userId") || "";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.status === 204 ? null : res.json();
}

// ---------------------------------------------------------
// Perfil
// ---------------------------------------------------------

export const getProfile = () => ambassadorApi("/api/ambassadors/profile");
export const updateProfile = (body: any) => ambassadorApi("/api/ambassadors/profile", { method: "PUT", body: JSON.stringify(body) });
export const updatePhoto = (url: string) => ambassadorApi("/api/ambassadors/profile/photo", { method: "POST", body: JSON.stringify({ url }) });
export const getStats = () => ambassadorApi("/api/ambassadors/profile/stats");
export const getSettings = () => ambassadorApi("/api/ambassadors/settings");
export const updateSettings = (body: any) => ambassadorApi("/api/ambassadors/settings", { method: "PUT", body: JSON.stringify(body) });

// ---------------------------------------------------------
// Leads
// ---------------------------------------------------------

export const listLeads = () => ambassadorApi("/api/ambassadors/leads");
export const createLead = (body: any) => ambassadorApi("/api/ambassadors/leads", { method: "POST", body: JSON.stringify(body) });
export const getLead = (id: string) => ambassadorApi(`/api/ambassadors/leads/${id}`);
export const updateLead = (id: string, body: any) => ambassadorApi(`/api/ambassadors/leads/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const updateLeadStatus = (id: string, estado: string) => ambassadorApi(`/api/ambassadors/leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ estado }) });
export const convertLead = (id: string) => ambassadorApi(`/api/ambassadors/leads/${id}/convert`, { method: "POST" });
export const deleteLead = (id: string) => ambassadorApi(`/api/ambassadors/leads/${id}`, { method: "DELETE" });

// ---------------------------------------------------------
// Referidos y links
// ---------------------------------------------------------

export const listReferrals = () => ambassadorApi("/api/ambassadors/referrals");
export const createReferral = (body: any) => ambassadorApi("/api/ambassadors/referrals", { method: "POST", body: JSON.stringify(body) });
export const getReferral = (id: string) => ambassadorApi(`/api/ambassadors/referrals/${id}`);
export const updateReferralStatus = (id: string, estado: string) => ambassadorApi(`/api/ambassadors/referrals/${id}/status`, { method: "PATCH", body: JSON.stringify({ estado }) });
export const addReferralNote = (id: string, nota: string) => ambassadorApi(`/api/ambassadors/referrals/${id}/notes`, { method: "POST", body: JSON.stringify({ nota }) });

export const listReferralLinks = () => ambassadorApi("/api/ambassadors/referral-links");
export const createReferralLink = (body: any) => ambassadorApi("/api/ambassadors/referral-links", { method: "POST", body: JSON.stringify(body) });
export const getReferralQr = (id: string) => ambassadorApi(`/api/ambassadors/referral-links/${id}/qr`);

// ---------------------------------------------------------
// Comisiones y wallet
// ---------------------------------------------------------

export const listCommissions = () => ambassadorApi("/api/ambassadors/commissions");
export const getCommissionsSummary = () => ambassadorApi("/api/ambassadors/commissions/summary");
export const getWallet = () => ambassadorApi("/api/ambassadors/wallet");
export const withdraw = (body: any) => ambassadorApi("/api/ambassadors/wallet/withdraw", { method: "POST", body: JSON.stringify(body) });
export const listPayoutMethods = () => ambassadorApi("/api/ambassadors/payout-methods");
export const createPayoutMethod = (body: any) => ambassadorApi("/api/ambassadors/payout-methods", { method: "POST", body: JSON.stringify(body) });

// ---------------------------------------------------------
// Misiones, onboarding, red, chat, reportes e IA
// ---------------------------------------------------------

export const listMissions = () => ambassadorApi("/api/ambassadors/missions");
export const startMission = (id: string) => ambassadorApi(`/api/ambassadors/missions/${id}/start`, { method: "PATCH" });
export const completeMission = (id: string) => ambassadorApi(`/api/ambassadors/missions/${id}/complete`, { method: "PATCH" });

export const listOnboarding = () => ambassadorApi("/api/ambassadors/onboarding");
export const getNetwork = () => ambassadorApi("/api/ambassadors/network");
export const listChats = () => ambassadorApi("/api/ambassadors/chats");
export const getPerformanceReport = () => ambassadorApi("/api/ambassadors/reports/performance");
export const aiQuery = (consulta: string) => ambassadorApi("/api/ambassadors/ai/query", { method: "POST", body: JSON.stringify({ consulta }) });
export const aiInsights = () => ambassadorApi("/api/ambassadors/ai/insights");
