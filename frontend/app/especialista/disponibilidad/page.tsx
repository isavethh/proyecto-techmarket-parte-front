"use client";

import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistBackendData } from "../hooks/useSpecialistBackendData";
import { useSpecialistAvailabilityData } from "../hooks/useSpecialistAvailabilityData";

export default function EspecialistaDisponibilidadPage() {
  const { availability, calendar } = useSpecialistAvailabilityData();
  const { profile } = useSpecialistBackendData();

  return (
    <SpecialistShell sectionLabel="Disponibilidad" statusMessage="Estado operativo y horarios actualizados" profile={profile}>
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">DISPONIBILIDAD DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Agenda y capacidad operativa</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Informacion clara para decidir si contactar en este momento o programar atencion.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {availability.length === 0 ? (
          <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4 text-sm text-cyan-100/75 sm:col-span-2 xl:col-span-4">
            No hay disponibilidad configurada todavía.
          </article>
        ) : null}
        {availability.map((card) => (
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
        <h2 className="text-2xl font-bold text-white">Actividad reciente y señales operativas</h2>
        <p className="mt-2 text-sm leading-6 text-cyan-100/75">
          Esta vista ayuda al cliente a entender si el especialista mantiene actividad visible, respuesta constante
          y condiciones claras antes de iniciar una conversacion.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {calendar.length === 0 ? (
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-3 text-sm text-cyan-100/75 md:col-span-3">
              No hay eventos de agenda registrados todavía.
            </article>
          ) : null}
          {calendar.map((item) => (
            <article key={item.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
              <p className="text-sm font-semibold text-cyan-50">{item.title}</p>
              <p className="mt-1 text-sm text-cyan-100/80">{item.detail}</p>
              <p className="mt-2 text-xs text-cyan-100/65">{item.time}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <p className="tech-mono text-xs text-cyan-200/75">CRITERIOS OPERATIVOS</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Como atiende el especialista dentro de TechMarket</h2>
          <p className="mt-3 text-sm leading-7 text-cyan-100/80">
            La disponibilidad no solo indica horario. Tambien comunica capacidad real de respuesta,
            orden operativo y confianza para que el cliente pueda decidir si contactar ahora,
            programar una atencion o esperar una ventana mas conveniente.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Respuesta por prioridad</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                Las consultas por diagnostico urgente, fallas operativas y conectividad tienen atencion prioritaria
                dentro del horario activo del especialista.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Programacion ordenada</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                Los trabajos presenciales y mantenimientos se coordinan por agenda para evitar saturacion,
                mejorar tiempos y asegurar cumplimiento tecnico.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Cobertura y modalidad</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                La atencion puede variar entre soporte remoto, visita tecnica o servicio en punto acordado,
                segun el tipo de problema y la ubicacion del cliente.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Confianza y seguimiento</p>
              <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                La actividad visible, el historial reciente y la reputacion ayudan a que el cliente tenga señales
                claras antes de solicitar el servicio.
              </p>
            </article>
          </div>
        </article>

        <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
          <p className="tech-mono text-xs text-cyan-200/75">ALCANCE DEL SERVICIO</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Canales y condiciones de atencion</h2>

          <div className="mt-4 space-y-3">
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Canal principal</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                Chat directo dentro de TechMarket para consultas, coordinacion y seguimiento inicial.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Atencion remota</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                Ideal para configuracion, soporte rapido, validaciones preliminares y asistencia guiada.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Atencion presencial</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                Disponible para mantenimiento, instalacion, revision fisica, redes y trabajos que requieren visita.
              </p>
            </article>

            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">Tiempo estimado de respuesta</p>
              <p className="mt-1 text-sm text-cyan-100/75">
                La primera respuesta se prioriza dentro del horario activo. La confirmacion final depende del tipo
                de servicio, carga operativa y zona de cobertura.
              </p>
            </article>
          </div>
        </article>
      </section>
      
    </SpecialistShell>
  );
}
