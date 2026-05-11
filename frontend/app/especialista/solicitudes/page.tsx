"use client";

import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistRequestsProjectsData } from "../hooks/useSpecialistRequestsProjectsData";

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("pend")) {
    return "border-amber-300/35 bg-amber-300/10 text-amber-100";
  }

  if (normalized.includes("acept") || normalized.includes("aprob")) {
    return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  }

  return "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
}

export default function EspecialistaSolicitudesPage() {
  const { requests } = useSpecialistRequestsProjectsData();

  return (
    <SpecialistShell sectionLabel="Solicitudes" statusMessage="Solicitudes de clientes en revision">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">SOLICITUDES DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Solicitudes entrantes</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Revisa pedidos de clientes, servicio solicitado, propuesta inicial y estado actual antes de responder.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Total solicitudes</p>
          <p className="mt-2 text-2xl font-bold text-white">{requests.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Pendientes</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {requests.filter((request) => request.status.toLowerCase().includes("pend")).length}
          </p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modo</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Solo lectura</p>
          <p className="mt-1 text-xs text-cyan-100/70">Acciones PATCH pendientes</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {requests.map((request) => (
          <article key={request.id} className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cliente</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{request.customer}</h2>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(request.status)}`}>
                {request.status}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Servicio solicitado</p>
              <p className="mt-2 text-sm font-semibold text-cyan-50">{request.service}</p>
            </div>

            <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Mensaje o propuesta</p>
              <p className="mt-2 text-sm leading-7 text-cyan-100/85">{request.message}</p>
            </div>

            <p className="mt-3 text-xs text-cyan-100/65">Fecha: {request.date}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100/70 opacity-70"
              >
                Aceptar
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100/70 opacity-70"
              >
                Rechazar
              </button>
            </div>
          </article>
        ))}
      </section>
    </SpecialistShell>
  );
}
