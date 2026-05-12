"use client";

import { FormEvent, useState } from "react";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistReviewsCertificationsData } from "../hooks/useSpecialistReviewsCertificationsData";

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("con respaldo")) {
    return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  }

  if (normalized.includes("sin respaldo")) {
    return "border-amber-300/35 bg-amber-300/10 text-amber-100";
  }

  return "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
}

type CertificationItem = ReturnType<typeof useSpecialistReviewsCertificationsData>["certifications"][number];

export default function EspecialistaCertificacionesPage() {
  const {
    certifications,
    actionError,
    actionLoading,
    actionSuccess,
    createCertification,
    deleteCertification,
    requestCertificationVerification,
  } = useSpecialistReviewsCertificationsData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [certificationName, setCertificationName] = useState("");
  const [certificationInstitution, setCertificationInstitution] = useState("");
  const [certificationDate, setCertificationDate] = useState("");
  const [certificationUrl, setCertificationUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingCertificationId, setDeletingCertificationId] = useState<string | null>(null);
  const [requestingVerificationId, setRequestingVerificationId] = useState<string | null>(null);
  const [certificationToDelete, setCertificationToDelete] = useState<CertificationItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  function resetForm() {
    setCertificationName("");
    setCertificationInstitution("");
    setCertificationDate("");
    setCertificationUrl("");
    setFormError(null);
  }

  function closeForm() {
    if (actionLoading) {
      return;
    }

    resetForm();
    setIsFormOpen(false);
  }

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
    const wasCreated = await createCertification({
      nombre,
      institucion: institucion || undefined,
      fechaObtencion: fechaObtencion || undefined,
      archivoUrl: archivoUrl || undefined,
    });

    if (wasCreated) {
      resetForm();
      setIsFormOpen(false);
    }
  }

  function closeDeleteModal() {
    if (actionLoading) {
      return;
    }

    setCertificationToDelete(null);
    setDeleteError(null);
  }

  async function handleDeleteCertification() {
    if (!certificationToDelete) return;

    setFormError(null);
    setDeleteError(null);
    setLocalMessage(null);
    setDeletingCertificationId(certificationToDelete.id);

    try {
      await deleteCertification(certificationToDelete.id);
      setLocalMessage("Certificación eliminada correctamente.");
      setCertificationToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar la certificación.");
    } finally {
      setDeletingCertificationId(null);
    }
  }

  async function handleRequestVerification(certificationId: string) {
    setFormError(null);
    setLocalMessage(null);
    setRequestingVerificationId(certificationId);

    try {
      await requestCertificationVerification(certificationId);
      setLocalMessage("Solicitud de verificación enviada correctamente.");
    } catch (err) {
      setLocalMessage(err instanceof Error ? err.message : "No se pudo solicitar la verificación.");
    } finally {
      setRequestingVerificationId(null);
    }
  }

  function handleViewCredential(certification: CertificationItem) {
    if (!certification.credentialUrl) {
      setLocalMessage("No hay credencial disponible para esta certificación.");
      return;
    }

    window.open(certification.credentialUrl, "_blank", "noopener,noreferrer");
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
              setIsFormOpen(true);
              setFormError(null);
            }}
            className="self-start rounded-full border border-cyan-300/35 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Agregar certificacion
          </button>
        </div>
      </section>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <section className="w-full max-w-2xl rounded-3xl border border-cyan-100/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">AGREGAR CERTIFICACION</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Nueva certificacion</h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={actionLoading}
                className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateCertification} className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm text-cyan-100/85">
                <span>Nombre de la certificacion</span>
                <span className="block text-xs text-cyan-100/55">Ej. Certificacion en mantenimiento preventivo</span>
                <input
                  value={certificationName}
                  onChange={(event) => setCertificationName(event.target.value)}
                  placeholder="Nombre de certificacion"
                  disabled={actionLoading}
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>
              <label className="block space-y-2 text-sm text-cyan-100/85">
                <span>Institucion emisora</span>
                <span className="block text-xs text-cyan-100/55">Ej. TechMarket Academy, instituto tecnico o entidad certificadora</span>
                <input
                  value={certificationInstitution}
                  onChange={(event) => setCertificationInstitution(event.target.value)}
                  placeholder="Institucion emisora"
                  disabled={actionLoading}
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>
              <label className="block space-y-2 text-sm text-cyan-100/85">
                <span>Fecha de obtencion</span>
                <span className="block text-xs text-cyan-100/55">Selecciona o escribe la fecha de emision</span>
                <input
                  type="date"
                  value={certificationDate}
                  onChange={(event) => setCertificationDate(event.target.value)}
                  placeholder="Fecha de obtencion"
                  disabled={actionLoading}
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>
              <label className="block space-y-2 text-sm text-cyan-100/85">
                <span>URL del certificado o credencial</span>
                <span className="block text-xs text-cyan-100/55">Enlace al archivo o evidencia de respaldo</span>
                <input
                  value={certificationUrl}
                  onChange={(event) => setCertificationUrl(event.target.value)}
                  placeholder="URL del certificado o credencial"
                  disabled={actionLoading}
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>

              {formError || actionError ? (
                <p className="text-sm text-rose-200">{formError ?? actionError}</p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-3 border-t border-cyan-100/10 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={actionLoading}
                  className="rounded-full border border-cyan-100/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !certificationName.trim()}
                  className="rounded-full border border-cyan-300/35 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading && !deletingCertificationId ? "Guardando..." : "Guardar certificacion"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {localMessage || actionSuccess ? (
        <p className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {localMessage ?? actionSuccess}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Total</p>
          <p className="mt-2 text-2xl font-bold text-white">{certifications.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Con respaldo</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {certifications.filter((certification) => certification.credentialUrl).length}
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
              <button
                type="button"
                onClick={() => handleViewCredential(certification)}
                className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
              >
                Ver credencial
              </button>
              <button
                type="button"
                onClick={() => handleRequestVerification(certification.id)}
                disabled={actionLoading}
                className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {requestingVerificationId === certification.id ? "Enviando..." : "Solicitar verificacion"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCertificationToDelete(certification);
                  setDeleteError(null);
                  setLocalMessage(null);
                }}
                disabled={actionLoading}
                className="rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingCertificationId === certification.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </article>
        ))}
      </section>

      {certificationToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm" onClick={(event) => event.target === event.currentTarget && closeDeleteModal()}>
          <section className="w-full max-w-lg rounded-3xl border border-cyan-100/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/70">
            <p className="tech-mono text-xs text-cyan-200/75">CONFIRMACION</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Eliminar certificación</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-100/80">¿Seguro que deseas eliminar esta certificación?</p>
            <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Certificación seleccionada</p>
              <p className="mt-2 text-base font-semibold text-cyan-50">{certificationToDelete.title}</p>
            </div>
            {deleteError ? <p className="mt-4 rounded-2xl border border-rose-300/25 bg-rose-400/10 p-3 text-sm text-rose-100">{deleteError}</p> : null}
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-cyan-100/10 pt-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={actionLoading}
                className="rounded-full border border-cyan-100/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteCertification}
                disabled={actionLoading}
                className="rounded-full border border-rose-300/30 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingCertificationId === certificationToDelete.id ? "Eliminando..." : "Eliminar certificación"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </SpecialistShell>
  );
}
