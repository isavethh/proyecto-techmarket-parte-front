import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 pb-12">
      <header className="tech-top-nav sticky top-0 z-20">
        <div className="tech-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500" />
            <div>
              <p className="font-bold tracking-wide">TechMarket</p>
              <p className="tech-mono text-xs text-cyan-200/80">ecosystem.build.v1</p>
            </div>
          </div>
          <nav className="hidden gap-5 text-sm text-cyan-100/80 md:flex">
            <a href="#propuesta">Propuesta</a>
            <a href="#roles">Roles</a>
            <a href="#confianza">Confianza</a>
          </nav>
        </div>
      </header>

      <main className="tech-shell mt-8 space-y-6 md:mt-10">
        <section className="tech-hero fade-rise p-6 md:p-9" id="propuesta">
          <span className="tech-chip">Ecosistema especializado</span>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-cyan-50 md:text-5xl">
            Front inteligente para conectar clientes y empresas del sector
            tecnologico.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-cyan-100/75 md:text-base">
            TechMarket combina descubrimiento, reputacion y crecimiento comercial
            dentro de una comunidad especializada en Electronica y Computacion.
            Esta primera version del front presenta flujos diferenciados para
            cliente y empresa.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="tech-button tech-button-primary" href="/cliente">
              Entrar como cliente
            </Link>
            <Link className="tech-button tech-button-secondary" href="/empresa">
              Entrar como empresa
            </Link>
          </div>
        </section>

        <section className="tech-grid md:grid-cols-3" id="roles">
          <article className="tech-card fade-rise delay-1">
            <h3>Cliente</h3>
            <p>
              Explora catalogos, compara opciones, revisa reputacion y solicita
              productos o servicios con mayor confianza.
            </p>
          </article>
          <article className="tech-card fade-rise delay-1">
            <h3>Empresa</h3>
            <p>
              Publica catalogos y promociones, recibe leads y posiciona su marca
              en una comunidad tecnologica activa.
            </p>
          </article>
          <article className="tech-card fade-rise delay-2">
            <h3>Embajadores</h3>
            <p>
              El crecimiento se amplifica mediante recomendacion estructurada,
              activacion local y expansion por confianza.
            </p>
          </article>
        </section>

        <section className="tech-card" id="confianza">
          <h2 className="text-2xl font-semibold text-cyan-50">Nucleo de valor</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 md:text-base">
            <p>
              Reputacion medible con perfiles, historial y evidencia de actividad.
            </p>
            <p>
              Comunidad viva con interacciones, recomendaciones y visibilidad
              organica.
            </p>
            <p>
              Enfoque freemium para crecer rapido y monetizar funciones premium.
            </p>
            <p>
              Especializacion vertical en Electronica y Computacion para competir
              con identidad fuerte.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
