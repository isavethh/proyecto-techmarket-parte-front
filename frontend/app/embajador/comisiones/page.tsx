"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { EmbajadorSidebar } from "../page";

type CommissionType = "negocio referido" | "campana" | "red de embajadores" | "bono";
type CommissionStatus = "Pendiente" | "Pagado";

interface Commission {
  id: string;
  source: string;
  type: CommissionType;
  amount: number;
  date: string;
  status: CommissionStatus;
  howGenerated: string;
}

const commissionsData: Commission[] = [
  { id: "c-1", source: "FixCloud Soporte", type: "negocio referido", amount: 350, date: "2026-04-18", status: "Pendiente", howGenerated: "Comision del 5% sobre 7 ventas cerradas por FixCloud Soporte en abril." },
  { id: "c-2", source: "NovaChip Store", type: "negocio referido", amount: 420, date: "2026-04-15", status: "Pendiente", howGenerated: "Comision del 5% sobre 10 ventas de componentes." },
  { id: "c-3", source: "Campana Vuelta a Clases", type: "campana", amount: 150, date: "2026-04-10", status: "Pagado", howGenerated: "Bono fijo por lograr 50 clics referidos en la campana promocional." },
  { id: "c-4", source: "Carlos Medina", type: "red de embajadores", amount: 200, date: "2026-04-05", status: "Pagado", howGenerated: "Bono por 2 nuevos negocios referidos activos de tu embajador nivel 2." },
  { id: "c-5", source: "Bono Trimestral", type: "bono", amount: 500, date: "2026-03-30", status: "Pagado", howGenerated: "Bono por superar la meta de conversion trimestral." },
  { id: "c-6", source: "TecnoNorte Hub", type: "negocio referido", amount: 280, date: "2026-03-15", status: "Pagado", howGenerated: "Comision del 5% sobre accesorios vendidos en marzo." }
];

export default function ComisionesPage() {
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);

  const totalAcumulado = useMemo(() => commissionsData.reduce((acc, c) => acc + c.amount, 0), []);
  const totalMes = useMemo(() => commissionsData.filter(c => c.date.startsWith("2026-04")).reduce((acc, c) => acc + c.amount, 0), []);
  const totalPendiente = useMemo(() => commissionsData.filter(c => c.status === "Pendiente").reduce((acc, c) => acc + c.amount, 0), []);
  const totalPagado = useMemo(() => commissionsData.filter(c => c.status === "Pagado").reduce((acc, c) => acc + c.amount, 0), []);

  const negociosAmount = commissionsData.filter(c => c.type === "negocio referido").reduce((acc, c) => acc + c.amount, 0);
  const negociosCount = new Set(commissionsData.filter(c => c.type === "negocio referido").map(c => c.source)).size;
  const promedioPorNegocio = negociosCount > 0 ? (negociosAmount / negociosCount) : 0;

  const monthlyChartData = [
    { month: "Ene", amount: 950 },
    { month: "Feb", amount: 1100 },
    { month: "Mar", amount: 780 },
    { month: "Abr", amount: totalMes },
  ];
  const maxAmount = Math.max(...monthlyChartData.map(d => d.amount));

  return (
    <div className="flex-1 pb-10">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="hidden rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/80 md:inline-flex">
            Embajador
          </span>
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="comisiones" />

        <section className="space-y-6">
          <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
            <p className="tech-mono text-xs text-cyan-200/75">RESUMEN FINANCIERO</p>
            <h1 className="mt-3 text-3xl font-bold text-cyan-50 md:text-4xl">Comisiones y Ganancias</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Monitorea el valor generado por tu red. Aqui puedes ver tus ingresos acumulados, lo que tienes pendiente por cobrar y tu historial de comisiones.
            </p>

            {/* KPIs */}
            <div className="mt-6 grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Acumulado Total</p>
                <p className="mt-2 text-xl font-bold text-cyan-50">Bs {totalAcumulado.toLocaleString("es-BO")}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Total del Mes</p>
                <p className="mt-2 text-xl font-bold text-cyan-50">Bs {totalMes.toLocaleString("es-BO")}</p>
              </article>
              <article className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-amber-200/65">Pendiente</p>
                <p className="mt-2 text-xl font-bold text-amber-50">Bs {totalPendiente.toLocaleString("es-BO")}</p>
              </article>
              <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-emerald-200/65">Pagado</p>
                <p className="mt-2 text-xl font-bold text-emerald-50">Bs {totalPagado.toLocaleString("es-BO")}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-cyan-200/65">Promedio x Negocio</p>
                <p className="mt-2 text-xl font-bold text-cyan-50">Bs {promedioPorNegocio.toLocaleString("es-BO", { maximumFractionDigits: 0 })}</p>
              </article>
            </div>

            {/* Grafico Mensual */}
            <div className="mt-8 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-6">
              <h3 className="text-sm font-semibold text-cyan-50 mb-4">Ingresos generados los ultimos meses</h3>
              <div className="flex items-end gap-6 h-40">
                {monthlyChartData.map((data, index) => {
                  const heightPercent = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                      <span className="text-xs text-cyan-100/60 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 rounded px-2 py-1">Bs {data.amount}</span>
                      <div className="w-full max-w-[60px] bg-[linear-gradient(180deg,rgba(34,211,238,0.8),rgba(6,182,212,0.2))] rounded-t-lg transition-all" style={{ height: `${heightPercent}%` }} />
                      <span className="text-xs font-semibold text-cyan-100/70">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

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
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>

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
    </div>
  );
}
