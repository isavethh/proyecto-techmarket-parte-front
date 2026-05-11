import Link from "next/link";
import { getClientCompanyProfile } from "../../../lib/clientCompanyProfiles";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Calificacion ${rating} de 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Math.round(rating);
        return (
          <span
            key={index}
            className={filled ? "text-amber-400" : "text-cyan-100/25"}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

export default async function ClienteEmpresaPerfilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getClientCompanyProfile(slug);

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de empresa" sticky={false} />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
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
                const isActive = item.href === "/cliente/empresas";

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
            <p className="tech-mono text-xs text-cyan-200/75">PERFIL DE EMPRESA</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Vista para cliente</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Revisa reputacion, especialidades, contacto y senales de confianza antes de comparar o contactar.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Empresa", "Reputacion", "Servicios", "Confianza"].map((chip) => (
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
                { href: "/cliente/marketplace", label: "Ir a marketplace" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr] md:p-8">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100/10 bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                    {profile.logo}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil de empresa</p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{profile.name}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-cyan-100/80 sm:text-base">{profile.tagline}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-4 py-2 text-cyan-100">{profile.category}</span>
                  <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">{profile.city}</span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <RatingStars rating={profile.rating} />
                      <p className="text-lg font-bold text-white">{profile.rating.toFixed(1)} / 5</p>
                    </div>
                    <p className="mt-2 text-xs text-cyan-100/70">Valoracion promedio de clientes</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Reseñas</p>
                    <p className="mt-3 text-2xl font-bold text-white">{profile.reviewCount}</p>
                    <p className="mt-1 text-sm text-cyan-100/70">Opiniones de clientes</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Servicios</p>
                    <p className="mt-3 text-base font-semibold text-white">Soporte y venta especializada</p>
                    <p className="mt-1 text-sm text-cyan-100/70">Asesoria clara para comparar antes de comprar</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cobertura</p>
                    <p className="mt-3 text-base font-semibold text-white">Atencion local y a domicilio</p>
                    <p className="mt-1 text-sm text-cyan-100/70">Segun zona de servicio</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Resumen para cliente</p>
                <p className="mt-4 text-sm leading-7 text-cyan-100/80">{profile.description}</p>
                <div className="mt-5 grid gap-3 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4 text-sm text-cyan-100/85">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Ciudad principal</span>
                    <span>{profile.city}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Categoria</span>
                    <span>{profile.category}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Perfil abierto para</span>
                    <span>Descubrir, comparar y contactar</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Especialidades</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Que ofrece esta empresa</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {profile.specialties.map((item) => (
                  <span key={item} className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Servicios destacados</p>
                <div className="mt-4 grid gap-2">
                  {profile.featuredServices.map((service) => (
                    <div key={service} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                      {service}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Senales de confianza</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-cyan-100/10 bg-white/5 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/65">Calificacion</p>
                    <p className="mt-2 text-xl font-bold text-white">{profile.rating.toFixed(1)}</p>
                    <p className="mt-1 text-xs text-cyan-100/70">Promedio general</p>
                  </div>

                  <div className="rounded-xl border border-cyan-100/10 bg-white/5 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/65">Opiniones</p>
                    <p className="mt-2 text-xl font-bold text-white">{profile.reviewCount}</p>
                    <p className="mt-1 text-xs text-cyan-100/70">Clientes registrados</p>
                  </div>

                  <div className="rounded-xl border border-cyan-100/10 bg-white/5 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/65">Cobertura</p>
                    <p className="mt-2 text-xl font-bold text-white">{profile.coverage.length}</p>
                    <p className="mt-1 text-xs text-cyan-100/70">Zonas de atencion</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Contacto y horarios</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Como contactar y cuando atiende</h2>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Canales de contacto</p>
                  <div className="mt-3 grid gap-2 text-sm text-cyan-100/85">
                    {profile.contact.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Horarios</p>
                  <div className="mt-3 grid gap-2 text-sm text-cyan-100/85">
                    {profile.hours.map((item) => (
                      <div key={item.day} className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.day}</span>
                        <span>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cobertura</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {profile.coverage.map((area) => (
                      <span key={area} className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Productos destacados</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Que puede ver el cliente</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {profile.featuredProducts.map((product) => (
                <div key={product} className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                  <p className="text-sm font-semibold text-cyan-50">{product}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">Disponible para compra o consulta dentro del ecosistema.</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
