"use client";

import { FormEvent, useState } from "react";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistReviewsCertificationsData } from "../hooks/useSpecialistReviewsCertificationsData";

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("verif") || normalized.includes("aprob")) {
    return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  }

  if (normalized.includes("pend")) {
    return "border-amber-300/35 bg-amber-300/10 text-amber-100";
  }

  return "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
}

export default function EspecialistaCertificacionesPage() {
  const { certifications, actionError, actionLoading, actionSuccess, createCertification, deleteCertification } = useSpecialistReviewsCertificationsData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [certificationName, setCertificationName] = useState("");
  const [certificationInstitution, setCertificationInstitution] = useState("");
  const [certificationDate, setCertificationDate] = useState("");
  const [certificationUrl, setCertificationUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingCertificationId, setDeletingCertificationId] = useState<string | null>(null);

  async function handleCreateCertification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nombre = certificationName.trim();
    const institucion = certificationInstitution.trim();
    const fechaObtencion = certificationDate.trim();
    const archivoUrl = certificationUrl.trim();

    if (!nombre) {
      setFormError("Ingresa el nombre de la certificacion.");
      return;
    }

    setFormError(null);
    await createCertification({
      nombre,
      institucion: institucion || undefined,
      fechaObtencion: fechaObtencion || undefined,
      archivoUrl: archivoUrl || undefined,
    });
    setCertificationName("");
    setCertificationInstitution("");
    setCertificationDate("");
    setCertificationUrl("");
    setIsFormOpen(false);
  }

  async function handleDeleteCertification(certificationId: string) {
    setFormError(null);
    setDeletingCertificationId(certificationId);
    await deleteCertification(certificationId);
    setDeletingCertificationId(null);
  }

  return (
    <SpecialistShell sectionLabel="Certificaciones" statusMessage="Certificaciones tecnicas del especialista">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="tech-mono text-xs text-cyan-200/75">CERTIFICACIONES</p>
            <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Credenciales tecnicas</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Consulta certificaciones, entidad emisora, estado de validacion y credenciales asociadas al especialista.
            </p>
          </div>

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => {
              setIsFormOpen((current) => !current);
              setFormError(null);
            }}
            className="self-start rounded-full border border-cyan-300/35 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFormOpen ? "Cerrar formulario" : "Agregar certificacion"}
          </button>
        </div>
      </section>

      {isFormOpen ? (
        <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <h2 className="text-2xl font-bold text-white">Agregar certificacion</h2>
          <form onSubmit={handleCreateCertification} className="mt-4 grid gap-3 lg:grid-cols-4">
            <input
              value={certificationName}
              onChange={(event) => setCertificationName(event.target.value)}
              placeholder="Nombre de certificacion"
              disabled={actionLoading}
              className="rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <input
              value={certificationInstitution}
              onChange={(event) => setCertificationInstitution(event.target.value)}
              placeholder="Institucion emisora"
              disabled={actionLoading}
              className="rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <input
              value={certificationDate}
              onChange={(event) => setCertificationDate(event.target.value)}
              placeholder="Fecha de obtencion"
              disabled={actionLoading}
              className="rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <input
              value={certificationUrl}
              onChange={(event) => setCertificationUrl(event.target.value)}
              placeholder="URL de credencial"
              disabled={actionLoading}
              className="rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            />
            <div className="lg:col-span-4">
              <button
                type="submit"
                disabled={actionLoading || !certificationName.trim()}
                className="rounded-full border border-cyan-300/35 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading && !deletingCertificationId ? "Guardando..." : "Guardar certificacion"}
              </button>
            </div>
          </form>
          {formError || actionError ? (
            <p className="mt-3 text-sm text-rose-200">{formError ?? actionError}</p>
          ) : null}
        </section>
      ) : null}

      {actionSuccess ? (
        <p className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {actionSuccess}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Total</p>
          <p className="mt-2 text-2xl font-bold text-white">{certifications.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Verificadas</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {certifications.filter((certification) => certification.status.toLowerCase().includes("verif")).length}
          </p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modo</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Conectado</p>
          <p className="mt-1 text-xs text-cyan-100/70">POST y DELETE reales</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {certifications.length === 0 ? (
          <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 text-sm text-cyan-100/75 lg:col-span-2">
            No hay certificaciones registradas todavía.
          </article>
        ) : null}
        {certifications.map((certification) => (
          <article key={certification.id} className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Certificacion</p>
                <h2 className="mt-2 text-2xl font-bold text-white">{certification.title}</h2>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(certification.status)}`}>
                {certification.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Entidad emisora</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">{certification.issuer}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Fecha</p>
                <p className="mt-2 text-sm text-cyan-100/85">{certification.date}</p>
              </article>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {certification.credentialUrl ? (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                >
                  Ver credencial
                </a>
              ) : null}
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100/70 opacity-70"
              >
                Verificar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCertification(certification.id)}
                disabled={actionLoading}
                className="rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingCertificationId === certification.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </SpecialistShell>
  );
}
