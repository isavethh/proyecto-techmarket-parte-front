"use client";

import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
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
  listingId?: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  messages: ChatMessage[];
};

export default function ChatPage() {
  const [chatThreadsState, setChatThreadsState] = useState(chatThreadsData);
  const [activeChatId, setActiveChatId] = useState(chatThreadsData[0].id);
  const [draftMessage, setDraftMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetchCompanyChats().then((threads) => {
      setChatThreadsState(threads);
      setActiveChatId((current) => threads.find((thread) => thread.id === current)?.id ?? threads[0]?.id ?? current);
    });
  }, []);

  const activeChat =
    chatThreadsState.find((chat) => chat.id === activeChatId) ?? chatThreadsState[0];

  const activeChatMessageCount = activeChat?.messages.length ?? 0;

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeChatId, activeChatMessageCount]);

  const filteredThreads = chatThreadsState.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      chat.name.toLowerCase().includes(q) ||
      chat.product.toLowerCase().includes(q) ||
      chat.lastMessage.toLowerCase().includes(q)
    );
  });

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    void markCompanyChatAsRead(chatId);
    setChatThreadsState((current) =>
      current.map((chat) =>
        chat.id === chatId ? { ...chat, unread: undefined } : chat,
      ),
    );
  };

  const handleSendMessage = async () => {
    const text = draftMessage.trim();
    if (!text || !activeChat || isSending) return;

    setIsSending(true);
    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      author: "empresa",
      text,
      time: new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatThreadsState((current) =>
      current.map((chat) =>
        chat.id === activeChat.id
          ? { ...chat, lastMessage: text, unread: undefined, messages: [...chat.messages, newMessage] }
          : chat,
      ),
    );
    setDraftMessage("");

    try {
      await sendCompanyChatMessage(activeChat.id, text);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
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

                  <div className="mt-3">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por cliente o producto..."
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-3 py-2 text-xs text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-1 focus:ring-cyan-300/30"
                    />
                  </div>

                  <div className="chat-scrollbar mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                    {filteredThreads.length === 0 ? (
                      <p className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-3 text-xs text-cyan-100/60">
                        No hay conversaciones para esa busqueda.
                      </p>
                    ) : null}
                    {filteredThreads.map((chat) => {
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

                {activeChat ? (
                <section className="flex h-[calc(100vh-210px)] min-h-[500px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-3.5 md:p-4">
                  <div className="flex items-center justify-between border-b border-cyan-100/10 pb-4">
                    <div className="flex items-center gap-4">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                        {activeChat.avatar}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">{activeChat.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-cyan-100/70">Interesado en {activeChat.product}</p>
                          {activeChat.listingId ? (
                            <Link
                              href="/empresa/publicaciones"
                              className="text-xs text-cyan-300/80 underline-offset-2 hover:text-cyan-300 hover:underline"
                            >
                              Ver publicación →
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">En linea</span>
                  </div>

                  <div
                    ref={messageListRef}
                    className="chat-scrollbar mt-3 flex-1 space-y-2.5 overflow-y-auto rounded-3xl bg-slate-950/30 p-3.5 md:p-4"
                  >
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
                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end">
                      <textarea
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe un mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
                        rows={2}
                        disabled={isSending}
                        className="w-full resize-none rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-3.5 py-2.5 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => void handleSendMessage()}
                        disabled={!draftMessage.trim() || isSending}
                        className="rounded-2xl border border-cyan-100/10 bg-cyan-400/15 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSending ? "Enviando..." : "Enviar"}
                      </button>
                    </div>
                  </div>
                </section>
                ) : (
                <section className="flex h-[calc(100vh-210px)] min-h-[500px] flex-col items-center justify-center rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-100/10 bg-cyan-400/10 text-2xl text-cyan-300/60">
                    💬
                  </div>
                  <p className="mt-4 text-base font-semibold text-cyan-50">Sin conversaciones activas</p>
                  <p className="mt-2 text-sm text-cyan-100/65">
                    Cuando un cliente inicie un chat contigo aparecera aqui.
                  </p>
                </section>
                )}
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
