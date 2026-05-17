"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTechmarketToken, getTechmarketUserId } from "@/lib/auth/tokenStore";
import {
  createSpecialistFile,
  deleteSpecialistFile,
  getSpecialistChatById,
  getSpecialistChats,
  getSpecialistFiles,
  loginTechMarket,
  sendSpecialistChatMessage,
  type CreateSpecialistFileInput,
  type SpecialistChat,
  type SpecialistChatDetail,
  type SpecialistChatMessage,
  type SpecialistFile,
} from "@/lib/api/specialists";
import {
  specialistChats,
  type SpecialistChatItem,
  type SpecialistChatMessageItem,
  type SpecialistFileItem,
} from "../specialistData";
import { debugSpecialistResult, getDatasetSource, normalizeBackendList, type DatasetSource } from "./specialistBackendHelpers";

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function formatChatTime(value: unknown) {
  const raw = firstText(value);

  if (!raw) {
    return "Fecha no disponible";
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return new Intl.DateTimeFormat("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
  }).format(date).replace(".", "");
}

function initialsFromName(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "CL";
}

function firstArray<T>(...values: unknown[]): T[] {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
}

function unwrapChatPayload(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  const payload = value as { value?: unknown; data?: unknown };
  return payload.value ?? payload.data ?? value;
}

function extractMessages(value: unknown): SpecialistChatMessage[] {
  const payload = unwrapChatPayload(value);

  if (Array.isArray(payload)) {
    return payload as SpecialistChatMessage[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const chat = payload as SpecialistChatDetail;
  const data = (chat.data && typeof chat.data === "object" && !Array.isArray(chat.data)) ? chat.data as SpecialistChatDetail : undefined;
  const nestedValue = (chat.value && typeof chat.value === "object" && !Array.isArray(chat.value)) ? chat.value as SpecialistChatDetail : undefined;

  return firstArray<SpecialistChatMessage>(
    chat.messages,
    chat.mensajes,
    chat.ticketMessages,
    chat.messageList,
    data?.messages,
    data?.mensajes,
    data?.ticketMessages,
    data?.messageList,
    nestedValue?.messages,
    nestedValue?.mensajes,
    nestedValue?.ticketMessages,
    nestedValue?.messageList,
  );
}

function mapMessage(message: SpecialistChatMessage, index: number, currentUserId?: string): SpecialistChatMessageItem {
  const explicitSender = text(message.from ?? message.sender ?? message.remitente ?? message.role, "").toLowerCase();
  const authorUserId = text(message.author_user_id ?? message.authorUserId, "");
  const from = explicitSender
    ? explicitSender.includes("specialist") || explicitSender.includes("especialista") || explicitSender.includes("tecnico") || explicitSender.includes("técnico")
      ? "specialist"
      : "customer"
    : currentUserId && authorUserId && authorUserId === currentUserId
      ? "specialist"
      : "customer";

  return {
    id: text(message.id ?? message.messageId, `message-${index}`),
    from,
    text: text(
      message.texto ?? message.text ?? message.mensaje ?? message.message ?? message.message_body ?? message.messageBody ?? message.body ?? message.content ?? message.contenido,
      "Mensaje sin contenido.",
    ),
    time: formatChatTime(message.hora ?? message.time ?? message.fecha ?? message.date ?? message.created_at ?? message.createdAt),
  };
}

function serviceText(chat: SpecialistChat, fallback = "Consulta técnica") {
  return text(
    chat.servicio ?? chat.service ?? chat.serviceName ?? chat.service_name ?? chat.subject ?? chat.ticketSubject ?? chat.ticket_subject ?? chat.title,
    fallback,
  );
}

function lastMessageText(chat: SpecialistChat, fallback: string) {
  return text(
    chat.ultimoMensaje ?? chat.lastMessage ?? chat.last_message ?? chat.latestMessage ?? chat.latest_message ?? chat.messageBody ?? chat.message_body ?? chat.text ?? chat.content,
    fallback,
  );
}

export function mapBackendChatToUiChat(chat: SpecialistChat, index: number, currentUserId?: string): SpecialistChatItem {
  const customer = text(chat.cliente ?? chat.customer ?? chat.clientName, "Cliente no especificado");
  const messages = extractMessages(chat).map((message, messageIndex) => mapMessage(message, messageIndex, currentUserId));
  const lastMessage = lastMessageText(chat, messages.at(-1)?.text ?? "Sin mensajes recientes");

  return {
    id: text(chat.id ?? chat.chatId, `chat-${index}`),
    customer,
    initials: text(chat.iniciales ?? chat.initials, initialsFromName(customer)),
    service: serviceText(chat),
    status: text(chat.estado ?? chat.status, "Disponible"),
    lastMessage,
    time: formatChatTime(chat.hora ?? chat.time ?? chat.fecha ?? chat.date ?? chat.ultimaActividad),
    unread: numberValue(chat.noLeidos ?? chat.unread),
    messages,
  };
}

export function mapBackendChatDetailToUiChat(
  detail: SpecialistChatDetail,
  fallbackChat?: SpecialistChatItem,
  currentUserId?: string,
): SpecialistChatItem {
  const payload = unwrapChatPayload(detail);
  const mapped = !Array.isArray(payload) && payload && typeof payload === "object"
    ? mapBackendChatToUiChat(payload as SpecialistChat, 0, currentUserId)
    : undefined;
  const messages = extractMessages(detail).map((message, index) => mapMessage(message, index, currentUserId));

  return {
    ...(fallbackChat ?? mapped),
    id: fallbackChat?.id ?? mapped?.id ?? "chat-detail",
    customer: mapped?.customer && mapped.customer !== "Cliente no especificado" ? mapped.customer : fallbackChat?.customer ?? "Cliente no especificado",
    initials: mapped?.initials && mapped.initials !== "CL" ? mapped.initials : fallbackChat?.initials ?? "CL",
    service: mapped?.service && mapped.service !== "Consulta técnica" ? mapped.service : fallbackChat?.service ?? "Consulta técnica",
    status: mapped?.status ?? fallbackChat?.status ?? "Disponible",
    lastMessage: messages.at(-1)?.text ?? mapped?.lastMessage ?? fallbackChat?.lastMessage ?? "Sin mensajes recientes",
    time: mapped?.time && mapped.time !== "Fecha no disponible" ? mapped.time : fallbackChat?.time ?? "Fecha no disponible",
    unread: mapped?.unread ?? fallbackChat?.unread ?? 0,
    messages,
  };
}

export function mapBackendFileToUiFile(file: SpecialistFile, index: number): SpecialistFileItem {
  const relatedTo = file.relatedTo ?? file.proyecto ?? file.project ?? file.cliente ?? file.customer ?? file.clientName;

  return {
    id: text(file.id ?? file.fileId, `file-${index}`),
    name: text(file.nombre ?? file.name ?? file.filename, "Archivo sin nombre"),
    type: text(file.tipo ?? file.type ?? file.mimeType, "Archivo"),
    size: typeof file.tamano === "number" || typeof file.size === "number"
      ? `${file.tamano ?? file.size} bytes`
      : text(file.tamano ?? file.size, "Tamano no disponible"),
    uploadedAt: text(file.fechaCarga ?? file.uploadedAt ?? file.createdAt, "Fecha no disponible"),
    relatedTo: text(relatedTo, "Sin relación asociada"),
    url: typeof file.url === "string" ? file.url : undefined,
  };
}

export function useSpecialistChatFilesData(initialChatId = ""): {
  chats: SpecialistChatItem[];
  activeChat: SpecialistChatItem | undefined;
  files: SpecialistFileItem[];
  loading: boolean;
  isLoadingFiles: boolean;
  hasLoadedFiles: boolean;
  filesError: string | null;
  isLoadingChats: boolean;
  hasLoadedChats: boolean;
  chatsError: string | null;
  isLoadingMessages: boolean;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
  actionSuccess: string | null;
  detailError: string | null;
  chatsSource: DatasetSource;
  filesSource: DatasetSource;
  selectedChatId: string;
  setSelectedChatId: Dispatch<SetStateAction<string>>;
  sendMessage: (chatId: string, messageText: string) => Promise<void>;
  uploadFile: (input: CreateSpecialistFileInput) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  refreshChatFilesData: () => Promise<void>;
} {
  const [chats, setChats] = useState<SpecialistChatItem[]>([]);
  const [activeChat, setActiveChat] = useState<SpecialistChatItem | undefined>();
  const [files, setFiles] = useState<SpecialistFileItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState(initialChatId);
  const [auth, setAuth] = useState<{ token: string; userId: string } | null>(null);
  const [chatsSource, setChatsSource] = useState<DatasetSource>("empty");
  const [filesSource, setFilesSource] = useState<DatasetSource>("empty");
  const [loading, setLoading] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [hasLoadedFiles, setHasLoadedFiles] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [hasLoadedChats, setHasLoadedChats] = useState(false);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const authRef = useRef(auth);

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  const refreshChatFilesData = useCallback(async () => {
    try {
      setLoading(true);
      setIsLoadingChats(true);
      setIsLoadingFiles(true);
      setError(null);
      setChatsError(null);
      setFilesError(null);

      const storedToken = getTechmarketToken();
      const storedUserId = getTechmarketUserId();
      const currentAuth = authRef.current
        ?? (storedToken && storedUserId
          ? { token: storedToken, userId: storedUserId }
          : await loginTechMarket().then((login) => ({ token: login.accessToken, userId: login.userId })));
      const [chatsResult, filesResult] = await Promise.allSettled([
        getSpecialistChats(currentAuth.token, currentAuth.userId),
        getSpecialistFiles(currentAuth.token, currentAuth.userId),
      ]);

      debugSpecialistResult("[chat raw response]", chatsResult);
      debugSpecialistResult("[specialist files]", filesResult);

      const backendChats = chatsResult.status === "fulfilled"
        ? normalizeBackendList<SpecialistChat>(chatsResult.value)
        : [];
      const backendFiles = filesResult.status === "fulfilled"
        ? normalizeBackendList<SpecialistFile>(filesResult.value)
        : [];
      const uiChats = chatsResult.status === "fulfilled"
        ? backendChats.map((chat, index) => mapBackendChatToUiChat(chat, index, currentAuth.userId))
        : specialistChats;
      debugSpecialistResult("[chat mapped]", uiChats);

      setAuth(currentAuth);
      setChats(uiChats);
      setChatsSource(chatsResult.status === "fulfilled" ? getDatasetSource(backendChats) : "fallback");
      setSelectedChatId((current) => {
        const preferredChatId = current || initialChatId;
        const selectedChatStillExists = preferredChatId && uiChats.some((chat) => chat.id === preferredChatId);
        const nextSelectedChatId = selectedChatStillExists ? preferredChatId : uiChats[0]?.id || "";
        return nextSelectedChatId;
      });
      if (filesResult.status === "fulfilled") {
        setFiles(backendFiles.map(mapBackendFileToUiFile));
        setFilesSource(getDatasetSource(backendFiles));
      } else {
        setFilesError(filesResult.reason instanceof Error ? filesResult.reason.message : "No se pudieron cargar los archivos.");
        setFilesSource("empty");
      }
      setHasLoadedFiles(true);
      setHasLoadedChats(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido al cargar chat y archivos";
      setError(message);
      setChatsError(message);
      setFilesError(message);
      setFilesSource("empty");
    } finally {
      setLoading(false);
      setIsLoadingChats(false);
      setIsLoadingFiles(false);
    }
  }, [initialChatId]);

  useEffect(() => {
    let isMounted = true;

    async function loadChatFilesData() {
      await refreshChatFilesData();
    }

    if (isMounted) {
      loadChatFilesData();
    }

    return () => {
      isMounted = false;
    };
  }, [refreshChatFilesData]);

  useEffect(() => {
    let isMounted = true;

    async function loadSelectedChatDetail() {
      if (!selectedChatId) {
        setActiveChat(chats[0]);
        return;
      }

      const fallbackChat = chats.find((chat) => chat.id === selectedChatId) ?? chats[0];

      if (!auth) {
        setActiveChat(fallbackChat);
        return;
      }

      try {
        setIsLoadingMessages(true);
        setDetailError(null);
        const detail = await getSpecialistChatById(auth.token, auth.userId, selectedChatId);

        if (!isMounted) {
          return;
        }

        debugSpecialistResult("[specialist chat detail]", detail);
        const mappedActiveChat = mapBackendChatDetailToUiChat(detail, fallbackChat, auth.userId);
        debugSpecialistResult("[mapped active chat]", mappedActiveChat);
        setActiveChat(mappedActiveChat);
      } catch (err) {
        if (isMounted) {
          setDetailError(err instanceof Error ? err.message : "No se pudo cargar el detalle de la conversación.");
          setActiveChat(fallbackChat);
        }
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadSelectedChatDetail();

    return () => {
      isMounted = false;
    };
  }, [auth, chats, selectedChatId]);

  const sendMessage = useCallback(
    async (chatId: string, messageText: string) => {
      if (!auth?.token || !auth.userId) {
        setActionError("No hay sesion activa para enviar el mensaje.");
        return;
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        await sendSpecialistChatMessage(auth.token, auth.userId, chatId, { contenido: messageText });
        setSelectedChatId(chatId);
        await refreshChatFilesData();
        const detail = await getSpecialistChatById(auth.token, auth.userId, chatId);
        setActiveChat(mapBackendChatDetailToUiChat(detail, chats.find((chat) => chat.id === chatId), auth.userId));
        setActionSuccess("Mensaje enviado correctamente.");
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo enviar el mensaje.");
      } finally {
        setActionLoading(false);
      }
    },
    [auth, chats, refreshChatFilesData],
  );

  const uploadFile = useCallback(
    async (input: CreateSpecialistFileInput) => {
      if (!auth?.token || !auth.userId) {
        const message = "No hay sesion activa para registrar el archivo.";
        setActionError(message);
        throw new Error(message);
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        await createSpecialistFile(auth.token, auth.userId, input);
        await refreshChatFilesData();
        setActionSuccess("Archivo registrado correctamente.");
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo registrar el archivo.";
        setActionError(message);
        throw new Error(message);
      } finally {
        setActionLoading(false);
      }
    },
    [auth, refreshChatFilesData],
  );

  const deleteFile = useCallback(
    async (fileId: string) => {
      if (!auth?.token || !auth.userId) {
        setActionError("No hay sesion activa para eliminar el archivo.");
        return;
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        await deleteSpecialistFile(auth.token, auth.userId, fileId);
        await refreshChatFilesData();
        setActionSuccess("Archivo eliminado correctamente.");
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo eliminar el archivo.");
      } finally {
        setActionLoading(false);
      }
    },
    [auth, refreshChatFilesData],
  );

  return useMemo(
    () => ({
      chats,
      activeChat,
      files,
      chatsSource,
      filesSource,
      loading,
      isLoadingFiles,
      hasLoadedFiles,
      filesError,
      isLoadingChats,
      hasLoadedChats,
      chatsError,
      isLoadingMessages,
      actionLoading,
      error,
      actionError,
      actionSuccess,
      detailError,
      selectedChatId,
      setSelectedChatId,
      sendMessage,
      uploadFile,
      deleteFile,
      refreshChatFilesData,
    }),
    [
      chats,
      activeChat,
      files,
      chatsSource,
      filesSource,
      loading,
      isLoadingFiles,
      hasLoadedFiles,
      filesError,
      isLoadingChats,
      hasLoadedChats,
      chatsError,
      isLoadingMessages,
      actionLoading,
      error,
      actionError,
      actionSuccess,
      detailError,
      selectedChatId,
      sendMessage,
      uploadFile,
      deleteFile,
      refreshChatFilesData,
    ],
  );
}
