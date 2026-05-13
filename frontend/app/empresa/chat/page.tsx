"use client";

import { useEffect, useState } from "react";
import { CompanyPageHeader } from "../../components/CompanyPageSections";
import { CompanySidebar } from "../CompanySidebar";
import { chatThreadsData, fetchCompanyChats, markCompanyChatAsRead, sendCompanyChatMessage } from "../../lib/companyApi";

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
  const [chatThreadsState, setChatThreadsState] = useState(chatThreadsData);
  const [activeChatId, setActiveChatId] = useState(chatThreadsData[0].id);
  const [draftMessage, setDraftMessage] = useState("");

  useEffect(() => {
    void fetchCompanyChats().then((threads) => {
      setChatThreadsState(threads);
      setActiveChatId((current) => threads.find((thread) => thread.id === current)?.id ?? threads[0]?.id ?? current);
    });
  }, []);

  const activeChat =
    chatThreadsState.find((chat) => chat.id === activeChatId) ?? chatThreadsState[0];
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    void markCompanyChatAsRead(chatId);
  };

  const handleSendMessage = () => {
    const text = draftMessage.trim();
    if (!text || !activeChat) return;

    const newMessage = {
      id: `local-${Date.now()}`,
      author: "empresa" as const,
      text,
      time: "Ahora",
    };

    setChatThreadsState((current) =>
      current.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              lastMessage: text,
              unread: undefined,
              messages: [...chat.messages, newMessage],
            }
          : chat,
      ),
    );
    setDraftMessage("");
    void sendCompanyChatMessage(activeChat.id, text);
  };

  return (
    <div className="flex-1 pb-8">
      <CompanyPageHeader
        sectionLabel="Chat empresa"
        brandHref="/"
        middleSlot={
          <div className="inline-flex rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            <span className="ml-2 md:ml-0">Centro de conversaciones activo</span>
          </div>
        }
      />

     <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">CHAT COMERCIAL</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Conversaciones de clientes</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Responde rapido para convertir mas consultas en ventas.
            </p>
          </section>

          <CompanySidebar />
        </aside>

        <section className="space-y-6 pr-0 lg:pr-4">
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="p-6 md:p-8">
              <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
                <aside className="flex min-h-[500px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="tech-mono text-xs text-cyan-200/75">CHATS ACTIVOS</p>
                      <h1 className="mt-1.5 text-xl font-bold text-white">Conversaciones</h1>
                    </div>
                    <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">{chatThreadsState.length}</span>
                  </div>

                  <div className="chat-scrollbar mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                    {chatThreadsState.map((chat) => {
                      const isActive = chat.id === activeChatId;

                      return (
                        <button
                          key={chat.id}
                          type="button"
                          onClick={() => handleSelectChat(chat.id)}
                          className={`w-full rounded-3xl border p-3 text-left transition ${
                            isActive
                              ? "border-cyan-300/50 bg-cyan-300/12"
                              : "border-cyan-100/10 bg-white/5 hover:bg-cyan-100/8"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {chat.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-white">{chat.name}</p>
                                <span className="text-xs text-cyan-100/60">{chat.time}</span>
                              </div>
                              <p className="text-xs text-cyan-100/70">{chat.product}</p>
                              <p className="mt-1 truncate text-xs text-cyan-100/80">{chat.lastMessage}</p>
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

                <section className="flex h-[calc(100vh-210px)] min-h-[500px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-3.5 md:p-4">
                  <div className="flex items-center justify-between border-b border-cyan-100/10 pb-4">
                    <div className="flex items-center gap-4">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                        {activeChat.avatar}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">{activeChat.name}</p>
                        <p className="text-xs text-cyan-100/70">Interesado en {activeChat.product}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">En linea</span>
                  </div>

                  <div className="chat-scrollbar mt-3 flex-1 space-y-2.5 overflow-y-auto rounded-3xl bg-slate-950/30 p-3.5 md:p-4">
                    {activeChat.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.author === "empresa" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[72%] rounded-3xl px-3.5 py-2.5 text-sm leading-5 ${
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

                  <div className="mt-3 shrink-0 rounded-3xl border border-cyan-100/10 bg-white/5 p-3.5">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Responder</p>
                    <div className="mt-3 flex flex-col gap-3 md:flex-row">
                      <input
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        placeholder="Escribe un mensaje para el cliente..."
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                      >
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



