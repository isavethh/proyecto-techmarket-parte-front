"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createSpecialistPortfolioItem,
  createSpecialistService,
  deleteSpecialistService,
  getSpecialistPortfolio,
  getSpecialistProfile,
  getSpecialistServices,
  loginTechMarket,
  updateSpecialistService,
  type SpecialistPortfolioItem as BackendPortfolioItem,
  type SpecialistPortfolioItemInput,
  type SpecialistService as BackendSpecialistService,
  type SpecialistServiceInput,
} from "@/lib/api/specialists";
import {
  portfolioSeedItems,
  specialistProfile,
  specialistServices,
  type PortfolioItem,
  type SpecialistService,
} from "../specialistData";
import { getTechmarketToken, getTechmarketUserId } from "@/lib/auth/tokenStore";
import { debugSpecialistResult, getDatasetSource, normalizeBackendList, type DatasetSource } from "./specialistBackendHelpers";
import { hasBackendProfileData, mapBackendProfileToUiProfile, neutralSpecialistProfile } from "./useSpecialistProfileData";

export type SpecialistUiProfile = typeof specialistProfile;

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
  const [profile, setProfile] = useState<SpecialistUiProfile>({
    ...neutralSpecialistProfile,
  });
  const [services, setServices] = useState<SpecialistService[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [profileSource, setProfileSource] = useState<DatasetSource>("empty");
  const [servicesSource, setServicesSource] = useState<DatasetSource>("empty");
  const [portfolioSource, setPortfolioSource] = useState<DatasetSource>("empty");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<{ token: string; userId: string } | null>(null);

  const loadSpecialistData = useCallback(async (isMounted: () => boolean = () => true) => {
    try {
      setLoading(true);
      setError(null);

      const storedToken = getTechmarketToken();
      const storedUserId = getTechmarketUserId();

      let currentToken: string;
      let currentUserId: string;

      if (storedToken && storedUserId) {
        currentToken = storedToken;
        currentUserId = storedUserId;
        setAuth({ token: storedToken, userId: storedUserId });
      } else {
        const login = await loginTechMarket();
        currentToken = login.accessToken;
        currentUserId = login.userId;
        setAuth({ token: login.accessToken, userId: login.userId });
      }

      const [profileResult, servicesResult, portfolioResult] = await Promise.allSettled([
        getSpecialistProfile(currentToken, currentUserId),
        getSpecialistServices(currentToken, currentUserId),
        getSpecialistPortfolio(currentToken, currentUserId),
      ]);

      if (!isMounted()) {
        return;
      }

      debugSpecialistResult("[specialist profile]", profileResult);
      debugSpecialistResult("[specialist services]", servicesResult);
      debugSpecialistResult("[specialist portfolio]", portfolioResult);

      const uiProfile = profileResult.status === "fulfilled" && hasBackendProfileData(profileResult.value) ? mapBackendProfileToUiProfile(profileResult.value) : neutralSpecialistProfile;
      const backendServices = servicesResult.status === "fulfilled"
        ? normalizeBackendList<BackendSpecialistService>(servicesResult.value)
        : [];
      const backendPortfolio = portfolioResult.status === "fulfilled"
        ? normalizeBackendList<BackendPortfolioItem>(portfolioResult.value)
        : [];

      setProfile(profileResult.status === "rejected" ? specialistProfile : uiProfile);
      setProfileSource(profileResult.status === "rejected" ? "fallback" : hasBackendProfileData(profileResult.value) ? "backend" : "empty");
      setServices(
        servicesResult.status === "fulfilled"
          ? backendServices.map((service) => mapBackendServiceToUiService(service, uiProfile.name))
          : specialistServices,
      );
      setServicesSource(servicesResult.status === "fulfilled" ? getDatasetSource(backendServices) : "fallback");
      setPortfolio(
        portfolioResult.status === "fulfilled"
          ? backendPortfolio.map(mapBackendPortfolioToUiPortfolio)
          : portfolioSeedItems,
      );
      setPortfolioSource(portfolioResult.status === "fulfilled" ? getDatasetSource(backendPortfolio) : "fallback");
    } catch (err) {
      if (!isMounted()) {
        return;
      }

      setError(err instanceof Error ? err.message : "Error desconocido al cargar datos del especialista");
      setProfile(specialistProfile);
      setServices(specialistServices);
      setPortfolio(portfolioSeedItems);
      setProfileSource("fallback");
      setServicesSource("fallback");
      setPortfolioSource("fallback");
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  const ensureAuth = useCallback(async () => {
    if (auth) {
      return auth;
    }

    const storedToken = getTechmarketToken();
    const storedUserId = getTechmarketUserId();
    if (storedToken && storedUserId) {
      const nextAuth = { token: storedToken, userId: storedUserId };
      setAuth(nextAuth);
      return nextAuth;
    }

    const login = await loginTechMarket();
    const nextAuth = { token: login.accessToken, userId: login.userId };
    setAuth(nextAuth);
    return nextAuth;
  }, [auth]);

  const refreshData = useCallback(async () => {
    await loadSpecialistData(() => true);
  }, [loadSpecialistData]);

  const createService = useCallback(async (input: SpecialistServiceInput) => {
    const currentAuth = await ensureAuth();
    await createSpecialistService(currentAuth.token, currentAuth.userId, input);
    await refreshData();
  }, [ensureAuth, refreshData]);

  const updateService = useCallback(async (serviceId: string, input: Partial<SpecialistServiceInput>) => {
    const currentAuth = await ensureAuth();
    await updateSpecialistService(currentAuth.token, currentAuth.userId, serviceId, input);
    await refreshData();
  }, [ensureAuth, refreshData]);

  const deleteService = useCallback(async (serviceId: string) => {
    const currentAuth = await ensureAuth();
    await deleteSpecialistService(currentAuth.token, currentAuth.userId, serviceId);
    await refreshData();
  }, [ensureAuth, refreshData]);

  const createPortfolioItem = useCallback(async (input: SpecialistPortfolioItemInput) => {
    const currentAuth = await ensureAuth();
    await createSpecialistPortfolioItem(currentAuth.token, currentAuth.userId, input);
    await refreshData();
  }, [ensureAuth, refreshData]);

  useEffect(() => {
    let isMounted = true;
    loadSpecialistData(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadSpecialistData]);

  return useMemo(
    () => ({
      profile,
      services,
      portfolio,
      profileSource,
      servicesSource,
      portfolioSource,
      loading,
      error,
      createService,
      updateService,
      deleteService,
      createPortfolioItem,
      refreshData,
    }),
    [profile, services, portfolio, profileSource, servicesSource, portfolioSource, loading, error, createService, updateService, deleteService, createPortfolioItem, refreshData],
  );
}
