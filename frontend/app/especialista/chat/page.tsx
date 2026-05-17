"use client";

<<<<<<< HEAD
import { FormEvent, Suspense, useMemo, useState } from "react";
=======
import { Suspense, useMemo, useState } from "react";
>>>>>>> Nobre
import { useSearchParams } from "next/navigation";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistChatFilesData } from "../hooks/useSpecialistChatFilesData";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function EspecialistaChatContent() {
  const searchParams = useSearchParams();
  const serviceFromQuery = searchParams.get("service") ?? "";
  const {
    chats,
    activeChat,
    actionError,
    actionLoading,
    chatsError,
    detailError,
    hasLoadedChats,
    isLoadingChats,
    isLoadingMessages,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
  } = useSpecialistChatFilesData();
  const [draftMessage, setDraftMessage] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);

  const orderedChats = useMemo(() => {
    if (!serviceFromQuery) {
      return chats;
    }

    const normalizedTarget = normalizeText(serviceFromQuery);

    return [...chats].sort((a, b) => {
      const aMatch = normalizeText(a.service).includes(normalizedTarget) ? 1 : 0;
      const bMatch = normalizeText(b.service).includes(normalizedTarget) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [chats, serviceFromQuery]);

  const displayedActiveChat = activeChat ?? orderedChats.find((chat) => chat.id === selectedChatId) ?? orderedChats[0];
  const showInitialChatsLoading = isLoadingChats && !hasLoadedChats && orderedChats.length === 0;
  const showChatsError = Boolean(chatsError && !isLoadingChats && orderedChats.length === 0);
  const showEmptyChats = hasLoadedChats && !isLoadingChats && !chatsError && orderedChats.length === 0;
  const showEmptyMessages = !isLoadingMessages && !detailError && displayedActiveChat && displayedActiveChat.messages.length === 0;
  const messageText = draftMessage.trim();
  const canSendMessage = Boolean(displayedActiveChat && messageText && !actionLoading);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!displayedActiveChat) {
      setSendError("Selecciona una conversacion para enviar el mensaje.");
      return;
    }

    if (!messageText) {
      setSendError("Escribe un mensaje antes de enviar.");
      return;
    }

    setSendError(null);
    await sendMessage(displayedActiveChat.id, messageText);
    setDraftMessage("");
  }

  return (
    <SpecialistShell sectionLabel="Chat" statusMessage="Chat especialista activo">
      <section className="rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] px-5 py-3 shadow-2xl shadow-slate-950/30 md:px-6 md:py-4">
        <p className="tech-mono text-xs text-cyan-200/75">CHAT DEL ESPECIALISTA</p>
        <h1 className="mt-1 text-2xl font-bold text-cyan-50 md:text-3xl">Conversaciones con clientes</h1>
        <p className="mt-2 max-w-3xl text-sm leading-5 text-cyan-100/80">
          Gestiona consultas activas y responde rápidamente a clientes interesados en tus servicios.
        </p>
      </section>

      <div className="grid h-[calc(100vh-210px)] min-h-[500px] gap-4 overflow-hidden pb-4 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="flex min-h-0 min-w-0 flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="tech-mono text-xs text-cyan-200/75">CHATS ACTIVOS</p>
              <h2 className="mt-2 text-xl font-bold text-white">Conversaciones</h2>
            </div>
            <span className="rounded-full border border-cyan-100/10 bg-slate-950/35 px-3 py-1 text-sm font-semibold text-cyan-50">
              {orderedChats.length}
            </span>
          </div>

          <div className="chat-scrollbar mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {showInitialChatsLoading ? (
              <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/30 p-4 text-sm text-cyan-100/75">
                Cargando conversaciones...
              </div>
            ) : null}
            {showChatsError ? (
              <div className="rounded-3xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
                No se pudieron cargar las conversaciones.
              </div>
            ) : null}
            {showEmptyChats ? (
              <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/30 p-4 text-sm text-cyan-100/75">
                No hay conversaciones registradas todavía.
              </div>
            ) : null}
            {orderedChats.map((chat) => {
              const isActive = chat.id === displayedActiveChat?.id;

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`flex h-[96px] max-h-[110px] w-full rounded-2xl border px-3 py-2 text-left transition ${
                    isActive
                      ? "border-cyan-300/40 bg-cyan-300/12 shadow-lg shadow-cyan-950/25"
                      : "border-cyan-100/10 bg-slate-950/30 hover:bg-cyan-100/5"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                      {chat.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{chat.customer}</p>
                          <p className="truncate text-xs text-cyan-100/70">{chat.service}</p>
                        </div>
                        <p className="shrink-0 whitespace-nowrap text-[11px] text-cyan-100/65">{chat.time}</p>
                      </div>

                      <div className="mt-2 flex min-w-0 items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-xs text-cyan-100/80">{chat.lastMessage}</p>
                        {chat.unread > 0 ? (
                          <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-cyan-300 px-1.5 text-[10px] font-bold text-slate-950">
                            {chat.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-3">
          {displayedActiveChat ? (
            <>
              <header className="shrink-0 rounded-2xl border border-cyan-100/10 bg-slate-950/35 px-3 py-3">
                <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                    {displayedActiveChat.initials}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{displayedActiveChat.customer}</p>
                    <p className="text-xs text-cyan-100/70">{displayedActiveChat.service}</p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {displayedActiveChat.status}
                </span>
                </div>
              </header>

              <div className="chat-scrollbar mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-3xl bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.10),_transparent_32%),linear-gradient(135deg,_rgba(15,23,42,0.88),_rgba(2,6,23,0.94))] px-4 py-3 pb-5">
                {detailError ? (
                  <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
                    No se pudo cargar el detalle de la conversación.
                  </div>
                ) : null}
                {isLoadingMessages ? (
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/75">
                    Cargando mensajes...
                  </div>
                ) : null}
                {showEmptyMessages ? (
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/75">
                    No hay mensajes registrados todavía.
                  </div>
                ) : null}
                {displayedActiveChat.messages.map((message) => {
                  const isSpecialist = message.from === "specialist";

                  return (
                    <div key={message.id} className={`flex ${isSpecialist ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[min(82%,520px)] flex-col gap-1 ${isSpecialist ? "ml-auto items-end" : "mr-auto items-start"}`}>
                        <p className={`px-2 text-[11px] font-bold ${isSpecialist ? "text-right text-cyan-200/80" : "text-left text-cyan-100/60"}`}>
                          {isSpecialist ? "Tú" : displayedActiveChat.customer}
                        </p>
                        <div
                          className={`overflow-hidden break-words px-4 py-3 text-sm leading-relaxed shadow-lg ${
                            isSpecialist
                              ? "rounded-2xl rounded-tr-sm bg-cyan-300 text-slate-950 shadow-cyan-950/25"
                              : "rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 text-slate-100 shadow-slate-950/25"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`mt-1 text-right text-[11px] ${isSpecialist ? "text-slate-700" : "text-cyan-100/55"}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="mt-3 shrink-0 rounded-3xl border border-cyan-100/10 bg-white/5 px-4 py-3">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    placeholder="Escribe un mensaje para el cliente..."
                    disabled={actionLoading}
                    className="flex-1 rounded-full border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <button
                    type="submit"
                    disabled={!canSendMessage}
                    className="rounded-full border border-cyan-100/10 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? "Enviando..." : "Enviar"}
                  </button>
                </form>
                {sendError || actionError ? (
                  <p className="mt-2 text-sm text-rose-200">{sendError ?? actionError}</p>
                ) : null}
              </footer>
            </>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center rounded-3xl bg-slate-950/30 p-5 text-center text-sm text-cyan-100/75">
              {showInitialChatsLoading ? "Cargando conversaciones..." : "No hay conversaciones registradas todavía."}
            </div>
          )}
        </section>
      </div>
    </SpecialistShell>
  );
}

export default function EspecialistaChatPage() {
  return (
<<<<<<< HEAD
    <Suspense fallback={<div className="flex-1 pb-0" />}>
=======
    <Suspense fallback={null}>
>>>>>>> Nobre
      <EspecialistaChatContent />
    </Suspense>
  );
}
