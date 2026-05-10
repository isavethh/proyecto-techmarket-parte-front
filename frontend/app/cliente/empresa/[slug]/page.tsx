import Link from "next/link";
import { ClientPageHeader } from "../../../components/ClientPageSections";
import {
  getCompanyById,
  getCompanyProducts,
} from "../../../lib/api/marketplace";
import { createCompanyReview } from "../../../lib/api/clientApi";
import type { ApiCompanyDetail, ApiProduct } from "../../../lib/api/types";

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((token) => token[0]?.toUpperCase() ?? "")
      .join("") || "EM"
  );
}

function formatDate(iso: string): string {
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return iso;
  const date = new Date(parsed);
  return date.toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 0,
  }).format(price);
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Calificacion ${rating} de 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Math.round(rating);
        return (
          <span
            key={index}
            className={filled ? "text-amber-400" : "text-cyan-100/25"}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function ProductCard({ product }: { product: ApiProduct }) {
  return (
    <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
      {product.imagenPrincipal && (
        <img
          src={product.imagenPrincipal}
          alt={product.nombre}
          className="mb-3 h-32 w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}
      <p className="text-sm font-semibold text-cyan-50">{product.nombre}</p>
      <p className="mt-1 text-base font-bold text-cyan-200">
        {formatPrice(product.precio)}
      </p>
      <div className="mt-2 flex items-center gap-1">
        <RatingStars rating={product.calificacion} />
        <span className="text-xs text-cyan-100/70">{product.calificacion.toFixed(1)}</span>
      </div>
    </div>
  );
}

function NotFound({ companyId }: { companyId: string }) {
  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de empresa" sticky={false} />
      <main className="mx-auto mt-8 max-w-[1500px] px-4 lg:px-6">
        <div className="tech-card">
          <p className="text-sm text-cyan-100/80">
            No se encontro la empresa con ID{" "}
            <span className="font-mono text-cyan-200">{companyId}</span>. Verifica que el
            servidor API este corriendo en{" "}
            <span className="font-mono text-cyan-200">localhost:8082</span>.
          </p>
          <Link
            href="/cliente/empresas"
            className="mt-4 inline-flex rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/18"
          >
            Volver a empresas
          </Link>
        </div>
      </main>
    </div>
  );
}

export default async function ClienteEmpresaPerfilPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [company, productsResponse] = await Promise.all([
    getCompanyById(slug),
    getCompanyProducts(slug),
  ]);

  if (!company) {
    return <NotFound companyId={slug} />;
  }

  const products = productsResponse?.productos ?? [];
  const initials = getInitials(company.nombre);

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de empresa" sticky={false} />

      <main className="mx-auto mt-8 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="tech-card h-fit space-y-2">
          <p className="tech-mono text-xs text-cyan-200/75">NAVEGACION</p>
          <Link
            href="/cliente/empresas"
            className="block rounded-2xl border border-cyan-100/10 p-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-100/5"
          >
            Volver a empresas
          </Link>
          <Link
            href="/cliente"
            className="block rounded-2xl border border-cyan-100/10 p-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-100/5"
          >
            Volver al feed
          </Link>
          <Link
            href="/cliente/marketplace"
            className="block rounded-2xl border border-cyan-100/10 p-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-100/5"
          >
            Ir a marketplace
          </Link>
        </aside>

        <section className="space-y-6 overflow-y-auto pr-4">
          {/* Header */}
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr] md:p-8">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100/10 bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                      Perfil de empresa
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                      {company.nombre}
                    </h1>
                    <p className="mt-1 text-xs text-cyan-200/65 font-mono">{company.id}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">
                      Ventas completadas
                    </p>
                    <p className="mt-3 text-2xl font-bold text-white">
                      {company.ventasCompletadas.toLocaleString("es-BO")}
                    </p>
                    <p className="mt-1 text-sm text-cyan-100/70">Transacciones exitosas</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">
                      Miembro desde
                    </p>
                    <p className="mt-3 text-base font-semibold text-white">
                      {formatDate(company.fechaRegistro)}
                    </p>
                    <p className="mt-1 text-sm text-cyan-100/70">Fecha de registro</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">
                  Descripcion
                </p>
                <p className="mt-4 text-sm leading-7 text-cyan-100/80">
                  {company.descripcion || "Esta empresa aun no tiene descripcion."}
                </p>
                <div className="mt-5 grid gap-3 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4 text-sm text-cyan-100/85">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">ID Empresa</span>
                    <span className="font-mono text-xs">{company.id}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Productos</span>
                    <span>{products.length} en catalogo</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Catálogo de productos */}
          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Catalogo</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Productos de esta empresa</h2>

            {products.length === 0 ? (
              <p className="mt-4 text-sm text-cyan-100/75">
                Esta empresa no tiene productos publicados o la API no esta disponible.
              </p>
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Calificar empresa */}
          <CompanyReviewSection companyId={company.id} companyName={company.nombre} />
        </section>
      </main>
    </div>
  );
}

function CompanyReviewSection({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  return (
    <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Reseñas</p>
      <h2 className="mt-3 text-2xl font-bold text-white">
        Califica a {companyName}
      </h2>
      <p className="mt-2 text-sm text-cyan-100/75">
        Endpoint: <span className="font-mono text-cyan-200">POST /api/clients/reviews/companies/{companyId}</span>
      </p>
      <Link
        href={`/cliente/chat?empresa=${encodeURIComponent(companyId)}&asunto=Consulta+general`}
        className="mt-5 inline-flex rounded-xl border border-cyan-200/20 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
      >
        Iniciar chat con la empresa
      </Link>
    </section>
  );
}
