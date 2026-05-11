"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSpecialistProfile,
  loginTechMarket,
  type SpecialistProfile as BackendSpecialistProfile,
} from "@/lib/api/specialists";
import { specialistProfile } from "../specialistData";
import { debugSpecialistResult, type DatasetSource } from "./specialistBackendHelpers";
import type { SpecialistUiProfile } from "./useSpecialistBackendData";

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
    bio: "No especificado",
  };
}

export function useSpecialistProfileData(enabled = true) {
  const [profile, setProfile] = useState<SpecialistUiProfile>(neutralSpecialistProfile);
  const [profileSource, setProfileSource] = useState<DatasetSource>("empty");
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

        const login = await loginTechMarket();
        const profileResponse = await getSpecialistProfile(login.accessToken, login.userId);

        if (!isMounted) {
          return;
        }

        debugSpecialistResult("[specialist profile standalone]", profileResponse);

        if (hasBackendProfileData(profileResponse)) {
          setProfile(mapBackendProfileToUiProfile(profileResponse));
          setProfileSource("backend");
        } else {
          setProfile(neutralSpecialistProfile);
          setProfileSource("empty");
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar perfil del especialista");
        setProfile(specialistProfile);
        setProfileSource("fallback");
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
