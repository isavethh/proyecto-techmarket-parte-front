"use client";

import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistRequestsProjectsData } from "../hooks/useSpecialistRequestsProjectsData";

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
  const { projects, history } = useSpecialistRequestsProjectsData();

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
          <p className="mt-2 text-sm font-semibold text-cyan-50">Solo lectura</p>
          <p className="mt-1 text-xs text-cyan-100/70">Actualizacion de estado pendiente</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {projects.length === 0 ? (
          <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 text-sm text-cyan-100/75 lg:col-span-2">
            No hay proyectos activos todavía.
          </article>
        ) : null}
        {projects.map((project) => (
          <article key={project.id} className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Proyecto</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{project.title}</h2>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(project.status)}`}>
                {project.status}
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
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Inicio</p>
                <p className="mt-2 text-sm text-cyan-100/85">{project.startDate}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Fin estimado</p>
                <p className="mt-2 text-sm text-cyan-100/85">{project.endDate}</p>
              </article>
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

            <button
              type="button"
              disabled
              className="mt-5 cursor-not-allowed rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100/70 opacity-70"
            >
              Actualizar estado
            </button>
          </article>
        ))}
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
                <p className="text-sm font-semibold text-cyan-50">{item.project}</p>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-cyan-100/80">{item.detail}</p>
              <p className="mt-3 text-xs text-cyan-100/65">{item.date}</p>
            </article>
          ))}
        </div>
      </section>
    </SpecialistShell>
  );
}
