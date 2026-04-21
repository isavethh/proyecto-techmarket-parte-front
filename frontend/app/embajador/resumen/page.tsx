"use client";

import Link from "next/link";
import { EmbajadorSidebar } from "../page";
import { ambassadorProfile, referredBusinesses } from "../ambassadorData";

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

export default function EmbajadorResumenPage() {
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

          <span className="hidden rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/80 md:inline-flex">
            Embajador
          </span>
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="resumen" />

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
                  <Link
                    href="/embajador"
                    className="tech-button tech-button-primary px-4 py-2 text-xs"
                  >
                    Referir
                  </Link>
                </div>
              </div>
              <p className="mt-2 text-sm text-cyan-100/78">
                Usa tu link de referido para invitar negocios nuevos y medir conversion por embajador.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
