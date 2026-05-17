"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { EmbajadorSidebar } from "../EmbajadorSidebar";
import { EmbajadorPageHeader } from "../EmbajadorPageHeader";
import {
  convertAmbassadorLead,
  createAmbassadorLeadActivity,
  patchAmbassadorLead,
  updateAmbassadorLeadStatus,
  useAmbassadorLeads,
  useAmbassadorProfile,
  type ApiLead,
} from "../useAmbassadorApi";
import { createLead } from "@/lib/api/ambassador/leadsApi";
const prospectLeadSources = ["Visita", "Redes", "Referido", "Evento"] as const;
type LeadSource = (typeof prospectLeadSources)[number];

const prospectPipelineStages = [
  "Nuevo",
  "Contactado",
  "Interesado",
  "Presentación agendada",
  "En onboarding",
  "Activo",
  "Perdido",
] as const;
type ProspectStage = (typeof prospectPipelineStages)[number];
type Prospect = {
  id: string;
  businessName: string;
  category: string;
  city: string;
  contactName: string;
  phone: string;
  source: LeadSource;
  currentStage: ProspectStage;
  createdAt: string;
  nextAction: string;
  nextActionDate: string;
  status: "Activo" | "Perdido";
  ambassadorNotes: string;
  actionHistory: Array<{
    id: string;
    title: string;
    happenedAt: string;
    summary: string;
  }>;
};

type ProspectFormState = {
  businessName: string;
  category: string;
  city: string;
  contactName: string;
  phone: string;
  source: LeadSource;
  notes: string;
};

const buildDefaultFormState = (): ProspectFormState => ({
  businessName: "",
  category: "",
  city: "",
  contactName: "",
  phone: "",
  source: prospectLeadSources[0],
  notes: "",
});

const stageTone: Record<ProspectStage, string> = {
  Nuevo: "border-slate-200/15 bg-slate-100/10 text-slate-100",
  Contactado: "border-cyan-200/30 bg-cyan-300/12 text-cyan-50",
  Interesado: "border-sky-200/30 bg-sky-300/12 text-sky-50",
  "Presentación agendada": "border-violet-200/30 bg-violet-300/12 text-violet-50",
  "En onboarding": "border-amber-200/30 bg-amber-300/12 text-amber-50",
  Activo: "border-emerald-200/30 bg-emerald-300/12 text-emerald-50",
  Perdido: "border-rose-200/30 bg-rose-300/12 text-rose-50",
};

const sourceTone: Record<LeadSource, string> = {
  Visita: "border-cyan-100/18 bg-white/5 text-cyan-100/80",
  Redes: "border-fuchsia-200/25 bg-fuchsia-300/10 text-fuchsia-50",
  Referido: "border-emerald-200/25 bg-emerald-300/10 text-emerald-50",
  Evento: "border-amber-200/25 bg-amber-300/10 text-amber-50",
};

const statusTone = (status: Prospect["status"]) => {
  return status === "Activo"
    ? "border-emerald-200/30 bg-emerald-300/12 text-emerald-50"
    : "border-rose-200/30 bg-rose-300/12 text-rose-50";
};

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const normalizeLeadSource = (source?: string | null): LeadSource => {
  const normalizedSource = source?.trim().toLowerCase();
  return prospectLeadSources.find((item) => item.toLowerCase() === normalizedSource) ?? "Referido";
};

const normalizeLeadStage = (status?: string | null): ProspectStage => {
  const normalizedStatus = status?.trim().toUpperCase();

  if (normalizedStatus?.includes("CONTACT")) return "Contactado";
  if (normalizedStatus?.includes("INTERES")) return "Interesado";
  if (normalizedStatus?.includes("DEMO")) return "Presentación agendada";
  if (normalizedStatus?.includes("ONBOARD")) return "En onboarding";
  if (normalizedStatus?.includes("ACTIVE") || normalizedStatus?.includes("ACTIVO")) return "Activo";
  if (normalizedStatus?.includes("LOST") || normalizedStatus?.includes("PERD")) return "Perdido";

  return "Nuevo";
};

const normalizeLeadStatus = (status?: string | null): Prospect["status"] => {
  const normalizedStatus = status?.trim().toUpperCase();
  return normalizedStatus?.includes("LOST") || normalizedStatus?.includes("PERD") ? "Perdido" : "Activo";
};

const formatApiDate = (date?: string | null) => {
  if (!date) return formatDisplayDate(new Date());

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return formatDisplayDate(parsedDate);
};

const mapLeadToProspect = (lead: ApiLead, localDetails?: Partial<Prospect>): Prospect => {
  const createdAt = localDetails?.createdAt ?? formatApiDate(lead.fechaCreacion ?? lead.fechaUltimoContacto);
  const currentStage = normalizeLeadStage(lead.estado);
  const actionHistory =
    lead.historialAcciones?.map((entry) => ({
      id: entry.id,
      title: entry.tipo || "Actividad registrada",
      happenedAt: formatApiDate(entry.fecha),
      summary: entry.nota,
    })) ?? [];

  return {
    id: lead.id,
    businessName: lead.nombre,
    category: lead.tipo || "Sin categoria",
    city: localDetails?.city ?? lead.ciudad ?? lead.pais ?? "Sin ciudad registrada",
    contactName: localDetails?.contactName ?? lead.contacto ?? "Sin dato en API",
    phone: localDetails?.phone ?? lead.telefono ?? "Sin dato en API",
    source: localDetails?.source ?? normalizeLeadSource(lead.fuente),
    currentStage,
    createdAt,
    nextAction: localDetails?.nextAction ?? lead.proximaAccion ?? "Seguimiento pendiente por definir",
    nextActionDate: localDetails?.nextActionDate ?? formatApiDate(lead.fechaUltimoContacto),
    status: normalizeLeadStatus(lead.estado),
    ambassadorNotes:
      localDetails?.ambassadorNotes ??
      lead.notas ??
      "Sin notas registradas para este lead.",
    actionHistory:
      localDetails?.actionHistory ??
      (actionHistory.length > 0
        ? actionHistory
        : [
            {
              id: `${lead.id}-api`,
              title: "Lead cargado desde backend",
              happenedAt: createdAt,
              summary: `Estado backend: ${lead.estado || currentStage}.`,
            },
          ]),
  };
};

export default function EmbajadorProspectosPage() {
  const { data: profile } = useAmbassadorProfile();
  const { data: apiLeads, loading: leadsLoading, error: leadsError, refetch: refetchLeads } = useAmbassadorLeads();
  const [localLeadDetails, setLocalLeadDetails] = useState<Record<string, Partial<Prospect>>>({});
  const [selectedProspectId, setSelectedProspectId] = useState("");
  const [formState, setFormState] = useState<ProspectFormState>(buildDefaultFormState);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [runningAction, setRunningAction] = useState<string | null>(null);

  const prospects = useMemo(() => {
    const localProspects = Object.values(localLeadDetails).filter(
      (prospect): prospect is Prospect => typeof prospect.id === "string" && typeof prospect.businessName === "string",
    );

    if (!apiLeads?.length) return localProspects;
    const apiProspects = apiLeads.map((lead) => mapLeadToProspect(lead, localLeadDetails[lead.id]));
    const apiProspectIds = new Set(apiProspects.map((prospect) => prospect.id));
    const optimisticProspects = localProspects.filter((prospect) => !apiProspectIds.has(prospect.id));

    return [...optimisticProspects, ...apiProspects];
  }, [apiLeads, localLeadDetails]);

  const selectedProspect = useMemo(
    () => prospects.find((prospect) => prospect.id === selectedProspectId) ?? prospects[0] ?? null,
    [prospects, selectedProspectId],
  );

  useEffect(() => {
    if (prospects.length === 0) return;
    if (prospects.some((prospect) => prospect.id === selectedProspectId)) return;
    setSelectedProspectId(prospects[0].id);
  }, [prospects, selectedProspectId]);

  const pipelineSummary = useMemo(() => {
    const activeCount = prospects.filter((prospect) => prospect.status === "Activo").length;
    const lostCount = prospects.filter((prospect) => prospect.status === "Perdido").length;
    const warmCount = prospects.filter((prospect) =>
      ["Interesado", "Presentación agendada", "En onboarding"].includes(prospect.currentStage),
    ).length;
    const onboardingCount = prospects.filter((prospect) => prospect.currentStage === "En onboarding").length;

    return [
      { label: "Prospectos totales", value: `${prospects.length}`, helper: "Captados por tu red local" },
      { label: "Pipeline activo", value: `${activeCount}`, helper: "Leads con seguimiento abierto" },
      { label: "Calientes", value: `${warmCount}`, helper: "Interes, presentación u onboarding" },
      { label: "En onboarding", value: `${onboardingCount}`, helper: "Listos para activacion" },
      { label: "Perdidos", value: `${lostCount}`, helper: "Para reactivar luego" },
    ];
  }, [prospects]);

  const handleCreateProspect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);

    const businessName = formState.businessName.trim();
    const category = formState.category.trim();
    const city = formState.city.trim();
    const contactName = formState.contactName.trim();
    const phone = formState.phone.trim();

    if (!businessName || !category || !city || !contactName || !phone) {
      return;
    }

    const now = new Date();
    const createdAt = formatDisplayDate(now);
    const nextActionDate = formatDisplayDate(addDays(now, 2));
    const newProspect: Prospect = {
      id: `pros-${Date.now()}`,
      businessName,
      category,
      city,
      contactName,
      phone,
      source: formState.source,
      currentStage: "Nuevo",
      createdAt,
      nextAction: "Primer contacto por WhatsApp",
      nextActionDate,
      status: "Activo",
      ambassadorNotes: formState.notes.trim() || "Pendiente registrar notas adicionales del embajador.",
      actionHistory: [
        {
          id: `hist-${Date.now()}`,
          title: "Prospecto creado manualmente",
          happenedAt: createdAt,
          summary: `Lead incorporado desde ${formState.source.toLowerCase()} para seguimiento comercial inicial.`,
        },
      ],
    };

    setCreating(true);

    try {
      const savedLead = await createLead({
        nombre: businessName,
        tipo: category,
        contacto: contactName,
        telefono: phone,
        ciudad: city,
        pais: profile?.pais,
        notas: formState.notes.trim(),
        proximaAccion: "Primer contacto por WhatsApp",
        fuente: formState.source,
      });
      const savedLeadId = savedLead.id ?? newProspect.id;

      setLocalLeadDetails((currentDetails) => ({
        ...currentDetails,
        [savedLeadId]: {
          ...newProspect,
          id: savedLeadId,
        },
      }));
      setSelectedProspectId(savedLeadId);
      setFormState(buildDefaultFormState());
      await refetchLeads();
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "No se pudo crear el prospecto.");
    } finally {
      setCreating(false);
    }
  };

  const runLeadAction = async (action: "contact" | "activity" | "convert") => {
    if (!selectedProspect) return;

    setActionFeedback(null);
    setRunningAction(action);

    try {
      if (action === "contact") {
        await updateAmbassadorLeadStatus(selectedProspect.id, "contactado");
        await patchAmbassadorLead(selectedProspect.id, {
          proximaAccion: "Enviar propuesta comercial personalizada",
          fechaUltimoContacto: new Date().toISOString(),
        });
        setActionFeedback("Lead marcado como contactado.");
      }

      if (action === "activity") {
        await createAmbassadorLeadActivity(selectedProspect.id, {
          tipo: "seguimiento",
          nota: selectedProspect.nextAction || "Seguimiento registrado desde el panel de embajador.",
          fecha: new Date().toISOString(),
        });
        setActionFeedback("Actividad registrada.");
      }

      if (action === "convert") {
        const result = await convertAmbassadorLead(selectedProspect.id);
        setActionFeedback(result.mensaje);
      }

      await refetchLeads();
    } catch (error) {
      setActionFeedback(error instanceof Error ? error.message : "No se pudo completar la acción.");
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <div className="flex-1 pb-10">
      <EmbajadorPageHeader
        profile={profile}
        statusMessage="Seguimiento de prospectos comerciales"
      />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="prospectos" profile={profile} />

        <section className="space-y-6">
          <section className="rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
            <p className="tech-mono text-xs text-cyan-200/75">PIPELINE DE PROSPECTOS</p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-bold text-cyan-50 md:text-4xl">Prospectos captados por tu gestion</h1>
                <p className="mt-3 text-sm leading-7 text-cyan-100/80">
                  Administra negocios potenciales, registra cada contacto y manten visible la siguiente accion para
                  convertirlos en cuentas activas dentro de TechMarket.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 px-4 py-3 text-sm text-cyan-100/82">
                Responsable actual: <strong className="text-cyan-50">{profile ? `${profile.nombre} ${profile.apellido}` : "..."}</strong>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {pipelineSummary.map((item) => (
                <article key={item.label} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/65">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-cyan-50">{item.value}</p>
                  <p className="mt-1 text-xs text-cyan-100/75">{item.helper}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="tech-mono text-xs text-cyan-200/75">LISTA DE PROSPECTOS</p>
                <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Embudo visible de punta a punta</h2>
              </div>
              <p className="max-w-xl text-sm text-cyan-100/78">
                Selecciona una fila para abrir su detalle completo, revisar historial y ver la proxima accion sugerida.
              </p>
            </div>

            <div className="mt-5 overflow-x-auto">
              {leadsError ? (
                <div className="mb-4 rounded-2xl border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  No se pudieron cargar los leads reales: {leadsError}
                </div>
              ) : null}
              {leadsLoading ? (
                <div className="mb-4 rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-3 text-sm text-cyan-100/76">
                  Cargando prospectos desde backend...
                </div>
              ) : null}
              <table className="min-w-[1180px] w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/60">
                    <th className="px-3 py-2 font-medium">Negocio</th>
                    <th className="px-3 py-2 font-medium">Categoria</th>
                    <th className="px-3 py-2 font-medium">Ciudad</th>
                    <th className="px-3 py-2 font-medium">Contacto</th>
                    <th className="px-3 py-2 font-medium">Telefono</th>
                    <th className="px-3 py-2 font-medium">Fuente</th>
                    <th className="px-3 py-2 font-medium">Etapa actual</th>
                    <th className="px-3 py-2 font-medium">Fecha de creacion</th>
                    <th className="px-3 py-2 font-medium">Proxima accion</th>
                    <th className="px-3 py-2 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((prospect) => {
                    const isSelected = selectedProspect?.id === prospect.id;

                    return (
                      <tr
                        key={prospect.id}
                        onClick={() => setSelectedProspectId(prospect.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedProspectId(prospect.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={`cursor-pointer rounded-2xl transition ${
                          isSelected
                            ? "bg-cyan-300/10"
                            : "bg-white/[0.03] hover:bg-cyan-300/[0.06]"
                        }`}
                      >
                        <td className="rounded-l-2xl border-y border-l border-cyan-100/10 px-3 py-3 align-top">
                          <div>
                            <p className="text-sm font-semibold text-cyan-50">{prospect.businessName}</p>
                            <p className="mt-1 text-xs text-cyan-100/72">ID {prospect.id}</p>
                          </div>
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3 text-sm text-cyan-100/82">
                          {prospect.category}
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3 text-sm text-cyan-100/82">
                          {prospect.city}
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3 text-sm text-cyan-100/82">
                          {prospect.contactName}
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3 text-sm text-cyan-100/82">
                          {prospect.phone}
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${sourceTone[prospect.source]}`}>
                            {prospect.source}
                          </span>
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${stageTone[prospect.currentStage]}`}>
                            {prospect.currentStage}
                          </span>
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3 text-sm text-cyan-100/82">
                          {prospect.createdAt}
                        </td>
                        <td className="border-y border-cyan-100/10 px-3 py-3">
                          <p className="text-sm text-cyan-50">{prospect.nextAction}</p>
                          <p className="mt-1 text-xs text-cyan-100/68">{prospect.nextActionDate}</p>
                        </td>
                        <td className="rounded-r-2xl border-y border-r border-cyan-100/10 px-3 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${statusTone(prospect.status)}`}>
                            {prospect.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!prospects.length && !leadsLoading ? (
                <div className="rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-6 text-sm text-cyan-100/76">
                  No hay prospectos registrados para este embajador.
                </div>
              ) : null}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
              <p className="tech-mono text-xs text-cyan-200/75">CREAR PROSPECTO</p>
              <h2 className="mt-2 text-2xl font-semibold text-cyan-50">Registrar nuevo lead</h2>
              <p className="mt-2 text-sm text-cyan-100/80">
                Captura rapidamente la informacion clave para iniciar el seguimiento y no perder contexto comercial.
              </p>

              <form onSubmit={handleCreateProspect} className="mt-5 grid gap-4">
                <div>
                  <label className="auth-label" htmlFor="prospect-business-name">
                    Nombre del negocio
                  </label>
                  <input
                    id="prospect-business-name"
                    className="auth-input"
                    value={formState.businessName}
                    onChange={(event) =>
                      setFormState((currentState) => ({ ...currentState, businessName: event.target.value }))
                    }
                    placeholder="Nombre del negocio"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="auth-label" htmlFor="prospect-category">
                      Categoria
                    </label>
                    <input
                      id="prospect-category"
                      className="auth-input"
                      value={formState.category}
                      onChange={(event) =>
                        setFormState((currentState) => ({ ...currentState, category: event.target.value }))
                      }
                      placeholder="Servicio tecnico, tienda, software..."
                    />
                  </div>

                  <div>
                    <label className="auth-label" htmlFor="prospect-city">
                      Ciudad
                    </label>
                    <input
                      id="prospect-city"
                      className="auth-input"
                      value={formState.city}
                      onChange={(event) => setFormState((currentState) => ({ ...currentState, city: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="auth-label" htmlFor="prospect-contact-name">
                      Contacto
                    </label>
                    <input
                      id="prospect-contact-name"
                      className="auth-input"
                      value={formState.contactName}
                      onChange={(event) =>
                        setFormState((currentState) => ({ ...currentState, contactName: event.target.value }))
                      }
                      placeholder="Nombre de la persona contacto"
                    />
                  </div>

                  <div>
                    <label className="auth-label" htmlFor="prospect-phone">
                      Telefono / WhatsApp
                    </label>
                    <input
                      id="prospect-phone"
                      className="auth-input"
                      value={formState.phone}
                      onChange={(event) => setFormState((currentState) => ({ ...currentState, phone: event.target.value }))}
                      placeholder="+591 ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-label" htmlFor="prospect-source">
                    Fuente
                  </label>
                  <select
                    id="prospect-source"
                    className="auth-select"
                    value={formState.source}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        source: event.target.value as LeadSource,
                      }))
                    }
                  >
                    {prospectLeadSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="auth-label" htmlFor="prospect-notes">
                    Notas
                  </label>
                  <textarea
                    id="prospect-notes"
                    className="auth-input min-h-[120px] resize-y"
                    value={formState.notes}
                    onChange={(event) => setFormState((currentState) => ({ ...currentState, notes: event.target.value }))}
                    placeholder="Contexto inicial, objeciones, intereses o promesas de seguimiento..."
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-100/10 bg-white/5 p-3">
                  <p className="text-sm text-cyan-100/75">
                    El lead se persiste en backend con ciudad, notas, contacto, telefono, fuente y proxima accion.
                  </p>
                  <button type="submit" disabled={creating} className="tech-button tech-button-primary px-4 py-2 text-sm disabled:opacity-60">
                    {creating ? "Guardando..." : "Guardar prospecto"}
                  </button>
                </div>
                {createError ? (
                  <div className="rounded-2xl border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                    {createError}
                  </div>
                ) : null}
              </form>
            </article>

            <article className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
              <p className="tech-mono text-xs text-cyan-200/75">DETALLE</p>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-cyan-50">
                    {selectedProspect ? selectedProspect.businessName : "Sin prospecto seleccionado"}
                  </h2>
                  <p className="mt-2 text-sm text-cyan-100/80">
                    {selectedProspect
                      ? `${selectedProspect.category} · ${selectedProspect.city}`
                      : "Selecciona un prospecto de la lista para ver su informacion general."}
                  </p>
                </div>

                {selectedProspect ? (
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${stageTone[selectedProspect.currentStage]}`}>
                      {selectedProspect.currentStage}
                    </span>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusTone(selectedProspect.status)}`}>
                      {selectedProspect.status}
                    </span>
                  </div>
                ) : null}
              </div>

              {selectedProspect ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void runLeadAction("contact")}
                    disabled={runningAction !== null}
                    className="rounded-xl border border-cyan-200/25 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 disabled:opacity-60"
                  >
                    {runningAction === "contact" ? "Actualizando..." : "Marcar contactado"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runLeadAction("activity")}
                    disabled={runningAction !== null}
                    className="rounded-xl border border-cyan-200/25 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50 disabled:opacity-60"
                  >
                    {runningAction === "activity" ? "Registrando..." : "Registrar actividad"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runLeadAction("convert")}
                    disabled={runningAction !== null}
                    className="rounded-xl border border-emerald-200/25 bg-emerald-300/12 px-3 py-2 text-xs font-semibold text-emerald-50 disabled:opacity-60"
                  >
                    {runningAction === "convert" ? "Convirtiendo..." : "Convertir a referido"}
                  </button>
                </div>
              ) : null}

              {actionFeedback ? (
                <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-white/5 px-4 py-3 text-sm text-cyan-100/80">
                  {actionFeedback}
                </div>
              ) : null}

              {selectedProspect ? (
                <>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <section className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold text-cyan-50">Info general</h3>
                      <div className="mt-4 grid gap-3 text-sm text-cyan-100/82">
                        <div className="flex items-start justify-between gap-3">
                          <span>Contacto</span>
                          <strong className="text-right text-cyan-50">{selectedProspect.contactName}</strong>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <span>Telefono / WhatsApp</span>
                          <strong className="text-right text-cyan-50">{selectedProspect.phone}</strong>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <span>Fuente del lead</span>
                          <strong className="text-right text-cyan-50">{selectedProspect.source}</strong>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <span>Fecha de creacion</span>
                          <strong className="text-right text-cyan-50">{selectedProspect.createdAt}</strong>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold text-cyan-50">Siguiente movimiento</h3>
                      <p className="mt-3 text-sm text-cyan-100/82">{selectedProspect.nextAction}</p>
                      <div className="mt-4 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Fecha proxima accion</p>
                        <p className="mt-2 text-lg font-semibold text-cyan-50">{selectedProspect.nextActionDate}</p>
                      </div>
                    </section>
                  </div>

                  <section className="mt-4 rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                    <h3 className="text-lg font-semibold text-cyan-50">Etapas</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {prospectPipelineStages.map((stage) => {
                        const currentIndex = prospectPipelineStages.indexOf(selectedProspect.currentStage);
                        const stageIndex = prospectPipelineStages.indexOf(stage);
                        const isCurrent = stage === selectedProspect.currentStage;
                        const isReached = stageIndex < currentIndex;

                        return (
                          <span
                            key={stage}
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${
                              isCurrent
                                ? stageTone[stage]
                                : isReached
                                  ? "border-cyan-100/18 bg-cyan-300/10 text-cyan-50"
                                  : "border-cyan-100/10 bg-slate-950/35 text-cyan-100/70"
                            }`}
                          >
                            {stage}
                          </span>
                        );
                      })}
                    </div>
                  </section>

                  <section className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold text-cyan-50">Historial de acciones</h3>
                      <div className="mt-4 space-y-3">
                        {selectedProspect.actionHistory.map((entry) => (
                          <article key={entry.id} className="rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-cyan-50">{entry.title}</p>
                              <span className="text-xs text-cyan-100/68">{entry.happenedAt}</span>
                            </div>
                            <p className="mt-2 text-sm text-cyan-100/78">{entry.summary}</p>
                          </article>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                      <h3 className="text-lg font-semibold text-cyan-50">Notas del embajador</h3>
                      <p className="mt-4 text-sm leading-7 text-cyan-100/82">{selectedProspect.ambassadorNotes}</p>

                      <div className="mt-5 rounded-2xl border border-cyan-100/10 bg-slate-950/35 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Etapa actual</p>
                        <p className="mt-2 text-lg font-semibold text-cyan-50">{selectedProspect.currentStage}</p>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-cyan-100/15 bg-white/5 p-5 text-sm text-cyan-100/76">
                  Aun no hay prospectos registrados.
                </div>
              )}
            </article>
          </section>
        </section>
      </main>
    </div>
  );
}
