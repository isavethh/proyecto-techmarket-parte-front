import { SpecialistShell } from "../components/SpecialistShell";
import { recentActivity, specialistAvailabilityCards } from "../specialistData";

export default function EspecialistaDisponibilidadPage() {
  return (
    <SpecialistShell sectionLabel="Disponibilidad" statusMessage="Estado operativo y horarios actualizados">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">DISPONIBILIDAD DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Agenda y capacidad operativa</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Informacion clara para decidir si contactar en este momento o programar atencion.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {specialistAvailabilityCards.map((card) => (
          <article
            key={card.id}
            className={`rounded-2xl border p-4 ${
              card.tone === "positive"
                ? "border-emerald-300/35 bg-emerald-400/10"
                : "border-cyan-100/10 bg-slate-950/35"
            }`}
          >
            <p
              className={`text-xs uppercase tracking-[0.24em] ${
                card.tone === "positive" ? "text-emerald-100/80" : "text-cyan-200/70"
              }`}
            >
              {card.label}
            </p>
            <p
              className={`mt-2 text-sm font-semibold ${
                card.tone === "positive" ? "text-emerald-100" : "text-cyan-50"
              }`}
            >
              {card.title}
            </p>
            <p
              className={`mt-1 text-xs ${
                card.tone === "positive" ? "text-emerald-100/80" : "text-cyan-100/70"
              }`}
            >
              {card.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <h2 className="text-2xl font-bold text-white">Actividad reciente del tecnico</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {recentActivity.map((item) => (
            <article key={item.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
              <p className="text-sm font-semibold text-cyan-50">{item.title}</p>
              <p className="mt-1 text-sm text-cyan-100/80">{item.detail}</p>
              <p className="mt-2 text-xs text-cyan-100/65">{item.time}</p>
            </article>
          ))}
        </div>
      </section>
    </SpecialistShell>
  );
}
