import { apiGet, apiPost, apiPut } from "@/lib/api/apiClient";
import type {
  Chat,
  CreateChatPayload,
  ChatMessage,
  SendMessagePayload,
} from "./types";

const BASE = "/api/ambassadors/chats";

export function getChats(): Promise<Chat[]> {
  return apiGet<Chat[]>(BASE);
}

export function createChat(data: CreateChatPayload): Promise<Chat> {
  return apiPost<Chat>(BASE, data);
}

export function getChatMessages(chatId: string): Promise<ChatMessage[]> {
  return apiGet<ChatMessage[]>(`${BASE}/${chatId}/messages`);
}

export function sendChatMessage(chatId: string, data: SendMessagePayload): Promise<ChatMessage> {
  return apiPost<ChatMessage>(`${BASE}/${chatId}/messages`, data);
}

export function markChatAsRead(chatId: string): Promise<void> {
  return apiPut<void>(`${BASE}/${chatId}/read`);
}
