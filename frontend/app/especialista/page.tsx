"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SpecialistShell } from "./components/SpecialistShell";
import { SpecialistAiAssistant } from "./components/SpecialistAiAssistant";
import { useSpecialistBackendData } from "./hooks/useSpecialistBackendData";
import { useSpecialistAvailabilityData } from "./hooks/useSpecialistAvailabilityData";
import { useSpecialistReviewsCertificationsData } from "./hooks/useSpecialistReviewsCertificationsData";
import { requireAuth } from "@/lib/auth/authGuard";
import { getUser, getToken } from "@/lib/auth/tokenStore";

export default function EspecialistaCorePage() {
  const router = useRouter();
  const { profile, services, portfolio } = useSpecialistBackendData();
  const { calendar } = useSpecialistAvailabilityData();
  const { reviews, kpis } = useSpecialistReviewsCertificationsData();

  useEffect(() => {
    console.log("[Especialista page] Ejecutando requireAuth desde page.tsx");
    console.log("[Especialista page] document.cookie:", typeof document !== 'undefined' ? document.cookie : 'no-document');
    console.log("[Especialista page] getToken():", getToken());
    console.log("[Especialista page] getUser():", getUser());
    requireAuth(router);
  }, [router]);

  const featuredServices = services.filter((service) => service.featured).length;

  return (
    <SpecialistShell sectionLabel="Resumen especialista" statusMessage="Resumen de especialista independiente activo" profile={profile}>
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">RESUMEN ESPECIALISTA</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-xl font-bold text-slate-950">
                {profile.avatar}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-cyan-50 md:text-4xl">{profile.name}</h1>
                <p className="text-sm text-cyan-100/80">{profile.specialization}</p>
                <p className="text-sm text-cyan-100/80">{profile.location}</p>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">{profile.bio}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Valor diferencial</p>
                <p className="mt-2 text-sm leading-6 text-cyan-100/80">
                  {profile.name === "Sin definir" ? "Perfil no configurado todavía." : "Información del perfil obtenida desde backend."}
                </p>
              </article>

              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Cobertura principal</p>
                <p className="mt-2 text-sm leading-6 text-cyan-100/80">
                  {profile.location === "No especificado" ? "No especificado" : profile.location}
                </p>
              </article>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Trabajos en portafolio</p>
              <p className="mt-2 text-2xl font-bold text-cyan-50">{portfolio.length}</p>
              <p className="mt-1 text-sm text-cyan-100/75">Evidencias visibles</p>
            </article>
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Servicios destacados</p>
              <p className="mt-2 text-2xl font-bold text-cyan-50">{featuredServices}</p>
              <p className="mt-1 text-sm text-cyan-100/75">Mayor interes comercial</p>
            </article>
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Calificacion</p>
              <p className="mt-2 text-2xl font-bold text-cyan-50">{kpis.averageRating} / 5</p>
              <p className="mt-1 text-sm text-cyan-100/75">{kpis.totalReviews} reseñas</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Link href="/especialista/portafolio" className="flex h-full min-h-[154px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/35 hover:bg-slate-950/50">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Seccion</p>
          <h2 className="text-xl font-semibold text-white">Portafolio</h2>
          <p className="mt-2 text-sm leading-6 text-cyan-100/75">Gestiona trabajos, evidencia y resultados tecnicos.</p>
        </Link>
        <Link href="/especialista/servicios" className="flex h-full min-h-[154px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/35 hover:bg-slate-950/50">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Seccion</p>
          <h2 className="text-xl font-semibold text-white">Servicios</h2>
          <p className="mt-2 text-sm leading-6 text-cyan-100/75">Revisa el catalogo de servicios y propuesta comercial.</p>
        </Link>
        <Link
          href="/especialista/chat" className="flex h-full min-h-[154px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/35 hover:bg-slate-950/50">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Seccion</p>
          <h2 className="text-xl font-semibold text-white">Chat</h2>
          <p className="mt-2 text-sm leading-6 text-cyan-100/75">
            Atiende conversaciones activas y responde consultas de clientes.
          </p>
        </Link>
        <Link href="/especialista/reputacion" className="flex h-full min-h-[154px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/35 hover:bg-slate-950/50">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Seccion</p>
          <h2 className="text-xl font-semibold text-white">Reputacion</h2>
          <p className="mt-2 text-sm leading-6 text-cyan-100/75">Analiza calificaciones, comentarios y confianza.</p>
        </Link>
        <Link href="/especialista/disponibilidad" className="flex h-full min-h-[154px] flex-col rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/35 hover:bg-slate-950/50">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Seccion</p>
          <h2 className="text-xl font-semibold text-white">Disponibilidad</h2>
          <p className="mt-2 text-sm leading-6 text-cyan-100/75">Controla estado operativo y ventanas de atencion.</p>
        </Link>
      </section>

      <SpecialistAiAssistant />

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-bold text-white">Actividad reciente</h3>
          <p className="text-sm text-cyan-100/75">Seguimiento de ultimos movimientos del especialista</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {calendar.length === 0 ? (
            <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4 text-sm text-cyan-100/75 md:col-span-3">
              No hay eventos de agenda registrados todavía.
            </article>
          ) : null}
          {calendar.map((item) => (
            <article key={item.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-cyan-50">{item.title}</p>
              <p className="mt-2 text-sm text-cyan-100/80">{item.detail}</p>
              <p className="mt-2 text-xs text-cyan-100/65">{item.time}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
          <p className="text-sm text-cyan-100/80">
            {reviews.length > 0
              ? `${reviews.length} reseñas recientes respaldan la calidad del trabajo técnico.`
              : "No hay reseñas registradas todavía."}
          </p>
        </div>
      </section>
    </SpecialistShell>
  );
}
