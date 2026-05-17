"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
<<<<<<< HEAD
import { Suspense, useMemo, useState, useSyncExternalStore } from "react";
=======
import { Suspense, useMemo, useState } from "react";
>>>>>>> Nobre
import {
  ClientInfoCard,
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../../../components/ClientPageSections";
import {
  PublicationViewerData,
  PublicationViewerModal,
} from "../../../../components/PublicationViewerModal";
type MarketplaceListing = {
  post: {
    id: string;
    author: string;
    role: string;
    time: string;
    title: string;
    body: string;
    tag: string;
    location: string;
    image?: string;
    createdAt: string;
  };
  category: string;
  condition: string;
  priceLabel: string;
};

const createMarketplaceSellerKey = (sellerName: string): string =>
  sellerName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "empresa";


const getSellerInitials = (sellerName: string): string => {
  const chunks = sellerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "");

  return chunks.join("") || "VD";
};

function MarketplaceSellerProfileContent() {
  const params = useParams<{ seller: string | string[] }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activePublication, setActivePublication] = useState<PublicationViewerData | null>(null);

  const sellerRouteParam = useMemo(() => {
    const rawValue = params.seller;
    return Array.isArray(rawValue) ? (rawValue[0] ?? "") : rawValue;
  }, [params]);

  const allListings = useMemo<MarketplaceListing[]>(() => [], []);

  const sellerListings = useMemo(
    () =>
      allListings.filter(
        (listing) => createMarketplaceSellerKey(listing.post.author) === sellerRouteParam,
      ),
    [allListings, sellerRouteParam],
  );

  const sellerNameFromQuery = searchParams.get("seller")?.trim() ?? "";

  const sellerName =
    sellerListings[0]?.post.author ||
    sellerNameFromQuery ||
    sellerRouteParam.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  const sellerRole = sellerListings[0]?.post.role ?? "Vendedor";

  const sellerCities = useMemo(
    () => [...new Set(sellerListings.map((listing) => listing.post.location))],
    [sellerListings],
  );

  const sellerChatHref = useMemo(() => {
    const paramsForChat = new URLSearchParams({
      source: "marketplace",
      seller: sellerName,
      company: sellerName,
      product: "Publicaciones en marketplace",
      message: `Hola ${sellerName}, vi tus publicaciones en marketplace. Siguen disponibles?`,
    });

    return `/cliente/chat?${paramsForChat.toString()}`;
  }, [sellerName]);

  const handleOpenListing = (listing: (typeof sellerListings)[number]) => {
    const normalizedText = `${listing.post.tag} ${listing.post.title} ${listing.post.body}`.toLowerCase();
    const saleKind =
      normalizedText.includes("servicio") ||
      normalizedText.includes("mantenimiento") ||
      normalizedText.includes("diagnostico")
        ? "servicio"
        : "producto";

    setActivePublication({
      id: listing.post.id,
      title: listing.post.title,
      body: listing.post.body,
      author: listing.post.author,
      role: listing.post.role,
      location: listing.post.location,
      createdAt: listing.post.time,
      tag: listing.post.tag,
      image: listing.post.image,
      variant: "sale",
      saleKind,
      priceLabel: listing.priceLabel,
      conditionLabel: listing.condition,
      categoryLabel: listing.category,
      initialLikeCount: 0,
      initiallyLiked: false,
      initialComments: [],
    });
  };

  const redirectToSellerChat = (productTitle: string) => {
    const message = `Hola, vi tu anuncio \"${productTitle}\". Sigue disponible?`;
    const chatParams = new URLSearchParams({
      source: "marketplace",
      seller: sellerName,
      company: sellerName,
      product: productTitle,
      message,
    });

    setActivePublication(null);
    router.push(`/cliente/chat?${chatParams.toString()}`);
  };

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Perfil vendedor" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <ClientInfoCard
            eyebrow="PERFIL DE VENDEDOR"
            title={sellerName}
            description="Este perfil muestra todas las publicaciones activas de este vendedor dentro de Marketplace."
          >
            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
              <div className="flex items-center justify-between gap-3">
                <span>Rol</span>
                <strong className="text-cyan-50">{sellerRole}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Publicaciones</span>
                <strong className="text-cyan-50">{sellerListings.length}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Ciudades</span>
                <strong className="text-cyan-50">{sellerCities.length || 1}</strong>
              </div>
            </div>

            <Link
              href={sellerChatHref}
              className="mt-4 inline-flex rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
            >
              Contactar vendedor
            </Link>
          </ClientInfoCard>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente/marketplace", label: "Volver a marketplace" },
              { href: "/cliente/chat", label: "Ir a mis chats" },
              { href: "/cliente", label: "Volver al feed" },
            ]}
          />
        </aside>

        <section className="space-y-4">
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(130deg,rgba(7,29,50,0.96),rgba(8,58,87,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/30 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">PUBLICACIONES DEL VENDEDOR</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-200/35 bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                {getSellerInitials(sellerName)}
              </span>
              <div>
                <h1 className="text-2xl font-semibold text-cyan-50 md:text-3xl">{sellerName}</h1>
                <p className="text-xs text-cyan-100/75">{sellerRole}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-cyan-100/85">
              Aqui aparecen solo anuncios de este vendedor. No se mezclan publicaciones de otros perfiles.
            </p>
          </section>

          {sellerListings.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No encontramos publicaciones activas para este vendedor en marketplace.
              </p>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sellerListings.map((listing) => (
                <motion.article
                  key={listing.post.id}
                  whileHover={{ y: -3, boxShadow: "0 18px 36px rgba(8,145,178,0.22)" }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(160deg,rgba(14,39,69,0.95),rgba(7,24,44,0.97))] shadow-xl shadow-slate-950/25"
                >
                  {listing.post.image ? (
                    <img
                      src={listing.post.image}
                      alt={listing.post.title}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-44 w-full bg-[linear-gradient(140deg,rgba(34,211,238,0.25),rgba(30,64,175,0.24),rgba(8,47,73,0.6))]" />
                  )}

                  <div className="p-4">
                    <p className="text-2xl font-bold text-cyan-50">{listing.priceLabel}</p>
                    <h2 className="mt-2 line-clamp-2 text-base font-semibold text-white">{listing.post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-cyan-100/80">{listing.post.body}</p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-cyan-100/20 bg-cyan-300/12 px-3 py-1 text-cyan-50">
                        {listing.category}
                      </span>
                      <span className="rounded-full border border-cyan-100/20 bg-white/5 px-3 py-1 text-cyan-100/85">
                        {listing.condition}
                      </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 px-3 py-2 text-xs text-cyan-100/78">
                      <p>{listing.post.location}</p>
                      <p className="mt-1">{listing.post.time}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenListing(listing)}
                        className="rounded-xl border border-cyan-200/25 bg-cyan-400/18 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/24"
                      >
                        Ver anuncio
                      </button>
                      <button
                        type="button"
                        onClick={() => redirectToSellerChat(listing.post.title)}
                        className="rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-100/90 transition hover:bg-white/10"
                      >
                        Contactar
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </section>
          )}
        </section>
      </main>

      <PublicationViewerModal
        publication={activePublication}
        onClose={() => setActivePublication(null)}
        secondaryActionLabel="Contactar vendedor"
        onSecondaryAction={() => {
          if (!activePublication) {
            return;
          }

          redirectToSellerChat(activePublication.title);
        }}
      />
    </div>
  );
}

export default function MarketplaceSellerProfilePage() {
  return (
    <Suspense fallback={<div className="flex-1 pb-10" />}>
      <MarketplaceSellerProfileContent />
    </Suspense>
  );
}
