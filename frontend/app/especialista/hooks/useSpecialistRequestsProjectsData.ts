"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSpecialistProjects,
  getSpecialistProjectsHistory,
  getSpecialistRequests,
  loginTechMarket,
  type SpecialistProject,
  type SpecialistProjectHistory,
  type SpecialistRequest,
} from "@/lib/api/specialists";
import {
  specialistProjectHistory,
  specialistProjects,
  specialistRequests,
  type SpecialistProjectHistoryItem,
  type SpecialistProjectItem,
  type SpecialistRequestItem,
} from "../specialistData";

type BackendListResponse<T> = {
  value?: T[];
  data?: T[];
  Count?: number;
};

function normalizeList<T>(response: T[] | BackendListResponse<T>) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.value ?? response.data ?? [];
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function mapBackendRequestToUiRequest(request: SpecialistRequest, index: number): SpecialistRequestItem {
  return {
    id: text(request.id ?? request.requestId, `request-${index}`),
    customer: text(request.cliente ?? request.customer ?? request.clientName, "Cliente no especificado"),
    service: text(request.servicio ?? request.service, "Servicio no especificado"),
    message: text(request.propuesta ?? request.proposal ?? request.mensaje ?? request.message, "Solicitud sin mensaje."),
    status: text(request.estado ?? request.status, "Pendiente"),
    date: text(request.fecha ?? request.date ?? request.createdAt, "Fecha no disponible"),
  };
}

export function mapBackendProjectToUiProject(project: SpecialistProject, index: number): SpecialistProjectItem {
  const title = project.nombre ?? project.name ?? project.titulo ?? project.title ?? project.servicio ?? project.service;

  return {
    id: text(project.id ?? project.projectId, `project-${index}`),
    customer: text(project.cliente ?? project.customer ?? project.clientName, "Cliente no especificado"),
    title: text(title, "Proyecto tecnico"),
    service: text(project.servicio ?? project.service, "Servicio no especificado"),
    status: text(project.estado ?? project.status, "Activo"),
    startDate: text(project.fechaInicio ?? project.startDate, "Inicio no definido"),
    endDate: text(project.fechaFin ?? project.endDate, "Fin no definido"),
    progress: numberValue(project.progreso ?? project.progress),
  };
}

export function mapBackendHistoryToUiHistory(
  history: SpecialistProjectHistory,
  index: number,
): SpecialistProjectHistoryItem {
  return {
    id: text(history.id ?? history.historyId, `history-${index}`),
    project: text(history.proyecto ?? history.project ?? history.titulo ?? history.title, "Proyecto tecnico"),
    detail: text(history.detalle ?? history.detail ?? history.descripcion ?? history.description, "Movimiento registrado."),
    status: text(history.estado ?? history.status, "Actualizado"),
    date: text(history.fecha ?? history.date ?? history.createdAt, "Fecha no disponible"),
  };
}

export function useSpecialistRequestsProjectsData() {
  const [requests, setRequests] = useState<SpecialistRequestItem[]>(specialistRequests);
  const [projects, setProjects] = useState<SpecialistProjectItem[]>(specialistProjects);
  const [history, setHistory] = useState<SpecialistProjectHistoryItem[]>(specialistProjectHistory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRequestsProjectsData() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const [requestsResponse, projectsResponse, historyResponse] = await Promise.all([
          getSpecialistRequests(login.accessToken, login.userId),
          getSpecialistProjects(login.accessToken, login.userId),
          getSpecialistProjectsHistory(login.accessToken, login.userId),
        ]);

        if (!isMounted) {
          return;
        }

        const backendRequests = normalizeList(requestsResponse);
        const backendProjects = normalizeList(projectsResponse);
        const backendHistory = normalizeList(historyResponse);

        setRequests(
          backendRequests.length > 0 ? backendRequests.map(mapBackendRequestToUiRequest) : specialistRequests,
        );
        setProjects(backendProjects.length > 0 ? backendProjects.map(mapBackendProjectToUiProject) : specialistProjects);
        setHistory(
          backendHistory.length > 0 ? backendHistory.map(mapBackendHistoryToUiHistory) : specialistProjectHistory,
        );
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar solicitudes y proyectos");
        setRequests(specialistRequests);
        setProjects(specialistProjects);
        setHistory(specialistProjectHistory);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRequestsProjectsData();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () => ({ requests, projects, history, loading, error }),
    [requests, projects, history, loading, error],
  );
}
