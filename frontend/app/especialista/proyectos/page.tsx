"use client";

import { useState } from "react";

import { loginTechMarket, updateSpecialistProjectStatus, type SpecialistProjectStatus } from "@/lib/api/specialists";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistRequestsProjectsData } from "../hooks/useSpecialistRequestsProjectsData";

const projectStatuses = [
  { label: "Planificado", value: "planificado" },
  { label: "En progreso", value: "en_progreso" },
  { label: "Completado", value: "completado" },
  { label: "Cancelado", value: "cancelado" },
] as const;

function normalizeProjectStatus(status: string) {
  return status.trim().toLowerCase().replace(/\s+/g, "_");
}

function isSameStatus(currentStatus: string, nextStatus: string) {
  return normalizeProjectStatus(currentStatus) === normalizeProjectStatus(nextStatus);
}

function isTransitionAllowed(currentStatus: string, targetStatus: string) {
  const current = normalizeProjectStatus(currentStatus);
  const target = normalizeProjectStatus(targetStatus);

  if (target === "planificado") {
    return false;
  }

  if (current === "aceptada" || current === "aceptado") {
    return target === "en_progreso" || target === "cancelado";
  }

  if (current === "planificado") {
    return target === "en_progreso" || target === "cancelado";
  }

  if (current === "en_progreso") {
    return target === "completado" || target === "cancelado";
  }

  if (current === "completado" || current === "cancelado") {
    return false;
  }

  return false;
}

function shouldShowLineThrough(currentStatus: string, targetStatus: string) {
  const current = normalizeProjectStatus(currentStatus);
  const target = normalizeProjectStatus(targetStatus);

  if (current === target) {
    return true;
  }

  if (current === "en_progreso") {
    return target === "planificado";
  }

  if (current === "completado") {
    return target === "planificado" || target === "en_progreso";
  }

  return false;
}

function isFallbackProject(projectId?: string | null) {
  const normalizedProjectId = projectId?.trim();

  return !normalizedProjectId || normalizedProjectId.startsWith("proj-");
}

function isMissingProjectId(projectId?: string | null) {
  return !projectId?.trim();
}

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("final") || normalized.includes("complet")) {
    return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  }

  if (normalized.includes("progreso") || normalized.includes("activo")) {
    return "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
  }

  return "border-amber-300/35 bg-amber-300/10 text-amber-100";
}

export default function EspecialistaProyectosPage() {
  const { projects, history, loading, error, refreshRequestsProjectsData } = useSpecialistRequestsProjectsData();
  const [processingProjectId, setProcessingProjectId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusErrorMessage, setStatusErrorMessage] = useState<string | null>(null);
  const [projectStatusOverrides, setProjectStatusOverrides] = useState<Record<string, string>>({});
  const [hasStatusUpdateAttempted, setHasStatusUpdateAttempted] = useState(false);

  async function handleUpdateProjectStatus(
    projectId: string,
    currentStatus: string,
    status: (typeof projectStatuses)[number]["value"],
  ) {
    if (isFallbackProject(projectId)) {
      setSuccessMessage(null);
      setStatusErrorMessage("No se puede actualizar este proyecto porque no existe como registro real del backend.");
      setHasStatusUpdateAttempted(true);
      return;
    }

    if (!isTransitionAllowed(currentStatus, status)) {
      return;
    }

    const previousStatus = currentStatus;
    const nextStatusLabel = projectStatuses.find((projectStatus) => projectStatus.value === status)?.label ?? status;

    setProcessingProjectId(projectId);
    setSuccessMessage(null);
    setStatusErrorMessage(null);
    setHasStatusUpdateAttempted(true);

    try {
      const login = await loginTechMarket();
      await updateSpecialistProjectStatus(login.accessToken, login.userId, projectId, {
        estado: status as SpecialistProjectStatus,
      });
      await refreshRequestsProjectsData();

      setProjectStatusOverrides((current) => ({ ...current, [projectId]: nextStatusLabel }));
      setStatusErrorMessage(null);
      setSuccessMessage("Estado del proyecto actualizado correctamente.");
    } catch (err) {
      setProjectStatusOverrides((current) => ({ ...current, [projectId]: previousStatus }));
      setSuccessMessage(null);
      setStatusErrorMessage(err instanceof Error ? err.message : "No se pudo actualizar el estado del proyecto.");
    } finally {
      setProcessingProjectId(null);
    }
  }

  return (
    <SpecialistShell sectionLabel="Proyectos" statusMessage="Proyectos tecnicos activos e historial">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">PROYECTOS DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Proyectos activos</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Seguimiento de trabajos tecnicos, estado operativo, fechas y progreso visible para mantener control del servicio.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Proyectos activos</p>
          <p className="mt-2 text-2xl font-bold text-white">{projects.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Historial</p>
          <p className="mt-2 text-2xl font-bold text-white">{history.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modo</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Conectado</p>
          <p className="mt-1 text-xs text-cyan-100/70">Actualizacion de estado activa</p>
        </article>
      </section>

      {successMessage && !statusErrorMessage ? (
        <p className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-100">
          {successMessage}
        </p>
      ) : null}

      {statusErrorMessage ? (
        <p className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-4 text-sm font-semibold text-rose-100">
          {statusErrorMessage}
        </p>
      ) : null}

      {!hasStatusUpdateAttempted && !statusErrorMessage && error ? (
        <p className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {projects.length === 0 ? (
          <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 text-sm text-cyan-100/75 lg:col-span-2">
            No hay proyectos activos todavía.
          </article>
        ) : null}
        {projects.map((project) => {
          const isProcessing = loading || processingProjectId === project.id;
          const projectStatus = projectStatusOverrides[project.id] ?? project.status;
          const isFallback = isFallbackProject(project.id);
          const isMissingId = isMissingProjectId(project.id);

          return (
            <article key={project.id} className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Proyecto</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{project.title}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(projectStatus)}`}>
                  {projectStatus}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cliente</p>
                  <p className="mt-2 text-sm font-semibold text-cyan-50">{project.customer}</p>
                </article>
                <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Servicio</p>
                  <p className="mt-2 text-sm font-semibold text-cyan-50">{project.service}</p>
                </article>
                <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Fecha de asignación</p>
                  <p className="mt-2 text-sm text-cyan-100/85">{project.assignmentDate}</p>
                </article>
                {project.estimatedEndDate ? (
                  <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Fin estimado</p>
                    <p className="mt-2 text-sm text-cyan-100/85">{project.estimatedEndDate}</p>
                  </article>
                ) : null}
              </div>

              {typeof project.progress === "number" ? (
                <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-cyan-100/75">
                    <span>Progreso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full border border-cyan-100/12 bg-slate-950/55">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.95))]"
                      style={{ width: `${Math.min(Math.max(project.progress, 0), 100)}%` }}
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-5 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Actualizar estado</p>
                {isFallback ? (
                  <p className="mt-2 text-xs font-medium text-cyan-100/60">
                    Proyecto de respaldo: acciones no disponibles hasta sincronizar con backend.
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-3">
                  {projectStatuses.map((status) => {
                    const normalizedProjectStatus = normalizeProjectStatus(projectStatus);
                    const isAcceptedStatus = normalizedProjectStatus === "aceptada" || normalizedProjectStatus === "aceptado";
                    const statusLabel = status.value === "planificado" && isAcceptedStatus ? "Aceptado / planificado" : status.label;
                    const isAllowedStatus = isTransitionAllowed(projectStatus, status.value);
                    const isDisabledStatus = isMissingId || !isAllowedStatus || isSameStatus(projectStatus, status.value);
                    const showLineThrough = shouldShowLineThrough(projectStatus, status.value);

                    return (
                      <button
                        key={status.value}
                        type="button"
                        disabled={isProcessing || isDisabledStatus}
                        onClick={() => handleUpdateProjectStatus(project.id, projectStatus, status.value)}
                        className={`rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isDisabledStatus ? "cursor-not-allowed opacity-50" : ""
                        } ${
                          showLineThrough ? "line-through" : ""
                        }`}
                      >
                        {statusLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <h2 className="text-2xl font-bold text-white">Historial de proyectos</h2>
        <p className="mt-2 text-sm leading-6 text-cyan-100/75">
          Registro de movimientos recientes, cambios de estado y avances reportados en trabajos tecnicos.
        </p>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {history.length === 0 ? (
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/75 lg:col-span-3">
              No hay historial disponible.
            </article>
          ) : null}
          {history.map((item) => (
            <article key={item.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold text-cyan-50">{item.service}</p>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-sm leading-6 text-cyan-100/80">
                <p>Cliente: {item.customer}</p>
                {item.total ? <p>Total: {item.total}</p> : null}
                {item.detail && item.detail !== "Movimiento registrado." ? <p>{item.detail}</p> : null}
              </div>
              <p className="mt-3 text-xs text-cyan-100/65">{item.date}</p>
            </article>
          ))}
        </div>
      </section>
    </SpecialistShell>
  );
}
