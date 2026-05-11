import Link from "next/link";
import { servicePublications } from "../../lib/servicePublications";
import {
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../components/ClientPageSections";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

export default function ServiciosIndexPage() {
  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader sectionLabel="Servicios" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:h-[calc(100vh-140px)] lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
          <section className="tech-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                CM
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">Cliente activo en TechMarket</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {clientMenuItems.map((item) => {
                const isActive = item.href === "/cliente/servicios";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`auth-action ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">SERVICIOS</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Busqueda guiada</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Encuentra soporte tecnico, mantenimiento y atencion especializada segun necesidad y confianza.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Busqueda", "Tecnicos", "Match", "Cobertura"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs text-cyan-100/85"
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>

          <div className="space-y-4">
            <ClientQuickLinksCard
              links={[
                { href: "/cliente", label: "Volver al feed" },
                { href: "/cliente/versus", label: "Comparar productos" },
                { href: "#servicios-activos", label: "Ver servicios activos" },
              ]}
            />
          </div>
        </aside>

        <section id="servicios-activos" className="chat-scrollbar min-h-0 space-y-4 overflow-y-auto overflow-x-hidden pr-0 lg:h-[calc(100vh-140px)] lg:pr-4">
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
                <img src={service.image} alt={service.title} className="h-48 w-full bg-slate-950/40 object-contain object-center p-2" loading="lazy"/>
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
