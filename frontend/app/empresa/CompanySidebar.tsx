"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type CompanySidebarProps = {
  className?: string;
};

type SidebarContextCard = {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
};

const companyModules = [
  { title: "Resumen", href: "/empresa" },
  { title: "Perfil", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Reseñas", href: "/empresa/resenas" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analíticas", href: "/empresa/analiticas" },
];

const sidebarContextByRoute: Record<string, SidebarContextCard> = {
  "/empresa": {
    eyebrow: "PANEL EJECUTIVO",
    title: "Visión general",
    description:
      "Acceso rápido a señales comerciales, actividad reciente y decisiones recomendadas para hoy.",
    chips: ["Leads", "Conversión", "Actividad", "Prioridades"],
  },
  "/empresa/perfil": {
    eyebrow: "IDENTIDAD COMERCIAL",
    title: "Presencia de la empresa",
    description:
      "Aquí gestionas la imagen, confianza y presentación general de tu empresa dentro de TechMarket.",
    chips: ["Marca", "Confianza", "Perfil", "Presencia"],
  },
  "/empresa/publicaciones": {
    eyebrow: "CONTENIDO ACTIVO",
    title: "Centro de publicaciones",
    description:
      "Organiza productos, servicios, ofertas, texto e interacción desde una sola vista comercial.",
    chips: ["Feed", "Productos", "Ofertas", "Encuestas"],
  },
  "/empresa/chat": {
    eyebrow: "CONVERSACIONES",
    title: "Seguimiento comercial",
    description:
      "Responde rápido, prioriza interesados y convierte consultas en oportunidades reales.",
    chips: ["Chats", "Respuesta", "Conversión", "Seguimiento"],
  },
  "/empresa/resenas": {
    eyebrow: "VOZ DEL CLIENTE",
    title: "Confianza visible",
    description:
      "Revisa la percepción del cliente y detecta señales repetidas sobre calidad, atención y soporte.",
    chips: ["Rapidez", "Atención", "Confianza", "Soporte"],
  },
  "/empresa/ia": {
    eyebrow: "CONSULTOR IA",
    title: "Apoyo para decidir",
    description:
      "Usa la IA para priorizar acciones, optimizar publicaciones y responder mejor a la demanda.",
    chips: ["Analisis", "Prioridad", "Recomendación", "Optimizacion"],
  },
  "/empresa/analiticas": {
    eyebrow: "INDICADORES CLAVE",
    title: "Lectura del negocio",
    description:
      "Explora tendencias, rendimiento y puntos de mejora para tomar decisiones con más contexto.",
    chips: ["Metricas", "Tendencias", "Rendimiento", "Decision"],
  },
};

export function CompanySidebar({ className }: CompanySidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) =>
    href === "/empresa" ? pathname === "/empresa" : pathname.startsWith(href);

  const currentContext =
    sidebarContextByRoute[pathname] ??
    companyModules
      .slice()
      .reverse()
      .find((module) => isActiveRoute(module.href) && sidebarContextByRoute[module.href])
      ?.href;

  const contextCard =
    typeof currentContext === "string"
      ? sidebarContextByRoute[currentContext]
      : currentContext;

  return (
    <div className={className}>
      <p className="tech-mono text-xs text-cyan-200/75">MÓDULO EMPRESA</p>

      <nav className="mt-4 space-y-2 text-sm text-cyan-100/90">
        {companyModules.map((module) => {
          const isActive = isActiveRoute(module.href);

          return (
            <Link
              key={module.title}
              href={module.href}
              className={`block rounded-2xl border p-3 font-semibold transition ${
                isActive
                  ? "border-cyan-300/45 bg-cyan-300/20 text-white shadow-[0_0_0_1px_rgba(103,232,249,0.08)]"
                  : "border-cyan-100/10 text-cyan-50 hover:bg-cyan-100/5"
              }`}
            >
              {module.title}
            </Link>
          );
        })}
      </nav>

      {contextCard ? (
        <section className="mt-4 rounded-3xl border border-cyan-100/10 bg-[linear-gradient(160deg,rgba(18,53,95,0.76),rgba(12,35,62,0.94))] p-4 shadow-xl shadow-slate-950/20">
          <p className="tech-mono text-xs text-cyan-200/75">{contextCard.eyebrow}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{contextCard.title}</h3>
          <p className="mt-3 text-sm leading-7 text-cyan-100/80">
            {contextCard.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {contextCard.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-cyan-100/15 bg-white/5 px-3 py-1 text-xs text-cyan-100/85"
              >
                {chip}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}