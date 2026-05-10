"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ClientPageHeader } from "../../components/ClientPageSections";
import {
  getChats,
  getChatMessages,
  sendMessage,
  markChatRead,
  startChat,
} from "../../lib/api/clientApi";
import type { ApiChat, ApiMessage } from "../../lib/api/types";

function formatHour(isoDate: string): string {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return "--:--";
  return new Date(parsed).toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(isoDate: string): string {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return "Reciente";

  const diffMs = Date.now() - parsed;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  return `Hace ${Math.floor(diffHours / 24)} d`;
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((t) => t[0]?.toUpperCase() ?? "")
      .join("") || "CH"
  );
}

export default function ClienteChatPage() {
  const searchParams = useSearchParams();

  const [chats, setChats] = useState<ApiChat[]>([]);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [sending, setSending] = useState(false);

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadChats() {
      setLoading(true);
      const result = await getChats();
      if (!result) {
        setApiError(true);
      } else {
        setChats(result);
        if (result.length > 0) {
          setActiveChatId(result[0].id);
        }
      }
      setLoading(false);
    }

    loadChats();
  }, []);

  useEffect(() => {
    const empresaIdParam = searchParams.get("empresa");
    const asuntoParam = searchParams.get("asunto") ?? "Consulta general";

    if (!empresaIdParam) return;

    async function openOrCreateChat() {
      const result = await startChat(empresaIdParam!, asuntoParam);
      if (result) {
        const refreshed = await getChats();
        if (refreshed) {
          setChats(refreshed);
          setActiveChatId(result.chatId);
        }
      }
    }

    openOrCreateChat();
  }, [searchParams]);

  useEffect(() => {
    if (!activeChatId) return;

    async function loadMessages() {
      setLoadingMessages(true);
      const result = await getChatMessages(activeChatId!);
      if (result) setMessages(result);
      setLoadingMessages(false);
      await markChatRead(activeChatId!);
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, mensajesSinLeer: 0 } : c,
        ),
      );
    }

    loadMessages();
  }, [activeChatId]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setMessages([]);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeChatId || draftMessage.trim().length < 2) return;

    setSending(true);
    const result = await sendMessage(activeChatId, draftMessage.trim());

    if (result) {
      setMessages((prev) => [...prev, result]);
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, ultimoMensaje: result.contenido }
            : c,
        ),
      );
    }

    setDraftMessage("");
    setSending(false);
  };

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const filteredChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) =>
      `${c.empresa.nombre} ${c.ultimoMensaje}`.toLowerCase().includes(q),
    );
  }, [chats, searchQuery]);

  const totalUnread = useMemo(
    () => chats.reduce((acc, c) => acc + (c.mensajesSinLeer ?? 0), 0),
    [chats],
  );

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader
        sectionLabel="Chats cliente"
        middleSlot={
          <input
            className="auth-input"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        }
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">BANDEJA DE CHATS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Conversaciones</h1>
            <p className="mt-2 text-xs text-cyan-200/60 font-mono">
              GET /api/clients/chats
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                <p className="text-cyan-200/70">Chats</p>
                <p className="mt-1 text-lg font-semibold text-cyan-50">{chats.length}</p>
              </div>
              <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                <p className="text-cyan-200/70">Sin leer</p>
                <p className="mt-1 text-lg font-semibold text-cyan-50">{totalUnread}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Link href="/cliente/marketplace" className="auth-action block w-full text-center">
                Volver a marketplace
              </Link>
              <Link href="/cliente" className="auth-action block w-full text-center">
                Volver al feed
              </Link>
            </div>
          </section>

          <section className="chat-scrollbar flex-1 overflow-y-auto rounded-3xl border border-cyan-100/15 bg-[linear-gradient(170deg,rgba(11,34,60,0.95),rgba(6,23,43,0.98))] p-3 shadow-xl shadow-slate-950/35">
            {loading ? (
              <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                Cargando chats desde la API...
              </div>
            ) : apiError ? (
              <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                No se pudo conectar con la API en{" "}
                <span className="font-mono text-cyan-200">localhost:8082</span>.
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                {chats.length === 0
                  ? "No tienes conversaciones activas."
                  : "No encontramos chats para esa busqueda."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat) => {
                  const isActive = chat.id === activeChatId;
                  const initials = getInitials(chat.empresa.nombre);

                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        isActive
                          ? "border-cyan-300/40 bg-cyan-300/14"
                          : "border-cyan-100/12 bg-slate-950/35 hover:border-cyan-200/30 hover:bg-slate-900/45"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                            {initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-cyan-50">
                              {chat.empresa.nombre}
                            </p>
                            <p className="font-mono text-[10px] text-cyan-200/55">{chat.id}</p>
                          </div>
                        </div>

                        {chat.mensajesSinLeer > 0 && (
                          <span className="mt-1 inline-flex rounded-full border border-cyan-100/15 bg-cyan-300/20 px-2 py-0.5 text-[10px] text-cyan-50">
                            {chat.mensajesSinLeer}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 truncate text-xs text-cyan-100/70">
                        {chat.ultimoMensaje}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </aside>

        <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(10,33,57,0.97),rgba(4,18,34,0.98))] shadow-xl shadow-slate-950/35">
          {!activeChat ? (
            <div className="flex h-[60vh] items-center justify-center px-5 text-center text-cyan-100/75">
              {loading
                ? "Cargando conversaciones..."
                : "Selecciona un chat para ver la conversacion."}
            </div>
          ) : (
            <>
              <div className="border-b border-cyan-100/10 bg-[linear-gradient(120deg,rgba(19,78,110,0.28),rgba(7,24,44,0.84))] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                      {getInitials(activeChat.empresa.nombre)}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-cyan-50">
                        {activeChat.empresa.nombre}
                      </p>
                      <p className="font-mono text-[11px] text-cyan-200/55">
                        GET /api/clients/chats/{activeChat.id}/messages
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={messageListRef}
                className="chat-scrollbar h-[58vh] min-h-[420px] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(4,13,24,0.3),rgba(4,11,20,0.58))] px-5 py-4"
              >
                {loadingMessages ? (
                  <p className="text-sm text-cyan-100/70">Cargando mensajes...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-cyan-100/70">
                    No hay mensajes en esta conversacion todavia.
                  </p>
                ) : (
                  messages.map((msg, index) => {
                    const isClient = msg.remitente === "cliente";

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, x: isClient ? 8 : -8 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ duration: 0.18, delay: index * 0.02 }}
                        className={`flex ${isClient ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl border px-3 py-2 text-sm leading-6 ${
                            isClient
                              ? "border-cyan-200/25 bg-cyan-300/16 text-cyan-50"
                              : "border-cyan-100/10 bg-white/5 text-cyan-100/92"
                          }`}
                        >
                          <p>{msg.contenido}</p>
                          <p className="mt-2 text-right text-[11px] text-cyan-100/55">
                            {formatHour(msg.fecha)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-cyan-100/10 bg-slate-950/40 px-5 py-4"
              >
                <p className="mb-2 font-mono text-[10px] text-cyan-200/45">
                  POST /api/clients/chats/{activeChat.id}/messages
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <textarea
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-cyan-100/12 bg-slate-950/45 px-3 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <button
                    type="submit"
                    disabled={draftMessage.trim().length < 2 || sending}
                    className="rounded-2xl border border-cyan-200/25 bg-cyan-400/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
