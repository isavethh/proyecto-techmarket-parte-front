"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getSpecialistEarningsSummary,
  getSpecialistTransactions,
  getSpecialistWallet,
  loginTechMarket,
  requestSpecialistWithdrawal,
  type CreateSpecialistWithdrawalInput,
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
  commissions: "No disponible",
  paidServices: "0",
};

type BackendWallet = SpecialistWallet & {
  ingresosTotales?: number | string;
  enProceso?: number | string;
};

type BackendEarningsSummary = SpecialistEarningsSummary & {
  total?: number | string;
  serviciosRealizados?: number | string;
  promedioPorServicio?: number | string;
};

type UiEarningsSummary = SpecialistEarningsSummaryItem & {
  averagePerService: string;
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

export function mapBackendWalletToUiWallet(wallet: BackendWallet): SpecialistWalletItem {
  const currency = text(wallet.moneda ?? wallet.currency, "BOB");

  return {
    availableBalance: formatMoney(wallet.saldoDisponible ?? wallet.availableBalance, currency, emptyWallet.availableBalance),
    pendingBalance: formatMoney(wallet.enProceso ?? wallet.saldoPendiente ?? wallet.pendingBalance, currency, emptyWallet.pendingBalance),
    currency,
    withdrawMethod: text(wallet.metodoRetiro ?? wallet.withdrawMethod, "Metodo de retiro no configurado"),
    status: text(wallet.estado ?? wallet.status, "Activa"),
  };
}

export function mapBackendEarningsToUiEarnings(
  earnings: BackendEarningsSummary,
  wallet?: BackendWallet,
): UiEarningsSummary {
  return {
    totalEarnings: formatMoney(wallet?.ingresosTotales ?? earnings.ingresosTotales ?? earnings.totalEarnings, "BOB", emptyEarnings.totalEarnings),
    monthlyEarnings: formatMoney(earnings.total ?? earnings.ingresosMes ?? earnings.monthlyEarnings, "BOB", emptyEarnings.monthlyEarnings),
    pendingPayments: formatMoney(earnings.pagosPendientes ?? earnings.pendingPayments, "BOB", emptyEarnings.pendingPayments),
    commissions: formatMoney(earnings.comisiones ?? earnings.commissions, "BOB", emptyEarnings.commissions),
    paidServices: formatCount(earnings.serviciosRealizados ?? earnings.serviciosPagados ?? earnings.paidServices, emptyEarnings.paidServices),
    averagePerService: formatMoney(earnings.promedioPorServicio, "BOB", "No disponible"),
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
    commission: formatMoney(transaction.comision ?? transaction.commission, currency, "No disponible"),
    status: text(transaction.estado ?? transaction.status, "Pendiente"),
    type: text(transaction.tipo ?? transaction.type, "Movimiento"),
    date: text(transaction.fecha ?? transaction.date ?? transaction.createdAt, "Fecha no disponible"),
  };
}

export function useSpecialistPaymentsData() {
  const [wallet, setWallet] = useState<SpecialistWalletItem>(emptyWallet);
  const [earnings, setEarnings] = useState<UiEarningsSummary>({ ...emptyEarnings, averagePerService: "No disponible" });
  const [transactions, setTransactions] = useState<SpecialistTransactionItem[]>([]);
  const [auth, setAuth] = useState<{ token: string; userId: string } | null>(null);
  const [walletSource, setWalletSource] = useState<DatasetSource>("empty");
  const [earningsSource, setEarningsSource] = useState<DatasetSource>("empty");
  const [transactionsSource, setTransactionsSource] = useState<DatasetSource>("empty");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const refreshPaymentsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentAuth = auth ?? (await loginTechMarket().then((login) => ({ token: login.accessToken, userId: login.userId })));
      const [walletResult, earningsResult, transactionsResult] = await Promise.allSettled([
        getSpecialistWallet(currentAuth.token, currentAuth.userId),
        getSpecialistEarningsSummary(currentAuth.token, currentAuth.userId),
        getSpecialistTransactions(currentAuth.token, currentAuth.userId),
      ]);

      debugSpecialistResult("[specialist wallet]", walletResult);
      debugSpecialistResult("[specialist earnings]", earningsResult);
      debugSpecialistResult("[specialist transactions]", transactionsResult);

      setAuth(currentAuth);

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
        const backendWallet = walletResult.status === "fulfilled" ? walletResult.value : undefined;
        setEarnings(hasEarnings ? mapBackendEarningsToUiEarnings(earningsResult.value, backendWallet) : { ...emptyEarnings, averagePerService: "No disponible" });
        setEarningsSource(hasEarnings ? "backend" : "empty");
      } else {
        setEarnings({ ...specialistEarningsSummary, averagePerService: "No disponible" });
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
      setError(err instanceof Error ? err.message : "Error desconocido al cargar pagos e ingresos");
      setWallet(specialistWallet);
      setEarnings({ ...specialistEarningsSummary, averagePerService: "No disponible" });
      setTransactions(specialistTransactions);
      setWalletSource("fallback");
      setEarningsSource("fallback");
      setTransactionsSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    let isMounted = true;

    async function loadPaymentsData() {
      if (isMounted) {
        await refreshPaymentsData();
      }
    }

    loadPaymentsData();

    return () => {
      isMounted = false;
    };
  }, [refreshPaymentsData]);

  const requestWithdrawal = useCallback(
    async (input: CreateSpecialistWithdrawalInput) => {
      const currentAuth = auth;

      if (!currentAuth?.token || !currentAuth.userId) {
        setActionError("No hay sesion activa para solicitar el retiro.");
        return;
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        const response = await requestSpecialistWithdrawal(currentAuth.token, currentAuth.userId, input);
        await refreshPaymentsData();
        setActionSuccess(response.mensaje ?? "Retiro solicitado correctamente.");
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo solicitar el retiro.");
      } finally {
        setActionLoading(false);
      }
    },
    [auth, refreshPaymentsData],
  );

  return useMemo(
    () => ({
      wallet,
      earnings,
      transactions,
      walletSource,
      earningsSource,
      transactionsSource,
      loading,
      actionLoading,
      error,
      actionError,
      actionSuccess,
      requestWithdrawal,
      refreshPaymentsData,
    }),
    [
      wallet,
      earnings,
      transactions,
      walletSource,
      earningsSource,
      transactionsSource,
      loading,
      actionLoading,
      error,
      actionError,
      actionSuccess,
      requestWithdrawal,
      refreshPaymentsData,
    ],
  );
}
