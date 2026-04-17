import Link from "next/link";

type PortfolioItem = {
  id: string;
  image: string;
  description: string;
  serviceType: string;
  date?: string;
};

type SpecialistService = {
  id: string;
  name: string;
  description: string;
  price: string;
  type: string;
};

type UserReview = {
  id: string;
  user: string;
  comment: string;
  stars: number;
};

const specialistProfile = {
  name: "Alejandro Torres",
  avatar: "AT",
  specialization: "Redes, laptops y soporte tecnico",
  location: "Cali, Valle del Cauca",
  bio: "Especialista con enfoque en diagnostico, mantenimiento e instalacion para usuarios y pequenas empresas.",
};

const portfolio: PortfolioItem[] = [
  {
    id: "p-1",
    image: "/productos/laptop-pro-14.jpg",
    description: "Recuperacion y optimizacion de laptop para trabajo remoto con mejoras de rendimiento.",
    serviceType: "Mantenimiento y optimizacion",
    date: "Abr 2026",
  },
  {
    id: "p-2",
    image: "/productos/monitor-ultrawide-34.jpg",
    description: "Configuracion completa de puesto de trabajo con monitor ultrawide y calibracion inicial.",
    serviceType: "Instalacion",
    date: "Mar 2026",
  },
  {
    id: "p-3",
    image: "/productos/kit-limpieza-pc.jpg",
    description: "Servicio tecnico integral con limpieza interna, pasta termica y validacion de temperatura.",
    serviceType: "Reparacion",
  },
];

const specialistServices: SpecialistService[] = [
  {
    id: "s-1",
    name: "Reparacion de laptops",
    description: "Diagnostico de fallas, cambio de componentes y validacion funcional completa.",
    price: "$120.000",
    type: "Reparacion",
  },
  {
    id: "s-2",
    name: "Instalacion y configuracion de redes",
    description: "Cableado, configuracion de router y pruebas de estabilidad para hogar u oficina.",
    price: "Consultar",
    type: "Instalacion",
  },
  {
    id: "s-3",
    name: "Mantenimiento preventivo",
    description: "Limpieza, optimizacion de sistema y recomendaciones para aumentar vida util.",
    price: "$95.000",
    type: "Mantenimiento",
  },
];

const reviews: UserReview[] = [
  { id: "r-1", user: "Carlos M.", comment: "Excelente atencion y soluciono el problema el mismo dia.", stars: 5 },
  { id: "r-2", user: "Laura P.", comment: "Muy claro al explicar opciones y costos del servicio.", stars: 4 },
  { id: "r-3", user: "Sofia R.", comment: "Buen seguimiento despues del trabajo realizado.", stars: 5 },
];

function starsLabel(value: number) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

export default function EspecialistaPage() {
  const averageRating = 4.7;
  const totalReviews = 38;
  const jobsCompleted = 126;

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
          <p className="tech-mono text-xs text-cyan-200/75">MODULO TECNICOS/ESPECIALISTAS</p>
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
            <div className="mt-4 flex flex-wrap items-center gap-4">
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
          </section>

          <section id="portafolio" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <h2 className="text-2xl font-bold text-white">Portafolio</h2>
            <p className="mt-2 text-sm text-cyan-100/75">Trabajos realizados que demuestran experiencia tecnica comprobable.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {portfolio.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-white/5">
                  <img src={item.image} alt={item.serviceType} className="h-44 w-full object-cover" loading="lazy" />
                  <div className="space-y-3 p-4">
                    <p className="text-sm font-semibold text-cyan-50">{item.serviceType}</p>
                    <p className="text-sm leading-7 text-cyan-100/80">{item.description}</p>
                    {item.date ? <p className="text-xs text-cyan-200/70">Fecha: {item.date}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="servicios" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <h2 className="text-2xl font-bold text-white">Servicios</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {specialistServices.map((service) => (
                <article key={service.id} className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">{service.type}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{service.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-cyan-100/80">{service.description}</p>
                  <p className="mt-3 text-sm text-cyan-100/80">
                    <span className="font-semibold text-white">Precio:</span> {service.price}
                  </p>
                  <button className="mt-4 rounded-full border border-cyan-100/10 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
                    Contactar por chat
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section id="reputacion" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <h2 className="text-2xl font-bold text-white">Reputacion</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Calificacion promedio</p>
                <p className="mt-2 text-2xl font-bold text-white">{averageRating} / 5</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Resenas totales</p>
                <p className="mt-2 text-2xl font-bold text-white">{totalReviews}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Trabajos realizados</p>
                <p className="mt-2 text-2xl font-bold text-white">{jobsCompleted}</p>
              </article>
            </div>

            <div className="mt-5 space-y-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-cyan-50">{review.user}</p>
                    <p className="text-sm text-amber-200">{starsLabel(review.stars)}</p>
                  </div>
                  <p className="mt-2 text-sm text-cyan-100/80">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="disponibilidad" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <h2 className="text-2xl font-bold text-white">Disponibilidad</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-emerald-300/35 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/80">Estado actual</p>
                <p className="mt-2 text-lg font-bold text-emerald-100">Disponible</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Dias de atencion</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Lunes a Sabado</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Horarios</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">08:00 AM - 06:00 PM</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modalidad</p>
                <p className="mt-2 text-sm font-semibold text-cyan-50">Presencial, remoto y a domicilio</p>
              </article>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
