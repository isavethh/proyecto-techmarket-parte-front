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

export const specialistNavLinks = [
  { title: "Resumen", href: "/especialista" },
  { title: "Portafolio", href: "/especialista/portafolio" },
  { title: "Servicios", href: "/especialista/servicios" },
  { title: "Chat", href: "/especialista/chat" },
  { title: "Reputacion", href: "/especialista/reputacion" },
  { title: "Disponibilidad", href: "/especialista/disponibilidad" },
];

export function starsLabel(value: number) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}
