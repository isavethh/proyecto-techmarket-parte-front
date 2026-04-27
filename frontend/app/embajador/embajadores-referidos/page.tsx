"use client";

import Link from "next/link";
import { EmbajadorSidebar } from "../page";
import { ambassadorProfile, referredAmbassadors } from "../ambassadorData";

const currentLevel = ambassadorProfile.level;
const nextLevel = currentLevel === 1 ? 2 : currentLevel === 2 ? 3 : null;
const levelRuleDescription = nextLevel
  ? `Como embajador Nivel ${currentLevel}, puedes referir embajadores Nivel ${nextLevel}.`
  : "Como embajador Nivel 3, ya no puedes referir nuevos niveles de embajadores.";

export default function EmbajadorEmbajadoresReferidosPage() {
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
        <EmbajadorSidebar activeSection="embajadores" />

        <section className="space-y-6">
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
        </section>
      </main>
    </div>
  );
}
