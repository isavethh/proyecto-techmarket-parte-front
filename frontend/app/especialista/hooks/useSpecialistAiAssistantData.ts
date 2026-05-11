"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getSpecialistAiInsights,
  loginTechMarket,
  sendSpecialistAiQuery,
  type SpecialistAiInsights,
  type SpecialistAiQueryResponse,
  type SpecialistAiInsightPayload,
} from "@/lib/api/specialists";

export type SpecialistAiInsight = {
  summary: string;
  dataPoints: string[];
  advice: string;
  nextStep: string;
  actionPlan: string[];
  watchItems: string[];
  priority: "Alta" | "Media";
  confidence: "Alta" | "Media";
  focusLabel: string;
  focusHref: string;
};

export type SpecialistAiScenarioPrompt = {
  title: string;
  prompt: string;
  impact: string;
};

export type SpecialistAiRadarBar = {
  label: string;
  value: number;
};

export type SpecialistAiUiState = {
  recommendedQuestions: string[];
  scenarioPrompts: SpecialistAiScenarioPrompt[];
  radarBars: SpecialistAiRadarBar[];
  initialInsight: SpecialistAiInsight | null;
};

type FallbackState = Omit<SpecialistAiUiState, "initialInsight">;

function unwrapInsights(response: SpecialistAiInsights): SpecialistAiInsights {
  return response.value ?? response.data ?? response;
}

function unwrapQuery(response: SpecialistAiQueryResponse): SpecialistAiInsightPayload {
  return response.value ?? response.data ?? response;
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringList(value: unknown, fallback: string[]) {
  return Array.isArray(value) && value.some((item) => typeof item === "string" && item.trim())
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : fallback;
}

function priority(value: unknown): "Alta" | "Media" {
  return typeof value === "string" && value.toLowerCase().includes("alta") ? "Alta" : "Media";
}

function confidence(value: unknown): "Alta" | "Media" {
  return typeof value === "string" && value.toLowerCase().includes("media") ? "Media" : "Alta";
}

function numberValue(value: unknown, fallback: number) {
  if (typeof value === "number") {
    return Math.min(Math.max(value, 0), 100);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 100) : fallback;
  }

  return fallback;
}

export function mapBackendAiQueryToUiInsight(
  response: SpecialistAiQueryResponse | SpecialistAiInsightPayload,
  fallbackInsight: SpecialistAiInsight,
): SpecialistAiInsight {
  const payload = unwrapQuery(response as SpecialistAiQueryResponse);

  return {
    summary: text(payload.summary ?? payload.resumen, fallbackInsight.summary),
    dataPoints: stringList(payload.dataPoints ?? payload.datos, fallbackInsight.dataPoints),
    advice: text(payload.advice ?? payload.consejo, fallbackInsight.advice),
    nextStep: text(payload.nextStep ?? payload.siguientePaso, fallbackInsight.nextStep),
    actionPlan: stringList(payload.actionPlan ?? payload.planAccion, fallbackInsight.actionPlan),
    watchItems: stringList(payload.watchItems ?? payload.indicadores, fallbackInsight.watchItems),
    priority: priority(payload.priority ?? payload.prioridad),
    confidence: confidence(payload.confidence ?? payload.confianza),
    focusLabel: text(payload.focusLabel ?? payload.etiquetaFoco, fallbackInsight.focusLabel),
    focusHref: text(payload.focusHref ?? payload.enlaceFoco, fallbackInsight.focusHref),
  };
}

export function mapBackendAiInsightsToUiState(
  response: SpecialistAiInsights,
  fallback: FallbackState,
  fallbackInsight: SpecialistAiInsight,
): SpecialistAiUiState {
  const payload = unwrapInsights(response);
  const prompts = payload.scenarioPrompts ?? payload.prompts ?? [];
  const radar = payload.radarBars ?? payload.radar ?? [];

  return {
    recommendedQuestions: stringList(
      payload.recommendedQuestions ?? payload.preguntasRecomendadas,
      fallback.recommendedQuestions,
    ),
    scenarioPrompts: Array.isArray(prompts) && prompts.length > 0
      ? prompts.map((item, index) => ({
          title: text(item.title ?? item.titulo, fallback.scenarioPrompts[index]?.title ?? "Prompt IA"),
          prompt: text(item.prompt, fallback.scenarioPrompts[index]?.prompt ?? "Analiza mi operacion tecnica."),
          impact: text(item.impact ?? item.impacto, fallback.scenarioPrompts[index]?.impact ?? "Mejora la operacion."),
        }))
      : fallback.scenarioPrompts,
    radarBars: Array.isArray(radar) && radar.length > 0
      ? radar.map((item, index) => ({
          label: text(item.label ?? item.etiqueta, fallback.radarBars[index]?.label ?? "Indicador IA"),
          value: numberValue(item.value ?? item.valor, fallback.radarBars[index]?.value ?? 50),
        }))
      : fallback.radarBars,
    initialInsight: payload.insight ? mapBackendAiQueryToUiInsight(payload.insight, fallbackInsight) : null,
  };
}

export function useSpecialistAiAssistantData(fallback: FallbackState, fallbackInsightFactory: (question: string) => SpecialistAiInsight) {
  const [aiState, setAiState] = useState<SpecialistAiUiState>({ ...fallback, initialInsight: null });
  const [auth, setAuth] = useState<{ token: string; userId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAiInsights() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const insights = await getSpecialistAiInsights(login.accessToken, login.userId);

        if (!isMounted) {
          return;
        }

        setAuth({ token: login.accessToken, userId: login.userId });
        setAiState(mapBackendAiInsightsToUiState(insights, fallback, fallbackInsightFactory("")));
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar IA");
        setAiState({ ...fallback, initialInsight: null });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAiInsights();

    return () => {
      isMounted = false;
    };
  }, [fallback, fallbackInsightFactory]);

  const askAi = useCallback(async (question: string) => {
    const fallbackInsight = fallbackInsightFactory(question);

    if (!auth) {
      return fallbackInsight;
    }

    try {
      const response = await sendSpecialistAiQuery(auth.token, auth.userId, question);
      return mapBackendAiQueryToUiInsight(response, fallbackInsight);
    } catch {
      return fallbackInsight;
    }
  }, [auth, fallbackInsightFactory]);

  return useMemo(
    () => ({ ...aiState, loading, error, askAi }),
    [aiState, loading, error, askAi],
  );
}
