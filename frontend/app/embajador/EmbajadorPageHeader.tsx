"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { EmbajadorTopbarControls } from "./EmbajadorSidebar";
import type { ApiProfile } from "./useAmbassadorApi";

type EmbajadorPageHeaderProps = {
  profile?: ApiProfile | null;
  statusMessage?: string;
  rightSlot?: ReactNode;
};

export function EmbajadorPageHeader({
  profile,
  statusMessage = "Panel de embajador con seguimiento activo",
  rightSlot,
}: EmbajadorPageHeaderProps) {
  return (
    <header className="tech-top-nav sticky top-0 z-30">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href="/" className="font-semibold text-cyan-100/90">
          TechMarket
        </Link>

        <div className="hidden rounded-full border border-cyan-100/15 bg-slate-950/45 px-3 py-1.5 text-xs text-cyan-100/80 md:inline-flex md:items-center md:gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.85)]" />
          {statusMessage}
        </div>

        <div className="flex items-center gap-2">
          {rightSlot}
          <EmbajadorTopbarControls profile={profile} />
        </div>
      </div>
    </header>
  );
}
