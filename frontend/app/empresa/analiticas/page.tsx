import Link from "next/link";

type PublicationMetric = {
  id: string;
  title: string;
  visits: number;
  conversion: number;
};

type RatingLevel = {
  stars: number;
  percent: number;
  users: number;
};

type UserReview = {
  id: string;
  user: string;
  stars: number;
  text: string;
  date: string;
};

type UserComment = {
  id: string;
  user: string;
  publication: string;
  text: string;
  date: string;
};

type GrowthPoint = {
  month: string;
  visits: number;
};

const companyModules = [
  { title: "Perfil y tienda", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

const publicationMetrics: PublicationMetric[] = [
  { id: "pm-1", title: "Laptop Pro 14", visits: 2380, conversion: 18 },
  { id: "pm-2", title: "Monitor UltraWide 34", visits: 1740, conversion: 12 },
  { id: "pm-3", title: "Mantenimiento preventivo", visits: 1290, conversion: 21 },
  { id: "pm-4", title: "Combo empresarial", visits: 940, conversion: 15 },
  { id: "pm-5", title: "Pack limpieza premium", visits: 760, conversion: 9 },
];

const ratingLevels: RatingLevel[] = [
  { stars: 5, percent: 62, users: 124 },
  { stars: 4, percent: 24, users: 48 },
  { stars: 3, percent: 9, users: 18 },
  { stars: 2, percent: 3, users: 6 },
  { stars: 1, percent: 2, users: 4 },
];

const userReviews: UserReview[] = [
  {
    id: "rev-1",
    user: "Alejandro",
    stars: 5,
    text: "Buena atencion por chat y explicacion clara del equipo.",
    date: "17 abr 2026",
  },
  {
    id: "rev-2",
    user: "Laura P.",
    stars: 4,
    text: "Servicio rapido, me ayudaron con mantenimiento y seguimiento.",
    date: "16 abr 2026",
  },
  {
    id: "rev-3",
    user: "Carlos M.",
    stars: 5,
    text: "La publicacion tenia toda la info y por chat resolvieron todo.",
    date: "15 abr 2026",
  },
];

const userComments: UserComment[] = [
  {
    id: "com-1",
    user: "Sofia R.",
    publication: "Combo empresarial",
    text: "Tienen plan para oficina de 8 equipos?",
    date: "Hace 1 h",
  },
  {
    id: "com-2",
    user: "Andres T.",
    publication: "Monitor UltraWide 34",
    text: "El precio incluye garantia extendida?",
    date: "Hace 3 h",
  },
  {
    id: "com-3",
    user: "Valentina G.",
    publication: "Pack limpieza premium",
    text: "En cuanto tiempo hacen el servicio?",
    date: "Ayer",
  },
  {
    id: "com-4",
    user: "Alejandro",
    publication: "Laptop Pro 14",
    text: "Busque este modelo, hay unidades para entrega inmediata?",
    date: "Hace 2 min",
  },
];

const growthSeries: GrowthPoint[] = [
  { month: "Nov", visits: 1200 },
  { month: "Dic", visits: 1360 },
  { month: "Ene", visits: 1490 },
  { month: "Feb", visits: 1710 },
  { month: "Mar", visits: 1980 },
  { month: "Abr", visits: 2240 },
];

const totalVisits = publicationMetrics.reduce((acc, item) => acc + item.visits, 0);
const avgConversion = Math.round(
  publicationMetrics.reduce((acc, item) => acc + item.conversion, 0) / publicationMetrics.length
);
const ratingAverage = 4.4;
const growthIndex = 27;

function renderStars(stars: number) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

export default function AnaliticasPage() {
  const highestVisits = Math.max(...publicationMetrics.map((item) => item.visits));
  const highestGrowth = Math.max(...growthSeries.map((item) => item.visits));

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
          <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                TC
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">TechMarket</p>
              </div>
            </div>
          </div>
          <p className="tech-mono mt-4 text-xs text-cyan-200/75">MODULO EMPRESAS</p>
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
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="space-y-8 p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="tech-mono text-xs text-cyan-200/75">ANALITICAS</p>
                  <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Dashboard de rendimiento</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
                    Seguimiento de visitas generadas por publicaciones, estrellas segun usuarios, resenas,
                    comentarios y el indice de crecimiento del negocio.
                  </p>
                </div>

                <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Indice de crecimiento</p>
                  <p className="mt-3 text-4xl font-bold text-emerald-200">+{growthIndex}%</p>
                  <p className="mt-3 text-sm text-cyan-100/80">
                    El crecimiento actual combina alcance de publicaciones, conversion a chat y retencion por
                    recomendaciones de usuarios.
                  </p>
                </div>
              </div>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Visitas totales</p>
                  <p className="mt-3 text-3xl font-bold text-white">{totalVisits.toLocaleString("es-BO")}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Publicaciones activas</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion promedio</p>
                  <p className="mt-3 text-3xl font-bold text-white">{ratingAverage.toFixed(1)} / 5</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Segun valoraciones de clientes</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Resenas totales</p>
                  <p className="mt-3 text-3xl font-bold text-white">{userReviews.length}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Opiniones verificadas</p>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Conversion promedio</p>
                  <p className="mt-3 text-3xl font-bold text-white">{avgConversion}%</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Visita a contacto por chat</p>
                </article>
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Visitas por publicacion</h2>
                  <div className="mt-5 space-y-4">
                    {publicationMetrics.map((item) => {
                      const width = Math.max(12, Math.round((item.visits / highestVisits) * 100));

                      return (
                        <div key={item.id}>
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <p className="font-semibold text-cyan-50">{item.title}</p>
                            <p className="text-cyan-100/75">{item.visits.toLocaleString("es-BO")} visitas</p>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900/80">
                            <div className="h-full rounded-full bg-cyan-300" style={{ width: `${width}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-cyan-100/65">Conversion a chat: {item.conversion}%</p>
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Estrellas segun usuarios</h2>
                  <div className="mt-5 space-y-4">
                    {ratingLevels.map((level) => (
                      <div key={level.stars}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <p className="font-semibold text-amber-200">{renderStars(level.stars)}</p>
                          <p className="text-cyan-100/75">{level.users} usuarios</p>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900/80">
                          <div className="h-full rounded-full bg-amber-300" style={{ width: `${level.percent}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-cyan-100/65">{level.percent}% del total</p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Resenas de usuarios</h2>
                  <div className="mt-5 space-y-4">
                    {userReviews.map((review) => (
                      <div key={review.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-cyan-50">{review.user}</p>
                          <p className="text-xs text-cyan-100/65">{review.date}</p>
                        </div>
                        <p className="mt-1 text-sm text-amber-200">{renderStars(review.stars)}</p>
                        <p className="mt-2 text-sm leading-7 text-cyan-100/80">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                  <h2 className="text-2xl font-bold text-white">Comentarios recientes</h2>
                  <div className="mt-5 space-y-4">
                    {userComments.map((comment) => (
                      <div key={comment.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-cyan-50">{comment.user}</p>
                          <p className="text-xs text-cyan-100/65">{comment.date}</p>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/70">{comment.publication}</p>
                        <p className="mt-2 text-sm leading-7 text-cyan-100/80">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
                <h2 className="text-2xl font-bold text-white">Indice de crecimiento mensual</h2>
                <p className="mt-2 text-sm text-cyan-100/75">
                  Tendencia de visitas en los ultimos meses para medir el impacto de publicaciones y promociones.
                </p>

                <div className="mt-5 grid grid-cols-6 gap-3">
                  {growthSeries.map((point) => {
                    const height = Math.max(20, Math.round((point.visits / highestGrowth) * 180));

                    return (
                      <div key={point.month} className="flex flex-col items-center gap-2">
                        <div className="flex h-48 w-full items-end rounded-2xl bg-slate-900/70 p-2">
                          <div className="w-full rounded-xl bg-cyan-300" style={{ height }} />
                        </div>
                        <p className="text-xs font-semibold text-cyan-100/75">{point.month}</p>
                        <p className="text-xs text-cyan-100/65">{point.visits}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
