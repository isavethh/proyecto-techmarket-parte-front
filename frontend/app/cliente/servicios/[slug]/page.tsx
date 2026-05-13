import Link from "next/link";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

export default async function ServicioPage() {
  return (
    <div className="flex-1 pb-6 xl:pb-0">
      <ClientPageHeader
        sectionLabel="Detalle de servicio"
        brandHref="/"
        rightSlot={(
          <Link href="/cliente" className="text-sm text-cyan-200/80">
            Volver a cliente
          </Link>
        )}
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:h-[calc(100vh-140px)] xl:items-start xl:px-6">
        <aside className="chat-scrollbar space-y-4 xl:sticky xl:top-24 xl:self-start xl:h-[calc(100vh-140px)] xl:overflow-y-auto xl:pr-2">
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

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/servicios", label: "Ver servicios" },
              { href: "/cliente/chat", label: "Ir a chat" },
            ]}
          />
        </aside>

        <section className="chat-scrollbar space-y-5 overflow-y-auto xl:h-[calc(100vh-140px)] xl:pr-4">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">API</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50">No hay detalle de servicio desde la API.</h1>
            <p className="mt-3 text-sm text-cyan-100/80">
              No se encontro un endpoint de servicios en el backend revisado, asi que esta pantalla no usa datos locales de muestra.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
