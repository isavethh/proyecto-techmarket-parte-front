"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ClientPageHeader } from "../../components/ClientPageSections";



type ChatAuthor = "cliente" | "empresa";

type ChatMessage = {
  id: string;
  author: ChatAuthor;
  text: string;
  createdAt: string;
};

type ChatThread = {
  id: string;
  sellerId: string;
  sellerName: string;
  company: string;
  product: string;
  avatar: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
  updatedAt: string;
};

type MarketplaceChatIntent = {
  seller: string;
  company: string;
  product: string;
  message: string;
};

const CHAT_STORAGE_KEY = "techmarket.client.chat.threads";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

const seedThreads: ChatThread[] = [
  {
    id: "chat-techfix-lab",
    sellerId: "techfix-lab",
    sellerName: "Sergio Ramirez",
    company: "TechFix Lab",
    product: "Diagnostico express para laptops lentas",
    avatar: "TL",
    unread: 1,
    online: true,
    updatedAt: "2026-04-19T10:22:00.000Z",
    messages: [
      {
        id: "chat-techfix-lab-m1",
        author: "empresa",
        text: "Hola, vi que buscaste servicio tecnico.",
        createdAt: "2026-04-19T10:20:00.000Z",
      },
      {
        id: "chat-techfix-lab-m2",
        author: "empresa",
        text: "Puedo atenderte hoy mismo en tu zona.",
        createdAt: "2026-04-19T10:21:00.000Z",
      },
      {
        id: "chat-techfix-lab-m3",
        author: "cliente",
        text: "Perfecto, necesito diagnostico para mi laptop.",
        createdAt: "2026-04-19T10:22:00.000Z",
      },
    ],
  },
  {
    id: "chat-zona-gamer-store",
    sellerId: "zona-gamer-store",
    sellerName: "Laura V.",
    company: "Zona Gamer Store",
    product: "Mouse ergonomico con 20% de descuento",
    avatar: "ZG",
    unread: 2,
    online: true,
    updatedAt: "2026-04-19T10:00:00.000Z",
    messages: [
      {
        id: "chat-zona-gamer-store-m1",
        author: "empresa",
        text: "Hola, vimos que buscaste una laptop.",
        createdAt: "2026-04-19T09:55:00.000Z",
      },
      {
        id: "chat-zona-gamer-store-m2",
        author: "empresa",
        text: "Tenemos opciones para estudio y gaming.",
        createdAt: "2026-04-19T09:56:00.000Z",
      },
      {
        id: "chat-zona-gamer-store-m3",
        author: "cliente",
        text: "Me interesa una laptop ligera para trabajo.",
        createdAt: "2026-04-19T09:58:00.000Z",
      },
      {
        id: "chat-zona-gamer-store-m4",
        author: "empresa",
        text: "Te comparto 2 opciones con entrega inmediata.",
        createdAt: "2026-04-19T10:00:00.000Z",
      },
    ],
  },
];

const sortThreadsByRecent = (threads: ChatThread[]): ChatThread[] =>
  [...threads].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

const createSellerId = (value: string): string => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `seller-${Date.now()}`;
};

const createAvatar = (company: string): string => {
  const parts = company
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "CH";
  }

  return parts.map((token) => token[0]?.toUpperCase() ?? "").join("");
};

const formatHour = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);

  if (Number.isNaN(parsed)) {
    return "--:--";
  }

  const date = new Date(parsed);
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "p. m." : "a. m.";
  const normalizedHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${String(normalizedHour).padStart(2, "0")}:${minutes} ${period}`;
};
const REFERENCE_NOW = Date.parse("2026-04-19T10:30:00.000Z");

const formatRelativeTime = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);

  if (Number.isNaN(parsed)) {
    return "Reciente";
  }

  const diffMs = REFERENCE_NOW - parsed;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return "Ahora";
  }

  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `Hace ${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
};

const readStoredThreads = (): ChatThread[] => {
  if (typeof window === "undefined") {
    return sortThreadsByRecent(seedThreads);
  }

  const storedValue = window.localStorage.getItem(CHAT_STORAGE_KEY);

  if (!storedValue) {
    return sortThreadsByRecent(seedThreads);
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return sortThreadsByRecent(seedThreads);
    }

    return sortThreadsByRecent(parsedValue as ChatThread[]);
  } catch {
    return sortThreadsByRecent(seedThreads);
  }
};

const writeStoredThreads = (threads: ChatThread[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sortThreadsByRecent(threads)));
};

const upsertThreadFromMarketplace = (
  currentThreads: ChatThread[],
  intent: MarketplaceChatIntent,
): { threads: ChatThread[]; threadId: string } => {
  const nowIso = new Date().toISOString();
  const sellerId = createSellerId(intent.seller || intent.company);
  const fallbackSellerName = intent.seller || intent.company;
  const existingThread = currentThreads.find(
    (thread) => thread.sellerId === sellerId || thread.company.toLowerCase() === intent.company.toLowerCase(),
  );

  if (existingThread) {
    const updatedThread: ChatThread = {
      ...existingThread,
      product: intent.product || existingThread.product,
      unread: 0,
      updatedAt: nowIso,
    };

    const nextThreads = currentThreads.map((thread) =>
      thread.id === existingThread.id ? updatedThread : thread,
    );

    return {
      threads: sortThreadsByRecent(nextThreads),
      threadId: existingThread.id,
    };
  }

  const nextThread: ChatThread = {
    id: `chat-${sellerId}`,
    sellerId,
    sellerName: fallbackSellerName,
    company: intent.company || fallbackSellerName,
    product: intent.product || "Publicacion de marketplace",
    avatar: createAvatar(intent.company || fallbackSellerName),
    unread: 0,
    online: true,
    updatedAt: nowIso,
    messages: [
      {
        id: `chat-${sellerId}-intro`,
        author: "empresa",
        text: `Hola, soy ${fallbackSellerName}. Gracias por contactar a ${intent.company || fallbackSellerName}.`,
        createdAt: nowIso,
      },
    ],
  };

  return {
    threads: sortThreadsByRecent([nextThread, ...currentThreads]),
    threadId: nextThread.id,
  };
};

export default function ClienteChatPage() {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  const marketplaceIntent = useMemo<MarketplaceChatIntent | null>(() => {
    const source = searchParams.get("source");
    const seller = searchParams.get("seller")?.trim() ?? "";
    const company = searchParams.get("company")?.trim() ?? seller;
    const product = searchParams.get("product")?.trim() ?? "Publicacion en marketplace";
    const message =
      searchParams.get("message")?.trim() ??
      `Hola, vi tu anuncio \"${product}\". Sigue disponible?`;

    if (source !== "marketplace") {
      return null;
    }

    if (!seller && !company) {
      return null;
    }

    return {
      seller: seller || company,
      company: company || seller,
      product,
      message,
    };
  }, [searchParams]);

  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const initialThreads = readStoredThreads();

    if (!marketplaceIntent) {
      return initialThreads;
    }

    return upsertThreadFromMarketplace(initialThreads, marketplaceIntent).threads;
  });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    const initialThreads = readStoredThreads();

    if (!marketplaceIntent) {
      return initialThreads[0]?.id ?? null;
    }

    return upsertThreadFromMarketplace(initialThreads, marketplaceIntent).threadId;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [draftMessage, setDraftMessage] = useState(() => marketplaceIntent?.message ?? "");

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    writeStoredThreads(threads);
  }, [threads]);

  const activeThread = useMemo(() => {
    if (!threads.length) {
      return null;
    }

    if (!activeThreadId) {
      return threads[0];
    }

    return threads.find((thread) => thread.id === activeThreadId) ?? threads[0];
  }, [activeThreadId, threads]);

  const filteredThreads = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return sortThreadsByRecent(threads);
    }

    return sortThreadsByRecent(threads).filter((thread) => {
      const lastMessage = thread.messages[thread.messages.length - 1]?.text ?? "";
      const bucket = `${thread.company} ${thread.sellerName} ${thread.product} ${lastMessage}`.toLowerCase();
      return bucket.includes(normalizedQuery);
    });
  }, [searchQuery, threads]);

  useEffect(() => {
    if (!activeThread) {
      return;
    }

    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeThread]);

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);

    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              unread: 0,
            }
          : thread,
      ),
    );
  };

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeThread) {
      return;
    }

    const normalizedMessage = draftMessage.trim();

    if (normalizedMessage.length < 2) {
      return;
    }

    const nowIso = new Date().toISOString();

    setThreads((current) => {
      const nextThreads = current.map((thread) => {
        if (thread.id !== activeThread.id) {
          return thread;
        }

        const nextMessage: ChatMessage = {
          id: `${thread.id}-m-${Date.now()}`,
          author: "cliente",
          text: normalizedMessage,
          createdAt: nowIso,
        };

        return {
          ...thread,
          messages: [...thread.messages, nextMessage],
          unread: 0,
          updatedAt: nowIso,
        };
      });

      return sortThreadsByRecent(nextThreads);
    });

    setDraftMessage("");
  };

  const totalUnread = useMemo(
    () => threads.reduce((accumulator, thread) => accumulator + (thread.unread ?? 0), 0),
    [threads],
  );

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader
        sectionLabel="Chats cliente"
        middleSlot={(
          <input
            className="auth-input"
            placeholder="Buscar conversaciones, vendedor o producto..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
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
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`auth-action ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">BANDEJA DE CHATS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Conversaciones ordenadas</h1>
            <p className="mt-2 text-sm text-cyan-100/75">
              Vista completa para revisar todos tus chats, abrir cada hilo y responder rapido.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-cyan-100/12 bg-slate-950/35 p-3">
                <p className="text-cyan-200/70">Chats</p>
                <p className="mt-1 text-lg font-semibold text-cyan-50">{threads.length}</p>
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
            <div className="space-y-2">
              {filteredThreads.map((thread) => {
                const isActive = thread.id === activeThread?.id;
                const lastMessage = thread.messages[thread.messages.length - 1];

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => handleSelectThread(thread.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      isActive
                        ? "border-cyan-300/40 bg-cyan-300/14"
                        : "border-cyan-100/12 bg-slate-950/35 hover:border-cyan-200/30 hover:bg-slate-900/45"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                          {thread.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-cyan-50">{thread.company}</p>
                          <p className="truncate text-xs text-cyan-200/75">{thread.sellerName}</p>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-cyan-200/65">
                        <p>{formatRelativeTime(thread.updatedAt)}</p>
                        {thread.unread > 0 ? (
                          <span className="mt-1 inline-flex rounded-full border border-cyan-100/15 bg-cyan-300/20 px-2 py-0.5 text-[10px] text-cyan-50">
                            {thread.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-2 truncate text-xs text-cyan-100/75">{thread.product}</p>
                    <p className="mt-1 truncate text-xs text-cyan-100/70">{lastMessage?.text ?? "Sin mensajes"}</p>
                  </button>
                );
              })}

              {filteredThreads.length === 0 ? (
                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                  No encontramos chats para esa busqueda.
                </div>
              ) : null}
            </div>
          </section>
        </aside>

        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(10,33,57,0.97),rgba(4,18,34,0.98))] shadow-xl shadow-slate-950/35">
          {activeThread ? (
            <>
              <div className="border-b border-cyan-100/10 bg-[linear-gradient(120deg,rgba(19,78,110,0.28),rgba(7,24,44,0.84))] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                      {activeThread.avatar}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-cyan-50">{activeThread.company}</p>
                      <p className="text-xs text-cyan-200/75">{activeThread.sellerName}</p>
                      <p className="text-[11px] text-cyan-100/65">Consulta: {activeThread.product}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-cyan-200/70">
                    <p>{activeThread.online ? "Activo ahora" : "Ultima conexion reciente"}</p>
                    <p className="mt-1">{formatRelativeTime(activeThread.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div
                ref={messageListRef}
                className="chat-scrollbar flex-1 min-h-0 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(4,13,24,0.3),rgba(4,11,20,0.58))] px-5 py-4"
              >
                {activeThread.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8, x: message.author === "cliente" ? 8 : -8 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.18, delay: index * 0.02 }}
                    className={`flex ${message.author === "cliente" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl border px-3 py-2 text-sm leading-6 ${
                        message.author === "cliente"
                          ? "border-cyan-200/25 bg-cyan-300/16 text-cyan-50"
                          : "border-cyan-100/10 bg-white/5 text-cyan-100/92"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="mt-2 text-right text-[11px] text-cyan-100/55">{formatHour(message.createdAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-cyan-100/10 bg-slate-950/40 px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <textarea
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    placeholder="Escribe tu mensaje..."
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-cyan-100/12 bg-slate-950/45 px-3 py-2 text-sm text-cyan-50 placeholder:text-cyan-100/45 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  <button
                    type="submit"
                    disabled={draftMessage.trim().length < 2}
                    className="rounded-2xl border border-cyan-200/25 bg-cyan-400/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-[60vh] items-center justify-center px-5 text-center text-cyan-100/75">
              Selecciona un chat para ver la conversacion completa.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
