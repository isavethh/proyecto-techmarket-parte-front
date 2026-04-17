import Link from "next/link";

type ServiceInfo = {
  title: string;
  subtitle: string;
  rating: string;
  location: string;
  tags: string[];
};

type Review = {
  user: string;
  date: string;
  rating: string;
  text: string;
};

const SERVICE_MAP: Record<string, ServiceInfo> = {
  "servicio-tecnico-laptop-domicilio": {
    title: "Servicio tecnico laptop a domicilio",
    subtitle: "Atencion rapida y diagnostico en casa",
    rating: "4.9",
    location: "Bogota · Disponibilidad hoy",
    tags: ["Laptop", "Domicilio", "Diagnostico"],
  },
  "diagnostico-mantenimiento-preventivo": {
    title: "Diagnostico y mantenimiento preventivo",
    subtitle: "Revision completa para evitar fallas",
    rating: "4.8",
    location: "Medellin · Agenda 24h",
    tags: ["Mantenimiento", "Prevencion", "Limpieza"],
  },
  "cambio-pasta-termica-limpieza": {
    title: "Cambio de pasta termica + limpieza",
    subtitle: "Reduce temperaturas y mejora rendimiento",
    rating: "4.7",
    location: "Cali · Agenda express",
    tags: ["Pasta termica", "Limpieza", "Rendimiento"],
  },
};

const FALLBACK_SERVICE: ServiceInfo = {
  title: "Servicio tecnico especializado",
  subtitle: "Atencion confiable para tu equipo",
  rating: "4.8",
  location: "Disponible en tu ciudad",
  tags: ["Diagnostico", "Reparacion", "Soporte"],
};

const REVIEWS: Review[] = [
  {
    user: "Mariana G.",
    date: "Hace 2 dias",
    rating: "5.0",
    text: "Solucionaron el problema en el mismo dia, super puntuales.",
  },
  {
    user: "Carlos R.",
    date: "Hace 1 semana",
    rating: "4.8",
    text: "Muy buena atencion y explican todo con claridad.",
  },
  {
    user: "Laura M.",
    date: "Hace 2 semanas",
    rating: "4.7",
    text: "Buen servicio y precios justos. Recomendado.",
  },
];

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICE_MAP[slug] ?? FALLBACK_SERVICE;

  return (
    <div className="flex-1 pb-12">
      <header className="tech-top-nav">
        <div className="tech-shell flex items-center justify-between py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <Link href="/cliente" className="text-sm text-cyan-200/80">
            Volver a cliente
          </Link>
        </div>
      </header>

      <main className="tech-shell mt-8 space-y-6">
        <section className="tech-hero p-6 md:p-8">
          <p className="tech-mono text-xs text-cyan-200/75">SERVICIO TECNICO</p>
          <h1 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">
            {service.title}
          </h1>
          <p className="mt-3 text-sm text-cyan-100/80 md:text-base">
            {service.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-cyan-100/80">
            <span className="rounded-full border border-cyan-100/20 px-3 py-1">
              Reputacion {service.rating}
            </span>
            <span className="rounded-full border border-cyan-100/20 px-3 py-1">
              {service.location}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-100/15 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-100/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="tech-card">
          <h2 className="text-2xl font-semibold text-cyan-50">Resenas destacadas</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {REVIEWS.map((review) => (
              <article
                key={`${review.user}-${review.date}`}
                className="rounded-2xl border border-cyan-100/15 p-4"
              >
                <div className="flex items-center justify-between text-sm text-cyan-100/80">
                  <span>{review.user}</span>
                  <span>{review.date}</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-cyan-50">
                  {review.rating}
                </p>
                <p className="mt-2 text-sm text-cyan-100/80">{review.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
