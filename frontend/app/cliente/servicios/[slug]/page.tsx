import Link from "next/link";
import { getServicePublication, servicePublications } from "../../../lib/servicePublications";
import { ClientPageHeader } from "../../../components/ClientPageSections";

type Review = {
  user: string;
  date: string;
  rating: string;
  text: string;
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
  const service = getServicePublication(slug);
  const relatedServices = servicePublications
    .filter((item) => item.slug !== service.slug)
    .slice(0, 2);

  return (
    <div className="flex-1 pb-12">
      <ClientPageHeader
        sectionLabel="Detalle de servicio"
        brandHref="/"
        sticky={false}
        rightSlot={(
          <Link href="/cliente" className="text-sm text-cyan-200/80">
            Volver a cliente
          </Link>
        )}
      />

      <main className="tech-shell mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:items-start">
        <section className="space-y-5">
          <article className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(160deg,rgba(12,39,68,0.95),rgba(6,23,43,0.96))] shadow-xl shadow-slate-950/35">
            <img src={service.image} alt={service.title} className="h-52 w-full object-cover md:h-64" loading="lazy" />
            <div className="p-5 md:p-7">
              <p className="tech-mono text-xs text-cyan-200/75">SERVICIO EN BOLIVIA</p>
              <h1 className="mt-2 text-2xl font-bold text-cyan-50 md:text-4xl">{service.title}</h1>
              <p className="mt-3 text-sm text-cyan-100/80 md:text-base">{service.description}</p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-cyan-100/15 bg-cyan-950/25 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Empresa</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-50">{service.company}</p>
                </div>
                <div className="rounded-2xl border border-cyan-100/15 bg-cyan-950/25 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Cobertura</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-50">{service.city}, Bolivia</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-cyan-100/15 bg-cyan-950/45 px-3 py-1 text-xs text-cyan-100/85"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <section className="tech-card">
            <h2 className="text-xl font-semibold text-cyan-50 md:text-2xl">Resenas destacadas</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {REVIEWS.map((review) => (
                <article
                  key={`${review.user}-${review.date}`}
                  className="rounded-2xl border border-cyan-100/15 bg-cyan-950/20 p-4"
                >
                  <div className="flex items-center justify-between gap-2 text-sm text-cyan-100/75">
                    <span className="truncate">{review.user}</span>
                    <span>{review.date}</span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-cyan-50">{review.rating} / 5</p>
                  <p className="mt-2 text-sm text-cyan-100/80">{review.text}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">RESUMEN RAPIDO</p>
            <div className="mt-3 space-y-3 text-sm text-cyan-100/85">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-100/12 bg-cyan-950/20 px-3 py-2">
                <span>Precio</span>
                <strong className="text-cyan-50">{service.price}</strong>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-100/12 bg-cyan-950/20 px-3 py-2">
                <span>Disponibilidad</span>
                <strong className="text-cyan-50">{service.availability}</strong>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-100/12 bg-cyan-950/20 px-3 py-2">
                <span>Calificacion</span>
                <strong className="text-cyan-50">{service.rating.toFixed(1)}</strong>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Link href="/cliente/chat" className="tech-button tech-button-primary w-full">
                Contactar ahora
              </Link>
              <Link href="/cliente/servicios" className="auth-action block w-full text-center">
                Ver mas servicios
              </Link>
            </div>
          </section>

          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">TAMBIEN TE PUEDE INTERESAR</p>
            <div className="mt-3 space-y-2">
              {relatedServices.map((item) => (
                <Link
                  key={item.slug}
                  href={`/cliente/servicios/${item.slug}`}
                  className="block rounded-xl border border-cyan-100/15 bg-cyan-950/20 px-3 py-2 transition hover:border-cyan-300/45"
                >
                  <p className="text-sm font-semibold text-cyan-50">{item.title}</p>
                  <p className="mt-1 text-xs text-cyan-100/75">{item.city}, Bolivia</p>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
