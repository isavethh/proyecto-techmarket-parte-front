"use client";

import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistReviewsCertificationsData } from "../hooks/useSpecialistReviewsCertificationsData";

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("verif") || normalized.includes("aprob")) {
    return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  }

  if (normalized.includes("pend")) {
    return "border-amber-300/35 bg-amber-300/10 text-amber-100";
  }

  return "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
}

export default function EspecialistaCertificacionesPage() {
  const { certifications } = useSpecialistReviewsCertificationsData();

  return (
    <SpecialistShell sectionLabel="Certificaciones" statusMessage="Certificaciones tecnicas del especialista">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="tech-mono text-xs text-cyan-200/75">CERTIFICACIONES</p>
            <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Credenciales tecnicas</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Consulta certificaciones, entidad emisora, estado de validacion y credenciales asociadas al especialista.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="cursor-not-allowed self-start rounded-full border border-cyan-300/35 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100/70 opacity-70"
          >
            Agregar certificacion
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Total</p>
          <p className="mt-2 text-2xl font-bold text-white">{certifications.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Verificadas</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {certifications.filter((certification) => certification.status.toLowerCase().includes("verif")).length}
          </p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modo</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Solo lectura</p>
          <p className="mt-1 text-xs text-cyan-100/70">POST, PATCH y DELETE pendientes</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {certifications.map((certification) => (
          <article key={certification.id} className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Certificacion</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{certification.title}</h2>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(certification.status)}`}>
                {certification.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Entidad emisora</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">{certification.issuer}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Fecha</p>
                <p className="mt-2 text-sm text-cyan-100/85">{certification.date}</p>
              </article>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {certification.credentialUrl ? (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                >
                  Ver credencial
                </a>
              ) : null}
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100/70 opacity-70"
              >
                Verificar
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100/70 opacity-70"
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </section>
    </SpecialistShell>
  );
}
