import { CommunityFeedPost, mergeCommunityFeedPosts } from "./communityFeed";

export type MarketplaceCategory =
  | "Todos"
  | "Laptops"
  | "Perifericos"
  | "Monitores"
  | "Componentes"
  | "Celulares"
  | "Accesorios"
  | "Otros";

export type MarketplaceCondition = "Nuevo" | "Seminuevo" | "Usado" | "Sin dato";

export type MarketplaceListing = {
  post: CommunityFeedPost;
  category: Exclude<MarketplaceCategory, "Todos"> | "Otros";
  condition: MarketplaceCondition;
  priceLabel: string;
};

export const marketplaceCategoryOptions: MarketplaceCategory[] = [
  "Todos",
  "Laptops",
  "Perifericos",
  "Monitores",
  "Componentes",
  "Celulares",
  "Accesorios",
  "Otros",
];

export const marketplaceSeedPosts: CommunityFeedPost[] = [
  {
    id: "market-seed-1",
    author: "Zona Gamer Store",
    role: "Tienda",
    time: "Hace 35 min",
    title: "Laptop Lenovo Legion 5 15ACH6",
    body: "Venta directa. 16GB RAM, RTX 3060, SSD 1TB. Bs 9.800 con entrega en Santa Cruz.",
    tag: "Producto",
    location: "Santa Cruz",
    image: "/productos/laptop-pro-14.jpg",
    createdAt: "2026-04-19T15:05:00.000Z",
  },
  {
    id: "market-seed-2",
    author: "Zona Gamer Store",
    role: "Tienda",
    time: "Hace 1 hora",
    title: "Teclado mecanico TKL red switch",
    body: "Nuevo sellado en oferta. Precio Bs 620. Stock limitado, envio nacional.",
    tag: "Oferta",
    location: "Santa Cruz",
    image: "/productos/teclado-tkl.jpg",
    createdAt: "2026-04-19T14:30:00.000Z",
  },
  {
    id: "market-seed-3",
    author: "TecnoCentro Andino",
    role: "Tienda",
    time: "Hace 2 horas",
    title: "Monitor ultrawide 34 pulgadas IPS",
    body: "Seminuevo en excelente estado. Bs 3.400, incluye base y cables.",
    tag: "Venta",
    location: "La Paz",
    image: "/productos/monitor-ultrawide-34.jpg",
    createdAt: "2026-04-19T13:10:00.000Z",
  },
  {
    id: "market-seed-4",
    author: "TecnoCentro Andino",
    role: "Tienda",
    time: "Hace 3 horas",
    title: "Mouse ergonomico Logitech Lift",
    body: "Producto nuevo con garantia local. Bs 430. Entrega hoy en La Paz.",
    tag: "Producto",
    location: "La Paz",
    image: "/productos/kit-limpieza-pc.jpg",
    createdAt: "2026-04-19T12:20:00.000Z",
  },
  {
    id: "market-seed-5",
    author: "Andres Cliente",
    role: "Usuario",
    time: "Hace 4 horas",
    title: "iPhone 13 128GB azul",
    body: "Usado cuidado, bateria 89%. Precio $530. Se entrega con funda y cargador.",
    tag: "Venta",
    location: "Cochabamba",
    createdAt: "2026-04-19T11:40:00.000Z",
  },
  {
    id: "market-seed-6",
    author: "Pixel Andino",
    role: "Tienda",
    time: "Hace 5 horas",
    title: "SSD NVMe 1TB Gen4",
    body: "Oferta flash por hoy: Bs 760. Producto nuevo con factura.",
    tag: "Oferta",
    location: "Cochabamba",
    createdAt: "2026-04-19T10:20:00.000Z",
  },
];

export const createMarketplaceSellerKey = (sellerName: string): string => {
  const normalized = sellerName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "vendedor";
};

const detectMarketplaceCategory = (post: CommunityFeedPost): Exclude<MarketplaceCategory, "Todos"> | "Otros" => {
  const normalizedText = `${post.title} ${post.body} ${post.tag}`.toLowerCase();

  if (normalizedText.includes("laptop") || normalizedText.includes("notebook")) {
    return "Laptops";
  }

  if (normalizedText.includes("teclado") || normalizedText.includes("mouse") || normalizedText.includes("headset")) {
    return "Perifericos";
  }

  if (normalizedText.includes("monitor") || normalizedText.includes("pantalla")) {
    return "Monitores";
  }

  if (
    normalizedText.includes("gpu") ||
    normalizedText.includes("ssd") ||
    normalizedText.includes("ram") ||
    normalizedText.includes("placa") ||
    normalizedText.includes("procesador")
  ) {
    return "Componentes";
  }

  if (normalizedText.includes("iphone") || normalizedText.includes("android") || normalizedText.includes("celular")) {
    return "Celulares";
  }

  if (normalizedText.includes("funda") || normalizedText.includes("cargador") || normalizedText.includes("cable")) {
    return "Accesorios";
  }

  return "Otros";
};

const detectMarketplaceCondition = (post: CommunityFeedPost): MarketplaceCondition => {
  const normalizedText = `${post.title} ${post.body}`.toLowerCase();

  if (normalizedText.includes("nuevo") || normalizedText.includes("sellado")) {
    return "Nuevo";
  }

  if (normalizedText.includes("seminuevo") || normalizedText.includes("semi nuevo")) {
    return "Seminuevo";
  }

  if (normalizedText.includes("usado")) {
    return "Usado";
  }

  return "Sin dato";
};

const extractPriceLabel = (post: CommunityFeedPost): string => {
  const sourceText = `${post.title} ${post.body}`;
  const currencyMatch = sourceText.match(/(bs\.?\s?[\d.,]+|\$\s?[\d.,]+)/i);

  if (currencyMatch) {
    return currencyMatch[1].replace(/\s+/g, " ").trim();
  }

  return "Precio por inbox";
};

const isProductSalePost = (post: CommunityFeedPost): boolean => {
  const normalizedTag = post.tag.toLowerCase();
  const normalizedText = `${post.title} ${post.body}`.toLowerCase();

  const hasServiceSignals =
    normalizedTag.includes("servicio") ||
    normalizedText.includes("servicio tecnico") ||
    normalizedText.includes("mantenimiento") ||
    normalizedText.includes("diagnostico");

  if (hasServiceSignals) {
    return false;
  }

  const hasProductSignals =
    normalizedTag.includes("producto") ||
    normalizedText.includes("laptop") ||
    normalizedText.includes("monitor") ||
    normalizedText.includes("teclado") ||
    normalizedText.includes("mouse") ||
    normalizedText.includes("iphone") ||
    normalizedText.includes("android") ||
    normalizedText.includes("ssd") ||
    normalizedText.includes("ram") ||
    normalizedText.includes("cargador");

  const hasSaleSignals =
    normalizedTag.includes("producto") ||
    normalizedTag.includes("venta") ||
    normalizedTag.includes("oferta") ||
    normalizedTag.includes("promoc") ||
    normalizedText.includes("vendo") ||
    normalizedText.includes("venta") ||
    normalizedText.includes("precio") ||
    normalizedText.includes("stock") ||
    normalizedText.includes("oferta") ||
    normalizedText.includes("entrega");

  return hasProductSignals && hasSaleSignals;
};

export const buildMarketplaceListings = (posts: CommunityFeedPost[]): MarketplaceListing[] => {
  return mergeCommunityFeedPosts(posts)
    .filter(isProductSalePost)
    .map((post) => ({
      post,
      category: detectMarketplaceCategory(post),
      condition: detectMarketplaceCondition(post),
      priceLabel: extractPriceLabel(post),
    }));
};
