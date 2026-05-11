"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistBackendData } from "../hooks/useSpecialistBackendData";
import { specialistServices } from "../specialistData";

type SpecialistServiceItem = (typeof specialistServices)[number];

type ServiceFormData = {
  name: string;
  type: string;
  description: string;
  technicianName: string;
  price: string;
  featured: boolean;
  image: string;
};

export default function EspecialistaServiciosPage() {
  const { profile, services } = useSpecialistBackendData();
  const [createdServiceItems, setCreatedServiceItems] = useState<SpecialistServiceItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    type: "",
    description: "",
    technicianName: profile.name,
    price: "",
    featured: false,
    image: "",
  });

  const serviceItems = [...createdServiceItems, ...(services.length > 0 ? services : specialistServices)];
  const featuredServices = serviceItems.filter((service) => service.featured).length;

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateMessage("");
    setUploadedImagePreview("");
    setUploadedImageName("");
    setFileInputKey((current) => current + 1);
    setFormData({
      name: "",
      type: "",
      description: "",
      technicianName: profile.name,
      price: "",
      featured: false,
      image: "",
    });
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setCreateMessage("");
    setUploadedImagePreview("");
    setUploadedImageName("");
    setFileInputKey((current) => current + 1);
    setFormData({
      name: "",
      type: "",
      description: "",
      technicianName: profile.name,
      price: "",
      featured: false,
      image: "",
    });
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadedImagePreview("");
      setUploadedImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setCreateMessage("Selecciona un archivo de imagen valido.");
      setUploadedImagePreview("");
      setUploadedImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setUploadedImagePreview(result);
      setUploadedImageName(file.name);
      setCreateMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateServiceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const type = formData.type.trim();
    const description = formData.description.trim();
    const technicianName = formData.technicianName.trim();
    const price = formData.price.trim();
    const image = uploadedImagePreview || "/productos/laptop-pro-14.jpg";

    if (!name || !type || !description || !technicianName) {
      setCreateMessage("Completa nombre, tipo, descripcion y tecnico.");
      return;
    }

    const newService: SpecialistServiceItem = {
      id: `service-${Date.now()}`,
      name,
      type,
      description,
      technicianName,
      price: price || "Consultar",
      featured: formData.featured,
      image,
    };

    setCreatedServiceItems((current) => [newService, ...current]);
    closeCreateModal();
  };

  return (
    <SpecialistShell sectionLabel="Servicios" statusMessage="Catalogo tecnico especialista activo" profile={profile}>
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="tech-mono text-xs text-cyan-200/75">SERVICIOS DEL ESPECIALISTA</p>
            <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Servicios profesionales</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Servicios definidos para facilitar contacto rapido y decision informada del usuario.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="self-start rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
          >
            Agregar servicio
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Total servicios</p>
            <p className="mt-2 text-2xl font-bold text-cyan-50">{serviceItems.length}</p>
          </article>
          <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Destacados</p>
            <p className="mt-2 text-2xl font-bold text-cyan-50">{featuredServices}</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {serviceItems.map((service) => (
          <article key={service.id} className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4">
            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
              {service.image ? (
                <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl bg-white">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="max-h-full max-w-full object-contain object-center"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex h-28 items-center justify-center rounded-2xl border border-cyan-100/10 bg-slate-950/35 text-sm font-semibold text-cyan-100/75">
                  Sin imagen
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                    {service.type}
                  </p>
                  {service.featured ? (
                    <p className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                      Destacado
                    </p>
                  ) : null}
                </div>

                <h2 className="text-xl font-bold text-white">{service.name}</h2>
                <p className="text-sm leading-7 text-cyan-100/85">{service.description}</p>
                <p className="text-sm text-cyan-100/80">
                  <span className="font-semibold text-white">Tecnico:</span> {service.technicianName}
                </p>
                <p className="text-sm text-cyan-100/80">
                  <span className="font-semibold text-white">Precio:</span> {service.price}
                </p>

                <Link
                  href={`/especialista/chat?service=${encodeURIComponent(service.name)}`}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-xl border border-cyan-300/45 bg-cyan-300/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                >
                  Ir al chat
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <AnimatePresence>
        {showCreateModal ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeCreateModal();
              }
            }}
          >
            <motion.form
              onSubmit={handleCreateServiceSubmit}
              className="chat-scrollbar max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.92 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">SERVICIO</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Agregar servicio</h2>
                </div>

                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Nombre del servicio</span>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Ej: Reparacion de impresoras"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Tipo</span>
                  <input
                    value={formData.type}
                    onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
                    placeholder="Ej: Reparacion"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Precio</span>
                  <input
                    value={formData.price}
                    onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                    placeholder="Ej: Bs 120.000"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Descripcion</span>
                  <textarea
                    value={formData.description}
                    onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                    rows={4}
                    placeholder="Describe el servicio para que el cliente entienda que incluye."
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Tecnico</span>
                  <input
                    value={formData.technicianName}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, technicianName: event.target.value }))
                    }
                    placeholder="Ej: Alejandro Torres"
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-100/85">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, featured: event.target.checked }))
                    }
                    className="h-4 w-4 rounded border-cyan-100/20 bg-slate-950/40"
                  />
                  <span>Marcar como destacado</span>
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                  <span>Subir imagen desde tu PC</span>
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                  {uploadedImageName ? (
                    <p className="text-xs text-cyan-100/70">Archivo: {uploadedImageName}</p>
                  ) : null}
                </label>
              </div>

              {uploadedImagePreview ? (
                <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-slate-950/40 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Vista previa</p>
                  <div className="mt-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl bg-white">
                    <img
                      src={uploadedImagePreview}
                      alt="Vista previa del servicio"
                      className="max-h-full max-w-full object-contain object-center"
                    />
                  </div>
                </div>
              ) : null}

              {createMessage ? <p className="mt-4 text-sm text-amber-200">{createMessage}</p> : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                >
                  Guardar servicio
                </button>

                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SpecialistShell>
  );
}
