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

export const prospectLeadSources = ["Visita", "Redes", "Referido", "Evento"] as const;
export type LeadSource = (typeof prospectLeadSources)[number];

export const prospectPipelineStages = [
  "Nuevo",
  "Contactado",
  "Interesado",
  "Demo agendada",
  "En onboarding",
  "Activo",
  "Perdido",
] as const;
export type ProspectStage = (typeof prospectPipelineStages)[number];

export type ProspectStatus = "Activo" | "Perdido";

export type ProspectAction = {
  id: string;
  title: string;
  happenedAt: string;
  summary: string;
};

export type Prospect = {
  id: string;
  businessName: string;
  category: string;
  city: string;
  contactName: string;
  phone: string;
  source: LeadSource;
  currentStage: ProspectStage;
  createdAt: string;
  nextAction: string;
  nextActionDate: string;
  status: ProspectStatus;
  ambassadorNotes: string;
  actionHistory: ProspectAction[];
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

export const prospectosData: Prospect[] = [
  {
    id: "pros-101",
    businessName: "Pixel One Store",
    category: "Tienda de accesorios",
    city: "Santa Cruz",
    contactName: "Mariana Paz",
    phone: "+591 721-44110",
    source: "Redes",
    currentStage: "Interesado",
    createdAt: "06 Abr 2026",
    nextAction: "Enviar propuesta comercial por WhatsApp",
    nextActionDate: "24 Abr 2026",
    status: "Activo",
    ambassadorNotes:
      "Le interesa publicar combos para estudiantes. Pidio referencias de negocios activos dentro de TechMarket.",
    actionHistory: [
      {
        id: "pros-101-a1",
        title: "Lead captado por Instagram",
        happenedAt: "06 Abr 2026",
        summary: "Llego por una historia promocionada y pidio informacion del modelo de comision.",
      },
      {
        id: "pros-101-a2",
        title: "Llamada de validacion",
        happenedAt: "09 Abr 2026",
        summary: "Confirma interes en sumar catalogo y promociones semanales.",
      },
      {
        id: "pros-101-a3",
        title: "Reunion corta con gerente",
        happenedAt: "18 Abr 2026",
        summary: "Solicita propuesta aterrizada con costos, calendario de onboarding y tiempo estimado.",
      },
    ],
  },
  {
    id: "pros-102",
    businessName: "NetPro Instalaciones",
    category: "Redes e infraestructura",
    city: "Santa Cruz",
    contactName: "Diego Salvatierra",
    phone: "+591 773-80216",
    source: "Referido",
    currentStage: "Demo agendada",
    createdAt: "28 Mar 2026",
    nextAction: "Presentar demo del panel empresa",
    nextActionDate: "23 Abr 2026",
    status: "Activo",
    ambassadorNotes:
      "Tiene potencial alto para clientes corporativos. Quiere ver como se muestran los casos de exito y resenas.",
    actionHistory: [
      {
        id: "pros-102-a1",
        title: "Presentacion inicial",
        happenedAt: "29 Mar 2026",
        summary: "El lead viene recomendado por un tecnico aliado de la zona norte.",
      },
      {
        id: "pros-102-a2",
        title: "Seguimiento comercial",
        happenedAt: "10 Abr 2026",
        summary: "Confirma interes si puede medir solicitudes por zona y por servicio.",
      },
    ],
  },
  {
    id: "pros-103",
    businessName: "Mobix Repair Lab",
    category: "Servicio tecnico",
    city: "Montero",
    contactName: "Luciano Cuellar",
    phone: "+591 750-11983",
    source: "Visita",
    currentStage: "Contactado",
    createdAt: "15 Abr 2026",
    nextAction: "Segunda visita para explicar onboarding",
    nextActionDate: "25 Abr 2026",
    status: "Activo",
    ambassadorNotes:
      "Buena recepcion en tienda fisica. El dueño quiere revisar el flujo de pagos y la carga de publicaciones.",
    actionHistory: [
      {
        id: "pros-103-a1",
        title: "Visita en punto de venta",
        happenedAt: "15 Abr 2026",
        summary: "Se presento el ecosistema TechMarket y quedo pendiente enviar brochure operativo.",
      },
    ],
  },
  {
    id: "pros-104",
    businessName: "CloudBox Digital",
    category: "Software y soporte",
    city: "Santa Cruz",
    contactName: "Andrea Roca",
    phone: "+591 708-66302",
    source: "Evento",
    currentStage: "En onboarding",
    createdAt: "22 Mar 2026",
    nextAction: "Revisar primera carga de servicios y banners",
    nextActionDate: "26 Abr 2026",
    status: "Activo",
    ambassadorNotes:
      "Ya compartio logo, lineamientos y lista de servicios. Necesita acompanamiento para definir su primera campana.",
    actionHistory: [
      {
        id: "pros-104-a1",
        title: "Captado en meetup local",
        happenedAt: "22 Mar 2026",
        summary: "Interes inmediato por la red de embajadores y el enfoque en reputacion.",
      },
      {
        id: "pros-104-a2",
        title: "Aprobacion de propuesta",
        happenedAt: "04 Abr 2026",
        summary: "Confirma ingreso y envia materiales para configuracion inicial.",
      },
    ],
  },
  {
    id: "pros-105",
    businessName: "TecHouse Equipos",
    category: "Computacion y perifericos",
    city: "Warnes",
    contactName: "Ruben Flores",
    phone: "+591 760-55441",
    source: "Redes",
    currentStage: "Perdido",
    createdAt: "11 Mar 2026",
    nextAction: "Reactivar en proxima campana de temporada",
    nextActionDate: "12 May 2026",
    status: "Perdido",
    ambassadorNotes:
      "Detuvo la conversacion por prioridades internas. Conviene reactivar solo con oferta de temporada y caso de exito cercano.",
    actionHistory: [
      {
        id: "pros-105-a1",
        title: "Lead entrante por Facebook",
        happenedAt: "11 Mar 2026",
        summary: "Mostro interes inicial por visibilidad y reputacion digital.",
      },
      {
        id: "pros-105-a2",
        title: "Cierre sin avance",
        happenedAt: "02 Abr 2026",
        summary: "Pospone decision por reorganizacion interna y presupuesto congelado.",
      },
    ],
  },
];

export type OnboardingNote = {
  text: string;
  date: string;
};

export type BusinessOnboardingSnapshot = {
  emailVerified: boolean;
  basicDataComplete: boolean;
  profileDescription: string;
  category: string;
  location: string;
  productsCount: number;
  postsCount: number;
  evidenceCount: number;
  promotionCreated: boolean;
};

export type BusinessOnboardingValidated = {
  profile: boolean;
  catalog: boolean;
  post: boolean;
  evidence: boolean;
  promotion: boolean;
};

export type BusinessOnboardingTracking = {
  responsible: "Embajador" | "Negocio";
  nextActionDate: string;
  lastAction: string;
};

export type BusinessOnboardingMetrics = {
  startedAt: string;
  activatedAt?: string;
  daysToActivate?: number;
  leadsAfterActivation?: number;
};

export type BusinessOnboarding = {
  id: string;
  businessId: ReferredBusiness["id"];
  isActive: boolean;
  progress: number;
  currentStep: string;
  completedSteps: string[];
  nextAction: string;
  alerts: string[];
  lastUpdate: string;
  snapshot: BusinessOnboardingSnapshot;
  validated: BusinessOnboardingValidated;
  tracking: BusinessOnboardingTracking;
  metrics: BusinessOnboardingMetrics;
  notes: OnboardingNote[];
};

export const onboardingBusinessData: BusinessOnboarding[] = [
  {
    id: "onb-rb-1",
    businessId: "rb-1",
    isActive: false,
    progress: 0,
    currentStep: "Registro",
    completedSteps: [],
    nextAction: "Verificar registro para continuar onboarding",
    alerts: [],
    lastUpdate: "2026-04-23",
    snapshot: {
      emailVerified: false,
      basicDataComplete: false,
      profileDescription: "",
      category: "",
      location: "",
      productsCount: 0,
      postsCount: 0,
      evidenceCount: 0,
      promotionCreated: false,
    },
    validated: {
      profile: false,
      catalog: false,
      post: false,
      evidence: false,
      promotion: false,
    },
    tracking: {
      responsible: "Embajador",
      nextActionDate: "25 Abr 2026",
      lastAction: "Onboarding iniciado",
    },
    metrics: {
      startedAt: "2026-04-23",
    },
    notes: [],
  },
  {
    id: "onb-rb-2",
    businessId: "rb-2",
    isActive: false,
    progress: 0,
    currentStep: "Registro",
    completedSteps: [],
    nextAction: "Verificar registro para continuar onboarding",
    alerts: [],
    lastUpdate: "2026-04-23",
    snapshot: {
      emailVerified: false,
      basicDataComplete: false,
      profileDescription: "",
      category: "",
      location: "",
      productsCount: 0,
      postsCount: 0,
      evidenceCount: 0,
      promotionCreated: false,
    },
    validated: {
      profile: false,
      catalog: false,
      post: false,
      evidence: false,
      promotion: false,
    },
    tracking: {
      responsible: "Embajador",
      nextActionDate: "25 Abr 2026",
      lastAction: "Onboarding iniciado",
    },
    metrics: {
      startedAt: "2026-04-23",
    },
    notes: [],
  },
  {
    id: "onb-rb-3",
    businessId: "rb-3",
    isActive: false,
    progress: 0,
    currentStep: "Registro",
    completedSteps: [],
    nextAction: "Verificar registro para continuar onboarding",
    alerts: [],
    lastUpdate: "2026-04-23",
    snapshot: {
      emailVerified: false,
      basicDataComplete: false,
      profileDescription: "",
      category: "",
      location: "",
      productsCount: 0,
      postsCount: 0,
      evidenceCount: 0,
      promotionCreated: false,
    },
    validated: {
      profile: false,
      catalog: false,
      post: false,
      evidence: false,
      promotion: false,
    },
    tracking: {
      responsible: "Embajador",
      nextActionDate: "24 Abr 2026",
      lastAction: "Onboarding iniciado",
    },
    metrics: {
      startedAt: "2026-04-23",
    },
    notes: [],
  },
  {
    id: "onb-rb-4",
    businessId: "rb-4",
    isActive: false,
    progress: 0,
    currentStep: "Registro",
    completedSteps: [],
    nextAction: "Verificar registro para continuar onboarding",
    alerts: [],
    lastUpdate: "2026-04-23",
    snapshot: {
      emailVerified: false,
      basicDataComplete: false,
      profileDescription: "",
      category: "",
      location: "",
      productsCount: 0,
      postsCount: 0,
      evidenceCount: 0,
      promotionCreated: false,
    },
    validated: {
      profile: false,
      catalog: false,
      post: false,
      evidence: false,
      promotion: false,
    },
    tracking: {
      responsible: "Embajador",
      nextActionDate: "24 Abr 2026",
      lastAction: "Onboarding iniciado",
    },
    metrics: {
      startedAt: "2026-04-23",
    },
    notes: [],
  },
];
