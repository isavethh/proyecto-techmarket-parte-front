"use client";

import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistReviewsCertificationsData } from "../hooks/useSpecialistReviewsCertificationsData";
import { recentActivity, starsLabel } from "../specialistData";

export default function EspecialistaReputacionPage() {
  const { reviews, kpis } = useSpecialistReviewsCertificationsData();

  return (
    <SpecialistShell sectionLabel="Reputacion" statusMessage="Indicadores de confianza y resenas activas">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">REPUTACION DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Confianza y experiencia</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Indicadores visibles de confianza, experiencia y actividad del tecnico.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Calificacion promedio</p>
          <p className="mt-2 text-2xl font-bold text-white">{kpis.averageRating} / 5</p>
          <p className="mt-1 text-xs text-cyan-100/70">Base de resenas verificadas</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Resenas totales</p>
          <p className="mt-2 text-2xl font-bold text-white">{kpis.totalReviews}</p>
          <p className="mt-1 text-xs text-cyan-100/70">Clientes atendidos en la plataforma</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Trabajos realizados</p>
          <p className="mt-2 text-2xl font-bold text-white">{kpis.jobsCompleted}</p>
          <p className="mt-1 text-xs text-cyan-100/70">Servicios completados con evidencia</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Actividad reciente</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">{recentActivity[1].title}</p>
          <p className="mt-1 text-xs text-cyan-100/70">{recentActivity[1].time}</p>
        </article>
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <h2 className="text-2xl font-bold text-white">Ultimas resenas</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-cyan-50">{review.user}</p>
                <p className="text-sm text-amber-200">{starsLabel(review.stars)}</p>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/70">{review.service}</p>
              <p className="mt-2 text-sm leading-7 text-cyan-100/85">{review.comment}</p>
              <p className="mt-2 text-xs text-cyan-100/65">{review.date}</p>
              <button
                type="button"
                disabled
                className="mt-4 cursor-not-allowed rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-100/70 opacity-70"
              >
                Responder resena
              </button>
            </article>
          ))}
        </div>
      </section>
    </SpecialistShell>
  );
}
