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
  specialization: "Laptops, redes y reparacion tecnica",
  rating: 4.8,
  reviewCount: 128,
  category: "Servicios y venta especializada en tecnologia en Bolivia",
  experienceYears: 12,
  businessType: "Tienda y centro tecnico en Santa Cruz",
};

export const specialties = [
  "Diagnostico y reparacion",
  "Redes y cableado",
  "Mantenimiento preventivo",
  "Soporte para empresas",
];

export const coverageAreas = [
  "Centro de Santa Cruz",
  "Zona norte",
  "Equipetrol",
  "Atencion a domicilio en sectores cercanos",
];

export const contactChannels = [
  { label: "Telefono", value: "+591 7500 0001" },
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
    trend: "+8 desde tu ultima visita",
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
    label: "Conversion semanal",
    value: "18%",
    trend: "+3.2 puntos vs semana anterior",
    tone: "positive",
    href: "/empresa/analiticas",
  },
  {
    id: "top-post",
    label: "Publicacion top",
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
    detail: "El alcance bajo 14% en las ultimas 24 horas.",
    priority: "media",
    href: "/empresa/publicaciones",
  },
  {
    id: "alert-3",
    title: "Hay oportunidad en soporte empresarial",
    detail: "Consultas tecnicas crecieron 22% esta semana.",
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
      "Actualiza imagen y CTA de tu publicacion top para recuperar alcance.",
    impact: "Impacto estimado: +18% visitas",
    href: "/empresa/publicaciones",
    cta: "Editar publicaciones",
  },
  {
    id: "action-3",
    title: "Ajustar oferta para clientes empresa",
    description:
      "Tus datos muestran mas demanda en mantenimiento y redes corporativas.",
    impact: "Impacto estimado: mejor ticket promedio",
    href: "/empresa/analiticas",
    cta: "Ver analiticas",
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
    detail: "Destaca rapidez de atencion y claridad del soporte.",
    time: "Hace 1 h",
  },
  {
    id: "activity-3",
    title: "Pico de visitas en publicacion de monitor",
    detail: "+320 visitas desde mediodia.",
    time: "Hoy",
  },
];

export const radarBars = [
  { label: "Interes en productos", value: 82 },
  { label: "Consultas tecnicas", value: 74 },
  { label: "Conversion a chat", value: 61 },
  { label: "Retorno de clientes", value: 68 },
];

export const recommendedAiQuestions = [
  "Que accion me conviene priorizar hoy para subir conversion?",
  "Que publicacion debo optimizar primero esta semana?",
  "Como responder los chats para cerrar mas ventas?",
];

export const aiThinkingStates = [
  "Analizando cambios de conversion y demanda reciente...",
  "Comparando publicaciones, leads y ritmo de respuesta...",
  "Preparando una recomendacion accionable para hoy...",
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
        "Entraron 24 leads nuevos desde tu ultima visita.",
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
      summary: "Optimiza primero tu publicacion de mayor historico para recuperar alcance rapido.",
      dataPoints: [
        "Laptop Pro 14 sigue como publicacion top con 2.3k visitas en 48h.",
        "El alcance de tu mejor anuncio cayo 14% en las ultimas 24 horas.",
        "Hoy hubo consultas directas de stock para ese producto.",
      ],
      advice:
        "Actualiza portada, agrega urgencia clara (stock limitado) y refuerza CTA a chat. Mantener activo el anuncio lider suele levantar el resto de publicaciones.",
      nextStep:
        "Edita la publicacion top y relanzala con un titulo orientado a beneficio y disponibilidad inmediata.",
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
        "Las preguntas mas frecuentes fueron stock, entrega y metodos de pago.",
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
      "24 leads nuevos en la ultima sesion comparada.",
      "Conversion semanal en 18% con tendencia positiva.",
      "Existe interes alto en productos y consultas tecnicas.",
    ],
    advice:
      "Combina acciones rapidas de chat con mejoras puntuales en publicaciones clave. Esa mezcla acelera conversion sin perder visibilidad.",
    nextStep: "Pregunta a la IA por un plan diario de ventas y seguimiento para tu equipo.",
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
  return Promise.resolve(companyProfileData);
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
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  messages: ChatMessage[];
};

export const chatThreadsData: ChatThread[] = [
  {
    id: "chat-5",
    name: "Alejandro",
    product: "Laptop Pro 14",
    lastMessage: "Busque la Laptop Pro 14 y quiero mas informacion.",
    time: "Ahora",
    unread: 1,
    avatar: "AL",
    messages: [
      { id: "m1", author: "cliente", text: "Hola, busque la Laptop Pro 14 en sus publicaciones.", time: "11:02" },
      { id: "m2", author: "empresa", text: "Hola Alejandro, claro. Te comparto caracteristicas y disponibilidad.", time: "11:04" },
      { id: "m3", author: "cliente", text: "Busque la Laptop Pro 14 y quiero mas informacion.", time: "11:05" },
    ],
  },
  {
    id: "chat-1",
    name: "Carlos M.",
    product: "Laptop Pro 14",
    lastMessage: "Quisiera saber si sigue disponible.",
    time: "Hace 5 min",
    unread: 2,
    avatar: "CM",
    messages: [
      { id: "m1", author: "cliente", text: "Hola, vi la Laptop Pro 14 en publicaciones.", time: "10:05" },
      { id: "m2", author: "empresa", text: "Hola Carlos, si, sigue disponible. Te comparto la informacion.", time: "10:07" },
      { id: "m3", author: "cliente", text: "Quisiera saber si sigue disponible.", time: "10:09" },
      { id: "m4", author: "empresa", text: "Si, esta disponible y te podemos asesorar por aqui mismo.", time: "10:10" },
    ],
  },
  {
    id: "chat-2",
    name: "Laura P.",
    product: "Mantenimiento preventivo",
    lastMessage: "Me interesa agendar para esta semana.",
    time: "Hace 20 min",
    unread: 1,
    avatar: "LP",
    messages: [
      { id: "m1", author: "cliente", text: "Buenos dias, vi el mantenimiento preventivo.", time: "09:30" },
      { id: "m2", author: "empresa", text: "Hola Laura, claro. Te explico el alcance del servicio.", time: "09:33" },
      { id: "m3", author: "cliente", text: "Me interesa agendar para esta semana.", time: "09:40" },
    ],
  },
  {
    id: "chat-3",
    name: "Sofia R.",
    product: "Combo empresarial",
    lastMessage: "Necesito informacion para mi oficina.",
    time: "Hace 1 h",
    avatar: "SR",
    messages: [
      { id: "m1", author: "cliente", text: "Hola, estoy revisando el combo empresarial.", time: "08:20" },
      { id: "m2", author: "empresa", text: "Hola Sofia, el combo incluye soporte y red interna.", time: "08:24" },
      { id: "m3", author: "cliente", text: "Necesito informacion para mi oficina.", time: "08:31" },
    ],
  },
  {
    id: "chat-4",
    name: "Andres T.",
    product: "Monitor UltraWide 34",
    lastMessage: "Quiero confirmar el precio.",
    time: "Ayer",
    avatar: "AT",
    messages: [
      { id: "m1", author: "cliente", text: "Vi el monitor en la publicacion.", time: "17:10" },
      { id: "m2", author: "empresa", text: "Hola Andres, si lo tenemos disponible.", time: "17:12" },
      { id: "m3", author: "cliente", text: "Quiero confirmar el precio.", time: "17:18" },
    ],
  },
];

export async function fetchCompanyChats() {
  return Promise.resolve(chatThreadsData);
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
    text: "Buena atencion por chat y explicacion clara del equipo.",
    date: "17 abr 2026",
  },
  {
    id: "rev-2",
    user: "Laura P.",
    stars: 4,
    text: "Servicio rapido, me ayudaron con mantenimiento y seguimiento.",
    date: "16 abr 2026",
  },
  {
    id: "rev-3",
    user: "Carlos M.",
    stars: 5,
    text: "La publicacion tenia toda la info y por chat resolvieron todo.",
    date: "15 abr 2026",
  },
];

export const userCommentsData: UserComment[] = [
  { id: "com-1", user: "Sofia R.", publication: "Combo empresarial", text: "Tienen plan para oficina de 8 equipos?", date: "Hace 1 h" },
  { id: "com-2", user: "Andres T.", publication: "Monitor UltraWide 34", text: "El precio incluye garantia extendida?", date: "Hace 3 h" },
  { id: "com-3", user: "Valentina G.", publication: "Pack limpieza premium", text: "En cuanto tiempo hacen el servicio?", date: "Ayer" },
  { id: "com-4", user: "Alejandro", publication: "Laptop Pro 14", text: "Busque este modelo, hay unidades para entrega inmediata?", date: "Hace 2 min" },
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
  return Promise.resolve({
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
    message: "Excelente atencion en chat. Me ayudaron rapido con disponibilidad, entrega y forma de pago.",
    tags: ["Rapidez", "Atencion", "Cierre de venta"],
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
    message: "Buena explicacion por chat. Solo faltaria mejorar el detalle del tiempo de envio en la publicacion.",
    tags: ["Claridad", "Envio", "Publicacion"],
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
    message: "Respondieron bien, pero me hubiera gustado una comparativa mas clara de paquetes para oficina.",
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
    message: "La experiencia por chat fue buena y resolvieron dudas de garantia. Recomendado.",
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
    message: "El chat fue util y amable. Seria ideal incluir tiempos estimados de atencion en el anuncio.",
    tags: ["Amabilidad", "Tiempos", "Anuncio"],
    needsFollowUp: true,
    wasResponded: true,
  },
];

export async function fetchCompanyReviews() {
  return Promise.resolve(customerReviewsData);
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
    description: "Diagnostico, mantenimiento y correccion de fallas tecnicas.",
    price: "Consultar",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "serv-2",
    name: "Instalacion de redes",
    description: "Cableado, configuracion y pruebas para conectividad estable.",
    price: "Bs 120.000",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "serv-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza interna, control de temperatura y optimizacion.",
    price: "Bs 95.000",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "serv-4",
    name: "Soporte tecnico remoto",
    description: "Asistencia rapida para configuraciones y solucion de errores.",
    price: "Bs 65.000",
    image: "/productos/teclado-tkl.jpg",
  },
];

export const offersData: OfferCard[] = [
  {
    id: "offer-1",
    title: "Descuento en diagnostico + limpieza",
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
    label: "Promocion",
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
    title: "Servicio rapido de soporte",
    description: "Atencion prioritaria para problemas frecuentes de software.",
    currentPrice: "Bs 55.000",
    previousPrice: "Bs 75.000",
    label: "Promocion",
    image: "/productos/laptop-pro-14.jpg",
  },
];

export const surveyItemsData: SurveyCard[] = [
  {
    id: "survey-1",
    question: "Que servicio necesitas con mas frecuencia?",
    options: ["Diagnostico", "Mantenimiento", "Redes", "Soporte remoto"],
    votes: 184,
  },
  {
    id: "survey-2",
    question: "Que producto te interesa mas para tu trabajo?",
    options: ["Laptop", "Monitor", "Teclado", "Mouse"],
    votes: 132,
  },
  {
    id: "survey-3",
    question: "Que canal prefieres para contacto rapido?",
    options: ["Chat", "WhatsApp", "Telefono", "Correo"],
    votes: 211,
  },
];

export const postsData: PostCard[] = [
  {
    id: "post-1",
    title: "Nueva llegada de equipos para trabajo y estudio",
    message: "Ya estan disponibles nuevos modelos de alto rendimiento para usuarios exigentes.",
    date: "17 abr 2026",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "post-2",
    title: "Consejo rapido: mejora la vida util de tu laptop",
    message: "Mantener limpieza interna y ventilacion correcta ayuda a evitar fallas por temperatura.",
    date: "16 abr 2026",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "post-3",
    title: "Anuncio para empresas pequenas",
    message: "Activamos acompanamiento tecnico mensual para oficinas con soporte prioritario.",
    date: "15 abr 2026",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
];

export const textPostsData: TextPublicationCard[] = [
  {
    id: "text-1",
    title: "Atencion tecnica sin costo de evaluacion",
    message:
      "Si tu equipo esta lento, escribenos por chat y te orientamos con una primera revision sin compromiso.",
    date: "17 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-2",
    title: "Consejo para empresas pequenas",
    message:
      "Mantener un respaldo semanal evita perdida de informacion y reduce tiempos muertos en oficina.",
    date: "16 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-3",
    title: "Soporte rapido por mensaje",
    message:
      "Escribenos si necesitas diagnostico, instalacion o mantenimiento. Respondemos desde Santa Cruz.",
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
  return Promise.resolve({
    products: productItemsData,
    services: serviceItemsData,
    offers: offersData,
    surveys: surveyItemsData,
    posts: postsData,
    textPosts: textPostsData,
    users: usersData,
    latestInteractionNotification: latestInteractionNotificationData,
  });
}