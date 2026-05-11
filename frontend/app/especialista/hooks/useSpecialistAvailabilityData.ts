"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSpecialistAvailability,
  getSpecialistCalendar,
  loginTechMarket,
  type SpecialistAvailability,
  type SpecialistCalendarItem,
} from "@/lib/api/specialists";
import {
  recentActivity,
  specialistAvailabilityCards,
  type ActivityItem,
  type AvailabilityCard,
} from "../specialistData";

type BackendListResponse<T> = {
  value?: T[];
  Count?: number;
};

function normalizeList<T>(response: T[] | BackendListResponse<T>) {
  return Array.isArray(response) ? response : response.value ?? [];
}

function hasAvailabilityData(availability: SpecialistAvailability) {
  return Object.values(availability).some((value) => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return Boolean(value && typeof value === "object");
  });
}

function formatTimeRange(value: unknown, fallback = "Horario no definido") {
  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const range = value as { inicio?: unknown; fin?: unknown; start?: unknown; end?: unknown };
  const start = typeof range.inicio === "string" ? range.inicio : typeof range.start === "string" ? range.start : "";
  const end = typeof range.fin === "string" ? range.fin : typeof range.end === "string" ? range.end : "";

  if (start.trim() && end.trim()) {
    return `${start.trim()} - ${end.trim()}`;
  }

  return start.trim() || end.trim() || fallback;
}

function formatText(value: unknown, fallback: string) {
  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  return fallback;
}

export function mapBackendAvailabilityToCards(availability: SpecialistAvailability): AvailabilityCard[] {
  if (!hasAvailabilityData(availability)) {
    return specialistAvailabilityCards;
  }

  const status = formatText(availability.estado ?? availability.status, "Disponible");
  const days = formatText(availability.diasAtencion ?? availability.dias ?? availability.workingDays, "Dias no especificados");
  const hours = formatTimeRange(availability.horario ?? availability.horarios ?? availability.hours);
  const mode = formatText(availability.modalidad ?? availability.mode, "Modalidad no especificada");
  const coverage = formatText(availability.cobertura ?? availability.coverage, "Cobertura no especificada");
  const responseTime = formatTimeRange(
    availability.tiempoRespuesta ?? availability.responseTime ?? availability.detalle ?? availability.detail,
    "",
  );

  return [
    {
      id: "status",
      label: "Estado actual",
      title: status,
      detail: responseTime ? `Respuesta promedio: ${responseTime}` : "Estado obtenido desde backend",
      tone: status.toLowerCase().includes("dispon") ? "positive" : "neutral",
    },
    {
      id: "days",
      label: "Dias de atencion",
      title: days,
      detail: "Calendario operativo actualizado",
      tone: "neutral",
    },
    {
      id: "hours",
      label: "Horarios",
      title: hours,
      detail: "Horario principal de atencion",
      tone: "neutral",
    },
    {
      id: "mode",
      label: "Modalidad",
      title: mode,
      detail: coverage,
      tone: "neutral",
    },
  ];
}

export function mapBackendCalendarToActivity(items: SpecialistCalendarItem[]): ActivityItem[] {
  if (items.length === 0) {
    return recentActivity;
  }

  return items.map((item, index) => {
    const title = item.titulo ?? item.title ?? item.tipo ?? item.type ?? "Evento de agenda";
    const detail = item.descripcion ?? item.description ?? item.detalle ?? item.detail ?? "Bloque de calendario del especialista";
    const time = item.fecha ?? item.date ?? item.hora ?? item.time ?? "Fecha por confirmar";

    return {
      id: item.id ?? `calendar-${index}`,
      title,
      detail,
      time,
    };
  });
}

export function useSpecialistAvailabilityData() {
  const [availability, setAvailability] = useState<AvailabilityCard[]>(specialistAvailabilityCards);
  const [calendar, setCalendar] = useState<ActivityItem[]>(recentActivity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAvailabilityData() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const [availabilityResponse, calendarResponse] = await Promise.all([
          getSpecialistAvailability(login.accessToken, login.userId),
          getSpecialistCalendar(login.accessToken, login.userId),
        ]);

        if (!isMounted) {
          return;
        }

        const calendarItems = normalizeList(calendarResponse);
        setAvailability(mapBackendAvailabilityToCards(availabilityResponse));
        setCalendar(calendarItems.length > 0 ? mapBackendCalendarToActivity(calendarItems) : recentActivity);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar disponibilidad");
        setAvailability(specialistAvailabilityCards);
        setCalendar(recentActivity);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAvailabilityData();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () => ({ availability, calendar, loading, error }),
    [availability, calendar, loading, error],
  );
}
