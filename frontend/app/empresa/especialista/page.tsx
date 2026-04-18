"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type PortfolioItem = {
  id: string;
  image: string;
  workDescription: string;
  serviceType: string;
  result?: string;
  date?: string;
};

type PortfolioEditForm = {
  serviceType: string;
  workDescription: string;
  result: string;
  date: string;
  image: string;
};

type SpecialistService = {
  id: string;
  name: string;
  description: string;
  price: string;
  type: string;
  technicianName: string;
  image?: string;
  featured?: boolean;
};

type UserReview = {
  id: string;
  user: string;
  comment: string;
  stars: number;
  date: string;
  service: string;
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

const specialistProfile = {
  name: "Alejandro Torres",
  avatar: "AT",
  specialization: "Redes, laptops y soporte tecnico",
  location: "Santa Cruz de la Sierra, Bolivia",
  bio: "Especialista en diagnostico, reparacion e instalacion para hogares y pequenas empresas en Santa Cruz. Enfoque en soluciones claras, tiempos reales y acompanamiento posterior al servicio.",
};

const initialPortfolio: PortfolioItem[] = [
  {
    id: "p-1",
    image: "/productos/laptop-pro-14.jpg",
    workDescription:
      "Equipo con sobrecalentamiento y apagados inesperados. Se realizo limpieza interna, reemplazo de pasta termica y ajuste de ventilacion.",
    serviceType: "Mantenimiento preventivo",
    result: "Temperatura estable y mejora de rendimiento en tareas de diseno.",
    date: "Abr 2026",
  },
  {
    id: "p-2",
    image: "/productos/monitor-ultrawide-34.jpg",
    workDescription:
      "Puesto de trabajo empresarial con requerimiento de conectividad y doble pantalla. Se configuro red local y calibracion de monitor.",
    serviceType: "Instalacion y configuracion",
    result: "Estacion lista para trabajo remoto con conexion estable.",
    date: "Mar 2026",
  },
  {
    id: "p-3",
    image: "/productos/kit-limpieza-pc.jpg",
    workDescription:
      "Laptop con lentitud, errores de arranque y acumulacion de residuos internos. Se hizo revision integral de hardware y software.",
    serviceType: "Reparacion tecnica",
    result: "Inicio normal, menor tiempo de carga y estabilidad en uso diario.",
    date: "Feb 2026",
  },
];

const specialistServices: SpecialistService[] = [
  {
    id: "s-1",
    name: "Reparacion de laptops",
    description: "Diagnostico detallado, cambio de componentes y pruebas de funcionamiento final.",
    price: "Bs 120.000",
    type: "Reparacion",
    technicianName: "Alejandro Torres",
    image: "/productos/laptop-pro-14.jpg",
    featured: true,
  },
  {
    id: "s-2",
    name: "Instalacion y configuracion de redes",
    description: "Configuracion de router, cableado y optimizacion de cobertura para oficina u hogar.",
    price: "Consultar",
    type: "Instalacion",
    technicianName: "Alejandro Torres",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "s-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza, control de temperatura y recomendaciones para prevenir fallas frecuentes.",
    price: "Bs 95.000",
    type: "Mantenimiento",
    technicianName: "Alejandro Torres",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "s-4",
    name: "Soporte tecnico remoto",
    description: "Asistencia por chat o videollamada para resolver errores de configuracion y software.",
    price: "Bs 60.000",
    type: "Soporte",
    technicianName: "Alejandro Torres",
    featured: true,
  },
];

const reviews: UserReview[] = [
  {
    id: "r-1",
    user: "Carlos M.",
    comment: "Soluciono un problema de temperatura en menos de un dia y explico todo el proceso.",
    stars: 5,
    date: "Hace 2 dias",
    service: "Mantenimiento preventivo",
  },
  {
    id: "r-2",
    user: "Laura P.",
    comment: "Muy claro con tiempos y costos. El soporte posterior fue rapido.",
    stars: 4,
    date: "Hace 5 dias",
    service: "Reparacion de laptops",
  },
  {
    id: "r-3",
    user: "Sofia R.",
    comment: "Instalo la red de la oficina y dejo todo funcionando estable.",
    stars: 5,
    date: "Hace 1 semana",
    service: "Instalacion y configuracion de redes",
  },
  {
    id: "r-4",
    user: "Andres T.",
    comment: "Buena atencion y seguimiento por chat despues del servicio.",
    stars: 5,
    date: "Hace 2 semanas",
    service: "Soporte tecnico remoto",
  },
];

const recentActivity: ActivityItem[] = [
  {
    id: "a-1",
    title: "Trabajo completado",
    detail: "Optimizacion de laptop para analisis de datos",
    time: "Hace 3 h",
  },
  {
    id: "a-2",
    title: "Nueva resena 5 estrellas",
    detail: "Comentario recibido en servicio de mantenimiento",
    time: "Hoy",
  },
  {
    id: "a-3",
    title: "Servicio destacado",
    detail: "Soporte remoto con alta demanda esta semana",
    time: "Ayer",
  },
];

function starsLabel(value: number) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

export default function EspecialistaPage() {
  const averageRating = 4.8;
  const totalReviews = 112;
  const jobsCompleted = 286;
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialPortfolio);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioMessage, setPortfolioMessage] = useState("");
  const [uploadedPortfolioImagePreview, setUploadedPortfolioImagePreview] = useState("");
  const [uploadedPortfolioImageName, setUploadedPortfolioImageName] = useState("");
  const [portfolioFileInputKey, setPortfolioFileInputKey] = useState(0);
  const [showPortfolioEditModal, setShowPortfolioEditModal] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioEditMessage, setPortfolioEditMessage] = useState("");
  const [portfolioEditForm, setPortfolioEditForm] = useState<PortfolioEditForm>({
    serviceType: "",
    workDescription: "",
    result: "",
    date: "",
    image: "",
  });
  const [portfolioForm, setPortfolioForm] = useState({
    serviceType: "",
    workDescription: "",
    result: "",
    image: "",
    date: "",
  });

  const featuredServices = useMemo(
    () => specialistServices.filter((service) => service.featured).length,
    []
  );

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

  const handleAddPortfolioItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serviceType = portfolioForm.serviceType.trim();
    const workDescription = portfolioForm.workDescription.trim();

    if (!serviceType || !workDescription) {
      setPortfolioMessage("Completa tipo de servicio y descripcion del trabajo.");
      return;
    }

    setPortfolioItems((current) => [
      {
        id: `p-${Date.now()}`,
        image: uploadedPortfolioImagePreview || portfolioForm.image.trim() || "/productos/laptop-pro-14.jpg",
        workDescription,
        serviceType,
        result: portfolioForm.result.trim() || undefined,
        date: portfolioForm.date.trim() || undefined,
      },
      ...current,
    ]);

    setPortfolioForm({
      serviceType: "",
      workDescription: "",
      result: "",
      image: "",
      date: "",
    });
    setUploadedPortfolioImagePreview("");
    setUploadedPortfolioImageName("");
    setPortfolioFileInputKey((current) => current + 1);
    setPortfolioMessage("Trabajo agregado al portafolio.");
    setShowPortfolioForm(false);
  };

  const openPortfolioEditModal = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setPortfolioEditForm({
      serviceType: item.serviceType,
      workDescription: item.workDescription,
      result: item.result ?? "",
      date: item.date ?? "",
      image: item.image,
    });
    setPortfolioEditMessage("");
    setShowPortfolioEditModal(true);
  };

  const handleEditPortfolioItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingPortfolioId) {
      return;
    }

    const serviceType = portfolioEditForm.serviceType.trim();
    const workDescription = portfolioEditForm.workDescription.trim();

    if (!serviceType || !workDescription) {
      setPortfolioEditMessage("Completa tipo de servicio y descripcion del trabajo.");
      return;
    }

    setPortfolioItems((current) =>
      current.map((item) =>
        item.id === editingPortfolioId
          ? {
              ...item,
              serviceType,
              workDescription,
              result: portfolioEditForm.result.trim() || undefined,
              date: portfolioEditForm.date.trim() || undefined,
              image: portfolioEditForm.image.trim() || item.image,
            }
          : item,
      ),
    );

    setShowPortfolioEditModal(false);
    setEditingPortfolioId(null);
    setPortfolioEditMessage("");
  };

  return (
    <div className="flex-1 pb-8">
      <header className="tech-top-nav">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Panel tecnico</span>
        </div>
      </header>

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_1fr]">
        <aside className="tech-card h-fit">
          <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                TC
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">Empresa activa en TechMarket</p>
              </div>
            </div>
          </div>
          <p className="tech-mono mt-4 text-xs text-cyan-200/75">MODULO TECNICOS/ESPECIALISTAS</p>
          <nav className="mt-4 space-y-2 text-sm text-cyan-100/90">
            <a href="#portafolio" className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 transition hover:bg-cyan-100/5">
              Portafolio
            </a>
            <a href="#servicios" className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 transition hover:bg-cyan-100/5">
              Servicios
            </a>
            <a href="#reputacion" className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 transition hover:bg-cyan-100/5">
              Reputacion
            </a>
            <a href="#disponibilidad" className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 transition hover:bg-cyan-100/5">
              Disponibilidad
            </a>
          </nav>
        </aside>

        <section className="space-y-6 overflow-y-auto pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
            <p className="tech-mono text-xs text-cyan-200/75">PERFIL PROFESIONAL</p>
            <div className="mt-4 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xl font-bold text-slate-950">
                    {specialistProfile.avatar}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-cyan-50 md:text-4xl">{specialistProfile.name}</h1>
                    <p className="text-sm text-cyan-100/80">{specialistProfile.specialization}</p>
                    <p className="text-sm text-cyan-100/80">{specialistProfile.location}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">{specialistProfile.bio}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Trabajos recientes</p>
                  <p className="mt-2 text-2xl font-bold text-cyan-50">{portfolioItems.length}</p>
                  <p className="mt-1 text-sm text-cyan-100/75">Evidencias activas en portafolio</p>
                </article>
                <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Servicios destacados</p>
                  <p className="mt-2 text-2xl font-bold text-cyan-50">{featuredServices}</p>
                  <p className="mt-1 text-sm text-cyan-100/75">Servicios con mayor interes</p>
                </article>
                <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Actividad reciente</p>
                  <p className="mt-2 text-sm font-semibold text-cyan-50">{recentActivity[0].title}</p>
                  <p className="mt-1 text-sm text-cyan-100/75">{recentActivity[0].time}</p>
                </article>
              </div>
            </div>
          </section>

          <section id="portafolio" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Portafolio</h2>
              <button
                type="button"
                onClick={() => {
                  setShowPortfolioForm((current) => !current);
                  setPortfolioMessage("");
                  setUploadedPortfolioImagePreview("");
                  setUploadedPortfolioImageName("");
                }}
                className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
              >
                {showPortfolioForm ? "Cerrar formulario" : "Anadir trabajo"}
              </button>
            </div>
            <p className="mt-2 text-sm text-cyan-100/75">
              Evidencia real de intervenciones tecnicas con contexto del problema y resultado obtenido.
            </p>

            {showPortfolioForm ? (
              <form onSubmit={handleAddPortfolioItem} className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-cyan-100/85">
                    <span>Tipo de servicio aplicado</span>
                    <input
                      value={portfolioForm.serviceType}
                      onChange={(event) =>
                        setPortfolioForm((current) => ({ ...current, serviceType: event.target.value }))
                      }
                      placeholder="Ej: Reparacion tecnica"
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-cyan-100/85">
                    <span>Fecha (opcional)</span>
                    <input
                      value={portfolioForm.date}
                      onChange={(event) =>
                        setPortfolioForm((current) => ({ ...current, date: event.target.value }))
                      }
                      placeholder="Ej: Abr 2026"
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                    <span>Problema o trabajo realizado</span>
                    <textarea
                      value={portfolioForm.workDescription}
                      onChange={(event) =>
                        setPortfolioForm((current) => ({ ...current, workDescription: event.target.value }))
                      }
                      rows={3}
                      placeholder="Describe que se atendio y que se hizo tecnicamente"
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
                    {uploadedPortfolioImageName ? <p className="text-xs text-cyan-100/70">Archivo: {uploadedPortfolioImageName}</p> : null}
                  </label>

                  <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                    <span>URL de imagen (opcional)</span>
                    <input
                      value={portfolioForm.image}
                      onChange={(event) =>
                        setPortfolioForm((current) => ({ ...current, image: event.target.value }))
                      }
                      placeholder="/productos/laptop-pro-14.jpg"
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                  </label>
                </div>

                {uploadedPortfolioImagePreview ? (
                  <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-slate-950/40 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Vista previa</p>
                    <img
                      src={uploadedPortfolioImagePreview}
                      alt="Vista previa de archivo seleccionado"
                      className="mt-3 h-40 w-full rounded-2xl object-cover"
                    />
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                  >
                    Guardar trabajo
                  </button>
                  {portfolioMessage ? <p className="text-sm text-cyan-100/80">{portfolioMessage}</p> : null}
                </div>
              </form>
            ) : null}

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {portfolioItems.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-white/5">
                  <img src={item.image} alt={item.serviceType} className="h-44 w-full object-cover" loading="lazy" />
                  <div className="space-y-4 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                        {item.serviceType}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.date ? <p className="text-xs text-cyan-200/70">{item.date}</p> : null}
                        <button
                          type="button"
                          onClick={() => openPortfolioEditModal(item)}
                          className="rounded-full border border-cyan-100/10 bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                        >
                          Editar
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Trabajo realizado</p>
                      <p className="mt-2 text-sm leading-7 text-cyan-100/85">{item.workDescription}</p>
                    </div>

                    {item.result ? (
                      <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/80">Resultado</p>
                        <p className="mt-2 text-sm leading-7 text-emerald-100/90">{item.result}</p>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="servicios" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <h2 className="text-2xl font-bold text-white">Servicios</h2>
            <p className="mt-2 text-sm text-cyan-100/75">
              Servicios definidos para facilitar contacto rapido y decision informada del usuario.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {specialistServices.map((service) => (
                <article key={service.id} className="rounded-3xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="h-28 w-full rounded-2xl object-cover"
                        loading="lazy"
                      />
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

                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      <p className="text-sm leading-7 text-cyan-100/85">{service.description}</p>
                      <p className="text-sm text-cyan-100/80">
                        <span className="font-semibold text-white">Tecnico:</span> {service.technicianName}
                      </p>
                      <p className="text-sm text-cyan-100/80">
                        <span className="font-semibold text-white">Precio:</span> {service.price}
                      </p>

                      <button className="mt-1 w-full rounded-xl border border-cyan-300/45 bg-cyan-300/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-300/30">
                        Contactar por chat
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="reputacion" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <h2 className="text-2xl font-bold text-white">Reputacion</h2>
            <p className="mt-2 text-sm text-cyan-100/75">
              Indicadores visibles de confianza, experiencia y actividad del tecnico.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Calificacion promedio</p>
                <p className="mt-2 text-2xl font-bold text-white">{averageRating} / 5</p>
                <p className="mt-1 text-xs text-cyan-100/70">Base de resenas verificadas</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Resenas totales</p>
                <p className="mt-2 text-2xl font-bold text-white">{totalReviews}</p>
                <p className="mt-1 text-xs text-cyan-100/70">Clientes atendidos en la plataforma</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Trabajos realizados</p>
                <p className="mt-2 text-2xl font-bold text-white">{jobsCompleted}</p>
                <p className="mt-1 text-xs text-cyan-100/70">Servicios completados con evidencia</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Actividad reciente</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">{recentActivity[1].title}</p>
                <p className="mt-1 text-xs text-cyan-100/70">{recentActivity[1].time}</p>
              </article>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {reviews.slice(0, 4).map((review) => (
                <article key={review.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-cyan-50">{review.user}</p>
                    <p className="text-sm text-amber-200">{starsLabel(review.stars)}</p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/70">{review.service}</p>
                  <p className="mt-2 text-sm leading-7 text-cyan-100/85">{review.comment}</p>
                  <p className="mt-2 text-xs text-cyan-100/65">{review.date}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="disponibilidad" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <h2 className="text-2xl font-bold text-white">Disponibilidad</h2>
            <p className="mt-2 text-sm text-cyan-100/75">
              Informacion clara para decidir si contactar en este momento o programar atencion.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-emerald-300/35 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/80">Estado actual</p>
                <p className="mt-2 text-lg font-bold text-emerald-100">Disponible</p>
                <p className="mt-1 text-xs text-emerald-100/80">Respuesta promedio en 12 minutos</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Dias de atencion</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Lunes a Sabado</p>
                <p className="mt-1 text-xs text-cyan-100/70">Domingo: atencion prioritaria por chat</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Horarios</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">08:00 AM - 06:00 PM</p>
                <p className="mt-1 text-xs text-cyan-100/70">Soporte remoto hasta 08:00 PM</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modalidad</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Presencial, remoto y a domicilio</p>
                <p className="mt-1 text-xs text-cyan-100/70">Cobertura principal: Santa Cruz de la Sierra y alrededores</p>
              </article>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Actividad reciente del tecnico</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {recentActivity.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                    <p className="text-sm font-semibold text-cyan-50">{item.title}</p>
                    <p className="mt-1 text-sm text-cyan-100/80">{item.detail}</p>
                    <p className="mt-2 text-xs text-cyan-100/65">{item.time}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>

      {showPortfolioEditModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
          <form
            onSubmit={handleEditPortfolioItem}
            className="w-full max-w-3xl rounded-3xl border border-cyan-100/10 bg-[linear-gradient(180deg,_rgba(8,18,31,0.98),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Portafolio</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Editar trabajo</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPortfolioEditModal(false);
                  setEditingPortfolioId(null);
                  setPortfolioEditMessage("");
                }}
                className="rounded-full border border-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-cyan-100/85">
                <span>Tipo de servicio aplicado</span>
                <input
                  value={portfolioEditForm.serviceType}
                  onChange={(event) =>
                    setPortfolioEditForm((current) => ({ ...current, serviceType: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>

              <label className="space-y-2 text-sm text-cyan-100/85">
                <span>Fecha (opcional)</span>
                <input
                  value={portfolioEditForm.date}
                  onChange={(event) =>
                    setPortfolioEditForm((current) => ({ ...current, date: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>

              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                <span>Problema o trabajo realizado</span>
                <textarea
                  value={portfolioEditForm.workDescription}
                  onChange={(event) =>
                    setPortfolioEditForm((current) => ({ ...current, workDescription: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>

              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                <span>Resultado obtenido (opcional)</span>
                <textarea
                  value={portfolioEditForm.result}
                  onChange={(event) =>
                    setPortfolioEditForm((current) => ({ ...current, result: event.target.value }))
                  }
                  rows={2}
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>

              <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                <span>URL de imagen</span>
                <input
                  value={portfolioEditForm.image}
                  onChange={(event) =>
                    setPortfolioEditForm((current) => ({ ...current, image: event.target.value }))
                  }
                  placeholder="/productos/laptop-pro-14.jpg"
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>
            </div>

            {portfolioEditMessage ? <p className="mt-4 text-sm text-amber-200">{portfolioEditMessage}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPortfolioEditModal(false);
                  setEditingPortfolioId(null);
                  setPortfolioEditMessage("");
                }}
                className="rounded-full border border-cyan-100/10 px-5 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
