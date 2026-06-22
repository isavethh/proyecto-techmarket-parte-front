"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSpecialistProfile,
  loginTechMarket,
  type SpecialistProfile as BackendSpecialistProfile,
} from "@/lib/api/specialists";
import { getTechmarketToken, getTechmarketUserId } from "@/lib/auth/tokenStore";
import { debugSpecialistResult, type DatasetSource } from "./specialistBackendHelpers";
import type { SpecialistUiProfile } from "./useSpecialistBackendData";

const PROFILE_CACHE_KEY = "tm_specialist_profile_cache";

function getCachedProfile(): SpecialistUiProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_CACHE_KEY);
    return raw ? (JSON.parse(raw) as SpecialistUiProfile) : null;
  } catch {
    return null;
  }
}

function setCachedProfile(profile: SpecialistUiProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
  } catch {
    // ignorar errores de storage
  }
}

export const neutralSpecialistProfile: SpecialistUiProfile = {
  name: "Perfil no configurado todavía",
  avatar: "SD",
  specialization: "Especialidad no definida",
  location: "Ubicación no especificada",
  bio: "Perfil no configurado todavía.",
};

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || neutralSpecialistProfile.avatar;
}

export function hasBackendProfileData(value: unknown) {
  return Boolean(value && typeof value === "object" && Object.values(value).some(Boolean));
}

export function mapBackendProfileToUiProfile(profile: BackendSpecialistProfile): SpecialistUiProfile {
  const name = profile.nombre?.trim() || neutralSpecialistProfile.name;

  return {
    name,
    avatar: getInitials(name),
    specialization: profile.especialidad?.trim() || neutralSpecialistProfile.specialization,
    location: profile.ubicacion?.trim() || neutralSpecialistProfile.location,
    bio: profile.bio?.trim() || neutralSpecialistProfile.bio,
  };
}

export function useSpecialistProfileData(enabled = true) {
  // Inicializar con cache para evitar el flash visual en cada navegación
  const [profile, setProfile] = useState<SpecialistUiProfile>(
    () => getCachedProfile() ?? neutralSpecialistProfile,
  );
  const [profileSource, setProfileSource] = useState<DatasetSource>(
    () => (getCachedProfile() ? "backend" : "empty"),
  );
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!enabled) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const storedToken = getTechmarketToken();
        const storedUserId = getTechmarketUserId();

        let token: string;
        let userId: string;

        if (storedToken && storedUserId) {
          token = storedToken;
          userId = storedUserId;
        } else {
          const login = await loginTechMarket();
          token = login.accessToken;
          userId = login.userId;
        }

        const profileResponse = await getSpecialistProfile(token, userId);

        if (!isMounted) {
          return;
        }

        debugSpecialistResult("[specialist profile standalone]", profileResponse);

        if (hasBackendProfileData(profileResponse)) {
          const uiProfile = mapBackendProfileToUiProfile(profileResponse);
          setProfile(uiProfile);
          setProfileSource("backend");
          setCachedProfile(uiProfile);
        } else {
          setProfile(neutralSpecialistProfile);
          setProfileSource("empty");
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar perfil del especialista");
        setProfile(neutralSpecialistProfile);
        setProfileSource("empty");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return useMemo(
    () => ({ profile, profileSource, loading, error }),
    [profile, profileSource, loading, error],
  );
}
