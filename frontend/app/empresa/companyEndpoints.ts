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
    return normalizeProfile(await requestEmpresa("/api/empresa/perfil"));
  } catch {
    return emptyProfile;
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

export async function fetchCompanyPublications() {
  try {
    const source = asRecord(await requestEmpresa("/api/empresa/publicaciones"));
    const feedItems = Array.isArray(source.feed) ? source.feed.map(asRecord) : [];
    const postsFromFeed = feedItems.filter((item) => ["publicacion", "post", "publication"].includes(asString(item.type).toLowerCase()));

    return {
      products: (Array.isArray(source.products) ? source.products : []).map((item) => {
        const product = asRecord(item);
        return { ...product, image: asString(product.image, asString(product.imageUrl)) };
      }),
      services: (Array.isArray(source.services) ? source.services : []).map((item) => {
        const service = asRecord(item);
        return { ...service, image: asString(service.image, asString(service.imageUrl)) };
      }),
      offers: (Array.isArray(source.offers) ? source.offers : []).map((item) => {
        const offer = asRecord(item);
        return { ...offer, image: asString(offer.image, asString(offer.imageUrl)) };
      }),
      surveys: (Array.isArray(source.surveys) ? source.surveys : []).map((item) => {
        const survey = asRecord(item);
        return { ...survey, options: normalizeSurveyOptions(survey.options) };
      }),
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
      products: [],
      services: [],
      offers: [],
      surveys: [],
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
