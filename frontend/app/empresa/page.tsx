"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { requireAuth } from "@/lib/auth/authGuard";
import { CompanyPageHeader } from "../components/CompanyPageSections";
import { CompanySidebar } from "./CompanySidebar";
import {
  alertItems,
  aiThinkingStates,
  askCompanyAi,
  fetchCompanySummary,
  executiveMetrics,
  recentActivity,
  radarBars,
  recommendedAiQuestions,
  strategicActions,
  type AiBusinessInsight,
} from "../lib/companyApi";

export default function EmpresaPage() {
  const router = useRouter();

  useEffect(() => {
    requireAuth(router);
  }, [router]);

  useEffect(() => {
    void fetchCompanySummary().then((summary) => {
      const payload = summary as {
        metrics?: typeof executiveMetrics;
        alerts?: typeof alertItems;
        recentActivity?: typeof recentActivity;
        radar?: typeof radarBars;
        recommendedActions?: typeof strategicActions;
        ai?: { recommendedQuestions?: string[] };
      };

      setSummaryMetrics(payload.metrics ?? executiveMetrics);
      setSummaryAlerts(payload.alerts ?? alertItems);
      setSummaryActivity(payload.recentActivity ?? recentActivity);
      setSummaryRadar(payload.radar ?? radarBars);
      setSummaryActions(payload.recommendedActions ?? strategicActions);
      setSummaryQuestions(payload.ai?.recommendedQuestions ?? recommendedAiQuestions);
    });
  }, []);

  const [summaryMetrics, setSummaryMetrics] = useState(executiveMetrics);
  const [summaryAlerts, setSummaryAlerts] = useState(alertItems);
  const [summaryActivity, setSummaryActivity] = useState(recentActivity);
  const [summaryRadar, setSummaryRadar] = useState(radarBars);
  const [summaryActions, setSummaryActions] = useState(strategicActions);
  const [summaryQuestions, setSummaryQuestions] = useState(recommendedAiQuestions);
  const [aiQuestion, setAiQuestion] = useState("");
  const [lastAiQuestion, setLastAiQuestion] = useState("");
  const [aiInsight, setAiInsight] = useState<AiBusinessInsight | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [thinkingMessageIndex, setThinkingMessageIndex] = useState(0);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAiThinking) return;

    const interval = setInterval(() => {
      setThinkingMessageIndex((current) => (current + 1) % aiThinkingStates.length);
    }, 900);

    return () => clearInterval(interval);
  }, [isAiThinking]);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  const runAiQuestion = (rawQuestion: string) => {
    const trimmedQuestion = rawQuestion.trim();
    if (!trimmedQuestion || isAiThinking) return;

    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }

    setAiQuestion(trimmedQuestion);
    setLastAiQuestion(trimmedQuestion);
    setAiInsight(null);
    setIsAiThinking(true);
    setThinkingMessageIndex(0);

    aiTimeoutRef.current = setTimeout(() => {
      void askCompanyAi(trimmedQuestion).then((insight) => {
        setAiInsight(insight as AiBusinessInsight);
        setIsAiThinking(false);
      });
      aiTimeoutRef.current = null;
    }, 1700);
  };

  const handleAiSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAiQuestion(aiQuestion);
  };

  return (
    <div className="flex-1 pb-8">
      <CompanyPageHeader
        sectionLabel="Empresa activa"
        brandHref="/"
        middleSlot={(
          <div className="inline-flex rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            <span className="ml-2 md:ml-0">Ultima sesion: hace 2 dias</span>
          </div>
        )}
      />

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">PANEL EJECUTIVO</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Estado de tu empresa</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Lo mas importante desde tu ultima visita para tomar decisiones rapido.
            </p>
          </section>

          <CompanySidebar />

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Radar de negocio</p>
            <div className="mt-4 space-y-3">
              {summaryRadar.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-cyan-100/75">
                    <span>{bar.label}</span>
                    <span>{bar.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full border border-cyan-100/12 bg-slate-950/45">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.9))]"
                      style={{ width: `${bar.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(125deg,rgba(7,29,50,0.96),rgba(9,44,73,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/35 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">RESUMEN DESDE TU ULTIMA VISITA</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">
              Lo que cambio en tu negocio mientras no estabas
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/85">
              Enfoque directo en conversion, demanda y oportunidades para tomar decisiones hoy mismo.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryMetrics.map((metric) => (
                <Link
                  key={metric.id}
                  href={metric.href}
                  className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-4 transition hover:border-cyan-300/40 hover:bg-slate-950/50"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">{metric.label}</p>
                  <p className="mt-2 text-xl font-semibold text-cyan-50">{metric.value}</p>
                  <p
                    className={`mt-1 text-xs ${
                      metric.tone === "positive" ? "text-emerald-200/90" : "text-cyan-100/75"
                    }`}
                  >
                    {metric.trend}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="tech-card overflow-hidden border border-cyan-100/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%),linear-gradient(180deg,rgba(8,18,31,0.95),rgba(5,14,25,0.98))]">
            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <article>
                <p className="tech-mono text-xs text-cyan-200/80">IA TECHMARKET</p>
                <h3 className="mt-2 text-2xl font-semibold text-cyan-50">Preguntale por tu negocio</h3>
                <p className="mt-3 text-sm leading-7 text-cyan-100/82">
                  Escribe tu consulta y la IA te responde con datos del panel y recomendaciones concretas.
                </p>

                <form onSubmit={handleAiSubmit} className="mt-5 space-y-3">
                  <textarea
                    value={aiQuestion}
                    onChange={(event) => setAiQuestion(event.target.value)}
                    placeholder="Ej: que accion me conviene priorizar hoy para vender mas?"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-cyan-100/15 bg-slate-950/45 px-4 py-3 text-sm leading-6 text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/35"
                  />

                  <button
                    type="submit"
                    disabled={isAiThinking || !aiQuestion.trim()}
                    className="rounded-2xl border border-cyan-200/30 bg-cyan-400/18 px-4 py-2.5 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/24 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAiThinking ? "IA analizando..." : "Preguntar a IA"}
                  </button>
                </form>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/65">Preguntas recomendadas</p>
                  <div className="mt-3 grid gap-2">
                    {summaryQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => runAiQuestion(question)}
                        disabled={isAiThinking}
                        className="rounded-2xl border border-cyan-100/15 bg-white/5 px-4 py-3 text-left text-sm text-cyan-100/88 transition hover:bg-cyan-100/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </article>

              <article className="rounded-3xl border border-cyan-100/15 bg-slate-950/45 p-4 md:p-5">
                <p className="tech-mono text-xs text-cyan-200/75">RESPUESTA IA</p>

                {isAiThinking ? (
                  <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                    <p className="text-sm font-semibold text-cyan-50">La IA esta pensando...</p>
                    <p className="mt-2 text-xs leading-6 text-cyan-100/75">{aiThinkingStates[thinkingMessageIndex]}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full border border-cyan-100/12 bg-slate-950/55">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.95))] transition-all duration-500"
                        style={{ width: `${40 + thinkingMessageIndex * 25}%` }}
                      />
                    </div>
                  </div>
                ) : aiInsight ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/70">Consulta</p>
                      <p className="mt-2 text-sm text-cyan-100/88">{lastAiQuestion}</p>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                      <p className="text-sm font-semibold text-cyan-50">Resumen</p>
                      <p className="mt-2 text-sm leading-7 text-cyan-100/85">{aiInsight.summary}</p>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                      <p className="text-sm font-semibold text-cyan-50">Datos detectados</p>
                      <ul className="mt-2 space-y-2">
                        {aiInsight.dataPoints.map((point) => (
                          <li key={point} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-xs text-cyan-100/82">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-emerald-100/80">Consejo IA</p>
                      <p className="mt-2 text-sm leading-7 text-emerald-50/90">{aiInsight.advice}</p>
                      <p className="mt-3 text-xs text-emerald-100/85">Siguiente paso: {aiInsight.nextStep}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-cyan-100/18 bg-slate-950/40 p-5 text-sm text-cyan-100/72">
                    Selecciona una pregunta recomendada o escribe tu consulta para recibir datos y consejos.
                  </div>
                )}
              </article>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="tech-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">ALERTAS CLAVE</p>
                  <h3 className="mt-2 text-xl font-semibold text-cyan-50">Lo que requiere atencion ahora</h3>
                </div>
                <Link
                  href="/empresa/analiticas"
                  className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/85"
                >
                  Ver detalle
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {summaryAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={alert.href}
                    className="block rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 transition hover:border-cyan-300/35"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-cyan-50">{alert.title}</p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          alert.priority === "alta"
                            ? "border-rose-300/35 bg-rose-300/12 text-rose-100"
                            : "border-cyan-100/20 bg-white/5 text-cyan-100/80"
                        }`}
                      >
                        {alert.priority === "alta" ? "Prioridad alta" : "Prioridad media"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-cyan-100/75">{alert.detail}</p>
                  </Link>
                ))}
              </div>
            </article>

            <article className="tech-card">
              <p className="tech-mono text-xs text-cyan-200/75">ACTIVIDAD RECIENTE</p>
              <h3 className="mt-2 text-xl font-semibold text-cyan-50">Lo ultimo en tu empresa</h3>

              <div className="mt-4 space-y-3">
                {summaryActivity.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-cyan-50">{item.title}</p>
                      <span className="text-[11px] text-cyan-200/70">{item.time}</span>
                    </div>
                    <p className="mt-2 text-xs text-cyan-100/75">{item.detail}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">DECISIONES RECOMENDADAS</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Siguientes acciones de alto impacto</h3>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {summaryActions.map((action) => (
                <article
                  key={action.id}
                  className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4"
                >
                  <p className="text-sm font-semibold text-cyan-50">{action.title}</p>
                  <p className="mt-2 text-xs leading-6 text-cyan-100/78">{action.description}</p>
                  <p className="mt-3 text-[11px] text-emerald-200/90">{action.impact}</p>
                  <Link
                    href={action.href}
                    className="mt-3 inline-flex rounded-xl border border-cyan-200/25 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/22"
                  >
                    {action.cta}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}



