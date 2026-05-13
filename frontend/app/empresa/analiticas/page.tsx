"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CompanySidebar } from "../CompanySidebar";
import {
  growthSeriesData,
  publicationMetricsData,
  ratingLevelsData,
  userCommentsData,
  userReviewsData,
} from "../../lib/companyApi";

type PublicationMetric = {
  id: string;
  title: string;
  visits: number;
  conversion: number;
};

type RatingLevel = {
  stars: number;
  percent: number;
  users: number;
};

type UserReview = {
  id: string;
  user: string;
  stars: number;
  text: string;
  date: string;
};

type UserComment = {
  id: string;
  user: string;
  publication: string;
  text: string;
  date: string;
};

type GrowthPoint = {
  month: string;
  visits: number;
};

const publicationMetrics: PublicationMetric[] = publicationMetricsData;
const ratingLevels: RatingLevel[] = ratingLevelsData;
const userReviews: UserReview[] = userReviewsData;
const userComments: UserComment[] = userCommentsData;
const growthSeries: GrowthPoint[] = growthSeriesData;

const totalVisits = publicationMetrics.reduce((acc, item) => acc + item.visits, 0);
const avgConversion = Math.round(
  publicationMetrics.reduce((acc, item) => acc + item.conversion, 0) / publicationMetrics.length,
);
const ratingAverage = 4.4;
const growthIndex = 27;

function renderStars(stars: number) {
  return "â˜…".repeat(stars) + "â˜†".repeat(5 - stars);
}

export default function AnaliticasPage() {
  const highestVisits = Math.max(...publicationMetrics.map((item) => item.visits));
  const highestGrowth = Math.max(...growthSeries.map((item) => item.visits));

  return (
    <div className="flex-1 pb-8">
      <header className="tech-top-nav">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Panel empresa</span>
        </div>
      </header>

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">ANALITICAS EMPRESA</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Estado del rendimiento</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Revisa indicadores de visitas, conversion y crecimiento para tomar mejores decisiones.
            </p>
          </section>
          <CompanySidebar />
        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="space-y-8 p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">ANALITICAS</p>
                  <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Dashboard de rendimiento</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                    Seguimiento de visitas generadas por publicaciones, estrellas segun usuarios, resenas,
                    comentarios y el indice de crecimiento del negocio.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Indice de crecimiento</p>
                  <p className="mt-3 text-4xl font-bold text-emerald-200">+{growthIndex}%</p>
                  <p className="mt-3 text-sm text-cyan-100/80">
                    El crecimiento actual combina alcance de publicaciones, conversion a chat y retencion por
                    recomendaciones de usuarios.
                  </p>
                </div>
              </div>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Visitas totales</p>
                  <p className="mt-3 text-3xl font-bold text-white">{totalVisits.toLocaleString("es-BO")}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Publicaciones activas</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion promedio</p>
                  <p className="mt-3 text-3xl font-bold text-white">{ratingAverage.toFixed(1)} / 5</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Segun valoraciones de clientes</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Resenas totales</p>
                  <p className="mt-3 text-3xl font-bold text-white">{userReviews.length}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Opiniones verificadas</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Conversion promedio</p>
                  <p className="mt-3 text-3xl font-bold text-white">{avgConversion}%</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Visita a contacto por chat</p>
                </article>
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Visitas por publicacion</h2>
                  <div className="mt-5 space-y-4">
                    {publicationMetrics.map((item) => {
                      const width = Math.max(12, Math.round((item.visits / highestVisits) * 100));

                      return (
                        <div key={item.id}>
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <p className="font-semibold text-cyan-50">{item.title}</p>
                            <p className="text-cyan-100/75">{item.visits.toLocaleString("es-BO")} visitas</p>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900/80">
                            <div className="h-full rounded-full bg-cyan-300" style={{ width: `${width}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-cyan-100/65">Conversion a chat: {item.conversion}%</p>
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Estrellas segun usuarios</h2>
                  <div className="mt-5 space-y-4">
                    {ratingLevels.map((level) => (
                      <div key={level.stars}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <p className="font-semibold text-amber-200">{renderStars(level.stars)}</p>
                          <p className="text-cyan-100/75">{level.users} usuarios</p>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900/80">
                          <div className="h-full rounded-full bg-amber-300" style={{ width: `${level.percent}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-cyan-100/65">{level.percent}% del total</p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Resenas de usuarios</h2>
                  <div className="mt-5 space-y-4">
                    {userReviews.map((review) => (
                      <div key={review.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-cyan-50">{review.user}</p>
                          <p className="text-xs text-cyan-100/65">{review.date}</p>
                        </div>
                        <p className="mt-1 text-sm text-amber-200">{renderStars(review.stars)}</p>
                        <p className="mt-2 text-sm leading-7 text-cyan-100/80">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Comentarios recientes</h2>
                  <div className="mt-5 space-y-4">
                    {userComments.map((comment) => (
                      <div key={comment.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-cyan-50">{comment.user}</p>
                          <p className="text-xs text-cyan-100/65">{comment.date}</p>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/70">{comment.publication}</p>
                        <p className="mt-2 text-sm leading-7 text-cyan-100/80">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                <h2 className="text-2xl font-bold text-white">Indice de crecimiento mensual</h2>
                <p className="mt-2 text-sm text-cyan-100/75">
                  Tendencia de visitas en los ultimos meses para medir el impacto de publicaciones y promociones.
                </p>

                <div className="mt-5 grid grid-cols-6 gap-3">
                  {growthSeries.map((point) => {
                    const height = Math.max(20, Math.round((point.visits / highestGrowth) * 180));

                    return (
                      <div key={point.month} className="flex flex-col items-center gap-2">
                        <div className="flex h-48 w-full items-end rounded-2xl bg-slate-900/70 p-2">
                          <div className="w-full rounded-xl bg-cyan-300" style={{ height }} />
                        </div>
                        <p className="text-xs font-semibold text-cyan-100/75">{point.month}</p>
                        <p className="text-xs text-cyan-100/65">{point.visits}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

