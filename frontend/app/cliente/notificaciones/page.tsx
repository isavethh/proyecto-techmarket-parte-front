"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPageHeader, ClientQuickLinksCard } from "../../components/ClientPageSections";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/api/clientApi";
import type { ApiNotification } from "@/lib/api/types";

const clientMenuItems = [
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Comunidades", href: "/cliente/comunidades" },
  { label: "Actividad reciente", href: "/cliente" },
];

export default function NotificacionesPage() {
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const updated = await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch {
      showToast("No se pudo marcar como leida");
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
      showToast("Todas marcadas como leidas");
    } catch {
      showToast("No se pudo marcar todas como leidas");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      showToast("No se pudo eliminar la notificacion");
    }
  };

  const unreadCount = notifications.filter((n) => !n.leido).length;

  return (
    <div className="flex-1 pb-10">
      <ClientPageHeader sectionLabel="Notificaciones" />

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
            <p className="tech-mono text-xs text-cyan-200/75">NOTIFICACIONES</p>
            <h3 className="mt-2 text-xl font-semibold text-cyan-50">Centro de avisos</h3>
            <p className="mt-3 text-sm leading-7 text-cyan-100/80">
              Mantente al dia con novedades, respuestas a chats, actualizaciones de ordenes y mas.
            </p>
          </section>

          <div className="space-y-4">
            <ClientQuickLinksCard
              links={[
                { href: "/cliente", label: "Volver al feed" },
                { href: "/cliente/ordenes", label: "Mis ordenes" },
                { href: "/cliente/chat", label: "Mis chats" },
              ]}
            />
          </div>
        </aside>

        <section className="chat-scrollbar space-y-4 overflow-y-auto pr-0 lg:pr-4" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <section className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(130deg,rgba(7,29,50,0.96),rgba(8,58,87,0.9),rgba(6,23,43,0.95))] p-5 shadow-xl shadow-slate-950/30 md:p-6">
            <p className="tech-mono text-xs text-cyan-200/80">GET /api/clients/notifications</p>
            <h1 className="mt-2 text-2xl font-semibold text-cyan-50 md:text-3xl">Notificaciones</h1>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-4 text-sm text-cyan-100/80">
                <span>{notifications.length} total</span>
                {unreadCount > 0 && (
                  <span className="text-cyan-300">{unreadCount} sin leer</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={markingAll}
                  className="rounded-xl border border-cyan-200/25 bg-cyan-300/15 px-4 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-300/22 disabled:opacity-50"
                >
                  {markingAll ? "Marcando..." : "Marcar todas como leidas"}
                </button>
              )}
            </div>
          </section>

          {loading ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">Cargando notificaciones...</p>
            </section>
          ) : error ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">
                No se pudo conectar con <span className="font-mono text-cyan-200">GET /api/clients/notifications</span>.
              </p>
            </section>
          ) : notifications.length === 0 ? (
            <section className="tech-card">
              <p className="text-sm text-cyan-100/80">No tienes notificaciones.</p>
            </section>
          ) : (
            <section className="space-y-2">
              {notifications.map((notif) => (
                <article
                  key={notif.id}
                  className={`flex items-center gap-4 rounded-3xl border p-4 transition ${
                    notif.leido
                      ? "border-cyan-100/10 bg-[linear-gradient(155deg,rgba(10,28,48,0.8),rgba(5,15,28,0.85))]"
                      : "border-cyan-300/25 bg-[linear-gradient(155deg,rgba(17,45,80,0.95),rgba(7,24,44,0.96))]"
                  } shadow-lg shadow-slate-950/20`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-100/15 bg-cyan-300/10 text-lg">
                    {notif.leido ? "🔔" : "🔔"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${notif.leido ? "text-cyan-100/70" : "text-cyan-50"}`}>
                      {notif.titulo}
                    </p>
                    {!notif.leido && (
                      <span className="mt-0.5 inline-block rounded-full border border-cyan-300/25 bg-cyan-300/12 px-2 py-0.5 text-[10px] font-semibold text-cyan-200">
                        Sin leer
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {notif.enlace && (
                      <Link
                        href={notif.enlace}
                        className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/80 transition hover:bg-white/10"
                      >
                        Ver
                      </Link>
                    )}
                    {!notif.leido && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notif.id)}
                        className="rounded-xl border border-cyan-100/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-100/80 transition hover:bg-white/10"
                      >
                        Leida
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notif.id)}
                      className="rounded-xl border border-red-400/20 bg-red-400/8 px-3 py-1.5 text-xs font-semibold text-red-300/70 transition hover:bg-red-400/15"
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
