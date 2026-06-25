"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { logout, requireAuth } from "@/lib/auth/authGuard";
import {
  useAmbassadorProfile,
  useComputedStats,
  useAmbassadorReferrals,
  useAmbassadorNetworkTree,
  useAmbassadorReferralCodes,
  useAmbassadorReferralLinks,
  useAmbassadorReferralLinkQr,
  useAmbassadorReferralLinkStats,
  useAmbassadorPerformanceReport,
  useAmbassadorConversionFunnel,
} from "./useAmbassadorApi";
import { LiveApiBadge } from "./HardcodedBadge";
import { EmbajadorSidebar, EmbajadorTopbarControls } from "./EmbajadorSidebar";
import { EmbajadorPageHeader } from "./EmbajadorPageHeader";

// Re-export for back-compat with pages importing from "../page"
export { EmbajadorSidebar, EmbajadorTopbarControls } from "./EmbajadorSidebar";
export type { EmbajadorSidebarSection } from "./EmbajadorSidebar";

export default function EmbajadorPage() {
  const router = useRouter();

  useEffect(() => {
    requireAuth(router);
  }, [router]);

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [didCopyReferralLink, setDidCopyReferralLink] = useState(false);

  const { data: profile } = useAmbassadorProfile();
  const stats = useComputedStats();
  const { data: referrals } = useAmbassadorReferrals();
  const { data: networkTree } = useAmbassadorNetworkTree();
  const { data: referralCodes } = useAmbassadorReferralCodes();
  const { data: referralLinks } = useAmbassadorReferralLinks();
  const primaryReferralLink = referralLinks?.[0] ?? null;
  const { data: referralLinkQr } = useAmbassadorReferralLinkQr(primaryReferralLink?.id ?? null);
  const { data: referralLinkStats } = useAmbassadorReferralLinkStats(primaryReferralLink?.id ?? null);
  const { data: performanceReport } = useAmbassadorPerformanceReport();
  const { data: conversionFunnel } = useAmbassadorConversionFunnel();

  const referralOrigin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const referralLinkString = primaryReferralLink?.url ?? (referralCodes?.[0]
    ? `${referralOrigin}/auth?mode=register&type=empresa&ref=${referralCodes[0].codigo}`
    : "");
  const referralCodeString = primaryReferralLink?.codigo ?? referralCodes?.[0]?.codigo ?? "Sin código";
  const referralClicks = referralLinkStats?.clicks ?? performanceReport?.clics ?? 0;
  const referralRegistrations = referralLinkStats?.registros ?? conversionFunnel?.registros ?? referrals?.length ?? 0;
  const referralLinkConversion = referralLinkStats?.conversionRate ?? performanceReport?.conversionRate ?? stats?.conversionRate ?? 0;

  const ambassadorKpis = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Nivel de embajador", value: stats.nivel, helper: "Rango actual" },
      { label: "Negocios referidos", value: `${stats.negociosReferidos}`, helper: "Cuentas en tu red" },
      { label: "Negocios activos", value: `${stats.negociosActivos}`, helper: "Operando este mes" },
      { label: "Conversion", value: `${stats.conversionRate}%`, helper: "Lead a cierre comercial" },
      { label: "Comisiones totales", value: stats.comisionesTotales, helper: "Acumulado total" },
    ];
  }, [stats]);

  useEffect(() => {
    if (!isReferralModalOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsReferralModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isReferralModalOpen]);

  useEffect(() => {
    if (!isReferralModalOpen) {
      setDidCopyReferralLink(false);
    }
  }, [isReferralModalOpen]);

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLinkString);
      setDidCopyReferralLink(true);
      window.setTimeout(() => setDidCopyReferralLink(false), 1800);
    } catch {
      setDidCopyReferralLink(false);
    }
  };

  return (
    <div className="flex-1 pb-10">
      <EmbajadorPageHeader
        profile={profile}
        rightSlot={
          <button
            type="button"
            onClick={() => setIsReferralModalOpen(true)}
            className="tech-button tech-button-primary px-4 py-2 text-xs"
          >
            Referir
          </button>
        }
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar
          activeSection="resumen"
          onOpenReferralModal={() => setIsReferralModalOpen(true)}
          onLogout={() => logout(router)}
          profile={profile}
        />

        <section className="space-y-6">
          <section
            id="resumen"
            className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="tech-mono text-xs text-cyan-200/75">RESUMEN DE RED REFERIDA</p>
              <LiveApiBadge label="API — /profile + /referrals + /commissions" />
            </div>
            <h1 className="mt-3 text-3xl font-bold text-cyan-50 md:text-4xl">
              Así les está yendo a tus negocios referidos
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Bienvenido al panel de embajador. Aquí puedes ver el rendimiento de tu red de negocios referidos.
            </p>

            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-sm text-cyan-100/82">
              Tu posición en la red es Raíz. Tus referidos se organizan en niveles relativos a ti.
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {ambassadorKpis.map((kpi) => (
                <article key={kpi.label} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/65">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-bold text-cyan-50">{kpi.value}</p>
                  <p className="mt-1 text-xs text-cyan-100/75">{kpi.helper}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-cyan-50">Acción urgente para crecer tu red</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/embajador/negocios-referidos" className="tech-button tech-button-secondary px-4 py-2 text-xs">
                    Negocios referidos
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsReferralModalOpen(true)}
                    className="tech-button tech-button-primary px-4 py-2 text-xs"
                  >
                    Referir
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-cyan-100/78">
                Usa tu link de referido para invitar negocios nuevos y medir conversion por embajador.
              </p>
            </div>
          </section>

          <section id="negocios" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Resumen de negocios referidos</h2>
              <LiveApiBadge label="API — /referrals" />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {(referrals ?? []).map((r) => (
                <article key={r.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-cyan-50">{r.nombre ?? r.id}</p>
                      <p className="text-xs text-cyan-200/75">
                        {r.tipo} · Referido: {r.fechaRegistro}
                      </p>
                    </div>
                    <span className="rounded-full border border-cyan-100/18 bg-cyan-300/12 px-2.5 py-1 text-[11px] text-cyan-50">
                      {r.estado}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
                      <p>Comisión generada</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-50">{r.comisionGenerada}</p>
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
                      <p>Estado</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-50">{r.estado}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/embajador/negocios-referidos?business=${encodeURIComponent(r.id)}`}
                      className="inline-flex rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="embajadores-referidos" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Embajadores referidos por ti</h2>
              <LiveApiBadge label="API — /network/tree" />
            </div>

            <p className="mt-3 text-sm text-cyan-100/80">Tu posición es Raíz. Tus sub-embajadores aparecen debajo.</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(networkTree?.subEmbajadores ?? []).length === 0 && (
                <p className="text-sm text-cyan-100/60 col-span-full">Aun no tienes sub-embajadores en tu red.</p>
              )}
              {(networkTree?.subEmbajadores ?? []).map((amb) => (
                <article key={amb.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-cyan-50">{amb.nombre}</p>
                    <span className="rounded-full border border-cyan-100/18 bg-cyan-300/12 px-2.5 py-1 text-[11px] text-cyan-50">
                      {amb.nivel}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="usuarios" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Como los están viendo los usuarios</h2>
            </div>

            <div className="mt-4 grid gap-3">
              {(referrals ?? []).map((r) => (
                <article key={`${r.id}-users`} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-cyan-50">{r.nombre ?? r.id}</p>
                    <p className="text-xs text-cyan-200/80">Comision: {r.comisionGenerada}</p>
                  </div>
                  <p className="mt-2 text-xs text-cyan-100/70">
                    Tipo: {r.tipo} · Estado: {r.estado}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>

      {isReferralModalOpen ? (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/82 px-4 py-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Panel de referido"
          onClick={() => setIsReferralModalOpen(false)}
        >
          <section
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-100/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_42%),linear-gradient(165deg,rgba(11,34,60,0.97),rgba(5,18,35,0.98))] p-5 shadow-2xl shadow-slate-950/70 md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-100/20 bg-cyan-300/15 text-cyan-50">
                  ↗
                </div>
                <div>
                  <p className="tech-mono text-xs text-cyan-200/70">REFERIR NEGOCIO</p>
                  <h3 className="mt-2 text-2xl font-semibold text-cyan-50">Comparte tu acceso de referido</h3>
                  <p className="mt-2 max-w-xl text-sm text-cyan-100/80">
                    Invita empresas con tu link personalizado.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100/80"
              >
                Cerrar
              </button>
            </div>

            <div className="relative mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-cyan-100/14 bg-slate-950/35 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Link de referido</p>
                <div className="mt-3 rounded-xl border border-cyan-100/12 bg-slate-950/55 p-3">
                  <p className="break-all text-sm leading-6 text-cyan-100/92">{referralLinkString}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReferralLink}
                    className="rounded-xl border border-cyan-200/28 bg-cyan-300/18 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/25"
                  >
                    {didCopyReferralLink ? "Link copiado" : "Copiar link"}
                  </button>
                  <span className="rounded-full border border-cyan-100/14 bg-white/5 px-2.5 py-1 text-[11px] text-cyan-100/80">
                    Codigo {referralCodeString}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-cyan-100/10 bg-slate-950/45 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Clicks</p>
                    <p className="mt-1 text-lg font-semibold text-cyan-50">{referralClicks}</p>
                  </div>
                  <div className="rounded-xl border border-cyan-100/10 bg-slate-950/45 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Registros</p>
                    <p className="mt-1 text-lg font-semibold text-cyan-50">{referralRegistrations}</p>
                  </div>
                  <div className="rounded-xl border border-cyan-100/10 bg-slate-950/45 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Conversion</p>
                    <p className="mt-1 text-lg font-semibold text-cyan-50">{referralLinkConversion}%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-100/14 bg-slate-950/35 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">QR de referido</p>

                <div className="mx-auto mt-3 w-full max-w-[220px] rounded-2xl border border-cyan-100/12 bg-white p-3 shadow-lg shadow-slate-950/30">
                  {referralLinkQr?.qrUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={referralLinkQr.qrUrl} alt={`QR ${referralCodeString}`} className="aspect-square w-full rounded-xl bg-white object-contain p-2" />
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-950 text-center text-xs font-semibold text-cyan-50">
                      QR no disponible
                    </div>
                  )}
                </div>

                <p className="mt-3 text-center text-xs text-cyan-100/75">QR real del link activo</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-xs font-semibold text-cyan-100/82"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleCopyReferralLink}
                className="rounded-xl border border-cyan-200/28 bg-cyan-300/18 px-4 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/25"
              >
                {didCopyReferralLink ? "Link copiado" : "Copiar y compartir"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
