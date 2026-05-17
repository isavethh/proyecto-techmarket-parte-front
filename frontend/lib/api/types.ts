// ─── Perfil y direcciones ─────────────────────────────────────────────────────

export type ApiClientProfile = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  avatar: string;
};

export type ApiAddress = {
  id: string;
  titulo: string;
  pais: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  esPredeterminada: boolean;
};

// ─── Marketplace ──────────────────────────────────────────────────────────────

export type ApiProduct = {
  id: string;
  nombre: string;
  precio: number;
  imagenPrincipal: string;
  calificacion: number;
};

export type ApiProductDetail = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
  empresa: { id: string; nombre: string };
  stock: number;
};

export type ApiCategory = {
  id: string;
  nombre: string;
  subcategorias: Array<{ id: string; nombre: string }>;
};

export type ApiCompany = {
  id: string;
  nombre: string;
  logo: string;
  calificacion: number;
};

export type ApiCompanyDetail = {
  id: string;
  nombre: string;
  descripcion: string;
  fechaRegistro: string;
  ventasCompletadas: number;
};

export type ApiProductsResponse = {
  total: number;
  pagina: number;
  productos: ApiProduct[];
};

// ─── Carrito y órdenes ────────────────────────────────────────────────────────

export type ApiCartItem = {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
};

export type ApiCart = {
  id: string;
  subtotal: number;
  items: ApiCartItem[];
};

export type ApiOrder = {
  id: string;
  fechaCreacion: string;
  estado: string;
  total: number;
};

export type ApiOrderDetail = {
  id: string;
  estado: string;
  total: number;
  items: Array<{ productoId: string; cantidad: number }>;
  tracking: { codigo: string; empresa: string };
};

// ─── Reseñas ──────────────────────────────────────────────────────────────────

export type ApiReview = {
  id: string;
  cliente: { nombre: string; avatar: string };
  calificacion: number;
  comentario: string;
  fecha: string;
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type ApiChat = {
  id: string;
  empresa: { nombre: string };
  ultimoMensaje: string;
  mensajesSinLeer: number;
};

export type ApiMessage = {
  id: string;
  remitente: "cliente" | "empresa";
  contenido: string;
  fecha: string;
};

// ─── Favoritos y comunidades ──────────────────────────────────────────────────

export type ApiFavoriteProduct = ApiProduct;

export type ApiFavoriteCompany = ApiCompany;

export type ApiCommunity = {
  id: string;
  nombre: string;
  miembros: number;
};

export type ApiCommunityPost = {
  id: string;
  autor: string;
  contenido: string;
};

// ─── Notificaciones ───────────────────────────────────────────────────────────

export type ApiNotification = {
  id: string;
  titulo: string;
  leido: boolean;
  enlace: string;
};
