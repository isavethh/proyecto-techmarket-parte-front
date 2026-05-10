import Link from "next/link";
import {
  ClientInfoCard,
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../components/ClientPageSections";
import { getCompanies } from "../../lib/api/marketplace";
import type { ApiCompany } from "../../lib/api/types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("") || "EM";
}

function CompanyCard({ company }: { company: ApiCompany }) {
  const initials = getInitials(company.nombre);

  return (
    <Link
      href={`/cliente/empresa/${company.id}`}
      className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25 transition hover:-translate-y-1 hover:border-cyan-300/40"
    >
      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-lg font-bold text-slate-950">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-cyan-50">{company.nombre}</p>
            <p className="truncate text-xs text-cyan-200/70">ID: {company.id}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-cyan-100/10 pt-4 text-xs text-cyan-200/75">
          <span>Calificacion {company.calificacion.toFixed(1)}</span>
          <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-2.5 py-1 text-cyan-50">
            Ver perfil
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ClienteEmpresasPage() {
  const companies = await getCompanies();

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Empresas" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <ClientInfoCard
            eyebrow="EXPLORA EMPRESAS"
            title="Descubre quienes son y que hacen"
            description="Aqui ves las empresas registradas en el ecosistema TechMarket. Al abrir una card entras a su perfil completo."
          />

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/servicios", label: "Ver servicios" },
              { href: "/cliente/versus", label: "Comparar productos" },
            ]}
          />
        </aside>

        <section className="space-y-4">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">DIRECTORIO</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Empresas en TechMarket</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              {companies
                ? `${companies.length} empresa${companies.length !== 1 ? "s" : ""} registrada${companies.length !== 1 ? "s" : ""} en la plataforma.`
                : "Conectando con la API..."}
            </p>
          </section>

          {!companies ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con la API. Verifica que el servidor este corriendo en{" "}
                <span className="font-mono text-cyan-200">localhost:8082</span>.
              </p>
            </section>
          ) : companies.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No hay empresas registradas todavia.
              </p>
            </section>
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
