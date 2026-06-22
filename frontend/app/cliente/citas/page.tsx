"use client";

import { useEffect, useState } from "react";
import { ClientPageHeader } from "../../components/ClientPageSections";
import ClientSidebar from "../ClientSidebar";
import {
  listClientAppointments,
  reviewClientAppointment,
  type ClientAppointment,
} from "@/lib/api/iaApi";

const STATUS_STYLE: Record<string, string> = {
  pendiente: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  aceptada: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
  rechazada: "border-rose-300/30 bg-rose-300/10 text-rose-200",
  completada: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  cancelada: "border-slate-300/20 bg-white/5 text-cyan-100/60",
};

const STATUS_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  completada: "Completada",
  cancelada: "Cancelada",
};

function StatusBadge({ estado }: { estado: string }) {
  const style = STATUS_STYLE[estado] ?? STATUS_STYLE.pendiente;
  const label = STATUS_LABEL[estado] ?? estado;
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}

function ReviewBlock({ appointmentId }: { appointmentId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<{ loading: boolean; message: string | null; ok: boolean }>({
    loading: false,
    message: null,
    ok: false,
  });

  const submit = async () => {
    if (rating < 1) {
      setState({ loading: false, message: "Elige una calificación.", ok: false });
      return;
    }
    setState({ loading: true, message: null, ok: false });
    try {
      const res = await reviewClientAppointment(appointmentId, rating, comment || undefined);
      setState({ loading: false, message: res.mensaje ?? "¡Gracias por calificar!", ok: true });
    } catch (err) {
      setState({
        loading: false,
        message: err instanceof Error ? err.message : "No se pudo enviar la reseña.",
        ok: false,
      });
    }
  };

  if (state.ok) {
    return <p className="border-t border-cyan-100/10 pt-2 text-xs text-emerald-300">{state.message}</p>;
  }

  return (
    <div className="space-y-2 border-t border-cyan-100/10 pt-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-lg transition ${star <= rating ? "text-amber-300" : "text-cyan-100/30 hover:text-amber-200/60"}`}
            aria-label={`${star} estrellas`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-xs text-cyan-100/60">Califica al especialista</span>
      </div>
      <input
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Comentario (opcional)"
        className="w-full rounded-lg border border-cyan-100/20 bg-slate-950/50 px-2 py-1.5 text-sm text-cyan-50"
      />
      <button
        type="button"
        onClick={submit}
        disabled={state.loading}
        className="rounded-xl border border-amber-200/40 bg-amber-300/15 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/25 disabled:opacity-60"
      >
        {state.loading ? "Enviando…" : "Enviar reseña"}
      </button>
      {state.message ? (
        <p className={`text-xs ${state.ok ? "text-emerald-300" : "text-rose-300"}`}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await listClientAppointments();
        if (active) {
          setAppointments(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar tus citas.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex-1 pb-0">
      <ClientPageHeader sectionLabel="Mis citas" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ClientSidebar contextCard={false} />
        </aside>

        <section className="space-y-4">
          <div className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">AGENDA</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">Mis citas con especialistas</h1>
            <p className="mt-2 text-sm text-cyan-100/75">
              Sigue el estado de cada cita: el especialista la acepta, la rechaza o la marca como
              realizada.
            </p>
          </div>

          {loading ? (
            <div className="tech-card text-sm text-cyan-100/70">Cargando tus citas…</div>
          ) : error ? (
            <div className="tech-card text-sm text-rose-300">{error}</div>
          ) : appointments.length === 0 ? (
            <div className="tech-card text-sm text-cyan-100/70">
              Aún no agendaste ninguna cita. Explora servicios de especialistas y agenda desde la
              ficha del servicio.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((cita) => (
                <article key={cita.id} className="tech-card flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-cyan-50">{cita.servicio}</h2>
                      {cita.especialista ? (
                        <p className="text-sm text-cyan-100/75">con {cita.especialista}</p>
                      ) : null}
                    </div>
                    <StatusBadge estado={cita.estado} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-cyan-100/70">
                    {cita.fecha ? <span>📅 {cita.fecha}</span> : null}
                    {cita.hora ? <span>🕒 {cita.hora}</span> : null}
                    {cita.ubicacion ? <span>📍 {cita.ubicacion}</span> : null}
                  </div>
                  {cita.notas ? (
                    <p className="text-xs text-cyan-100/60">Notas: {cita.notas}</p>
                  ) : null}
                  {cita.estado === "completada" || cita.estado === "aceptada" ? (
                    <ReviewBlock appointmentId={cita.id} />
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
