"use client";

import { consultarEmpresaIa } from "@/lib/api/empresaAiApi";
import { fetchCompanyAnalytics, fetchCompanyReviews } from "../lib/companyApi";

export type ExecutiveMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  tone: "positive" | "neutral";
  href: string;
};

export type AlertItem = {
  id: string;
  title: string;
  detail: string;
  priority: "alta" | "media";
  href: string;
};

export type StrategicAction = {
  id: string;
  title: string;
  description: string;
  impact: string;
  href: string;
  cta: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type AiBusinessInsight = {
  summary: string;
  dataPoints: string[];
  advice: string;
  nextStep: string;
  actionPlan?: string[];
  watchItems?: string[];
  priority?: string;
  confidence?: string;
  focusLabel?: string;
  focusHref?: string;
};

export type CompanyProfileData = {
  businessData: {
    name: string;
    logo: string;
    slogan: string;
    specialization: string;
    rating: number;
    reviewCount: number;
    category: string;
    experienceYears: number;
    businessType: string;
  };
  description?: string;
  about?: string[];
  specialties: string[];
  coverageAreas: string[];
  contactChannels: Array<{ label: string; value: string }>;
  socialLinks: Array<{ label: string; href: string }>;
  schedules: Array<{ day: string; hours: string }>;
  branches: Array<{ name: string; address: string; phone: string; hours: string }>;
  locationOverview: {
    mainAddressShort: string;
    mainAddressLong: string;
    city: string;
    zone: string;
    reference: string;
    mapAreas: string[];
  };
};

export const aiThinkingStates = [
  "Analizando cambios de conversión y demanda reciente...",
  "Comparando publicaciones, leads y ritmo de respuesta...",
  "Preparando una recomendación accionable para hoy...",
];

const API_BASE_URL = (process.env.NEXT_PUBLIC_COMPANY_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const emptyProfile: CompanyProfileData = {
  businessData: {
    name: "",
    logo: "",
    slogan: "",
    specialization: "",
    rating: 0,
    reviewCount: 0,
    category: "",
    experienceYears: 0,
    businessType: "",
  },
  description: "",
  about: [],
  specialties: [],
  coverageAreas: [],
  contactChannels: [],
  socialLinks: [],
  schedules: [],
  branches: [],
  locationOverview: {
    mainAddressShort: "",
    mainAddressLong: "",
    city: "",
    zone: "",
    reference: "",
    mapAreas: [],
  },
};

// Perfil de demostración completo. Se usa para rellenar los campos que el backend deja
// vacíos, de modo que la presentación del negocio nunca se vea incompleta.
const demoCompanyProfile: CompanyProfileData = {
  businessData: {
    name: "Andes Tech Store",
    logo: "AT",
    slogan: "Tecnología confiable con stock local y soporte real.",
    specialization: "Venta y soporte de laptops, componentes y periféricos",
    rating: 4.4,
    reviewCount: 12,
    category: "Retail",
    experienceYears: 6,
    businessType: "Tienda de tecnología",
  },
  description:
    "Laptops, componentes y periféricos con stock local. Asesoramos en la compra, " +
    "armamos equipos a medida y damos soporte técnico postventa para clientes y empresas.",
  about: [
    "Somos una tienda de tecnología con atención local y a domicilio.",
    "Trabajamos con marcas oficiales y ofrecemos garantía en todos nuestros equipos.",
    "Damos soporte postventa por chat y agendamos visitas técnicas para empresas.",
  ],
  specialties: [
    "Laptops y equipos de escritorio",
    "Componentes y armado a medida",
    "Periféricos y accesorios",
    "Mantenimiento y soporte técnico",
    "Soluciones para empresas",
  ],
  coverageAreas: [
    "La Paz - Centro",
    "La Paz - Sur",
    "El Alto",
    "Entrega a domicilio",
    "Atención remota",
  ],
  contactChannels: [
    { label: "Teléfono", value: "+591 2 244 1234" },
    { label: "WhatsApp", value: "+591 700 12345" },
    { label: "Correo", value: "ventas@andestechstore.bo" },
    { label: "Sitio web", value: "www.andestechstore.bo" },
  ],
  socialLinks: [
    { label: "Facebook", href: "https://facebook.com/andestechstore" },
    { label: "Instagram", href: "https://instagram.com/andestechstore" },
    { label: "TikTok", href: "https://tiktok.com/@andestechstore" },
  ],
  schedules: [
    { day: "Lunes a Viernes", hours: "09:00 - 19:00" },
    { day: "Sábado", hours: "09:00 - 14:00" },
    { day: "Domingo", hours: "Cerrado" },
  ],
  branches: [
    {
      name: "Sucursal Central",
      address: "Av. 16 de Julio #1234, El Prado",
      phone: "+591 2 244 1234",
      hours: "Lun-Vie 09:00-19:00",
    },
    {
      name: "Sucursal Sur",
      address: "Av. Ballivián #890, Calacoto",
      phone: "+591 2 277 5678",
      hours: "Lun-Sab 10:00-18:00",
    },
  ],
  locationOverview: {
    mainAddressShort: "Av. 16 de Julio #1234",
    mainAddressLong: "Av. 16 de Julio #1234, El Prado, La Paz, Bolivia",
    city: "La Paz",
    zone: "El Prado / Centro",
    reference: "Frente a la plaza del estudiante, edificio Torre Andes, planta baja.",
    mapAreas: ["Centro", "Sur", "El Alto", "Zona Norte"],
  },
};

/** Devuelve el primer texto no vacío. */
const pickText = (...values: string[]) => values.find((value) => value && value.trim().length > 0) ?? "";

/** Devuelve el primer número distinto de cero. */
const pickNumber = (...values: number[]) => values.find((value) => typeof value === "number" && value > 0) ?? 0;

/** Devuelve el primer arreglo con elementos. */
const pickList = <T>(...values: T[][]) => values.find((value) => Array.isArray(value) && value.length > 0) ?? [];

/**
 * Combina el perfil real del backend con el perfil de demostración: conserva todo lo que
 * el backend envía y rellena únicamente los campos que llegan vacíos.
 */
function withProfileFallback(profile: CompanyProfileData): CompanyProfileData {
  const demo = demoCompanyProfile;
  return {
    businessData: {
      name: pickText(profile.businessData.name, demo.businessData.name),
      logo: pickText(profile.businessData.logo, demo.businessData.logo),
      slogan: pickText(profile.businessData.slogan, demo.businessData.slogan),
      specialization: pickText(profile.businessData.specialization, demo.businessData.specialization),
      rating: pickNumber(profile.businessData.rating, demo.businessData.rating),
      reviewCount: pickNumber(profile.businessData.reviewCount, demo.businessData.reviewCount),
      category: pickText(profile.businessData.category, demo.businessData.category),
      experienceYears: pickNumber(profile.businessData.experienceYears, demo.businessData.experienceYears),
      businessType: pickText(profile.businessData.businessType, demo.businessData.businessType),
    },
    description: pickText(profile.description ?? "", demo.description ?? ""),
    about: pickList(profile.about ?? [], demo.about ?? []),
    specialties: pickList(profile.specialties, demo.specialties),
    coverageAreas: pickList(profile.coverageAreas, demo.coverageAreas),
    contactChannels: pickList(profile.contactChannels, demo.contactChannels),
    socialLinks: pickList(profile.socialLinks, demo.socialLinks),
    schedules: pickList(profile.schedules, demo.schedules),
    branches: pickList(profile.branches, demo.branches),
    locationOverview: {
      mainAddressShort: pickText(profile.locationOverview.mainAddressShort, demo.locationOverview.mainAddressShort),
      mainAddressLong: pickText(profile.locationOverview.mainAddressLong, demo.locationOverview.mainAddressLong),
      city: pickText(profile.locationOverview.city, demo.locationOverview.city),
      zone: pickText(profile.locationOverview.zone, demo.locationOverview.zone),
      reference: pickText(profile.locationOverview.reference, demo.locationOverview.reference),
      mapAreas: pickList(profile.locationOverview.mapAreas, demo.locationOverview.mapAreas),
    },
  };
}

const emptyAiInsight: AiBusinessInsight = {
  summary: "No hay datos para mostrar",
  dataPoints: [],
  advice: "",
  nextStep: "",
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

function apiUrl(path: string) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function companyContextHeaders() {
  const envCompanyId = process.env.NEXT_PUBLIC_COMPANY_ID ?? process.env.NEXT_PUBLIC_TENANT_ID ?? "";
  const storedCompanyId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("techmarket.companyId") ?? window.localStorage.getItem("techmarket.tenantId") ?? ""
      : "";
  const companyId = envCompanyId || storedCompanyId;

  return companyId ? { "X-Tenant-Id": companyId } : {};
}

function getAuthorizationHeader(): { Authorization: string } | Record<string, never> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function requestEmpresa<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);

  if (!(options?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  Object.entries({ ...companyContextHeaders(), ...getAuthorizationHeader() }).forEach(([key, value]) => {
    headers.set(key, value);
  });

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error ${options?.method ?? "GET"} ${path}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function normalizeProfile(payload: unknown): CompanyProfileData {
  const source = asRecord(payload);
  const settings = asRecord(source.settings);
  const primaryAddress = asRecord((source.addresses as unknown[])?.[0]);
  const location = asRecord(source.locationOverview || settings.locationOverview);
  const contacts = Array.isArray(source.contacts) ? source.contacts.map(asRecord) : [];

  return {
    businessData: {
      name: asString(source.name),
      logo: asString(source.logoText, asString(settings.logoText, asString(source.logoUrl))),
      slogan: asString(source.slogan),
      specialization: asString(source.specialization),
      rating: asNumber(source.rating, asNumber(settings.rating)),
      reviewCount: asNumber(source.reviewCount, asNumber(settings.reviewCount)),
      category: asString(source.category),
      experienceYears: asNumber(source.experienceYears, asNumber(settings.experienceYears)),
      businessType: asString(source.businessType),
    },
    description: asString(source.description, asString(settings.description)),
    about: Array.isArray(source.about) ? source.about as string[] : Array.isArray(settings.about) ? settings.about as string[] : [],
    specialties: Array.isArray(source.specialties) ? source.specialties as string[] : Array.isArray(settings.specialties) ? settings.specialties as string[] : [],
    coverageAreas: Array.isArray(source.coverageAreas) ? source.coverageAreas as string[] : Array.isArray(settings.coverageAreas) ? settings.coverageAreas as string[] : [],
    contactChannels: contacts.map((item) => ({
      label: asString(item.label),
      value: asString(item.value),
    })),
    socialLinks: Array.isArray(source.socialLinks) ? source.socialLinks as CompanyProfileData["socialLinks"] : [],
    schedules: Array.isArray(source.schedules) ? source.schedules as CompanyProfileData["schedules"] : [],
    branches: Array.isArray(source.branches) ? source.branches as CompanyProfileData["branches"] : [],
    locationOverview: {
      mainAddressShort: asString(location.mainAddressShort, asString(primaryAddress.short)),
      mainAddressLong: asString(location.mainAddressLong, asString(primaryAddress.full)),
      city: asString(location.city, asString(primaryAddress.city)),
      zone: asString(location.zone, asString(primaryAddress.zone)),
      reference: asString(location.reference, asString(primaryAddress.reference)),
      mapAreas: Array.isArray(location.mapAreas) ? location.mapAreas as string[] : [],
    },
  };
}

function normalizeSurveyOptions(options: unknown) {
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      if (typeof option === "string") return option;
      const record = asRecord(option);
      return asString(record.text, asString(record.label));
    })
    .filter(Boolean);
}

export async function fetchCompanyProfile() {
  try {
    return withProfileFallback(normalizeProfile(await requestEmpresa("/api/empresa/perfil")));
  } catch {
    return demoCompanyProfile;
  }
}

export async function updateCompanyProfile(profile: CompanyProfileData) {
  const payload = {
    name: profile.businessData.name,
    logoUrl: "",
    slogan: profile.businessData.slogan,
    specialization: profile.businessData.specialization,
    category: profile.businessData.category,
    businessType: profile.businessData.businessType,
    description: profile.description ?? "",
    about: profile.about ?? [],
    addresses: [{
      short: profile.locationOverview.mainAddressShort,
      full: profile.locationOverview.mainAddressLong,
      city: profile.locationOverview.city,
      zone: profile.locationOverview.zone,
      reference: profile.locationOverview.reference,
    }],
    contacts: profile.contactChannels,
    socialLinks: profile.socialLinks,
    schedules: profile.schedules,
    branches: profile.branches,
    settings: {
      logoText: profile.businessData.logo,
      rating: profile.businessData.rating,
      reviewCount: profile.businessData.reviewCount,
      experienceYears: profile.businessData.experienceYears,
      specialties: profile.specialties,
      coverageAreas: profile.coverageAreas,
      locationOverview: profile.locationOverview,
    },
  };

  return requestEmpresa("/api/empresa/perfil", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function fetchCompanySummary() {
  try {
    return await requestEmpresa("/api/empresa/resumen");
  } catch {
    return {
      id: "",
      metrics: [],
      alerts: [],
      recentActivity: [],
      radar: [],
      recommendedActions: [],
      ai: { recommendedQuestions: [] },
    };
  }
}

/**
 * Reúne TODA la información real disponible del negocio (perfil, métricas, alertas,
 * publicaciones, reseñas y analíticas) en un único objeto de contexto. Cuanta más
 * información se entregue a la IA, más exactas y específicas son sus recomendaciones.
 */
export async function buildCompanyAiContext(): Promise<Record<string, unknown>> {
  const [profile, summaryRaw, publications, reviewsRaw, analyticsRaw] = await Promise.all([
    fetchCompanyProfile().catch(() => emptyProfile),
    fetchCompanySummary().catch(() => null),
    fetchCompanyPublications().catch(() => null),
    fetchCompanyReviews().catch(() => []),
    fetchCompanyAnalytics().catch(() => null),
  ]);

  const summary = asRecord(summaryRaw);
  const analytics = asRecord(analyticsRaw);
  const pubs = asRecord(publications);
  const reviews = Array.isArray(reviewsRaw) ? reviewsRaw.map(asRecord) : [];

  const arr = (value: unknown): Record<string, unknown>[] =>
    Array.isArray(value) ? value.map(asRecord) : [];

  const products = arr(pubs.products);
  const services = arr(pubs.services);
  const offers = arr(pubs.offers);
  const surveys = arr(pubs.surveys);
  const posts = arr(pubs.posts);
  const textPosts = arr(pubs.textPosts);
  const interactingUsers = arr(pubs.users);

  const metrics = arr(summary.metrics);
  const alerts = arr(summary.alerts);
  const recentActivity = arr(summary.recentActivity);
  const radar = arr(summary.radar);
  const recommendedActions = arr(summary.recommendedActions);

  const publicationMetrics = arr(analytics.publicationMetrics);
  const ratingLevels = arr(analytics.ratingLevels);
  const userComments = arr(analytics.userComments);
  const growthSeries = arr(analytics.growthSeries);

  // --- Estadísticas derivadas de reseñas (para que la IA razone con números reales) ---
  const reviewStars = reviews
    .map((review) => asNumber(review.stars))
    .filter((stars) => stars > 0);
  const avgReviewStars = reviewStars.length
    ? Number((reviewStars.reduce((total, stars) => total + stars, 0) / reviewStars.length).toFixed(2))
    : 0;
  const pendingFollowUps = reviews.filter((review) => review.needsFollowUp === true).length;
  const unanswered = reviews.filter((review) => review.wasResponded !== true).length;
  const responseRate = reviews.length
    ? Math.round(((reviews.length - unanswered) / reviews.length) * 100)
    : 0;

  const business = profile.businessData;

  // --- Resumen ejecutivo en texto plano: garantiza una lectura clara para el modelo ---
  const digestLines = [
    `Empresa: ${business.name || "(sin nombre)"}${business.slogan ? ` — "${business.slogan}"` : ""}.`,
    business.category || business.businessType
      ? `Rubro: ${[business.category, business.businessType].filter(Boolean).join(" / ")}.`
      : "",
    business.specialization ? `Especialización: ${business.specialization}.` : "",
    business.experienceYears ? `Años de experiencia: ${business.experienceYears}.` : "",
    `Calificación: ${business.rating || avgReviewStars || 0}/5 sobre ${business.reviewCount || reviews.length} reseñas.`,
    profile.specialties.length ? `Especialidades: ${profile.specialties.join(", ")}.` : "",
    profile.coverageAreas.length ? `Zonas de cobertura: ${profile.coverageAreas.join(", ")}.` : "",
    profile.locationOverview.city || profile.locationOverview.zone
      ? `Ubicación: ${[profile.locationOverview.zone, profile.locationOverview.city].filter(Boolean).join(", ")}.`
      : "",
    `Catálogo: ${products.length} productos, ${services.length} servicios, ${offers.length} ofertas, ${surveys.length} encuestas, ${posts.length + textPosts.length} publicaciones de texto.`,
    `Reseñas: promedio ${avgReviewStars}/5, ${responseRate}% respondidas, ${unanswered} sin responder, ${pendingFollowUps} requieren seguimiento.`,
    interactingUsers.length ? `Usuarios que interactúan con encuestas/publicaciones: ${interactingUsers.length}.` : "",
    typeof analytics.growthIndex === "number" ? `Índice de crecimiento mensual: ${analytics.growthIndex}%.` : "",
  ].filter((line) => typeof line === "string" && line.trim().length > 0);

  return {
    resumenEjecutivo: digestLines.join(" "),
    perfil: {
      nombre: business.name,
      slogan: business.slogan,
      especializacion: business.specialization,
      categoria: business.category,
      tipoNegocio: business.businessType,
      calificacion: business.rating,
      totalReseñas: business.reviewCount,
      añosExperiencia: business.experienceYears,
      descripcion: profile.description,
      quienesSomos: profile.about,
      especialidades: profile.specialties,
      zonasCobertura: profile.coverageAreas,
      contactos: profile.contactChannels,
      redes: profile.socialLinks,
      horarios: profile.schedules,
      sucursales: profile.branches,
      ubicacion: profile.locationOverview,
    },
    indicadores: {
      metricas: metrics.map((m) => ({ etiqueta: m.label, valor: m.value, tendencia: m.trend })),
      radar: radar.map((r) => ({ etiqueta: r.label, valor: r.value })),
      indiceCrecimiento: analytics.growthIndex ?? null,
      promedioCalificacion: analytics.ratingAverage ?? avgReviewStars,
      distribucionEstrellas: ratingLevels,
      serieCrecimiento: growthSeries,
      visitasPorPublicacion: publicationMetrics.map((p) => ({
        titulo: p.title,
        visitas: p.visits,
        conversion: p.conversion,
      })),
    },
    alertas: alerts.map((a) => ({ titulo: a.title, detalle: a.detail, prioridad: a.priority })),
    actividadReciente: recentActivity.map((a) => ({ titulo: a.title, detalle: a.detail, cuando: a.time })),
    accionesRecomendadas: recommendedActions.map((a) => ({
      titulo: a.title,
      descripcion: a.description,
      impacto: a.impact,
    })),
    publicaciones: {
      productos: products.map((p) => ({
        nombre: p.name,
        descripcion: p.description,
        precio: p.price,
        estado: p.status,
      })),
      servicios: services.map((s) => ({
        nombre: s.name,
        descripcion: s.description,
        precio: s.price,
      })),
      ofertas: offers.map((o) => ({
        titulo: o.title,
        etiqueta: o.label,
        precioAnterior: o.previousPrice,
        precioActual: o.currentPrice,
        descripcion: o.description,
      })),
      encuestas: surveys.map((s) => ({
        pregunta: s.question,
        opciones: s.options,
        votos: s.votes,
      })),
      publicacionesTexto: [...posts, ...textPosts].map((p) => ({
        titulo: p.title,
        mensaje: p.message,
        fecha: p.date,
      })),
      totalUsuariosQueInteractuan: interactingUsers.length,
    },
    reseñas: {
      promedioEstrellas: avgReviewStars,
      tasaRespuesta: responseRate,
      sinResponder: unanswered,
      pendientesSeguimiento: pendingFollowUps,
      comentariosRecientes: userComments.map((c) => ({
        usuario: c.user,
        publicacion: c.publication,
        texto: c.text,
        fecha: c.date,
      })),
      detalle: reviews.map((review) => ({
        cliente: review.customer,
        producto: review.productOrService,
        estrellas: review.stars,
        mensaje: review.message,
        etiquetas: review.tags,
        requiereSeguimiento: review.needsFollowUp,
        respondida: review.wasResponded,
      })),
    },
  };
}

export async function askCompanyAi(question: string) {
  try {
    const context = await buildCompanyAiContext().catch(() => null);
    return await consultarEmpresaIa(question, context);
  } catch {
    return emptyAiInsight;
  }
}

// --- Catálogo de demostración (computadoras con especificaciones detalladas e imágenes) ---
// Solo se usa para rellenar las pestañas que el backend deja vacías. Si el backend devuelve
// productos/servicios/ofertas reales, esos tienen prioridad.
const demoProducts = [
  {
    id: "demo-prod-1",
    name: "Laptop Gamer ASUS ROG Strix G16 (2024)",
    description:
      "Procesador Intel Core i7-13650HX (14 núcleos, hasta 4.9 GHz) · GPU NVIDIA GeForce RTX 4060 8GB GDDR6 · 16GB RAM DDR5 5200MHz (ampliable a 32GB) · 1TB SSD NVMe PCIe 4.0 · Pantalla 16\" QHD+ 240Hz · Teclado RGB · WiFi 6E · Windows 11 Home. Ideal para gaming y edición de video.",
    price: "Bs 13.900",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
  },
  {
    id: "demo-prod-2",
    name: "Apple MacBook Air M3 13\" (2024)",
    description:
      "Chip Apple M3 (CPU 8 núcleos, GPU 10 núcleos) · 16GB memoria unificada · 512GB SSD · Pantalla Liquid Retina 13.6\" (2560x1664) · Hasta 18h de batería · Touch ID · 2x Thunderbolt · macOS Sonoma. Ultraligera (1.24 kg), perfecta para trabajo y movilidad.",
    price: "Bs 12.500",
    status: "Pocas unidades",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  },
  {
    id: "demo-prod-3",
    name: "Laptop Lenovo ThinkPad E14 Gen 5",
    description:
      "AMD Ryzen 7 7730U (8 núcleos, hasta 4.5 GHz) · Radeon Graphics · 16GB RAM DDR4 · 512GB SSD NVMe · Pantalla 14\" Full HD IPS antirreflejo · Lector de huella · Teclado retroiluminado resistente a salpicaduras · Windows 11 Pro. Pensada para empresas y productividad.",
    price: "Bs 8.200",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  },
  {
    id: "demo-prod-4",
    name: "Laptop HP Pavilion 15-eg3",
    description:
      "Intel Core i5-1335U (10 núcleos, hasta 4.6 GHz) · Intel Iris Xe Graphics · 8GB RAM DDR4 (ampliable) · 512GB SSD NVMe · Pantalla 15.6\" Full HD IPS · WiFi 6 · Batería de larga duración · Windows 11 Home. Excelente relación precio-rendimiento para estudio y hogar.",
    price: "Bs 5.900",
    status: "Disponible",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
  },
  {
    id: "demo-prod-5",
    name: "PC de Escritorio Gamer Ryzen 5 + RTX 3060",
    description:
      "AMD Ryzen 5 5600 (6 núcleos / 12 hilos, hasta 4.4 GHz) · NVIDIA GeForce RTX 3060 12GB · 16GB RAM DDR4 3200MHz · 1TB SSD NVMe · Placa B550 · Fuente 650W 80+ Bronze · Gabinete ATX con 4 ventiladores ARGB · Windows 11. Listo para 1080p/1440p en alta calidad.",
    price: "Bs 9.800",
    status: "Nuevo",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  },
  {
    id: "demo-prod-6",
    name: "PC Workstation Intel Core i9 + 32GB",
    description:
      "Intel Core i9-14900K (24 núcleos, hasta 6.0 GHz) · 32GB RAM DDR5 6000MHz · 2TB SSD NVMe Gen4 · NVIDIA RTX 4070 12GB · Placa Z790 · Refrigeración líquida 240mm · Fuente 850W 80+ Gold · Windows 11 Pro. Para renderizado, 3D y desarrollo profesional.",
    price: "Bs 18.400",
    status: "Bajo pedido",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
  },
];

const demoServices = [
  {
    id: "demo-serv-1",
    name: "Mantenimiento preventivo de laptop/PC",
    description:
      "Limpieza interna de polvo, cambio de pasta térmica, optimización del sistema operativo, eliminación de malware y revisión de hardware. Incluye informe de estado del equipo.",
    price: "Bs 150",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
  },
  {
    id: "demo-serv-2",
    name: "Armado de PC a medida",
    description:
      "Asesoría y ensamblaje de PC según tu presupuesto y uso (gaming, oficina, diseño). Incluye instalación de componentes, cableado ordenado, pruebas de estabilidad e instalación de Windows.",
    price: "Bs 250",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
  },
  {
    id: "demo-serv-3",
    name: "Upgrade de SSD y memoria RAM",
    description:
      "Migración de disco a SSD NVMe, clonado del sistema sin perder datos y ampliación de RAM. Tu equipo arranca y trabaja hasta 5x más rápido. Mano de obra incluida.",
    price: "Bs 180",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
  },
];

const demoOffers = [
  {
    id: "demo-offer-1",
    title: "Combo Home Office",
    description:
      "Laptop HP Pavilion 15 + mouse inalámbrico + base refrigerante + mochila. Todo lo que necesitas para trabajar desde casa, listo para usar.",
    currentPrice: "Bs 6.400",
    previousPrice: "Bs 7.200",
    label: "-11%",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  },
  {
    id: "demo-offer-2",
    title: "Setup Gamer Completo",
    description:
      "PC Gamer Ryzen 5 + RTX 3060 + monitor 24\" 144Hz + teclado mecánico + mouse gamer + audífonos. Combo armado y probado.",
    currentPrice: "Bs 12.900",
    previousPrice: "Bs 14.500",
    label: "Promo",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  },
];

const demoSurveys = [
  {
    id: "demo-survey-1",
    question: "¿Qué tipo de equipo buscas comprar este mes?",
    options: ["Laptop gamer", "Laptop de oficina", "PC de escritorio", "Componentes/upgrade"],
    votes: 48,
  },
  {
    id: "demo-survey-2",
    question: "¿Qué es lo más importante al elegir tu próxima computadora?",
    options: ["Precio", "Rendimiento", "Portabilidad", "Garantía y soporte"],
    votes: 31,
  },
];

const withDemoFallback = <T>(items: T[], demo: T[]) => (items.length > 0 ? items : demo);

// Imágenes por defecto (computadoras). Garantizan que ninguna publicación quede sin imagen,
// incluso cuando el backend devuelve productos reales con el campo de imagen vacío.
const fallbackProductImages = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
];

/** Devuelve la imagen recibida o, si está vacía, una imagen por defecto estable según el índice. */
const ensureImage = (image: string, index: number) =>
  image && image.trim().length > 0
    ? image
    : fallbackProductImages[index % fallbackProductImages.length];

export async function fetchCompanyPublications() {
  try {
    const source = asRecord(await requestEmpresa("/api/empresa/publicaciones"));
    const feedItems = Array.isArray(source.feed) ? source.feed.map(asRecord) : [];
    const postsFromFeed = feedItems.filter((item) => ["publicacion", "post", "publication"].includes(asString(item.type).toLowerCase()));

    return {
      products: withDemoFallback(
        (Array.isArray(source.products) ? source.products : []).map((item, index) => {
          const product = asRecord(item);
          return { ...product, image: ensureImage(asString(product.image, asString(product.imageUrl)), index) };
        }),
        demoProducts,
      ),
      services: withDemoFallback(
        (Array.isArray(source.services) ? source.services : []).map((item, index) => {
          const service = asRecord(item);
          return { ...service, image: ensureImage(asString(service.image, asString(service.imageUrl)), index) };
        }),
        demoServices,
      ),
      offers: withDemoFallback(
        (Array.isArray(source.offers) ? source.offers : []).map((item, index) => {
          const offer = asRecord(item);
          return { ...offer, image: ensureImage(asString(offer.image, asString(offer.imageUrl)), index) };
        }),
        demoOffers,
      ),
      surveys: withDemoFallback(
        (Array.isArray(source.surveys) ? source.surveys : []).map((item) => {
          const survey = asRecord(item);
          return { ...survey, options: normalizeSurveyOptions(survey.options) };
        }),
        demoSurveys,
      ),
      posts: (Array.isArray(source.posts) ? source.posts : postsFromFeed).map((item) => {
        const post = asRecord(item);
        return {
          ...post,
          title: asString(post.title),
          date: asString(post.date),
          message: asString(post.message, asString(post.description, asString(post.body))),
          image: asString(post.image, asString(post.imageUrl)),
        };
      }),
      textPosts: (Array.isArray(source.textPosts) ? source.textPosts : []).map((item) => {
        const post = asRecord(item);
        return {
          ...post,
          message: asString(post.message, asString(post.description, asString(post.body))),
          image: asString(post.image, asString(post.imageUrl)),
        };
      }),
      users: Array.isArray(source.users) ? source.users : Array.isArray(source.interactingUsers) ? source.interactingUsers : [],
      latestInteractionNotification: source.latestInteractionNotification ?? null,
    };
  } catch {
    return {
      products: demoProducts,
      services: demoServices,
      offers: demoOffers,
      surveys: demoSurveys,
      posts: [],
      textPosts: [],
      users: [],
      latestInteractionNotification: null,
    };
  }
}

export const createCompanyPublication = (payload: unknown) =>
  requestEmpresa("/api/empresa/publicaciones", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createCompanySurvey = (payload: unknown) =>
  requestEmpresa("/api/empresa/encuestas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCompanyProduct = (id: string, payload: unknown) =>
  requestEmpresa(`/api/empresa/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...asRecord(payload) }),
  });

export const updateCompanyService = (id: string, payload: unknown) =>
  requestEmpresa(`/api/empresa/servicios/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...asRecord(payload) }),
  });

export const updateCompanyOffer = (id: string, payload: unknown) =>
  requestEmpresa(`/api/empresa/ofertas/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...asRecord(payload) }),
  });

export const toggleCompanyPublicationLike = (publicationId: string, liked: boolean) =>
  requestEmpresa(`/api/empresa/publicaciones/${publicationId}/likes`, {
    method: "POST",
    body: JSON.stringify({ publicationId, liked }),
  });

export const createCompanyPublicationComment = (publicationId: string, text: string) =>
  requestEmpresa(`/api/empresa/publicaciones/${publicationId}/comentarios`, {
    method: "POST",
    body: JSON.stringify({ publicationId, text }),
  });

export async function uploadCompanyImage(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return requestEmpresa<{ id: string; fileName: string; url: string; mimeType: string; size: number }>("/api/empresa/archivos/imagenes", {
    method: "POST",
    body: formData,
  });
}
