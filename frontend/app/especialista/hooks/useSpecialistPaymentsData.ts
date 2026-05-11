"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSpecialistEarningsSummary,
  getSpecialistTransactions,
  getSpecialistWallet,
  loginTechMarket,
  type SpecialistEarningsSummary,
  type SpecialistTransaction,
  type SpecialistWallet,
} from "@/lib/api/specialists";
import {
  specialistEarningsSummary,
  specialistTransactions,
  specialistWallet,
  type SpecialistEarningsSummaryItem,
  type SpecialistTransactionItem,
  type SpecialistWalletItem,
} from "../specialistData";

type BackendListResponse<T> = {
  value?: T[];
  data?: T[];
  Count?: number;
};

function normalizeList<T>(response: T[] | BackendListResponse<T>) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.value ?? response.data ?? [];
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function formatMoney(value: unknown, currency = "BOB", fallback = "Bs 0") {
  if (typeof value === "number") {
    return `${currency === "BOB" ? "Bs" : currency} ${value.toLocaleString("es-BO")}`;
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return fallback;
}

function formatCount(value: unknown, fallback = "0") {
  if (typeof value === "number") {
    return String(value);
  }

  return text(value, fallback);
}

export function mapBackendWalletToUiWallet(wallet: SpecialistWallet): SpecialistWalletItem {
  const currency = text(wallet.moneda ?? wallet.currency, "BOB");

  return {
    availableBalance: formatMoney(wallet.saldoDisponible ?? wallet.availableBalance, currency, specialistWallet.availableBalance),
    pendingBalance: formatMoney(wallet.saldoPendiente ?? wallet.pendingBalance, currency, specialistWallet.pendingBalance),
    currency,
    withdrawMethod: text(wallet.metodoRetiro ?? wallet.withdrawMethod, "Metodo de retiro no configurado"),
    status: text(wallet.estado ?? wallet.status, "Activa"),
  };
}

export function mapBackendEarningsToUiEarnings(earnings: SpecialistEarningsSummary): SpecialistEarningsSummaryItem {
  return {
    totalEarnings: formatMoney(earnings.ingresosTotales ?? earnings.totalEarnings, "BOB", specialistEarningsSummary.totalEarnings),
    monthlyEarnings: formatMoney(earnings.ingresosMes ?? earnings.monthlyEarnings, "BOB", specialistEarningsSummary.monthlyEarnings),
    pendingPayments: formatMoney(earnings.pagosPendientes ?? earnings.pendingPayments, "BOB", specialistEarningsSummary.pendingPayments),
    commissions: formatMoney(earnings.comisiones ?? earnings.commissions, "BOB", specialistEarningsSummary.commissions),
    paidServices: formatCount(earnings.serviciosPagados ?? earnings.paidServices, specialistEarningsSummary.paidServices),
  };
}

export function mapBackendTransactionToUiTransaction(
  transaction: SpecialistTransaction,
  index: number,
): SpecialistTransactionItem {
  const currency = text(transaction.moneda ?? transaction.currency, "BOB");
  const project = transaction.proyecto ?? transaction.project ?? transaction.servicio ?? transaction.service;

  return {
    id: text(transaction.id ?? transaction.transactionId, `transaction-${index}`),
    customer: text(transaction.cliente ?? transaction.customer ?? transaction.clientName, "Cliente no especificado"),
    project: text(project, "Proyecto o servicio no especificado"),
    amount: formatMoney(transaction.monto ?? transaction.amount, currency, "Bs 0"),
    commission: formatMoney(transaction.comision ?? transaction.commission, currency, "Bs 0"),
    status: text(transaction.estado ?? transaction.status, "Pendiente"),
    type: text(transaction.tipo ?? transaction.type, "Movimiento"),
    date: text(transaction.fecha ?? transaction.date ?? transaction.createdAt, "Fecha no disponible"),
  };
}

export function useSpecialistPaymentsData() {
  const [wallet, setWallet] = useState<SpecialistWalletItem>(specialistWallet);
  const [earnings, setEarnings] = useState<SpecialistEarningsSummaryItem>(specialistEarningsSummary);
  const [transactions, setTransactions] = useState<SpecialistTransactionItem[]>(specialistTransactions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentsData() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const [walletResponse, earningsResponse, transactionsResponse] = await Promise.all([
          getSpecialistWallet(login.accessToken, login.userId),
          getSpecialistEarningsSummary(login.accessToken, login.userId),
          getSpecialistTransactions(login.accessToken, login.userId),
        ]);

        if (!isMounted) {
          return;
        }

        const backendTransactions = normalizeList(transactionsResponse);

        setWallet(walletResponse ? mapBackendWalletToUiWallet(walletResponse) : specialistWallet);
        setEarnings(earningsResponse ? mapBackendEarningsToUiEarnings(earningsResponse) : specialistEarningsSummary);
        setTransactions(
          backendTransactions.length > 0
            ? backendTransactions.map(mapBackendTransactionToUiTransaction)
            : specialistTransactions,
        );
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar pagos e ingresos");
        setWallet(specialistWallet);
        setEarnings(specialistEarningsSummary);
        setTransactions(specialistTransactions);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPaymentsData();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () => ({ wallet, earnings, transactions, loading, error }),
    [wallet, earnings, transactions, loading, error],
  );
}
