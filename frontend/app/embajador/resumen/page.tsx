"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EmbajadorSidebar, EmbajadorTopbarControls } from "../page";
import { useAmbassadorProfile, useComputedStats } from "../useAmbassadorApi";
import { LiveApiBadge } from "../HardcodedBadge";

export default function EmbajadorResumenPage() {
  const { data: profile } = useAmbassadorProfile();
  const stats = useComputedStats();

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

          <EmbajadorTopbarControls profile={profile} />
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="resumen" profile={profile} />

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
              Asi les esta yendo a tus negocios referidos
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Bienvenido al panel de embajador. Aqui puedes ver el rendimiento de tu red de negocios referidos.
            </p>

            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-sm text-cyan-100/82">
              Tu posicion en la red es Raíz. Tus referidos se organizan en niveles relativos a ti.
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
