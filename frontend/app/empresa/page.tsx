import Link from "next/link";

const enterpriseModules = [
  {
    title: "Catalogo inteligente",
    text: "Publica productos y servicios con filtros por disponibilidad, gama y soporte.",
  },
  {
    title: "Leads y conversion",
    text: "Recibe solicitudes segmentadas por categoria, urgencia y zona geografica.",
  },
  {
    title: "Reputacion activa",
    text: "Monitorea resenas, tiempos de respuesta y nivel de satisfaccion.",
  },
  {
    title: "Promocion asistida",
    text: "Impulsa campañas en comunidad con apoyo de embajadores y contenido social.",
  },
];

const kpis = [
  { label: "Leads nuevos", value: "124", detail: "+18% semana" },
  { label: "Tasa respuesta", value: "96%", detail: "promedio 12m" },
  { label: "Conversaciones", value: "342", detail: "+31 activas" },
  { label: "Indice reputacion", value: "4.8", detail: "muy alto" },
];

export default function EmpresaPage() {
  return (
    <div className="flex-1 pb-12">
      <header className="tech-top-nav">
        <div className="tech-shell flex items-center justify-between py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Panel empresa</span>
        </div>
      </header>

      <main className="tech-shell mt-8 space-y-6">
        <section className="tech-hero p-6 md:p-8">
          <p className="tech-mono text-xs text-cyan-200/75">ROL_ACTIVO=EMPRESA</p>
          <h1 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">
            Gestiona crecimiento comercial en un ecosistema especializado.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80 md:text-base">
            Esta interfaz concentra herramientas para visibilidad, captacion,
            confianza y seguimiento. Disenada para negocios que venden productos
            o servicios de Electronica y Computacion.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="tech-button tech-button-primary" href="#metricas">
              Ver metricas
            </a>
            <a className="tech-button tech-button-secondary" href="#modulos">
              Ver modulos
            </a>
          </div>
        </section>

        <section className="tech-grid md:grid-cols-4" id="metricas">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="tech-card">
              <p className="text-sm text-cyan-200/80">{kpi.label}</p>
              <p className="mt-3 text-3xl font-bold text-cyan-50">{kpi.value}</p>
              <p className="mt-1 text-sm text-cyan-300">{kpi.detail}</p>
            </article>
          ))}
        </section>

        <section className="tech-card" id="modulos">
          <h2 className="text-2xl font-semibold text-cyan-50">Modulos clave empresa</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {enterpriseModules.map((module) => (
              <article key={module.title} className="rounded-2xl border border-cyan-100/15 p-4">
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm text-cyan-100/80 md:text-base">{module.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tech-card">
          <h2 className="text-2xl font-semibold text-cyan-50">Flujo recomendado</h2>
          <div className="mt-4 grid gap-3 text-sm text-cyan-100/85 md:grid-cols-3 md:text-base">
            <p>1) Completar perfil y evidencia de trabajos.</p>
            <p>2) Publicar catalogo base y primeras promociones.</p>
            <p>3) Activar embajadores para acelerar visibilidad y conversion.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
