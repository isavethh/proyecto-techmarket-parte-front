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
