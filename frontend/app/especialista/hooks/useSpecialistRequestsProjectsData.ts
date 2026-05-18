"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getSpecialistProjects,
  getSpecialistProjectsHistory,
  getSpecialistRequests,
  loginTechMarket,
  respondSpecialistRequest,
  updateSpecialistProjectStatus,
  type SpecialistProject,
  type SpecialistProjectHistory,
  type SpecialistProjectStatus,
  type SpecialistRequest,
  type SpecialistRequestAction,
} from "@/lib/api/specialists";
import {
  specialistProjectHistory,
  specialistProjects,
  specialistRequests,
  type SpecialistProjectHistoryItem,
  type SpecialistProjectItem,
  type SpecialistRequestItem,
} from "../specialistData";
import { debugSpecialistResult, getDatasetSource, normalizeBackendList, type DatasetSource } from "./specialistBackendHelpers";

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

type SpecialistRequestWithUrgency = SpecialistRequestItem & { urgency: string };
type SpecialistProjectWithAssignment = SpecialistProjectItem & { assignmentDate: string; estimatedEndDate?: string };
type SpecialistProjectHistoryWithBackendData = SpecialistProjectHistoryItem & {
  customer: string;
  service: string;
  total?: string;
};

function withFallbackProjectFields(project: SpecialistProjectItem): SpecialistProjectWithAssignment {
  return {
    ...project,
    assignmentDate: project.startDate || "Fecha no disponible",
    estimatedEndDate: project.endDate && project.endDate !== "Fin no definido" ? project.endDate : undefined,
  };
}

function withFallbackHistoryFields(history: SpecialistProjectHistoryItem): SpecialistProjectHistoryWithBackendData {
  return {
    ...history,
    service: history.project,
    customer: "Cliente no especificado",
    total: undefined,
  };
}

export function mapBackendRequestToUiRequest(request: SpecialistRequest, index: number): SpecialistRequestWithUrgency {
  const requestWithUrgency = request as SpecialistRequest & { urgencia?: unknown };

  return {
    id: text(request.id ?? request.requestId, `request-${index}`),
    customer: text(request.cliente ?? request.customer ?? request.clientName, "Cliente no especificado"),
    service: text(request.servicio ?? request.service, "Servicio no especificado"),
    message: text(request.propuesta ?? request.proposal ?? request.mensaje ?? request.message, "Sin mensaje del cliente"),
    status: text(request.estado ?? request.status, "Pendiente"),
    date: text(request.fecha ?? request.date ?? request.createdAt, "Fecha no disponible"),
    urgency: text(requestWithUrgency.urgencia, "No registrada"),
  };
}

export function mapBackendProjectToUiProject(project: SpecialistProject, index: number): SpecialistProjectWithAssignment {
  const projectWithBackendDates = project as SpecialistProject & { fechaAsignacion?: unknown; finEstimado?: unknown; total?: unknown };
  const title = project.nombre ?? project.name ?? project.titulo ?? project.title ?? project.servicio ?? project.service;
  const assignmentDate = text(projectWithBackendDates.fechaAsignacion ?? project.fechaInicio ?? project.startDate, "Fecha no disponible");
  const estimatedEndDate = text(projectWithBackendDates.finEstimado ?? project.fechaFin ?? project.endDate, "");

  return {
    id: text(project.id ?? project.projectId, `project-${index}`),
    customer: text(project.cliente ?? project.customer ?? project.clientName, "Cliente no especificado"),
    title: text(title, "Proyecto tecnico"),
    service: text(project.servicio ?? project.service, "Servicio no especificado"),
    status: text(project.estado ?? project.status, "Activo"),
    startDate: assignmentDate,
    endDate: estimatedEndDate || "No disponible",
    assignmentDate,
    estimatedEndDate: estimatedEndDate || undefined,
    progress: numberValue(project.progreso ?? project.progress),
  };
}

export function mapBackendHistoryToUiHistory(
  history: SpecialistProjectHistory,
  index: number,
): SpecialistProjectHistoryWithBackendData {
  const historyWithBackendData = history as SpecialistProjectHistory & {
    cliente?: unknown;
    customer?: unknown;
    servicio?: unknown;
    service?: unknown;
    total?: unknown;
  };
  const service = text(historyWithBackendData.servicio ?? historyWithBackendData.service ?? history.proyecto ?? history.project ?? history.titulo ?? history.title, "Proyecto tecnico");

  return {
    id: text(history.id ?? history.historyId, `history-${index}`),
    project: service,
    service,
    customer: text(historyWithBackendData.cliente ?? historyWithBackendData.customer, "Cliente no especificado"),
    detail: text(history.detalle ?? history.detail ?? history.descripcion ?? history.description, "Movimiento registrado."),
    status: text(history.estado ?? history.status, "Actualizado"),
    date: text(history.fecha ?? history.date ?? history.createdAt, "Fecha no disponible"),
    total: text(historyWithBackendData.total, ""),
  };
}

export function useSpecialistRequestsProjectsData() {
  const authRef = useRef<{ token: string; userId: string } | null>(null);
  const [requests, setRequests] = useState<SpecialistRequestWithUrgency[]>([]);
  const [projects, setProjects] = useState<SpecialistProjectWithAssignment[]>([]);
  const [history, setHistory] = useState<SpecialistProjectHistoryWithBackendData[]>([]);
  const [requestsSource, setRequestsSource] = useState<DatasetSource>("empty");
  const [projectsSource, setProjectsSource] = useState<DatasetSource>("empty");
  const [historySource, setHistorySource] = useState<DatasetSource>("empty");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRequestsProjectsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentAuth =
        authRef.current ?? (await loginTechMarket().then((login) => ({ token: login.accessToken, userId: login.userId })));
      authRef.current = currentAuth;

      const [requestsResult, projectsResult, historyResult] = await Promise.allSettled([
        getSpecialistRequests(currentAuth.token, currentAuth.userId),
        getSpecialistProjects(currentAuth.token, currentAuth.userId),
        getSpecialistProjectsHistory(currentAuth.token, currentAuth.userId),
      ]);

      debugSpecialistResult("[specialist requests]", requestsResult);
      debugSpecialistResult("[specialist projects]", projectsResult);
      debugSpecialistResult("[specialist projects history]", historyResult);

      if (requestsResult.status === "fulfilled") {
        const backendRequests = normalizeBackendList<SpecialistRequest>(requestsResult.value);
        setRequests(backendRequests.map(mapBackendRequestToUiRequest));
        setRequestsSource(getDatasetSource(backendRequests));
      } else {
        setRequests(specialistRequests.map((request) => ({ ...request, urgency: "No registrada" })));
        setRequestsSource("fallback");
      }

      if (projectsResult.status === "fulfilled") {
        const backendProjects = normalizeBackendList<SpecialistProject>(projectsResult.value);
        setProjects(backendProjects.map(mapBackendProjectToUiProject));
        setProjectsSource(getDatasetSource(backendProjects));
      } else {
        setProjects(specialistProjects.map(withFallbackProjectFields));
        setProjectsSource("fallback");
      }

      if (historyResult.status === "fulfilled") {
        const backendHistory = normalizeBackendList<SpecialistProjectHistory>(historyResult.value);
        setHistory(backendHistory.map(mapBackendHistoryToUiHistory));
        setHistorySource(getDatasetSource(backendHistory));
      } else {
        setHistory(specialistProjectHistory.map(withFallbackHistoryFields));
        setHistorySource("fallback");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar solicitudes y proyectos");
      setRequests(specialistRequests.map((request) => ({ ...request, urgency: "No registrada" })));
      setProjects(specialistProjects.map(withFallbackProjectFields));
      setHistory(specialistProjectHistory.map(withFallbackHistoryFields));
      setRequestsSource("fallback");
      setProjectsSource("fallback");
      setHistorySource("fallback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRequestsProjectsData();
  }, [refreshRequestsProjectsData]);

  const respondRequest = useCallback(
    async (requestId: string, action: SpecialistRequestAction) => {
      const currentAuth = authRef.current;

      if (!currentAuth?.token || !currentAuth.userId) {
        setError("No hay sesion activa para responder la solicitud");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await respondSpecialistRequest(currentAuth.token, currentAuth.userId, requestId, { accion: action });
        await refreshRequestsProjectsData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al responder la solicitud");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshRequestsProjectsData],
  );

  const updateProjectStatus = useCallback(
    async (projectId: string, status: SpecialistProjectStatus) => {
      const currentAuth = authRef.current;

      if (!currentAuth?.token || !currentAuth.userId) {
        setError("No hay sesion activa para actualizar el proyecto");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await updateSpecialistProjectStatus(currentAuth.token, currentAuth.userId, projectId, { estado: status });
        await refreshRequestsProjectsData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al actualizar el proyecto");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshRequestsProjectsData],
  );

  return useMemo(
    () => ({
      requests,
      projects,
      history,
      requestsSource,
      projectsSource,
      historySource,
      loading,
      error,
      respondRequest,
      updateProjectStatus,
      refreshRequestsProjectsData,
    }),
    [
      requests,
      projects,
      history,
      requestsSource,
      projectsSource,
      historySource,
      loading,
      error,
      respondRequest,
      updateProjectStatus,
      refreshRequestsProjectsData,
    ],
  );
}
