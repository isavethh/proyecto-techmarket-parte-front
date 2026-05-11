"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/api/clientApi";
import type { ApiAddress } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

const EMPTY_FORM = { titulo: "", pais: "Bolivia", ciudad: "", direccion: "", referencia: "" };

type FormData = typeof EMPTY_FORM;

function AddressForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const set = (key: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const valid = form.titulo.trim().length >= 2 && form.ciudad.trim().length >= 2 && form.direccion.trim().length >= 4;

  return (
    <div className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(9,30,53,0.98),rgba(5,18,35,0.98))] p-5 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="addr-titulo">Titulo (ej: Casa, Oficina)</label>
          <input id="addr-titulo" value={form.titulo} onChange={(e) => set("titulo", e.target.value)} className="auth-input mt-1" placeholder="Casa" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="addr-pais">Pais</label>
          <input id="addr-pais" value={form.pais} onChange={(e) => set("pais", e.target.value)} className="auth-input mt-1" placeholder="Bolivia" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="addr-ciudad">Ciudad</label>
          <input id="addr-ciudad" value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} className="auth-input mt-1" placeholder="Santa Cruz" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="addr-referencia">Referencia</label>
          <input id="addr-referencia" value={form.referencia} onChange={(e) => set("referencia", e.target.value)} className="auth-input mt-1" placeholder="Cerca del parque" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-cyan-200/80" htmlFor="addr-direccion">Direccion</label>
          <input id="addr-direccion" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} className="auth-input mt-1" placeholder="Av. San Martin #123, 3er anillo" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80 hover:bg-white/10">
          Cancelar
        </button>
        <button
          type="button"
          disabled={!valid || saving}
          onClick={() => onSave(form)}
          className="rounded-xl border border-cyan-200/25 bg-cyan-300/18 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}

export default function DireccionesPage() {
  const pathname = usePathname();

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getAddresses()
      .then(setAddresses)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data: FormData) => {
    setSaving(true);
    try {
      const created = await createAddress({ ...data, esPredeterminada: false });
      setAddresses((prev) => [...prev, created]);
      setShowCreateForm(false);
      showToast("Direccion creada");
    } catch {
      showToast("No se pudo crear la direccion");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: FormData) => {
    setSaving(true);
    try {
      const updated = await updateAddress(id, data);
      setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setEditingId(null);
      showToast("Direccion actualizada");
    } catch {
      showToast("No se pudo actualizar la direccion");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Eliminar esta direccion?")) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast("Direccion eliminada");
    } catch {
      showToast("No se pudo eliminar la direccion");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, esPredeterminada: a.id === id })),
      );
      showToast("Direccion predeterminada actualizada");
    } catch {
      showToast("No se pudo actualizar la direccion predeterminada");
    }
  };

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Direcciones" />

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
            <p className="tech-mono text-xs text-cyan-200/75">DIRECCIONES</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Mis direcciones de envio</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Gestiona tus direcciones para agilizar el proceso de compra y entrega de pedidos.
            </p>
          </section>

          <div className="space-y-4">
            <ClientQuickLinksCard
              links={[
                { href: "/cliente/carrito", label: "Mi carrito" },
                { href: "/cliente/ordenes", label: "Mis ordenes" },
                { href: "/cliente", label: "Volver al feed" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(130deg,rgba(7,29,50,0.96),rgba(8,58,87,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/30 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">GET /api/clients/addresses</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">Mis direcciones</h1>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-cyan-100/80">{addresses.length} direccion{addresses.length !== 1 ? "es" : ""} guardada{addresses.length !== 1 ? "s" : ""}</p>
              <button
                type="button"
                onClick={() => { setShowCreateForm(true); setEditingId(null); }}
                className="rounded-xl border border-cyan-200/25 bg-cyan-300/18 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/25"
              >
                + Nueva direccion
              </button>
            </div>
          </section>

          {showCreateForm && (
            <AddressForm
              initial={EMPTY_FORM}
              onSave={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              saving={saving}
            />
          )}

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando direcciones...</p>
            </section>
          ) : error ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con <span className="font-mono text-cyan-200">GET /api/clients/addresses</span>.
              </p>
            </section>
          ) : addresses.length === 0 && !showCreateForm ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">No tienes direcciones guardadas. Agrega una para facilitar tus compras.</p>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <article key={addr.id}>
                  {editingId === addr.id ? (
                    <AddressForm
                      initial={{ titulo: addr.titulo, pais: addr.pais, ciudad: addr.ciudad, direccion: addr.direccion, referencia: addr.referencia }}
                      onSave={(data) => handleUpdate(addr.id, data)}
                      onCancel={() => setEditingId(null)}
                      saving={saving}
                    />
                  ) : (
                    <div className="rounded-3xl border border-cyan-100/15 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))] p-5 shadow-xl shadow-slate-950/25">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-base font-semibold text-cyan-50">{addr.titulo}</p>
                            {addr.esPredeterminada && (
                              <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-100">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-cyan-100/80">{addr.direccion}</p>
                          <p className="mt-0.5 text-xs text-cyan-200/65">{addr.ciudad}, {addr.pais}</p>
                          {addr.referencia && (
                            <p className="mt-0.5 text-xs text-cyan-200/55">{addr.referencia}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {!addr.esPredeterminada && (
                          <button
                            type="button"
                            onClick={() => handleSetDefault(addr.id)}
                            className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/80 transition hover:bg-white/10"
                          >
                            Predeterminar
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => { setEditingId(addr.id); setShowCreateForm(false); }}
                          className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/80 transition hover:bg-white/10"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(addr.id)}
                          className="rounded-xl border border-red-400/20 bg-red-400/8 px-3 py-1.5 text-xs font-semibold text-red-300/80 transition hover:bg-red-400/15"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
