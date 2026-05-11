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