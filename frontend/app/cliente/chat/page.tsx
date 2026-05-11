"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ClientPageHeader } from "../../components/ClientPageSections";
import {
  getChats,
  getChatMessages,
  sendMessage,
  markChatRead,
} from "@/lib/api/clientApi";
import type { ApiChat, ApiMessage } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

function getAvatar(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((t) => t[0]?.toUpperCase() ?? "")
      .join("") || "CH"
  );
}

const formatHour = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return "--:--";
  const date = new Date(parsed);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "p. m." : "a. m.";
  const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(normalizedHour).padStart(2, "0")}:${minutes} ${period}`;
};

const formatRelativeTime = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return "Reciente";
  const diffMs = Date.now() - parsed;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  return `Hace ${Math.floor(diffHours / 24)} d`;
};

export default function ClienteChatPage() {
  const pathname = usePathname();

  const [chats, setChats] = useState<ApiChat[]>([]);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChats()
      .then((data) => {
        setChats(data);
        const counts: Record<string, number> = {};
        for (const chat of data) counts[chat.id] = chat.mensajesSinLeer;
        setUnreadCounts(counts);
        if (data.length > 0) setActiveChatId(data[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingChats(false));
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    setLoadingMessages(true);
    getChatMessages(activeChatId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
    markChatRead(activeChatId).catch(() => {});
    setUnreadCounts((prev) => ({ ...prev, [activeChatId]: 0 }));
  }, [activeChatId]);

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? null,
    [chats, activeChatId],
  );

  const filteredChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) =>
      `${c.empresa.nombre} ${c.ultimoMensaje}`.toLowerCase().includes(q),
    );
  }, [chats, searchQuery]);

  const totalUnread = useMemo(
    () => Object.values(unreadCounts).reduce((sum, n) => sum + n, 0),
    [unreadCounts],
  );

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeChatId) return;
    const text = draftMessage.trim();
    if (text.length < 2) return;
    setSending(true);
    try {
      const sent = await sendMessage(activeChatId, text);
      setMessages((prev) => [...prev, sent]);
      setDraftMessage("");
    } catch {
      // keep draft so user can retry
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader
        sectionLabel="Chats cliente"
        middleSlot={(
          <input
            className="auth-input"
            placeholder="Buscar conversaciones o empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-120px)] lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
          <section className="tech-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                CM
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">Cliente activo en TechMarket</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {clientMenuItems.map((item) => {
                const isActive =
                  item.href === "/cliente"
                    ? pathname === "/cliente"
                    : pathname.startsWith(item.href);
                return (
                  <Link key={item.label} href={item.href} className={`auth-action ${isActive ? "active" : ""}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">BANDEJA DE CHATS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Conversaciones</h1>
            <p className="mt-2 text-sm text-cyan-100/75">
              Vista completa para revisar todos tus chats, abrir cada hilo y responder rapido.
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

          <section className="chat-scrollbar min-w-0 flex-1 overflow-y-auto overflow-x-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(170deg,rgba(11,34,60,0.95),rgba(6,23,43,0.95))] p-4">
            {loadingChats ? (
              <p className="text-sm text-cyan-100/75">Cargando chats...</p>
            ) : filteredChats.length === 0 ? (
              <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                {searchQuery ? "No encontramos chats para esa busqueda." : "No tienes conversaciones aun."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat) => {
                  const isActive = chat.id === activeChatId;
                  const unread = unreadCounts[chat.id] ?? 0;
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
                            {getAvatar(chat.empresa.nombre)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-cyan-50">{chat.empresa.nombre}</p>
                            <p className="font-mono truncate text-[10px] text-cyan-200/50">{chat.id}</p>
                          </div>
                        </div>

                        {unread > 0 && (
                          <span className="mt-1 inline-flex rounded-full border border-cyan-100/15 bg-cyan-300/20 px-2 py-0.5 text-[10px] text-cyan-50">
                            {unread}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 truncate text-xs text-cyan-100/70">{chat.ultimoMensaje || "Sin mensajes"}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </aside>

        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(10,33,57,0.97),rgba(4,18,34,0.98))] shadow-xl shadow-slate-950/35">
          {!activeChat ? (
            <div className="flex h-[60vh] items-center justify-center px-5 text-center text-cyan-100/75">
              {loadingChats ? "Cargando conversaciones..." : "Selecciona un chat para ver la conversacion completa."}
            </div>
          ) : (
            <>
              <div className="border-b border-cyan-100/10 bg-[linear-gradient(120deg,rgba(19,78,110,0.28),rgba(7,24,44,0.84))] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                    {getAvatar(activeChat.empresa.nombre)}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-cyan-50">{activeChat.empresa.nombre}</p>
                    <p className="font-mono text-[11px] text-cyan-200/55">{activeChat.id}</p>
                  </div>
                </div>
              </div>

              <div
                ref={messageListRef}
                className="chat-scrollbar flex-1 min-h-0 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(4,13,24,0.3),rgba(4,11,20,0.58))] px-5 py-4"
              >
                {loadingMessages ? (
                  <p className="text-center text-sm text-cyan-100/60">Cargando mensajes...</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-cyan-100/60">No hay mensajes aun. Escribe el primero.</p>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, x: msg.remitente === "cliente" ? 8 : -8 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      transition={{ duration: 0.18, delay: index * 0.02 }}
                      className={`flex ${msg.remitente === "cliente" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl border px-3 py-2 text-sm leading-6 ${
                          msg.remitente === "cliente"
                            ? "border-cyan-200/25 bg-cyan-300/16 text-cyan-50"
                            : "border-cyan-100/10 bg-white/5 text-cyan-100/92"
                        }`}
                      >
                        <p>{msg.contenido}</p>
                        <p className="mt-2 text-right text-[11px] text-cyan-100/55">{formatHour(msg.fecha)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-cyan-100/10 bg-slate-950/40 px-5 py-4">
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
                    {sending ? "..." : "Enviar"}
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
