"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SpecialistShell } from "../components/SpecialistShell";

type SpecialistChatItem = {
  id: string;
  customer: string;
  initials: string;
  service: string;
  status: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: {
    id: string;
    from: "customer" | "specialist";
    text: string;
    time: string;
  }[];
};

const specialistChatsSeed: SpecialistChatItem[] = [
  {
    id: "chat-1",
    customer: "Carlos M.",
    initials: "CM",
    service: "Reparacion de laptops",
    status: "En linea",
    lastMessage: "Quisiera saber si pueden revisar mi laptop hoy.",
    time: "Hace 5 min",
    unread: 2,
    messages: [
      { id: "m-1", from: "customer", text: "Hola, necesito ayuda con mi laptop.", time: "11:02" },
      { id: "m-2", from: "specialist", text: "Claro, cuéntame qué problema presenta.", time: "11:04" },
      { id: "m-3", from: "customer", text: "Se apaga sola y se calienta mucho.", time: "11:05" },
    ],
  },
  {
    id: "chat-2",
    customer: "Laura P.",
    initials: "LP",
    service: "Mantenimiento preventivo",
    status: "Disponible",
    lastMessage: "Me interesa agendar mantenimiento para esta semana.",
    time: "Hace 20 min",
    unread: 1,
    messages: [
      { id: "m-4", from: "customer", text: "Hola, quisiera hacer mantenimiento preventivo.", time: "10:30" },
      { id: "m-5", from: "specialist", text: "Sí, tengo disponibilidad esta semana.", time: "10:34" },
    ],
  },
  {
    id: "chat-3",
    customer: "Andres T.",
    initials: "AT",
    service: "Instalacion y configuracion de redes",
    status: "Disponible",
    lastMessage: "Necesito red estable para oficina pequeña.",
    time: "Hace 1 h",
    unread: 0,
    messages: [
      { id: "m-6", from: "customer", text: "Busco instalación de red para mi oficina.", time: "09:10" },
      { id: "m-7", from: "specialist", text: "Perfecto, ¿cuántos equipos necesitas conectar?", time: "09:15" },
    ],
  },
  {
    id: "chat-4",
    customer: "Sofia R.",
    initials: "SR",
    service: "Soporte tecnico remoto",
    status: "Disponible",
    lastMessage: "¿Atienden problemas de configuración por videollamada?",
    time: "Hace 2 h",
    unread: 0,
    messages: [
      { id: "m-8", from: "customer", text: "Tengo problemas con software y configuración.", time: "08:20" },
      { id: "m-9", from: "specialist", text: "Sí, puedo ayudarte por chat o videollamada.", time: "08:24" },
    ],
  },
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function EspecialistaChatPage() {
  const searchParams = useSearchParams();
  const serviceFromQuery = searchParams.get("service") ?? "";

  const orderedChats = useMemo(() => {
    if (!serviceFromQuery) {
      return specialistChatsSeed;
    }

    const normalizedTarget = normalizeText(serviceFromQuery);

    return [...specialistChatsSeed].sort((a, b) => {
      const aMatch = normalizeText(a.service).includes(normalizedTarget) ? 1 : 0;
      const bMatch = normalizeText(b.service).includes(normalizedTarget) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [serviceFromQuery]);

  const [activeChatId, setActiveChatId] = useState(orderedChats[0]?.id ?? "");
  const [draftMessage, setDraftMessage] = useState("");

  const activeChat =
    orderedChats.find((chat) => chat.id === activeChatId) ?? orderedChats[0];

  return (
    <SpecialistShell sectionLabel="Chat" statusMessage="Chat especialista activo">
      <section className="rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] px-6 py-5 shadow-2xl shadow-slate-950/30 md:px-8 md:py-6">
        <p className="tech-mono text-xs text-cyan-200/75">CHAT DEL ESPECIALISTA</p>
        <h1 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">Conversaciones con clientes</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-100/80">
          Gestiona consultas activas y responde rápidamente a clientes interesados en tus servicios.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <aside className="flex min-h-[420px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-4 lg:h-[calc(100vh-300px)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="tech-mono text-xs text-cyan-200/75">CHATS ACTIVOS</p>
              <h2 className="mt-2 text-xl font-bold text-white">Conversaciones</h2>
            </div>
            <span className="rounded-full border border-cyan-100/10 bg-slate-950/35 px-3 py-1 text-sm font-semibold text-cyan-50">
              {orderedChats.length}
            </span>
          </div>

          <div className="chat-scrollbar mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {orderedChats.map((chat) => {
              const isActive = chat.id === activeChat?.id;

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full rounded-3xl border p-3 text-left transition ${
                    isActive
                      ? "border-cyan-300/40 bg-cyan-300/12"
                      : "border-cyan-100/10 bg-slate-950/30 hover:bg-cyan-100/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                      {chat.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{chat.customer}</p>
                          <p className="truncate text-xs text-cyan-100/70">{chat.service}</p>
                        </div>
                        <p className="shrink-0 text-xs text-cyan-100/65">{chat.time}</p>
                      </div>

                      <p className="mt-2 truncate text-xs text-cyan-100/80">{chat.lastMessage}</p>
                    </div>

                    {chat.unread > 0 ? (
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-300 px-2 text-xs font-bold text-slate-950">
                        {chat.unread}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[420px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-4 md:p-5 lg:h-[calc(100vh-300px)]">
          {activeChat ? (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-cyan-100/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                    {activeChat.initials}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{activeChat.customer}</p>
                    <p className="text-xs text-cyan-100/70">{activeChat.service}</p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {activeChat.status}
                </span>
              </div>

              <div className="chat-scrollbar mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-3xl bg-slate-950/30 p-4">
                {activeChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.from === "specialist" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[72%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                        message.from === "specialist"
                          ? "bg-cyan-400/15 text-cyan-50"
                          : "bg-white/5 text-cyan-100"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="mt-2 text-right text-xs text-cyan-100/55">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-3xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="tech-mono text-xs text-cyan-200/75">RESPONDER</p>
                <div className="mt-3 flex gap-3">
                  <input
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    placeholder="Escribe un mensaje para el cliente..."
                    className="flex-1 rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <button
                    type="button"
                    className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </section>
    </SpecialistShell>
  );
}