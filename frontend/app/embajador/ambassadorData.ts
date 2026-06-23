// Tipos y configuración estática del módulo embajador. Los datasets mock de demostración
// (ambassadorProfile, referredAmbassadors, referredBusinesses, prospectosData, onboardingBusinessData)
// se eliminaron: las páginas consumen datos reales del backend vía useAmbassadorApi o muestran
// estado vacío. Solo se conservan los tipos (usados por los mappers api→ui) y las listas de
// configuración (fuentes de lead y etapas de pipeline), que no son datos de negocio simulados.

export type AmbassadorLevel = 1 | 2 | 3;

export type ReferredBusiness = {
  id: string;
  name: string;
  category: string;
  city: string;
  referredAt: string;
  status: "Activo" | "En onboarding";
  monthlyLeads: number;
  conversionRate: number;
  growthRate: number;
  rating: number;
  userScore: number;
  userView: string;
  topComment: string;
  valueScore: number;
  commissionGenerated: number;
  reputationContribution: number;
  strengths: string[];
  risks: string[];
};

export type ReferredAmbassador = {
  id: string;
  name: string;
  level: AmbassadorLevel;
  focus: string;
  referredAt: string;
  status: "Activo" | "En formacion";
  activeBusinesses: number;
};

export const prospectLeadSources = ["Visita", "Redes", "Referido", "Evento"] as const;
export type LeadSource = (typeof prospectLeadSources)[number];

export const prospectPipelineStages = [
  "Nuevo",
  "Contactado",
  "Interesado",
  "Demo agendada",
  "En onboarding",
  "Activo",
  "Perdido",
] as const;
export type ProspectStage = (typeof prospectPipelineStages)[number];

export type ProspectStatus = "Activo" | "Perdido";

export type ProspectAction = {
  id: string;
  title: string;
  happenedAt: string;
  summary: string;
};

export type Prospect = {
  id: string;
  businessName: string;
  category: string;
  city: string;
  contactName: string;
  phone: string;
  source: LeadSource;
  currentStage: ProspectStage;
  createdAt: string;
  nextAction: string;
  nextActionDate: string;
  status: ProspectStatus;
  ambassadorNotes: string;
  actionHistory: ProspectAction[];
};

export type OnboardingNote = {
  text: string;
  date: string;
};

export type BusinessOnboardingSnapshot = {
  emailVerified: boolean;
  basicDataComplete: boolean;
  profileDescription: string;
  category: string;
  location: string;
  productsCount: number;
  postsCount: number;
  evidenceCount: number;
  promotionCreated: boolean;
};

export type BusinessOnboardingValidated = {
  profile: boolean;
  catalog: boolean;
  post: boolean;
  evidence: boolean;
  promotion: boolean;
};

export type BusinessOnboardingTracking = {
  responsible: "Embajador" | "Negocio";
  nextActionDate: string;
  lastAction: string;
};

export type BusinessOnboardingMetrics = {
  startedAt: string;
  activatedAt?: string;
  daysToActivate?: number;
  leadsAfterActivation?: number;
};

export type BusinessOnboarding = {
  id: string;
  businessId: ReferredBusiness["id"];
  isActive: boolean;
  progress: number;
  currentStep: string;
  completedSteps: string[];
  nextAction: string;
  alerts: string[];
  lastUpdate: string;
  snapshot: BusinessOnboardingSnapshot;
  validated: BusinessOnboardingValidated;
  tracking: BusinessOnboardingTracking;
  metrics: BusinessOnboardingMetrics;
  notes: OnboardingNote[];
};
