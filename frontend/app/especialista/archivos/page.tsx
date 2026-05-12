"use client";

import { FormEvent, useState } from "react";
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

type SpecialistFileItem = ReturnType<typeof useSpecialistChatFilesData>["files"][number];

function isValidFileUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function EspecialistaArchivosPage() {
  const {
    files,
    actionError,
    actionLoading,
    actionSuccess,
    filesError,
    hasLoadedFiles,
    isLoadingFiles,
    uploadFile,
    deleteFile,
  } = useSpecialistChatFilesData();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSizeAmount, setFileSizeAmount] = useState("");
  const [fileSizeUnit, setFileSizeUnit] = useState("MB");
  const [fileUrl, setFileUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<SpecialistFileItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);

  function resetForm() {
    setFileName("");
    setFileType("");
    setFileSizeAmount("");
    setFileSizeUnit("MB");
    setFileUrl("");
    setFormError(null);
  }

  function closeModal() {
    if (actionLoading) {
      return;
    }

    resetForm();
    setIsModalOpen(false);
  }

  async function handleUploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nombre = fileName.trim();
    const url = fileUrl.trim();
    const tipo = fileType.trim();
    const cantidadTamano = fileSizeAmount.trim();
    const unidadTamano = fileSizeUnit.trim();

    if (!nombre || !tipo || !cantidadTamano || !url) {
      setFormError("Completa nombre, tipo, tamano y URL del archivo.");
      return;
    }

    if (!isValidFileUrl(url)) {
      setFormError("Ingresa una URL válida del archivo.");
      return;
    }

    if (Number(cantidadTamano) < 0) {
      setFormError("El tamano del archivo no puede ser negativo.");
      return;
    }

    const tamano = `${cantidadTamano} ${unidadTamano}`;

    setFormError(null);
    try {
      await uploadFile({
        nombre,
        tipo,
        tamano,
        url,
      });
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo registrar el archivo.");
    }
  }

  function closeDeleteModal() {
    if (actionLoading) {
      return;
    }

    setFileToDelete(null);
    setDeleteError(null);
  }

  async function handleDeleteFile() {
    if (!fileToDelete) return;

    setFormError(null);
    setDeleteError(null);
    setDeleteSuccessMessage(null);
    setDeletingFileId(fileToDelete.id);

    try {
      await deleteFile(fileToDelete.id);
      setDeleteSuccessMessage("Archivo eliminado correctamente.");
      setFileToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar el archivo.");
    } finally {
      setDeletingFileId(null);
    }
  }

  return (
    <SpecialistShell sectionLabel="Archivos" statusMessage="Archivos y evidencias del especialista">
      <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
        <p className="tech-mono text-xs text-cyan-200/75">ARCHIVOS DEL ESPECIALISTA</p>
        <h1 className="mt-3 text-4xl font-bold text-cyan-50 md:text-5xl">Documentos y evidencias</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-100/80">
          Consulta, registra y elimina archivos asociados a clientes, proyectos y trabajos tecnicos.
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
          <p className="mt-1 text-xs text-cyan-100/70">Datos reales</p>
        </article>
        <article className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Modo</p>
          <p className="mt-2 text-sm font-semibold text-cyan-50">Conectado</p>
          <p className="mt-1 text-xs text-cyan-100/70">POST y DELETE reales</p>
        </article>
      </section>

      <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-white">Listado de archivos</h2>
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="rounded-full border border-cyan-300/35 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Registrar archivo
          </button>
        </div>
        {(deleteSuccessMessage || actionSuccess) && !isModalOpen ? (
          <p className="mt-3 text-sm text-emerald-200">{deleteSuccessMessage ?? actionSuccess}</p>
        ) : null}

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {isLoadingFiles && !hasLoadedFiles ? (
            <article className="rounded-3xl border border-cyan-100/10 bg-white/5 p-5 text-sm text-cyan-100/75 lg:col-span-2">
              Cargando archivos...
            </article>
          ) : null}
          {filesError && !isLoadingFiles ? (
            <article className="rounded-3xl border border-amber-300/25 bg-amber-300/10 p-5 text-sm text-amber-100 lg:col-span-2">
              No se pudieron cargar los archivos.
            </article>
          ) : null}
          {hasLoadedFiles && !isLoadingFiles && !filesError && files.length === 0 ? (
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
                  <p className="mt-2 text-sm text-cyan-100/85">{file.uploadedAt || "Fecha no disponible"}</p>
                </article>
              </div>

              <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/65">Origen</p>
                <p className="mt-2 text-sm leading-6 text-cyan-100/85">Repositorio del especialista</p>
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
                  onClick={() => {
                    setFileToDelete(file);
                    setDeleteError(null);
                    setDeleteSuccessMessage(null);
                  }}
                  disabled={actionLoading}
                  className="rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingFileId === file.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <section className="w-full max-w-2xl rounded-3xl border border-cyan-100/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">REGISTRAR ARCHIVO</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Nuevo archivo</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={actionLoading}
                className="rounded-full border border-cyan-100/10 bg-white/5 px-3 py-1 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleUploadFile} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-cyan-100/85 sm:col-span-2">
                  <span>Nombre del archivo</span>
                  <input
                    value={fileName}
                    onChange={(event) => setFileName(event.target.value)}
                    placeholder="Nombre del archivo"
                    disabled={actionLoading}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Tipo</span>
                  <select
                    value={fileType}
                    onChange={(event) => setFileType(event.target.value)}
                    disabled={actionLoading}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  >
                    <option value="">Selecciona el tipo de archivo</option>
                    <option value="PDF">PDF</option>
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="ZIP">ZIP</option>
                    <option value="TXT">TXT</option>
                    <option value="Otro">Otro</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85">
                  <span>Tamano</span>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={fileSizeAmount}
                      onChange={(event) => setFileSizeAmount(event.target.value)}
                      placeholder="Ej. 860"
                      disabled={actionLoading}
                      className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    />
                    <select
                      value={fileSizeUnit}
                      onChange={(event) => setFileSizeUnit(event.target.value)}
                      disabled={actionLoading}
                      className="rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                      <option value="GB">GB</option>
                    </select>
                  </div>
                </label>

                <label className="space-y-2 text-sm text-cyan-100/85 sm:col-span-2">
                  <span>URL del archivo</span>
                  <input
                    value={fileUrl}
                    onChange={(event) => setFileUrl(event.target.value)}
                    placeholder="URL del archivo"
                    disabled={actionLoading}
                    className="w-full rounded-2xl border border-cyan-100/10 bg-slate-900 px-4 py-3 text-sm text-cyan-50 placeholder:text-cyan-100/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                  />
                </label>
              </div>

              {formError || actionError ? (
                <p className="text-sm text-rose-200">{formError ?? actionError}</p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-3 border-t border-cyan-100/10 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="rounded-full border border-cyan-100/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-full border border-cyan-300/35 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading && !deletingFileId ? "Guardando..." : "Guardar archivo"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {fileToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm" onClick={(event) => event.target === event.currentTarget && closeDeleteModal()}>
          <section className="w-full max-w-lg rounded-3xl border border-cyan-100/20 bg-slate-950 p-6 shadow-2xl shadow-slate-950/70">
            <p className="tech-mono text-xs text-cyan-200/75">CONFIRMACION</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Eliminar archivo</h2>
            <p className="mt-3 text-sm leading-6 text-cyan-100/80">¿Seguro que deseas eliminar este archivo?</p>
            <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/65">Archivo seleccionado</p>
              <p className="mt-2 break-all text-base font-semibold text-cyan-50">{fileToDelete.name}</p>
            </div>
            {deleteError ? <p className="mt-4 rounded-2xl border border-rose-300/25 bg-rose-400/10 p-3 text-sm text-rose-100">{deleteError}</p> : null}
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-cyan-100/10 pt-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={actionLoading}
                className="rounded-full border border-cyan-100/10 bg-white/5 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteFile}
                disabled={actionLoading}
                className="rounded-full border border-rose-300/30 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingFileId === fileToDelete.id ? "Eliminando..." : "Eliminar archivo"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </SpecialistShell>
  );
}
