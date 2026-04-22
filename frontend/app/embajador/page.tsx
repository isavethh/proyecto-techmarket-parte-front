"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ambassadorProfile,
  referredAmbassadors,
  referredBusinesses,
} from "./ambassadorData";

const referralLinkString = "https://techmarket.bo/auth?mode=register&type=empresa&ref=SV-EMB-0426";

const referralQrPreviewRows = [
  "########..##..########",
  "##....##....##....####",
  "##.##.##.##..##.##.###",
  "##....##..##.##....###",
  "########.##..#########",
  "..##..####..##..##....",
  "##..##....##..####.###",
  "..######..####..##..##",
  "##..##..##..##..####..",
  "####..######..##..####",
  "..##..##..####..##..##",
  "########..##..########",
];

const referralQrGrid = referralQrPreviewRows.map((row) =>
  row.split("").map((cell) => cell === "#"),
);

const currentLevel = ambassadorProfile.level;
const nextLevel = currentLevel === 1 ? 2 : currentLevel === 2 ? 3 : null;
const levelRuleDescription = nextLevel
  ? `Como embajador Nivel ${currentLevel}, puedes referir embajadores Nivel ${nextLevel}.`
  : "Como embajador Nivel 3, ya no puedes referir nuevos niveles de embajadores.";

const totalReferredBusinesses = referredBusinesses.length;
const activeBusinesses = referredBusinesses.filter((business) => business.status === "Activo").length;
const averageRating = (
  referredBusinesses.reduce((acc, business) => acc + business.rating, 0) / totalReferredBusinesses
).toFixed(1);
const averageUserScore = Math.round(
  referredBusinesses.reduce((acc, business) => acc + business.userScore, 0) / totalReferredBusinesses,
);
const averageConversion = Math.round(
  referredBusinesses.reduce((acc, business) => acc + business.conversionRate, 0) / totalReferredBusinesses,
);
const totalCommissionGenerated = referredBusinesses.reduce(
  (acc, business) => acc + business.commissionGenerated,
  0,
);

const ambassadorKpis = [
  { label: "Nivel de embajador", value: `Nivel ${ambassadorProfile.level}`, helper: "Rango actual" },
  { label: "Negocios referidos", value: `${totalReferredBusinesses}`, helper: "Cuentas en tu red" },
  { label: "Negocios activos", value: `${activeBusinesses}`, helper: "Operando este mes" },
  { label: "Percepcion usuario", value: `${averageUserScore}/100`, helper: "Promedio de confianza" },
  { label: "Conversion promedio", value: `${averageConversion}%`, helper: "Lead a cierre comercial" },
  {
    label: "Comision estimada",
    value: `Bs ${totalCommissionGenerated.toLocaleString("es-BO")}`,
    helper: "Acumulado en negocios activos",
  },
  { label: "Rating promedio", value: `${averageRating}/5`, helper: "Valoracion de clientes" },
];

export type EmbajadorSidebarSection = "resumen" | "negocios" | "usuarios" | "embajadores" | "prospectos";

type EmbajadorSidebarProps = {
  activeSection?: EmbajadorSidebarSection;
  onOpenReferralModal?: () => void;
};

const getSidebarLinkClass = (isActive: boolean) => {
  return isActive ? "auth-action active" : "auth-action";
};

export function EmbajadorSidebar({
  activeSection = "resumen",
  onOpenReferralModal,
}: EmbajadorSidebarProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
      <section className="tech-card">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
            {ambassadorProfile.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-cyan-50">{ambassadorProfile.name}</p>
            <p className="text-xs text-cyan-100/75">{ambassadorProfile.account}</p>
            <p className="mt-1 inline-flex rounded-full border border-cyan-100/15 bg-cyan-300/12 px-2 py-0.5 text-[11px] font-semibold text-cyan-50">
              Nivel {ambassadorProfile.level}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/85">
          <div className="flex items-center justify-between gap-3">
            <span>Ciudad</span>
            <strong className="text-cyan-50">{ambassadorProfile.city}</strong>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Residencia</span>
            <strong className="text-cyan-50">{ambassadorProfile.residenceArea}</strong>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Especialidad</span>
            <strong className="text-cyan-50">Captacion local</strong>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <p className="tech-mono text-[11px] text-cyan-200/70">[ PERFIL EMBJADOR ]</p>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- PANEL ---</p>
          <Link href="/embajador/resumen" className={getSidebarLinkClass(activeSection === "resumen")}>
            Resumen
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- RED ---</p>
          <a href="/embajador/negocios-referidos" className={getSidebarLinkClass(activeSection === "negocios")}>
            Negocios referidos
          </a>
          <Link href="/embajador/vision-usuarios" className={getSidebarLinkClass(activeSection === "usuarios")}>
            Vision de usuarios
          </Link>
          <Link
            href="/embajador/embajadores-referidos"
            className={getSidebarLinkClass(activeSection === "embajadores")}
          >
            Embajadores referidos
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- CRECIMIENTO ---</p>
          <Link href="/embajador/prospectos" className={getSidebarLinkClass(activeSection === "prospectos")}>
            Prospectos
          </Link>
          <Link href="/embajador/onboarding" className="auth-action">
            Onboarding
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- MONETIZACION ---</p>
          <Link href="/embajador/comisiones" className="auth-action">
            Comisiones
          </Link>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">[ BOTON ]</p>
          {onOpenReferralModal ? (
            <button
              type="button"
              onClick={onOpenReferralModal}
              className="auth-action active"
            >
              Referir
            </button>
          ) : (
            <Link href="/embajador" className="auth-action active">
              Referir
            </Link>
          )}

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/60">--- SISTEMA ---</p>
          <Link href="/auth?mode=login&type=embajador" className="auth-action">
            Cerrar sesion
          </Link>
        </div>
      </section>
    </aside>
  );
}

export default function EmbajadorPage() {
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [didCopyReferralLink, setDidCopyReferralLink] = useState(false);

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
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>

          <div className="hidden rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:inline-flex md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            Panel de embajador con seguimiento activo
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsReferralModalOpen(true)}
              className="tech-button tech-button-primary px-4 py-2 text-xs"
            >
              Referir
            </button>
            <span className="hidden rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/80 md:inline-flex">
              Embajador
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar
          activeSection="resumen"
          onOpenReferralModal={() => setIsReferralModalOpen(true)}
        />

        <section className="space-y-6">
          <section
            id="resumen"
            className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8"
          >
            <p className="tech-mono text-xs text-cyan-200/75">RESUMEN DE RED REFERIDA</p>
            <h1 className="mt-3 text-3xl font-bold text-cyan-50 md:text-4xl">
              Asi les esta yendo a tus negocios referidos
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/80">{ambassadorProfile.bio}</p>

            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-sm text-cyan-100/82">
              {levelRuleDescription}
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
                <p className="text-sm font-semibold text-cyan-50">Accion urgente para crecer tu red</p>
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
              <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                Seguimiento comercial y reputacional
              </span>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {referredBusinesses.map((business) => (
                <article key={business.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-cyan-50">{business.name}</p>
                      <p className="text-xs text-cyan-200/75">
                        {business.category} · {business.city} · Referido: {business.referredAt}
                      </p>
                    </div>
                    <span className="rounded-full border border-cyan-100/18 bg-cyan-300/12 px-2.5 py-1 text-[11px] text-cyan-50">
                      {business.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-cyan-100/82">{business.userView}</p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
                      <p>Leads del mes</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-50">{business.monthlyLeads}</p>
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
                      <p>Conversion</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-50">{business.conversionRate}%</p>
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
                      <p>Crecimiento</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-50">+{business.growthRate}%</p>
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
                      <p>Rating</p>
                      <p className="mt-1 text-lg font-semibold text-cyan-50">{business.rating.toFixed(1)} / 5</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/embajador/negocios-referidos?business=${encodeURIComponent(business.id)}`}
                      className="inline-flex rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                    >
                      Ver valor detallado de este negocio
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="embajadores-referidos" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Embajadores referidos por ti</h2>
              <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                Jerarquia por niveles
              </span>
            </div>

            <p className="mt-3 text-sm text-cyan-100/80">{levelRuleDescription}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {referredAmbassadors.map((ambassador) => (
                <article key={ambassador.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-cyan-50">{ambassador.name}</p>
                    <span className="rounded-full border border-cyan-100/18 bg-cyan-300/12 px-2.5 py-1 text-[11px] text-cyan-50">
                      Nivel {ambassador.level}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-cyan-100/82">{ambassador.focus}</p>
                  <div className="mt-3 grid gap-2 text-xs text-cyan-100/80 sm:grid-cols-3">
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2">
                      Estado: {ambassador.status}
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2">
                      Referido: {ambassador.referredAt}
                    </div>
                    <div className="rounded-xl border border-cyan-100/10 bg-slate-950/35 px-3 py-2">
                      Negocios activos: {ambassador.activeBusinesses}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="usuarios" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Como los estan viendo los usuarios</h2>
              <span className="rounded-full border border-cyan-100/15 bg-emerald-300/12 px-3 py-1 text-xs text-emerald-100">
                Enfoque principal del embajador
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {referredBusinesses.map((business) => (
                <article key={`${business.id}-users`} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-cyan-50">{business.name}</p>
                    <p className="text-xs text-cyan-200/80">Percepcion usuario: {business.userScore}/100</p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full border border-cyan-100/10 bg-slate-950/45">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.92))]"
                      style={{ width: `${business.userScore}%` }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-cyan-100/82">"{business.topComment}"</p>
                  <p className="mt-2 text-xs text-cyan-100/70">
                    Impacto en tu reputacion como embajador: {business.reputationContribution}/100
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
                    Referido activo
                  </span>
                </div>

              </div>

              <div className="rounded-2xl border border-cyan-100/14 bg-slate-950/35 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">QR de referido</p>

                <div className="mx-auto mt-3 w-full max-w-[220px] rounded-2xl border border-cyan-100/12 bg-white p-3 shadow-lg shadow-slate-950/30">
                  <div
                    className="grid gap-[2px]"
                    style={{ gridTemplateColumns: `repeat(${referralQrGrid[0]?.length ?? 0}, minmax(0, 1fr))` }}
                  >
                    {referralQrGrid.map((row, rowIndex) =>
                      row.map((isFilled, columnIndex) => (
                        <span
                          key={`${rowIndex}-${columnIndex}`}
                          className={`aspect-square rounded-[1px] ${isFilled ? "bg-slate-950" : "bg-white"}`}
                        />
                      )),
                    )}
                  </div>
                </div>

                <p className="mt-3 text-center text-xs text-cyan-100/75">QR demo para compartir</p>
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
