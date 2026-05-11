"use client";

import { FormEvent, useState } from "react";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistReviewsCertificationsData } from "../hooks/useSpecialistReviewsCertificationsData";
import { starsLabel } from "../specialistData";

export default function EspecialistaReputacionPage() {
  const { reviews, kpis, actionError, actionLoading, actionSuccess, respondReview } = useSpecialistReviewsCertificationsData();
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmitResponse(event: FormEvent<HTMLFormElement>, reviewId: string) {
    event.preventDefault();

    const trimmedResponse = responseText.trim();

    if (!trimmedResponse) {
      setFormError("Escribe una respuesta antes de guardar.");
      return;
    }

    setFormError(null);
    await respondReview(reviewId, trimmedResponse);
    setResponseText("");
    setActiveReviewId(null);
  }

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
          <p className="mt-2 text-sm font-semibold text-cyan-50">Sin actividad reciente registrada</p>
          <p className="mt-1 text-xs text-cyan-100/70">Backend sin registros de actividad</p>
        </article>
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <h2 className="text-2xl font-bold text-white">Ultimas resenas</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {reviews.length === 0 ? (
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/75 lg:col-span-2">
              No hay reseñas registradas todavía.
            </article>
          ) : null}
          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-cyan-50">{review.user}</p>
                <p className="text-sm text-amber-200">{starsLabel(review.stars)}</p>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/70">{review.service}</p>
              <p className="mt-2 text-sm leading-7 text-cyan-100/85">{review.comment}</p>
              <p className="mt-2 text-xs text-cyan-100/65">{review.date}</p>
              {activeReviewId === review.id ? (
                <form onSubmit={(event) => handleSubmitResponse(event, review.id)} className="mt-4 space-y-3">
                  <textarea
                    value={responseText}
                    onChange={(event) => setResponseText(event.target.value)}
                    placeholder="Escribe tu respuesta para el cliente..."
                    disabled={actionLoading}
                    rows={3}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={actionLoading || !responseText.trim()}
                      className="rounded-full border border-cyan-300/35 bg-cyan-300 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoading ? "Guardando..." : "Guardar respuesta"}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        setActiveReviewId(null);
                        setResponseText("");
                        setFormError(null);
                      }}
                      className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => {
                    setActiveReviewId(review.id);
                    setResponseText("");
                    setFormError(null);
                  }}
                  className="mt-4 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Responder resena
                </button>
              )}
              {activeReviewId === review.id && (formError || actionError) ? (
                <p className="mt-3 text-sm text-rose-200">{formError ?? actionError}</p>
              ) : null}
              {activeReviewId !== review.id && actionSuccess ? (
                <p className="mt-3 text-sm text-emerald-200">{actionSuccess}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </SpecialistShell>
  );
}
