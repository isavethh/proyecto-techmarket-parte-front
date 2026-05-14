"use client";

import Link from "next/link";
import { EmbajadorSidebar, EmbajadorTopbarControls } from "../page";
import { useAmbassadorProfile } from "../useAmbassadorApi";

const mainFunctions = [
  {
    code: "01",
    title: "Registrar negocios",
    description:
      "Agrega nuevos negocios a la plataforma para iniciar su presencia en TechMarket y vincularlos con tu red.",
  },
  {
    code: "02",
    title: "Seguimiento de onboarding",
    description:
      "Verifica el progreso de activacion de cada negocio referido y acompaña su avance hasta quedar listo.",
  },
  {
    code: "03",
    title: "Revision de comisiones",
    description:
      "Consulta tus ganancias, pagos pendientes e historial de ingresos generados por tu actividad.",
  },
  {
    code: "04",
    title: "Gestion de referidos",
    description:
      "Visualiza el estado de los negocios registrados, su avance y las oportunidades para seguir creciendo.",
  },
];

const quickAccessLinks = [
  { href: "/embajador", label: "Registrar negocio", description: "Abrir panel principal y referir" },
  { href: "/embajador/onboarding", label: "Ver onboarding", description: "Revisar avance de activacion" },
  { href: "/embajador/comisiones", label: "Ver comisiones", description: "Consultar ingresos y pagos" },
  { href: "/embajador/negocios-referidos", label: "Ver negocios referidos", description: "Explorar tu red captada" },
];

const usefulTips = [
  "Completa correctamente los datos del negocio para agilizar la activacion.",
  "Da seguimiento al onboarding desde el primer dia para evitar retrasos en las comisiones.",
  "Revisa que cada referido mantenga publicaciones y evidencias actualizadas.",
  "Usa los accesos rapidos para pasar de una tarea a otra sin perder el contexto.",
];

export default function EmbajadorGuiaPage() {
  const { data: profile } = useAmbassadorProfile();

  return (
    <div className="flex-1 pb-10">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>

          <div className="hidden rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:inline-flex md:items-center md:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
            Guia de uso para embajadores
          </div>

          <EmbajadorTopbarControls profile={profile} />
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="guia" profile={profile} />

        <section className="space-y-6">
          <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
            <p className="tech-mono text-xs text-cyan-200/75">GUIA DE USO PARA EMBJADORES</p>
            <h1 className="mt-3 text-3xl font-bold text-cyan-50 md:text-4xl">Aprende a usar tu panel de embajador</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-cyan-100/80">
              En este modulo puedes registrar negocios, dar seguimiento al onboarding, revisar comisiones y
              gestionar tus referidos. Esta guia resume las acciones principales para que empieces rapido y con
              claridad.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {mainFunctions.map((item) => (
                <article key={item.title} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">{item.code}</p>
                  <h2 className="mt-2 text-lg font-semibold text-cyan-50">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-cyan-100/78">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-white">Accesos rapidos</h2>
                <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/85">
                  Navegacion directa
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickAccessLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 transition hover:border-cyan-200/30 hover:bg-cyan-300/10"
                  >
                    <p className="text-sm font-semibold text-cyan-50">{item.label}</p>
                    <p className="mt-2 text-xs leading-5 text-cyan-100/75">{item.description}</p>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 md:p-6">
              <p className="tech-mono text-xs text-cyan-200/75">CONSEJOS UTILES</p>
              <h2 className="mt-2 text-2xl font-bold text-cyan-50">Buenas practicas para embajadores</h2>

              <ul className="mt-4 space-y-3 text-sm text-cyan-100/82">
                {usefulTips.map((tip) => (
                  <li key={tip} className="rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-3">
                    {tip}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-cyan-50">Secuencia recomendada</p>
                <p className="mt-1 text-sm text-cyan-100/78">
                  Recorre esta ruta cuando captes un negocio nuevo para mantener el proceso ordenado.
                </p>
              </div>
              <Link href="/embajador" className="tech-button tech-button-primary px-4 py-2 text-xs">
                Ir al panel principal
              </Link>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                "Registrar el negocio",
                "Completar el onboarding",
                "Revisar el avance y alertas",
                "Confirmar comisiones generadas",
              ].map((step, index) => (
                <article key={step} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Paso {index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-cyan-50">{step}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}