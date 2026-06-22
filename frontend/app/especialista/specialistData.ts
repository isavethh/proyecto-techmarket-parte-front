export type PortfolioItem = {
  id: string;
  image: string;
  workDescription: string;
  serviceType: string;
  result?: string;
  date?: string;
};

export type SpecialistService = {
  id: string;
  name: string;
  description: string;
  price: string;
  type: string;
  technicianName: string;
  image?: string;
  featured?: boolean;
};

export type UserReview = {
  id: string;
  user: string;
  comment: string;
  stars: number;
  date: string;
  service: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type AvailabilityCard = {
  id: string;
  label: string;
  title: string;
  detail: string;
  tone: "positive" | "neutral";
};

export type SpecialistRequestItem = {
  id: string;
  customer: string;
  service: string;
  message: string;
  status: string;
  date: string;
};

export type SpecialistProjectItem = {
  id: string;
  customer: string;
  title: string;
  service: string;
  status: string;
  startDate: string;
  endDate: string;
  progress?: number;
};

export type SpecialistProjectHistoryItem = {
  id: string;
  project: string;
  detail: string;
  status: string;
  date: string;
};

export type SpecialistChatMessageItem = {
  id: string;
  from: "customer" | "specialist";
  text: string;
  time: string;
};

export type SpecialistChatItem = {
  id: string;
  customer: string;
  initials: string;
  service: string;
  status: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: SpecialistChatMessageItem[];
};

export type SpecialistFileItem = {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploadedAt: string;
  relatedTo: string;
  url?: string;
};

export type SpecialistCertificationItem = {
  id: string;
  title: string;
  issuer: string;
  status: string;
  date: string;
  credentialUrl?: string;
};

export const specialistProfile = {
  name: "Alejandro Torres",
  avatar: "AT",
  specialization: "Redes, laptops y soporte tecnico",
  location: "Santa Cruz de la Sierra, Bolivia",
  bio: "Especialista en diagnostico, reparacion e instalacion para hogares y pequenas empresas en Santa Cruz. Enfoque en soluciones claras, tiempos reales y acompanamiento posterior al servicio.",
};

export const specialistKpis = {
  averageRating: 4.8,
  totalReviews: 112,
  jobsCompleted: 286,
};

export const portfolioSeedItems: PortfolioItem[] = [
  {
    id: "p-1",
    image: "/productos/laptop-pro-14.jpg",
    workDescription:
      "Equipo con sobrecalentamiento y apagados inesperados. Se realizo limpieza interna, reemplazo de pasta termica y ajuste de ventilacion.",
    serviceType: "Mantenimiento preventivo",
    result: "Temperatura estable y mejora de rendimiento en tareas de diseno.",
    date: "Abr 2026",
  },
  {
    id: "p-2",
    image: "/productos/monitor-ultrawide-34.jpg",
    workDescription:
      "Puesto de trabajo empresarial con requerimiento de conectividad y doble pantalla. Se configuro red local y calibracion de monitor.",
    serviceType: "Instalacion y configuracion",
    result: "Estacion lista para trabajo remoto con conexion estable.",
    date: "Mar 2026",
  },
  {
    id: "p-3",
    image: "/productos/kit-limpieza-pc.jpg",
    workDescription:
      "Laptop con lentitud, errores de arranque y acumulacion de residuos internos. Se hizo revision integral de hardware y software.",
    serviceType: "Reparacion tecnica",
    result: "Inicio normal, menor tiempo de carga y estabilidad en uso diario.",
    date: "Feb 2026",
  },
];

export const specialistServices: SpecialistService[] = [
  {
    id: "s-1",
    name: "Reparacion de laptops",
    description: "Diagnostico detallado, cambio de componentes y pruebas de funcionamiento final.",
    price: "Bs 120.000",
    type: "Reparacion",
    technicianName: "Alejandro Torres",
    image: "/productos/laptop-pro-14.jpg",
    featured: true,
  },
  {
    id: "s-2",
    name: "Instalacion y configuracion de redes",
    description: "Configuracion de router, cableado y optimizacion de cobertura para oficina u hogar.",
    price: "Consultar",
    type: "Instalacion",
    technicianName: "Alejandro Torres",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "s-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza, control de temperatura y recomendaciones para prevenir fallas frecuentes.",
    price: "Bs 95.000",
    type: "Mantenimiento",
    technicianName: "Alejandro Torres",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "s-4",
    name: "Soporte tecnico remoto",
    description: "Asistencia por chat o videollamada para resolver errores de configuracion y software.",
    price: "Bs 60.000",
    type: "Soporte",
    technicianName: "Alejandro Torres",
    featured: true,
  },
];

export const specialistReviews: UserReview[] = [
  {
    id: "r-1",
    user: "Carlos M.",
    comment: "Soluciono un problema de temperatura en menos de un dia y explico todo el proceso.",
    stars: 5,
    date: "Hace 2 dias",
    service: "Mantenimiento preventivo",
  },
  {
    id: "r-2",
    user: "Laura P.",
    comment: "Muy claro con tiempos y costos. El soporte posterior fue rapido.",
    stars: 4,
    date: "Hace 5 dias",
    service: "Reparacion de laptops",
  },
  {
    id: "r-3",
    user: "Sofia R.",
    comment: "Instalo la red de la oficina y dejo todo funcionando estable.",
    stars: 5,
    date: "Hace 1 semana",
    service: "Instalacion y configuracion de redes",
  },
  {
    id: "r-4",
    user: "Andres T.",
    comment: "Buena atencion y seguimiento por chat despues del servicio.",
    stars: 5,
    date: "Hace 2 semanas",
    service: "Soporte tecnico remoto",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "a-1",
    title: "Trabajo completado",
    detail: "Optimizacion de laptop para analisis de datos",
    time: "Hace 3 h",
  },
  {
    id: "a-2",
    title: "Nueva resena 5 estrellas",
    detail: "Comentario recibido en servicio de mantenimiento",
    time: "Hoy",
  },
  {
    id: "a-3",
    title: "Servicio destacado",
    detail: "Soporte remoto con alta demanda esta semana",
    time: "Ayer",
  },
];

export const specialistAvailabilityCards: AvailabilityCard[] = [
  {
    id: "status",
    label: "Estado actual",
    title: "Disponible",
    detail: "Respuesta promedio en 12 minutos",
    tone: "positive",
  },
  {
    id: "days",
    label: "Dias de atencion",
    title: "Lunes a Sabado",
    detail: "Domingo: atencion prioritaria por chat",
    tone: "neutral",
  },
  {
    id: "hours",
    label: "Horarios",
    title: "08:00 AM - 06:00 PM",
    detail: "Soporte remoto hasta 08:00 PM",
    tone: "neutral",
  },
  {
    id: "mode",
    label: "Modalidad",
    title: "Presencial, remoto y a domicilio",
    detail: "Cobertura principal: Santa Cruz de la Sierra y alrededores",
    tone: "neutral",
  },
];

export const specialistRequests: SpecialistRequestItem[] = [
  {
    id: "req-1",
    customer: "Carlos M.",
    service: "Reparacion de laptops",
    message: "Necesito diagnostico por sobrecalentamiento y posible cambio de pasta termica.",
    status: "Pendiente",
    date: "Hoy",
  },
  {
    id: "req-2",
    customer: "Laura P.",
    service: "Mantenimiento preventivo",
    message: "Busco mantenimiento para dos equipos esta semana con revision de rendimiento.",
    status: "En revision",
    date: "Ayer",
  },
  {
    id: "req-3",
    customer: "Andres T.",
    service: "Instalacion y configuracion de redes",
    message: "Requiero propuesta para mejorar la red de una oficina pequena.",
    status: "Pendiente",
    date: "Hace 2 dias",
  },
];

export const specialistProjects: SpecialistProjectItem[] = [
  {
    id: "proj-1",
    customer: "Sofia R.",
    title: "Optimizacion de laptop de trabajo",
    service: "Mantenimiento preventivo",
    status: "En progreso",
    startDate: "May 2026",
    endDate: "Por definir",
    progress: 65,
  },
  {
    id: "proj-2",
    customer: "Empresa Norte",
    title: "Configuracion de red local",
    service: "Instalacion y configuracion de redes",
    status: "Planificado",
    startDate: "May 2026",
    endDate: "May 2026",
    progress: 25,
  },
];

export const specialistProjectHistory: SpecialistProjectHistoryItem[] = [
  {
    id: "hist-1",
    project: "Optimizacion de laptop de trabajo",
    detail: "Diagnostico inicial completado y piezas validadas.",
    status: "En progreso",
    date: "Hoy",
  },
  {
    id: "hist-2",
    project: "Configuracion de red local",
    detail: "Relevamiento de equipos y cobertura realizado.",
    status: "Planificado",
    date: "Ayer",
  },
  {
    id: "hist-3",
    project: "Soporte remoto software",
    detail: "Caso cerrado con validacion del cliente.",
    status: "Finalizado",
    date: "Hace 1 semana",
  },
];

export const specialistChats: SpecialistChatItem[] = [
  {
    id: "chat-1",
    customer: "Carlos M.",
    initials: "CM",
    service: "Reparacion de laptops",
    status: "En linea",
    lastMessage: "Quisiera saber si pueden revisar mi laptop hoy.",
    time: "Hace 5 min",
    unread: 2,
    messages: [
      { id: "m-1", from: "customer", text: "Hola, necesito ayuda con mi laptop.", time: "11:02" },
      { id: "m-2", from: "specialist", text: "Claro, cuentame que problema presenta.", time: "11:04" },
      { id: "m-3", from: "customer", text: "Se apaga sola y se calienta mucho.", time: "11:05" },
    ],
  },
  {
    id: "chat-2",
    customer: "Laura P.",
    initials: "LP",
    service: "Mantenimiento preventivo",
    status: "Disponible",
    lastMessage: "Me interesa agendar mantenimiento para esta semana.",
    time: "Hace 20 min",
    unread: 1,
    messages: [
      { id: "m-4", from: "customer", text: "Hola, quisiera hacer mantenimiento preventivo.", time: "10:30" },
      { id: "m-5", from: "specialist", text: "Si, tengo disponibilidad esta semana.", time: "10:34" },
    ],
  },
  {
    id: "chat-3",
    customer: "Andres T.",
    initials: "AT",
    service: "Instalacion y configuracion de redes",
    status: "Disponible",
    lastMessage: "Necesito red estable para oficina pequena.",
    time: "Hace 1 h",
    unread: 0,
    messages: [
      { id: "m-6", from: "customer", text: "Busco instalacion de red para mi oficina.", time: "09:10" },
      { id: "m-7", from: "specialist", text: "Perfecto, cuantos equipos necesitas conectar?", time: "09:15" },
    ],
  },
];

export const specialistFiles: SpecialistFileItem[] = [
  {
    id: "file-1",
    name: "diagnostico-laptop-carlos.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadedAt: "Hoy",
    relatedTo: "Carlos M. - Reparacion de laptops",
  },
  {
    id: "file-2",
    name: "evidencia-red-oficina.jpg",
    type: "Imagen",
    size: "860 KB",
    uploadedAt: "Ayer",
    relatedTo: "Empresa Norte - Configuracion de red local",
  },
  {
    id: "file-3",
    name: "reporte-mantenimiento.docx",
    type: "Documento",
    size: "540 KB",
    uploadedAt: "Hace 3 dias",
    relatedTo: "Laura P. - Mantenimiento preventivo",
  },
];

export const specialistCertifications: SpecialistCertificationItem[] = [
  {
    id: "cert-1",
    title: "Soporte tecnico certificado",
    issuer: "TechMarket Academy",
    status: "Verificada",
    date: "Abr 2026",
  },
  {
    id: "cert-2",
    title: "Redes domesticas y pymes",
    issuer: "Instituto Tecnico Digital",
    status: "Pendiente de verificacion",
    date: "Mar 2026",
  },
  {
    id: "cert-3",
    title: "Mantenimiento preventivo de hardware",
    issuer: "Hardware Lab Bolivia",
    status: "Verificada",
    date: "Ene 2026",
  },
];

export const specialistNavLinks = [
  { title: "Resumen", href: "/especialista" },
  { title: "Servicios", href: "/especialista/servicios" },
  { title: "Solicitudes", href: "/especialista/solicitudes" },
  { title: "Proyectos", href: "/especialista/proyectos" },
  { title: "Chat", href: "/especialista/chat" },
  { title: "Reputacion", href: "/especialista/reputacion" },
];

export function starsLabel(value: number) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}
