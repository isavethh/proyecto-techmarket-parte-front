import { SpecialistShell } from "../components/SpecialistShell";
import { specialistServices } from "../specialistData";

export default function EspecialistaServiciosPage() {
  const featuredServices = specialistServices.filter((service) => service.featured).length;

  return (
    <SpecialistShell sectionLabel="Servicios" statusMessage="Catalogo tecnico especialista activo">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">SERVICIOS DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Servicios profesionales</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Servicios definidos para facilitar contacto rapido y decision informada del usuario.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Total servicios</p>
            <p className="mt-2 text-2xl font-bold text-cyan-50">{specialistServices.length}</p>
          </article>
          <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Destacados</p>
            <p className="mt-2 text-2xl font-bold text-cyan-50">{featuredServices}</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {specialistServices.map((service) => (
          <article key={service.id} className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4">
            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-28 w-full rounded-2xl object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-28 items-center justify-center rounded-2xl border border-cyan-100/10 bg-slate-950/35 text-sm font-semibold text-cyan-100/75">
                  Sin imagen
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                    {service.type}
                  </p>
                  {service.featured ? (
                    <p className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                      Destacado
                    </p>
                  ) : null}
                </div>

                <h2 className="text-xl font-bold text-white">{service.name}</h2>
                <p className="text-sm leading-7 text-cyan-100/85">{service.description}</p>
                <p className="text-sm text-cyan-100/80">
                  <span className="font-semibold text-white">Tecnico:</span> {service.technicianName}
                </p>
                <p className="text-sm text-cyan-100/80">
                  <span className="font-semibold text-white">Precio:</span> {service.price}
                </p>

                <button className="mt-1 w-full rounded-xl border border-cyan-300/45 bg-cyan-300/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-300/30">
                  Contactar por chat
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </SpecialistShell>
  );
}
