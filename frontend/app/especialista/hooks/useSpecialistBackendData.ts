"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSpecialistPortfolio,
  getSpecialistProfile,
  getSpecialistServices,
  loginTechMarket,
  type SpecialistPortfolioItem as BackendPortfolioItem,
  type SpecialistProfile as BackendSpecialistProfile,
  type SpecialistService as BackendSpecialistService,
} from "@/lib/api/specialists";
import {
  portfolioSeedItems,
  specialistProfile,
  specialistServices,
  type PortfolioItem,
  type SpecialistService,
} from "../specialistData";

export type SpecialistUiProfile = typeof specialistProfile;

type BackendListResponse<T> = {
  value?: T[];
  Count?: number;
};

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || specialistProfile.avatar;
}

function normalizeList<T>(response: T[] | BackendListResponse<T>) {
  return Array.isArray(response) ? response : response.value ?? [];
}

export function mapBackendProfileToUiProfile(profile: BackendSpecialistProfile): SpecialistUiProfile {
  const name = profile.nombre?.trim() || specialistProfile.name;

  return {
    name,
    avatar: getInitials(name),
    specialization: profile.especialidad?.trim() || specialistProfile.specialization,
    location: profile.ubicacion?.trim() || specialistProfile.location,
    bio: specialistProfile.bio,
  };
}

export function mapBackendServiceToUiService(
  service: BackendSpecialistService,
  technicianName: string,
): SpecialistService {
  return {
    id: service.id,
    name: service.nombre?.trim() || "Servicio tecnico",
    description: service.descripcion?.trim() || "Servicio tecnico disponible.",
    price: service.precio?.trim() || "Consultar",
    type: service.tipo?.trim() || "Servicio",
    technicianName,
    featured: Boolean(service.destacado),
  };
}

export function mapBackendPortfolioToUiPortfolio(item: BackendPortfolioItem): PortfolioItem {
  return {
    id: item.id,
    image: "/productos/laptop-pro-14.jpg",
    workDescription: item.titulo?.trim() || "Trabajo tecnico realizado.",
    serviceType: item.servicio?.trim() || "Servicio tecnico",
    result: item.resultado?.trim() || undefined,
    date: item.fecha?.trim() || undefined,
  };
}

export function useSpecialistBackendData() {
  const [profile, setProfile] = useState<SpecialistUiProfile>(specialistProfile);
  const [services, setServices] = useState<SpecialistService[]>(specialistServices);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(portfolioSeedItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSpecialistData() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const [profileResponse, servicesResponse, portfolioResponse] = await Promise.all([
          getSpecialistProfile(login.accessToken, login.userId),
          getSpecialistServices(login.accessToken, login.userId),
          getSpecialistPortfolio(login.accessToken, login.userId),
        ]);

        if (!isMounted) {
          return;
        }

        const uiProfile = profileResponse ? mapBackendProfileToUiProfile(profileResponse) : specialistProfile;
        const backendServices = normalizeList(servicesResponse);
        const backendPortfolio = normalizeList(portfolioResponse);

        setProfile(uiProfile);
        setServices(
          backendServices.length > 0
            ? backendServices.map((service) => mapBackendServiceToUiService(service, uiProfile.name))
            : specialistServices,
        );
        setPortfolio(
          backendPortfolio.length > 0 ? backendPortfolio.map(mapBackendPortfolioToUiPortfolio) : portfolioSeedItems,
        );
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar datos del especialista");
        setProfile(specialistProfile);
        setServices(specialistServices);
        setPortfolio(portfolioSeedItems);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSpecialistData();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () => ({ profile, services, portfolio, loading, error }),
    [profile, services, portfolio, loading, error],
  );
}
