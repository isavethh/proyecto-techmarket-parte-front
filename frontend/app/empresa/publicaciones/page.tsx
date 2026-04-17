"use client";

import Link from "next/link";
import { useState } from "react";

type MainFilter = "Productos disponibles" | "Servicios" | "Ofertas y promociones" | "Publicaciones de interacción";
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
];

const interactionFilters: InteractionFilter[] = [
  "Encuestas",
  "Publicaciones",
  "Lista de usuarios que interactúan",
];

const company = {
  name: "TecnoCentro Andino",
  logo: "TC",
};

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

const products: ProductCard[] = [
  {
    id: "prod-1",
    name: "Laptop Pro 14",
    description: "Intel i7, 16 GB RAM, SSD 512 GB para trabajo y estudio.",
    price: "$3.650.000",
    status: "Disponible",
    image: "/productos/laptop-pro-14.jpg",
  },
  {
    id: "prod-2",
    name: "Monitor UltraWide 34",
    description: "Pantalla amplia 3440 x 1440 para productividad y diseño.",
    price: "$1.480.000",
    status: "Disponible",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "prod-3",
    name: "Teclado mecanico TKL",
    description: "Switch azul, RGB y formato compacto para setups modernos.",
    price: "$260.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-4",
    name: "Kit limpieza PC",
    description: "Brochas, aire y pasta termica para cuidado de equipos.",
    price: "$85.000",
    status: "Disponible",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "prod-5",
    name: "Mouse ergonomico",
    description: "Comodidad para jornadas largas de oficina o estudio.",
    price: "$95.000",
    status: "Disponible",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "prod-6",
    name: "Cableado de red Cat 6",
    description: "Solucion para instalacion estable en oficinas y hogares.",
    price: "$12.000",
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
    price: "$120.000",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "serv-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza interna, control de temperatura y optimizacion.",
    price: "$95.000",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "serv-4",
    name: "Soporte tecnico remoto",
    description: "Asistencia rapida para configuraciones y solucion de errores.",
    price: "$65.000",
    image: "/productos/teclado-tkl.jpg",
  },
];

const offers: OfferCard[] = [
  {
    id: "offer-1",
    title: "Descuento en diagnostico + limpieza",
    description: "Promo especial para equipos con bajo rendimiento o sobrecalentamiento.",
    currentPrice: "$95.000",
    previousPrice: "$140.000",
    label: "Oferta",
    image: "/productos/monitor-ultrawide-34.jpg",
  },
  {
    id: "offer-2",
    title: "Combo empresarial para pequenas oficinas",
    description: "Instalacion de red, soporte remoto y acompanamiento mensual.",
    currentPrice: "$420.000",
    previousPrice: "$520.000",
    label: "Promocion",
    image: "/productos/teclado-tkl.jpg",
  },
  {
    id: "offer-3",
    title: "Pack limpieza premium",
    description: "Limpieza interna + revision termica con descuento por tiempo limitado.",
    currentPrice: "$110.000",
    previousPrice: "$150.000",
    label: "Oferta",
    image: "/productos/kit-limpieza-pc.jpg",
  },
  {
    id: "offer-4",
    title: "Servicio rapido de soporte",
    description: "Atencion prioritaria para problemas frecuentes de software.",
    currentPrice: "$55.000",
    previousPrice: "$75.000",
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

const users: UserCard[] = [
  { id: "user-1", name: "Carlos M.", avatar: "CM", activity: "Dio like a un producto hace 1 hora" },
  { id: "user-2", name: "Laura P.", avatar: "LP", activity: "Participo en una encuesta hace 3 horas" },
  { id: "user-3", name: "Sofia R.", avatar: "SR", activity: "Comento una publicacion informativa" },
  { id: "user-4", name: "Andres T.", avatar: "AT", activity: "Reacciono a una promocion activa" },
];

export default function PublicacionesPage() {
  const [activeFilter, setActiveFilter] = useState<MainFilter>("Productos disponibles");
  const [activeInteractionFilter, setActiveInteractionFilter] = useState<InteractionFilter>("Encuestas");

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

              <div className="mt-6 flex flex-wrap gap-3">
                {mainFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
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

              {activeFilter === "Productos disponibles" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
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
                          <button className="rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                            Contactar por chat
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {activeFilter === "Servicios" && (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {services.map((service) => (
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
                  {offers.map((offer) => (
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
                          <div className="mt-4 space-y-2">
                            {survey.options.map((option) => (
                              <div key={option} className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 px-4 py-3 text-sm text-cyan-100/85">
                                {option}
                              </div>
                            ))}
                          </div>
                          <p className="mt-4 text-sm text-cyan-100/75">{survey.votes} participaciones</p>
                        </article>
                      ))}

                    {activeInteractionFilter === "Publicaciones" &&
                      posts.map((post) => (
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
                          </div>
                        </article>
                      ))}

                    {activeInteractionFilter === "Lista de usuarios que interactúan" &&
                      users.map((user) => (
                        <article key={user.id} className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{user.name}</p>
                              <p className="text-sm text-cyan-100/75">{user.activity}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
