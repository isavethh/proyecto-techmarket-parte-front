"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type SpecialistAiInsight = {
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

const recommendedAiQuestions = [
  "Que casos debo priorizar hoy para atender mas rapido?",
  "Que guion uso para diagnostico remoto en menos de 5 minutos?",
  "Como responder una resena media con propuesta concreta?",
  "Que evidencia mostrar en portafolio para cerrar mas servicios?",
  "Que ajuste de disponibilidad me conviene esta semana?",
];

const aiThinkingStates = [
  "Interpretando urgencia tecnica y contexto del caso...",
  "Cruzando disponibilidad, tipo de falla y probabilidad de cierre...",
  "Detectando pasos de diagnostico y riesgos operativos...",
  "Generando plan accionable para ejecutar hoy...",
];

const aiSignals = ["DIAG", "INTENT", "ROUTE", "ACTION"];

const scenarioPrompts = [
  {
    title: "Triaging de agenda",
    prompt: "Disename un triaging de 3 pasos para ordenar casos urgentes hoy.",
    impact: "Mejora velocidad de atencion.",
  },
  {
    title: "Diagnostico remoto",
    prompt: "Que preguntas debo hacer para confirmar si una falla se resuelve remoto o en visita?",
    impact: "Reduce visitas innecesarias.",
  },
  {
    title: "Recuperar reputacion",
    prompt: "Escribeme una respuesta profesional para una resena de 3 estrellas y un plan de seguimiento.",
    impact: "Protege confianza del cliente.",
  },
];

const specialistRadarBars = [
  { label: "Urgencia de casos", value: 79 },
  { label: "Probabilidad de cierre", value: 72 },
  { label: "Carga operativa", value: 66 },
  { label: "Potencial de reputacion", value: 84 },
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
  const [aiQuestion, setAiQuestion] = useState("");
  const [lastAiQuestion, setLastAiQuestion] = useState("");
  const [aiInsight, setAiInsight] = useState<SpecialistAiInsight | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [thinkingMessageIndex, setThinkingMessageIndex] = useState(0);
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
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
      setAiInsight(buildSpecialistAiInsight(trimmedQuestion));
      setIsAiThinking(false);
      setRecentQuestions((current) => {
        const withoutCurrent = current.filter(
          (item) => item.toLowerCase() !== trimmedQuestion.toLowerCase(),
        );
        return [trimmedQuestion, ...withoutCurrent].slice(0, 4);
      });
      aiTimeoutRef.current = null;
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
                onChange={(event) => setAiQuestion(event.target.value)}
                placeholder="Ej: que casos debo priorizar hoy para atender mas rapido?"
                rows={4}
                className="w-full resize-none rounded-2xl border border-cyan-100/15 bg-slate-950/45 px-4 py-3 text-sm leading-6 text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/35"
              />

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
                {recommendedAiQuestions.map((question) => (
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
            ) : aiInsight ? (
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
                        aiInsight.priority === "Alta"
                          ? "border-rose-300/35 bg-rose-300/12 text-rose-100"
                          : "border-cyan-100/20 bg-white/5 text-cyan-100/80"
                      }`}
                    >
                      Prioridad {aiInsight.priority}
                    </span>
                    <span className="rounded-full border border-cyan-100/20 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-cyan-100/80">
                      Confianza {aiInsight.confidence}
                    </span>
                  </div>
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

                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                  <p className="text-sm font-semibold text-cyan-50">Plan de accion</p>
                  <div className="mt-2 space-y-2">
                    {aiInsight.actionPlan.map((step, index) => (
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
                  <p className="mt-2 text-sm leading-7 text-emerald-50/90">{aiInsight.advice}</p>
                  <p className="mt-3 text-xs text-emerald-100/85">Siguiente paso: {aiInsight.nextStep}</p>
                  <Link
                    href={aiInsight.focusHref}
                    className="mt-3 inline-flex rounded-xl border border-emerald-200/25 bg-emerald-300/18 px-3 py-2 text-xs font-semibold text-emerald-50 transition hover:bg-emerald-200/24"
                  >
                    {aiInsight.focusLabel}
                  </Link>
                </div>

                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-4">
                  <p className="text-sm font-semibold text-cyan-50">Indicadores a vigilar</p>
                  <ul className="mt-2 space-y-2">
                    {aiInsight.watchItems.map((item) => (
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

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-cyan-100/12 bg-slate-950/35 p-4 md:p-5">
            <p className="tech-mono text-xs text-cyan-200/75">PLAYBOOK IA</p>
            <h4 className="mt-2 text-xl font-semibold text-cyan-50">Prompts listos para usar</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {scenarioPrompts.map((scenario) => (
                <article key={scenario.title} className="rounded-2xl border border-cyan-100/12 bg-slate-950/40 p-4">
                  <p className="text-sm font-semibold text-cyan-50">{scenario.title}</p>
                  <p className="mt-2 text-xs leading-6 text-cyan-100/78">{scenario.prompt}</p>
                  <p className="mt-3 text-[11px] text-emerald-200/88">{scenario.impact}</p>
                  <button
                    type="button"
                    onClick={() => runAiQuestion(scenario.prompt)}
                    disabled={isAiThinking}
                    className="mt-3 rounded-xl border border-cyan-100/15 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Usar prompt
                  </button>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-cyan-100/12 bg-slate-950/35 p-4 md:p-5">
            <p className="text-sm font-semibold text-cyan-50">Radar IA</p>
            <div className="mt-4 space-y-3">
              {specialistRadarBars.map((bar) => (
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
          </article>
        </section>
      </div>
    </section>
  );
}
