"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { EmbajadorSidebar } from "../EmbajadorSidebar";
import { EmbajadorPageHeader } from "../EmbajadorPageHeader";
import {
  useAmbassadorProfile,
  useAmbassadorReferralActivity,
  useAmbassadorReferralBusinessMetrics,
  useAmbassadorReferralDetail,
  useAmbassadorReferralMetrics,
  useAmbassadorReferralUserInsights,
  useAmbassadorReferrals,
  useAmbassadorReferralsReport,
  type ApiReferral,
} from "../useAmbassadorApi";

type BusinessView = {
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

const scoreTone = (score: number) => {
  if (score >= 85) {
    return "text-emerald-100 border-emerald-300/30 bg-emerald-300/12";
  }

  if (score >= 70) {
    return "text-cyan-100 border-cyan-200/30 bg-cyan-300/12";
  }

  return "text-amber-100 border-amber-300/30 bg-amber-300/12";
};

const getGrowthTrend = (growthRate: number) => {
  if (growthRate >= 30) {
    return { label: "Crecimiento acelerado", tone: "text-emerald-100" };
  }

  if (growthRate >= 20) {
    return { label: "Crecimiento saludable", tone: "text-cyan-100" };
  }

  return { label: "Crecimiento bajo", tone: "text-amber-100" };
};

const getPriorityLevel = (business: { status: string; valueScore: number; growthRate: number }) => {
  if (business.status === "En onboarding") {
    return { label: "Prioridad alta", tone: "text-amber-100" };
  }

  if (business.valueScore >= 85 || business.growthRate >= 30) {
    return { label: "Prioridad estrategica", tone: "text-emerald-100" };
  }

  if (business.valueScore >= 70) {
    return { label: "Prioridad media", tone: "text-cyan-100" };
  }

  return { label: "Prioridad de seguimiento", tone: "text-amber-100" };
};

const getProjectedCommission = (business: { commissionGenerated: number; growthRate: number; status: string }) => {
  const growthMultiplier = 1 + business.growthRate / 100;
  const onboardingFactor = business.status === "En onboarding" ? 0.72 : 1;
  return Math.round(business.commissionGenerated * growthMultiplier * onboardingFactor);
};

const getRecommendations = (business: {
  status: string;
  growthRate: number;
  userScore: number;
  conversionRate: number;
}) => {
  const recommendations = ["Revisar datos comerciales y mantener contacto semanal."];

  if (business.status === "En onboarding") {
    recommendations.unshift("Acelerar onboarding para pasar a negocio activo lo antes posible.");
  }

  if (business.growthRate < 20) {
    recommendations.push("Publicar nuevas evidencias y contenido para impulsar visibilidad.");
  }

  if (business.userScore < 80) {
    recommendations.push("Mejorar percepción de usuarios con seguimiento y respuestas más rapidas.");
  }

  if (business.conversionRate < 18) {
    recommendations.push("Optimizar el mensaje comercial y reforzar las ofertas de conversión.");
  }

  return recommendations.slice(0, 3);
};

const normalizeReferralStatus = (status?: string | null): BusinessView["status"] => {
  const normalizedStatus = status?.trim().toUpperCase();
  return normalizedStatus?.includes("ACTIVE") || normalizedStatus?.includes("ACTIVO") ? "Activo" : "En onboarding";
};

const parseMoney = (value?: string | null) => {
  if (!value) return 0;
  const amount = Number(value.replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isFinite(amount) ? amount : 0;
};

const formatReferralDate = (value?: string | null) => {
  if (!value) return "Sin fecha";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const mapReferralToBusiness = (referral: ApiReferral, index: number): BusinessView => {
  return {
    id: referral.id,
    name: referral.nombre ?? `Referido ${index + 1}`,
    category: referral.tipo || "Negocio referido",
    city: "Sin ciudad registrada",
    referredAt: formatReferralDate(referral.fechaRegistro),
    status: normalizeReferralStatus(referral.estado),
    monthlyLeads: 0,
    conversionRate: 0,
    growthRate: 0,
    rating: 0,
    userScore: 0,
    userView: "Sin percepción registrada.",
    topComment: "",
    valueScore: 0,
    commissionGenerated: parseMoney(referral.comisionGenerada),
    reputationContribution: 0,
    strengths: [],
    risks: [],
  };
};


function EmbajadorNegociosReferidosContent() {
  const searchParams = useSearchParams();
  const requestedBusinessId = searchParams.get("business") ?? "";
  const { data: profile } = useAmbassadorProfile();
  const { data: referrals, loading: referralsLoading, error: referralsError } = useAmbassadorReferrals();
  const { data: referralMetrics } = useAmbassadorReferralMetrics();
  const { data: referralsReport } = useAmbassadorReferralsReport();
  const referredBusinessesState = useMemo(() => {
    if (!referrals?.length) return [];
    return referrals.map((referral, index) => mapReferralToBusiness(referral, index));
  }, [referrals]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const activeBusinessId = useMemo(() => {
    if (requestedBusinessId && referredBusinessesState.some((business) => business.id === requestedBusinessId)) {
      return requestedBusinessId;
    }

    if (selectedBusinessId && referredBusinessesState.some((business) => business.id === selectedBusinessId)) {
      return selectedBusinessId;
    }

    return referredBusinessesState[0]?.id ?? "";
  }, [requestedBusinessId, selectedBusinessId, referredBusinessesState]);

  const activeBusiness = useMemo(
    () => referredBusinessesState.find((business) => business.id === activeBusinessId) ?? referredBusinessesState[0],
    [activeBusinessId, referredBusinessesState],
  );
  const { data: activeReferralDetail } = useAmbassadorReferralDetail(activeBusiness?.id?.startsWith("BUS-") ? activeBusiness.id : null);
  const { data: activeBusinessMetrics } = useAmbassadorReferralBusinessMetrics(activeBusiness?.id?.startsWith("BUS-") ? activeBusiness.id : null);
  const { data: activeUserInsights } = useAmbassadorReferralUserInsights(activeBusiness?.id?.startsWith("BUS-") ? activeBusiness.id : null);
  const { data: activeReferralActivity } = useAmbassadorReferralActivity(activeBusiness?.id?.startsWith("BUS-") ? activeBusiness.id : null);
  const activeReferralReport = referralsReport?.find((item) => item.referido === activeBusiness?.name);

  if (!activeBusiness) {
    return (
      <div className="flex-1 pb-10">
        <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
          <EmbajadorSidebar activeSection="negocios" profile={profile} />
          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-6">
            <h1 className="text-2xl font-bold text-cyan-50">Sin negocios referidos</h1>
            <p className="mt-2 text-sm text-cyan-100/75">
              Cuando backend devuelva referidos para este embajador, aparecerán aquí.
            </p>
          </section>
        </main>
      </div>
    );
  }

  const businessWithMetrics: BusinessView = {
    ...activeBusiness,
    city: activeReferralDetail?.ciudad ?? activeBusiness.city,
    category: activeReferralDetail?.categoria ?? activeBusiness.category,
    monthlyLeads: activeBusinessMetrics?.monthlyLeads ?? activeBusiness.monthlyLeads,
    conversionRate: activeBusinessMetrics?.conversionRate ?? activeBusiness.conversionRate,
    growthRate: activeBusinessMetrics?.growthRate ?? activeBusiness.growthRate,
    rating: activeBusinessMetrics?.rating ?? activeBusiness.rating,
    valueScore: activeBusinessMetrics?.valueScore ?? activeBusiness.valueScore,
    commissionGenerated: activeBusinessMetrics?.commissionGenerated ?? activeBusiness.commissionGenerated,
    reputationContribution: activeBusinessMetrics?.reputationContribution ?? activeBusiness.reputationContribution,
    userScore: activeUserInsights?.userScore ?? activeBusiness.userScore,
    userView: activeUserInsights?.userView ?? activeBusiness.userView,
    topComment: activeUserInsights?.topComment ?? activeBusiness.topComment,
    strengths: activeUserInsights?.strengths ?? activeBusiness.strengths,
    risks: activeUserInsights?.risks ?? activeBusiness.risks,
  };

  const reputationalImpactTone =
    businessWithMetrics.reputationContribution >= 80
      ? "Impacto muy positivo"
      : businessWithMetrics.reputationContribution >= 65
        ? "Impacto positivo"
        : "Impacto moderado";

  const growthTrend = getGrowthTrend(businessWithMetrics.growthRate);
  const priorityLevel = getPriorityLevel(businessWithMetrics);
  const projectedCommission = getProjectedCommission(businessWithMetrics);
  const recommendations = getRecommendations(businessWithMetrics);

  return (
    <div className="flex-1 pb-10">
      <EmbajadorPageHeader
        profile={profile}
        statusMessage="Detalle de negocios referidos"
        rightSlot={
          <Link
            href="/embajador"
            className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
          >
            Volver al resumen
          </Link>
        }
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_320px_minmax(0,1fr)] xl:grid-cols-[300px_360px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="negocios" profile={profile} />

        <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-scroll lg:pr-2 chat-scrollbar">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">NEGOCIOS REFERIDOS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Lista de negocios captados</h1>
            <p className="mt-2 text-sm text-cyan-100/80">
              Haz clic en un negocio para ver su valor comercial y su impacto en tu reputación como embajador.
            </p>

            <div className="mt-4 space-y-2">
              {referralsLoading ? (
                <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/80">
                  Cargando negocios referidos reales...
                </div>
              ) : null}
              {referralsError ? (
                <div className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-4 text-sm text-rose-100">
                  No se pudieron cargar referidos reales: {referralsError}
                </div>
              ) : null}
              {referredBusinessesState.map((business) => {
                const isActive = business.id === activeBusiness.id;

                return (
                  <button
                    key={business.id}
                    type="button"
                    onClick={() => setSelectedBusinessId(business.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      isActive
                        ? "border-cyan-300/45 bg-cyan-300/14"
                        : "border-cyan-100/10 bg-white/5 hover:border-cyan-200/35 hover:bg-cyan-300/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-cyan-50">{business.name}</p>
                      <span className="text-[11px] text-cyan-100/75">{business.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-cyan-100/75">{business.category} · {business.city}</p>
                    <p className="mt-2 text-xs text-cyan-200/80">Comisión: Bs {business.commissionGenerated.toLocaleString("es-BO")}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="tech-mono text-xs text-cyan-200/75">NEGOCIO SELECCIONADO</p>
            </div>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-3xl font-bold text-cyan-50">{businessWithMetrics.name}</h2>
                <p className="mt-2 text-sm text-cyan-100/82">
                  {businessWithMetrics.category} · {businessWithMetrics.city} · Referido el{" "}
                  {activeReferralDetail?.fechaRegistro ?? businessWithMetrics.referredAt}
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(businessWithMetrics.valueScore)}`}>
                Valor para embajador: {businessWithMetrics.valueScore}/100
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Leads del mes</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{businessWithMetrics.monthlyLeads}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Plan</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{activeReferralDetail?.plan ?? "Sin plan"}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Comisión generada</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">
                  {activeReferralReport?.comision ?? `Bs ${businessWithMetrics.commissionGenerated.toLocaleString("es-BO")}`}
                </p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Ventas totales</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{activeBusinessMetrics?.ventasTotales ?? activeReferralDetail?.ventasTotales ?? 0}</p>
              </article>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-cyan-50">Detalle y actividad real</h3>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/82">
                <p><strong className="text-cyan-50">Pais:</strong> {activeReferralDetail?.pais ?? "Sin dato"}</p>
                <p className="mt-2"><strong className="text-cyan-50">Ciudad:</strong> {activeReferralDetail?.ciudad ?? "Sin dato"}</p>
                <p className="mt-2"><strong className="text-cyan-50">Contacto:</strong> {activeReferralDetail?.contacto?.nombre ?? "Sin contacto"}</p>
                <p className="mt-2"><strong className="text-cyan-50">Email:</strong> {activeReferralDetail?.contacto?.email ?? "Sin email"}</p>
                <p className="mt-2"><strong className="text-cyan-50">Teléfono:</strong> {activeReferralDetail?.contacto?.telefono ?? "Sin telefono"}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-cyan-50">Actividad</p>
                <div className="mt-3 space-y-2">
                  {(activeReferralActivity ?? []).map((activity) => (
                    <div key={activity.id} className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-sm text-cyan-100/80">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-cyan-50">{activity.tipo}</span>
                        <span className="text-xs text-cyan-100/60">{activity.fecha}</span>
                      </div>
                      <p className="mt-1">{activity.descripcion}</p>
                    </div>
                  ))}
                  {(activeReferralActivity ?? []).length === 0 ? <p className="text-sm text-cyan-100/60">Sin actividad registrada.</p> : null}
                </div>
              </article>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
              <h3 className="text-xl font-semibold text-cyan-50">Como lo ven los usuarios</h3>
              <p className="mt-2 text-sm text-cyan-100/80">{businessWithMetrics.userView}</p>

              <div className="mt-4 h-2 overflow-hidden rounded-full border border-cyan-100/12 bg-slate-950/45">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.9))]"
                  style={{ width: `${businessWithMetrics.userScore}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-cyan-100/78">Percepcion de usuarios: {businessWithMetrics.userScore}/100</p>

              <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Comentario destacado</p>
                <p className="mt-2 text-sm text-cyan-100/85">
                  {businessWithMetrics.topComment ? `“${businessWithMetrics.topComment}”` : "Sin comentario destacado."}
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
              <h3 className="text-xl font-semibold text-cyan-50">Impacto en tu reputación</h3>
              <p className="mt-2 text-sm text-cyan-100/82">
                Este negocio aporta un impacto de {businessWithMetrics.reputationContribution}/100 a tu reputacion.
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-100">{reputationalImpactTone}</p>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Fortalezas</p>
                <ul className="mt-2 space-y-2 text-sm text-cyan-100/84">
                  {businessWithMetrics.strengths.length ? businessWithMetrics.strengths.map((item) => (
                    <li key={item} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2">
                      {item}
                    </li>
                  )) : <li className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2">Sin fortalezas registradas.</li>}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Riesgos a vigilar</p>
                <ul className="mt-2 space-y-2 text-sm text-cyan-100/84">
                  {businessWithMetrics.risks.length ? businessWithMetrics.risks.map((item) => (
                    <li key={item} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2">
                      {item}
                    </li>
                  )) : <li className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2">Sin riesgos registrados.</li>}
                </ul>
              </div>
            </article>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-cyan-100/80">
                Embajador actual: {profile ? `${profile.nombre} ${profile.apellido}` : "..."} · {profile?.nivel ?? "..."}
              </p>
              {referralMetrics ? (
                <p className="text-sm text-cyan-100/80">
                  Total real: <strong className="text-cyan-50">{referralMetrics.totalReferidos}</strong> · Activos:{" "}
                  <strong className="text-cyan-50">{referralMetrics.activos}</strong> · Comision:{" "}
                  <strong className="text-cyan-50">{referralMetrics.comisionTotal}</strong>
                </p>
              ) : null}
              <Link
                href="/embajador"
                className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
              >
                Volver al panel principal
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">INDICADORES ESTRATEGICOS</p>
                <h3 className="mt-2 text-2xl font-bold text-cyan-50">Lectura rápida del negocio seleccionado</h3>
                <p className="mt-2 text-sm text-cyan-100/78">
                  Usa estos indicadores para decidir si conviene acelerar seguimiento, reforzar onboarding o escalar
                  la comisión proyectada.
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(businessWithMetrics.valueScore)}`}>
                Valor estrategico: {businessWithMetrics.valueScore}/100
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Tendencia de crecimiento</p>
                <p className={`mt-2 text-lg font-semibold ${growthTrend.tone}`}>{growthTrend.label}</p>
                <p className="mt-1 text-sm text-cyan-100/76">+{businessWithMetrics.growthRate}% respecto al periodo previo.</p>
              </article>

              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Nivel de prioridad</p>
                <p className={`mt-2 text-lg font-semibold ${priorityLevel.tone}`}>{priorityLevel.label}</p>
                <p className="mt-1 text-sm text-cyan-100/76">
                  Define cuanta atención operativa necesita este negocio hoy.
                </p>
              </article>

              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Proyeccion de comisión</p>
                <p className="mt-2 text-lg font-semibold text-emerald-100">Bs {projectedCommission.toLocaleString("es-BO")}</p>
                <p className="mt-1 text-sm text-cyan-100/76">
                  Estimacion basada en la comisión actual y el ritmo de crecimiento.
                </p>
              </article>

              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Seguimiento comercial</p>
                <p className="mt-2 text-lg font-semibold text-cyan-50">{businessWithMetrics.monthlyLeads} leads / mes</p>
                <p className="mt-1 text-sm text-cyan-100/76">
                  Conversion actual del {businessWithMetrics.conversionRate}% con impacto reputacional de {businessWithMetrics.reputationContribution}/100.
                </p>
              </article>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-100/10 bg-[linear-gradient(180deg,rgba(8,18,31,0.88),rgba(5,12,22,0.95))] p-4 md:p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Recomendaciones accionables</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {recommendations.map((item) => (
                  <article key={item} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/82">
                    {item}
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default function EmbajadorNegociosReferidosPage() {
  return (
    <Suspense fallback={null}>
      <EmbajadorNegociosReferidosContent />
    </Suspense>
  );
}
