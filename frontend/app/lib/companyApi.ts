import { consultarEmpresaIa } from "@/lib/api/empresaAiApi";

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
};

export const businessData = {
  name: "TechMarket Santa Cruz",
  logo: "TC",
  slogan:
    "Soluciones confiables en tecnologia para hogar y empresa en Santa Cruz de la Sierra.",
  specialization: "Laptops, redes y reparacion técnica",
  rating: 4.8,
  reviewCount: 128,
  category: "Servicios y venta especializada en tecnologia en Bolivia",
  experienceYears: 12,
  businessType: "Tienda y centro técnico en Santa Cruz",
};

export const specialties = [
  "Diagnóstico y reparacion",
  "Redes y cableado",
  "Mantenimiento preventivo",
  "Soporte para empresas",
];

export const coverageAreas = [
  "Centro de Santa Cruz",
  "Zona norte",
  "Equipetrol",
  "Atención a domicilio en sectores cercanos",
];

export const contactChannels = [
  { label: "Teléfono", value: "+591 7500 0001" },
  { label: "WhatsApp", value: "+591 7500 0001" },
  { label: "Correo", value: "contacto@techmarketscz.com" },
];

export const socialLinks = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export const schedules = [
  { day: "Lunes a viernes", hours: "8:00 a. m. - 6:30 p. m." },
  { day: "Sabado", hours: "9:00 a. m. - 2:00 p. m." },
  { day: "Domingo y festivos", hours: "No atiende" },
];

export const branches = [
  {
    name: "Sede Principal",
    address: "Av. Monseñor Rivero # 120, Santa Cruz de la Sierra",
    phone: "+591 7500 0001",
    hours:
      "Lunes a viernes 8:00 a. m. - 6:30 p. m.; Sabado 9:00 a. m. - 2:00 p. m.",
  },
  {
    name: "Sucursal Norte",
    address: "Avenida Cristo Redentor # 2800, Zona Norte",
    phone: "+591 7500 0002",
    hours: "Lunes a viernes 9:00 a. m. - 5:30 p. m.",
  },
];

export const locationOverview = {
  mainAddressShort: "Av. Monseñor Rivero # 120",
  mainAddressLong: "Av. Monseñor Rivero # 120, Santa Cruz de la Sierra",
  city: "Santa Cruz de la Sierra",
  zone: "Centro",
  reference: "Cerca del Cristo Redentor",
  mapAreas: ["Zona norte", "Centro", "Equipetrol"],
};

export const executiveMetrics: ExecutiveMetric[] = [
  {
    id: "new-leads",
    label: "Leads nuevos",
    value: "24",
    trend: "+8 desde tu última visita",
    tone: "positive",
    href: "/empresa/chat",
  },
  {
    id: "chat-unread",
    label: "Mensajes por responder",
    value: "11",
    trend: "4 chats de alta intencion",
    tone: "neutral",
    href: "/empresa/chat",
  },
  {
    id: "conversion-rate",
    label: "Conversión semanal",
    value: "18%",
    trend: "+3.2 puntos vs semana anterior",
    tone: "positive",
    href: "/empresa/analiticas",
  },
  {
    id: "top-post",
    label: "Publicación top",
    value: "Laptop Pro 14",
    trend: "2.3k visitas en 48h",
    tone: "neutral",
    href: "/empresa/publicaciones",
  },
];

export const alertItems: AlertItem[] = [
  {
    id: "alert-1",
    title: "3 clientes preguntaron por stock hoy",
    detail: "Hay interes directo en Laptop Pro 14 y Monitor UltraWide 34.",
    priority: "alta",
    href: "/empresa/chat",
  },
  {
    id: "alert-2",
    title: "Tu mejor anuncio perdio ritmo",
    detail: "El alcance bajo 14% en las últimas 24 horas.",
    priority: "media",
    href: "/empresa/publicaciones",
  },
  {
    id: "alert-3",
    title: "Hay oportunidad en soporte empresarial",
    detail: "Consultas técnicas crecieron 22% esta semana.",
    priority: "media",
    href: "/empresa/analiticas",
  },
];

export const strategicActions: StrategicAction[] = [
  {
    id: "action-1",
    title: "Responder chats de alta intencion",
    description:
      "Prioriza conversaciones con usuarios que preguntaron precio y entrega.",
    impact: "Impacto estimado: +2 a +4 conversiones hoy",
    href: "/empresa/chat",
    cta: "Ir a chat",
  },
  {
    id: "action-2",
    title: "Reactivar anuncio con mejor historial",
    description:
      "Actualiza imagen y CTA de tu publicación top para recuperar alcance.",
    impact: "Impacto estimado: +18% visitas",
    href: "/empresa/publicaciones",
    cta: "Editar publicaciones",
  },
  {
    id: "action-3",
    title: "Ajustar oferta para clientes empresa",
    description:
      "Tus datos muestran más demanda en mantenimiento y redes corporativas.",
    impact: "Impacto estimado: mejor ticket promedio",
    href: "/empresa/analiticas",
    cta: "Ver analíticas",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Alejandro inicio chat por Laptop Pro 14",
    detail: "Solicito disponibilidad inmediata y opciones de pago.",
    time: "Hace 12 min",
  },
  {
    id: "activity-2",
    title: "Nueva reseña positiva (5/5)",
    detail: "Destaca rapidez de atención y claridad del soporte.",
    time: "Hace 1 h",
  },
  {
    id: "activity-3",
    title: "Pico de visitas en publicación de monitor",
    detail: "+320 visitas desde mediodia.",
    time: "Hoy",
  },
];

export const radarBars = [
  { label: "Interes en productos", value: 82 },
  { label: "Consultas técnicas", value: 74 },
  { label: "Conversión a chat", value: 61 },
  { label: "Retorno de clientes", value: 68 },
];

export const recommendedAiQuestions = [
  "¿Qué acción me conviene priorizar hoy para subir conversión?",
  "¿Qué publicación debo optimizar primero esta semana?",
  "¿Cómo responder los chats para cerrar más ventas?",
];

export const aiThinkingStates = [
  "Analizando cambios de conversión y demanda reciente...",
  "Comparando publicaciones, leads y ritmo de respuesta...",
  "Preparando una recomendación accionable para hoy...",
];

export function buildAiInsight(question: string): AiBusinessInsight {
  const normalizedQuestion = question.toLowerCase();

  if (normalizedQuestion.includes("conversion") || normalizedQuestion.includes("priorizar")) {
    return {
      summary:
        "Tu prioridad hoy debe ser acelerar la respuesta comercial en chats con mayor intencion de compra.",
      dataPoints: [
        "Tienes 11 mensajes por responder, 4 son de alta intencion.",
        "La conversion semanal subio a 18% (+3.2 puntos).",
        "Entraron 24 leads nuevos desde tu última visita.",
      ],
      advice:
        "Define una regla simple: responder en menos de 15 minutos los chats que preguntan por precio, stock o entrega. Esa velocidad mejora la probabilidad de cierre.",
      nextStep:
        "Abre chat y filtra primero por urgencia de compra para contactar a esos 4 leads prioritarios.",
    };
  }

  if (
    normalizedQuestion.includes("publicacion") ||
    normalizedQuestion.includes("optimizar") ||
    normalizedQuestion.includes("anuncio")
  ) {
    return {
      summary: "Optimiza primero tu publicación de mayor histórico para recuperar alcance rápido.",
      dataPoints: [
        "Laptop Pro 14 sigue como publicación top con 2.3k visitas en 48h.",
        "El alcance de tu mejor anuncio cayo 14% en las últimas 24 horas.",
        "Hoy hubo consultas directas de stock para ese producto.",
      ],
      advice:
        "Actualiza portada, agrega urgencia clara (stock limitado) y refuerza CTA a chat. Mantener activo el anuncio lider suele levantar el resto de publicaciones.",
      nextStep:
        "Edita la publicación top y relanzala con un título orientado a beneficio y disponibilidad inmediata.",
    };
  }

  if (
    normalizedQuestion.includes("chat") ||
    normalizedQuestion.includes("cerrar") ||
    normalizedQuestion.includes("ventas")
  ) {
    return {
      summary:
        "La forma en que respondes los primeros mensajes ya puede aumentar cierres esta misma semana.",
      dataPoints: [
        "4 conversaciones activas muestran intencion alta de compra.",
        "Las preguntas más frecuentes fueron stock, entrega y métodos de pago.",
        "El interes por productos y servicios se mantiene sobre 70% en tu radar.",
      ],
      advice:
        "Usa una estructura fija de 3 pasos: confirmar disponibilidad, proponer opcion recomendada y cerrar con siguiente accion concreta (pago, envio o visita).",
      nextStep:
        "Prepara una plantilla corta de respuesta comercial para reducir tiempo y mantener consistencia.",
    };
  }

  return {
    summary:
      "Vas en buen ritmo, pero el mayor crecimiento vendra de ejecutar prioridades comerciales en secuencia.",
    dataPoints: [
      "24 leads nuevos en la última sesión comparada.",
      "Conversión semanal en 18% con tendencia positiva.",
      "Existe interes alto en productos y consultas técnicas.",
    ],
    advice:
      "Combina acciones rapidas de chat con mejoras puntuales en publicaciones clave. Esa mezcla acelera conversión sin perder visibilidad.",
    nextStep: "Pregunta a la IA por un plan diario de ventas y seguimiento para tu equipo.",
  };
}

const COMPANY_API_BASE_URL = (process.env.NEXT_PUBLIC_COMPANY_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function buildCompanyApiUrl(path: string) {
  return COMPANY_API_BASE_URL ? `${COMPANY_API_BASE_URL}${path}` : path;
}

function getCompanyAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function requestCompanyApi<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!(options?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  Object.entries(getCompanyAuthHeader()).forEach(([key, value]) => headers.set(key, value));

  const response = await fetch(buildCompanyApiUrl(path), {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error ${options?.method ?? "GET"} ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function requestCompanyApiWithFallback<T>(path: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    return await requestCompanyApi<T>(path, options);
  } catch {
    return fallback;
  }
}

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

function normalizeCompanyProfile(payload: unknown): CompanyProfileData {
  const source = asRecord(payload);

  if (source.businessData) {
    return payload as CompanyProfileData;
  }

  const primaryAddress = asRecord((source.addresses as unknown[])?.[0]);
  const contactItems = Array.isArray(source.contacts) ? source.contacts.map(asRecord) : [];
  const findContact = (label: string) =>
    contactItems.find((item) => asString(item.label).toLowerCase() === label.toLowerCase())?.value;

  // Sin mocks: lo que no venga del backend queda vacío (la empresa lo completa en su perfil).
  return {
    businessData: {
      name: asString(source.name),
      logo: asString(source.logoText, asString(source.logoUrl)),
      slogan: asString(source.slogan, asString(source.description)),
      specialization: asString(source.specialization),
      rating: asNumber(source.rating, 0),
      reviewCount: asNumber(source.reviewCount, 0),
      category: asString(source.category, asString(source.businessType)),
      experienceYears: asNumber(source.experienceYears, 0),
      businessType: asString(source.businessType),
    },
    specialties: Array.isArray(source.specialties) ? (source.specialties as string[]) : [],
    coverageAreas: Array.isArray(source.coverageAreas) ? (source.coverageAreas as string[]) : [],
    contactChannels: contactItems.length
      ? contactItems.map((item) => ({
          label: asString(item.label),
          value: asString(item.value),
        }))
      : [
          { label: "Teléfono", value: asString(findContact("Teléfono")) },
          { label: "WhatsApp", value: asString(findContact("WhatsApp")) },
          { label: "Correo", value: asString(findContact("Correo")) },
        ],
    socialLinks: Array.isArray(source.socialLinks) ? source.socialLinks as CompanyProfileData["socialLinks"] : [],
    schedules: Array.isArray(source.schedules) ? source.schedules as CompanyProfileData["schedules"] : [],
    branches: Array.isArray(source.branches) ? source.branches as CompanyProfileData["branches"] : [],
    locationOverview: source.locationOverview
      ? source.locationOverview as CompanyProfileData["locationOverview"]
      : {
          mainAddressShort: asString(primaryAddress.short),
          mainAddressLong: asString(primaryAddress.full),
          city: asString(primaryAddress.city),
          zone: asString(primaryAddress.zone),
          reference: asString(primaryAddress.reference),
          mapAreas: Array.isArray(source.mapAreas) ? source.mapAreas as string[] : [],
        },
  };
}

function normalizeSurveyOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      if (typeof option === "string") return option;
      const optionRecord = asRecord(option);
      return asString(optionRecord.text, asString(optionRecord.label));
    })
    .filter(Boolean);
}

function normalizeCompanyPublications(payload: unknown) {
  const source = asRecord(payload);

  return {
    products: (Array.isArray(source.products) ? source.products : productItemsData).map((item) => {
      const product = asRecord(item);
      return {
        ...item as ProductCard,
        image: asString(product.image, asString(product.imageUrl, "/productos/laptop-pro-14.jpg")),
      };
    }),
    services: (Array.isArray(source.services) ? source.services : serviceItemsData).map((item) => {
      const service = asRecord(item);
      return {
        ...item as ServiceCard,
        image: asString(service.image, asString(service.imageUrl, "/productos/laptop-pro-14.jpg")),
      };
    }),
    offers: (Array.isArray(source.offers) ? source.offers : offersData).map((item) => {
      const offer = asRecord(item);
      return {
        ...item as OfferCard,
        image: asString(offer.image, asString(offer.imageUrl, "/productos/laptop-pro-14.jpg")),
      };
    }),
    surveys: (Array.isArray(source.surveys) ? source.surveys : surveyItemsData).map((item) => {
      const survey = asRecord(item);
      return {
        ...item as SurveyCard,
        options: normalizeSurveyOptions(survey.options),
      };
    }),
    posts: (Array.isArray(source.posts) ? source.posts : postsData).map((item) => {
      const post = asRecord(item);
      return {
        ...item as PostCard,
        message: asString(post.message, asString(post.description, asString(post.body))),
        image: asString(post.image, asString(post.imageUrl)),
      };
    }),
    textPosts: (Array.isArray(source.textPosts) ? source.textPosts : textPostsData).map((item) => {
      const post = asRecord(item);
      return {
        ...item as TextPublicationCard,
        message: asString(post.message, asString(post.description, asString(post.body))),
        image: asString(post.image, asString(post.imageUrl, "/productos/charla.png")),
      };
    }),
    users: Array.isArray(source.users) ? source.users as UserCard[] : Array.isArray(source.interactingUsers) ? source.interactingUsers as UserCard[] : usersData,
    latestInteractionNotification: source.latestInteractionNotification
      ? source.latestInteractionNotification as InteractionNotification
      : latestInteractionNotificationData,
  };
}
export type CompanyProfileData = {
  businessData: typeof businessData;
  specialties: string[];
  coverageAreas: string[];
  contactChannels: Array<{ label: string; value: string }>;
  socialLinks: Array<{ label: string; href: string }>;
  schedules: Array<{ day: string; hours: string }>;
  branches: Array<{
    name: string;
    address: string;
    phone: string;
    hours: string;
  }>;
  locationOverview: {
    mainAddressShort: string;
    mainAddressLong: string;
    city: string;
    zone: string;
    reference: string;
    mapAreas: string[];
  };
};

export const companyProfileData: CompanyProfileData = {
  businessData,
  specialties,
  coverageAreas,
  contactChannels,
  socialLinks,
  schedules,
  branches,
  locationOverview,
};

export async function fetchCompanyProfile() {
  // Fallback neutro (sin datos de ejemplo) si el backend no responde.
  const payload = await requestCompanyApiWithFallback<unknown>("/api/empresa/perfil", {});
  return normalizeCompanyProfile(payload);
}

function toCompanyProfileEndpointPayload(profile: CompanyProfileData) {
  return {
    id: "company-profile",
    name: profile.businessData.name,
    logoUrl: "",
    slogan: profile.businessData.slogan,
    specialization: profile.businessData.specialization,
    category: profile.businessData.category,
    businessType: profile.businessData.businessType,
    addresses: [
      {
        short: profile.locationOverview.mainAddressShort,
        full: profile.locationOverview.mainAddressLong,
        city: profile.locationOverview.city,
        zone: profile.locationOverview.zone,
        reference: profile.locationOverview.reference,
      },
    ],
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
}

export async function updateCompanyProfile(profile: CompanyProfileData) {
  const payload = toCompanyProfileEndpointPayload(profile);

  return requestCompanyApiWithFallback("/api/empresa/perfil", payload, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export type ChatMessage = {
  id: string;
  author: "empresa" | "cliente";
  text: string;
  time: string;
};

export type ChatThread = {
  id: string;
  name: string;
  product: string;
  listingId?: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  messages: ChatMessage[];
};

const stripProductIdFromSubject = (subject: string): string =>
  subject.replace(/\s*\([A-Za-z]+-[0-9a-f-]{36}\)\s*$/i, "").trim() || subject;

// Conversaciones de ejemplo para demo/desarrollo. Solo se usan cuando el backend no
// devuelve conversaciones reales; en cuanto el backend responde, esos datos tienen prioridad.
export const companyChatThreadsData: ChatThread[] = [
  {
    id: "chat-1",
    name: "Alejandro Rojas",
    product: "Laptop Pro 14",
    lastMessage: "Perfecto, ¿la puedo pasar a recoger mañana?",
    time: "09:42",
    unread: 2,
    avatar: "AR",
    messages: [
      { id: "m1-1", author: "cliente", text: "Hola, ¿tienen la Laptop Pro 14 en stock?", time: "09:30" },
      { id: "m1-2", author: "empresa", text: "¡Hola Alejandro! Sí, tenemos unidades disponibles para entrega inmediata.", time: "09:33" },
      { id: "m1-3", author: "cliente", text: "Genial. ¿El precio incluye garantía?", time: "09:35" },
      { id: "m1-4", author: "empresa", text: "Sí, incluye 12 meses de garantía oficial y soporte por chat.", time: "09:38" },
      { id: "m1-5", author: "cliente", text: "Perfecto, ¿la puedo pasar a recoger mañana?", time: "09:42" },
    ],
  },
  {
    id: "chat-2",
    name: "Carlos Méndez",
    product: "Monitor UltraWide 34",
    lastMessage: "¿Tienen envío a zona sur?",
    time: "Ayer",
    unread: 1,
    avatar: "CM",
    messages: [
      { id: "m2-1", author: "cliente", text: "Buenas, me interesa el Monitor UltraWide 34.", time: "18:10" },
      { id: "m2-2", author: "empresa", text: "¡Hola Carlos! Excelente elección, está en promoción esta semana.", time: "18:14" },
      { id: "m2-3", author: "cliente", text: "¿Tienen envío a zona sur?", time: "18:20" },
    ],
  },
  {
    id: "chat-3",
    name: "Laura Paredes",
    product: "Mantenimiento preventivo",
    lastMessage: "Gracias, quedo atenta a la visita.",
    time: "Ayer",
    avatar: "LP",
    messages: [
      { id: "m3-1", author: "cliente", text: "Hola, necesito mantenimiento para 5 equipos de oficina.", time: "11:02" },
      { id: "m3-2", author: "empresa", text: "Con gusto, Laura. Agendamos visita técnica sin costo para el diagnóstico.", time: "11:09" },
      { id: "m3-3", author: "cliente", text: "Perfecto, ¿qué día tienen disponible?", time: "11:12" },
      { id: "m3-4", author: "empresa", text: "Podemos el jueves a las 10:00. ¿Te funciona?", time: "11:15" },
      { id: "m3-5", author: "cliente", text: "Gracias, quedo atenta a la visita.", time: "11:18" },
    ],
  },
  {
    id: "chat-4",
    name: "Sofía Ramírez",
    product: "Combo empresarial",
    lastMessage: "¿Tienen plan para oficina de 8 equipos?",
    time: "Lun",
    unread: 3,
    avatar: "SR",
    messages: [
      { id: "m4-1", author: "cliente", text: "Hola, estoy armando la oficina nueva.", time: "15:40" },
      { id: "m4-2", author: "cliente", text: "¿Tienen plan para oficina de 8 equipos?", time: "15:41" },
    ],
  },
  {
    id: "chat-5",
    name: "Andrés Torres",
    product: "Monitor UltraWide 34",
    lastMessage: "Listo, confirmo la compra entonces.",
    time: "Lun",
    avatar: "AT",
    messages: [
      { id: "m5-1", author: "cliente", text: "¿El precio incluye garantía extendida?", time: "12:00" },
      { id: "m5-2", author: "empresa", text: "Hola Andrés, la garantía extendida es opcional (+10%). Te cubre 24 meses.", time: "12:05" },
      { id: "m5-3", author: "cliente", text: "Listo, confirmo la compra entonces.", time: "12:08" },
    ],
  },
  {
    id: "chat-6",
    name: "Valentina Gómez",
    product: "Pack limpieza premium",
    lastMessage: "¿En cuánto tiempo hacen el servicio?",
    time: "Mar",
    unread: 1,
    avatar: "VG",
    messages: [
      { id: "m6-1", author: "cliente", text: "Hola, me interesa el Pack limpieza premium.", time: "10:20" },
      { id: "m6-2", author: "empresa", text: "¡Hola Valentina! Incluye limpieza profunda interna y externa del equipo.", time: "10:24" },
      { id: "m6-3", author: "cliente", text: "¿En cuánto tiempo hacen el servicio?", time: "10:26" },
    ],
  },
];

export async function fetchCompanyChats() {
  // El backend real tiene prioridad. Si no devuelve conversaciones, se usan ejemplos de demo.
  const payload = await requestCompanyApiWithFallback<unknown>("/api/empresa/chat/conversaciones", {
    conversations: companyChatThreadsData,
  });
  const source = asRecord(payload);
  const raw = (Array.isArray(source.conversations) ? source.conversations : payload) as ChatThread[];
  // Si el backend no devuelve conversaciones (lista vacía), mostramos las de demo.
  const threads = Array.isArray(raw) && raw.length > 0 ? raw : companyChatThreadsData;
  return threads.map((thread) => ({
    ...thread,
    product: stripProductIdFromSubject(thread.product),
  }));
}

export async function fetchCompanyChatMessages(conversationId: string) {
  return requestCompanyApiWithFallback(`/api/empresa/chat/conversaciones/${conversationId}/mensajes`, null);
}

export async function sendCompanyChatMessage(conversationId: string, text: string) {
  return requestCompanyApiWithFallback(`/api/empresa/chat/conversaciones/${conversationId}/mensajes`, null, {
    method: "POST",
    body: JSON.stringify({ conversationId, author: "empresa", text }),
  });
}

export async function markCompanyChatAsRead(conversationId: string) {
  return requestCompanyApiWithFallback(`/api/empresa/chat/conversaciones/${conversationId}/leido`, null, {
    method: "PATCH",
    body: JSON.stringify({ conversationId, read: true }),
  });
}

export type PublicationMetric = {
  id: string;
  title: string;
  visits: number;
  conversion: number;
};

export type RatingLevel = {
  stars: number;
  percent: number;
  users: number;
};

export type UserReview = {
  id: string;
  user: string;
  stars: number;
  text: string;
  date: string;
};

export type UserComment = {
  id: string;
  user: string;
  publication: string;
  text: string;
  date: string;
};

export type GrowthPoint = {
  month: string;
  visits: number;
};

export const publicationMetricsData: PublicationMetric[] = [
  { id: "pm-1", title: "Laptop Pro 14", visits: 2380, conversion: 18 },
  { id: "pm-2", title: "Monitor UltraWide 34", visits: 1740, conversion: 12 },
  { id: "pm-3", title: "Mantenimiento preventivo", visits: 1290, conversion: 21 },
  { id: "pm-4", title: "Combo empresarial", visits: 940, conversion: 15 },
  { id: "pm-5", title: "Pack limpieza premium", visits: 760, conversion: 9 },
];

export const ratingLevelsData: RatingLevel[] = [
  { stars: 5, percent: 62, users: 124 },
  { stars: 4, percent: 24, users: 48 },
  { stars: 3, percent: 9, users: 18 },
  { stars: 2, percent: 3, users: 6 },
  { stars: 1, percent: 2, users: 4 },
];

export const userReviewsData: UserReview[] = [
  {
    id: "rev-1",
    user: "Alejandro",
    stars: 5,
    text: "Buena atención por chat y explicacion clara del equipo.",
    date: "17 abr 2026",
  },
  {
    id: "rev-2",
    user: "Laura P.",
    stars: 4,
    text: "Servicio rápido, me ayudaron con mantenimiento y seguimiento.",
    date: "16 abr 2026",
  },
  {
    id: "rev-3",
    user: "Carlos M.",
    stars: 5,
    text: "La publicación tenia toda la info y por chat resolvieron todo.",
    date: "15 abr 2026",
  },
];

export const userCommentsData: UserComment[] = [
  { id: "com-1", user: "Sofia R.", publication: "Combo empresarial", text: "¿Tienen plan para oficina de 8 equipos?", date: "Hace 1 h" },
  { id: "com-2", user: "Andres T.", publication: "Monitor UltraWide 34", text: "¿El precio incluye garantia extendida?", date: "Hace 3 h" },
  { id: "com-3", user: "Valentina G.", publication: "Pack limpieza premium", text: "¿En cuanto tiempo hacen el servicio?", date: "Ayer" },
  { id: "com-4", user: "Alejandro", publication: "Laptop Pro 14", text: "¿Busque este modelo, hay unidades para entrega inmediata?", date: "Hace 2 min" },
];

export const growthSeriesData: GrowthPoint[] = [
  { month: "Nov", visits: 1200 },
  { month: "Dic", visits: 1360 },
  { month: "Ene", visits: 1490 },
  { month: "Feb", visits: 1710 },
  { month: "Mar", visits: 1980 },
  { month: "Abr", visits: 2240 },
];

export async function fetchCompanyAnalytics() {
  return requestCompanyApiWithFallback("/api/empresa/analiticas", {
    publicationMetrics: publicationMetricsData,
    ratingLevels: ratingLevelsData,
    userReviews: userReviewsData,
    userComments: userCommentsData,
    growthSeries: growthSeriesData,
    ratingAverage: 4.4,
    growthIndex: 27,
  });
}

export type CustomerReview = {
  id: string;
  customer: string;
  initials: string;
  productOrService: string;
  chatDate: string;
  reviewDate: string;
  stars: number;
  message: string;
  tags: string[];
  needsFollowUp: boolean;
  wasResponded: boolean;
};

export const customerReviewsData: CustomerReview[] = [
  {
    id: "review-1",
    customer: "Alejandro",
    initials: "AL",
    productOrService: "Laptop Pro 14",
    chatDate: "17 abr 2026",
    reviewDate: "18 abr 2026",
    stars: 5,
    message: "Excelente atención en chat. Me ayudaron rápido con disponibilidad, entrega y forma de pago.",
    tags: ["Rapidez", "Atención", "Cierre de venta"],
    needsFollowUp: false,
    wasResponded: true,
  },
  {
    id: "review-2",
    customer: "Carlos M.",
    initials: "CM",
    productOrService: "Laptop Pro 14",
    chatDate: "16 abr 2026",
    reviewDate: "17 abr 2026",
    stars: 4,
    message: "Buena explicacion por chat. Solo faltaria mejorar el detalle del tiempo de envío en la publicación.",
    tags: ["Claridad", "Envío", "Publicacion"],
    needsFollowUp: true,
    wasResponded: false,
  },
  {
    id: "review-3",
    customer: "Laura P.",
    initials: "LP",
    productOrService: "Mantenimiento preventivo",
    chatDate: "15 abr 2026",
    reviewDate: "16 abr 2026",
    stars: 5,
    message: "Servicio muy profesional. Desde el chat me dieron alcance, costo y horario de visita.",
    tags: ["Profesionalismo", "Servicio", "Confianza"],
    needsFollowUp: false,
    wasResponded: true,
  },
  {
    id: "review-4",
    customer: "Sofia R.",
    initials: "SR",
    productOrService: "Combo empresarial",
    chatDate: "14 abr 2026",
    reviewDate: "15 abr 2026",
    stars: 3,
    message: "Respondieron bien, pero me hubiera gustado una comparativa más clara de paquetes para oficina.",
    tags: ["Comparativa", "Paquetes", "Oportunidad"],
    needsFollowUp: true,
    wasResponded: false,
  },
  {
    id: "review-5",
    customer: "Andres T.",
    initials: "AT",
    productOrService: "Monitor UltraWide 34",
    chatDate: "13 abr 2026",
    reviewDate: "14 abr 2026",
    stars: 4,
    message: "La experiencia por chat fue buena y resolvieron dudas de garantía. Recomendado.",
    tags: ["Garantia", "Resolucion", "Recomendacion"],
    needsFollowUp: false,
    wasResponded: true,
  },
  {
    id: "review-6",
    customer: "Valentina G.",
    initials: "VG",
    productOrService: "Pack limpieza premium",
    chatDate: "12 abr 2026",
    reviewDate: "13 abr 2026",
    stars: 4,
    message: "El chat fue util y amable. Seria ideal incluir tiempos estimados de atención en el anuncio.",
    tags: ["Amabilidad", "Tiempos", "Anuncio"],
    needsFollowUp: true,
    wasResponded: true,
  },
];

export async function fetchCompanyReviews() {
  const payload = await requestCompanyApiWithFallback<unknown>("/api/empresa/resenas", customerReviewsData);
  const source = asRecord(payload);
  return (Array.isArray(source.reviews) ? source.reviews : payload) as CustomerReview[];
}

export async function respondCompanyReview(reviewId: string, response: string) {
  return requestCompanyApiWithFallback(`/api/empresa/resenas/${reviewId}/respuesta`, null, {
    method: "POST",
    body: JSON.stringify({ reviewId, response, wasResponded: true }),
  });
}

export type ProductCard = {
  id: string;
  name: string;
  description: string;
  price?: string;
  status: string;
  image: string;
};

export type ServiceCard = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
};

export type OfferCard = {
  id: string;
  title: string;
  description: string;
  currentPrice: string;
  previousPrice?: string;
  label: string;
  image: string;
};

export type SurveyCard = {
  id: string;
  question: string;
  options: string[];
  votes: number;
};

export type PostCard = {
  id: string;
  title: string;
  message: string;
  date: string;
  image?: string;
};

export type TextPublicationCard = {
  id: string;
  title: string;
  message: string;
  date: string;
  image: string;
};

export type UserCard = {
  id: string;
  name: string;
  avatar: string;
  activity: string;
};

export type InteractionNotification = {
  id: string;
  userName: string;
  productName: string;
  userId: string;
};

export const productItemsData: ProductCard[] = [
  {
    id: "prod-1",
    name: "Laptop Pro 14",
    description: "Intel i7, 16 GB RAM, SSD 512 GB para trabajo y estudio.",
    price: "Bs 3.650.000",
    status: "Disponible",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "prod-2",
    name: "Monitor UltraWide 34",
    description: "Pantalla amplia 3440 x 1440 para productividad y diseño.",
    price: "Bs 1.480.000",
    status: "Disponible",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "prod-3",
    name: "Teclado mecanico TKL",
    description: "Switch azul, RGB y formato compacto para setups modernos.",
    price: "Bs 260.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-4",
    name: "Kit limpieza PC",
    description: "Brochas, aire y pasta termica para cuidado de equipos.",
    price: "Bs 85.000",
    status: "Disponible",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "prod-5",
    name: "Mouse ergonomico",
    description: "Comodidad para jornadas largas de oficina o estudio.",
    price: "Bs 95.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-6",
    name: "Cableado de red Cat 6",
    description: "Solucion para instalacion estable en oficinas y hogares.",
    price: "Bs 12.000",
    status: "Disponible",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
];

export const serviceItemsData: ServiceCard[] = [
  {
    id: "serv-1",
    name: "Reparacion de laptops",
    description: "Diagnóstico, mantenimiento y correccion de fallas técnicas.",
    price: "Consultar",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "serv-2",
    name: "Instalacion de redes",
    description: "Cableado, configuración y pruebas para conectividad estable.",
    price: "Bs 120.000",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "serv-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza interna, control de temperatura y optimización.",
    price: "Bs 95.000",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "serv-4",
    name: "Soporte técnico remoto",
    description: "Asistencia rápida para configuraciones y solucion de errores.",
    price: "Bs 65.000",
    image: "/productos/teclado-tkl.jpg",
  },
];

export const offersData: OfferCard[] = [
  {
    id: "offer-1",
    title: "Descuento en diagnóstico + limpieza",
    description: "Promo especial para equipos con bajo rendimiento o sobrecalentamiento.",
    currentPrice: "Bs 95.000",
    previousPrice: "Bs 140.000",
    label: "Oferta",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "offer-2",
    title: "Combo empresarial para pequenas oficinas",
    description: "Instalacion de red, soporte remoto y acompanamiento mensual.",
    currentPrice: "Bs 420.000",
    previousPrice: "Bs 520.000",
    label: "Promoción",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "offer-3",
    title: "Pack limpieza premium",
    description: "Limpieza interna + revision termica con descuento por tiempo limitado.",
    currentPrice: "Bs 110.000",
    previousPrice: "Bs 150.000",
    label: "Oferta",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "offer-4",
    title: "Servicio rápido de soporte",
    description: "Atención prioritaria para problemas frecuentes de software.",
    currentPrice: "Bs 55.000",
    previousPrice: "Bs 75.000",
    label: "Promoción",
    image: "/productos/laptop-pro-14.jpg",
  },
];

export const surveyItemsData: SurveyCard[] = [
  {
    id: "survey-1",
    question: "¿Qué servicio necesitas con más frecuencia?",
    options: ["Diagnostico", "Mantenimiento", "Redes", "Soporte remoto"],
    votes: 184,
  },
  {
    id: "survey-2",
    question: "¿Qué producto te interesa más para tu trabajo?",
    options: ["Laptop", "Monitor", "Teclado", "Mouse"],
    votes: 132,
  },
  {
    id: "survey-3",
    question: "¿Qué canal prefieres para contacto rápido?",
    options: ["Chat", "WhatsApp", "Teléfono", "Correo"],
    votes: 211,
  },
];

export const postsData: PostCard[] = [
  {
    id: "post-1",
    title: "Nueva llegada de equipos para trabajo y estudio",
    message: "Ya están disponibles nuevos modelos de alto rendimiento para usuarios exigentes.",
    date: "17 abr 2026",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "post-2",
    title: "Consejo rápido: mejora la vida util de tu laptop",
    message: "Mantener limpieza interna y ventilacion correcta ayuda a evitar fallas por temperatura.",
    date: "16 abr 2026",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "post-3",
    title: "Anuncio para empresas pequenas",
    message: "Activamos acompanamiento técnico mensual para oficinas con soporte prioritario.",
    date: "15 abr 2026",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
];

export const textPostsData: TextPublicationCard[] = [
  {
    id: "text-1",
    title: "Atención técnica sin costo de evaluación",
    message:
      "Si tu equipo esta lento, escribenos por chat y te orientamos con una primera revision sin compromiso.",
    date: "17 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-2",
    title: "Consejo para empresas pequenas",
    message:
      "Mantener un respaldo semanal evita perdida de información y reduce tiempos muertos en oficina.",
    date: "16 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-3",
    title: "Soporte rápido por mensaje",
    message:
      "Escribenos si necesitas diagnóstico, instalacion o mantenimiento. Respondemos desde Santa Cruz.",
    date: "15 abr 2026",
    image: "/productos/charla.png",
  },
];

export const usersData: UserCard[] = [
  { id: "user-5", name: "Alejandro", avatar: "AL", activity: "Busco Laptop Pro 14 hace 2 min" },
  { id: "user-1", name: "Carlos M.", avatar: "CM", activity: "Dio like a un producto hace 1 hora" },
  { id: "user-2", name: "Laura P.", avatar: "LP", activity: "Participo en una encuesta hace 3 horas" },
  { id: "user-3", name: "Sofia R.", avatar: "SR", activity: "Comento una publicacion informativa" },
  { id: "user-4", name: "Andres T.", avatar: "AT", activity: "Reacciono a una promocion activa" },
];

export const latestInteractionNotificationData: InteractionNotification = {
  id: "notif-alejandro-1",
  userName: "Alejandro",
  productName: "Laptop Pro 14",
  userId: "user-5",
};

export async function fetchCompanyPublications() {
  const payload = await requestCompanyApiWithFallback<unknown>("/api/empresa/publicaciones", {
    products: productItemsData,
    services: serviceItemsData,
    offers: offersData,
    surveys: surveyItemsData,
    posts: postsData,
    textPosts: textPostsData,
    users: usersData,
    latestInteractionNotification: latestInteractionNotificationData,
  });

  return normalizeCompanyPublications(payload);
}

export async function createCompanyPublication(payload: unknown) {
  return requestCompanyApiWithFallback("/api/empresa/publicaciones", payload, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCompanyProduct(id: string, payload: unknown) {
  return requestCompanyApiWithFallback(`/api/empresa/productos/${id}`, payload, {
    method: "PUT",
    body: JSON.stringify({ id, ...asRecord(payload) }),
  });
}

export async function updateCompanyService(id: string, payload: unknown) {
  return requestCompanyApiWithFallback(`/api/empresa/servicios/${id}`, payload, {
    method: "PUT",
    body: JSON.stringify({ id, ...asRecord(payload) }),
  });
}

export async function updateCompanyOffer(id: string, payload: unknown) {
  return requestCompanyApiWithFallback(`/api/empresa/ofertas/${id}`, payload, {
    method: "PUT",
    body: JSON.stringify({ id, ...asRecord(payload) }),
  });
}

export async function createCompanySurvey(payload: unknown) {
  return requestCompanyApiWithFallback("/api/empresa/encuestas", payload, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function toggleCompanyPublicationLike(publicationId: string, liked: boolean) {
  return requestCompanyApiWithFallback(`/api/empresa/publicaciones/${publicationId}/likes`, null, {
    method: "POST",
    body: JSON.stringify({ publicationId, liked }),
  });
}

export async function createCompanyPublicationComment(publicationId: string, text: string) {
  return requestCompanyApiWithFallback(`/api/empresa/publicaciones/${publicationId}/comentarios`, null, {
    method: "POST",
    body: JSON.stringify({ publicationId, authorName: "TechMarket Santa Cruz", text }),
  });
}

export async function uploadCompanyImage(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return requestCompanyApiWithFallback<{ id: string; fileName: string; url: string; mimeType: string; size: number } | null>(
    "/api/empresa/archivos/imagenes",
    null,
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function askCompanyAi(question: string) {
  try {
    return await consultarEmpresaIa(question);
  } catch {
    return buildAiInsight(question);
  }
}

export async function fetchCompanySummary() {
  return requestCompanyApiWithFallback("/api/empresa/resumen", {
    id: "company-summary",
    metrics: executiveMetrics,
    alerts: alertItems,
    recentActivity,
    radar: radarBars,
    recommendedActions: strategicActions,
    ai: {
      recommendedQuestions: recommendedAiQuestions,
    },
  });
}


