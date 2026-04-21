"use client";

import Link from "next/link";

type CompanySidebarProps = {
  className?: string;
};

const companyModules = [
  { title: "Resumen", href: "/empresa" },
  { title: "Perfil", href: "/empresa/perfil" },
  { title: "Publicaciones", href: "/empresa/publicaciones" },
  { title: "Chat", href: "/empresa/chat" },
  { title: "Resenas", href: "/empresa/resenas" },
  { title: "Consultor IA", href: "/empresa/ia" },
  { title: "Analiticas", href: "/empresa/analiticas" },
];

export function CompanySidebar({ className }: CompanySidebarProps) {
  return (
    <div className={className}>
      <p className="tech-mono text-xs text-cyan-200/75">MODULO EMPRESA</p>
      <nav className="mt-4 space-y-2 text-sm text-cyan-100/90">
        {companyModules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="block rounded-2xl border border-cyan-100/10 p-3 font-semibold text-cyan-50 transition hover:bg-cyan-100/5"
          >
            {module.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}