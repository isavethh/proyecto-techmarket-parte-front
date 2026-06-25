"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmbajadorSidebar } from "../EmbajadorSidebar";
import { EmbajadorPageHeader } from "../EmbajadorPageHeader";
import {
  completeAmbassadorOnboardingMilestone,
  createAmbassadorOnboardingAction,
  createAmbassadorOnboardingNote,
  createAmbassadorOnboardingTask,
  updateAmbassadorOnboarding,
  updateAmbassadorOnboardingTaskStatus,
  useAmbassadorOnboarding,
  useAmbassadorOnboardingDetail,
  useAmbassadorOnboardingMilestones,
  useAmbassadorOnboardingSnapshot,
  useAmbassadorOnboardingTasks,
  useAmbassadorProfile,
  type ApiOnboardingSummary,
} from "../useAmbassadorApi";

type OnboardingNote = {
  text: string;
  date: string;
};

type BusinessOnboarding = {
  id: string;
  businessId: string;
  isActive: boolean;
  progress: number;
  currentStep: string;
  completedSteps: string[];
  nextAction: string;
  alerts: string[];
  lastUpdate: string;
  snapshot: {
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
  validated: {
    profile: boolean;
    catalog: boolean;
    post: boolean;
    evidence: boolean;
    promotion: boolean;
  };
  tracking: {
    responsible: "Embajador" | "Negocio";
    nextActionDate: string;
    lastAction: string;
  };
  metrics: {
    startedAt: string;
    activatedAt?: string;
    daysToActivate?: number;
    leadsAfterActivation?: number;
  };
  notes: OnboardingNote[];
};

type OnboardingStatus = "Onboarding activo" | "Completado" | "Estancado";
type OnboardingFilter = "Todos" | OnboardingStatus;

const MIN_DESCRIPTION_LENGTH = 60;
const TOTAL_CORE_STEPS = 6;

const filters: OnboardingFilter[] = ["Todos", "Onboarding activo", "Completado", "Estancado"];

const filterLabel: Record<OnboardingFilter, string> = {
  Todos: "Todos",
  "Onboarding activo": "Onboarding activo",
  Completado: "Completado",
  Estancado: "Estancado",
};

const clampProgress = (progress: number) => Math.min(100, Math.max(0, Math.round(progress)));

const statusTone = (status: OnboardingStatus) => {
  if (status === "Completado") {
    return "border-emerald-200/30 bg-emerald-300/12 text-emerald-50";
  }

  if (status === "Estancado") {
    return "border-rose-200/30 bg-rose-300/12 text-rose-50";
  }

  return "border-cyan-200/30 bg-cyan-300/12 text-cyan-50";
};

const formatIsoToDisplayDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const daysBetween = (fromIso: string, toDate: Date) => {
  const from = new Date(fromIso);
  if (Number.isNaN(from.getTime())) {
    return 0;
  }

  const diff = Math.max(0, toDate.getTime() - from.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const getBusinessName = (businessId: string) => businessId || "Negocio";

const normalizeBackendOnboardingStatus = (status: string) => {
  const normalizedStatus = status.trim().toUpperCase();
  if (normalizedStatus.includes("COMPLET") || normalizedStatus.includes("ACTIVE") || normalizedStatus.includes("ACTIVO")) {
    return "Completado" as const;
  }
  if (normalizedStatus.includes("STUCK") || normalizedStatus.includes("ESTANC")) {
    return "Estancado" as const;
  }
  return "Onboarding activo" as const;
};

const buildCompletedStepsFromProgress = (progress: number) => {
  const availableSteps = ["Registro", "Perfil", "Catálogo", "Primera publicación", "Evidencia", "Promoción"];
  const completedCount = Math.min(TOTAL_CORE_STEPS, Math.max(0, Math.round((progress / 100) * TOTAL_CORE_STEPS)));
  return availableSteps.slice(0, completedCount);
};

const mapApiOnboardingToLocal = (item: ApiOnboardingSummary): BusinessOnboarding => {
  const status = normalizeBackendOnboardingStatus(item.estado);
  const isActive = status === "Completado";
  const progress = clampProgress(item.progreso);
  const completedSteps = buildCompletedStepsFromProgress(progress);
  const currentStep = isActive ? "Activo" : completedSteps.at(-1) ?? "Registro";
  const todayIso = new Date().toISOString().slice(0, 10);

  return {
    id: item.id,
    businessId: item.nombre || item.referidoId,
    isActive,
    progress,
    currentStep,
    completedSteps,
    nextAction: isActive ? "Onboarding completado" : "Continuar seguimiento del onboarding",
    alerts: status === "Estancado" ? ["Proceso detenido"] : [],
    lastUpdate: todayIso,
    snapshot: {
      emailVerified: progress >= 16,
      basicDataComplete: progress >= 16,
      profileDescription: "",
      category: "",
      location: "",
      productsCount: 0,
      postsCount: 0,
      evidenceCount: 0,
      promotionCreated: progress >= 100,
    },
    validated: {
      profile: progress >= 33,
      catalog: progress >= 50,
      post: progress >= 66,
      evidence: progress >= 83,
      promotion: progress >= 100,
    },
    tracking: {
      responsible: isActive ? "Negocio" : "Embajador",
      nextActionDate: formatIsoToDisplayDate(todayIso),
      lastAction: `Estado backend: ${item.estado}`,
    },
    metrics: {
      startedAt: todayIso,
      activatedAt: isActive ? todayIso : undefined,
    },
    notes: [],
  };
};

const computeValidated = (onboarding: BusinessOnboarding) => {
  const registrationOk = onboarding.snapshot.emailVerified && onboarding.snapshot.basicDataComplete;
  const profileOk =
    onboarding.snapshot.profileDescription.trim().length >= MIN_DESCRIPTION_LENGTH &&
    onboarding.snapshot.category.trim().length > 0 &&
    onboarding.snapshot.location.trim().length >= 3;
  const catalogOk = onboarding.snapshot.productsCount >= 1;
  const postOk = onboarding.snapshot.postsCount >= 1;
  const evidenceOk = onboarding.snapshot.evidenceCount >= 2;
  const promotionOk = onboarding.snapshot.promotionCreated;

  return {
    registrationOk,
    validated: {
      profile: profileOk,
      catalog: catalogOk,
      post: postOk,
      evidence: evidenceOk,
      promotion: promotionOk,
    },
  };
};

const computeCompletedSteps = (registrationOk: boolean, validated: BusinessOnboarding["validated"]) => {
  const completed: string[] = [];
  if (registrationOk) completed.push("Registro");
  if (validated.profile) completed.push("Perfil");
  if (validated.catalog) completed.push("Catálogo");
  if (validated.post) completed.push("Primera publicación");
  if (validated.evidence) completed.push("Evidencia");
  if (validated.promotion) completed.push("Promoción");
  return completed;
};

const computeCurrentStep = (registrationOk: boolean, validated: BusinessOnboarding["validated"], isActive: boolean) => {
  if (isActive) return "Activo";
  if (!registrationOk) return "Registro";
  if (!validated.profile) return "Perfil";
  if (!validated.catalog) return "Catálogo";
  if (!validated.post) return "Primera publicación";
  if (!validated.evidence) return "Evidencia";
  if (!validated.promotion) return "Promoción";
  return "Listo para activar";
};

const computeRecommended = (currentStep: string) => {
  switch (currentStep) {
    case "Registro":
      return { message: "Verificar registro para continuar onboarding", actionKey: "verify_email", cta: "Verificar" };
    case "Perfil":
      return { message: "Completar perfil del negocio para destrabar catálogo", actionKey: "edit_profile", cta: "Editar perfil" };
    case "Catálogo":
      return { message: "Completar catálogo para empezar a recibir leads", actionKey: "add_products", cta: "Agregar productos" };
    case "Primera publicación":
      return { message: "Crear primera publicación para activar promoción", actionKey: "create_post", cta: "Crear post" };
    case "Evidencia":
      return { message: "Subir evidencia real para generar confianza", actionKey: "upload_evidence", cta: "Subir fotos" };
    case "Promoción":
      return { message: "Crear campaña o post promocionado", actionKey: "create_campaign", cta: "Crear campaña" };
    case "Listo para activar":
      return { message: "Todo listo. Activar negocio para empezar a recibir leads", actionKey: "activate", cta: "Activar negocio" };
    default:
      return { message: "Onboarding completado", actionKey: "", cta: "" };
  }
};

const computeAlerts = (onboarding: BusinessOnboarding, now: Date, currentStep: string) => {
  const alerts: string[] = [];
  const daysWithoutUpdate = daysBetween(onboarding.lastUpdate, now);

  if (!onboarding.isActive && daysWithoutUpdate >= 3) {
    alerts.push("Sin actividad en 3 días");
    alerts.push("Proceso detenido");
  }

  if (!onboarding.isActive && onboarding.snapshot.postsCount < 1) {
    alerts.push("Sin publicaciones");
  }

  if (!onboarding.isActive && onboarding.snapshot.evidenceCount < 2) {
    alerts.push("Evidencia pendiente");
  }

  if (!onboarding.isActive && currentStep === "Catálogo" && onboarding.snapshot.productsCount < 1) {
    alerts.push("Catálogo pendiente");
  }

  return Array.from(new Set(alerts));
};

const computeStatus = (onboarding: BusinessOnboarding) => {
  if (onboarding.isActive) return "Completado" as const;
  if (onboarding.alerts.includes("Proceso detenido")) return "Estancado" as const;
  return "Onboarding activo" as const;
};

const recalculateOnboarding = (onboarding: BusinessOnboarding) => {
  const now = new Date();
  const { registrationOk, validated } = computeValidated(onboarding);
  const completedSteps = computeCompletedSteps(registrationOk, validated);
  const currentStep = computeCurrentStep(registrationOk, validated, onboarding.isActive);
  const progress = clampProgress((completedSteps.length / TOTAL_CORE_STEPS) * 100);
  const recommended = computeRecommended(currentStep);
  const alerts = computeAlerts(onboarding, now, currentStep);

  const responsible: BusinessOnboarding["tracking"]["responsible"] =
    currentStep === "Registro" || currentStep === "Perfil" ? "Embajador" : "Negocio";

  const nextActionDate = new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000));

  return {
    ...onboarding,
    validated,
    completedSteps,
    progress,
    currentStep,
    nextAction: recommended.message,
    alerts,
    tracking: {
      ...onboarding.tracking,
      responsible,
      nextActionDate,
    },
  };
};

const applyOnboardingAction = (onboarding: BusinessOnboarding, actionKey: string) => {
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);

  const next: BusinessOnboarding = {
    ...onboarding,
    lastUpdate: todayIso,
  };

  switch (actionKey) {
    case "verify_email":
      next.snapshot = {
        ...next.snapshot,
        emailVerified: true,
        basicDataComplete: true,
      };
      next.tracking = { ...next.tracking, lastAction: "Registro verificado" };
      break;
    case "edit_profile":
      next.snapshot = {
        ...next.snapshot,
        profileDescription:
          next.snapshot.profileDescription.trim().length >= MIN_DESCRIPTION_LENGTH
            ? next.snapshot.profileDescription
            : "Negocio con enfoque tecnologico, atención personalizada y propuesta clara para clientes. Servicio confiable y rápido.",
        category: next.snapshot.category.trim().length ? next.snapshot.category : "Tienda y accesorios",
        location: next.snapshot.location.trim().length ? next.snapshot.location : "Santa Cruz",
      };
      next.tracking = { ...next.tracking, lastAction: "Perfil actualizado" };
      break;
    case "add_products":
      next.snapshot = {
        ...next.snapshot,
        productsCount: Math.max(1, next.snapshot.productsCount),
      };
      next.tracking = { ...next.tracking, lastAction: "Catálogo actualizado" };
      break;
    case "create_post":
      next.snapshot = {
        ...next.snapshot,
        postsCount: Math.max(1, next.snapshot.postsCount),
      };
      next.tracking = { ...next.tracking, lastAction: "Primera publicación creada" };
      break;
    case "upload_evidence":
      next.snapshot = {
        ...next.snapshot,
        evidenceCount: Math.max(2, next.snapshot.evidenceCount),
      };
      next.tracking = { ...next.tracking, lastAction: "Evidencia cargada" };
      break;
    case "create_campaign":
      next.snapshot = {
        ...next.snapshot,
        promotionCreated: true,
      };
      next.tracking = { ...next.tracking, lastAction: "Promoción creada" };
      break;
    default:
      break;
  }

  return recalculateOnboarding(next);
};

export default function EmbajadorOnboardingPage() {
  const [activeFilter, setActiveFilter] = useState<OnboardingFilter>("Todos");
  const { data: profile } = useAmbassadorProfile();
  const {
    data: apiOnboarding,
    loading: onboardingLoading,
    error: onboardingError,
  } = useAmbassadorOnboarding();

  const sourceOnboardingState = useMemo(
    () => (apiOnboarding?.length ? apiOnboarding.map(mapApiOnboardingToLocal) : []),
    [apiOnboarding],
  );
  const normalizedOnboardingState = useMemo(
    () => sourceOnboardingState.map((item) => recalculateOnboarding(item)),
    [sourceOnboardingState],
  );

  const [activeBusinessId, setActiveBusinessId] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [backendFeedback, setBackendFeedback] = useState<string | null>(null);

  const filteredBusinesses = useMemo(() => {
    const withStatus = normalizedOnboardingState.map((item) => ({
      ...item,
      _computedStatus: computeStatus(item),
    }));

    if (activeFilter === "Todos") {
      return withStatus;
    }

    return withStatus.filter((business) => business._computedStatus === activeFilter);
  }, [activeFilter, normalizedOnboardingState]);

  const handleFilterChange = (nextFilter: OnboardingFilter) => {
    setActiveFilter(nextFilter);
    const nextBusinesses =
      nextFilter === "Todos"
        ? normalizedOnboardingState
        : normalizedOnboardingState.filter((business) => computeStatus(business) === nextFilter);
    setActiveBusinessId(nextBusinesses[0]?.id ?? "");
  };

  const activeBusiness = useMemo(
    () => filteredBusinesses.find((business) => business.id === activeBusinessId) ?? filteredBusinesses[0] ?? null,
    [filteredBusinesses, activeBusinessId],
  );
  const { data: onboardingDetail, refetch: refetchOnboardingDetail } = useAmbassadorOnboardingDetail(activeBusiness?.id ?? null);
  const { data: onboardingSnapshot, refetch: refetchOnboardingSnapshot } = useAmbassadorOnboardingSnapshot(activeBusiness?.id ?? null);
  const { data: onboardingTasks, refetch: refetchOnboardingTasks } = useAmbassadorOnboardingTasks(activeBusiness?.id ?? null);
  const { data: onboardingMilestones } = useAmbassadorOnboardingMilestones();
  const displayedBusiness = useMemo(() => {
    if (!activeBusiness) return null;
    if (!onboardingSnapshot) return activeBusiness;

    const completedSteps = onboardingSnapshot.checklist.filter((item) => item.completado).map((item) => item.nombre);

    return recalculateOnboarding({
      ...activeBusiness,
      businessId: onboardingSnapshot.perfil.nombre ?? activeBusiness.businessId,
      completedSteps,
      snapshot: {
        emailVerified: onboardingSnapshot.checklist[0]?.completado ?? false,
        basicDataComplete: onboardingSnapshot.checklist[0]?.completado ?? false,
        profileDescription: onboardingSnapshot.perfil.tipo ?? "",
        category: onboardingSnapshot.perfil.tipo ?? "",
        location: [onboardingSnapshot.perfil.ciudad, onboardingSnapshot.perfil.pais].filter(Boolean).join(", "),
        productsCount: onboardingSnapshot.catalogo.totalProductos,
        postsCount: onboardingSnapshot.publicaciones.length,
        evidenceCount: onboardingSnapshot.evidencias.length,
        promotionCreated: Boolean(onboardingSnapshot.promocion.codigo),
      },
      notes: onboardingSnapshot.notas.map((note) => ({ text: note.nota, date: note.fecha })),
      tracking: {
        ...activeBusiness.tracking,
        lastAction: onboardingSnapshot.accionesPendientes.length
          ? `${onboardingSnapshot.accionesPendientes.length} acciones pendientes`
          : activeBusiness.tracking.lastAction,
      },
    });
  }, [activeBusiness, onboardingSnapshot]);

  const handleItemAction = async (actionKey: string) => {
    if (!activeBusiness) {
      return;
    }

    try {
      await createAmbassadorOnboardingAction(activeBusiness.id, actionKey, `Accion ejecutada desde front: ${actionKey}`);
      await updateAmbassadorOnboarding(activeBusiness.id, {
        etapa: activeBusiness.currentStep,
        nota: `Accion ejecutada desde front: ${actionKey}`,
      });
      setBackendFeedback("Onboarding actualizado en backend.");
      await refetchOnboardingDetail();
      await refetchOnboardingSnapshot();
    } catch (error) {
      setBackendFeedback(error instanceof Error ? error.message : "No se pudo sincronizar onboarding.");
    }
  };

  const handleActivate = async () => {
    if (!activeBusiness) {
      return;
    }

    const { registrationOk, validated } = computeValidated(activeBusiness);
    const canActivate =
      registrationOk &&
      validated.profile &&
      validated.catalog &&
      validated.post &&
      validated.evidence &&
      validated.promotion;

    if (!canActivate || activeBusiness.isActive) {
      return;
    }

    const now = new Date();
    const todayIso = now.toISOString().slice(0, 10);
    const startedAt = new Date(activeBusiness.metrics.startedAt);
    const daysToActivate = Number.isNaN(startedAt.getTime())
      ? undefined
      : Math.max(0, Math.ceil((now.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)));

    try {
      await updateAmbassadorOnboarding(activeBusiness.id, {
        etapa: "ACTIVE",
        nota: "Negocio activado desde el panel de embajador",
      });
      setBackendFeedback("Negocio activado en backend.");
      await refetchOnboardingDetail();
      await refetchOnboardingSnapshot();
    } catch (error) {
      setBackendFeedback(error instanceof Error ? error.message : "No se pudo activar en backend.");
    }
  };

  const handleCreateBackendTask = async () => {
    if (!activeBusiness) return;

    try {
      await createAmbassadorOnboardingTask(activeBusiness.id, {
        titulo: computeRecommended(activeBusiness.currentStep).message,
        fechaLimite: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      });
      setBackendFeedback("Tarea creada en backend.");
      await refetchOnboardingTasks();
    } catch (error) {
      setBackendFeedback(error instanceof Error ? error.message : "No se pudo crear la tarea.");
    }
  };

  const handleCompleteBackendTask = async (taskId: string) => {
    try {
      await updateAmbassadorOnboardingTaskStatus(taskId, "completada");
      setBackendFeedback("Tarea completada.");
      await refetchOnboardingTasks();
      await refetchOnboardingDetail();
    } catch (error) {
      setBackendFeedback(error instanceof Error ? error.message : "No se pudo completar la tarea.");
    }
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    if (!activeBusiness) return;

    try {
      await completeAmbassadorOnboardingMilestone(activeBusiness.id, milestoneId);
      setBackendFeedback("Hito marcado como completado.");
      await refetchOnboardingDetail();
    } catch (error) {
      setBackendFeedback(error instanceof Error ? error.message : "No se pudo completar el hito.");
    }
  };

  const handleAddNote = async () => {
    if (!activeBusiness) {
      return;
    }

    const text = noteDraft.trim();
    if (!text) {
      return;
    }

    try {
      await createAmbassadorOnboardingNote(activeBusiness.id, text);
      setNoteDraft("");
      setBackendFeedback("Nota agregada en backend.");
      await refetchOnboardingSnapshot();
    } catch (error) {
      setBackendFeedback(error instanceof Error ? error.message : "No se pudo agregar la nota.");
    }
  };

  return (
    <div className="flex-1 pb-10">
      <EmbajadorPageHeader
        profile={profile}
        statusMessage="Seguimiento de onboarding de negocios"
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_320px_minmax(0,1fr)] xl:grid-cols-[300px_360px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="onboarding" profile={profile} />

        <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-scroll lg:pr-2 chat-scrollbar">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">ONBOARDING</p>
            <h1 className="mt-3 text-xl font-semibold text-cyan-50">Lista</h1>
            <p className="mt-2 text-sm text-cyan-100/80">Filtro + progreso automático + estado real.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isActive = filter === activeFilter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleFilterChange(filter)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                      isActive
                        ? "border-cyan-300/45 bg-cyan-300/14 text-cyan-50"
                        : "border-cyan-100/15 bg-white/5 text-cyan-100/75 hover:border-cyan-200/35 hover:bg-cyan-300/10"
                    }`}
                  >
                    {filterLabel[filter]}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-2">
              {onboardingLoading ? (
                <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/80">
                  Cargando onboarding real...
                </div>
              ) : null}
              {onboardingError ? (
                <div className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-4 text-sm text-rose-100">
                  No se pudo cargar onboarding real: {onboardingError}
                </div>
              ) : null}
              {filteredBusinesses.map((business) => {
                const isSelected = business.id === activeBusiness?.id;
                const progress = clampProgress(business.progress);
                const status = (business as BusinessOnboarding & { _computedStatus: OnboardingStatus })._computedStatus;
                const completedLabel = `${business.completedSteps.length}/${TOTAL_CORE_STEPS} completado`;

                return (
                  <button
                    key={business.id}
                    type="button"
                    onClick={() => setActiveBusinessId(business.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? "border-cyan-300/45 bg-cyan-300/14"
                        : "border-cyan-100/10 bg-white/5 hover:border-cyan-200/35 hover:bg-cyan-300/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-cyan-50">
                          {getBusinessName(business.businessId)}
                        </p>
                        <p className="mt-1 text-xs text-cyan-100/70">Etapa actual: {business.currentStep}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] ${statusTone(status)}`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-xs text-cyan-100/80 sm:grid-cols-2">
                      <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2">
                        Progreso: <strong className="text-cyan-50">{progress}%</strong>
                      </div>
                      <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2">
                        Estado: <strong className="text-cyan-50">{completedLabel}</strong>
                      </div>
                      <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2 sm:col-span-2">
                        Último update: <strong className="text-cyan-50">{formatIsoToDisplayDate(business.lastUpdate)}</strong>
                      </div>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full border border-cyan-100/10 bg-slate-950/45">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.92))]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}

              {!filteredBusinesses.length ? (
                <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/80">
                  No hay negocios para este filtro.
                </div>
              ) : null}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          {activeBusiness ? (
            <>
              <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
                <p className="tech-mono text-xs text-cyan-200/75">DETALLE</p>

                <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-bold text-cyan-50">
                      {getBusinessName(displayedBusiness?.businessId ?? activeBusiness.businessId)}
                    </h2>
                    <p className="mt-2 text-sm text-cyan-100/82">
                      Etapa actual: <strong className="text-cyan-50">{activeBusiness.currentStep}</strong>
                    </p>
                    <p className="mt-1 text-sm text-cyan-100/75">
                      Último update: <strong className="text-cyan-50">{formatIsoToDisplayDate(activeBusiness.lastUpdate)}</strong>
                    </p>
                  </div>

                  {(() => {
                    const status = computeStatus(activeBusiness);
                    return (
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(status)}`}>
                        {status}
                      </span>
                    );
                  })()}
                </div>

                <div className="mt-5 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">Acción recomendada</p>
                      <p className="mt-1 text-sm text-cyan-100/80">{computeRecommended(activeBusiness.currentStep).message}</p>
                    </div>

                    {activeBusiness.currentStep === "Listo para activar" ? (
                      <button
                        type="button"
                        onClick={handleActivate}
                        className="tech-button tech-button-primary px-4 py-2 text-xs"
                      >
                        Activar negocio
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleItemAction(computeRecommended(activeBusiness.currentStep).actionKey)}
                        className="tech-button tech-button-primary px-4 py-2 text-xs"
                      >
                        {computeRecommended(activeBusiness.currentStep).cta || "Ir"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Progreso (%)</p>
                    <p className="mt-2 text-2xl font-bold text-cyan-50">{clampProgress(activeBusiness.progress)}%</p>
                  </article>
                  <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Pasos completados</p>
                    <p className="mt-2 text-2xl font-bold text-cyan-50">
                      {activeBusiness.completedSteps.length}/{TOTAL_CORE_STEPS}
                    </p>
                  </article>
                  <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Responsable</p>
                    <p className="mt-2 text-2xl font-bold text-cyan-50">{activeBusiness.tracking.responsible}</p>
                  </article>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full border border-cyan-100/10 bg-slate-950/45">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.92))]"
                    style={{ width: `${clampProgress(activeBusiness.progress)}%` }}
                  />
                </div>

                {activeBusiness.isActive ? (
                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <article className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Fecha de activación</p>
                      <p className="mt-2 text-lg font-bold text-emerald-50">
                        {activeBusiness.metrics.activatedAt ? formatIsoToDisplayDate(activeBusiness.metrics.activatedAt) : "-"}
                      </p>
                    </article>
                    <article className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Tiempo onboarding</p>
                      <p className="mt-2 text-lg font-bold text-emerald-50">
                        {typeof activeBusiness.metrics.daysToActivate === "number" ? `${activeBusiness.metrics.daysToActivate} días` : "-"}
                      </p>
                    </article>
                    <article className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Leads post-activación</p>
                      <p className="mt-2 text-lg font-bold text-emerald-50">
                        {typeof activeBusiness.metrics.leadsAfterActivation === "number" ? activeBusiness.metrics.leadsAfterActivation : "-"}
                      </p>
                    </article>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Tareas e hitos reales</h3>
                    <p className="mt-1 text-sm text-cyan-100/75">
                      Estado backend: {onboardingDetail?.estado ?? activeBusiness.currentStep} · Progreso backend:{" "}
                      {onboardingDetail?.progreso ?? activeBusiness.progress}%
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCreateBackendTask()}
                    className="tech-button tech-button-primary px-4 py-2 text-xs"
                  >
                    Crear tarea sugerida
                  </button>
                </div>

                {backendFeedback ? (
                  <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-3 text-sm text-cyan-100/80">
                    {backendFeedback}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-cyan-50">Tareas</p>
                    <div className="mt-3 space-y-2">
                      {(onboardingTasks ?? []).map((task) => (
                        <div key={task.id} className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-sm text-cyan-100/80">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-cyan-50">{task.titulo}</span>
                            <span className="text-xs text-cyan-100/60">{task.estado}</span>
                          </div>
                          <p className="mt-1 text-xs text-cyan-100/60">Límite: {task.fechaLimite ?? "Sin fecha"}</p>
                          {task.estado !== "completada" ? (
                            <button
                              type="button"
                              onClick={() => void handleCompleteBackendTask(task.id)}
                              className="mt-3 rounded-xl border border-emerald-200/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100"
                            >
                              Completar
                            </button>
                          ) : null}
                        </div>
                      ))}
                      {(onboardingTasks ?? []).length === 0 ? <p className="text-sm text-cyan-100/60">Sin tareas registradas.</p> : null}
                    </div>
                  </article>

                  <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-cyan-50">Hitos</p>
                    <div className="mt-3 space-y-2">
                      {(onboardingDetail?.pasos ?? onboardingMilestones ?? []).map((milestone) => (
                        <div key={milestone.id} className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-sm text-cyan-100/80">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-cyan-50">{milestone.nombre}</span>
                            {"completado" in milestone ? (
                              <span className="text-xs text-cyan-100/60">{milestone.completado ? "Completado" : "Pendiente"}</span>
                            ) : null}
                          </div>
                          {!("completado" in milestone) || !milestone.completado ? (
                            <button
                              type="button"
                              onClick={() => void handleCompleteMilestone(milestone.id)}
                              className="mt-3 rounded-xl border border-emerald-200/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100"
                            >
                              Marcar completado
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold text-white">Checklist completo</h3>
                  <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                    {activeBusiness.completedSteps.length}/{TOTAL_CORE_STEPS} completado
                  </span>
                </div>

                {(() => {
                  const { registrationOk, validated } = computeValidated(activeBusiness);
                  const canCatalog = registrationOk && validated.profile;
                  const canPost = canCatalog && validated.catalog;
                  const canEvidence = canPost && validated.post;
                  const canPromotion = canPost && validated.post;
                  const canActivate =
                    registrationOk &&
                    validated.profile &&
                    validated.catalog &&
                    validated.post &&
                    validated.evidence &&
                    validated.promotion;

                  const checklistSections = [
                    {
                      id: "registro",
                      title: "1. Registro completo",
                      items: [
                        {
                          id: "email",
                          label: "email verificado",
                          done: activeBusiness.snapshot.emailVerified,
                          actionKey: "verify_email",
                          actionLabel: "Verificar",
                          disabled: false,
                          disabledReason: "",
                        },
                        {
                          id: "basicos",
                          label: "datos completos",
                          done: activeBusiness.snapshot.basicDataComplete,
                          actionKey: "verify_email",
                          actionLabel: "Completar",
                          disabled: false,
                          disabledReason: "",
                        },
                      ],
                    },
                    {
                      id: "perfil",
                      title: "2. Perfil del negocio",
                      items: [
                        {
                          id: "descripcion",
                          label: `descripción (>${MIN_DESCRIPTION_LENGTH} caracteres)`,
                          done: activeBusiness.snapshot.profileDescription.trim().length >= MIN_DESCRIPTION_LENGTH,
                          actionKey: "edit_profile",
                          actionLabel: "Editar perfil",
                          disabled: !registrationOk,
                          disabledReason: "Completa el registro primero",
                        },
                        {
                          id: "categoria",
                          label: "categoría seleccionada",
                          done: activeBusiness.snapshot.category.trim().length > 0,
                          actionKey: "edit_profile",
                          actionLabel: "Editar perfil",
                          disabled: !registrationOk,
                          disabledReason: "Completa el registro primero",
                        },
                        {
                          id: "ubicacion",
                          label: "ubicación válida",
                          done: activeBusiness.snapshot.location.trim().length >= 3,
                          actionKey: "edit_profile",
                          actionLabel: "Editar perfil",
                          disabled: !registrationOk,
                          disabledReason: "Completa el registro primero",
                        },
                      ],
                    },
                    {
                      id: "catalogo",
                      title: "3. Catálogo",
                      items: [
                        {
                          id: "productos",
                          label: "mínimo 1 producto o servicio",
                          done: activeBusiness.snapshot.productsCount >= 1,
                          actionKey: "add_products",
                          actionLabel: "Agregar productos",
                          disabled: !canCatalog,
                          disabledReason: "Completa el perfil primero",
                        },
                      ],
                    },
                    {
                      id: "publicacion",
                      title: "4. Primera publicación",
                      items: [
                        {
                          id: "post",
                          label: "mínimo 1 post",
                          done: activeBusiness.snapshot.postsCount >= 1,
                          actionKey: "create_post",
                          actionLabel: "Crear post",
                          disabled: !canPost,
                          disabledReason: "No puedes publicar sin catálogo",
                        },
                      ],
                    },
                    {
                      id: "evidencia",
                      title: "5. Evidencia",
                      items: [
                        {
                          id: "fotos",
                          label: "fotos reales (mín. 2)",
                          done: activeBusiness.snapshot.evidenceCount >= 2,
                          actionKey: "upload_evidence",
                          actionLabel: "Subir fotos",
                          disabled: !canEvidence,
                          disabledReason: "Primero crea una publicación",
                        },
                        {
                          id: "trabajos",
                          label: "trabajos realizados (mín. 2)",
                          done: activeBusiness.snapshot.evidenceCount >= 2,
                          actionKey: "upload_evidence",
                          actionLabel: "Subir evidencia",
                          disabled: !canEvidence,
                          disabledReason: "Primero crea una publicación",
                        },
                      ],
                    },
                    {
                      id: "promocion",
                      title: "6. Promoción activa",
                      items: [
                        {
                          id: "campana",
                          label: "campaña creada",
                          done: activeBusiness.snapshot.promotionCreated,
                          actionKey: "create_campaign",
                          actionLabel: "Crear campaña",
                          disabled: !canPromotion,
                          disabledReason: "No puedes promocionar sin publicación",
                        },
                      ],
                    },
                    {
                      id: "activacion",
                      title: "7. Activación",
                      items: [
                        {
                          id: "leads",
                          label: "ya recibe leads",
                          done: activeBusiness.isActive,
                          actionKey: "activate",
                          actionLabel: "Activar negocio",
                          disabled: !canActivate,
                          disabledReason: "Completa todos los pasos anteriores",
                        },
                      ],
                    },
                  ];

                  return (
                    <div className="mt-4 grid gap-3">
                      {checklistSections.map((section) => {
                        const doneCount = section.items.filter((item) => item.done).length;
                        const totalCount = section.items.length;
                        const isSectionDone = doneCount === totalCount;

                        return (
                          <article key={section.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-cyan-50">{section.title}</p>
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                  isSectionDone
                                    ? "border-emerald-200/30 bg-emerald-300/12 text-emerald-50"
                                    : "border-cyan-100/15 bg-slate-950/35 text-cyan-100/80"
                                }`}
                              >
                                {doneCount}/{totalCount}
                              </span>
                            </div>

                            <div className="mt-3 grid gap-2">
                              {section.items.map((item) => {
                                const isDisabled =
                                  item.disabled || (item.actionKey === "activate" ? activeBusiness.isActive : false);

                                return (
                                  <div
                                    key={item.id}
                                    className={`flex flex-col gap-2 rounded-xl border px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between ${
                                      item.done
                                        ? "border-emerald-200/20 bg-emerald-300/10 text-emerald-50"
                                        : "border-cyan-100/10 bg-slate-950/35 text-cyan-100/80"
                                    }`}
                                  >
                                    <div className="min-w-0">
                                      <p className="font-semibold text-cyan-50">{item.label}</p>
                                      {isDisabled && item.disabledReason ? (
                                        <p className="mt-1 text-[11px] text-cyan-100/60">{item.disabledReason}</p>
                                      ) : null}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                      <span
                                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                                          item.done
                                            ? "border-emerald-200/30 bg-emerald-300/12 text-emerald-50"
                                            : "border-cyan-100/18 bg-white/5 text-cyan-100/80"
                                        }`}
                                      >
                                        {item.done ? "Listo" : "Pendiente"}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          item.actionKey === "activate" ? handleActivate() : handleItemAction(item.actionKey)
                                        }
                                        disabled={isDisabled}
                                        className={`rounded-xl border px-3 py-2 text-[11px] font-semibold transition ${
                                          isDisabled
                                            ? "cursor-not-allowed border-cyan-100/10 bg-white/5 text-cyan-100/40"
                                            : "border-cyan-100/20 bg-cyan-300/12 text-cyan-50 hover:bg-cyan-300/20"
                                        }`}
                                      >
                                        {item.actionLabel}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  );
                })()}
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-cyan-50">Alertas</h3>
                    <span className="rounded-full border border-cyan-100/15 bg-slate-950/35 px-3 py-1 text-xs text-cyan-100/80">
                      Última acción: <strong className="text-cyan-50">{activeBusiness.tracking.lastAction}</strong>
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeBusiness.alerts.length ? (
                      activeBusiness.alerts.map((alert) => (
                        <span
                          key={alert}
                          className="rounded-full border border-amber-200/30 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold text-amber-50"
                        >
                          ⚠ {alert}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-cyan-100/75">Sin alertas activas.</span>
                    )}
                  </div>

                  <div className="mt-5 grid gap-2 text-xs text-cyan-100/80 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2">
                      Responsable: <strong className="text-cyan-50">{activeBusiness.tracking.responsible}</strong>
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2">
                      Próxima acción: <strong className="text-cyan-50">{activeBusiness.currentStep}</strong>
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2 sm:col-span-2">
                      Siguiente fecha sugerida: <strong className="text-cyan-50">{activeBusiness.tracking.nextActionDate}</strong>
                    </div>
                  </div>

                  {!activeBusiness.isActive ? (
                    <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 text-sm text-cyan-100/82">
                      Días sin update: <strong className="text-cyan-50">{daysBetween(activeBusiness.lastUpdate, new Date())}</strong>
                    </div>
                  ) : null}
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h3 className="text-xl font-semibold text-cyan-50">Notas del embajador</h3>
                  <p className="mt-2 text-sm text-cyan-100/75">Registra bloqueos y acuerdos para seguimiento real.</p>

                  <div className="mt-4 grid gap-2">
                    <textarea
                      value={noteDraft}
                      onChange={(event) => setNoteDraft(event.target.value)}
                      rows={3}
                      placeholder="Escribe una nota..."
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:border-cyan-200/35 focus:outline-none"
                    />
                    <button type="button" onClick={handleAddNote} className="tech-button tech-button-secondary px-4 py-2 text-xs">
                      Agregar nota
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {activeBusiness.notes.length ? (
                      activeBusiness.notes.map((note: OnboardingNote, index: number) => (
                        <div key={`${note.date}-${index}`} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
                          <p className="text-xs text-cyan-200/75">{formatIsoToDisplayDate(note.date)}</p>
                          <p className="mt-2 text-sm text-cyan-100/85">{note.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-cyan-100/75">Sin notas todavía.</p>
                    )}
                  </div>
                </article>
              </section>
            </>
          ) : (
            <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-6">
              <h2 className="text-2xl font-bold text-white">Sin detalle</h2>
              <p className="mt-2 text-sm text-cyan-100/80">Selecciona un negocio de la lista para ver su onboarding.</p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
