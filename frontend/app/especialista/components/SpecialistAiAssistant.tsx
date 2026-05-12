"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  useSpecialistAiAssistantData,
  type SpecialistAiInsight,
} from "../hooks/useSpecialistAiAssistantData";

const defaultRecommendedQuestions = [
  "¿Qué casos debo priorizar hoy?",
  "¿Qué servicios tienen mayor oportunidad de cierre?",
  "¿Cómo puedo mejorar mi reputación esta semana?",
  "¿Qué agenda o bloqueos debo revisar?",
  "¿Qué debo responder primero a mis clientes?",
];

const aiThinkingStates = [
  "Interpretando urgencia tecnica y contexto del caso...",
  "Cruzando disponibilidad, tipo de falla y probabilidad de cierre...",
  "Detectando pasos de diagnostico y riesgos operativos...",
  "Generando plan accionable para ejecutar hoy...",
];

const aiSignals = ["DIAG", "INTENT", "ROUTE", "ACTION"];

const defaultReadyPrompts = [
  {
    title: "Priorizar agenda",
    prompt: "Analiza mi agenda, bloqueos y solicitudes activas. Recomiéndame qué casos priorizar hoy y por qué.",
  },
  {
    title: "Mejorar reputación",
    prompt: "Revisa mis reseñas, respuestas pendientes y señales de confianza. Indícame acciones concretas para mejorar mi reputación esta semana.",
  },
  {
    title: "Revisar oportunidades comerciales",
    prompt: "Analiza mis servicios, solicitudes y proyectos recientes. Identifica oportunidades de cierre o seguimiento comercial.",
  },
  {
    title: "Preparar seguimiento a clientes",
    prompt: "Ayúdame a preparar mensajes de seguimiento para clientes recientes, priorizando casos con mayor impacto.",
  },
  {
    title: "Optimizar portafolio",
    prompt: "Revisa mi portafolio y recomiéndame qué evidencia, casos o certificaciones debería destacar para generar más confianza.",
  },
];

const specialistRadarBars = [
  { label: "Urgencia de casos", value: 79 },
  { label: "Probabilidad de cierre", value: 72 },
  { label: "Carga operativa", value: 66 },
  { label: "Potencial de reputacion", value: 84 },
  { label: "Visibilidad del perfil", value: 74 },
  { label: "Riesgo de abandono", value: 31 },
];

function buildSpecialistAiInsight(question: string): SpecialistAiInsight {
  const text = question.toLowerCase();

  if (text.includes("agenda") || text.includes("prioriz") || text.includes("ruta") || text.includes("hoy")) {
    return {
      summary:
        "Tu mejor palanca hoy es ejecutar un triaging por urgencia y zona para reducir tiempos muertos y aumentar servicios cerrados.",
      dataPoints: [
        "Hay consultas con senales de urgencia que requieren primera respuesta rapida.",
        "El mayor costo operativo esta en traslados desordenados.",
        "Agrupar por zona puede liberar al menos una ventana adicional de atencion.",
      ],
      advice:
        "Prioriza primero casos con riesgo de perdida de cliente y despues agenda por cercania geografica. El objetivo es cerrar rapido sin saturarte.",
      nextStep: "Bloquea 90 minutos para los dos casos criticos y deja 30 minutos de seguimiento comercial.",
      actionPlan: [
        "Etiqueta solicitudes en critica, importante y seguimiento.",
        "Agrupa visitas por zona para compactar desplazamientos.",
        "Confirma agenda de manana antes de cerrar la jornada.",
      ],
      watchItems: [
        "Tiempo promedio de primera respuesta.",
        "Casos pendientes despues de 24 horas.",
        "Visitas reprogramadas por mala planificacion.",
      ],
      priority: "Alta",
      confidence: "Alta",
      focusLabel: "Ajustar disponibilidad",
      focusHref: "/especialista/disponibilidad",
    };
  }

  if (
    text.includes("diagnostic") ||
    text.includes("falla") ||
    text.includes("error") ||
    text.includes("no enciende") ||
    text.includes("lento") ||
    text.includes("internet")
  ) {
    return {
      summary:
        "Antes de desplazarte, conviene cerrar un prediagnostico remoto para llegar con herramientas exactas y mejor estimacion de tiempo.",
      dataPoints: [
        "Las fallas reportadas sin evidencia elevan el riesgo de visita improductiva.",
        "Una secuencia corta de preguntas mejora precision del primer intento.",
        "Confirmar contexto de la falla evita reprocesos y segundas visitas.",
      ],
      advice:
        "Pide siempre evidencia minima y valida sintomas antes de confirmar visita. Asi mejoras tiempos y percepcion profesional.",
      nextStep: "Envia hoy un guion de 4 preguntas a cada caso nuevo y marca los que se pueden resolver remoto.",
      actionPlan: [
        "Solicita foto, video o mensaje de error.",
        "Pregunta cuando comenzo la falla y que cambio hubo antes.",
        "Define si corresponde soporte remoto o visita tecnica.",
      ],
      watchItems: [
        "Porcentaje de casos resueltos en primera visita.",
        "Casos filtrados exitosamente por diagnostico remoto.",
        "Tiempo invertido por caso segun tipo de falla.",
      ],
      priority: "Alta",
      confidence: "Alta",
      focusLabel: "Revisar servicios",
      focusHref: "/especialista/servicios",
    };
  }

  if (
    text.includes("resena") ||
    text.includes("comentario") ||
    text.includes("calificacion") ||
    text.includes("reput")
  ) {
    return {
      summary:
        "Una resena media puede convertirse en fortaleza si respondes rapido, muestras empatia y ejecutas seguimiento verificable.",
      dataPoints: [
        "El tiempo de respuesta influye directamente en percepcion de profesionalismo.",
        "Las respuestas defensivas reducen confianza en nuevos clientes.",
        "Una solucion con fecha concreta mejora la probabilidad de correccion publica.",
      ],
      advice:
        "Responde en tono calmado y orientado a solucion. No discutas detalles tecnicos en publico; lleva la solucion a un canal directo.",
      nextStep: "Publica respuesta en menos de 2 horas y agenda una revision correctiva en la misma conversacion.",
      actionPlan: [
        "Reconoce el inconveniente sin justificarte de inmediato.",
        "Propone una accion concreta con dia y hora.",
        "Solicita confirmacion final despues de resolver el caso.",
      ],
      watchItems: [
        "Tiempo de respuesta a nuevas resenas.",
        "Resenas actualizadas despues del seguimiento.",
        "Tono promedio en comentarios recibidos.",
      ],
      priority: "Media",
      confidence: "Media",
      focusLabel: "Gestionar reputacion",
      focusHref: "/especialista/reputacion",
    };
  }

  if (text.includes("portafolio") || text.includes("evidencia") || text.includes("foto") || text.includes("caso")) {
    return {
      summary:
        "Documentar resultados antes y despues en portafolio aumenta confianza y acelera decisiones de nuevos clientes.",
      dataPoints: [
        "Casos con evidencia visual transmiten mayor credibilidad.",
        "Los clientes valoran mas resultados concretos que descripcion tecnica extensa.",
        "Una estructura repetible simplifica futuras publicaciones.",
      ],
      advice:
        "Publica casos con contexto inicial, accion aplicada y resultado medible. Eso mejora conversion sin depender solo de precio.",
      nextStep: "Sube hoy un caso con formato antes, accion y resultado en menos de 10 lineas.",
      actionPlan: [
        "Selecciona un caso reciente con mejora visible.",
        "Resume problema, intervencion y resultado final.",
        "Cierra con invitacion clara a cotizar por chat.",
      ],
      watchItems: [
        "Interacciones por caso publicado.",
        "Consultas iniciadas desde portafolio.",
        "Tiempo de permanencia en publicaciones tecnicas.",
      ],
      priority: "Media",
      confidence: "Alta",
      focusLabel: "Actualizar portafolio",
      focusHref: "/especialista/portafolio",
    };
  }

  return {
    summary:
      "Tu operacion puede mejorar con ciclos cortos: diagnostico previo, agenda inteligente y seguimiento de reputacion en paralelo.",
    dataPoints: [
      "Tienes base operativa para aumentar cierres sin ampliar jornada.",
      "La estandarizacion de mensajes reduce friccion con clientes.",
      "Los mejores resultados se logran con seguimiento semanal.",
    ],
    advice:
      "Trabaja por sprint de 7 dias: una prioridad principal, un guion de atencion y un indicador de control. Ajusta cada semana.",
    nextStep: "Define una sola meta de mejora esta semana y consulta a la IA por un plan diario.",
    actionPlan: [
      "Selecciona un indicador operativo para 7 dias.",
      "Estandariza primer mensaje y prediagnostico.",
      "Registra resultados y optimiza al cierre de semana.",
    ],
    watchItems: [
      "Tiempo de respuesta inicial al cliente.",
      "Tasa de cierre por tipo de servicio.",
      "Cantidad de casos documentados con evidencia.",
    ],
    priority: "Media",
    confidence: "Alta",
    focusLabel: "Volver al resumen",
    focusHref: "/especialista",
  };
}

export function SpecialistAiAssistant() {
  const fallbackAiState = useMemo(
    () => ({
      recommendedQuestions: defaultRecommendedQuestions,
      scenarioPrompts: defaultReadyPrompts,
      radarBars: specialistRadarBars,
    }),
    [],
  );
  const {
    recommendedQuestions,
    scenarioPrompts: backendScenarioPrompts,
    radarBars,
    initialInsight,
    askAi,
  } = useSpecialistAiAssistantData(fallbackAiState, buildSpecialistAiInsight);
  const [aiQuestion, setAiQuestion] = useState("");
  const [lastAiQuestion, setLastAiQuestion] = useState("");
  const [aiInsight, setAiInsight] = useState<SpecialistAiInsight | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiError, setAiError] = useState("");
  const [thinkingMessageIndex, setThinkingMessageIndex] = useState(0);
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleRecommendedQuestions = recommendedQuestions.length > 0 ? recommendedQuestions : defaultRecommendedQuestions;
  const visibleReadyPrompts = backendScenarioPrompts.length > 0 ? backendScenarioPrompts : defaultReadyPrompts;

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

  const displayedAiInsight = aiInsight ?? initialInsight;

  const runAiQuestion = (rawQuestion: string) => {
    const trimmedQuestion = rawQuestion.trim();
    if (!trimmedQuestion) {
      setAiError("Escribe una consulta antes de preguntar a la IA.");
      return;
    }

    if (isAiThinking) return;

    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }

    setAiQuestion(trimmedQuestion);
    setLastAiQuestion(trimmedQuestion);
    setAiInsight(null);
    setAiError("");
    setIsAiThinking(true);
    setThinkingMessageIndex(0);

    aiTimeoutRef.current = setTimeout(async () => {
      try {
        const nextInsight = await askAi(trimmedQuestion);
        setAiInsight(nextInsight);
        setRecentQuestions((current) => {
          const withoutCurrent = current.filter(
            (item) => item.toLowerCase() !== trimmedQuestion.toLowerCase(),
          );
          return [trimmedQuestion, ...withoutCurrent].slice(0, 4);
        });
      } catch (err) {
        setAiError(err instanceof Error ? err.message : "No se pudo consultar a la IA.");
      } finally {
        setIsAiThinking(false);
        aiTimeoutRef.current = null;
      }
    }, 1650);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAiQuestion(aiQuestion);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
      <div className="p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="tech-mono text-xs text-cyan-200/75">CONSULTOR IA</p>
            <h3 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">Asesoria inteligente para especialista</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-100/80">
              Similar al modulo IA de empresa, pero enfocado en diagnostico tecnico, agenda y reputacion del especialista.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-100/12 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Estado del asistente</p>
            <h4 className="mt-3 text-2xl font-bold text-white">
              {isAiThinking ? "Analizando contexto..." : "Listo para recomendar"}
            </h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Consultas recientes</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{recentQuestions.length}</p>
              </div>
              <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Modo</p>
                <p className="mt-2 text-base font-semibold text-cyan-50">Diagnostico operativo</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-3xl border border-cyan-100/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_44%),linear-gradient(180deg,rgba(8,18,31,0.95),rgba(5,14,25,0.98))] p-4 md:p-5">
            <p className="tech-mono text-xs text-cyan-200/80">IA TECHMARKET</p>
            <h4 className="mt-2 text-2xl font-semibold text-cyan-50">Preguntale por tus operaciones</h4>
            <p className="mt-3 text-sm leading-7 text-cyan-100/82">
              Consulta agenda, diagnostico, reputacion o portafolio y recibe plan de accion con prioridades.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <textarea
                value={aiQuestion}
                onChange={(event) => {
                  setAiQuestion(event.target.value);
                  if (aiError) {
                    setAiError("");
                  }
                }}
                placeholder="Ej: que casos debo priorizar hoy para atender mas rapido?"
                rows={4}
                className="w-full resize-none rounded-2xl border border-cyan-100/15 bg-slate-950/45 px-4 py-3 text-sm leading-6 text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/35"
              />
              {aiError ? (
                <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {aiError}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={isAiThinking || !aiQuestion.trim()}
                  className="rounded-2xl border border-cyan-200/30 bg-cyan-400/18 px-4 py-2.5 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/24 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAiThinking ? "IA analizando..." : "Preguntar a IA"}
                </button>
                <button
                  type="button"
                  onClick={() => setAiQuestion("")}
                  className="rounded-2xl border border-cyan-100/18 bg-white/5 px-4 py-2.5 text-xs font-semibold text-cyan-100/82 transition hover:bg-cyan-100/10"
                >
                  Limpiar
                </button>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/65">Preguntas recomendadas</p>
              <div className="mt-3 grid gap-2">
                {visibleRecommendedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => setAiQuestion(question)}
                    disabled={isAiThinking}
                    className="rounded-2xl border border-cyan-100/15 bg-white/5 px-4 py-3 text-left text-sm text-cyan-100/88 transition hover:bg-cyan-100/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {recentQuestions.length > 0 ? (
              <div className="mt-5 rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/65">Consultas recientes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => runAiQuestion(question)}
                      className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1.5 text-xs text-cyan-100/82 transition hover:bg-cyan-100/10"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <article className="chat-scrollbar max-h-[680px] overflow-y-auto rounded-3xl border border-cyan-100/15 bg-slate-950/45 p-4 md:p-5">
            <p className="tech-mono text-xs text-cyan-200/75">RESPUESTA IA</p>

            {isAiThinking ? (
              <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                <p className="text-sm font-semibold text-cyan-50">La IA esta pensando...</p>
                <p className="mt-2 text-xs leading-6 text-cyan-100/75">{aiThinkingStates[thinkingMessageIndex]}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {aiSignals.map((signal, index) => (
                    <span
                      key={signal}
                      className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                        index <= thinkingMessageIndex
                          ? "border-cyan-300/35 bg-cyan-300/18 text-cyan-50"
                          : "border-cyan-100/15 bg-white/5 text-cyan-100/70"
                      }`}
                    >
                      {signal}
                    </span>
                  ))}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full border border-cyan-100/12 bg-slate-950/55">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.95))] transition-all duration-500"
                    style={{ width: `${35 + thinkingMessageIndex * 20}%` }}
                  />
                </div>
              </div>
            ) : displayedAiInsight ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/70">Consulta</p>
                  <p className="mt-2 text-sm text-cyan-100/88">{lastAiQuestion}</p>
                </div>

                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-cyan-50">Diagnostico rapido</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        displayedAiInsight.priority === "Alta"
                          ? "border-rose-300/35 bg-rose-300/12 text-rose-100"
                          : "border-cyan-100/20 bg-white/5 text-cyan-100/80"
                      }`}
                    >
                      Prioridad {displayedAiInsight.priority}
                    </span>
                    <span className="rounded-full border border-cyan-100/20 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-cyan-100/80">
                      Confianza {displayedAiInsight.confidence}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-cyan-100/85">{displayedAiInsight.summary}</p>
                </div>

                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                  <p className="text-sm font-semibold text-cyan-50">Datos detectados</p>
                  <ul className="mt-2 space-y-2">
                    {displayedAiInsight.dataPoints.map((point) => (
                      <li key={point} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-xs text-cyan-100/82">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                  <p className="text-sm font-semibold text-cyan-50">Plan de accion</p>
                  <div className="mt-2 space-y-2">
                    {displayedAiInsight.actionPlan.map((step, index) => (
                      <div
                        key={step}
                        className="flex gap-3 rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-xs text-cyan-100/82"
                      >
                        <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-cyan-100/30 text-[10px] font-semibold text-cyan-50">
                          {index + 1}
                        </span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-100/80">Consejo IA</p>
                  <p className="mt-2 text-sm leading-7 text-emerald-50/90">{displayedAiInsight.advice}</p>
                  <p className="mt-3 text-xs text-emerald-100/85">Siguiente paso: {displayedAiInsight.nextStep}</p>
                  <Link
                    href={displayedAiInsight.focusHref}
                    className="mt-3 inline-flex rounded-xl border border-emerald-200/25 bg-emerald-300/18 px-3 py-2 text-xs font-semibold text-emerald-50 transition hover:bg-emerald-200/24"
                  >
                    {displayedAiInsight.focusLabel}
                  </Link>
                </div>

                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                  <p className="text-sm font-semibold text-cyan-50">Indicadores a vigilar</p>
                  <ul className="mt-2 space-y-2">
                    {displayedAiInsight.watchItems.map((item) => (
                      <li key={item} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-xs text-cyan-100/82">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-cyan-100/18 bg-slate-950/40 p-5 text-sm text-cyan-100/72">
                Selecciona una pregunta recomendada o escribe tu consulta para recibir un analisis completo.
              </div>
            )}
          </article>
        </section>

        <section className="mt-6 grid items-stretch gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="flex h-full flex-col rounded-3xl border border-cyan-100/12 bg-slate-950/35 p-4 md:p-5">
            <p className="tech-mono text-xs text-cyan-200/75">PLAYBOOK IA</p>
            <h4 className="mt-2 text-xl font-semibold text-cyan-50">Prompts listos para usar</h4>
            <p className="mt-2 text-xs leading-6 text-cyan-100/72">
              Acciones rápidas para agenda, diagnostico, reputacion y enfoque comercial del especialista.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {visibleReadyPrompts.map((scenario) => (
                <article
                  key={scenario.title}
                  className="flex h-full min-h-[390px] flex-col rounded-2xl border border-cyan-100/12 bg-slate-950/40 p-4"
                >
                  <p className="text-sm font-semibold text-cyan-50">{scenario.title}</p>
                  <p className="mt-2 text-xs leading-6 text-cyan-100/78">{scenario.prompt}</p>

                  {"impact" in scenario && scenario.impact ? <p className="mt-3 text-[11px] text-emerald-200/88">{scenario.impact}</p> : null}

                  <button
                    type="button"
                    onClick={() => setAiQuestion(scenario.prompt)}
                    disabled={isAiThinking}
                    className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-cyan-100/15 bg-cyan-400/15 px-3 py-2.5 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Usar prompt
                  </button>
                </article>
              ))}
            </div>
            <div className="mt-auto pt-2">
              <div className="rounded-2xl border border-cyan-100/12 bg-white/5 p-4">
                <article>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/65">Uso recomendado</p>
                  <p className="mt-2 text-sm leading-6 text-cyan-100/78">
                    Usa este playbook cuando necesites decidir rapido que atender, como responder y que empujar comercialmente sin improvisar.
                  </p>
                </article>

                <article>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/65">Valor para el tecnico</p>
                  <p className="mt-2 text-sm leading-6 text-cyan-100/78">
                    La IA ayuda a ordenar agenda, mejorar diagnostico, proteger reputacion y convertir mejor dentro del ecosistema TechMarket.
                  </p>
                </article>
              </div>
            </div>
          </article>

          <article className="flex h-full flex-col rounded-3xl border border-cyan-100/12 bg-slate-950/35 p-4 md:p-5">
            <p className="text-sm font-semibold text-cyan-50">Radar IA</p>
            <p className="mt-2 text-xs leading-6 text-cyan-100/72">
              Lectura rapida de señales operativas, reputacion y capacidad comercial del especialista.
            </p>

            <div className="mt-4 space-y-3">
              {radarBars.map((bar) => (
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

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-cyan-100/12 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/65">Lectura general</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Buen potencial operativo</p>
                <p className="mt-2 text-xs leading-6 text-cyan-100/75">
                  La IA detecta margen para mejorar cierres sin ampliar jornada si priorizas agenda y seguimiento.
                </p>
              </article>

              <article className="rounded-2xl border border-cyan-100/12 bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/65">Siguiente foco</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Visibilidad + reputacion</p>
                <p className="mt-2 text-xs leading-6 text-cyan-100/75">
                  Conviene reforzar portafolio, reputacion y velocidad de respuesta para sostener confianza y conversion.
                </p>
              </article>
            </div>
            <div className="mt-auto pt-4">
              <div className="rounded-2xl border border-cyan-100/12 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/65">Recomendacion IA</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Momento favorable para captar y responder</p>
                <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                  El radar sugiere mantener velocidad de respuesta, reforzar portafolio visible y priorizar servicios con
                  mayor facilidad de cierre para mejorar conversion y confianza.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}
