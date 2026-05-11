"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  getSpecialistChatById,
  getSpecialistChats,
  getSpecialistFiles,
  loginTechMarket,
  type SpecialistChat,
  type SpecialistChatDetail,
  type SpecialistChatMessage,
  type SpecialistFile,
} from "@/lib/api/specialists";
import {
  specialistChats,
  specialistFiles,
  type SpecialistChatItem,
  type SpecialistChatMessageItem,
  type SpecialistFileItem,
} from "../specialistData";

type BackendListResponse<T> = {
  value?: T[];
  data?: T[];
  Count?: number;
};

function normalizeList<T>(response: T[] | BackendListResponse<T>) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.value ?? response.data ?? [];
}

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

function initialsFromName(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "CL";
}

function mapMessage(message: SpecialistChatMessage, index: number): SpecialistChatMessageItem {
  const sender = text(message.from ?? message.sender ?? message.role, "customer").toLowerCase();

  return {
    id: text(message.id ?? message.messageId, `message-${index}`),
    from: sender.includes("specialist") || sender.includes("especialista") || sender.includes("tecnico") ? "specialist" : "customer",
    text: text(message.texto ?? message.text ?? message.mensaje ?? message.message, "Mensaje sin contenido."),
    time: text(message.hora ?? message.time ?? message.fecha ?? message.date ?? message.createdAt, "Ahora"),
  };
}

export function mapBackendChatToUiChat(chat: SpecialistChat, index: number): SpecialistChatItem {
  const customer = text(chat.cliente ?? chat.customer ?? chat.clientName, "Cliente no especificado");
  const messages = (chat.mensajes ?? chat.messages ?? []).map(mapMessage);
  const lastMessage = text(chat.ultimoMensaje ?? chat.lastMessage, messages.at(-1)?.text ?? "Sin mensajes recientes");

  return {
    id: text(chat.id ?? chat.chatId, `chat-${index}`),
    customer,
    initials: text(chat.iniciales ?? chat.initials, initialsFromName(customer)),
    service: text(chat.servicio ?? chat.service, "Servicio no especificado"),
    status: text(chat.estado ?? chat.status, "Disponible"),
    lastMessage,
    time: text(chat.hora ?? chat.time ?? chat.fecha ?? chat.date, "Fecha no disponible"),
    unread: numberValue(chat.noLeidos ?? chat.unread),
    messages,
  };
}

export function mapBackendChatDetailToUiChat(
  detail: SpecialistChatDetail,
  fallbackChat?: SpecialistChatItem,
): SpecialistChatItem {
  const mapped = mapBackendChatToUiChat(detail, 0);
  const messages = mapped.messages.length > 0 ? mapped.messages : fallbackChat?.messages ?? [];

  return {
    ...mapped,
    id: fallbackChat?.id ?? mapped.id,
    customer: mapped.customer === "Cliente no especificado" ? fallbackChat?.customer ?? mapped.customer : mapped.customer,
    initials: mapped.initials === "CL" ? fallbackChat?.initials ?? mapped.initials : mapped.initials,
    service: mapped.service === "Servicio no especificado" ? fallbackChat?.service ?? mapped.service : mapped.service,
    status: mapped.status,
    lastMessage: messages.at(-1)?.text ?? mapped.lastMessage,
    time: mapped.time === "Fecha no disponible" ? fallbackChat?.time ?? mapped.time : mapped.time,
    unread: mapped.unread,
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
    relatedTo: text(relatedTo, "Sin relacion asociada"),
    url: typeof file.url === "string" ? file.url : undefined,
  };
}

export function useSpecialistChatFilesData(initialChatId = ""): {
  chats: SpecialistChatItem[];
  activeChat: SpecialistChatItem | undefined;
  files: SpecialistFileItem[];
  loading: boolean;
  error: string | null;
  selectedChatId: string;
  setSelectedChatId: Dispatch<SetStateAction<string>>;
} {
  const [chats, setChats] = useState<SpecialistChatItem[]>(specialistChats);
  const [activeChat, setActiveChat] = useState<SpecialistChatItem | undefined>(specialistChats[0]);
  const [files, setFiles] = useState<SpecialistFileItem[]>(specialistFiles);
  const [selectedChatId, setSelectedChatId] = useState(initialChatId);
  const [auth, setAuth] = useState<{ token: string; userId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadChatFilesData() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const [chatsResponse, filesResponse] = await Promise.all([
          getSpecialistChats(login.accessToken, login.userId),
          getSpecialistFiles(login.accessToken, login.userId),
        ]);

        if (!isMounted) {
          return;
        }

        const backendChats = normalizeList(chatsResponse);
        const backendFiles = normalizeList(filesResponse);
        const uiChats = backendChats.length > 0 ? backendChats.map(mapBackendChatToUiChat) : specialistChats;
        const nextSelectedChatId = initialChatId || uiChats[0]?.id || "";

        setAuth({ token: login.accessToken, userId: login.userId });
        setChats(uiChats);
        setSelectedChatId(nextSelectedChatId);
        setActiveChat(uiChats.find((chat) => chat.id === nextSelectedChatId) ?? uiChats[0]);
        setFiles(backendFiles.length > 0 ? backendFiles.map(mapBackendFileToUiFile) : specialistFiles);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar chat y archivos");
        setChats(specialistChats);
        setSelectedChatId((current) => current || specialistChats[0]?.id || "");
        setActiveChat(specialistChats.find((chat) => chat.id === initialChatId) ?? specialistChats[0]);
        setFiles(specialistFiles);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadChatFilesData();

    return () => {
      isMounted = false;
    };
  }, [initialChatId]);

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
        const detail = await getSpecialistChatById(auth.token, auth.userId, selectedChatId);

        if (!isMounted) {
          return;
        }

        setActiveChat(mapBackendChatDetailToUiChat(detail, fallbackChat));
      } catch {
        if (isMounted) {
          setActiveChat(fallbackChat);
        }
      }
    }

    loadSelectedChatDetail();

    return () => {
      isMounted = false;
    };
  }, [auth, chats, selectedChatId]);

  return useMemo(
    () => ({ chats, activeChat, files, loading, error, selectedChatId, setSelectedChatId }),
    [chats, activeChat, files, loading, error, selectedChatId],
  );
}
