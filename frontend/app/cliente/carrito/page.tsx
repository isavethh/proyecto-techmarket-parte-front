"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getAddresses,
  checkout,
} from "@/lib/api/clientApi";
import type { ApiCart, ApiAddress } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

const PAYMENT_METHODS = [
  { value: "efectivo", label: "Efectivo en entrega" },
  { value: "transferencia", label: "Transferencia bancaria" },
  { value: "qr", label: "Pago QR" },
];

export default function CarritoPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [cart, setCart] = useState<ApiCart | null>(null);
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("efectivo");
  const [checkingOut, setCheckingOut] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    Promise.all([getCart(), getAddresses()])
      .then(([cartData, addrData]) => {
        setCart(cartData);
        setAddresses(addrData);
        const defaultAddr = addrData.find((a) => a.esPredeterminada);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (addrData.length > 0) setSelectedAddressId(addrData[0].id);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateQuantity = async (itemId: string, cantidad: number) => {
    if (cantidad < 1) return;
    try {
      const updated = await updateCartItem(itemId, cantidad);
      setCart(updated);
    } catch {
      showToast("No se pudo actualizar la cantidad");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const updated = await removeCartItem(itemId);
      setCart(updated);
      showToast("Producto eliminado del carrito");
    } catch {
      showToast("No se pudo eliminar el producto");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Vaciar todo el carrito?")) return;
    try {
      await clearCart();
      setCart((prev) => prev ? { ...prev, items: [], subtotal: 0 } : null);
      showToast("Carrito vaciado");
    } catch {
      showToast("No se pudo vaciar el carrito");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      showToast("Selecciona una direccion de envio");
      return;
    }
    setCheckingOut(true);
    try {
      const result = await checkout(selectedAddressId, selectedPayment);
      showToast(`Orden creada: ${result.ordenId}`);
      setCart((prev) => prev ? { ...prev, items: [], subtotal: 0 } : null);
      setTimeout(() => router.push("/cliente/ordenes"), 1500);
    } catch {
      showToast("No se pudo completar el checkout");
    } finally {
      setCheckingOut(false);
    }
  };

  const itemCount = cart?.items.length ?? 0;

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Carrito" />

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
            <p className="tech-mono text-xs text-cyan-200/75">CARRITO</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Resumen de compra</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Revisa los productos seleccionados, ajusta cantidades y completa tu pedido.
            </p>
          </section>

          <div className="space-y-4">
            <ClientQuickLinksCard
              links={[
                { href: "/cliente/marketplace", label: "Seguir comprando" },
                { href: "/cliente/ordenes", label: "Mis ordenes" },
                { href: "/cliente/direcciones", label: "Mis direcciones" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(130deg,rgba(7,29,50,0.96),rgba(8,58,87,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/30 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">GET /api/clients/cart</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">Mi carrito</h1>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Productos</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">{itemCount}</p>
              </div>
              <div className="rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">Subtotal</p>
                <p className="mt-2 text-xl font-semibold text-cyan-50">
                  Bs. {(cart?.subtotal ?? 0).toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center rounded-2xl border border-cyan-100/15 bg-slate-950/35 p-3">
                {itemCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs font-semibold text-red-300/75 transition hover:text-red-300"
                  >
                    Vaciar carrito
                  </button>
                )}
              </div>
            </div>
          </section>

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando carrito...</p>
            </section>
          ) : error ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con <span className="font-mono text-cyan-200">GET /api/clients/cart</span>.
              </p>
            </section>
          ) : itemCount === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Tu carrito esta vacio.</p>
              <Link href="/cliente/marketplace" className="mt-3 inline-block rounded-xl border border-cyan-200/25 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/22">
                Explorar productos
              </Link>
            </section>
          ) : (
            <>
              <section className="space-y-3">
                {cart!.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-cyan-200/50">{item.productoId}</p>
                      <p className="mt-1 text-sm font-semibold text-cyan-50">
                        Bs. {item.precioUnitario.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} c/u
                      </p>
                      <p className="text-xs text-cyan-200/65">
                        Subtotal: Bs. {(item.precioUnitario * item.cantidad).toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-100/15 bg-white/5 text-cyan-50 transition hover:bg-white/10"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-cyan-50">{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-100/15 bg-white/5 text-cyan-50 transition hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="rounded-xl border border-red-400/20 bg-red-400/8 px-3 py-1.5 text-xs font-semibold text-red-300/80 transition hover:bg-red-400/15"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </section>

              <section className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-5 shadow-xl">
                <p className="tech-mono text-xs text-cyan-200/75">CHECKOUT</p>
                <h2 className="mt-2 text-xl font-semibold text-cyan-50">Completar pedido</h2>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="cart-address">
                      Direccion de envio
                    </label>
                    {addresses.length === 0 ? (
                      <p className="mt-2 text-sm text-cyan-100/75">
                        No tienes direcciones.{" "}
                        <Link href="/cliente/direcciones" className="text-cyan-300 hover:underline">
                          Agrega una
                        </Link>
                      </p>
                    ) : (
                      <select
                        id="cart-address"
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="auth-select mt-1"
                      >
                        {addresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.titulo} — {addr.ciudad}, {addr.direccion}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="cart-payment">
                      Metodo de pago
                    </label>
                    <select
                      id="cart-payment"
                      value={selectedPayment}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="auth-select mt-1"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cyan-200/80">Total a pagar</span>
                      <span className="text-xl font-bold text-cyan-50">
                        Bs. {(cart!.subtotal).toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkingOut || !selectedAddressId}
                    className="w-full rounded-2xl border border-cyan-200/25 bg-cyan-400/20 py-3 text-sm font-bold text-cyan-50 transition hover:bg-cyan-300/28 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {checkingOut ? "Procesando..." : "Confirmar pedido"}
                  </button>
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
