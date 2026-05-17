"use client";

import Link from "next/link";
import { useState } from "react";
import { EmbajadorSidebar, EmbajadorTopbarControls } from "../page";
import {
  useAmbassadorProfile,
  useAmbassadorCommissions,
  useAmbassadorCommissionsSummary,
  useAmbassadorCommissionDetail,
  useAmbassadorWallet,
  useAmbassadorPayouts,
  useAmbassadorPayoutMethods,
  type ApiCommission,
} from "../useAmbassadorApi";
import { LiveApiBadge } from "../HardcodedBadge";

export default function ComisionesPage() {
  const [selectedCommission, setSelectedCommission] = useState<ApiCommission | null>(null);

  const { data: profile } = useAmbassadorProfile();
  const { data: commissions } = useAmbassadorCommissions();
  const { data: summary } = useAmbassadorCommissionsSummary();
  const { data: commissionDetail } = useAmbassadorCommissionDetail(selectedCommission?.id ?? null);
  const { data: wallet } = useAmbassadorWallet();
  const { data: payouts } = useAmbassadorPayouts();
  const { data: payoutMethods } = useAmbassadorPayoutMethods();

  const items = commissions ?? [];

  return (
    <div className="flex-1 pb-10">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <EmbajadorTopbarControls profile={profile} />
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="comisiones" profile={profile} />

        <section className="space-y-6">
          {/* Summary KPIs */}
          <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="tech-mono text-xs text-cyan-200/75">RESUMEN FINANCIERO</p>
              <LiveApiBadge label="API — /commissions/summary" />
            </div>
            <h1 className="mt-3 text-3xl font-bold text-cyan-50 md:text-4xl">Comisiones y Ganancias</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Monitorea el valor generado por tu red. Aqui puedes ver tus ingresos acumulados, lo que tienes pendiente por cobrar y tu historial de comisiones.
            </p>

            <div className="mt-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Total Generado</p>
                <p className="mt-2 text-xl font-bold text-cyan-50">{summary?.totalGenerado ?? "..."}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Disponible</p>
                <p className="mt-2 text-xl font-bold text-emerald-200">{summary?.disponible ?? "..."}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Pendiente</p>
                <p className="mt-2 text-xl font-bold text-amber-200">{summary?.pendiente ?? "..."}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Pagado</p>
                <p className="mt-2 text-xl font-bold text-cyan-50">{summary?.pagado ?? "..."}</p>
              </article>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <article className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-emerald-100/75">Wallet disponible</p>
                <p className="mt-2 text-xl font-bold text-emerald-50">{wallet?.saldoDisponible ?? "..."}</p>
              </article>
              <article className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-amber-100/75">Wallet pendiente</p>
                <p className="mt-2 text-xl font-bold text-amber-50">{wallet?.saldoPendiente ?? "..."}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Total retirado</p>
                <p className="mt-2 text-xl font-bold text-cyan-50">{wallet?.totalRetirado ?? "..."}</p>
              </article>
            </div>
          </section>

<<<<<<< HEAD
          {/* Commission list */}
          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Historial de Comisiones</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                  {items.length} comisiones
                </span>
                <LiveApiBadge label="API — /commissions" />
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {items.map((c) => (
                <article
                  key={c.id}
                  className="cursor-pointer rounded-2xl border border-cyan-100/10 bg-white/5 p-4 transition hover:border-cyan-300/25 hover:bg-white/8"
                  onClick={() => setSelectedCommission(selectedCommission?.id === c.id ? null : c)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">{c.referido}</p>
                      <p className="text-xs text-cyan-200/75">{c.concepto} · {c.fecha}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-cyan-50">{c.monto}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        c.estado === "CONFIRMED"
                          ? "border border-emerald-300/30 bg-emerald-300/12 text-emerald-100"
                          : "border border-amber-300/30 bg-amber-300/12 text-amber-100"
                      }`}>
                        {c.estado}
                      </span>
                    </div>
                  </div>

                  {selectedCommission?.id === c.id && (
                    <div className="mt-3 rounded-xl border border-cyan-100/10 bg-slate-950/40 p-3 text-sm text-cyan-100/80">
                      <p><strong>Concepto:</strong> {commissionDetail?.concepto ?? c.concepto}</p>
                      <p className="mt-1"><strong>Referido:</strong> {commissionDetail?.referido ?? c.referido}</p>
                      <p className="mt-1"><strong>Estado:</strong> {commissionDetail?.estado ?? c.estado}</p>
                      <p className="mt-1"><strong>Porcentaje:</strong> {commissionDetail?.porcentaje ?? 5}%</p>
                      <p className="mt-1"><strong>Fecha:</strong> {commissionDetail?.fechaGeneracion ?? c.fecha}</p>
                    </div>
                  )}
                </article>
              ))}

              {items.length === 0 && (
                <p className="text-sm text-cyan-100/60">No hay comisiones registradas.</p>
              )}
            </div>
          </section>

          {/* Nivel 1 description */}
          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Retiros y métodos de pago</h2>
              <LiveApiBadge label="API — /wallet + /payouts + /payout-methods" />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-cyan-50">Historial de retiros</p>
                <div className="mt-3 space-y-2">
                  {(payouts ?? []).map((payout) => (
                    <div key={payout.id} className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-sm text-cyan-100/80">
                      <div className="flex items-center justify-between gap-3">
                        <span>{payout.monto}</span>
                        <span className="text-xs text-cyan-200/75">{payout.estado}</span>
                      </div>
                      <p className="mt-1 text-xs text-cyan-100/60">{payout.fecha ?? "Sin fecha"}</p>
                    </div>
=======
          {/* Historial */}
          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Historial de comisiones</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-cyan-100/80">
                <thead className="border-b border-cyan-100/10 text-xs uppercase tracking-wide text-cyan-100/60">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Negocio / Fuente</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium text-right">Monto</th>
                    <th className="px-4 py-3 font-medium text-center">Estado</th>
                    <th className="px-4 py-3 font-medium text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100/5">
                  {commissionsData.map(commission => (
                    <tr key={commission.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">{commission.date}</td>
                      <td className="px-4 py-4 font-semibold text-cyan-50">{commission.source}</td>
                      <td className="px-4 py-4 capitalize">{commission.type}</td>
                      <td className="px-4 py-4 text-right font-bold text-cyan-50">Bs {commission.amount}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold border ${commission.status === "Pagado"
                          ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
                          : "bg-amber-400/10 text-amber-300 border-amber-400/20"
                          }`}>
                          {commission.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelectedCommission(commission)}
                          className="text-xs font-semibold text-cyan-300 hover:text-cyan-100 underline decoration-cyan-300/30 underline-offset-4"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
>>>>>>> Nobre
                  ))}
                  {(payouts ?? []).length === 0 ? <p className="text-sm text-cyan-100/60">Aun no hay retiros.</p> : null}
                </div>
              </article>

              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-cyan-50">Métodos de pago</p>
                <div className="mt-3 space-y-2">
                  {(payoutMethods ?? []).map((method) => (
                    <div key={method.id} className="rounded-xl border border-cyan-100/10 bg-slate-950/35 p-3 text-sm text-cyan-100/80">
                      <div className="flex items-center justify-between gap-3">
                        <span>{method.tipo} {method.banco ? `· ${method.banco}` : ""}</span>
                        <span className="text-xs text-cyan-200/75">{method.predeterminado ? "Predeterminado" : "Activo"}</span>
                      </div>
                      <p className="mt-1 text-xs text-cyan-100/60">Terminación {method.ultimos4 ?? "----"}</p>
                    </div>
                  ))}
                  {(payoutMethods ?? []).length === 0 ? <p className="text-sm text-cyan-100/60">Aun no hay métodos de pago.</p> : null}
                </div>
              </article>
            </div>
          </section>
        </section>
      </main>
<<<<<<< HEAD
=======

      {/* Modal de Detalle */}
      {selectedCommission && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/82 px-4 py-6 backdrop-blur-md"
          onClick={() => setSelectedCommission(null)}
        >
          <section
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-100/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_42%),linear-gradient(165deg,rgba(11,34,60,0.97),rgba(5,18,35,0.98))] p-6 shadow-2xl shadow-slate-950/70"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="tech-mono text-xs text-cyan-200/70">DETALLE DE COMISION</p>
                <h3 className="mt-2 text-2xl font-bold text-cyan-50">Bs {selectedCommission.amount}</h3>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold border ${selectedCommission.status === "Pagado"
                ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
                : "bg-amber-400/10 text-amber-300 border-amber-400/20"
                }`}>
                {selectedCommission.status}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-cyan-100/10 bg-slate-950/40 p-4">
                <p className="text-[11px] uppercase tracking-wider text-cyan-200/60">Origen</p>
                <p className="mt-1 font-semibold text-cyan-50">{selectedCommission.source}</p>
                <p className="text-xs text-cyan-100/70 capitalize">({selectedCommission.type})</p>
              </div>

              <div className="rounded-xl border border-cyan-100/10 bg-slate-950/40 p-4">
                <p className="text-[11px] uppercase tracking-wider text-cyan-200/60">Como se genero</p>
                <p className="mt-1 text-sm leading-relaxed text-cyan-100/90">{selectedCommission.howGenerated}</p>
              </div>

              <div className="rounded-xl border border-cyan-100/10 bg-slate-950/40 p-4">
                <p className="text-[11px] uppercase tracking-wider text-cyan-200/60">Fecha de registro</p>
                <p className="mt-1 text-sm font-semibold text-cyan-50">{selectedCommission.date}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedCommission(null)}
                className="rounded-xl border border-cyan-100/15 bg-white/5 px-5 py-2 text-sm font-semibold text-cyan-100/80 hover:bg-white/10 transition-colors"
              >
                Cerrar detalle
              </button>
            </div>
          </section>
        </div>
      )}
>>>>>>> Nobre
    </div>
  );
}
