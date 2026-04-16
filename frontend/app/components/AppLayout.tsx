import Link from "next/link";

export function AppHeader() {
  return (
    <header className="tech-top-nav sticky top-0 z-20">
      <div className="tech-shell flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500" />
          <div>
            <p className="font-bold tracking-wide">TechMarket</p>
          </div>
        </Link>
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <input
            type="search"
            placeholder="Buscar productos, servicios o tiendas..."
            className="w-full max-w-md rounded-lg border border-cyan-100/10 bg-background-soft px-4 py-2 text-sm placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/explore" className="text-cyan-100/80 hover:text-white">
            Explorar
          </Link>
          <Link
            href="/auth"
            className="rounded-lg bg-slate-600/40 px-4 py-2 font-semibold text-white hover:bg-slate-500/50"
          >
            Acceder
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-background-soft/50">
      <div className="tech-shell py-8 text-center text-sm text-muted">
        <p className="font-bold">TechMarket</p>
        <p className="mt-2">
          Un ecosistema digital para el sector de Electronica y Computacion.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/about">Sobre Nosotros</Link>
          <Link href="/contact">Contacto</Link>
          <Link href="/privacy">Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}
