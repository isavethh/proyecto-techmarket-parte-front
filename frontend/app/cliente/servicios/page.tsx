import Link from "next/link";
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
              {clientMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`auth-action ${item.href === "/cliente/servicios" ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">SERVICIOS</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Sin endpoint conectado</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              En la lista de endpoints recibida no existe un recurso de servicios para clientes.
            </p>
          </section>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/marketplace", label: "Explorar marketplace" },
              { href: "/cliente/empresas", label: "Explorar empresas" },
            ]}
          />
        </aside>

        <section className="chat-scrollbar min-h-0 space-y-4 overflow-y-auto overflow-x-hidden pr-0 lg:h-[calc(100vh-140px)] lg:pr-4">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">API</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">No hay servicios para mostrar desde la API.</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              Se removieron las publicaciones locales de muestra para no mostrar datos hardcodeados.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
