"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import { getOrders, getOrder, cancelOrder } from "@/lib/api/clientApi";
import type { ApiOrder, ApiOrderDetail } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  procesando: "Procesando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pendiente: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  procesando: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  enviado: "border-blue-300/30 bg-blue-300/10 text-blue-200",
  entregado: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  cancelado: "border-red-400/30 bg-red-400/10 text-red-300",
};

export default function OrdenesPage() {
  const pathname = usePathname();

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ApiOrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleExpand = async (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      setDetail(null);
      return;
    }
    setExpandedId(orderId);
    setDetail(null);
    setLoadingDetail(true);
    try {
      const d = await getOrder(orderId);
      setDetail(d);
    } catch {
      showToast("No se pudo cargar el detalle de la orden");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    const motivo = window.prompt("Motivo de cancelacion (opcional):");
    if (motivo === null) return;
    setCancelingId(orderId);
    try {
      await cancelOrder(orderId, motivo);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, estado: "cancelado" } : o)),
      );
      if (expandedId === orderId) setDetail(null);
      showToast("Orden cancelada");
    } catch {
      showToast("No se pudo cancelar la orden");
    } finally {
      setCancelingId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Mis ordenes" />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-cyan-100/20 bg-slate-900/95 px-5 py-3 text-sm font-semibold text-cyan-50 shadow-xl backdrop-blur">
          {toast}
        </div>
      )}

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2">
          <section className="tech-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                CM
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Tu panel</p>
                <p className="text-xs text-cyan-100/75">Cliente activo en TechMarket</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {clientMenuItems.map((item) => {
                const isActive =
                  item.href === "/cliente"
                    ? pathname === "/cliente"
                    : pathname.startsWith(item.href);
                return (
                  <Link key={item.label} href={item.href} className={`auth-action ${isActive ? "active" : ""}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="tech-card mt-4">
            <p className="tech-mono text-xs text-cyan-200/75">ORDENES</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Historial de pedidos</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Revisa el estado de tus compras, trackea envios y gestiona cancelaciones.
            </p>
          </section>

          <div className="space-y-4">
            <ClientQuickLinksCard
              links={[
                { href: "/cliente/carrito", label: "Mi carrito" },
                { href: "/cliente/marketplace", label: "Seguir comprando" },
                { href: "/cliente", label: "Volver al feed" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(130deg,rgba(7,29,50,0.96),rgba(8,58,87,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/30 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">GET /api/clients/orders</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">Mis ordenes</h1>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Total ordenes</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{orders.length}</p>
              </div>
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Activas</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">
                  {orders.filter((o) => o.estado !== "cancelado" && o.estado !== "entregado").length}
                </p>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando ordenes...</p>
            </section>
          ) : error ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con <span className="font-mono text-cyan-200">GET /api/clients/orders</span>.
              </p>
            </section>
          ) : orders.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">No tienes ordenes aun.</p>
              <Link href="/cliente/marketplace" className="mt-3 inline-block rounded-xl border border-cyan-200/25 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/22">
                Explorar productos
              </Link>
            </section>
          ) : (
            <section className="space-y-3">
              {orders.map((order) => {
                const statusKey = order.estado?.toLowerCase() ?? "";
                const statusLabel = STATUS_LABELS[statusKey] ?? order.estado;
                const statusColor = STATUS_COLORS[statusKey] ?? "border-cyan-100/20 bg-white/5 text-cyan-100";
                const isExpanded = expandedId === order.id;
                const isCancellable = statusKey === "pendiente" || statusKey === "procesando";

                return (
                  <article key={order.id} className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] shadow-xl shadow-slate-950/25">
                    <div className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[11px] text-cyan-200/55">{order.id}</p>
                          <p className="mt-1 text-sm text-cyan-100/80">{formatDate(order.fechaCreacion)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}>
                            {statusLabel}
                          </span>
                          <span className="text-base font-bold text-cyan-50">
                            Bs. {order.total.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleExpand(order.id)}
                          className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-3 py-1.5 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                        >
                          {isExpanded ? "Ocultar detalle" : "Ver detalle"}
                        </button>
                        {isCancellable && (
                          <button
                            type="button"
                            onClick={() => handleCancel(order.id)}
                            disabled={cancelingId === order.id}
                            className="rounded-xl border border-red-400/20 bg-red-400/8 px-3 py-1.5 text-xs font-semibold text-red-300/80 transition hover:bg-red-400/15 disabled:opacity-50"
                          >
                            {cancelingId === order.id ? "Cancelando..." : "Cancelar"}
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-cyan-100/10 bg-slate-950/30 p-4">
                        {loadingDetail && !detail ? (
                          <p className="text-sm text-cyan-100/75">Cargando detalle...</p>
                        ) : detail && detail.id === order.id ? (
                          <div className="space-y-3">
                            {detail.tracking?.codigo && (
                              <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-3 text-sm">
                                <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">Tracking</p>
                                <p className="mt-1 font-mono text-cyan-50">{detail.tracking.codigo}</p>
                                <p className="text-xs text-cyan-200/60">via {detail.tracking.empresa}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/65">Items</p>
                              <div className="mt-2 space-y-1">
                                {detail.items.map((it, i) => (
                                  <div key={i} className="flex justify-between text-sm text-cyan-100/80">
                                    <span className="font-mono text-[11px]">{it.productoId}</span>
                                    <span>x{it.cantidad}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
