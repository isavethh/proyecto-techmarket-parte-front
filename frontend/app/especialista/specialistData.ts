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

// Actividad reciente de muestra para el encabezado del panel (no es parte del camino de datos del
// backend; es contenido estático de la cabecera). El resto de los datasets de demostración se
// eliminó: cada vista ahora consume datos reales del backend o muestra estado vacío.
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
