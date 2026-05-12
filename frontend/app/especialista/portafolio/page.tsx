"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistBackendData } from "../hooks/useSpecialistBackendData";

const SERVICE_TYPE_OPTIONS = [
  "Reparacion",
  "Mantenimiento",
  "Instalacion",
  "Diagnostico",
  "Soporte tecnico",
  "Asesoria",
  "Actualizacion",
  "Configuracion",
];

export default function EspecialistaPortafolioPage() {
  const { profile, portfolio, loading, error, createPortfolioItem } = useSpecialistBackendData();
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioMessage, setPortfolioMessage] = useState("");
  const [portfolioActionLoading, setPortfolioActionLoading] = useState(false);
  const [uploadedPortfolioImagePreview, setUploadedPortfolioImagePreview] = useState("");
  const [uploadedPortfolioImageName, setUploadedPortfolioImageName] = useState("");
  const [portfolioFileInputKey, setPortfolioFileInputKey] = useState(0);
  const [portfolioForm, setPortfolioForm] = useState({
    serviceType: "",
    workDescription: "",
    result: "",
    date: "",
  });

  const portfolioItems = portfolio;

  const handlePortfolioFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadedPortfolioImagePreview("");
      setUploadedPortfolioImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPortfolioMessage("Selecciona un archivo de imagen valido.");
      setUploadedPortfolioImagePreview("");
      setUploadedPortfolioImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setUploadedPortfolioImagePreview(result);
      setUploadedPortfolioImageName(file.name);
      setPortfolioMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleAddPortfolioItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serviceType = portfolioForm.serviceType.trim();
    const workDescription = portfolioForm.workDescription.trim();

    if (!workDescription) {
      setPortfolioMessage("Completa el titulo del trabajo.");
      return;
    }

    try {
      setPortfolioActionLoading(true);
      setPortfolioMessage("");
      await createPortfolioItem({
        titulo: workDescription,
        servicio: serviceType || undefined,
        resultado: portfolioForm.result.trim() || undefined,
        fecha: portfolioForm.date.trim() || undefined,
      });

      setPortfolioForm({
        serviceType: "",
        workDescription: "",
        result: "",
        date: "",
      });
      setUploadedPortfolioImagePreview("");
      setUploadedPortfolioImageName("");
      setPortfolioFileInputKey((current) => current + 1);
      setPortfolioMessage("Trabajo agregado al portafolio.");
      setShowPortfolioForm(false);
    } catch (err) {
      setPortfolioMessage(err instanceof Error ? err.message : "No se pudo agregar el trabajo.");
    } finally {
      setPortfolioActionLoading(false);
    }
  };

  return (
    <>
      <SpecialistShell sectionLabel="Portafolio" statusMessage="Portafolio tecnico con evidencia activa" profile={profile}>
        <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
          <p className="tech-mono text-xs text-cyan-200/75">PORTAFOLIO DEL ESPECIALISTA</p>
          <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Evidencia tecnica</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
            Evidencia real de intervenciones tecnicas con contexto del problema y resultado obtenido.
          </p>
          {error ? <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100">{error}</p> : null}
          {!showPortfolioForm && portfolioMessage ? <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">{portfolioMessage}</p> : null}
        </section>

        <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-white">Portafolio</h2>
            <button
              type="button"
              onClick={() => {
                setShowPortfolioForm(true);
                setPortfolioMessage("");
                setUploadedPortfolioImagePreview("");
                setUploadedPortfolioImageName("");
                setPortfolioFileInputKey((current) => current + 1);
                setPortfolioForm({
                  serviceType: "",
                  workDescription: "",
                  result: "",
                  date: "",
                });
              }}
              className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
            >
              Anadir trabajo
            </button>
          </div>

          <AnimatePresence>
            {showPortfolioForm ? (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    setShowPortfolioForm(false);
                  }
                }}
              >
                <motion.form
                  onSubmit={handleAddPortfolioItem}
                  className="chat-scrollbar max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-white">Añadir trabajo</h2>

                    <button
                      type="button"
                      onClick={() => setShowPortfolioForm(false)}
                      className="rounded-full border border-cyan-100/15 px-5 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-100/10"
                    >
                      Cerrar formulario
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-cyan-100/85">
                      <span>Servicio asociado</span>
                      <select
                        value={portfolioForm.serviceType}
                        onChange={(event) =>
                          setPortfolioForm((current) => ({ ...current, serviceType: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      >
                        <option value="">Selecciona un tipo</option>
                        {SERVICE_TYPE_OPTIONS.map((serviceType) => (
                          <option key={serviceType} value={serviceType}>
                            {serviceType}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2 text-sm text-cyan-100/85">
                      <span>Fecha (opcional)</span>
                      <input
                        type="date"
                        value={portfolioForm.date}
                        onChange={(event) =>
                          setPortfolioForm((current) => ({ ...current, date: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                      <span>Título del trabajo</span>
                      <textarea
                        value={portfolioForm.workDescription}
                        onChange={(event) =>
                          setPortfolioForm((current) => ({ ...current, workDescription: event.target.value }))
                        }
                        rows={3}
                        placeholder="Ej. Optimización de laptop de trabajo"
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                      <span>Resultado obtenido (opcional)</span>
                      <textarea
                        value={portfolioForm.result}
                        onChange={(event) =>
                          setPortfolioForm((current) => ({ ...current, result: event.target.value }))
                        }
                        rows={2}
                        placeholder="Ej: equipo estable, menor temperatura, mejor rendimiento"
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                      <span>Subir imagen del trabajo (opcional)</span>
                      <input
                        key={portfolioFileInputKey}
                        type="file"
                        accept="image/*"
                        onChange={handlePortfolioFileChange}
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                      {uploadedPortfolioImageName ? (
                        <p className="text-xs text-cyan-100/70">Archivo: {uploadedPortfolioImageName}</p>
                      ) : null}
                    </label>
                  </div>

                  {uploadedPortfolioImagePreview ? (
                    <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-slate-950/40 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Vista previa</p>
                      <img
                        src={uploadedPortfolioImagePreview}
                        alt="Vista previa del trabajo"
                        className="mt-3 h-44 w-full rounded-2xl object-contain bg-slate-100"
                      />
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={portfolioActionLoading}
                      className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {portfolioActionLoading ? "Guardando..." : "Guardar trabajo"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPortfolioForm(false)}
                      className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                    >
                      Cancelar
                    </button>

                    {portfolioMessage ? <p className="text-sm text-cyan-100/80">{portfolioMessage}</p> : null}
                  </div>
                </motion.form>
              </motion.div>
            ) : null}
          </AnimatePresence>


          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {loading ? (
              <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5 text-sm text-cyan-100/75 lg:col-span-2">
                Cargando portafolio...
              </article>
            ) : null}
            {!loading && portfolioItems.length === 0 ? (
              <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5 text-sm text-cyan-100/75 lg:col-span-2">
                No hay elementos de portafolio registrados todavía.
              </article>
            ) : null}
            {portfolioItems.map((item) => {
              const portfolioItem = item as typeof item & {
                titulo?: string;
                servicio?: string;
                resultado?: string;
                fecha?: string;
              };
              const itemTitle = portfolioItem.titulo?.trim() || item.workDescription?.trim() || "Trabajo sin título";
              const itemService = portfolioItem.servicio?.trim() || item.serviceType?.trim();
              const itemResult = portfolioItem.resultado?.trim() || item.result?.trim();
              const itemDate = portfolioItem.fecha?.trim() || item.date?.trim();

              return (
              <article key={item.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-white/5">
                <div className="flex h-56 w-full items-center justify-center bg-slate-100">
                  <img
                    src={item.image}
                    alt={itemTitle}
                    className="h-full w-full object-contain object-center"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-4 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {itemService ? (
                      <p className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                        {itemService}
                      </p>
                    ) : null}
                    {itemDate ? <p className="text-xs text-cyan-200/70">{itemDate}</p> : null}
                  </div>

                  <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Título del trabajo</p>
                    <p className="mt-2 text-base font-semibold leading-7 text-cyan-50">{itemTitle}</p>
                  </div>

                  {itemResult ? (
                    <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/80">Resultado</p>
                      <p className="mt-2 text-sm leading-7 text-emerald-100/90">{itemResult}</p>
                    </div>
                  ) : null}
                </div>
              </article>
              );
            })}
          </div>
        </section>
      </SpecialistShell>
    </>
  );
}
