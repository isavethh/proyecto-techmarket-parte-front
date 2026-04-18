"use client";

import Link from "next/link";
import { useState } from "react";

type ChatMessage = {
  id: string;
  author: "empresa" | "cliente";
  text: string;
  time: string;
};

type ChatThread = {
  id: string;
  name: string;
  product: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  messages: ChatMessage[];
};

const companyModules = [
  { title: "Perfil y tienda", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

const chatThreads: ChatThread[] = [
  {
    id: "chat-5",
    name: "Alejandro",
    product: "Laptop Pro 14",
    lastMessage: "Busque la Laptop Pro 14 y quiero mas informacion.",
    time: "Ahora",
    unread: 1,
    avatar: "AL",
    messages: [
      { id: "m1", author: "cliente", text: "Hola, busque la Laptop Pro 14 en sus publicaciones.", time: "11:02" },
      { id: "m2", author: "empresa", text: "Hola Alejandro, claro. Te comparto caracteristicas y disponibilidad.", time: "11:04" },
      { id: "m3", author: "cliente", text: "Busque la Laptop Pro 14 y quiero mas informacion.", time: "11:05" },
    ],
  },
  {
    id: "chat-1",
    name: "Carlos M.",
    product: "Laptop Pro 14",
    lastMessage: "Quisiera saber si sigue disponible.",
    time: "Hace 5 min",
    unread: 2,
    avatar: "CM",
    messages: [
      { id: "m1", author: "cliente", text: "Hola, vi la Laptop Pro 14 en publicaciones.", time: "10:05" },
      { id: "m2", author: "empresa", text: "Hola Carlos, si, sigue disponible. Te comparto la informacion.", time: "10:07" },
      { id: "m3", author: "cliente", text: "Quisiera saber si sigue disponible.", time: "10:09" },
      { id: "m4", author: "empresa", text: "Si, esta disponible y te podemos asesorar por aqui mismo.", time: "10:10" },
    ],
  },
  {
    id: "chat-2",
    name: "Laura P.",
    product: "Mantenimiento preventivo",
    lastMessage: "Me interesa agendar para esta semana.",
    time: "Hace 20 min",
    unread: 1,
    avatar: "LP",
    messages: [
      { id: "m1", author: "cliente", text: "Buenos dias, vi el mantenimiento preventivo.", time: "09:30" },
      { id: "m2", author: "empresa", text: "Hola Laura, claro. Te explico el alcance del servicio.", time: "09:33" },
      { id: "m3", author: "cliente", text: "Me interesa agendar para esta semana.", time: "09:40" },
    ],
  },
  {
    id: "chat-3",
    name: "Sofia R.",
    product: "Combo empresarial",
    lastMessage: "Necesito informacion para mi oficina.",
    time: "Hace 1 h",
    avatar: "SR",
    messages: [
      { id: "m1", author: "cliente", text: "Hola, estoy revisando el combo empresarial.", time: "08:20" },
      { id: "m2", author: "empresa", text: "Hola Sofia, el combo incluye soporte y red interna.", time: "08:24" },
      { id: "m3", author: "cliente", text: "Necesito informacion para mi oficina.", time: "08:31" },
    ],
  },
  {
    id: "chat-4",
    name: "Andres T.",
    product: "Monitor UltraWide 34",
    lastMessage: "Quiero confirmar el precio.",
    time: "Ayer",
    avatar: "AT",
    messages: [
      { id: "m1", author: "cliente", text: "Vi el monitor en la publicacion.", time: "17:10" },
      { id: "m2", author: "empresa", text: "Hola Andres, si lo tenemos disponible.", time: "17:12" },
      { id: "m3", author: "cliente", text: "Quiero confirmar el precio.", time: "17:18" },
    ],
  },
];

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(chatThreads[0].id);
  const [draftMessage, setDraftMessage] = useState("");

  const activeChat = chatThreads.find((chat) => chat.id === activeChatId) ?? chatThreads[0];

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
          <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                TC
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">TechMarket</p>
              </div>
            </div>
          </div>
          <p className="tech-mono mt-4 text-xs text-cyan-200/75">MODULO EMPRESAS</p>
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
              <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                <aside className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="tech-mono text-xs text-cyan-200/75">CHATS ACTIVOS</p>
                      <h1 className="mt-2 text-2xl font-bold text-white">Conversaciones</h1>
                    </div>
                    <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{chatThreads.length}</span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {chatThreads.map((chat) => {
                      const isActive = chat.id === activeChatId;

                      return (
                        <button
                          key={chat.id}
                          type="button"
                          onClick={() => setActiveChatId(chat.id)}
                          className={`w-full rounded-3xl border p-4 text-left transition ${
                            isActive
                              ? "border-cyan-300/50 bg-cyan-300/12"
                              : "border-cyan-100/10 bg-white/5 hover:bg-cyan-100/8"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {chat.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-white">{chat.name}</p>
                                <span className="text-xs text-cyan-100/60">{chat.time}</span>
                              </div>
                              <p className="text-xs text-cyan-100/70">{chat.product}</p>
                              <p className="mt-1 truncate text-sm text-cyan-100/80">{chat.lastMessage}</p>
                            </div>
                          </div>
                          {chat.unread ? (
                            <div className="mt-3 flex justify-end">
                              <span className="rounded-full bg-cyan-300 px-2.5 py-1 text-xs font-semibold text-slate-950">
                                {chat.unread}
                              </span>
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </aside>

                <section className="flex h-[calc(100vh-170px)] min-h-[620px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-4 md:p-5">
                  <div className="flex items-center justify-between border-b border-cyan-100/10 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                        {activeChat.avatar}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">{activeChat.name}</p>
                        <p className="text-sm text-cyan-100/70">Interesado en {activeChat.product}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">En linea</span>
                  </div>

                  <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-3xl bg-slate-950/30 p-4 md:p-5">
                    {activeChat.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.author === "empresa" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                            message.author === "empresa"
                              ? "bg-cyan-300/15 text-cyan-50"
                              : "bg-white/5 text-cyan-100/90"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className="mt-2 text-right text-xs text-cyan-100/55">{message.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 shrink-0 rounded-3xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Responder</p>
                    <div className="mt-3 flex flex-col gap-3 md:flex-row">
                      <input
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        placeholder="Escribe un mensaje para el cliente..."
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                      <button className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                        Enviar
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
