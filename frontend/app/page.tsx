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
        </div>
      </header>

      <main className="tech-shell mt-8 flex min-h-[calc(100vh-5.5rem)] items-center justify-center md:mt-10">
        <section className="tech-hero fade-rise mx-auto w-full max-w-4xl p-6 text-center md:p-10" id="propuesta">
          <span className="tech-chip">Ecosistema especializado</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight text-cyan-50 md:text-5xl">
            TechMarket
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-cyan-100/80 md:text-base">
            Busqueda inteligente de productos tecnologicos
          </p>
          <div className="mx-auto mt-7 grid max-w-2xl gap-3">
            <p className="text-sm text-cyan-100/80">Tienes una cuenta?</p>
            <div className="grid gap-3 md:grid-cols-3">
              <Link
                className="tech-button tech-button-primary min-h-[56px] whitespace-nowrap px-6"
                href="/auth?mode=login&type=cliente"
              >
                Ingresar como cliente
              </Link>
              <Link
                className="tech-button tech-button-secondary min-h-[56px] whitespace-nowrap px-6"
                href="/auth?mode=login&type=empresa"
              >
                Ingresar como empresa
              </Link>
              <Link
                className="tech-button tech-button-secondary min-h-[56px] whitespace-nowrap px-6"
                href="/auth?mode=login&type=embajador"
              >
                Ingresar como embajador
              </Link>
            </div>
            <p className="mt-2 text-sm text-cyan-100/80">No tienes una cuenta?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link className="tech-button tech-button-primary" href="/auth?mode=register&type=cliente">
                Crear cuenta cliente
              </Link>
              <Link className="tech-button tech-button-secondary" href="/auth?mode=register&type=empresa">
                Crear cuenta empresa
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
