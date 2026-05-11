"use client";

import { SpecialistShell } from "../components/SpecialistShell";
import { useSpecialistChatFilesData } from "../hooks/useSpecialistChatFilesData";

function getFileTone(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("pdf")) {
    return "border-rose-300/30 bg-rose-400/10 text-rose-100";
  }

  if (normalized.includes("image") || normalized.includes("imagen") || normalized.includes("jpg") || normalized.includes("png")) {
    return "border-emerald-300/30 bg-emerald-400/10 text-emerald-100";
  }

  return "border-cyan-200/25 bg-cyan-300/10 text-cyan-100";
}

export default function EspecialistaArchivosPage() {
  const { files } = useSpecialistChatFilesData();

  return (
    <SpecialistShell sectionLabel="Archivos" statusMessage="Archivos y evidencias del especialista">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">ARCHIVOS DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Documentos y evidencias</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Consulta archivos asociados a clientes, proyectos y trabajos tecnicos. Las acciones de carga y eliminacion quedan pendientes para la siguiente fase.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Archivos</p>
          <p className="mt-2 text-2xl font-bold text-white">{files.length}</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Origen</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Backend TechMarket-IA</p>
          <p className="mt-1 text-xs text-cyan-100/70">Con fallback local</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modo</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Solo lectura</p>
          <p className="mt-1 text-xs text-cyan-100/70">POST y DELETE pendientes</p>
        </article>
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-white">Listado de archivos</h2>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100/70 opacity-70"
          >
            Subir archivo
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {files.length === 0 ? (
            <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5 text-sm text-cyan-100/75 lg:col-span-2">
              No hay archivos cargados todavía.
            </article>
          ) : null}
          {files.map((file) => (
            <article key={file.id} className="rounded-3xl border border-cyan-100/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Archivo</p>
                  <h3 className="mt-2 break-all text-xl font-bold text-white">{file.name}</h3>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getFileTone(file.type)}`}>
                  {file.type}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Tamano</p>
                  <p className="mt-2 text-sm text-cyan-100/85">{file.size ?? "Tamano no disponible"}</p>
                </article>
                <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Fecha de carga</p>
                  <p className="mt-2 text-sm text-cyan-100/85">{file.uploadedAt}</p>
                </article>
              </div>

              <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Relacionado con</p>
                <p className="mt-2 text-sm leading-6 text-cyan-100/85">{file.relatedTo}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                  >
                    Ver archivo
                  </a>
                ) : null}
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100/70 opacity-70"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SpecialistShell>
  );
}
