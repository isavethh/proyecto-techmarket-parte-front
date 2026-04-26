"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { specialistNavLinks, specialistProfile } from "../specialistData";

type SpecialistShellProps = {
  sectionLabel: string;
  statusMessage: string;
  children: ReactNode;
};

type SpecialistSidebarSummary = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

type SpecialistTopbarControlsProps = {
  sectionLabel: string;
};

const specialistSidebarSummaries: Record<string, SpecialistSidebarSummary> = {
  "Resumen especialista": {
    eyebrow: "PERFIL DESTACADO",
    title: "Especialista recomendado",
    description:
      "Perfil tecnico orientado a confianza, soporte claro y evidencia visible para que el cliente decida con mas seguridad.",
    points: [
      "Atencion clara y profesional",
      "Portafolio con evidencia visible",
      "Respuesta rapida por chat",
    ],
  },
  Portafolio: {
    eyebrow: "PORTAFOLIO ACTIVO",
    title: "Resultados que generan confianza",
    description:
      "Esta seccion ayuda al cliente a revisar trabajos realizados, resultados obtenidos y evidencia tecnica antes de contratar.",
    points: [
      "Trabajos documentados",
      "Resultados visibles",
      "Mayor credibilidad comercial",
    ],
  },
  Servicios: {
    eyebrow: "CATALOGO ACTIVO",
    title: "Servicios listos para contratar",
    description:
      "Aqui se muestran servicios tecnicos claros, con descripcion, precio y acceso directo al chat para facilitar la decision.",
    points: [
      "Servicios destacados",
      "Precio visible o consultable",
      "Acceso directo al chat",
    ],
  },
  Chat: {
    eyebrow: "ATENCION DIRECTA",
    title: "Conversaciones activas",
    description:
      "Este canal concentra consultas, seguimiento y respuesta rapida para mejorar confianza, atencion y conversion comercial.",
    points: [
      "Consultas activas",
      "Seguimiento en tiempo real",
      "Canal de cierre comercial",
    ],
  },
  Reputacion: {
    eyebrow: "CONFIANZA VISIBLE",
    title: "Opiniones y calificaciones",
    description:
      "La reputacion permite al cliente validar calidad de servicio, atencion y experiencia antes de tomar una decision.",
    points: [
      "Calificacion general",
      "Comentarios recientes",
      "Senales de confianza",
    ],
  },
  Disponibilidad: {
    eyebrow: "AGENDA ACTIVA",
    title: "Estado operativo",
    description:
      "Esta vista muestra horario, modalidad de atencion y capacidad operativa para saber cuando contactar o programar servicio.",
    points: [
      "Horario visible",
      "Modalidad de atencion",
      "Estado actual del tecnico",
    ],
  },
};

function SpecialistTopbarControls({ sectionLabel }: SpecialistTopbarControlsProps) {
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (
        profileMenuRef.current?.contains(targetNode) ||
        profileTriggerRef.current?.contains(targetNode)
      ) {
        return;
      }

      setIsProfileMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  return (
    <div className="relative flex items-center gap-2">
      <Link
        href="/especialista/portafolio"
        className="hidden rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:border-cyan-300/45 hover:bg-cyan-300/18 sm:inline-flex"
      >
        Gestionar portafolio
      </Link>

      <button
        ref={profileTriggerRef}
        type="button"
        onClick={() => setIsProfileMenuOpen((current) => !current)}
        className="flex min-h-[40px] min-w-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-cyan-100/20 bg-[linear-gradient(140deg,rgba(11,34,60,0.94),rgba(6,23,43,0.96))] px-2 py-1.5 pr-3 text-left shadow-lg shadow-slate-950/35 transition hover:border-cyan-300/45 hover:bg-[linear-gradient(140deg,rgba(15,42,73,0.96),rgba(8,29,53,0.98))] hover:shadow-cyan-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35"
        aria-haspopup="menu"
        aria-expanded={isProfileMenuOpen}
        aria-label="Abrir perfil de especialista"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300 to-blue-600 text-[11px] font-bold text-slate-950">
          {specialistProfile.avatar}
        </span>
        <span className="hidden text-xs font-semibold text-cyan-100 md:block">{sectionLabel}</span>
      </button>

      {isProfileMenuOpen ? (
        <div
          ref={profileMenuRef}
          className="absolute right-0 top-[calc(100%+0.55rem)] w-[300px] overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(10,33,57,0.96),rgba(4,18,34,0.98))] p-4 shadow-2xl shadow-slate-950/50"
          role="menu"
          aria-label="Menu de especialista"
        >
          <p className="tech-mono text-xs text-cyan-200/70">PERFIL ESPECIALISTA</p>
          <p className="mt-2 text-base font-semibold text-cyan-50">{specialistProfile.name}</p>
          <p className="mt-1 text-sm text-cyan-100/80">{specialistProfile.specialization}</p>

          <div className="mt-3 space-y-2 rounded-2xl border border-cyan-100/10 bg-slate-950/30 p-3 text-xs text-cyan-100/80">
            <div className="flex items-center justify-between gap-3">
              <span>Ciudad</span>
              <strong className="text-cyan-50">Santa Cruz</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Estado</span>
              <strong className="text-cyan-50">Especialista verificado</strong>
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            {specialistNavLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsProfileMenuOpen(false)}
                  className={`auth-action block w-full ${isActive ? "active" : ""}`}
                >
                  {link.title}
                </Link>
              );
            })}

            <Link
              href="/auth"
              onClick={() => setIsProfileMenuOpen(false)}
              className="auth-action block w-full"
            >
              Cerrar sesion
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SpecialistShell({ sectionLabel, statusMessage, children }: SpecialistShellProps) {
  const pathname = usePathname();
  const sidebarSummary = specialistSidebarSummaries[sectionLabel];

  return (
    <div className="flex-1">
      <header className="tech-top-nav sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>

          <div className="hidden max-w-xl flex-1 md:block">
            <div className="inline-flex rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:items-center md:gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
              <span className="ml-2 md:ml-0">{statusMessage}</span>
            </div>
          </div>

          <SpecialistTopbarControls sectionLabel={sectionLabel} />
        </div>
      </header>

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-5 px-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-5">
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-1">
          <section className="tech-card">
            <p className="tech-mono text-xs text-cyan-200/75">PERFIL ESPECIALISTA</p>
            <h1 className="mt-2 text-xl font-semibold text-cyan-50">{specialistProfile.name}</h1>
            <p className="mt-2 text-sm text-cyan-100/80">{specialistProfile.specialization}</p>
            <p className="mt-2 text-xs text-cyan-100/75">{specialistProfile.location}</p>
          </section>

          <section className="tech-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
                {specialistProfile.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan-50">Mi panel</p>
                <p className="text-xs text-cyan-100/75">Especialista activo</p>
              </div>
            </div>

            <div className="mt-3 grid gap-2">
              {specialistNavLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`auth-action ${isActive ? "active" : ""}`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </section>
            {sidebarSummary ? (
              <section className="tech-card">
                <p className="tech-mono text-xs text-cyan-200/75">{sidebarSummary.eyebrow}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{sidebarSummary.title}</h2>
                <p className="mt-3 text-sm leading-7 text-cyan-100/80">
                  {sidebarSummary.description}
                </p>

                <div className="mt-4 space-y-2">
                  {sidebarSummary.points.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/80"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
        </aside>

        <section className="space-y-6 pr-0 lg:pr-4">
          {children}
        </section>
      </main>
    </div>
  );
}
