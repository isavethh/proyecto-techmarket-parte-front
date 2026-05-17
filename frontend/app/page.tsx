import Link from "next/link";

const userTypes = [
  {
    icon: "👤",
    title: "Soy Cliente",
    description: "Compro productos, contrato servicios técnicos y descubro empresas verificadas.",
    cta: "Explorar como cliente",
    href: "/auth?mode=login&type=cliente",
    accent: "from-cyan-300/20 to-blue-500/10",
  },
  {
    icon: "🏢",
    title: "Tengo una Empresa",
    description: "Vendo productos, publico ofertas y conecto con miles de clientes en Bolivia.",
    cta: "Acceder al panel empresa",
    href: "/auth?mode=login&type=empresa",
    accent: "from-emerald-300/20 to-teal-500/10",
  },
  {
    icon: "🛠️",
    title: "Soy Especialista",
    description: "Ofrezco servicios técnicos, gestiono proyectos y construyo mi reputación.",
    cta: "Ir al panel técnico",
    href: "/auth?mode=login&type=especialista",
    accent: "from-amber-300/15 to-orange-500/10",
  },
  {
    icon: "🌐",
    title: "Soy Embajador",
    description: "Refiero empresas y especialistas a TechMarket y gano comisiones recurrentes.",
    cta: "Panel embajador",
    href: "/auth?mode=login&type=embajador",
    accent: "from-fuchsia-300/15 to-purple-500/10",
  },
];

const features = [
  {
    title: "Marketplace integrado",
    description: "Productos, servicios y ofertas en un solo lugar. Compras seguras con seguimiento.",
  },
  {
    title: "Chat comercial directo",
    description: "Conversa con empresas y especialistas sin intermediarios. Cierra ventas en minutos.",
  },
  {
    title: "Reputación verificada",
    description: "Reseñas reales de clientes con chat previo. Confianza basada en interacciones.",
  },
  {
    title: "Red de embajadores",
    description: "Sistema multinivel de referidos con comisiones automáticas y panel financiero.",
  },
];

export default function Home() {
  return (
    <div className="flex-1 pb-16">
      <header className="tech-top-nav sticky top-0 z-20">
        <div className="tech-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 shadow-lg shadow-cyan-500/30" />
            <div>
              <p className="font-bold tracking-wide text-cyan-50">TechMarket</p>
              <p className="tech-mono text-xs text-cyan-200/80">ecosystem.build.v1</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/auth?mode=login"
              className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth?mode=register"
              className="rounded-xl border border-cyan-200/35 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/30"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      <main className="tech-shell mt-10 space-y-14">
        {/* HERO */}
        <section className="tech-hero fade-rise mx-auto w-full max-w-5xl p-6 text-center md:p-12">
          <span className="tech-chip">Ecosistema especializado en tecnología</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-cyan-50 md:text-6xl">
            Conectamos a quienes <span className="text-cyan-300">venden, compran, ofrecen</span> y{" "}
            <span className="text-cyan-300">refieren</span> tecnología
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-cyan-100/85 md:text-base">
            Marketplace, chat comercial, servicios técnicos verificados y red de embajadores en un solo
            ecosistema. Diseñado para Bolivia, listo para crecer contigo.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              className="tech-button tech-button-primary min-h-[52px] whitespace-nowrap px-7"
              href="/auth?mode=register"
            >
              Crear cuenta gratis
            </Link>
            <Link
              className="tech-button tech-button-secondary min-h-[52px] whitespace-nowrap px-7"
              href="/auth?mode=login"
            >
              Ya tengo cuenta
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-cyan-100/65">
            <span className="rounded-full border border-cyan-100/15 bg-slate-950/40 px-3 py-1">
              ✓ Pagos protegidos
            </span>
            <span className="rounded-full border border-cyan-100/15 bg-slate-950/40 px-3 py-1">
              ✓ Empresas verificadas
            </span>
            <span className="rounded-full border border-cyan-100/15 bg-slate-950/40 px-3 py-1">
              ✓ Soporte 24/7
            </span>
          </div>
        </section>

        {/* CHOOSE PROFILE */}
        <section className="mx-auto w-full max-w-6xl">
          <div className="text-center">
            <p className="tech-mono text-xs text-cyan-200/75">ELEGÍ TU EXPERIENCIA</p>
            <h2 className="mt-3 text-2xl font-bold text-cyan-50 md:text-3xl">
              4 paneles diseñados para tu rol
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-cyan-100/80">
              Cada perfil tiene su propio espacio y herramientas, pero todos están conectados en el
              mismo ecosistema.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {userTypes.map((type) => (
              <Link
                key={type.title}
                href={type.href}
                className="group relative overflow-hidden rounded-3xl border border-cyan-100/12 bg-[linear-gradient(165deg,rgba(11,34,60,0.85),rgba(6,23,43,0.92))] p-6 transition hover:border-cyan-300/35 hover:shadow-2xl hover:shadow-cyan-950/40"
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${type.accent} opacity-50 blur-3xl transition group-hover:opacity-80`}
                />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-100/15 bg-slate-950/50 text-3xl">
                    {type.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-cyan-50">{type.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-cyan-100/80">{type.description}</p>
                  <p className="mt-5 text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-200">
                    {type.cta} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto w-full max-w-5xl">
          <div className="text-center">
            <p className="tech-mono text-xs text-cyan-200/75">QUÉ INCLUYE</p>
            <h2 className="mt-3 text-2xl font-bold text-cyan-50 md:text-3xl">
              Todo lo que necesitás en un solo lugar
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/20 text-cyan-200">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-cyan-50">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-cyan-100/80">{feature.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto w-full max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-cyan-200/25 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.22),_transparent_50%),linear-gradient(160deg,_rgba(13,42,73,0.95),_rgba(6,23,43,0.97))] p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-cyan-50 md:text-3xl">
              Empezá hoy. Sin costo de registro.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-cyan-100/85">
              Crea tu cuenta en menos de un minuto y desbloqueá el panel que mejor se adapte a vos.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/auth?mode=register"
                className="tech-button tech-button-primary min-h-[52px] whitespace-nowrap px-7"
              >
                Crear cuenta gratis
              </Link>
              <Link
                href="/auth?mode=login"
                className="tech-button tech-button-secondary min-h-[52px] whitespace-nowrap px-7"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-12 w-full max-w-5xl text-center text-xs text-cyan-100/55">
          <p>© {new Date().getFullYear()} TechMarket · Plataforma especializada en tecnología</p>
        </footer>
      </main>
    </div>
  );
}
