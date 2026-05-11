"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../../components/ClientPageSections";
import { getProduct, getProductReviews } from "@/lib/api/marketplace";
import { addToCart, addFavoriteProduct, createProductReview } from "@/lib/api/clientApi";
import type { ApiProductDetail, ApiReview } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < Math.round(rating) ? "text-amber-400" : "text-cyan-100/25"}>★</span>
      ))}
    </div>
  );
}

function ReviewForm({ productId, onSuccess }: { productId: string; onSuccess: (review: ApiReview) => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async () => {
    if (comment.trim().length < 10) return;
    setSubmitting(true);
    try {
      await createProductReview(productId, rating, comment.trim());
      const fakeReview: ApiReview = {
        id: `local-${Date.now()}`,
        cliente: { nombre: "Tu", avatar: "" },
        calificacion: rating,
        comentario: comment.trim(),
        fecha: new Date().toISOString(),
      };
      onSuccess(fakeReview);
      setComment("");
      setRating(5);
      showToast("Resena publicada");
    } catch {
      showToast("No se pudo publicar la resena");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-5">
      {toast && (
        <div className="mb-3 rounded-2xl border border-cyan-100/20 bg-slate-900/80 px-4 py-2 text-sm text-cyan-50">
          {toast}
        </div>
      )}
      <p className="text-sm font-semibold text-cyan-50">Escribir una resena</p>
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
        placeholder="Comparte tu experiencia con este producto (min. 10 caracteres)"
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
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(false);
    Promise.all([getProduct(productId), getProductReviews(productId)])
      .then(([prod, revs]) => {
        setProduct(prod);
        setReviews(revs);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity);
      showToast("Producto agregado al carrito");
    } catch {
      showToast("No se pudo agregar al carrito");
    }
  };

  const handleFavorite = async () => {
    try {
      await addFavoriteProduct(productId);
      showToast("Agregado a favoritos");
    } catch {
      showToast("No se pudo agregar a favoritos");
    }
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length
      : 0;

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Producto" sticky={false} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-cyan-100/20 bg-slate-900/95 px-5 py-3 text-sm font-semibold text-cyan-50 shadow-xl backdrop-blur">
          {toast}
        </div>
      )}

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
                const isActive = item.href === "/cliente/marketplace";
                return (
                  <Link key={item.label} href={item.href} className={`auth-action ${isActive ? "active" : ""}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="space-y-4">
            <ClientQuickLinksCard
              links={[
                { href: "/cliente/marketplace", label: "Volver a productos" },
                { href: "/cliente/carrito", label: "Mi carrito" },
                { href: "/cliente/versus", label: "Comparar productos" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-5 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando producto...</p>
            </section>
          ) : error || !product ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo cargar el producto.{" "}
                <Link href="/cliente/marketplace" className="text-cyan-300 hover:underline">
                  Volver
                </Link>
              </p>
            </section>
          ) : (
            <>
              <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25">
                <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
                  <div className="relative">
                    {product.imagenes.length > 0 ? (
                      <>
                        <img
                          src={product.imagenes[activeImage]}
                          alt={product.nombre}
                          className="h-72 w-full object-cover lg:h-full lg:min-h-[360px]"
                        />
                        {product.imagenes.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                            {product.imagenes.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setActiveImage(i)}
                                className={`h-2 rounded-full transition-all ${i === activeImage ? "w-6 bg-cyan-300" : "w-2 bg-white/30"}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-72 w-full bg-[linear-gradient(140deg,rgba(34,211,238,0.20),rgba(30,64,175,0.20),rgba(8,47,73,0.55))] lg:h-full lg:min-h-[360px]" />
                    )}
                  </div>

                  <div className="p-5 md:p-6">
                    <p className="font-mono text-[11px] text-cyan-200/50">{product.id}</p>
                    <h1 className="mt-2 text-2xl font-bold text-white">{product.nombre}</h1>

                    {reviews.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <StarRating rating={avgRating} />
                        <span className="text-xs text-cyan-200/65">{avgRating.toFixed(1)} ({reviews.length} resenas)</span>
                      </div>
                    )}

                    <p className="mt-4 text-3xl font-bold text-cyan-50">
                      Bs. {product.precio.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </p>

                    <p className="mt-3 text-sm leading-7 text-cyan-100/80">{product.descripcion}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-cyan-200/70">
                      <span className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1">
                        Stock: {product.stock}
                      </span>
                      {product.empresa && (
                        <Link
                          href={`/cliente/empresa/${product.empresa.id}`}
                          className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 transition hover:text-cyan-200"
                        >
                          {product.empresa.nombre}
                        </Link>
                      )}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="text-cyan-50"
                        >−</button>
                        <span className="w-6 text-center text-sm font-semibold text-cyan-50">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                          className="text-cyan-50"
                        >+</button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.stock < 1}
                        className="rounded-xl border border-cyan-200/25 bg-cyan-400/18 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Agregar al carrito
                      </button>
                      <button
                        type="button"
                        onClick={handleFavorite}
                        className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-3 text-sm font-semibold text-cyan-100/90 transition hover:bg-white/10"
                      >
                        + Favoritos
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-cyan-50">Resenas ({reviews.length})</h2>
                </div>

                <ReviewForm
                  productId={productId}
                  onSuccess={(rev) => setReviews((prev) => [rev, ...prev])}
                />

                {reviews.length === 0 ? (
                  <section className="tech-card">
                    <p className="text-sm text-cyan-100/80">Este producto aun no tiene resenas. Se el primero.</p>
                  </section>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-3xl border border-cyan-100/12 bg-[linear-gradient(155deg,rgba(12,32,55,0.9),rgba(6,18,36,0.92))] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">
                              {review.cliente.avatar || review.cliente.nombre.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-cyan-50">{review.cliente.nombre}</p>
                              <StarRating rating={review.calificacion} />
                            </div>
                          </div>
                          <p className="text-[11px] text-cyan-200/55">
                            {new Date(review.fecha).toLocaleDateString("es-BO")}
                          </p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-cyan-100/80">{review.comentario}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
