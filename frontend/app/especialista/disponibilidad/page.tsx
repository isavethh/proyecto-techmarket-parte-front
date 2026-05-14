"use client";

import { FormEvent, useEffect, useState } from "react";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistBackendData } from "../hooks/useSpecialistBackendData";
import { useSpecialistAvailabilityData } from "../hooks/useSpecialistAvailabilityData";

type AvailabilityForm = {
  estado: string;
  dias: string;
  inicio: string;
  fin: string;
  modalidad: string;
  cobertura: string;
  tiempoRespuesta: string;
};

type CalendarBlockForm = {
  fecha: string;
  hora: string;
  fin: string;
  motivo: string;
};

type CalendarDisplayItem = {
  id?: string;
  cliente?: string;
  servicio?: string;
  fecha?: string;
  hora?: string;
  estado?: string;
  modalidad?: string;
  title?: string;
  detail?: string;
  time?: string;
};

const responseTimeStorageKey = "specialist-availability-response-time";

function listToInput(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : "";
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getTimeRange(value: unknown) {
  if (!value || typeof value !== "object") {
    return { inicio: "", fin: "" };
  }

  const range = value as { inicio?: unknown; fin?: unknown; start?: unknown; end?: unknown };
  return {
    inicio: typeof range.inicio === "string" ? range.inicio : typeof range.start === "string" ? range.start : "",
    fin: typeof range.fin === "string" ? range.fin : typeof range.end === "string" ? range.end : "",
  };
}

function isEndAfterStart(start: string, end: string) {
  return !start || !end || end > start;
}

function getStoredResponseTime() {
  return typeof window === "undefined" ? "" : window.localStorage.getItem(responseTimeStorageKey) ?? "";
}

function getAvailabilityFormFromBackend(availabilityDetail: ReturnType<typeof useSpecialistAvailabilityData>["availabilityDetail"]): AvailabilityForm {
  const schedule = getTimeRange(availabilityDetail?.horario ?? availabilityDetail?.horarios ?? availabilityDetail?.hours);
  return {
    estado: availabilityDetail?.estado ?? availabilityDetail?.status ?? "disponible",
    dias: listToInput(availabilityDetail?.diasAtencion ?? availabilityDetail?.dias ?? availabilityDetail?.workingDays),
    inicio: schedule.inicio,
    fin: schedule.fin,
    modalidad: listToInput(availabilityDetail?.modalidad ?? availabilityDetail?.mode),
    cobertura: availabilityDetail?.cobertura ?? availabilityDetail?.coverage ?? "",
    tiempoRespuesta: availabilityDetail?.tiempoRespuesta ?? availabilityDetail?.responseTime ?? "",
  };
}

function getCalendarItemView(item: CalendarDisplayItem) {
  const id = item.id ?? "";
  const isProject = id.startsWith("PROJ-");
  const isBlock = id.startsWith("BLK-");
  const normalizedStatus = item.estado?.trim().toLowerCase() ?? "";
  const label = isProject
    ? normalizedStatus === "completado"
      ? "Servicio finalizado"
      : normalizedStatus === "cancelado"
        ? "Servicio cancelado"
        : "Servicio agendado"
    : isBlock
      ? "Bloqueo"
      : "Bloqueo";
  const fallbackTitle = isProject ? "Servicio agendado" : "Bloque de calendario";
  const title = item.servicio?.trim() || item.title?.trim() || fallbackTitle;
  const backendClient = item.cliente?.trim();
  const subtitle = isBlock ? "Horario reservado" : backendClient || item.detail?.trim() || "Horario reservado";
  const modality = item.modalidad?.trim();

  return {
    isBlock,
    isProject,
    label,
    title,
    subtitle,
    fecha: item.fecha?.trim() || item.time?.trim() || "Fecha no disponible",
    timeLabel: isBlock ? (item.hora?.trim() ? "Hora" : "Horario") : "Hora",
    timeValue: isBlock ? item.hora?.trim() || "Horario no disponible" : item.hora?.trim(),
    estado: isBlock ? "bloqueado" : item.estado?.trim(),
    modalidad: modality && modality !== "no_disponible" ? modality : "",
  };
}

export default function EspecialistaDisponibilidadPage() {
  const {
    availabilityDetail,
    calendarDetail,
    loading,
    actionLoading,
    error,
    actionError,
    updateAvailability,
    createCalendarBlock,
    deleteCalendarBlock,
  } = useSpecialistAvailabilityData();
  const { profile } = useSpecialistBackendData();
  const [availabilityForm, setAvailabilityForm] = useState<AvailabilityForm>({
    estado: "",
    dias: "",
    inicio: "",
    fin: "",
    modalidad: "",
    cobertura: "",
    tiempoRespuesta: "",
  });
  const [calendarBlockForm, setCalendarBlockForm] = useState<CalendarBlockForm>({
    fecha: "",
    hora: "",
    fin: "",
    motivo: "",
  });
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isCalendarBlockModalOpen, setIsCalendarBlockModalOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [calendarBlockToDelete, setCalendarBlockToDelete] = useState<CalendarDisplayItem | null>(null);
  const [deleteBlockError, setDeleteBlockError] = useState("");
  const [storedResponseTime, setStoredResponseTime] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setStoredResponseTime(getStoredResponseTime());
    });
  }, []);

  const backendAvailabilityForm = getAvailabilityFormFromBackend(availabilityDetail);
  const currentAvailabilityForm = {
    estado: availabilityForm.estado || backendAvailabilityForm.estado,
    dias: availabilityForm.dias || backendAvailabilityForm.dias,
    inicio: availabilityForm.inicio || backendAvailabilityForm.inicio,
    fin: availabilityForm.fin || backendAvailabilityForm.fin,
    modalidad: availabilityForm.modalidad || backendAvailabilityForm.modalidad,
    cobertura: availabilityForm.cobertura || backendAvailabilityForm.cobertura,
    tiempoRespuesta: availabilityForm.tiempoRespuesta || backendAvailabilityForm.tiempoRespuesta || storedResponseTime,
  };
  const visibleCalendarBlocks = calendarDetail as CalendarDisplayItem[];

  const handleAvailabilitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setFormError("");

    if (!currentAvailabilityForm.inicio || !currentAvailabilityForm.fin) {
      setFormError("Hora inicio y hora fin son requeridas.");
      return;
    }

    if (!isEndAfterStart(currentAvailabilityForm.inicio, currentAvailabilityForm.fin)) {
      setFormError("La hora fin debe ser mayor a la hora inicio.");
      return;
    }

    try {
      await updateAvailability({
        estado: currentAvailabilityForm.estado,
        dias: splitList(currentAvailabilityForm.dias),
        inicio: currentAvailabilityForm.inicio,
        fin: currentAvailabilityForm.fin,
        modalidad: splitList(currentAvailabilityForm.modalidad),
        cobertura: currentAvailabilityForm.cobertura.trim() || undefined,
        tiempoRespuesta: currentAvailabilityForm.tiempoRespuesta.trim() || undefined,
      });
      setStoredResponseTime(currentAvailabilityForm.tiempoRespuesta.trim());
      window.localStorage.setItem(responseTimeStorageKey, currentAvailabilityForm.tiempoRespuesta.trim());
      setFormMessage("Disponibilidad actualizada.");
      setIsAvailabilityModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo actualizar disponibilidad.");
    }
  };

  const handleCalendarBlockSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");
    setFormError("");

    if (!calendarBlockForm.fecha || !calendarBlockForm.hora || !calendarBlockForm.fin) {
      setFormError("Fecha, hora inicio y hora fin son requeridas para el bloque.");
      return;
    }

    if (!isEndAfterStart(calendarBlockForm.hora, calendarBlockForm.fin)) {
      setFormError("La hora fin del bloque debe ser mayor a la hora inicio.");
      return;
    }

    try {
      await createCalendarBlock({
        fecha: calendarBlockForm.fecha,
        hora: calendarBlockForm.hora,
        fin: calendarBlockForm.fin,
        motivo: calendarBlockForm.motivo.trim() || "Bloque de agenda",
      });
      setCalendarBlockForm({ fecha: "", hora: "", fin: "", motivo: "" });
      setFormMessage("Bloque agregado a la agenda.");
      setIsCalendarBlockModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo crear el bloque de agenda.");
    }
  };

  const handleDeleteCalendarBlock = async () => {
    const blockId = calendarBlockToDelete?.id;

    if (!blockId?.startsWith("BLK-")) {
      setDeleteBlockError("Solo se pueden eliminar bloqueos manuales de calendario.");
      return;
    }

    try {
      setDeleteBlockError("");
      setFormMessage("");
      setFormError("");
      await deleteCalendarBlock(blockId);
      setCalendarBlockToDelete(null);
      setFormMessage("Bloqueo eliminado correctamente.");
    } catch (err) {
      setDeleteBlockError(err instanceof Error ? err.message : "No se pudo eliminar el bloqueo.");
    }
  };

  return (
    <SpecialistShell sectionLabel="Disponibilidad" statusMessage="Estado operativo y horarios actualizados" profile={profile}>
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">DISPONIBILIDAD DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Agenda y capacidad operativa</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Informacion clara para decidir si contactar en este momento o programar atencion.
        </p>
        {error ? <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100">{error}</p> : null}
        {actionError ? <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100">{actionError}</p> : null}
        {formError ? <p className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100">{formError}</p> : null}
        {formMessage ? <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">{formMessage}</p> : null}
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="tech-mono text-xs text-cyan-200/75">RESUMEN OPERATIVO</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Disponibilidad actual</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setFormError("");
                setFormMessage("");
                setIsAvailabilityModalOpen(true);
              }}
              className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
            >
              Editar disponibilidad
            </button>
            <button
              type="button"
              onClick={() => {
                setFormError("");
                setFormMessage("");
                setIsCalendarBlockModalOpen(true);
              }}
              className="rounded-full border border-cyan-100/10 bg-white/5 px-5 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-white/10"
            >
              Crear bloqueo
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-2xl border border-emerald-300/35 bg-emerald-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/80">Estado actual</p>
            <p className="mt-2 text-sm font-semibold text-emerald-100">{currentAvailabilityForm.estado || "No configurado"}</p>
          </article>
          <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Dias de atencion</p>
            <p className="mt-2 text-sm font-semibold text-cyan-50">{currentAvailabilityForm.dias || "No configurado"}</p>
          </article>
          <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Horario</p>
            <p className="mt-2 text-sm font-semibold text-cyan-50">
              {currentAvailabilityForm.inicio && currentAvailabilityForm.fin
                ? `${currentAvailabilityForm.inicio} - ${currentAvailabilityForm.fin}`
                : "No configurado"}
            </p>
          </article>
          <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modalidad</p>
            <p className="mt-2 text-sm font-semibold text-cyan-50">{currentAvailabilityForm.modalidad || "No configurado"}</p>
          </article>
          {currentAvailabilityForm.tiempoRespuesta ? (
            <article className="rounded-2xl border border-cyan-300/35 bg-cyan-300/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Tiempo de respuesta</p>
              <p className="mt-2 text-sm font-semibold text-cyan-50">{currentAvailabilityForm.tiempoRespuesta}</p>
            </article>
          ) : null}
        </div>
      </section>

      {isAvailabilityModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <form onSubmit={handleAvailabilitySubmit} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-cyan-100/10 bg-slate-950 p-5 shadow-2xl shadow-cyan-950/30">
            <div className="flex items-start justify-between gap-4">
              <div>
          <p className="tech-mono text-xs text-cyan-200/75">CONFIGURAR DISPONIBILIDAD</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Actualizar horario operativo</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailabilityModalOpen(false)}
                className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-sm font-semibold text-cyan-50 transition hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Estado</span>
              <select
                value={currentAvailabilityForm.estado}
                onChange={(event) => setAvailabilityForm((current) => ({ ...current, estado: event.target.value }))}
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupado">Ocupado</option>
                <option value="ausente">Ausente</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Dias disponibles</span>
              <input
                value={currentAvailabilityForm.dias}
                onChange={(event) => setAvailabilityForm((current) => ({ ...current, dias: event.target.value }))}
                placeholder="lunes, martes, viernes"
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Hora inicio</span>
              <input
                type="time"
                value={currentAvailabilityForm.inicio}
                onChange={(event) => setAvailabilityForm((current) => ({ ...current, inicio: event.target.value }))}
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Hora fin</span>
              <input
                type="time"
                value={currentAvailabilityForm.fin}
                onChange={(event) => setAvailabilityForm((current) => ({ ...current, fin: event.target.value }))}
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Modalidades</span>
              <input
                value={currentAvailabilityForm.modalidad}
                onChange={(event) => setAvailabilityForm((current) => ({ ...current, modalidad: event.target.value }))}
                placeholder="presencial, remoto, domicilio"
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Cobertura</span>
              <input
                value={currentAvailabilityForm.cobertura}
                onChange={(event) => setAvailabilityForm((current) => ({ ...current, cobertura: event.target.value }))}
                placeholder="Santa Cruz de la Sierra"
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
              <span>Tiempo de respuesta visible</span>
              <input
                value={currentAvailabilityForm.tiempoRespuesta}
                onChange={(event) => setAvailabilityForm((current) => ({ ...current, tiempoRespuesta: event.target.value }))}
                placeholder="Ej: 30 minutos"
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={actionLoading}
            className="mt-5 rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? "Guardando..." : "Guardar disponibilidad"}
          </button>
        </form>
        </div>
      ) : null}

      {isCalendarBlockModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <form onSubmit={handleCalendarBlockSubmit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-100/10 bg-slate-950 p-5 shadow-2xl shadow-cyan-950/30">
            <div className="flex items-start justify-between gap-4">
              <div>
          <p className="tech-mono text-xs text-cyan-200/75">BLOQUE DE AGENDA</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Crear bloqueo de calendario</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarBlockModalOpen(false)}
                className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-sm font-semibold text-cyan-50 transition hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
              <span>Fecha</span>
              <input
                type="date"
                value={calendarBlockForm.fecha}
                onChange={(event) => setCalendarBlockForm((current) => ({ ...current, fecha: event.target.value }))}
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Hora inicio</span>
              <input
                type="time"
                value={calendarBlockForm.hora}
                onChange={(event) => setCalendarBlockForm((current) => ({ ...current, hora: event.target.value }))}
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85">
              <span>Hora fin</span>
              <input
                type="time"
                value={calendarBlockForm.fin}
                onChange={(event) => setCalendarBlockForm((current) => ({ ...current, fin: event.target.value }))}
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
              <span>Motivo</span>
              <input
                value={calendarBlockForm.motivo}
                onChange={(event) => setCalendarBlockForm((current) => ({ ...current, motivo: event.target.value }))}
                placeholder="Ej: visita tecnica programada"
                className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={actionLoading}
            className="mt-5 rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? "Guardando..." : "Crear bloque"}
          </button>
        </form>
        </div>
      ) : null}

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <h2 className="text-2xl font-bold text-white">Agenda y bloqueos de calendario</h2>
        <p className="mt-2 text-sm leading-6 text-cyan-100/75">
          Servicios agendados y horarios bloqueados obtenidos desde el backend para evitar cruces de agenda.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {error ? (
            <article className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100 md:col-span-3">
              No se pudieron cargar los bloques de calendario.
            </article>
          ) : null}
          {!error && loading ? (
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-3 text-sm text-cyan-100/75 md:col-span-3">
              Cargando bloques de calendario...
            </article>
          ) : null}
          {!error && !loading && visibleCalendarBlocks.length === 0 ? (
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-3 text-sm text-cyan-100/75 md:col-span-3">
              No hay bloques de calendario registrados todavía.
            </article>
          ) : null}
          {!error && visibleCalendarBlocks.map((item) => {
            const itemView = getCalendarItemView(item);
            const canDeleteBlock = item.id?.startsWith("BLK-");

            return (
            <article key={item.id} className="flex min-h-full flex-col rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
              <div>
                <span className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                  {itemView.label}
                </span>
                <p className="mt-3 text-sm font-semibold text-cyan-50">{itemView.title}</p>
                <p className="mt-1 text-sm text-cyan-100/80">{itemView.subtitle}</p>
                <div className="mt-3 grid gap-2 text-xs text-cyan-100/70">
                  <p>Fecha: {itemView.fecha}</p>
                  {itemView.timeValue ? <p>{itemView.timeLabel}: {itemView.timeValue}</p> : null}
                  {itemView.estado ? <p>Estado: {itemView.estado}</p> : null}
                  {itemView.modalidad ? <p>Modalidad: {itemView.modalidad}</p> : null}
                </div>
              </div>
              <div className="mt-auto pt-4">
                {canDeleteBlock ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarBlockToDelete(item);
                      setDeleteBlockError("");
                      setFormMessage("");
                      setFormError("");
                    }}
                    disabled={actionLoading}
                    className="w-full rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Eliminar bloqueo
                  </button>
                ) : null}
              </div>
            </article>
            );
          })}
        </div>
      </section>

      {calendarBlockToDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !actionLoading) {
              setCalendarBlockToDelete(null);
              setDeleteBlockError("");
            }
          }}
        >
          <section className="w-full max-w-lg rounded-3xl border border-cyan-100/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/70">
            {(() => {
              const blockView = getCalendarItemView(calendarBlockToDelete);

              return (
                <>
                  <p className="tech-mono text-xs text-cyan-200/75">CONFIRMACION</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Eliminar bloqueo</h2>
                  <p className="mt-3 text-sm leading-6 text-cyan-100/80">¿Seguro que deseas liberar este horario bloqueado?</p>

                  <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Motivo</p>
                    <p className="mt-2 text-sm font-semibold text-cyan-50">{blockView.title}</p>
                    <p className="mt-3 text-xs text-cyan-100/70">Fecha: {blockView.fecha}</p>
                    <p className="mt-1 text-xs text-cyan-100/70">{blockView.timeLabel}: {blockView.timeValue}</p>
                  </div>

                  {deleteBlockError ? <p className="mt-4 rounded-2xl border border-rose-300/25 bg-rose-400/10 p-3 text-sm text-rose-100">{deleteBlockError}</p> : null}

                  <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-cyan-100/10 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setCalendarBlockToDelete(null);
                        setDeleteBlockError("");
                      }}
                      disabled={actionLoading}
                      className="rounded-full border border-cyan-100/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteCalendarBlock}
                      disabled={actionLoading}
                      className="rounded-full border border-rose-300/30 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionLoading ? "Eliminando..." : "Eliminar bloqueo"}
                    </button>
                  </div>
                </>
              );
            })()}
          </section>
        </div>
      ) : null}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <p className="tech-mono text-xs text-cyan-200/75">CRITERIOS OPERATIVOS</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Como atiende el especialista dentro de TechMarket</h2>
          <p className="mt-3 text-sm leading-7 text-cyan-100/80">
            La disponibilidad no solo indica horario. Tambien comunica capacidad real de respuesta,
            orden operativo y confianza para que el cliente pueda decidir si contactar ahora,
            programar una atencion o esperar una ventana mas conveniente.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Respuesta por prioridad</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                Las consultas por diagnostico urgente, fallas operativas y conectividad tienen atencion prioritaria
                dentro del horario activo del especialista.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Programacion ordenada</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                Los trabajos presenciales y mantenimientos se coordinan por agenda para evitar saturacion,
                mejorar tiempos y asegurar cumplimiento tecnico.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Cobertura y modalidad</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                La atencion puede variar entre soporte remoto, visita tecnica o servicio en punto acordado,
                segun el tipo de problema y la ubicacion del cliente.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Confianza y seguimiento</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                La actividad visible, el historial reciente y la reputacion ayudan a que el cliente tenga señales
                claras antes de solicitar el servicio.
              </p>
            </article>
          </div>
        </article>

        <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <p className="tech-mono text-xs text-cyan-200/75">ALCANCE DEL SERVICIO</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Canales y condiciones de atencion</h2>

          <div className="mt-4 space-y-3">
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Canal principal</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                Chat directo dentro de TechMarket para consultas, coordinacion y seguimiento inicial.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Atencion remota</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                Ideal para configuracion, soporte rapido, validaciones preliminares y asistencia guiada.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Atencion presencial</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                Disponible para mantenimiento, instalacion, revision fisica, redes y trabajos que requieren visita.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Tiempo estimado de respuesta</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                La primera respuesta se prioriza dentro del horario activo. La confirmacion final depende del tipo
                de servicio, carga operativa y zona de cobertura.
              </p>
            </article>
          </div>
        </article>
      </section>
      
    </SpecialistShell>
  );
}
