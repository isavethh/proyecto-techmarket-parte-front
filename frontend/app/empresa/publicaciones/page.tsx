"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CommunityFeedPost, upsertCommunityFeedPosts } from "../../lib/communityFeed";

type MainFilter = "Productos disponibles" | "Servicios" | "Ofertas y promociones" | "Publicaciones de interacción" | "Publicaciones de texto";
type InteractionFilter = "Encuestas" | "Publicaciones" | "Lista de usuarios que interactúan";

const companyModules = [
  { title: "Perfil y tienda", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

const mainFilters: MainFilter[] = [
  "Productos disponibles",
  "Servicios",
  "Ofertas y promociones",
  "Publicaciones de interacción",
  "Publicaciones de texto",
];

const interactionFilters: InteractionFilter[] = [
  "Encuestas",
  "Publicaciones",
  "Lista de usuarios que interactúan",
];

const company = {
  name: "TechMarket Santa Cruz",
  logo: "TC",
};

const buildCommunityFeedPost = (
  id: string,
  title: string,
  message: string,
  image: string | undefined,
  tag: string,
  createdAt: string,
): CommunityFeedPost => ({
  id,
  author: company.name,
  role: "Empresa verificada",
  time: "Reciente",
  title,
  body: message,
  tag,
  location: "Comunidad TechMarket",
  image,
  createdAt,
});

type ProductCard = {
  id: string;
  name: string;
  description: string;
  price?: string;
  status: string;
  image: string;
};

type ServiceCard = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
};

type OfferCard = {
  id: string;
  title: string;
  description: string;
  currentPrice: string;
  previousPrice?: string;
  label: string;
  image: string;
};

type SurveyCard = {
  id: string;
  question: string;
  options: string[];
  votes: number;
};

type PostCard = {
  id: string;
  title: string;
  message: string;
  date: string;
  image?: string;
};

type UserCard = {
  id: string;
  name: string;
  avatar: string;
  activity: string;
};

type InteractionNotification = {
  id: string;
  userName: string;
  productName: string;
  userId: string;
};

type PublicationFormData = {
  title: string;
  targetFilter: MainFilter;
  description: string;
  price: string;
  image: string;
};

type TextPublicationCard = {
  id: string;
  title: string;
  message: string;
  date: string;
  image: string;
};

function LikeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12.1 21.35 10.55 19.94C5.14 15.06 2 12.24 2 8.78 2 5.96 4.24 3.75 7.06 3.75c1.57 0 3.08.73 4.04 1.88.96-1.15 2.47-1.88 4.04-1.88 2.82 0 5.06 2.21 5.06 5.03 0 3.46-3.14 6.28-8.55 11.16l-.55.52Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M4 4.75h16A1.75 1.75 0 0 1 21.75 6.5v9A1.75 1.75 0 0 1 20 17.25H9.58l-4.41 3.38a.75.75 0 0 1-1.17-.6v-2.78A1.75 1.75 0 0 1 2.25 15.5v-9A1.75 1.75 0 0 1 4 4.75Zm0 1.5a.25.25 0 0 0-.25.25v9c0 .14.11.25.25.25h.5v3.13l4.09-3.13H20a.25.25 0 0 0 .25-.25v-9a.25.25 0 0 0-.25-.25H4Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M3.4 20.45 20.8 12 3.4 3.55a.75.75 0 0 0-1.05.88l1.97 6.02L15 12l-10.68 1.55-1.97 6.02a.75.75 0 0 0 1.05.88Zm3.68-7.2L18.2 12 7.08 10.75l-.93-2.84L18.2 12 6.15 16.09l.93-2.84Z" />
    </svg>
  );
}

const products: ProductCard[] = [
  {
    id: "prod-1",
    name: "Laptop Pro 14",
    description: "Intel i7, 16 GB RAM, SSD 512 GB para trabajo y estudio.",
    price: "Bs 3.650.000",
    status: "Disponible",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "prod-2",
    name: "Monitor UltraWide 34",
    description: "Pantalla amplia 3440 x 1440 para productividad y diseño.",
    price: "Bs 1.480.000",
    status: "Disponible",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "prod-3",
    name: "Teclado mecanico TKL",
    description: "Switch azul, RGB y formato compacto para setups modernos.",
    price: "Bs 260.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-4",
    name: "Kit limpieza PC",
    description: "Brochas, aire y pasta termica para cuidado de equipos.",
    price: "Bs 85.000",
    status: "Disponible",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "prod-5",
    name: "Mouse ergonomico",
    description: "Comodidad para jornadas largas de oficina o estudio.",
    price: "Bs 95.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-6",
    name: "Cableado de red Cat 6",
    description: "Solucion para instalacion estable en oficinas y hogares.",
    price: "Bs 12.000",
    status: "Disponible",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
];

const services: ServiceCard[] = [
  {
    id: "serv-1",
    name: "Reparacion de laptops",
    description: "Diagnostico, mantenimiento y correccion de fallas tecnicas.",
    price: "Consultar",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "serv-2",
    name: "Instalacion de redes",
    description: "Cableado, configuracion y pruebas para conectividad estable.",
    price: "Bs 120.000",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "serv-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza interna, control de temperatura y optimizacion.",
    price: "Bs 95.000",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "serv-4",
    name: "Soporte tecnico remoto",
    description: "Asistencia rapida para configuraciones y solucion de errores.",
    price: "Bs 65.000",
    image: "/productos/teclado-tkl.jpg",
  },
];

const offers: OfferCard[] = [
  {
    id: "offer-1",
    title: "Descuento en diagnostico + limpieza",
    description: "Promo especial para equipos con bajo rendimiento o sobrecalentamiento.",
    currentPrice: "Bs 95.000",
    previousPrice: "Bs 140.000",
    label: "Oferta",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "offer-2",
    title: "Combo empresarial para pequenas oficinas",
    description: "Instalacion de red, soporte remoto y acompanamiento mensual.",
    currentPrice: "Bs 420.000",
    previousPrice: "Bs 520.000",
    label: "Promocion",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "offer-3",
    title: "Pack limpieza premium",
    description: "Limpieza interna + revision termica con descuento por tiempo limitado.",
    currentPrice: "Bs 110.000",
    previousPrice: "Bs 150.000",
    label: "Oferta",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "offer-4",
    title: "Servicio rapido de soporte",
    description: "Atencion prioritaria para problemas frecuentes de software.",
    currentPrice: "Bs 55.000",
    previousPrice: "Bs 75.000",
    label: "Promocion",
    image: "/productos/laptop-pro-14.jpg",
  },
];

const surveys: SurveyCard[] = [
  {
    id: "survey-1",
    question: "Que servicio necesitas con mas frecuencia?",
    options: ["Diagnostico", "Mantenimiento", "Redes", "Soporte remoto"],
    votes: 184,
  },
  {
    id: "survey-2",
    question: "Que producto te interesa mas para tu trabajo?",
    options: ["Laptop", "Monitor", "Teclado", "Mouse"],
    votes: 132,
  },
  {
    id: "survey-3",
    question: "Que canal prefieres para contacto rapido?",
    options: ["Chat", "WhatsApp", "Telefono", "Correo"],
    votes: 211,
  },
];

const posts: PostCard[] = [
  {
    id: "post-1",
    title: "Nueva llegada de equipos para trabajo y estudio",
    message: "Ya estan disponibles nuevos modelos de alto rendimiento para usuarios exigentes.",
    date: "17 abr 2026",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "post-2",
    title: "Consejo rapido: mejora la vida util de tu laptop",
    message: "Mantener limpieza interna y ventilacion correcta ayuda a evitar fallas por temperatura.",
    date: "16 abr 2026",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "post-3",
    title: "Anuncio para empresas pequenas",
    message: "Activamos acompanamiento tecnico mensual para oficinas con soporte prioritario.",
    date: "15 abr 2026",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
];

const textPosts: TextPublicationCard[] = [
  {
    id: "text-1",
    title: "Atencion tecnica sin costo de evaluacion",
    message: "Si tu equipo esta lento, escribenos por chat y te orientamos con una primera revision sin compromiso.",
    date: "17 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-2",
    title: "Consejo para empresas pequenas",
    message: "Mantener un respaldo semanal evita perdida de informacion y reduce tiempos muertos en oficina.",
    date: "16 abr 2026",
    image: "/productos/charla.png",
  },
  {
    id: "text-3",
    title: "Soporte rapido por mensaje",
    message: "Escribenos si necesitas diagnostico, instalacion o mantenimiento. Respondemos desde Santa Cruz.",
    date: "15 abr 2026",
    image: "/productos/charla.png",
  },
];

const users: UserCard[] = [
  { id: "user-5", name: "Alejandro", avatar: "AL", activity: "Busco Laptop Pro 14 hace 2 min" },
  { id: "user-1", name: "Carlos M.", avatar: "CM", activity: "Dio like a un producto hace 1 hora" },
  { id: "user-2", name: "Laura P.", avatar: "LP", activity: "Participo en una encuesta hace 3 horas" },
  { id: "user-3", name: "Sofia R.", avatar: "SR", activity: "Comento una publicacion informativa" },
  { id: "user-4", name: "Andres T.", avatar: "AT", activity: "Reacciono a una promocion activa" },
];

const latestInteractionNotification: InteractionNotification = {
  id: "notif-alejandro-1",
  userName: "Alejandro",
  productName: "Laptop Pro 14",
  userId: "user-5",
};

export default function PublicacionesPage() {
  const [activeFilter, setActiveFilter] = useState<MainFilter>("Productos disponibles");
  const [activeInteractionFilter, setActiveInteractionFilter] = useState<InteractionFilter>("Encuestas");
  const [selectedSurveyOption, setSelectedSurveyOption] = useState<Record<string, string>>({});
  const [showInteractionNotice, setShowInteractionNotice] = useState(false);
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);
  const [productItems, setProductItems] = useState<ProductCard[]>(products);
  const [serviceItems, setServiceItems] = useState<ServiceCard[]>(services);
  const [offerItems, setOfferItems] = useState<OfferCard[]>(offers);
  const [postItems, setPostItems] = useState<PostCard[]>(posts);
  const [textPostItems, setTextPostItems] = useState<TextPublicationCard[]>(textPosts);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState("");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [formData, setFormData] = useState<PublicationFormData>({
    title: "",
    targetFilter: "Productos disponibles",
    description: "",
    price: "",
    image: "",
  });
  const isServicesView = activeFilter === "Servicios";
  const isTextView = activeFilter === "Publicaciones de texto";
  const createButtonLabel = isServicesView
    ? showCreateForm
      ? "Cerrar formulario de servicio"
      : "Agregar servicio"
    : isTextView
      ? showCreateForm
        ? "Cerrar formulario de texto"
        : "Agregar texto"
    : showCreateForm
      ? "Cerrar formulario"
      : "Agregar publicacion";
  const createFormTitle = isServicesView ? "Nuevo servicio" : isTextView ? "Nueva publicacion de texto" : "Nueva publicacion";
  const submitButtonLabel = isServicesView ? "Publicar servicio" : isTextView ? "Publicar texto" : "Publicar";

  useEffect(() => {
    const seededPosts = posts.map((post, index) =>
      buildCommunityFeedPost(
        `seed-company-${post.id}`,
        post.title,
        post.message,
        post.image,
        "Publicacion",
        new Date(Date.now() - (index + 1) * 60 * 60 * 1000).toISOString(),
      ),
    );

    upsertCommunityFeedPosts(seededPosts);
  }, []);

  const handleMainFilterChange = (filter: MainFilter) => {
    setActiveFilter(filter);

    if (filter === "Publicaciones de interacción") {
      setShowInteractionNotice(true);
      return;
    }

    setHighlightedUserId(null);
  };

  const handleInteractionNotificationClick = () => {
    setActiveInteractionFilter("Lista de usuarios que interactúan");
    setHighlightedUserId(latestInteractionNotification.userId);
    setShowInteractionNotice(false);
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setUploadedImagePreview("");
      setUploadedImageName("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPublishMessage("Selecciona un archivo de imagen valido.");
      setUploadedImagePreview("");
      setUploadedImageName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setUploadedImagePreview(result);
      setUploadedImageName(file.name);
      setPublishMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePublicationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();
    const price = formData.price.trim();
    const image =
      formData.targetFilter === "Publicaciones de texto"
        ? "/productos/charla.png"
        : uploadedImagePreview || formData.image.trim() || "/productos/laptop-pro-14.jpg";

    if (!title || !description) {
      setPublishMessage("Completa titulo y descripcion para publicar.");
      return;
    }

    const newId = `pub-${Date.now()}`;
    let communityTag = "Publicacion";

    if (formData.targetFilter === "Productos disponibles") {
      setProductItems((current) => [
        {
          id: newId,
          name: title,
          description,
          price: price || "Consultar",
          status: "Disponible",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Productos disponibles");
      communityTag = "Producto";
    }

    if (formData.targetFilter === "Servicios") {
      setServiceItems((current) => [
        {
          id: newId,
          name: title,
          description,
          price: price || "Consultar",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Servicios");
      communityTag = "Servicio";
    }

    if (formData.targetFilter === "Ofertas y promociones") {
      setOfferItems((current) => [
        {
          id: newId,
          title,
          description,
          currentPrice: price || "Consultar",
          label: "Oferta",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Ofertas y promociones");
      communityTag = "Oferta";
    }

    if (formData.targetFilter === "Publicaciones de interacción") {
      setPostItems((current) => [
        {
          id: newId,
          title,
          message: description,
          date: "Hoy",
          image,
        },
        ...current,
      ]);
      setActiveFilter("Publicaciones de interacción");
      setActiveInteractionFilter("Publicaciones");
      communityTag = "Interaccion";
    }

    if (formData.targetFilter === "Publicaciones de texto") {
      setTextPostItems((current) => [
        {
          id: newId,
          title,
          message: description,
          date: "Hoy",
          image: "/productos/charla.png",
        },
        ...current,
      ]);
      setActiveFilter("Publicaciones de texto");
      communityTag = "Texto";
    }

    upsertCommunityFeedPosts([
      buildCommunityFeedPost(newId, title, description, image, communityTag, new Date().toISOString()),
    ]);

    setFormData({
      title: "",
      targetFilter: formData.targetFilter,
      description: "",
      price: "",
      image: "",
    });
    setUploadedImagePreview("");
    setUploadedImageName("");
    setFileInputKey((current) => current + 1);
    setPublishMessage("Publicacion agregada correctamente.");
    setShowCreateForm(false);
  };

  return (
    <div className="flex-1 pb-8">
      <header className="tech-top-nav">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Panel empresa</span>
        </div>
      </header>

      <main className="mt-8 grid gap-6 px-6 lg:grid-cols-[280px_1fr]">
        <aside className="tech-card h-fit">
          <p className="tech-mono text-xs text-cyan-200/75">MODULO EMPRESAS</p>
          <nav className="mt-4 space-y-2 text-sm text-cyan-100/90">
            {companyModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 transition hover:bg-cyan-100/5"
              >
                {module.title}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-6 overflow-y-auto pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">PUBLICACIONES DE LA EMPRESA</p>
                  <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Publicaciones de la empresa</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                    La empresa publica productos, servicios, ofertas, promociones y contenido de interacción en una sola
                    vista filtrable, con cards visibles y acción directa para chat.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Contenido visible</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">{activeFilter}</h2>
                  
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap gap-3">
                  {mainFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => handleMainFilterChange(filter)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        activeFilter === filter
                          ? "border-cyan-300/50 bg-cyan-300/20 text-white"
                          : "border-cyan-100/10 bg-white/5 text-cyan-100/80 hover:bg-cyan-100/10"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm((current) => !current);
                    setPublishMessage("");
                    setUploadedImagePreview("");
                    setUploadedImageName("");
                    setFormData((current) => ({
                      ...current,
                      targetFilter: activeFilter,
                      price: activeFilter === "Publicaciones de texto" ? "" : current.price,
                    }));
                  }}
                  className="self-start rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30 xl:self-auto"
                >
                  {createButtonLabel}
                </button>
              </div>

              {showCreateForm ? (
                <form
                  onSubmit={handleCreatePublicationSubmit}
                  className="mt-6 rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">{createFormTitle}</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-cyan-100/85">
                      <span>Titulo</span>
                      <input
                        value={formData.title}
                        onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                        placeholder="Ej: Laptop Pro 14 reacondicionada"
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                    </label>

                    {isServicesView ? (
                      <div className="space-y-2 text-sm text-cyan-100/85">
                        <span>Seccion</span>
                        <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50">
                          Servicios
                        </div>
                      </div>
                    ) : (
                      <label className="space-y-2 text-sm text-cyan-100/85">
                        <span>Seccion</span>
                        <select
                          value={formData.targetFilter}
                          onChange={(event) =>
                            setFormData((current) => ({ ...current, targetFilter: event.target.value as MainFilter }))
                          }
                          className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                        >
                          {mainFilters.map((filter) => (
                            <option key={filter} value={filter}>
                              {filter}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    <label className="space-y-2 text-sm text-cyan-100/85 md:col-span-2">
                      <span>Descripcion</span>
                      <textarea
                        value={formData.description}
                        onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                        placeholder="Describe la publicacion para tus clientes"
                        rows={4}
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-cyan-100/85">
                      <span>Precio (opcional)</span>
                      <input
                        value={formData.price}
                        onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                        placeholder="Ej: Bs 1.500.000"
                        disabled={isTextView}
                        className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                      {isTextView ? <p className="text-xs text-cyan-100/60">Las publicaciones de texto no usan precio.</p> : null}
                    </label>

                    {isTextView ? (
                      <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/40 p-4 text-sm text-cyan-100/75 md:col-span-2">
                        La publicación de texto se publicará con la imagen <span className="font-semibold text-cyan-50">productos/charla.png</span>.
                      </div>
                    ) : (
                      <>
                        <label className="space-y-2 text-sm text-cyan-100/85">
                          <span>Subir imagen desde tu PC (opcional)</span>
                          <input
                            key={fileInputKey}
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                          />
                          {uploadedImageName ? <p className="text-xs text-cyan-100/70">Archivo: {uploadedImageName}</p> : null}
                        </label>

                        <label className="space-y-2 text-sm text-cyan-100/85">
                          <span>URL de imagen (opcional)</span>
                          <input
                            value={formData.image}
                            onChange={(event) => setFormData((current) => ({ ...current, image: event.target.value }))}
                            placeholder="/productos/laptop-pro-14.jpg"
                            className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                          />
                        </label>
                      </>
                    )}
                  </div>

                  {!isTextView && uploadedImagePreview ? (
                    <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-slate-950/40 p-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Vista previa</p>
                      <img
                        src={uploadedImagePreview}
                        alt="Vista previa de imagen seleccionada"
                        className="mt-3 h-40 w-full rounded-2xl object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30"
                    >
                      {submitButtonLabel}
                    </button>
                    {publishMessage ? <p className="text-sm text-cyan-100/80">{publishMessage}</p> : null}
                  </div>
                </form>
              ) : null}

              {activeFilter === "Productos disponibles" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {productItems.map((product) => (
                    <article key={product.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35">
                      <img src={product.image} alt={product.name} className="h-44 w-full object-cover" loading="lazy" />
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                                {company.logo}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{company.name}</p>
                                <p>Producto disponible</p>
                              </div>
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-white">{product.name}</h3>
                          </div>
                          <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            {product.status}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-cyan-100/80">{product.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Precio</p>
                            <p className="mt-1 text-lg font-bold text-white">{product.price ?? "Consultar"}</p>
                          </div>
                         
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeFilter === "Servicios" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {serviceItems.map((service) => (
                    <article key={service.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35">
                      {service.image ? <img src={service.image} alt={service.name} className="h-40 w-full object-cover" loading="lazy" /> : null}
                      <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                            {company.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{company.name}</p>
                            <p>Servicio ofrecido</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white">{service.name}</h3>
                        <p className="text-sm leading-7 text-cyan-100/80">{service.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm text-cyan-100/75">
                            <span className="font-semibold text-white">Precio:</span> {service.price}
                          </p>
                          <button className="rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                            Contactar por chat
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeFilter === "Ofertas y promociones" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {offerItems.map((offer) => (
                    <article key={offer.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-slate-950/35">
                      <img src={offer.image} alt={offer.title} className="h-44 w-full object-cover" loading="lazy" />
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                                {company.logo}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{company.name}</p>
                                <p>{offer.label}</p>
                              </div>
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-white">{offer.title}</h3>
                          </div>
                          <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                            {offer.label}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-cyan-100/80">{offer.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Precio actual</p>
                            <p className="mt-1 text-lg font-bold text-white">{offer.currentPrice}</p>
                          </div>
                          {offer.previousPrice ? (
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Precio anterior</p>
                              <p className="mt-1 text-lg font-semibold text-cyan-100/65 line-through">{offer.previousPrice}</p>
                            </div>
                          ) : null}
                        </div>
                        <button className="rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                          Contactar por chat
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeFilter === "Publicaciones de interacción" && (
                <div className="mt-8 rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  {showInteractionNotice ? (
                    <button
                      type="button"
                      onClick={handleInteractionNotificationClick}
                      className="mb-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-emerald-300/35 bg-emerald-400/10 px-4 py-3 text-left transition hover:bg-emerald-300/15"
                    >
                      <span className="text-sm font-semibold text-emerald-100">
                        {latestInteractionNotification.userName} busco {latestInteractionNotification.productName}
                      </span>
                      <span className="rounded-full border border-emerald-300/35 px-3 py-1 text-xs font-semibold text-emerald-100">
                        Ver usuario
                      </span>
                    </button>
                  ) : null}

                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap gap-3">
                      {interactionFilters.map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setActiveInteractionFilter(filter)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            activeInteractionFilter === filter
                              ? "border-cyan-300/50 bg-cyan-300/20 text-white"
                              : "border-cyan-100/10 bg-white/5 text-cyan-100/80 hover:bg-cyan-100/10"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    {activeInteractionFilter === "Encuestas" ? (
                      <button
                        type="button"
                        onClick={() => setActiveInteractionFilter("Encuestas")}
                        className="self-start rounded-full border border-cyan-300/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/30 xl:self-auto"
                      >
                        Agregar encuesta
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {activeInteractionFilter === "Encuestas" &&
                      surveys.map((survey) => (
                        <article key={survey.id} className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5">
                          <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {company.logo}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{company.name}</p>
                              <p>Encuesta</p>
                            </div>
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-white">{survey.question}</h3>
                          <div className="mt-4 space-y-3">
                            {survey.options.map((option, index) => {
                              const selectedOption = selectedSurveyOption[survey.id];
                              const hasSelection = Boolean(selectedOption);
                              const isSelected = selectedOption === option;
                              const percentage = hasSelection
                                ? isSelected
                                  ? 60
                                  : index === 1
                                    ? 30
                                    : 10
                                : [32, 28, 24, 16][index] ?? 10;

                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => setSelectedSurveyOption((current) => ({ ...current, [survey.id]: option }))}
                                  className="w-full text-left"
                                >
                                  <div className={`rounded-2xl border px-4 py-3 transition ${isSelected ? "border-cyan-300/50 bg-cyan-300/15" : "border-cyan-100/10 bg-slate-950/30"}`}>
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                      <span className="text-cyan-100/90">{option}</span>
                                      <span className="font-semibold text-white">{percentage}%</span>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900/80">
                                      <div
                                        className={`h-full rounded-full ${isSelected ? "bg-cyan-300" : "bg-cyan-500/60"}`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-4 text-sm text-cyan-100/75">{survey.votes} participaciones</p>
                        </article>
                      ))}

                    {activeInteractionFilter === "Publicaciones" &&
                      postItems.map((post) => (
                        <article key={post.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-white/5">
                          {post.image ? <img src={post.image} alt={post.title} className="h-44 w-full object-cover" loading="lazy" /> : null}
                          <div className="space-y-4 p-5">
                            <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                                {company.logo}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{company.name}</p>
                                <p>{post.date}</p>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-white">{post.title}</h3>
                            <p className="text-sm leading-7 text-cyan-100/80">{post.message}</p>
                            <div className="flex flex-wrap gap-3 pt-2">
                              <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                                Contactar por chat
                              </button>
                              <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                                <LikeIcon />
                                Like
                              </button>
                              <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                                <CommentIcon />
                                Comentar
                              </button>
                              <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                                <SendIcon />
                                Enviar
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}

                    {activeInteractionFilter === "Lista de usuarios que interactúan" &&
                      users.map((user) => (
                        <article
                          key={user.id}
                          className={`rounded-3xl border p-5 ${
                            highlightedUserId === user.id
                              ? "border-emerald-300/40 bg-emerald-400/10"
                              : "border-cyan-100/10 bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{user.name}</p>
                              <p className="text-sm text-cyan-100/75">{user.activity}</p>
                            </div>
                          </div>
                          <div className="mt-5">
                            <Link
                              href="/empresa/chat"
                              className="inline-flex rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                            >
                              Chatear
                            </Link>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              )}

              {activeFilter === "Publicaciones de texto" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {textPostItems.map((post) => (
                    <article key={post.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-white/5">
                      <img src={post.image} alt={post.title} className="h-44 w-full object-cover" loading="lazy" />
                      <div className="space-y-4 p-5">
                        <div className="flex items-center gap-3 text-sm text-cyan-100/75">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                            {company.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{company.name}</p>
                            <p>{post.date}</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white">{post.title}</h3>
                        <p className="text-sm leading-7 text-cyan-100/80">{post.message}</p>
                        <div className="flex flex-wrap gap-3 pt-2">
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                            Contactar por chat
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                            <LikeIcon />
                            Like
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                            <CommentIcon />
                            Comentar
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 transition hover:bg-cyan-100/10">
                            <SendIcon />
                            Enviar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
