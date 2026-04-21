"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmbajadorSidebar } from "../page";
import { ambassadorProfile, referredBusinesses } from "../ambassadorData";

const scoreTone = (score: number) => {
  if (score >= 85) {
    return "text-emerald-100 border-emerald-300/30 bg-emerald-300/12";
  }

  if (score >= 70) {
    return "text-cyan-100 border-cyan-200/30 bg-cyan-300/12";
  }

  return "text-amber-100 border-amber-300/30 bg-amber-300/12";
};

export default function EmbajadorNegociosReferidosPage() {
  const searchParams = useSearchParams();
  const requestedBusinessId = searchParams.get("business") ?? "";
  const [activeBusinessId, setActiveBusinessId] = useState(referredBusinesses[0]?.id ?? "");

  useEffect(() => {
    if (!requestedBusinessId) {
      return;
    }

    const exists = referredBusinesses.some((business) => business.id === requestedBusinessId);
    if (exists) {
      setActiveBusinessId(requestedBusinessId);
    }
  }, [requestedBusinessId]);

  const activeBusiness = useMemo(
    () => referredBusinesses.find((business) => business.id === activeBusinessId) ?? referredBusinesses[0],
    [activeBusinessId],
  );

  if (!activeBusiness) {
    return null;
  }

  const reputationalImpactTone =
    activeBusiness.reputationContribution >= 80
      ? "Impacto muy positivo"
      : activeBusiness.reputationContribution >= 65
        ? "Impacto positivo"
        : "Impacto moderado";

  return (
    <div className="flex-1 pb-10">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <div className="hidden rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:inline-flex md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            Detalle de negocios referidos
          </div>
          <Link
            href="/embajador"
            className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
          >
            Volver al resumen
          </Link>
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <EmbajadorSidebar activeSection="negocios" />

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">NEGOCIOS REFERIDOS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Lista de negocios captados</h1>
            <p className="mt-2 text-sm text-cyan-100/80">
              Haz clic en un negocio para ver su valor comercial y su impacto en tu reputacion como embajador.
            </p>

            <div className="mt-4 space-y-2">
              {referredBusinesses.map((business) => {
                const isActive = business.id === activeBusiness.id;

                return (
                  <button
                    key={business.id}
                    type="button"
                    onClick={() => setActiveBusinessId(business.id)}
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
                    <p className="mt-2 text-xs text-cyan-200/80">Valor: {business.valueScore}/100</p>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
            <p className="tech-mono text-xs text-cyan-200/75">NEGOCIO SELECCIONADO</p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-3xl font-bold text-cyan-50">{activeBusiness.name}</h2>
                <p className="mt-2 text-sm text-cyan-100/82">
                  {activeBusiness.category} · {activeBusiness.city} · Referido el {activeBusiness.referredAt}
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone(activeBusiness.valueScore)}`}>
                Valor para embajador: {activeBusiness.valueScore}/100
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Leads del mes</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{activeBusiness.monthlyLeads}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Conversion</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{activeBusiness.conversionRate}%</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Comision estimada</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">
                  Bs {activeBusiness.commissionGenerated.toLocaleString("es-BO")}
                </p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Rating</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{activeBusiness.rating.toFixed(1)} / 5</p>
              </article>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
              <h3 className="text-xl font-semibold text-cyan-50">Como lo ven los usuarios</h3>
              <p className="mt-2 text-sm text-cyan-100/80">{activeBusiness.userView}</p>

              <div className="mt-4 h-2 overflow-hidden rounded-full border border-cyan-100/12 bg-slate-950/45">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.9))]"
                  style={{ width: `${activeBusiness.userScore}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-cyan-100/78">Percepcion de usuarios: {activeBusiness.userScore}/100</p>

              <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Comentario destacado</p>
                <p className="mt-2 text-sm text-cyan-100/85">"{activeBusiness.topComment}"</p>
              </div>
            </article>

            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
              <h3 className="text-xl font-semibold text-cyan-50">Impacto en tu reputacion</h3>
              <p className="mt-2 text-sm text-cyan-100/82">
                Este negocio aporta un impacto de {activeBusiness.reputationContribution}/100 a tu reputacion.
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-100">{reputationalImpactTone}</p>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Fortalezas</p>
                <ul className="mt-2 space-y-2 text-sm text-cyan-100/84">
                  {activeBusiness.strengths.map((item) => (
                    <li key={item} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Riesgos a vigilar</p>
                <ul className="mt-2 space-y-2 text-sm text-cyan-100/84">
                  {activeBusiness.risks.map((item) => (
                    <li key={item} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-cyan-100/80">
                Embajador actual: {ambassadorProfile.name} · Nivel {ambassadorProfile.level}
              </p>
              <Link
                href="/embajador"
                className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
              >
                Volver al panel principal
              </Link>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
