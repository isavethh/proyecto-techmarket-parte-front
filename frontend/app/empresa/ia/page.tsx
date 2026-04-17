"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type MessageRole = "user" | "assistant";

type Message = {
  id: number;
  role: MessageRole;
  text: string;
};

const companyModules = [
  { title: "Perfil", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

const quickQuestions = [
  "Que producto deberia promocionar para vender mas?",
  "Como puedo mejorar mis publicaciones?",
  "Que servicio tiene mayor demanda?",
  "Como atraigo mas clientes con mis publicaciones?",
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    text: "Te ayudo a vender mas, mejorar tus publicaciones y tomar mejores decisiones comerciales. Preguntame sobre promociones, visibilidad o contenido para atraer clientes.",
  },
  {
    id: 2,
    role: "assistant",
    text: "Por ejemplo, puedo orientarte sobre que publicar, como destacar productos y que tipo de oferta puede darte mejor respuesta en tu sector.",
  },
];

function buildAssistantResponse(question: string) {
  const text = question.toLowerCase();

  if (text.includes("promocion") || text.includes("promocionar") || text.includes("vender mas")) {
    return "Te recomiendo promocionar primero el producto o servicio que tenga mayor margen o que resuelva una necesidad urgente. Si quieres resultados rapidos, combina una oferta con una imagen clara, precio visible y un llamado directo a chat.";
  }

  if (text.includes("publicac") || text.includes("post") || text.includes("contenido")) {
    return "Para mejorar tus publicaciones, usa una imagen principal fuerte, un titulo directo y una descripcion corta con beneficio concreto. Agrega precio o estado cuando aplique y termina siempre con una invitacion a chatear.";
  }

  if (text.includes("demanda") || text.includes("servicio")) {
    return "Normalmente tienen mejor demanda los servicios que resuelven problemas urgentes: diagnostico, mantenimiento preventivo, soporte remoto e instalacion de redes. Si quieres priorizar, publica primero los que respondan a fallas frecuentes.";
  }

  if (text.includes("cliente") || text.includes("atraer")) {
    return "Para atraer mas clientes, publica contenido util y frecuente: ofertas activas, pruebas sociales, consejos breves y productos destacados. Mantener actividad constante da confianza y mejora el alcance.";
  }

  if (text.includes("precio") || text.includes("oferta")) {
    return "Si vas a mostrar precio, acompanalo de un beneficio concreto y una urgencia clara. Las ofertas con precio anterior y precio actual suelen funcionar mejor cuando el ahorro se entiende rapido.";
  }

  return "Te recomiendo enfocar la publicacion en un solo objetivo: vender, informar o atraer contacto. Usa una imagen clara, un mensaje breve, un beneficio visible y un boton para chatear.";
}

export default function ConsultorIAPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const lastAssistantTip = useMemo(
    () => "Respuestas enfocadas en visibilidad, conversion y crecimiento comercial.",
    []
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      text: buildAssistantResponse(trimmed),
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
  };

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

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_1fr]">
        <aside className="tech-card h-fit">
          <p className="tech-mono text-xs text-cyan-200/75">MODULO EMPRESAS</p>
          <nav className="mt-4 space-y-2 text-sm text-cyan-100/90">
            {companyModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 transition hover:bg-cyan-100/5"
              >
                {module.title}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-6 overflow-y-auto pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">CONSULTOR IA</p>
                  <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Te ayudo a vender mas y publicar mejor</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                    Este consultor no es un chatbot generico. Esta enfocado en crecimiento comercial, visibilidad y
                    optimizacion de publicaciones para empresas tecnologicas.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Objetivo</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">Orientacion comercial accionable</h2>
                  <p className="mt-3 text-sm leading-7 text-cyan-100/80">{lastAssistantTip}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Sugerencias iniciales</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => setInput(question)}
                        className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/85 transition hover:bg-cyan-100/10"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Tip rapido</p>
                  <p className="mt-4 text-sm leading-7 text-cyan-100/80">
                    Usa preguntas concretas sobre productos, publicaciones, promociones y servicios. Mientras mas claro
                    sea tu objetivo, mas practica sera la recomendacion.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4 rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                        message.role === "user"
                          ? "bg-cyan-300/15 text-cyan-50"
                          : "bg-white/5 text-cyan-100/90"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 rounded-3xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Haz tu consulta</p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ej: que producto deberia promocionar para vender mas?"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
