import Link from "next/link";
import { servicePublications } from "../../lib/servicePublications";

export default function ServiciosIndexPage() {
  return (
    <div className="flex-1 pb-10">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/cliente" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Cliente · Servicios</span>
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">SERVICIOS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Solo publicaciones de servicios</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Aqui solo aparecen servicios publicados por empresas del ecosistema.
            </p>
          </section>

          <section className="tech-card space-y-2">
            <Link href="/cliente" className="auth-action">
              Volver al feed
            </Link>
            <Link href="/cliente/versus" className="auth-action">
              Comparar productos
            </Link>
            <Link href="#servicios-activos" className="auth-action">
              Ver servicios activos
            </Link>
          </section>
        </aside>

        <section id="servicios-activos" className="space-y-4">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">BUSQUEDA FILTRADA</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Publicaciones de servicio disponibles</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              No se mezclan productos ni publicaciones sociales; solo ofertas de servicio.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {servicePublications.map((service) => (
              <article
                key={service.slug}
                className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25"
              >
                <img src={service.image} alt={service.title} className="h-48 w-full object-cover" loading="lazy" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">{service.company}</p>
                      <p className="text-xs text-cyan-200/70">{service.city}</p>
                    </div>
                    <span className="rounded-full border border-cyan-100/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/90">
                      {service.availability}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm text-cyan-100/80">{service.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-xs text-cyan-100/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-cyan-50">{service.price}</span>
                    <Link href={`/cliente/servicios/${service.slug}`} className="tech-button tech-button-primary">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
