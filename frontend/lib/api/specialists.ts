import { apiRequest } from "./client";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type SpecialistProfile = {
  id: string;
  nombre: string;
  especialidad: string;
  ubicacion: string;
  calificacion: number;
};

export type SpecialistService = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  tipo: string;
  destacado: boolean;
};

export type SpecialistPortfolioItem = {
  id: string;
  titulo: string;
  servicio: string;
  resultado: string;
  fecha: string;
};

export type SpecialistAvailability = {
  id?: string;
  estado?: string;
  status?: string;
  diasAtencion?: string;
  dias?: string;
  workingDays?: string;
  horario?: string | TimeRange;
  horarios?: string | TimeRange;
  hours?: string | TimeRange;
  modalidad?: string;
  mode?: string;
  cobertura?: string;
  coverage?: string;
  tiempoRespuesta?: string;
  responseTime?: string;
  detalle?: string;
  detail?: string;
};

export type TimeRange = {
  inicio?: string;
  fin?: string;
  start?: string;
  end?: string;
};

export type SpecialistCalendarItem = {
  id?: string;
  titulo?: string;
  title?: string;
  descripcion?: string;
  description?: string;
  detalle?: string;
  detail?: string;
  fecha?: string;
  date?: string;
  hora?: string;
  time?: string;
  tipo?: string;
  type?: string;
};

export type SpecialistRequest = {
  id?: string;
  requestId?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  servicio?: string;
  service?: string;
  propuesta?: string;
  proposal?: string;
  mensaje?: string;
  message?: string;
  estado?: string;
  status?: string;
  fecha?: string;
  date?: string;
  createdAt?: string;
};

export type SpecialistProject = {
  id?: string;
  projectId?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  nombre?: string;
  name?: string;
  titulo?: string;
  title?: string;
  servicio?: string;
  service?: string;
  estado?: string;
  status?: string;
  fechaInicio?: string;
  startDate?: string;
  fechaFin?: string;
  endDate?: string;
  progreso?: number | string;
  progress?: number | string;
};

export type SpecialistProjectHistory = {
  id?: string;
  historyId?: string;
  projectId?: string;
  proyecto?: string;
  project?: string;
  titulo?: string;
  title?: string;
  detalle?: string;
  detail?: string;
  descripcion?: string;
  description?: string;
  estado?: string;
  status?: string;
  fecha?: string;
  date?: string;
  createdAt?: string;
};

export type SpecialistChatMessage = {
  id?: string;
  messageId?: string;
  from?: string;
  sender?: string;
  role?: string;
  texto?: string;
  text?: string;
  mensaje?: string;
  message?: string;
  hora?: string;
  time?: string;
  fecha?: string;
  date?: string;
  createdAt?: string;
};

export type SpecialistChat = {
  id?: string;
  chatId?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  iniciales?: string;
  initials?: string;
  servicio?: string;
  service?: string;
  estado?: string;
  status?: string;
  ultimoMensaje?: string;
  lastMessage?: string;
  hora?: string;
  time?: string;
  fecha?: string;
  date?: string;
  unread?: number | string;
  noLeidos?: number | string;
  messages?: SpecialistChatMessage[];
  mensajes?: SpecialistChatMessage[];
};

export type SpecialistChatDetail = SpecialistChat & {
  messages?: SpecialistChatMessage[];
  mensajes?: SpecialistChatMessage[];
};

export type SpecialistFile = {
  id?: string;
  fileId?: string;
  nombre?: string;
  name?: string;
  filename?: string;
  tipo?: string;
  type?: string;
  mimeType?: string;
  tamano?: string | number;
  size?: string | number;
  fechaCarga?: string;
  uploadedAt?: string;
  createdAt?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  proyecto?: string;
  project?: string;
  relatedTo?: string;
  url?: string;
};

type ListResponse<T> = {
  value: T[];
  Count: number;
};

export async function loginTechMarket() {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: {
      email: "admin@gmail.com",
      password: "admin",
    },
  });
}

export async function getSpecialistProfile(token: string, userId: string) {
  return apiRequest<SpecialistProfile>("/api/specialists/profile", {
    token,
    userId,
  });
}

export async function getSpecialistServices(token: string, userId: string) {
  return apiRequest<SpecialistService[] | ListResponse<SpecialistService>>(
    "/api/specialists/services",
    {
      token,
      userId,
    }
  );
}

export async function getSpecialistPortfolio(token: string, userId: string) {
  return apiRequest<
    SpecialistPortfolioItem[] | ListResponse<SpecialistPortfolioItem>
  >("/api/specialists/portfolio", {
    token,
    userId,
  });
}

export async function getSpecialistAvailability(token: string, userId: string) {
  return apiRequest<SpecialistAvailability>("/api/specialists/availability", {
    token,
    userId,
  });
}

export async function getSpecialistCalendar(token: string, userId: string) {
  return apiRequest<SpecialistCalendarItem[] | ListResponse<SpecialistCalendarItem>>(
    "/api/specialists/calendar",
    {
      token,
      userId,
    }
  );
}

export async function getSpecialistRequests(token: string, userId: string) {
  return apiRequest<SpecialistRequest[] | ListResponse<SpecialistRequest> | { data: SpecialistRequest[] }>(
    "/api/specialists/requests",
    {
      token,
      userId,
    }
  );
}

export async function getSpecialistProjects(token: string, userId: string) {
  return apiRequest<SpecialistProject[] | ListResponse<SpecialistProject> | { data: SpecialistProject[] }>(
    "/api/specialists/projects",
    {
      token,
      userId,
    }
  );
}

export async function getSpecialistProjectsHistory(token: string, userId: string) {
  return apiRequest<
    SpecialistProjectHistory[] | ListResponse<SpecialistProjectHistory> | { data: SpecialistProjectHistory[] }
  >("/api/specialists/projects/history", {
    token,
    userId,
  });
}

export async function getSpecialistChats(token: string, userId: string) {
  return apiRequest<SpecialistChat[] | ListResponse<SpecialistChat> | { data: SpecialistChat[] }>(
    "/api/specialists/chats",
    {
      token,
      userId,
    }
  );
}

export async function getSpecialistChatById(token: string, userId: string, chatId: string) {
  return apiRequest<SpecialistChatDetail>(`/api/specialists/chats/${chatId}`, {
    token,
    userId,
  });
}

export async function getSpecialistFiles(token: string, userId: string) {
  return apiRequest<SpecialistFile[] | ListResponse<SpecialistFile> | { data: SpecialistFile[] }>(
    "/api/specialists/files",
    {
      token,
      userId,
    }
  );
}
