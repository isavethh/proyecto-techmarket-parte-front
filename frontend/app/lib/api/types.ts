// ─── Marketplace ─────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string;
  calificacion: number;
}

export interface ApiProductDetail extends ApiProduct {
  descripcion: string;
  imagenes: string[];
  empresa: { id: string; nombre: string };
  stock: number;
}

export interface ApiProductsResponse {
  total: number;
  pagina: number;
  productos: ApiProduct[];
}

export interface ApiCategory {
  id: string;
  nombre: string;
  subcategorias?: Array<{ id: string; nombre: string }>;
}

export interface ApiCompany {
  id: string;
  nombre: string;
  logo: string;
  calificacion: number;
}

export interface ApiCompanyDetail {
  id: string;
  nombre: string;
  descripcion: string;
  fechaRegistro: string;
  ventasCompletadas: number;
}

export interface ApiReview {
  id: string;
  cliente: { nombre: string; avatar: string };
  calificacion: number;
  comentario: string;
  fecha: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export interface ApiClientProfile {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  avatar: string;
}

export interface ApiAddress {
  id: string;
  titulo: string;
  pais: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  esPredeterminada: boolean;
}

export interface ApiCartItem {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface ApiCart {
  id: string;
  subtotal: number;
  items: ApiCartItem[];
}

export interface ApiOrder {
  id: string;
  fechaCreacion: string;
  estado: string;
  total: number;
}

export interface ApiOrderDetail extends ApiOrder {
  items: Array<{ productoId: string; cantidad: number }>;
  tracking: { codigo: string; empresa: string };
}

export interface ApiChat {
  id: string;
  empresa: { nombre: string };
  ultimoMensaje: string;
  mensajesSinLeer: number;
}

export interface ApiMessage {
  id: string;
  remitente: string;
  contenido: string;
  fecha: string;
}

export interface ApiCommunity {
  id: string;
  nombre: string;
  miembros: number;
}

export interface ApiCommunityPost {
  id: string;
  autor: string;
  contenido: string;
}

export interface ApiNotification {
  id: string;
  titulo: string;
  leido: boolean;
  enlace: string;
}

export interface ApiFavoriteProduct {
  id: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string;
  calificacion: number;
}

export interface ApiFavoriteCompany {
  id: string;
  nombre: string;
  logo: string;
  calificacion: number;
}
