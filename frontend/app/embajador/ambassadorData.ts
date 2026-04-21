export type AmbassadorLevel = 1 | 2 | 3;

export type ReferredBusiness = {
  id: string;
  name: string;
  category: string;
  city: string;
  referredAt: string;
  status: "Activo" | "En onboarding";
  monthlyLeads: number;
  conversionRate: number;
  growthRate: number;
  rating: number;
  userScore: number;
  userView: string;
  topComment: string;
  valueScore: number;
  commissionGenerated: number;
  reputationContribution: number;
  strengths: string[];
  risks: string[];
};

export type ReferredAmbassador = {
  id: string;
  name: string;
  level: AmbassadorLevel;
  focus: string;
  referredAt: string;
  status: "Activo" | "En formacion";
  activeBusinesses: number;
};

export const ambassadorProfile = {
  name: "Sofia Vargas",
  initials: "SV",
  city: "Santa Cruz",
  residenceArea: "Equipetrol",
  account: "Embajador verificado",
  specialty: "Captacion y activacion de negocios tecnologicos",
  level: 1 as AmbassadorLevel,
  bio: "Embajadora enfocada en activar negocios del ecosistema TechMarket con estrategia comunitaria, acompanamiento de onboarding y seguimiento de reputacion.",
};

export const referredAmbassadors: ReferredAmbassador[] = [
  {
    id: "amb-2-1",
    name: "Carlos Medina",
    level: 2,
    focus: "Onboarding de tiendas y soporte en zona norte",
    referredAt: "18 Mar 2026",
    status: "Activo",
    activeBusinesses: 6,
  },
  {
    id: "amb-2-2",
    name: "Lucia Arce",
    level: 2,
    focus: "Campanas comunitarias para servicios tecnicos",
    referredAt: "03 Abr 2026",
    status: "En formacion",
    activeBusinesses: 3,
  },
];

export const referredBusinesses: ReferredBusiness[] = [
  {
    id: "rb-1",
    name: "FixCloud Soporte",
    category: "Servicio tecnico",
    city: "Santa Cruz",
    referredAt: "12 Mar 2026",
    status: "Activo",
    monthlyLeads: 62,
    conversionRate: 21,
    growthRate: 34,
    rating: 4.8,
    userScore: 91,
    userView: "Los usuarios destacan respuesta rapida y seguimiento despues del servicio.",
    topComment: "Me resolvieron el problema remoto en menos de 1 hora.",
    valueScore: 93,
    commissionGenerated: 1680,
    reputationContribution: 88,
    strengths: [
      "Tiempo de primera respuesta por debajo de 12 minutos.",
      "Recompras frecuentes por soporte posterior.",
      "Comentarios positivos en 5 de cada 6 publicaciones.",
    ],
    risks: ["Alta carga operativa en fines de semana."],
  },
  {
    id: "rb-2",
    name: "TecnoNorte Hub",
    category: "Tienda y accesorios",
    city: "Santa Cruz",
    referredAt: "02 Abr 2026",
    status: "Activo",
    monthlyLeads: 44,
    conversionRate: 18,
    growthRate: 27,
    rating: 4.6,
    userScore: 84,
    userView: "Buena variedad y buena atencion por chat, pero piden mas fotos en publicaciones.",
    topComment: "Compraria de nuevo, solo faltan mas detalles tecnicos en cada post.",
    valueScore: 80,
    commissionGenerated: 1120,
    reputationContribution: 74,
    strengths: [
      "Publicaciones constantes cada semana.",
      "Catalogo con rotacion rapida de productos.",
    ],
    risks: ["Necesita mejorar evidencia visual en fichas de producto."],
  },
  {
    id: "rb-3",
    name: "RedLink Instalaciones",
    category: "Redes e infraestructura",
    city: "Santa Cruz",
    referredAt: "15 Abr 2026",
    status: "En onboarding",
    monthlyLeads: 19,
    conversionRate: 12,
    growthRate: 15,
    rating: 4.5,
    userScore: 78,
    userView: "Los usuarios ven potencial, pero esperan mayor actividad y mas casos publicados.",
    topComment: "Se ve profesional, falta mas evidencia de trabajos realizados.",
    valueScore: 67,
    commissionGenerated: 540,
    reputationContribution: 63,
    strengths: [
      "Servicio tecnico bien valorado en chats iniciales.",
      "Buen ticket promedio en clientes empresa.",
    ],
    risks: ["Onboarding incompleto en publicaciones y resenas.", "Baja frecuencia de contenido."],
  },
  {
    id: "rb-4",
    name: "NovaChip Store",
    category: "Componentes y perifericos",
    city: "Santa Cruz",
    referredAt: "27 Feb 2026",
    status: "Activo",
    monthlyLeads: 57,
    conversionRate: 24,
    growthRate: 31,
    rating: 4.7,
    userScore: 88,
    userView: "Percepcion positiva por precios claros, stock real y respuesta consistente.",
    topComment: "Publican stock real y cumplen los tiempos de entrega.",
    valueScore: 89,
    commissionGenerated: 1540,
    reputationContribution: 82,
    strengths: [
      "Alta conversion en publicaciones con oferta semanal.",
      "Respuestas con lenguaje comercial claro.",
      "Buena valoracion en comparativas del marketplace.",
    ],
    risks: ["Dependencia alta de campanas de descuento."],
  },
];
