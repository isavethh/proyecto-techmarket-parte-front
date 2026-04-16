import Link from "next/link";

const companyModules = [
  {
    title: "Perfil y tienda",
    description: "Datos de negocio, identidad visual y configuracion de la tienda.",
  },
  {
    title: "Publicaciones",
    description: "Contenidos generales que dan visibilidad a la empresa.",
  },
  {
    title: "Publicaciones de interaccion",
    description: "Encuestas y publicaciones para hablar con usuarios sin venderles nada.",
  },
  {
    title: "Productos disponibles",
    description: "Inventario activo que la empresa tiene listo para publicar o vender.",
  },
  {
    title: "Servicios",
    description: "Servicios ofrecidos por la empresa o su equipo tecnico.",
  },
  {
    title: "Ofertas",
    description: "Descuentos temporales y promociones especiales.",
  },
  {
    title: "Promociones",
    description: "Campañas para impulsar alcance, conversion y reconocimiento.",
  },
  {
    title: "Catalogo",
    description: "Control interno de publicaciones no interactivas para gestionar inventario.",
  },
  {
    title: "Chat",
    description: "Conversacion entre cliente interesado y empresa oferente.",
  },
  {
    title: "Consultor IA",
    description: "Ventana para hacer preguntas sobre el negocio a la inteligencia artificial.",
  },
  {
    title: "Analiticas",
    description: "Visitas, estrellas, reseñas, comentarios e indice de crecimiento.",
  },
];

export default function EmpresaPage() {
  return (
    <div className="flex-1 pb-8">
      <header className="tech-top-nav">
        <div className="tech-shell flex items-center justify-between py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Panel empresa</span>
        </div>
      </header>

      <main className="tech-shell mt-8">
        <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
          <aside className="tech-card h-fit">
            <p className="tech-mono text-xs text-cyan-200/75">MODULO EMPRESAS</p>
            <nav className="mt-4 space-y-4 text-sm text-cyan-100/90">
              {companyModules.map((module) => (
                <div key={module.title} className="rounded-2xl border border-cyan-100/10 p-3">
                  <p className="font-semibold text-cyan-50">{module.title}</p>
                  <p className="mt-1 text-xs leading-6 text-cyan-100/75">{module.description}</p>
                </div>
              ))}
            </nav>
          </aside>

          <section className="tech-hero p-6 md:p-8">
            <p className="tech-mono text-xs text-cyan-200/75">PANEL PRINCIPAL</p>
            <h1 className="mt-2 text-3xl font-bold text-cyan-50 md:text-4xl">
              Espacio inicial del modulo de empresas
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80 md:text-base">
              Desde aqui se conectaran las paginas individuales de cada modulo.
              Esta vista solo organiza la estructura base del panel empresarial.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
