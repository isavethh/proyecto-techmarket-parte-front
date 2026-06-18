"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  askSpecialistAi,
  getSpecialistAiInsights,
  getSpecialistImprovementPlan,
  getSpecialistPricingSuggestion,
  getSpecialistScheduleOptimization,
  type SpecialistAiInsightsResponse,
  type SpecialistAiQueryResponse,
  type SpecialistImprovementPlanResponse,
  type SpecialistPricingSuggestionResponse,
  type SpecialistScheduleOptimizationResponse,
} from "@/lib/api/specialistAiApi";
import type { SpecialistService } from "../specialistData";

type AiResult =
  | { type: "query"; title: string; data: SpecialistAiQueryResponse }
  | { type: "pricing"; title: string; data: SpecialistPricingSuggestionResponse }
  | { type: "improvement"; title: string; data: SpecialistImprovementPlanResponse }
  | { type: "schedule"; title: string; data: SpecialistScheduleOptimizationResponse };

type SpecialistAiAssistantProps = {
  services: SpecialistService[];
};

function parsePrice(value?: string): number {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

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
        Escribe una consulta o usa una accion rapida para recibir recomendaciones reales desde TechMarket-IA.
      </p>
    );
  }

  if (result.type === "query") {
    const answer = result.data.respuesta;
    return (
      <div>
        <p className="text-sm font-semibold text-cyan-50">{answer?.resumen ?? "La IA respondio la consulta."}</p>
        {renderList(answer?.planAccion)}
        {answer?.foco ? <p className="mt-3 text-xs uppercase tracking-[0.14em] text-emerald-100/80">Foco: {answer.foco}</p> : null}
      </div>
    );
  }

  if (result.type === "pricing") {
    const suggestion = result.data.sugerencia;
    return (
      <div>
        <p className="text-sm font-semibold text-cyan-50">
          Precio recomendado: {suggestion?.precioRecomendado ?? "No disponible"}
        </p>
        {suggestion?.rangoOptimo ? (
          <p className="mt-2 text-sm text-cyan-100/75">
            Rango optimo: {suggestion.rangoOptimo.min ?? "min"} - {suggestion.rangoOptimo.max ?? "max"}
          </p>
        ) : null}
        {suggestion?.justificacion ? <p className="mt-3 text-sm leading-6 text-cyan-100/78">{suggestion.justificacion}</p> : null}
      </div>
    );
  }

  if (result.type === "improvement") {
    return (
      <div>
        <p className="text-sm font-semibold text-cyan-50">{result.data.plan?.objetivo ?? "Plan de mejora generado."}</p>
        {renderList(result.data.plan?.acciones)}
        {result.data.plan?.tiempoEstimado ? (
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-emerald-100/80">
            Tiempo estimado: {result.data.plan.tiempoEstimado}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold text-cyan-50">{result.data.sugerencia ?? "Optimizacion de agenda generada."}</p>
      {renderList(result.data.planSugerido)}
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

  async function runAction<T>(key: string, request: () => Promise<T>, onSuccess: (data: T) => AiResult) {
    try {
      setLoadingAction(key);
      setError(null);
      const response = await request();
      setResult(onSuccess(response));
    } catch (err) {
      setError(err instanceof Error ? err.message : "La IA no pudo completar la accion.");
    } finally {
      setLoadingAction(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runAction(
      "query",
      () => askSpecialistAi(question),
      (data) => ({ type: "query", title: "Respuesta IA", data }),
    );
  }

  function handlePricingSuggestion() {
    const serviceName = defaultService?.name ?? "Servicio tecnico";
    void runAction(
      "pricing",
      () =>
        getSpecialistPricingSuggestion({
          servicio: serviceName,
          precioActual: parsePrice(defaultService?.price),
        }),
      (data) => ({ type: "pricing", title: `Precio sugerido para ${serviceName}`, data }),
    );
  }

  function handleImprovementPlan() {
    const area = insights?.focoSugerido?.trim() || defaultService?.type || "perfil tecnico";
    void runAction(
      "improvement",
      () => getSpecialistImprovementPlan({ area }),
      (data) => ({ type: "improvement", title: `Plan de mejora: ${area}`, data }),
    );
  }

  function handleScheduleOptimization() {
    void runAction(
      "schedule",
      () => getSpecialistScheduleOptimization(),
      (data) => ({ type: "schedule", title: "Optimizacion de agenda", data }),
    );
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
          Backend real
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
              {insights.recomendacion ? <p className="text-sm leading-6 text-cyan-100/78">{insights.recomendacion}</p> : null}
              {insights.focoSugerido ? (
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-100/80">Foco sugerido: {insights.focoSugerido}</p>
              ) : null}
              {insights.radar?.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {insights.radar.map((item) => (
                    <div key={`${item.etiqueta ?? item.label}-${item.valor ?? item.value}`} className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">{item.etiqueta ?? item.label}</p>
                      <p className="mt-1 text-xl font-bold text-cyan-50">{item.valor ?? item.value ?? 0}</p>
                    </div>
                  ))}
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
