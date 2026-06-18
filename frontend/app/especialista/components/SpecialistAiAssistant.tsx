"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  askSpecialistAi,
  getSpecialistAiInsights,
  getSpecialistImprovementPlan,
  getSpecialistPricingSuggestion,
  getSpecialistScheduleOptimization,
  type BusinessInsight,
  type SpecialistAiInsightsResponse,
} from "@/lib/api/specialistAiApi";
import type { SpecialistService } from "../specialistData";

type AiResult = { title: string; data: BusinessInsight };

type SpecialistAiAssistantProps = {
  services: SpecialistService[];
};

function pickDefaultService(services: SpecialistService[]): SpecialistService | null {
  return services.find((service) => service.featured) ?? services[0] ?? null;
}

function renderList(items?: string[]) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 space-y-2 text-sm leading-6 text-cyan-100/78">
      {items.map((item) => (
        <li key={item} className="rounded-2xl border border-cyan-100/10 bg-white/5 px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

function renderResult(result: AiResult | null) {
  if (!result) {
    return (
      <p className="text-sm leading-6 text-cyan-100/75">
        Escribe una consulta o usa una accion rapida para recibir recomendaciones reales desde TechMarket-AI.
      </p>
    );
  }

  const { data } = result;

  return (
    <div className="space-y-3">
      {data.summary ? <p className="text-sm font-semibold text-cyan-50">{data.summary}</p> : null}
      {data.advice ? <p className="text-sm leading-6 text-cyan-100/78">{data.advice}</p> : null}

      {data.dataPoints?.length ? (
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">Datos clave</p>
          {renderList(data.dataPoints)}
        </div>
      ) : null}

      {data.actionPlan?.length ? (
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">Plan de accion</p>
          {renderList(data.actionPlan)}
        </div>
      ) : null}

      {data.watchItems?.length ? (
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">A vigilar</p>
          {renderList(data.watchItems)}
        </div>
      ) : null}

      {data.nextStep ? (
        <p className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm leading-6 text-emerald-50">
          Siguiente paso: {data.nextStep}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {data.priority ? (
          <span className="rounded-full border border-cyan-100/15 bg-white/5 px-2.5 py-1 text-cyan-100/80">
            Prioridad: {data.priority}
          </span>
        ) : null}
        {data.confidence ? (
          <span className="rounded-full border border-cyan-100/15 bg-white/5 px-2.5 py-1 text-cyan-100/80">
            Confianza: {data.confidence}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function SpecialistAiAssistant({ services }: SpecialistAiAssistantProps) {
  const [insights, setInsights] = useState<SpecialistAiInsightsResponse | null>(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AiResult | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultService = useMemo(() => pickDefaultService(services), [services]);

  useEffect(() => {
    let active = true;

    async function loadInsights() {
      try {
        setLoadingInsights(true);
        setError(null);
        const response = await getSpecialistAiInsights();
        if (active) {
          setInsights(response);
        }
      } catch (err) {
        if (active) {
          setInsights(null);
          setError(err instanceof Error ? err.message : "No se pudo cargar la IA del especialista.");
        }
      } finally {
        if (active) {
          setLoadingInsights(false);
        }
      }
    }

    loadInsights();

    return () => {
      active = false;
    };
  }, []);

  async function runAction(key: string, request: () => Promise<BusinessInsight>, title: string) {
    try {
      setLoadingAction(key);
      setError(null);
      const response = await request();
      setResult({ title, data: response });
    } catch (err) {
      setError(err instanceof Error ? err.message : "La IA no pudo completar la accion.");
    } finally {
      setLoadingAction(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runAction("query", () => askSpecialistAi(question), "Respuesta IA");
  }

  function handlePricingSuggestion() {
    const serviceName = defaultService?.name ?? "Servicio tecnico";
    void runAction(
      "pricing",
      () => getSpecialistPricingSuggestion({ serviceName }),
      `Precio sugerido para ${serviceName}`,
    );
  }

  function handleImprovementPlan() {
    const focus = defaultService?.type || "perfil tecnico";
    void runAction(
      "improvement",
      () => getSpecialistImprovementPlan({ focus }),
      `Plan de mejora: ${focus}`,
    );
  }

  function handleScheduleOptimization() {
    void runAction("schedule", () => getSpecialistScheduleOptimization(), "Optimizacion de agenda");
  }

  const isSubmitting = loadingAction === "query";
  const canAsk = question.trim().length > 0 && !loadingAction;

  return (
    <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="tech-mono text-xs text-cyan-200/75">IA TECHMARKET</p>
          <h3 className="mt-2 text-2xl font-bold text-white">Asistente IA del especialista</h3>
        </div>
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
          IA real (Gemini)
        </span>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-cyan-50">Insights del backend</p>
          {loadingInsights ? (
            <p className="mt-3 text-sm text-cyan-100/70">Cargando insights de IA...</p>
          ) : insights ? (
            <div className="mt-3 space-y-3">
              {insights.radarBars?.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {insights.radarBars.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">{item.label}</p>
                      <p className="mt-1 text-xl font-bold text-cyan-50">{item.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {insights.recommendedQuestions?.length ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">Preguntas sugeridas</p>
                  <div className="mt-2 grid gap-2">
                    {insights.recommendedQuestions.map((suggested) => (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => setQuestion(suggested)}
                        className="rounded-2xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-left text-sm text-cyan-100/82 transition hover:bg-cyan-100/10"
                      >
                        {suggested}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {insights.scenarioPrompts?.length ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">Escenarios</p>
                  <div className="mt-2 space-y-2">
                    {insights.scenarioPrompts.map((scenario) => (
                      <button
                        key={scenario.title}
                        type="button"
                        onClick={() => setQuestion(scenario.prompt)}
                        className="block w-full rounded-2xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2 text-left transition hover:bg-cyan-100/10"
                      >
                        <p className="text-sm font-semibold text-cyan-50">{scenario.title}</p>
                        <p className="mt-1 text-xs leading-5 text-cyan-100/72">{scenario.impact}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-cyan-100/70">
              La IA no esta disponible en este momento. Puedes seguir usando el panel y reintentar luego.
            </p>
          )}

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={handlePricingSuggestion}
              disabled={Boolean(loadingAction)}
              className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingAction === "pricing" ? "Calculando..." : "Precio"}
            </button>
            <button
              type="button"
              onClick={handleImprovementPlan}
              disabled={Boolean(loadingAction)}
              className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingAction === "improvement" ? "Generando..." : "Mejora"}
            </button>
            <button
              type="button"
              onClick={handleScheduleOptimization}
              disabled={Boolean(loadingAction)}
              className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingAction === "schedule" ? "Optimizando..." : "Agenda"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
          <form onSubmit={handleSubmit}>
            <label htmlFor="specialist-ai-question" className="text-sm font-semibold text-cyan-50">
              Consulta a la IA
            </label>
            <textarea
              id="specialist-ai-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              placeholder="Ej: Como puedo mejorar mis solicitudes esta semana?"
              className="mt-3 w-full resize-none rounded-2xl border border-cyan-100/10 bg-slate-950/60 px-4 py-3 text-sm text-cyan-50 outline-none transition placeholder:text-cyan-100/35 focus:border-cyan-300/45"
            />
            <button
              type="submit"
              disabled={!canAsk}
              className="mt-3 rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "IA analizando..." : "Preguntar a IA"}
            </button>
          </form>

          <div className="mt-5 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">{result?.title ?? "Respuesta IA"}</p>
            <div className="mt-3">{renderResult(result)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
