"use client";

import Link from "next/link";
import { EmbajadorSidebar } from "../page";
import { useAmbassadorAiInsights, useAmbassadorProfile, useAmbassadorReferralsReport } from "../useAmbassadorApi";
import { LiveApiBadge } from "../HardcodedBadge";

export default function EmbajadorVisionUsuariosPage() {
  const { data: profile } = useAmbassadorProfile();
  const { data: referralsReport } = useAmbassadorReferralsReport();
  const { data: aiInsights } = useAmbassadorAiInsights();

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
        <EmbajadorSidebar activeSection="usuarios" profile={profile} />

        <section className="space-y-6">
          <section id="usuarios" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Señales reales de tus referidos</h2>
              <LiveApiBadge label="API — /reports/referrals + /ai/insights" />
            </div>

            {aiInsights ? (
              <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-cyan-50">Recomendación IA</p>
                <p className="mt-2 text-sm text-cyan-100/80">{aiInsights.recomendacion}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  {aiInsights.radar.map((item) => (
                    <article key={item.etiqueta} className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/70">{item.etiqueta}</p>
                      <p className="mt-2 text-2xl font-bold text-cyan-50">{item.valor}</p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 grid gap-3">
              {(referralsReport ?? []).map((business) => (
                <article key={`${business.referido}-users`} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-cyan-50">{business.referido}</p>
                    <p className="text-xs text-cyan-200/80">Ventas generadas: {business.ventasGeneradas}</p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full border border-cyan-100/10 bg-slate-950/45">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(6,182,212,0.45),rgba(34,211,238,0.92))]"
                      style={{ width: `${Math.min(100, business.ventasGeneradas * 12)}%` }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-cyan-100/82">
                    {business.tipo} · {business.estado} · Comisión {business.comision}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
