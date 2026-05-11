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
import { debugSpecialistResult, getDatasetSource, normalizeBackendList, type DatasetSource } from "./specialistBackendHelpers";

const emptyWallet: SpecialistWalletItem = {
  availableBalance: "Bs 0",
  pendingBalance: "Bs 0",
  currency: "BOB",
  withdrawMethod: "No especificado",
  status: "Pendiente",
};

const emptyEarnings: SpecialistEarningsSummaryItem = {
  totalEarnings: "Bs 0",
  monthlyEarnings: "Bs 0",
  pendingPayments: "Bs 0",
  commissions: "Bs 0",
  paidServices: "0",
};

function hasObjectData(value: unknown) {
  return Boolean(value && typeof value === "object" && Object.values(value).some(Boolean));
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
    availableBalance: formatMoney(wallet.saldoDisponible ?? wallet.availableBalance, currency, emptyWallet.availableBalance),
    pendingBalance: formatMoney(wallet.saldoPendiente ?? wallet.pendingBalance, currency, emptyWallet.pendingBalance),
    currency,
    withdrawMethod: text(wallet.metodoRetiro ?? wallet.withdrawMethod, "Metodo de retiro no configurado"),
    status: text(wallet.estado ?? wallet.status, "Activa"),
  };
}

export function mapBackendEarningsToUiEarnings(earnings: SpecialistEarningsSummary): SpecialistEarningsSummaryItem {
  return {
    totalEarnings: formatMoney(earnings.ingresosTotales ?? earnings.totalEarnings, "BOB", emptyEarnings.totalEarnings),
    monthlyEarnings: formatMoney(earnings.ingresosMes ?? earnings.monthlyEarnings, "BOB", emptyEarnings.monthlyEarnings),
    pendingPayments: formatMoney(earnings.pagosPendientes ?? earnings.pendingPayments, "BOB", emptyEarnings.pendingPayments),
    commissions: formatMoney(earnings.comisiones ?? earnings.commissions, "BOB", emptyEarnings.commissions),
    paidServices: formatCount(earnings.serviciosPagados ?? earnings.paidServices, emptyEarnings.paidServices),
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
  const [wallet, setWallet] = useState<SpecialistWalletItem>(emptyWallet);
  const [earnings, setEarnings] = useState<SpecialistEarningsSummaryItem>(emptyEarnings);
  const [transactions, setTransactions] = useState<SpecialistTransactionItem[]>([]);
  const [walletSource, setWalletSource] = useState<DatasetSource>("empty");
  const [earningsSource, setEarningsSource] = useState<DatasetSource>("empty");
  const [transactionsSource, setTransactionsSource] = useState<DatasetSource>("empty");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentsData() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const [walletResult, earningsResult, transactionsResult] = await Promise.allSettled([
          getSpecialistWallet(login.accessToken, login.userId),
          getSpecialistEarningsSummary(login.accessToken, login.userId),
          getSpecialistTransactions(login.accessToken, login.userId),
        ]);

        if (!isMounted) {
          return;
        }

        debugSpecialistResult("[specialist wallet]", walletResult);
        debugSpecialistResult("[specialist earnings]", earningsResult);
        debugSpecialistResult("[specialist transactions]", transactionsResult);

        if (walletResult.status === "fulfilled") {
          const hasWallet = hasObjectData(walletResult.value);
          setWallet(hasWallet ? mapBackendWalletToUiWallet(walletResult.value) : emptyWallet);
          setWalletSource(hasWallet ? "backend" : "empty");
        } else {
          setWallet(specialistWallet);
          setWalletSource("fallback");
        }

        if (earningsResult.status === "fulfilled") {
          const hasEarnings = hasObjectData(earningsResult.value);
          setEarnings(hasEarnings ? mapBackendEarningsToUiEarnings(earningsResult.value) : emptyEarnings);
          setEarningsSource(hasEarnings ? "backend" : "empty");
        } else {
          setEarnings(specialistEarningsSummary);
          setEarningsSource("fallback");
        }

        if (transactionsResult.status === "fulfilled") {
          const backendTransactions = normalizeBackendList<SpecialistTransaction>(transactionsResult.value);
          setTransactions(backendTransactions.map(mapBackendTransactionToUiTransaction));
          setTransactionsSource(getDatasetSource(backendTransactions));
        } else {
          setTransactions(specialistTransactions);
          setTransactionsSource("fallback");
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar pagos e ingresos");
        setWallet(specialistWallet);
        setEarnings(specialistEarningsSummary);
        setTransactions(specialistTransactions);
        setWalletSource("fallback");
        setEarningsSource("fallback");
        setTransactionsSource("fallback");
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
    () => ({ wallet, earnings, transactions, walletSource, earningsSource, transactionsSource, loading, error }),
    [wallet, earnings, transactions, walletSource, earningsSource, transactionsSource, loading, error],
  );
}
