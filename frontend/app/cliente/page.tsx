import Link from "next/link";

const customerHighlights = [
  {
    title: "Descubrimiento confiable",
    text: "Busca tiendas y tecnicos por categoria, zona y reputacion verificada.",
  },
  {
    title: "Comparacion clara",
    text: "Evalua precio, tiempo de respuesta y valoraciones antes de comprar.",
  },
  {
    title: "Soporte continuo",
    text: "Haz seguimiento de pedidos y solicitudes en un solo panel.",
  },
];

const recommendedCards = [
  {
    name: "Laptop Studio Pro 14",
    category: "Equipos",
    score: "4.9",
    trend: "+28% interes",
  },
  {
    name: "Upgrade SSD + RAM",
    category: "Servicio tecnico",
    score: "4.8",
    trend: "+17% conversion",
  },
  {
    name: "Kit CCTV Inteligente",
    category: "Seguridad",
    score: "4.7",
    trend: "+11% reservas",
  },
];

export default function ClientePage() {
  return (
    <div className="flex-1 pb-12">
      <header className="tech-top-nav">
        <div className="tech-shell flex items-center justify-between py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Experiencia cliente</span>
        </div>
      </header>

      <main className="tech-shell mt-8 space-y-6">
        <section className="tech-hero p-6 md:p-8">
          <p className="tech-mono text-xs text-cyan-200/75">ROL_ACTIVO=CLIENTE</p>
          <h1 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">
            Encuentra soluciones tecnologicas con confianza.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-100/80 md:text-base">
            Esta vista prioriza descubrimiento, reputacion y comparacion para que
            cada decision de compra o servicio tecnico sea mas segura y rapida.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="tech-button tech-button-primary" href="#recomendados">
              Ver recomendados
            </a>
            <a className="tech-button tech-button-secondary" href="#actividad">
              Revisar actividad
            </a>
          </div>
        </section>

        <section className="tech-grid md:grid-cols-3">
          {customerHighlights.map((item) => (
            <article key={item.title} className="tech-card">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="tech-card" id="recomendados">
          <h2 className="text-2xl font-semibold text-cyan-50">
            Recomendados por la comunidad
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {recommendedCards.map((card) => (
              <article key={card.name} className="rounded-2xl border border-cyan-100/15 p-4">
                <p className="tech-mono text-xs text-cyan-200/75">{card.category}</p>
                <h3 className="mt-2 text-lg font-semibold">{card.name}</h3>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-cyan-200/85">Reputacion {card.score}</span>
                  <span className="text-cyan-300">{card.trend}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="tech-card" id="actividad">
          <h2 className="text-2xl font-semibold text-cyan-50">Tu actividad reciente</h2>
          <div className="mt-4 space-y-3 text-sm text-cyan-100/85 md:text-base">
            <p>Solicitud enviada: Mantenimiento de laptop empresarial.</p>
            <p>Comparacion guardada: 4 tiendas de componentes gamer.</p>
            <p>Resena publicada: Servicio de instalacion de red domestica.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
