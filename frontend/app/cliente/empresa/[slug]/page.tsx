"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";
import { getCompany, getCompanyProducts } from "@/lib/api/marketplace";
import { addToCart, addFavoriteProduct, followCompany, createCompanyReview } from "@/lib/api/clientApi";
import type { ApiCompanyDetail, ApiProduct } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Calificacion ${rating} de 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < Math.round(rating) ? "text-amber-400" : "text-cyan-100/25"} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((t) => t[0]?.toUpperCase() ?? "")
      .join("") || "EM"
  );
}

export default function ClienteEmpresaPerfilPage() {
  const params = useParams();
  const companyId = params.slug as string;

  const [company, setCompany] = useState<ApiCompanyDetail | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    setError(false);

    Promise.all([
      getCompany(companyId),
      getCompanyProducts(companyId),
    ])
      .then(([companyData, productsData]) => {
        setCompany(companyData);
        setProducts(productsData.productos);
        setTotalProducts(productsData.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      showToast("Producto agregado al carrito");
    } catch {
      showToast("No se pudo agregar al carrito");
    }
  };

  const handleFavoriteProduct = async (productId: string) => {
    try {
      await addFavoriteProduct(productId);
      showToast("Producto agregado a favoritos");
    } catch {
      showToast("No se pudo agregar a favoritos");
    }
  };

  const handleFollowCompany = async () => {
    try {
      await followCompany(companyId);
      showToast("Empresa seguida");
    } catch {
      showToast("No se pudo seguir la empresa");
    }
  };

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de empresa" sticky={false} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-cyan-100/20 bg-slate-900/95 px-5 py-3 text-sm font-semibold text-cyan-50 shadow-xl backdrop-blur">
          {toast}
        </div>
      )}

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
              {clientMenuItems.map((item) => {
                const isActive = item.href === "/cliente/empresas";
                return (
                  <Link key={item.label} href={item.href} className={`auth-action ${isActive ? "active" : ""}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">PERFIL DE EMPRESA</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Vista para cliente</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Revisa reputacion, especialidades, contacto y senales de confianza antes de comparar o contactar.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Empresa", "Reputacion", "Servicios", "Confianza"].map((chip) => (
                <span key={chip} className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs text-cyan-100/85">
                  {chip}
                </span>
              ))}
            </div>
          </section>

          <div className="space-y-4">
            <ClientQuickLinksCard
              links={[
                { href: "/cliente", label: "Volver al feed" },
                { href: "/cliente/versus", label: "Comparar productos" },
                { href: "/cliente/marketplace", label: "Ir a marketplace" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-6 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando perfil de empresa...</p>
            </section>
          ) : error || !company ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo cargar el perfil de la empresa.{" "}
                <Link href="/cliente/empresas" className="text-cyan-300 hover:underline">
                  Volver a empresas
                </Link>
              </p>
            </section>
          ) : (
            <>
              <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30 p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100/10 bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                    {getInitials(company.nombre)}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil de empresa</p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{company.nombre}</h1>
                    <p className="mt-1 font-mono text-xs text-cyan-200/50">{company.id}</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-cyan-100/80">{company.descripcion}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Registro</p>
                    <p className="mt-3 text-base font-semibold text-white">
                      {new Date(company.fechaRegistro).toLocaleDateString("es-BO", { year: "numeric", month: "long" })}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Ventas completadas</p>
                    <p className="mt-3 text-2xl font-bold text-white">{company.ventasCompletadas}</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Productos</p>
                    <p className="mt-3 text-2xl font-bold text-white">{totalProducts}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleFollowCompany}
                    className="rounded-xl border border-cyan-200/25 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/22"
                  >
                    Seguir empresa
                  </button>
                  <Link
                    href={`/cliente/chat`}
                    className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/90 transition hover:bg-white/10"
                  >
                    Iniciar chat
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
                <p className="tech-mono text-xs text-cyan-200/75">GET /api/marketplace/companies/{companyId}/products</p>
                <h2 className="mt-3 text-2xl font-bold text-white">Productos de la empresa</h2>
                {products.length === 0 ? (
                  <p className="mt-4 text-sm text-cyan-100/80">Esta empresa no tiene productos publicados.</p>
                ) : (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <article
                        key={product.id}
                        className="overflow-hidden rounded-2xl border border-cyan-100/15 bg-slate-950/40"
                      >
                        {product.imagenPrincipal ? (
                          <img src={product.imagenPrincipal} alt={product.nombre} className="h-36 w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="h-36 w-full bg-[linear-gradient(140deg,rgba(34,211,238,0.18),rgba(30,64,175,0.18),rgba(8,47,73,0.5))]" />
                        )}
                        <div className="p-4">
                          <p className="text-lg font-bold text-cyan-50">
                            Bs. {product.precio.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">{product.nombre}</h3>
                          <div className="mt-1 flex items-center gap-1 text-xs text-amber-400">
                            ★ <span className="text-cyan-200/70">{product.calificacion.toFixed(1)}</span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link
                              href={`/cliente/marketplace/${product.id}`}
                              className="rounded-xl border border-cyan-200/25 bg-cyan-400/15 px-2 py-2 text-center text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/22"
                            >
                              Ver detalle
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product.id)}
                              className="rounded-xl border border-cyan-100/15 bg-white/5 px-2 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
                            >
                              Al carrito
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFavoriteProduct(product.id)}
                            className="mt-2 w-full rounded-xl border border-cyan-100/10 bg-transparent px-2 py-1.5 text-xs text-cyan-200/60 transition hover:text-cyan-200/90"
                          >
                            + Favoritos
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <CompanyReviewForm companyId={companyId} onToast={showToast} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function CompanyReviewForm({ companyId, onToast }: { companyId: string; onToast: (msg: string) => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (comment.trim().length < 10) return;
    setSubmitting(true);
    try {
      await createCompanyReview(companyId, rating, comment.trim());
      setComment("");
      setRating(5);
      setSubmitted(true);
      onToast("Resena publicada");
    } catch {
      onToast("No se pudo publicar la resena");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/8 p-5">
        <p className="text-sm font-semibold text-emerald-100">Gracias por tu resena.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-2 text-xs text-cyan-300 hover:underline">
          Escribir otra
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-5 shadow-xl">
      <p className="tech-mono text-xs text-cyan-200/75">POST /api/clients/reviews/company</p>
      <h2 className="mt-2 text-xl font-semibold text-cyan-50">Calificar esta empresa</h2>
      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition ${star <= rating ? "text-amber-400" : "text-cyan-100/25 hover:text-amber-300/60"}`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-cyan-200/70">{rating}/5</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comparte tu experiencia con esta empresa (min. 10 caracteres)"
        rows={3}
        className="auth-input mt-3 min-h-[80px] resize-y"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || comment.trim().length < 10}
        className="mt-3 rounded-xl border border-cyan-200/25 bg-cyan-300/18 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Publicando..." : "Publicar resena"}
      </button>
    </section>
  );
}
