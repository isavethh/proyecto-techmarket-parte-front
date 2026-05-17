"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { EmbajadorSidebar } from "../EmbajadorSidebar";
import { EmbajadorPageHeader } from "../EmbajadorPageHeader";
import {
  createAmbassadorNetworkInvitation,
  deleteAmbassadorNetworkInvitation,
  useAmbassadorNetwork,
  useAmbassadorNetworkInvitations,
  useAmbassadorNetworkRanking,
  useAmbassadorNetworkTree,
  useAmbassadorProfile,
} from "../useAmbassadorApi";
import { LiveApiBadge } from "../HardcodedBadge";

export default function EmbajadorEmbajadoresReferidosPage() {
  const { data: profile } = useAmbassadorProfile();
  const { data: networkTree } = useAmbassadorNetworkTree();
  const { data: network } = useAmbassadorNetwork();
  const { data: invitations, refetch: refetchInvitations } = useAmbassadorNetworkInvitations();
  const { data: ranking } = useAmbassadorNetworkRanking();
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);
  const [submittingInvite, setSubmittingInvite] = useState(false);

  const subEmbajadores = networkTree?.subEmbajadores ?? [];
  const totalDirectos = network?.length ?? subEmbajadores.length;
  const myRanking = useMemo(() => ranking?.find((item) => item.id === profile?.id) ?? ranking?.[0] ?? null, [profile?.id, ranking]);

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = inviteEmail.trim();
    const nombre = inviteName.trim();

    if (!email || !nombre) {
      setInviteFeedback("Completa nombre y correo.");
      return;
    }

    setSubmittingInvite(true);
    setInviteFeedback(null);

    try {
      await createAmbassadorNetworkInvitation({ email, nombre, telefono: invitePhone.trim() || undefined });
      setInviteName("");
      setInviteEmail("");
      setInvitePhone("");
      setInviteFeedback("Invitación registrada.");
      await refetchInvitations();
    } catch (error) {
      setInviteFeedback(error instanceof Error ? error.message : "No se pudo crear la invitación.");
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      await deleteAmbassadorNetworkInvitation(invitationId);
      await refetchInvitations();
    } catch (error) {
      setInviteFeedback(error instanceof Error ? error.message : "No se pudo cancelar la invitación.");
    }
  };

  return (
    <div className="flex-1 pb-10">
      <EmbajadorPageHeader profile={profile} />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-6">
        <EmbajadorSidebar activeSection="embajadores" profile={profile} />

        <section className="space-y-6">
          <section id="embajadores-referidos" className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Embajadores referidos por ti</h2>
              <LiveApiBadge label="API — /network/tree" />
            </div>

            <p className="mt-3 text-sm text-cyan-100/80">
              Tu posicion es Raíz. Tus sub-embajadores se organizan en niveles relativos a ti.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">Directos</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{totalDirectos}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">Ranking</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">#{myRanking?.posicion ?? "-"}</p>
              </article>
              <article className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">Comisiones ranking</p>
                <p className="mt-2 text-2xl font-bold text-cyan-50">{myRanking?.comisiones ?? "Bs 0"}</p>
              </article>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {subEmbajadores.length === 0 && (
                <p className="text-sm text-cyan-100/60 col-span-full">Aun no tienes sub-embajadores en tu red.</p>
              )}
              {subEmbajadores.map((amb) => (
                <article key={amb.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-cyan-50">{amb.nombre}</p>
                    <span className="rounded-full border border-cyan-100/18 bg-cyan-300/12 px-2.5 py-1 text-[11px] text-cyan-50">
                      {amb.nivel}
                    </span>
                  </div>

                  {amb.subEmbajadores.length > 0 && (
                    <div className="mt-3 ml-3 border-l border-cyan-100/10 pl-3 space-y-2">
                      {amb.subEmbajadores.map((sub) => (
                        <div key={sub.id} className="text-xs text-cyan-100/70">
                          {sub.nombre} — {sub.nivel}
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-100/10 bg-slate-950/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Invitaciones</h2>
              <LiveApiBadge label="API — /network/invitations" />
            </div>

            <form onSubmit={handleInvite} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_0.8fr_auto]">
              <input
                className="auth-input"
                value={inviteName}
                onChange={(event) => setInviteName(event.target.value)}
                placeholder="Nombre"
              />
              <input
                className="auth-input"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="correo@ejemplo.com"
              />
              <input
                className="auth-input"
                value={invitePhone}
                onChange={(event) => setInvitePhone(event.target.value)}
                placeholder="Teléfono"
              />
              <button type="submit" disabled={submittingInvite} className="tech-button tech-button-primary px-4 py-2 text-sm disabled:opacity-60">
                {submittingInvite ? "Enviando..." : "Invitar"}
              </button>
            </form>

            {inviteFeedback ? <p className="mt-3 text-sm text-cyan-100/80">{inviteFeedback}</p> : null}

            <div className="mt-4 grid gap-3">
              {(invitations ?? []).map((invitation) => (
                <article key={invitation.id} className="rounded-2xl border border-cyan-100/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">{invitation.email}</p>
                      <p className="mt-1 text-xs text-cyan-100/70">{invitation.estado}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleDeleteInvitation(invitation.id)}
                      className="rounded-xl border border-rose-200/25 bg-rose-300/10 px-3 py-2 text-xs font-semibold text-rose-100"
                    >
                      Cancelar
                    </button>
                  </div>
                </article>
              ))}
              {(invitations ?? []).length === 0 ? <p className="text-sm text-cyan-100/60">No hay invitaciones activas.</p> : null}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
