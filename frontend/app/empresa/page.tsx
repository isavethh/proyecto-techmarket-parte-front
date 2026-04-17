import Link from "next/link";

const companyModules = [
  { title: "Perfil y tienda", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Promociones", href: "/empresa/promociones" },
  { title: "Catalogo", href: "/empresa/catalogo" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

export default function EmpresaPage() {
  return (
    <div className="flex-1 pb-8">
      <header className="tech-top-nav">
        <div className="tech-shell flex items-center justify-between py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Panel empresa</span>
        </div>
      </header>

      <main className="tech-shell mt-8">
        <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
          <aside className="tech-card h-fit">
            <p className="tech-mono text-xs text-cyan-200/75">MODULO EMPRESAS</p>
            <nav className="mt-4 space-y-2 text-sm text-cyan-100/90">
              {companyModules.map((module) => (
                <Link key={module.title} href={module.href} className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 hover:bg-cyan-100/5 transition">
                  {module.title}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="tech-hero p-6 md:p-8">
            <p className="tech-mono text-xs text-cyan-200/75">PANEL PRINCIPAL</p>
            <h1 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">
              Espacio inicial del modulo de empresas
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80 md:text-base">
              Desde aqui se conectaran las paginas individuales de cada modulo.
              Esta vista solo organiza la estructura base del panel empresarial.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
