"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CompanyPageHeader, CompanyPanelCard } from "../components/CompanyPageSections";

type ExecutiveMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  tone: "positive" | "neutral";
  href: string;
};

type AlertItem = {
  id: string;
  title: string;
  detail: string;
  priority: "alta" | "media";
  href: string;
};

type StrategicAction = {
  id: string;
  title: string;
  description: string;
  impact: string;
  href: string;
  cta: string;
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

type AiBusinessInsight = {
  summary: string;
  dataPoints: string[];
  advice: string;
  nextStep: string;
};

const companyModules = [
  { title: "Resumen", href: "/empresa" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Resenas", href: "/empresa/resenas" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

const executiveMetrics: ExecutiveMetric[] = [
  {
    id: "new-leads",
    label: "Leads nuevos",
    value: "24",
    trend: "+8 desde tu ultima visita",
    tone: "positive",
    href: "/empresa/chat",
  },
  {
    id: "chat-unread",
    label: "Mensajes por responder",
    value: "11",
    trend: "4 chats de alta intencion",
    tone: "neutral",
    href: "/empresa/chat",
  },
  {
    id: "conversion-rate",
    label: "Conversion semanal",
    value: "18%",
    trend: "+3.2 puntos vs semana anterior",
    tone: "positive",
    href: "/empresa/analiticas",
  },
  {
    id: "top-post",
    label: "Publicacion top",
    value: "Laptop Pro 14",
    trend: "2.3k visitas en 48h",
    tone: "neutral",
    href: "/empresa/publicaciones",
  },
];

const alertItems: AlertItem[] = [
  {
    id: "alert-1",
    title: "3 clientes preguntaron por stock hoy",
    detail: "Hay interes directo en Laptop Pro 14 y Monitor UltraWide 34.",
    priority: "alta",
    href: "/empresa/chat",
  },
  {
    id: "alert-2",
    title: "Tu mejor anuncio perdio ritmo",
    detail: "El alcance bajo 14% en las ultimas 24 horas.",
    priority: "media",
    href: "/empresa/publicaciones",
  },
  {
    id: "alert-3",
    title: "Hay oportunidad en soporte empresarial",
    detail: "Consultas tecnicas crecieron 22% esta semana.",
    priority: "media",
    href: "/empresa/analiticas",
  },
];

const strategicActions: StrategicAction[] = [
  {
    id: "action-1",
    title: "Responder chats de alta intencion",
    description: "Prioriza conversaciones con usuarios que preguntaron precio y entrega.",
    impact: "Impacto estimado: +2 a +4 conversiones hoy",
    href: "/empresa/chat",
    cta: "Ir a chat",
  },
  {
    id: "action-2",
    title: "Reactivar anuncio con mejor historial",
    description: "Actualiza imagen y CTA de tu publicacion top para recuperar alcance.",
    impact: "Impacto estimado: +18% visitas",
    href: "/empresa/publicaciones",
    cta: "Editar publicaciones",
  },
  {
    id: "action-3",
    title: "Ajustar oferta para clientes empresa",
    description: "Tus datos muestran mas demanda en mantenimiento y redes corporativas.",
    impact: "Impacto estimado: mejor ticket promedio",
    href: "/empresa/analiticas",
    cta: "Ver analiticas",
  },
];

const recentActivity: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Alejandro inicio chat por Laptop Pro 14",
    detail: "Solicito disponibilidad inmediata y opciones de pago.",
    time: "Hace 12 min",
  },
  {
    id: "activity-2",
    title: "Nueva reseña positiva (5/5)",
    detail: "Destaca rapidez de atencion y claridad del soporte.",
    time: "Hace 1 h",
  },
  {
    id: "activity-3",
    title: "Pico de visitas en publicacion de monitor",
    detail: "+320 visitas desde mediodia.",
    time: "Hoy",
  },
];

const radarBars = [
  { label: "Interes en productos", value: 82 },
  { label: "Consultas tecnicas", value: 74 },
  { label: "Conversion a chat", value: 61 },
  { label: "Retorno de clientes", value: 68 },
];

const recommendedAiQuestions = [
  "Que accion me conviene priorizar hoy para subir conversion?",
  "Que publicacion debo optimizar primero esta semana?",
  "Como responder los chats para cerrar mas ventas?",
];

const aiThinkingStates = [
  "Analizando cambios de conversion y demanda reciente...",
  "Comparando publicaciones, leads y ritmo de respuesta...",
  "Preparando una recomendacion accionable para hoy...",
];

function buildAiInsight(question: string): AiBusinessInsight {
  const normalizedQuestion = question.toLowerCase();

  if (normalizedQuestion.includes("conversion") || normalizedQuestion.includes("priorizar")) {
    return {
      summary: "Tu prioridad hoy debe ser acelerar la respuesta comercial en chats con mayor intencion de compra.",
      dataPoints: [
        "Tienes 11 mensajes por responder, 4 son de alta intencion.",
        "La conversion semanal subio a 18% (+3.2 puntos).",
        "Entraron 24 leads nuevos desde tu ultima visita.",
      ],
      advice:
        "Define una regla simple: responder en menos de 15 minutos los chats que preguntan por precio, stock o entrega. Esa velocidad mejora la probabilidad de cierre.",
      nextStep: "Abre chat y filtra primero por urgencia de compra para contactar a esos 4 leads prioritarios.",
    };
  }

  if (
    normalizedQuestion.includes("publicacion") ||
    normalizedQuestion.includes("optimizar") ||
    normalizedQuestion.includes("anuncio")
  ) {
    return {
      summary: "Optimiza primero tu publicacion de mayor historico para recuperar alcance rapido.",
      dataPoints: [
        "Laptop Pro 14 sigue como publicacion top con 2.3k visitas en 48h.",
        "El alcance de tu mejor anuncio cayo 14% en las ultimas 24 horas.",
        "Hoy hubo consultas directas de stock para ese producto.",
      ],
      advice:
        "Actualiza portada, agrega urgencia clara (stock limitado) y refuerza CTA a chat. Mantener activo el anuncio lider suele levantar el resto de publicaciones.",
      nextStep: "Edita la publicacion top y relanzala con un titulo orientado a beneficio y disponibilidad inmediata.",
    };
  }

  if (normalizedQuestion.includes("chat") || normalizedQuestion.includes("cerrar") || normalizedQuestion.includes("ventas")) {
    return {
      summary: "La forma en que respondes los primeros mensajes ya puede aumentar cierres esta misma semana.",
      dataPoints: [
        "4 conversaciones activas muestran intencion alta de compra.",
        "Las preguntas mas frecuentes fueron stock, entrega y metodos de pago.",
        "El interes por productos y servicios se mantiene sobre 70% en tu radar.",
      ],
      advice:
        "Usa una estructura fija de 3 pasos: confirmar disponibilidad, proponer opcion recomendada y cerrar con siguiente accion concreta (pago, envio o visita).",
      nextStep: "Prepara una plantilla corta de respuesta comercial para reducir tiempo y mantener consistencia.",
    };
  }

  return {
    summary: "Vas en buen ritmo, pero el mayor crecimiento vendra de ejecutar prioridades comerciales en secuencia.",
    dataPoints: [
      "24 leads nuevos en la ultima sesion comparada.",
      "Conversion semanal en 18% con tendencia positiva.",
      "Existe interes alto en productos y consultas tecnicas.",
    ],
    advice:
      "Combina acciones rapidas de chat con mejoras puntuales en publicaciones clave. Esa mezcla acelera conversion sin perder visibilidad.",
    nextStep: "Pregunta a la IA por un plan diario de ventas y seguimiento para tu equipo.",
  };
}

export default function EmpresaPage() {
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
      setAiInsight(buildAiInsight(trimmedQuestion));
      setIsAiThinking(false);
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

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">PANEL EJECUTIVO</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Estado de tu empresa</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Lo mas importante desde tu ultima visita para tomar decisiones rapido.
            </p>
          </section>

          <CompanyPanelCard links={companyModules} panelSubtitle="Empresa activa en TechMarket" />

          <section className="tech-card">
            <p className="text-sm font-semibold text-cyan-50">Radar de negocio</p>
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
              {executiveMetrics.map((metric) => (
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
                {alertItems.map((alert) => (
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
                {recentActivity.map((item) => (
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
              {strategicActions.map((action) => (
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
