"use client";

import { useState } from "react";

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

function getUrgencyClass(urgency: string) {
  return urgency.toLowerCase().includes("alta")
    ? "border-rose-300/40 bg-rose-400/15 text-rose-100"
    : "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
}

type RequestItem = ReturnType<typeof useSpecialistRequestsProjectsData>["requests"][number];
type RequestAction = "aceptar" | "rechazar";

export default function EspecialistaSolicitudesPage() {
  const { requests, loading, error, respondRequest } = useSpecialistRequestsProjectsData();
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [detailRequest, setDetailRequest] = useState<RequestItem | null>(null);
  const [pendingAction, setPendingAction] = useState<{ request: RequestItem; action: RequestAction } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleRespondRequest() {
    if (!pendingAction) return;

    setProcessingRequestId(pendingAction.request.id);
    setSuccessMessage(null);
    setActionError(null);

    try {
      await respondRequest(pendingAction.request.id, pendingAction.action);
      setSuccessMessage(pendingAction.action === "aceptar" ? "Solicitud aceptada correctamente." : "Solicitud rechazada correctamente.");
      setPendingAction(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "No se pudo responder la solicitud.");
    } finally {
      setProcessingRequestId(null);
    }
  }

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
          <p className="mt-2 text-sm font-semibold text-cyan-50">Conectado</p>
          <p className="mt-1 text-xs text-cyan-100/70">Acciones PATCH activas</p>
        </article>
      </section>

      {successMessage ? (
        <p className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-100">
          {successMessage}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {!loading && requests.length === 0 ? (
          <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 text-sm text-cyan-100/75 lg:col-span-2">
            No hay solicitudes registradas todavía.
          </article>
        ) : null}
        {requests.map((request) => {
          const isProcessing = loading || processingRequestId === request.id;

          return (
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

              <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Urgencia</p>
                <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getUrgencyClass(request.urgency)}`}>
                  {request.urgency}
                </span>
              </div>

              <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Mensaje o propuesta</p>
                <p className="mt-2 text-sm leading-7 text-cyan-100/85">{request.message}</p>
              </div>

              <p className="mt-3 text-xs text-cyan-100/65">Fecha: {request.date}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setDetailRequest(request)}
                  className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/20"
                >
                  Ver detalle
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    setPendingAction({ request, action: "aceptar" });
                    setActionError(null);
                    setSuccessMessage(null);
                  }}
                  className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    setPendingAction({ request, action: "rechazar" });
                    setActionError(null);
                    setSuccessMessage(null);
                  }}
                  className="rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-200/60 hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Rechazar
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {detailRequest ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm" onClick={(event) => event.target === event.currentTarget && setDetailRequest(null)}>
          <article className="w-full max-w-2xl rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">DETALLE DE SOLICITUD</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{detailRequest.service}</h2>
              </div>
              <button type="button" onClick={() => setDetailRequest(null)} className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                Cerrar
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <DetailField label="Cliente" value={detailRequest.customer} />
              <DetailField label="Servicio solicitado" value={detailRequest.service} />
              <DetailField label="Fecha" value={detailRequest.date} />
              <DetailField label="Estado" value={detailRequest.status} />
              <DetailField label="Urgencia" value={detailRequest.urgency} />
              <DetailField label="ID solicitud" value={detailRequest.id} />
            </div>
            <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Mensaje o propuesta</p>
              <p className="mt-2 text-sm leading-7 text-cyan-100/85">{detailRequest.message}</p>
            </div>
          </article>
        </div>
      ) : null}

      {pendingAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm" onClick={(event) => event.target === event.currentTarget && !processingRequestId && setPendingAction(null)}>
          <article className="w-full max-w-lg rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40">
            <p className="tech-mono text-xs text-cyan-200/75">CONFIRMACION</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{pendingAction.action === "aceptar" ? "Aceptar solicitud" : "Rechazar solicitud"}</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-100/80">
              {pendingAction.action === "aceptar" ? "¿Deseas aceptar esta solicitud y continuar con su gestión?" : "¿Seguro que deseas rechazar esta solicitud?"}
            </p>
            <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Solicitud</p>
              <p className="mt-2 text-sm font-semibold text-cyan-50">{pendingAction.request.service}</p>
              <p className="mt-1 text-xs text-cyan-100/70">Cliente: {pendingAction.request.customer}</p>
            </div>
            {actionError ? <p className="mt-4 rounded-2xl border border-rose-300/25 bg-rose-400/10 p-3 text-sm text-rose-100">{actionError}</p> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled={Boolean(processingRequestId)} onClick={() => setPendingAction(null)} className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10 disabled:cursor-not-allowed disabled:opacity-60">
                Cancelar
              </button>
              <button type="button" disabled={Boolean(processingRequestId)} onClick={handleRespondRequest} className={`rounded-full border px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${pendingAction.action === "aceptar" ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20" : "border-rose-300/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20"}`}>
                {processingRequestId ? "Procesando..." : pendingAction.action === "aceptar" ? "Aceptar solicitud" : "Rechazar solicitud"}
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </SpecialistShell>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">{label}</p>
      <p className="mt-2 text-sm font-semibold text-cyan-50">{value}</p>
    </div>
  );
}
