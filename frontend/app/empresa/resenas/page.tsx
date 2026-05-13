"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CompanyPageHeader } from "../../components/CompanyPageSections";
import { CompanySidebar } from "../CompanySidebar";
import { customerReviewsData } from "../../lib/companyApi";

type ReviewFilter = "Todas" | "Sin responder" | "5 estrellas" | "Con mejora";

type CustomerReview = {
  id: string;
  customer: string;
  initials: string;
  productOrService: string;
  chatDate: string;
  reviewDate: string;
  stars: number;
  message: string;
  tags: string[];
  needsFollowUp: boolean;
  wasResponded: boolean;
};

const reviewFilters: ReviewFilter[] = ["Todas", "Sin responder", "5 estrellas", "Con mejora"];

const customerReviews: CustomerReview[] = customerReviewsData;

function renderStars(stars: number) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

function statusBadgeClass(review: CustomerReview) {
  if (review.stars >= 5 && !review.needsFollowUp) {
    return "border-emerald-300/35 bg-emerald-300/12 text-emerald-100";
  }

  if (review.needsFollowUp) {
    return "border-amber-300/35 bg-amber-300/10 text-amber-100";
  }

  return "border-cyan-100/25 bg-white/5 text-cyan-100/85";
}

function statusLabel(review: CustomerReview) {
  if (review.stars >= 5 && !review.needsFollowUp) {
    return "Cliente satisfecho";
  }

  if (review.needsFollowUp) {
    return "Requiere seguimiento";
  }

  return "Resena estable";
}

export default function ResenasPage() {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("Todas");

  const filteredReviews = useMemo(() => {
    if (activeFilter === "Sin responder") {
      return customerReviews.filter((review) => !review.wasResponded);
    }

    if (activeFilter === "5 estrellas") {
      return customerReviews.filter((review) => review.stars === 5);
    }

    if (activeFilter === "Con mejora") {
      return customerReviews.filter((review) => review.needsFollowUp);
    }

    return customerReviews;
  }, [activeFilter]);

  const totalReviews = customerReviews.length;
  const averageStars = useMemo(() => {
    const total = customerReviews.reduce((sum, review) => sum + review.stars, 0);
    return (total / customerReviews.length).toFixed(1);
  }, []);
  const pendingReplies = customerReviews.filter((review) => !review.wasResponded).length;
  const followUpItems = customerReviews.filter((review) => review.needsFollowUp).length;

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();

    for (const review of customerReviews) {
      for (const tag of review.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, []);

  return (
    <div className="flex-1 pb-8">
      <CompanyPageHeader
        sectionLabel="Resenas"
        brandHref="/"
        middleSlot={
          <div className="inline-flex rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            <span className="ml-2 md:ml-0">Resenas de clientes con chat previo</span>
          </div>
        }
      />

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">MODULO RESENAS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Voz del cliente</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Aqui ves todas las resenas dejadas por clientes que ya conversaron contigo por chat.
            </p>
          </section>

          <CompanySidebar />
        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="space-y-8 p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">RESENAS EMPRESA</p>
                  <h2 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Todas las resenas de clientes con chat</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                    Cada registro corresponde a un cliente que hablo contigo por chat y luego dejo su opinion.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cobertura</p>
                  <p className="mt-3 text-4xl font-bold text-emerald-200">100%</p>
                  <p className="mt-3 text-sm leading-7 text-cyan-100/80">
                    Todas las resenas mostradas provienen de clientes con conversacion previa en tu chat comercial.
                  </p>
                </div>
              </div>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Resenas totales</p>
                  <p className="mt-3 text-3xl font-bold text-white">{totalReviews}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Clientes con chat confirmado</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion promedio</p>
                  <p className="mt-3 text-3xl font-bold text-white">{averageStars} / 5</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Valoracion global actual</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Pendientes de respuesta</p>
                  <p className="mt-3 text-3xl font-bold text-white">{pendingReplies}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Resenas sin respuesta</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Con oportunidad</p>
                  <p className="mt-3 text-3xl font-bold text-white">{followUpItems}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Piden ajustes o seguimiento</p>
                </article>
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold text-white">Listado de resenas</h3>
                  <div className="flex flex-wrap gap-2">
                    {reviewFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          activeFilter === filter
                            ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-50"
                            : "border-cyan-100/15 bg-white/5 text-cyan-100/82 hover:bg-cyan-100/10"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {filteredReviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-3xl border border-cyan-100/10 bg-slate-950/45 p-4 md:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                            {review.initials}
                          </div>
                          <div>
                            <p className="text-base font-semibold text-cyan-50">{review.customer}</p>
                            <p className="text-xs text-cyan-100/65">
                              Converso por chat el {review.chatDate} sobre {review.productOrService}
                            </p>
                            <p className="mt-1 text-sm text-amber-200">{renderStars(review.stars)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusBadgeClass(review)}`}
                          >
                            {statusLabel(review)}
                          </span>
                          <span className="rounded-full border border-cyan-100/15 bg-white/5 px-2.5 py-1 text-[11px] text-cyan-100/80">
                            {review.reviewDate}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-3 text-sm leading-7 text-cyan-100/88">
                        {review.message}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {review.tags.map((tag) => (
                          <span
                            key={`${review.id}-${tag}`}
                            className="rounded-full border border-cyan-100/15 bg-slate-900/60 px-3 py-1 text-[11px] text-cyan-100/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                          href="/empresa/chat"
                          className="rounded-xl border border-cyan-100/20 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/22"
                        >
                          Responder por chat
                        </Link>
                        {review.wasResponded ? (
                          <span className="rounded-xl border border-emerald-300/35 bg-emerald-300/12 px-3 py-2 text-xs font-semibold text-emerald-100">
                            Respondida
                          </span>
                        ) : (
                          <span className="rounded-xl border border-amber-300/35 bg-amber-300/12 px-3 py-2 text-xs font-semibold text-amber-100">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
