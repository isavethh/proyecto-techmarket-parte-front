"use client";

import { FormEvent, useState } from "react";
import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistPaymentsData } from "../hooks/useSpecialistPaymentsData";

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("pag") || normalized.includes("proces")) {
    return "border-emerald-300/35 bg-emerald-400/10 text-emerald-100";
  }

  if (normalized.includes("pend")) {
    return "border-amber-300/35 bg-amber-300/10 text-amber-100";
  }

  return "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
}

function parseMoneyAmount(value: string) {
  const normalized = value.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const amount = Number(normalized);

  return Number.isFinite(amount) ? amount : undefined;
}

export default function EspecialistaPagosPage() {
  const { wallet, earnings, transactions, actionError, actionLoading, actionSuccess, requestWithdrawal } = useSpecialistPaymentsData();
  const [isWithdrawalFormOpen, setIsWithdrawalFormOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const availableBalance = parseMoneyAmount(wallet.availableBalance);

  function closeWithdrawalModal() {
    if (actionLoading) {
      return;
    }

    setIsWithdrawalFormOpen(false);
    setWithdrawalAmount("");
    setFormError(null);
  }

  async function handleRequestWithdrawal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedAmount = withdrawalAmount.trim();
    const monto = parseMoneyAmount(trimmedAmount);

    if (!trimmedAmount) {
      setFormError("Ingresa un monto para solicitar el retiro.");
      return;
    }

    if (monto === undefined) {
      setFormError("Ingresa un monto numerico valido.");
      return;
    }

    if (monto <= 0) {
      setFormError("El monto debe ser mayor a 0.");
      return;
    }

    if (availableBalance !== undefined && monto > availableBalance) {
      setFormError("El monto no puede superar el saldo disponible.");
      return;
    }

    setFormError(null);

    try {
      await requestWithdrawal({ monto });
      setWithdrawalAmount("");
      setIsWithdrawalFormOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo solicitar el retiro.");
    }
  }

  return (
    <SpecialistShell sectionLabel="Pagos e ingresos" statusMessage="Billetera e ingresos del especialista">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="tech-mono text-xs text-cyan-200/75">PAGOS E INGRESOS</p>
            <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Billetera del especialista</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
              Consulta saldos, ingresos acumulados, pagos pendientes y transacciones asociadas a servicios tecnicos.
            </p>
          </div>

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => {
              setIsWithdrawalFormOpen(true);
              setFormError(null);
            }}
            className="self-start rounded-full border border-cyan-300/35 bg-cyan-300/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Solicitar retiro
          </button>
        </div>
      </section>

      {actionSuccess ? (
        <p className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {actionSuccess}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Saldo disponible</p>
          <p className="mt-3 text-4xl font-bold text-white">{wallet.availableBalance}</p>
          <p className="mt-2 text-sm text-cyan-100/75">Moneda: {wallet.currency}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">En proceso</p>
              <p className="mt-2 text-xl font-bold text-cyan-50">{wallet.pendingBalance}</p>
            </article>
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Metodo retiro</p>
              <p className="mt-2 text-sm font-semibold text-cyan-50">{wallet.withdrawMethod}</p>
            </article>
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Estado</p>
              <p className="mt-2 text-sm font-semibold text-emerald-100">{wallet.status}</p>
            </article>
          </div>
        </article>

        <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Resumen</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Ingresos acumulados</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
              <span className="text-sm text-cyan-100/75">Total ingresos</span>
              <strong className="text-cyan-50">{earnings.totalEarnings}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
              <span className="text-sm text-cyan-100/75">Ingresos del mes</span>
              <strong className="text-cyan-50">{earnings.monthlyEarnings}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
              <span className="text-sm text-cyan-100/75">Servicios pagados</span>
              <strong className="text-cyan-50">{earnings.paidServices}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
              <span className="text-sm text-cyan-100/75">Promedio por servicio</span>
              <strong className="text-cyan-50">{earnings.averagePerService}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">En proceso</p>
          <p className="mt-2 text-2xl font-bold text-white">{wallet.pendingBalance}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Comisiones</p>
          <p className="mt-2 text-2xl font-bold text-white">{earnings.commissions}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Transacciones</p>
          <p className="mt-2 text-2xl font-bold text-white">{transactions.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modo</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Conectado</p>
          <p className="mt-1 text-xs text-cyan-100/70">Retiro real habilitado</p>
        </article>
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <h2 className="text-2xl font-bold text-white">Transacciones recientes</h2>
        <p className="mt-2 text-sm leading-6 text-cyan-100/75">
          Movimientos asociados a clientes, proyectos, comisiones y estados de pago.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {transactions.length === 0 ? (
            <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5 text-sm text-cyan-100/75 lg:col-span-2">
              No hay transacciones registradas todavía.
            </article>
          ) : null}
          {transactions.map((transaction) => (
            <article key={transaction.id} className="rounded-3xl border border-cyan-100/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">{transaction.type}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{transaction.project}</h3>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Cliente</p>
                  <p className="mt-2 text-sm text-cyan-100/85">{transaction.customer}</p>
                </article>
                <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Fecha</p>
                  <p className="mt-2 text-sm text-cyan-100/85">{transaction.date}</p>
                </article>
                <article className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/75">Monto</p>
                  <p className="mt-2 text-lg font-bold text-emerald-50">{transaction.amount}</p>
                </article>
                <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Comision</p>
                  <p className="mt-2 text-sm text-cyan-100/85">{transaction.commission}</p>
                </article>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isWithdrawalFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm" onClick={(event) => event.target === event.currentTarget && closeWithdrawalModal()}>
          <section className="w-full max-w-xl rounded-3xl border border-cyan-100/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">RETIRO</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Solicitar retiro</h2>
              </div>
              <button
                type="button"
                onClick={closeWithdrawalModal}
                disabled={actionLoading}
                className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Saldo disponible actual</p>
              <p className="mt-2 text-2xl font-bold text-cyan-50">{wallet.availableBalance}</p>
            </div>

            {wallet.withdrawMethod.toLowerCase().includes("no") || wallet.withdrawMethod.toLowerCase().includes("pend") ? (
              <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">
                Método de retiro pendiente de configuración. La solicitud será registrada para revisión.
              </p>
            ) : null}

            <form onSubmit={handleRequestWithdrawal} className="mt-5 space-y-4">
              <label className="space-y-2 text-sm text-cyan-100/85">
                <span>Monto a retirar</span>
                <input
                  value={withdrawalAmount}
                  onChange={(event) => setWithdrawalAmount(event.target.value)}
                  placeholder="Ej. Bs 100"
                  disabled={actionLoading}
                  inputMode="decimal"
                  className="w-full rounded-2xl border border-cyan-100/10 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                />
              </label>

              {formError || actionError ? (
                <p className="rounded-2xl border border-rose-300/25 bg-rose-400/10 p-3 text-sm text-rose-100">{formError ?? actionError}</p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-3 border-t border-cyan-100/10 pt-4">
                <button
                  type="button"
                  onClick={closeWithdrawalModal}
                  disabled={actionLoading}
                  className="rounded-full border border-cyan-100/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !withdrawalAmount.trim()}
                  className="rounded-full border border-cyan-300/35 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? "Solicitando..." : "Solicitar retiro"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </SpecialistShell>
  );
}
