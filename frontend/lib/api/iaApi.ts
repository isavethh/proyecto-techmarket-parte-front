type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  description?: string;
};

const IA_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_IA_URL ?? "http://localhost:8092";

export type GlobalSearchItem = {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  url: string;
};

export type GlobalSearchResponse = {
  total: number;
  resultados: GlobalSearchItem[];
};

export type SearchSuggestion = {
  texto: string;
  tipo: string;
};

export type SearchTrending = {
  texto: string;
  busquedas: number;
};

export type SearchHistoryItem = {
  id: string;
  query: string;
  fecha: string;
};

export type ConversationSummary = {
  id: string;
  titulo: string;
  ultimoMensaje: string;
  mensajesSinLeer: number;
};

export type ConversationMessage = {
  id: string;
  remitenteId: string;
  contenido: string;
  fecha: string;
};

export type CreateConversationPayload = {
  participanteId: string;
  tipo: string;
  mensajeInicial: string;
};

export type CreateConversationResponse = {
  id: string;
  estado: string;
};

export type CreateMessageResponse = {
  id: string;
  contenido: string;
  estado: string;
};

export type MessageResponse = {
  mensaje: string;
};

export type ClientProfile = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  avatar: string | null;
};

export type UpdateClientProfilePayload = Partial<{
  nombre: string;
  apellido: string;
  telefono: string;
  avatar: string;
}>;

export type ClientAddress = {
  id: string;
  titulo: string;
  pais: string;
  ciudad: string;
  direccion: string;
  referencia: string | null;
  esPredeterminada: boolean;
};

export type UpsertClientAddressPayload = Partial<{
  titulo: string;
  pais: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  esPredeterminada: boolean;
}>;

export type MarketplaceProductSummary = {
  id: string;
  nombre: string;
  precio: number | null;
  imagenPrincipal: string | null;
  calificacion: number | null;
};

export type MarketplaceProductPage = {
  total: number;
  pagina: number;
  productos: MarketplaceProductSummary[];
};

export type MarketplaceProductDetail = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  imagenes: string[];
  empresa: MarketplaceCompanySummary | null;
  stock: number | null;
};

export type MarketplaceCategoryNode = {
  id: string;
  nombre: string;
  subcategorias: MarketplaceCategoryNode[];
};

export type MarketplaceCompanySummary = {
  id: string;
  nombre: string;
  logo: string | null;
  calificacion: number | null;
};

export type MarketplaceCompanyDetail = {
  id: string;
  nombre: string;
  descripcion: string | null;
  fechaRegistro: string | null;
  ventasCompletadas: number | null;
};

export type ProductReview = {
  id: string;
  cliente: {
    nombre: string;
    avatar: string | null;
  };
  calificacion: number | null;
  comentario: string | null;
  fecha: string | null;
};

export type UpsertReviewPayload = {
  calificacion: number;
  comentario: string;
};

export type CreateReviewResponse = {
  id: string;
  mensaje: string;
};

export type ReviewResponse = {
  id: string;
  calificacion: number | null;
  comentario: string | null;
  fecha: string | null;
};

export type ClientChatSummary = {
  id: string;
  empresa: {
    nombre: string | null;
  };
  ultimoMensaje: string | null;
  mensajesSinLeer: number;
};

export type CreateClientChatPayload = {
  empresaId: string;
  asunto: string;
};

export type CreateClientChatResponse = {
  chatId: string;
  estado: string;
};

export type ClientChatMessage = {
  id: string;
  remitente: "cliente" | "empresa" | string;
  contenido: string;
  fecha: string;
};

export type ClientCommunity = {
  id: string;
  nombre: string;
  miembros: number;
};

export type ClientCommunityPost = {
  id: string;
  autor: string;
  contenido: string;
};

export type ClientNotification = {
  id: string;
  titulo: string;
  leido: boolean;
  enlace: string | null;
};

function buildUrl(path: string): string {
  return new URL(path, IA_BASE_URL).toString();
}

function normalizeUserId(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const toLocalUuid = (rawValue: string): string | null => {
    const normalized = rawValue.trim();
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidPattern.test(normalized)) {
      return normalized;
    }

    if (/^\d+$/.test(normalized)) {
      return `00000000-0000-0000-0000-${normalized.padStart(12, "0").slice(-12)}`;
    }

    return null;
  };

  if (typeof value === "number") {
    return toLocalUuid(String(value));
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.toUpperCase().startsWith("USR-")) {
    return toLocalUuid(trimmed.slice(4));
  }

  return toLocalUuid(trimmed);
}

export function readCurrentUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem("user");
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as Record<string, unknown> | null;
    const candidate = parsed?.id ?? parsed?.userId ?? parsed?.usuarioId ?? null;
    return normalizeUserId(candidate);
  } catch {
    return null;
  }
}

function buildHeaders(existing: HeadersInit | undefined, hasBody: boolean): Headers {
  const headers = new Headers(existing);

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const userId = readCurrentUserId();
  if (userId && !headers.has("X-User-Id")) {
    headers.set("X-User-Id", userId);
  }

  if (typeof window !== "undefined" && !headers.has("Authorization")) {
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<unknown>;
  }

  const textBody = await response.text();
  return textBody ? textBody : null;
}

function resolveErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body.trim()) {
    return body;
  }

  if (body && typeof body === "object") {
    const candidate = body as ApiErrorBody;

    if (candidate.message) {
      return candidate.message;
    }

    if (candidate.error) {
      return candidate.error;
    }

    if (candidate.detail) {
      return candidate.detail;
    }

    if (candidate.description) {
      return candidate.description;
    }
  }

  return fallback;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const hasBody = Boolean(options?.body);
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: buildHeaders(options?.headers, hasBody),
  });

  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    const fallbackMessage =
      response.status === 401 || response.status === 403
        ? "No autorizado. Inicia sesion nuevamente para usar esta seccion."
        : `Error de solicitud (${response.status})`;

    throw new Error(resolveErrorMessage(responseBody, fallbackMessage));
  }

  return responseBody as T;
}

export async function searchGlobal(query: string): Promise<GlobalSearchResponse> {
  const params = new URLSearchParams();
  const normalized = query.trim();
  if (normalized) {
    params.set("q", normalized);
  }

  const path = params.toString() ? `/api/search/global?${params}` : "/api/search/global";
  return request<GlobalSearchResponse>(path, { method: "GET" });
}

export async function searchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const params = new URLSearchParams();
  const normalized = query.trim();
  if (normalized) {
    params.set("q", normalized);
  }

  const path = params.toString() ? `/api/search/suggestions?${params}` : "/api/search/suggestions";
  return request<SearchSuggestion[]>(path, { method: "GET" });
}

export async function searchTrending(): Promise<SearchTrending[]> {
  return request<SearchTrending[]>("/api/search/trending", { method: "GET" });
}

export async function listSearchHistory(): Promise<SearchHistoryItem[]> {
  return request<SearchHistoryItem[]>("/api/search/history", { method: "GET" });
}

export async function createSearchHistory(payload: {
  query: string;
  tipo: string;
}): Promise<{ id: string; mensaje: string }> {
  return request<{ id: string; mensaje: string }>("/api/search/history", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteSearchHistory(historyId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/search/history/${historyId}`, {
    method: "DELETE",
  });
}

export async function listConversations(): Promise<ConversationSummary[]> {
  return request<ConversationSummary[]>("/api/conversations", { method: "GET" });
}

export async function createConversation(
  payload: CreateConversationPayload,
): Promise<CreateConversationResponse> {
  return request<CreateConversationResponse>("/api/conversations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getConversationMessages(
  conversationId: string,
): Promise<ConversationMessage[]> {
  return request<ConversationMessage[]>(`/api/conversations/${conversationId}/messages`, {
    method: "GET",
  });
}

export async function createConversationMessage(
  conversationId: string,
  contenido: string,
): Promise<CreateMessageResponse> {
  return request<CreateMessageResponse>(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ contenido }),
  });
}

export async function markConversationRead(conversationId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/conversations/${conversationId}/read`, {
    method: "PUT",
  });
}

export async function deleteConversationMessage(messageId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/messages/${messageId}`, {
    method: "DELETE",
  });
}

export async function getClientProfile(): Promise<ClientProfile> {
  return request<ClientProfile>("/api/clients/profile", { method: "GET" });
}

export async function updateClientProfile(
  payload: UpdateClientProfilePayload,
): Promise<ClientProfile> {
  return request<ClientProfile>("/api/clients/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function listClientAddresses(): Promise<ClientAddress[]> {
  return request<ClientAddress[]>("/api/clients/addresses", { method: "GET" });
}

export async function createClientAddress(
  payload: UpsertClientAddressPayload,
): Promise<ClientAddress> {
  return request<ClientAddress>("/api/clients/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateClientAddress(
  addressId: string,
  payload: UpsertClientAddressPayload,
): Promise<ClientAddress> {
  return request<ClientAddress>(`/api/clients/addresses/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteClientAddress(addressId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/addresses/${addressId}`, {
    method: "DELETE",
  });
}

export async function setDefaultClientAddress(addressId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/addresses/${addressId}/default`, {
    method: "PUT",
  });
}

export async function listMarketplaceProducts(params?: {
  search?: string;
  category?: string;
  pagina?: number;
}): Promise<MarketplaceProductPage> {
  const query = new URLSearchParams();
  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params?.category?.trim() && params.category !== "Todos") {
    query.set("category", params.category.trim());
  }
  if (params?.pagina) {
    query.set("pagina", String(params.pagina));
  }

  const path = query.toString() ? `/api/marketplace/products?${query}` : "/api/marketplace/products";
  return request<MarketplaceProductPage>(path, { method: "GET" });
}

export async function getMarketplaceProduct(
  productId: string,
): Promise<MarketplaceProductDetail> {
  return request<MarketplaceProductDetail>(`/api/marketplace/products/${productId}`, {
    method: "GET",
  });
}

export async function listMarketplaceCategories(): Promise<MarketplaceCategoryNode[]> {
  return request<MarketplaceCategoryNode[]>("/api/marketplace/categories", { method: "GET" });
}

export async function listMarketplaceCategoryProducts(
  categoryId: string,
  pagina = 1,
): Promise<MarketplaceProductPage> {
  return request<MarketplaceProductPage>(
    `/api/marketplace/categories/${categoryId}/products?pagina=${pagina}`,
    { method: "GET" },
  );
}

export async function listMarketplaceCompanies(): Promise<MarketplaceCompanySummary[]> {
  return request<MarketplaceCompanySummary[]>("/api/marketplace/companies", { method: "GET" });
}

export async function getMarketplaceCompany(
  companyId: string,
): Promise<MarketplaceCompanyDetail> {
  return request<MarketplaceCompanyDetail>(`/api/marketplace/companies/${companyId}`, {
    method: "GET",
  });
}

export async function listMarketplaceCompanyProducts(
  companyId: string,
  pagina = 1,
): Promise<MarketplaceProductPage> {
  return request<MarketplaceProductPage>(
    `/api/marketplace/companies/${companyId}/products?pagina=${pagina}`,
    { method: "GET" },
  );
}

export async function createProductReview(
  productId: string,
  payload: UpsertReviewPayload,
): Promise<CreateReviewResponse> {
  return request<CreateReviewResponse>(`/api/clients/reviews/products/${productId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateClientReview(
  reviewId: string,
  payload: UpsertReviewPayload,
): Promise<ReviewResponse> {
  return request<ReviewResponse>(`/api/clients/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteClientReview(reviewId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

export async function createCompanyReview(
  companyId: string,
  payload: UpsertReviewPayload,
): Promise<CreateReviewResponse> {
  return request<CreateReviewResponse>(`/api/clients/reviews/companies/${companyId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listProductReviews(productId: string): Promise<ProductReview[]> {
  return request<ProductReview[]>(`/api/marketplace/products/${productId}/reviews`, {
    method: "GET",
  });
}

export async function listClientChats(): Promise<ClientChatSummary[]> {
  return request<ClientChatSummary[]>("/api/clients/chats", { method: "GET" });
}

export async function createClientChat(
  payload: CreateClientChatPayload,
): Promise<CreateClientChatResponse> {
  return request<CreateClientChatResponse>("/api/clients/chats", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getClientChatMessages(chatId: string): Promise<ClientChatMessage[]> {
  return request<ClientChatMessage[]>(`/api/clients/chats/${chatId}/messages`, {
    method: "GET",
  });
}

export async function createClientChatMessage(
  chatId: string,
  contenido: string,
): Promise<ClientChatMessage> {
  return request<ClientChatMessage>(`/api/clients/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ contenido }),
  });
}

export async function markClientChatRead(chatId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/chats/${chatId}/read`, { method: "PUT" });
}

export async function listFavoriteProducts(): Promise<MarketplaceProductSummary[]> {
  return request<MarketplaceProductSummary[]>("/api/clients/favorites/products", {
    method: "GET",
  });
}

export async function addFavoriteProduct(productId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/favorites/products/${productId}`, {
    method: "POST",
  });
}

export async function removeFavoriteProduct(productId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/favorites/products/${productId}`, {
    method: "DELETE",
  });
}

export async function listFavoriteCompanies(): Promise<MarketplaceCompanySummary[]> {
  return request<MarketplaceCompanySummary[]>("/api/clients/favorites/companies", {
    method: "GET",
  });
}

export async function followCompany(companyId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/favorites/companies/${companyId}`, {
    method: "POST",
  });
}

export async function unfollowCompany(companyId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/favorites/companies/${companyId}`, {
    method: "DELETE",
  });
}

export async function listClientCommunities(): Promise<ClientCommunity[]> {
  return request<ClientCommunity[]>("/api/clients/communities", { method: "GET" });
}

export async function joinClientCommunity(communityId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/communities/${communityId}/join`, {
    method: "POST",
  });
}

export async function leaveClientCommunity(communityId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/communities/${communityId}/leave`, {
    method: "DELETE",
  });
}

export async function listClientCommunityPosts(
  communityId: string,
): Promise<ClientCommunityPost[]> {
  return request<ClientCommunityPost[]>(`/api/clients/communities/${communityId}/posts`, {
    method: "GET",
  });
}

export async function listClientNotifications(): Promise<ClientNotification[]> {
  return request<ClientNotification[]>("/api/clients/notifications", { method: "GET" });
}

export async function markClientNotificationRead(
  notificationId: string,
): Promise<ClientNotification> {
  return request<ClientNotification>(`/api/clients/notifications/${notificationId}/read`, {
    method: "PUT",
  });
}

export async function markAllClientNotificationsRead(): Promise<MessageResponse> {
  return request<MessageResponse>("/api/clients/notifications/read-all", { method: "PUT" });
}

export async function deleteClientNotification(notificationId: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/api/clients/notifications/${notificationId}`, {
    method: "DELETE",
  });
}
