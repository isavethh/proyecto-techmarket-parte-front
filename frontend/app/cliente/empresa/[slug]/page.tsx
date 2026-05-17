"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";
import {
  MarketplaceCompanyDetail,
  MarketplaceProductSummary,
  getMarketplaceCompany,
  listMarketplaceCompanyProducts,
} from "../../../../lib/api/iaApi";
import {
  FOLLOW_UPDATED_EVENT,
  readFollowing,
  toggleFollow,
  type FollowedAccount,
} from "../../../lib/followStore";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

const formatPrice = (value: number | null) =>
  typeof value === "number"
    ? new Intl.NumberFormat("es-BO", { style: "currency", currency: "BOB" }).format(value)
    : "Sin precio";

const subscribeFollowing = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "techmarket.following") onStoreChange();
  };
  const handleUpdate = () => onStoreChange();
  window.addEventListener("storage", handleStorage);
  window.addEventListener(FOLLOW_UPDATED_EVENT, handleUpdate);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FOLLOW_UPDATED_EVENT, handleUpdate);
  };
};

export default function ClienteEmpresaPerfilPage() {
  const params = useParams<{ slug: string }>();
  const companyId = useMemo(
    () => (Array.isArray(params.slug) ? params.slug[0] : params.slug),
    [params.slug],
  );
  const [company, setCompany] = useState<MarketplaceCompanyDetail | null>(null);
  const [products, setProducts] = useState<MarketplaceProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const followingAccounts = useSyncExternalStore(
    subscribeFollowing,
    readFollowing,
    () => [] as FollowedAccount[],
  );
  const isFollowed = followingAccounts.some((a) => a.id === companyId);

  useEffect(() => {
    let isMounted = true;

    const loadCompany = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [companyResponse, productsResponse] = await Promise.all([
          getMarketplaceCompany(companyId),
          listMarketplaceCompanyProducts(companyId),
        ]);

        if (!isMounted) {
          return;
        }

        setCompany(companyResponse);
        setProducts(productsResponse.productos ?? []);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        console.error("No se pudo cargar perfil de empresa", requestError);
        setCompany(null);
        setProducts([]);
        setError("No se pudo conectar con la API de empresas.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (companyId) {
      loadCompany();
    }

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de empresa" sticky={false} />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
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
                  className={`auth-action ${item.href === "/cliente/empresas" ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">PERFIL DE EMPRESA</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Datos desde API</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Esta vista consume el perfil publico y catalogo de la empresa.
            </p>
          </section>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/empresas", label: "Explorar empresas" },
              { href: "/cliente/marketplace", label: "Ir a marketplace" },
            ]}
          />
        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil de empresa</p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                {company?.nombre ?? (isLoading ? "Cargando empresa..." : "Empresa no disponible")}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/80 sm:text-base">
                {company?.descripcion ?? error ?? "No hay informacion para mostrar desde la API."}
              </p>

              {!isLoading && company && (
                <button
                  type="button"
                  onClick={() =>
                    toggleFollow({ id: companyId, name: company.nombre, type: "empresa" })
                  }
                  className={`mt-5 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                    isFollowed
                      ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-300 hover:bg-cyan-300/10"
                      : "border-cyan-100/20 bg-white/5 text-cyan-50 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
                  }`}
                >
                  {isFollowed ? "✓ Siguiendo" : "+ Seguir empresa"}
                </button>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Registro</p>
                  <p className="mt-3 text-lg font-bold text-white">{company?.fechaRegistro ?? "Sin fecha"}</p>
                </div>
                <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Ventas completadas</p>
                  <p className="mt-3 text-lg font-bold text-white">{company?.ventasCompletadas ?? 0}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Catalogo</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Productos de la empresa</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                  {product.imagenPrincipal ? (
                    <img src={product.imagenPrincipal} alt={product.nombre} className="mb-3 h-28 w-full rounded-xl object-cover" loading="lazy" />
                  ) : null}
                  <p className="text-sm font-semibold text-cyan-50">{product.nombre}</p>
                  <p className="mt-2 text-sm text-cyan-100/75">{formatPrice(product.precio)}</p>
                </div>
              ))}
            </div>

            {!products.length ? (
              <p className="mt-4 text-sm text-cyan-100/80">
                {isLoading ? "Cargando productos..." : "No hay productos para mostrar desde la API."}
              </p>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  );
}
