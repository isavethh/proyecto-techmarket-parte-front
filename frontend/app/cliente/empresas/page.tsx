import Link from "next/link";
import { clientCompanyProfiles } from "../../lib/clientCompanyProfiles";
import { ClientTopbarControls } from "../../components/ClientExperienceShell";

export default function ClienteEmpresasPage() {
  return (
    <div className="flex-1 pb-10">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/cliente" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <ClientTopbarControls sectionLabel="Empresas" />
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">EXPLORA EMPRESAS</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Descubre quienes son y que hacen</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              Aqui ves varias empresas del ecosistema con un resumen breve. Al abrir una card entras a su perfil.
            </p>
          </section>

          <section className="tech-card space-y-2">
            <Link href="/cliente" className="auth-action">
              Volver al feed
            </Link>
            <Link href="/cliente/servicios" className="auth-action">
              Ver servicios
            </Link>
            <Link href="/cliente/versus" className="auth-action">
              Comparar productos
            </Link>
          </section>
        </aside>

        <section className="space-y-4">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">CARD GRID</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Empresas destacadas</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              Pulsa una tarjeta para ver el perfil de la empresa dentro de TechMarket.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clientCompanyProfiles.map((profile) => (
              <Link
                key={profile.slug}
                href={`/cliente/empresa/${profile.slug}`}
                className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25 transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-lg font-bold text-slate-950">
                      {profile.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-cyan-50">{profile.name}</p>
                      <p className="truncate text-xs text-cyan-200/70">{profile.city} · {profile.category}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-cyan-100/80">
                    {profile.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.specialties.slice(0, 3).map((item) => (
                      <span key={item} className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-xs text-cyan-100/80">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-cyan-100/10 pt-4 text-xs text-cyan-200/75">
                    <span>Valoracion {profile.rating.toFixed(1)}</span>
                    <span>{profile.reviewCount} opiniones</span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
