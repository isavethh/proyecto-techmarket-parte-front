"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../../components/ClientPageSections";
import ClientSidebar from "../../ClientSidebar";
import {
  getMarketplaceProduct,
  getMarketplaceSpecialistService,
  listProductReviews,
  type MarketplaceProductDetail,
  type ProductReview,
  type SpecialistServiceDetail,
} from "@/lib/api/iaApi";

function StarRow({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const sizeClass = size === "md" ? "text-base" : "text-xs";
  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass} text-amber-300`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(value) ? "" : "text-cyan-100/30"}>
          ★
        </span>
      ))}
    </span>
  );
}

function SpecialistServiceDetailView({ service }: { service: SpecialistServiceDetail }) {
  const router = useRouter();

  const handleContact = () => {
    const params = new URLSearchParams({
      source: "servicios",
      seller: service.especialistaNombre,
      specialistId: service.especialistaId,
      product: service.nombre,
      message: `Hola, vi tu servicio "${service.nombre}" y me interesa saber más.`,
    });
    router.push(`/cliente/chat?${params.toString()}`);
  };

  const priceLabel =
    service.precio != null
      ? `${service.moneda ?? "Bs"} ${Number(service.precio).toLocaleString("es-BO", { minimumFractionDigits: 2 })}`
      : null;

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-violet-300/20 bg-[linear-gradient(165deg,rgba(20,15,60,0.95),rgba(8,6,30,0.96))] shadow-2xl shadow-slate-950/30">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex h-72 items-center justify-center bg-[linear-gradient(140deg,rgba(139,92,246,0.18),rgba(30,64,175,0.22),rgba(8,47,73,0.55))] md:h-full">
            <span className="text-6xl font-bold text-violet-300/30">
              {service.nombre.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-3 py-1 text-xs font-semibold text-violet-200">
                Servicio de especialista
              </span>
              {service.tipo ? (
                <span className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs text-cyan-100/70">
                  {service.tipo}
                </span>
              ) : null}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-cyan-50">{service.nombre}</h1>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-blue-600 text-[11px] font-bold text-slate-950">
                {service.especialistaNombre.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-cyan-50">{service.especialistaNombre}</p>
                {service.especialistaEspecialidad ? (
                  <p className="text-xs text-cyan-100/65">{service.especialistaEspecialidad}</p>
                ) : null}
                {service.especialistaUbicacion ? (
                  <p className="text-xs text-cyan-100/55">{service.especialistaUbicacion}</p>
                ) : null}
              </div>
            </div>

            {priceLabel ? (
              <p className="text-3xl font-bold text-violet-300">{priceLabel}</p>
            ) : (
              <p className="text-base text-cyan-100/80">Precio a consultar</p>
            )}

            <button
              type="button"
              onClick={handleContact}
              className="mt-2 rounded-2xl border border-violet-200/35 bg-violet-300/20 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-violet-300/30"
            >
              💬 Contactar al especialista
            </button>
          </div>
        </div>
      </section>

      {service.descripcion ? (
        <section className="tech-card">
          <p className="tech-mono text-xs text-cyan-200/75">DESCRIPCIÓN</p>
          <h2 className="mt-2 text-lg font-semibold text-cyan-50">Sobre este servicio</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-cyan-100/85">
            {service.descripcion}
          </p>
        </section>
      ) : null}

      <section className="tech-card">
        <p className="tech-mono text-xs text-cyan-200/75">ESPECIALISTA</p>
        <h2 className="mt-2 text-lg font-semibold text-cyan-50">{service.especialistaNombre}</h2>
        <div className="mt-4 space-y-2">
          {service.especialistaEspecialidad ? (
            <div className="flex items-center justify-between rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-cyan-100/70">Especialidad</span>
              <strong className="text-cyan-50">{service.especialistaEspecialidad}</strong>
            </div>
          ) : null}
          {service.especialistaUbicacion ? (
            <div className="flex items-center justify-between rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-3 text-sm">
              <span className="text-cyan-100/70">Ubicación</span>
              <strong className="text-cyan-50">{service.especialistaUbicacion}</strong>
            </div>
          ) : null}
          {service.destacado ? (
            <div className="flex items-center justify-between rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-sm">
              <span className="text-cyan-100/70">Destacado</span>
              <strong className="text-amber-200">★ Servicio destacado</strong>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function MarketplaceServiceDetailView({
  service,
  reviews,
  averageRating,
}: {
  service: MarketplaceProductDetail;
  reviews: ProductReview[];
  averageRating: number;
}) {
  const router = useRouter();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const heroImage = service.imagenes?.[0] ?? "/productos/laptop-pro-14.jpg";
  const otherImages = service.imagenes?.slice(1, 4) ?? [];

  const handleContactCompany = () => {
    if (!service.empresa?.id) {
      setActionMessage("Esta publicación no tiene empresa asociada para contactar.");
      return;
    }
    const params = new URLSearchParams({
      source: "marketplace",
      seller: service.empresa.nombre,
      company: service.empresa.nombre,
      companyId: service.empresa.id,
      productId: service.id,
      product: service.nombre,
      message: `Hola, vi tu servicio "${service.nombre}" y me interesa saber más.`,
    });
    router.push(`/cliente/chat?${params.toString()}`);
  };

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(11,34,60,0.95),rgba(6,23,43,0.96))] shadow-2xl shadow-slate-950/30">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative h-72 overflow-hidden md:h-full">
            <img
              src={heroImage}
              alt={service.nombre}
              className="h-full w-full object-cover"
              onError={(event) => {
                (event.target as HTMLImageElement).src = "/productos/laptop-pro-14.jpg";
              }}
            />
            {otherImages.length > 0 ? (
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
                {otherImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${service.nombre} ${idx + 2}`}
                    className="h-14 w-14 rounded-xl border border-cyan-100/25 object-cover shadow-md"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-cyan-100/20 bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                Servicio técnico
              </span>
              {reviews.length > 0 ? (
                <div className="flex items-center gap-2 text-xs text-cyan-100/70">
                  <StarRow value={averageRating} />
                  <span>({reviews.length})</span>
                </div>
              ) : null}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-cyan-50">{service.nombre}</h1>

            {service.empresa ? (
              <Link
                href={`/cliente/marketplace/vendedor/${service.empresa.id}`}
                className="inline-flex items-center gap-2 text-sm text-cyan-200/85 transition hover:text-cyan-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-[10px] font-bold text-slate-950">
                  {service.empresa.nombre.slice(0, 2).toUpperCase()}
                </span>
                <span className="font-medium">{service.empresa.nombre}</span>
                <span className="text-cyan-300/70">→ ver perfil</span>
              </Link>
            ) : null}

            {service.precio != null ? (
              <p className="text-3xl font-bold text-cyan-300">
                Bs {service.precio.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
              </p>
            ) : (
              <p className="text-base text-cyan-100/80">Precio a consultar</p>
            )}

            <button
              type="button"
              onClick={handleContactCompany}
              className="mt-2 rounded-2xl border border-cyan-200/35 bg-cyan-300/25 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/35"
            >
              💬 Contactar al especialista
            </button>

            {actionMessage ? (
              <p className="rounded-xl border border-cyan-100/12 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">
                {actionMessage}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {service.descripcion ? (
        <section className="tech-card">
          <p className="tech-mono text-xs text-cyan-200/75">DESCRIPCIÓN</p>
          <h2 className="mt-2 text-lg font-semibold text-cyan-50">Sobre este servicio</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-cyan-100/85">
            {service.descripcion}
          </p>
        </section>
      ) : null}

      <section className="tech-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="tech-mono text-xs text-cyan-200/75">OPINIONES</p>
            <h2 className="mt-2 text-lg font-semibold text-cyan-50">
              Reseñas de clientes ({reviews.length})
            </h2>
          </div>
          {reviews.length > 0 ? (
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-50">{averageRating.toFixed(1)}</p>
              <StarRow value={averageRating} size="md" />
            </div>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-cyan-100/15 bg-slate-950/30 p-4 text-sm text-cyan-100/70">
              Aún no hay reseñas para este servicio.
            </p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-cyan-100/12 bg-slate-950/30 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-[11px] font-bold text-slate-950">
                      {(review.cliente?.nombre ?? "CL").slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">
                        {review.cliente?.nombre ?? "Cliente anónimo"}
                      </p>
                      <p className="text-xs text-cyan-100/60">{review.fecha ?? "—"}</p>
                    </div>
                  </div>
                  <StarRow value={review.calificacion ?? 0} />
                </div>
                {review.comentario ? (
                  <p className="mt-3 text-sm leading-6 text-cyan-100/85">{review.comentario}</p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default function ServicioDetallePage() {
  const params = useParams<{ slug: string }>();
  const serviceId = params?.slug ?? "";
  const isSpecialistService = serviceId.startsWith("SERV-");

  const [specialistService, setSpecialistService] = useState<SpecialistServiceDetail | null>(null);
  const [marketplaceService, setMarketplaceService] = useState<MarketplaceProductDetail | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    let active = true;
    setIsLoading(true);
    setError(null);

    if (isSpecialistService) {
      getMarketplaceSpecialistService(serviceId)
        .then((detail) => {
          if (!active) return;
          setSpecialistService(detail);
        })
        .catch(() => {
          if (!active) return;
          setError("No se encontró el servicio solicitado.");
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    } else {
      Promise.all([
        getMarketplaceProduct(serviceId).catch(() => null),
        listProductReviews(serviceId).catch(() => [] as ProductReview[]),
      ])
        .then(([detail, reviewList]) => {
          if (!active) return;
          if (!detail) {
            setError("No se encontró el servicio solicitado.");
          } else {
            setMarketplaceService(detail);
          }
          setReviews(reviewList);
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [serviceId, isSpecialistService]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.calificacion ?? 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const hasContent = isSpecialistService ? Boolean(specialistService) : Boolean(marketplaceService);

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Detalle de servicio" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <ClientSidebar className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2" />

        <section className="space-y-5">
          {isLoading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando información del servicio...</p>
            </section>
          ) : error || !hasContent ? (
            <section className="tech-card text-center">
              <p className="tech-mono text-xs text-amber-200/80">ERROR</p>
              <h1 className="mt-2 text-2xl font-semibold text-cyan-50">
                {error ?? "Servicio no disponible"}
              </h1>
              <p className="mt-3 text-sm text-cyan-100/75">
                Es posible que el servicio haya sido eliminado o que no esté visible.
              </p>
              <Link
                href="/cliente/servicios"
                className="mt-5 inline-flex rounded-xl border border-cyan-100/15 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25"
              >
                ← Volver a servicios
              </Link>
            </section>
          ) : isSpecialistService && specialistService ? (
            <SpecialistServiceDetailView service={specialistService} />
          ) : marketplaceService ? (
            <MarketplaceServiceDetailView
              service={marketplaceService}
              reviews={reviews}
              averageRating={averageRating}
            />
          ) : null}

          <ClientQuickLinksCard
            links={[
              { href: "/cliente/servicios", label: "← Volver a servicios" },
              { href: "/cliente/marketplace", label: "Explorar marketplace" },
            ]}
          />
        </section>
      </main>
    </div>
  );
}
