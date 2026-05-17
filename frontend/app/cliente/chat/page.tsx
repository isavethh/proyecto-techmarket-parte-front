"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ClientPageHeader } from "../../components/ClientPageSections";
import ClientSidebar from "../ClientSidebar";
import {
  createClientChat,
  createClientChatMessage,
  getClientChatMessages,
  listClientChats,
  markClientChatRead,
  readCurrentUserId,
  type ClientChatMessage,
  type ClientChatSummary,
} from "@/lib/api/iaApi";



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
  companyId: string;
  productId: string;
  product: string;
  message: string;
};

const MARKETPLACE_CHAT_MAP_KEY = "techmarket.client.marketplace.chatByProduct";

const readMarketplaceChatMap = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(MARKETPLACE_CHAT_MAP_KEY);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === "object" && !Array.isArray(parsedValue)
      ? (parsedValue as Record<string, string>)
      : {};
  } catch {
    return {};
  }
};

const saveMarketplaceChat = (productId: string, chatId: string): void => {
  if (typeof window === "undefined" || !productId || !chatId) {
    return;
  }

  const currentMap = readMarketplaceChatMap();
  window.localStorage.setItem(
    MARKETPLACE_CHAT_MAP_KEY,
    JSON.stringify({ ...currentMap, [productId]: chatId }),
  );
};

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
const formatRelativeTime = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);

  if (Number.isNaN(parsed)) {
    return "Reciente";
  }

  const diffMs = Date.now() - parsed;
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

const normalizeRemoteUserId = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.toUpperCase().startsWith("USR-")) {
    return trimmed.slice(4);
  }
  return trimmed;
};

const buildThreadFromConversation = (conversation: ClientChatSummary): ChatThread => {
  const nowIso = new Date().toISOString();
  const seedMessage = conversation.ultimoMensaje
    ? [
        {
          id: `${conversation.id}-last`,
          author: "empresa" as const,
          text: conversation.ultimoMensaje,
          createdAt: nowIso,
        },
      ]
    : [];

  return {
    id: conversation.id,
    sellerId: conversation.id,
    sellerName: conversation.empresa.nombre ?? "Empresa",
    company: conversation.empresa.nombre ?? "Empresa",
    product: "Conversacion",
    avatar: createAvatar(conversation.empresa.nombre ?? "Empresa"),
    unread: conversation.mensajesSinLeer ?? 0,
    online: true,
    messages: seedMessage,
    updatedAt: nowIso,
  };
};

const buildMessageFromConversation = (
  message: ClientChatMessage,
  currentUserId: string | null,
): ChatMessage => {
  const isFromCurrentUser =
    message.remitente === "cliente" ||
    Boolean(currentUserId && normalizeRemoteUserId(message.remitente) === currentUserId);

  return {
    id: message.id,
    author: isFromCurrentUser ? "cliente" : "empresa",
    text: message.contenido,
    createdAt: message.fecha,
  };
};

const readStoredThreads = (): ChatThread[] => [];

const writeStoredThreads = (_threads: ChatThread[]) => {};

const upsertThreadFromMarketplace = (
  currentThreads: ChatThread[],
  intent: MarketplaceChatIntent,
): { threads: ChatThread[]; threadId: string } => {
  const nowIso = new Date().toISOString();
  const sellerId = createSellerId(`${intent.companyId || intent.seller || intent.company}-${intent.productId || intent.product}`);
  const fallbackSellerName = intent.seller || intent.company;
  const existingThread = currentThreads.find(
    (thread) => thread.sellerId === sellerId,
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

function ClienteChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const requestedChatId = searchParams.get("chatId")?.trim() ?? "";

  const marketplaceIntent = useMemo<MarketplaceChatIntent | null>(() => {
    const source = searchParams.get("source");
    const seller = searchParams.get("seller")?.trim() ?? "";
    const company = searchParams.get("company")?.trim() ?? seller;
    const companyId = searchParams.get("companyId")?.trim() ?? "";
    const productId = searchParams.get("productId")?.trim() ?? "";
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
      companyId,
      productId,
      product,
      message,
    };
  }, [searchParams]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const initialThreads = readStoredThreads();

    if (!marketplaceIntent) {
      return initialThreads;
    }

    return upsertThreadFromMarketplace(initialThreads, marketplaceIntent).threads;
  });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    const initialThreads = readStoredThreads();

    if (requestedChatId) {
      return requestedChatId;
    }

    if (!marketplaceIntent) {
      return initialThreads[0]?.id ?? null;
    }

    return upsertThreadFromMarketplace(initialThreads, marketplaceIntent).threadId;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [draftMessage, setDraftMessage] = useState(() => marketplaceIntent?.message ?? "");

  const messageListRef = useRef<HTMLDivElement>(null);
  const createdMarketplaceChatKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setCurrentUserId(readCurrentUserId());
  }, []);

  useEffect(() => {
    let active = true;

    const loadConversations = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const conversations = await listClientChats();
        const mappedThreads = conversations.map(buildThreadFromConversation);
        let nextThreads = mappedThreads;
        let preferredThreadId = requestedChatId;

        if (marketplaceIntent?.companyId) {
          const intentKey = `${marketplaceIntent.companyId}:${marketplaceIntent.productId}:${marketplaceIntent.product}`;

          if (createdMarketplaceChatKeyRef.current !== intentKey) {
            createdMarketplaceChatKeyRef.current = intentKey;
            const existingChatId = marketplaceIntent.productId
              ? readMarketplaceChatMap()[marketplaceIntent.productId]
              : null;

            if (existingChatId) {
              preferredThreadId = existingChatId;
              router.replace(`/cliente/chat?chatId=${encodeURIComponent(existingChatId)}`);
            } else {
              const createdChat = await createClientChat({
                empresaId: marketplaceIntent.companyId,
                asunto: marketplaceIntent.product,
              });

              let createdMessages: ChatMessage[] = [];
              if (marketplaceIntent.message.trim().length >= 2) {
                const createdMessage = await createClientChatMessage(
                  createdChat.chatId,
                  marketplaceIntent.message,
                );
                createdMessages = [
                  {
                    id: createdMessage.id,
                    author: "cliente",
                    text: createdMessage.contenido,
                    createdAt: createdMessage.fecha,
                  },
                ];
              }

              const nowIso = createdMessages[0]?.createdAt ?? new Date().toISOString();
              const createdThread: ChatThread = {
                id: createdChat.chatId,
                sellerId: createSellerId(
                  `${marketplaceIntent.companyId}-${marketplaceIntent.productId || marketplaceIntent.product}`,
                ),
                sellerName: marketplaceIntent.seller || marketplaceIntent.company,
                company: marketplaceIntent.company || marketplaceIntent.seller,
                product: marketplaceIntent.product,
                avatar: createAvatar(marketplaceIntent.company || marketplaceIntent.seller),
                unread: 0,
                online: true,
                messages: createdMessages,
                updatedAt: nowIso,
              };

              if (marketplaceIntent.productId) {
                saveMarketplaceChat(marketplaceIntent.productId, createdChat.chatId);
              }

              preferredThreadId = createdChat.chatId;
              nextThreads = sortThreadsByRecent([createdThread, ...mappedThreads]);
              router.replace(`/cliente/chat?chatId=${encodeURIComponent(createdChat.chatId)}`);
            }
          }
        } else if (marketplaceIntent) {
          nextThreads = upsertThreadFromMarketplace(nextThreads, marketplaceIntent).threads;
        }

        if (!active) {
          return;
        }

        setThreads(nextThreads);
        setActiveThreadId((current) => {
          if (preferredThreadId && nextThreads.some((thread) => thread.id === preferredThreadId)) {
            return preferredThreadId;
          }

          if (current && nextThreads.some((thread) => thread.id === current)) {
            return current;
          }

          return nextThreads[0]?.id ?? null;
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          error instanceof Error ? error.message : "No se pudo cargar conversaciones",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadConversations();

    return () => {
      active = false;
    };
  }, [marketplaceIntent, requestedChatId, router]);

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
    if (!activeThread || !activeThread.id.startsWith("CHT-")) {
      return;
    }

    let active = true;

    getClientChatMessages(activeThread.id)
      .then((messages) => {
        if (!active) {
          return;
        }

        const mappedMessages = messages.map((message) =>
          buildMessageFromConversation(message, currentUserId),
        );
        const updatedAt =
          mappedMessages[mappedMessages.length - 1]?.createdAt ?? activeThread.updatedAt;

        setThreads((current) =>
          current.map((thread) =>
            thread.id === activeThread.id
              ? {
                  ...thread,
                  messages: mappedMessages,
                  updatedAt,
                }
              : thread,
          ),
        );
      })
      .catch(() => {
        // ignore message load errors
      });

    return () => {
      active = false;
    };
  }, [activeThread, currentUserId]);

  const activeThreadMessageCount = activeThread?.messages.length ?? 0;

  useEffect(() => {
    if (!activeThread) {
      return;
    }

    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeThread?.id, activeThreadMessageCount]);

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

    if (threadId.startsWith("CHT-")) {
      markClientChatRead(threadId).catch(() => {
        // ignore read marker errors
      });
    }
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeThread) {
      return;
    }

    const normalizedMessage = draftMessage.trim();

    if (normalizedMessage.length < 2) {
      return;
    }

    if (activeThread.id.startsWith("CHT-")) {
      try {
        const response = await createClientChatMessage(activeThread.id, normalizedMessage);
        const nowIso = response.fecha ?? new Date().toISOString();

        setThreads((current) => {
          const nextThreads = current.map((thread) => {
            if (thread.id !== activeThread.id) {
              return thread;
            }

            const nextMessage: ChatMessage = {
              id: response.id,
              author: "cliente",
              text: response.contenido,
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
      } catch {
        // ignore send errors
      }

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

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-120px)] lg:grid-cols-[260px_minmax(300px,390px)_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-120px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
          <ClientSidebar contextCard={false} />

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">BANDEJA DE CHATS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Conversaciones ordenadas</h1>
            <p className="mt-2 text-sm text-cyan-100/75">
              Vista completa para revisar todos tus chats, abrir cada hilo y responder rapido.
            </p>
            {isLoading ? (
              <p className="mt-2 text-xs text-cyan-200/75">Cargando conversaciones...</p>
            ) : null}
            {loadError ? (
              <p className="mt-2 text-xs text-rose-200/85">{loadError}</p>
            ) : null}

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
        </aside>

        <section className="flex min-h-[420px] min-w-0 flex-col overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(170deg,rgba(11,34,60,0.95),rgba(6,23,43,0.95))] lg:h-full">
          <div className="border-b border-cyan-100/10 px-4 py-4">
            <p className="tech-mono text-xs text-cyan-200/75">TODOS MIS CHATS</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-cyan-50">Bandeja</h2>
                <p className="mt-1 text-sm text-cyan-100/70">
                  {filteredThreads.length} de {threads.length} conversaciones
                </p>
              </div>
              {totalUnread > 0 ? (
                <span className="rounded-full border border-cyan-100/15 bg-cyan-300/18 px-3 py-1 text-xs font-semibold text-cyan-50">
                  {totalUnread} sin leer
                </span>
              ) : null}
            </div>
          </div>

          <div className="chat-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
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
                        ? "border-cyan-300/45 bg-cyan-300/16 shadow-lg shadow-cyan-950/20"
                        : "border-cyan-100/12 bg-slate-950/35 hover:border-cyan-200/30 hover:bg-slate-900/45"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                          {thread.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-cyan-50">{thread.company}</p>
                          <p className="truncate text-xs text-cyan-200/75">{thread.product}</p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right text-[11px] text-cyan-200/65">
                        <p>{formatRelativeTime(thread.updatedAt)}</p>
                        {thread.unread > 0 ? (
                          <span className="mt-1 inline-flex rounded-full border border-cyan-100/15 bg-cyan-300/20 px-2 py-0.5 text-[10px] text-cyan-50">
                            {thread.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-cyan-100/72">
                      {lastMessage?.text ?? "Sin mensajes"}
                    </p>
                  </button>
                );
              })}

              {filteredThreads.length === 0 ? (
                <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                  No encontramos chats para esa busqueda.
                </div>
              ) : null}
            </div>
          </div>
        </section>

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
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
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

export default function ClienteChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 pb-0" />}>
      <ClienteChatContent />
    </Suspense>
  );
}
