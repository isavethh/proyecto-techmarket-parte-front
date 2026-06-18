"use client";

import { EmbajadorSidebar } from "../EmbajadorSidebar";
import { EmbajadorPageHeader } from "../EmbajadorPageHeader";
import { useAmbassadorAiInsights, useAmbassadorProfile, useAmbassadorReferralsReport } from "../useAmbassadorApi";
import { LiveApiBadge } from "../HardcodedBadge";

export default function EmbajadorVisionUsuariosPage() {
  const { data: profile } = useAmbassadorProfile();
  const { data: referralsReport } = useAmbassadorReferralsReport();
  const { data: aiInsights } = useAmbassadorAiInsights();

  return (
    <div className="flex-1 pb-10">
      <EmbajadorPageHeader profile={profile} />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="usuarios" profile={profile} />

        <section className="space-y-6">
          <section id="usuarios" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Señales reales de tus referidos</h2>
              <LiveApiBadge label="API — /reports/referrals + /ai/insights" />
            </div>

            {aiInsights && aiInsights.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {aiInsights.map((insight) => (
                  <article key={insight.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-cyan-50">{insight.title}</p>
                      {insight.priority ? (
                        <span className="rounded-full border border-cyan-100/15 bg-slate-950/40 px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">
                          {insight.priority}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-cyan-100/80">{insight.description}</p>
                    {insight.actionSuggestion ? (
                      <p className="mt-3 text-sm leading-6 text-emerald-100/85">
                        Sugerencia: {insight.actionSuggestion}
                      </p>
                    ) : null}
                  </article>
                ))}
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
