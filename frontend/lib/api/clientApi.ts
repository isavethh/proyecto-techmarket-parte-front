import { getToken } from "@/lib/auth/tokenStore";
import type {
  ApiClientProfile,
  ApiAddress,
  ApiCart,
  ApiOrder,
  ApiOrderDetail,
  ApiChat,
  ApiMessage,
  ApiFavoriteProduct,
  ApiFavoriteCompany,
  ApiCommunity,
  ApiCommunityPost,
  ApiNotification,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path: string): string {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_URL no está configurada.");
  return new URL(path, API_BASE_URL).toString();
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json() as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch { /* ignore parse error */ }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ─── Perfil ───────────────────────────────────────────────────────────────────

export async function getClientProfile(): Promise<ApiClientProfile> {
  const res = await fetch(buildUrl("/api/clients/profile"), { headers: authHeaders() });
  return handleResponse<ApiClientProfile>(res);
}

export async function updateClientProfile(data: Partial<Omit<ApiClientProfile, "id" | "email">>): Promise<ApiClientProfile> {
  const res = await fetch(buildUrl("/api/clients/profile"), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ApiClientProfile>(res);
}

// ─── Direcciones ──────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<ApiAddress[]> {
  const res = await fetch(buildUrl("/api/clients/addresses"), { headers: authHeaders() });
  return handleResponse<ApiAddress[]>(res);
}

export async function createAddress(data: Omit<ApiAddress, "id">): Promise<ApiAddress> {
  const res = await fetch(buildUrl("/api/clients/addresses"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ApiAddress>(res);
}

export async function updateAddress(addressId: string, data: Partial<Omit<ApiAddress, "id">>): Promise<ApiAddress> {
  const res = await fetch(buildUrl(`/api/clients/addresses/${addressId}`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<ApiAddress>(res);
}

export async function deleteAddress(addressId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/addresses/${addressId}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function setDefaultAddress(addressId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/addresses/${addressId}/default`), {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

export async function getCart(): Promise<ApiCart> {
  const res = await fetch(buildUrl("/api/clients/cart"), { headers: authHeaders() });
  return handleResponse<ApiCart>(res);
}

export async function addToCart(productoId: string, cantidad: number): Promise<ApiCart> {
  const res = await fetch(buildUrl("/api/clients/cart/items"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ productoId, cantidad }),
  });
  return handleResponse<ApiCart>(res);
}

export async function updateCartItem(itemId: string, cantidad: number): Promise<ApiCart> {
  const res = await fetch(buildUrl(`/api/clients/cart/items/${itemId}`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ cantidad }),
  });
  return handleResponse<ApiCart>(res);
}

export async function removeCartItem(itemId: string): Promise<ApiCart> {
  const res = await fetch(buildUrl(`/api/clients/cart/items/${itemId}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<ApiCart>(res);
}

export async function clearCart(): Promise<void> {
  const res = await fetch(buildUrl("/api/clients/cart"), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

// ─── Checkout y órdenes ───────────────────────────────────────────────────────

export async function checkout(direccionEnvioId: string, metodoPago: string): Promise<{ ordenId: string; estado: string; total: number }> {
  const res = await fetch(buildUrl("/api/clients/checkout"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ direccionEnvioId, metodoPago }),
  });
  return handleResponse<{ ordenId: string; estado: string; total: number }>(res);
}

export async function getOrders(): Promise<ApiOrder[]> {
  const res = await fetch(buildUrl("/api/clients/orders"), { headers: authHeaders() });
  return handleResponse<ApiOrder[]>(res);
}

export async function getOrder(orderId: string): Promise<ApiOrderDetail> {
  const res = await fetch(buildUrl(`/api/clients/orders/${orderId}`), { headers: authHeaders() });
  return handleResponse<ApiOrderDetail>(res);
}

export async function cancelOrder(orderId: string, motivo: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/orders/${orderId}/cancel`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ motivo }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

// ─── Reseñas ──────────────────────────────────────────────────────────────────

export async function createProductReview(productId: string, calificacion: number, comentario: string): Promise<{ id: string; mensaje: string }> {
  const res = await fetch(buildUrl(`/api/clients/reviews/products/${productId}`), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ calificacion, comentario }),
  });
  return handleResponse<{ id: string; mensaje: string }>(res);
}

export async function updateReview(reviewId: string, calificacion: number, comentario: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/reviews/${reviewId}`), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ calificacion, comentario }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function deleteReview(reviewId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/reviews/${reviewId}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function createCompanyReview(companyId: string, calificacion: number, comentario: string): Promise<{ id: string; mensaje: string }> {
  const res = await fetch(buildUrl(`/api/clients/reviews/companies/${companyId}`), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ calificacion, comentario }),
  });
  return handleResponse<{ id: string; mensaje: string }>(res);
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function getChats(): Promise<ApiChat[]> {
  const res = await fetch(buildUrl("/api/clients/chats"), { headers: authHeaders() });
  return handleResponse<ApiChat[]>(res);
}

export async function startChat(empresaId: string, asunto: string): Promise<{ chatId: string; estado: string }> {
  const res = await fetch(buildUrl("/api/clients/chats"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ empresaId, asunto }),
  });
  return handleResponse<{ chatId: string; estado: string }>(res);
}

export async function getChatMessages(chatId: string): Promise<ApiMessage[]> {
  const res = await fetch(buildUrl(`/api/clients/chats/${chatId}/messages`), { headers: authHeaders() });
  return handleResponse<ApiMessage[]>(res);
}

export async function sendMessage(chatId: string, contenido: string): Promise<ApiMessage> {
  const res = await fetch(buildUrl(`/api/clients/chats/${chatId}/messages`), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ contenido }),
  });
  return handleResponse<ApiMessage>(res);
}

export async function markChatRead(chatId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/chats/${chatId}/read`), {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

// ─── Favoritos ────────────────────────────────────────────────────────────────

export async function getFavoriteProducts(): Promise<ApiFavoriteProduct[]> {
  const res = await fetch(buildUrl("/api/clients/favorites/products"), { headers: authHeaders() });
  return handleResponse<ApiFavoriteProduct[]>(res);
}

export async function addFavoriteProduct(productId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/favorites/products/${productId}`), {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function removeFavoriteProduct(productId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/favorites/products/${productId}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function getFavoriteCompanies(): Promise<ApiFavoriteCompany[]> {
  const res = await fetch(buildUrl("/api/clients/favorites/companies"), { headers: authHeaders() });
  return handleResponse<ApiFavoriteCompany[]>(res);
}

export async function followCompany(companyId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/favorites/companies/${companyId}`), {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function unfollowCompany(companyId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/favorites/companies/${companyId}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

// ─── Comunidades ──────────────────────────────────────────────────────────────

export async function getClientCommunities(): Promise<ApiCommunity[]> {
  const res = await fetch(buildUrl("/api/clients/communities"), { headers: authHeaders() });
  return handleResponse<ApiCommunity[]>(res);
}

export async function joinCommunityApi(communityId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/communities/${communityId}/join`), {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function leaveCommunityApi(communityId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/communities/${communityId}/leave`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function getCommunityPosts(communityId: string): Promise<ApiCommunityPost[]> {
  const res = await fetch(buildUrl(`/api/clients/communities/${communityId}/posts`), { headers: authHeaders() });
  return handleResponse<ApiCommunityPost[]>(res);
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

export async function getNotifications(): Promise<ApiNotification[]> {
  const res = await fetch(buildUrl("/api/clients/notifications"), { headers: authHeaders() });
  return handleResponse<ApiNotification[]>(res);
}

export async function markNotificationRead(notificationId: string): Promise<ApiNotification> {
  const res = await fetch(buildUrl(`/api/clients/notifications/${notificationId}/read`), {
    method: "PUT",
    headers: authHeaders(),
  });
  return handleResponse<ApiNotification>(res);
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await fetch(buildUrl("/api/clients/notifications/read-all"), {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const res = await fetch(buildUrl(`/api/clients/notifications/${notificationId}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}
