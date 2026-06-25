"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ClientSidebarProps = {
  className?: string;
  /** Show the route-based context card. Set to false when the page provides its own context section. */
  contextCard?: boolean;
};

type ClientSidebarContext = {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
};

const clientModules = [
  { title: "Explorar marketplace", href: "/cliente/marketplace" },
  { title: "Mis chats", href: "/cliente/chat" },
  { title: "Mis citas", href: "/cliente/citas" },
  { title: "Buscar servicios", href: "/cliente/servicios" },
  { title: "Versus de productos", href: "/cliente/versus" },
  { title: "Explorar empresas", href: "/cliente/empresas" },
  { title: "Comunidades", href: "/cliente/comunidades" },
  { title: "Actividad reciente", href: "/cliente" },
];

const clientSidebarContextByRoute: Record<string, ClientSidebarContext> = {
  "/cliente": {
    eyebrow: "PANEL CLIENTE",
    title: "Actividad y seguimiento",
    description:
      "Revisa tu feed, publicaciones relevantes y señales del ecosistema TechMarket desde una sola vista.",
    chips: ["Feed", "Seguimiento", "Explorar", "Recomendado"],
  },
  "/cliente/chat": {
    eyebrow: "MENSAJES ACTIVOS",
    title: "Conversaciones abiertas",
    description:
      "Gestiona tus chats con empresas y técnicos, revisa respuestas y continua consultas sin perder contexto.",
    chips: ["Chats", "Empresas", "Seguimiento", "Respuesta"],
  },
  "/cliente/citas": {
    eyebrow: "AGENDA",
    title: "Citas con especialistas",
    description:
      "Sigue el estado de tus citas: el especialista las acepta, rechaza o marca como realizadas.",
    chips: ["Citas", "Especialistas", "Estado", "Agenda"],
  },
  "/cliente/servicios": {
    eyebrow: "SERVICIOS",
    title: "Búsqueda guiada",
    description:
      "Encuentra soporte técnico, mantenimiento y atención especializada según necesidad y confianza.",
    chips: ["Busqueda", "Tecnicos", "Match", "Cobertura"],
  },
  "/cliente/versus": {
    eyebrow: "COMPARACION",
    title: "Decision informada",
    description:
      "Compara productos o servicios para elegir mejor según rendimiento, precio y reputación.",
    chips: ["Versus", "Precio", "Rendimiento", "Decision"],
  },
  "/cliente/empresas": {
    eyebrow: "EMPRESAS",
    title: "Perfiles y confianza",
    description:
      "Explora empresas activas, revisa reputación y elige a quien contactar dentro del ecosistema.",
    chips: ["Perfiles", "Confianza", "Empresas", "Visibilidad"],
  },
  "/cliente/comunidades": {
    eyebrow: "COMUNIDAD",
    title: "Interaccion compartida",
    description:
      "Participa en conversaciones, sigue actividad de otros usuarios y descubre contenido relevante.",
    chips: ["Comunidad", "Usuarios", "Contenido", "Interaccion"],
  },
  "/cliente/marketplace": {
    eyebrow: "MARKETPLACE",
    title: "Exploracion comercial",
    description:
      "Descubre productos, ofertas y servicios publicados por empresas y técnicos en TechMarket.",
    chips: ["Marketplace", "Ofertas", "Productos", "Servicios"],
  },
};

export default function ClientSidebar({ className, contextCard = true }: ClientSidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) =>
    href === "/cliente" ? pathname === "/cliente" : pathname.startsWith(href);

  const currentContext =
    clientSidebarContextByRoute[pathname] ??
    clientModules
      .slice()
      .reverse()
      .find((module) => isActiveRoute(module.href) && clientSidebarContextByRoute[module.href])
      ?.href;

  const contextCardData =
    typeof currentContext === "string"
      ? clientSidebarContextByRoute[currentContext]
      : currentContext;

  return (
    <div className={className}>
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
          {clientModules.map((module) => {
            const isActive = isActiveRoute(module.href);

            return (
              <Link
                key={module.title}
                href={module.href}
                className={`auth-action ${
                  isActive ? "active" : ""
                }`}
              >
                {module.title}
              </Link>
            );
          })}
        </div>
      </section>

      {contextCard && contextCardData ? (
        <section className="tech-card mt-4">
          <p className="tech-mono text-xs text-cyan-200/75">{contextCardData.eyebrow}</p>
          <h3 className="mt-2 text-xl font-semibold text-cyan-50">{contextCardData.title}</h3>
          <p className="mt-3 text-sm leading-7 text-cyan-100/80">
            {contextCardData.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {contextCardData.chips.map((chip) => (
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