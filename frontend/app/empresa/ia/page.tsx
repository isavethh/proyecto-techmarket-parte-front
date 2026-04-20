"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CompanyPageHeader, CompanyPanelCard } from "../../components/CompanyPageSections";

type AiBusinessInsight = {
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

const companyModules = [
  { title: "Perfil", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Resenas", href: "/empresa/resenas" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

const recommendedAiQuestions = [
  "Que accion me conviene priorizar hoy para subir conversion?",
  "Que publicacion debo optimizar primero esta semana?",
  "Como responder chats para cerrar mas ventas?",
  "Que servicio tiene mayor demanda real este mes?",
  "Como armo una oferta de alto impacto para empresas?",
];

const aiThinkingStates = [
  "Interpretando objetivo comercial y urgencia de negocio...",
  "Cruce de conversion, interacciones y ritmo de respuesta...",
  "Detectando oportunidades por demanda y tipo de publicacion...",
  "Preparando recomendacion concreta para ejecutar hoy...",
];

const aiSignals = ["NLP", "INTENT", "SCORE", "ACTION"];

const scenarioPrompts = [
  {
    title: "Plan de cierre diario",
    prompt: "Disename un plan de 3 pasos para responder chats y cerrar ventas hoy.",
    impact: "Enfocado en velocidad y conversion.",
  },
  {
    title: "Reactivacion de alcance",
    prompt: "Que cambios concretos hago en mi anuncio top para recuperar alcance en 24h?",
    impact: "Enfocado en visibilidad de publicaciones.",
  },
  {
    title: "Oferta para empresas",
    prompt: "Que oferta me recomiendas para clientes empresa sin bajar demasiado margen?",
    impact: "Enfocado en ticket promedio y rentabilidad.",
  },
];

const aiRadarBars = [
  { label: "Senal de compra", value: 81 },
  { label: "Interes en servicios", value: 74 },
  { label: "Ritmo de respuesta", value: 63 },
  { label: "Potencial de conversion", value: 69 },
];

function buildAiInsight(question: string): AiBusinessInsight {
  const text = question.toLowerCase();

  if (text.includes("conversion") || text.includes("priorizar") || text.includes("cerrar")) {
    return {
      summary: "Tu palanca principal hoy es priorizar chats con intencion de compra y responderlos con una secuencia de cierre clara.",
      dataPoints: [
        "Tienes conversaciones activas con senales de urgencia en precio y disponibilidad.",
        "Tus publicaciones de producto concentran mayor interes inicial.",
        "El cuello de botella esta en tiempo de respuesta, no en alcance.",
      ],
      advice:
        "Aplica una regla de atencion: responder primero consultas con solicitud de precio, stock o entrega. Luego propone alternativa y cierra con siguiente paso concreto.",
      nextStep: "Abre chat y atiende los 3 contactos con mayor intencion durante los proximos 30 minutos.",
      actionPlan: [
        "Filtra chats por urgencia comercial y atiende primero consultas de compra directa.",
        "Usa plantilla corta: disponibilidad, beneficio principal, propuesta de cierre.",
        "Registra objecion mas repetida y prepara una respuesta estandar para acelerar tiempos.",
      ],
      watchItems: [
        "Tiempo promedio de primera respuesta.",
        "Chats con seguimiento pendiente despues de 12h.",
        "Conversion de chat a venta por tipo de producto.",
      ],
      priority: "Alta",
      confidence: "Alta",
      focusLabel: "Ir a chat comercial",
      focusHref: "/empresa/chat",
    };
  }

  if (text.includes("publicac") || text.includes("anuncio") || text.includes("alcance") || text.includes("optimizar")) {
    return {
      summary: "Para subir resultados rapido, optimiza primero la publicacion con mayor historico de interaccion y aplica un relanzamiento controlado.",
      dataPoints: [
        "Tus publicaciones visuales superan en interes a las de solo texto.",
        "El mayor impacto viene de titular, portada y CTA de chat.",
        "La variacion de oferta influye mas cuando el precio es visible.",
      ],
      advice:
        "Haz un refresh de alto impacto: nuevo titulo orientado a beneficio, portada mas clara y CTA con urgencia real. Evita cambios masivos en todos los anuncios al mismo tiempo.",
      nextStep: "Edita la publicacion principal y mide su rendimiento durante 24-48h antes del siguiente ajuste.",
      actionPlan: [
        "Reescribe titulo con beneficio directo para el cliente objetivo.",
        "Actualiza imagen destacando valor y estado del producto o servicio.",
        "Incluye llamado a chat con accion puntual: cotizar, agendar o reservar.",
      ],
      watchItems: [
        "Vistas por publicacion antes y despues del ajuste.",
        "CTR hacia chat desde la card principal.",
        "Interacciones en primeras 12 horas del relanzamiento.",
      ],
      priority: "Alta",
      confidence: "Alta",
      focusLabel: "Ir a publicaciones",
      focusHref: "/empresa/publicaciones",
    };
  }

  if (text.includes("demanda") || text.includes("servicio") || text.includes("tendencia")) {
    return {
      summary: "La demanda sostenida esta en servicios de solucion rapida y continuidad operativa para clientes empresa.",
      dataPoints: [
        "Las consultas de mantenimiento y soporte tienden a repetirse semanalmente.",
        "Los clientes empresariales valoran tiempos de respuesta y continuidad.",
        "Las ofertas combinadas elevan interes cuando simplifican decision.",
      ],
      advice:
        "Empaqueta servicios en formatos claros (basico, estandar, premium) y comunica tiempo de atencion. Eso mejora comparabilidad y acelera cierre.",
      nextStep: "Revisa analiticas y define que servicio promocionar por segmento de cliente.",
      actionPlan: [
        "Agrupa servicios con propuesta de valor por problema recurrente.",
        "Define SLA o tiempo objetivo de atencion en cada oferta.",
        "Publica una comparativa simple para reducir friccion en compra.",
      ],
      watchItems: [
        "Volumen de consultas por tipo de servicio.",
        "Ticket promedio por paquete ofrecido.",
        "Tasa de recompra o seguimiento mensual.",
      ],
      priority: "Media",
      confidence: "Media",
      focusLabel: "Ver analiticas",
      focusHref: "/empresa/analiticas",
    };
  }

  if (text.includes("oferta") || text.includes("precio") || text.includes("margen")) {
    return {
      summary: "Puedes mejorar conversion sin sacrificar margen si disenas la oferta por valor percibido y no solo por descuento.",
      dataPoints: [
        "Las ofertas con comparacion visible de precio suelen captar mas atencion.",
        "El beneficio claro (tiempo, soporte, garantia) reduce sensibilidad al precio.",
        "La urgencia real funciona mejor que la urgencia generica.",
      ],
      advice:
        "Muestra ahorro, pero destaca tambien resultado concreto. Una oferta ganadora combina valor, claridad de alcance y un CTA de cierre inmediato.",
      nextStep: "Crea una promocion de 48h con beneficio medible y seguimiento de conversion por chat.",
      actionPlan: [
        "Define precio de referencia y ahorro visible en la card.",
        "Agrega beneficio operativo (soporte, garantia, instalacion).",
        "Cierra con CTA de accion unica: cotizar ahora o reservar hoy.",
      ],
      watchItems: [
        "Consultas generadas por promocion.",
        "Conversion por rango de descuento.",
        "Impacto en margen promedio por cierre.",
      ],
      priority: "Media",
      confidence: "Media",
      focusLabel: "Crear oferta en publicaciones",
      focusHref: "/empresa/publicaciones",
    };
  }

  return {
    summary: "Tu estrategia va bien, pero el siguiente salto depende de ejecutar ciclos cortos de mejora en chat, publicaciones y ofertas.",
    dataPoints: [
      "Tienes base suficiente para optimizar conversion sin cambiar toda la operacion.",
      "La claridad de propuesta impacta mas que la cantidad de contenido.",
      "Los mejores resultados vienen de iterar semanalmente sobre una prioridad.",
    ],
    advice:
      "Trabaja por sprint: elige una prioridad comercial, ejecuta mejoras concretas y mide el resultado antes de escalar cambios.",
    nextStep: "Define hoy una sola meta comercial y consulta a la IA por un plan de ejecucion de 7 dias.",
    actionPlan: [
      "Selecciona una metrica objetivo principal para la semana.",
      "Alinea una publicacion y un flujo de chat a ese objetivo.",
      "Evalua resultados y ajusta al cierre del ciclo.",
    ],
    watchItems: [
      "Conversion semanal por fuente (publicacion o chat).",
      "Ratio de respuesta en menos de 15 minutos.",
      "Rendimiento de la publicacion principal.",
    ],
    priority: "Media",
    confidence: "Alta",
    focusLabel: "Volver al resumen ejecutivo",
    focusHref: "/empresa",
  };
}

export default function ConsultorIAPage() {
  const [aiQuestion, setAiQuestion] = useState("");
  const [lastAiQuestion, setLastAiQuestion] = useState("");
  const [aiInsight, setAiInsight] = useState<AiBusinessInsight | null>(null);
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
      setAiInsight(buildAiInsight(trimmedQuestion));
      setIsAiThinking(false);
      setRecentQuestions((current) => {
        const withoutCurrent = current.filter(
          (item) => item.toLowerCase() !== trimmedQuestion.toLowerCase(),
        );
        return [trimmedQuestion, ...withoutCurrent].slice(0, 4);
      });
      aiTimeoutRef.current = null;
    }, 1850);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAiQuestion(aiQuestion);
  };

  return (
    <div className="flex-1 pb-8">
      <CompanyPageHeader
        sectionLabel="Consultor IA"
        brandHref="/"
        middleSlot={
          <div className="inline-flex rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            <span className="ml-2 md:ml-0">Analisis comercial con IA activo</span>
          </div>
        }
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">CONSULTORIA IA</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Asistente comercial</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Haz preguntas de negocio y recibe recomendaciones accionables para mejorar conversion.
            </p>
          </section>

          <CompanyPanelCard links={companyModules} panelSubtitle="Empresa activa en TechMarket" />
        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">CONSULTOR IA</p>
                  <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Asesoria comercial inteligente</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                    Este consultor analiza senales de conversion, demanda y rendimiento para darte respuestas
                    accionables de negocio.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Estado del asistente</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">
                    {isAiThinking ? "Analizando contexto..." : "Listo para recomendar"}
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Consultas recientes</p>
                      <p className="mt-2 text-xl font-semibold text-cyan-50">{recentQuestions.length}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/45 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Modo</p>
                      <p className="mt-2 text-base font-semibold text-cyan-50">Analisis comercial</p>
                    </div>
                  </div>
                </div>
              </div>

              <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-100/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_44%),linear-gradient(180deg,rgba(8,18,31,0.95),rgba(5,14,25,0.98))] p-4 md:p-5">
                <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                  <article>
                    <p className="tech-mono text-xs text-cyan-200/80">IA TECHMARKET</p>
                    <h3 className="mt-2 text-2xl font-semibold text-cyan-50">Preguntale por tu negocio</h3>
                    <p className="mt-3 text-sm leading-7 text-cyan-100/82">
                      Consulta ventas, publicaciones, ofertas o demanda. Recibes diagnostico, plan de accion y foco recomendado.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                      <textarea
                        value={aiQuestion}
                        onChange={(event) => setAiQuestion(event.target.value)}
                        placeholder="Ej: que accion me conviene priorizar hoy para vender mas?"
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

                  <article className="chat-scrollbar max-h-[720px] overflow-y-auto rounded-3xl border border-cyan-100/15 bg-slate-950/45 p-4 md:p-5">
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
                              <div key={step} className="flex gap-3 rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-xs text-cyan-100/82">
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
                        Selecciona una pregunta recomendada o escribe tu consulta para recibir un analisis mas completo.
                      </div>
                    )}
                  </article>
                </div>
              </section>

              <section className="mt-6 rounded-3xl border border-cyan-100/12 bg-slate-950/35 p-4 md:p-5">
                <p className="tech-mono text-xs text-cyan-200/75">PLAYBOOK IA</p>
                <h3 className="mt-2 text-xl font-semibold text-cyan-50">Prompts listos para usar</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {scenarioPrompts.map((scenario) => (
                    <article key={scenario.title} className="rounded-2xl border border-cyan-100/12 bg-slate-950/40 p-4">
                      <p className="text-sm font-semibold text-cyan-50">{scenario.title}</p>
                      <p className="mt-2 text-xs leading-6 text-cyan-100/78">{scenario.prompt}</p>
                      <p className="mt-3 text-[11px] text-emerald-200/88">{scenario.impact}</p>
                      <button
                        type="button"
                        onClick={() => runAiQuestion(scenario.prompt)}
                        className="mt-3 rounded-xl border border-cyan-100/15 bg-cyan-400/15 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                      >
                        Usar prompt
                      </button>
                    </article>
                  ))}
                </div>
              </section>

              <section className="mt-6 rounded-3xl border border-cyan-100/12 bg-slate-950/35 p-4 md:p-5">
                <p className="text-sm font-semibold text-cyan-50">Radar IA</p>
                <div className="mt-4 space-y-3">
                  {aiRadarBars.map((bar) => (
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
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
