import { apiFetch } from "./index";
import type {
  ApiAddress,
  ApiCart,
  ApiChat,
  ApiClientProfile,
  ApiCommunity,
  ApiCommunityPost,
  ApiFavoriteCompany,
  ApiFavoriteProduct,
  ApiMessage,
  ApiNotification,
  ApiOrder,
  ApiOrderDetail,
} from "./types";

// ─── Perfil ───────────────────────────────────────────────────────────────────

export async function getClientProfile(): Promise<ApiClientProfile | null> {
  return apiFetch<ApiClientProfile>("/api/clients/profile");
}

export async function updateClientProfile(
  data: Partial<Pick<ApiClientProfile, "nombre" | "apellido" | "telefono" | "avatar">>,
): Promise<ApiClientProfile | null> {
  return apiFetch<ApiClientProfile>("/api/clients/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── Direcciones ──────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<ApiAddress[] | null> {
  return apiFetch<ApiAddress[]>("/api/clients/addresses");
}

export async function createAddress(
  data: Omit<ApiAddress, "id">,
): Promise<ApiAddress | null> {
  return apiFetch<ApiAddress>("/api/clients/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(
  addressId: string,
  data: Partial<Omit<ApiAddress, "id">>,
): Promise<ApiAddress | null> {
  return apiFetch<ApiAddress>(`/api/clients/addresses/${addressId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(addressId: string): Promise<void> {
  await apiFetch(`/api/clients/addresses/${addressId}`, { method: "DELETE" });
}

export async function setDefaultAddress(addressId: string): Promise<void> {
  await apiFetch(`/api/clients/addresses/${addressId}/default`, {
    method: "PUT",
  });
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

export async function getCart(): Promise<ApiCart | null> {
  return apiFetch<ApiCart>("/api/clients/cart");
}

export async function addToCart(
  productoId: string,
  cantidad: number,
): Promise<ApiCart | null> {
  return apiFetch<ApiCart>("/api/clients/cart/items", {
    method: "POST",
    body: JSON.stringify({ productoId, cantidad }),
  });
}

export async function updateCartItem(
  itemId: string,
  cantidad: number,
): Promise<ApiCart | null> {
  return apiFetch<ApiCart>(`/api/clients/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ cantidad }),
  });
}

export async function removeCartItem(itemId: string): Promise<ApiCart | null> {
  return apiFetch<ApiCart>(`/api/clients/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearCart(): Promise<void> {
  await apiFetch("/api/clients/cart", { method: "DELETE" });
}

export async function checkout(
  direccionEnvioId: string,
  metodoPago: string,
): Promise<{ ordenId: string; estado: string; total: number } | null> {
  return apiFetch("/api/clients/checkout", {
    method: "POST",
    body: JSON.stringify({ direccionEnvioId, metodoPago }),
  });
}

// ─── Órdenes ──────────────────────────────────────────────────────────────────

export async function getOrders(): Promise<ApiOrder[] | null> {
  return apiFetch<ApiOrder[]>("/api/clients/orders");
}

export async function getOrderById(
  orderId: string,
): Promise<ApiOrderDetail | null> {
  return apiFetch<ApiOrderDetail>(`/api/clients/orders/${orderId}`);
}

export async function cancelOrder(
  orderId: string,
  motivo: string,
): Promise<void> {
  await apiFetch(`/api/clients/orders/${orderId}/cancel`, {
    method: "PUT",
    body: JSON.stringify({ motivo }),
  });
}

// ─── Reseñas ──────────────────────────────────────────────────────────────────

export async function createProductReview(
  productId: string,
  calificacion: number,
  comentario: string,
): Promise<{ id: string; mensaje: string } | null> {
  return apiFetch(`/api/clients/reviews/products/${productId}`, {
    method: "POST",
    body: JSON.stringify({ calificacion, comentario }),
  });
}

export async function updateReview(
  reviewId: string,
  calificacion: number,
  comentario: string,
): Promise<void> {
  await apiFetch(`/api/clients/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({ calificacion, comentario }),
  });
}

export async function deleteReview(reviewId: string): Promise<void> {
  await apiFetch(`/api/clients/reviews/${reviewId}`, { method: "DELETE" });
}

export async function createCompanyReview(
  companyId: string,
  calificacion: number,
  comentario: string,
): Promise<{ id: string; mensaje: string } | null> {
  return apiFetch(`/api/clients/reviews/companies/${companyId}`, {
    method: "POST",
    body: JSON.stringify({ calificacion, comentario }),
  });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function getChats(): Promise<ApiChat[] | null> {
  return apiFetch<ApiChat[]>("/api/clients/chats");
}

export async function startChat(
  empresaId: string,
  asunto: string,
): Promise<{ chatId: string; estado: string } | null> {
  return apiFetch("/api/clients/chats", {
    method: "POST",
    body: JSON.stringify({ empresaId, asunto }),
  });
}

export async function getChatMessages(
  chatId: string,
): Promise<ApiMessage[] | null> {
  return apiFetch<ApiMessage[]>(`/api/clients/chats/${chatId}/messages`);
}

export async function sendMessage(
  chatId: string,
  contenido: string,
): Promise<ApiMessage | null> {
  return apiFetch<ApiMessage>(`/api/clients/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ contenido }),
  });
}

export async function markChatRead(chatId: string): Promise<void> {
  await apiFetch(`/api/clients/chats/${chatId}/read`, { method: "PUT" });
}

// ─── Favoritos ────────────────────────────────────────────────────────────────

export async function getFavoriteProducts(): Promise<
  ApiFavoriteProduct[] | null
> {
  return apiFetch<ApiFavoriteProduct[]>("/api/clients/favorites/products");
}

export async function addFavoriteProduct(productId: string): Promise<void> {
  await apiFetch(`/api/clients/favorites/products/${productId}`, {
    method: "POST",
  });
}

export async function removeFavoriteProduct(productId: string): Promise<void> {
  await apiFetch(`/api/clients/favorites/products/${productId}`, {
    method: "DELETE",
  });
}

export async function getFavoriteCompanies(): Promise<
  ApiFavoriteCompany[] | null
> {
  return apiFetch<ApiFavoriteCompany[]>("/api/clients/favorites/companies");
}

export async function followCompany(companyId: string): Promise<void> {
  await apiFetch(`/api/clients/favorites/companies/${companyId}`, {
    method: "POST",
  });
}

export async function unfollowCompany(companyId: string): Promise<void> {
  await apiFetch(`/api/clients/favorites/companies/${companyId}`, {
    method: "DELETE",
  });
}

// ─── Comunidades ──────────────────────────────────────────────────────────────

export async function getClientCommunities(): Promise<
  ApiCommunity[] | null
> {
  return apiFetch<ApiCommunity[]>("/api/clients/communities");
}

export async function joinCommunityApi(
  communityId: string,
): Promise<void> {
  await apiFetch(`/api/clients/communities/${communityId}/join`, {
    method: "POST",
  });
}

export async function leaveCommunityApi(
  communityId: string,
): Promise<void> {
  await apiFetch(`/api/clients/communities/${communityId}/leave`, {
    method: "DELETE",
  });
}

export async function getCommunityPosts(
  communityId: string,
): Promise<ApiCommunityPost[] | null> {
  return apiFetch<ApiCommunityPost[]>(
    `/api/clients/communities/${communityId}/posts`,
  );
}

// ─── Notificaciones ───────────────────────────────────────────────────────────

export async function getNotifications(): Promise<
  ApiNotification[] | null
> {
  return apiFetch<ApiNotification[]>("/api/clients/notifications");
}

export async function markNotificationRead(
  notificationId: string,
): Promise<void> {
  await apiFetch(`/api/clients/notifications/${notificationId}/read`, {
    method: "PUT",
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch("/api/clients/notifications/read-all", { method: "PUT" });
}

export async function deleteNotification(
  notificationId: string,
): Promise<void> {
  await apiFetch(`/api/clients/notifications/${notificationId}`, {
    method: "DELETE",
  });
}
