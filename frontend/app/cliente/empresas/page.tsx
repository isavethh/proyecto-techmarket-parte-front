"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  listMarketplaceCompanies,
  type MarketplaceCompanySummary,
} from "@/lib/api/iaApi";
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

export default function ClienteEmpresasPage() {
  const pathname = usePathname();
  const [companies, setCompanies] = useState<MarketplaceCompanySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listMarketplaceCompanies()
      .then((response) => {
        if (active) {
          setCompanies(response);
          setLoadError(null);
        }
      })
      .catch((error) => {
        if (active) {
          setCompanies([]);
          setLoadError(error instanceof Error ? error.message : "No se pudo cargar empresas");
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleCompanies = useMemo(
    () =>
      companies.map((company) => ({
        slug: company.id,
        name: company.nombre,
        logo:
          company.logo ??
          (company.nombre
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((token) => token[0]?.toUpperCase() ?? "")
            .join("") ||
            "TM"),
        city: "Bolivia",
        category: "Empresa registrada",
        description: "Empresa registrada en TechMarket con catalogo disponible desde la API.",
        specialties: ["Marketplace", "Productos", "Atencion al cliente"],
        rating: company.calificacion ?? 0,
        reviewCount: 0,
      })),
    [companies],
  );

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Empresas" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
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
                const isActive =
                  item.href === "/cliente"
                    ? pathname === "/cliente"
                    : pathname.startsWith(item.href);

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
            <p className="tech-mono text-xs text-cyan-200/75">EXPLORA EMPRESAS</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Descubre empresas</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Revisa perfiles empresariales, especialidades, reputacion y oferta comercial dentro del ecosistema TechMarket.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Empresas", "Perfiles", "Servicios", "Reputacion"].map((chip) => (
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
                { href: "/cliente/servicios", label: "Ver servicios" },
                { href: "/cliente/versus", label: "Comparar productos" },
              ]}
            />
          </div>
        </aside>

        <section
          className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">CARD GRID</p>
            <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Empresas destacadas</h2>
            <p className="mt-3 text-sm text-cyan-100/80">
              Pulsa una tarjeta para ver el perfil de la empresa dentro de TechMarket.
            </p>
            {isLoading ? (
              <p className="mt-3 text-xs text-cyan-200/75">Cargando empresas desde la API...</p>
            ) : null}
            {loadError ? (
              <p className="mt-3 text-xs text-amber-200/85">
                No se pudo conectar con la API: {loadError}
              </p>
            ) : null}
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleCompanies.length === 0 && !isLoading ? (
              <div className="rounded-3xl border border-dashed border-cyan-100/18 bg-slate-950/35 p-5 text-sm text-cyan-100/75 md:col-span-2 xl:col-span-3">
                No hay empresas para mostrar desde la API.
              </div>
            ) : null}
            {visibleCompanies.map((profile) => (
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
                      <p className="truncate text-xs text-cyan-200/70">
                        {profile.city} · {profile.category}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-cyan-100/80">
                    {profile.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.specialties.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-xs text-cyan-100/80"
                      >
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
