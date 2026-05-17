"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ClientTopbarControls } from "./ClientExperienceShell";

export const clientMenuItems = [
  { label: "Actividad reciente", href: "/cliente" },
  { label: "Explorar marketplace", href: "/cliente/marketplace" },
  { label: "Buscar servicios", href: "/cliente/servicios" },
  { label: "Mis chats", href: "/cliente/chat" },
  { label: "Explorar empresas", href: "/cliente/empresas" },
  { label: "Versus de productos", href: "/cliente/versus" },
  { label: "Comunidades", href: "/cliente/comunidades" },
];

type ClientPageHeaderProps = {
  sectionLabel: string;
  brandHref?: string;
  middleSlot?: ReactNode;
  rightSlot?: ReactNode;
  sticky?: boolean;
  className?: string;
};

type ClientInfoCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
};

type ClientQuickLink = {
  href: string;
  label: string;
};

type ClientQuickLinksCardProps = {
  links: ClientQuickLink[];
  className?: string;
};

const combineClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(" ");

export function ClientPageHeader({
  sectionLabel,
  brandHref = "/cliente",
  middleSlot,
  rightSlot,
  sticky = true,
  className,
}: ClientPageHeaderProps) {
  return (
    <header
      className={combineClassNames("tech-top-nav z-30", sticky && "sticky top-0", className)}
    >
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href={brandHref} className="font-semibold text-cyan-100/90">
          TechMarket
        </Link>

        {middleSlot ? <div className="hidden flex-1 max-w-xl md:block">{middleSlot}</div> : null}

        <div className="flex items-center gap-2">
          {rightSlot}
          <ClientTopbarControls sectionLabel={sectionLabel} />
        </div>
      </div>
    </header>
  );
}

export function ClientInfoCard({
  eyebrow,
  title,
  description,
  className,
  children,
}: ClientInfoCardProps) {
  return (
    <section className={combineClassNames("tech-card", className)}>
      <p className="tech-mono text-xs text-cyan-200/75">{eyebrow}</p>
      <h1 className="mt-2 text-xl font-semibold text-cyan-50">{title}</h1>
      <p className="mt-3 text-sm text-cyan-100/80">{description}</p>
      {children}
    </section>
  );
}

export function ClientQuickLinksCard({ links, className }: ClientQuickLinksCardProps) {
  return (
    <section className={combineClassNames("tech-card", className)}>
      <div className="grid gap-2">
        {links.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href} className="auth-action block w-full">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

type ClientSidebarMenuProps = {
  className?: string;
  panelLabel?: string;
  panelDescription?: string;
};

export function ClientSidebarMenu({
  className,
  panelLabel = "Tu panel",
  panelDescription = "Cliente activo en TechMarket",
}: ClientSidebarMenuProps) {
  const pathname = usePathname();

  return (
    <section className={combineClassNames("tech-card", className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-bold text-slate-950">
          CM
        </div>
        <div>
          <p className="text-sm font-semibold text-cyan-50">{panelLabel}</p>
          <p className="text-xs text-cyan-100/75">{panelDescription}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {clientMenuItems.map((item) => {
          const isActive =
            item.href === "/cliente"
              ? pathname === "/cliente"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`auth-action ${isActive ? "active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
